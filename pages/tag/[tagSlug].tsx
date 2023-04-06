import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import PostsSection from "../../components/PostsSection";
import {
  PostComplete,
  getAllPosts,
  getPostsByFrontmatterTag,
} from "../../lib/posts";
import { slugify } from "../../lib/utilities";

interface Params extends ParsedUrlQuery {
  tagSlug: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async (_) => {
  const posts = await getAllPosts();
  const combinedTags = posts.reduce(
    (tags: string[], post) => tags.concat(post.frontmatter.tags),
    []
  );
  const uniqueTags = Array.from(new Set(combinedTags)).filter((el) => el);

  const paths = uniqueTags.map((tag) => ({
    params: {
      tagSlug: slugify(tag),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<TagPageProps, Params> = async ({
  params,
}) => {
  const { posts, summary } = await getPostsByFrontmatterTag(params.tagSlug);
  return {
    props: {
      posts: posts.sort(
        (l, r) =>
          Date.parse(r.frontmatter.date) - Date.parse(l.frontmatter.date)
      ),
      tag: params.tagSlug,
      tagSlug: params.tagSlug,
      summary,
    },
  };
};

interface TagPageProps {
  posts: PostComplete[];
  tag: string;
  tagSlug: string;
  summary: string;
}

const TagPage: NextPage<TagPageProps> = ({ posts, tag, summary }) => {
  return (
    <section>
      <PostsSection posts={posts} summary={summary} header={tag} />
    </section>
  );
};
export default TagPage;
