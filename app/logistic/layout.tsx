import type { Metadata } from "next";
import { topicMetadata } from "@/lib/og/metadata";

export const metadata: Metadata = topicMetadata("logistic");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
