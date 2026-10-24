"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { saveHours } from "@/app/panel/actions";
import { Button } from "@/components/ui/button";
import { WEEKDAY_LABELS } from "@/lib/utils";

interface PanelHours {
  day: number;
  open: string | null;
  close: string | null;
}

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const timeInput =
  "h-9 rounded-lg border border-border bg-surface px-2 text-sm text-foreground outline-none focus:border-gold/60 disabled:opacity-40";

export function HoursManager({
  businessId,
  hours,
}: {
  businessId: string;
  hours: PanelHours[];
}) {
  const byDay = new Map(hours.map((h) => [h.day, h]));
  const [closed, setClosed] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    for (const d of DAY_ORDER) {
      const h = byDay.get(d);
      init[d] = !h?.open || !h?.close;
    }
    return init;
  });

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display text-lg font-semibold">Çalışma Saatleri</h2>
      <p className="mt-0.5 text-sm text-muted">
        Randevu alınabilecek gün ve saatler.
      </p>

      <form action={saveHours} className="mt-4 space-y-2">
        <input type="hidden" name="businessId" value={businessId} />
        {DAY_ORDER.map((day) => {
          const h = byDay.get(day);
          const isClosed = closed[day];
          return (
            <div
              key={day}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2"
            >
              <span className="w-24 shrink-0 text-sm font-medium">
                {WEEKDAY_LABELS[day]}
              </span>

              <input
                type="time"
                name={`open_${day}`}
                defaultValue={h?.open ?? "09:00"}
                disabled={isClosed}
                className={timeInput}
              />
              <span className="text-muted">–</span>
              <input
                type="time"
                name={`close_${day}`}
                defaultValue={h?.close ?? "19:00"}
                disabled={isClosed}
                className={timeInput}
              />

              <label className="ml-auto flex items-center gap-1.5 text-sm text-muted">
                <input
                  type="checkbox"
                  name={`closed_${day}`}
                  checked={isClosed}
                  onChange={(e) =>
                    setClosed((prev) => ({ ...prev, [day]: e.target.checked }))
                  }
                  className="h-4 w-4 accent-gold"
                />
                Kapalı
              </label>
            </div>
          );
        })}

        <div className="pt-2">
          <Button type="submit" variant="secondary">
            <Save className="h-4 w-4" /> Saatleri Kaydet
          </Button>
        </div>
      </form>
    </section>
  );
}
