"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Check, Loader, Phone, PhoneForwarded, ShieldCheck } from "lucide-react";

type PhoneState = {
  phoneStatus: string;
  phoneNumber: string;
};

export default function PhonePage() {
  const router = useRouter();
  const { status } = useSession();
  const [phone, setPhone] = useState<PhoneState>({ phoneStatus: "not_connected", phoneNumber: "" });
  const [number, setNumber] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/phone");
        const data = await res.json();
        if (!cancelled) {
          setPhone({
            phoneStatus: data.phoneStatus || "not_connected",
            phoneNumber: data.phoneNumber || "",
          });
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  const connectPhone = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect", phoneNumber: number }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setPhone({ phoneStatus: data.phoneStatus || "pending", phoneNumber: data.phoneNumber || number });
      await fetch("/api/auth/refresh-session", { method: "POST" });
      router.replace("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  const goToDashboard = () => {
    fetch("/api/auth/refresh-session", { method: "POST" })
      .catch(() => {})
      .finally(() => router.replace("/dashboard"));
  };

  if (status === "loading" || !loaded) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">One moment</span>
        </div>
      </div>
    );
  }

  const started = phone.phoneStatus === "pending" || phone.phoneStatus === "connected";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="border-b border-line bg-paper/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Valix" className="w-8 h-8 rounded-[9px]" />
            <span className="text-[17px] font-bold tracking-tight text-ink">Valix</span>
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">Step 3 of 3</span>
        </div>
        <div className="h-0.5 bg-line">
          <div className="h-full bg-signal" style={{ width: "100%" }} />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-12 rounded-xl bg-moss/15 flex items-center justify-center">
                <Phone className="w-6 h-6 text-moss" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
                  Connect your business phone
                </h1>
                <p className="text-[14px] text-ink-soft mt-1">
                  Forward your missed calls to Valix so nothing slips through.
                </p>
              </div>
            </div>

            <div className="bg-paper rounded-3xl border border-line p-6 sm:p-8">
              {started ? (
                <div className="text-center py-4">
                  <span className="inline-flex w-14 h-14 rounded-full bg-moss/15 items-center justify-center mb-4">
                    <Check className="w-7 h-7 text-moss" />
                  </span>
                  <h2 className="text-lg font-extrabold tracking-[-0.02em] text-ink">You&apos;re all set</h2>
                  <p className="text-[14px] text-ink-soft mt-2 leading-relaxed">
                    {phone.phoneNumber ? `We have ${phone.phoneNumber} queued up. ` : ""}
                    {phone.phoneStatus === "connected"
                      ? "Your phone is connected and Valix is standing by to recover your missed calls."
                      : "Your connection request is in progress — we&apos;re finalizing call forwarding with our telephony provider. Head to the dashboard to see your leads as they come in."}
                  </p>
                  <button
                    onClick={goToDashboard}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink text-white text-[14px] font-semibold px-6 py-3 hover:bg-black transition-colors"
                  >
                    Go to dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">
                      Your business phone number
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-[15px] text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-signal/50 focus:border-signal transition"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="+1 (512) 555-0100"
                      inputMode="tel"
                      autoFocus
                    />
                  </div>

                  {error && <p className="text-[13px] text-signal-dark">{error}</p>}

                  <button
                    onClick={connectPhone}
                    disabled={saving || !number.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white text-[14px] font-semibold px-6 py-3.5 hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader className="w-4 h-4 animate-spin" /> : <PhoneForwarded className="w-4 h-4" />}
                    {saving ? "Connecting…" : "Request connection"}
                  </button>

                  <p className="text-[12.5px] text-ink-soft leading-relaxed">
                    We&apos;ll use this number to set up call forwarding so that when you can&apos;t pick up, Valix
                    answers, qualifies the caller, and lists them as a lead. Only your missed calls are captured.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-start gap-2.5 text-[12.5px] text-ink-soft">
              <ShieldCheck className="w-4 h-4 shrink-0 text-moss mt-0.5" />
              <p>
                Your numbers stay private. Valix only sees your missed calls and never shares your business
                information. You can disconnect at any time from Settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
