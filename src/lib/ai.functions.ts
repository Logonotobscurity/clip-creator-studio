import { createServerFn } from "@tanstack/react-start";
import { aiRequestSchema, type AiResult } from "@/clipin/lib/ai-schemas";

/**
 * AI tool RPC. Runs on the server against the Lovable AI Gateway.
 * Prompts, model choice, and credentials never reach the browser.
 */
export const runAiTool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => aiRequestSchema.parse(input))
  .handler(async ({ data }): Promise<AiResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      throw new Error("AI is not configured for this workspace yet.");
    }

    const { streamText, Output } = await import("ai");
    const { createLovableAiGatewayProvider, DEFAULT_CHAT_MODEL } = await import(
      "./ai-gateway.server"
    );
    const { buildPrompt, aiResultSchema } = await import("./ai-prompts.server");

    const gateway = createLovableAiGatewayProvider(apiKey);
    const { system, prompt } = buildPrompt(data.tool, data.fields);

    try {
      const result = streamText({
        model: gateway(DEFAULT_CHAT_MODEL),
        system,
        prompt,
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
      console.error("[clipin] ai tool failed", data.tool, message);
      throw new Error("We couldn't generate that. Try again in a moment.");
    }
  });
