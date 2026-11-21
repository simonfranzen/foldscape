import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { GABRIELS_HORN_GUIDE } from "@/lib/explorer-guides/gabrielshorn";

export const metadata: Metadata = topicSubpageMetadata(
  "gabrielshorn",
  "explorer",
  "Explorer",
  GABRIELS_HORN_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
