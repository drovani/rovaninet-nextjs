import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import MediaTracker from "../components/MediaTracker";
import { getMediaTrackerData, MediaItem } from "../lib/media";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<MediaTrackerProps, Params> = async () => {
  const media = await getMediaTrackerData();
  return {
    props: { media },
  };
};

interface MediaTrackerProps {
  media: MediaItem[];
}

const MediaTrackerPage: NextPage<MediaTrackerProps> = ({ media }) => {
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
    </section>
  );
};

export default MediaTrackerPage;
