import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { ULAM_GUIDE } from "@/lib/explorer-guides/ulam";

export const metadata: Metadata = topicSubpageMetadata(
  "ulam",
  "explorer",
  "Explorer",
  ULAM_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
