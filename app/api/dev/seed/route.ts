import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seeding is only available in development" },
      { status: 403 }
    );
  }

  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in");
    }

    await connectDB();
    const user = await User.findById(authUser._id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.onboardingCompleted) {
      user.onboardingCompleted = true;
      user.onboardingStep = 8;
      await user.save();
    }

    if (!user.sideHustleProfile) {
      user.sideHustleProfile = {};
    }
    const sh = user.sideHustleProfile;
    if (!sh.monthlyIncomeGoal) sh.monthlyIncomeGoal = "1000-3000";
    if (!sh.weeklyTimeCommitment) sh.weeklyTimeCommitment = "5-15";
    if (!sh.startupCapital) sh.startupCapital = "100-500";
    if (!sh.skills || !sh.skills.length) sh.skills = ["writing", "social"];
    if (!sh.comfortableWithPeople) sh.comfortableWithPeople = "yes";
    if (!sh.languages || !sh.languages.length) sh.languages = ["english"];
    if (!sh.interests || !sh.interests.length) sh.interests = ["content-creation", "freelancing"];
    await user.save();

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("Seed error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}