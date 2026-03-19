import { NextRequest, NextResponse } from "next/server";

interface CompetitorInfo {
  name: string;
  domain: string;
  logoUrl: string;
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
    
    return textContent.slice(0, 10000);
  } catch (error) {
    console.error("Error fetching website:", error);
    return "";
  }
}

function extractDomain(url: string): string {
  try {
    const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
    const urlObj = new URL(cleanUrl);
    let domain = urlObj.hostname.replace(/^www\./, "");
    return domain;
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const websiteContent = await fetchWebsiteContent(url);
    const domain = extractDomain(url);

    const prompt = `You are an expert business analyst. Analyze the following website to identify the company/product name.

Website URL: ${url}
Website Content: ${websiteContent}

Based on the website content, identify the company or product name. Return ONLY valid JSON with this exact structure, nothing else:
{"name": "The Company/Product Name", "domain": "${domain}", "logoUrl": "https://logo.clearbit.com/${domain}"}

Return ONLY valid JSON, no markdown code blocks, no explanations.`;

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
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return NextResponse.json(
        { error: "Failed to analyze competitor. Please try again." },
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

    const competitorInfo: CompetitorInfo = JSON.parse(analysisText);

    return NextResponse.json(competitorInfo);
  } catch (error) {
    console.error("Competitor analysis error:", error);
    return NextResponse.json(
      { 
        name: "Custom Competitor",
        domain: extractDomain(request.url || ""),
        logoUrl: ""
      },
      { status: 200 }
    );
  }
}
