import { generateObject } from "ai";
import { z } from "zod";
import {
  getOpenRouterProvider,
  getConfiguredModel,
  LLMResponse,
  DEFAULT_LLM_CONFIG,
  LLMRequestConfig,
} from "./ai-gateway.server";
import {
  getPromptConfig,
  buildPrompt,
  AITaskId,
  PromptConfig,
} from "./prompt-registry";

/**
 * CLIPIN AI Task Executor
 *
 * Orchestrates LLM calls with:
 * - Prompt registry lookup
 * - Input validation
 * - Structured output parsing
 * - Error handling with fallbacks
 * - Usage tracking
 */

export interface AITaskInput {
  taskId: AITaskId;
  variables: Record<string, any>;
  config?: Partial<LLMRequestConfig>;
}

export interface AITaskResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  model: string;
  timestamp: Date;
}

/**
 * Execute an AI task from the prompt registry
 */
export async function executeAITask<T = any>(
  input: AITaskInput
): Promise<AITaskResult<T>> {
  const startTime = Date.now();

  try {
    // 1. Validate task ID and fetch prompt config
    const promptConfig = getPromptConfig(input.taskId);
    if (!promptConfig) {
      return {
        success: false,
        error: `Unknown task: ${input.taskId}`,
        model: getConfiguredModel(),
        timestamp: new Date(),
      };
    }

    // 2. Build the complete user prompt
    const userPrompt = buildPrompt(promptConfig, input.variables);

    // 3. Merge configuration
    const config = { ...DEFAULT_LLM_CONFIG, ...input.config };

    // 4. Get OpenRouter provider
    const provider = getOpenRouterProvider();
    const model = getConfiguredModel();

    // 5. Execute LLM call with structured output
    const result = await generateObject({
      model: provider(model),
      system: promptConfig.systemInstructions,
      prompt: userPrompt,
      schema: promptConfig.outputSchema,
      temperature: promptConfig.modelConfig.temperature,
      topP: promptConfig.modelConfig.topP,
      maxTokens: config.maxTokens,
    });

    return {
      success: true,
      data: result.object as T,
      usage: {
        inputTokens: result.usage?.promptTokens || 0,
        outputTokens: result.usage?.completionTokens || 0,
      },
      model,
      timestamp: new Date(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Check for fallback content
    const promptConfig = getPromptConfig(input.taskId);
    if (promptConfig?.fallback?.enabled) {
      return {
        success: true,
        data: { fallback: promptConfig.fallback.content } as T,
        error: `Used fallback: ${errorMessage}`,
        model: getConfiguredModel(),
        timestamp: new Date(),
      };
    }

    return {
      success: false,
      error: errorMessage,
      model: getConfiguredModel(),
      timestamp: new Date(),
    };
  }
}

/**
 * Batch execute multiple AI tasks
 */
export async function batchExecuteAITasks(
  inputs: AITaskInput[]
): Promise<AITaskResult[]> {
  return Promise.all(inputs.map((input) => executeAITask(input)));
}

/**
 * Execute with automatic retry logic
 */
export async function executeAITaskWithRetry<T = any>(
  input: AITaskInput,
  maxRetries: number = 2
): Promise<AITaskResult<T>> {
  let lastError: AITaskResult<T> | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await executeAITask<T>(input);

    if (result.success) {
      return result;
    }

    lastError = result;

    // Exponential backoff
    if (attempt < maxRetries) {
      const delayMs = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return lastError || {
    success: false,
    error: "Unknown error after retries",
    model: getConfiguredModel(),
    timestamp: new Date(),
  };
}

/**
 * Stream AI task result (for real-time updates)
 * Note: streaming is handled by the Vercel AI SDK
 */
export async function streamAITask(
  input: AITaskInput,
  onChunk?: (chunk: string) => void
) {
  const provider = getOpenRouterProvider();
  const model = getConfiguredModel();
  const promptConfig = getPromptConfig(input.taskId);

  if (!promptConfig) {
    throw new Error(`Unknown task: ${input.taskId}`);
  }

  const userPrompt = buildPrompt(promptConfig, input.variables);

  // For streaming, use generateText instead of generateObject
  // This is handled by the caller depending on UI requirements
  return {
    provider,
    model,
    system: promptConfig.systemInstructions,
    prompt: userPrompt,
  };
}

/**
 * Validate AI task input before execution
 */
export function validateAITaskInput(input: AITaskInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.taskId) {
    errors.push("taskId is required");
  }

  if (!input.variables || typeof input.variables !== "object") {
    errors.push("variables must be an object");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
