import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { plan, success } = body;

    if (!success) {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    if (!plan || !["starter", "growth", "book"].includes(plan)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await connectDB();

    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        plan,
        paymentDate: new Date(),
        nextResetDate: nextReset,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      plan: updatedUser.plan,
      paymentDate: updatedUser.paymentDate,
      nextResetDate: updatedUser.nextResetDate,
    });
  } catch (error: unknown) {
    console.error("Payment processing error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Unable to process payment. Please contact support." },
      { status: 503 }
    );
  }
}
