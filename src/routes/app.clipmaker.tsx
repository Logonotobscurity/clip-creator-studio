import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { VideoInput } from "@/clipin/components/VideoInput";
import { ClipCard } from "@/clipin/components/ClipCard";
import { ClipEditor } from "@/clipin/components/ClipEditor";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  SectionHeader,
} from "@/clipin/components/primitives";
import { videoService } from "@/clipin/services";
import { useWorkspace } from "@/clipin/state/workspace";
import type { VideoSource } from "@/clipin/types";

export const Route = createFileRoute("/app/clipmaker")({
  head: () => ({
    meta: [
      { title: "Short clip maker — CLIPIN" },
      { name: "description", content: "Paste a long video link and pull out the moments worth posting, cropped and captioned." },
      { property: "og:title", content: "Short clip maker — CLIPIN" },
      { property: "og:description", content: "Paste a long video link and pull out the moments worth posting, cropped and captioned." },
    ],
  }),
  component: ClipMaker,
});

function ClipMaker() {
  const { video, transcript, clips, selectedClipId, selectClip, setSession } = useWorkspace();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const run = async (source: VideoSource) => {
    setStatus("loading");
    setError(null);
    try {
      const asset = await videoService.ingest(source);
      const [nextTranscript, nextClips] = await Promise.all([
        videoService.transcribe(asset.id),
        videoService.extractClips(asset.id),
      ]);
      setSession({ video: asset, transcript: nextTranscript, clips: nextClips });
      setStatus("idle");
      toast.success(`${nextClips.length} clips ready`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not process that video.");
      setStatus("error");
    }
  };

  const selected = clips.find((clip) => clip.id === selectedClipId) ?? clips[0] ?? null;

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Repurpose"
        title="Turn one long video into a week of shorts"
        description="Drop a link. We transcribe it, find the strongest moments, and hand you a vertical edit with tracked framing and subtitles."
      />

      <VideoInput busy={status === "loading"} onSubmit={(source) => void run(source)} />

      <section aria-live="polite" aria-busy={status === "loading"} className="grid gap-6">
        {status === "loading" ? (
          <LoadingState
            message="Reading the video"
            detail="Transcribing, detecting scenes and scoring moments."
          />
        ) : status === "error" ? (
          <ErrorState message={error ?? "Something went wrong."} />
        ) : clips.length ? (
          <>
            <SectionHeader
              label={video ? video.title : "Your clips"}
              blurb={`${clips.length} moments ranked by how well they should travel.`}
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {clips.map((clip) => (
                <ClipCard
                  key={clip.id}
                  clip={clip}
                  selected={selected?.id === clip.id}
                  onSelect={() => selectClip(clip.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="No clips yet"
            description="Paste a YouTube, TikTok, Instagram or Drive link above to get started."
          />
        )}
      </section>

      {selected ? (
        <section className="grid gap-6">
          <SectionHeader label="Editor" blurb={selected.title} />
          <ClipEditor clip={selected} transcript={transcript} />
        </section>
      ) : null}
    </div>
  );
}
