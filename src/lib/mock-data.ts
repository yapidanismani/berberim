import type { Business, DayHours } from "./types";

/** Hafta içi + Cumartesi açık, Pazar kapalı standart mesai */
function standardHours(open = "09:00", close = "20:00", satClose = "19:00"): DayHours[] {
  return [
    { day: 0, open: null, close: null }, // Pazar kapalı
    { day: 1, open, close },
    { day: 2, open, close },
    { day: 3, open, close },
    { day: 4, open, close },
    { day: 5, open, close },
    { day: 6, open, close: satClose },
  ];
}

const g = {
  gold: "linear-gradient(135deg,#2a2d33 0%,#3a3327 55%,#c9a24b 160%)",
  steel: "linear-gradient(135deg,#1c2026 0%,#2b3138 60%,#4a5560 140%)",
  warm: "linear-gradient(135deg,#241e18 0%,#3a2e22 55%,#6b513a 150%)",
  night: "linear-gradient(135deg,#14161a 0%,#1f2730 60%,#33404d 140%)",
  sand: "linear-gradient(135deg,#2a2621 0%,#413a2d 55%,#8a7450 150%)",
};

export const businesses: Business[] = [
  {
    id: "b1",
    slug: "modern-cut",
    name: "Modern Cut",
    tagline: "Çağdaş erkek kuaförü",
    city: "İstanbul",
    district: "Kadıköy",
    address: "Caferağa Mah. Moda Cad. No:42, Kadıköy",
    phone: "+90 216 000 00 01",
    rating: 4.9,
    reviewCount: 312,
    priceLevel: 3,
    about:
      "Moda'nın kalbinde, modern erkek bakımına odaklanan butik bir kuaför. Deneyimli ekibimizle saç kesimi, sakal tasarımı ve cilt bakımında keskin bir çizgi sunuyoruz.",
    services: [
      { id: "s1", name: "Saç Kesimi", category: "sac", durationMin: 45, price: 450, description: "Yıkama + şekillendirme dahil" },
      { id: "s2", name: "Sakal Tıraşı & Tasarım", category: "sakal", durationMin: 30, price: 300 },
      { id: "s3", name: "Saç + Sakal Paketi", category: "paket", durationMin: 75, price: 650, description: "En çok tercih edilen" },
      { id: "s4", name: "Cilt Bakımı", category: "bakim", durationMin: 40, price: 400 },
    ],
    staff: [
      { id: "st1", name: "Emre K.", title: "Usta Berber", initials: "EK" },
      { id: "st2", name: "Can T.", title: "Berber", initials: "CT" },
    ],
    hours: standardHours("10:00", "21:00", "20:00"),
    gallery: [g.gold, g.warm, g.steel],
    featured: true,
  },
  {
    id: "b2",
    slug: "barberhane",
    name: "Barberhane",
    tagline: "Klasik usta işi tıraş",
    city: "İstanbul",
    district: "Beşiktaş",
    address: "Sinanpaşa Mah. Ortabahçe Cad. No:9, Beşiktaş",
    phone: "+90 212 000 00 02",
    rating: 4.8,
    reviewCount: 198,
    priceLevel: 2,
    about:
      "Sıcak havlu, ustura ve klasik berber geleneğini modern bir mekânda yaşatıyoruz. Acele etmeden, hakkıyla.",
    services: [
      { id: "s1", name: "Saç Kesimi", category: "sac", durationMin: 40, price: 350 },
      { id: "s2", name: "Ustura Sakal Tıraşı", category: "sakal", durationMin: 35, price: 280, description: "Sıcak havlu dahil" },
      { id: "s3", name: "Saç + Sakal Paketi", category: "paket", durationMin: 70, price: 550 },
      { id: "s5", name: "Çocuk Saç Kesimi", category: "sac", durationMin: 30, price: 250 },
    ],
    staff: [
      { id: "st1", name: "Hasan Y.", title: "Usta Berber", initials: "HY" },
      { id: "st2", name: "Murat D.", title: "Usta Berber", initials: "MD" },
      { id: "st3", name: "Ali R.", title: "Çırak", initials: "AR" },
    ],
    hours: standardHours("09:00", "20:00", "19:00"),
    gallery: [g.warm, g.sand, g.night],
  },
  {
    id: "b3",
    slug: "the-gentlemen",
    name: "The Gentlemen Lounge",
    tagline: "Beyefendilere özel bakım",
    city: "Ankara",
    district: "Çankaya",
    address: "Kavaklıdere Mah. Tunalı Hilmi Cad. No:76, Çankaya",
    phone: "+90 312 000 00 03",
    rating: 4.7,
    reviewCount: 143,
    priceLevel: 3,
    about:
      "Randevunuzda size özel bir alan, kahveniz ve kusursuz bir hizmet. Detaylara önem verenler için.",
    services: [
      { id: "s1", name: "Saç Kesimi", category: "sac", durationMin: 50, price: 500 },
      { id: "s2", name: "Sakal Tasarımı", category: "sakal", durationMin: 30, price: 320 },
      { id: "s4", name: "Cilt Bakımı", category: "bakim", durationMin: 45, price: 450 },
      { id: "s6", name: "VIP Bakım Paketi", category: "paket", durationMin: 90, price: 900, description: "Saç + sakal + cilt" },
    ],
    staff: [
      { id: "st1", name: "Serkan A.", title: "Usta Berber", initials: "SA" },
      { id: "st2", name: "Kerem B.", title: "Berber", initials: "KB" },
    ],
    hours: standardHours("10:00", "20:00", "18:00"),
    gallery: [g.steel, g.night, g.gold],
    featured: true,
  },
  {
    id: "b4",
    slug: "kadikoy-berber",
    name: "Kadıköy Berber Evi",
    tagline: "Mahallenin güvenilir ustası",
    city: "İstanbul",
    district: "Kadıköy",
    address: "Osmanağa Mah. Söğütlüçeşme Cad. No:15, Kadıköy",
    phone: "+90 216 000 00 04",
    rating: 4.6,
    reviewCount: 421,
    priceLevel: 1,
    about:
      "20 yıldır aynı mahallede, aynı özenle. Hızlı, uygun ve dost canlısı.",
    services: [
      { id: "s1", name: "Saç Kesimi", category: "sac", durationMin: 30, price: 220 },
      { id: "s2", name: "Sakal Tıraşı", category: "sakal", durationMin: 20, price: 150 },
      { id: "s3", name: "Saç + Sakal", category: "paket", durationMin: 45, price: 330 },
    ],
    staff: [{ id: "st1", name: "Mehmet U.", title: "Usta Berber", initials: "MU" }],
    hours: standardHours("08:30", "20:30", "20:00"),
    gallery: [g.night, g.steel, g.warm],
  },
  {
    id: "b5",
    slug: "fade-studio",
    name: "Fade Studio",
    tagline: "Fade & modern kesim uzmanı",
    city: "İzmir",
    district: "Konak",
    address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No:31, Konak",
    phone: "+90 232 000 00 05",
    rating: 4.9,
    reviewCount: 256,
    priceLevel: 2,
    about:
      "Skin fade, taper ve modern kesimlerde iddialıyız. Genç ve dinamik bir ekip.",
    services: [
      { id: "s1", name: "Skin Fade Kesim", category: "sac", durationMin: 45, price: 420 },
      { id: "s2", name: "Sakal Tasarımı", category: "sakal", durationMin: 30, price: 280 },
      { id: "s3", name: "Fade + Sakal Paketi", category: "paket", durationMin: 70, price: 620 },
      { id: "s7", name: "Saç Boyası", category: "bakim", durationMin: 60, price: 700 },
    ],
    staff: [
      { id: "st1", name: "Burak Ş.", title: "Usta Berber", initials: "BŞ" },
      { id: "st2", name: "Onur G.", title: "Berber", initials: "OG" },
    ],
    hours: standardHours("10:00", "21:00", "20:00"),
    gallery: [g.gold, g.steel, g.sand],
    featured: true,
  },
  {
    id: "b6",
    slug: "cihangir-cut",
    name: "Cihangir Cut Club",
    tagline: "Butik, sakin, özenli",
    city: "İstanbul",
    district: "Beyoğlu",
    address: "Cihangir Mah. Akarsu Cad. No:3, Beyoğlu",
    phone: "+90 212 000 00 06",
    rating: 4.8,
    reviewCount: 167,
    priceLevel: 3,
    about:
      "Günde sınırlı sayıda randevu alıyoruz; böylece her misafire hak ettiği zamanı ayırıyoruz.",
    services: [
      { id: "s1", name: "Saç Kesimi", category: "sac", durationMin: 50, price: 480 },
      { id: "s2", name: "Sakal & Cilt", category: "bakim", durationMin: 40, price: 380 },
      { id: "s6", name: "Tam Bakım Paketi", category: "paket", durationMin: 85, price: 820 },
    ],
    staff: [
      { id: "st1", name: "Deniz A.", title: "Usta Berber", initials: "DA" },
      { id: "st2", name: "Efe M.", title: "Berber", initials: "EM" },
    ],
    hours: standardHours("11:00", "20:00", "19:00"),
    gallery: [g.sand, g.warm, g.gold],
  },
];

export function getBusinessBySlug(slug: string): Business | undefined {
  return businesses.find((b) => b.slug === slug);
}

export function allCities(): string[] {
  return Array.from(new Set(businesses.map((b) => b.city))).sort((a, b) =>
    a.localeCompare(b, "tr"),
  );
}

export function districtsForCity(city: string): string[] {
  return Array.from(
    new Set(businesses.filter((b) => b.city === city).map((b) => b.district)),
  ).sort((a, b) => a.localeCompare(b, "tr"));
}
