import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Calendar,
  Clock,
  Coins,
  FileText,
  Handshake,
  Hash,
  Lightbulb,
  ListOrdered,
  MoreHorizontal,
  PenLine,
  RefreshCw,
  Scissors,
  Sparkles,
  Tag,
  Type,
} from "lucide-react";

export interface ToolLink {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

export interface ToolGroupDef {
  id: string;
  label: string;
  blurb: string;
  tools: ToolLink[];
}

export const toolGroups: ToolGroupDef[] = [
  {
    id: "repurpose",
    label: "Repurpose",
    blurb: "One long video becomes a month of shorts.",
    tools: [
      {
        title: "Short clip maker",
        description: "Paste a link and pull the strongest moments out of any long-form video.",
        to: "/app/clipmaker",
        icon: Scissors,
        badge: "Core",
      },
    ],
  },
  {
    id: "ideate",
    label: "Ideate",
    blurb: "Never open a blank page again.",
    tools: [
      {
        title: "Unlimited video ideas",
        description: "Concepts, angles and formats built around your topic and audience.",
        to: "/app/ideate",
        icon: Lightbulb,
      },
      {
        title: "Hook generator",
        description: "Opening lines engineered to stop the scroll in the first second.",
        to: "/app/hooks",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "scripting",
    label: "Scripting",
    blurb: "From outline to shooting script.",
    tools: [
      {
        title: "Script writer",
        description: "A full script with hook, body and call to action.",
        to: "/app/script/write",
        icon: PenLine,
      },
      {
        title: "Script outline",
        description: "Structure first: hook, three sections, conclusion, CTA.",
        to: "/app/script/outline",
        icon: ListOrdered,
      },
      {
        title: "Rewrite script of any video",
        description: "Turn an existing video or transcript into your own script.",
        to: "/app/script/rewrite",
        icon: RefreshCw,
      },
    ],
  },
  {
    id: "optimise",
    label: "Upload and optimize",
    blurb: "Everything that decides whether the click happens.",
    tools: [
      {
        title: "Video title",
        description: "Title options tuned for search and curiosity.",
        to: "/app/optimise/title",
        icon: Type,
      },
      {
        title: "Video description",
        description: "Descriptions that carry keywords without reading like spam.",
        to: "/app/optimise/description",
        icon: FileText,
      },
      {
        title: "Video chapters",
        description: "Timestamped chapters that keep viewers watching.",
        to: "/app/optimise/chapters",
        icon: Clock,
      },
      {
        title: "Video tags",
        description: "Broad, niche and long-tail tags in one pass.",
        to: "/app/optimise/tags",
        icon: Tag,
      },
    ],
  },
  {
    id: "monetise",
    label: "Monetise",
    blurb: "Know what your work is worth.",
    tools: [
      {
        title: "Earnings calculator",
        description: "Project monthly income across platforms and niches.",
        to: "/app/monetise",
        icon: Coins,
      },
      {
        title: "Brand deal estimator",
        description: "Price sponsorships with CPM and EMV benchmarks.",
        to: "/app/deals",
        icon: Handshake,
      },
    ],
  },
  {
    id: "schedule",
    label: "Schedule",
    blurb: "Ship on a rhythm, not a whim.",
    tools: [
      {
        title: "Publishing hub",
        description: "Queue clips for TikTok, Instagram and YouTube.",
        to: "/app/schedule",
        icon: Calendar,
      },
    ],
  },
];

export const workspaceNav: { label: string; to: string; icon: LucideIcon }[] = [
  { label: "Explore", to: "/app", icon: Sparkles },
  { label: "Clip maker", to: "/app/clipmaker", icon: Scissors },
  { label: "Ideas", to: "/app/ideate", icon: Lightbulb },
  { label: "Hooks", to: "/app/hooks", icon: Hash },
  { label: "Script writer", to: "/app/script/write", icon: PenLine },
  { label: "Outline", to: "/app/script/outline", icon: ListOrdered },
  { label: "Rewrite", to: "/app/script/rewrite", icon: RefreshCw },
  { label: "Titles", to: "/app/optimise/title", icon: Type },
  { label: "Descriptions", to: "/app/optimise/description", icon: FileText },
  { label: "Chapters", to: "/app/optimise/chapters", icon: Clock },
  { label: "Tags", to: "/app/optimise/tags", icon: Tag },
  { label: "Earnings", to: "/app/monetise", icon: Coins },
  { label: "Brand deals", to: "/app/deals", icon: Handshake },
  { label: "Schedule", to: "/app/schedule", icon: Calendar },
  { label: "History", to: "/app/history", icon: Clock },
  { label: "Analytics", to: "/app/analytics", icon: BarChart3 },
  { label: "More", to: "/app/more", icon: MoreHorizontal },
];
