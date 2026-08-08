import { createFileRoute } from "@tanstack/react-router";
import { AIToolPage, type AiField } from "@/clipin/components/AIToolPage";

const fields: AiField[] = [
    {
      name: "source",
      label: "Video link or transcript",
      type: "textarea",
      placeholder: "Paste the transcript or the URL...",
      required: true,
    },
    {
      name: "voice",
      label: "Your voice",
      type: "text",
      placeholder: "Blunt, technical, dry humour",
    },
    {
      name: "notes",
      label: "What to change",
      type: "textarea",
      placeholder: "Shorter, more examples, different angle...",
    },
];

export const Route = createFileRoute("/app/script/rewrite")({
  head: () => ({
    meta: [
      { title: "Rewrite any video script — CLIPIN" },
      { name: "description", content: "Rewrite an existing video into your own voice, structure and angle." },
      { property: "og:title", content: "Rewrite any video script — CLIPIN" },
      { property: "og:description", content: "Rewrite an existing video into your own voice, structure and angle." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AIToolPage
      tool="script-rewrite"
      eyebrow={"Scripting"}
      title={"Rewrite script of any video"}
      description={"Paste a transcript or link and get the same idea rewritten in your voice."}
      fields={fields}
      emptyHint={"Paste a transcript or a link to rewrite it."}
    />
  );
}
