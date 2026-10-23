"use client";

import Image from "next/image";
import Link from "next/link";
import type { RawgGameSummary } from "@/lib/rawg";
import { rawgTerm } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n-context";
import { MetacriticBadge } from "@/components/metacritic-badge";
import { RatingStars } from "@/components/rating-stars";

interface GameCardProps {
  game: RawgGameSummary;
}

export function GameCard({ game }: GameCardProps) {
  const { locale, t } = useI18n();
  const genres = (game.genres ?? [])
    .slice(0, 2)
    .map((g) => rawgTerm(locale, g.name))
    .join(", ");
  const year = game.released?.slice(0, 4);

  return (
    <Link
      href={`/games/${game.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-colors hover:border-foreground"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            {t("card.noCover")}
          </div>
        )}
        {game.metacritic ? (
          <div className="absolute right-2 top-2">
            <MetacriticBadge score={game.metacritic} />
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold leading-tight">
          {game.name}
        </h3>
        <RatingStars
          rating={game.rating}
          ratingTop={game.rating_top}
          ratingsCount={game.ratings_count}
        />
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {genres || "—"}
        </p>
        {year ? (
          <p className="text-xs text-muted-foreground">{year}</p>
        ) : null}
      </div>
    </Link>
  );
}
