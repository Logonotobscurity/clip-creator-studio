# CLIPIN — AI Video Repurposing & Creator Platform

**Turn long-form video into short clips, scripts, titles, and scheduled content with AI-assisted workflows.**

This repository contains the product architecture, design system, and application structure for CLIPIN — a creator platform focused on video analysis, clip generation, editing, optimization, and publishing workflows.

> **Status note:** The previous README and much of the repository content is a detailed implementation specification and master prompt. Full end-to-end video processing (upload → clip → export) should be verified before presenting this as a completed production system.

---

## What problem does this solve?

Creators need to turn long videos into platform-ready short clips, generate supporting content (hooks, scripts, titles, descriptions, tags), and manage scheduling and history. CLIPIN aims to provide an integrated workspace for these steps rather than isolated tools.

## What is implemented / specified

The repository documents and partially implements:

- Application routes for clip maker, ideation, scripting, optimization, monetization estimates, scheduling, history, and analytics.
- Design system (ivory background, brown primary, yellow accent, editorial typography).
- Reusable component architecture (AppShell, tool pages, clip editor, export panel, schedule forms, etc.).
- Service abstractions for video ingestion, transcription, clip generation, face tracking, subtitles, and export.
- AI tool pages with consistent input → generate → result patterns.
- State management and API contract definitions.
- Modern stack: TanStack Start, React, Tailwind, TypeScript, AI SDK.

## Architecture

Central workflow:

```
VIDEO → ANALYSE → IDENTIFY MOMENTS → GENERATE CLIPS → EDIT → STYLE → EXPORT → SCHEDULE → ANALYSE
```

Key abstractions (intended):
- `videoService`, `transcriptionService`, `clipService`, `faceTrackingService`, `subtitleService`, `exportService`
- Reusable `<AIToolPage />` pattern
- Local persistence initially, with clear path to PostgreSQL / object storage

## What a reviewer can run

```bash
npm install   # or bun install
npm run dev
```

Inspect routes under `/app/*` for the creator workspace. Many AI and video steps currently rely on service interfaces and mocks rather than full production backends.

## Honest limitations (from portfolio audit)

- The previous README was largely a detailed implementation specification and autonomous coding prompt.
- Full video-processing pipeline (real upload, transcription, clipping, export) has not been verified as end-to-end working in the current public state.
- Present as a product direction and architecture for creative AI workflows, not as a finished production clipper, until the core pipeline is demonstrable.

## Portfolio value

Relevant for creative AI, multimodal product, and full-stack AI implementation roles (e.g., ElevenLabs creative agents, product-oriented positions).  
Best used as supporting evidence alongside stronger agent and integration projects (AgentBridge Africa, PAL, Re:Mind Me).

## Recommended next steps

1. Move the full master prompt into a `docs/DEVELOPMENT_PROMPT.md` or similar so the root README stays reviewer-friendly.
2. Verify and document which parts of the clip pipeline actually run end-to-end.
3. Add a short demo video or reproducible walkthrough of upload → clip results → edit → export.

## Further reading

- Design tokens and component structure under `src/`
- Service abstractions and API contracts in the codebase
