"use client";

import type { RawgGameSummary } from "@/lib/rawg";
import { GameCard } from "@/components/game-card";
import { useI18n } from "@/lib/i18n-context";

interface GameGridProps {
  games: RawgGameSummary[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function GameGrid({
  games,
  isLoading = false,
  emptyMessage,
}: GameGridProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[16/10] w-full animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-20 text-center">
        <p className="text-sm text-muted-foreground">
          {emptyMessage ?? t("grid.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
