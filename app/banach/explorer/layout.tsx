import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { BANACH_GUIDE } from "@/lib/explorer-guides/banach";

export const metadata: Metadata = topicSubpageMetadata(
  "banach",
  "explorer",
  "Explorer",
  BANACH_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
