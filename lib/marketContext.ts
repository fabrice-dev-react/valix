import { resolveStyle, STYLE_PROFILES, type TradingStyle } from "./edgeEngine";

export type Impact = "Low" | "Medium" | "High";

export interface CalendarEvent {
  title: string;
  country: string;
  date: string;
  impact: Impact;
  forecast?: string;
  previous?: string;
}

export interface UpcomingEvent extends CalendarEvent {
  eventAt: number;
  timeToEventMin: number;
}

export interface NewsWindow {
  title: string;
  country: string;
  impact: Impact;
  eventAt: number;
  windowStart: number;
  windowEnd: number;
  timeToEventMin: number;
  isActive: boolean;
}

export interface SessionInfo {
  name: string | null;
  overlap: string | null;
  note: string;
  open: boolean;
}

export interface MarketContext {
  instrument: string;
  currencies: string[];
  style: TradingStyle;
  nowIso: string;
  session: SessionInfo;
  windows: NewsWindow[];
  nextHighImpact: UpcomingEvent | null;
  upcomingToday: UpcomingEvent[];
  riskState: "HIGH" | "NORMAL" | "QUIET";
  riskReason: string;
  source: string | null;
  error: string | null;
}

const PAIR_OVERRIDES: Record<string, string[]> = {
  XAUUSD: ["USD"],
  XAGUSD: ["USD"],
  US500: ["USD"],
  SPX500: ["USD"],
  US30: ["USD"],
  DJ30: ["USD"],
  NAS100: ["USD"],
  NDX: ["USD"],
  NQ100: ["USD"],
  UK100: ["GBP"],
  FTSE100: ["GBP"],
  FTSE: ["GBP"],
  GER30: ["EUR"],
  GER40: ["EUR"],
  DE30: ["EUR"],
  DE40: ["EUR"],
  DAX: ["EUR"],
  DAX40: ["EUR"],
  FRA40: ["EUR"],
  CAC40: ["EUR"],
  CAC: ["EUR"],
  JPN225: ["JPY"],
  NIKKEI: ["JPY"],
  NIKKEI225: ["JPY"],
  HSI: ["HKD"],
  HANGSENG: ["HKD"],
  USOIL: ["USD"],
  OIL: ["USD"],
  WTI: ["USD"],
  BRENT: ["USD"],
  BTCUSD: ["USD"],
  ETHUSD: ["USD"],
  BTCUSDT: ["USD"],
  ETHUSDT: ["USD"],
  AUDCAD: ["AUD", "CAD"],
  AUDCHF: ["AUD", "CHF"],
  AUDJPY: ["AUD", "JPY"],
  AUDNZD: ["AUD", "NZD"],
  AUDUSD: ["AUD", "USD"],
  CADCHF: ["CAD", "CHF"],
  CADJPY: ["CAD", "JPY"],
  CHFJPY: ["CHF", "JPY"],
  EURAUD: ["EUR", "AUD"],
  EURCAD: ["EUR", "CAD"],
  EURCHF: ["EUR", "CHF"],
  EURGBP: ["EUR", "GBP"],
  EURJPY: ["EUR", "JPY"],
  EURNZD: ["EUR", "NZD"],
  EURUSD: ["EUR", "USD"],
  GBPAUD: ["GBP", "AUD"],
  GBPCAD: ["GBP", "CAD"],
  GBPCHF: ["GBP", "CHF"],
  GBPJPY: ["GBP", "JPY"],
  GBPNZD: ["GBP", "NZD"],
  GBPUSD: ["GBP", "USD"],
  NZDCAD: ["NZD", "CAD"],
  NZDCHF: ["NZD", "CHF"],
  NZDJPY: ["NZD", "JPY"],
  NZDUSD: ["NZD", "USD"],
  USDCAD: ["USD", "CAD"],
  USDCHF: ["USD", "CHF"],
  USDJPY: ["USD", "JPY"],
  USDCNH: ["USD", "CNY"],
  USDCNY: ["USD", "CNY"],
};

