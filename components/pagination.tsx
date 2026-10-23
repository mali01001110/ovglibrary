"use client";

import { useI18n } from "@/lib/i18n-context";

interface PaginationProps {
  page: number;
  next: string | null;
  previous: string | null;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  next,
  previous,
  onPageChange,
}: PaginationProps) {
  const { t } = useI18n();
  const canPrev = page > 1 && previous !== null;
  const canNext = next !== null;

  return (
    <nav className="flex items-center justify-between gap-4" aria-label={t("pagination.aria")}>
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => onPageChange(page - 1)}
        className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("pagination.prev")}
      </button>
      <span className="text-sm text-muted-foreground">
        {t("pagination.page", { page })}
      </span>
      <button
        type="button"
        disabled={!canNext}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("pagination.next")}
      </button>
    </nav>
  );
}
