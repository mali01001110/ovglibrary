import {
  fetchRawg,
  parseRawgQuery,
  sanitizeListResponse,
  type RawgListResponse,
} from "@/lib/rawg";
import { getLocale } from "@/lib/cookies";
import { t } from "@/lib/i18n";
import { BrowseClient } from "@/components/browse-client";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      sp.set(key, value);
    }
  }
  const query = parseRawgQuery(sp);
  query.page_size = "20";

  let initialData: RawgListResponse | null = null;
  try {
    const data = await fetchRawg<RawgListResponse>("/games", query);
    initialData = sanitizeListResponse(data);
  } catch {
    initialData = null;
  }

  const initialQuery = {
    search: query.search,
    ordering: query.ordering,
    platforms: query.platforms,
    genres: query.genres,
    metacritic: query.metacritic,
    page: query.page,
  };

  const locale = await getLocale();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t(locale, "home.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(locale, "home.subtitle")}
        </p>
      </div>

      {initialData ? (
        <BrowseClient
          initialData={initialData}
          initialQuery={initialQuery}
        />
      ) : (
        <div className="rounded-lg border border-border bg-muted p-6 text-center text-sm text-muted-foreground">
          {t(locale, "home.unableToLoad")}
        </div>
      )}
    </main>
  );
}
