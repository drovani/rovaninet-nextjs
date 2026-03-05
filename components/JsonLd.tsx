import Head from "next/head";

// Schema types
interface PersonSchema {
  "@type": "Person";
  name: string;
  url: string;
}

interface OrganizationSchema {
  "@type": "Organization";
  name: string;
  url: string;
  logo?: {
    "@type": "ImageObject";
    url: string;
  };
}

interface WebSiteJsonLd {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description?: string;
  author: PersonSchema;
}

interface BlogPostingJsonLd {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description?: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: PersonSchema;
  publisher: OrganizationSchema;
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
  articleSection?: string;
  keywords?: string;
}

type JsonLdData = WebSiteJsonLd | BlogPostingJsonLd;

interface JsonLdProps {
  data: JsonLdData;
}

function safeJsonLd(data: JsonLdData): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <Head>
      <script
        key="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
      />
    </Head>
  );
}

export type {
  WebSiteJsonLd,
  BlogPostingJsonLd,
  PersonSchema,
  OrganizationSchema,
  JsonLdData,
};
