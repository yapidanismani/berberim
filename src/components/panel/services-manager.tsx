"use client";

import { useActionState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";
import { addService, deleteService, type ActionState } from "@/app/panel/actions";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDuration } from "@/lib/utils";

interface PanelService {
  id: string;
  name: string;
  category: string;
  durationMin: number;
  price: number;
}

const input =
  "h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-gold/60";

const categories = [
  { value: "sac", label: "Saç" },
  { value: "sakal", label: "Sakal" },
  { value: "bakim", label: "Bakım" },
  { value: "paket", label: "Paket" },
];

export function ServicesManager({
  businessId,
  services,
}: {
  businessId: string;
  services: PanelService[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    addService,
    {},
  );

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display text-lg font-semibold">Hizmetler</h2>
      <p className="mt-0.5 text-sm text-muted">
        Müşterilerin randevu alırken seçeceği hizmetler.
      </p>

      <div className="mt-4 divide-y divide-border/70">
        {services.length === 0 && (
          <p className="py-4 text-sm text-muted">Henüz hizmet eklenmedi.</p>
        )}
        {services.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 py-3">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(s.durationMin)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{formatPrice(s.price)}</span>
              <form action={deleteService}>
                <input type="hidden" name="serviceId" value={s.id} />
                <button
                  type="submit"
                  aria-label="Hizmeti sil"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-danger/50 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Yeni hizmet ekle */}
      <form
        action={formAction}
        className="mt-4 rounded-xl border border-border bg-surface p-4"
      >
        <input type="hidden" name="businessId" value={businessId} />
        <p className="mb-3 text-sm font-medium text-muted-strong">Yeni hizmet</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <input
            name="name"
            required
            placeholder="Hizmet adı"
            className={`${input} col-span-2`}
          />
          <select name="category" className={input} defaultValue="sac">
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            name="durationMin"
            type="number"
            min={5}
            step={5}
            required
            placeholder="Dakika"
            className={input}
          />
          <input
            name="price"
            type="number"
            min={0}
            step={10}
            required
            placeholder="Fiyat (₺)"
            className={`${input} col-span-2 sm:col-span-1`}
          />
          <div className="col-span-2 sm:col-span-3">
            <Button type="submit" className="w-full" disabled={pending}>
              <Plus className="h-4 w-4" /> {pending ? "Ekleniyor…" : "Hizmet Ekle"}
            </Button>
          </div>
        </div>
        {state.error && (
          <p className="mt-3 text-sm text-danger">{state.error}</p>
        )}
      </form>
    </section>
  );
}
