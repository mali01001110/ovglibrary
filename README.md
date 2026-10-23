# OVG — Video Game Library

A black-and-white themed Next.js app for browsing, searching, and managing a personal video game library, powered by the [RAWG API](https://rawg.io/apidocs).

## Features

- **Browse** with server-side rendering and client-side fetching via `/api/games`
- **Search** (debounced) and filters: sort, platform, genre, Metacritic score
- **Pagination** driven by RAWG's `next`/`previous` links
- **Game details** at `/games/[id]` (description, screenshots, trailers, series, platforms, stores)
- **Personal library** stored in `localStorage` with statuses: Want to Play, Playing, Completed
- **Dark/light mode** toggle persisted in `localStorage`
- Monochrome design tokens in `app/globals.css`

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your RAWG API key:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and set `rawg_api_key` to your key from [rawg.io/apidocs](https://rawg.io/apidocs). The key stays server-side and is never exposed to the client.

3. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm start` — serve production build
- `npm run lint` — ESLint

## Tech Stack

- [Next.js](https://nextjs.org) (App Router, server components, route handlers)
- [React 19](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com) v4
- [TypeScript](https://www.typescriptlang.org)

## Architecture

- `lib/rawg.ts` — typed RAWG client, query whitelist parsing, key sanitizers
- `lib/library-context.tsx` — React context + `useLibrary` hook, localStorage persistence (`ovg.library.v1`)
- `lib/types.ts` — library types, statuses, labels
- `app/api/games/route.ts`, `app/api/games/[id]/route.ts` — server-side proxies so the API key never reaches the client
- `app/page.tsx` — server-rendered browse page with sanitized initial data
- `app/games/[id]/page.tsx` — game detail (server component), plus `loading.tsx`
- `app/library/page.tsx` + `components/library-view.tsx` — personal library
- `components/` — game-card, game-grid, pagination, filter-bar, search-bar, browse-client, nav-bar, metacritic-badge, add-to-library-button, theme-toggle, footer
- `hooks/use-debounce.ts` — debounce hook for search

The `ECC/` directory holds agent skills and is excluded from compilation via `tsconfig.json` and `eslint.config.mjs`.

## Security Notes

The RAWG API key is used only server-side. Any key in the client bundle is stripped by:

- `fetchRawg` attaching the key only in server route handlers / server components
- `sanitizePageUrl` and `sanitizeListResponse` removing the key from RAWG's pagination URLs before they reach the client
- `parseRawgQuery` whitelisting every query parameter

## Deploy

The easiest way to deploy this app is to push to a GitHub repo and import it in the [Vercel Platform](https://vercel.com/new), then add the `rawg_api_key` environment variable. See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.
