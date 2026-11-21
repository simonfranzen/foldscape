import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { PVSNP_GUIDE } from "@/lib/explorer-guides/pvsnp";

export const metadata: Metadata = topicSubpageMetadata(
  "pvsnp",
  "explorer",
  "Explorer",
  PVSNP_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
