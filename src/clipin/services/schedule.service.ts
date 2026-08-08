import type { ScheduleEntry } from "../types";
import { createLocalRepository, newId } from "../lib/storage";

export interface ScheduleService {
  list(): Promise<ScheduleEntry[]>;
  create(input: Omit<ScheduleEntry, "id" | "status">): Promise<ScheduleEntry>;
  update(entry: ScheduleEntry): Promise<ScheduleEntry>;
  cancel(id: string): Promise<void>;
}

const repo = createLocalRepository<ScheduleEntry>("schedule");

export const scheduleService: ScheduleService = {
  async list() {
    const items = await repo.list();
    return items.sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
  },
  create: (input) => repo.save({ ...input, id: newId("sched"), status: "pending" }),
  update: (entry) => repo.save(entry),
  cancel: (id) => repo.remove(id),
};
