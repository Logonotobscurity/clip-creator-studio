import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/clipin/components/primitives";

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
  return (
    <div className="grid gap-10">
      <PageHeader eyebrow="Workspace" title="Analytics" description="How much you are actually shipping." />
    </div>
  );
}
