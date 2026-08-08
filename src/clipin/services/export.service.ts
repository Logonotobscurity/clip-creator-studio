import type { ExportJob, ExportRequest } from "../types";
import { createLocalRepository, newId } from "../lib/storage";

/**
 * Export service.
 *
 * INTEGRATION POINT: `devExportService` simulates the job lifecycle
 * (Queued -> Processing -> Completed) so the UI contract is exercised. It does
 * NOT encode video. A production adapter should POST /api/video/export and poll
 * or subscribe for job progress from an FFmpeg/GPU worker.
 */
export interface ExportService {
  readonly kind: "development" | "remote";
  start(request: ExportRequest): Promise<ExportJob>;
  subscribe(jobId: string, onUpdate: (job: ExportJob) => void): () => void;
  cancel(jobId: string): Promise<ExportJob | null>;
  list(): Promise<ExportJob[]>;
}

const repo = createLocalRepository<ExportJob>("exports");

export const devExportService: ExportService = {
  kind: "development",

  async start(request) {
    const job: ExportJob = {
      id: newId("job"),
      clipId: request.clipId,
      quality: request.editor.quality,
      format: request.format,
      status: "Queued",
      progress: 0,
      createdAt: new Date().toISOString(),
      message: "Queued for rendering",
    };
    await repo.save(job);
    return job;
  },

  subscribe(jobId, onUpdate) {
    let cancelled = false;
    let progress = 0;

    const tick = async () => {
      if (cancelled) return;
      const current = await repo.get(jobId);
      if (!current || current.status === "Cancelled") return;

      progress = Math.min(100, progress + 7 + Math.random() * 11);
      const next: ExportJob = {
        ...current,
        status: progress >= 100 ? "Completed" : "Processing",
        progress: Math.round(progress),
        message:
          progress >= 100
            ? "Render complete (development adapter — no file encoded)"
            : "Rendering frames...",
      };
      await repo.save(next);
      onUpdate(next);
      if (next.status !== "Completed") timer = setTimeout(tick, 420);
    };

    let timer = setTimeout(tick, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  },

  async cancel(jobId) {
    const job = await repo.get(jobId);
    if (!job) return null;
    const cancelledJob: ExportJob = { ...job, status: "Cancelled", message: "Cancelled by creator" };
    await repo.save(cancelledJob);
    return cancelledJob;
  },

  async list() {
    return repo.list();
  },
};
