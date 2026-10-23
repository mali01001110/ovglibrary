import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchRawg,
  sanitizeListResponse,
  type RawgGameDetails,
  type RawgGameTrailers,
  type RawgScreenshotsResponse,
  type RawgListResponse,
} from "@/lib/rawg";
import { GameDetailView } from "@/components/game-detail-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return {};
  }

  let game: RawgGameDetails | null = null;
  try {
    game = await fetchRawg<RawgGameDetails>(`/games/${id}`);
  } catch {
    // fall through to generic metadata
  }

  if (!game) {
    return {};
  }

  const title = `${game.name} — OVG`;
  const description = game.description_raw?.slice(0, 160) ?? `Game details for ${game.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: game.background_image
        ? [{ url: game.background_image, alt: game.name }]
        : undefined,
    },
  };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  let game: RawgGameDetails | null = null;
  let screenshots: string[] = [];
  let similar: RawgListResponse | null = null;
  let trailers: { name: string; url: string; preview: string }[] = [];

  const [gameRes, shotsRes, seriesRes, moviesRes] = await Promise.allSettled([
    fetchRawg<RawgGameDetails>(`/games/${id}`),
    fetchRawg<RawgScreenshotsResponse>(`/games/${id}/screenshots`),
    fetchRawg<RawgListResponse>(`/games/${id}/game-series`),
    fetchRawg<RawgGameTrailers>(`/games/${id}/movies`),
  ]);

  if (gameRes.status === "fulfilled") {
    game = gameRes.value;
  }
  if (shotsRes.status === "fulfilled") {
    screenshots = (shotsRes.value.results ?? []).map((s) => s.image);
  }
  if (seriesRes.status === "fulfilled") {
    similar = sanitizeListResponse(seriesRes.value);
  }
  if (moviesRes.status === "fulfilled") {
    trailers = (moviesRes.value.results ?? [])
      .map((movie) => {
        const url =
          movie.data.max ?? movie.data["480"] ?? movie.data[Object.keys(movie.data)[0]];
        return url ? { name: movie.name, url, preview: movie.preview } : null;
      })
      .filter((t): t is { name: string; url: string; preview: string } => t !== null);
  }

  if (!game) {
    notFound();
  }

  return (
    <GameDetailView
      game={game}
      screenshots={screenshots}
      similar={similar}
      trailers={trailers}
    />
  );
}
