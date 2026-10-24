import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink, CalendarClock, Scissors, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CreateBusinessForm } from "@/components/panel/create-business-form";
import { ServicesManager } from "@/components/panel/services-manager";
import { StaffManager } from "@/components/panel/staff-manager";
import { HoursManager } from "@/components/panel/hours-manager";
import { ProfileManager } from "@/components/panel/profile-manager";
import {
  BookingsList,
  type PanelBooking,
} from "@/components/panel/bookings-list";

export const metadata: Metadata = { title: "Panel" };

export default async function PanelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("*, services(*), staff(*), working_hours(*)")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: true });

  const list = businesses ?? [];

  if (list.length === 0) {
    return <CreateBusinessForm />;
  }

  // MVP: ilk işletmeyi yönet
  const business = list[0] as (typeof list)[number] & {
    services: {
      id: string;
      name: string;
      category: string;
      duration_min: number;
      price: number;
      sort_order: number;
    }[];
    staff: {
      id: string;
      name: string;
      title: string | null;
      initials: string | null;
      sort_order: number;
    }[];
    working_hours: { day: number; open: string | null; close: string | null }[];
  };

  const { data: bookingRows } = await supabase
    .from("bookings")
    .select("*, services(name), staff(name)")
    .eq("business_id", business.id)
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true });

  const bookings: PanelBooking[] = (bookingRows ?? []).map((b) => {
    const row = b as typeof b & {
      services: { name: string } | null;
      staff: { name: string } | null;
    };
    return {
      id: row.id,
      booking_date: row.booking_date,
      booking_time: row.booking_time,
      customer_name: row.customer_name,
      customer_phone: row.customer_phone,
      note: row.note,
      status: row.status,
      serviceName: row.services?.name ?? null,
      staffName: row.staff?.name ?? null,
    };
  });

  const services = [...business.services]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      durationMin: s.duration_min,
      price: s.price,
    }));

  const staff = [...business.staff]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => ({
      id: s.id,
      name: s.name,
      title: s.title ?? "Berber",
      initials: s.initials ?? "?",
    }));

  const activeBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending",
  );
  const archivedBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled",
  );
  const activeCount = activeBookings.length;

  const initials =
    business.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toLocaleUpperCase("tr") || "B";

  return (
    <div className="space-y-6">
      {/* İşletme başlığı */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface ring-1 ring-gold/20">
            {business.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.logo_url}
                alt={business.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-xl font-semibold text-gold">
                {initials}
              </span>
            )}
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              {business.name}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="h-4 w-4 text-gold/70" />
              {business.district}, {business.city}
            </p>
          </div>
        </div>
        <Link
          href={`/berber/${business.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-4 py-2 text-sm text-foreground transition-colors hover:border-gold/60 hover:text-gold"
        >
          Sayfanı gör <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile
          icon={<CalendarClock className="h-5 w-5 text-gold" />}
          value={activeCount}
          label="Aktif randevu"
        />
        <StatTile
          icon={<Scissors className="h-5 w-5 text-gold" />}
          value={services.length}
          label="Hizmet"
        />
        <StatTile
          icon={<CalendarClock className="h-5 w-5 text-gold" />}
          value={bookings.length}
          label="Toplam randevu"
        />
      </div>

      <BookingsList bookings={activeBookings} mode="active" />
      <ServicesManager businessId={business.id} services={services} />
      <StaffManager businessId={business.id} staff={staff} />
      <HoursManager businessId={business.id} hours={business.working_hours} />
      <ProfileManager
        data={{
          businessId: business.id,
          name: business.name,
          tagline: business.tagline ?? "",
          address: business.address ?? "",
          phone: business.phone ?? "",
          about: business.about ?? "",
          cover: business.gallery?.[0] ?? "",
          coverUrl: business.cover_url ?? null,
          logoUrl: business.logo_url ?? null,
        }}
      />
      <BookingsList bookings={archivedBookings} mode="archive" />
    </div>
  );
}

function StatTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface ring-1 ring-border">
        {icon}
      </span>
      <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
