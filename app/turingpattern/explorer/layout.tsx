import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { TURINGPATTERN_GUIDE } from "@/lib/explorer-guides/turingpattern";

export const metadata: Metadata = topicSubpageMetadata(
  "turingpattern",
  "explorer",
  "Explorer",
  TURINGPATTERN_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
