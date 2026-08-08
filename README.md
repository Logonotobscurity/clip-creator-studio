# Clip Creator Studio

Absolutely. Below is a single master prompt you can give to an autonomous AI coding agent (Codex, Claude Code, Cursor Agent, Gemini CLI, OpenHands, Cline, etc.). It combines the CLIPIN product architecture, the audited visual system, the Popcornopolis functional patterns, the dedicated tool pages, and the video-processing capabilities we defined.

CLIPIN — MASTER AUTONOMOUS DEVELOPMENT PROMPT

ROLE

Act as a principal full-stack engineer, product architect, UI/UX engineer, design-system engineer, video-processing engineer, QA engineer, and DevOps engineer.

You are responsible for transforming the existing repository into a production-quality CLIPIN AI video repurposing platform.

Do not merely create mock screens.

Build the actual application architecture, reusable design system, responsive interfaces, state management, API contracts, video-processing abstractions, persistence layer, validation, error handling, accessibility, testing, and deployment configuration required for the product.

1. PRIMARY OBJECTIVE

Transform the existing repository:

Logonotobscurity/Popcornopolis-functional-website

into:

CLIPIN — AI Video Repurposing & Creator Platform

The existing Popcornopolis project should be treated as a technical reference implementation, not as CLIPIN's product/content identity.

Reuse useful engineering patterns where appropriate:

React

Vite

React Router

Tailwind

reusable components

route architecture

state management patterns

local persistence

loading states

transitions

responsive behavior

existing JavaScript interaction patterns

Do NOT copy Popcornopolis branding, copywriting, product content, or visual identity into CLIPIN.

2. SOURCE OF TRUTH HIERARCHY

When implementing the product, use this priority:

CLIPIN product requirements

CLIPIN information architecture

CLIPIN feature requirements

audited visual design system

existing repository's reusable engineering patterns

sensible engineering conventions

Do not allow the reference website to override CLIPIN requirements.

3. CORE PRODUCT

CLIPIN allows creators to:

turn long-form videos into short clips

generate video ideas

generate hooks

write scripts

create script outlines

rewrite scripts from videos

generate titles

generate descriptions

generate chapters

generate tags

estimate creator earnings

estimate brand deals

schedule content

manage content history

analyse content production

The central workflow is:

VIDEO
→ ANALYSE
→ IDENTIFY MOMENTS
→ GENERATE CLIPS
→ EDIT
→ STYLE
→ EXPORT
→ SCHEDULE
→ ANALYSE

4. REQUIRED APPLICATION ROUTES

Implement the following routes.

Public

/


If the application uses onboarding first:

/onboarding
/login
/signup


Creator workspace

/app/clipmaker
/app/clipmaker/results

/app/ideate
/app/hooks

/app/script/write
/app/script/outline
/app/script/rewrite

/app/optimise/title
/app/optimise/description
/app/optimise/chapters
/app/optimise/tags

/app/monetise
/app/deals

/app/schedule
/app/history
/app/analytics
/app/more


Every route must be functional and navigable.

No dead links.

No placeholder route returning an empty screen.

5. HUB / EXPLORE PAGE

The primary creator dashboard must contain:

Hey, what will you create today?

Explore our cutting-edge tools and start creating


Organize tools into:

Repurpose

Short clip maker

Route:

/app/clipmaker


Ideate

Unlimited video ideas

Route:

/app/ideate


Scripting

Script writer

Route:

/app/script/write


Script outline

Route:

/app/script/outline


Rewrite script of any video

Route:

/app/script/rewrite


Upload and optimize

Video title

Route:

/app/optimise/title


Video description

Route:

/app/optimise/description


Video chapters

Route:

/app/optimise/chapters


Video tags

Route:

/app/optimise/tags


Monetise

Earnings calculator

/app/monetise


Brand deal estimator

/app/deals


Schedule

Publishing hub

/app/schedule


6. SHORT CLIP MAKER

Route:

/app/clipmaker


Page heading:

READY TO CREATE SHORTS IN SECONDS?


Description:

Start by pasting your YouTube, TikTok, Instagram, or Google Drive link below.


Input:

VIDEO LINK


Placeholder:

Drop a video link


Support:

YouTube

TikTok

Instagram

Google Drive

Context section:

GIVE US MORE CONTEXT


Fields:

Inspiration channel or creator handle
Trending in country
Add more context (optional)


Country options should include:

Nigeria
United States
United Kingdom
Global


Primary action:

Generate Clips


7. CLIP ANALYSIS PIPELINE

