// Berberim — ortak veri tipleri (MVP, mock veri ile)

export type ServiceCategory = "sac" | "sakal" | "bakim" | "paket";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  durationMin: number; // hizmet süresi (dakika)
  price: number; // TRY
  description?: string;
}

export interface Staff {
  id: string;
  name: string;
  title: string; // örn. "Usta Berber"
  initials: string;
}

/** 0 = Pazar, 1 = Pazartesi ... 6 = Cumartesi */
export interface DayHours {
  day: number;
  open: string | null; // "09:00" veya kapalıysa null
  close: string | null; // "20:00"
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  rating: number; // 0-5
  reviewCount: number;
  priceLevel: 1 | 2 | 3; // ₺ / ₺₺ / ₺₺₺
  about: string;
  services: Service[];
  staff: Staff[];
  hours: DayHours[]; // 7 gün
  gallery: string[]; // CSS gradient tanımları (kapak temaları)
  coverUrl?: string | null; // yüklenen kapak görseli URL'i (varsa gradyan yerine)
  logoUrl?: string | null; // yüklenen logo URL'i
  featured?: boolean;
}

export interface BookingDraft {
  businessSlug: string;
  serviceId: string;
  staffId: string | null; // null = fark etmez
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: string;
  customerPhone: string;
  note?: string;
}
