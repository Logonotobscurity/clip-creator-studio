import { z } from "zod";
import type { AspectRatioId, VideoPlatform } from "../types";

/* ------------------------------- video urls ------------------------------- */

const platformMatchers: { platform: VideoPlatform; hosts: string[] }[] = [
  { platform: "youtube", hosts: ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"] },
  { platform: "tiktok", hosts: ["tiktok.com", "www.tiktok.com", "vm.tiktok.com"] },
  { platform: "instagram", hosts: ["instagram.com", "www.instagram.com"] },
  { platform: "drive", hosts: ["drive.google.com"] },
];

export type VideoUrlResult =
  | { ok: true; platform: VideoPlatform; url: string }
  | { ok: false; error: string };

/** Validates a user-controlled video URL. Never trust the raw string. */
export function parseVideoUrl(raw: string): VideoUrlResult {
  const value = raw.trim();
  if (!value) return { ok: false, error: "Paste a video link to continue." };
  if (value.length > 2048) return { ok: false, error: "That link is too long to be valid." };

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, error: "That doesn't look like a valid link. Include https://" };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, error: "Only http and https links are supported." };
  }

  const host = parsed.hostname.toLowerCase();
  const match = platformMatchers.find((m) => m.hosts.includes(host));
  if (!match) {
    return {
      ok: false,
      error: "Unsupported platform. Use YouTube, TikTok, Instagram or Google Drive.",
    };
  }

  return { ok: true, platform: match.platform, url: parsed.toString() };
}

export const videoSourceSchema = z.object({
  url: z.string().trim().min(1).max(2048),
  inspiration: z.string().trim().max(120).optional(),
  country: z.string().trim().max(60).optional(),
  context: z.string().trim().max(1000).optional(),
});

/* --------------------------------- timing --------------------------------- */

/** Formats seconds as HH:MM:SS. */
export function formatTimecode(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return [hh, mm, ss].map((n) => String(n).padStart(2, "0")).join(":");
}

/** Parses HH:MM:SS or MM:SS into seconds. Returns null when invalid. */
export function parseTimecode(value: string): number | null {
  const parts = value.trim().split(":");
  if (parts.length < 2 || parts.length > 3) return null;
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isFinite(n) || n < 0)) return null;
  const [h, m, s] = parts.length === 3 ? nums : [0, ...nums];
  if ((m ?? 0) > 59 || (s ?? 0) > 59) return null;
  return (h ?? 0) * 3600 + (m ?? 0) * 60 + (s ?? 0);
}

export const MIN_CLIP_SECONDS = 5;
export const MAX_CLIP_SECONDS = 180;

export type ClipRangeResult = { ok: true; duration: number } | { ok: false; error: string };

export function validateClipRange(
  startTime: number,
  endTime: number,
  videoDuration?: number,
): ClipRangeResult {
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
    return { ok: false, error: "Enter times as HH:MM:SS." };
  }
  if (startTime < 0) return { ok: false, error: "Start time can't be negative." };
  const duration = endTime - startTime;
  if (duration <= 0) return { ok: false, error: "End time must be after start time." };
  if (duration < MIN_CLIP_SECONDS) {
    return { ok: false, error: `Clips must be at least ${MIN_CLIP_SECONDS} seconds.` };
  }
  if (duration > MAX_CLIP_SECONDS) {
    return { ok: false, error: `Clips must be shorter than ${MAX_CLIP_SECONDS} seconds.` };
  }
  if (videoDuration != null && endTime > videoDuration) {
    return { ok: false, error: "End time is past the end of the video." };
  }
  return { ok: true, duration };
}

/* ------------------------------ aspect ratios ------------------------------ */