Implement an abstraction that supports:

Video URL
↓
Video ingestion
↓
Metadata extraction
↓
Transcript extraction
↓
Scene detection
↓
Speaker detection
↓
Face detection
↓
Candidate moment detection
↓
Virality scoring
↓
Clip generation
↓
Clip metadata


Do not hard-code the processing implementation into React components.

Create service abstractions such as:

videoService
transcriptionService
clipService
faceTrackingService
subtitleService
exportService
brandPresetService


The frontend must communicate with these services through clean interfaces.

8. CLIP RESULTS

Route:

/app/clipmaker/results


Heading:

Here are your Clips


Supporting copy:

We found [N] viral moments in your video.


Display a collection of generated clips.

Each clip should support:

Clip number
Clip title
Transcript preview
Duration
Preview
Edit
Trim
Download
Share
Schedule


Include:

Sort
Trim
Share All


The clip architecture must support multiple clips.

9. CLIP EDITOR

Create a dedicated editing experience.

The editor must support:

Source selection

Use whole video
Cut manually


Manual trimming

Start time
End time


Use:

HH:MM:SS


Editing capabilities

Implement UI and service contracts for:

trim

crop

resize

aspect ratio

face tracking

subtitles

subtitle style

branding

overlays

logo

export quality

10. CENTER-STAGE FACIAL TRACKING

Add this product capability:

Center stage facial tracking

Content:

Ensure your active speakers never miss their spotlight. Our AI uses facial tracking technology to automatically keep them at the center of the screen.


Implement:

FaceDetectionService
FaceTrackingService
CropTrackingService


Architecture:

Video
↓
Face detection
↓
Face coordinates
↓
Speaker identification
↓
Active speaker selection
↓
Crop target
↓
Smooth camera movement
↓
Rendered vertical video


Do not implement abrupt frame-to-frame movement.

Use smoothing/interpolation for the crop position.

The editor must provide:

Auto Track Face
Manual Crop
Tracking On/Off


11. ANIMATED SUBTITLES

Add:

One-click animated subtitles

Content:

Increase viewer engagement and watch time effortlessly. With a single click, add animated subtitles that breathe life into your content.


Implement:

Generate subtitles
Animated subtitles
Subtitle preview
Subtitle style
Subtitle position
Subtitle size
Subtitle timing


The system should support a subtitle model:

{
  text: string
  startTime: number
  endTime: number
  speaker?: string
  style?: string
}


Provide a subtitle-rendering abstraction so actual video rendering can later use:

FFmpeg

Remotion

server-side video rendering

another production renderer

Do not tie the UI directly to one rendering engine.

12. HIGH-QUALITY EXPORTS

Add:

Unlimited high-quality exports

Content:

Say goodbye to watermarks and hello to 1080p quality. Enjoy unlimited, high-resolution exports that make your content stand out.


Export options:

720p
1080p


Support:

MP4


Architecture should allow future:

4K


Do not artificially impose an export watermark.

Export states:

Queued
Processing
Completed
Failed
Cancelled


Show progress where available.

13. ASPECT RATIOS

Add:

Versatile aspect ratios

Content:

Reach your audience on every platform. Support for vertical, square, and horizontal aspect ratios lets you create perfect shorts for any platform.


Support:

9:16
1:1
16:9


Preset labels:

Vertical
Square
Horizontal


The editor must dynamically update crop/preview dimensions.

14. ADVANCED EDITING

Add:

Advanced editing tools

Content:

Achieve your vision with our advanced editing and cropping options. They provide added flexibility when automatic face tracking isn't enough.


Implement UI contracts for:

Trim
Crop
Zoom
Position
Aspect ratio
Face tracking
Manual framing


Use reusable editor controls.

15. BRAND PRESETS

Add:

Brand presets

Content:

Make every video uniquely yours. Add brand logos and overlays to your exported videos for a distinct and visually appealing brand presence.


Implement:

Brand Presets
Create preset
Edit preset
Delete preset
Apply preset


Preset model:

{
  id: string
  name: string
  logo?: string
  overlays?: Overlay[]
  colors?: string[]
  subtitleStyle?: string
}


Support:

Logo
Overlay
Brand colors
Subtitle style


16. AI TOOL PAGES

Every AI tool needs the same reusable architecture:

PAGE HEADER
↓
INPUT
↓
OPTIONAL CONTEXT
↓
GENERATE
↓
LOADING
↓
RESULT
↓
COPY
↓
EXPORT


Build a reusable:

