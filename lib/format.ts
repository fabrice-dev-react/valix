export function formatRelativeDate(iso?: string | number | Date | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateTime(iso?: string | number | Date | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "New",
  hot: "Hot",
  warm: "Warm",
  contacted: "Contacted",
  lost: "Lost",
};

export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "bg-mist text-ink",
  hot: "bg-signal-soft text-signal-dark",
  warm: "bg-moss/15 text-moss",
  contacted: "bg-cream text-ink border border-line",
  lost: "bg-line text-ink-soft",
};
