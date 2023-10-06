import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import ReactMarkdown from "react-markdown";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { getFileContent } from "../lib/posts";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<MediaConsumptionProps, Params> = async (_) => {
  const content: MediaConsumptionProps["content"] = await getFileContent("media-consumption");

  return {
    props: {
      content,
    },
  };
};

interface MediaConsumptionProps {
  content: string;
}

const MediaConsumptionPage: NextPage<MediaConsumptionProps> = ({ content }) => {
  const headtitle = `Rovani's Sandbox | Media Consumption`;
  return (
    <section className="prose max-w-none lg:prose-xl prose-lead:leading-none prose-lead:border-l-2 prose-lead:pl-4 prose-lead:text-base prose-lead:italic">
      <Head>
        <title>{headtitle}</title>
      </Head>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkFrontmatter]} children={content} />
    </section>
  );
};

export default MediaConsumptionPage;
