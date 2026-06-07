import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { I18nProvider } from "@/lib/i18n/context";
import { Footer } from "@/components/Footer";

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
const SITE_TITLE = "Foldscape — an atlas of mathematical curiosities";
const SITE_DESCRIPTION =
  "From almost nothing — everything. An atlas of mathematical curiosities where a single rule unfolds into a universe: Mandelbrot, Conway's Life, Lorenz, Fourier, Euler and more. Curated by Simon Franzen at zauberware.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s — Foldscape",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  applicationName: "Foldscape",
  authors: [{ name: "Simon Franzen", url: "https://www.zauberware.com" }],
  creator: "Simon Franzen",
  publisher: "zauberware",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Foldscape",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#06070d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${serif.variable}`}>
      <head>
        {/* Preload the two KaTeX fonts that every formula on the site uses.
            Without this, the browser only discovers them after KaTeX hydrates
            and writes its HTML in a useEffect — too late to avoid a visible
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
      </head>
      <body className="noise overflow-x-hidden bg-ink-950 text-ink-100 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-signal-violet focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest2 focus:text-ink-950"
        >
          Skip to main content
        </a>
        {/* I18nProvider uses useSearchParams() to honour ?lang=<locale>; Next
            requires that to live under a Suspense boundary so the static
            shell can render while the client picks up the query string. */}
        <Suspense fallback={null}>
          <I18nProvider>
            <Nav />
            <div id="main">{children}</div>
            <Footer />
          </I18nProvider>
        </Suspense>
      </body>
    </html>
  );
}
