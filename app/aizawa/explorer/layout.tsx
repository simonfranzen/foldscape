import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { AIZAWA_GUIDE } from "@/lib/explorer-guides/aizawa";

export const metadata: Metadata = topicSubpageMetadata(
  "aizawa",
  "explorer",
  "Explorer",
  AIZAWA_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
