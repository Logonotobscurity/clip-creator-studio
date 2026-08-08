import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Loader2, Play, Type as TypeIcon, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { aspectRatios, exportQualities, subtitleStyles } from "../design/tokens";
import {
  formatTimecode,
  parseTimecode,
  validateClipRange,
} from "../lib/validation";
import type {
  AspectRatioId,
  Clip,
  ExportJob,
  ExportQuality,
  FaceTrack,
  Subtitle,
  Transcript,
} from "../types";
import {
  exportService,
  faceTrackingService,
  historyService,
  subtitleService,
  videoService,
} from "../services";
import { useWorkspace } from "../state/workspace";
import { Panel, Pill } from "./primitives";

function useCropPath(videoId: string | undefined) {
  const [tracks, setTracks] = useState<FaceTrack[]>([]);
  useEffect(() => {
    if (!videoId) return;
    let live = true;
    void videoService.detectFaces(videoId).then((result) => {
      if (live) setTracks(result);
    });
    return () => {
      live = false;
    };
  }, [videoId]);
  return useMemo(() => faceTrackingService.buildCropPath(tracks), [tracks]);
}

export function ClipEditor({
  clip,
  transcript,
}: {
  clip: Clip;
  transcript: Transcript | null;
}) {
  const { editorFor, updateEditor } = useWorkspace();
  const editor = editorFor(clip);
  const cropPath = useCropPath(clip.videoId);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [job, setJob] = useState<ExportJob | null>(null);
  const [playhead, setPlayhead] = useState(clip.startTime);
  const [playing, setPlaying] = useState(false);
  const [startText, setStartText] = useState(formatTimecode(editor.startTime));
  const [endText, setEndText] = useState(formatTimecode(editor.endTime));
  const [rangeError, setRangeError] = useState<string | null>(null);
  const unsubscribe = useRef<(() => void) | null>(null);

  useEffect(() => {
    setStartText(formatTimecode(editor.startTime));
    setEndText(formatTimecode(editor.endTime));
    setPlayhead(editor.startTime);
  }, [clip.id, editor.startTime, editor.endTime]);

  useEffect(() => {
    if (!transcript) return;
    let live = true;
    void subtitleService
      .generate(transcript, { startTime: editor.startTime, endTime: editor.endTime })
      .then((result) => {
        if (live) setSubtitles(subtitleService.restyle(result, editor.subtitleStyle));
      });
    return () => {
      live = false;
    };
  }, [transcript, editor.startTime, editor.endTime, editor.subtitleStyle]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setPlayhead((prev) => (prev + 0.25 >= editor.endTime ? editor.startTime : prev + 0.25));
    }, 250);
    return () => window.clearInterval(id);
  }, [playing, editor.startTime, editor.endTime]);

  useEffect(() => () => unsubscribe.current?.(), []);

  const keyframe = useMemo(() => {
    if (!editor.faceTracking || !cropPath.length) return { time: playhead, x: 0.5, y: 0.5 };
    return (
      cropPath.reduce((closest, frame) =>
        Math.abs(frame.time - playhead) < Math.abs(closest.time - playhead) ? frame : closest,
      ) ?? { time: playhead, x: 0.5, y: 0.5 }
    );
  }, [cropPath, editor.faceTracking, playhead]);

  const window_ = faceTrackingService.cropWindow(editor.aspectRatio, keyframe, editor.zoom);
  const activeSubtitle = subtitles.find(
    (item) => playhead >= item.startTime && playhead < item.endTime,
  );
  const ratio = aspectRatios.find((item) => item.id === editor.aspectRatio) ?? aspectRatios[0]!;

  const commitRange = () => {
    const start = parseTimecode(startText);
    const end = parseTimecode(endText);
    if (start === null || end === null) {
      setRangeError("Use mm:ss or seconds.");
      return;
    }
    const check = validateClipRange(start, end, clip.endTime + 600);
    if (!check.ok) {
      setRangeError(check.error);
      return;
    }
    setRangeError(null);
    updateEditor(clip.id, { startTime: start, endTime: end, sourceMode: "manual" });
  };

  const startExport = async () => {
    const created = await exportService.start({ clipId: clip.id, editor, format: "mp4" });
    setJob(created);
    unsubscribe.current?.();
    unsubscribe.current = exportService.subscribe(created.id, (update) => {
      setJob(update);
      if (update.status === "Completed") {
        toast.success("Export finished");
        void historyService.record({
          project: "Clip maker",
          video: clip.title,
          action: "Exported",
        });
      }
      if (update.status === "Failed") toast.error(update.message ?? "Export failed");
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      {/* Preview */}
      <div className="grid gap-4">
        <div
          className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl bg-primary"
          style={{ aspectRatio: `${ratio.w} / ${ratio.h}` }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 35%, color-mix(in oklab, var(--accent) 65%, transparent), transparent 60%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute rounded-xl border-2 border-accent/80 transition-[left,top,width,height] duration-200"
            style={{
              left: `${window_.left * 100}%`,
              top: `${window_.top * 100}%`,
              width: `${window_.width * 100}%`,
              height: `${window_.height * 100}%`,
            }}
            aria-hidden="true"
          />
          <p className="absolute left-4 top-4 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground">
            {editor.aspectRatio} preview
          </p>
          {editor.subtitlesEnabled && activeSubtitle ? (
            <p
              className={cn(
                "absolute inset-x-4 text-center font-display leading-tight text-primary-foreground",
                editor.subtitlePosition === "top"
                  ? "top-12"
                  : editor.subtitlePosition === "center"
                    ? "top-1/2 -translate-y-1/2"
                    : "bottom-8",
              )}
              style={{ fontSize: `${editor.subtitleSize / 2}px` }}
            >
              {activeSubtitle.text}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" onClick={() => setPlaying((prev) => !prev)}>
            <Play aria-hidden="true" />
            {playing ? "Pause preview" : "Play preview"}
          </Button>
          <span className="text-sm tabular-nums text-muted-foreground">
            {formatTimecode(playhead)}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Preview shows the tracked crop window and subtitle placement. Encoding runs in the export
          pipeline.
        </p>
      </div>

      {/* Controls */}
      <div className="grid gap-6">
        <Panel className="grid gap-5 p-6">
          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase tracking-[0.2em]">Aspect ratio</Label>
            <div className="flex flex-wrap gap-2">
              {aspectRatios.map((item) => (
                <Button
                  key={item.id}
                  variant={editor.aspectRatio === item.id ? "default" : "outline"}
                  size="sm"
                  aria-pressed={editor.aspectRatio === item.id}
                  onClick={() => updateEditor(clip.id, { aspectRatio: item.id as AspectRatioId })}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="zoom" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
              <ZoomIn className="size-3.5" aria-hidden="true" />
              Zoom {editor.zoom.toFixed(2)}x
            </Label>
            <Slider
              id="zoom"
              min={1}
              max={2}
              step={0.05}
              value={[editor.zoom]}
              onValueChange={([value]) => updateEditor(clip.id, { zoom: value ?? 1 })}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Label htmlFor="tracking" className="text-sm font-semibold">
                Active speaker tracking
              </Label>
              <p className="text-xs text-muted-foreground">Smoothed crop that follows the speaker.</p>
            </div>
            <Switch
              id="tracking"
              checked={editor.faceTracking}
              onCheckedChange={(checked) => updateEditor(clip.id, { faceTracking: checked })}
            />
          </div>
        </Panel>

        <Panel className="grid gap-5 p-6">
          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase tracking-[0.2em]">Trim</Label>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
              <Input
                aria-label="Clip start"
                value={startText}
                onChange={(event) => setStartText(event.target.value)}
              />
              <Input
                aria-label="Clip end"
                value={endText}
                onChange={(event) => setEndText(event.target.value)}
              />
              <Button variant="outline" onClick={commitRange} className="shrink-0">
                Apply
              </Button>
            </div>
            {rangeError ? (
              <p role="alert" className="text-sm text-destructive">
                {rangeError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {Math.round(editor.endTime - editor.startTime)}s selected. 5s to 180s allowed.
              </p>
            )}
          </div>
        </Panel>

        <Panel className="grid gap-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Label htmlFor="subs" className="flex items-center gap-2 text-sm font-semibold">
                <TypeIcon className="size-4" aria-hidden="true" />
                Subtitles
              </Label>
              <p className="text-xs text-muted-foreground">
                {subtitles.length} lines generated from the transcript.
              </p>
            </div>
            <Switch
              id="subs"
              checked={editor.subtitlesEnabled}
              onCheckedChange={(checked) => updateEditor(clip.id, { subtitlesEnabled: checked })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="style">Style</Label>
              <Select
                value={editor.subtitleStyle}
                onValueChange={(value) => updateEditor(clip.id, { subtitleStyle: value })}
              >
                <SelectTrigger id="style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subtitleStyles.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={editor.subtitlePosition}
                onValueChange={(value) =>
                  updateEditor(clip.id, {
                    subtitlePosition: value as typeof editor.subtitlePosition,
                  })
                }
              >
                <SelectTrigger id="position">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="size">Size {editor.subtitleSize}px</Label>
              <Slider
                id="size"
                min={20}
                max={56}
                step={2}
                value={[editor.subtitleSize]}
                onValueChange={([value]) => updateEditor(clip.id, { subtitleSize: value ?? 32 })}
              />
            </div>
          </div>
        </Panel>

        <Panel className="grid gap-4 p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="grid min-w-0 gap-2">
              <Label htmlFor="quality" className="text-xs font-bold uppercase tracking-[0.2em]">
                Export quality
              </Label>
              <Select
                value={editor.quality}
                onValueChange={(value) => updateEditor(clip.id, { quality: value as ExportQuality })}
              >
                <SelectTrigger id="quality" className="max-w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportQualities.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="accent"
              size="lg"
              className="shrink-0"
              disabled={job?.status === "Processing" || job?.status === "Queued"}
              onClick={() => void startExport()}
            >
              {job && (job.status === "Queued" || job.status === "Processing") ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Download aria-hidden="true" />
              )}
              Export MP4
            </Button>
          </div>

          {job ? (
            <div className="grid gap-2" aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <Pill
                  tone={
                    job.status === "Completed"
                      ? "success"
                      : job.status === "Failed"
                        ? "danger"
                        : "info"
                  }
                >
                  {job.status}
                </Pill>
                <span className="text-sm tabular-nums text-muted-foreground">{job.progress}%</span>
              </div>
              <Progress value={job.progress} />
              {job.message ? (
                <p className="text-xs text-muted-foreground">{job.message}</p>
              ) : null}
            </div>
          ) : null}
        </Panel>
      </div>
    </div>
  );
}
