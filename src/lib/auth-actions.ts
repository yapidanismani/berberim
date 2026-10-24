"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
  info?: string;
}

function trError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "E-posta veya şifre hatalı.";
  if (m.includes("email not confirmed"))
    return "E-posta henüz onaylanmadı. Lütfen e-postanızı kontrol edin.";
  if (m.includes("user already registered") || m.includes("already registered"))
    return "Bu e-posta ile zaten bir hesap var. Giriş yapın.";
  if (m.includes("password should be at least"))
    return "Şifre en az 6 karakter olmalı.";
  if (
    m.includes("unable to validate email") ||
    m.includes("invalid email") ||
    m.includes("is invalid")
  )
    return "Geçerli bir e-posta adresi girin.";
  if (m.includes("rate limit"))
    return "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin.";
  return message;
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "E-posta ve şifre gerekli." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: trError(error.message) };

  redirect("/panel");
}

export async function register(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "E-posta ve şifre gerekli." };
  if (password.length < 6) return { error: "Şifre en az 6 karakter olmalı." };

  const supabase = await createClient();

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });
  if (error) return { error: trError(error.message) };

  // E-posta onayı açıkken signUp oturum döndürmez: kullanıcı e-postasını
  // doğrulamalı (üretim davranışı).
  if (!data.session) {
    return {
      info: `${email} adresine bir doğrulama bağlantısı gönderdik. Hesabını etkinleştirmek için e-postandaki bağlantıya tıkla, sonra giriş yap.`,
    };
  }

  // Onay kapalıysa (ör. yerel geliştirme) doğrudan panele.
  redirect("/panel");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
