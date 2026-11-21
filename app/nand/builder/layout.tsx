import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { NAND_BUILDER_GUIDE } from "@/lib/explorer-guides/nand-builder";

export const metadata: Metadata = topicSubpageMetadata(
  "nand",
  "builder",
  "Builder",
  NAND_BUILDER_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
