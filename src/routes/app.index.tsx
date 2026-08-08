import { createFileRoute } from "@tanstack/react-router";
import { toolGroups } from "@/clipin/nav";
import { ToolGroup } from "@/clipin/components/ToolCard";
import { PageHeader } from "@/clipin/components/primitives";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Creator workspace — CLIPIN" },
      { name: "description", content: "Every CLIPIN tool in one place: clip maker, ideas, hooks, scripts, metadata, monetisation and scheduling." },
      { property: "og:title", content: "Creator workspace — CLIPIN" },
      { property: "og:description", content: "Every CLIPIN tool in one place: clip maker, ideas, hooks, scripts, metadata, monetisation and scheduling." },
    ],
  }),
  component: Explore,
});

function Explore() {
  return (
    <div className="grid gap-12">
      <PageHeader
        eyebrow="Workspace"
        title="Everything you need to keep shipping"
        description="Start with a long video and let the clip maker do the heavy lifting, or jump straight into ideas, scripts and metadata."
      />
      {toolGroups.map((group) => (
        <ToolGroup key={group.id} group={group} />
      ))}
    </div>
  );
}
