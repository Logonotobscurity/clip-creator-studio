import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  SectionHeader,
  StatsCard,
} from "@/clipin/components/primitives";
import { analyticsService } from "@/clipin/services";
import type { AnalyticsSnapshot } from "@/clipin/types";
import { formatTimecode } from "@/clipin/lib/validation";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — CLIPIN" },
      { name: "description", content: "Track clips created, exports finished and average clip length across your workspace." },
      { property: "og:title", content: "Analytics — CLIPIN" },
      { property: "og:description", content: "Track clips created, exports finished and average clip length across your workspace." },
    ],
  }),
  component: Page,
});

function Page() {
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      setSnapshot(await analyticsService.snapshot());
    } catch {
      setError("We couldn't load your numbers.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Workspace"
        title="Analytics"
        description="How much you are actually shipping."
      />

      {error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : snapshot === null ? (
        <LoadingState message="Crunching your workspace activity" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard label="Clips created" value={String(snapshot.clipsCreated)} hint="From generated sessions" />
            <StatsCard label="Exports finished" value={String(snapshot.exports)} hint="Completed render jobs" />
            <StatsCard label="Scheduled posts" value={String(snapshot.scheduled)} hint="Sitting in the queue" />
            <StatsCard
              label="Average clip length"
              value={snapshot.averageClipLength ? formatTimecode(snapshot.averageClipLength) : "—"}
              hint="Across every clip you kept"
            />
          </div>

          <section className="grid gap-4">
            <SectionHeader
              label="Platform performance"
              blurb="Views, watch time and engagement arrive once you connect a platform account."
            />
            <Panel>
              <p className="text-sm leading-relaxed text-muted-foreground">
                CLIPIN reports on what it can measure directly today: clips generated, renders
                completed and posts queued. Views, watch time and retention come from the platforms
                themselves, so they appear here after you connect TikTok, Instagram or YouTube — the
                analytics contract is already in place, so nothing in this page changes when that
                connection lands.
              </p>
            </Panel>
          </section>
        </>
      )}
    </div>
  );
}
