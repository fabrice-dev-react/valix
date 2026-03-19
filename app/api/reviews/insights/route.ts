import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";
import { getInsightsFromDB } from "@/lib/reviews/analyzer";
import { PLATFORM_DISPLAY_NAMES } from "@/lib/reviews/scraper";

export async function GET() {
  try {
    let user;
    try {
      user = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to access this resource");
    }

    await connectDB();

    const clusters = await getInsightsFromDB(user._id);

    const insights = clusters.map(cluster => ({
      id: cluster.id,
      platform: PLATFORM_DISPLAY_NAMES[cluster.platform] || cluster.platform,
      platformKey: cluster.platform,
      issueType: cluster.issueType,
      normalizedLabel: cluster.normalizedLabel,
      summary: cluster.summary,
      sentiment: cluster.sentiment,
      count: cluster.count,
      priority: cluster.priority,
      importanceScore: cluster.importanceScore,
      avgRating: cluster.avgRating,
      sentimentBreakdown: cluster.sentimentBreakdown,
      keywords: cluster.keywords,
      reviewIds: cluster.reviewIds,
      aiAdvice: cluster.aiAdvice,
      sourceReliability: cluster.sourceReliability,
      recencyScore: cluster.recencyScore,
      platforms: cluster.platforms.map(p => PLATFORM_DISPLAY_NAMES[p] || p),
    }));

    const totalComplaints = insights
      .filter((i: any) => i.sentiment === "negative")
      .reduce((acc: number, i: any) => acc + i.count, 0);

    const totalPositive = insights
      .filter((i: any) => i.sentiment === "positive")
      .reduce((acc: number, i: any) => acc + i.count, 0);

    return NextResponse.json({
      insights,
      stats: {
        totalClusters: insights.length,
        totalComplaints,
        totalPositive,
        highPriorityCount: insights.filter((i: any) => i.priority === "High").length,
        mediumPriorityCount: insights.filter((i: any) => i.priority === "Medium").length,
        lowPriorityCount: insights.filter((i: any) => i.priority === "Low").length,
      },
    });
  } catch (error) {
    console.error("Get insights error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
