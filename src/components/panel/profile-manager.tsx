"use client";

import { useActionState, useRef, useState } from "react";
import {
  Check,
  Scissors,
  Store,
  Upload,
  ImageOff,
  Loader2,
} from "lucide-react";
import {
  updateBusinessProfile,
  type ActionState,
} from "@/app/panel/actions";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";

const input =
  "h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-gold/60";
const label = "mb-1.5 block text-sm font-medium text-muted-strong";

const covers = [
  { key: "gold", label: "Altın", value: "linear-gradient(135deg,#2a2d33 0%,#3a3327 55%,#c9a24b 160%)" },
  { key: "steel", label: "Çelik", value: "linear-gradient(135deg,#1c2026 0%,#2b3138 60%,#4a5560 140%)" },
  { key: "warm", label: "Sıcak", value: "linear-gradient(135deg,#241e18 0%,#3a2e22 55%,#6b513a 150%)" },
  { key: "night", label: "Gece", value: "linear-gradient(135deg,#14161a 0%,#1f2730 60%,#33404d 140%)" },
  { key: "sand", label: "Kum", value: "linear-gradient(135deg,#2a2621 0%,#413a2d 55%,#8a7450 150%)" },
];

const MAX_BYTES = 5 * 1024 * 1024;

interface ProfileData {
  businessId: string;
  name: string;
  tagline: string;
  address: string;
  phone: string;
  about: string;
  cover: string; // gradyan
  coverUrl: string | null;
  logoUrl: string | null;
}

export function ProfileManager({ data }: { data: ProfileData }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateBusinessProfile,
    {},
  );

  const initialCover =
    covers.find((c) => c.value === data.cover)?.value ?? covers[0].value;
  const [cover, setCover] = useState(initialCover);
  const [coverUrl, setCoverUrl] = useState<string | null>(data.coverUrl);
  const [logoUrl, setLogoUrl] = useState<string | null>(data.logoUrl);
  const [busy, setBusy] = useState<null | "cover" | "logo">(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const coverRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  async function upload(file: File, kind: "cover" | "logo"): Promise<string> {
    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${data.businessId}/${kind}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("covers")
      .upload(path, file, { upsert: true, cacheControl: "3600" });
    if (error) throw error;
    const { data: pub } = supabase.storage.from("covers").getPublicUrl(path);
    return pub.publicUrl;
  }

  async function handleFile(
    e: React.ChangeEvent<HTMLInputElement>,
    kind: "cover" | "logo",
  ) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Lütfen bir görsel dosyası seçin.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError("Görsel 5 MB'dan küçük olmalı.");
      return;
    }
    setUploadError(null);
    setBusy(kind);
    try {
      const url = await upload(file, kind);
      if (kind === "cover") setCoverUrl(url);
      else setLogoUrl(url);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Görsel yüklenemedi.",
      );
    } finally {
      setBusy(null);
    }
  }

  const initials =
    data.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toLocaleUpperCase("tr") || "B";

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display text-lg font-semibold">İşletme Profili</h2>
      <p className="mt-0.5 text-sm text-muted">
        Randevu sayfanda görünen bilgiler.
      </p>

      <form action={formAction} className="mt-4 space-y-4">
        <input type="hidden" name="businessId" value={data.businessId} />
        <input type="hidden" name="cover" value={cover} />
        <input type="hidden" name="cover_url" value={coverUrl ?? ""} />
        <input type="hidden" name="logo_url" value={logoUrl ?? ""} />

        {/* Kapak */}
        <div>
          <span className={label}>Kapak</span>
          <div
            className="relative mb-3 flex h-24 items-center justify-center overflow-hidden rounded-xl border border-border"
            style={
              coverUrl
                ? {
                    backgroundImage: `url(${coverUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : { background: cover }
            }
          >
            {!coverUrl && <Scissors className="h-7 w-7 text-foreground/25" />}
            {busy === "cover" && (
              <span className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Loader2 className="h-6 w-6 animate-spin text-gold" />
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e, "cover")}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => coverRef.current?.click()}
              disabled={busy !== null}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border-strong px-3 text-sm font-medium text-foreground transition-colors hover:border-gold/60 hover:text-gold disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {coverUrl ? "Görseli değiştir" : "Görsel yükle"}
            </button>
            {coverUrl && (
              <button
                type="button"
                onClick={() => setCoverUrl(null)}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted transition-colors hover:border-danger/50 hover:text-danger"
              >
                <ImageOff className="h-4 w-4" /> Görseli kaldır
              </button>
            )}
            <span className="text-xs text-muted">PNG/JPG, en fazla 5 MB</span>
          </div>

          {!coverUrl && (
            <div className="mt-3">
              <span className="mb-2 block text-xs text-muted">
                veya hazır bir tema seç
              </span>
              <div className="flex flex-wrap gap-2">
                {covers.map((c) => {
                  const active = cover === c.value;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setCover(c.value)}
                      aria-label={c.label}
                      className={
                        "relative h-9 w-12 overflow-hidden rounded-lg border-2 transition-all " +
                        (active
                          ? "border-gold"
                          : "border-border hover:border-border-strong")
                      }
                      style={{ background: c.value }}
                    >
                      {active && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-4 w-4 text-foreground drop-shadow" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Logo */}
        <div>
          <span className={label}>Logo</span>
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-display text-lg font-semibold text-gold">
                  {initials}
                </span>
              )}
              {busy === "logo" && (
                <span className="absolute inset-0 flex items-center justify-center bg-background/60">
                  <Loader2 className="h-5 w-5 animate-spin text-gold" />
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e, "logo")}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoRef.current?.click()}
                disabled={busy !== null}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border-strong px-3 text-sm font-medium text-foreground transition-colors hover:border-gold/60 hover:text-gold disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {logoUrl ? "Logoyu değiştir" : "Logo yükle"}
              </button>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl(null)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted transition-colors hover:border-danger/50 hover:text-danger"
                >
                  <ImageOff className="h-4 w-4" /> Kaldır
                </button>
              )}
            </div>
          </div>
        </div>

        {uploadError && <p className="text-sm text-danger">{uploadError}</p>}

        <label className="block">
          <span className={label}>İşletme adı *</span>
          <input name="name" required defaultValue={data.name} className={input} />
        </label>

        <label className="block">
          <span className={label}>Kısa tanım</span>
          <input
            name="tagline"
            defaultValue={data.tagline}
            placeholder="Çağdaş erkek kuaförü"
            className={input}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Adres</span>
            <input name="address" defaultValue={data.address} className={input} />
          </label>
          <label className="block">
            <span className={label}>Telefon</span>
            <input name="phone" defaultValue={data.phone} className={input} />
          </label>
        </div>

        <label className="block">
          <span className={label}>Hakkında</span>
          <textarea
            name="about"
            rows={3}
            defaultValue={data.about}
            placeholder="İşletmeni kısaca anlat…"
            className={`${input} h-auto resize-none py-2.5`}
          />
        </label>

        {state.error && (
          <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}
        {state.ok && !pending && (
          <p className="inline-flex items-center gap-1.5 rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
            <Check className="h-4 w-4" /> Profil güncellendi.
          </p>
        )}

        <div>
          <Button type="submit" disabled={pending || busy !== null}>
            <Store className="h-4 w-4" />
            {pending ? "Kaydediliyor…" : "Profili Kaydet"}
          </Button>
        </div>
      </form>
    </section>
  );
}
