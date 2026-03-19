import { analyzeSentiment, getReviewSeverity } from "./sentiment";

export interface ExtractedComplaint {
  complaintText: string;
  originalReviewId: string;
  sentiment: "positive" | "negative" | "neutral";
  severity: number;
  keywords: string[];
  platform: string;
  rating: number;
}

export interface ComplaintCluster {
  id: string;
  label: string;
  normalizedLabel: string;
  complaints: ExtractedComplaint[];
  reviewIds: string[];
  platforms: string[];
  keywords: string[];
  sentiment: "positive" | "negative" | "neutral";
  count: number;
  avgRating: number;
  avgSeverity: number;
  sentimentBreakdown: { positive: number; negative: number; neutral: number };
  sourceReliability: number;
  recencyScore: number;
  importanceScore: number;
  priority: "High" | "Medium" | "Low";
  summary: string;
  aiAdvice: string;
}

const COMPLAINT_PATTERNS = [
  { pattern: /pricing|expensive|overpriced|cost|fee|price|subscription|subscription|costly|billed|charge|pay|payment|afford|affordability|cheap| budgetary|budget|roi|value/i, category: "pricing", keywords: ["pricing", "expensive", "overpriced", "cost", "fees"] },
  { pattern: /support|help|response|respond|ticket|chat|email|phone|customer.service|helpdesk|agent|rep|representative|service/i, category: "support", keywords: ["support", "customer service", "response time", "help"] },
  { pattern: /bug|buggy|glitch|glitchy|crash|crash|error|errors|broken|fix|issue|problem|defect|fault|failing|fails/i, category: "technical", keywords: ["bugs", "technical issues", "crashes", "errors"] },
  { pattern: /slow|performance|lag|laggy|loading|load.time|speed|fast|responsive|latency|timeout|delay/i, category: "performance", keywords: ["performance", "slow", "speed"] },
  { pattern: /onboard|setup|setup|install|installation|configure|getting.started|first.week|first.day|initial|begin/i, category: "onboarding", keywords: ["onboarding", "setup", "getting started"] },
  { pattern: /ui|interface|design|navigation|navigate|ux|user.experience|visual|layout|screen|page|dashboard|menu|click/i, category: "ux", keywords: ["UI", "interface", "navigation", "UX", "design"] },
  { pattern: /learn|learning.curve|steep|complicated|complex|confusing|confused|understand|intuitive|unintuitive|difficult|easy/i, category: "learning_curve", keywords: ["learning curve", "complexity", "usability"] },
  { pattern: /doc|documentation|docs|tutorial|guide|manual|help.article|kb|knowledge.base|instructions|examples|sample/i, category: "documentation", keywords: ["documentation", "tutorials", "guides"] },
  { pattern: /feature|functionality|tool|feature.set|missing|lacks|capability|functional|option|integration|api|connect|third.party/i, category: "features", keywords: ["features", "missing functionality", "integrations"] },
  { pattern: /mobile|app|phone|tablet|responsive|desktop|ios|android|cross.platform/i, category: "mobile", keywords: ["mobile", "app", "responsiveness"] },
  { pattern: /security|secure|encrypt|privacy|privacy|compliant|compliance|gdpr|hipaa|certified|trust|safe/i, category: "security", keywords: ["security", "privacy", "compliance"] },
  { pattern: /reliable|uptime|downtime|outage|availability|consistent|stability|stable|reliability|trust/i, category: "reliability", keywords: ["reliability", "uptime", "stability"] },
  { pattern: /team|collaborate|collaboration|teamwork|share|sharing|permission|role|access|multi.user|group/i, category: "collaboration", keywords: ["team collaboration", "sharing", "permissions"] },
  { pattern: /report|reporting|analytics|insight|dashboard|metric|chart|graph|visualization|data.analysis/i, category: "reporting", keywords: ["reporting", "analytics", "insights"] },
  { pattern: /data|import|export|csv|excel|backup|migration|transfer|convert|file/i, category: "data_management", keywords: ["data import/export", "backup", "migration"] },
  { pattern: /reliable|reliable|accurate|correct|precision|precision|error.free|reliable/i, category: "accuracy", keywords: ["accuracy", "reliability", "data quality"] },
  { pattern: /love|amazing|awesome|excellent|fantastic|great|wonderful|outstanding|impressive|best|perfect/i, category: "positive", keywords: ["positive", "praise"] },
  { pattern: /hate|terrible|horrible|awful|worst|useless|garbage|disappoint|frustrat|annoy|ragemad/i, category: "negative_emotion", keywords: ["strong negative", "frustration"] },
  { pattern: /update|upgrade|new.version|release|new.feature|changelog|roadmap|future/i, category: "updates", keywords: ["updates", "roadmap", "new features"] },
  { pattern: /training|train|webinar|onboarding|course|learn|education|teach/i, category: "training", keywords: ["training", "education"] },
  { pattern: /pricing.transparency|pricing.hidden|pricing.surprise|surprise.charge|surprise.fee|unexpected|bait/i, category: "pricing_transparency", keywords: ["pricing transparency", "hidden fees", "surprise charges"] },
  { pattern: /cancel|cancellation|refund|credit|return|money.back|subscription.cancel/i, category: "cancellation", keywords: ["cancellation", "refund", "subscription issues"] },
  { pattern: /scalab|scalability|scale|grow|growing|enterprise|large|scale/i, category: "scalability", keywords: ["scalability", "enterprise", "growth"] },
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): Set<string> {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/);
  const tokens = new Set<string>();
  tokens.add(normalized);
  for (const word of words) {
    if (word.length > 3) tokens.add(word);
  }
  for (let i = 0; i < words.length - 1; i++) {
    tokens.add(`${words[i]}_${words[i + 1]}`);
  }
  for (let i = 0; i < words.length - 2; i++) {
    tokens.add(`${words[i]}_${words[i + 1]}_${words[i + 2]}`);
  }
  return tokens;
}

