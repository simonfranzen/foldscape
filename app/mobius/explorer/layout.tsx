import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { MOBIUS_GUIDE } from "@/lib/explorer-guides/mobius";

export const metadata: Metadata = topicSubpageMetadata(
  "mobius",
  "explorer",
  "Explorer",
  MOBIUS_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
