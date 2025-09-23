import fs from 'fs';
import { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import path from 'path';
import { getPostFromPath } from '../../../lib/posts';

const Presentation = dynamic(() => import('../../../components/Presentation'), {
    ssr: false
});

interface TalkPageProps {
    markdownContent: string;
    slug: string;
    year: string;
}

export default function TalkPage({ markdownContent }: TalkPageProps) {
    return (
        <div style={{ height: '100vh' }}>
            <Presentation markdownContent={markdownContent} />
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const markdownDir = path.join(process.cwd(), 'rovaninet-posts');
    const paths: { params: { year: string; slug: string } }[] = [];

    // Read year directories
    const yearDirs = fs.readdirSync(markdownDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    // Read markdown files from each year directory
    for (const year of yearDirs) {
        const yearPath = path.join(markdownDir, year);
        const files = fs.readdirSync(yearPath).filter(file => file.endsWith('.md'));

        for (const file of files) {
            // Extract slug from filename (remove date prefix and .md extension)
            // Format: YYYY-MM-DD-slug.md -> slug
            const match = file.match(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/);
            if (match) {
                const slug = match[1].toLowerCase();
                paths.push({
                    params: { year, slug }
                });
            }
        }
    }

    return {
        paths,
        fallback: false
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string;
    const year = params?.year as string;

    try {
        // Find the full filename with date prefix
        const yearPath = path.join(process.cwd(), 'rovaninet-posts', year);
        const files = fs.readdirSync(yearPath);
        const matchingFile = files.find(file => {
            const match = file.match(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/);
            return match && match[1].toLowerCase() === slug;
        });

        if (!matchingFile) {
            return { notFound: true };
        }

        const filePath = path.join(yearPath, matchingFile);
        const post = await getPostFromPath(filePath);
        const markdownContent = post.contentMarkdown || '';

        return {
            props: {
                markdownContent,
                slug,
                year,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
};