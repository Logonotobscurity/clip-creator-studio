import type { BrandPreset } from "../types";
import { createLocalRepository, newId } from "../lib/storage";

export interface BrandPresetService {
  list(): Promise<BrandPreset[]>;
  create(input: Omit<BrandPreset, "id">): Promise<BrandPreset>;
  update(preset: BrandPreset): Promise<BrandPreset>;
  remove(id: string): Promise<void>;
}

const repo = createLocalRepository<BrandPreset>("brand-presets");

export const brandPresetService: BrandPresetService = {
  list: () => repo.list(),
  create: (input) => repo.save({ ...input, id: newId("preset") }),
  update: (preset) => repo.save(preset),
  remove: (id) => repo.remove(id),
};
