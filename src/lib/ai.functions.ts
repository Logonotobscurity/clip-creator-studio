import { createServerFn } from "@tanstack/react-start";
import { aiRequestSchema, type AiResult } from "@/clipin/lib/ai-schemas";

/**
 * AI tool RPC. Runs on the server against the Lovable AI Gateway.
 * Prompts, model choice, crawl context, and credentials never reach the browser.
 */
export const runAiTool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => aiRequestSchema.parse(input))
  .handler(async ({ data }): Promise<AiResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      throw new Error("AI is not configured for this workspace yet.");
    }

    const { streamText, Output, NoObjectGeneratedError } = await import("ai");
    const { createLovableAiGatewayProvider, DEFAULT_CHAT_MODEL } = await import(
      "./ai-gateway.server"
    );
    const { aiTaskRegistry, buildPrompt, aiResultSchema } = await import("./ai-prompts.server");
    const { crawlForContext, formatCrawlContext } = await import("./research.server");

    const task = aiTaskRegistry[data.tool];

    // Research step: enrich the prompt with page context when the task allows it.
    let externalContext: string | undefined;
    if (task.contextUrlField) {
      const url = data.fields[task.contextUrlField]?.trim();
      if (url) {
        const crawled = await crawlForContext(url);
        if (crawled) externalContext = formatCrawlContext(crawled);
      }
    }

    const gateway = createLovableAiGatewayProvider(apiKey);
    const built = buildPrompt(data.tool, data.fields, externalContext);

    try {
      const result = streamText({
        model: gateway(built.model ?? DEFAULT_CHAT_MODEL),
        system: built.system,
        prompt: built.prompt,
        maxOutputTokens: built.maxOutputTokens,
        output: Output.object({ schema: aiResultSchema }),
      });
      return await result.output;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("429")) {
        throw new Error("Too many requests right now. Give it a moment and try again.");
      }
      if (message.includes("402")) {
        throw new Error("AI credits are exhausted for this workspace. Add credits to continue.");
      }
      if (NoObjectGeneratedError.isInstance(error)) {
        console.error("[clipin] ai schema validation failed", data.tool, built.version);
        throw new Error("The model returned an unusable answer. Try again.");
      }
      console.error("[clipin] ai tool failed", data.tool, built.version, message);
      throw new Error("We couldn't generate that. Try again in a moment.");
    }
  });
