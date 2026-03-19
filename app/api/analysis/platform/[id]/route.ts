import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import ReviewGroup from "@/models/ReviewGroup";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

const mockReviewsByPlatform: Record<string, any[]> = {
  g2: [
    { text: "Onboarding took forever and support was unresponsive for days.", rating: 2 },
    { text: "Slow onboarding process made it difficult to get started.", rating: 2 },
    { text: "Support response time is terrible, waiting weeks for replies.", rating: 1 },
    { text: "Great UI once you get used to it, but learning curve is steep.", rating: 3 },
    { text: "Hidden fees and unexpected pricing increases.", rating: 2 },
  ],
  capterra: [
    { text: "5 users mentioned hidden fees and unexpected pricing increases.", rating: 2 },
    { text: "Pricing is not transparent at all.", rating: 2 },
    { text: "Good features but too expensive for what you get.", rating: 3 },
    { text: "The interface is intuitive and easy to use.", rating: 4 },
  ],
  trustpilot: [
    { text: "2 customers praised the intuitive interface.", rating: 5 },
    { text: "Great pipeline management features.", rating: 4 },
    { text: "Customer service is excellent.", rating: 5 },
  ],
  google: [
    { text: "Way too complex for a small team.", rating: 2 },
    { text: "Decent tool but overwhelming features.", rating: 3 },
    { text: "Simple to use and effective.", rating: 4 },
  ],
  producthunt: [
    { text: "Innovative features but buggy at launch.", rating: 3 },
    { text: "Love the new updates they've been pushing.", rating: 4 },
  ],
  getapp: [
    { text: "Reporting features are still lacking.", rating: 3 },
    { text: "Good value for money.", rating: 4 },
  ],
  slashdot: [
    { text: "Performance issues on older hardware.", rating: 3 },
    { text: "Open source flexibility is great.", rating: 4 },
  ],
  alternatives: [
    { text: "There are better alternatives available.", rating: 2 },
    { text: "Decent alternative to enterprise solutions.", rating: 3 },
  ],
  softwaresuggest: [
    { text: "Documentation could be better.", rating: 3 },
    { text: "Helpful customer support.", rating: 4 },
  ],
  cr: [
    { text: "Reliable and consistent performance.", rating: 4 },
    { text: "Could use more integration options.", rating: 3 },
  ],
  gartner: [
    { text: "Industry standard solution.", rating: 4 },
    { text: "Expensive but comprehensive.", rating: 3 },
  ],
  trustradius: [
    { text: "Detailed reviews from real users.", rating: 4 },
    { text: "Easy to compare alternatives.", rating: 4 },
  ],
};

const sentimentKeywords = {
  positive: ["great", "excellent", "love", "easy", "intuitive", "good", "love", "helpful"],
  negative: ["slow", "terrible", "hidden", "expensive", "complex", "buggy", "lacking", "poor"]
};

