import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import type { ParsedUrlQuery } from "querystring";
import PageHeader from "../../../components/PageHeader";
import SafeMarkdown from "../../../components/SafeMarkdown";
import { getAllPostFileInfo, getPostFromSlugYear } from "../../../lib/posts";

interface Params extends ParsedUrlQuery {
  slug: string;
  year: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = (await getAllPostFileInfo()).map(({ slug, year }) => ({
    params: {
      slug,
      year: year.toString(),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostProps, Params> = async ({
  params,
}) => {
  const post: PostProps = await getPostFromSlugYear(params.slug, params.year);
  return {
    props: post,
  };
};

interface PostProps {
  frontmatter: {
    title: string;
    [key: string]: any;
  };
  slug: string;
  year: string;
  contentHtml: string;
  contentMarkdown?: string;
}

const PostPage: NextPage<PostProps> = ({ frontmatter, contentHtml, contentMarkdown }) => {
  const title = `Rovani's Sandbox | ${frontmatter.title}`;
  return (
    <div className="prose max-w-none mx-auto lg:prose-xl">
      <Head>
        <title>{title}</title>
      </Head>
      <PageHeader className="text-center sm:text-left">{frontmatter.title}</PageHeader>
      {contentMarkdown ? (
        <SafeMarkdown content={contentMarkdown} className="prose-content" />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      )}
      <div className="giscus border-sky-100 border p-1 rounded"></div>
      <Script src="https://giscus.app/client.js"
        id="giscuss"
        data-repo="drovani/rovaninet-posts"
        data-repo-id="R_kgDOJBTWqw"
        data-category="General"
        data-category-id="DIC_kwDOJBTWq84Cnvcy"
        data-mapping="title"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="en"
        data-loading="lazy"
        crossOrigin="anonymous"
        async>
      </Script>
    </div>
  );
};

export default PostPage;
