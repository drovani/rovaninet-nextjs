import fs from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async () => {
  let posts: {
    slug: string;
    year: number;
    fileName: string;
    title: string;
  }[] = [];

  const yearFolders = fs.readdirSync("posts");
  yearFolders.forEach((year) => {
    const postsByYear = fs.readdirSync(`posts/${year}`).map((fileName) => {
      const slug = fileName.replace(".md", "").substring(11);
      const readFile = fs.readFileSync(`posts/${year}/${fileName}`, "utf-8");
      const { data: frontmatter } = matter(readFile);
      return {
        slug,
        year: Number.parseInt(year),
        fileName,
        title: frontmatter.title as string,
      };
    });
    posts = posts.concat(postsByYear);
  });
  posts = posts.sort((a, b) => b.fileName.localeCompare(a.fileName));
  return {
    props: {
      posts,
    },
  };
};

export default function Home({
  posts,
}: {
  posts: {
    slug: string;
    year: number;
    fileName: string;
    title: string;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-0">
      {posts.map(({ slug, year, title }) => (
        <div
          key={slug}
          className="border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer"
        >
          <Link href={`/posts/${year}/${slug}/`}>
            <a>
              <h1 className="p-4"> {title} </h1>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
