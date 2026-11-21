import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { BOIDS_GUIDE } from "@/lib/explorer-guides/boids";

export const metadata: Metadata = topicSubpageMetadata(
  "boids",
  "explorer",
  "Explorer",
  BOIDS_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
