/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://rovani.net',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  transform: async (config, path) => {
    const priority =
      path === '/' ? 1.0 :
      path.startsWith('/posts/') ? 0.8 :
      path.startsWith('/category/') || path.startsWith('/series/') ? 0.6 :
      path.startsWith('/tag/') ? 0.5 :
      0.7;

    const changefreq =
      path === '/' ? 'daily' :
      path.startsWith('/posts/') ? 'monthly' :
      'weekly';

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
};