function computeSimilarity(tokensA: Set<string>, tokensB: Set<string>): number {
  const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

function extractComplaintsFromReview(
  reviewText: string,
  reviewId: string,
  platform: string,
  rating: number
): ExtractedComplaint[] {
  const sentences = reviewText
    .replace(/([.!?])\s+/g, "$1|")
    .split("|")
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 500);

  if (sentences.length <= 1) {
    const sentimentResult = analyzeSentiment(reviewText, rating);
    return [{
      complaintText: reviewText,
      originalReviewId: reviewId,
      sentiment: sentimentResult.sentiment,
      severity: getReviewSeverity(reviewText, sentimentResult.sentiment),
      keywords: sentimentResult.keyPhrases,
      platform,
      rating,
    }];
  }

  return sentences.map(sentence => {
    const sentimentResult = analyzeSentiment(sentence, rating);
    return {
      complaintText: sentence,
      originalReviewId: reviewId,
      sentiment: sentimentResult.sentiment,
      severity: getReviewSeverity(sentence, sentimentResult.sentiment),
      keywords: sentimentResult.keyPhrases,
      platform,
      rating,
    };
  });
}

function matchComplaintCategory(text: string): { category: string; keywords: string[] } {
  const normalized = normalizeText(text);
  let bestMatch = { category: "general", keywords: [] as string[] };
  let bestScore = 0;

  for (const { pattern, category, keywords } of COMPLAINT_PATTERNS) {
    const matches = (normalized.match(pattern) || []).length;
    if (matches > bestScore) {
      bestScore = matches;
      bestMatch = { category, keywords };
    }
  }

  return bestMatch;
}

function generateClusterLabel(complaints: ExtractedComplaint[]): string {
  const categoryMap = new Map<string, number>();
  const allKeywords: string[] = [];
  const texts: string[] = [];

  for (const complaint of complaints) {
    const { category, keywords } = matchComplaintCategory(complaint.complaintText);
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    allKeywords.push(...keywords);
    texts.push(complaint.complaintText.substring(0, 100));
  }

  let topCategory = "General Feedback";
  let topCount = 0;
  for (const [cat, count] of categoryMap) {
    if (count > topCount) {
      topCount = count;
      topCategory = cat;
    }
  }

  const LABEL_MAP: Record<string, string> = {
    pricing: "Pricing & Cost",
    support: "Customer Support",
    technical: "Technical Issues & Bugs",
    performance: "Performance Problems",
    onboarding: "Onboarding & Setup",
    ux: "User Interface & Navigation",
    learning_curve: "Learning Curve & Usability",
    documentation: "Documentation & Tutorials",
    features: "Feature Gaps & Missing Functionality",
    mobile: "Mobile Experience",
    security: "Security & Privacy",
    reliability: "Reliability & Uptime",
    collaboration: "Team Collaboration",
    reporting: "Reporting & Analytics",
    data_management: "Data Management & Integration",
    accuracy: "Data Accuracy",
    positive: "Positive Feedback",
    negative_emotion: "Strong Negative Feedback",
    updates: "Product Updates & Roadmap",
    training: "Training & Education",
    pricing_transparency: "Pricing Transparency",
    cancellation: "Cancellation & Refunds",
    scalability: "Scalability",
    general: "General Feedback",
  };

  const label = LABEL_MAP[topCategory] || topCategory;
  return label;
}

