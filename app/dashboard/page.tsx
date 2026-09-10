"use client";

import { useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Compass,
  CreditCard,
  Crown,
  Gem,
  Key,
  Lock,
  LogOut,
  MessageSquare,
  Minus,
  Move,
  Plus,
  Rocket,
  Send,
  Settings2,
  Target,
  TrendingUp,
} from "lucide-react";

/* ============================================================
   PHASES DATA
   ============================================================ */
interface SubPhase {
  id: string;
  title: string;
  desc: string;
  locked?: boolean;
}

interface Phase {
  id: string;
  number: number;
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  subPhases: SubPhase[];
}

const phases: Phase[] = [
  {
    id: "foundation",
    number: 1,
    title: "Foundation",
    desc: "Map your skills, passions, and resources before you build.",
    icon: Compass,
    color: "text-signal",
    bgColor: "bg-signal-soft",
    subPhases: [
      { id: "fd-1", title: "Identify Your Strengths", desc: "List the 5 things people already ask you for help with." },
      { id: "fd-2", title: "Define Income Goals", desc: "Set a clear monthly target and a deadline for your side hustle." },
      { id: "fd-3", title: "Time & Budget Audit", desc: "Figure out exactly how many hours and dollars you can invest.", locked: true },
      { id: "fd-4", title: "Pick Your Model", desc: "Choose between a service, digital product, or a hybrid model.", locked: true },
    ],
  },
  {
    id: "market-research",
    number: 2,
    title: "Market Research",
    desc: "Validate real demand so you build something people pay for.",
    icon: Target,
    color: "text-[#7c5cfc]",
    bgColor: "bg-[#f0ecff]",
    subPhases: [
      { id: "mr-1", title: "Find Your Niche", desc: "Shortlist 3 promising niches that match your profile." },
      { id: "mr-2", title: "Study Competitors", desc: "See who's already selling and what they're missing." },
      { id: "mr-3", title: "Check Buyer Demand", desc: "Verify search volume, communities, and buying signals.", locked: true },
      { id: "mr-4", title: "Interview Prospects", desc: "Talk to 5 potential customers to confirm the problem.", locked: true },
    ],
  },
  {
    id: "offer-design",
    number: 3,
    title: "Offer Design",
    desc: "Package a compelling offer priced to sell.",
    icon: Gem,
    color: "text-[#e08914]",
    bgColor: "bg-[#fff4e0]",
    subPhases: [
      { id: "od-1", title: "Define the Service", desc: "Nail down exactly what you deliver and the outcome." },
      { id: "od-2", title: "Value Proposition", desc: "Write why you're different in one clear sentence." },
      { id: "od-3", title: "Set the Price", desc: "Anchor to competitors and your income target.", locked: true },
      { id: "od-4", title: "Build Packages", desc: "Create entry, core, and premium tiers.", locked: true },
    ],
  },
  {
    id: "brand-presence",
    number: 4,
    title: "Brand & Presence",
    desc: "Make it easy for people to find and trust you.",
    icon: Key,
    color: "text-moss",
    bgColor: "bg-[#edf7ef]",
    subPhases: [
      { id: "bp-1", title: "Name & Visual Style", desc: "Choose a memorable name, colors, and fonts." },
      { id: "bp-2", title: "Portfolio Setup", desc: "Launch a one-page site or portfolio." },
      { id: "bp-3", title: "Social Profiles", desc: "Claim your handles on 2–3 platforms.", locked: true },
      { id: "bp-4", title: "Content Calendar", desc: "Plan 3–4 posts a week for your first month.", locked: true },
    ],
  },
  {
    id: "client-acquisition",
    number: 5,
    title: "Client Acquisition",
    desc: "Win your first paying clients with a quiet launch.",
    icon: Rocket,
    color: "text-signal",
    bgColor: "bg-signal-soft",
    subPhases: [
      { id: "ca-1", title: "Build Outreach List", desc: "Pull together a list of 30 warm contacts." },
      { id: "ca-2", title: "Warm Outreach", desc: "Send personalized messages that start conversations." },
      { id: "ca-3", title: "Handle Objections", desc: "Prepare answers to price and trust questions.", locked: true },
      { id: "ca-4", title: "Close First Clients", desc: "Convert at least 2–3 paying clients this phase.", locked: true },
    ],
  },
  {
    id: "grow-scale",
    number: 6,
    title: "Grow & Scale",
    desc: "Systemize delivery and scale past your own time.",
    icon: TrendingUp,
    color: "text-[#7c5cfc]",
    bgColor: "bg-[#f0ecff]",
    subPhases: [
      { id: "gs-1", title: "Deliver & Collect Proof", desc: "Nail delivery and gather testimonials." },
      { id: "gs-2", title: "Raise Your Prices", desc: "Increase pricing based on your first results." },
      { id: "gs-3", title: "Automate & Delegate", desc: "Set up systems and offload low-value work.", locked: true },
      { id: "gs-4", title: "Launch a Growth Channel", desc: "Double down on what brought your best clients.", locked: true },
    ],
  },
  {
    id: "daily-tasks",
    number: 7,
    title: "Daily Action Tasks",
    desc: "Track and complete AI-prioritized actions every day.",
    icon: ClipboardList,
    color: "text-[#2f5d46]",
    bgColor: "bg-[#eaf3ef]",
    subPhases: [
      { id: "dt-1", title: "Morning Task List", desc: "Get your AI-prioritized to-dos for the day." },
      { id: "dt-2", title: "Complete 3 Key Actions", desc: "Finish the three highest-impact tasks today." },
      { id: "dt-3", title: "Log Your Progress", desc: "Mark tasks done and check streaks." },
      { id: "dt-4", title: "End-of-Day Review", desc: "Reflect on wins and prep tomorrow's plan." },
    ],
  },
];

