"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Phone,
  Sparkles,
  PhoneCall,
  Users,
  Wifi,
  Inbox,
} from "lucide-react";
import { formatRelativeDate, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from "@/lib/format";

type Lead = {
  id: string;
  name: string;
  phone: string;
  platform: string;
  missedAt: string;
  lastContactedAt?: string;
  summary: string;
  intent: string;
  nextBestAction: string;
  status: string;
};

type PhoneState = {
  phoneStatus: string;
  phoneNumber: string;
};

export default function DashboardPage() {
  const { status } = useSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [phone, setPhone] = useState<PhoneState>({ phoneStatus: "not_connected", phoneNumber: "" });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    (async () => {
      const [leadsRes, phoneRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/phone"),
      ]);
      if (cancelled) return;
      const leadsData = await leadsRes.json().catch(() => ({ leads: [] }));
      const phoneData = await phoneRes.json().catch(() => ({ phoneStatus: "not_connected", phoneNumber: "" }));

      // Dev preview only: if there are no leads yet, auto-load sample data so
      // the final look is visible. Safe in production (seed is disabled).
      if ((leadsData.leads || []).length === 0 && process.env.NODE_ENV !== "production") {
        const seedRes = await fetch("/api/dev/seed", { method: "POST" });
        const seedData = await seedRes.json().catch(() => ({ loaded: false }));
        if (seedData && seedData.count > 0) {
          const refetch = await fetch("/api/leads");
          const refetched = await refetch.json().catch(() => ({ leads: [] }));
          if (!cancelled) {
            setLeads(refetched.leads || []);
            const ph = await fetch("/api/phone").then((r) => r.json()).catch(() => ({}));
            setPhone({ phoneStatus: ph.phoneStatus || "not_connected", phoneNumber: ph.phoneNumber || "" });
            setLoaded(true);
            return;
          }
        }
      }

      if (cancelled) return;
      setLeads(leadsData.leads || []);
      setPhone({ phoneStatus: phoneData.phoneStatus || "not_connected", phoneNumber: phoneData.phoneNumber || "" });
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  const activeLeads = leads.filter((l) => ["new", "hot", "warm"].includes(l.status));
  const hotLeads = leads.filter((l) => l.status === "hot");
  const connected = phone.phoneStatus === "connected";

  const visibleLeads =
    filter === "all"
      ? leads
      : filter === "active"
      ? activeLeads
      : leads.filter((l) => l.status === filter);

  if (status === "loading" || !loaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">One moment</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="pt-2 lg:pt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
          Dashboard
        </p>
        <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink">
          Missed calls
        </h1>
        <p className="mt-3 text-[15px] text-ink-soft max-w-md">
          Every recovered caller, qualified by Valix and ready for your callback.
        </p>
      </div>

      {/* Phone connection banner */}
      {!connected && (
        <div className="mt-8 rounded-2xl border border-signal/25 bg-signal-soft p-5">
          <div className="flex items-start sm:items-center gap-3.5">
            <span className="w-10 h-10 shrink-0 rounded-full bg-signal/15 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-signal-dark" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] font-bold text-ink">
                {phone.phoneStatus === "pending" ? "Phone connection in progress" : "Connect your business phone"}
              </p>
              <p className="text-[13px] text-ink-soft">
                {phone.phoneStatus === "pending"
                  ? "We&apos;re finalizing call forwarding. Valix will start recovering missed calls as soon as it&apos;s live."
                  : "Forward your missed calls to Valix and start catching every lead before a competitor does."}
              </p>
            </div>
            <Link
              href="/settings?tab=phone"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-ink text-white text-[13px] font-semibold px-4 py-2.5 hover:bg-black transition-colors"
            >
              {phone.phoneStatus === "pending" ? "View status" : "Connect now"}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-line bg-paper p-4">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-signal" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Missed calls</span>
          </div>
          <p className="mt-2 text-[28px] font-extrabold text-ink leading-none">{leads.length}</p>
          <p className="mt-1 text-[12px] text-ink-soft">recovered</p>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-moss" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Ready to call</span>
          </div>
          <p className="mt-2 text-[28px] font-extrabold text-ink leading-none">{activeLeads.length}</p>
          <p className="mt-1 text-[12px] text-ink-soft">active leads</p>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-signal-dark" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Hot leads</span>
          </div>
          <p className="mt-2 text-[28px] font-extrabold text-ink leading-none">{hotLeads.length}</p>
          <p className="mt-1 text-[12px] text-ink-soft">high intent</p>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-4">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-ink-soft" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Phone status</span>
          </div>
          <p className="mt-2 text-[28px] font-extrabold text-ink leading-none">
            {connected ? "Live" : phone.phoneStatus === "pending" ? "Pending" : "Off"}
          </p>
          <p className="mt-1 text-[12px] text-ink-soft">{connected ? "calls forwarding" : "setup needed"}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
        {[
          { key: "all", label: "All" },
          { key: "active", label: "Active" },
          { key: "new", label: "New" },
          { key: "hot", label: "Hot" },
          { key: "warm", label: "Warm" },
          { key: "contacted", label: "Contacted" },
          { key: "lost", label: "Lost" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 px-4 py-2 rounded-full border text-[13px] font-semibold transition-all ${
              filter === f.key
                ? "border-ink bg-ink text-white"
                : "border-line bg-paper text-ink-soft hover:text-ink hover:border-ink/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Leads list */}
      <div className="mt-6 rounded-2xl border border-line bg-paper overflow-hidden">
        {visibleLeads.length === 0 ? (
          <EmptyLeads connected={connected} filter={filter} />
        ) : (
          <div className="divide-y divide-line">
            {visibleLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-cream/50 transition-colors"
              >
                <span className="w-10 h-10 shrink-0 rounded-full bg-mist flex items-center justify-center text-[14px] font-bold text-ink">
                  {(lead.name || lead.phone || "?").charAt(0).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14.5px] font-semibold text-ink truncate">
                      {lead.name || lead.phone}
                    </p>
                    {lead.platform && (
                      <span className="text-[11px] font-mono uppercase tracking-wide text-ink-soft bg-mist px-2 py-0.5 rounded-full">
                        {lead.platform}
                      </span>
                    )}
                  </div>
                  <p className="text-[12.5px] text-ink-soft truncate mt-0.5">
                    {lead.summary || lead.intent || "Intent pending"}
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[11px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-full ${LEAD_STATUS_COLORS[lead.status] || "bg-mist text-ink"}`}>
                    {LEAD_STATUS_LABELS[lead.status] || lead.status}
                  </span>
                  <span className="text-[12px] text-ink-soft">{formatRelativeDate(lead.missedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyLeads({ connected, filter }: { connected: boolean; filter: string }) {
  const filtered = filter && filter !== "all" && filter !== "active";
  return (
    <div className="px-6 py-14 text-center">
      <span className="w-14 h-14 mx-auto rounded-full bg-mist flex items-center justify-center">
        <Inbox className="w-6 h-6 text-ink-soft" />
      </span>
      <h3 className="mt-4 text-[15px] font-bold text-ink">
        {filtered
          ? `No ${filter} leads`
          : connected
          ? "No missed calls yet"
          : "No calls recovered yet"}
      </h3>
      <p className="mt-2 text-[13px] text-ink-soft max-w-xs mx-auto">
        {filtered
          ? `You don&apos;t have any ${filter} leads right now.`
          : connected
          ? "When callers don&apos;t reach you, Valix will qualify them and list them here."
          : "Connect your business phone to start catching every missed call."}
      </p>
      {!connected && (
        <Link
          href="/settings?tab=phone"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink text-white text-[13px] font-semibold px-5 py-2.5 hover:bg-black transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          Connect your phone
        </Link>
      )}
    </div>
  );
}
