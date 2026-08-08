/**
 * Service registry. Components import from here, never from a concrete adapter.
 * Swapping the development adapters for remote ones happens in this file only.
 */
export * from "./api-contracts";
export * from "./video.service";
export * from "./faceTracking.service";
export * from "./subtitle.service";
export * from "./export.service";
export * from "./brandPreset.service";
export * from "./schedule.service";
export * from "./history.service";
export * from "./analytics.service";
export * from "./ai.service";

import { devVideoService } from "./video.service";
import { devExportService } from "./export.service";

export const videoService = devVideoService;
export const exportService = devExportService;

/** True when the video pipeline is a local development adapter, not a real backend. */
export const VIDEO_PIPELINE_IS_DEV = videoService.kind === "development";
