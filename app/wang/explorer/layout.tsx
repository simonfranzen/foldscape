import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { WANG_GUIDE } from "@/lib/explorer-guides/wang";

export const metadata: Metadata = topicSubpageMetadata(
  "wang",
  "explorer",
  "Explorer",
  WANG_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
