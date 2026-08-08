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
      {
        name: "description",
        content:
          "Price sponsorships with CPM and earned-media benchmarks before you send the rate card.",
      },
      { property: "og:title", content: "Brand deal estimator — CLIPIN" },
      {
        property: "og:description",
        content: "Price creator sponsorships with CPM and earned-media benchmarks.",
      },
    ],
  }),
  component: Deals,
});

function Deals() {
  const [niche, setNiche] = useState(Object.keys(NICHE_MULTIPLIER)[0]!);
  const [followers, setFollowers] = useState(25000);
  const [avgViews, setAvgViews] = useState(40000);
  const [engagement, setEngagement] = useState(4);
  const [deliverables, setDeliverables] = useState(2);

  const result = calculateBrandDeal({
    niche,
    followers,
    averageViews: avgViews,
    engagementRate: engagement,
    deliverables,
  });

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Monetise"
        title="Price the deal before the call"
        description="A defensible sponsorship range built from your reach, engagement and how much work the brand is actually asking for."
      />

      <Panel className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="niche">Niche</Label>
          <Select value={niche} onValueChange={setNiche}>
            <SelectTrigger id="niche">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(NICHE_MULTIPLIER).map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="followers">Followers</Label>
          <Input
            id="followers"
            type="number"
            min={0}
            value={followers}
            onChange={(event) => setFollowers(Number(event.target.value) || 0)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="views">Average views per post</Label>
          <Input
            id="views"
            type="number"
            min={0}
            value={avgViews}
            onChange={(event) => setAvgViews(Number(event.target.value) || 0)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="engagement">Engagement rate (%)</Label>
          <Input
            id="engagement"
            type="number"
            min={0}
            max={100}
            value={engagement}
            onChange={(event) => setEngagement(Number(event.target.value) || 0)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="deliverables">Deliverables</Label>
          <Input
            id="deliverables"
            type="number"
            min={1}
            max={20}
            value={deliverables}
            onChange={(event) => setDeliverables(Number(event.target.value) || 1)}
          />
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="Suggested rate" value={currency(result.rate)} hint="Per campaign" />
        <StatsCard
          label="Negotiation range"
          value={`${currency(result.low)} – ${currency(result.high)}`}
          hint="Walk-away to stretch"
        />
        <StatsCard label="Earned media value" value={currency(result.emv)} hint="What the brand gets" />
      </div>
      <p className="text-xs text-muted-foreground">{EARNINGS_DISCLAIMER}</p>
    </div>
  );
}
