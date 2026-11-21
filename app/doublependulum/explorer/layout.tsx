import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { DOUBLE_PENDULUM_GUIDE } from "@/lib/explorer-guides/doublependulum";

export const metadata: Metadata = topicSubpageMetadata(
  "doublependulum",
  "explorer",
  "Explorer",
  DOUBLE_PENDULUM_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
