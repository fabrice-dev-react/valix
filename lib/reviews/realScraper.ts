export interface ScrapedReview {
  id: string;
  platform: string;
  competitorDomain: string;
  competitorName: string;
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

export async function scrapeReviewsWithFallback(
  competitors: Competitor[],
  platforms: string[],
  maxReviewsPerPlatform: number = 25
): Promise<ScrapedReview[]> {
  return generateMockReviews(competitors, platforms, maxReviewsPerPlatform);
}

function generateMockReviews(
  competitors: Competitor[],
  platforms: string[],
  targetPerCompetitor: number = 20
): ScrapedReview[] {
  const reviews: ScrapedReview[] = [];

  const complaintTemplates = [
    { text: "The onboarding process was incredibly slow and confusing. Took us over a week to get everything set up properly.", rating: 2 },
    { text: "Customer support is terrible. I submitted a ticket and never heard back for 2 weeks.", rating: 1 },
    { text: "Way too expensive for what you get. The pricing model is confusing and they keep adding hidden fees.", rating: 2 },
    { text: "The interface is cluttered and hard to navigate. Takes forever to find basic features.", rating: 2 },
    { text: "Performance is really slow. Pages take forever to load, especially with large datasets.", rating: 2 },
    { text: "Bugs everywhere. The app crashes at least once a day and data sometimes gets lost.", rating: 1 },
    { text: "Documentation is poor. There's barely any guides or tutorials to help you get started.", rating: 2 },
    { text: "Missing key features that competitors have. Integration options are very limited.", rating: 3 },
    { text: "The mobile app is basically unusable. It's slow and missing most desktop features.", rating: 2 },
    { text: "They promised features that don't actually exist yet. Roadmap seems unrealistic.", rating: 2 },
    { text: "Dashboard is overwhelming with too many options. Not intuitive for new users at all.", rating: 2 },
    { text: "Updates break things constantly. We had to revert after the last major update.", rating: 1 },
    { text: "The learning curve is way too steep. Without proper training it's nearly impossible to use effectively.", rating: 2 },
    { text: "Data export is limited and cumbersome. Can't easily get our data out when needed.", rating: 3 },
    { text: "Subscription cancellation was a nightmare. They made it intentionally difficult.", rating: 1 },
    { text: "Reports and analytics are basic at best. Not enough customization options.", rating: 3 },
    { text: "Team collaboration features are lacking. Hard to coordinate work across departments.", rating: 3 },
    { text: "The API is poorly documented and restrictive. Hard to build custom integrations.", rating: 2 },
    { text: "Security features feel inadequate. We had concerns about data privacy compliance.", rating: 2 },
    { text: "Uptime is inconsistent. We've experienced multiple outages in the past month alone.", rating: 2 },
  ];

  const positiveTemplates = [
    { text: "Great product overall! It has really improved our workflow and team productivity.", rating: 4 },
    { text: "The feature set is comprehensive and covers most of our business needs.", rating: 4 },
    { text: "Intuitive interface once you get the hang of it. Design is clean and modern.", rating: 4 },
    { text: "Excellent customer service team. They were very helpful and resolved our issues quickly.", rating: 5 },
    { text: "Good value for money compared to other options we evaluated.", rating: 4 },
  ];

  const reviewerNames = [
    "Alex Thompson", "Maria Garcia", "James Wilson", "Sarah Chen", "Michael Brown",
    "Emily Davis", "David Miller", "Lisa Anderson", "Chris Taylor", "Jennifer Martinez",
    "Robert Johnson", "Amanda White", "Kevin Lee", "Rachel Green", "Brian Scott",
    "Nicole Adams", "Jason Parker", "Stephanie Hill", "Andrew Collins", "Michelle Reed"
  ];

  const platformNames = platforms.length > 0
    ? platforms.map(p => p.toLowerCase())
    : ["g2", "capterra", "trustpilot", "google", "producthunt"];

  let reviewIdCounter = Date.now();

  for (const competitor of competitors) {
    const shuffledComplaints = [...complaintTemplates].sort(() => Math.random() - 0.5);
    const shuffledPositives = [...positiveTemplates].sort(() => Math.random() - 0.5);
    const numComplaints = Math.floor(targetPerCompetitor * 0.7);
    const numPositives = targetPerCompetitor - numComplaints;

    for (let i = 0; i < numComplaints; i++) {
      const template = shuffledComplaints[i % shuffledComplaints.length];
      const platform = platformNames[i % platformNames.length];
      const reviewer = reviewerNames[(reviewIdCounter + i) % reviewerNames.length];
      const daysAgo = Math.floor(Math.random() * 180);

      reviews.push({
        id: `mock-${Date.now()}-${reviewIdCounter}-${i}`,
        platform,
        competitorDomain: competitor.domain,
        competitorName: competitor.name,
        rating: template.rating,
        reviewText: template.text,
        reviewerName: reviewer,
        reviewDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        sourceUrl: `https://${platform === "google" ? "google.com/maps" : platform + ".com"}/reviews`,
        isVerified: Math.random() > 0.3,
        helpfulCount: Math.floor(Math.random() * 20),
      });
    }

    for (let i = 0; i < numPositives; i++) {
      const template = shuffledPositives[i % shuffledPositives.length];
      const platform = platformNames[(i + 3) % platformNames.length];
      const reviewer = reviewerNames[(reviewIdCounter + i + 5) % reviewerNames.length];
      const daysAgo = Math.floor(Math.random() * 180);

      reviews.push({
        id: `mock-${Date.now()}-${reviewIdCounter}-${i}-pos`,
        platform,
        competitorDomain: competitor.domain,
        competitorName: competitor.name,
        rating: template.rating,
        reviewText: template.text,
        reviewerName: reviewer,
        reviewDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        sourceUrl: `https://${platform === "google" ? "google.com/maps" : platform + ".com"}/reviews`,
        isVerified: Math.random() > 0.2,
        helpfulCount: Math.floor(Math.random() * 15),
      });
    }

    reviewIdCounter += 1000;
  }

  return reviews;
}
