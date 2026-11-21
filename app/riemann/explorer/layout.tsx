import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { RIEMANN_GUIDE } from "@/lib/explorer-guides/riemann";

export const metadata: Metadata = topicSubpageMetadata(
  "riemann",
  "explorer",
  "Explorer",
  RIEMANN_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
