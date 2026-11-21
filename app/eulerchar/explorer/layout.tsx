import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { EULERCHAR_GUIDE } from "@/lib/explorer-guides/eulerchar";

export const metadata: Metadata = topicSubpageMetadata(
  "eulerchar",
  "explorer",
  "Explorer",
  EULERCHAR_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
