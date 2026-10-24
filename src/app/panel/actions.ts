"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface ActionState {
  error?: string;
  ok?: boolean;
}

function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return input
    .trim()
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => map[c] ?? c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum bulunamadı.");
  return { supabase, user };
}

/** Giriş yapan kullanıcı için yeni işletme oluşturur (owner_id = kullanıcı). */
export async function createBusiness(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const about = String(formData.get("about") ?? "").trim();

  if (!name || !city || !district)
    return { error: "İşletme adı, şehir ve ilçe gerekli." };

  const { supabase, user } = await requireUser();

  // Benzersiz slug üret
  const base = slugify(name) || "isletme";
  let slug = base;
  for (let i = 2; i < 50; i++) {
    const { data: existing } = await supabase
      .from("businesses")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${base}-${i}`;
  }

  const { data: business, error } = await supabase
    .from("businesses")
    .insert({
      slug,
      name,
      tagline: tagline || null,
      city,
      district,
      address: address || null,
      phone: phone || null,
      about: about || null,
      owner_id: user.id,
      gallery: [
        "linear-gradient(135deg,#2a2d33 0%,#3a3327 55%,#c9a24b 160%)",
        "linear-gradient(135deg,#241e18 0%,#3a2e22 55%,#6b513a 150%)",
        "linear-gradient(135deg,#1c2026 0%,#2b3138 60%,#4a5560 140%)",
      ],
    })
    .select("id")
    .single();

  if (error) return { error: `İşletme oluşturulamadı: ${error.message}` };

  // Varsayılan çalışma saatleri (Pzt–Cmt açık, Pazar kapalı)
  const hours = [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    business_id: business.id,
    day,
    open: day === 0 ? null : "09:00",
    close: day === 0 ? null : day === 6 ? "18:00" : "19:00",
  }));
  await supabase.from("working_hours").insert(hours);

  revalidatePath("/panel");
  redirect("/panel");
}

export async function addService(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const businessId = String(formData.get("businessId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "sac");
  const durationMin = Number(formData.get("durationMin"));
  const price = Number(formData.get("price"));

  if (!businessId || !name) return { error: "Hizmet adı gerekli." };
  if (!Number.isFinite(durationMin) || durationMin <= 0)
    return { error: "Geçerli bir süre girin." };
  if (!Number.isFinite(price) || price < 0)
    return { error: "Geçerli bir fiyat girin." };

  const { supabase } = await requireUser();
  const { error } = await supabase.from("services").insert({
    business_id: businessId,
    name,
    category,
    duration_min: durationMin,
    price,
  });

  if (error) return { error: `Hizmet eklenemedi: ${error.message}` };
  revalidatePath("/panel");
  return { ok: true };
}

export async function deleteService(formData: FormData): Promise<void> {
  const serviceId = String(formData.get("serviceId") ?? "");
  if (!serviceId) return;
  const { supabase } = await requireUser();
  await supabase.from("services").delete().eq("id", serviceId);
  revalidatePath("/panel");
}

function initialsFrom(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toLocaleUpperCase("tr") || "?"
  );
}

export async function addStaff(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const businessId = String(formData.get("businessId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();

  if (!businessId || !name) return { error: "Personel adı gerekli." };

  const { supabase } = await requireUser();
  const { error } = await supabase.from("staff").insert({
    business_id: businessId,
    name,
    title: title || "Berber",
    initials: initialsFrom(name),
  });

  if (error) return { error: `Personel eklenemedi: ${error.message}` };
  revalidatePath("/panel");
  return { ok: true };
}

export async function deleteStaff(formData: FormData): Promise<void> {
  const staffId = String(formData.get("staffId") ?? "");
  if (!staffId) return;
  const { supabase } = await requireUser();
  await supabase.from("staff").delete().eq("id", staffId);
  revalidatePath("/panel");
}

export async function saveHours(formData: FormData): Promise<void> {
  const businessId = String(formData.get("businessId") ?? "");
  if (!businessId) return;
  const { supabase } = await requireUser();

  for (let day = 0; day <= 6; day++) {
    const closed = formData.get(`closed_${day}`) === "on";
    const open = closed ? null : String(formData.get(`open_${day}`) ?? "") || null;
    const close = closed ? null : String(formData.get(`close_${day}`) ?? "") || null;
    await supabase
      .from("working_hours")
      .update({ open, close })
      .eq("business_id", businessId)
      .eq("day", day);
  }
  revalidatePath("/panel");
}

export async function updateBookingStatus(formData: FormData): Promise<void> {
  const bookingId = String(formData.get("bookingId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!bookingId || !status) return;
  const { supabase } = await requireUser();
  await supabase.from("bookings").update({ status }).eq("id", bookingId);
  revalidatePath("/panel");
}

export async function updateBusinessProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const businessId = String(formData.get("businessId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const about = String(formData.get("about") ?? "").trim();
  const cover = String(formData.get("cover") ?? "").trim();
  const coverUrl = String(formData.get("cover_url") ?? "").trim();
  const logoUrl = String(formData.get("logo_url") ?? "").trim();

  if (!businessId) return { error: "İşletme bulunamadı." };
  if (!name) return { error: "İşletme adı boş olamaz." };

  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("businesses")
    .update({
      name,
      tagline: tagline || null,
      address: address || null,
      phone: phone || null,
      about: about || null,
      cover_url: coverUrl || null,
      logo_url: logoUrl || null,
      ...(cover ? { gallery: [cover] } : {}),
    })
    .eq("id", businessId);

  if (error) return { error: `Profil güncellenemedi: ${error.message}` };
  revalidatePath("/panel");
  return { ok: true };
}
