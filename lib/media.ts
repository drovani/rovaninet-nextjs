import path from "path";
import { memoizedReadFile } from "./memoization";

export type MediaStatus = "watched" | "watching" | "want-to-watch";
export type MediaType = "tv" | "movie";

export interface MediaItem {
  title: string;
  type: MediaType;
  status: MediaStatus;
  rating?: number;
  service?: string;
  watchingWith?: string;
}

const postsDirectory = path.join(process.cwd(), "rovaninet-posts");

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

export async function getMediaTrackerData(): Promise<MediaItem[]> {
  const filePath = path.join(postsDirectory, "media-tracker.csv");
  const fileContent = await memoizedReadFile(filePath);

  const lines = fileContent.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });

    return {
      title: row.title,
      type: (row.type as MediaType) || "tv",
      status: (row.status as MediaStatus) || "want-to-watch",
      rating: row.rating ? parseInt(row.rating, 10) : undefined,
      service: row.service || undefined,
      watchingWith: row.watching_with || undefined,
    };
  });
}