/* ============================================================
   PHASE ITEM — single shared timeline
   ============================================================ */
function PhaseItem({
  phase,
  status,
  isExpanded,
  onToggle,
  showLine,
}: {
  phase: Phase;
  status: "completed" | "active" | "locked";
  isExpanded: boolean;
  onToggle: () => void;
  showLine?: boolean;
}) {
  const isCompleted = status === "completed";
  const isActive = status === "active";
  const isLocked = status === "locked";

  return (
    <div className="relative">
      {/* Connector to the next phase — threaded behind the node, ends at the last phase */}
      {showLine && (
        <span className="absolute left-[23px] top-[48px] bottom-[-60px] w-[2px] rounded-full bg-line" />
      )}

      {/* Header row */}
      <button
        onClick={onToggle}
        className={`relative w-full text-left pl-14 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-signal-soft/60"
            : isLocked
              ? "hover:bg-cream"
              : "hover:bg-cream"
        } ${isExpanded ? "bg-cream/60" : ""} ${isLocked && !isExpanded ? "opacity-50" : ""}`}
      >
        {/* Phase node — vertically centered with the phase title */}
        <span className={`absolute left-[4px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-extrabold z-10 bg-paper transition-all duration-300 ${
          isCompleted
            ? "border-[2.5px] border-moss text-moss shadow-[0_2px_10px_-4px_rgba(47,93,70,0.5)]"
            : isActive
              ? "bg-signal text-white ring-4 ring-signal/15 shadow-[0_2px_14px_-3px_rgba(255,77,47,0.55)]"
              : "border-[2.5px] border-line text-ink-soft/50"
        }`}>
          {isCompleted ? (
            <Check className="w-4.5 h-4.5" strokeWidth={3} />
          ) : isLocked ? (
            <Lock className="w-4 h-4" />
          ) : (
            phase.number
          )}
        </span>

        <div className="flex items-center gap-2 py-6 pr-2 pl-1 min-h-[96px]">
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <p className={`text-[14px] font-bold truncate tracking-[-0.01em] ${
                isActive || isCompleted ? "text-ink" : "text-ink-soft/70"
              }`}>
                {phase.title}
              </p>
              {isActive && (
                <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-signal bg-signal/10 px-2 py-0.5 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-signal animate-pulse" />
                  Now
                </span>
              )}
              {isLocked && (
                <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-ink-soft/50 bg-mist/70 px-2 py-0.5 rounded-full">
                  <Lock className="w-2.5 h-2.5" />
                  Locked
                </span>
              )}
            </div>
            <p className={`text-[12px] mt-0.5 truncate ${isActive ? "text-ink-soft" : "text-ink-soft/60"}`}>
              {phase.desc}
            </p>
          </div>
          <ChevronDown className={`shrink-0 w-4 h-4 text-ink-soft transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Sub-phases — dots centered on the same shared timeline, viewable even when locked */}
      {isExpanded && (
        <div className="pb-4">
          {phase.subPhases.map((sub) => {
            const subDone = isCompleted;
            const subLocked = isLocked ? true : isActive ? !!sub.locked : false;
            return (
              <div key={sub.id} className="relative pl-14">
                <span className={`absolute left-[17px] top-[15px] w-3.5 h-3.5 rounded-full z-10 border-2 bg-paper ${
                  subDone
                    ? "border-moss bg-moss/20"
                    : subLocked
                      ? "border-line bg-mist"
                      : "border-signal bg-signal/15"
                }`} />
                <div className={`rounded-lg px-3.5 py-3 ${subLocked ? "" : isActive ? "hover:bg-cream" : ""}`}>
                  <p className={`text-[12.5px] font-semibold leading-tight ${
                    subLocked
                      ? "text-ink-soft/45"
                      : subDone
                        ? "text-ink/75"
                        : "text-ink"
                  }`}>
                    {sub.title}
                  </p>
                  <p className={`text-[11px] mt-1 ${subLocked ? "text-ink-soft/40" : "text-ink-soft/60"}`}>
                    {sub.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   AI CHAT
   ============================================================ */
const sampleMessages = [
  {
    from: "ai" as const,
    text: "Hey! Welcome to your side hustle dashboard. I've analyzed your onboarding answers and I'm ready to help you get started.",
  },
  {
    from: "ai" as const,
    text: "Based on your profile, you're looking to build something with the skills you already have. Let's start with Phase 1: Self Discovery — this will help us nail down exactly what you should pursue.",
  },
  {
    from: "user" as const,
    text: "Sounds good! I'm ready to start.",
  },
  {
    from: "ai" as const,
    text: "Perfect. First, let me ask — what's the one thing you're best at? Not what you think sounds impressive, but what do people actually come to you for help with?",
  },
];

function ChatMessage({ msg, index }: { msg: { from: "ai" | "user"; text: string }; index: number }) {
  const isAi = msg.from === "ai";
  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"} animate-[chatIn_0.3s_ease]`} style={{ animationDelay: `${index * 80}ms` }}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
        isAi ? "text-ink" : "bg-ink text-white rounded-br-md"
      }`}>
        {msg.text}
      </div>
    </div>
  );
}

/* ============================================================
   PROGRESS RING
   ============================================================ */
function ProgressRing({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 60 60" className="w-16 h-16 -rotate-90">
        <circle cx="30" cy="30" r={r} fill="none" stroke="var(--color-mist)" strokeWidth="5" />
        <circle
          cx="30"
          cy="30"
          r={r}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[12px] font-extrabold text-ink">{value}%</span>
      </div>
    </div>
  );
}

/* ============================================================
   PLAN VIEW
   ============================================================ */
function PlanView({
  phases,
  statuses,
  overallProgress,
}: {
  phases: Phase[];
  statuses: ("completed" | "active" | "locked")[];
  overallProgress: number;
}) {
  const plan = {
    offer: "Content creation & freelance writing",
    incomeGoal: "$1,000 – $3,000",
    timeCommitment: "5 – 15 hrs",
    startupCapital: "$100 – $500",
    skills: ["Writing", "Social Media"],
    interests: ["Content Creation", "AI & Automation"],
  };

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.85);
  const [grabbing, setGrabbing] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const BOX_W = 320;
  const BOX_H = 168;
  const positions = [
    { x: 40, y: 300 },
    { x: 400, y: 300 },
    { x: 760, y: 300 },
    { x: 760, y: 640 },
    { x: 400, y: 640 },
    { x: 40, y: 640 },
    { x: 40, y: 980 },
  ];
  const OFFER = { x: 40, y: 24, w: 1040, h: 176 };

  const edges = [
    { from: [OFFER.x + OFFER.w / 2, OFFER.y + OFFER.h], to: [positions[0].x + BOX_W / 2, positions[0].y] },
    { from: [positions[0].x + BOX_W, positions[0].y + BOX_H / 2], to: [positions[1].x, positions[1].y + BOX_H / 2] },
    { from: [positions[1].x + BOX_W, positions[1].y + BOX_H / 2], to: [positions[2].x, positions[2].y + BOX_H / 2] },
    { from: [positions[2].x + BOX_W / 2, positions[2].y + BOX_H], to: [positions[3].x + BOX_W / 2, positions[3].y] },
    { from: [positions[3].x, positions[3].y + BOX_H / 2], to: [positions[4].x + BOX_W, positions[4].y + BOX_H / 2] },
    { from: [positions[4].x, positions[4].y + BOX_H / 2], to: [positions[5].x + BOX_W, positions[5].y + BOX_H / 2] },
    { from: [positions[5].x + BOX_W / 2, positions[5].y + BOX_H], to: [positions[6].x + BOX_W / 2, positions[6].y] },
  ];
  const stoneColor =
    statuses[2] === "active" || statuses[2] === "completed" ? { fill: "#2f5d46", text: "#dbe9e2" } : { fill: "#e9e2d9", text: "#7a746b" };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const el = e.currentTarget as Element;
    el.setPointerCapture?.(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y };
    setGrabbing(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setOffset({ x: d.originX + (e.clientX - d.startX), y: d.originY + (e.clientY - d.startY) });
  };
  const onPointerUp = () => {
    dragRef.current = null;
    setGrabbing(false);
  };

  const boardW = 1120;
  const boardH = 1180;

  return (
    <div
      className={`flex-1 min-h-0 overflow-hidden relative select-none ${
        grabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        backgroundImage: "radial-gradient(rgba(60,50,40,0.10) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Controls */}
      <div
        className="absolute top-3 right-3 z-20 flex flex-col items-center gap-1.5"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center rounded-xl border border-line bg-paper shadow-sm overflow-hidden">
          <button
            onClick={() => setScale((s) => Math.min(1.5, s + 0.1))}
            className="p-2 text-ink-soft hover:text-ink hover:bg-mist transition-colors"
            title="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(0.4, s - 0.1))}
            className="p-2 text-ink-soft hover:text-ink hover:bg-mist transition-colors border-t border-line"
            title="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => { setScale(0.85); setOffset({ x: 0, y: 0 }); }}
          className="rounded-full border border-line bg-paper shadow-sm px-3 py-1.5 text-[11px] font-bold text-ink-soft hover:text-ink transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 hidden sm:flex items-center gap-1.5 rounded-full bg-ink/80 text-white px-4 py-1.5 text-[11px] font-semibold shadow-sm pointer-events-none">
        <Move className="w-3.5 h-3.5" />
        Drag to pan · scroll to zoom
      </div>

      {/* World */}
      <div
        className="absolute left-1/2 top-1/2 origin-center"
        style={{ transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))` }}
      >
        <div
          className="relative"
          style={{ width: boardW, height: boardH, transform: `scale(${scale})`, transformOrigin: "center" }}
        >
          {/* Connectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" width={boardW} height={boardH}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10Z" fill="#b9b0a4" />
              </marker>
            </defs>
            {edges.map((e, i) => {
              const [x1, y1] = e.from;
              const [x2, y2] = e.to;
              const mid = statuses[i] === "active" || statuses[i] === "completed";
              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={mid ? "#2f5d46" : "#c8bfb2"}
                  strokeWidth={mid ? 2.5 : 2}
                  strokeDasharray={mid && i !== 0 ? "6 5" : "0"}
                  markerEnd="url(#arrow)"
                />
              );
            })}
          </svg>

          {/* Offer card */}
          <div
            className="absolute rounded-2xl border border-line bg-paper shadow-sm flex items-center justify-between gap-6 px-6"
            style={{ left: OFFER.x, top: OFFER.y, width: OFFER.w, height: OFFER.h }}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-signal-soft text-signal flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </span>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
                  Your plan
                </p>
              </div>
              <h2 className="mt-2.5 text-xl font-extrabold tracking-[-0.03em] text-ink leading-tight">
                {plan.offer}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-cream border border-line px-3 py-1 text-[11px] font-semibold text-ink">
                  {plan.incomeGoal} / mo
                </span>
                <span className="rounded-full bg-cream border border-line px-3 py-1 text-[11px] font-semibold text-ink">
                  {plan.timeCommitment} / wk
                </span>
                <span className="rounded-full bg-cream border border-line px-3 py-1 text-[11px] font-semibold text-ink">
                  {plan.startupCapital}
                </span>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-center gap-1.5">
              <ProgressRing value={overallProgress} />
              <span className="text-[11px] font-semibold text-ink-soft">
                {statuses.filter((s) => s === "completed").length} of {phases.length} phases
              </span>
            </div>
          </div>

          {/* Phase boxes */}
          {phases.map((phase, i) => {
            const status = statuses[i];
            const p = positions[i];
            const pct = status === "completed" ? 100 : status === "active" ? 25 : 0;
            const locked = status === "locked";
            return (
              <div
                key={phase.id}
                className={`absolute rounded-2xl border shadow-sm overflow-hidden text-left ${
                  status === "active"
                    ? "border-signal ring-2 ring-signal/15"
                    : status === "completed"
                      ? "border-moss/30"
                      : "border-line"
                } ${locked ? "bg-mist/60" : "bg-paper"}`}
                style={{ left: p.x, top: p.y, width: BOX_W, height: BOX_H }}
              >
                <div className={`h-1.5 w-full ${status === "completed" ? "bg-moss" : status === "active" ? "bg-signal" : "bg-mist"}`} />
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-mono text-[9.5px] uppercase tracking-[0.2em] font-semibold ${
                      locked ? "text-ink-soft/50" : status === "active" ? "text-signal" : "text-moss"
                    }`}>
                      Phase {phase.number}
                    </p>
                    <span className={`shrink-0 text-[9.5px] font-bold uppercase tracking-wide ${
                      status === "completed" ? "text-moss" : status === "active" ? "text-signal" : "text-ink-soft/50"
                    }`}>
                      {status === "completed" ? "Done" : status === "active" ? "Active" : "Locked"}
                    </span>
                  </div>
                  <p className={`mt-1 text-[15px] font-extrabold tracking-[-0.02em] leading-tight ${
                    locked ? "text-ink-soft/60" : "text-ink"
                  }`}>
                    {phase.title}
                  </p>
                  <div className="mt-2.5 h-1.5 rounded-full bg-mist overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        status === "completed" ? "bg-moss" : status === "active" ? "bg-signal" : "bg-mist/40"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {phase.subPhases.slice(0, 3).map((sp) => (
                      <span
                        key={sp.id}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          locked ? "bg-mist text-ink-soft/50" : "bg-cream text-ink border border-line"
                        }`}
                      >
                        {sp.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Results note */}
          <div
            className="absolute rounded-xl px-4 py-3 text-ink font-bold shadow-sm flex items-center gap-2.5"
            style={{ left: 430, top: 830, background: stoneColor.fill, color: stoneColor.text }}
          >
            <Rocket className="w-4 h-4" />
            {stoneColor.fill === "#2f5d46" ? "Launching soon — Offer ready to ship" : "Finish the roadmap to launch"}
          </div>
        </div>
      </div>
    </div>
  );
}
export default function DashboardPage() {
  const { data: session } = useSession();
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(sampleMessages);
  const [sending, setSending] = useState(false);
  const [viewMode, setViewMode] = useState<"chat" | "plan">("chat");
  const [menuOpen, setMenuOpen] = useState(false);

  const currentPhaseIndex = 0; // After onboarding, user is on phase 1

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const getPhaseStatus = (index: number): "completed" | "active" | "locked" => {
    if (index < currentPhaseIndex) return "completed";
    if (index === currentPhaseIndex) return "active";
    return "locked";
  };

  const completedCount = phases.filter((_, i) => getPhaseStatus(i) === "completed").length;
  const overallProgress = Math.round((completedCount / phases.length) * 100);

  const handleSend = () => {
    if (!chatInput.trim() || sending) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setSending(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "That's a great starting point. Let me think about that and guide you to the next step..." },
      ]);
      setSending(false);
    }, 1200);
  };

  return (
    <div
      className="min-h-dvh flex flex-col lg:flex-row gap-0 lg:h-screen lg:overflow-hidden"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage:
          "linear-gradient(rgba(60,50,40,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(60,50,40,0.045) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }}
    >

      {/* ============ LEFT: PHASES (25%) ============ */}
      <div className="w-full lg:w-[25%] shrink-0 flex flex-col overflow-y-auto lg:overflow-hidden border-b lg:border-b-0 lg:border-r border-line bg-paper">
        {/* Header: brand + profile menu */}
        <div className="px-5 pt-5 pb-4 border-b border-line flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="valix"
              className="w-9 h-9 rounded-[10px] object-cover"
            />
            <span className="text-[17px] font-extrabold tracking-[-0.02em] text-ink">valix</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-full p-1 pr-2 hover:bg-mist/70 transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff9a7a] to-[#ff4d2f] text-white flex items-center justify-center text-[13px] font-bold">
                {(session?.user?.name?.[0] || session?.user?.email?.[0] || "V").toUpperCase()}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-ink-soft transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-40 w-64 rounded-2xl border border-line bg-paper shadow-xl overflow-hidden animate-[slideIn_0.2s_ease]">
                  <div className="px-4 py-3.5 border-b border-line">
                    <p className="text-[13.5px] font-bold text-ink truncate">
                      {session?.user?.name || "Your account"}
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
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-ink hover:bg-mist/60 transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-ink-soft" />
                    Billing
                  </Link>
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

        {/* Greeting */}
        <div className="px-5 pt-6 pb-4">
          <h1 className="text-[22px] font-extrabold tracking-[-0.025em] text-ink leading-[1.15]">
            {session?.user?.name?.split(" ")[0] || "There"}, let&apos;s build your side hustle.
          </h1>
        </div>

{/* Roadmap */}
        <div className="flex-1 overflow-y-auto -mt-1">
          <div className="relative min-h-full pb-10 pt-2 pl-5 pr-5">
            <div className="flex items-center justify-between pl-2 pr-1 pt-1.5 pb-3">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-soft/60">
                Your roadmap
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold text-ink tabular-nums">
                <span className="w-2 h-2 rounded-full bg-signal" />
                {overallProgress}%
              </span>
            </div>

            <div className="space-y-3">
              {phases.map((phase, i) => (
                <PhaseItem
                  key={phase.id}
                  phase={phase}
                  status={getPhaseStatus(i)}
                  isExpanded={!!expandedPhases[phase.id]}
                  showLine={i < phases.length - 1}
                  onToggle={() => togglePhase(phase.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ RIGHT (75%) ============ */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col p-4 sm:p-6 lg:p-8">

        {/* Mode toggle (top center) */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center rounded-full border border-line bg-paper/70 backdrop-blur-sm p-1 shadow-sm">
            <button
              onClick={() => setViewMode("chat")}
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-200 ${
                viewMode === "chat"
                  ? "bg-ink text-white shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat
            </button>
            <button
              onClick={() => setViewMode("plan")}
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-200 ${
                viewMode === "plan"
                  ? "bg-ink text-white shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Plan
            </button>
          </div>
        </div>

        {viewMode === "chat" ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Scroll area: full panel width → scrollbar hugs the far right edge */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Centered 80% column for messages, far away from the scrollbar */}
              <div className="mx-auto w-full max-w-[80%] pt-7 pb-10 space-y-4">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} msg={msg} index={i} />
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-ink-soft/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-ink-soft/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-ink-soft/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input: pinned at bottom, centered 80% */}
            <div className="pt-3">
              <div className="mx-auto w-full max-w-[80%] flex items-end gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask your AI coach anything..."
                  className="flex-1 rounded-full border border-line bg-paper px-5 py-3 text-[14px] text-ink placeholder:text-ink-soft/40 focus:outline-none focus:ring-2 focus:ring-signal/20 focus:border-signal transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!chatInput.trim() || sending}
                  className="shrink-0 w-11 h-11 rounded-full bg-signal text-white flex items-center justify-center hover:bg-signal-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_12px_-4px_rgba(255,77,47,0.4)]"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <PlanView
            phases={phases}
            statuses={phases.map((_, i) => getPhaseStatus(i))}
            overallProgress={overallProgress}
          />
        )}
      </div>

    </div>
  );
}
