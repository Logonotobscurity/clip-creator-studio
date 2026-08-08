# CLIPIN AI + LLM + Prompt Engineering + Crawl Architecture

## Purpose

This document defines the production architecture for CLIPIN's AI layer. The UI must remain provider-agnostic and must never expose model-provider secrets.

## AI orchestration

```text
User request
  -> Request validation
  -> Task classifier
  -> Context retrieval
  -> Prompt compiler
  -> LLM provider adapter
  -> Structured output validation
  -> Quality checks
  -> Persistence
  -> UI result
```

## Provider abstraction

Create a provider-neutral interface:

```ts
interface LLMProvider {
  generate(input: LLMRequest): Promise<LLMResponse>
  generateStructured<T>(input: StructuredLLMRequest<T>): Promise<T>
  embed?(input: string[]): Promise<number[][]>
}
```

Adapters should live under `src/services/ai/providers/` or the backend equivalent. Provider selection belongs in configuration, not components.

## AI tasks

Support these task IDs:

- clip_candidates
- video_ideas
- hooks
- script_write
- script_outline
- script_rewrite
- video_title
- video_description
- video_chapters
- video_tags
- subtitle_cleanup
- clip_quality_review

## Prompt engineering

Use versioned prompt templates. Never concatenate arbitrary user input into system instructions without delimiters.

Recommended structure:

```text
SYSTEM
ROLE
TASK
RULES
QUALITY CRITERIA
OUTPUT SCHEMA

CONTEXT
<retrieved context>

USER INPUT
<delimited user input>
```

Every prompt must have:

- stable task identifier
- version
- model configuration
- expected JSON schema
- maximum output budget
- validation rules
- fallback behavior

Example:

```ts
const prompt = promptRegistry.compile({
  task: 'clip_candidates',
  version: '1.0.0',
  variables: { transcript, scenes, speakerTracks, targetPlatform }
})
```

## Structured output

AI results must be validated before entering application state.

Example clip candidate:

```ts
interface ClipCandidate {
  title: string
  startTime: number
  endTime: number
  hook: string
  rationale: string
  score: number
  topics: string[]
  speakers: string[]
}
```

Reject invalid ranges, impossible timestamps, unsupported scores, missing required fields, and malformed arrays.

## Clip intelligence

The clip-selection pipeline should combine multiple signals instead of asking an LLM to blindly choose moments:

```text
Transcript
+ scene boundaries
+ speaker activity
+ face tracks
+ sentence boundaries
+ topic changes
+ emotional/semantic salience
+ duration constraints
+ platform constraints
      -> candidate windows
      -> LLM ranking
      -> deterministic validation
      -> final clips
```

The LLM is an orchestration/intelligence layer, not the only source of truth.

## Crawl / web research subsystem

Crawling is a separate service from AI generation.

```text
Crawler request
  -> URL validation
  -> robots/policy check
  -> fetch
  -> content extraction
  -> canonicalization
  -> deduplication
  -> sanitization
  -> document store
  -> chunking
  -> embeddings/index
  -> retrieval
```

Only crawl public content where permitted by the target site's terms, robots directives, applicable law, and product policy. Do not bypass authentication, paywalls, CAPTCHAs, access controls, or anti-bot systems.

## Crawler interfaces

```ts
interface CrawlService {
  inspect(url: string): Promise<CrawlTarget>
  crawl(request: CrawlRequest): Promise<CrawlJob>
  getJob(id: string): Promise<CrawlJob>
  getDocuments(jobId: string): Promise<CrawledDocument[]>
}
```

Use allowlists for supported domains when practical. Enforce:

- URL normalization
- maximum depth
- maximum pages
- maximum bytes
- request timeout
- rate limit
- content-type allowlist
- robots/policy checks
- duplicate detection
- SSRF protection
- private-network blocking

Never allow arbitrary server-side URL fetching without SSRF controls.

## Content extraction

Extract:

