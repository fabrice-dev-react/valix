import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";
import { createDodoCheckoutSession } from "@/lib/dodo";

export const runtime = "nodejs";

export async function POST() {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to continue to checkout");
    }

    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const productId = process.env.DODO_PAYMENTS_PRODUCT_ID;
    if (!apiKey || !productId) {
      return NextResponse.json({ error: "Payments are not configured yet" }, { status: 500 });
    }

    await connectDB();
    const user = await User.findById(authUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.hasPaid) {
      return NextResponse.json({ alreadyPaid: true, checkout_url: null });
    }

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

    const session = await createDodoCheckoutSession({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: {
        email: user.email,
        name: user.name || user.businessName || undefined,
      },
      return_url: `${baseUrl}/payment-processing`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: {
        user_id: user._id.toString(),
        email: user.email,
      },
      feature_flags: {
        redirect_immediately: true,
      },
    });

    if (!session.checkout_url) {
      return NextResponse.json({ error: "Checkout could not be created" }, { status: 502 });
    }

    if (session.session_id) {
      user.dodoCheckoutSessionId = session.session_id;
      await user.save();
    }

    return NextResponse.json({ checkout_url: session.checkout_url });
  } catch (error: unknown) {
    console.error("Checkout error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}