/**
 * CLIPIN domain model. Shared by services, state, and UI.
 * No component should redefine these shapes locally.
 */

export type VideoPlatform = "youtube" | "tiktok" | "instagram" | "drive";

export interface VideoSource {
  url: string;
  platform: VideoPlatform;
  inspiration?: string;
  country?: string;
  context?: string;
}

export interface VideoAsset {
  id: string;
  url: string;
  platform: VideoPlatform;
  title: string;
  author: string;
  durationSeconds: number;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface TranscriptSegment {
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
}

export interface Transcript {
  videoId: string;
  language: string;
  segments: TranscriptSegment[];
}

export interface Scene {
  startTime: number;
  endTime: number;
  energy: number;
}

export interface FacePoint {
  time: number;
  /** Normalised 0..1 center of the active speaker's face. */
  x: number;
  y: number;
  confidence: number;
}

export interface FaceTrack {
  id: string;
  speaker: string;
  points: FacePoint[];
}

export type AspectRatioId = "9:16" | "1:1" | "16:9";

export interface Subtitle {
  text: string;
  startTime: number;
  endTime: number;
  speaker?: string;
  style?: string;
}

export interface Overlay {
  id: string;
  type: "logo" | "text" | "shape";
  label: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  opacity: number;
}

export interface BrandPreset {
  id: string;
  name: string;
  logo?: string;
  overlays?: Overlay[];
  colors?: string[];
  subtitleStyle?: string;
}

export interface Clip {
  id: string;
  videoId: string;
  index: number;
  title: string;
  transcriptPreview: string;
  startTime: number;
  endTime: number;
  viralityScore: number;
  reason: string;
  hashtags: string[];
}

export interface ClipRequest {
  videoId: string;
  startTime: number;
  endTime: number;
  title?: string;
}

export interface EditorState {
  clipId: string;
  sourceMode: "whole" | "manual";
  startTime: number;
  endTime: number;
  aspectRatio: AspectRatioId;
  zoom: number;
  offsetX: number;
  offsetY: number;
  faceTracking: boolean;
  subtitlesEnabled: boolean;
  subtitleStyle: string;
  subtitlePosition: "top" | "center" | "bottom";
  subtitleSize: number;
  brandPresetId?: string;
  quality: ExportQuality;
}

export type ExportQuality = "720p" | "1080p";

export interface ExportRequest {
  clipId: string;
  editor: EditorState;
  format: "mp4";
}

export type ExportStatus = "Queued" | "Processing" | "Completed" | "Failed" | "Cancelled";

export interface ExportJob {
  id: string;
  clipId: string;
  quality: ExportQuality;
  format: "mp4";
  status: ExportStatus;
  progress: number;
  createdAt: string;
  message?: string;
}

export type SchedulePlatform = "tiktok" | "instagram" | "youtube";

export interface ScheduleEntry {
  id: string;
  clipId: string;
  clipTitle: string;
  platform: SchedulePlatform;
  caption: string;
  hashtags: string;
  scheduledFor: string;
  status: "pending" | "published" | "failed";
}

export type HistoryAction =
  | "Generated"
  | "Edited"
  | "Exported"
  | "Scheduled"
  | "Published"
  | "Failed";

export interface HistoryEntry {
  id: string;
  project: string;
  video: string;
  action: HistoryAction;
  date: string;
  status: "ok" | "warn" | "error";
}

export interface AnalyticsSnapshot {
  clipsCreated: number;
  exports: number;
  scheduled: number;
  averageClipLength: number;
  /** Reserved for future platform analytics adapters. */
  views?: number;
  watchTime?: number;
  engagement?: number;
}

export type AsyncStatus = "idle" | "loading" | "success" | "empty" | "error";
