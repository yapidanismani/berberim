import Link from "next/link";
import { Scissors } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface ring-1 ring-border">
                <Scissors className="h-4 w-4 text-gold" />
              </span>
              <span className="font-display text-lg font-semibold">Berberim</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Berberler için online randevu sistemi. Kendi sayfanı oluştur,
              randevularını tek yerden yönet.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:gap-14">
            <div>
              <h4 className="mb-3 font-medium text-foreground">Ürün</h4>
              <ul className="space-y-2 text-muted">
                <li><a href="/#nasil" className="hover:text-foreground">Nasıl Çalışır?</a></li>
                <li><Link href="/kayit" className="hover:text-foreground">Ücretsiz Başla</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-medium text-foreground">Hesap</h4>
              <ul className="space-y-2 text-muted">
                <li><Link href="/giris" className="hover:text-foreground">Giriş Yap</Link></li>
                <li><Link href="/panel" className="hover:text-foreground">Panel</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/70 pt-6 text-xs text-muted">
          © 2026 Berberim · MVP demo · Tüm veriler örnektir.
        </div>
      </div>
    </footer>
  );
}
