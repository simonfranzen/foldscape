import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { LORENZ_GUIDE } from "@/lib/explorer-guides/lorenz";

export const metadata: Metadata = topicSubpageMetadata(
  "lorenz",
  "explorer",
  "Explorer",
  LORENZ_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
