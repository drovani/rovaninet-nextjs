import path from "path";
import { memoizedReadFile } from "./memoization";
import { parse as parseYaml } from "yaml";

export type MediaStatus = "watched" | "watching" | "want-to-watch";
export type MediaType = "tv" | "movie";

export interface MediaItem {
  title: string;
  type: MediaType;
  status: MediaStatus;
  rating?: number; // 1-5
}

export interface MediaTrackerData {
  title: string;
  intro: string;
  media: MediaItem[];
}

const postsDirectory = path.join(process.cwd(), "rovaninet-posts");

export async function getMediaTrackerData(): Promise<MediaTrackerData> {
  const filePath = path.join(postsDirectory, "media-tracker.md");
  const fileContent = await memoizedReadFile(filePath);

  // Split frontmatter from content
  const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!frontmatterMatch) {
    throw new Error("media-tracker.md must have YAML frontmatter");
  }

  const frontmatter = parseYaml(frontmatterMatch[1]) as {
    title: string;
    media: MediaItem[];
  };
  const intro = frontmatterMatch[2].trim();

  return {
    title: frontmatter.title || "Media Tracker",
    intro,
    media: (frontmatter.media || []).map((item) => ({
      title: item.title,
      type: item.type || "tv",
      status: item.status || "want-to-watch",
      rating: item.rating,
    })),
  };
}
