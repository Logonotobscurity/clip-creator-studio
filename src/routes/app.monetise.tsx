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
  CPM_BY_PLATFORM,
  EARNINGS_DISCLAIMER,
  NICHE_MULTIPLIER,
  calculateEarnings,
  currency,
} from "@/clipin/lib/validation";

export const Route = createFileRoute("/app/monetise")({
  head: () => ({
    meta: [
      { title: "Earnings calculator — CLIPIN" },
      { name: "description", content: "Project monthly creator income across platforms, niches and audience sizes." },
      { property: "og:title", content: "Earnings calculator — CLIPIN" },
      { property: "og:description", content: "Project monthly creator income across platforms, niches and audience sizes." },
    ],
  }),
  component: Earnings,
});

function Earnings() {
  const [platform, setPlatform] = useState(Object.keys(CPM_BY_PLATFORM)[0]!);
  const [niche, setNiche] = useState(Object.keys(NICHE_MULTIPLIER)[0]!);
  const [views, setViews] = useState(250000);
  const [followers, setFollowers] = useState(25000);
  const [clips, setClips] = useState(12);

  const result = calculateEarnings({
    platform,
    niche,
    viewsPerMonth: views,
    clipsPerMonth: clips,
    followers,
  });

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Monetise"
        title="What your audience is worth"
        description="A grounded estimate of monthly income based on platform CPMs, niche multipliers and your engagement."
      />
      <Panel className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger id="platform"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(CPM_BY_PLATFORM).map((key) => (
                <SelectItem key={key} value={key}>{key}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="niche">Niche</Label>
          <Select value={niche} onValueChange={setNiche}>
            <SelectTrigger id="niche"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(NICHE_MULTIPLIER).map((key) => (
                <SelectItem key={key} value={key}>{key}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="views">Monthly views</Label>
          <Input id="views" type="number" min={0} value={views} onChange={(e) => setViews(Number(e.target.value) || 0)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="followers">Followers</Label>
          <Input id="followers" type="number" min={0} value={followers} onChange={(e) => setFollowers(Number(e.target.value) || 0)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="clips">Clips published per month</Label>
          <Input id="clips" type="number" min={0} value={clips} onChange={(e) => setClips(Number(e.target.value) || 0)} />
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="Ad revenue" value={currency(result.adRevenue)} hint="Platform payouts" />
        <StatsCard label="Sponsorships" value={currency(result.sponsorRevenue)} hint="Typical brand spend" />
        <StatsCard label="Monthly total" value={currency(result.total)} hint={`${currency(result.low)} – ${currency(result.high)} range`} />
      </div>
      <p className="text-xs text-muted-foreground">{EARNINGS_DISCLAIMER}</p>
    </div>
  );
}
