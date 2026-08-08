import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toolGroups } from "@/clipin/nav";
import { ToolCard } from "@/clipin/components/ToolCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CLIPIN — AI video repurposing for creators" },
      {
        name: "description",
        content:
          "Turn one long video into a week of vertical clips, with tracked framing, subtitles, scripts and metadata built in.",
      },
      { property: "og:title", content: "CLIPIN — AI video repurposing for creators" },
      {
        property: "og:description",
        content: "One long video in. A month of shorts, scripts and metadata out.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const featured = toolGroups.flatMap((group) => group.tools).slice(0, 6);

  return (
    <div className="min-h-dvh">
      <header className="container-clipin flex items-center justify-between py-6">
        <span className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Scissors className="size-5" aria-hidden="true" />
          </span>
          <span className="font-display text-2xl tracking-tight">CLIPIN</span>
        </span>
        <Button asChild variant="hero">
          <Link to="/app">Open workspace</Link>
        </Button>
      </header>

      <main id="main">
        <section className="container-clipin grid gap-8 py-16 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
            AI video repurposing
          </p>
          <h1 className="editorial-title max-w-3xl text-5xl sm:text-7xl">
            One long video in. A month of shorts out.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            CLIPIN finds the moments worth posting, crops them to the speaker, writes the captions,
            and hands you the titles, tags and scripts that go with them.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="hero">
              <Link to="/app/clipmaker">
                Make clips
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/app">Browse the tools</Link>
            </Button>
          </div>
        </section>

        <section className="container-clipin pb-24">
          <h2 className="border-b border-border pb-4 font-display text-2xl">Built for the whole loop</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tool) => (
              <ToolCard key={tool.to} tool={tool} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
