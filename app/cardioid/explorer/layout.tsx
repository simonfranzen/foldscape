import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { CARDIOID_GUIDE } from "@/lib/explorer-guides/cardioid";

export const metadata: Metadata = topicSubpageMetadata(
  "cardioid",
  "explorer",
  "Explorer",
  CARDIOID_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
