import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  Pill,
  SectionHeader,
} from "@/clipin/components/primitives";
import { scheduleService, historyService } from "@/clipin/services";
import { schedulePlatforms } from "@/clipin/design/tokens";
import type { ScheduleEntry, SchedulePlatform } from "@/clipin/types";
import { useWorkspace } from "@/clipin/state/workspace";

export const Route = createFileRoute("/app/schedule")({
  head: () => ({
    meta: [
      { title: "Publishing hub — CLIPIN" },
      { name: "description", content: "Queue finished clips for TikTok, Instagram and YouTube on a schedule you control." },
      { property: "og:title", content: "Publishing hub — CLIPIN" },
      { property: "og:description", content: "Queue finished clips for TikTok, Instagram and YouTube on a schedule you control." },
    ],
  }),
  component: Page,
});

const toneFor = (status: ScheduleEntry["status"]) =>
  status === "published" ? "success" : status === "failed" ? "danger" : "accent";

function Page() {
  const { clips } = useWorkspace();
  const [entries, setEntries] = useState<ScheduleEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [clipId, setClipId] = useState("");
  const [platform, setPlatform] = useState<SchedulePlatform>("tiktok");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError(null);
    try {
      setEntries(await scheduleService.list());
    } catch {
      setError("We couldn't load your queue.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!clipId && clips.length) setClipId(clips[0]!.id);
  }, [clips, clipId]);

  const selected = useMemo(() => clips.find((clip) => clip.id === clipId), [clips, clipId]);

  const submit = async () => {
    if (!scheduledFor) {
      toast.error("Pick a date and time first");
      return;
    }
    setSaving(true);
    try {
      await scheduleService.create({
        clipId: clipId || "manual",
        clipTitle: selected?.title ?? "Untitled clip",
        platform,
        caption: caption.trim(),
        hashtags: hashtags.trim(),
        scheduledFor: new Date(scheduledFor).toISOString(),
      });
      await historyService.record({
        project: "CLIPIN",
        video: selected?.title ?? "Untitled clip",
        action: "Scheduled",
      });
      setCaption("");
      setHashtags("");
      toast.success("Added to the publishing queue");
      await load();
    } catch {
      toast.error("We couldn't schedule that");
    } finally {
      setSaving(false);
    }
  };

  const cancel = async (id: string) => {
    await scheduleService.cancel(id);
    toast.success("Removed from the queue");
    await load();
  };

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Schedule"
        title="Publishing hub"
        description="Queue clips with captions and hashtags, then keep an eye on what goes out when."
      />

      <Panel>
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="clip">Clip</Label>
              {clips.length ? (
                <Select value={clipId} onValueChange={setClipId}>
                  <SelectTrigger id="clip">
                    <SelectValue placeholder="Choose a clip" />
                  </SelectTrigger>
                  <SelectContent>
                    {clips.map((clip) => (
                      <SelectItem key={clip.id} value={clip.id}>
                        {clip.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Generate clips in the clip maker to attach one here.
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={(value) => setPlatform(value as SchedulePlatform)}>
                <SelectTrigger id="platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {schedulePlatforms.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                rows={3}
                maxLength={2200}
                value={caption}
                placeholder="What should the post say?"
                onChange={(event) => setCaption(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hashtags">Hashtags</Label>
              <Input
                id="hashtags"
                value={hashtags}
                maxLength={300}
                placeholder="#creator #editing"
                onChange={(event) => setHashtags(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="when">Publish at</Label>
              <Input
                id="when"
                type="datetime-local"
                value={scheduledFor}
                onChange={(event) => setScheduledFor(event.target.value)}
              />
            </div>
          </div>
          <div>
            <Button type="submit" variant="hero" size="lg" disabled={saving}>
              <CalendarClock aria-hidden="true" />
              Add to queue
            </Button>
          </div>
        </form>
      </Panel>

      <section className="grid gap-4">
        <SectionHeader label="Queue" blurb="Sorted by publish time." />
        {error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : entries === null ? (
          <LoadingState message="Loading your queue" />
        ) : entries.length === 0 ? (
          <EmptyState
            title="Nothing scheduled"
            description="Add a clip above and it will show up here."
          />
        ) : (
          <ul className="grid gap-3">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone={toneFor(entry.status)}>{entry.status}</Pill>
                    <Pill>{entry.platform}</Pill>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.scheduledFor).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-xl leading-snug">{entry.clipTitle}</h3>
                  {entry.caption ? (
                    <p className="mt-1 text-sm text-muted-foreground">{entry.caption}</p>
                  ) : null}
                  {entry.hashtags ? (
                    <p className="mt-1 text-xs text-muted-foreground">{entry.hashtags}</p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${entry.clipTitle} from the queue`}
                  onClick={() => void cancel(entry.id)}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
