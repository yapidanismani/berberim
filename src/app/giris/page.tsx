import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "İşletme Girişi" };

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/panel");

  return (
    <AuthShell
      title="İşletme Girişi"
      subtitle="Panele erişmek için hesabınla giriş yap."
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
