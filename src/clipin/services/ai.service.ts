import { runAiTool } from "@/lib/ai.functions";
import type { AiResult, AiToolId } from "../lib/ai-schemas";

/**
 * AI service. Wraps the server function so components never touch RPC details,
 * prompts, or provider credentials.
 */
export interface AiService {
  run(tool: AiToolId, fields: Record<string, string>): Promise<AiResult>;
}

export const aiService: AiService = {
  async run(tool, fields) {
    const clean: Record<string, string> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === "string" && value.trim()) clean[key] = value.trim().slice(0, 6000);
    }
    return runAiTool({ data: { tool, fields: clean } });
  },
};
