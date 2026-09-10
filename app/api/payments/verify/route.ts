import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";
import { fetchDodoPayment } from "@/lib/dodo";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to verify payment");
    }

    const body = await request.json().catch(() => ({}));
    const paymentId = typeof body.payment_id === "string" ? body.payment_id.trim() : "";

    if (!paymentId) {
      return NextResponse.json(
        { verified: false, error: "Missing payment_id" },
        { status: 400 }
      );
    }

    const payment = await fetchDodoPayment(paymentId);
    if (!payment || !payment.payment_id) {
      return NextResponse.json(
        { verified: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    const metadata = payment.metadata || {};
    const metaUserId = typeof metadata.user_id === "string" ? metadata.user_id : null;

    if (metaUserId && metaUserId !== authUser.id) {
      return NextResponse.json(
        { verified: false, error: "Payment does not belong to this account" },
        { status: 403 }
      );
    }

    if (payment.status !== "succeeded") {
      return NextResponse.json({ verified: false, status: payment.status || "unknown" });
    }

    await connectDB();
    const user = await User.findById(authUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.hasPaid) {
      user.hasPaid = true;
      user.paymentDate = new Date();
      user.lastPaymentId = payment.payment_id;
      user.dodoCustomerId = payment.customer?.customer_id || user.dodoCustomerId;
      user.dodoCheckoutSessionId = payment.checkout_session_id || user.dodoCheckoutSessionId;
      await user.save();
    }

    return NextResponse.json({ verified: true });
  } catch (error: unknown) {
    console.error("Verify payment error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { verified: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}