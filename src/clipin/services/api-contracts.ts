/**
 * API CONTRACTS
 *
 * These are the HTTP endpoints CLIPIN's services will call once the video /
 * AI backend is deployed. Endpoints marked "live" are implemented today.
 * Everything else is served by a development adapter (see ./video.service.ts)
 * so no component ever hard-codes a fake response.
 */
export const apiContracts = {
  ingestVideo: { method: "POST", path: "/api/video/ingest", status: "adapter" },
  transcribe: { method: "POST", path: "/api/video/transcribe", status: "adapter" },
  extractClips: { method: "POST", path: "/api/ai/extract-clips", status: "adapter" },
  generateTitle: { method: "POST", path: "/api/ai/generate-title", status: "live" },
  generateDescription: { method: "POST", path: "/api/ai/generate-description", status: "live" },
  generateChapters: { method: "POST", path: "/api/ai/generate-chapters", status: "live" },
  generateTags: { method: "POST", path: "/api/ai/generate-tags", status: "live" },
  writeScript: { method: "POST", path: "/api/ai/write-script", status: "live" },
  scriptOutline: { method: "POST", path: "/api/ai/script-outline", status: "live" },
  rewriteScript: { method: "POST", path: "/api/ai/rewrite-script", status: "live" },
  generateHooks: { method: "POST", path: "/api/ai/generate-hooks", status: "live" },
  generateIdeas: { method: "POST", path: "/api/ai/generate-ideas", status: "live" },
  faceTrack: { method: "POST", path: "/api/video/face-track", status: "adapter" },
  subtitles: { method: "POST", path: "/api/video/subtitles", status: "adapter" },
  exportClip: { method: "POST", path: "/api/video/export", status: "adapter" },
  createBrandPreset: { method: "POST", path: "/api/brand-presets", status: "local" },
  listBrandPresets: { method: "GET", path: "/api/brand-presets", status: "local" },
  createSchedule: { method: "POST", path: "/api/schedule", status: "local" },
  listSchedule: { method: "GET", path: "/api/schedule", status: "local" },
  deleteSchedule: { method: "DELETE", path: "/api/schedule/:id", status: "local" },
  history: { method: "GET", path: "/api/history", status: "local" },
  analytics: { method: "GET", path: "/api/analytics", status: "local" },
} as const;

export type ApiContractStatus = "live" | "adapter" | "local";
