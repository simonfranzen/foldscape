import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { DLA_GUIDE } from "@/lib/explorer-guides/dla";

export const metadata: Metadata = topicSubpageMetadata(
  "dla",
  "explorer",
  "Explorer",
  DLA_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
