import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { createCheckoutSession, PaymentError } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const req = new NextRequest(`${protocol}://${host}`, {
      headers: { cookie: headersList.get("cookie") || "" },
    });

    const token = await getToken({ req });

    if (!token?.id || !token?.email) {
      return NextResponse.json({ error: "Please log in to continue" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(token.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.hasPaid) {
      return NextResponse.json({ alreadyPaid: true });
    }

    const session = await createCheckoutSession({
      email: token.email,
      name: (token.name as string) || undefined,
      userId: token.id,
    });

    if (session.session_id) {
      user.dodoCheckoutSessionId = session.session_id;
      await user.save();
    }

    return NextResponse.json({
      sessionId: session.session_id,
      checkoutUrl: session.checkout_url,
    });
  } catch (error: unknown) {
    console.error("Payment checkout error:", error instanceof Error ? error.message : error);
    if (error instanceof PaymentError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: "Unable to create payment. Please try again." },
      { status: 503 }
    );
  }
}
