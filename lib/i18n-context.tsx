"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  isLocale,
  t as translate,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  type Locale,
  type MessageKey,
} from "@/lib/i18n";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Adopt a persisted preference that differs from the server-rendered cookie.
  useEffect(() => {
    let cancelled = false;
    const adopt = async () => {
      let stored: string | null = null;
      try {
        stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      } catch {
        stored = null;
      }
      if (!cancelled && isLocale(stored) && stored !== initialLocale) {
        setLocaleState(stored);
        document.documentElement.lang = stored;
      }
    };
    void adopt();
    return () => {
      cancelled = true;
    };
  }, [initialLocale]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      document.documentElement.lang = next;
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
      router.refresh();
    },
    [router]
  );

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
