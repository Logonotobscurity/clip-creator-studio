import { aiRequestSchema, aiResultSchema, type AiToolId } from "@/clipin/lib/ai-schemas";

/** Server-only prompt catalogue for the CLIPIN AI tools. */

const SYSTEM = `You are CLIPIN, an expert short-form video strategist for creators.
You write punchy, specific, non-generic copy. Never use filler, never mention that you are an AI.
Always return well-formed structured output matching the requested schema.`;

type Fields = Record<string, string>;

const field = (fields: Fields, key: string, fallback = "not provided") =>
  (fields[key] ?? "").trim() || fallback;

const builders: Record<AiToolId, (fields: Fields) => string> = {
  ideas: (f) => `Generate 6 distinct video ideas.
Topic: ${field(f, "topic")}
Platform: ${field(f, "platform")}
Audience: ${field(f, "audience")}
Extra context: ${field(f, "context")}

For each idea: "title" = the idea title, "label" = suggested format (e.g. Talking head, Listicle, Tutorial),
"body" = the concept in 2 sentences, "meta" = [the hook line, the target platform].`,

  hooks: (f) => `Generate 8 scroll-stopping hooks.
Topic: ${field(f, "topic")}
Platform: ${field(f, "platform")}
Tone: ${field(f, "tone")}
Extra context: ${field(f, "context")}

For each hook: "body" = the hook line itself (max 18 words), "label" = hook type
(e.g. Curiosity gap, Contrarian, Story, Stat), "meta" = [best platform, potential use].`,

  "script-write": (f) => `Write one full short-form video script.
Topic: ${field(f, "topic")}
Source URL: ${field(f, "sourceUrl")}
Audience: ${field(f, "audience")}
Tone: ${field(f, "tone")}
Target duration: ${field(f, "duration")}
Extra context: ${field(f, "context")}

Return exactly 5 items in order with "label" set to Title, Hook, Introduction, Body, CTA.
"body" holds the actual written content for that part. Use "headline" for the chosen title.`,

  "script-outline": (f) => `Write a script outline.
Topic: ${field(f, "topic")}
Audience: ${field(f, "audience")}
Target duration: ${field(f, "duration")}
Extra context: ${field(f, "context")}

Return exactly 6 items with "label" set to Hook, Section 1, Section 2, Section 3, Conclusion, CTA.
"body" holds 2-3 bullet-style sentences for that section.`,

  "script-rewrite": (f) => `Rewrite the following material as a stronger short-form script while
preserving the intended subject matter and factual claims.
Video URL: ${field(f, "sourceUrl")}
Existing script or transcript: ${field(f, "script")}
Desired tone: ${field(f, "tone")}
Extra context: ${field(f, "context")}

Return items with "label" set to Title, Hook, Introduction, Body, CTA.`,

  title: (f) => `Generate 8 optimised video titles.
Video topic or transcript: ${field(f, "topic")}
Platform: ${field(f, "platform")}
Keyword focus: ${field(f, "keywords")}
Extra context: ${field(f, "context")}

Each item: "body" = the title (max 70 characters), "label" = angle used,
"meta" = [character count, primary keyword].`,

  description: (f) => `Write one optimised video description.
Video topic or transcript: ${field(f, "topic")}
Platform: ${field(f, "platform")}
Keywords: ${field(f, "keywords")}
Links to include: ${field(f, "links")}

Return 3 items with "label" set to Summary, Full description, Keywords.`,

  chapters: (f) => `Generate video chapters with timestamps.
Video duration: ${field(f, "duration")}
Transcript or outline: ${field(f, "topic")}

Return 6-10 items. "label" = the timestamp in MM:SS or HH:MM:SS starting at 00:00 and strictly increasing,
"body" = the chapter name (max 6 words). Never exceed the stated duration.`,

  tags: (f) => `Generate 20 platform tags.
Video topic: ${field(f, "topic")}
Platform: ${field(f, "platform")}
Niche: ${field(f, "niche")}

Each item: "body" = a single tag starting with '#', lowercase, no spaces. "label" = Broad, Niche or Long-tail.`,
};

export function buildPrompt(tool: AiToolId, fields: Fields) {
  return { system: SYSTEM, prompt: builders[tool](fields) };
}

export { aiRequestSchema, aiResultSchema };
