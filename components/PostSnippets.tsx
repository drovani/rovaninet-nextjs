import { faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { PostComplete } from "../lib/posts";
import { slugify } from "../lib/utilities";
import TaillessWrap from "./TaillessWrap";

const PostSnippets = ({ posts }: { posts: PostComplete[] }) => {
  return (
    <section className="divide-y divide-chicagored">
      {posts.map((post) => {
        return (
          <article className="mb-5 pt-5 text-lg list-none" key={post.slug}>
            <header className="sm:flex sm:items-baseline sm:mb-1">
              <h2 className="sm:flex-1">
                {post.frontmatter.step && (
                  <span className="mr-1">
                    <span className="italic">{post.frontmatter.series}</span>{" "}
                    {post.frontmatter.step}:
                  </span>
                )}
                <Link href={post.canonicalUrl} className="underline">
                  <TaillessWrap text={post.frontmatter.title} />
                </Link>
              </h2>
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
            <footer className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 mt-4">
              {post.frontmatter.tags && (
                <div className="rounded border-chicagored flex gap-2">
                  <FontAwesomeIcon
                    icon={faTags}
                    className="text-xl"
                  ></FontAwesomeIcon>
                  {post.frontmatter.tags.map((tag) => {
                    return (
                      <div key={tag} className="rounded">
                        <Link
                          href={`/tag/${tag}`}
                          className="underline decoration-chicagoblue hover:decoration-black block px-2 py-1 text-sm"
                        >
                          {tag}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
              {post.frontmatter.series && (
                <div className="rounded bg-blue-50 w-max justify-self-end">
                  <Link
                    href={`/series/${slugify(post.frontmatter.series)}`}
                    className="block px-4 py-2 text-sm"
                  >
                    {post.frontmatter.series}
                  </Link>
                </div>
              )}
            </footer>
          </article>
        );
      })}
    </section>
  );
};
export default PostSnippets;
