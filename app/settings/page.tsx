"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Building2,
  Sparkles,
  Phone,
  CreditCard,
  Check,
  Wifi,
  Loader,
} from "lucide-react";

type BusinessHours = { open: string; close: string; days: string[] };

type Profile = {
  name: string;
  email: string;
  businessName: string;
  businessType: string;
  businessDescription: string;
  services: string[];
  serviceArea: string;
  address: string;
  businessHours: BusinessHours;
  emergencyService: boolean;
  aiInstructions: string;
  aiTone: string;
  phoneNotifications: { callbacks: boolean; email: boolean };
  phoneStatus: string;
  phoneNumber: string;
  hasPaid: boolean;
};

const TABS = [
  { key: "business", label: "Business", icon: Building2 },
  { key: "ai", label: "AI Assistant", icon: Sparkles },
  { key: "phone", label: "Phone", icon: Phone },
  { key: "billing", label: "Billing", icon: CreditCard },
];

const businessTypes = [
  "Home services", "Medical / Dental", "Legal", "Salon / Spa", "Auto services",
  "Real estate", "Restaurant", "Fitness / Yoga", "Contractor / Trades", "Other",
];

const tones = [
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly" },
  { id: "concise", label: "Concise" },
];

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [p, setP] = useState<Profile>({
    name: "",
    email: "",
    businessName: "",
    businessType: "",
    businessDescription: "",
    services: [],
    serviceArea: "",
    address: "",
    businessHours: { open: "09:00", close: "17:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    emergencyService: false,
    aiInstructions: "",
    aiTone: "professional",
    phoneNotifications: { callbacks: true, email: true },
    phoneStatus: "not_connected",
    phoneNumber: "",
    hasPaid: false,
  });

  const tab = searchParams.get("tab") || "business";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/profile");
      const data = await res.json().catch(() => null);
      if (cancelled || !data) return;
      setP((prev) => ({
        ...prev,
        ...data,
        businessHours: data.businessHours || prev.businessHours,
        phoneNotifications: data.phoneNotifications || prev.phoneNotifications,
      }));
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setError(null);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3000);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: p.businessName,
          businessType: p.businessType,
          services: p.services,
          serviceArea: p.serviceArea,
          address: p.address,
          businessHours: p.businessHours,
          emergencyService: p.emergencyService,
          aiInstructions: p.aiInstructions,
          aiTone: p.aiTone,
          phoneNotifications: p.phoneNotifications,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to save");
      }
      showNotice("Saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const setTab = (key: string) => {
    router.replace(`/settings?tab=${key}`);
  };

  const connectPhone = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect", phoneNumber: p.phoneNumber }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not start connection");
      setP((prev) => ({ ...prev, phoneStatus: "pending" }));
      showNotice("Connection requested");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (d: string) => {
    const days = p.businessHours.days;
    setP((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        days: days.includes(d) ? days.filter((x) => x !== d) : [...days, d],
      },
    }));
  };

  if (sessionStatus === "loading" || !loaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">One moment</span>
        </div>
      </div>
    );
  }

  const tabBar = (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {TABS.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] font-semibold transition-all ${
              tab === t.key
                ? "border-ink bg-ink text-white"
                : "border-line bg-paper text-ink-soft hover:text-ink hover:border-ink/20"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        );
      })}
    </div>
  );

  const saveBar = (
    <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
      <div className="text-[13px]">
        {error ? <span className="text-signal-dark">{error}</span> : notice ? <span className="text-moss inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" />{notice}</span> : <span className="text-ink-soft">Changes are applied to how Valix handles your calls.</span>}
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-signal text-white text-[14px] font-semibold px-6 py-2.5 hover:bg-signal-dark transition-colors disabled:opacity-60"
      >
        {saving && <Loader className="w-4 h-4 animate-spin" />}
        Save changes
      </button>
    </div>
  );

  const field = "mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all";

  return (
    <div>
      <div className="pt-2 lg:pt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
          Settings
        </p>
        <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink">Settings</h1>
        <p className="mt-3 text-[15px] text-ink-soft max-w-md">
          Keep your business, AI, and phone in tune.
        </p>
      </div>

      <div className="mt-6">{tabBar}</div>

      <div className="mt-6 rounded-2xl border border-line bg-paper p-6 sm:p-8">
        {tab === "business" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-ink">Your business</h2>
              <p className="mt-1 text-[13px] text-ink-soft">Used to introduce you and understand your callers.</p>
            </div>
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">Business name</label>
              <input className={field} value={p.businessName} onChange={(e) => setP({ ...p, businessName: e.target.value })} />
            </div>
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">Business description</label>
              <textarea
                rows={4}
                value={p.businessDescription}
                onChange={(e) => setP({ ...p, businessDescription: e.target.value })}
                placeholder="e.g. Family-owned dental studio specialising in cosmetic and emergency dentistry."
                className={`${field} resize-none`}
              />
            </div>
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">Business type</label>
              <select
                className={`${field} appearance-none`}
                value={businessTypes.includes(p.businessType) ? p.businessType : (p.businessType ? "Other" : "")}
                onChange={(e) => setP({ ...p, businessType: e.target.value === "Other" ? "" : e.target.value })}
              >
                <option value="" disabled>Select your business type</option>
                {businessTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {saveBar}
          </div>
        )}

        {tab === "ai" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-ink">Your AI assistant</h2>
              <p className="mt-1 text-[13px] text-ink-soft">How Valix sounds and what it knows when it catches a missed call.</p>
            </div>
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">Tone</label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setP({ ...p, aiTone: t.id })}
                    className={`rounded-xl border px-4 py-3 text-[13.5px] font-semibold transition-all ${
                      p.aiTone === t.id ? "border-signal bg-signal-soft text-signal-dark" : "border-line bg-paper text-ink-soft hover:border-ink/20"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">Instructions</label>
              <textarea
                rows={5}
                value={p.aiInstructions}
                onChange={(e) => setP({ ...p, aiInstructions: e.target.value })}
                placeholder="e.g. Always offer the next available appointment slot and mention our Saturday hours."
                className={`${field} resize-none`}
              />
            </div>
            {saveBar}
          </div>
        )}

        {tab === "phone" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-ink">Connect your business phone</h2>
              <p className="mt-1 text-[13px] text-ink-soft">Forward your missed calls to Valix so nothing slips through.</p>
            </div>

            {p.phoneStatus === "connected" ? (
              <div className="flex items-start gap-3.5 rounded-2xl border border-moss/25 bg-moss/10 p-5">
                <span className="w-10 h-10 shrink-0 rounded-full bg-moss/15 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-moss" />
                </span>
                <div>
                  <p className="text-[14.5px] font-bold text-ink">Phone connected{p.phoneNumber ? ` · ${p.phoneNumber}` : ""}</p>
                  <p className="text-[13px] text-ink-soft mt-0.5">Missed calls are now forwarded to Valix.</p>
                </div>
              </div>
            ) : p.phoneStatus === "pending" ? (
              <div className="flex items-start gap-3.5 rounded-2xl border border-signal/25 bg-signal-soft p-5">
                <span className="w-10 h-10 shrink-0 rounded-full bg-signal/15 flex items-center justify-center">
                  <Loader className="w-5 h-5 text-signal-dark animate-spin" />
                </span>
                <div>
                  <p className="text-[14.5px] font-bold text-ink">Connection in progress</p>
                  <p className="text-[13px] text-ink-soft mt-0.5">
                    We&apos;re finalizing call forwarding with our telephony provider. Valix will go live and start
                    recovering your missed calls as soon as it&apos;s ready. You&apos;ll see the confirmation here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">Your business phone number</label>
                  <input
                    className={field}
                    value={p.phoneNumber}
                    onChange={(e) => setP({ ...p, phoneNumber: e.target.value })}
                    placeholder="+1 (512) 555-0100"
                    inputMode="tel"
                  />
                </div>
                <button
                  onClick={connectPhone}
                  disabled={saving || !p.phoneNumber.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-ink text-white text-[14px] font-semibold px-6 py-3 hover:bg-black transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                  Request connection
                </button>
                <p className="text-[12.5px] text-ink-soft leading-relaxed">
                  We&apos;ll use this number to set up call forwarding so that when you can&apos;t pick up, Valix
                  answers, qualifies the caller, and lists them as a lead. Only your missed calls are captured.
                </p>
              </div>
            )}
          </div>
        )}

        {tab === "billing" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-ink">Billing</h2>
              <p className="mt-1 text-[13px] text-ink-soft">Your plan and payment details.</p>
            </div>
            <div className="rounded-2xl border border-line bg-cream p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[15px] font-bold text-ink">Valix Pro</p>
                <p className="text-[13px] text-ink-soft">$97/month · {p.hasPaid ? "Active" : "Not active"}</p>
              </div>
              <Link
                href="/billing"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-ink text-white text-[13px] font-semibold px-5 py-2.5 hover:bg-black transition-colors"
              >
                Manage billing
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

