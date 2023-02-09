import { GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import PageHeader from "../components/PageHeader";
import PostSnippets from "../components/PostSnippets";
import PostsPager from "../components/PostsPager";
import { getAllPostFileInfo, getSortedPosts, PostComplete } from "../lib/posts";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<HomeProps, Params> = async (_) => {
  const posts: HomeProps["posts"] = await getSortedPosts(1, 7);

  return {
    props: {
      posts,
      maxPages: Math.ceil((await getAllPostFileInfo()).length / 7),
    },
  };
};

interface HomeProps {
  posts: PostComplete[];
  maxPages: number;
}

const HomePage: NextPage<HomeProps> = ({ posts, maxPages }) => {
  return (
    <section>
      <div className="sm:flex sm:pr-4">
        <PageHeader className="sm:flex-1">Blog Posts</PageHeader>
      </div>
      <PostsPager currentPage={1} maxPages={maxPages} />
      <PostSnippets posts={posts} />
    </section>
  );
};

export default HomePage;
