import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import PostsSection from "../../components/PostsSection";
import {
  PostSummary,
  getAllPosts,
  getPostsByFrontmatterNode,
  toPostSummaries
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
  const { posts, nodeValue, summary } = await getPostsByFrontmatterNode(
    "series",
    params.seriesSlug
  );
  return {
    props: {
      posts: toPostSummaries(posts.sort(
        (l, r) =>
          Date.parse(r.frontmatter.date) - Date.parse(l.frontmatter.date)
      )),
      series: nodeValue,
      seriesSlug: params.seriesSlug,
      summary,
    },
  };
};

interface SeriesPageProps {
  posts: PostSummary[];
  series: string;
  seriesSlug: string;
  summary: string;
}

const SeriesPage: NextPage<SeriesPageProps> = ({ posts, series, summary }) => {
  return (
    <section>
      <PostsSection posts={posts} summary={summary} header={series} />
    </section>
  );
};
export default SeriesPage;
