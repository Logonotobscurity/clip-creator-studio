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
      name: "links",
      label: "Links to include",
      type: "textarea",
      placeholder: "Newsletter, gear list, socials",
    },
];

export const Route = createFileRoute("/app/optimise/description")({
  head: () => ({
    meta: [
      { title: "Video description generator — CLIPIN" },
      { name: "description", content: "Write SEO-aware video descriptions with links and keywords." },
      { property: "og:title", content: "Video description generator — CLIPIN" },
      { property: "og:description", content: "Write SEO-aware video descriptions with links and keywords." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AIToolPage
      tool="description"
      eyebrow={"Upload and optimize"}
      title={"Video description"}
      description={"Descriptions that carry keywords without reading like spam."}
      fields={fields}
      emptyHint={"Describe the video to draft a description."}
    />
  );
}
