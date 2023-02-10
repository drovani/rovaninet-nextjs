import { GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import PostsSection from "../components/PostsSection";
import {
  getAllPostFileInfo,
  getPostSeriesInfoSorted,
  getPostsSorted,
  PostComplete
} from "../lib/posts";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<HomeProps, Params> = async (_) => {
  const posts: HomeProps["posts"] = await getPostsSorted(1, 7);

  return {
    props: {
      posts,
      maxPages: Math.ceil((await getAllPostFileInfo()).length / 7),
      seriesCollection: await getPostSeriesInfoSorted(),
    },
  };
};

interface HomeProps {
  posts: PostComplete[];
  maxPages: number;
  seriesCollection: {
    series: string;
    seriesSlug: string;
    count: number;
  }[];
}

const HomePage: NextPage<HomeProps> = ({ posts, maxPages, seriesCollection }) => {
  return (
    <section>
      <PostsSection
        header="Blog Posts"
        posts={posts}
        seriesCollection={seriesCollection}
        maxPages={maxPages}
        currentPage={1}
      />
    </section>
  );
};

export default HomePage;
