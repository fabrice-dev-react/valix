import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyWebhookSignature(
  payload: string,
  webhookId: string,
  timestamp: string,
  signatureHeader: string
): boolean {
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

  if (!secret) {
    console.warn("DODO_PAYMENTS_WEBHOOK_KEY is not set — skipping webhook signature verification.");
    return true;
  }

  const signedContent = `${webhookId}.${timestamp}.${payload}`;
  const expectedHex = crypto
    .createHmac("sha256", secret)
    .update(signedContent)
    .digest("hex");
  const expectedBase64 = crypto
    .createHmac("sha256", secret)
    .update(signedContent)
    .digest("base64");

  const signatures = signatureHeader
    .split(" ")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const signature of signatures) {
    const [, value] = signature.split(",");
    if (!value) continue;
    if (safeEqual(value, expectedHex) || safeEqual(value, expectedBase64)) {
      return true;
    }
  }

  return false;
}

type WebhookEvent = {
  type?: unknown;
  data?: {
    payment_id?: unknown;
    customer?: {
      customer_id?: unknown;
      email?: unknown;
    };
    metadata?: Record<string, unknown>;
  };
};

export async function POST(request: Request) {
  const raw = await request.text();

  const webhookId = request.headers.get("webhook-id") || "";
  const timestamp = request.headers.get("webhook-timestamp") || "";
  const signature = request.headers.get("webhook-signature") || "";

  if (!verifyWebhookSignature(raw, webhookId, timestamp, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: WebhookEvent;
  try {
    event = JSON.parse(raw) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const type = typeof event.type === "string" ? event.type : "";
  const data = event.data || {};

  if (
    type === "payment.succeeded" ||
    type === "subscription.active" ||
    type === "subscription.updated"
  ) {
    try {
      await connectDB();

      const meta = data.metadata || {};
      const userId = typeof meta.user_id === "string" ? meta.user_id : null;
      const email = typeof data.customer?.email === "string" ? data.customer.email : null;
      const paymentId = typeof data.payment_id === "string" ? data.payment_id : null;
      const customerId =
        typeof data.customer?.customer_id === "string" ? data.customer.customer_id : null;

      let user = null;
      if (userId) user = await User.findById(userId);
      if (!user && email) user = await User.findOne({ email });

      if (user && !user.hasPaid) {
        user.hasPaid = true;
        user.plan = "pro";
        user.paymentDate = new Date();
        if (paymentId) user.lastPaymentId = paymentId;
        if (customerId) user.dodoCustomerId = customerId;
        await user.save();
        console.log(`[dodo-webhook] ${type} → user ${user.email} marked as paid`);
      }
    } catch (error: unknown) {
      console.error("Dodo webhook processing error:", error instanceof Error ? error.message : error);
    }
  }

  return NextResponse.json({ received: true });
}
