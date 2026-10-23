import { describe, expect, it, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { LibraryProvider, useLibrary } from "@/lib/library-context";
import { LIBRARY_STATUSES } from "@/lib/types";

const STORAGE_KEY = "ovg.library.v1";

function wrapper({ children }: { children: React.ReactNode }) {
  return <LibraryProvider>{children}</LibraryProvider>;
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("useLibrary", () => {
  it("starts empty", async () => {
    const { result } = renderHook(() => useLibrary(), { wrapper });
    await waitFor(() => expect(result.current.list).toEqual([]));
    expect(result.current.count).toBe(0);
    expect(result.current.has(123)).toBe(false);
  });

  it("adds a game and updates counts", async () => {
    const { result } = renderHook(() => useLibrary(), { wrapper });
    await waitFor(() => expect(result.current.list).toEqual([]));

    act(() => {
      result.current.add(
        {
          id: 3498,
          slug: "grand-theft-auto-v",
          name: "Grand Theft Auto V",
          background_image: null,
          released: "2013-09-17",
          metacritic: 96,
          genres: [],
          platforms: [],
        },
        "want"
      );
    });

    expect(result.current.has(3498)).toBe(true);
    expect(result.current.getStatus(3498)).toBe("want");
    expect(result.current.count).toBe(1);
    expect(result.current.countByStatus.want).toBe(1);
  });

  it("persists to localStorage", async () => {
    const { result } = renderHook(() => useLibrary(), { wrapper });
    await waitFor(() => expect(result.current.list).toEqual([]));

    act(() => {
      result.current.add(
        {
          id: 1,
          slug: "game-one",
          name: "Game One",
          genres: [],
          platforms: [],
        },
        "completed"
      );
    });

    await waitFor(() => {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      expect(raw).toBeTruthy();
      expect(JSON.parse(raw as string)[1].status).toBe("completed");
    });
  });

  it("hydrates from localStorage on mount", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        5: {
          id: 5,
          slug: "stored-game",
          name: "Stored Game",
          genres: [],
          platforms: [],
          addedAt: 123,
          status: "playing",
        },
      })
    );

    const { result } = renderHook(() => useLibrary(), { wrapper });
    await waitFor(() => expect(result.current.has(5)).toBe(true));
    expect(result.current.getStatus(5)).toBe("playing");
    expect(result.current.count).toBe(1);
  });

  it("changes status", async () => {
    const { result } = renderHook(() => useLibrary(), { wrapper });
    await waitFor(() => expect(result.current.list).toEqual([]));

    act(() => {
      result.current.add(
        { id: 9, slug: "g", name: "G", genres: [], platforms: [] },
        "want"
      );
    });
    act(() => {
      result.current.setStatus(9, "completed");
    });

    expect(result.current.getStatus(9)).toBe("completed");
    expect(result.current.countByStatus.completed).toBe(1);
    expect(result.current.countByStatus.want).toBe(0);
  });

  it("removes a game", async () => {
    const { result } = renderHook(() => useLibrary(), { wrapper });
    await waitFor(() => expect(result.current.list).toEqual([]));

    act(() => {
      result.current.add(
        { id: 9, slug: "g", name: "G", genres: [], platforms: [] },
        "want"
      );
    });
    act(() => {
      result.current.remove(9);
    });

    expect(result.current.has(9)).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it("tracks status counts across all statuses", async () => {
    const { result } = renderHook(() => useLibrary(), { wrapper });
    await waitFor(() => expect(result.current.list).toEqual([]));

    act(() => {
      LIBRARY_STATUSES.forEach((status, i) => {
        result.current.add(
          { id: i + 1, slug: `g${i}`, name: `G${i}`, genres: [], platforms: [] },
          status
        );
      });
    });

    for (const status of LIBRARY_STATUSES) {
      expect(result.current.countByStatus[status]).toBe(1);
    }
    expect(result.current.count).toBe(3);
  });
});
