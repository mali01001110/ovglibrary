export type LibraryStatus = "want" | "playing" | "completed";

export const LIBRARY_STATUSES: LibraryStatus[] = ["want", "playing", "completed"];

export const LIBRARY_STATUS_LABELS: Record<LibraryStatus, string> = {
  want: "Want to Play",
  playing: "Playing",
  completed: "Completed",
};

export interface LibraryEntry {
  id: number;
  slug: string;
  name: string;
  background_image?: string | null;
  released?: string | null;
  metacritic?: number | null;
  genres: { id: number; name: string }[];
  platforms: { id: number; name: string }[];
  addedAt: number;
  status: LibraryStatus;
}

export interface LibraryState {
  entries: Record<number, LibraryEntry>;
}
