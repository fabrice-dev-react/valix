import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

const PROFILE_FIELDS = [
  "businessName",
  "businessType",
  "services",
  "serviceArea",
  "address",
  "businessHours",
  "emergencyService",
  "aiInstructions",
  "aiTone",
  "phoneNotifications",
];

const SIDE_HUSTLE_FIELDS = [
  "monthlyIncomeGoal",
  "weeklyTimeCommitment",
  "startupCapital",
  "skills",
  "willingToLearn",
  "comfortableWithPeople",
  "languages",
  "interests",
];

export async function GET() {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in");
    }

    await connectDB();
    const user = await User.findById(authUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile: Record<string, unknown> = {
      onboardingCompleted: user.onboardingCompleted || false,
      onboardingStep: user.onboardingStep ?? 0,
      hasPaid: user.hasPaid || false,
    };
    for (const f of PROFILE_FIELDS) {
      profile[f] = user[f] ?? (f === "services" ? [] : undefined);
    }

    const sh = user.sideHustleProfile || {};
    const shData: Record<string, unknown> = {};
    for (const f of SIDE_HUSTLE_FIELDS) {
      shData[f] = sh[f] ?? undefined;
    }
    profile.sideHustleProfile = shData;

    return NextResponse.json({ profile });
  } catch (error: unknown) {
    console.error("Get onboarding profile error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in");
    }

    const body = await request.json();
    await connectDB();

    const updateData: Record<string, unknown> = {};
    for (const f of PROFILE_FIELDS) {
      if (body[f] !== undefined) {
        updateData[f] = body[f];
      }
    }

    if (body.sideHustleProfile && typeof body.sideHustleProfile === "object") {
      const shUpdate: Record<string, unknown> = {};
      for (const f of SIDE_HUSTLE_FIELDS) {
        if (body.sideHustleProfile[f] !== undefined) {
          shUpdate[`sideHustleProfile.${f}`] = body.sideHustleProfile[f];
        }
      }
      Object.assign(updateData, shUpdate);
    }

    if (typeof body.onboardingStep === "number") {
      updateData.onboardingStep = body.onboardingStep;
    }
    if (body.onboardingCompleted === true) {
      updateData.onboardingCompleted = true;
    }

    await User.findByIdAndUpdate(authUser.id, updateData, { new: true });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("Save onboarding profile error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
