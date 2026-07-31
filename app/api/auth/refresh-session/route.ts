import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decode, encode } from "next-auth/jwt";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.getAll().find((c) => c.name.includes("session-token"));

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = await decode({
      token: sessionCookie.value,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!token?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: token.email }).select("name email onboardingCompleted hasPaid");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedToken = {
      ...token,
      onboardingCompleted: user.onboardingCompleted,
      hasPaid: user.hasPaid || false,
    };

    const encoded = await encode({
      token: updatedToken,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    cookieStore.set(sessionCookie.name, encoded, {
      httpOnly: true,
      sameSite: "lax",
      secure: sessionCookie.name.startsWith("__Secure-"),
      path: "/",
    });

    return NextResponse.json({
      hasPaid: user.hasPaid || false,
      onboardingCompleted: user.onboardingCompleted,
      name: user.name,
      email: user.email,
    });
  } catch (error: unknown) {
    console.error("Refresh session error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to refresh session" }, { status: 500 });
  }
}
