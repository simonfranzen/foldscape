import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { BUFFON_GUIDE } from "@/lib/explorer-guides/buffon";

export const metadata: Metadata = topicSubpageMetadata(
  "buffon",
  "explorer",
  "Explorer",
  BUFFON_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
