import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { RULE110_SIMULATOR_GUIDE } from "@/lib/explorer-guides/rule110-simulator";

export const metadata: Metadata = topicSubpageMetadata(
  "rule110",
  "simulator",
  "Simulator",
  RULE110_SIMULATOR_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
