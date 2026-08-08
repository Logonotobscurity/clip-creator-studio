import { createFileRoute } from "@tanstack/react-router";
import { AIToolPage, type AiField } from "@/clipin/components/AIToolPage";

const fields: AiField[] = [
    {
      name: "topic",
      label: "What is the video about",
      type: "text",
      placeholder: "A full podcast edit in one afternoon",
      required: true,
    },
    {
      name: "keyword",
      label: "Primary keyword",
      type: "text",
      placeholder: "podcast editing",
    },
    {
      name: "platform",
      label: "Platform",
      type: "select",
      options: ["YouTube","TikTok","Instagram"],
    },
];

export const Route = createFileRoute("/app/optimise/title")({
  head: () => ({
    meta: [
      { title: "Video title generator — CLIPIN" },
      { name: "description", content: "Generate video titles that balance search intent and curiosity." },
      { property: "og:title", content: "Video title generator — CLIPIN" },
      { property: "og:description", content: "Generate video titles that balance search intent and curiosity." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AIToolPage
      tool="title"
      eyebrow={"Upload and optimize"}
      title={"Video title"}
      description={"Title options tuned for search and curiosity, not clickbait for its own sake."}
      fields={fields}
      emptyHint={"Describe the video to get title options."}
    />
  );
}