<AIToolPage />


rather than duplicating entire page implementations.

17. VIDEO IDEAS

Route:

/app/ideate


Heading:

Unlimited video ideas


Inputs:

Topic
Platform
Audience
Context


Output:

Idea
Title
Concept
Hook
Suggested format


18. HOOK GENERATOR

Route:

/app/hooks


Generate multiple hooks.

Each result:

Hook
Type
Platform
Potential use
Copy


19. SCRIPT WRITER

Route:

/app/script/write


Inputs:

Topic
Source URL
Audience
Tone
Duration
Additional context


Output:

Title
Hook
Introduction
Body
CTA


20. SCRIPT OUTLINE

Route:

/app/script/outline


Output:

Hook
Section 1
Section 2
Section 3
Conclusion
CTA


21. SCRIPT REWRITER

Route:

/app/script/rewrite


Accept:

Video URL
Script
Transcript


Output a rewritten script while preserving the intended subject matter.

22. VIDEO OPTIMIZATION

Implement:

/app/optimise/title
/app/optimise/description
/app/optimise/chapters
/app/optimise/tags


Title

Generate multiple title options.

Description

Generate optimized description.

Chapters

Generate:

00:00 Introduction
01:24 Topic
03:15 Key point
...


Tags

Generate:

#tag
#tag
#tag


All four should share reusable UI primitives.

23. EARNINGS CALCULATOR

Route:

/app/monetise


Inputs:

Platform
Expected views/month
Clips/month
Followers
Niche


Calculate an estimated range.

Include disclaimer:

These are estimated projections based on 2026 average platform rates. Actual earnings depend on niche, audience quality, engagement rate, geographic reach, and brand deal availability. EMV calculated at industry-standard $5 CPM.


Do not present estimates as guaranteed income.

24. BRAND DEAL ESTIMATOR

Route:

/app/deals


Inputs:

Followers
Average views
Engagement
Niche
Platform
Deliverables


Output:

Estimated deal range
Estimated CPM
Estimated EMV


25. PUBLISHING HUB

Route:

/app/schedule


Support:

TikTok
Instagram
YouTube


Scheduling model:

{
  id: string
  clipId: string
  platform: string
  scheduledFor: string
  status: 'pending' | 'published' | 'failed'
}


UI:

Select Clip
Platform
Caption
Hashtags
Date
Time
Schedule


Scheduled list:

Clip
Platform
Date
Time
Status
Edit
Cancel


26. HISTORY

Route:

/app/history


Track:

Project
Video
Action
Date
Status


Actions:

Generated
Edited
Exported
Scheduled
Published
Failed


Persist locally initially.

Create a repository/service abstraction so this can later use PostgreSQL or another database.

27. ANALYTICS

Route:

/app/analytics


Initial metrics:

Clips created
Exports
Scheduled
Average clip length


Architecture must allow future:

Views
Watch time
Engagement
CTR
Retention
Platform comparison


28. DESIGN SYSTEM

The audited visual design system is the source of truth.

Use:

--color-background: #FAF1EB;
--color-primary: #613223;
--color-accent: #FED455;
--color-danger: #E22733;
--color-info: #84C4EC;


Typography hierarchy should follow the audited system.

Use:

Faro
Turbinado
Sofia Pro


If these fonts are unavailable in the repository, implement a clean fallback stack rather than breaking the application.

29. LAYOUT TOKENS

Use:

Desktop content max-width: 1180px
Desktop gutter: 30px
Major section gap: 64px
Card radius: 25px
Pill radius: 9999px
Large asymmetric media radius: 120px where appropriate


Do not randomly introduce different values.

Centralize tokens.

Example:

src/
  clipin/
    design/
      tokens.css
      tokens.ts
      tailwind.preset.js


30. COMPONENT SYSTEM

Create reusable components:

AppShell
Header
Sidebar / ToolNavigation
PageHeader
SectionHeader
ToolCard
ToolGroup
FeatureCard
Button
Input
Textarea
Select
Pill
Modal
Drawer
Toast
LoadingState
EmptyState
ErrorState
VideoInput
VideoPreview
VideoTimeline
ClipCard
ClipList
ClipEditor
CropControls
FaceTrackingControls
SubtitleEditor
BrandPresetEditor
ExportPanel
ScheduleForm
ScheduleList
ResultCard
AIResult
HistoryList
StatsCard


Avoid giant monolithic components.

31. COMPONENT PRINCIPLE

A component should own one responsibility.

Bad:

ClipMaker.jsx


containing:

