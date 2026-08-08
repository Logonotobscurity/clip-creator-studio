import { useState } from "react";
import { Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries, supportedPlatforms } from "../design/tokens";
import { parseVideoUrl } from "../lib/validation";
import type { VideoSource } from "../types";

export function VideoInput({
  busy,
  onSubmit,
  submitLabel = "Generate Clips",
}: {
  busy?: boolean;
  submitLabel?: string;
  onSubmit: (source: VideoSource) => void;
}) {
  const [url, setUrl] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [country, setCountry] = useState<string>("Global");
  const [context, setContext] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = parseVideoUrl(url);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    setError(null);
    onSubmit({
      url: parsed.url,
      platform: parsed.platform,
      inspiration: inspiration.trim(),
      country,
      context: context.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-8" noValidate>
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <Label htmlFor="video-link" className="text-xs font-bold uppercase tracking-[0.2em]">
          Video link
        </Label>
        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative min-w-0">
            <Link2
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="video-link"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Drop a video link"
              inputMode="url"
              aria-invalid={!!error}
              aria-describedby={error ? "video-link-error" : "video-link-help"}
              className="h-13 rounded-full pl-11 text-base"
            />
          </div>
          <Button type="submit" size="lg" variant="hero" disabled={busy} className="shrink-0">
            {busy ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            {submitLabel}
          </Button>
        </div>
        {error ? (
          <p id="video-link-error" role="alert" className="mt-3 text-sm font-medium text-destructive">
            {error}
          </p>
        ) : (
          <p id="video-link-help" className="mt-3 text-sm text-muted-foreground">
            Supports {supportedPlatforms.map((platform) => platform.label).join(", ")}.
          </p>
        )}
      </div>

      <fieldset className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <legend className="px-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Give us more context
        </legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="inspiration">Inspiration channel or creator handle</Label>
            <Input
              id="inspiration"
              value={inspiration}
              onChange={(event) => setInspiration(event.target.value)}
              placeholder="@creator"
              maxLength={120}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="country">Trending in country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="context">Add more context (optional)</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(event) => setContext(event.target.value)}
              placeholder="Audience, tone, what the video is really about..."
              maxLength={1000}
              rows={3}
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
}