/** Returns pixel dimensions for a ratio, fitted inside a bounding box. */
export function aspectDimensions(
  ratio: AspectRatioId,
  box: { width: number; height: number },
): { width: number; height: number } {
  const [w, h] = ratio.split(":").map(Number) as [number, number];
  const scale = Math.min(box.width / w, box.height / h);
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

export function aspectRatioValue(ratio: AspectRatioId): number {
  const [w, h] = ratio.split(":").map(Number) as [number, number];
  return w / h;
}

/* ------------------------------- scheduling ------------------------------- */

export type ScheduleValidation = { ok: true; iso: string } | { ok: false; error: string };

export function validateSchedule(input: {
  clipId: string;
  date: string;
  time: string;
  caption: string;
  now?: Date;
}): ScheduleValidation {
  if (!input.clipId) return { ok: false, error: "Select a clip to schedule." };
  if (!input.date || !input.time) return { ok: false, error: "Pick both a date and a time." };
  if (input.caption.trim().length > 2200) {
    return { ok: false, error: "Captions must be under 2200 characters." };
  }
  const stamp = new Date(`${input.date}T${input.time}`);
  if (Number.isNaN(stamp.getTime())) return { ok: false, error: "That date and time is invalid." };
  const now = input.now ?? new Date();
  if (stamp.getTime() <= now.getTime()) {
    return { ok: false, error: "Choose a time in the future." };
  }
  return { ok: true, iso: stamp.toISOString() };
}

/* ------------------------------- monetisation ------------------------------ */

export const CPM_BY_PLATFORM: Record<string, number> = {
  youtube: 4.2,
  tiktok: 0.6,
  instagram: 1.4,
};

export const NICHE_MULTIPLIER: Record<string, number> = {
  finance: 2.4,
  technology: 1.8,
  business: 1.9,
  education: 1.3,
  fitness: 1.1,
  entertainment: 0.9,
  lifestyle: 1.0,
  gaming: 0.8,
};

export interface EarningsInput {
  platform: string;
  viewsPerMonth: number;
  clipsPerMonth: number;
  followers: number;
  niche: string;
}

export interface EarningsResult {
  adRevenueLow: number;
  adRevenueHigh: number;
  brandRevenueLow: number;
  brandRevenueHigh: number;
  totalLow: number;
  totalHigh: number;
  emv: number;
}

const round = (n: number) => Math.round(Math.max(0, n));

/** Estimated monthly creator earnings range. Projection only, never a promise. */
export function calculateEarnings(input: EarningsInput): EarningsResult {
  const views = Math.max(0, input.viewsPerMonth || 0);
  const clips = Math.max(0, input.clipsPerMonth || 0);
  const followers = Math.max(0, input.followers || 0);
  const cpm = CPM_BY_PLATFORM[input.platform] ?? 1;
  const niche = NICHE_MULTIPLIER[input.niche] ?? 1;

  const ad = (views / 1000) * cpm * niche;
  const brand = followers * 0.012 * niche * Math.min(1.5, 0.5 + clips / 40);
  const emv = (views / 1000) * 5;

  return {
    adRevenueLow: round(ad * 0.7),
    adRevenueHigh: round(ad * 1.35),
    brandRevenueLow: round(brand * 0.6),
    brandRevenueHigh: round(brand * 1.4),
    totalLow: round(ad * 0.7 + brand * 0.6),
    totalHigh: round(ad * 1.35 + brand * 1.4),
    emv: round(emv),
  };
}

export interface BrandDealInput {
  followers: number;
  averageViews: number;
  engagementRate: number;
  niche: string;
  platform: string;
  deliverables: number;
}

export interface BrandDealResult {
  low: number;
  high: number;
  cpm: number;
  emv: number;
}

export function calculateBrandDeal(input: BrandDealInput): BrandDealResult {
  const views = Math.max(0, input.averageViews || 0);
  const followers = Math.max(0, input.followers || 0);
  const engagement = Math.min(30, Math.max(0, input.engagementRate || 0));
  const niche = NICHE_MULTIPLIER[input.niche] ?? 1;
  const deliverables = Math.max(1, input.deliverables || 1);
  const baseCpm = (CPM_BY_PLATFORM[input.platform] ?? 1) * 4 * niche;
  const cpm = baseCpm * (1 + engagement / 20);

  const perDeliverable = (views / 1000) * cpm + followers * 0.004 * niche;
  const total = perDeliverable * deliverables;

  return {
    low: round(total * 0.75),
    high: round(total * 1.6),
    cpm: Math.round(cpm * 100) / 100,
    emv: round((views / 1000) * 5 * deliverables),
  };
}

export const EARNINGS_DISCLAIMER =
  "These are estimated projections based on 2026 average platform rates. Actual earnings depend on niche, audience quality, engagement rate, geographic reach, and brand deal availability. EMV calculated at industry-standard $5 CPM.";

export const currency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    .format(value);
