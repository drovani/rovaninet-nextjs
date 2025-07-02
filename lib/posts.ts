import React from "react";
import { PathLike } from "fs";
import { readdir, readFile } from "fs/promises";
import path, { resolve } from "path";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import remarkRehype from 'remark-rehype';
import { Preset, unified } from "unified";
import { matter as vmatter } from 'vfile-matter';
import remarkDirectiveRehype from "./remark-directive-rehype";
import { slugify } from "./utilities";

// Frontmatter validation schema
interface PostFrontMatterRaw {
    title: string;
    date: string;
    excerpt: string;
    category?: string;
    series?: string;
    step?: number;
    tags?: string[];
}

// Processing options for unified pipeline
interface ProcessingOptions {
    includeDirectives?: boolean;
    includeGfm?: boolean;
    outputFormat?: 'html' | 'mdast' | 'hast';
}

const postsDirectory = path.join(process.cwd(), "rovaninet-posts");
// posts/{year}/{date}-{slug}.md
const postFilenameRegex = /rovaninet-posts\/(?<year>\d{4})\/(?<filename>(?<date>\d{4}-\d{2}-\d{2})-(?<slug>[\w\d\-]*)\.md)/i;

export interface PostComplete extends PostFileInfo {
    frontmatter: PostFrontMatter;
    contentHtml: string;
    contentMarkdown?: string;
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
    tags?: string[];
}

// Enhanced interfaces for component-based rendering
export interface PostCompleteEnhanced extends PostComplete {
    contentComponents?: React.ReactNode;
    frontmatterValidated: boolean;
}

export async function getPostsSorted(pageNumber?: number, pageSize: number = 7): Promise<PostComplete[]> {
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

export async function getPostsByFrontmatterNode(node: "series" | "category", slug: string): Promise<{ posts: PostComplete[], nodeValue: string, summary: string }> {
    const posts = await getAllPosts().then(allposts => allposts.filter(post => slugify(post.frontmatter[node]) === slug));
    const summary = await getMarkdownContent(slug);
    return {
        posts,
        nodeValue: posts?.[0].frontmatter[node],
        summary: summary
    }
}

export async function getPostsByFrontmatterTag(tag: string):Promise<{posts:PostComplete[], summary: string}>{
    const posts = await getAllPosts().then(allposts => allposts.filter(post => post.frontmatter?.tags?.find(t => t === tag)));
    const summary = await getMarkdownContent(`/tags/${tag}`);
    return {
        posts,
        summary
    }
}

export async function getPostSeriesInfoSorted(): Promise<{ series: string, seriesSlug: string, count: number }[]> {
    const posts = await getAllPosts().then(allposts => allposts.filter(post => post.frontmatter.series));
    const grouped = Array.from(groupPostBySeries(posts));

    return grouped.map(g => {
        return {
            series: g.series,
            seriesSlug: slugify(g.series),
            count: g.posts.length,
        }
    }).sort((l, r) => l.series.localeCompare(r.series))
}

function* groupPostBySeries(posts: PostComplete[]) {
    let serieses = new Map();
    for (const post of posts) {
        let group = serieses.get(post.frontmatter.series) ?? [];
        group.push(post);
        serieses.set(post.frontmatter.series, group);
    }
    for (let [series, posts] of serieses) {
        yield { series, posts };
    }
}


async function readdirRecursive(directory: PathLike): Promise<PostFileInfo[]> {
    const dirents = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(directory.toString(), dirent.name);
        if (dirent.isDirectory()) {
            return readdirRecursive(res);
        } else {
            const matches = postFilenameRegex.exec(res);
            if (matches == null) return;
            return {
                year: matches.groups.year,
                fileName: dirent.name,
                path: res,
                slug: matches.groups.slug.toLocaleLowerCase(),
                canonicalUrl: `/posts/${matches.groups.year}/${matches.groups.slug.toLocaleLowerCase()}`,
            };
        }
    }))
    return files.flat().filter(f => f != null);
}

export async function getPostFromSlugYear(slug: string, year: string): Promise<PostComplete> {
    const fullPath = path.join(postsDirectory, year);
    const sluglower = slug.toLocaleLowerCase();
    const fileinfo = await readdirRecursive(fullPath).then(posts => posts.find(f => f.slug.toLocaleLowerCase() === sluglower));
    return await getPostFromPath(fileinfo.path);
}

