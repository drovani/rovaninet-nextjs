import fs from "fs";
import matter from "gray-matter";
import yaml from 'js-yaml';
import path from "path";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export interface PostFrontMatter {
    slug: string;
    year: number;
    date: string;
    title: string;
}

export function getSortedPostsData(): PostFrontMatter[] {
    let posts: PostFrontMatter[] = [];

    const yearFolders = fs.readdirSync(postsDirectory);
    yearFolders.forEach((year) => {
        const postsByYear = fs.readdirSync(`posts/${year}`).map((fileName) => {
            const slug = fileName.replace(/\.md$/, "").substring(11);
            const fileContents = fs.readFileSync(`posts/${year}/${fileName}`, "utf-8");

            // Nextjs tries to serialize the date prop, but fails because [object Date] is not JSON serializable
            // Instead, we instruct the yaml engine to use only strings, arrays and plain objects
            const { data } = matter(fileContents, {
                engines: {
                    yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object
                }
            });
            return {
                slug,
                year: Number.parseInt(year),
                ...(data as { title: string, date: string }),
            };
        });
        posts = posts.concat(postsByYear);
    });
    return posts = posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllPostParams() {
    let params: { params: { slug: string, year: string } }[] = [];

    const yearFolders = fs.readdirSync(postsDirectory);
    yearFolders.forEach((year) => {
        const postsByYear = fs.readdirSync(`posts/${year}`).map((fileName) => {
            const slug = fileName.replace(/\.md$/, "").substring(11);
            return {
                params: {
                    slug,
                    year
                }
            };
        });
        params = params.concat(postsByYear);
    });
    return params;
}

export async function getPostData(slug: string, year: string) {
    const fullPath = path.join(postsDirectory, year);
    const filename = fs.readdirSync(fullPath).find(f => f.endsWith(`${slug}.md`));
    const fileContent = fs.readFileSync(path.join(fullPath, filename), 'utf8');

    const { data: frontmatter, content } = matter(fileContent, {
        engines: {
            yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
        },
    });

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
        slug,
        year,
        frontmatter: { title: frontmatter.title as string, ...frontmatter },
        contentHtml,
    };
}