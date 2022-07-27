import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { getSortedPostsData } from "../lib/posts";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<HomeProps, Params> = async (_) => {
  let posts: HomeProps["posts"] = [];

  posts = getSortedPostsData().slice(0, 15);

  return {
    props: {
      posts,
    },
  };
};

interface HomeProps {
  posts: {
    slug: string;
    year: number;
    date: string;
    title: string;
  }[];
}

const HomePage: NextPage<HomeProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-0">
      {posts.map(({ slug, year, title, date }) => (
        <div
          key={slug}
          className="border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer p-2"
        >
          <Link href={`/posts/${year}/${slug}/`}>
            <a>
              <h1 className="p-2"> {title} </h1>
            </a>
          </Link>

          <time className="block text-right">
            {new Date(date).toLocaleDateString()}
          </time>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
