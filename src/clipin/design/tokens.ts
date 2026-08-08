import type { AspectRatioId, ExportQuality, SchedulePlatform, VideoPlatform } from "../types";

/** Centralized layout tokens (mirrors src/styles.css). */
export const layout = {
  contentMaxWidth: 1180,
  gutter: 30,
  sectionGap: 64,
  cardRadius: 25,
  pillRadius: 9999,
  mediaRadius: 120,
} as const;

export const aspectRatios: { id: AspectRatioId; label: string; w: number; h: number }[] = [
  { id: "9:16", label: "Vertical", w: 9, h: 16 },
  { id: "1:1", label: "Square", w: 1, h: 1 },
  { id: "16:9", label: "Horizontal", w: 16, h: 9 },
];

export const exportQualities: { id: ExportQuality; label: string; height: number }[] = [
  { id: "720p", label: "720p HD", height: 720 },
  { id: "1080p", label: "1080p Full HD", height: 1080 },
];

export const supportedPlatforms: { id: VideoPlatform; label: string }[] = [
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "instagram", label: "Instagram" },
  { id: "drive", label: "Google Drive" },
];

export const schedulePlatforms: { id: SchedulePlatform; label: string }[] = [
  { id: "tiktok", label: "TikTok" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
];

export const countries = ["Nigeria", "United States", "United Kingdom", "Global"] as const;

export const subtitleStyles = [
  { id: "bold-pop", label: "Bold Pop" },
  { id: "karaoke", label: "Karaoke" },
  { id: "clean-caption", label: "Clean Caption" },
  { id: "editorial", label: "Editorial" },
] as const;

export const loadingMessages = [
  "Analysing your video...",
  "Finding the strongest moments...",
  "Tracking speakers...",
  "Generating subtitles...",
  "Preparing your export...",
] as const;
