import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { getAllPostParams, getPostData } from "../../../lib/posts";

interface Params extends ParsedUrlQuery {
  slug: string;
  year: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = (await getAllPostParams()).map(({ slug, year }) => ({
    params: {
      slug,
      year,
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
  const { year, slug } = params;
  const post: PostProps = await getPostData(slug, year);
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
