import { createFileRoute } from "@tanstack/react-router";
import { AIToolPage, type AiField } from "@/clipin/components/AIToolPage";

const fields: AiField[] = [
    {
      name: "transcript",
      label: "Transcript or beat list",
      type: "textarea",
      placeholder: "Paste the transcript or list the sections with rough times...",
      required: true,
    },
    {
      name: "duration",
      label: "Video duration",
      type: "text",
      placeholder: "12:40",
    },
];

export const Route = createFileRoute("/app/optimise/chapters")({
  head: () => ({
    meta: [
      { title: "Video chapters generator — CLIPIN" },
      { name: "description", content: "Turn a transcript into clean timestamped chapters." },
      { property: "og:title", content: "Video chapters generator — CLIPIN" },
      { property: "og:description", content: "Turn a transcript into clean timestamped chapters." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AIToolPage
      tool="chapters"
      eyebrow={"Upload and optimize"}
      title={"Video chapters"}
      description={"Timestamped chapters that keep viewers moving through the video."}
      fields={fields}
      emptyHint={"Paste a transcript to get chapters."}
    />
  );
}
