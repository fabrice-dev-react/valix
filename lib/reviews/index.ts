export { scrapePlatformReviews, scrapeAllPlatforms, getPlatformConfig, PLATFORM_DISPLAY_NAMES } from "./scraper";
export type { ScrapedReview, PlatformConfig } from "./scraper";

export { analyzeSentiment, getReviewSeverity } from "./sentiment";
export type { SentimentResult } from "./sentiment";

export { clusterComplaints, extractAllComplaints, extractComplaintsFromReview, matchComplaintCategory } from "./clustering";
export type { ExtractedComplaint, ComplaintCluster } from "./clustering";

export { enhanceClusterWithAI, enhanceClustersWithAI, generateReviewInsights } from "./aiEnhancement";
export type { AIEnhancementResult } from "./aiEnhancement";

export {
  scrapeReviewsWithFallback,
} from "./realScraper";

export {
  filterComplaintsFromReviews,
  groupComplaintsWithAI,
} from "./aiProcessor";

export {
  getInsightsFromDB,
  getRawReviewsForCluster,
  getAllRawReviews,
} from "./analyzer";
export type { ClusterResult } from "./analyzer";
