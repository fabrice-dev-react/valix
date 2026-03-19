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
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userPlatforms = userData.platforms || [];

    return NextResponse.json({ platforms: userPlatforms });
  } catch (error) {
    console.error("Get platforms error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let user;
    try {
      user = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to access this resource");
    }

    const { platform, action } = await request.json();

    await connectDB();

    const userData = await User.findById(user._id);
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let platforms = userData.platforms || [];

    if (action === "enable") {
      if (!platforms.includes(platform)) {
        platforms.push(platform);
      }
    } else if (action === "disable") {
      platforms = platforms.filter((p: string) => p !== platform);
    }

    await User.findByIdAndUpdate(user._id, { platforms });

    return NextResponse.json({ message: "Platform updated successfully", platforms });
  } catch (error) {
    console.error("Update platform error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
