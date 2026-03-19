import { NextResponse } from "next/server";
import ReviewGroup from "@/models/ReviewGroup";
import RawReview from "@/models/RawReview";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";
import { PLATFORM_DISPLAY_NAMES } from "@/lib/reviews/scraper";

export async function GET() {
  try {
    let user;
    try {
      user = await getAuthenticatedUser();
    } catch (err: any) {
      console.error("Auth error:", err.message);
      return unauthorizedResponse("Please log in to access this resource");
    }

    console.log("[Dashboard Stats] User ID:", user._id);
    console.log("[Dashboard Stats] Competitors:", user.competitors?.length || 0);
    console.log("[Dashboard Stats] Custom Competitors:", user.customCompetitors?.length || 0);
    console.log("[Dashboard Stats] Platforms:", user.platforms);

    const competitors = [
      ...(user.competitors || []).map((c: any) => ({ name: c.name, domain: c.website || c.url || c.domain })),
      ...(user.customCompetitors || []).map((c: any) => ({ name: c.name, domain: c.url || c.domain }))
    ];
    
    const totalCompetitors = competitors.length;
    const platformsEnabled = user.platforms?.length || 0;
    const userPlatforms = user.platforms || [];

    const reviewGroups = await ReviewGroup.find({ userId: user._id }).sort({
      importanceScore: -1,
    });

    let totalComplaints = 0;
    let totalReviewsAnalyzed = 0;

    if (reviewGroups.length > 0) {
      totalComplaints = reviewGroups
        .filter((g: any) => g.sentiment === "negative")
        .reduce((acc: number, g: any) => acc + g.count, 0);

      const uniqueReviewIds = new Set<string>();
      for (const group of reviewGroups) {
        const ids = (group as any).reviewIds || [];
        ids.forEach((id: string) => uniqueReviewIds.add(id));
      }
      totalReviewsAnalyzed = uniqueReviewIds.size;
    } else {
      const rawCount = await RawReview.countDocuments({ userId: user._id });
      totalReviewsAnalyzed = rawCount;
    }

    const insights = reviewGroups.map((group) => ({
      id: group._id.toString(),
      platform: PLATFORM_DISPLAY_NAMES[group.platform] || group.platform,
      platformKey: group.platform,
      issueType: group.issueType,
      normalizedLabel: (group as any).normalizedLabel || group.issueType,
      summary: group.summary,
      sentiment: group.sentiment,
      count: group.count,
      priority: group.priority,
      importanceScore: (group as any).importanceScore || 0,
      avgRating: (group as any).avgRating || 0,
      sentimentBreakdown: (group as any).sentimentBreakdown || { positive: 0, negative: 0, neutral: 0 },
      keywords: (group as any).clusterKeywords || [],
      reviewIds: (group as any).reviewIds || [],
      aiAdvice: group.aiAdvice || "",
      sourceReliability: (group as any).sourceReliability || 1,
      recencyScore: (group as any).recencyScore || 0,
      platforms: [PLATFORM_DISPLAY_NAMES[group.platform] || group.platform],
    }));

    const highPriorityCount = insights.filter((i) => i.priority === "High").length;
    const mediumPriorityCount = insights.filter((i) => i.priority === "Medium").length;
    const lowPriorityCount = insights.filter((i) => i.priority === "Low").length;

    return NextResponse.json({
      totalCompetitors,
      platformsEnabled,
      userPlatforms,
      competitors,
      totalComplaints,
      totalReviewsAnalyzed,
      insights,
      stats: {
        totalClusters: insights.length,
        totalComplaints,
        highPriorityCount,
        mediumPriorityCount,
        lowPriorityCount,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
