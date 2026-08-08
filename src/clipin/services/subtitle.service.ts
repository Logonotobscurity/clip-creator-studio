import type { Subtitle, Transcript } from "../types";

/**
 * Subtitle generation + rendering abstraction.
 *
 * The renderer is intentionally decoupled: `SubtitleRenderer` can later be
 * implemented by FFmpeg (burn-in), Remotion, or a server-side compositor.
 * The UI only depends on the interfaces below.
 */

export interface SubtitleService {
  generate(transcript: Transcript, range: { startTime: number; endTime: number }): Promise<Subtitle[]>;
  restyle(subtitles: Subtitle[], style: string): Subtitle[];
}

export interface SubtitleRenderer {
  readonly id: string;
  describe(): string;
}

/** Preview-only renderer used by the in-app editor. */
export const domSubtitleRenderer: SubtitleRenderer = {
  id: "dom-preview",
  describe: () => "In-browser preview renderer (no encoding).",
};

/** INTEGRATION POINT: replace with an FFmpeg/Remotion renderer server-side. */
export const pendingBurnInRenderer: SubtitleRenderer = {
  id: "burn-in",
  describe: () => "Server-side burn-in renderer — not connected yet.",
};

const MAX_CHARS = 42;

function chunk(text: string): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > MAX_CHARS) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

export const subtitleService: SubtitleService = {
  async generate(transcript, range) {
    const inRange = transcript.segments.filter(
      (segment) => segment.endTime > range.startTime && segment.startTime < range.endTime,
    );
    const source = inRange.length ? inRange : transcript.segments.slice(0, 6);

    const subtitles: Subtitle[] = [];
    for (const segment of source) {
      const lines = chunk(segment.text);
      const span = Math.max(0.8, (segment.endTime - segment.startTime) / lines.length);
      lines.forEach((line, index) => {
        subtitles.push({
          text: line,
          startTime: segment.startTime + index * span,
          endTime: segment.startTime + (index + 1) * span,
          ...(segment.speaker ? { speaker: segment.speaker } : {}),
          style: "bold-pop",
        });
      });
    }
    return subtitles;
  },

  restyle(subtitles, style) {
    return subtitles.map((subtitle) => ({ ...subtitle, style }));
  },
};
