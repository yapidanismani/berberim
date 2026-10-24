import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Phone, Scissors } from "lucide-react";
import { getBusinessBySlug } from "@/lib/data";
import { Rating, PriceLevel } from "@/components/rating";
import { BookingFlow } from "@/components/booking/booking-flow";

export async function generateMetadata({
  params,
}: PageProps<"/berber/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return { title: "Berber bulunamadı" };
  return {
    title: `${business.name} — Online Randevu`,
    description: business.tagline || business.about || undefined,
  };
}

export default async function BusinessProfilePage({
  params,
}: PageProps<"/berber/[slug]">) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  const initials =
    business.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toLocaleUpperCase("tr") || "B";

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
      {/* Kapak + kimlik */}
      <div
        className="relative mt-6 flex h-40 items-end overflow-hidden rounded-2xl border border-border bg-card sm:h-48"
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
        <div className="absolute inset-0 bg-gradient-to-t from-background/92 via-background/35 to-transparent" />
        <div className="absolute right-4 top-4 opacity-20">
          <Scissors className="h-12 w-12 text-foreground" />
        </div>
        <div className="relative flex w-full items-end gap-4 p-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-lg ring-2 ring-background/40">
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
          <div className="min-w-0">
            <h1 className="truncate font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {business.name}
            </h1>
            {business.tagline && (
              <p className="mt-0.5 truncate text-sm text-muted-strong">
                {business.tagline}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Konum + puan */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-4 w-4 text-gold/70" />
          {business.district}, {business.city}
        </p>
        <div className="inline-flex items-center gap-3">
          <Rating value={business.rating} count={business.reviewCount} />
          <span className="h-4 w-px bg-border-strong" />
          <PriceLevel level={business.priceLevel} />
        </div>
      </div>

      {/* Randevu — sayfanın odağı */}
      <div className="mt-6">
        <BookingFlow business={business} />
      </div>

      {/* İletişim (küçük) */}
      {(business.address || business.phone) && (
        <div className="mt-6 flex flex-col gap-2 border-t border-border/70 pt-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          {business.address && (
            <p className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
              {business.address}
            </p>
          )}
          {business.phone && (
            <a
              href={`tel:${business.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Phone className="h-4 w-4 shrink-0 text-gold/70" />
              {business.phone}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
