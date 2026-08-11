export const MEETING_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export const MEETING_TOPIC = "WhatsApp AI demo call";
export const MEETING_DURATION_MIN = 45;
export const BOOKING_HORIZON_DAYS = 30;

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function nextBusinessDays(count: number): { key: string; date: Date }[] {
  const days: { key: string; date: Date }[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const dow = cursor.getDay();
    if (dow === 0 || dow === 6) continue;
    days.push({ key: toDateKey(cursor), date: new Date(cursor) });
  }
  return days;
}

export function isValidBookingDate(key: string): boolean {
  const allowed = nextBusinessDays(BOOKING_HORIZON_DAYS).map((d) => d.key);
  return allowed.includes(key);
}

export function isValidSlot(slot: string): boolean {
  return MEETING_SLOTS.includes(slot);
}

export function formatSlotLabel(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatDateLabel(key: string): string {
  const d = new Date(`${key}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
