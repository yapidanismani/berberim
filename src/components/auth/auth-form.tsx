"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { login, register, type AuthState } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-gold/60";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const action = isLogin ? login : register;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    {},
  );

  // Kayıt sonrası e-posta doğrulaması gerekiyorsa bilgilendirme ekranı göster.
  if (state.info) {
    return (
      <div className="space-y-4 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          <MailCheck className="h-7 w-7" />
        </span>
        <p className="text-sm leading-relaxed text-muted-strong">
          {state.info}
        </p>
        <Link
          href="/giris"
          className="inline-flex h-11 items-center justify-center rounded-full border border-border-strong px-5 text-sm font-medium text-foreground transition-colors hover:border-gold/60 hover:text-gold"
        >
          Giriş sayfasına git
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-muted-strong">
          E-posta
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="ornek@isletme.com"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-muted-strong">
          Şifre
        </span>
        <input
          type="password"
          name="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
          minLength={6}
          placeholder={isLogin ? "••••••••" : "En az 6 karakter"}
          className={inputClass}
        />
      </label>

      {state.error && (
        <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending
          ? "Lütfen bekleyin…"
          : isLogin
            ? "Giriş Yap"
            : "Hesap Oluştur"}
      </Button>

      <p className="pt-1 text-center text-sm text-muted">
        {isLogin ? (
          <>
            Hesabın yok mu?{" "}
            <Link href="/kayit" className="font-medium text-gold hover:underline">
              İşletmeni kaydet
            </Link>
          </>
        ) : (
          <>
            Zaten hesabın var mı?{" "}
            <Link href="/giris" className="font-medium text-gold hover:underline">
              Giriş yap
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
