import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { getMarkdownContent } from "../lib/posts";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<AboutProps, Params> = async (_) => {
  const content: AboutProps["content"] = await getMarkdownContent("about");

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
    <section className="prose mx-auto lg:prose-xl prose-lead:leading-none prose-lead:border-l-2 prose-lead:pl-4 prose-lead:text-base prose-lead:italic">
      <Head>
        <title>{headtitle}</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </section>
  );
};

export default AboutPage;
