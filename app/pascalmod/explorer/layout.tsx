import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";

export const metadata: Metadata = topicSubpageMetadata("pascalmod", "explorer", "Explorer");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
