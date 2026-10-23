"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { RawgListResponse, RawgGameSummary } from "@/lib/rawg";
import { GameGrid } from "@/components/game-grid";
import { SearchBar } from "@/components/search-bar";
import { FilterBar } from "@/components/filter-bar";
import { Pagination } from "@/components/pagination";
import { useI18n } from "@/lib/i18n-context";

interface BrowseClientProps {
  initialData: RawgListResponse;
  initialQuery: {
    search?: string;
    ordering?: string;
    platforms?: string;
    genres?: string;
    metacritic?: string;
    page?: string;
  };
}

type Filters = {
  search: string;
  ordering: string;
  platforms: string;
  genres: string;
  metacritic: string;
};

const FILTER_KEYS = ["search", "ordering", "platforms", "genres", "metacritic"] as const;

function readFiltersFromUrl(searchParams: URLSearchParams): Filters {
  const get = (key: string) => searchParams.get(key) ?? "";
  return {
    search: get("search"),
    ordering: get("ordering"),
    platforms: get("platforms"),
    genres: get("genres"),
    metacritic: get("metacritic"),
  };
}

function readFilters(searchParams: URLSearchParams, initialQuery: BrowseClientProps["initialQuery"]): Filters {
  const get = (key: string) =>
    searchParams.get(key) ?? initialQuery[key as keyof typeof initialQuery] ?? "";
  return {
    search: get("search"),
    ordering: get("ordering"),
    platforms: get("platforms"),
    genres: get("genres"),
    metacritic: get("metacritic"),
  };
}

function buildQueryKey(input: {
  search: string;
  ordering: string;
  platforms: string;
  genres: string;
  metacritic: string;
  page: number;
}): string {
  return JSON.stringify([
    input.search,
    input.ordering,
    input.platforms,
    input.genres,
    input.metacritic,
    input.page,
  ]);
}

export function BrowseClient({ initialData, initialQuery }: BrowseClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const urlString = searchParams.toString();

  const [filters, setFilters] = useState<Filters>(() => readFilters(searchParams, initialQuery));
  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);
  const [data, setData] = useState<RawgListResponse>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeSearch, setActiveSearch] = useState(() => readFilters(searchParams, initialQuery).search);

  const urlRef = useRef(urlString);
  const skipWriteRef = useRef(false);
  const servedKeyRef = useRef(
    buildQueryKey({
      search: initialQuery.search ?? "",
      ordering: initialQuery.ordering ?? "",
      platforms: initialQuery.platforms ?? "",
      genres: initialQuery.genres ?? "",
      metacritic: initialQuery.metacritic ?? "",
      page: Number(initialQuery.page) || 1,
    })
  );

  // Sync from URL when the browser navigates (back/forward).
  useEffect(() => {
    const urlChanged = urlRef.current !== urlString;
    urlRef.current = urlString;
    if (!urlChanged) return;
    skipWriteRef.current = true;
    const next = readFiltersFromUrl(searchParams);
    setFilters((prev) =>
      FILTER_KEYS.every((k) => prev[k] === next[k]) ? prev : next
    );
    setActiveSearch((prev) => (prev === next.search ? prev : next.search));
    const urlPage = Number(searchParams.get("page")) || 1;
    setPage((prev) => (prev === urlPage ? prev : urlPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlString]);

  const handleSearch = useCallback((query: string) => {
    setActiveSearch(query.trim());
    setPage(1);
  }, []);

  useEffect(() => {
    const key = buildQueryKey({
      search: activeSearch,
      ordering: filters.ordering,
      platforms: filters.platforms,
      genres: filters.genres,
      metacritic: filters.metacritic,
      page,
    });
    if (key === servedKeyRef.current) return;

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setHasError(false);

      const params = new URLSearchParams({ page_size: "20" });
      if (activeSearch) params.set("search", activeSearch);
      if (filters.ordering) params.set("ordering", filters.ordering);
      if (filters.platforms) params.set("platforms", filters.platforms);
      if (filters.genres) params.set("genres", filters.genres);
      if (filters.metacritic) params.set("metacritic", filters.metacritic);
      params.set("page", String(page));

      try {
        const res = await fetch(`/api/games?${params.toString()}`);
        if (!res.ok) throw new Error("request failed");
        const json = (await res.json()) as RawgListResponse;
        if (!cancelled) {
          servedKeyRef.current = key;
          setData(json);
        }
      } catch {
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [activeSearch, filters.ordering, filters.platforms, filters.genres, filters.metacritic, page]);

  // Sync state -> URL. Skipped when the URL change came from the browser
  // (back/forward) — writing back stale state here used to clobber the URL
  // and trigger a cascade of blocking re-renders.
  useEffect(() => {
    if (skipWriteRef.current) {
      skipWriteRef.current = false;
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (activeSearch) params.set("search", activeSearch);
    else params.delete("search");
    if (filters.ordering) params.set("ordering", filters.ordering);
    else params.delete("ordering");
    if (filters.platforms) params.set("platforms", filters.platforms);
    else params.delete("platforms");
    if (filters.genres) params.set("genres", filters.genres);
    else params.delete("genres");
    if (filters.metacritic) params.set("metacritic", filters.metacritic);
    else params.delete("metacritic");
    if (page > 1) params.set("page", String(page));
    else params.delete("page");

    const qs = params.toString();
    if (qs !== urlString) {
      router.replace(qs ? `?${qs}` : "/", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSearch, filters, page, urlString, router]);

  const handleFilterChange = (updates: {
    ordering?: string;
    platforms?: string;
    genres?: string;
    metacritic?: string;
    page?: number;
  }) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    if (updates.page) setPage(updates.page);
  };

  const games: RawgGameSummary[] = data.results ?? [];

  return (
    <div className="flex flex-col gap-6">
      <SearchBar value={filters.search} onSearch={handleSearch} />
      <FilterBar
        ordering={filters.ordering}
        platforms={filters.platforms}
        genres={filters.genres}
        metacritic={filters.metacritic}
        onChange={handleFilterChange}
      />

      {hasError ? (
        <div className="rounded-lg border border-border bg-muted p-6 text-center text-sm text-muted-foreground">
          {t("browse.failedToLoad")}
        </div>
      ) : null}

      <GameGrid
        games={games}
        isLoading={isLoading}
        emptyMessage={
          activeSearch
            ? t("browse.emptySearch", { query: activeSearch })
            : undefined
        }
      />

      <Pagination
        page={page}
        next={data.next}
        previous={data.previous}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
