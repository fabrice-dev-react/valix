import { NextRequest, NextResponse } from "next/server";

interface Competitor {
  name: string;
  domain: string;
  logoUrl: string;
}

interface AnalysisResult {
  productName: string;
  description: string;
  category: string;
  targetCustomers: string;
  keyFeatures: string[];
  pricing: string;
  competitors: Competitor[];
}

async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
    const response = await fetch(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RivalixBot/1.0; +https://rivalix.com/bot)",
      },
    });
    const html = await response.text();
    
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    
    return textContent.slice(0, 15000);
  } catch (error) {
    console.error("Error fetching website:", error);
    return "";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const websiteContent = await fetchWebsiteContent(url);

    const prompt = `You are an expert business analyst. Analyze the following website content and provide detailed information about the product/service.

Website URL: ${url}
Website Content: ${websiteContent.slice(0, 10000)}

Based on the website content, provide a detailed analysis in JSON format with the following structure:
{
  "productName": "The name of the product/service",
  "description": "A comprehensive 2-3 sentence description of what this product does",
  "category": "The specific category (e.g., 'CRM Software', 'Project Management Tool', 'Marketing Automation')",
  "targetCustomers": "Describe the ideal target customers in 1-2 sentences",
  "keyFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "pricing": "Brief description of pricing model if available, or 'Not specified'",
  "competitors": [
    {
      "name": "Competitor Name (e.g., HubSpot)",
      "domain": "competitor.com (main domain only, no paths)",
      "logoUrl": "https://logo.clearbit.com/competitor.com (use Clearbit logo API URL)"
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Find exactly 5 real competitors that are DIRECT alternatives to this product
2. For each competitor, provide their main website domain (e.g., "hubspot.com", "salesforce.com", NOT "hubspot.com/crm")
3. Use the Clearbit logo API format: https://logo.clearbit.com/{domain}
4. The competitors should be actual competitors in the same market space
5. Return ONLY valid JSON, no markdown code blocks, no explanations, no text before or after

Example response:
{"productName":"HubSpot CRM","description":"All-in-one CRM platform with marketing, sales, and service tools.","category":"CRM Software","targetCustomers":"Small to medium businesses looking for integrated marketing and sales solutions","keyFeatures":["Contact Management","Email Tracking","Pipeline Management","Marketing Automation","Reporting"],"pricing":"Freemium model with paid plans starting at $50/month","competitors":[{"name":"Salesforce","domain":"salesforce.com","logoUrl":"https://logo.clearbit.com/salesforce.com"},{"name":"Pipedrive","domain":"pipedrive.com","logoUrl":"https://logo.clearbit.com/pipedrive.com"},{"name":"Zoho CRM","domain":"zoho.com","logoUrl":"https://logo.clearbit.com/zoho.com"},{"name":"Microsoft Dynamics","domain":"dynamics.microsoft.com","logoUrl":"https://logo.clearbit.com/dynamics.microsoft.com"},{"name":"Freshsales","domain":"freshsales.io","logoUrl":"https://logo.clearbit.com/freshsales.io"}]}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://rivalix.com",
        "X-Title": "Rivalix",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return NextResponse.json(
        { error: "Failed to analyze website. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    let analysisText = data.choices?.[0]?.message?.content || "";

    analysisText = analysisText.trim();
    if (analysisText.startsWith("```json")) {
      analysisText = analysisText.slice(7);
    }
    if (analysisText.startsWith("```")) {
      analysisText = analysisText.slice(3);
    }
    if (analysisText.endsWith("```")) {
      analysisText = analysisText.slice(0, -3);
    }
    analysisText = analysisText.trim();

    const analysisResult: AnalysisResult = JSON.parse(analysisText);

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "An error occurred during analysis. Please try again." },
      { status: 500 }
    );
  }
}
