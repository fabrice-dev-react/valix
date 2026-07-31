import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

export async function GET() {
  try {
    let user;
    try {
      user = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to access this resource");
    }

    await connectDB();

    const userData = await User.findById(user._id);

    return NextResponse.json({
      name: userData?.name || user.name || "",
      email: userData?.email || user.email || "",
      websiteUrl: userData?.websiteUrl || "",
      productName: userData?.productName || "",
      onboardingCompleted: userData?.onboardingCompleted || false,
    });
  } catch (error: unknown) {
    console.error("Get user data error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Unable to fetch user data. Please try again." },
      { status: 503 }
    );
  }
}
