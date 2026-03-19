import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

export async function PUT(request: Request) {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to update tech stack");
    }

    const { techStack } = await request.json();

    await connectDB();

    const user = await User.findById(authUser.id);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    user.techStack = techStack || [];
    await user.save();

    return NextResponse.json({
      message: "Tech stack updated successfully",
      techStack: user.techStack,
    });
  } catch (error: any) {
    console.error("Update tech stack error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}