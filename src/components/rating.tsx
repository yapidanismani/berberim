import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <Star className="h-4 w-4 fill-gold text-gold" aria-hidden />
      <span className="font-semibold text-foreground">
        {value.toFixed(1)}
      </span>
      {count != null && (
        <span className="text-muted">({count})</span>
      )}
    </span>
  );
}

export function PriceLevel({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="text-sm tracking-wide" aria-label={`Fiyat seviyesi ${level}`}>
      <span className="text-gold">{"₺".repeat(level)}</span>
      <span className="text-border-strong">{"₺".repeat(3 - level)}</span>
    </span>
  );
}
