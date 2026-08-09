import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";

/**
 * OpenRouter AI Gateway provider. Server-only: the API key never reaches the client.
 * 
 * Supports:
 * - OpenAI-compatible /api/v1/chat/completions endpoint
 * - Structured JSON output via schema parameter
 * - Tool calling
 * - Streaming
 * - Usage tracking
 * - Custom HTTP headers for rate limiting and tracking
 */
export function createOpenRouterProvider(apiKey: string) {
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const siteUrl = process.env.OPENROUTER_SITE_URL || "http://localhost:3000";
  const siteName = process.env.OPENROUTER_SITE_NAME || "CLIPIN";

  return createOpenAICompatible({
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    headers: {
      "HTTP-Referer": siteUrl,
      "X-Title": siteName,
    },
    defaultQuery: {
      include_reasoning: "true",
    },
  });
}

/**
 * Get configured model from environment or use default.
 * OpenRouter model format: provider/model-name
 * Examples: openai/gpt-4-turbo, anthropic/claude-3-sonnet, google/gemini-pro
 */
export function getConfiguredModel(): string {
  return (
    process.env.OPENROUTER_MODEL || 
    "openai/gpt-4-turbo" // Production: use GPT-4 Turbo
  );
}

/**
 * LLM request configuration with OpenRouter-specific options.
 */
export interface LLMRequestConfig {
  timeout?: number;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  schema?: z.ZodSchema<any>;
  retryCount?: number;
  retryDelayMs?: number;
}

/**
 * Default configuration for LLM requests.
 */
export const DEFAULT_LLM_CONFIG: LLMRequestConfig = {
  timeout: 60000, // 60 seconds
  maxTokens: 2048,
  temperature: 0.7,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  retryCount: 2,
  retryDelayMs: 1000,
};

/**
 * OpenRouter provider instance (lazy-initialized).
 */
let openRouterProvider: ReturnType<typeof createOpenAICompatible> | null = null;

export function getOpenRouterProvider() {
  if (!openRouterProvider) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    openRouterProvider = createOpenRouterProvider(apiKey || "");
  }
  return openRouterProvider;
}

/**
 * Usage tracking from OpenRouter responses.
 */
export interface LLMUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost?: number;
}

/**
 * Structured LLM response with metadata.
 */
export interface LLMResponse<T = any> {
  data: T;
  usage: LLMUsage;
  model: string;
  provider: "openrouter";
  timestamp: Date;
  inputPromptTokens: number;
  outputGenerationTokens: number;
}
