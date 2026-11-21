import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { IOTA_REDUCER_GUIDE } from "@/lib/explorer-guides/iota-reducer";

export const metadata: Metadata = topicSubpageMetadata(
  "iota",
  "reducer",
  "Reducer",
  IOTA_REDUCER_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
