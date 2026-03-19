import { ComplaintCluster } from "./clustering";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-3-haiku";

export interface AIEnhancementResult {
  improvedLabel: string;
  improvedSummary: string;
  improvedAdvice: string;
  suggestedActions: string[];
}

async function callOpenRouterAI(prompt: string, maxTokens = 500): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn("OpenRouter API key not configured, using fallback labels");
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
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      console.error("OpenRouter AI error:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error("OpenRouter call failed:", error);
    return null;
  }
}

export async function enhanceClusterWithAI(cluster: ComplaintCluster): Promise<AIEnhancementResult> {
  const sampleReviews = cluster.complaints
    .slice(0, 5)
    .map(c => `- "${c.complaintText.substring(0, 200)}"`)
    .join("\n");

  const sentiment = cluster.sentiment;
  const count = cluster.count;
  const platforms = [...new Set(cluster.platforms)].join(", ");
  const avgRating = cluster.avgRating.toFixed(1);

  const labelPrompt = `Given these ${count} reviews about "${cluster.label}" from ${platforms} (avg rating: ${avgRating}):

${sampleReviews}

Generate a clear, concise label (max 5 words) that summarizes the main issue or theme. The label should be specific and actionable.
Respond with ONLY the label text, no quotes or explanation.`;

  const summaryPrompt = `Analyze these ${count} customer reviews from ${platforms}:

${sampleReviews}

Write a 1-2 sentence summary that captures the main complaint or feedback. Be specific about what customers are saying.
Respond with ONLY the summary text.`;

  const advicePrompt = `For this customer feedback issue about "${cluster.label}" with ${count} mentions from ${platforms}:

${sampleReviews}

Provide 2-3 specific, actionable recommendations for the product team to address this issue. Be practical and prioritize high-impact solutions.
Respond in this exact JSON format (no markdown):
{"advice": "main advice", "actions": ["action 1", "action 2", "action 3"]}`;

  const [labelResult, summaryResult, adviceResult] = await Promise.all([
    callOpenRouterAI(labelPrompt, 50),
    callOpenRouterAI(summaryPrompt, 150),
    callOpenRouterAI(advicePrompt, 300),
  ]);

  let improvedLabel = cluster.label;
  let improvedSummary = cluster.summary;
  let improvedAdvice = cluster.aiAdvice;
  const suggestedActions: string[] = [];

  if (labelResult && labelResult.length > 3 && labelResult.length < 60) {
    improvedLabel = labelResult.replace(/^["']|["']$/g, "").trim();
  }

  if (summaryResult && summaryResult.length > 20) {
    improvedSummary = summaryResult.replace(/^["']|["']$/g, "").trim();
    if (!improvedSummary.endsWith(".")) improvedSummary += ".";
  }

  if (adviceResult) {
    try {
      const cleaned = adviceResult.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.advice) {
        improvedAdvice = parsed.advice;
      }
      if (Array.isArray(parsed.actions)) {
        suggestedActions.push(...parsed.actions);
      }
    } catch {
      if (adviceResult.length > 20 && adviceResult.length < 400) {
        improvedAdvice = adviceResult.replace(/^["']|["']$/g, "").trim();
        if (!improvedAdvice.endsWith(".")) improvedAdvice += ".";
      }
    }
  }

  return {
    improvedLabel,
    improvedSummary,
    improvedAdvice,
    suggestedActions,
  };
}

export async function enhanceClustersWithAI(clusters: ComplaintCluster[]): Promise<ComplaintCluster[]> {
  const negativeClusters = clusters.filter(c => c.sentiment === "negative");
  const positiveClusters = clusters.filter(c => c.sentiment === "positive");
  const otherClusters = clusters.filter(c => c.sentiment === "neutral");

  const enhancedNegative = await Promise.all(
    negativeClusters.map(async (cluster) => {
      if (cluster.count >= 2) {
        const enhancement = await enhanceClusterWithAI(cluster);
        return {
          ...cluster,
          label: enhancement.improvedLabel,
          summary: enhancement.improvedSummary,
          aiAdvice: enhancement.improvedAdvice,
        };
      }
      return cluster;
    })
  );

  return [...enhancedNegative, ...positiveClusters, ...otherClusters];
}

export async function generateReviewInsights(
  reviews: Array<{ reviewText: string; rating: number; platform: string }>
): Promise<{
  overallSentiment: string;
  topStrengths: string[];
  topPainPoints: string[];
  overallSummary: string;
}> {
  const reviewTexts = reviews.map(r => `"${r.rating}★: ${r.reviewText.substring(0, 150)}"`).join("\n");

  const prompt = `Analyze these customer reviews and identify the main themes:

${reviewTexts}

Provide a JSON response with:
- overallSentiment: overall sentiment (positive/negative/mixed)
- topStrengths: array of 3 main positive themes
- topPainPoints: array of 3 main negative themes
- overallSummary: 1-2 sentence summary

Respond with ONLY valid JSON (no markdown):
{
  "overallSentiment": "...",
  "topStrengths": ["...", "...", "..."],
  "topPainPoints": ["...", "...", "..."],
  "overallSummary": "..."
}`;

  const result = await callOpenRouterAI(prompt, 400);

  if (result) {
    try {
      const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return {
        overallSentiment: parsed.overallSentiment || "mixed",
        topStrengths: Array.isArray(parsed.topStrengths) ? parsed.topStrengths : [],
        topPainPoints: Array.isArray(parsed.topPainPoints) ? parsed.topPainPoints : [],
        overallSummary: parsed.overallSummary || "",
      };
    } catch {
      // fallback
    }
  }

  return {
    overallSentiment: "mixed",
    topStrengths: ["Ease of use", "Feature set", "Customer support"],
    topPainPoints: ["Pricing", "Learning curve", "Performance"],
    overallSummary: "Customers have mixed opinions with specific concerns around pricing and usability.",
  };
}
