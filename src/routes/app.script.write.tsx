import { createFileRoute } from "@tanstack/react-router";
import { AIToolPage, type AiField } from "@/clipin/components/AIToolPage";

const fields: AiField[] = [
    {
      name: "topic",
      label: "Video topic",
      type: "text",
      placeholder: "Why your clips are not converting",
      required: true,
    },
    {
      name: "length",
      label: "Target length",
      type: "select",
      options: ["30 seconds","60 seconds","3 minutes","8 minutes"],
    },
    {
      name: "audience",
      label: "Audience",
      type: "text",
      placeholder: "Creators with under 10k followers",
    },
    {
      name: "notes",
      label: "Key points to cover",
      type: "textarea",
      placeholder: "Bullet the beats you want included...",
    },
];

export const Route = createFileRoute("/app/script/write")({
  head: () => ({
    meta: [
      { title: "Script writer — CLIPIN" },
      { name: "description", content: "Generate a full video script with hook, body and CTA." },
      { property: "og:title", content: "Script writer — CLIPIN" },
      { property: "og:description", content: "Generate a full video script with hook, body and CTA." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AIToolPage
      tool="script-write"
      eyebrow={"Scripting"}
      title={"Script writer"}
      description={"A full script with hook, body and a call to action you can actually read on camera."}
      fields={fields}
      emptyHint={"Add a topic and target length to draft the script."}
    />
  );
}
