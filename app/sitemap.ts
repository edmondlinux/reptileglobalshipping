export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reptileglobal.site';
  const locales = ['en', 'fr', 'nl', 'de'];
  const routes = ['', '/about', '/team', '/track', '/testimonials', '/contact'];

  const sitemaps = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1 : 0.8,
    }))
  );

  return sitemaps;
}
