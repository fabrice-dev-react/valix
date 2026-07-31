import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getCheckoutSession, getPayment, isPaidStatus, PaymentError } from "@/lib/payments";

export const dynamic = "force-dynamic";

type VerifyBody = {
  sessionId?: unknown;
  paymentId?: unknown;
};

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

    let body: VerifyBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const bodySessionId = typeof body.sessionId === "string" ? body.sessionId : null;
    const bodyPaymentId = typeof body.paymentId === "string" ? body.paymentId : null;

    await connectDB();
    const user = await User.findById(token.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const storedSessionId =
      typeof user.dodoCheckoutSessionId === "string" ? user.dodoCheckoutSessionId : null;

    let paid = user.hasPaid || false;
    let paymentCustomerId: string | null = null;
    let resolvedPaymentId: string | null = null;
    let status: string | null = null;

    const checkPayment = async (id: string): Promise<boolean> => {
      try {
        const payment = await getPayment(id);
        status = payment.status;
        resolvedPaymentId = payment.payment_id;
        paymentCustomerId = payment.customer?.customer_id ?? null;

        const metaUserId =
          typeof payment.metadata?.user_id === "string" ? payment.metadata.user_id : null;
        if (metaUserId && metaUserId !== token.id) {
          throw new PaymentError("This payment does not belong to your account.", 403);
        }
        return isPaidStatus(status);
      } catch (error) {
        if (error instanceof PaymentError && error.status === 404) {
          return false;
        }
        throw error;
      }
    };

    const checkSession = async (id: string): Promise<boolean> => {
      const session = await getCheckoutSession(id);
      status = session.payment_status;

      if (session.payment_id) {
        const payment = await getPayment(session.payment_id);
        const metaUserId =
          typeof payment.metadata?.user_id === "string" ? payment.metadata.user_id : null;
        if (metaUserId && metaUserId !== token.id) {
          throw new PaymentError("This payment does not belong to your account.", 403);
        }
        resolvedPaymentId = payment.payment_id;
        paymentCustomerId = payment.customer?.customer_id ?? null;
        status = payment.status;
      }

      return isPaidStatus(status);
    };

    if (bodyPaymentId) {
      if (await checkPayment(bodyPaymentId)) paid = true;
    }

    if (!paid) {
      for (const candidate of [bodySessionId, storedSessionId]) {
        if (!candidate || resolvedPaymentId) continue;
        try {
          if (await checkSession(candidate)) {
            paid = true;
            break;
          }
        } catch (error) {
          if (error instanceof PaymentError && error.status === 403) {
            return NextResponse.json({ error: error.message }, { status: 403 });
          }
          if (!(error instanceof PaymentError && error.status === 404)) {
            throw error;
          }
        }
      }
    }

    if (paid && !user.hasPaid) {
      user.hasPaid = true;
      user.plan = "pro";
      user.paymentDate = new Date();
      if (resolvedPaymentId) user.lastPaymentId = resolvedPaymentId;
      if (paymentCustomerId) user.dodoCustomerId = paymentCustomerId;
      await user.save();
      console.log(`[dodo] user ${user.email} marked as paid via ${resolvedPaymentId || "session"}`);
    }

    console.log(
      `[dodo] verify user=${user.email} paymentId=${bodyPaymentId || "-"} sessionId=${bodySessionId || "-"} status=${status} paid=${paid}`
    );

    return NextResponse.json({ paid, status });
  } catch (error: unknown) {
    console.error("Payment verify error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Unable to confirm your payment. Please try again." },
      { status: 503 }
    );
  }
}
