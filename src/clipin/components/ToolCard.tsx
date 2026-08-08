import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ToolGroupDef, ToolLink } from "../nav";
import { Pill } from "./primitives";

export function ToolCard({ tool }: { tool: ToolLink }) {
  const Icon = tool.icon;
  return (
    <Link
      to={tool.to}
      className="group flex min-w-0 flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-6 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        {tool.badge ? <Pill tone="neutral">{tool.badge}</Pill> : null}
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-xl leading-tight">{tool.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-semibold">
        Open tool
        <ArrowUpRight
          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

export function ToolGroup({ group }: { group: ToolGroupDef }) {
  return (
    <section aria-labelledby={`group-${group.id}`}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-b border-border pb-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 id={`group-${group.id}`} className="font-display text-2xl">
            {group.label}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{group.blurb}</p>
        </div>
        <span className="shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {group.tools.length} {group.tools.length === 1 ? "tool" : "tools"}
        </span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.tools.map((tool) => (
          <ToolCard key={tool.to} tool={tool} />
        ))}
      </div>
    </section>
  );
}
