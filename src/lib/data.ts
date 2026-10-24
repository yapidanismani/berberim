import { supabase } from "./supabase/client";
import type { Database } from "./supabase/database.types";
import type { Business, Service, Staff, DayHours, ServiceCategory } from "./types";

type BusinessRow = Database["public"]["Tables"]["businesses"]["Row"];
type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type StaffRow = Database["public"]["Tables"]["staff"]["Row"];
type HoursRow = Database["public"]["Tables"]["working_hours"]["Row"];

type BusinessWithRels = BusinessRow & {
  services: ServiceRow[];
  staff: StaffRow[];
  working_hours: HoursRow[];
};

const SELECT = "*, services(*), staff(*), working_hours(*)";

function mapService(s: ServiceRow): Service {
  return {
    id: s.id,
    name: s.name,
    category: s.category as ServiceCategory,
    durationMin: s.duration_min,
    price: s.price,
    description: s.description ?? undefined,
  };
}

function mapStaff(s: StaffRow): Staff {
  return {
    id: s.id,
    name: s.name,
    title: s.title ?? "",
    initials: s.initials ?? "",
  };
}

function mapHours(h: HoursRow): DayHours {
  return { day: h.day, open: h.open, close: h.close };
}

function mapBusiness(row: BusinessWithRels): Business {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? "",
    city: row.city,
    district: row.district,
    address: row.address ?? "",
    phone: row.phone ?? "",
    rating: Number(row.rating),
    reviewCount: row.review_count,
    priceLevel: (row.price_level as 1 | 2 | 3) ?? 2,
    about: row.about ?? "",
    gallery: row.gallery ?? [],
    coverUrl: row.cover_url ?? null,
    logoUrl: row.logo_url ?? null,
    featured: row.featured,
    services: [...row.services]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapService),
    staff: [...row.staff]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapStaff),
    hours: [...row.working_hours].sort((a, b) => a.day - b.day).map(mapHours),
  };
}

/** Tüm işletmeler (öne çıkanlar ve yüksek puanlılar önce) */
export async function getBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select(SELECT)
    .order("featured", { ascending: false })
    .order("rating", { ascending: false });

  if (error) throw new Error(`İşletmeler yüklenemedi: ${error.message}`);
  return ((data ?? []) as unknown as BusinessWithRels[]).map(mapBusiness);
}

/** Slug ile tek işletme (bulunamazsa null) */
export async function getBusinessBySlug(
  slug: string,
): Promise<Business | null> {
  const { data, error } = await supabase
    .from("businesses")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`İşletme yüklenemedi: ${error.message}`);
  if (!data) return null;
  return mapBusiness(data as unknown as BusinessWithRels);
}

export interface CreateBookingInput {
  businessId: string;
  serviceId: string;
  staffId: string | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: string;
  customerPhone: string;
  note?: string;
}

/** Yeni randevu oluştur (herkese açık insert) */
export async function createBooking(input: CreateBookingInput): Promise<void> {
  const { error } = await supabase.from("bookings").insert({
    business_id: input.businessId,
    service_id: input.serviceId,
    staff_id: input.staffId,
    booking_date: input.date,
    booking_time: input.time,
    customer_name: input.customerName,
    customer_phone: input.customerPhone,
    note: input.note?.trim() || null,
    status: "confirmed",
  });

  if (error) throw new Error(`Randevu oluşturulamadı: ${error.message}`);
}
