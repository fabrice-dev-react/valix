const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-3-haiku";

interface Review {
  id: string;
  platform: string;
  competitorName: string;
  competitorDomain: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  reviewDate: Date | null;
  sourceUrl: string;
  isVerified: boolean;
  helpfulCount: number;
}

interface Competitor {
  name: string;
  domain: string;
}

interface GroupedComplaint {
  groupId: string;
  label: string;
  summary: string;
  priority: "High" | "Medium" | "Low";
  sentiment: "negative";
  count: number;
  reviewIds: string[];
  platform: string;
  competitorName: string;
  aiAdvice: string;
}

async function callAI(prompt: string, maxTokens = 1000): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn("[AIProcessor] OpenRouter API key not configured");
    return null;
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://valix.com",
        "X-Title": "Valix",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      console.error("[AIProcessor] OpenRouter error:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error("[AIProcessor] AI call failed:", error);
    return null;
  }
}

export async function filterComplaintsFromReviews(reviews: Review[]): Promise<Review[]> {
  if (reviews.length === 0) return [];

  const reviewsText = reviews
    .map((r, i) => `[${i}] "${r.reviewText}" (Rating: ${r.rating}/5, Platform: ${r.platform})`)
    .join("\n");

  const prompt = `You are analyzing customer reviews to identify complaints about software products. Your task is to filter reviews and return ONLY reviews that contain customer complaints (negative feedback, problems, issues, frustrations, dissatisfactions).

IMPORTANT: Only include reviews that express actual problems or complaints. Exclude reviews that are positive, neutral, or merely describe features without complaint.

Here are the reviews to analyze:
${reviewsText}

Return your response as a JSON array containing ONLY the indices of complaint reviews. Example: [0, 3, 7, 12]

If ALL reviews are positive/neutral and contain no complaints, return an empty array: []

Respond with ONLY the JSON array, nothing else.`;

  const result = await callAI(prompt, 500);

  if (!result) {
    return reviews.filter(r => r.rating <= 3);
  }

  try {
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const indices: number[] = JSON.parse(cleaned);
    return indices
      .filter((i) => i >= 0 && i < reviews.length)
      .map((i) => reviews[i]);
  } catch {
    return reviews.filter(r => r.rating <= 3);
  }
}

export async function groupComplaintsWithAI(
  complaints: Review[],
  competitors: Competitor[]
): Promise<GroupedComplaint[]> {
  if (complaints.length === 0) return [];

  const competitorNames = competitors.map((c) => c.name).join(", ");

  const reviewsText = complaints
    .map((r, i) => `[${i}] ${r.competitorName} on ${r.platform}: "${r.reviewText}" (Rating: ${r.rating}/5)`)
    .join("\n");

  const prompt = `You are analyzing customer complaints to identify common themes and group similar issues together. Your goal is to help a product team understand what competitors are doing wrong so they can improve their own product.

Competitors being analyzed: ${competitorNames}

Here are the complaint reviews to group:
${reviewsText}

Group similar complaints together. Each group should represent a distinct weakness or issue pattern. For each group, provide:
1. A clear, concise label (3-5 words max) summarizing the issue type
2. A summary describing what customers are complaining about
3. A priority level (High/Medium/Low) based on frequency and severity
4. Actionable advice for the product team to address this weakness
5. Which competitor(s) this complaint is about

Return your response as a JSON array of groups. Example format:
[
  {
    "label": "Poor Customer Support",
    "summary": "Multiple users complained about slow and unresponsive customer support, waiting days or weeks for responses.",
    "priority": "High",
    "reviewIndices": [0, 3, 7],
    "competitor": "Salesforce",
    "aiAdvice": "Invest in support team scaling and consider implementing live chat with guaranteed response times."
  },
  {
    "label": "Hidden Pricing Fees",
    "summary": "Customers reported unexpected charges and hidden fees not disclosed during signup.",
    "priority": "High",
    "reviewIndices": [1, 5],
    "competitor": "HubSpot",
    "aiAdvice": "Implement transparent pricing with a calculator and clearly list all potential fees upfront."
  }
]

Rules:
- If a complaint mentions multiple competitors, attribute it to the primary one mentioned
- Priority High = appears in 3+ reviews or mentions serious issues
- Priority Medium = appears in 2 reviews
- Priority Low = appears in 1 review with moderate concern
- Always provide at least one group if there are complaints
- Maximum 8 groups

Respond with ONLY the JSON array, nothing else.`;

  const result = await callAI(prompt, 1500);

  if (!result) {
    return fallbackGrouping(complaints);
  }

  try {
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const groups: any[] = JSON.parse(cleaned);

    return groups.map((group, idx) => {
      const reviewIds = (group.reviewIndices || [])
        .filter((i: number) => i >= 0 && i < complaints.length)
        .map((i: number) => complaints[i].id);

      return {
        groupId: `group-${Date.now()}-${idx}`,
        label: group.label || "General Issue",
        summary: group.summary || "",
        priority: (["High", "Medium", "Low"].includes(group.priority) ? group.priority : "Medium") as "High" | "Medium" | "Low",
        sentiment: "negative" as const,
        count: reviewIds.length,
        reviewIds,
        platform: complaints[group.reviewIndices?.[0]]?.platform || "general",
        competitorName: group.competitor || complaints[group.reviewIndices?.[0]]?.competitorName || "",
        aiAdvice: group.aiAdvice || "",
      };
    });
  } catch (error) {
    console.error("[AIProcessor] Failed to parse AI grouping response:", error);
    return fallbackGrouping(complaints);
  }
}

