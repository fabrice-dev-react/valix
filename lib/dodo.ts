const DODO_BASE = () =>
  process.env.DODO_PAYMENTS_ENVIRONMENT === "live" ||
  process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com";

export function dodoHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
  };
}

export async function createDodoCheckoutSession(
  body: Record<string, unknown>
): Promise<{ session_id?: string; checkout_url?: string | null }> {
  const res = await fetch(`${DODO_BASE()}/checkouts`, {
    method: "POST",
    headers: dodoHeaders(),
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      `Dodo checkout error ${res.status}: ${JSON.stringify(data).slice(0, 300)}`
    );
  }

  return data as { session_id?: string; checkout_url?: string | null };
}

export async function fetchDodoPayment(paymentId: string) {
  const res = await fetch(`${DODO_BASE()}/payments/${paymentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(`Dodo payment fetch error ${res.status}`);
  }

  return data;
}