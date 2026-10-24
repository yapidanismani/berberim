import { Store } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[72vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface ring-1 ring-border">
          <Store className="h-7 w-7 text-gold" />
        </span>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      <div className="animate-fade-up rounded-2xl border border-border bg-card p-6">
        {children}
      </div>
    </div>
  );
}
