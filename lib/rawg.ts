const RAWG_BASE = "https://api.rawg.io/api";

export interface RawgPlatform {
  platform: { id: number; slug: string; name: string };
  released_at?: string | null;
  requirements_en?: { minimum?: string; recommended?: string } | null;
}

export interface RawgStore {
  id: number;
  store: { id: number; name: string; slug: string; domain: string };
}

export interface RawgGameSummary {
  id: number;
  slug: string;
  name: string;
  released?: string | null;
  tba?: boolean;
  background_image?: string | null;
  metacritic?: number | null;
  playtime?: number;
  rating?: number;
  rating_top?: number;
  ratings_count?: number;
  genres?: { id: number; name: string; slug: string }[];
  platforms?: RawgPlatform[];
  parent_platforms?: { platform: { id: number; name: string; slug: string } }[];
  esrb_rating?: { id: number; name: string; slug: string } | null;
  short_screenshots?: { id: number; image: string }[];
}

export interface RawgGame extends RawgGameSummary {
  description?: string;
  description_raw?: string;
  website?: string;
  developers?: { id: number; name: string; slug: string }[];
  publishers?: { id: number; name: string; slug: string }[];
  stores?: RawgStore[];
  clip?: unknown;
}

export interface RawgListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGameSummary[];
}

export interface RawgScreenshot {
  id: number;
  image: string;
  width?: number;
  height?: number;
}

export interface RawgGameDetails extends RawgGame {
  screenshots?: RawgScreenshot[];
  movies?: unknown[];
  metacritic_platforms?: unknown[];
  reddit_count?: number;
  twitch_count?: number;
  youtube_count?: number;
  reviews_count?: number;
}

export interface RawgGameTrailers {
  count: number;
  next: string | null;
  previous: string | null;
  results: { id: number; name: string; preview: string; data: Record<string, string> }[];
}

export interface RawgScreenshotsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgScreenshot[];
}

const RAWG_ORDERING = [
  "name",
  "-name",
  "released",
  "-released",
  "added",
  "-added",
  "created",
  "-created",
  "updated",
  "-updated",
  "rating",
  "-rating",
  "metacritic",
  "-metacritic",
] as const;

const RAWG_DATES = ["2025-01-01,2025-12-31", "2025-01-01,2026-12-31", "2024-01-01,2025-12-31"] as const;

const RAWG_METACRITIC = ["0", "40", "75", "80", "85", "90", "95"] as const;

const RAWG_PLATFORM_IDS = ["4", "18", "1", "186", "7", "3", "187", "19", "21"] as const;

const RAWG_GENRE_IDS = [
  "4",
  "51",
  "3",
  "5",
  "10",
  "2",
  "40",
  "14",
  "7",
  "11",
  "83",
  "1",
  "15",
  "6",
  "59",
  "19",
  "28",
  "34",
  "17",
  "18",
] as const;

export type RawgQuery = {
  search?: string;
  page?: string;
  ordering?: string;
  platforms?: string;
  genres?: string;
  metacritic?: string;
  dates?: string;
  page_size?: string;
};

export function parseRawgQuery(params: URLSearchParams): RawgQuery {
  const query: RawgQuery = {};

  const search = params.get("search");
  if (search && search.trim().length > 0) {
    query.search = search.trim().slice(0, 100);
  }

  const page = params.get("page");
  if (page && /^\d+$/.test(page)) {
    const p = Number(page);
    query.page = String(Math.max(1, Math.min(p, 500)));
  }

  const pageSize = params.get("page_size");
  if (pageSize && /^\d+$/.test(pageSize)) {
    const s = Number(pageSize);
    query.page_size = String(Math.max(1, Math.min(s, 40)));
  }

  const ordering = params.get("ordering");
  if (ordering && (RAWG_ORDERING as readonly string[]).includes(ordering)) {
    query.ordering = ordering;
  }

  const platforms = params.get("platforms");
  if (platforms && /^[\d,]+$/.test(platforms)) {
    const valid = platforms
      .split(",")
      .filter((p) => (RAWG_PLATFORM_IDS as readonly string[]).includes(p))
      .join(",");
    if (valid) query.platforms = valid;
  }

  const genres = params.get("genres");
  if (genres && /^[\d,]+$/.test(genres)) {
    const valid = genres
      .split(",")
      .filter((g) => (RAWG_GENRE_IDS as readonly string[]).includes(g))
      .join(",");
    if (valid) query.genres = valid;
  }

  const metacritic = params.get("metacritic");
  if (metacritic && (RAWG_METACRITIC as readonly string[]).includes(metacritic)) {
    query.metacritic = metacritic;
  }

  const dates = params.get("dates");
  if (dates && (RAWG_DATES as readonly string[]).includes(dates)) {
    query.dates = dates;
  }

  return query;
}

function getApiKey(): string {
  const key = process.env.rawg_api_key;
  if (!key) {
    throw new Error("rawg_api_key is not configured in the environment.");
  }
  return key;
}

export async function fetchRawg<T>(
  path: string,
  query: Record<string, string> = {}
): Promise<T> {
  const key = getApiKey();
  const url = new URL(`${RAWG_BASE}${path}`);
  url.searchParams.set("key", key);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== "") {
      url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`RAWG API error: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

export function sanitizePageUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("key");
    parsed.searchParams.delete("page_size");
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return null;
  }
}

export function sanitizeListResponse<T extends { next: string | null; previous: string | null }>(
  data: T
): T {
  return {
    ...data,
    next: sanitizePageUrl(data.next),
    previous: sanitizePageUrl(data.previous),
  };
}

export const ALLOWED_PLATFORM_IDS = RAWG_PLATFORM_IDS;
export const ALLOWED_GENRE_IDS = RAWG_GENRE_IDS;
export const ALLOWED_ORDERING = RAWG_ORDERING;
export const ALLOWED_DATES = RAWG_DATES;
export const ALLOWED_METACRITIC = RAWG_METACRITIC;
