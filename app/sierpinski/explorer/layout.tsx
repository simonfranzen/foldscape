import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { SIERPINSKI_GUIDE } from "@/lib/explorer-guides/sierpinski";

export const metadata: Metadata = topicSubpageMetadata(
  "sierpinski",
  "explorer",
  "Explorer",
  SIERPINSKI_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
