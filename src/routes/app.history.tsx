import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/clipin/components/primitives";

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

function Page() {
  return (
    <div className="grid gap-10">
      <PageHeader eyebrow="Workspace" title="History" description="Everything you have generated, exported and scheduled." />
    </div>
  );
}
