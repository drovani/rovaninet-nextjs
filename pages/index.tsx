import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import Header from "../components/PageHeader";
import PostSnippets from "../components/PostSnippets";
import PostsPager from "../components/PostsPager";
import { getSortedPosts, PostComplete } from "../lib/posts";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<HomeProps, Params> = async (_) => {
  const posts: HomeProps["posts"] = await getSortedPosts(1, 7);

  return {
    props: {
      posts,
    },
  };
};

interface HomeProps {
  posts: PostComplete[];
}

const HomePage: NextPage<HomeProps> = ({ posts }) => {
  return (
    <section>
      <Head>
        <title>Rovani's Sandbox</title>
      </Head>
      <div className="sm:flex sm:pr-4">
        <Header className="sm:flex-1">Blog Posts</Header>
      </div>
      <PostsPager currentPage={1} maxPages={7} />
      <PostSnippets posts={posts} />
    </section>
  );
};

export default HomePage;
