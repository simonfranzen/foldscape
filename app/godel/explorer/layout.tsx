import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { GODEL_GUIDE } from "@/lib/explorer-guides/godel";

export const metadata: Metadata = topicSubpageMetadata(
  "godel",
  "explorer",
  "Explorer",
  GODEL_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
