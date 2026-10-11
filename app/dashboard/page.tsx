"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Globe,
  Info,
  Link2,
  Loader2,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react";

const CONTACT_METHODS = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, placeholder: "+250 700 000 000" },
  { id: "email", label: "Email", icon: Mail, placeholder: "you@company.com" },
  { id: "phone", label: "Phone call", icon: Phone, placeholder: "+250 700 000 000" },
  { id: "telegram", label: "Telegram", icon: Send, placeholder: "@yourhandle" },
] as const;

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-soft/40 focus:outline-none focus:ring-2 focus:ring-signal/25 focus:border-signal transition-all";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft font-semibold">
      {children}
    </label>
  );
}

type Intake = {
  productName: string;
  websiteUrl: string;
  notes: string;
  contactMethod: string;
  contactDetail: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState<Intake>({
    productName: "",
    websiteUrl: "",
    notes: "",
    contactMethod: "whatsapp",
    contactDetail: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const displayName = session?.user?.name || "";
  const firstName = displayName.split(" ")[0] || "";

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/intake");
        const data = await res.json();
        if (!active) return;
        const i = data?.intake || {};
        const method = i.contactMethod || "whatsapp";
        const detail = i.contactDetail || "";
        setForm({
          productName: i.productName || "",
          websiteUrl: i.websiteUrl || "",
          notes: i.notes || "",
          contactMethod: method,
          // Only pre-fill the login email when email is the chosen channel.
          contactDetail: method === "email" ? detail || session?.user?.email || "" : detail,
        });
        setHasPaid(typeof data?.hasPaid === "boolean" ? data.hasPaid : true);
        setSavedAt(data?.submittedAt || null);
      } catch {
        setForm((prev) => ({ ...prev }));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [session?.user?.email]);

  const set = <K extends keyof Intake>(key: K, value: Intake[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const activeContact =
    CONTACT_METHODS.find((m) => m.id === form.contactMethod) ?? CONTACT_METHODS[0];

  const startCheckout = async () => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/payments/checkout", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (data.alreadyPaid) {
        setHasPaid(true);
        return;
      }
      if (!res.ok || !data.checkout_url) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }
      window.location.href = data.checkout_url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/intake", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Couldn't send your details. Please try again.");
        return;
      }
      setSavedAt(new Date().toISOString());

      // First submission sends them straight to payment.
      if (!hasPaid) {
        router.push("/pricing");
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Couldn't send your details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const submittedLabel = savedAt
    ? new Date(savedAt).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="min-h-dvh bg-cream">
      {/* ============ TOP BAR ============ */}
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-xl border-b border-line">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="Valix"
              className="w-8 h-8 rounded-[9px] group-hover:scale-105 transition-transform"
            />
            <span className="text-[17px] font-bold tracking-tight text-ink">Valix</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-full p-1 pr-2 hover:bg-mist/70 transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff9a7a] to-[#ff4d2f] text-white flex items-center justify-center text-[13px] font-bold">
                {(displayName?.[0] || session?.user?.email?.[0] || "V").toUpperCase()}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-ink-soft transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-40 w-64 rounded-2xl border border-line bg-paper shadow-xl overflow-hidden animate-[slideIn_0.2s_ease]">
                  <div className="px-4 py-3.5 border-b border-line">
                    <p className="text-[13.5px] font-bold text-ink truncate">
                      {displayName || "Your account"}
                    </p>
                    <p className="text-[11.5px] text-ink-soft truncate mt-0.5">
                      {session?.user?.email}
                    </p>
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-ink hover:bg-mist/60 transition-colors"
                  >
                    <Settings2 className="w-4 h-4 text-ink-soft" />
                    Settings
                  </Link>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-ink hover:bg-mist/60 transition-colors border-t border-line"
                  >
                    <CreditCard className="w-4 h-4 text-ink-soft" />
                    Billing — $97/mo
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-signal hover:bg-signal-soft/50 transition-colors border-t border-line"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============ FORM ============ */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 pb-24">
        <h1 className="text-[26px] sm:text-[34px] font-extrabold tracking-[-0.03em] leading-[1.1] text-ink">
          {firstName ? `Hi ${firstName}, ` : ""}let&apos;s get your videos started.
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
          Three quick details and you&apos;re done — we&apos;ll take it from there.
        </p>

        {!hasPaid && !loading && (
          <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-signal/25 bg-signal-soft p-5">
            <span className="w-11 h-11 shrink-0 rounded-xl bg-signal text-white flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] font-bold text-ink">Start your month to go live</p>
              <p className="mt-0.5 text-[13px] text-ink-soft">
                $97/mo for 12 videos. First edit within 24 hours of payment.
              </p>
            </div>
            <button
              onClick={startCheckout}
              disabled={checkoutLoading}
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-signal px-5 py-2.5 text-[14px] font-bold text-white hover:bg-signal-dark transition-colors disabled:opacity-60"
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Redirecting…
                </>
              ) : (
                <>
                  Pay $97
                  <CreditCard className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {savedAt && (
          <div className="mt-7 rounded-2xl border border-moss/25 bg-[#edf7ef] p-5 flex items-start gap-4">
            <span className="w-11 h-11 shrink-0 rounded-xl bg-moss text-white flex items-center justify-center">
              <Check className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[14.5px] font-bold text-ink">We&apos;ve got it</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">
                Sent {submittedLabel}. We&apos;ll message you on{" "}
                <span className="font-semibold text-ink">
                  {activeContact.label.toLowerCase()}
                </span>{" "}
                within 24 hours with your first video link.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-signal/30 bg-signal-soft px-4 py-3 text-[13.5px] font-semibold text-signal-dark">
            <Info className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="shrink-0 text-signal-dark/60 hover:text-signal-dark"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="mt-8 h-64 rounded-2xl border border-line bg-paper skeleton-bar" />
        ) : (
          <form
            onSubmit={submit}
            className="mt-8 rounded-2xl border border-line bg-paper p-6 sm:p-8"
          >
            <div className="space-y-6">
              {/* SaaS name */}
              <div>
                <Label>SaaS name</Label>
                <input
                  value={form.productName}
                  onChange={(e) => set("productName", e.target.value)}
                  placeholder="Ventaz AI"
                  required
                  className={inputClass}
                />
              </div>

              {/* SaaS URL */}
              <div>
                <Label>SaaS URL</Label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 mt-1 -translate-y-1/2 w-4 h-4 text-ink-soft/50" />
                  <input
                    value={form.websiteUrl}
                    onChange={(e) => set("websiteUrl", e.target.value)}
                    placeholder="https://yourproduct.com"
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Notes — optional */}
              <div>
                <Label>Anything else we should know?</Label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={3}
                  maxLength={4000}
                  placeholder="Optional — links to footage, a tone you like, deadlines, or anything you want to tell us."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Contact method */}
              <div>
                <Label>How should we reach you?</Label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CONTACT_METHODS.map((m) => {
                    const on = form.contactMethod === m.id;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          set("contactMethod", m.id);
                          if (m.id === "email") {
                            // Seed with their login email, but let them overwrite it.
                            set("contactDetail", session?.user?.email || "");
                          } else if (
                            form.contactDetail === session?.user?.email
                          ) {
                            // Don't leave a stale email sitting in a phone field.
                            set("contactDetail", "");
                          }
                        }}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 transition-all duration-200 ${
                          on
                            ? "border-signal bg-signal-soft text-signal-dark"
                            : "border-line bg-paper text-ink-soft hover:border-ink/15"
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                        <span className="text-[12.5px] font-semibold">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
                <input
                  value={form.contactDetail}
                  onChange={(e) => set("contactDetail", e.target.value)}
                  placeholder={activeContact.placeholder}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* How it works */}
            <div className="mt-7 rounded-xl bg-cream border border-line p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft/70">
                What happens next
              </p>
              <ol className="mt-3 space-y-2.5">
                {[
                  "We message you on the number above to confirm the brief.",
                  "We send you a private Google Drive folder — every video lands there.",
                  "Your first edit lands within 24 hours of payment.",
                ].map((line, i) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-ink text-white flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-[13px] leading-relaxed text-ink-soft">{line}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 pt-4 border-t border-line flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-soft/80">
                <Link2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-signal" />
                You don&apos;t need to set up Drive or upload anything — we create the folder and
                share it with you.
              </p>
            </div>

            {/* Submit */}
            <div className="mt-7">
              <button
                type="submit"
                disabled={saving}
                className="group w-full inline-flex items-center justify-center gap-3 px-6 pr-3 py-3 rounded-full bg-signal text-white text-[15px] font-bold hover:bg-signal-dark transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_20px_50px_-14px_rgba(255,77,47,0.6)]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <span>{savedAt ? "Update details" : "Send details"}</span>
                    <span className="w-8 h-8 shrink-0 rounded-full bg-white flex items-center justify-center">
                      <Check className="w-4 h-4 text-signal" />
                    </span>
                  </>
                )}
              </button>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-ink-soft">
                <ShieldCheck className="w-3.5 h-3.5 text-moss" />
                <Clock className="w-3.5 h-3.5 text-moss" />
                First edit within 24 hours — refundable if it&apos;s not right
              </p>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}