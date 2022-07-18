import fs from "fs";
import matter from "gray-matter";
import yaml from "js-yaml";
import md from "markdown-it";

export async function getStaticPaths() {
  let paths = [];

  const yearFolders = fs.readdirSync("posts");
  yearFolders.forEach((year) => {
    const postsByYear = fs.readdirSync(`posts/${year}`).map((fileName) => {
      const slug = fileName.replace(".md", "").substring(11);
      return {
        params: {
          slug,
          year,
        },
      };
    });
    paths = paths.concat(postsByYear);
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { year, slug } }) {
  const fileName = fs
    .readdirSync(`posts/${year}/`)
    .filter((fn) => fn.endsWith(`${slug}.md`))[0];
  const file = fs.readFileSync(`posts/${year}/${fileName}`, "utf-8");
  const { data: frontmatter, content } = matter(file, {
    engines: {
      yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }),
    },
  });
  return {
    props: {
      frontmatter,
      content,
    },
  };
}

export default function PostPage({ frontmatter, content }) {
  return (
    <div className="prose mx-auto">
      <h1>{frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
    </div>
  );
}
