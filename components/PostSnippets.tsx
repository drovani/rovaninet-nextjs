import Link from "next/link";
import { PostFrontMatter } from "../lib/posts";

const PostSnippets = ({ posts }: { posts: PostFrontMatter[] }) => {
  return (
    <section>
      {posts.map((post) => {
        return (
          <article className="my-5 text-lg list-none" key={post.slug}>
            <header className="sm:flex sm:items-baseline">
              <h3 className="underline sm:flex-1">
                {post.step && <span>Step {post.step}: </span>}
                <Link href={post.canonicalUrl}>
                  <a>{post.title}</a>
                </Link>
              </h3>
              <div className="text-right">
                <time
                  className="bg-gray-100 px-2 rounded"
                  dateTime={new Date(post.date).toISOString()}
                >
                  {new Date(post.date).toLocaleDateString()}
                </time>
              </div>
            </header>
            <p>{post.excerpt}</p>
          </article>
        );
      })}
    </section>
  );
};
export default PostSnippets;
