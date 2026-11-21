import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { DIFFUSION_GUIDE } from "@/lib/explorer-guides/diffusion";

export const metadata: Metadata = topicSubpageMetadata(
  "diffusion",
  "explorer",
  "Explorer",
  DIFFUSION_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
