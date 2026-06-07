import type { Metadata } from "next";
import { topicMetadata } from "@/lib/og/metadata";

export const metadata: Metadata = topicMetadata("buffon");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
