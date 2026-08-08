import { useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
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
import { aiService } from "../services";
import type { AiResult } from "../lib/ai-schemas";
import type { AiToolId } from "../lib/ai-schemas";
import { EmptyState, ErrorState, LoadingState, PageHeader, Panel, Pill } from "./primitives";

export interface AiField {
  name: string;
  label: string;
  placeholder?: string;
  help?: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  maxLength?: number;
}

export interface AiToolPageProps {
  tool: AiToolId;
  eyebrow: string;
  title: string;
  description: string;
  fields: AiField[];
  submitLabel?: string;
  emptyHint: string;
}

export function AIToolPage({
  tool,
  eyebrow,
  title,
  description,
  fields,
  submitLabel = "Generate",
  emptyHint,
}: AiToolPageProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, field.options?.[0] ?? ""])),
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<AiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [invalid, setInvalid] = useState<string[]>([]);

  const set = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const run = async () => {
    const missing = fields
      .filter((field) => field.required && !values[field.name]?.trim())
      .map((field) => field.name);
    setInvalid(missing);
    if (missing.length) return;

    setStatus("loading");
    setError(null);
    try {
      const response = await aiService.run(tool, values);
      setResult(response);
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The AI service is unavailable.");
      setStatus("error");
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Your browser blocked the clipboard");
    }
  };

  const copyAll = () => {
    if (!result) return;
    void copy(
      result.items
        .map((item) => [item.title, item.body].filter(Boolean).join("\n"))
        .join("\n\n"),
    );
  };

  return (
    <div className="grid gap-10">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <Panel>
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            void run();
          }}
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => {
              const isBad = invalid.includes(field.name);
              const describedBy = isBad
                ? `${field.name}-error`
                : field.help
                  ? `${field.name}-help`
                  : undefined;
              return (
                <div
                  key={field.name}
                  className={field.type === "textarea" ? "grid gap-2 sm:col-span-2" : "grid gap-2"}
                >
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required ? <span aria-hidden="true"> *</span> : null}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      rows={4}
                      value={values[field.name] ?? ""}
                      maxLength={field.maxLength ?? 4000}
                      placeholder={field.placeholder}
                      aria-invalid={isBad}
                      aria-describedby={describedBy}
                      onChange={(event) => set(field.name, event.target.value)}
                    />
                  ) : field.type === "select" ? (
                    <Select
                      value={values[field.name] ?? ""}
                      onValueChange={(value) => set(field.name, value)}
                    >
                      <SelectTrigger id={field.name} aria-describedby={describedBy}>
                        <SelectValue placeholder="Choose one" />
                      </SelectTrigger>
                      <SelectContent>
                        {(field.options ?? []).map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.name}
                      value={values[field.name] ?? ""}
                      maxLength={field.maxLength ?? 200}
                      placeholder={field.placeholder}
                      aria-invalid={isBad}
                      aria-describedby={describedBy}
                      onChange={(event) => set(field.name, event.target.value)}
                    />
                  )}
                  {isBad ? (
                    <p id={`${field.name}-error`} role="alert" className="text-sm text-destructive">
                      {field.label} is required.
                    </p>
                  ) : field.help ? (
                    <p id={`${field.name}-help`} className="text-xs text-muted-foreground">
                      {field.help}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="hero" size="lg" disabled={status === "loading"}>
              {status === "loading" ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles aria-hidden="true" />
              )}
              {submitLabel}
            </Button>
            {result ? (
              <Button type="button" variant="outline" size="lg" onClick={copyAll}>
                <Copy aria-hidden="true" />
                Copy all
              </Button>
            ) : null}
          </div>
        </form>
      </Panel>

      <section aria-live="polite" aria-busy={status === "loading"}>
        {status === "loading" ? (
          <LoadingState message="Thinking it through" detail="Drafting options for your audience." />
        ) : status === "error" ? (
          <ErrorState message={error ?? "Something went wrong."} onRetry={() => void run()} />
        ) : result ? (
          <div className="grid gap-4">
            {result.headline ? (
              <h2 className="font-display text-2xl">{result.headline}</h2>
            ) : null}
            <ul className="grid gap-4">
              {result.items.map((item, index) => (
                <li
                  key={`${item.title ?? "item"}-${index}`}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <div className="min-w-0">
                      {item.label ? <Pill tone="accent">{item.label}</Pill> : null}
                      {item.title ? (
                        <h3 className="mt-2 font-display text-xl leading-snug">{item.title}</h3>
                      ) : null}
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                      {item.meta?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.meta.map((meta) => (
                            <Pill key={meta}>{meta}</Pill>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Copy ${item.title ?? `result ${index + 1}`}`}
                      onClick={() => void copy([item.title, item.body].filter(Boolean).join("\n"))}
                      className="shrink-0"
                    >
                      <Copy />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <EmptyState title="Nothing generated yet" description={emptyHint} />
        )}
      </section>
    </div>
  );
}
