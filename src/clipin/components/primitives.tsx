import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* --------------------------------- headers -------------------------------- */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="editorial-title text-4xl sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}

export function SectionHeader({
  label,
  blurb,
  action,
}: {
  label: string;
  blurb?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-b border-border pb-4 sm:flex sm:justify-between">
      <div className="min-w-0">
        <h2 className="font-display text-2xl">{label}</h2>
        {blurb ? <p className="mt-1 text-sm text-muted-foreground">{blurb}</p> : null}
      </div>
      {action}
    </div>
  );
}

/* ---------------------------------- pills --------------------------------- */

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "info" | "danger" | "success";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    info: "bg-info text-info-foreground",
    danger: "bg-destructive text-destructive-foreground",
    success: "bg-success text-success-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------------------------- cards --------------------------------- */

export function Panel({
  children,
  className,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-border bg-card p-6 text-card-foreground sm:p-8",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function StatsCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 font-display text-4xl leading-none">{value}</p>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/* --------------------------------- states --------------------------------- */

export function LoadingState({ message, detail }: { message: string; detail?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center"
    >
      <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      <p className="font-display text-xl">{message}</p>
      {detail ? <p className="max-w-md text-sm text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <Inbox className="size-6 text-muted-foreground" aria-hidden="true" />
      <p className="font-display text-xl">{title}</p>
      {description ? (
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "That didn't work",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/40 bg-card px-6 py-12 text-center"
    >
      <AlertTriangle className="size-6 text-destructive" aria-hidden="true" />
      <p className="font-display text-xl">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
