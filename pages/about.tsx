import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getFileContent } from "../lib/posts";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<AboutProps, Params> = async (_) => {
  const content: AboutProps["content"] = await getFileContent("about");

  return {
    props: {
      content,
    },
  };
};

interface AboutProps {
  content: string;
}

const AboutPage: NextPage<AboutProps> = ({ content }) => {
  const headtitle = `Rovani's Sandbox | David's Résumé`;
  return (
    <section className="prose max-w-none lg:prose-xl prose-lead:leading-none prose-lead:border-l-2 prose-lead:pl-4 prose-lead:text-base prose-lead:italic">
      <Head>
        <title>{headtitle}</title>
      </Head>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </section>
  );
};

export default AboutPage;
