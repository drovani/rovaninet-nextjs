import { GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import SafeMarkdown from "../components/SafeMarkdown";
import SeoHead from "../components/SeoHead";
import { getFileContent } from "../lib/posts";

interface Params extends ParsedUrlQuery { }

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
  return (
    <section className="prose max-w-none lg:prose-xl prose-lead:leading-none prose-lead:border-l-2 prose-lead:pl-4 prose-lead:text-base prose-lead:italic">
      <SeoHead
        title="About"
        description="David Rovani - Technology Leadership and Strategic Innovation"
        canonicalPath="/about"
      />
      <SafeMarkdown content={content} />
    </section>
  );
};

export default AboutPage;
