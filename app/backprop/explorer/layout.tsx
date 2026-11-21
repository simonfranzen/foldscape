import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { BACKPROP_GUIDE } from "@/lib/explorer-guides/backprop";

export const metadata: Metadata = topicSubpageMetadata(
  "backprop",
  "explorer",
  "Explorer",
  BACKPROP_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
