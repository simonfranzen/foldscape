import type { Metadata } from "next";
import { topicMetadata } from "@/lib/og/metadata";

export const metadata: Metadata = topicMetadata("eulerchar");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
