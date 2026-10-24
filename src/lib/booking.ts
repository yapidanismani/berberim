import type { Business, Service } from "./types";

export interface Slot {
  time: string; // "HH:mm"
  available: boolean;
}

/** Basit deterministik hash — sunucu/istemci arasında kararlı doluluk üretir */
function seededHash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295; // 0..1
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Verilen tarihteki çalışma saatleri (haftanın gününe göre) */
export function dayHoursFor(business: Business, iso: string) {
  const weekday = new Date(`${iso}T12:00:00`).getDay();
  return business.hours.find((h) => h.day === weekday) ?? null;
}

export function isOpenOn(business: Business, iso: string): boolean {
  const dh = dayHoursFor(business, iso);
  return !!(dh && dh.open && dh.close);
}

/**
 * Bir gün için 30 dakikalık ızgarada randevu saatleri üretir.
 * Hizmet, kapanıştan önce tamamlanabiliyorsa saat eklenir.
 * Doluluk deterministik (seçilen personel + işletme + tarih + saate bağlı).
 */
export function generateSlots(
  business: Business,
  service: Service,
  iso: string,
  staffId: string | null,
): Slot[] {
  const dh = dayHoursFor(business, iso);
  if (!dh || !dh.open || !dh.close) return [];

  const step = 30;
  const open = toMinutes(dh.open);
  const close = toMinutes(dh.close);
  const slots: Slot[] = [];

  for (let t = open; t + service.durationMin <= close; t += step) {
    const time = fromMinutes(t);
    const seed = seededHash(
      `${business.id}|${staffId ?? "any"}|${iso}|${time}`,
    );
    // ~%35 dolu
    slots.push({ time, available: seed > 0.35 });
  }
  return slots;
}
