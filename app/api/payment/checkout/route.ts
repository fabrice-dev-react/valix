import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";

const PADDLE_URL_STARTER = process.env.PADDLE_URL_STARTER || "https://sandbox-pay.paddle.io/hsc_01kkxsk2d92ergtk5yv6tebgz1_p4w8h55pttr6y3fgfxbd5v0hyesmqe5p";
const PADDLE_URL_GROWTH = process.env.PADDLE_URL_GROWTH || "https://sandbox-pay.paddle.io/hsc_01kkxsm16v5gn0z9dmpym8g7fa_gn0gm78fq6cww9t4x3t6zrawk5z70nkn";
const PADDLE_URL_BOOK = process.env.PADDLE_URL_BOOK || "https://sandbox-pay.paddle.io/hsc_01kkxsk2d92ergtk5yv6tebgz1_p4w8h55pttr6y3fgfxbd5v0hyesmqe5p";
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const req = new NextRequest(`${protocol}://${host}`, {
      headers: { cookie: headersList.get("cookie") || "" },
    });

    const token = await getToken({ req });

    if (!token?.id) {
      return NextResponse.json({ error: "Please log in to continue" }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan || !["starter", "growth", "book"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    let checkoutUrl: string;
    if (plan === "book") {
      checkoutUrl = PADDLE_URL_BOOK;
    } else {
      checkoutUrl = plan === "starter" ? PADDLE_URL_STARTER : PADDLE_URL_GROWTH;
    }

    const successUrl = `${NEXT_PUBLIC_APP_URL}/payment-processing?plan=${plan}`;
    const cancelUrl = `${NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`;

    const separator = checkoutUrl.includes("?") ? "&" : "?";
    const fullCheckoutUrl = `${checkoutUrl}${separator}success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;

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