video ingestion

editor

API

export

scheduling

UI

state

persistence

Good:

ClipMakerPage
VideoInput
ClipGenerationService
ClipResults
ClipEditor
ExportPanel
ScheduleModal


32. STATE MANAGEMENT

Create a clean state model.

Core state:

User
Workspace
CurrentVideo
Transcript
Clips
SelectedClip
EditorState
SubtitleState
BrandPreset
ExportJob
Schedule
History
Analytics


Do not store huge video files in React state.

Use URLs, IDs, metadata, and service references.

33. API CONTRACTS

Create frontend service interfaces for:

POST /api/video/ingest
POST /api/video/transcribe
POST /api/ai/extract-clips
POST /api/ai/generate-title
POST /api/ai/generate-description
POST /api/ai/generate-chapters
POST /api/ai/generate-tags
POST /api/ai/write-script
POST /api/ai/script-outline
POST /api/ai/rewrite-script
POST /api/ai/generate-hooks
POST /api/ai/generate-ideas
POST /api/video/face-track
POST /api/video/subtitles
POST /api/video/export
POST /api/brand-presets
GET /api/brand-presets
POST /api/schedule
GET /api/schedule
DELETE /api/schedule/:id
GET /api/history
GET /api/analytics


If backend endpoints don't yet exist, implement typed mock/service adapters.

Never hard-code fake API responses directly inside UI components.

34. VIDEO SERVICE ARCHITECTURE

Create interfaces such as:

interface VideoService {
  ingest(source: VideoSource): Promise<VideoAsset>
  transcribe(videoId: string): Promise<Transcript>
  detectScenes(videoId: string): Promise<Scene[]>
  detectFaces(videoId: string): Promise<FaceTrack[]>
  generateClip(input: ClipRequest): Promise<Clip>
  exportClip(input: ExportRequest): Promise<ExportJob>
}


Implement a development adapter.

Later adapters may use:

FFmpeg
Remotion
Cloud video processing
GPU workers


35. ERROR HANDLING

Every asynchronous workflow must have:

idle
loading
success
empty
error
retry


Examples:

Video URL invalid
Unsupported platform
Transcript unavailable
AI generation failed
Export failed
Scheduling failed
Network timeout
Authentication expired


Errors must be human-readable.

Never expose raw stack traces to users.

36. LOADING UX

Use meaningful loading states.

Examples:

Analysing your video...
Finding the strongest moments...
Tracking speakers...
Generating subtitles...
Preparing your export...


Do not use generic:

Loading...


for long-running operations.

37. RESPONSIVE DESIGN

Desktop:

1180px centered system


Tablet:

2-column layouts where appropriate


Mobile:

single column


Ensure:

navigation remains usable

forms don't overflow

video previews fit viewport

editor controls remain accessible

buttons remain tappable

tables become cards/lists

grids collapse correctly

38. ACCESSIBILITY

Implement:

semantic HTML
keyboard navigation
visible focus states
ARIA labels
accessible forms
sufficient contrast
reduced motion
screen-reader-friendly status messages


All interactive elements must be keyboard reachable.

39. PERFORMANCE

Do not load heavy video processing libraries into the initial bundle unnecessarily.

Use:

lazy routes
dynamic imports
code splitting
memoization where useful
virtualized lists for large histories


Video files must not be loaded unnecessarily.

Use poster images/thumbnails where possible.

40. SECURITY

Never put:

API keys
AI provider secrets
cloud credentials
database credentials


in frontend code.

Use environment variables.

Validate all user-controlled URLs and inputs.

Do not trust filenames, metadata, or upload MIME types blindly.

41. PERSISTENCE

Development:

localStorage


Production architecture:

PostgreSQL
Object storage
Redis/job queue


Design repository interfaces so changing storage does not require rewriting components.

42. TESTING

Add tests for:

Unit

token utilities

URL validation

clip duration validation

aspect ratio calculation

earnings calculation

scheduling validation

Component

ToolCard

VideoInput

ClipCard

ClipEditor

SubtitleEditor

ExportPanel

ScheduleForm

Integration

Video URL
→ generate clips
→ results
→ edit
→ export


E2E

Test:

Onboarding
→ Signup
→ Hub
→ Clip Maker
→ Results
→ Editor
→ Schedule


43. DESIGN QUALITY REQUIREMENT

Do NOT produce a generic SaaS dashboard.

The interface must feel like a deliberate editorial creator product.

Use:

strong typography

large editorial headings

asymmetric composition where appropriate

ivory background

