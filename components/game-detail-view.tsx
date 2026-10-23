"use client";

import Image from "next/image";
import Link from "next/link";
import type { RawgGameDetails, RawgListResponse } from "@/lib/rawg";
import { rawgTerm } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n-context";
import { GameGrid } from "@/components/game-grid";
import { AddToLibraryButton } from "@/components/add-to-library-button";
import { MetacriticBadge } from "@/components/metacritic-badge";
import { RatingStars } from "@/components/rating-stars";

interface GameDetailViewProps {
  game: RawgGameDetails;
  screenshots: string[];
  similar: RawgListResponse | null;
  trailers: { name: string; url: string; preview: string }[];
}

export function GameDetailView({
  game,
  screenshots,
  similar,
  trailers,
}: GameDetailViewProps) {
  const { locale, t } = useI18n();

  const platforms = (game.platforms ?? []).map((p) => p.platform.name);
  const genres = (game.genres ?? []).map((g) => rawgTerm(locale, g.name));
  const stores = (game.stores ?? []).map((s) => s.store);
  const developers = (game.developers ?? []).map((d) => d.name);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {t("detail.back")}
      </Link>

      <article className="mt-4 flex flex-col gap-8">
        {/* Hero */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted">
            {game.background_image ? (
              <Image
                src={game.background_image}
                alt={game.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                {t("detail.noCover")}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {game.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {game.metacritic ? <MetacriticBadge score={game.metacritic} /> : null}
                <RatingStars
                  rating={game.rating}
                  ratingTop={game.rating_top}
                  ratingsCount={game.ratings_count}
                  showCount
                />
                <span className="text-sm text-muted-foreground">
                  {game.released ?? t("detail.tba")}
                </span>
                {game.esrb_rating?.name ? (
                  <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {game.esrb_rating.name}
                  </span>
                ) : null}
              </div>
            </div>

            {game.description_raw ? (
              <p className="line-clamp-6 text-sm leading-relaxed text-muted-foreground">
                {game.description_raw}
              </p>
            ) : null}

            <AddToLibraryButton game={game} />

            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              {genres.length ? (
                <div>
                  <dt className="font-medium">{t("detail.genres")}</dt>
                  <dd className="text-muted-foreground">{genres.join(", ")}</dd>
                </div>
              ) : null}
              {platforms.length ? (
                <div>
                  <dt className="font-medium">{t("detail.platforms")}</dt>
                  <dd className="text-muted-foreground">{platforms.join(", ")}</dd>
                </div>
              ) : null}
              {game.playtime ? (
                <div>
                  <dt className="font-medium">{t("detail.playtime")}</dt>
                  <dd className="text-muted-foreground">
                    {t("detail.playtimeHours", { hours: game.playtime })}
                  </dd>
                </div>
              ) : null}
              {developers.length ? (
                <div>
                  <dt className="font-medium">{t("detail.developers")}</dt>
                  <dd className="text-muted-foreground">
                    {developers.join(", ")}
                  </dd>
                </div>
              ) : null}
              {stores.length ? (
                <div>
                  <dt className="font-medium">{t("detail.stores")}</dt>
                  <dd className="text-muted-foreground">
                    {stores.map((s) => s.name).join(", ")}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </section>

        {/* Description */}
        {game.description_raw ? (
          <section>
            <h2 className="mb-2 text-lg font-semibold">{t("detail.about")}</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {game.description_raw}
            </p>
          </section>
        ) : null}

        {/* Trailers */}
        {trailers.length ? (
          <section>
            <h2 className="mb-3 text-lg font-semibold">{t("detail.trailers")}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {trailers.map((trailer, i) => (
                <div
                  key={`${trailer.name}-${i}`}
                  className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <video
                    src={trailer.url}
                    poster={trailer.preview}
                    controls
                    preload="none"
                    className="h-full w-full object-cover"
                  >
                    <track kind="captions" />
                    {t("detail.videoFallback")}
                  </video>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Screenshots */}
        {screenshots.length ? (
          <section>
            <h2 className="mb-3 text-lg font-semibold">
              {t("detail.screenshots")}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {screenshots.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <Image
                    src={src}
                    alt={t("detail.screenshotAlt", { name: game.name, index: i + 1 })}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Similar games */}
        {similar && similar.results.length ? (
          <section>
            <h2 className="mb-3 text-lg font-semibold">{t("detail.series")}</h2>
            <GameGrid games={similar.results} />
          </section>
        ) : null}
      </article>
    </main>
  );
}
