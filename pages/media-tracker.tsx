import { GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import MediaTracker from "../components/MediaTracker";
import SeoHead from "../components/SeoHead";
import { getMediaTrackerData, MediaItem } from "../lib/media";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<MediaTrackerProps, Params> = async () => {
  const media = await getMediaTrackerData();
  return {
    props: { media, lastUpdated: new Date().toISOString() },
  };
};

interface MediaTrackerProps {
  media: MediaItem[];
  lastUpdated: string;
}

const MediaTrackerPage: NextPage<MediaTrackerProps> = ({ media, lastUpdated }) => {
  const formattedDate = new Date(lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section>
      <SeoHead
        title="Media Tracker"
        description="Tracking what David Rovani is watching, has watched, and wants to watch"
        canonicalPath="/media-tracker"
      />
      <h1 className="text-3xl font-bold mb-2">Media Tracker</h1>
      <p className="text-gray-600 mb-6">
        Keeping track of what I&apos;m watching, have watched, and want to watch.
      </p>
      <MediaTracker media={media} />
      <p className="text-sm text-gray-400 mt-6">
        Last updated: {formattedDate}
      </p>
    </section>
  );
};

export default MediaTrackerPage;
