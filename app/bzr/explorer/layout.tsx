import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { BZR_GUIDE } from "@/lib/explorer-guides/bzr";

export const metadata: Metadata = topicSubpageMetadata(
  "bzr",
  "explorer",
  "Explorer",
  BZR_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
