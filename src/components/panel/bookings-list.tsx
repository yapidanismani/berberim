"use client";

import { useState } from "react";
import {
  Phone,
  User,
  Check,
  X,
  ArrowDownUp,
  RotateCcw,
  Archive,
  Search,
} from "lucide-react";
import { updateBookingStatus } from "@/app/panel/actions";
import { formatLongDate, cn, istanbulToday, toISODate } from "@/lib/utils";

export interface PanelBooking {
  id: string;
  booking_date: string;
  booking_time: string;
  customer_name: string;
  customer_phone: string;
  note: string | null;
  status: string;
  serviceName: string | null;
  staffName: string | null;
}

const statusMeta: Record<string, { label: string; className: string }> = {
  pending: { label: "Bekliyor", className: "text-muted-strong bg-surface" },
  confirmed: { label: "Onaylı", className: "text-muted-strong bg-surface" },
  completed: { label: "Tamamlandı", className: "text-success bg-success/10" },
  cancelled: { label: "İptal", className: "text-danger bg-danger/10" },
};

type DateFilter = "all" | "today" | "week";

const dateFilters: { key: DateFilter; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "today", label: "Bugün" },
  { key: "week", label: "Bu hafta" },
];

function sortKey(b: PanelBooking) {
  return `${b.booking_date}T${b.booking_time}`;
}

function norm(s: string) {
  return s.toLocaleLowerCase("tr").replaceAll("ı", "i");
}

/** Seçili tarih filtresi için [start, end] ISO aralığı (Europe/Istanbul). */
function dateRange(filter: DateFilter): { start: string; end: string } | null {
  if (filter === "all") return null;
  const today = istanbulToday();
  if (filter === "today") {
    const d = toISODate(today);
    return { start: d, end: d };
  }
  // Bu hafta: Pazartesi – Pazar
  const day = today.getDay(); // 0=Pazar ... 6=Cumartesi
  const toMonday = day === 0 ? -6 : 1 - day;
  const mon = new Date(today);
  mon.setDate(today.getDate() + toMonday);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return { start: toISODate(mon), end: toISODate(sun) };
}

export function BookingsList({
  bookings,
  mode,
}: {
  bookings: PanelBooking[];
  mode: "active" | "archive";
}) {
  const [asc, setAsc] = useState(mode === "active");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [query, setQuery] = useState("");

  const range = dateRange(dateFilter);
  const q = norm(query.trim());

  const filtered = bookings
    .filter((b) => {
      if (range && (b.booking_date < range.start || b.booking_date > range.end))
        return false;
      if (q && !norm(b.customer_name).includes(q)) return false;
      return true;
    })
    .sort((a, b) =>
      asc
        ? sortKey(a).localeCompare(sortKey(b))
        : sortKey(b).localeCompare(sortKey(a)),
    );

  const title = mode === "active" ? "Randevular" : "Arşiv";
  const hasFilter = dateFilter !== "all" || q.length > 0;

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          {mode === "archive" && <Archive className="h-5 w-5 text-muted" />}
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">
            {hasFilter
              ? `${filtered.length} / ${bookings.length}`
              : bookings.length}{" "}
            randevu
          </span>
          {bookings.length > 1 && (
            <button
              type="button"
              onClick={() => setAsc((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
            >
              <ArrowDownUp className="h-3.5 w-3.5" />
              {asc ? "Yakın tarih önce" : "Uzak tarih önce"}
            </button>
          )}
        </div>
      </div>

      {/* Filtre çubuğu */}
      {bookings.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1.5">
            {dateFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setDateFilter(f.key)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                  dateFilter === f.key
                    ? "border-primary bg-surface text-foreground"
                    : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Müşteri ara…"
              className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-gold/60"
            />
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border-strong bg-surface/40 p-8 text-center text-sm text-muted">
          {mode === "active"
            ? "Henüz randevu yok. Müşteriler işletme sayfandan randevu aldıkça burada görünecek."
            : "Arşiv boş. Tamamlanan veya iptal edilen randevular burada toplanır."}
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border-strong bg-surface/40 p-8 text-center text-sm text-muted">
          Bu filtreye uygun randevu bulunamadı.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((b) => {
            const meta = statusMeta[b.status] ?? statusMeta.confirmed;
            return (
              <div
                key={b.id}
                className={cn(
                  "rounded-xl border border-border bg-surface p-4",
                  mode === "archive" && "opacity-80",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {formatLongDate(b.booking_date)} · {b.booking_time}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {b.serviceName ?? "Hizmet"}
                      {b.staffName ? ` · ${b.staffName}` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-gold/70" />
                        {b.customer_name}
                      </span>
                      <a
                        href={`tel:${b.customer_phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-1.5 hover:text-foreground"
                      >
                        <Phone className="h-3.5 w-3.5 text-gold/70" />
                        {b.customer_phone}
                      </a>
                    </div>
                    {b.note && (
                      <p className="mt-2 rounded-lg bg-card px-3 py-1.5 text-sm text-muted">
                        &ldquo;{b.note}&rdquo;
                      </p>
                    )}
                  </div>

                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                      meta.className,
                    )}
                  >
                    {meta.label}
                  </span>
                </div>

                {mode === "active" ? (
                  <div className="mt-3 flex gap-2 border-t border-border/70 pt-3">
                    <StatusButton
                      id={b.id}
                      status="completed"
                      className="hover:border-success/50 hover:text-success"
                    >
                      <Check className="h-4 w-4" /> Tamamlandı
                    </StatusButton>
                    <StatusButton
                      id={b.id}
                      status="cancelled"
                      className="hover:border-danger/50 hover:text-danger"
                    >
                      <X className="h-4 w-4" /> İptal et
                    </StatusButton>
                  </div>
                ) : (
                  <div className="mt-3 flex gap-2 border-t border-border/70 pt-3">
                    <StatusButton
                      id={b.id}
                      status="confirmed"
                      className="hover:border-gold/50 hover:text-gold"
                    >
                      <RotateCcw className="h-4 w-4" /> Geri al
                    </StatusButton>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function StatusButton({
  id,
  status,
  className,
  children,
}: {
  id: string;
  status: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form action={updateBookingStatus}>
      <input type="hidden" name="bookingId" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors",
          className,
        )}
      >
        {children}
      </button>
    </form>
  );
}
