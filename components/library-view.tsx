"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLibrary } from "@/lib/library-context";
import { useI18n } from "@/lib/i18n-context";
import { rawgTerm, type MessageKey } from "@/lib/i18n";
import {
  LIBRARY_STATUSES,
  type LibraryEntry,
  type LibraryStatus,
} from "@/lib/types";
import { MetacriticBadge } from "@/components/metacritic-badge";

const FILTER_ALL = "all" as const;
type Filter = LibraryStatus | typeof FILTER_ALL;

function statusLabelKey(status: LibraryStatus): MessageKey {
  if (status === "want") return "status.want";
  if (status === "playing") return "status.playing";
  return "status.completed";
}

function LibraryCard({
  entry,
  onChangeStatus,
  onRemove,
}: {
  entry: LibraryEntry;
  onChangeStatus: (status: LibraryStatus) => void;
  onRemove: () => void;
}) {
  const { locale, t } = useI18n();
  const year = entry.released?.slice(0, 4);
  const genres = entry.genres
    .map((g) => rawgTerm(locale, g.name))
    .join(", ");

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-colors hover:border-foreground">
      <Link href={`/games/${entry.id}`} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {entry.background_image ? (
            <Image
              src={entry.background_image}
              alt={entry.name}
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
          {entry.metacritic ? (
            <div className="absolute right-2 top-2">
              <MetacriticBadge score={entry.metacritic} />
            </div>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/games/${entry.id}`}>
          <h3 className="line-clamp-1 text-sm font-semibold leading-tight hover:underline">
            {entry.name}
          </h3>
        </Link>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {genres || "—"}
          {year ? ` · ${year}` : ""}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-1">
          <select
            aria-label={t("library.statusFor", { name: entry.name })}
            value={entry.status}
            onChange={(e) => onChangeStatus(e.target.value as LibraryStatus)}
            className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs outline-none transition-colors focus:border-foreground"
          >
            {LIBRARY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(statusLabelKey(s))}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onRemove}
            aria-label={t("library.removeAria", { name: entry.name })}
            className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            {t("library.remove")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LibraryView() {
  const { list, countByStatus, setStatus, remove } = useLibrary();
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>(FILTER_ALL);

  const filters: { value: Filter; label: string }[] = [
    { value: FILTER_ALL, label: t("library.all") },
    ...LIBRARY_STATUSES.map((s) => ({
      value: s as Filter,
      label: t(statusLabelKey(s)),
    })),
  ];

  const filtered =
    filter === FILTER_ALL ? list : list.filter((e) => e.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("library.statusAria")}>
        {filters.map((f) => {
          const count = f.value === FILTER_ALL ? list.length : countByStatus[f.value];
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.value)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-20 text-center">
          <p className="text-sm text-muted-foreground">{t("library.empty")}</p>
          <Link
            href="/"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground"
          >
            {t("library.emptyBrowse")}
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {t("library.emptyStatus")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((entry) => (
            <LibraryCard
              key={entry.id}
              entry={entry}
              onChangeStatus={(status) => setStatus(entry.id, status)}
              onRemove={() => remove(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
