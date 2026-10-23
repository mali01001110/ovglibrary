"use client";

import { useI18n } from "@/lib/i18n-context";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
        <p>{t("footer.tagline")}</p>
        <p>{t("footer.data")}</p>
        <p>{t("footer.credit")}</p>
      </div>
    </footer>
  );
}
