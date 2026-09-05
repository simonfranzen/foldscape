import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata: Metadata = pageMetadata(
  "/about",
  "About",
  "Who makes Foldscape and why: an atlas of mathematical curiosities curated by Simon Franzen at zauberware.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
