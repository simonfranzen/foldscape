import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { LOGISTIC_GUIDE } from "@/lib/explorer-guides/logistic";

export const metadata: Metadata = topicSubpageMetadata(
  "logistic",
  "explorer",
  "Explorer",
  LOGISTIC_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
