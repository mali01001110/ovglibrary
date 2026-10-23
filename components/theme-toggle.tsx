"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n-context";

const THEME_KEY = "ovg.theme";

function getInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);
  const { t } = useI18n();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
      className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-foreground"
    >
      {theme === "dark" ? t("theme.light") : t("theme.dark")}
    </button>
  );
}
