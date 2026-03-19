import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email already verified", alreadyVerified: true },
        { status: 200 }
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { message: "Verification email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    console.log("Verification request - token:", token);

    if (!token) {
      return NextResponse.redirect(new URL("/verify-email?error=no-token", request.url));
    }

    await connectDB();

    console.log("Looking for user with token:", token);
    const user = await User.findOne({ verificationToken: token });
    console.log("Found user:", user);

    if (!user) {
      return NextResponse.redirect(new URL("/verify-email?error=invalid", request.url));
    }

    user.isEmailVerified = true;
    user.verifiedAt = new Date();
    user.verificationToken = undefined;
    await user.save();

    console.log("Email verified successfully for:", user.email);
    return NextResponse.redirect(new URL("/login?verified=true", request.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/verify-email?error=failed", request.url));
  }
}
