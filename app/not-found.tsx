import Link from "next/link";
import { getLocale } from "@/lib/cookies";
import { t } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <p className="text-5xl font-bold">404</p>
      <p className="text-sm text-muted-foreground">
        {t(locale, "notFound.message")}
      </p>
      <Link
        href="/"
        className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground"
      >
        {t(locale, "notFound.back")}
      </Link>
    </main>
  );
}
