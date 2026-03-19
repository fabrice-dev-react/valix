import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";
import { getRawReviewsForCluster, getAllRawReviews } from "@/lib/reviews/analyzer";
import { PLATFORM_DISPLAY_NAMES } from "@/lib/reviews/scraper";

export async function GET(request: Request) {
  try {
    let user;
    try {
      user = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to access this resource");
    }

    const { searchParams } = new URL(request.url);
    const clusterId = searchParams.get("clusterId");
    const platform = searchParams.get("platform") || undefined;
    const sentiment = searchParams.get("sentiment") || undefined;
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    await connectDB();

    let reviews;
    if (clusterId) {
      const rawReviews = await getRawReviewsForCluster(user._id, clusterId);
      reviews = rawReviews.map(r => ({
        ...r,
        platform: PLATFORM_DISPLAY_NAMES[r.platform] || r.platform,
        reviewDate: r.reviewDate ? r.reviewDate.toISOString() : null,
      }));
      return NextResponse.json({ reviews, total: reviews.length });
    }

    const result = await getAllRawReviews(user._id, {
      platform,
      sentiment,
      limit,
      skip,
    });

    return NextResponse.json({
      reviews: result.reviews.map(r => ({
        ...r,
        platform: PLATFORM_DISPLAY_NAMES[r.platform] || r.platform,
        reviewDate: r.reviewDate ? r.reviewDate.toISOString() : null,
      })),
      total: result.total,
      hasMore: skip + result.reviews.length < result.total,
    });
  } catch (error) {
    console.error("Get raw reviews error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
