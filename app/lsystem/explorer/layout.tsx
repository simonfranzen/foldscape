import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { LSYSTEM_GUIDE } from "@/lib/explorer-guides/lsystem";

export const metadata: Metadata = topicSubpageMetadata(
  "lsystem",
  "explorer",
  "Explorer",
  LSYSTEM_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
