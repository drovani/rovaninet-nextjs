import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import Header from "../../components/PageHeader";
import PostSnippets from "../../components/PostSnippets";
import type { PostFrontMatter } from "../../lib/posts";
import {
  getAllPostFrontMatter,
  getPostFrontMatterBySeries
} from "../../lib/posts";
import { slugify } from "../../lib/utilities";

interface Params extends ParsedUrlQuery {
  seriesSlug: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async (_) => {
  const posts = await getAllPostFrontMatter();
  const uniqueSeries = Array.from(new Set(posts.map((post) => post.series))).filter(el => el);

  const paths = uniqueSeries.map((series) => ({
    params: {
      seriesSlug: slugify(series),
    },
  }));
  console.debug(paths);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<SeriesPageProps, Params> = async ({
  params,
}) => {
  const posts = await getPostFrontMatterBySeries(params.seriesSlug);
  return {
    props: {
      posts,
      seriesSlug: params.seriesSlug,
    },
  };
};

interface SeriesPageProps {
  posts: PostFrontMatter[];
  seriesSlug: string;
}

const PostsPage: NextPage<SeriesPageProps> = ({ posts, seriesSlug }) => {
  return (
    <section>
      <Header>{seriesSlug}</Header>
      <PostSnippets posts={posts} />
    </section>
  );
};
export default PostsPage;
