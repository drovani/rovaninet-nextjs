import Head from "next/head";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_SITE_DESCRIPTION,
} from "../lib/siteConfig";

interface SeoHeadProps {
  title: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
}

function truncateDescription(text: string, max: number = 160): string {
  // Strip markdown characters
  const stripped = text.replace(/[#*_`\[\]()]/g, "").trim();
  if (stripped.length <= max) return stripped;
  return stripped.substring(0, max - 3).trim() + "...";
}

function resolveImageUrl(image?: string): string {
  if (!image) return `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  if (image.startsWith("http")) return image;
  return `${SITE_URL}${image}`;
}

export default function SeoHead({
  title,
  description,
  canonicalPath,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  section,
  tags,
  noindex = false,
}: SeoHeadProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const desc = truncateDescription(description ?? DEFAULT_SITE_DESCRIPTION);
  const imageUrl = resolveImageUrl(image);
  const imgAlt = imageAlt ?? DEFAULT_OG_IMAGE_ALT;
  const canonicalUrl = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined;

  return (
    <Head>
      <title key="title">{fullTitle}</title>
      <meta key="description" name="description" content={desc} />
      {canonicalUrl && <link key="canonical" rel="canonical" href={canonicalUrl} />}
      {noindex && <meta key="robots" name="robots" content="noindex, follow" />}

      {/* Open Graph */}
      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:description" property="og:description" content={desc} />
      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:image" property="og:image" content={imageUrl} />
      <meta key="og:image:alt" property="og:image:alt" content={imgAlt} />
      <meta key="og:site_name" property="og:site_name" content={SITE_NAME} />
      <meta key="og:locale" property="og:locale" content="en_US" />
      {canonicalUrl && <meta key="og:url" property="og:url" content={canonicalUrl} />}

      {/* Article-specific OG tags */}
      {type === "article" && publishedTime && (
        <meta
          key="article:published_time"
          property="article:published_time"
          content={publishedTime}
        />
      )}
      {type === "article" && modifiedTime && (
        <meta
          key="article:modified_time"
          property="article:modified_time"
          content={modifiedTime}
        />
      )}
      {type === "article" && section && (
        <meta key="article:section" property="article:section" content={section} />
      )}
      {type === "article" &&
        tags?.map((tag) => (
          <meta key={`article:tag:${tag}`} property="article:tag" content={tag} />
        ))}

      {/* Twitter Card */}
      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta key="twitter:description" name="twitter:description" content={desc} />
      <meta key="twitter:image" name="twitter:image" content={imageUrl} />
      <meta key="twitter:image:alt" name="twitter:image:alt" content={imgAlt} />
    </Head>
  );
}
