// Keep in sync with LOCALES in lib/i18n/types.ts (this file cannot import TS).
const TRANSLATED = "de|es|fr|it|pt|sv|no";
// First path segment that is not a locale. The lookahead needs "/" as well as
// "$": inside a path pattern "$" is the end of the whole URL, not the segment.
const NON_LOCALE = `/:first((?!(?:${TRANSLATED}|en)(?:/|$))[^/]+)`;
const LANG_QUERY = [{ type: "query", key: "lang", value: `(?<lang>${TRANSLATED})(?:[-_].*)?` }];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable Next's experimental App-Router integration with the browser
  // View Transitions API. The CSS @view-transition rule in globals.css
  // controls the actual animation; this flag lets Next opt the navigation
  // into the same-document transition pipeline so the page swap inherits it
  // without a blank flash.
  experimental: {
    viewTransition: true,
  },
  async redirects() {
    return [
      // Old query-parameter locale links (?lang=de) move to the path form.
      // Only unprefixed paths match, so the query string that Next carries
      // over cannot trigger a second redirect.
      { source: "/", has: LANG_QUERY, destination: "/:lang", permanent: true },
      {
        source: `${NON_LOCALE}/:rest*`,
        has: LANG_QUERY,
        destination: "/:lang/:first/:rest*",
        permanent: true,
      },
      // English has no prefix; /en/... must not exist as a second URL.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return {
      // Every page lives under app/[locale]/. Paths without a locale prefix
      // are English and are served from the internal /en/... routes, so the
      // original URLs stay exactly as they were. afterFiles runs after
      // public files and metadata routes (sitemap.xml, icons) but before
      // dynamic routes, which matters because /lorenz would otherwise match
      // [locale] = "lorenz".
      afterFiles: [
        { source: "/", destination: "/en" },
        {
          source: `${NON_LOCALE}/:rest*`,
          destination: "/en/:first/:rest*",
        },
      ],
    };
  },
};

export default nextConfig;
