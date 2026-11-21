import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { STERNBROCOT_GUIDE } from "@/lib/explorer-guides/sternbrocot";

export const metadata: Metadata = topicSubpageMetadata(
  "sternbrocot",
  "explorer",
  "Explorer",
  STERNBROCOT_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
