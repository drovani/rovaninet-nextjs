import React from "react";
import { PathLike } from "fs";
import { readdir, access, constants } from "fs/promises";
import path, { resolve } from "path";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import remarkRehype from 'remark-rehype';
import remarkMath from 'remark-math';
import remarkEmoji from 'remark-emoji';
import rehypeKatex from 'rehype-katex';
import { Preset, unified } from "unified";
import { matter as vmatter } from 'vfile-matter';
import remarkDirectiveRehype from "./remark-directive-rehype";
import { slugify } from "./utilities";
import { withConcurrencyLimit, globalTracker } from "./performance";
import { 
    processedContentCache, 
    excerptCache, 
    getCompiledRegex,
    memoizedReadFile,
    memoize
} from "./memoization";

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
    includeMath?: boolean;
    includeEmoji?: boolean;
    outputFormat?: 'html' | 'mdast' | 'hast';
}

const postsDirectory = path.join(process.cwd(), "rovaninet-posts");
// posts/{year}/{date}-{slug}.md
const postFilenameRegex = getCompiledRegex('rovaninet-posts\/(?<year>\\d{4})\/(?<filename>(?<date>\\d{4}-\\d{2}-\\d{2})-(?<slug>[\\w\\d\\-]*)\\.md)', 'i');

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

// Optimized interface for post summary/snippet pages
export interface PostSummary {
    slug: string;
    canonicalUrl: string;
    frontmatter: {
        step?: number;
        series?: string;
        title: string;
        date: string;
        excerpt: string;
        tags?: string[];
    };
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
    const trackerId = globalTracker.start('getAllPosts');
    
    try {
        const postfiles = await readdirRecursive(postsDirectory);
        
        // Use parallel processing with concurrency limit
        const retval = await withConcurrencyLimit(
            postfiles,
            async ({ path }) => await getPostFromPath(path),
            12 // Process 12 files concurrently
        );
        
        globalTracker.end(trackerId);
        return retval;
    } catch (error) {
        globalTracker.end(trackerId);
        throw error;
    }
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
    const trackerId = globalTracker.start('readdirRecursive', { directory: directory.toString() });
    
    try {
        const dirents = await readdir(directory, { withFileTypes: true });
        
        // Use parallel processing for directory traversal
        const files = await withConcurrencyLimit(
            dirents,
            async (dirent) => {
                const res = resolve(directory.toString(), dirent.name);
                if (dirent.isDirectory()) {
                    return await readdirRecursive(res);
                } else {
                    const matches = postFilenameRegex.exec(res);
                    if (matches == null) return null;
                    return {
                        year: matches.groups!.year,
                        fileName: dirent.name,
                        path: res,
                        slug: matches.groups!.slug.toLocaleLowerCase(),
                        canonicalUrl: `/posts/${matches.groups!.year}/${matches.groups!.slug.toLocaleLowerCase()}`,
                    };
                }
            },
            8 // Concurrency limit for directory operations
        );
        
        globalTracker.end(trackerId);
        return files.flat().filter(f => f != null);
    } catch (error) {
        globalTracker.end(trackerId);
        throw error;
    }
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
        includeMath = true,
        includeEmoji = true,
        outputFormat = 'html'
    } = options;

    const processor = unified().use(remarkParse as Preset).use(remarkFrontmatter);

    if (includeGfm) {
        processor.use(remarkGfm);
    }

    if (includeMath) {
        processor.use(remarkMath);
    }

    if (includeEmoji) {
        processor.use(remarkEmoji);
    }

    if (includeDirectives) {
        processor.use(remarkDirective).use(remarkDirectiveRehype);
    }

    if (outputFormat === 'html') {
        processor.use(remarkHtml as Preset);
    } else if (outputFormat === 'hast') {
        processor.use(remarkRehype);
        
        if (includeMath) {
            processor.use(rehypeKatex);
        }
        
        processor.use(rehypeFormat).use(rehypeStringify as Preset);
    }

    return processor;
}

// Validate frontmatter with better error handling and memoization
const validateFrontmatter = memoize(
    function validateFrontmatterInternal(raw: any, contentMarkdown: string = ''): PostFrontMatterRaw {
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
    },
    (raw: any, contentMarkdown: string = '') => JSON.stringify({ raw, contentMarkdown })
);

