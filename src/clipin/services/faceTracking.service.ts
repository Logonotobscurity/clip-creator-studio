import type { AspectRatioId, FaceTrack } from "../types";

/**
 * Face tracking + crop targeting.
 *
 * Architecture: video -> face detection -> face coordinates -> speaker
 * identification -> active speaker selection -> crop target -> smoothed camera
 * movement -> rendered vertical video.
 *
 * The crop path is smoothed (exponential + clamped velocity) so the virtual
 * camera never jumps frame to frame.
 */

export interface CropKeyframe {
  time: number;
  /** Normalised 0..1 center of the crop window. */
  x: number;
  y: number;
}

export interface FaceTrackingService {
  selectActiveSpeaker(tracks: FaceTrack[], time: number): FaceTrack | null;
  buildCropPath(tracks: FaceTrack[], options?: { smoothing?: number; maxStep?: number }): CropKeyframe[];
  cropWindow(
    ratio: AspectRatioId,
    keyframe: CropKeyframe,
    zoom: number,
  ): { left: number; top: number; width: number; height: number };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const faceTrackingService: FaceTrackingService = {
  selectActiveSpeaker(tracks, time) {
    if (!tracks.length) return null;
    let best: { track: FaceTrack; score: number } | null = null;
    for (const track of tracks) {
      const point =
        track.points.find((p) => Math.abs(p.time - time) < 1) ??
        track.points[Math.min(track.points.length - 1, Math.round(time))];
      const score = point?.confidence ?? 0;
      if (!best || score > best.score) best = { track, score };
    }
    return best?.track ?? null;
  },

  buildCropPath(tracks, options) {
    const smoothing = options?.smoothing ?? 0.18;
    const maxStep = options?.maxStep ?? 0.02;
    const primary = tracks[0];
    if (!primary) return [];

    const path: CropKeyframe[] = [];
    let x = primary.points[0]?.x ?? 0.5;
    let y = primary.points[0]?.y ?? 0.5;

    for (const point of primary.points) {
      const active = this.selectActiveSpeaker(tracks, point.time) ?? primary;
      const target =
        active.points.find((p) => p.time === point.time) ?? { x: point.x, y: point.y };
      const nextX = x + (target.x - x) * smoothing;
      const nextY = y + (target.y - y) * smoothing;
      x += Math.max(-maxStep, Math.min(maxStep, nextX - x));
      y += Math.max(-maxStep, Math.min(maxStep, nextY - y));
      path.push({ time: point.time, x: clamp01(x), y: clamp01(y) });
    }
    return path;
  },

  cropWindow(ratio, keyframe, zoom) {
    const scale = 1 / Math.max(1, zoom);
    const [rw, rh] = ratio.split(":").map(Number) as [number, number];
    const targetRatio = rw / rh;
    const width = targetRatio <= 1 ? scale * targetRatio : scale;
    const height = targetRatio <= 1 ? scale : scale / targetRatio;
    return {
      left: clamp01(keyframe.x - width / 2),
      top: clamp01(keyframe.y - height / 2),
      width: Math.min(1, width),
      height: Math.min(1, height),
    };
  },
};
