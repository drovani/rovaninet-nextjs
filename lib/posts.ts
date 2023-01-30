import { PathLike } from "fs";
import { readdir, readFile } from "fs/promises";
import path, { resolve } from "path";
import remarkFrontmatter from "remark-frontmatter";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { matter as vmatter } from 'vfile-matter';
import { slugify } from "./utilities";

const postsDirectory = path.join(process.cwd(), "posts");
// posts/{year}/{date}-{slug}.md
const postFilenameRegex = /posts\/(?<year>\d{4})\/(?<filename>(?<date>\d{4}-\d{2}-\d{2})-(?<slug>[\w\d\-]*)\.md)/i;

export interface PostComplete extends PostFileInfo {
    frontmatter: PostFrontMatter;
    contentHtml: string;
}

export interface PostFileInfo {
    year: string;
    fileName: string;
    path: string;
    slug: string;
    canonicalUrl: string;
}

export interface PostFrontMatter {
    date: string;
    title: string;
    step?: number;
    excerpt: string;
    excerptHtml: string;
    category?: string;
    series?: string;
}

export async function getSortedPosts(pageNumber?: number, pageSize: number = 7): Promise<PostComplete[]> {
    const posts = await getAllPosts();

    const sorted = posts.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
    const start = ((pageNumber || 1) - 1) * pageSize;
    const sliced = sorted.slice(start, start + pageSize);
    return sliced;
}

export async function getAllPostFileInfo(): Promise<PostFileInfo[]> {
    const postfiles = await readdirRecursive(postsDirectory);
    return postfiles;
}

export async function getAllPosts(): Promise<PostComplete[]> {
    const postfiles = await readdirRecursive(postsDirectory);

    const retval = await Promise.all(postfiles.map(async ({ path }) => {
        return await getPostFromPath(path);
    }));
    return retval;
}

export async function getPostsBySeries(seriesSlug: string): Promise<PostComplete[]> {
    return await getAllPosts().then(allposts => allposts.filter(post => slugify(post.frontmatter.series) === seriesSlug));
}


async function readdirRecursive(directory: PathLike): Promise<PostFileInfo[]> {
    const dirents = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(directory.toString(), dirent.name);
        if (dirent.isDirectory()) {
            return readdirRecursive(res);
        } else {
            const matches = postFilenameRegex.exec(res);
            return {
                year: matches.groups.year,
                fileName: dirent.name,
                path: res,
                slug: matches.groups.slug,
                canonicalUrl: `/posts/${matches.groups.year}/${matches.groups.slug}`,
            };
        }
    }))
    return files.flat();
}

export async function getPostFromSlugYear(slug: string, year: string): Promise<PostComplete> {
    const fullPath = path.join(postsDirectory, year);
    const fileinfo = await readdirRecursive(fullPath).then(posts => posts.find(f => f.slug === slug));
    return await getPostFromPath(fileinfo.path);
}

export async function getPostFromPath(path: string): Promise<PostComplete> {
    const fileContent = await readFile(path, "utf-8");


    const file = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter)
        .use(remarkHtml)
        .use(() => {
            return function (_, file) {
                vmatter(file);
            }
        })
        .process(fileContent);

    const frontmatter = file.data.matter as PostFrontMatter;
    const excerpt = await unified().use(remarkParse).use(remarkHtml).process(frontmatter.excerpt);

    const matches = postFilenameRegex.exec(path);
    return {
        frontmatter: {
            ...frontmatter,
            excerptHtml: String(excerpt)
        },
        year: matches.groups.year,
        fileName: matches.groups.filename,
        slug: matches.groups.slug,
        path,
        canonicalUrl: `/posts/${matches.groups.year}/${matches.groups.slug}`,
        contentHtml: String(file),
    };
}

