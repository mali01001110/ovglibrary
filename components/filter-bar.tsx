"use client";

import { useI18n } from "@/lib/i18n-context";
import type { MessageKey } from "@/lib/i18n";

interface FilterBarProps {
  ordering: string;
  platforms: string;
  genres: string;
  metacritic: string;
  onChange: (updates: {
    ordering?: string;
    platforms?: string;
    genres?: string;
    metacritic?: string;
    page?: number;
  }) => void;
}

const ORDERING_OPTIONS = [
  { value: "-added", labelKey: "sort.added" },
  { value: "-rating", labelKey: "sort.rating" },
  { value: "-metacritic", labelKey: "sort.metacritic" },
  { value: "-released", labelKey: "sort.released" },
  { value: "name", labelKey: "sort.name" },
] as const;

const PLATFORM_OPTIONS = [
  { value: "4", labelKey: "platform.pc" },
  { value: "187", labelKey: "platform.ps5" },
  { value: "18", labelKey: "platform.ps4" },
  { value: "1", labelKey: "platform.xboxOne" },
  { value: "186", labelKey: "platform.xboxSeries" },
  { value: "7", labelKey: "platform.switch" },
  { value: "3", labelKey: "platform.ios" },
  { value: "21", labelKey: "platform.android" },
] as const;

const GENRE_OPTIONS = [
  { value: "4", labelKey: "genre.action" },
  { value: "51", labelKey: "genre.indie" },
  { value: "3", labelKey: "genre.adventure" },
  { value: "5", labelKey: "genre.rpg" },
  { value: "10", labelKey: "genre.strategy" },
  { value: "2", labelKey: "genre.shooter" },
  { value: "40", labelKey: "genre.casual" },
  { value: "14", labelKey: "genre.simulation" },
  { value: "7", labelKey: "genre.puzzle" },
  { value: "11", labelKey: "genre.arcade" },
  { value: "1", labelKey: "genre.racing" },
  { value: "15", labelKey: "genre.sports" },
] as const satisfies readonly { value: string; labelKey: MessageKey }[];

const METACRITIC_OPTIONS = [
  { value: "90", label: "90+" },
  { value: "85", label: "85+" },
  { value: "80", label: "80+" },
  { value: "75", label: "75+" },
  { value: "40", label: "40+" },
];

const selectClass =
  "rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none transition-colors focus:border-foreground";

export function FilterBar({
  ordering,
  platforms,
  genres,
  metacritic,
  onChange,
}: FilterBarProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className={selectClass}
        value={ordering}
        aria-label={t("filter.sortAria")}
        onChange={(e) => onChange({ ordering: e.target.value, page: 1 })}
      >
        <option value="">{t("sort.default")}</option>
        {ORDERING_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {t(o.labelKey)}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={platforms}
        aria-label={t("filter.platformAria")}
        onChange={(e) => onChange({ platforms: e.target.value, page: 1 })}
      >
        <option value="">{t("platform.all")}</option>
        {PLATFORM_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {t(o.labelKey)}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={genres}
        aria-label={t("filter.genreAria")}
        onChange={(e) => onChange({ genres: e.target.value, page: 1 })}
      >
        <option value="">{t("genre.all")}</option>
        {GENRE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {t(o.labelKey)}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={metacritic}
        aria-label={t("filter.metacriticAria")}
        onChange={(e) => onChange({ metacritic: e.target.value, page: 1 })}
      >
        <option value="">{t("metacriticFilter.any")}</option>
        {METACRITIC_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
