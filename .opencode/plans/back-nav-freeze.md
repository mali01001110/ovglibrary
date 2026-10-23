# Fix: browser freeze returning home from game detail

## Diagnosis (confirmed by code reading + live CDP browser repro on :3001)

**Primary cause — blocking navigation with zero feedback.**
`app/page.tsx:16` awaits `searchParams` and does a live RAWG `fetch` at the top level of the page, outside `<Suspense`, while `next.config.ts` has `cacheComponents: true`. Next 16 throws on every home render (logged repeatedly: `Error: Route "/": Next.js encountered URL data during prerendering or a navigation`). Any client navigation to `/` therefore **blocks the router** until the full server render (RAWG round-trip) finishes, and because `/` has no `loading.tsx`/`<Suspense>`, the browser stays on the detail page with no indicator. A slow/hung RAWG = indefinite-looking freeze.

**Secondary cause — state/URL race in `components/browse-client.tsx` (reproduced).**
Two effects: (A) URL→state sync (deps `[urlString]`) and (C) state→URL `router.replace` (deps `[activeSearch, filters, page, urlString]`). On a back-nav commit, effect C runs in the same pass with the **stale pre-sync state** and rewrites the URL back to the old query params. Observed in repro: clicking "← Back to browse" (clean `/`) → URL rewritten to `?search=racing&ordering=-metacritic&page=2` → then `page` dropped → cascade of extra `router.replace` navigations, each another blocking server render of `/` (4-6 extra instant-shell console errors after return), skeleton flashes (`cards:0, pulsing:10`).

**Tertiary — redundant refetch on mount.** BrowseClient's fetch effect always fires on mount even though `initialData` is provided → double `/api/games` calls + skeleton flash of the page you just returned to.

Decisions (user-confirmed): **stream via `<Suspense>`** (not `instant = false`); **back link goes to clean home** (client state must clear to match, no URL rewrite).

Out of scope (follow-ups): detail page ~7.5s cold load (`generateMetadata` duplicates the `/games/:id` fetch), LCP image warning.

## Changes

### 1. `app/page.tsx` — stream the dynamic content
- Restructure: keep `<main>` + static shell; move everything dynamic (title/`getLocale`, `await searchParams`, `fetchRawg`, `BrowseClient` or the unable-to-load message) into an async child component wrapped in:
  ```tsx
  <Suspense fallback={<HomeSkeleton />}>
    <HomeContent searchParams={searchParams} />
  </Suspense>
  ```
- `HomeContent` (async server component): `await searchParams` → `parseRawgQuery` → `fetchRawg` → `sanitizeListResponse` → render title + `<BrowseClient>` (or the unable-to-load message on fetch failure), same markup as today.
- Fallback `HomeSkeleton`: header block + the same 10-card pulse grid used by `GameGrid`'s `isLoading` state, so back-nav paints feedback instantly while RAWG streams.
- Per Next 16 docs (`node_modules/next/dist/docs/…/instant-navigation.md`, `migrating-to-cache-components.md`): re-read the relevant guide before writing (AGENTS.md). Do **not** add `instant = false` on the page.
- Leave `export const instant = false` in `app/layout.tsx` untouched.
- Add `app/loading.tsx` (same skeleton) if the docs confirm it still applies under cacheComponents as a belt-and-braces fallback for any blocking path on `/`.

### 2. `components/browse-client.tsx` — fix the sync race + kill redundant fetch
- **Race fix**: add a ref of the last-seen `urlString`. Effect A (URL→state) runs first (declaration order), and when `urlString` changed it syncs state **and** sets `skipWriteRef.current = true`. Effect C (state→URL) computes `qs` as today, but if `skipWriteRef` is set it skips the `router.replace` and clears the flag. Result: URL-driven commits never write back stale state; user-action commits (state changed, URL unchanged) still push to the URL. Converged semantics: back to `/` stays `/`.
- Effect A reads URL params **only** (no `initialQuery` fallback — the `useState` initializers keep using `readFilters(searchParams, initialQuery)` for first mount).
- **Redundant fetch fix**: track `servedKeyRef` = JSON key of the query the current `data` answers (initialized from `initialQuery` + initial page). In the fetch effect, skip the fetch when the inputs key equals `servedKeyRef`; update the ref after each successful load. Mount with matching initial state → skip (no skeleton flash, no double `/api/games`); filter changes → fetch as before.
- Keep `SearchBar`/`FilterBar`/`Pagination` wiring as is.

### 3. Verification (all must pass)
1. **CDP repro re-run** (headless Chromium on :9222, script inline like during diagnosis):
   - home → detail → "← Back to browse": commits < 1s, final URL stays clean `/`, **no subsequent `url-change` events** (no rewrite cascade), no skeleton after commit, no console errors.
   - filtered home → detail → `history.back()`: URL params preserved, same guarantees.
   - main-thread ping stays < 50ms throughout (no freeze).
2. **Dev log** (`/tmp/opencode/next-dev.log`): zero new `instant-shell-url-data` errors after navigating.
3. `npm run lint` and `npm test` pass.
4. `npm run build` succeeds (cacheComponents validation clean).

### Environment notes
- Dev server already running: `npm run dev -- --port 3001` (repo root `/ovglibrary`), `.env.local` has the RAWG key.
- Headless Chromium (temp profile `/tmp/opencode/chrome-profile`, CDP :9222) was started for diagnosis — kill it after verification.
