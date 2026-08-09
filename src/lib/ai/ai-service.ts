import { executeAITask, executeAITaskWithRetry, AITaskInput } from "./task-executor";
import { crawlUrl, formatCrawlResultForLLM, CrawlConfig } from "./crawl-engine";
import { AITaskId } from "./prompt-registry";

/**
 * CLIPIN AI Service Layer
 *
 * High-level facade for AI operations.
 * Orchestrates:
 * - Prompt selection and execution
 * - External content research (crawling)
 * - Structured output validation
 * - Error handling and fallbacks
 * - Usage tracking and analytics
 */

/**
 * Generate short-form clip candidates from video transcript
 */
export async function generateClipCandidates(input: {
  transcript: string;
  platform: "tiktok" | "instagram" | "youtube";
  niche: string;
  audience: string;
  context?: string;
}) {
  return executeAITaskWithRetry({
    taskId: "clip_candidates" as AITaskId,
    variables: {
      transcript: input.transcript,
      platform: input.platform,
      niche: input.niche,
      audience: input.audience,
      context: input.context || "",
    },
  });
}

/**
 * Generate unlimited video ideas
 */
export async function generateVideoIdeas(input: {
  topic: string;
  platform: "tiktok" | "instagram" | "youtube";
  audience: string;
  niche?: string;
  context?: string;
}) {
  return executeAITaskWithRetry({
    taskId: "video_ideas" as AITaskId,
    variables: {
      topic: input.topic,
      platform: input.platform,
      audience: input.audience,
      niche: input.niche || "general",
      context: input.context || "",
    },
  });
}

/**
 * Generate attention-grabbing hooks
 */
export async function generateHooks(input: {
  topic: string;
  platform: "tiktok" | "instagram" | "youtube";
  audience: string;
  format: "short" | "medium" | "long";
  context?: string;
}) {
  return executeAITaskWithRetry({
    taskId: "hooks" as AITaskId,
    variables: {
      topic: input.topic,
      platform: input.platform,
      audience: input.audience,
      format: input.format,
      context: input.context || "",
    },
  });
}

/**
 * Write a complete video script
 */
export async function writeScript(input: {
  topic: string;
  duration: number; // seconds
  audience: string;
  tone: string;
  sourceUrl?: string;
  context?: string;
}) {
  // Optionally crawl source URL for context
  let contextWithResearch = input.context || "";
  if (input.sourceUrl) {
    try {
      const crawlResult = await crawlUrl(input.sourceUrl);
      contextWithResearch = formatCrawlResultForLLM(crawlResult);
    } catch (error) {
      console.warn("Failed to crawl source URL:", error);
    }
  }

  return executeAITaskWithRetry({
    taskId: "script_write" as AITaskId,
    variables: {
      topic: input.topic,
      duration: input.duration,
      audience: input.audience,
      tone: input.tone,
      sourceUrl: input.sourceUrl || "",
      context: contextWithResearch,
    },
  });
}

/**
 * Create a script outline
 */
export async function outlineScript(input: {
  topic: string;
  duration: number; // seconds
  audience: string;
  context?: string;
}) {
  return executeAITaskWithRetry({
    taskId: "script_outline" as AITaskId,
    variables: {
      topic: input.topic,
      duration: input.duration,
      audience: input.audience,
      context: input.context || "",
    },
  });
}

/**
 * Rewrite a script from source material
 */
export async function rewriteScript(input: {
  script: string;
  platform: "tiktok" | "instagram" | "youtube";
  audience: string;
  tone: string;
}) {
  return executeAITaskWithRetry({
    taskId: "script_rewrite" as AITaskId,
    variables: {
      script: input.script,
      platform: input.platform,
      audience: input.audience,
      tone: input.tone,
    },
  });
}

/**
 * Generate video titles
 */
export async function generateVideoTitles(input: {
  topic: string;
  platform: "tiktok" | "instagram" | "youtube";
  audience: string;
  context?: string;
}) {
  return executeAITaskWithRetry({
    taskId: "video_title" as AITaskId,
    variables: {
      topic: input.topic,
      platform: input.platform,
      audience: input.audience,
      context: input.context || "",
    },
  });
}

/**
 * Generate video description
 */
export async function generateVideoDescription(input: {
  title: string;
  topic: string;
  platform: "tiktok" | "instagram" | "youtube";
  timestamps?: string;
  context?: string;
}) {
  return executeAITaskWithRetry({
    taskId: "video_description" as AITaskId,
    variables: {
      title: input.title,
      topic: input.topic,
      platform: input.platform,
      timestamps: input.timestamps || "",
      context: input.context || "",
    },
  });
}

/**
 * Generate video chapters
 */
export async function generateVideoChapters(input: {
  title: string;
  transcript: string;
  duration: number; // total duration in seconds
}) {
  return executeAITaskWithRetry({
    taskId: "video_chapters" as AITaskId,
    variables: {
      title: input.title,
      transcript: input.transcript,
      duration: input.duration,
    },
  });
}

/**
 * Generate video tags
 */
export async function generateVideoTags(input: {
  title: string;
  topic: string;
  platform: "tiktok" | "instagram" | "youtube";
  niche: string;
}) {
  return executeAITaskWithRetry({
    taskId: "video_tags" as AITaskId,
    variables: {
      title: input.title,
      topic: input.topic,
      platform: input.platform,
      niche: input.niche,
    },
  });
}

/**
 * Clean up and improve subtitles
 */
export async function cleanupSubtitles(input: {
  subtitles: string; // SRT format
}) {
  return executeAITaskWithRetry({
    taskId: "subtitle_cleanup" as AITaskId,
    variables: {
      subtitles: input.subtitles,
    },
  });
}

/**
 * Review clip quality and virality potential
 */
export async function reviewClipQuality(input: {
  duration: number; // seconds
  platform: "tiktok" | "instagram" | "youtube";
  hook: string;
  transcript: string;
}) {
  return executeAITaskWithRetry({
    taskId: "clip_quality_review" as AITaskId,
    variables: {
      duration: input.duration,
      platform: input.platform,
      hook: input.hook,
      transcript: input.transcript,
    },
  });
}

/**
 * Research a topic via crawling and AI analysis
 */
export async function researchTopic(input: {
  sourceUrl: string;
  topic: string;
  crawlConfig?: CrawlConfig;
}): Promise<{
  success: boolean;
  researchContent: string;
  error?: string;
}> {
  try {
    const crawlResult = await crawlUrl(input.sourceUrl, input.crawlConfig);
    if (crawlResult.pagesSucceeded === 0) {
      return {
        success: false,
        researchContent: "",
        error: `Failed to crawl ${input.sourceUrl}`,
      };
    }

    const formatted = formatCrawlResultForLLM(crawlResult);
    return {
      success: true,
      researchContent: formatted,
    };
  } catch (error) {
    return {
      success: false,
      researchContent: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Batch AI operations for efficiency
 */
export async function batchGenerateContent(input: {
  topic: string;
  platform: "tiktok" | "instagram" | "youtube";
  audience: string;
}) {
  const [titles, tags, ideas] = await Promise.all([
    generateVideoTitles({
      topic: input.topic,
      platform: input.platform,
      audience: input.audience,
    }),
    generateVideoTags({
      title: input.topic,
      topic: input.topic,
      platform: input.platform,
      niche: "general",
    }),
    generateVideoIdeas({
      topic: input.topic,
      platform: input.platform,
      audience: input.audience,
    }),
  ]);

  return {
    titles,
    tags,
    ideas,
  };
}

/**
 * Export AI service for server actions
 */
export const AIService = {
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
};
