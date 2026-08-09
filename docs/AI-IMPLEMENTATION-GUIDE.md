# CLIPIN AI Implementation Guide

## Quick Start (5 minutes)

### 1. Set Up Environment

```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local and add your OpenRouter API key
# Get one at: https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

### 2. Test the AI Layer

```bash
# Start dev server
npm run dev

# In another terminal, test directly
node -e "
  import('./src/lib/ai').then(({ generateVideoIdeas }) => {
    generateVideoIdeas({
      topic: 'AI in video editing',
      platform: 'tiktok',
      audience: 'developers',
    }).then(console.log);
  });
"
```

### 3. Use in a Server Action

Create `app/actions/ideas.ts`:

```typescript
"use server"

import { generateVideoIdeas } from "@/lib/ai";

export async function generateIdeasAction(topic: string) {
  const result = await generateVideoIdeas({
    topic,
    platform: "tiktok",
    audience: "content creators",
  });

  if (!result.success) {
    throw new Error(`Failed to generate ideas: ${result.error}`);
  }

  return result.data?.ideas || [];
}
```

Create `app/components/IdeaForm.tsx`:

```typescript
"use client"

import { generateIdeasAction } from "@/app/actions/ideas";
import { useState } from "react";

export function IdeaForm() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const topic = formData.get("topic") as string;
      const result = await generateIdeasAction(topic);
      setIdeas(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="topic" placeholder="Enter topic..." required />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Ideas"}
        </button>
      </form>

      <ul>
        {ideas?.map((idea, i) => (
          <li key={i}>
            <h3>{idea.title}</h3>
            <p>{idea.concept}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Architecture Overview

```
React Component
       ↓
  Server Action
    ("use server")
       ↓
  AIService API
  (high-level)
       ├─ generateClipCandidates()
       ├─ generateVideoIdeas()
       ├─ writeScript()
       └─ ... 13 more operations
       ↓
  Task Executor
  (orchestration)
       ├─ Prompt lookup
       ├─ Input validation
       ├─ Retry logic
       └─ Error handling
       ↓
  Prompt Registry
  (versioned prompts)
       ├─ task_id
       ├─ version
       ├─ system_instructions
       ├─ output_schema (Zod)
       └─ model_config
       ↓
  OpenRouter LLM
  (API: https://openrouter.ai/api/v1)
       ├─ Auth: Bearer token
       ├─ Response: Structured JSON
       └─ Usage: Token tracking
```

## Task Categories

### Content Generation (6 tasks)

**`generateClipCandidates()`**
- Input: video transcript, platform, niche
- Output: List of viral-worthy moments with timestamps
- Use case: Extract clips from long-form videos

```typescript
const result = await generateClipCandidates({
  transcript: "...",
  platform: "tiktok",
  niche: "tech",
  audience: "Gen Z",
});
```

**`generateVideoIdeas()`**
- Input: topic, platform, audience
- Output: 5 unique video concepts
- Use case: Brainstorm content ideas

**`generateHooks()`**
- Input: topic, platform, format
- Output: 5-10 attention-grabbing hooks
- Use case: Open videos with compelling lines

**`writeScript()`**
- Input: topic, duration, audience, tone
- Output: Complete script with timing
- Use case: Full script generation

**`outlineScript()`**
- Input: topic, duration, audience
- Output: Hook, sections, conclusion, CTA
- Use case: Structure without dialogue

**`rewriteScript()`**
- Input: script, platform, audience, tone
- Output: Rewritten version
- Use case: Adapt script for different platforms

### Optimization (6 tasks)

**`generateVideoTitles()`**
- Output: 5 SEO-optimized titles
- Use case: YouTube/TikTok optimization

**`generateVideoDescription()`**
- Output: Description with timestamps, CTAs
- Use case: Full description writing

**`generateVideoChapters()`**
- Output: MM:SS timestamps with section titles
- Use case: YouTube chapters

**`generateVideoTags()`**
- Output: 10-15 relevant hashtags/keywords
- Use case: Discovery optimization

**`cleanupSubtitles()`**
- Input: SRT format subtitles
- Output: Grammar-corrected, readable subtitles
- Use case: Subtitle post-processing

**`reviewClipQuality()`**
- Input: clip duration, hook, transcript
- Output: Quality/virality scores + feedback
- Use case: Evaluate clips before export

### Research

**`researchTopic()`**
- Input: URL, topic
- Output: Extracted content + context
- Use case: Gather research for script writing

```typescript
const research = await researchTopic({
  sourceUrl: "https://example.com/article",
  topic: "AI trends",
});

// Now use in script writing:
await writeScript({
  topic: "AI trends",
  duration: 60,
  context: research.researchContent,
});
```

## Adding a New Task

### 1. Define Prompt in `prompt-registry.ts`

```typescript
export const MY_TASK_PROMPT: PromptConfig = {
  taskId: "my_task",
  version: "1.0.0",
  systemInstructions: `You are a specialist in X...
${INJECTION_DEFENSE}`,
  userPromptTemplate: `Input: {input}\nContext: {context}`,
  outputSchema: z.object({
    result: z.string(),
    score: z.number(),
  }),
  modelConfig: {
    maxTokens: 1000,
    temperature: 0.7,
    topP: 1,
  },
};

// Add to exports
export const getPromptConfig = (taskId) => {
  const prompts = {
    // ... existing
    my_task: MY_TASK_PROMPT,
  };
  return prompts[taskId];
};
```

### 2. Add to AIService

```typescript
// ai-service.ts
export async function myTask(input: {
  input: string;
  context?: string;
}) {
  return executeAITaskWithRetry({
    taskId: "my_task" as AITaskId,
    variables: {
      input: input.input,
      context: input.context || "",
    },
  });
}

export const AIService = {
  // ... existing
  myTask,
};
```

### 3. Export from Index

```typescript
// ai/index.ts
export { myTask } from "./ai-service";
```

### 4. Use in Component

```typescript
import { myTask } from "@/lib/ai";

const result = await myTask({ input: "..." });
```

## Error Handling

### Automatic Retry

All `AIService` methods use `executeAITaskWithRetry` by default:

```typescript
// Retries up to 2 times with exponential backoff
const result = await generateVideoIdeas({ ... });

if (!result.success) {
  console.error("Failed:", result.error);
  // Handle gracefully in UI
}
```

### Fallback Responses

Define fallback content in prompt config:

```typescript
MY_PROMPT: {
  // ...
  fallback: {
    enabled: true,
    content: "Unable to generate. Please try again.",
  },
}
```

### Manual Error Handling

```typescript
try {
  const result = await generateVideoIdeas({ ... });
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
} catch (error) {
  // Log to monitoring service
  console.error("AI task failed:", error);
  // Return user-friendly message
  return null;
}
```

## Monitoring & Analytics

Track usage in your server logs:

```typescript
const result = await generateVideoIdeas({ ... });

if (result.success) {
  console.log({
    task: "video_ideas",
    inputTokens: result.usage?.inputTokens,
    outputTokens: result.usage?.outputTokens,
    model: result.model,
    duration: Date.now() - startTime,
  });
}
```

Next steps:
- Add to database for cost tracking
- Build analytics dashboard
- Set up alerts for failures

## Performance Tips

### 1. Batch Operations

```typescript
const [titles, tags, descriptions] = await Promise.all([
  generateVideoTitles({ ... }),
  generateVideoTags({ ... }),
  generateVideoDescription({ ... }),
]);
```

### 2. Reduce Token Usage

- Provide specific, concise prompts
- Set appropriate `maxTokens`
- Avoid redundant context

### 3. Cache Results

```typescript
// Cache in React Query or SWR
const { data } = useSWR(
  [`ideas-${topic}`, platform],
  ([key, platform]) => generateVideoIdeas({ topic, platform })
);
```

## Security Checklist

- ✅ API key in `.env.local` (not committed)
- ✅ All prompts have injection defense
- ✅ Crawl engine validates domains
- ✅ SSRF protection enabled (blocks private IPs)
- ✅ Rate limiting configured
- ✅ No client-side API exposure

## Troubleshooting

### "OPENROUTER_API_KEY is not set"

```bash
# Check .env.local
cat .env.local | grep OPENROUTER_API_KEY

# Restart dev server
npm run dev
```

### "Unknown model"

```bash
# List available models
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  https://openrouter.ai/api/v1/models
```

### "Rate limited"

- Check OpenRouter account quota
- Reduce token budgets
- Implement caching layer

## Next Steps

1. ✅ Implement OpenRouter integration
2. ✅ Add 12 versioned prompts
3. ✅ Create AI service facade
4. ⏭️ Build UI components (AIToolPage)
5. ⏭️ Add video processing workers
6. ⏭️ Implement database persistence
7. ⏭️ Add job queue (Bull/BullMQ)
8. ⏭️ Set up cost tracking dashboard
