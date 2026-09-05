import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata: Metadata = pageMetadata(
  "/datenschutz",
  "Privacy",
  "How Foldscape handles data: no cookies, no tracking, hosting logs only.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
