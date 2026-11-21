import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { SMALLWORLD_GUIDE } from "@/lib/explorer-guides/smallworld";

export const metadata: Metadata = topicSubpageMetadata(
  "smallworld",
  "explorer",
  "Explorer",
  SMALLWORLD_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
