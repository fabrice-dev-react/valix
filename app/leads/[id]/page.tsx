"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  PhoneCall,
  Sparkles,
  MessageSquare,
  Phone,
  Clock,
  User,
  Bot,
  Monitor,
  PhoneIncoming,
} from "lucide-react";
import { formatDateTime, LEAD_STATUS_LABELS } from "@/lib/format";

type TimelineItem = {
  type: string;
  title: string;
  detail: string;
  at: string;
};

type ConversationMessage = {
  role: string;
  text: string;
  at: string;
};

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
  conversation: ConversationMessage[];
  timeline: TimelineItem[];
};

const statuses = ["new", "hot", "warm", "contacted", "lost"];

function intentBadge(intent: string | undefined) {
  const i = (intent || "").toLowerCase();
  if (!i) {
    return { label: "Intent pending", color: "bg-mist text-ink-soft" };
  }
  if (i.includes("emergency") || i.includes("urgent") || i.includes("same-day")) {
    return { label: intent || "", color: "bg-signal-soft text-signal-dark" };
  }
  if (i.includes("book") || i.includes("appointment") || i.includes("schedule")) {
    return { label: intent || "", color: "bg-moss/15 text-moss" };
  }
  if (i.includes("quote") || i.includes("estimate") || i.includes("sales") || i.includes("ready to move")) {
    return { label: intent || "", color: "bg-ink text-white" };
  }
  return { label: intent || "", color: "bg-mist text-ink" };
}

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/leads/${params.id}`);
      if (res.status === 404 || res.status === 403) {
        if (!cancelled) {
          setNotFound(true);
          setLoaded(true);
        }
        return;
      }
      const data = await res.json().catch(() => null);
      if (!cancelled && data?.lead) {
        setLead(data.lead);
        setLoaded(true);
      } else if (!cancelled) {
        setNotFound(true);
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const changeStatus = async (status: string) => {
    if (status === lead?.status || updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/leads/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.lead) {
        setLead((prev) =>
          prev ? { ...prev, status: data.lead.status, timeline: data.lead.timeline || prev.timeline } : prev
        );
      }
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  };

  const timelineIcon = (type: string) => {
    if (type === "call") return <PhoneCall className="w-3.5 h-3.5" />;
    if (type === "message") return <MessageSquare className="w-3.5 h-3.5" />;
    if (type === "conversation") return <Sparkles className="w-3.5 h-3.5" />;
    if (type === "status") return <Clock className="w-3.5 h-3.5" />;
    return <Clock className="w-3.5 h-3.5" />;
  };

  if (!loaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">One moment</span>
        </div>
      </div>
    );
  }

  if (notFound || !lead) {
    return (
      <div className="pt-2 lg:pt-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-soft hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to missed calls
        </Link>
        <div className="mt-10 text-center">
          <h1 className="text-xl font-extrabold tracking-[-0.03em] text-ink">Lead not found</h1>
          <p className="mt-2 text-[14px] text-ink-soft">
            This lead doesn&apos;t exist or isn&apos;t associated with your account.
          </p>
        </div>
      </div>
    );
  }

  const badge = intentBadge(lead.intent);

  return (
    <div className="pt-2 lg:pt-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-soft hover:text-ink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to missed calls
      </Link>

      <div className="mt-5 flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-mist flex items-center justify-center text-[20px] font-bold text-ink">
            {(lead.name || lead.phone || "?").charAt(0).toUpperCase()}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-ink">
                {lead.name || lead.phone}
              </h1>
              <span className={`text-[11px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-full ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-ink-soft">
              Missed call · {formatDateTime(lead.missedAt)}
              {lead.platform ? ` · ${lead.platform}` : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        {/* Left: status + conversation + action */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <div className="rounded-2xl border border-line bg-paper p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">
              Status
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => changeStatus(s)}
                  disabled={updating}
                  className={`px-4 py-2 rounded-full border text-[13px] font-semibold transition-all disabled:opacity-60 ${
                    lead.status === s
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-cream text-ink-soft hover:text-ink hover:border-ink/20"
                  }`}
                >
                  {LEAD_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation */}
          <div className="rounded-2xl border border-line bg-paper overflow-hidden">
            <div className="px-6 py-4 border-b border-line flex items-center gap-2">
              <Bot className="w-4 h-4 text-signal" />
              <h2 className="text-[15px] font-bold text-ink">Call with Valix</h2>
              <span className="ml-auto text-[12px] text-ink-soft">
                {lead.name || "Caller"} ↔ {`Valix AI`}
              </span>
            </div>
            {(lead.conversation || []).length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-[13px] text-ink-soft">No conversation recorded for this call yet.</p>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-4 bg-cream/40">
                {(lead.conversation || []).map((m, i) => {
                  const isAi = m.role === "ai";
                  return (
                    <div key={i} className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${
                          isAi
                            ? "bg-paper border border-line text-ink rounded-tl-sm"
                            : "bg-ink text-white rounded-tr-sm"
                        }`}
                      >
                        <div className={`flex items-center gap-1.5 mb-1 text-[11px] font-semibold ${isAi ? "text-signal-dark" : "text-ink-soft"}`}>
                          {isAi ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {isAi ? "Valix" : lead.name || "Caller"}
                        </div>
                        {m.text}
                        <div className={`mt-1 text-[10.5px] ${isAi ? "text-ink-soft/70" : "text-white/60"}`}>
                          {formatDateTime(m.at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Next best action */}
          <div className="rounded-2xl border border-signal/25 bg-signal-soft p-6">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-signal-dark" />
              <h2 className="text-[15px] font-bold text-ink">Next best action</h2>
            </div>
            <p className="mt-2 text-[14px] text-ink leading-relaxed">
              {lead.nextBestAction || `Call ${lead.name || "this caller"} back as soon as possible.`}
            </p>
            <a
              href={`tel:${lead.phone}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink text-white text-[14px] font-semibold px-6 py-3 hover:bg-black transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call {lead.phone}
            </a>
          </div>
        </div>

        {/* Right: details + timeline */}
        <div className="space-y-6">
          {/* Call details */}
          <div className="rounded-2xl border border-line bg-paper p-6">
            <h3 className="text-[14.5px] font-bold text-ink">Call details</h3>
            <dl className="mt-4 space-y-3 text-[13.5px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-ink-soft">
                  <PhoneIncoming className="w-3.5 h-3.5" /> Phone
                </dt>
                <dd className="font-medium text-ink">{lead.phone}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-ink-soft">
                  <Monitor className="w-3.5 h-3.5" /> Source
                </dt>
                <dd className="font-medium text-ink">{lead.platform || "Missed call"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-ink-soft">
                  <Clock className="w-3.5 h-3.5" /> Missed
                </dt>
                <dd className="font-medium text-ink">{formatDateTime(lead.missedAt)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-ink-soft">
                  <Sparkles className="w-3.5 h-3.5" /> Status
                </dt>
                <dd className="font-medium text-ink">{LEAD_STATUS_LABELS[lead.status] || lead.status}</dd>
              </div>
            </dl>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-line bg-paper p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-signal" />
              <h2 className="text-[15px] font-bold text-ink">Why this caller</h2>
            </div>
            <p className="mt-3 text-[13.5px] text-ink leading-relaxed">
              {lead.summary || "Valix is still drafting a summary for this call."}
            </p>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-line bg-paper p-6 h-fit">
            <h3 className="text-[14.5px] font-bold text-ink">Timeline</h3>
            <div className="mt-4 space-y-0">
              {(lead.timeline || []).length === 0 ? (
                <p className="text-[13px] text-ink-soft">No activity recorded yet.</p>
              ) : (
                <ol className="relative border-l border-line ml-2 space-y-5">
                  {(lead.timeline || []).map((t, i) => (
                    <li key={i} className="ml-4">
                      <span className="absolute -left-[7px] mt-0.5 w-3.5 h-3.5 rounded-full bg-signal ring-2 ring-cream" />
                      <p className="text-[13.5px] font-semibold text-ink flex items-center gap-1.5">
                        {timelineIcon(t.type)}
                        {t.title}
                      </p>
                      {t.detail && <p className="text-[12.5px] text-ink-soft mt-0.5">{t.detail}</p>}
                      <p className="text-[11px] text-ink-soft/70 mt-0.5">{formatDateTime(t.at)}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
