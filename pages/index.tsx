import { GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import PageHeader from "../components/PageHeader";
import PostSnippets from "../components/PostSnippets";
import PostsPager from "../components/PostsPager";
import { getAllPostFileInfo, getPostSeriesInfo, getSortedPosts, PostComplete } from "../lib/posts";

interface Params extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps<HomeProps, Params> = async (_) => {
  const posts: HomeProps["posts"] = await getSortedPosts(1, 7);

  return {
    props: {
      posts,
      maxPages: Math.ceil((await getAllPostFileInfo()).length / 7),
      series: await getPostSeriesInfo().then(s => s.sort((l, r) => l.series.localeCompare(r.series)))
    },
  };
};

interface HomeProps {
  posts: PostComplete[];
  maxPages: number;
  series: {
    series: string;
    seriesSlug: string;
    count: number;
  }[];
}

const HomePage: NextPage<HomeProps> = ({ posts, maxPages, series }) => {
  return (
    <section>
      <div className="sm:flex sm:pr-4 mb-5 sm:mb-auto">
        <PageHeader className="sm:flex-1">Blog Posts</PageHeader>
        <div>
          Filter by Series
          <select>
            <option value=""></option>
            {series.map((s) => (
              <option value={s.seriesSlug}>{s.series}</option>
            ))}
          </select>
        </div>
      </div>
      <PostsPager currentPage={1} maxPages={maxPages} />
      <PostSnippets posts={posts} />
    </section>
  );
};

export default HomePage;