brown primary

yellow accents

expressive cards

restrained borders

rounded containers

strong whitespace

visual hierarchy

clear creator workflows

However:

Do not copy the exact Popcornopolis page composition.

Use its audited system as the visual language while CLIPIN owns its own information architecture.

44. DO NOT DO THESE THINGS

Do not:

leave TODO placeholders

create dead routes

hard-code API responses in components

duplicate page components unnecessarily

copy Popcornopolis content

copy Popcornopolis branding

introduce random colors

introduce random spacing

ignore mobile

ignore loading states

ignore error states

store video binaries in React state

expose secrets

pretend AI/video processing is actually running when only mocked

claim a feature is production-ready if the backend doesn't exist

When functionality cannot be completed because an external service is unavailable, create a clean adapter and clearly document the integration point.

45. IMPLEMENTATION ORDER

Work in this order.

Phase 1 — Audit

Inspect the complete repository.

Identify:

entry point
routes
components
styles
Tailwind
assets
state
context
services
API
package.json
build configuration


Do not modify anything until understanding the architecture.

Phase 2 — Design system

Implement:

tokens
typography
colors
spacing
radii
shadows
buttons
forms
cards
layout
responsive rules
motion


Phase 3 — Application shell

Implement:

AppShell
Header
Navigation
routing
auth shell
workspace shell


Phase 4 — Hub

Implement the complete Explore/Hub page.

Phase 5 — AI tools

Implement:

Clip Maker
Ideas
Hooks
Script Writer
Outline
Rewrite
Title
Description
Chapters
Tags


Phase 6 — Video editor

Implement:

preview
timeline
trim
crop
aspect ratios
face tracking
subtitles
brand presets
export


Phase 7 — Monetisation

Implement:

earnings
brand deals


Phase 8 — Publishing

Implement:

schedule
history
analytics


Phase 9 — Services

Create:

video service
AI service
subtitle service
face tracking service
export service
brand service
schedule service
analytics service


Phase 10 — Testing

Run:

npm install
npm run build
npm run test


If scripts differ, inspect package.json and use the repository's actual scripts.

Fix:

build errors

type errors

route errors

console errors

accessibility issues

responsive issues

46. FINAL QA CHECKLIST

Before declaring completion, verify:

Product

onboarding works

login works

signup works

hub works

clip maker works

clip results work

editor works

face tracking interface works

subtitles interface works

aspect ratios work

export interface works

brand presets work

ideas works

hooks works

scripts work

optimization tools work

earnings works

deals works

scheduling works

history works

analytics works

UX

loading states

empty states

errors

retry

responsive

keyboard navigation

reduced motion

Engineering

no dead routes

no broken imports

no console errors

no exposed secrets

no duplicated architecture

reusable components

service abstractions

clean API contracts

successful production build

47. DEFINITION OF DONE

The task is complete only when CLIPIN feels like a coherent, production-grade creator platform rather than a collection of mock pages.

The user should be able to:

OPEN CLIPIN
↓
EXPLORE TOOLS
↓
PASTE A VIDEO
↓
GENERATE CLIPS
↓
REVIEW CLIPS
↓
EDIT A CLIP
↓
TRACK THE ACTIVE SPEAKER
↓
ADD ANIMATED SUBTITLES
↓
SELECT 9:16 / 1:1 / 16:9
↓
APPLY BRAND PRESET
↓
EXPORT 1080P
↓
SCHEDULE
↓
VIEW HISTORY
↓
VIEW ANALYTICS


The architecture must be ready for real AI/video-processing backends without requiring a rewrite of the frontend.

48. FINAL INSTRUCTION TO THE CODING AGENT

Do not simply tell me what you would build.

Inspect the repository, implement it, test it, fix it, and leave the repository in a working state.

When you encounter an architectural decision, prefer:

reusable
typed
testable
modular
accessible
responsive
production-ready


over:

quick
duplicated
hard-coded
demo-only


At completion, report:

1. Files created
2. Files modified
3. Routes implemented
4. Components created
5. Services created
6. Features implemented
7. Tests executed
8. Build result
9. Remaining external integrations
10. Recommended next production step


Do not claim external AI/video-processing functionality is live unless the required backend/provider is actually connected and tested.

This gives the coding agent the complete implementation contract, rather than just a UI prompt. It also keeps the important distinction we established: CLIPIN owns the product architecture, while the audited Popcornopolis system supplies the visual/interaction foundation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ef610f06-3624-40bc-99ca-fd9ac6b4b747).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