export async function getPostFromPath(path: string): Promise<PostComplete> {
    const trackerId = globalTracker.start('getPostFromPath', { path });
    
    try {
        // Check cache first
        const cacheKey = `post:${path}`;
        const cached = await processedContentCache.get(cacheKey, path);
        if (cached) {
            globalTracker.end(trackerId);
            return JSON.parse(cached);
        }

        const fileContent = await memoizedReadFile(path);

        const processor = createProcessor({ 
            includeGfm: true,
            includeMath: true,
            includeEmoji: true
        });
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

        // Process excerpt with caching
        const excerptCacheKey = `excerpt:${validatedFrontmatter.excerpt}`;
        let excerptHtml = await excerptCache.get(excerptCacheKey);
        
        if (!excerptHtml) {
            const excerptProcessor = createProcessor({ 
                includeGfm: true,
                includeMath: true,
                includeEmoji: true
            });
            const excerpt = await excerptProcessor.process(validatedFrontmatter.excerpt);
            excerptHtml = String(excerpt);
            await excerptCache.set(excerptCacheKey, excerptHtml);
        }

        const matches = postFilenameRegex.exec(path);
        if (!matches) {
            throw new Error(`Invalid post filename format: ${path}`);
        }

        const result = {
            frontmatter: {
                ...validatedFrontmatter,
                excerptHtml
            },
            year: matches.groups!.year,
            fileName: matches.groups!.filename,
            slug: matches.groups!.slug.toLocaleLowerCase(),
            path,
            canonicalUrl: `/posts/${matches.groups!.year}/${matches.groups!.slug.toLocaleLowerCase()}`,
            contentHtml: String(file),
            contentMarkdown: contentWithoutFrontmatter,
        };

        // Cache the result
        await processedContentCache.set(cacheKey, JSON.stringify(result), path);
        
        globalTracker.end(trackerId);
        return result;
    } catch (error) {
        globalTracker.end(trackerId);
        console.error(`Error processing post at ${path}:`, error);
        throw error;
    }
}

export async function getMarkdownContent(fileslug: string): Promise<string> {
    const trackerId = globalTracker.start('getMarkdownContent', { fileslug });
    
    try {
        const filePath = path.join(postsDirectory, `${fileslug}.md`);
        const cacheKey = `markdown:${fileslug}`;
        
        // Check cache first
        const cached = await processedContentCache.get(cacheKey, filePath);
        if (cached) {
            globalTracker.end(trackerId);
            return cached;
        }

        // Check if file exists before attempting to read
        try {
            await access(filePath, constants.F_OK);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist - this is expected for some tags/content
                globalTracker.end(trackerId);
                return "";
            }
            throw error; // Re-throw other access errors
        }

        const buffer = await memoizedReadFile(filePath);
        const result = String(buffer);
        
        // Cache the result
        await processedContentCache.set(cacheKey, result, filePath);
        
        globalTracker.end(trackerId);
        return result;
    } catch (error) {
        globalTracker.end(trackerId);
        console.error(`Error processing markdown content for ${fileslug}:`, error);
        return "";
    }
}

export async function getFileContent(fileslug: string): Promise<string> {
    const filePath = path.join(postsDirectory, `${fileslug}.md`);
    return await memoizedReadFile(filePath);
}

// Helper functions to transform PostComplete to PostSummary
export function toPostSummary(post: PostComplete): PostSummary {
    const frontmatter: PostSummary['frontmatter'] = {
        title: post.frontmatter.title,
        date: post.frontmatter.date,
        excerpt: post.frontmatter.excerpt,
    };
    
    // Only include optional fields if they have values
    if (post.frontmatter.step !== undefined) {
        frontmatter.step = post.frontmatter.step;
    }
    if (post.frontmatter.series !== undefined) {
        frontmatter.series = post.frontmatter.series;
    }
    if (post.frontmatter.tags !== undefined) {
        frontmatter.tags = post.frontmatter.tags;
    }
    
    return {
        slug: post.slug,
        canonicalUrl: post.canonicalUrl,
        frontmatter,
    };
}

export function toPostSummaries(posts: PostComplete[]): PostSummary[] {
    return posts.map(toPostSummary);
}
