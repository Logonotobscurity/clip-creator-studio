import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/clipin/components/primitives";

export const Route = createFileRoute("/app/schedule")({
  head: () => ({
    meta: [
      { title: "Publishing hub — CLIPIN" },
      { name: "description", content: "Queue finished clips for TikTok, Instagram and YouTube on a schedule you control." },
      { property: "og:title", content: "Publishing hub — CLIPIN" },
      { property: "og:description", content: "Queue finished clips for TikTok, Instagram and YouTube on a schedule you control." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="grid gap-10">
      <PageHeader eyebrow="Schedule" title="Publishing hub" description="Queue clips with captions and hashtags, then keep an eye on what goes out when." />
    </div>
  );
}
