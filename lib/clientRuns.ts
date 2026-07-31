export type SavedAd = {
  angle: string;
  headline: string;
  primary: string;
  body: string;
  cta: string;
};

export type SavedRun = {
  runId: string;
  url: string;
  domain: string;
  brand: string;
  heroImagePath: string | null;
  ads: SavedAd[];
  createdAt: number;
};

const KEY = "valix.runs";

export function saveRun(run: SavedRun): void {
  try {
    const runs = getRuns();
    runs.unshift(run);
    window.localStorage.setItem(KEY, JSON.stringify(runs.slice(0, 12)));
    window.dispatchEvent(new Event("valix:runs"));
  } catch {
    // storage unavailable
  }
}

export function getRuns(): SavedRun[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getRun(runId: string): SavedRun | null {
  return getRuns().find((r) => r.runId === runId) || null;
}
