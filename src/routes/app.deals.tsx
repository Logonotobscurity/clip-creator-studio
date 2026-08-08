import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, Panel, StatsCard } from "@/clipin/components/primitives";
import {
  EARNINGS_DISCLAIMER,
  NICHE_MULTIPLIER,
  calculateBrandDeal,
  currency,
} from "@/clipin/lib/validation";

export const Route = createFileRoute("/app/deals")({
  head: () => ({
    meta: [
      { title: "Brand deal estimator — CLIPIN" },
      { name: "description", content: "Price sponsorships with CPM and earned-media benchmarks before you send the rate card." },
      { property: "og:title", content: "Brand deal estimator — CLIPIN" },
      { property: "og:description", content: "Price sponsorships with CPM and earned-media benchmarks before you send the rate card." },
    ],
  }),
  component: Deals;
});

function Deals() {
  return null;
}
