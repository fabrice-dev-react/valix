import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Competitor from "@/models/Competitor";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

export async function GET(request: Request) {
  try {
    let user;
    try {
      user = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to access this resource");
    }

    await connectDB();

    const competitors = await Competitor.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({
      name: user.name || "",
      email: user.email || "",
      competitors: competitors || [],
      onboardingCompleted: user.onboardingCompleted || false,
      plan: user.plan || "free",
      paymentDate: user.paymentDate || null,
      nextResetDate: user.nextResetDate || null,
    });
  } catch (error: any) {
    console.error("Get user data error:", error.message);
    return NextResponse.json(
      { error: "Unable to fetch user data. Please try again." },
      { status: 503 }
    );
  }
}
