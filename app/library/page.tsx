import type { Metadata } from "next";
import { getLocale } from "@/lib/cookies";
import { t } from "@/lib/i18n";
import { LibraryView } from "@/components/library-view";

export const metadata: Metadata = {
  title: "Library — OVG",
  description: "Your saved video game library.",
};

export default async function LibraryPage() {
  const locale = await getLocale();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t(locale, "library.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(locale, "library.subtitle")}
        </p>
      </div>
      <LibraryView />
    </main>
  );
}
