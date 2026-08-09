import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { brandPresetService } from "@/clipin/services";
import { subtitleStyles } from "@/clipin/design/tokens";
import type { BrandPreset } from "@/clipin/types";

export const Route = createFileRoute("/app/more")({
  head: () => ({
    meta: [
      { title: "More tools — CLIPIN" },
      { name: "description", content: "Brand presets and the rest of the CLIPIN toolkit." },
      { property: "og:title", content: "More tools — CLIPIN" },
      { property: "og:description", content: "Brand presets and the rest of the CLIPIN toolkit." },
    ],
  }),
  component: Page,
});

function Page() {
  const [presets, setPresets] = useState<BrandPreset[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [style, setStyle] = useState<string>(subtitleStyles[0].id);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError(null);
    try {
      setPresets(await brandPresetService.list());
    } catch {
      setError("We couldn't load your brand presets.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Give the preset a name");
      return;
    }
    setSaving(true);
    try {
      await brandPresetService.create({
        name: name.trim().slice(0, 60),
        ...(logo.trim() ? { logo: logo.trim() } : {}),
        subtitleStyle: style,
      });
      setName("");
      setLogo("");
      toast.success("Brand preset saved");
      await load();
    } catch {
      toast.error("We couldn't save that preset");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await brandPresetService.remove(id);
    toast.success("Preset removed");
    await load();
  };

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Workspace"
        title="More"
        description="Brand presets and everything else."
      />

      <Panel>
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="preset-name">Preset name</Label>
              <Input
                id="preset-name"
                value={name}
                maxLength={60}
                placeholder="Main channel"
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preset-logo">Logo URL</Label>
              <Input
                id="preset-logo"
                value={logo}
                maxLength={400}
                placeholder="https://…/logo.png"
                onChange={(event) => setLogo(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preset-style">Subtitle style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger id="preset-style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subtitleStyles.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Button type="submit" variant="hero" size="lg" disabled={saving}>
              <Plus aria-hidden="true" />
              Save preset
            </Button>
          </div>
        </form>
      </Panel>

      <section className="grid gap-4">
        <SectionHeader label="Brand presets" blurb="Applied in the clip editor before export." />
        {error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : presets === null ? (
          <LoadingState message="Loading your presets" />
        ) : presets.length === 0 ? (
          <EmptyState
            title="No presets yet"
            description="Save one above to reuse your logo and caption style on every clip."
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {presets.map((preset) => (
              <li
                key={preset.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div className="min-w-0">
                  <h3 className="font-display text-xl leading-snug">{preset.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {preset.subtitleStyle ? <Pill tone="accent">{preset.subtitleStyle}</Pill> : null}
                    {preset.logo ? <Pill>logo attached</Pill> : null}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${preset.name}`}
                  onClick={() => void remove(preset.id)}
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
