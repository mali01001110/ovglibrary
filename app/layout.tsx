import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LibraryProvider } from "@/lib/library-context";
import { I18nProvider } from "@/lib/i18n-context";
import { getLocale } from "@/lib/cookies";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OVG — Video Game Library",
  description: "Browse, search, and manage your personal video game library powered by the RAWG API.",
};

export const instant = false;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black dark:bg-black dark:text-white">
        <I18nProvider initialLocale={locale}>
          <LibraryProvider>
            <NavBar />
            {children}
            <Footer />
          </LibraryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
