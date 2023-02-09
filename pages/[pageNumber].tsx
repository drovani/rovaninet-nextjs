import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import PageHeader from "../components/PageHeader";
import PostSnippets from "../components/PostSnippets";
import PostsPager from "../components/PostsPager";
import { getAllPostFileInfo, getSortedPosts, PostComplete } from "../lib/posts";

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
  const posts = await getSortedPosts(pageNumber, 7);
  return {
    props: {
      posts,
      pageNumber,
      maxPages: Math.ceil((await getAllPostFileInfo()).length / 7),
    },
  };
};

interface PostsPageProps {
  posts: PostComplete[];
  pageNumber: number;
  maxPages: number;
}

const PostsPage: NextPage<PostsPageProps> = ({
  posts,
  pageNumber,
  maxPages,
}) => {
  const headtitle = `Rovani's Sandbox | Posts page ${pageNumber}`;

  return (
    <section>
      <Head>
        <title>{headtitle}</title>
      </Head>
      <PageHeader>Blog Posts - Page {pageNumber}</PageHeader>
      <PostsPager currentPage={pageNumber} maxPages={maxPages} />
      <PostSnippets posts={posts} />
    </section>
  );
};
export default PostsPage;
