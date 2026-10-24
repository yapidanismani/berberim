import type { Business, Service } from "./types";

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
 * Bir gün için 30 dakikalık ızgarada randevu saatleri (sadece saatler).
 * Hizmet, kapanıştan önce tamamlanabiliyorsa saat eklenir.
 * Doluluk ayrıca gerçek randevulara göre hesaplanır (bkz. getTakenSlots).
 */
export function slotTimes(
  business: Business,
  service: Service,
  iso: string,
): string[] {
  const dh = dayHoursFor(business, iso);
  if (!dh || !dh.open || !dh.close) return [];

  const step = 30;
  const open = toMinutes(dh.open);
  const close = toMinutes(dh.close);
  const out: string[] = [];

  for (let t = open; t + service.durationMin <= close; t += step) {
    out.push(fromMinutes(t));
  }
  return out;
}
