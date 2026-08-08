import { createFileRoute } from "@tanstack/react-router";
import { AIToolPage, type AiField } from "@/clipin/components/AIToolPage";

const fields: AiField[] = [
    {
      name: "topic",
      label: "Video topic",
      type: "text",
      placeholder: "The truth about faceless channels",
      required: true,
    },
    {
      name: "goal",
      label: "Goal of the video",
      type: "select",
      options: ["Educate","Entertain","Sell","Build authority"],
    },
    {
      name: "notes",
      label: "Context",
      type: "textarea",
      placeholder: "Anything the outline must include...",
    },
];

export const Route = createFileRoute("/app/script/outline")({
  head: () => ({
    meta: [
      { title: "Script outline — CLIPIN" },
      { name: "description", content: "Build a clean video outline before you write a word of script." },
      { property: "og:title", content: "Script outline — CLIPIN" },
      { property: "og:description", content: "Build a clean video outline before you write a word of script." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AIToolPage
      tool="script-outline"
      eyebrow={"Scripting"}
      title={"Script outline"}
      description={"Structure first: hook, three sections, conclusion, call to action."}
      fields={fields}
      emptyHint={"Tell us the topic and we will structure it."}
    />
  );
}
