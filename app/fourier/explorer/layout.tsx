import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { FOURIER_GUIDE } from "@/lib/explorer-guides/fourier";

export const metadata: Metadata = topicSubpageMetadata(
  "fourier",
  "explorer",
  "Explorer",
  FOURIER_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
