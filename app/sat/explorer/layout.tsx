import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { SAT_GUIDE } from "@/lib/explorer-guides/sat";

export const metadata: Metadata = topicSubpageMetadata(
  "sat",
  "explorer",
  "Explorer",
  SAT_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
