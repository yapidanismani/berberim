import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind sınıflarını güvenle birleştir */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TZ = "Europe/Istanbul";

/** 1234 -> "1.234 ₺" */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

/** 45 -> "45 dk", 90 -> "1 sa 30 dk" */
export function formatDuration(min: number): string {
  if (min < 60) return `${min} dk`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} sa` : `${h} sa ${m} dk`;
}

/** "2026-10-25" -> "25 Ekim Cumartesi" */
export function formatLongDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    weekday: "long",
    timeZone: TZ,
  }).format(d);
}

/** "2026-10-25" -> { weekday: "Cmt", day: "25", month: "Eki" } */
export function formatDateParts(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  const weekday = new Intl.DateTimeFormat("tr-TR", {
    weekday: "short",
    timeZone: TZ,
  }).format(d);
  const day = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    timeZone: TZ,
  }).format(d);
  const month = new Intl.DateTimeFormat("tr-TR", {
    month: "short",
    timeZone: TZ,
  }).format(d);
  return { weekday, day, month };
}

/** Bugünden itibaren n günün ISO (YYYY-MM-DD) listesi, Europe/Istanbul */
export function nextDays(count: number): string[] {
  const out: string[] = [];
  const now = istanbulToday();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push(toISODate(d));
  }
  return out;
}

/** Europe/Istanbul'a göre "bugün" (yerel saat diliminden bağımsız) */
export function istanbulToday(): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  // parts: "2026-10-22"
  return new Date(`${parts}T00:00:00`);
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const WEEKDAY_LABELS = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];
