import Link from "next/link";
import { PostComplete } from "../lib/posts";
import TaillessWrap from "./TaillessWrap";

const PostSnippets = ({ posts }: { posts: PostComplete[] }) => {
  return (
    <section className="divide-y divide-chicagored">
      {posts.map((post) => {
        return (
          <article className="mb-5 pt-5 text-lg list-none" key={post.slug}>
            <header className="sm:flex sm:items-baseline">
              <h1 className="sm:flex-1">
                {post.frontmatter.step && (
                  <span className="mr-1">
                    <span className="italic">{post.frontmatter.series}</span>{" "}
                    {post.frontmatter.step}:
                  </span>
                )}
                <Link href={post.canonicalUrl} className="underline">
                  <TaillessWrap text={post.frontmatter.title} />
                </Link>
              </h1>
              <div className="text-right">
                <time
                  className="bg-chicagoblue px-2 rounded"
                  dateTime={new Date(post.frontmatter.date).toISOString()}
                >
                  {new Date(post.frontmatter.date).toLocaleDateString()}
                </time>
              </div>
            </header>
            <div
              dangerouslySetInnerHTML={{ __html: post.frontmatter.excerptHtml }}
            ></div>
          </article>
        );
      })}
    </section>
  );
};
export default PostSnippets;
