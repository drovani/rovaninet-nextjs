import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import PageHeader from "../components/PageHeader";
import PostSnippets from "../components/PostSnippets";
import PostsPager from "../components/PostsPager";
import {
  getAllPostFileInfo,
  getPostSeriesInfo,
  getSortedPosts,
  PostComplete
} from "../lib/posts";

interface Params extends ParsedUrlQuery {
  pageNumber: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async (_) => {
  const maxPages = Math.ceil((await getAllPostFileInfo()).length / 7);
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
  const posts = await getSortedPosts(pageNumber, 7);
  return {
    props: {
      posts,
      pageNumber,
      maxPages: Math.ceil((await getAllPostFileInfo()).length / 7),
      series: await getPostSeriesInfo().then((s) =>
        s.sort((l, r) => l.series.localeCompare(r.series))
      ),
    },
  };
};

interface PostsPageProps {
  posts: PostComplete[];
  pageNumber: number;
  maxPages: number;
  series: {
    series: string;
    seriesSlug: string;
    count: number;
  }[];
}

const PostsPage: NextPage<PostsPageProps> = ({
  posts,
  pageNumber,
  maxPages,
  series,
}) => {
  const headtitle = `Rovani's Sandbox | Posts page ${pageNumber}`;

  return (
    <section>
      <Head>
        <title>{headtitle}</title>
      </Head>
      <div className="sm:flex sm:pr-4 mb-5 sm:mb-auto sm:items-center">
        <PageHeader className="sm:flex-1">
          Blog Posts - Page {pageNumber}
        </PageHeader>
        <div>
          Posts by Series
          <select className="border rounded border-chicagoblue ml-1">
            <option value=""></option>
            {series.map((s) => (
              <option value={s.seriesSlug}>{s.series}</option>
            ))}
          </select>
        </div>
      </div>
      <PostsPager currentPage={pageNumber} maxPages={maxPages} />
      <PostSnippets posts={posts} />
    </section>
  );
};
export default PostsPage;
