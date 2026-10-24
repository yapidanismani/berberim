import Link from "next/link";
import { Scissors } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface ring-1 ring-border transition-colors">
            <Scissors className="h-5 w-5 text-gold" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Berberim
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted sm:flex">
          <a href="/#nasil" className="transition-colors hover:text-foreground">
            Nasıl Çalışır?
          </a>
          <Link
            href="/giris"
            className="transition-colors hover:text-foreground"
          >
            Giriş Yap
          </Link>
        </nav>

        <Link
          href="/kayit"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Ücretsiz Başla
        </Link>
      </div>
    </header>
  );
}
