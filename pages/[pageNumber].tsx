import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import Header from "../components/PageHeader";
import PostSnippets from "../components/PostSnippets";
import PostsPager from "../components/PostsPager";
import {
    getAllPostParams,
    getSortedPostsData,
    PostFrontMatter
} from "../lib/posts";

interface Params extends ParsedUrlQuery {
  pageNumber: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async (_) => {
  const maxPages = Math.ceil(getAllPostParams().length / 7);
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
  const posts = getSortedPostsData(pageNumber, 7);
  return {
    props: {
      posts,
      pageNumber,
      maxPages: Math.ceil(getAllPostParams().length / 7),
    },
  };
};

interface PostsPageProps {
  posts: PostFrontMatter[];
  pageNumber: number;
  maxPages: number;
}

const PostsPage: NextPage<PostsPageProps> = ({
  posts,
  pageNumber,
  maxPages,
}) => {
  return (
    <section>
      <Header>Page {pageNumber}</Header>
      <PostsPager currentPage={pageNumber} maxPages={maxPages} />

      <PostSnippets posts={posts} />
    </section>
  );
};
export default PostsPage;
