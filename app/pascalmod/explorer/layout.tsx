import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { PASCALMOD_GUIDE } from "@/lib/explorer-guides/pascalmod";

export const metadata: Metadata = topicSubpageMetadata(
  "pascalmod",
  "explorer",
  "Explorer",
  PASCALMOD_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
