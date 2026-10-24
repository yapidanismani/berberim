import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "İşletme Kaydı" };

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/panel");

  return (
    <AuthShell
      title="İşletmeni Kaydet"
      subtitle="Ücretsiz hesap oluştur, randevularını yönetmeye başla."
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
