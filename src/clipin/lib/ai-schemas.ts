import { z } from "zod";

/** Client-safe schemas shared by the AI tool pages and the server functions. */

export const aiToolIds = [
  "ideas",
  "hooks",
  "script-write",
  "script-outline",
  "script-rewrite",
  "title",
  "description",
  "chapters",
  "tags",
] as const;

export type AiToolId = (typeof aiToolIds)[number];

export const aiResultSchema = z.object({
  headline: z.string().optional(),
  items: z
    .array(
      z.object({
        label: z.string().optional(),
        title: z.string().optional(),
        body: z.string(),
        meta: z.array(z.string()).optional(),
      }),
    )
    .min(1),
});

export type AiResult = z.infer<typeof aiResultSchema>;
export type AiResultItem = AiResult["items"][number];

export const aiRequestSchema = z.object({
  tool: z.enum(aiToolIds),
  fields: z.record(z.string(), z.string().max(6000)),
});

export type AiRequest = z.infer<typeof aiRequestSchema>;
