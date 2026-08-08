# CLIPIN executable implementation roadmap

## Phase 0 — Repository baseline

- Inspect current source tree and build configuration.
- Preserve the CLIPIN product README/specification.
- Establish CI with install, lint, typecheck, test, and build jobs.
- Add environment variable documentation without committing secrets.

## Phase 1 — Application foundation

- Implement React/Vite or the repository's established frontend runtime.
- Create route-level code splitting.
- Create CLIPIN design tokens and component primitives.
- Build app shell, navigation, authentication shell, workspace context, and error boundaries.

## Phase 2 — Creator tools

Implement the full tool matrix:

- short clip maker
- unlimited video ideas
- hooks
- script writer
- script outline
- script rewrite
- video title
- video description
- video chapters
- video tags
- earnings calculator
- brand deal estimator
- scheduling
- history
- analytics

## Phase 3 — AI platform

- Provider-neutral LLM interface.
- Prompt registry with versioning.
- Zod/JSON-schema validation for structured outputs.
- AI task orchestration.
- Retry/backoff and timeout handling.
- Token/cost accounting.
- Prompt injection defenses.
- AI evaluation fixtures.

## Phase 4 — Crawl and research

- Safe URL inspector.
- robots/policy-aware public crawler.
- HTML extraction and canonicalization.
- content deduplication.
- chunking and indexing.
- provenance tracking.
- retrieval and citation-aware generation.
- SSRF protections and domain policies.

## Phase 5 — Video intelligence

- Object storage abstraction.
- Upload/ingestion.
- Transcription.
- Scene detection.
- Speaker activity.
- Face detection/tracking.
- Candidate clip generation.
- LLM ranking.
- deterministic validation.

## Phase 6 — Editing/rendering

- Clip editor.
- Timeline.
- crop/trim.
- 9:16, 1:1, 16:9.
- automatic face tracking.
- manual framing.
- subtitle generation.
- animated subtitle styles.
- brand presets.
- 720p/1080p export.
- render job progress.

## Phase 7 — Publishing

- schedule model.
- publishing adapter interface.
- platform-specific metadata.
- history events.
- analytics abstraction.

## Phase 8 — Production infrastructure

Recommended services:

- PostgreSQL
- object storage
- Redis-compatible queue/cache
- worker runtime
- FFmpeg/Remotion rendering
- LLM provider(s)
- embedding/index store
- monitoring

Use adapters so services can be swapped without changing feature components.

## Phase 9 — QA

Automate:

- unit tests
- component tests
- API/service tests
- AI schema tests
- crawler security tests
- SSRF tests
- video pipeline fixtures
- E2E creator workflow
- accessibility checks
- build/typecheck/lint

## Phase 10 — Release

Before release:

- no secrets in repository
- production environment variables documented
- signed asset URLs enabled
- authentication and authorization verified
- workspace isolation tested
- rate limits enabled
- crawler policy controls enabled
- background jobs observable
- backups configured
- error monitoring configured
- export jobs recoverable
