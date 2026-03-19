import RawReview from "@/models/RawReview";
import ReviewGroup from "@/models/ReviewGroup";
import mongoose from "mongoose";

export interface ClusterResult {
  id: string;
  platform: string;
  issueType: string;
  normalizedLabel: string;
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
  count: number;
  priority: "High" | "Medium" | "Low";
  importanceScore: number;
  avgRating: number;
  sentimentBreakdown: { positive: number; negative: number; neutral: number };
  keywords: string[];
  reviewIds: string[];
  aiAdvice: string;
  sourceReliability: number;
  recencyScore: number;
  platforms: string[];
}

export async function getInsightsFromDB(userId: mongoose.Types.ObjectId): Promise<ClusterResult[]> {
  const groups = await ReviewGroup.find({ userId }).sort({ importanceScore: -1 });

  return groups.map(group => ({
    id: group._id.toString(),
    platform: group.platform,
    issueType: group.issueType,
    normalizedLabel: (group as any).normalizedLabel || group.issueType,
    summary: group.summary,
    sentiment: group.sentiment as "positive" | "negative" | "neutral",
    count: group.count,
    priority: group.priority as "High" | "Medium" | "Low",
    importanceScore: (group as any).importanceScore || 0,
    avgRating: (group as any).avgRating || 0,
    sentimentBreakdown: (group as any).sentimentBreakdown || { positive: 0, negative: 0, neutral: 0 },
    keywords: (group as any).clusterKeywords || [],
    reviewIds: (group as any).reviewIds || [],
    aiAdvice: group.aiAdvice || "",
    sourceReliability: (group as any).sourceReliability || 1,
    recencyScore: (group as any).recencyScore || 0,
    platforms: [group.platform],
  }));
}

export async function getRawReviewsForCluster(
  userId: mongoose.Types.ObjectId,
  clusterId: string
): Promise<Array<{
  id: string;
  platform: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  reviewDate: Date | null;
  sentiment: string;
  sentimentScore: number;
  sourceUrl: string;
  isVerified: boolean;
  competitorName: string;
}>> {
  const group = await ReviewGroup.findOne({ _id: clusterId, userId });
  if (!group) return [];

  const reviewIds: string[] = (group as any).reviewIds || [];
  if (reviewIds.length === 0) return [];

  const allReviews = await RawReview.find({ userId }).sort({ fetchedAt: -1 }).limit(200);

  const reviewIdSet = new Set(reviewIds);
  const matched = allReviews.filter(r => reviewIdSet.has(r._id.toString()));

  return matched.map(r => ({
    id: r._id.toString(),
    platform: r.platform,
    rating: r.rating,
    reviewText: r.reviewText,
    reviewerName: r.reviewerName || "Anonymous",
    reviewDate: r.reviewDate,
    sentiment: r.sentiment || "neutral",
    sentimentScore: r.sentimentScore || 0,
    sourceUrl: r.sourceUrl || "",
    isVerified: r.isVerified || false,
    competitorName: r.competitorName || "",
  }));
}

export async function getAllRawReviews(
  userId: mongoose.Types.ObjectId,
  options?: {
    platform?: string;
    sentiment?: string;
    limit?: number;
    skip?: number;
  }
): Promise<{
  reviews: Array<{
    id: string;
    platform: string;
    rating: number;
    reviewText: string;
    reviewerName: string;
    reviewDate: Date | null;
    sentiment: string;
    sentimentScore: number;
    sourceUrl: string;
    isVerified: boolean;
    competitorName: string;
  }>;
  total: number;
}> {
  const filter: Record<string, unknown> = { userId };

  if (options?.platform) filter.platform = options.platform;
  if (options?.sentiment) filter.sentiment = options.sentiment;

  const skip = options?.skip || 0;
  const limit = options?.limit || 50;

  const [reviews, total] = await Promise.all([
    RawReview.find(filter).sort({ fetchedAt: -1 }).skip(skip).limit(limit),
    RawReview.countDocuments(filter),
  ]);

  return {
    reviews: reviews.map(r => ({
      id: r._id.toString(),
      platform: r.platform,
      rating: r.rating,
      reviewText: r.reviewText,
      reviewerName: r.reviewerName || "Anonymous",
      reviewDate: r.reviewDate,
      sentiment: r.sentiment || "neutral",
      sentimentScore: r.sentimentScore || 0,
      sourceUrl: r.sourceUrl || "",
      isVerified: r.isVerified || false,
      competitorName: r.competitorName || "",
    })),
    total,
  };
}
