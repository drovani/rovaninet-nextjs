import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import PostsSection from "../components/PostsSection";
import {
  getAllPostFileInfo, getPostsSorted,
  PostSummary, toPostSummaries
} from "../lib/posts";

interface Params extends ParsedUrlQuery {
  pageNumber: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async (_) => {
  const maxPages = Math.ceil((await getAllPostFileInfo()).length / 7);
  const paths = [...Array(maxPages)].map((_, i) => ({
    params: {
      pageNumber: (i + 1).toString(),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostsPageProps, Params> = async ({
  params,
}) => {
  const pageNumber = Number.parseInt(params.pageNumber);
  const posts = await getPostsSorted(pageNumber, 7);
  return {
    props: {
      posts: toPostSummaries(posts),
      pageNumber,
      maxPages: Math.ceil((await getAllPostFileInfo()).length / 7),
    },
  };
};

interface PostsPageProps {
  posts: PostSummary[];
  pageNumber: number;
  maxPages: number;
}

const PostsPage: NextPage<PostsPageProps> = ({
  posts,
  pageNumber,
  maxPages,
}) => {
  const headtitle = `Rovani's Sandbox | Blog Posts page ${pageNumber}`;

  return (
    <section>
      <Head>
        <title>{headtitle}</title>
      </Head>
      <PostsSection
        posts={posts}
        currentPage={pageNumber}
        maxPages={maxPages}
        header={`Blog Posts - Page ${pageNumber}`}
      />
    </section>
  );
};
export default PostsPage;
