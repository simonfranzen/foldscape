import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { PHI_GUIDE } from "@/lib/explorer-guides/phi";

export const metadata: Metadata = topicSubpageMetadata(
  "phi",
  "explorer",
  "Explorer",
  PHI_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
