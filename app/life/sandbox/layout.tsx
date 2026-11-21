import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { LIFE_SANDBOX_GUIDE } from "@/lib/explorer-guides/life-sandbox";

export const metadata: Metadata = topicSubpageMetadata(
  "life",
  "sandbox",
  "Sandbox",
  LIFE_SANDBOX_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
