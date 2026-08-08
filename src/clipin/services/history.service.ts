import type { HistoryAction, HistoryEntry } from "../types";
import { createLocalRepository, newId } from "../lib/storage";

export interface HistoryService {
  list(): Promise<HistoryEntry[]>;
  record(input: { project: string; video: string; action: HistoryAction }): Promise<HistoryEntry>;
  clear(): Promise<void>;
}

const repo = createLocalRepository<HistoryEntry>("history");

const statusFor = (action: HistoryAction): HistoryEntry["status"] =>
  action === "Failed" ? "error" : action === "Scheduled" ? "warn" : "ok";

export const historyService: HistoryService = {
  list: () => repo.list(),
  record: (input) =>
    repo.save({
      id: newId("hist"),
      project: input.project,
      video: input.video,
      action: input.action,
      date: new Date().toISOString(),
      status: statusFor(input.action),
    }),
  clear: () => repo.clear(),
};
