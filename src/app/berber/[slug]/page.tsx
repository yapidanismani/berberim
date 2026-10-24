import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ChevronLeft,
  MapPin,
  Phone,
  Clock,
  Scissors,
  Check,
} from "lucide-react";
import { getBusinessBySlug } from "@/lib/data";
import { Rating, PriceLevel } from "@/components/rating";
import { BookingFlow } from "@/components/booking/booking-flow";
import { formatPrice, formatDuration, WEEKDAY_LABELS } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/berber/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return { title: "Berber bulunamadı" };
  return {
    title: `${business.name} — ${business.district}, ${business.city}`,
    description: business.about,
  };
}

// Çalışma saatlerini Pazartesi → Pazar sırasıyla göster
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default async function BusinessProfilePage({
  params,
}: PageProps<"/berber/[slug]">) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  const orderedHours = DAY_ORDER.map(
    (d) => business.hours.find((h) => h.day === d)!,
  );

  const initials =
    business.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toLocaleUpperCase("tr") || "B";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Tüm berberler
        </Link>
      </div>

      {/* Kapak */}
      <div
        className="relative mt-4 flex h-48 items-end overflow-hidden rounded-2xl border border-border bg-card sm:h-60"
        style={
          business.coverUrl
            ? {
                backgroundImage: `url(${business.coverUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { background: business.gallery[0] }
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
        <div className="absolute right-4 top-4 opacity-20">
          <Scissors className="h-16 w-16 text-foreground" />
        </div>
        <div className="relative w-full p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-end gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-lg ring-2 ring-background/40 sm:h-20 sm:w-20">
                {business.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={business.logoUrl}
                    alt={business.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-display text-2xl font-semibold text-gold">
                    {initials}
                  </span>
                )}
              </span>
              <div>
                {business.featured && (
                  <span className="mb-2 inline-block rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium text-gold ring-1 ring-gold/30 backdrop-blur-sm">
                    Öne çıkan
                  </span>
                )}
                <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  {business.name}
                </h1>
                <p className="mt-1 text-muted-strong">{business.tagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-background/70 px-4 py-2 backdrop-blur-sm">
              <Rating value={business.rating} count={business.reviewCount} />
              <span className="h-4 w-px bg-border-strong" />
              <PriceLevel level={business.priceLevel} />
            </div>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* Sol kolon — bilgiler */}
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-xl font-semibold">Hakkında</h2>
            <p className="mt-3 leading-relaxed text-muted">{business.about}</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Hizmetler</h2>
            <div className="mt-4 divide-y divide-border/70 overflow-hidden rounded-2xl border border-border bg-card">
              {business.services.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDuration(s.durationMin)}
                      {s.description && (
                        <>
                          <span className="text-border-strong">·</span>
                          <span>{s.description}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold">
                    {formatPrice(s.price)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Ekip</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {business.staff.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 pr-5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface font-semibold text-muted-strong ring-1 ring-border">
                    {st.initials}
                  </span>
                  <div>
                    <p className="font-medium leading-tight">{st.name}</p>
                    <p className="text-sm text-muted">{st.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-8 sm:grid-cols-2">
            <section>
              <h2 className="font-display text-xl font-semibold">
                Çalışma Saatleri
              </h2>
              <ul className="mt-4 space-y-1.5 text-sm">
                {orderedHours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted">{WEEKDAY_LABELS[h.day]}</span>
                    {h.open && h.close ? (
                      <span className="font-medium">
                        {h.open} – {h.close}
                      </span>
                    ) : (
                      <span className="text-danger/80">Kapalı</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold">İletişim</h2>
              <div className="mt-4 space-y-3 text-sm">
                <p className="flex items-start gap-2.5 text-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
                  <span>{business.address}</span>
                </p>
                <p className="flex items-center gap-2.5 text-muted">
                  <Phone className="h-4 w-4 shrink-0 text-gold/70" />
                  <a
                    href={`tel:${business.phone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {business.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2.5 text-muted">
                  <Check className="h-4 w-4 shrink-0 text-gold/70" />
                  Doğrulanmış işletme
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Sağ kolon — randevu widget'ı (yapışkan) */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <BookingFlow business={business} />
        </div>
      </div>
    </div>
  );
}
