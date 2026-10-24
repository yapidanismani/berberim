"use client";

import { useActionState } from "react";
import { Store } from "lucide-react";
import { createBusiness, type ActionState } from "@/app/panel/actions";
import { Button } from "@/components/ui/button";

const input =
  "h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-gold/60";
const label = "mb-1.5 block text-sm font-medium text-muted-strong";

export function CreateBusinessForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createBusiness,
    {},
  );

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface ring-1 ring-border">
          <Store className="h-7 w-7 text-gold" />
        </span>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          İşletmeni oluştur
        </h1>
        <p className="mt-1 text-sm text-muted">
          Birkaç bilgiyle başla; hizmetlerini ve saatlerini sonra ekleyebilirsin.
        </p>
      </div>

      <form
        action={formAction}
        className="space-y-4 rounded-2xl border border-border bg-card p-6"
      >
        <label className="block">
          <span className={label}>İşletme adı *</span>
          <input name="name" required placeholder="Örn. Modern Cut" className={input} />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className={label}>Şehir *</span>
            <input name="city" required placeholder="İstanbul" className={input} />
          </label>
          <label className="block">
            <span className={label}>İlçe *</span>
            <input name="district" required placeholder="Kadıköy" className={input} />
          </label>
        </div>

        <label className="block">
          <span className={label}>Kısa tanım</span>
          <input
            name="tagline"
            placeholder="Çağdaş erkek kuaförü"
            className={input}
          />
        </label>

        <label className="block">
          <span className={label}>Adres</span>
          <input name="address" placeholder="Mahalle, cadde, no" className={input} />
        </label>

        <label className="block">
          <span className={label}>Telefon</span>
          <input name="phone" placeholder="+90 5XX XXX XX XX" className={input} />
        </label>

        <label className="block">
          <span className={label}>Hakkında</span>
          <textarea
            name="about"
            rows={3}
            placeholder="İşletmeni kısaca anlat…"
            className={`${input} h-auto resize-none py-2.5`}
          />
        </label>

        {state.error && (
          <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Oluşturuluyor…" : "İşletmeyi Oluştur"}
        </Button>
      </form>
    </div>
  );
}
