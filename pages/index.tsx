import { GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import JsonLd, { WebSiteJsonLd } from "../components/JsonLd";
import PostsSection from "../components/PostsSection";
import SeoHead from "../components/SeoHead";
import {
  getAllPostFileInfo, getPostsSorted,
  PostSummary, toPostSummaries
} from "../lib/posts";
import {
  DEFAULT_SITE_DESCRIPTION,
  SITE_AUTHOR,
  SITE_NAME,
  SITE_URL,
} from "../lib/siteConfig";

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
  const webSiteData: WebSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_SITE_DESCRIPTION,
    author: { '@type': 'Person', name: SITE_AUTHOR, url: `${SITE_URL}/about` },
  };

  return (
    <section>
      <SeoHead title="Home" description={DEFAULT_SITE_DESCRIPTION} canonicalPath="/" />
      <JsonLd data={webSiteData} />
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
