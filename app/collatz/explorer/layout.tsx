import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { COLLATZ_GUIDE } from "@/lib/explorer-guides/collatz";

export const metadata: Metadata = topicSubpageMetadata(
  "collatz",
  "explorer",
  "Explorer",
  COLLATZ_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