function computeRecencyScore(complaints: ExtractedComplaint[], reviewDates: Map<string, Date>): number {
  if (reviewDates.size === 0) return 0.5;

  const now = Date.now();
  const recentThreshold = 30 * 24 * 60 * 60 * 1000;
  const oldThreshold = 180 * 24 * 60 * 60 * 1000;

  let recencySum = 0;
  let count = 0;

  for (const complaint of complaints) {
    const date = reviewDates.get(complaint.originalReviewId);
    if (date) {
      const age = now - date.getTime();
      let score = 0.5;
      if (age < recentThreshold) score = 1.0;
      else if (age < oldThreshold) score = 0.75;
      else score = 0.25;
      recencySum += score;
      count++;
    }
  }

  return count > 0 ? recencySum / count : 0.5;
}

function computeImportanceScore(cluster: {
  count: number;
  avgSeverity: number;
  sentiment: string;
  recencyScore: number;
  sourceReliability: number;
  avgRating: number;
}): number {
  const baseCount = Math.min(cluster.count, 20) / 20;
  const severityWeight = cluster.avgSeverity / 10;
  const sentimentWeight = cluster.sentiment === "negative" ? 1.0 : cluster.sentiment === "neutral" ? 0.5 : 0.2;
  const recencyWeight = cluster.recencyScore;
  const reliabilityWeight = cluster.sourceReliability;
  const ratingWeight = Math.max(0, (5 - cluster.avgRating) / 5);

  const score =
    baseCount * 0.25 +
    severityWeight * 0.20 +
    sentimentWeight * 0.20 +
    recencyWeight * 0.15 +
    reliabilityWeight * 0.10 +
    ratingWeight * 0.10;

  return Math.round(score * 100) / 100;
}

function determinePriority(importanceScore: number): "High" | "Medium" | "Low" {
  if (importanceScore >= 0.55) return "High";
  if (importanceScore >= 0.35) return "Medium";
  return "Low";
}

function generateSummary(cluster: ComplaintCluster): string {
  const count = cluster.count;
  const avgRating = cluster.avgRating.toFixed(1);
  const platforms = [...new Set(cluster.platforms)].slice(0, 2).join(" & ");

  if (cluster.sentiment === "negative") {
    if (cluster.normalizedLabel === "pricing") {
      return `${count} users mentioned concerns about pricing and cost on ${platforms}`;
    }
    if (cluster.normalizedLabel === "support") {
      return `${count} complaints about customer support quality and response times on ${platforms}`;
    }
    if (cluster.normalizedLabel === "technical" || cluster.normalizedLabel === "performance") {
      return `${count} reports of technical issues and ${cluster.normalizedLabel === "performance" ? "performance problems" : "bugs"} on ${platforms}`;
    }
    if (cluster.normalizedLabel === "onboarding") {
      return `${count} users struggled with onboarding and initial setup on ${platforms}`;
    }
    if (cluster.normalizedLabel === "ux" || cluster.normalizedLabel === "learning_curve") {
      return `${count} reviews mentioned ${cluster.normalizedLabel === "learning_curve" ? "steep learning curve" : "confusing UI"} on ${platforms}`;
    }
    if (cluster.normalizedLabel === "documentation") {
      return `${count} users noted insufficient documentation and tutorials on ${platforms}`;
    }
    if (cluster.normalizedLabel === "features") {
      return `${count} complaints about missing features on ${platforms}`;
    }
    return `${count} negative reviews about ${cluster.normalizedLabel} on ${platforms}`;
  }

  if (cluster.sentiment === "positive") {
    return `${count} positive reviews praising ${cluster.normalizedLabel} on ${platforms}`;
  }

  return `${count} reviews mentioning ${cluster.normalizedLabel} on ${platforms}`;
}

