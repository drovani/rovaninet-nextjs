import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import PostsSection from "../../components/PostsSection";
import {
  getAllPosts,
  getPostsBySeries, PostComplete
} from "../../lib/posts";
import { slugify } from "../../lib/utilities";

interface Params extends ParsedUrlQuery {
  seriesSlug: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async (_) => {
  const posts = await getAllPosts();
  const uniqueSeries = Array.from(
    new Set(posts.map((post) => post.frontmatter.series))
  ).filter((el) => el);

  const paths = uniqueSeries.map((series) => ({
    params: {
      seriesSlug: slugify(series),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<SeriesPageProps, Params> = async ({
  params,
}) => {
  const { posts, series, summary } = await getPostsBySeries(params.seriesSlug);
  return {
    props: {
      posts,
      series,
      seriesSlug: params.seriesSlug,
      summary,
    },
  };
};

interface SeriesPageProps {
  posts: PostComplete[];
  series: string;
  seriesSlug: string;
  summary: string;
}

const PostsPage: NextPage<SeriesPageProps> = ({ posts, series, summary }) => {
  return (
    <section>
      <PostsSection posts={posts} summary={summary} header={series} />
    </section>
  );
};
export default PostsPage;