function fallbackGrouping(complaints: Review[]): GroupedComplaint[] {
  const byCompetitor: Record<string, Review[]> = {};
  for (const c of complaints) {
    const key = c.competitorName;
    if (!byCompetitor[key]) byCompetitor[key] = [];
    byCompetitor[key].push(c);
  }

  const groups: GroupedComplaint[] = [];
  let groupIdx = 0;

  for (const [competitorName, reviews] of Object.entries(byCompetitor)) {
    const texts = reviews.map((r) => r.reviewText.toLowerCase());

    const categories: Record<string, string[]> = {
      "Support & Response": ["support", "response", "help", "ticket", "wait", "slow", "unresponsive", "reply"],
      "Pricing & Cost": ["price", "expensive", "cost", "fee", "overpriced", "cheap", "afford", "billing", "charge"],
      "UX & Navigation": ["ui", "interface", "design", "navigate", "confusing", "complicated", " cluttered", "layout"],
      "Performance": ["slow", "buggy", "crash", "loading", "performance", "lag", "glitch"],
      "Features & Integration": ["feature", "missing", "integration", "api", "lack", "limitation"],
      "Documentation": ["document", "tutorial", "guide", "help article", "kb", "learn"],
    };

    const matched: Record<string, string[]> = {};

    for (const [cat, keywords] of Object.entries(categories)) {
      const matchedReviews = reviews.filter((r, i) =>
        keywords.some((kw: string) => texts[i].includes(kw))
      );
      if (matchedReviews.length > 0) {
        matched[cat] = matchedReviews.map((r) => r.id);
      }
    }

    if (Object.keys(matched).length === 0) {
      matched["General Issues"] = reviews.map((r) => r.id);
    }

    for (const [label, ids] of Object.entries(matched)) {
      const priority = ids.length >= 3 ? "High" : ids.length >= 2 ? "Medium" : "Low";
      groups.push({
        groupId: `group-${Date.now()}-${groupIdx++}`,
        label,
        summary: `${ids.length} customer(s) complained about ${label.toLowerCase()} regarding ${competitorName}.`,
        priority: priority as "High" | "Medium" | "Low",
        sentiment: "negative",
        count: ids.length,
        reviewIds: ids,
        platform: reviews.find((r) => ids.includes(r.id))?.platform || "general",
        competitorName,
        aiAdvice: `Monitor and address ${label.toLowerCase()} feedback to improve customer satisfaction.`,
      });
    }
  }

  return groups;
}


