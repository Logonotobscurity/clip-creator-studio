# CLIPIN AI Layer — Environment & Setup

## Overview

The CLIPIN AI layer provides:

- **OpenRouter integration** — LLM provider abstraction via OpenAI-compatible API
- **Versioned prompt registry** — 12 task-specific prompts with injection defense
- **Task executor** — Structured output parsing, retry logic, error handling
- **Crawl engine** — Safe research with SSRF protection, rate limiting, robots.txt respect
- **AI service facade** — High-level operations for React components to call

## Environment Variables

Add these to your `.env.local`:

```bash
# OpenRouter API Key (required)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx

# OpenRouter Model Selection (optional)
# Defaults to: openai/gpt-4-turbo
# Other options: openai/gpt-4, anthropic/claude-3-opus, google/gemini-pro, etc.
OPENROUTER_MODEL=openai/gpt-4-turbo

# Site metadata for OpenRouter (optional)
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_SITE_NAME=CLIPIN
```

### Getting an OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to **Keys** → **Create Key**
4. Copy the key (format: `sk-or-v1-...`)
5. Paste into `.env.local` as `OPENROUTER_API_KEY`

## Architecture

```
React Component
    ↓
Server Action (use "use server")
    ↓
AIService (high-level facade)
    ├── generateClipCandidates()
    ├── generateVideoIdeas()
    ├── writeScript()
    └── ... 13 operations
    ↓
Task Executor (executeAITask)
    ├── Prompt Registry lookup
    ├── Structured validation (Zod)
    └── Retry with exponential backoff
    ↓
OpenRouter LLM Provider
    ├── API: https://openrouter.ai/api/v1
    ├── Auth: Bearer ${OPENROUTER_API_KEY}
    └── Response: Structured JSON
```

## Usage Example

### 1. Server Action (RSC Safe)

```typescript
// app/actions/generate-ideas.ts
"use server"

import { generateVideoIdeas } from "@/lib/ai";

export async function generateIdeasAction(topic: string, platform: "tiktok" | "instagram" | "youtube") {
  const result = await generateVideoIdeas({
    topic,
    platform,
    audience: "Gen Z creators",
    niche: "tech",
    context: "Focus on trending formats",
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}
```

### 2. React Component

```typescript
// components/IdeaGenerator.tsx
"use client"

import { useState } from "react";
import { generateIdeasAction } from "@/app/actions/generate-ideas";

export function IdeaGenerator() {
  const [ideas, setIdeas] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const result = await generateIdeasAction("AI tools", "tiktok");
      setIdeas(result.ideas);
    } catch (error) {
      console.error("Failed to generate ideas:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Ideas"}
      </button>
      {ideas && (
        <ul>
          {ideas.map((idea, i) => (
            <li key={i}>{idea.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Available Tasks

### Content Generation

- `clip_candidates` — Identify viral moments in transcripts
- `video_ideas` — Generate unlimited video concepts
- `hooks` — Create attention-grabbing opening lines
- `script_write` — Full script with timing
- `script_outline` — Structure without dialogue
- `script_rewrite` — Rewrite from source material

### Optimization

- `video_title` — SEO-friendly title options
- `video_description` — Engaging description with CTAs
- `video_chapters` — Timestamped sections
- `video_tags` — Relevant hashtags/keywords
- `subtitle_cleanup` — Grammar, timing fixes
- `clip_quality_review` — Virality scoring & feedback

## Prompt Versioning

Each prompt is versioned and immutable:

```typescript
import { getPromptConfig } from "@/lib/ai";

const config = getPromptConfig("video_ideas");
console.log(config.version); // "1.0.0"
console.log(config.modelConfig.temperature); // 0.8
```

To improve a prompt:
1. Create a new version file: `prompts/video_ideas/v2.0.0.ts`
2. Update the registry: `prompt-registry.ts`
3. Keep old versions for reference

## Security

### Injection Defense

All prompts include explicit instructions to prevent:
- Code execution
- System command injection
- Instruction override
- Hidden commands in user input

### SSRF Protection

Crawl engine validates:
- Domain allowlist (YouTube, Medium, Dev.to, etc.)
- Private IP ranges (127.0.0.1, 192.168.*, etc.)
- URL protocol (HTTP/HTTPS only)

### Rate Limiting

- Default: 1 second delay between requests
- Configurable per crawl operation
- Respects robots.txt and x-robots-tag

## Error Handling

### Automatic Retry

```typescript
// Retries up to 2 times with exponential backoff
const result = await executeAITaskWithRetry({
  taskId: "video_ideas",
  variables: { ... },
}, 2);
```

### Fallback Content

Prompts can define fallback responses:

```typescript
FALLBACK_PROMPT: {
  fallback: {
    enabled: true,
    content: "Unable to generate. Try again later.",
  },
}
```

## Token Budgeting

Each prompt specifies max tokens:

```typescript
VIDEO_IDEAS_PROMPT.modelConfig.maxTokens // 1500
SCRIPT_WRITE_PROMPT.modelConfig.maxTokens // 2000
```

Adjust based on:
- Expected output length
- OpenRouter pricing per model
- Response time requirements

## Monitoring

Track usage in your server logs:

```typescript
const result = await generateVideoIdeas({ ... });

console.log("Input tokens:", result.usage?.inputTokens);
console.log("Output tokens:", result.usage?.outputTokens);
console.log("Model:", result.model);
console.log("Timestamp:", result.timestamp);
```

## Limitations & Roadmap

### Current (MVP)

- ✅ OpenRouter as LLM provider
- ✅ Structured output (Zod validation)
- ✅ Prompt registry with versioning
- ✅ Retry logic with exponential backoff
- ✅ Safe crawling with SSRF protection

### Future

- [ ] LangChain / LlamaIndex integration
- [ ] Vector embeddings (OpenAI Embeddings)
- [ ] Caching layer (Redis)
- [ ] Worker queue (Bull / BullMQ)
- [ ] Multi-provider fallback (Anthropic, Google)
- [ ] Prompt A/B testing framework
- [ ] Cost tracking dashboard
- [ ] Rate limiting per user/workspace
- [ ] Webhook logging for audit trail

## Support

If you encounter issues:

1. Check `.env.local` has `OPENROUTER_API_KEY`
2. Verify OpenRouter account has credits
3. Check OpenRouter model availability
4. Review server logs for LLM error responses
5. Test with `executeAITask()` directly

## References

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Zod Validation](https://zod.dev/)
