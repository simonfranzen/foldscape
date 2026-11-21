import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { CHAOSGAME_GUIDE } from "@/lib/explorer-guides/chaosgame";

export const metadata: Metadata = topicSubpageMetadata(
  "chaosgame",
  "explorer",
  "Explorer",
  CHAOSGAME_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
