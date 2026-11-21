import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { FOURIER_SOUND_GUIDE } from "@/lib/explorer-guides/fourier-sound";

export const metadata: Metadata = topicSubpageMetadata(
  "fourier",
  "sound",
  "Sound lab",
  FOURIER_SOUND_GUIDE.en.metaDescription,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
