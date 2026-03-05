import type { OrganizationSchema, PersonSchema } from "../components/JsonLd";

export const SITE_URL = 'https://rovani.net' as const;
export const SITE_NAME = "Rovani's Sandbox" as const;
export const SITE_AUTHOR = 'David Rovani' as const;
export const DEFAULT_OG_IMAGE = '/images/r-star.png' as const;
export const DEFAULT_OG_IMAGE_ALT = "Rovani's Sandbox - David Rovani's personal blog" as const;
export const DEFAULT_SITE_DESCRIPTION = "David Rovani's personal blog covering software engineering, career development, and technology leadership" as const;

export const SITE_AUTHOR_PERSON: PersonSchema = {
  '@type': 'Person',
  name: SITE_AUTHOR,
  url: `${SITE_URL}/about`,
};

export const SITE_PUBLISHER: OrganizationSchema = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}${DEFAULT_OG_IMAGE}` },
};
