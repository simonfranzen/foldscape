import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { MANDELBROT_GUIDE } from "@/lib/explorer-guides/mandelbrot";

export const metadata: Metadata = topicSubpageMetadata(
  "mandelbrot",
  "explorer",
  "Explorer",
  MANDELBROT_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
