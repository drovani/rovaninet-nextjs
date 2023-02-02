import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { getAboutContent } from "../lib/posts";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<AboutProps, Params> = async (_) => {
  const content: AboutProps["content"] = await getAboutContent();

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
  return (
    <section className="prose mx-auto lg:prose-xl">
      <Head>
        <title>Rovani&apos;s Sandbox</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </section>
  );
};

export default AboutPage;
