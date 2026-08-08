import { createFileRoute } from "@tanstack/react-router";
import { AIToolPage, type AiField } from "@/clipin/components/AIToolPage";

const fields: AiField[] = [
    {
      name: "topic",
      label: "Topic or niche",
      type: "text",
      placeholder: "Personal finance for freelancers",
      required: true,
    },
    {
      name: "audience",
      label: "Audience",
      type: "text",
      placeholder: "Nigerian creatives in their 20s",
    },
    {
      name: "platform",
      label: "Platform",
      type: "select",
      options: ["YouTube","TikTok","Instagram Reels","Shorts"],
    },
    {
      name: "notes",
      label: "Anything else we should know",
      type: "textarea",
      placeholder: "Tone, series format, constraints...",
    },
];

export const Route = createFileRoute("/app/ideate")({
  head: () => ({
    meta: [
      { title: "Video ideas — CLIPIN" },
      { name: "description", content: "Generate unlimited video ideas tuned to your niche, audience and platform." },
      { property: "og:title", content: "Video ideas — CLIPIN" },
      { property: "og:description", content: "Generate unlimited video ideas tuned to your niche, audience and platform." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AIToolPage
      tool="ideas"
      eyebrow={"Ideate"}
      title={"Unlimited video ideas"}
      description={"Concepts, angles and formats built around your topic and the audience you are speaking to."}
      fields={fields}
      emptyHint={"Add a topic and we will draft angles you can shoot this week."}
    />
  );
}