const getSentiment = (text: string): "positive" | "negative" | "neutral" => {
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  sentimentKeywords.positive.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  sentimentKeywords.negative.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let user;
    try {
      user = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to access this resource");
    }

    const { id: platform } = await params;

    await connectDB();

    const userData = await User.findById(user._id);
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const competitors = [
      ...(userData.competitors || []),
      ...(userData.customCompetitors || [])
    ];

    const reviews = mockReviewsByPlatform[platform] || [];
    
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const platformReviews = reviews.map((review, idx) => ({
      id: `${platform}-${Date.now()}-${idx}`,
      platform,
      competitor: competitors[idx % competitors.length]?.name || "Unknown",
      text: review.text,
      rating: review.rating,
      sentiment: getSentiment(review.text),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }));

    await ReviewGroup.deleteMany({ userId: user._id, platform });

    const groupedReviews: Record<string, any[]> = {};
    
    platformReviews.forEach(review => {
      const issueType = review.sentiment === "positive" 
        ? "Positive Feedback"
        : review.text.includes("onboarding") || review.text.includes("slow") || review.text.includes("terrible")
          ? "Support & Onboarding"
          : review.text.includes("pricing") || review.text.includes("expensive") || review.text.includes("hidden")
            ? "Pricing Issues"
            : review.text.includes("complex") || review.text.includes("confusing") || review.text.includes("lacking")
              ? "UX & Complexity"
              : review.text.includes("buggy") || review.text.includes("performance")
                ? "Technical Issues"
                : "General Feedback";

      if (!groupedReviews[issueType]) {
        groupedReviews[issueType] = [];
      }
      groupedReviews[issueType].push(review);
    });

    const savedGroups = [];

    for (const [issueType, reviews] of Object.entries(groupedReviews)) {
      const avgRating = reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length;
      const sentimentCounts: Record<string, number> = { positive: 0, negative: 0, neutral: 0 };
      reviews.forEach((r: any) => { 
        const s = r.sentiment as string;
        if (s in sentimentCounts) sentimentCounts[s]++; 
      });

      const dominantSentiment = 
        sentimentCounts.negative >= sentimentCounts.positive 
          ? "negative" 
          : "positive";

      const summary = generateSummary(issueType, reviews, dominantSentiment);
      const aiAdvice = generateAdvice(issueType, dominantSentiment);
      const priority = determinePriority(issueType, reviews.length, dominantSentiment);

      const group = {
        userId: user._id,
        platform,
        issueType,
        summary,
        sentiment: dominantSentiment,
        count: reviews.length,
        reviews: reviews.map(r => r.id),
        aiAdvice,
        priority,
        createdAt: new Date()
      };

      const savedGroup = await ReviewGroup.create(group);
      savedGroups.push(savedGroup);
    }

    return NextResponse.json({
      success: true,
      reviewsFound: platformReviews.length,
      competitorsAnalyzed: competitors.length,
      groupsCreated: savedGroups.length
    });
  } catch (error) {
    console.error("Platform analysis error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateSummary(issueType: string, reviews: any[], sentiment: string): string {
  const count = reviews.length;
  const competitor = reviews[0]?.competitor || "This software";
  
  if (issueType === "Support & Onboarding") {
    return `${count} people complained about slow onboarding and poor support response times`;
  }
  if (issueType === "Pricing Issues") {
    return `${count} users mentioned hidden fees and unexpected pricing increases`;
  }
  if (issueType === "UX & Complexity") {
    return `${count} customers reported steep learning curve and confusing navigation`;
  }
  if (issueType === "Technical Issues") {
    return `${count} users reported bugs and performance issues`;
  }
  if (issueType === "Positive Feedback") {
    return `${count} customers praised the intuitive interface and great features`;
  }
  return `${count} users shared feedback about ${issueType.toLowerCase()}`;
}

function generateAdvice(issueType: string, sentiment: string): string {
  if (issueType === "Support & Onboarding" && sentiment === "negative") {
    return "Consider improving onboarding flow and adding live chat support to address response time concerns";
  }
  if (issueType === "Pricing Issues" && sentiment === "negative") {
    return "Review pricing transparency and consider implementing a clear pricing calculator on your site";
  }
  if (issueType === "UX & Complexity" && sentiment === "negative") {
    return "Consider adding interactive tutorials and tooltips to simplify the user experience";
  }
  if (issueType === "Technical Issues" && sentiment === "negative") {
    return "Focus on performance optimization and bug fixes to improve user satisfaction";
  }
  if (sentiment === "positive") {
    return "Highlight these strengths in marketing materials to attract new users";
  }
  return "Monitor this area for potential improvements";
}

function determinePriority(issueType: string, count: number, sentiment: string): "High" | "Medium" | "Low" {
  if (sentiment === "negative" && count >= 3) return "High";
  if (sentiment === "negative" && count >= 1) return "Medium";
  if (sentiment === "positive") return "Low";
  return "Medium";
}
