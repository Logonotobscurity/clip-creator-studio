/**
 * Storage repository abstraction.
 *
 * Development uses localStorage. Production can swap in a PostgreSQL /
 * object-storage backed adapter by implementing `Repository<T>` — components
 * and services never touch the storage engine directly.
 */

export interface Repository<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  save(item: T): Promise<T>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

function read<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    /* quota or private mode — non fatal */
  }
}

export function createLocalRepository<T extends { id: string }>(key: string): Repository<T> {
  const storageKey = `clipin:${key}`;
  return {
    async list() {
      return read<T>(storageKey);
    },
    async get(id) {
      return read<T>(storageKey).find((item) => item.id === id) ?? null;
    },
    async save(item) {
      const items = read<T>(storageKey);
      const index = items.findIndex((existing) => existing.id === item.id);
      if (index >= 0) items[index] = item;
      else items.unshift(item);
      write(storageKey, items);
      return item;
    },
    async remove(id) {
      write(
        storageKey,
        read<T>(storageKey).filter((item) => item.id !== id),
      );
    },
    async clear() {
      write(storageKey, []);
    },
  };
}

/** Single-value store (current video, editor draft, session). */
export function createLocalValue<T>(key: string) {
  const storageKey = `clipin:value:${key}`;
  return {
    get(): T | null {
      if (!isBrowser()) return null;
      try {
        const raw = window.localStorage.getItem(storageKey);
        return raw ? (JSON.parse(raw) as T) : null;
      } catch {
        return null;
      }
    },
    set(value: T) {
      if (!isBrowser()) return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(value));
      } catch {
        /* ignore */
      }
    },
    clear() {
      if (!isBrowser()) return;
      window.localStorage.removeItem(storageKey);
    },
  };
}

export const newId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
