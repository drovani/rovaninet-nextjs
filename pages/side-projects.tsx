import { GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import SafeMarkdown from "../components/SafeMarkdown";
import SeoHead from "../components/SeoHead";
import { getFileContent } from "../lib/posts";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<SideProjectsProps, Params> = async (
  _
) => {
  const content: SideProjectsProps["content"] = await getFileContent(
    "side-projects"
  );

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
  return (
    <section className="prose max-w-none lg:prose-xl prose-lead:leading-none prose-lead:border-l-2 prose-lead:pl-4 prose-lead:text-base prose-lead:italic">
      <SeoHead
        title="Side Projects"
        description="Side projects and experiments by David Rovani"
        canonicalPath="/side-projects"
      />
      <SafeMarkdown content={content} />
    </section>
  );
};

export default SideProjectsPage;
