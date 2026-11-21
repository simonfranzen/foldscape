import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { LOGISTIC_SOUND_GUIDE } from "@/lib/explorer-guides/logistic-sound";

export const metadata: Metadata = topicSubpageMetadata(
  "logistic",
  "sound",
  "Sound lab",
  LOGISTIC_SOUND_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
