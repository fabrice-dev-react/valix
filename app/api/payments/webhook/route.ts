import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { Webhook } from "standardwebhooks";

export const runtime = "nodejs";

interface WebhookEvent {
  type?: string;
  data?: {
    payload_type?: string;
    payment_id?: string;
    checkout_session_id?: string;
    metadata?: Record<string, unknown>;
    customer?: { customer_id?: string; email?: string };
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  const secret = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: WebhookEvent;
  try {
    const webhook = new Webhook(secret);
    event = webhook.verify(rawBody, {
      "webhook-id": request.headers.get("webhook-id") || "",
      "webhook-timestamp": request.headers.get("webhook-timestamp") || "",
      "webhook-signature": request.headers.get("webhook-signature") || "",
    }) as WebhookEvent;
  } catch (error: unknown) {
    console.error(
      "Webhook signature verification failed:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    if (event?.type !== "payment.succeeded") {
      return NextResponse.json({ received: true });
    }

    const data = event.data || {};
    const metadata = data.metadata || {};
    const userId = typeof metadata.user_id === "string" ? metadata.user_id : "";
    const customerEmail =
      typeof data.customer?.email === "string" ? data.customer.email.toLowerCase() : "";

    await connectDB();

    const update: Record<string, unknown> = {
      hasPaid: true,
      paymentDate: new Date(),
    };
    if (data.payment_id) update.lastPaymentId = data.payment_id;
    if (data.checkout_session_id) update.dodoCheckoutSessionId = data.checkout_session_id;
    if (data.customer?.customer_id) update.dodoCustomerId = data.customer.customer_id;

    if (userId) {
      await User.updateOne({ _id: userId }, { $set: update });
    } else if (customerEmail) {
      await User.updateOne({ email: customerEmail }, { $set: update });
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Webhook handling error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}