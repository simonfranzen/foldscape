import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { MAGPENDULUM_GUIDE } from "@/lib/explorer-guides/magpendulum";

export const metadata: Metadata = topicSubpageMetadata(
  "magpendulum",
  "explorer",
  "Explorer",
  MAGPENDULUM_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