- title
- canonical URL
- author when available
- publication date when available
- headings
- body text
- links
- source metadata

Remove navigation, scripts, tracking elements, and boilerplate before indexing.

## RAG

For creator research workflows:

```text
crawl documents
 -> clean text
 -> chunk
 -> embed
 -> vector/index store
 -> retrieve top-k
 -> rerank where useful
 -> prompt compiler
 -> structured LLM result
```

Every retrieved source must retain provenance:

```ts
interface SourceCitation {
  url: string
  title?: string
  retrievedAt: string
  chunkId: string
}
```

The AI must never invent citations. If source evidence is insufficient, return an explicit insufficient-evidence state.

## Prompt injection defense

Treat crawled webpages, transcripts, uploaded documents, and creator text as untrusted data.

Never allow retrieved content to redefine:

- system instructions
- tool permissions
- secrets
- output schema
- security policy

Delimit external content and explicitly instruct the model that it is reference material, not instructions.

## Tool calling

AI tools should be allowlisted:

```text
search_web
crawl_url
retrieve_documents
generate_clip_candidates
transcribe_video
analyze_video
render_clip
create_subtitles
export_video
```

Each tool receives validated typed input. Tool execution must be server-side.

## Cost controls

Implement:

- token budgets
- request quotas
- model tiers
- cache keys
- duplicate request detection
- timeout/cancellation
- retry with exponential backoff
- circuit breakers for providers

Do not retry non-idempotent operations blindly.

## Observability

Log safe metadata only:

- request ID
- user/workspace ID hash where appropriate
- task ID
- prompt version
- provider/model
- latency
- token usage
- status
- validation outcome
- cost estimate

Never log API keys, passwords, raw private uploads, or sensitive user content by default.

## Video processing architecture

```text
Upload/Ingest
 -> Object storage
 -> Job queue
 -> Worker
 -> FFmpeg / media engine
 -> AI analysis
 -> clip worker
 -> subtitle worker
 -> face tracking worker
 -> render/export worker
 -> object storage
 -> signed download URL
```

Long-running video processing must not run inside a normal request handler.

## Job model

```ts
interface ProcessingJob {
  id: string
  type: string
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  inputAssetId: string
  outputAssetIds: string[]
  errorCode?: string
  createdAt: string
  updatedAt: string
}
```

## Face tracking

Use a dedicated face-tracking worker. Produce normalized tracking points and confidence values. The renderer consumes tracks and applies smoothed crop movement.

## Subtitle rendering

Separate:

1. transcription
2. subtitle segmentation
3. subtitle styling
4. render/export

The frontend edits subtitle data; the worker renders the final media.

## Brand presets

Brand presets must be data-driven and reusable across exports.

```ts
interface BrandPreset {
  id: string
  name: string
  logoAssetId?: string
  overlays: Overlay[]
  colors: string[]
  subtitleStyle?: SubtitleStyle
}
```

## Security baseline

Required controls:

- server-side secrets
- signed asset URLs
- authentication/authorization
- workspace isolation
- SSRF protection for crawler URLs
- upload size/type validation
- path traversal protection
- webhook signature verification
- rate limiting
- audit events
- safe HTML extraction
- prompt injection defenses

## Recommended project layout

```text
src/
  ai/
    providers/
    prompts/
    schemas/
    orchestrator/
    evaluators/
  crawl/
    crawler/
    extractors/
    policy/
    indexing/
  video/
    ingest/
    transcription/
    clips/
    face-tracking/
    subtitles/
    rendering/
    export/
  services/
  features/
  components/
  design/

workers/
  ai-worker/
  crawl-worker/
  video-worker/
  render-worker/
```

## Definition of technical readiness

The product is not considered production-ready merely because AI buttons return text. Production readiness requires typed AI contracts, prompt versioning, provider adapters, structured validation, background processing, crawl safety controls, provenance, observability, retries, quotas, authentication, and test coverage.
