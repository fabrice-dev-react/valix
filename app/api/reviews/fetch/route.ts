import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";
import RawReview from "@/models/RawReview";
import ReviewGroup from "@/models/ReviewGroup";
import mongoose from "mongoose";
import {
  scrapeReviewsWithFallback,
} from "@/lib/reviews/realScraper";
import {
  filterComplaintsFromReviews,
  groupComplaintsWithAI,
} from "@/lib/reviews/aiProcessor";

export const maxDuration = 90;

export async function POST() {
  try {
    let user;
    try {
      user = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to access this resource");
    }

    await connectDB();

    const userData = await User.findById(user._id);
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const competitors = [
      ...(userData.competitors || []).map((c: { name?: string; website?: string }) => ({
        name: c.name || "",
        domain: c.website || c.name?.toLowerCase().replace(/\s+/g, "") + ".com",
      })),
      ...(userData.customCompetitors || []).map((c: { name?: string; url?: string; domain?: string }) => ({
        name: c.name || "",
        domain: c.url || c.domain || "",
      })),
    ].filter((c: { name: string }) => c.name && c.name !== "undefined");

    if (competitors.length === 0) {
      return NextResponse.json(
        { error: "No competitors added. Please add competitors first." },
        { status: 400 }
      );
    }

    const enabledPlatforms = userData.platforms || [];
    if (enabledPlatforms.length === 0) {
      return NextResponse.json(
        { error: "No platforms enabled. Please enable platforms first." },
        { status: 400 }
      );
    }

    // Step 1: Scrape reviews from real platforms (falls back to mock if Apify not configured)
    const allReviews = await scrapeReviewsWithFallback(competitors, enabledPlatforms, 25);

    if (allReviews.length === 0) {
      return NextResponse.json(
        { success: false, totalReviewsFound: 0, clustersCreated: 0, errors: ["No reviews could be generated."] },
        { status: 500 }
      );
    }

    // Step 2: Store raw reviews
    await RawReview.deleteMany({ userId: userData._id });

    const reviewIdMap: Record<string, string> = {};
    const rawReviewDocs = allReviews.map((r) => ({
      userId: userData._id,
      platform: r.platform,
      competitorName: r.competitorName,
      competitorDomain: r.competitorDomain,
      rating: r.rating,
      reviewText: r.reviewText,
      reviewerName: r.reviewerName,
      reviewDate: r.reviewDate,
      sentiment: r.rating <= 3 ? "negative" : r.rating >= 4 ? "positive" : "neutral",
      sentimentScore: (r.rating - 3) / 2,
      extractedIssues: [],
      sourceUrl: r.sourceUrl,
      isVerified: r.isVerified,
      helpfulCount: r.helpfulCount,
      fetchedAt: new Date(),
    }));

    const inserted = await RawReview.insertMany(rawReviewDocs, { ordered: false });
    for (let i = 0; i < allReviews.length; i++) {
      const mongoId = inserted[i]?._id?.toString();
      if (mongoId) reviewIdMap[allReviews[i].id] = mongoId;
    }

    // Step 3: AI filter to complaints
    const complaintReviews = await filterComplaintsFromReviews(allReviews);

    if (complaintReviews.length === 0) {
      return NextResponse.json({
        success: true,
        totalReviewsFound: allReviews.length,
        complaintsFound: 0,
        clustersCreated: 0,
        platformsScraped: enabledPlatforms,
        errors: [],
      });
    }

    // Step 4: AI group complaints
    const groupedComplaints = await groupComplaintsWithAI(complaintReviews, competitors);

    // Map to MongoDB IDs
    const mappedGroups = groupedComplaints.map(group => ({
      ...group,
      reviewIds: group.reviewIds.map(id => reviewIdMap[id]).filter(Boolean),
    }));

    // Step 5: Save grouped complaints
    await ReviewGroup.deleteMany({ userId: userData._id });

    for (const group of mappedGroups) {
      await ReviewGroup.create({
        userId: userData._id,
        platform: group.platform,
        issueType: group.label,
        summary: group.summary,
        sentiment: group.sentiment,
        count: group.reviewIds.length,
        reviews: group.reviewIds.map(id => new mongoose.Types.ObjectId(id)),
        reviewIds: group.reviewIds,
        clusterKeywords: [],
        aiAdvice: group.aiAdvice,
        priority: group.priority,
        avgRating: 2.5,
        sentimentBreakdown: { positive: 0, negative: group.reviewIds.length, neutral: 0 },
        sourceReliability: 1,
        recencyScore: 0.5,
        importanceScore: group.priority === "High" ? 0.8 : group.priority === "Medium" ? 0.5 : 0.3,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      totalReviewsFound: allReviews.length,
      complaintsFound: complaintReviews.length,
      clustersCreated: mappedGroups.length,
      platformsScraped: enabledPlatforms,
      errors: [],
    });
  } catch (error: unknown) {
    console.error("Review fetch error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