function generateAdvice(cluster: ComplaintCluster): string {
  const label = cluster.normalizedLabel;

  if (label === "Pricing & Cost") {
    return "Review pricing transparency and consider implementing a pricing calculator. Compare with competitors and ensure value justification is clear in marketing materials.";
  }
  if (label === "Customer Support") {
    return "Consider adding live chat support, improving response time SLAs, and creating a comprehensive FAQ. Proactive support can significantly improve satisfaction.";
  }
  if (label === "Technical Issues & Bugs") {
    return "Prioritize bug fixes and implement a public changelog. Consider a beta program to catch issues before release.";
  }
  if (label === "Performance Problems") {
    return "Conduct performance audits and optimize slow endpoints. Consider CDN, caching strategies, and database query optimization.";
  }
  if (label === "Onboarding & Setup") {
    return "Create interactive tutorials, checklists, and video walkthroughs. Consider dedicated onboarding support for new enterprise customers.";
  }
  if (label === "User Interface & Navigation") {
    return "Conduct UX research to identify pain points. Simplify navigation and ensure consistency across the interface.";
  }
  if (label === "Learning Curve & Usability") {
    return "Add contextual tooltips, guided tours, and progressive disclosure. Consider role-based onboarding flows.";
  }
  if (label === "Documentation & Tutorials") {
    return "Invest in comprehensive documentation with examples. Create video tutorials and regularly update help resources.";
  }
  if (label === "Feature Gaps & Missing Functionality") {
    return "Review feature requests from reviews and prioritize high-impact missing features. Communicate roadmap plans to users.";
  }
  if (label === "Positive Feedback") {
    return "Leverage these positive experiences in case studies and testimonials. Share positive feedback internally to boost morale.";
  }
  return `Monitor and address ${label} feedback. Regular analysis of reviews helps identify emerging trends.`;
}

export function clusterComplaints(
  complaints: ExtractedComplaint[],
  reviewDates: Map<string, Date>,
  platformReliability: Record<string, number>
): ComplaintCluster[] {
  if (complaints.length === 0) return [];

  const clusters: ComplaintCluster[] = [];
  const assigned = new Set<number>();

  const sorted = [...complaints].sort((a, b) => b.severity - a.severity);

  for (let i = 0; i < sorted.length; i++) {
    if (assigned.has(i)) continue;

    const seed = sorted[i];
    const seedTokens = tokenize(seed.complaintText);
    const group: ExtractedComplaint[] = [seed];
    assigned.add(i);

    for (let j = 0; j < sorted.length; j++) {
      if (assigned.has(j)) continue;

      const other = sorted[j];
      const otherTokens = tokenize(other.complaintText);
      const similarity = computeSimilarity(seedTokens, otherTokens);

      if (similarity > 0.3) {
        group.push(other);
        assigned.add(j);
      }
    }

    const platforms = [...new Set(group.map(c => c.platform))];
    const reliability = platforms.reduce((sum, p) => sum + (platformReliability[p] || 0.5), 0) / platforms.length;

    const { category } = matchComplaintCategory(group[0].complaintText);
    const normalizedLabel = category;
    const label = generateClusterLabel(group);

    const avgRating = group.reduce((sum, c) => sum + c.rating, 0) / group.length;
    const avgSeverity = group.filter(c => c.sentiment === "negative").reduce((sum, c, _, arr) => sum + c.severity / Math.max(arr.length, 1), 0);

    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    for (const c of group) sentimentCounts[c.sentiment]++;

    const dominantSentiment =
      sentimentCounts.negative >= sentimentCounts.positive ? "negative" : "positive";

    const recencyScore = computeRecencyScore(group, reviewDates);

    const cluster: ComplaintCluster = {
      id: `cluster-${Date.now()}-${clusters.length}`,
      label,
      normalizedLabel,
      complaints: group,
      reviewIds: group.map(c => c.originalReviewId),
      platforms,
      keywords: [],
      sentiment: dominantSentiment as "positive" | "negative" | "neutral",
      count: group.length,
      avgRating,
      avgSeverity,
      sentimentBreakdown: sentimentCounts,
      sourceReliability: reliability,
      recencyScore,
      importanceScore: 0,
      priority: "Medium",
      summary: "",
      aiAdvice: "",
    };

    cluster.importanceScore = computeImportanceScore({
      count: cluster.count,
      avgSeverity: cluster.avgSeverity,
      sentiment: cluster.sentiment,
      recencyScore: cluster.recencyScore,
      sourceReliability: cluster.sourceReliability,
      avgRating: cluster.avgRating,
    });

    cluster.priority = determinePriority(cluster.importanceScore);
    cluster.summary = generateSummary(cluster);
    cluster.aiAdvice = generateAdvice(cluster);

    clusters.push(cluster);
  }

  clusters.sort((a, b) => {
    if (a.priority !== b.priority) {
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.priority] - order[b.priority];
    }
    return b.count - a.count;
  });

  return clusters;
}

export function extractAllComplaints(
  reviews: Array<{
    _id: string;
    reviewText: string;
    platform: string;
    rating: number;
  }>
): ExtractedComplaint[] {
  const allComplaints: ExtractedComplaint[] = [];

  for (const review of reviews) {
    const complaints = extractComplaintsFromReview(
      review.reviewText,
      review._id.toString(),
      review.platform,
      review.rating
    );
    allComplaints.push(...complaints);
  }

  return allComplaints;
}

export { extractComplaintsFromReview, matchComplaintCategory };
