import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Script from "next/script";
import type { ParsedUrlQuery } from "querystring";
import JsonLd, { BlogPostingJsonLd } from "../../../components/JsonLd";
import PageHeader from "../../../components/PageHeader";
import SafeMarkdown from "../../../components/SafeMarkdown";
import SeoHead from "../../../components/SeoHead";
import { getAllPostFileInfo, getPostFromSlugYear, PostComplete } from "../../../lib/posts";
import { DEFAULT_OG_IMAGE, SITE_AUTHOR_PERSON, SITE_PUBLISHER, SITE_URL } from "../../../lib/siteConfig";

interface Params extends ParsedUrlQuery {
  slug: string;
  year: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = (await getAllPostFileInfo()).map(({ slug, year }) => ({
    params: {
      slug,
      year: year.toString(),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostComplete, Params> = async ({
  params,
}) => {
  const post = await getPostFromSlugYear(params.slug, params.year);
  return {
    props: post,
  };
};

const PostPage: NextPage<PostComplete> = ({ frontmatter, contentMarkdown, canonicalUrl }) => {
  const description = frontmatter.meta_description ?? frontmatter.excerpt;
  const blogPostingData: BlogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description,
    image: frontmatter.image
      ? `${SITE_URL}${frontmatter.image}`
      : `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    datePublished: frontmatter.date,
    author: SITE_AUTHOR_PERSON,
    publisher: SITE_PUBLISHER,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${canonicalUrl}` },
    articleSection: frontmatter.category,
    keywords: frontmatter.tags?.join(', '),
  };

  return (
    <div className="prose max-w-none mx-auto lg:prose-xl">
      <SeoHead
        title={frontmatter.title}
        description={description}
        canonicalPath={canonicalUrl}
        image={frontmatter.image}
        imageAlt={frontmatter.imageAlt}
        type="article"
        publishedTime={frontmatter.date}
        section={frontmatter.category}
        tags={frontmatter.tags}
      />
      <JsonLd data={blogPostingData} />
      <PageHeader className="text-center sm:text-left">{frontmatter.title}</PageHeader>
      <SafeMarkdown content={contentMarkdown} className="prose-content" />
      <div className="giscus border-sky-100 border p-1 rounded"></div>
      <Script src="https://giscus.app/client.js"
        id="giscuss"
        data-repo="drovani/rovaninet-posts"
        data-repo-id="R_kgDOJBTWqw"
        data-category="General"
        data-category-id="DIC_kwDOJBTWq84Cnvcy"
        data-mapping="title"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="en"
        data-loading="lazy"
        crossOrigin="anonymous"
        async>
      </Script>
    </div>
  );
};

export default PostPage;
