import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { EULER_GUIDE } from "@/lib/explorer-guides/euler";

export const metadata: Metadata = topicSubpageMetadata(
  "euler",
  "explorer",
  "Explorer",
  EULER_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
