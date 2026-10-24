# CLIPIN — AI Video Repurposing & Creator Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-TanStack%20Start-blue)]()
[![AI](https://img.shields.io/badge/AI-SDK-green)]()
[![Status](https://img.shields.io/badge/Status-architecture%20%2B%20spec-orange)]()

**Turn long-form video into short clips, scripts, titles, and scheduled content with AI-assisted workflows.**

This repository contains the product architecture, design system, and application structure for CLIPIN — a creator platform focused on video analysis, clip generation, editing, optimization, and publishing workflows.

> **Status note:** The previous README was a detailed implementation specification and master prompt. Full end-to-end video processing should be verified before presenting this as a completed production system.

<!-- Demo GIF: short clip of clipmaker flow once pipeline is verified -->

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

```mermaid
flowchart LR
    A[Video URL] --> B[Analyse]
    B --> C[Identify Moments]
    C --> D[Generate Clips]
    D --> E[Edit / Style]
    E --> F[Export]
    F --> G[Schedule]
    G --> H[Analytics]
```

## What a reviewer can run

```bash
npm install   # or bun install
npm run dev
```

Inspect routes under `/app/*` for the creator workspace. Many AI and video steps currently rely on service interfaces and mocks rather than full production backends.

## Honest limitations

- The previous README was largely a detailed implementation specification and autonomous coding prompt.
- Full video-processing pipeline has not been verified as end-to-end working.
- Present as a product direction and architecture for creative AI workflows until the core pipeline is demonstrable.

## Portfolio value

Relevant for creative AI, multimodal product, and full-stack AI implementation roles.  
Best used as supporting evidence alongside AgentBridge Africa, PAL, and Re:Mind Me.

## Recommended next steps

1. Move the full master prompt into `docs/DEVELOPMENT_PROMPT.md`.
2. Verify and document which parts of the clip pipeline actually run end-to-end.
3. Add a short demo video or reproducible walkthrough.

## Visual assets to add

1. Demo GIF of the clipmaker results and editor once the pipeline is verified.
2. Screenshots of the design system / creator workspace.
3. Social preview image (1280×640).
