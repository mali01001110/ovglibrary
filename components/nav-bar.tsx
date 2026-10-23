"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLibrary } from "@/lib/library-context";
import { useI18n } from "@/lib/i18n-context";
import { ThemeToggle } from "@/components/theme-toggle";

export function NavBar() {
  const { count } = useLibrary();
  const { t } = useI18n();
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          OVG
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/" className={linkClass(pathname === "/")}>
            {t("nav.browse")}
          </Link>
          <Link href="/library" className={linkClass(pathname === "/library")}>
            {t("nav.library")}
            {count > 0 ? (
              <span className="ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-foreground">
                {count}
              </span>
            ) : null}
          </Link>
          <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
