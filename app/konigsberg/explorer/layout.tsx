import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { KONIGSBERG_GUIDE } from "@/lib/explorer-guides/konigsberg";

export const metadata: Metadata = topicSubpageMetadata(
  "konigsberg",
  "explorer",
  "Explorer",
  KONIGSBERG_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
