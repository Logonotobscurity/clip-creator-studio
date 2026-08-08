import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/clipin/components/primitives";

export const Route = createFileRoute("/app/more")({
  head: () => ({
    meta: [
      { title: "More tools — CLIPIN" },
      { name: "description", content: "Brand presets and the rest of the CLIPIN toolkit." },
      { property: "og:title", content: "More tools — CLIPIN" },
      { property: "og:description", content: "Brand presets and the rest of the CLIPIN toolkit." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="grid gap-10">
      <PageHeader eyebrow="Workspace" title="More" description="Brand presets and everything else." />
    </div>
  );
}
