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

    if (plan !== "book") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        plan: "book",
        paymentDate: new Date(),
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
    });
  } catch (error: unknown) {
    console.error("Payment processing error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Unable to process payment. Please contact support." },
      { status: 503 }
    );
  }
}
