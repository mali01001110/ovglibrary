"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n-context";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <p className="text-5xl font-bold">500</p>
      <p className="text-sm text-muted-foreground">
        {t("error.message")}
      </p>
      <button
        onClick={retry}
        className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground"
      >
        {t("error.retry")}
      </button>
    </main>
  );
}
