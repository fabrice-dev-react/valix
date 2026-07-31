const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY || "";
const DODO_PRODUCT_ID = process.env.DODO_PAYMENTS_PRODUCT_ID || "";
const DODO_ENVIRONMENT = process.env.DODO_PAYMENTS_ENVIRONMENT || "live";
const DODO_BASE_URL =
  DODO_ENVIRONMENT === "test"
    ? "https://test.dodopayments.com"
    : "https://live.dodopayments.com";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const PLAN_PRICE = 39;

export class PaymentError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.name = "PaymentError";
    this.status = status;
  }
}

export type CheckoutSession = {
  session_id: string;
  checkout_url: string | null;
};

export type CheckoutSessionStatus = {
  id: string;
  created_at: string;
  customer_email: string | null;
  customer_name: string | null;
  payment_id: string | null;
  payment_status: string | null;
  metadata?: Record<string, string | number | boolean>;
};

export type Payment = {
  payment_id: string;
  status: string | null;
  checkout_session_id: string | null;
  created_at: string;
  total_amount: number;
  currency: string;
  metadata?: Record<string, string | number | boolean>;
  customer?: {
    customer_id: string;
    name: string;
    email: string;
  };
};

type DodoJson = Record<string, unknown>;

async function dodoFetch(path: string, init?: RequestInit): Promise<DodoJson> {
  if (!DODO_API_KEY) {
    throw new PaymentError("Dodo Payments is not configured.", 503);
  }

  const res = await fetch(`${DODO_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DODO_API_KEY}`,
      ...(init?.headers || {}),
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (body as DodoJson)?.detail ||
      (body as DodoJson)?.message ||
      (body as DodoJson)?.error ||
      `Dodo Payments request failed (${res.status}).`;
    console.error(`[dodo] ${res.status} ${init?.method || "GET"} ${DODO_BASE_URL}${path} →`, JSON.stringify(body));
    throw new PaymentError(typeof message === "string" ? message : String(message), res.status);
  }

  return body as DodoJson;
}

type CheckoutSessionInput = {
  email: string;
  name?: string;
  userId: string;
};

export async function createCheckoutSession({ email, name, userId }: CheckoutSessionInput) {
  const body = await dodoFetch("/checkouts", {
    method: "POST",
    body: JSON.stringify({
      product_cart: [
        {
          product_id: DODO_PRODUCT_ID,
          quantity: 1,
        },
      ],
      customer: {
        email,
        ...(name ? { name } : {}),
      },
      return_url: `${APP_URL}/payment/success`,
      cancel_url: `${APP_URL}/payment?cancelled=1`,
      metadata: {
        user_id: userId,
      },
      feature_flags: {
        allow_discount_code: false,
        allow_currency_selection: false,
        allow_customer_editing_email: false,
        allow_customer_editing_name: false,
      },
    }),
  });

  const session: CheckoutSession = {
    session_id: typeof body.session_id === "string" ? body.session_id : "",
    checkout_url: typeof body.checkout_url === "string" ? body.checkout_url : null,
  };

  return session;
}

export async function getCheckoutSession(sessionId: string): Promise<CheckoutSessionStatus> {
  const body = await dodoFetch(`/checkouts/${encodeURIComponent(sessionId)}`);
  return {
    id: typeof body.id === "string" ? body.id : sessionId,
    created_at: typeof body.created_at === "string" ? body.created_at : "",
    customer_email: typeof body.customer_email === "string" ? body.customer_email : null,
    customer_name: typeof body.customer_name === "string" ? body.customer_name : null,
    payment_id: typeof body.payment_id === "string" ? body.payment_id : null,
    payment_status: typeof body.payment_status === "string" ? body.payment_status : null,
    metadata: isMetadata(body.metadata) ? body.metadata : undefined,
  };
}

export async function getPayment(paymentId: string): Promise<Payment> {
  const body = await dodoFetch(`/payments/${encodeURIComponent(paymentId)}`);
  const customer = body.customer as { customer_id?: unknown; name?: unknown; email?: unknown } | undefined;

  return {
    payment_id: typeof body.payment_id === "string" ? body.payment_id : paymentId,
    status: typeof body.status === "string" ? body.status : null,
    checkout_session_id: typeof body.checkout_session_id === "string" ? body.checkout_session_id : null,
    created_at: typeof body.created_at === "string" ? body.created_at : "",
    total_amount: typeof body.total_amount === "number" ? body.total_amount : 0,
    currency: typeof body.currency === "string" ? body.currency : "",
    metadata: isMetadata(body.metadata) ? body.metadata : undefined,
    customer:
      customer && typeof customer.email === "string"
        ? {
            customer_id: typeof customer.customer_id === "string" ? customer.customer_id : "",
            name: typeof customer.name === "string" ? customer.name : "",
            email: customer.email,
          }
        : undefined,
  };
}

function isMetadata(value: unknown): value is Record<string, string | number | boolean> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function isPaidStatus(status: string | null | undefined): boolean {
  return status === "succeeded";
}
