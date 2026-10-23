"use client";

import { useI18n } from "@/lib/i18n-context";
import type { MessageKey } from "@/lib/i18n";

interface MetacriticBadgeProps {
  score?: number | null;
}

export function scoreLabel(score?: number | null): string {
  if (!score) return "";
  if (score >= 90) return "Universal Acclaim";
  if (score >= 75) return "Generally Favorable";
  if (score >= 60) return "Mixed or Average";
  return "Generally Unfavorable";
}

export function scoreLabelKey(score: number): MessageKey {
  if (score >= 90) return "metacritic.acclaim";
  if (score >= 75) return "metacritic.favorable";
  if (score >= 60) return "metacritic.mixed";
  return "metacritic.unfavorable";
}

export function MetacriticBadge({ score }: MetacriticBadgeProps) {
  const { t } = useI18n();
  if (!score) {
    return (
      <span className="inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
        —
      </span>
    );
  }
  return (
    <span
      title={t(scoreLabelKey(score))}
      className="inline-flex items-center rounded border border-foreground bg-foreground px-1.5 py-0.5 text-[10px] font-bold text-background"
    >
      {score}
    </span>
  );
}
