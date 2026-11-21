import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { FOURCOLOR_GUIDE } from "@/lib/explorer-guides/fourcolor";

export const metadata: Metadata = topicSubpageMetadata(
  "fourcolor",
  "explorer",
  "Explorer",
  FOURCOLOR_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
