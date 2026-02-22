import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import SafeMarkdown from "../components/SafeMarkdown";
import MediaTracker from "../components/MediaTracker";
import { getMediaTrackerData, MediaItem } from "../lib/media";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<MediaTrackerProps, Params> = async () => {
  const { title, intro, media } = await getMediaTrackerData();
  return {
    props: { title, intro, media },
  };
};

interface MediaTrackerProps {
  title: string;
  intro: string;
  media: MediaItem[];
}

const MediaTrackerPage: NextPage<MediaTrackerProps> = ({ title, intro, media }) => {
  const headtitle = `Rovani's Sandbox | ${title}`;
  return (
    <section>
      <Head>
        <title>{headtitle}</title>
      </Head>
      <div className="prose max-w-none lg:prose-xl prose-lead:leading-none prose-lead:border-l-2 prose-lead:pl-4 prose-lead:text-base prose-lead:italic mb-8">
        <SafeMarkdown content={intro} />
      </div>
      <MediaTracker media={media} />
    </section>
  );
};

export default MediaTrackerPage;
