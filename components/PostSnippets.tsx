import { faBook, faTag, faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { PostComplete } from "../lib/posts";
import { slugify } from "../lib/utilities";
import TaillessWrap from "./TaillessWrap";
import SafeMarkdown from "./SafeMarkdown";

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
            <SafeMarkdown content={post.frontmatter.excerpt} />
            <footer className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 mt-4 gap-2">
              <div className="">
                {post.frontmatter.series && (
                  <Link
                    href={`/series/${slugify(post.frontmatter.series)}`}
                    className="rounded bg-blue-50 w-max flex gap-2 px-1"
                  >
                    <FontAwesomeIcon icon={faBook} className="text-xl place-self-center" />
                    {post.frontmatter.series}
                  </Link>
                )}
              </div>
              <div className="flex gap-2 sm:justify-self-end p-1">
                {post.frontmatter.tags && (
                  <>
                    {post.frontmatter.tags.length === 1 ?
                      <FontAwesomeIcon icon={faTag} className="place-self-center" />
                      : <FontAwesomeIcon icon={faTags} className="place-self-center" />
                    }
                    {post.frontmatter.tags.map((tag) => {
                      return (
                        <div key={tag} className="rounded">
                          <Link
                            href={`/tag/${tag}`}
                            className="underline decoration-chicagoblue hover:decoration-black block text-sm"
                          >
                            {tag}
                          </Link>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </footer>
          </article>
        );
      })}
    </section>
  );
};
export default PostSnippets;
