import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const req = new NextRequest(`${protocol}://${host}`, {
      headers: { cookie: headersList.get("cookie") || "" },
    });

    const token = await getToken({ req });

    if (!token?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: token.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      plan: user.plan,
      onboardingCompleted: user.onboardingCompleted,
      name: user.name,
      email: user.email,
    });
  } catch (error: unknown) {
    console.error("Refresh session error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to refresh session" }, { status: 500 });
  }
}
