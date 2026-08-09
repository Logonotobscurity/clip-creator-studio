import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Pill,
  SectionHeader,
} from "@/clipin/components/primitives";
import { historyService } from "@/clipin/services";
import type { HistoryEntry } from "@/clipin/types";

export const Route = createFileRoute("/app/history")({
  head: () => ({
    meta: [
      { title: "History — CLIPIN" },
      { name: "description", content: "Every clip generated, edited, exported and scheduled in one timeline." },
      { property: "og:title", content: "History — CLIPIN" },
      { property: "og:description", content: "Every clip generated, edited, exported and scheduled in one timeline." },
    ],
  }),
  component: Page,
});

const toneFor = (status: HistoryEntry["status"]) =>
  status === "error" ? "danger" : status === "warn" ? "accent" : "success";

function Page() {
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const items = await historyService.list();
      setEntries([...items].sort((a, b) => b.date.localeCompare(a.date)));
    } catch {
      setError("We couldn't load your history.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const clear = async () => {
    await historyService.clear();
    toast.success("History cleared");
    await load();
  };

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Workspace"
        title="History"
        description="Everything you have generated, exported and scheduled."
        actions={
          entries?.length ? (
            <Button variant="outline" onClick={() => void clear()}>
              <Trash2 aria-hidden="true" />
              Clear history
            </Button>
          ) : undefined
        }
      />

      <section className="grid gap-4">
        <SectionHeader label="Activity" blurb="Newest first." />
        {error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : entries === null ? (
          <LoadingState message="Loading your activity" />
        ) : entries.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="Generate clips or schedule a post and it will be logged here."
          />
        ) : (
          <ol className="grid gap-3">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="grid gap-2 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone={toneFor(entry.status)}>{entry.action}</Pill>
                    <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {entry.project}
                    </span>
                  </div>
                  <p className="mt-2 truncate font-display text-lg">{entry.video}</p>
                </div>
                <time
                  dateTime={entry.date}
                  className="text-xs text-muted-foreground sm:text-right"
                >
                  {new Date(entry.date).toLocaleString()}
                </time>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
