import Link from "next/link";
import {
  ArrowRight,
  UserPlus,
  Scissors,
  Share2,
  CalendarCheck,
  Clock,
  Smartphone,
  BadgePercent,
  Users,
  Star,
  Check,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Hesabını oluştur",
    text: "İşletmeni birkaç bilgiyle dakikalar içinde kaydet.",
  },
  {
    icon: Scissors,
    title: "Hizmet ve saatlerini ekle",
    text: "Fiyatlarını, hizmetlerini ve çalışma saatlerini belirle.",
  },
  {
    icon: Share2,
    title: "Linkini paylaş",
    text: "Randevu sayfanı müşterilerinle paylaş, randevular panelinde toplansın.",
  },
];

const features = [
  {
    icon: CalendarCheck,
    title: "Kendi randevu sayfan",
    text: "berberim.com/berber/senin-dukkanin — Instagram'da, WhatsApp'ta paylaş.",
  },
  {
    icon: Clock,
    title: "7/24 online randevu",
    text: "Müşterilerin sen uyurken bile uygun saatten randevu alsın.",
  },
  {
    icon: Users,
    title: "Hizmet & personel yönetimi",
    text: "Ustalarını, hizmetlerini ve sürelerini tek yerden düzenle.",
  },
  {
    icon: BadgePercent,
    title: "Komisyon yok",
    text: "Randevu başına ücret yok. Kendi müşterin, kendi takvimin.",
  },
  {
    icon: Smartphone,
    title: "Mobil öncelikli",
    text: "Hem müşteri hem sen; telefondan hızlı ve kolay kullanım.",
  },
  {
    icon: Star,
    title: "Türkçe & yerel",
    text: "Türkçe arayüz, Europe/Istanbul saat dilimi, yerel biçimler.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 sm:px-6 sm:pt-20 sm:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-strong">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Berberler için online randevu sistemi
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
              Müşterilerin online randevu alsın,{" "}
              <span className="text-gold">sen işine odaklan.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Berberin için kendi randevu sayfanı dakikalar içinde oluştur.
              Müşterilerin uygun saatten kendi alsın, sen takvimini tek yerden
              yönet.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/kayit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-medium text-primary-foreground transition-all hover:bg-primary-hover active:scale-[0.98]"
              >
                Ücretsiz Başla <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#nasil"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong px-6 text-sm font-medium text-foreground transition-colors hover:border-gold/60 hover:text-gold"
              >
                Nasıl çalışır?
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-gold/80" /> Kurulum ücreti yok
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-gold/80" /> Komisyon yok
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-gold/80" /> Dakikalar içinde hazır
              </span>
            </div>
          </div>

          {/* Örnek randevu sayfası önizlemesi */}
          <div className="animate-fade-up lg:justify-self-end">
            <BookingPreview />
          </div>
        </div>
      </section>

      {/* Nasıl çalışır */}
      <section
        id="nasil"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            3 adımda başla
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Teknik bilgi gerekmez. Hesabını aç, sayfanı paylaş, randevuları al.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <span className="absolute right-5 top-5 font-display text-5xl font-semibold text-border-strong/60">
                {i + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface ring-1 ring-border">
                <step.icon className="h-6 w-6 text-gold" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Özellikler */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Berberin için her şey hazır
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Randevu defterini çöpe at. Her şey tek panelde.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-border-strong"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface ring-1 ring-border">
                <f.icon className="h-5 w-5 text-gold" />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Son CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="rounded-3xl border border-border bg-surface p-10 text-center sm:p-16">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Berberin için hemen başla
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Ücretsiz hesap oluştur, ilk randevunu bugün almaya başla.
            </p>
            <Link
              href="/kayit"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-medium text-primary-foreground transition-all hover:bg-primary-hover active:scale-[0.98]"
            >
              Ücretsiz Başla <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="mt-4 text-sm text-muted">
              Zaten hesabın var mı?{" "}
              <Link href="/giris" className="text-gold hover:underline">
                Giriş yap
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Dekoratif: müşterinin göreceği randevu sayfasının küçük önizlemesi */
function BookingPreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_18px_40px_-20px_rgba(0,0,0,0.10)]">
        <div
          className="relative h-24"
          style={{
            background:
              "linear-gradient(135deg,#f0ede8 0%,#e8e3db 55%,#ddd3c2 150%)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Scissors className="h-8 w-8 text-foreground" />
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-semibold leading-tight">
                Modern Cut
              </p>
              <p className="text-xs text-muted">Kadıköy, İstanbul</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-1 text-xs text-gold ring-1 ring-border">
              <Star className="h-3 w-3 fill-gold text-gold" /> 4.9
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-surface p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Saç + Sakal Paketi</span>
              <span className="text-sm font-semibold">₺650</span>
            </div>
            <span className="text-xs text-muted">1 sa 15 dk</span>
          </div>

          <p className="mt-4 mb-2 text-xs text-muted">Uygun saat seç</p>
          <div className="grid grid-cols-4 gap-1.5">
            {["10:00", "11:00", "13:30", "15:00", "16:00", "17:30", "18:00", "19:00"].map(
              (t, i) => (
                <span
                  key={t}
                  className={
                    i === 2
                      ? "rounded-lg bg-primary py-1.5 text-center text-xs font-medium text-primary-foreground"
                      : "rounded-lg border border-border bg-surface py-1.5 text-center text-xs text-muted-strong"
                  }
                >
                  {t}
                </span>
              ),
            )}
          </div>

          <div className="mt-4 flex h-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            Randevuyu Onayla
          </div>
        </div>
      </div>
      <div className="mt-3 text-center text-xs text-muted">
        Müşterilerinin göreceği randevu sayfası
      </div>
    </div>
  );
}
