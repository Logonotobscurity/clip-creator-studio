import type { AnalyticsSnapshot } from "../types";
import { historyService } from "./history.service";
import { scheduleService } from "./schedule.service";
import { devExportService } from "./export.service";
import { createLocalValue } from "../lib/storage";

/**
 * Analytics service. Derives metrics from local activity today; a production
 * adapter can hydrate views / watch time / CTR / retention from platform APIs
 * without changing the snapshot contract.
 */
export interface AnalyticsService {
  snapshot(): Promise<AnalyticsSnapshot>;
  trackClipLengths(lengths: number[]): void;
}

const lengthsStore = createLocalValue<number[]>("clip-lengths");

export const analyticsService: AnalyticsService = {
  async snapshot() {
    const [history, schedule, exports] = await Promise.all([
      historyService.list(),
      scheduleService.list(),
      devExportService.list(),
    ]);
    const lengths = lengthsStore.get() ?? [];
    const average = lengths.length
      ? Math.round(lengths.reduce((sum, value) => sum + value, 0) / lengths.length)
      : 0;

    return {
      clipsCreated: history.filter((entry) => entry.action === "Generated").length,
      exports: exports.filter((job) => job.status === "Completed").length,
      scheduled: schedule.length,
      averageClipLength: average,
    };
  },

  trackClipLengths(lengths) {
    const existing = lengthsStore.get() ?? [];
    lengthsStore.set([...existing, ...lengths].slice(-500));
  },
};
