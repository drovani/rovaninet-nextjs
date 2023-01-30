import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { ParsedUrlQuery } from "querystring";
import { getAllPostFileInfo, getPostFromSlugYear } from "../../../lib/posts";

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

export const getStaticProps: GetStaticProps<PostProps, Params> = async ({
  params,
}) => {
  const post: PostProps = await getPostFromSlugYear(params.slug, params.year);
  return {
    props: post,
  };
};

interface PostProps {
  frontmatter: {
    title: string;
    [key: string]: any;
  };
  slug: string;
  year: string;
  contentHtml: string;
}

const PostPage: NextPage<PostProps> = ({ frontmatter, contentHtml }) => {
  return (
    <div className="prose mx-auto">
      <h1>{frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
};

export default PostPage;
