import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Foldscape — an atlas of mathematical curiosities",
  description:
    "Eleven mathematical ideas where a single rule unfolds into a universe. Cathedral of One, Mandelbrot, Conway's Game of Life and more. Curated by Simon Franzen at zauberware technologies.",
  metadataBase: new URL("https://foldscape.zauberware.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${serif.variable}`}>
      <body className="noise antialiased bg-ink-950 text-ink-100 overflow-x-hidden">
        <I18nProvider>
          <Nav />
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
