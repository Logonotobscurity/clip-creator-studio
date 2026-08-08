import { Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Clip } from "../types";
import { formatTimecode } from "../lib/validation";
import { Pill } from "./primitives";

export function ClipCard({
  clip,
  selected,
  onSelect,
}: {
  clip: Clip;
  selected?: boolean;
  onSelect: () => void;
}) {
  const duration = Math.round(clip.endTime - clip.startTime);
  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-2xl border bg-card p-5 transition-colors",
        selected ? "border-primary" : "border-border",
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Clip {clip.index}
          </p>
          <h3 className="mt-1 font-display text-lg leading-snug">{clip.title}</h3>
        </div>
        <Pill tone={clip.viralityScore >= 80 ? "accent" : "neutral"} className="shrink-0">
          <Flame className="size-3" aria-hidden="true" />
          {clip.viralityScore}
        </Pill>
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {clip.transcriptPreview}
      </p>

      <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="size-3" aria-hidden="true" />
          <dt className="sr-only">Duration</dt>
          <dd>{duration}s</dd>
        </div>
        <div>
          <dt className="sr-only">Range</dt>
          <dd>
            {formatTimecode(clip.startTime)} – {formatTimecode(clip.endTime)}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Why it works: </span>
        {clip.reason}
      </p>

      {clip.hashtags.length ? (
        <div className="flex flex-wrap gap-1.5">
          {clip.hashtags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs font-semibold text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <Button
        variant={selected ? "default" : "outline"}
        onClick={onSelect}
        aria-pressed={selected}
        className="mt-auto"
      >
        {selected ? "Editing this clip" : "Edit clip"}
      </Button>
    </article>
  );
}
