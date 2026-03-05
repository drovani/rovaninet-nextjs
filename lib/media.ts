import Papa from "papaparse";
import path from "path";
import { memoizedReadFile } from "./memoization";

export type MediaStatus = "watched" | "watching" | "waiting" | "want-to-watch";
export type MediaType = "tv" | "movie" | "miniseries";

export interface MediaItem {
  title: string;
  type: MediaType;
  status: MediaStatus;
  rating: number | null;
  service: string | null;
  watchingWith: string | null;
  season: string | null;
  notes: string | null;
}

const postsDirectory = path.join(process.cwd(), "rovaninet-posts");

export async function getMediaTrackerData(): Promise<MediaItem[]> {
  const filePath = path.join(postsDirectory, "media-tracker.csv");
  const fileContent = await memoizedReadFile(filePath);

  const { data } = Papa.parse<Record<string, string>>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  return data.map((row) => ({
    title: row.title,
    type: (row.type as MediaType) || "tv",
    status: (row.status as MediaStatus) || "want-to-watch",
    rating: row.rating ? parseFloat(row.rating) : null,
    service: row.service || null,
    watchingWith: row.watching_with || null,
    season: row.season || null,
    notes: row.notes || null,
  }));
}
