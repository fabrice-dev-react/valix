import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

export async function POST() {
  try {
    let user;
    try {
      user = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to access this resource");
    }

    await connectDB();

    const userData = await User.findById(user._id);
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const platforms = userData.platforms || [];
    const competitors = [
      ...(userData.competitors || []),
      ...(userData.customCompetitors || [])
    ];

    if (platforms.length === 0 || competitors.length === 0) {
      return NextResponse.json({ error: "No platforms or competitors configured" }, { status: 400 });
    }

    const platformNames: Record<string, string> = {
      g2: "G2",
      capterra: "Capterra",
      trustpilot: "Trustpilot",
      google: "Google Reviews",
      producthunt: "Product Hunt",
      getapp: "GetApp",
      slashdot: "Slashdot",
      alternatives: "Alternatives",
      softwaresuggest: "SoftwareSuggest",
      cr: "Consumer Reports",
      gartner: "Gartner",
      trustradius: "TrustRadius"
    };

    const steps = platforms.map((platform: string) => ({
      id: platform,
      platform: platformNames[platform] || platform,
      status: "pending",
      competitors: competitors.length,
      reviewsFound: 0
    }));

    await User.findByIdAndUpdate(user._id, {
      analysisStatus: {
        inProgress: true,
        steps: steps,
        startedAt: new Date()
      }
    });

    return NextResponse.json({ steps });
  } catch (error) {
    console.error("Analysis start error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
