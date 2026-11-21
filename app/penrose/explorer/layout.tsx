import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { PENROSE_GUIDE } from "@/lib/explorer-guides/penrose";

export const metadata: Metadata = topicSubpageMetadata(
  "penrose",
  "explorer",
  "Explorer",
  PENROSE_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
