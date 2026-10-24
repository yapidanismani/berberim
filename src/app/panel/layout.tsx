import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface ring-1 ring-border">
            <LayoutDashboard className="h-5 w-5 text-gold" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold leading-tight">
              İşletme Paneli
            </p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden rounded-full border border-border-strong px-4 py-2 text-sm text-foreground transition-colors hover:border-gold/60 hover:text-gold sm:inline-block"
          >
            Siteyi gör
          </Link>
          <form action={logout}>
            <Button variant="secondary" size="sm" type="submit">
              <LogOut className="h-4 w-4" /> Çıkış
            </Button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
