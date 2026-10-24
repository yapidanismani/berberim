"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Check,
  ChevronLeft,
  Clock,
  CalendarCheck,
  User,
  Scissors,
  PartyPopper,
} from "lucide-react";
import type { Business, Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  cn,
  formatPrice,
  formatDuration,
  formatLongDate,
  formatDateParts,
  nextDays,
  toISODate,
  istanbulToday,
} from "@/lib/utils";
import { generateSlots, isOpenOn } from "@/lib/booking";
import { createBooking } from "@/lib/data";

const contactSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(3, "Lütfen adınızı ve soyadınızı girin"),
  customerPhone: z
    .string()
    .trim()
    .min(1, "Telefon numarası gerekli")
    .refine(
      (v) => v.replace(/\D/g, "").length >= 10,
      "Geçerli bir telefon numarası girin",
    ),
  note: z.string().max(200, "Not en fazla 200 karakter olabilir").optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

const STEPS = ["Hizmet", "Tarih & Saat", "Bilgiler"] as const;

export function BookingFlow({ business }: { business: Business }) {
  const [step, setStep] = useState(0); // 0,1,2 adımlar — 3 = başarı
  const [service, setService] = useState<Service | null>(null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Tarih/saat hesapları `new Date()` kullandığından (dinamik), prerender sırasında
  // değil, yalnızca istemcide mount sonrası hesaplanır.
  const [days, setDays] = useState<string[]>([]);
  const [todayIso, setTodayIso] = useState<string>("");
  const [nowMin, setNowMin] = useState<number | null>(null);

  useEffect(() => {
    setDays(nextDays(14));
    setTodayIso(toISODate(istanbulToday()));
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Istanbul",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
    const [h, m] = parts.split(":").map(Number);
    setNowMin(h * 60 + m);
  }, []);

  const slots = useMemo(() => {
    if (!service || !date) return [];
    const all = generateSlots(business, service, date, staffId);
    if (date === todayIso && nowMin != null) {
      return all.filter((s) => {
        const [h, m] = s.time.split(":").map(Number);
        return h * 60 + m > nowMin + 30; // en az 30 dk sonrası
      });
    }
    return all;
  }, [business, service, date, staffId, todayIso, nowMin]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  });

  function selectService(s: Service) {
    setService(s);
    setTime(null);
  }

  function goToStep(n: number) {
    setStep(n);
  }

  async function onConfirm(values: ContactForm) {
    if (!service || !date || !time) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createBooking({
        businessId: business.id,
        serviceId: service.id,
        staffId,
        date,
        time,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        note: values.note,
      });
      setStep(3);
    } catch (e) {
      setSubmitError(
        e instanceof Error
          ? e.message
          : "Randevu oluşturulamadı. Lütfen tekrar deneyin.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(0);
    setService(null);
    setStaffId(null);
    setDate(null);
    setTime(null);
  }

  const canProceedStep0 = !!service;
  const canProceedStep1 = !!date && !!time;

  if (step === 3) {
    return <SuccessView business={business} service={service!} staffId={staffId} date={date!} time={time!} name={getValues("customerName")} onReset={reset} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Başlık + adım göstergesi */}
      <div className="border-b border-border/70 p-5">
        <div className="flex items-center gap-2 text-gold">
          <CalendarCheck className="h-5 w-5" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Randevu Al
          </h2>
        </div>
        <ol className="mt-4 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  i < step && "bg-primary text-primary-foreground",
                  i === step && "bg-background text-foreground ring-1 ring-primary",
                  i > step && "bg-surface text-muted",
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-xs sm:block",
                  i === step ? "text-foreground" : "text-muted",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="ml-1 hidden h-px flex-1 bg-border sm:block" />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="p-5">
        {/* ADIM 1 — Hizmet + personel */}
        {step === 0 && (
          <div className="animate-fade-up space-y-5">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-strong">
                <Scissors className="h-4 w-4 text-gold/70" /> Hizmet seç
              </h3>
              <div className="space-y-2">
                {business.services.map((s) => {
                  const active = service?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => selectService(s)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all",
                        active
                          ? "border-primary bg-surface"
                          : "border-border bg-surface hover:border-border-strong",
                      )}
                    >
                      <span>
                        <span className="block font-medium">{s.name}</span>
                        <span className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDuration(s.durationMin)}
                        </span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="font-semibold">
                          {formatPrice(s.price)}
                        </span>
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full border",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border-strong",
                          )}
                        >
                          {active && <Check className="h-3.5 w-3.5" />}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-strong">
                <User className="h-4 w-4 text-gold/70" /> Usta (opsiyonel)
              </h3>
              <div className="flex flex-wrap gap-2">
                <StaffChip
                  label="Fark etmez"
                  active={staffId === null}
                  onClick={() => setStaffId(null)}
                />
                {business.staff.map((st) => (
                  <StaffChip
                    key={st.id}
                    label={st.name}
                    sub={st.title}
                    active={staffId === st.id}
                    onClick={() => setStaffId(st.id)}
                  />
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!canProceedStep0}
              onClick={() => goToStep(1)}
            >
              Devam et
            </Button>
          </div>
        )}

        {/* ADIM 2 — Tarih & saat */}
        {step === 1 && (
          <div className="animate-fade-up space-y-5">
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-strong">
                Tarih seç
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {days.map((iso) => {
                  const open = isOpenOn(business, iso);
                  const active = date === iso;
                  const { weekday, day, month } = formatDateParts(iso);
                  return (
                    <button
                      key={iso}
                      disabled={!open}
                      onClick={() => {
                        setDate(iso);
                        setTime(null);
                      }}
                      className={cn(
                        "flex min-w-[4.2rem] shrink-0 flex-col items-center rounded-xl border px-3 py-2.5 transition-all",
                        active
                          ? "border-primary bg-surface text-foreground"
                          : "border-border bg-surface hover:border-border-strong",
                        !open && "cursor-not-allowed opacity-35",
                      )}
                    >
                      <span className="text-xs text-muted">{weekday}</span>
                      <span className="text-lg font-semibold leading-tight">
                        {day}
                      </span>
                      <span className="text-xs text-muted">{month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {date && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-strong">
                  Saat seç
                </h3>
                {slots.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        disabled={!s.available}
                        onClick={() => setTime(s.time)}
                        className={cn(
                          "rounded-lg border py-2 text-sm font-medium transition-all",
                          time === s.time
                            ? "border-primary bg-primary text-primary-foreground"
                            : s.available
                              ? "border-border bg-surface hover:border-gold/50"
                              : "cursor-not-allowed border-border/60 bg-surface/40 text-muted/40 line-through",
                        )}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-border-strong bg-surface/40 p-6 text-center text-sm text-muted">
                    Bu gün için uygun saat kalmadı. Başka bir gün seçin.
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => goToStep(0)}>
                <ChevronLeft className="h-4 w-4" /> Geri
              </Button>
              <Button
                className="flex-1"
                disabled={!canProceedStep1}
                onClick={() => goToStep(2)}
              >
                Devam et
              </Button>
            </div>
          </div>
        )}

        {/* ADIM 3 — Bilgiler + özet */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit(onConfirm)}
            className="animate-fade-up space-y-5"
          >
            <Summary
              business={business}
              service={service!}
              staffId={staffId}
              date={date!}
              time={time!}
            />

            <div className="space-y-4">
              <Field
                label="Ad Soyad"
                error={errors.customerName?.message}
              >
                <input
                  {...register("customerName")}
                  placeholder="Örn. Ahmet Yılmaz"
                  className={inputClass}
                />
              </Field>
              <Field label="Telefon" error={errors.customerPhone?.message}>
                <input
                  {...register("customerPhone")}
                  inputMode="tel"
                  placeholder="05XX XXX XX XX"
                  className={inputClass}
                />
              </Field>
              <Field label="Not (opsiyonel)" error={errors.note?.message}>
                <textarea
                  {...register("note")}
                  rows={2}
                  placeholder="Berbere iletmek istediğin bir not…"
                  className={cn(inputClass, "resize-none py-2.5")}
                />
              </Field>
            </div>

            {submitError && (
              <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
                {submitError}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => goToStep(1)}
                disabled={submitting}
              >
                <ChevronLeft className="h-4 w-4" /> Geri
              </Button>
              <Button
                type="submit"
                className="flex-1"
                size="lg"
                disabled={submitting}
              >
                {submitting ? "Oluşturuluyor…" : "Randevuyu Onayla"}
              </Button>
            </div>
            <p className="text-center text-xs text-muted">
              Onaylayarak randevunuz oluşturulur. Gerçek bir ödeme alınmaz.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-gold/60";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted-strong">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

function StaffChip({
  label,
  sub,
  active,
  onClick,
}: {
  label: string;
  sub?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3.5 py-2 text-left transition-all",
        active
          ? "border-primary bg-surface"
          : "border-border bg-surface hover:border-border-strong",
      )}
    >
      <span className="block text-sm font-medium">{label}</span>
      {sub && <span className="block text-xs text-muted">{sub}</span>}
    </button>
  );
}

function Summary({
  business,
  service,
  staffId,
  date,
  time,
}: {
  business: Business;
  service: Service;
  staffId: string | null;
  date: string;
  time: string;
}) {
  const staff = staffId
    ? business.staff.find((s) => s.id === staffId)?.name
    : "Fark etmez";
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <dl className="space-y-2.5 text-sm">
        <Row label="Hizmet" value={`${service.name} · ${formatDuration(service.durationMin)}`} />
        <Row label="Usta" value={staff ?? "Fark etmez"} />
        <Row label="Tarih" value={formatLongDate(date)} />
        <Row label="Saat" value={time} />
        <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3">
          <span className="text-muted">Toplam</span>
          <span className="font-display text-lg font-semibold text-gold">
            {formatPrice(service.price)}
          </span>
        </div>
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

function SuccessView({
  business,
  service,
  staffId,
  date,
  time,
  name,
  onReset,
}: {
  business: Business;
  service: Service;
  staffId: string | null;
  date: string;
  time: string;
  name?: string;
  onReset: () => void;
}) {
  return (
    <div className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-col items-center border-b border-border/70 bg-surface px-6 py-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <PartyPopper className="h-7 w-7" />
        </span>
        <h2 className="mt-4 font-display text-xl font-semibold">
          Randevun oluşturuldu!
        </h2>
        <p className="mt-1 text-sm text-muted">
          {name ? `${name}, g` : "G"}örüşmek üzere — {business.name}
        </p>
      </div>
      <div className="p-5">
        <Summary
          business={business}
          service={service}
          staffId={staffId}
          date={date}
          time={time}
        />
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface p-3 text-sm text-muted">
          <Clock className="h-4 w-4 shrink-0 text-gold/70" />
          Randevundan 1 saat önce hatırlatma göndereceğiz.
        </div>
        <Button variant="secondary" className="mt-4 w-full" onClick={onReset}>
          Yeni randevu oluştur
        </Button>
      </div>
    </div>
  );
}
