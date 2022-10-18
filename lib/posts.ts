import fs, { PathLike } from "fs";
import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import yaml from 'js-yaml';
import path, { resolve } from "path";
import { remark } from "remark";
import html from "remark-html";
import { slugify } from "./utilities";

const postsDirectory = path.join(process.cwd(), "posts");

interface PostFileInfo {
    year: number;
    fileName: string;
    path: string;
    slug: string;
}

export interface PostFrontMatter {
    slug: string;
    year: number;
    date: string;
    title: string;
    canonicalUrl: string;
    step?: number;
    excerpt?: string;
    category?: string;
    series?: string;
}

async function readdirRecursive(directory: PathLike): Promise<PostFileInfo[]> {
    const dirents = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(directory.toString(), dirent.name);
        return dirent.isDirectory() ? readdirRecursive(res) : {
            year: Number.parseInt(directory.toString().substring(postsDirectory.length + 1, postsDirectory.length + 5)),
            fileName: dirent.name,
            path: res,
            slug: slugify(dirent.name.substring(11).slice(0, -2))
        };
    }))
    return files.flat();
}

export async function getSortedPostsData(pageNumber?: number, pageSize: number = 7): Promise<PostFrontMatter[]> {
    const postfiles = await readdirRecursive(postsDirectory);

    const postPrmoises = postfiles.map(async ({ year, fileName, path, slug }) => {

        const fileContents = await readFile(path, "utf-8");
        // Nextjs tries to serialize the date prop, but fails because [object Date] is not JSON serializable
        // Instead, we instruct the yaml engine to use only strings, arrays and plain objects
        const { data, excerpt } = matter(fileContents, {
            engines: {
                yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object
            }
        });
        return {
            slug,
            year,
            canonicalUrl: `/posts/${year}/${slug}`,
            excerpt,
            ...(data as { title: string, date: string }),
        };

    });
    const posts = await Promise.all(postPrmoises);

    const sorted = posts.sort((a, b) => b.date.localeCompare(a.date))
    const start = ((pageNumber || 1) - 1) * pageSize;
    const sliced = sorted.slice(start, start + pageSize);
    return sliced;
}

export async function getAllPostParams() {
    const postfiles = await readdirRecursive(postsDirectory);
    return postfiles.map(pf => ({
        slug: pf.slug,
        year: pf.year.toString()
    }));
}

export async function getPostData(slug: string, year: string) {
    const fullPath = path.join(postsDirectory, year);
    const filename = fs.readdirSync(fullPath).find(f => f.toLowerCase().endsWith(`${slug}.md`));
    const fileContent = fs.readFileSync(path.join(fullPath, filename), 'utf8');

    const { data: frontmatter, content } = matter(fileContent, {
        engines: {
            yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
        },
    });

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    const processedExcerpt = await remark().use(html).process(frontmatter.excerpt);
    const excerptHtml = processedExcerpt.toString();

    return {
        slug,
        year,
        frontmatter: { title: frontmatter.title as string, ...frontmatter },
        //excerptHtml,
        contentHtml,
    };
}