"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import { SkeletonCard, SkeletonMetricCard } from "@/components/Skeleton";

interface Insight {
  id: string;
  platform: string;
  platformKey: string;
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

interface RawReview {
  id: string;
  platform: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  reviewDate: string | null;
  sentiment: string;
  sentimentScore: number;
  sourceUrl: string;
  isVerified: boolean;
  competitorName: string;
}

interface DashboardStats {
  totalCompetitors: number;
  platformsEnabled: number;
  totalComplaints: number;
  totalReviewsAnalyzed: number;
  stats: {
    totalClusters: number;
    totalComplaints: number;
    highPriorityCount: number;
    mediumPriorityCount: number;
    lowPriorityCount: number;
  };
}

const PLATFORM_COLORS: Record<string, string> = {
  g2: "bg-purple-100 text-purple-700",
  capterra: "bg-green-100 text-green-700",
  trustpilot: "bg-emerald-100 text-emerald-700",
  google: "bg-blue-100 text-blue-700",
  producthunt: "bg-orange-100 text-orange-700",
  getapp: "bg-teal-100 text-teal-700",
  slashdot: "bg-slate-100 text-slate-700",
  alternatives: "bg-indigo-100 text-indigo-700",
  softwaresuggest: "bg-pink-100 text-pink-700",
  cr: "bg-amber-100 text-amber-700",
  gartner: "bg-red-100 text-red-700",
  trustradius: "bg-cyan-100 text-cyan-700",
};

function getPlatformColor(platform: string): string {
  const key = platform.toLowerCase().replace(/\s+/g, "").replace(/[^a-z]/g, "");
  return PLATFORM_COLORS[key] || "bg-blue-100 text-blue-700";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [selectedReviews, setSelectedReviews] = useState<RawReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoadingStats(true);
    setIsLoadingInsights(true);

    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalCompetitors: data.totalCompetitors || 0,
          platformsEnabled: data.platformsEnabled || 0,
          totalComplaints: data.totalComplaints || 0,
          totalReviewsAnalyzed: data.totalReviewsAnalyzed || 0,
          stats: data.stats || {
            totalClusters: 0,
            totalComplaints: 0,
            highPriorityCount: 0,
            mediumPriorityCount: 0,
            lowPriorityCount: 0,
          },
        });
        setInsights(data.insights || []);
      } else {
        setStats({
          totalCompetitors: 0,
          platformsEnabled: 0,
          totalComplaints: 0,
          totalReviewsAnalyzed: 0,
          stats: {
            totalClusters: 0,
            totalComplaints: 0,
            highPriorityCount: 0,
            mediumPriorityCount: 0,
            lowPriorityCount: 0,
          },
        });
      }
    } catch {
      setStats({
        totalCompetitors: 0,
        platformsEnabled: 0,
        totalComplaints: 0,
        totalReviewsAnalyzed: 0,
        stats: {
          totalClusters: 0,
          totalComplaints: 0,
          highPriorityCount: 0,
          mediumPriorityCount: 0,
          lowPriorityCount: 0,
        },
      });
    } finally {
      setIsLoadingStats(false);
      setIsLoadingInsights(false);
    }
  }, []);

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch("/api/auth/refresh-session", { method: "POST" });
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data.plan !== "starter" && data.plan !== "growth") {
          router.push("/pricing");
          return;
        }
        if (!data.onboardingCompleted) {
          router.push("/onboarding");
          return;
        }
        setIsLoading(false);
      } catch {
        router.push("/login");
      }
    }
    checkAccess();
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCardClick = async (insight: Insight) => {
    if (selectedInsight?.id === insight.id) {
      setSelectedInsight(null);
      setSelectedReviews([]);
      return;
    }

    setSelectedInsight(insight);
    setSelectedReviews([]);
    setIsLoadingReviews(true);

    try {
      const response = await fetch(`/api/reviews/raw?clusterId=${insight.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedReviews(data.reviews || []);
      }
    } catch {
      setSelectedReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const closePanel = () => {
    setSelectedInsight(null);
    setSelectedReviews([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const hasData = insights.length > 0;

  return (
    <div className="flex flex-col">
      <div className="p-4 md:p-6 lg:p-8">
        <DashboardHeader />
      </div>

      <div className="px-4 md:px-6 lg:px-8 pb-8">
        {!hasData && !isLoadingInsights && (
          <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6 text-center">
            <div className="text-4xl mb-3">
              <svg className="w-12 h-12 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Review Data Yet</h3>
            <p className="text-slate-500 text-sm mb-4 max-w-md mx-auto">
              Start the analysis to discover competitor weaknesses.
            </p>
            <button
              onClick={() => router.push("/dashboard/analysis")}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Analysis
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {isLoadingStats ? (
            <>
              <SkeletonMetricCard />
              <SkeletonMetricCard />
              <SkeletonMetricCard />
              <SkeletonMetricCard />
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200">
                <p className="text-2xl md:text-4xl font-bold text-slate-800">{stats?.totalCompetitors || 0}</p>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Competitors tracked</p>
              </div>
              <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200">
                <p className="text-2xl md:text-4xl font-bold text-slate-800">{stats?.platformsEnabled || 0}</p>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Platforms enabled</p>
              </div>
              <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200">
                <p className="text-2xl md:text-4xl font-bold text-red-600">{stats?.totalComplaints || 0}</p>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Complaints detected</p>
              </div>
              <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200">
                <p className="text-2xl md:text-4xl font-bold text-slate-800">{stats?.totalReviewsAnalyzed || 0}</p>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Reviews analyzed</p>
              </div>
            </>
          )}
        </div>

        {hasData && stats?.stats && (
          <div className="mb-4 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 bg-red-50 text-red-700 rounded">
              {stats.stats.highPriorityCount} High
            </span>
            <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded">
              {stats.stats.mediumPriorityCount} Medium
            </span>
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
              {stats.stats.lowPriorityCount} Low
            </span>
          </div>
        )}

        <div className="flex gap-6">
          <div className={`bg-white rounded-xl p-4 md:p-6 border border-slate-200 ${selectedInsight ? "flex-1" : "w-full"}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold text-slate-800">What customers are saying</h2>
            </div>
            {isLoadingInsights ? (
              <div className="space-y-3">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    onClick={() => handleCardClick(insight)}
                    className={`relative p-3 md:p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedInsight?.id === insight.id
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-medium ${
                        insight.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : insight.priority === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {insight.priority}
                    </span>

                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(insight.platform)}`}>
                        {insight.platform}
                      </span>
                      <span className="font-semibold text-sm text-slate-700">{insight.issueType}</span>
                      <span className="text-xs text-slate-500">({insight.count} mentions)</span>
                    </div>
                    <p className="text-slate-700 text-sm mb-3">{insight.summary}</p>
                    {insight.sentimentBreakdown && (
                      <div className="flex gap-4 text-xs text-slate-500 mb-2">
                        {insight.sentimentBreakdown.negative > 0 && (
                          <span className="text-red-600">{insight.sentimentBreakdown.negative} negative</span>
                        )}
                        {insight.sentimentBreakdown.positive > 0 && (
                          <span className="text-green-600">{insight.sentimentBreakdown.positive} positive</span>
                        )}
                        {insight.sentimentBreakdown.neutral > 0 && (
                          <span className="text-slate-400">{insight.sentimentBreakdown.neutral} neutral</span>
                        )}
                      </div>
                    )}
                    <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
                      <p className="text-blue-700 text-sm">{insight.aiAdvice}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-8">
                Complete onboarding to start analyzing competitor reviews.
              </p>
            )}
          </div>

          {selectedInsight && (
            <div className="w-[40%] min-w-[320px] max-w-[500px] bg-white rounded-xl p-4 md:p-6 border border-slate-200 flex flex-col max-h-[800px]">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-slate-800">Real Reviews</h2>
                  <p className="text-xs text-slate-500">
                    {selectedInsight.platform} • {selectedInsight.issueType} • {selectedReviews.length} reviews
                  </p>
                </div>
                <button onClick={closePanel} className="p-1 hover:bg-slate-100 rounded">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {isLoadingReviews ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
                        <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : selectedReviews.length > 0 ? (
                  selectedReviews.map((review) => (
                    <div key={review.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-500 text-sm font-medium">{renderStars(review.rating)}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                              review.sentiment === "positive"
                                ? "bg-green-100 text-green-700"
                                : review.sentiment === "negative"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {review.sentiment}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{formatDate(review.reviewDate)}</span>
                          {review.sourceUrl && (
                            <a
                              href={review.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                              title="View on platform"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">"{review.reviewText}"</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-slate-400">
                          {review.isVerified ? "✓ Verified" : ""} {review.reviewerName}
                          {review.competitorName ? ` • ${review.competitorName}` : ""}
                        </p>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPlatformColor(review.platform)}`}>
                          {review.platform}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center py-4">No reviews found for this insight.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
