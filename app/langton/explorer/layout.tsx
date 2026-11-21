import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { LANGTON_GUIDE } from "@/lib/explorer-guides/langton";

export const metadata: Metadata = topicSubpageMetadata(
  "langton",
  "explorer",
  "Explorer",
  LANGTON_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