const CRYPTO_TOKENS = ["BTC", "ETH", "XRP", "SOL", "DOGE", "ADA", "LTC", "USDT", "USDC"];

export function instrumentCurrencies(
  symbol: string | undefined,
  category: string | undefined
): { instrument: string; currencies: string[]; crypto: boolean } {
  const s = (symbol || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (PAIR_OVERRIDES[s]) {
    return { instrument: s, currencies: PAIR_OVERRIDES[s], crypto: CRYPTO_TOKENS.some((t) => s.includes(t)) };
  }
  if (/^[A-Z]{6}$/.test(s)) {
    const first = s.slice(0, 3);
    const second = s.slice(3, 6);
    return { instrument: s, currencies: [first, second === "CNH" ? "CNY" : second], crypto: false };
  }
  const fallback: Record<string, string[]> = {
    forex: ["USD", "EUR"],
    indices: ["USD"],
    crypto: ["USD"],
    gold: ["USD"],
    stocks: ["USD"],
  };
  return {
    instrument: s || "UNKNOWN",
    currencies: fallback[category || ""] || ["USD"],
    crypto: category === "crypto" || CRYPTO_TOKENS.some((t) => s.includes(t)),
  };
}

interface SessionDef {
  name: string;
  start: number;
  end: number;
}

const SESSION_DEFS: SessionDef[] = [
  { name: "Sydney", start: 21, end: 6 },
  { name: "Tokyo", start: 23, end: 8 },
  { name: "London", start: 7, end: 16 },
  { name: "New York", start: 12, end: 21 },
];

function sessionActive(h: number, def: SessionDef): boolean {
  return def.start <= def.end ? h >= def.start && h < def.end : h >= def.start || h < def.end;
}

export function describeSession(now: Date, crypto: boolean): SessionInfo {
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
  const day = now.getUTCDay();

  const active = SESSION_DEFS.filter((d) => sessionActive(utcHours, d)).map((d) => d.name);

  let overlap: string | null = null;
  if (active.includes("London") && active.includes("New York")) overlap = "London · New York overlap";
  else if (active.includes("Tokyo") && active.includes("London")) overlap = "Tokyo · London overlap";
  else if (active.includes("Sydney") && active.includes("Tokyo")) overlap = "Sydney · Tokyo overlap";

  let open = true;
  if (!crypto) {
    if (day === 6 || (day === 0 && utcHours < 21)) open = false;
  }

  let note: string;
  if (crypto) {
    note = "Crypto trades 24/7, but volatility concentrates during London and New York hours.";
  } else if (!open) {
    note = "The market is closed (weekend). Trading reopens Sunday evening. Levels may gap on the open.";
  } else if (overlap) {
    note = `${overlap} is live — the deepest liquidity of the day and the best window for momentum setups.`;
  } else if (active.length === 1) {
    note = `${active[0]} session is live — decent liquidity, expect moderate range.`;
  } else {
    note = "Multiple sessions are live — liquidity is flowing.";
  }

  return {
    name: active[active.length - 1] || null,
    overlap,
    note,
    open,
  };
}

const FF_FEED = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";
const FF_TTL_MS = 10 * 60 * 1000;

let calendarCache: { events: CalendarEvent[]; fetchedAt: number } | null = null;

function toDateIso(v: unknown): string {
  const s = String(v || "");
  if (!s) return "";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

async function fetchForexFactory(): Promise<CalendarEvent[] | null> {
  try {
    const res = await fetch(FF_FEED, {
      cache: "no-store",
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as unknown;
    if (!Array.isArray(raw)) return null;
    const events: CalendarEvent[] = [];
    for (const e of raw) {
      const date = toDateIso((e as Record<string, unknown>).date);
      if (!date) continue;
      const impactRaw = String((e as Record<string, unknown>).impact || "Low");
      const impact: Impact = impactRaw === "High" || impactRaw === "Medium" ? impactRaw : "Low";
      events.push({
        title: String((e as Record<string, unknown>).title || "Economic event"),
        country: String((e as Record<string, unknown>).country || "").toUpperCase(),
        date,
        impact,
        forecast: (e as Record<string, unknown>).forecast ? String((e as Record<string, unknown>).forecast) : undefined,
        previous: (e as Record<string, unknown>).previous ? String((e as Record<string, unknown>).previous) : undefined,
      });
    }
    return events;
  } catch {
    return null;
  }
}

async function fetchFinnhub(): Promise<CalendarEvent[] | null> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return null;
  try {
    const from = new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10);
    const to = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
    const res = await fetch(
      `https://finnhub.io/api/v1/calendar/economic?from=${from}&to=${to}&token=${key}`,
      { cache: "no-store", signal: AbortSignal.timeout(9000) }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { economicCalendar?: unknown[] };
    if (!Array.isArray(data.economicCalendar)) return null;
    const events: CalendarEvent[] = [];
    for (const e of data.economicCalendar) {
      const rec = e as Record<string, unknown>;
      const date = toDateIso(rec.date);
      if (!date) continue;
      const imp = String(rec.impact || "Low").toLowerCase();
      const impact: Impact = imp === "high" ? "High" : imp === "medium" ? "Medium" : "Low";
      events.push({
        title: String(rec.event || "Economic event"),
        country: String(rec.country || "").toUpperCase(),
        date,
        impact,
        forecast: rec.estimate ? String(rec.estimate) : undefined,
        previous: rec.previous ? String(rec.previous) : undefined,
      });
    }
    return events;
  } catch {
    return null;
  }
}

async function loadCalendar(): Promise<{ events: CalendarEvent[]; source: string | null }> {
  const now = Date.now();
  if (calendarCache && now - calendarCache.fetchedAt < FF_TTL_MS) {
    return { events: calendarCache.events, source: "forexfactory" };
  }

  const ff = await fetchForexFactory();
  if (ff && ff.length > 0) {
    calendarCache = { events: ff, fetchedAt: now };
    return { events: ff, source: "forexfactory" };
  }

  const fh = await fetchFinnhub();
  if (fh && fh.length > 0) {
    calendarCache = { events: fh, fetchedAt: now };
    return { events: fh, source: "finnhub" };
  }

  if (calendarCache) return { events: calendarCache.events, source: calendarCache.events.length ? "forexfactory" : null };
  return { events: [], source: null };
}

const STYLE_WINDOWS: Record<TradingStyle, Record<Impact, { before: number; after: number }>> = {
  scalper: { High: { before: 20, after: 20 }, Medium: { before: 15, after: 15 }, Low: { before: 5, after: 5 } },
  intraday: { High: { before: 45, after: 45 }, Medium: { before: 20, after: 30 }, Low: { before: 10, after: 10 } },
  swing: { High: { before: 120, after: 120 }, Medium: { before: 45, after: 60 }, Low: { before: 15, after: 20 } },
};

export async function buildMarketContext(options: {
  symbol?: string;
  category?: string;
  style?: TradingStyle | "auto";
  timeframe?: string;
}): Promise<MarketContext> {
  const now = new Date();
  const style = resolveStyle(options.style, options.timeframe);
  const { instrument, currencies, crypto } = instrumentCurrencies(options.symbol, options.category);
  const session = describeSession(now, crypto);

  const { events, source } = await loadCalendar();
  const relevant = events.filter((e) => currencies.includes(e.country) && (e.impact === "High" || e.impact === "Medium"));

  const nowTs = now.getTime();
  const windowDefs = STYLE_WINDOWS[style];

  const windows: NewsWindow[] = relevant
    .map((e) => {
      const eventAt = new Date(e.date).getTime();
      if (Number.isNaN(eventAt)) return null;
      const before = windowDefs[e.impact].before;
      const after = windowDefs[e.impact].after;
      const windowStart = eventAt - before * 60 * 1000;
      const windowEnd = eventAt + after * 60 * 1000;
      return {
        title: e.title,
        country: e.country,
        impact: e.impact,
        eventAt,
        windowStart,
        windowEnd,
        timeToEventMin: Math.round((eventAt - nowTs) / 60000),
        isActive: nowTs >= windowStart && nowTs <= windowEnd,
      };
    })
    .filter((w): w is NewsWindow => w !== null)
    .sort((a, b) => a.eventAt - b.eventAt);

  const upcomingToday: UpcomingEvent[] = relevant
    .filter((e) => new Date(e.date).getTime() > nowTs)
    .map((e) => ({
      ...e,
      eventAt: new Date(e.date).getTime(),
      timeToEventMin: Math.round((new Date(e.date).getTime() - nowTs) / 60000),
    }))
    .filter((e) => e.timeToEventMin <= 24 * 60)
    .sort((a, b) => a.eventAt - b.eventAt);

  const nextHighImpact = upcomingToday.find((e) => e.impact === "High") || null;

  const activeWindows = windows.filter((w) => w.isActive);
  const highActive = activeWindows.some((w) => w.impact === "High");
  const mediumActive = activeWindows.some((w) => w.impact === "Medium");

  let riskState: MarketContext["riskState"];
  let riskReason: string;

  if (highActive || (style === "scalper" && mediumActive)) {
    riskState = "HIGH";
    const hit = activeWindows.find((w) => w.impact === "High") || activeWindows[0];
    riskReason = `${hit.title} (${hit.country}) is releasing now`;
  } else if (
    mediumActive ||
    windows.some((w) => w.eventAt > nowTs && w.timeToEventMin <= 360)
  ) {
    riskState = "NORMAL";
    riskReason = "relevant economic data is on the calendar in the next few hours";
  } else {
    riskState = "QUIET";
    riskReason = "no high-impact economic data for this market in the near term";
  }

  const error = source ? null : "Could not load the economic calendar — news filtering is disabled for this run.";

  return {
    instrument,
    currencies,
    style,
    nowIso: now.toISOString(),
    session,
    windows,
    nextHighImpact,
    upcomingToday,
    riskState,
    riskReason,
    source,
    error,
  };
}

export function formatCalendarForPrompt(ctx: MarketContext): string {
  const profile = STYLE_PROFILES[ctx.style];
  const lines: string[] = [];
  lines.push(`Instrument: ${ctx.instrument} — currencies ${ctx.currencies.join(" / ")}.`);
  lines.push(`Trading style: ${profile.label} (timeframes ${profile.timeframes.join(", ")}).`);
  lines.push(`Session: ${ctx.session.note}`);
  lines.push(`News risk state: ${ctx.riskState} — ${ctx.riskReason}.`);

  if (ctx.nextHighImpact) {
    const e = ctx.nextHighImpact;
    lines.push(
      `Next high-impact event: ${e.title} (${e.country}) at ${e.date} — ${e.timeToEventMin} minutes from now. ${e.forecast ? "Forecast " + e.forecast : ""}${e.previous ? ", previous " + e.previous : ""}.`
    );
  }

  if (ctx.upcomingToday.length > 0) {
    const ev = ctx.upcomingToday.slice(0, 6);
    lines.push(
      "Upcoming events for this market (next 24h): " +
        ev
          .map(
            (e) =>
              `${e.impact} ${e.title} (${e.country}) in ~${e.timeToEventMin}min` +
              (e.forecast ? `, f/c ${e.forecast}` : "")
          )
          .join(" | ")
    );
  } else {
    lines.push("No upcoming economic events for this market in the next 24h — quiet calendar.");
  }

  if (!ctx.session.open) {
    lines.push("WARNING: the market is currently closed (weekend). Levels may gap on reopen — be conservative.");
  }

  return lines.join("\n");
}
