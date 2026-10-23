"use client";

import { useLibrary } from "@/lib/library-context";
import { useI18n } from "@/lib/i18n-context";
import { rawgTerm, type MessageKey } from "@/lib/i18n";
import { LIBRARY_STATUSES, type LibraryStatus } from "@/lib/types";
import type { RawgGameSummary } from "@/lib/rawg";

interface AddToLibraryButtonProps {
  game: RawgGameSummary;
}

function statusLabelKey(status: LibraryStatus): MessageKey {
  if (status === "want") return "status.want";
  if (status === "playing") return "status.playing";
  return "status.completed";
}

export function AddToLibraryButton({ game }: AddToLibraryButtonProps) {
  const { has, getStatus, add, remove, setStatus } = useLibrary();
  const { locale, t } = useI18n();
  const inLibrary = has(game.id);
  const status = getStatus(game.id);

  const handleAdd = (nextStatus: LibraryStatus) => {
    if (inLibrary) {
      setStatus(game.id, nextStatus);
    } else {
      add(
        {
          id: game.id,
          slug: game.slug,
          name: game.name,
          background_image: game.background_image ?? null,
          released: game.released ?? null,
          metacritic: game.metacritic ?? null,
          genres: (game.genres ?? []).map((g) => ({
            id: g.id,
            name: rawgTerm(locale, g.name),
          })),
          platforms: (game.parent_platforms ?? [])
            .map((p) => p.platform)
            .map((p) => ({ id: p.id, name: p.name })),
        },
        nextStatus
      );
    }
  };

  const removeFromLibrary = () => {
    remove(game.id);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label={t("status.aria")}
        value={inLibrary ? status : ""}
        onChange={(e) => {
          const value = e.target.value as LibraryStatus;
          if (value) handleAdd(value);
        }}
        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground"
      >
        {!inLibrary ? <option value="">{t("status.addLabel")}</option> : null}
        {LIBRARY_STATUSES.map((s) => (
          <option key={s} value={s}>
            {t(statusLabelKey(s))}
          </option>
        ))}
      </select>

      {inLibrary ? (
        <button
          type="button"
          onClick={removeFromLibrary}
          className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          {t("library.remove")}
        </button>
      ) : null}
    </div>
  );
}
