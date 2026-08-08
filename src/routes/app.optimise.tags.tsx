import { createFileRoute } from "@tanstack/react-router";
import { AIToolPage, type AiField } from "@/clipin/components/AIToolPage";

const fields: AiField[] = [
    {
      name: "topic",
      label: "Video topic",
      type: "text",
      placeholder: "Podcast editing workflow",
      required: true,
    },
    {
      name: "platform",
      label: "Platform",
      type: "select",
      options: ["YouTube","TikTok","Instagram"],
    },
];

export const Route = createFileRoute("/app/optimise/tags")({
  head: () => ({
    meta: [
      { title: "Video tag generator — CLIPIN" },
      { name: "description", content: "Generate broad, niche and long-tail tags for your video." },
      { property: "og:title", content: "Video tag generator — CLIPIN" },
      { property: "og:description", content: "Generate broad, niche and long-tail tags for your video." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AIToolPage
      tool="tags"
      eyebrow={"Upload and optimize"}
      title={"Video tags"}
      description={"Broad, niche and long-tail tags in a single pass."}
      fields={fields}
      emptyHint={"Add a topic to generate tags."}
    />
  );
}
