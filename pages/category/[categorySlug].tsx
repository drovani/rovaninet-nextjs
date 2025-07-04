import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import PostsSection from "../../components/PostsSection";
import {
  PostSummary,
  getAllPosts,
  getPostsByFrontmatterNode,
  toPostSummaries
} from "../../lib/posts";
import { slugify } from "../../lib/utilities";

interface Params extends ParsedUrlQuery {
  categorySlug: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async (_) => {
  const posts = await getAllPosts();
  const uniqueCategory = Array.from(
    new Set(posts.map((post) => post.frontmatter.category))
  ).filter((el) => el);

  const paths = uniqueCategory.map((category) => ({
    params: {
      categorySlug: slugify(category),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<CategoryPageProps, Params> = async ({
  params,
}) => {
  const { posts, nodeValue, summary } = await getPostsByFrontmatterNode("category", params.categorySlug);
  return {
    props: {
      posts: toPostSummaries(posts.sort((l,r) => Date.parse(r.frontmatter.date) - Date.parse(l.frontmatter.date))),
      category: nodeValue,
      categorySlug: params.categorySlug,
      summary,
    },
  };
};

interface CategoryPageProps {
  posts: PostSummary[];
  category: string;
  categorySlug: string;
  summary: string;
}

const CategoryPage: NextPage<CategoryPageProps> = ({ posts, category, summary }) => {
  return (
    <section>
      <PostsSection posts={posts} summary={summary} header={category} />
    </section>
  );
};
export default CategoryPage;
