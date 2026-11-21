import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { RSA_GUIDE } from "@/lib/explorer-guides/rsa";

export const metadata: Metadata = topicSubpageMetadata(
  "rsa",
  "explorer",
  "Explorer",
  RSA_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
