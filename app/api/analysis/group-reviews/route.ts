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

    await User.findByIdAndUpdate(user._id, {
      analysisStatus: {
        inProgress: false,
        completedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: "Review grouping complete"
    });
  } catch (error) {
    console.error("Group reviews error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
