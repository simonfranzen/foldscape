import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { APOLLONIAN_GUIDE } from "@/lib/explorer-guides/apollonian";

export const metadata: Metadata = topicSubpageMetadata(
  "apollonian",
  "explorer",
  "Explorer",
  APOLLONIAN_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
