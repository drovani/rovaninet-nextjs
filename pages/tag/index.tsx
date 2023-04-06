import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { getAllPosts } from "../../lib/posts";

interface Params extends ParsedUrlQuery {
  tagSlug: string;
}

export const getStaticProps: GetStaticProps<
  TagsPageProps,
  Params
> = async () => {
  const posts = await getAllPosts();
  const combinedTags = posts
    .reduce((tags: string[], post) => tags.concat(post.frontmatter.tags), [])
    .filter(Boolean);
  const uniqueTags = Array.from(new Set(combinedTags)).sort((l, r) =>
    l.localeCompare(r)
  );

  return {
    props: {
      tags: uniqueTags,
    },
  };
};

interface TagsPageProps {
  tags: string[];
}

const TagsPage: NextPage<TagsPageProps> = ({ tags }) => {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {tags.map((tag) => {
        return (
          <div key={tag}>
            <Link className="underline decoration-chicagoblue hover:decoration-black" href={`/tag/${tag}`}>{tag}</Link>
          </div>
        );
      })}
    </section>
  );
};
export default TagsPage;
