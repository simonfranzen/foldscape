import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { CANTOR_GUIDE } from "@/lib/explorer-guides/cantor";

export const metadata: Metadata = topicSubpageMetadata(
  "cantor",
  "explorer",
  "Explorer",
  CANTOR_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
