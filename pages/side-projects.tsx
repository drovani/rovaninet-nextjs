import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getFileContent } from "../lib/posts";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<SideProjectsProps, Params> = async (_) => {
  const content: SideProjectsProps["content"] = await getFileContent("side-projects");

  return {
    props: {
      content,
    },
  };
};

interface SideProjectsProps {
  content: string;
}

const SideProjectsPage: NextPage<SideProjectsProps> = ({ content }) => {
  const headtitle = `Rovani's Sandbox | Side Projects`;
  return (
    <section className="prose max-w-none lg:prose-xl prose-lead:leading-none prose-lead:border-l-2 prose-lead:pl-4 prose-lead:text-base prose-lead:italic">
      <Head>
        <title>{headtitle}</title>
      </Head>
      <ReactMarkdown remarkPlugins={[remarkGfm]} children={content} />
    </section>
  );
};

export default SideProjectsPage;
