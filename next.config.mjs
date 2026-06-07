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
};

export default nextConfig;