// Unified processing pipeline factory
function createProcessor(options: ProcessingOptions = {}) {
    const {
        includeDirectives = false,
        includeGfm = true,
        outputFormat = 'html'
    } = options;

    const processor = unified().use(remarkParse as Preset).use(remarkFrontmatter);

    if (includeGfm) {
        processor.use(remarkGfm);
    }

    if (includeDirectives) {
        processor.use(remarkDirective).use(remarkDirectiveRehype);
    }

    if (outputFormat === 'html') {
        processor.use(remarkHtml as Preset);
    } else if (outputFormat === 'hast') {
        processor.use(remarkRehype).use(rehypeFormat).use(rehypeStringify as Preset);
    }

    return processor;
}

// Validate frontmatter with better error handling
function validateFrontmatter(raw: any, contentMarkdown: string = ''): PostFrontMatterRaw {
    const errors: string[] = [];

    if (!raw.title || typeof raw.title !== 'string') {
        errors.push('title is required and must be a string');
    }
    if (!raw.date || typeof raw.date !== 'string') {
        errors.push('date is required and must be a string');
    }
    if (raw.step && typeof raw.step !== 'number') {
        errors.push('step must be a number if provided');
    }
    if (raw.tags && !Array.isArray(raw.tags)) {
        errors.push('tags must be an array if provided');
    }

    // Validate date format
    if (raw.date && isNaN(Date.parse(raw.date))) {
        errors.push('date must be a valid ISO date string');
    }

    if (errors.length > 0) {
        throw new Error(`Frontmatter validation errors: ${errors.join(', ')}`);
    }

    // Provide fallback for excerpt if not present
    if (!raw.excerpt || typeof raw.excerpt !== 'string') {
        // Extract first paragraph as excerpt if not provided
        const firstParagraph = contentMarkdown.split('\n\n')[0]?.trim() || '';
        raw.excerpt = firstParagraph.substring(0, 200) + (firstParagraph.length > 200 ? '...' : '');
    }

    return raw as PostFrontMatterRaw;
}

export async function getPostFromPath(path: string): Promise<PostComplete> {
    try {
        const fileContent = await readFile(path, "utf-8");

        const processor = createProcessor({ includeGfm: true });
        const file = await processor
            .use(() => {
                return function (_: any, file: any) {
                    vmatter(file);
                }
            })
            .process(fileContent);

        // Extract content without frontmatter for markdown rendering
        const contentWithoutFrontmatter = fileContent.replace(/^---[\s\S]*?---\n?/, '');

        // Validate frontmatter
        const rawFrontmatter = file.data.matter;
        const validatedFrontmatter = validateFrontmatter(rawFrontmatter, contentWithoutFrontmatter);

        // Process excerpt with the same pipeline for consistency
        const excerptProcessor = createProcessor({ includeGfm: true });
        const excerpt = await excerptProcessor.process(validatedFrontmatter.excerpt);

        const matches = postFilenameRegex.exec(path);
        if (!matches) {
            throw new Error(`Invalid post filename format: ${path}`);
        }

        return {
            frontmatter: {
                ...validatedFrontmatter,
                excerptHtml: String(excerpt)
            },
            year: matches.groups.year,
            fileName: matches.groups.filename,
            slug: matches.groups.slug.toLocaleLowerCase(),
            path,
            canonicalUrl: `/posts/${matches.groups.year}/${matches.groups.slug.toLocaleLowerCase()}`,
            contentHtml: String(file),
            contentMarkdown: contentWithoutFrontmatter,
        };
    } catch (error) {
        console.error(`Error processing post at ${path}:`, error);
        throw error;
    }
}

export async function getMarkdownContent(fileslug: string): Promise<string> {
    try {
        const buffer = await readFile(path.join(postsDirectory, `${fileslug}.md`));
        const processor = createProcessor({ 
            includeDirectives: true, 
            includeGfm: true, 
            outputFormat: 'hast' 
        });
        const file = await processor.process(buffer);
        return String(file);
    } catch (error) {
        console.error(`Error processing markdown content for ${fileslug}:`, error);
        return "";
    }
}

export async function getFileContent(fileslug: string):Promise<string>{
    const fileContent = await readFile(path.join(postsDirectory, `${fileslug}.md`));
    return String(fileContent);
}
