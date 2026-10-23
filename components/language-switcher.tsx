"use client";

import { useI18n } from "@/lib/i18n-context";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "fr" : "en")}
      className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
      aria-label={
        locale === "en" ? t("lang.switchToFr") : t("lang.switchToEn")
      }
    >
      {locale.toUpperCase()}
    </button>
  );
}
