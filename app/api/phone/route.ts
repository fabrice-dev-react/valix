import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

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

    return NextResponse.json({
      phoneStatus: user.phoneStatus || "not_connected",
      phoneNumber: user.phoneNumber || "",
      phoneConnectedAt: user.phoneConnectedAt || undefined,
    });
  } catch (error: unknown) {
    console.error("Get phone status error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in");
    }

    const body = await request.json();
    await connectDB();

    const user = await User.findById(authUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // "connect" starts the onboarding of a real phone provider. There is no
    // backend provider yet, so the status is set to "pending" — it is never
    // faked as connected. The user's phone number is stored as the number
    // they intend to forward calls from.
    if (body.action === "connect") {
      if (user.phoneStatus === "connected") {
        return NextResponse.json({ phoneStatus: user.phoneStatus, phoneNumber: user.phoneNumber });
      }
      user.phoneStatus = "pending";
      if (typeof body.phoneNumber === "string" && body.phoneNumber.trim()) {
        user.phoneNumber = body.phoneNumber.trim();
      }
      await user.save();
      return NextResponse.json({
        phoneStatus: "pending",
        phoneNumber: user.phoneNumber,
        message:
          "Connection requested. We&apos;ll finalize your number forwarding with our telephony provider.",
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Connect phone error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
