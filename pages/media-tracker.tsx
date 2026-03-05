import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import MediaTracker from "../components/MediaTracker";
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
      <Head>
        <title>Media Tracker | Rovani&apos;s Sandbox</title>
      </Head>
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
