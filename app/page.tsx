import { Suspense } from "react";
import {
  fetchRawg,
  parseRawgQuery,
  sanitizeListResponse,
  type RawgListResponse,
} from "@/lib/rawg";
import { getLocale } from "@/lib/cookies";
import { t } from "@/lib/i18n";
import { BrowseClient } from "@/components/browse-client";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function HomeContent({
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
    <>
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
    </>
  );
}

function HomeSkeleton() {
  return (
    <>
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[16/10] w-full animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    </>
  );
}
