import { contentLocks } from "$lib/runes.svelte";
import { getContentLocks, upsertContentLock } from "$lib/services/community/utils/supabase-client";

function localStorageKey(courseId: string): string {
  return `tutors-content-locks-${courseId}`;
}

function loadFromLocalStorage(courseId: string): Map<string, boolean> {
  try {
    const raw = localStorage.getItem(localStorageKey(courseId));
    if (!raw) return new Map();
    const entries: [string, boolean][] = JSON.parse(raw);
    return new Map(entries);
  } catch {
    return new Map();
  }
}

function saveToLocalStorage(courseId: string, locks: Map<string, boolean>): void {
  try {
    localStorage.setItem(localStorageKey(courseId), JSON.stringify([...locks.entries()]));
  } catch {
    // storage full or unavailable
  }
}

export const rbacService = {
  async loadLocks(courseId: string): Promise<void> {
    const localMap = loadFromLocalStorage(courseId);

    const supabaseLocks = await getContentLocks(courseId);
    if (supabaseLocks.length > 0) {
      const map = new Map<string, boolean>();
      for (const lock of supabaseLocks) {
        if (lock.locked) {
          map.set(lock.lo_route, true);
        }
      }
      contentLocks.value = map;
      saveToLocalStorage(courseId, map);
    } else {
      contentLocks.value = localMap;
    }
  },

  async toggleLock(courseId: string, loRoute: string, lecturerLogin: string): Promise<void> {
    const currentlyLocked = contentLocks.value.get(loRoute) ?? false;
    const newState = !currentlyLocked;

    const updated = new Map(contentLocks.value);
    if (newState) {
      updated.set(loRoute, true);
    } else {
      updated.delete(loRoute);
    }
    contentLocks.value = updated;
    saveToLocalStorage(courseId, updated);

    upsertContentLock(courseId, loRoute, newState, lecturerLogin);
  },

  async setLock(courseId: string, loRoute: string, locked: boolean, lecturerLogin: string): Promise<void> {
    const updated = new Map(contentLocks.value);
    if (locked) {
      updated.set(loRoute, true);
    } else {
      updated.delete(loRoute);
    }
    contentLocks.value = updated;
    saveToLocalStorage(courseId, updated);

    upsertContentLock(courseId, loRoute, locked, lecturerLogin);
  },

  isLocked(loRoute: string): boolean {
    return contentLocks.value.get(loRoute) ?? false;
  }
};
