"use client";

import { useActionState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { addStaff, deleteStaff, type ActionState } from "@/app/panel/actions";
import { Button } from "@/components/ui/button";

interface PanelStaff {
  id: string;
  name: string;
  title: string;
  initials: string;
}

const input =
  "h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-gold/60";

export function StaffManager({
  businessId,
  staff,
}: {
  businessId: string;
  staff: PanelStaff[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    addStaff,
    {},
  );

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display text-lg font-semibold">Personel</h2>
      <p className="mt-0.5 text-sm text-muted">
        Müşteriler randevu alırken usta seçebilir.
      </p>

      <div className="mt-4 divide-y divide-border/70">
        {staff.length === 0 && (
          <p className="py-4 text-sm text-muted">
            Henüz personel eklenmedi. (Müşteri &ldquo;Fark etmez&rdquo; seçebilir.)
          </p>
        )}
        {staff.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface font-semibold text-muted-strong ring-1 ring-border">
                {s.initials}
              </span>
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted">{s.title}</p>
              </div>
            </div>
            <form action={deleteStaff}>
              <input type="hidden" name="staffId" value={s.id} />
              <button
                type="submit"
                aria-label="Personeli sil"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-danger/50 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          </div>
        ))}
      </div>

      <form
        action={formAction}
        className="mt-4 rounded-xl border border-border bg-surface p-4"
      >
        <input type="hidden" name="businessId" value={businessId} />
        <p className="mb-3 text-sm font-medium text-muted-strong">
          Yeni personel
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          <input
            name="name"
            required
            placeholder="Ad Soyad"
            className={`${input} sm:col-span-2`}
          />
          <input
            name="title"
            placeholder="Unvan (örn. Usta Berber)"
            className={`${input} sm:col-span-2`}
          />
          <Button type="submit" disabled={pending}>
            <Plus className="h-4 w-4" /> {pending ? "Ekleniyor…" : "Ekle"}
          </Button>
        </div>
        {state.error && <p className="mt-3 text-sm text-danger">{state.error}</p>}
      </form>
    </section>
  );
}
