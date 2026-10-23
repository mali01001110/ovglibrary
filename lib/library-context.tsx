"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { LibraryEntry, LibraryStatus } from "@/lib/types";

const STORAGE_KEY = "ovg.library.v1";

interface LibraryContextValue {
  entries: Record<number, LibraryEntry>;
  list: LibraryEntry[];
  count: number;
  countByStatus: Record<LibraryStatus, number>;
  getStatus: (gameId: number) => LibraryStatus | undefined;
  add: (entry: Omit<LibraryEntry, "addedAt" | "status">, status: LibraryStatus) => void;
  remove: (gameId: number) => void;
  setStatus: (gameId: number, status: LibraryStatus) => void;
  has: (gameId: number) => boolean;
}

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

function loadFromStorage(): Record<number, LibraryEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<number, LibraryEntry>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Record<number, LibraryEntry>>({});

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      const stored = loadFromStorage();
      if (!cancelled) setEntries(stored);
    };
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const persist = async () => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } catch {
        // Storage unavailable (private mode, quota) — degrade silently.
      }
    };
    void persist();
  }, [entries]);

  const add = useCallback(
    (entry: Omit<LibraryEntry, "addedAt" | "status">, status: LibraryStatus) => {
      setEntries((prev) => ({
        ...prev,
        [entry.id]: {
          ...entry,
          addedAt: Date.now(),
          status,
        },
      }));
    },
    []
  );

  const remove = useCallback((gameId: number) => {
    setEntries((prev) => {
      const next = { ...prev };
      delete next[gameId];
      return next;
    });
  }, []);

  const setStatus = useCallback((gameId: number, status: LibraryStatus) => {
    setEntries((prev) => {
      const current = prev[gameId];
      if (!current) return prev;
      return { ...prev, [gameId]: { ...current, status } };
    });
  }, []);

  const has = useCallback((gameId: number) => gameId in entries, [entries]);

  const getStatus = useCallback(
    (gameId: number) => entries[gameId]?.status,
    [entries]
  );

  const value = useMemo<LibraryContextValue>(() => {
    const list = Object.values(entries);
    const countByStatus: Record<LibraryStatus, number> = {
      want: 0,
      playing: 0,
      completed: 0,
    };
    for (const entry of list) {
      countByStatus[entry.status] += 1;
    }
    return {
      entries,
      list,
      count: list.length,
      countByStatus,
      getStatus,
      add,
      remove,
      setStatus,
      has,
    };
  }, [entries, getStatus, add, remove, setStatus, has]);

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextValue {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}
