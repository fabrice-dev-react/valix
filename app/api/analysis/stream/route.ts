import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/lib/authHelpers";
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

export const maxDuration = 120;

function sendSSE(data: Record<string, unknown>) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function GET(_request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        try {
          controller.enqueue(encoder.encode(sendSSE(data)));
        } catch (e) {
          console.error("[SSE] Send error:", e);
        }
      };

      const sendError = (message: string) => {
        send({ status: "error", message, progress: 0 });
        controller.close();
      };

      try {
        send({ status: "loading", message: "Connecting to analysis engine...", progress: 5 });

        let user;
        try {
          user = await getAuthenticatedUser();
        } catch {
          sendError("Please log in to continue.");
          return;
        }

        await connectDB();

        const userData = await User.findById(user._id);
        if (!userData) {
          sendError("User not found.");
          return;
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
          sendError("No competitors added. Please add competitors first.");
          return;
        }

        const enabledPlatforms = userData.platforms || [];
        if (enabledPlatforms.length === 0) {
          sendError("No platforms enabled. Please enable platforms first.");
          return;
        }

        send({
          status: "scraping",
          message: `Preparing to analyze ${competitors.length} competitor(s) across ${enabledPlatforms.length} platform(s)...`,
          progress: 10,
        });

        // Step 1: Collect reviews (using mock data based on competitors)
        send({
          status: "scraping",
          message: "Collecting review data from configured platforms...",
          progress: 15,
        });

        const allReviews = await scrapeReviewsWithFallback(competitors, enabledPlatforms, 25);

        send({
          status: "scraping",
          message: `Collected ${allReviews.length} reviews from ${competitors.length} competitors`,
          progress: 25,
          found: allReviews.length,
        });

        if (allReviews.length === 0) {
          sendError("No reviews could be collected. Please check your competitor URLs.");
          return;
        }

        // Step 2: Store raw reviews
        send({ status: "storing", message: "Storing collected reviews...", progress: 40 });

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
          if (mongoId) {
            reviewIdMap[allReviews[i].id] = mongoId;
          }
        }

        send({
          status: "storing",
          message: `Stored ${inserted.length} reviews in database`,
          progress: 50,
        });

        // Step 3: AI filters to keep only complaints
        send({ status: "analyzing", message: "AI filtering reviews to identify customer complaints...", progress: 60 });

        const complaintReviews = await filterComplaintsFromReviews(allReviews);

        send({
          status: "analyzing",
          message: `AI identified ${complaintReviews.length} complaint reviews out of ${allReviews.length}`,
          progress: 70,
          filtered: complaintReviews.length,
        });

        if (complaintReviews.length === 0) {
          send({
            status: "complete",
            message: "Analysis complete - no complaints found in reviews.",
            progress: 100,
            totalReviews: allReviews.length,
            complaintsFound: 0,
            groupsCreated: 0,
          });
          controller.close();
          return;
        }

        // Step 4: AI groups similar complaints
        send({ status: "analyzing", message: "AI grouping similar complaints together...", progress: 80 });

        const groupedComplaints = await groupComplaintsWithAI(complaintReviews, competitors);

        // Map string IDs to MongoDB ObjectIds
        const mappedGroups = groupedComplaints.map(group => ({
          ...group,
          reviewIds: group.reviewIds
            .map(id => reviewIdMap[id])
            .filter(Boolean),
        }));

        send({
          status: "analyzing",
          message: `AI grouped complaints into ${mappedGroups.length} insight categories`,
          progress: 85,
          groupsCreated: mappedGroups.length,
        });

        if (mappedGroups.length === 0) {
          send({
            status: "complete",
            message: "Analysis complete - no complaint patterns found.",
            progress: 100,
            totalReviews: allReviews.length,
            complaintsFound: complaintReviews.length,
            groupsCreated: 0,
          });
          controller.close();
          return;
        }

        // Step 5: Save grouped complaints to database
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

        const highCount = mappedGroups.filter((g) => g.priority === "High").length;
        const mediumCount = mappedGroups.filter((g) => g.priority === "Medium").length;
        const lowCount = mappedGroups.filter((g) => g.priority === "Low").length;

        send({
          status: "complete",
          message: "Analysis complete!",
          progress: 100,
          totalReviews: allReviews.length,
          complaintsFound: complaintReviews.length,
          groupsCreated: groupedComplaints.length,
          highPriority: highCount,
          mediumPriority: mediumCount,
          lowPriority: lowCount,
        });
      } catch (err: unknown) {
        console.error("[SSE Analysis] Error:", err);
        const message = err instanceof Error ? err.message : "Analysis failed";
        send({ status: "error", message });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
