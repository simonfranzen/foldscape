import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { HALTING_GUIDE } from "@/lib/explorer-guides/halting";

export const metadata: Metadata = topicSubpageMetadata(
  "halting",
  "explorer",
  "Explorer",
  HALTING_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
