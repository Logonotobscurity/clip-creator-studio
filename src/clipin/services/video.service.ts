import type {
  Clip,
  ClipRequest,
  FacePoint,
  FaceTrack,
  Scene,
  Transcript,
  TranscriptSegment,
  VideoAsset,
  VideoSource,
} from "../types";
import { newId } from "../lib/storage";

/**
 * VideoService — the single interface the UI talks to.
 *
 * INTEGRATION POINT: `devVideoService` below is a deterministic development
 * adapter. It performs no real decoding, transcription or ML inference. Swap it
 * for an HTTP adapter (FFmpeg / Remotion / GPU worker backend) by implementing
 * this interface; no component changes are required.
 */
export interface VideoService {
  readonly kind: "development" | "remote";
  ingest(source: VideoSource): Promise<VideoAsset>;
  transcribe(videoId: string): Promise<Transcript>;
  detectScenes(videoId: string): Promise<Scene[]>;
  detectFaces(videoId: string): Promise<FaceTrack[]>;
  extractClips(videoId: string): Promise<Clip[]>;
  generateClip(input: ClipRequest): Promise<Clip>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Stable pseudo-random generator so the dev adapter is deterministic per video. */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TITLE_SHAPES = [
  "The part everyone replays",
  "This changed the whole argument",
  "The 12-second truth bomb",
  "Where the story turns",
  "The line worth quoting",
  "The objection, answered",
  "The number nobody expects",
  "The clean, quotable close",
];

const TRANSCRIPT_LINES = [
  "So the thing nobody tells you is that consistency beats intensity every single time.",
  "I tried it for ninety days and the results were not what I expected at all.",
  "Here's the part that actually matters if you're starting from zero today.",
  "We ran the numbers three times because the first result looked wrong.",
  "That single decision is what separated the top ten percent from everyone else.",
  "If you only remember one thing from this, remember this next sentence.",
  "The mistake is obvious in hindsight, which is exactly why it keeps happening.",
  "Try it this week and tell me it doesn't change how you work.",
];

const platformLabel: Record<VideoSource["platform"], string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  drive: "Google Drive",
};

export const devVideoService: VideoService = {
  kind: "development",

  async ingest(source) {
    await delay(650);
    const rand = seeded(source.url);
    const duration = 600 + Math.floor(rand() * 1800);
    return {
      id: newId("vid"),
      url: source.url,
      platform: source.platform,
      title: `${platformLabel[source.platform]} source · ${new URL(source.url).pathname.replace(/^\//, "").slice(0, 40) || "video"}`,
      author: source.inspiration?.trim() || "Unknown creator",
      durationSeconds: duration,
      createdAt: new Date().toISOString(),
    };
  },

  async transcribe(videoId) {
    await delay(700);
    const rand = seeded(videoId);
    const segments: TranscriptSegment[] = [];
    let cursor = 0;
    for (let i = 0; i < 24; i += 1) {
      const length = 6 + Math.floor(rand() * 8);
      segments.push({
        startTime: cursor,
        endTime: cursor + length,
        text: TRANSCRIPT_LINES[i % TRANSCRIPT_LINES.length]!,
        speaker: i % 3 === 0 ? "Speaker 2" : "Speaker 1",
      });
      cursor += length;
    }
    return { videoId, language: "en", segments };
  },

  async detectScenes(videoId) {
    await delay(400);
    const rand = seeded(`scenes:${videoId}`);
    const scenes: Scene[] = [];
    let cursor = 0;
    for (let i = 0; i < 12; i += 1) {
      const length = 20 + Math.floor(rand() * 40);
      scenes.push({ startTime: cursor, endTime: cursor + length, energy: rand() });
      cursor += length;
    }
    return scenes;
  },

  async detectFaces(videoId) {
    await delay(500);
    const rand = seeded(`faces:${videoId}`);
    const makeTrack = (speaker: string, base: number): FaceTrack => {
      const points: FacePoint[] = [];
      for (let t = 0; t < 60; t += 1) {
        points.push({
          time: t,
          x: Math.min(0.9, Math.max(0.1, base + Math.sin(t / 7) * 0.08 + (rand() - 0.5) * 0.04)),
          y: Math.min(0.8, Math.max(0.2, 0.42 + Math.cos(t / 9) * 0.05)),
          confidence: 0.7 + rand() * 0.3,
        });
      }
      return { id: newId("face"), speaker, points };
    };
    return [makeTrack("Speaker 1", 0.38), makeTrack("Speaker 2", 0.66)];
  },

  async extractClips(videoId) {
    await delay(900);
    const rand = seeded(`clips:${videoId}`);
    const count = 5 + Math.floor(rand() * 3);
    const clips: Clip[] = [];
    let cursor = 30 + Math.floor(rand() * 60);
    for (let i = 0; i < count; i += 1) {
      const length = 18 + Math.floor(rand() * 42);
      clips.push({
        id: newId("clip"),
        videoId,
        index: i + 1,
        title: TITLE_SHAPES[i % TITLE_SHAPES.length]!,
        transcriptPreview: TRANSCRIPT_LINES[i % TRANSCRIPT_LINES.length]!,
        startTime: cursor,
        endTime: cursor + length,
        viralityScore: Math.round(58 + rand() * 40),
        reason: "High emotional delta, clean sentence boundaries and a self-contained payoff.",
        hashtags: ["#shorts", "#creator", "#clipin"],
      });
      cursor += length + 40 + Math.floor(rand() * 90);
    }
    return clips.sort((a, b) => b.viralityScore - a.viralityScore).map((clip, i) => ({
      ...clip,
      index: i + 1,
    }));
  },

  async generateClip(input) {
    await delay(400);
    return {
      id: newId("clip"),
      videoId: input.videoId,
      index: 0,
      title: input.title?.trim() || "Manual selection",
      transcriptPreview: "Manually trimmed range.",
      startTime: input.startTime,
      endTime: input.endTime,
      viralityScore: 0,
      reason: "Manually selected by the creator.",
      hashtags: [],
    };
  },
};
