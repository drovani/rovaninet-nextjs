import { GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import PostsSection from "../components/PostsSection";
import {
  getAllPostFileInfo, getPostsSorted,
  PostSummary, toPostSummaries
} from "../lib/posts";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<HomeProps, Params> = async (_) => {
  const posts = await getPostsSorted(1, 7);

  return {
    props: {
      posts: toPostSummaries(posts),
      maxPages: Math.ceil((await getAllPostFileInfo()).length / 7),
    },
  };
};

interface HomeProps {
  posts: PostSummary[];
  maxPages: number;
}

const HomePage: NextPage<HomeProps> = ({ posts, maxPages }) => {
  return (
    <section>
      <PostsSection
        header="Blog Posts"
        posts={posts}
        maxPages={maxPages}
        currentPage={1}
      />
    </section>
  );
};

export default HomePage;
