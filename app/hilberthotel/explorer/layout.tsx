import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { HILBERTHOTEL_GUIDE } from "@/lib/explorer-guides/hilberthotel";

export const metadata: Metadata = topicSubpageMetadata(
  "hilberthotel",
  "explorer",
  "Explorer",
  HILBERTHOTEL_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
