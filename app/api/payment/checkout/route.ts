import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PADDLE_URL_BOOK = process.env.PADDLE_URL_BOOK;

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.id) {
      return NextResponse.json({ error: "Please log in to continue" }, { status: 401 });
    }

    if (!PADDLE_URL_BOOK) {
      return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const successUrl = `${origin}/payment-processing?paid=true`;
    const cancelUrl = `${origin}/pricing?cancelled=true`;

    const separator = PADDLE_URL_BOOK.includes("?") ? "&" : "?";
    const fullCheckoutUrl = `${PADDLE_URL_BOOK}${separator}success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;

    return NextResponse.json({
      checkoutUrl: fullCheckoutUrl,
    });
  } catch (error: unknown) {
    console.error("Payment checkout error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Unable to create payment. Please try again." },
      { status: 503 }
    );
  }
}
