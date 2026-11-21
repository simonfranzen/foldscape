import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import { Suspense } from "react";
import "../globals.css";
import { Nav } from "@/components/Nav";
import { I18nProvider } from "@/lib/i18n/context";
import { Footer } from "@/components/Footer";
import { palette } from "@/lib/visual/palette";
import { TITLE_SUFFIX, languageAlternates } from "@/lib/og/metadata";
import { JsonLd, siteJsonLd } from "@/lib/seo/jsonld";
import { ATLAS } from "@/lib/i18n/atlas";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/types";
import { localePath, resolveLocale, type LocaleParams } from "@/lib/i18n/paths";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const SITE_URL = "https://foldscape.zauberware.com";
const SITE_TITLE = "Foldscape · an atlas of mathematical curiosities";
const SITE_DESCRIPTION =
  "An interactive atlas of mathematical curiosities: fractals, chaos, logic and computation. Explore the Mandelbrot set, Conway's Game of Life, Lorenz, Fourier and more.";

// Home-page copy per locale. English keeps its hand-written search copy;
// the other locales reuse their translated landing text.
function siteCopy(locale: Locale): { title: string; description: string } {
  if (locale === DEFAULT_LOCALE) return { title: SITE_TITLE, description: SITE_DESCRIPTION };
  const { pretitle, subtitle, hook } = ATLAS[locale].landing;
  const tagline = pretitle.replace(/^Foldscape:\s*/, "");
  const text = `${subtitle} ${hook}`.replace(/\s+/g, " ").trim();
  const description = text.length <= 158 ? text : `${text.slice(0, text.lastIndexOf(" ", 157))}…`;
  return { title: `Foldscape · ${tagline}`, description };
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = siteCopy(locale);
  const url = localePath(locale, "/");
  return {
    title: { default: title, template: `%s${TITLE_SUFFIX}` },
    description,
    metadataBase: new URL(SITE_URL),
    applicationName: "Foldscape",
    authors: [{ name: "Simon Franzen", url: "https://www.zauberware.com" }],
    creator: "Simon Franzen",
    publisher: "zauberware",
    alternates: { canonical: url, languages: languageAlternates("/") },
    // Renders <meta name="google-site-verification"> for Search Console ownership.
    verification: { google: "THoemAetESahjTsaEFj9W4_CKl8D3wBPM-FBLGssUgA" },
    openGraph: { type: "website", url, siteName: "Foldscape", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Only the eight known locales exist; anything else under /[locale] is a 404
// instead of an on-demand render of an unknown language.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: palette.canvas.bg,
};

export default async function RootLayout({
  children,
  params,
}: { children: React.ReactNode } & LocaleParams) {
  const locale = await resolveLocale(params);
  return (
    <html lang={locale} className={`${inter.variable} ${mono.variable} ${serif.variable}`}>
      <head>
        {/* Preload the two KaTeX fonts that every formula on the site uses.
            Without this, the browser only discovers them after KaTeX hydrates
            and writes its HTML in a useEffect, too late to avoid a visible
            FOIT/swap. Combined with font-display: swap (see globals.css) this
            removes the "weird-looking formula for half a second" symptom. */}
        <link
          rel="preload"
          href="/fonts/KaTeX_Main-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/KaTeX_Math-Italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <JsonLd data={siteJsonLd()} />
      </head>
      <body className="noise overflow-x-hidden bg-ink-950 text-ink-100 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-signal-violet focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest2 focus:text-ink-950"
        >
          Skip to main content
        </a>
        {/* The Suspense boundary is kept so an async client hook below the
            provider cannot take the whole shell down. */}
        <Suspense fallback={null}>
          <I18nProvider locale={locale}>
            <Nav />
            <div id="main">{children}</div>
            <Footer />
          </I18nProvider>
        </Suspense>
      </body>
    </html>
  );
}
