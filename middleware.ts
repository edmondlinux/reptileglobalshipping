import createMiddleware from 'next-intl/middleware';

export const locales = ['en', 'fr', 'nl'];

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|en|nl)/:path*', '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)']
};