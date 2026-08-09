/**
 * CLIPIN AI Service Layer
 *
 * Clean, centralized exports for all AI operations.
 * Server-only: API keys never reach the client.
 */

// AI Gateway (provider abstraction)
export {
  createOpenRouterProvider,
  getConfiguredModel,
  getOpenRouterProvider,
  DEFAULT_LLM_CONFIG,
  type LLMRequestConfig,
  type LLMResponse,
  type LLMUsage,
} from "./ai-gateway.server";

// Prompt Registry (versioned prompts)
export {
  getPromptConfig,
  buildPrompt,
  type AITaskId,
  type PromptConfig,
  // Prompt configurations
  CLIP_CANDIDATES_PROMPT,
  VIDEO_IDEAS_PROMPT,
  HOOKS_PROMPT,
  SCRIPT_WRITE_PROMPT,
  SCRIPT_OUTLINE_PROMPT,
  SCRIPT_REWRITE_PROMPT,
  VIDEO_TITLE_PROMPT,
  VIDEO_DESCRIPTION_PROMPT,
  VIDEO_CHAPTERS_PROMPT,
  VIDEO_TAGS_PROMPT,
  SUBTITLE_CLEANUP_PROMPT,
  CLIP_QUALITY_REVIEW_PROMPT,
} from "./prompt-registry";

// Task Executor (LLM orchestration)
export {
  executeAITask,
  executeAITaskWithRetry,
  batchExecuteAITasks,
  validateAITaskInput,
  streamAITask,
  type AITaskInput,
  type AITaskResult,
} from "./task-executor";

// Crawl Engine (safe research)
export {
  crawlUrl,
  extractContent,
  validateCrawlUrl,
  chunkContent,
  deduplicateContent,
  formatCrawlResultForLLM,
  type CrawlConfig,
  type CrawlResult,
  type ExtractedContent,
  DEFAULT_CRAWL_CONFIG,
} from "./crawl-engine";

// AI Service (high-level facade)
export {
  AIService,
  generateClipCandidates,
  generateVideoIdeas,
  generateHooks,
  writeScript,
  outlineScript,
  rewriteScript,
  generateVideoTitles,
  generateVideoDescription,
  generateVideoChapters,
  generateVideoTags,
  cleanupSubtitles,
  reviewClipQuality,
  researchTopic,
  batchGenerateContent,
} from "./ai-service";
