import { createFileRoute } from "@tanstack/react-router";
import { AIToolPage, type AiField } from "@/clipin/components/AIToolPage";

const fields: AiField[] = [
    {
      name: "topic",
      label: "Video topic",
      type: "text",
      placeholder: "How I edit a podcast in 20 minutes",
      required: true,
    },
    {
      name: "platform",
      label: "Platform",
      type: "select",
      options: ["TikTok","Instagram Reels","YouTube Shorts","YouTube"],
    },
    {
      name: "tone",
      label: "Tone",
      type: "select",
      options: ["Direct","Contrarian","Story-led","Playful"],
    },
    {
      name: "notes",
      label: "Context",
      type: "textarea",
      placeholder: "Who it is for and what the payoff is...",
    },
];

export const Route = createFileRoute("/app/hooks")({
  head: () => ({
    meta: [
      { title: "Hook generator — CLIPIN" },
      { name: "description", content: "Write scroll-stopping hooks for shorts, reels and long-form intros." },
      { property: "og:title", content: "Hook generator — CLIPIN" },
      { property: "og:description", content: "Write scroll-stopping hooks for shorts, reels and long-form intros." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AIToolPage
      tool="hooks"
      eyebrow={"Ideate"}
      title={"Hook generator"}
      description={"Opening lines engineered to stop the scroll inside the first second."}
      fields={fields}
      emptyHint={"Give us the topic and we will write ten openings."}
    />
  );
}
