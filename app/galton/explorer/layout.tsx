import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { GALTON_GUIDE } from "@/lib/explorer-guides/galton";

export const metadata: Metadata = topicSubpageMetadata(
  "galton",
  "explorer",
  "Explorer",
  GALTON_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
