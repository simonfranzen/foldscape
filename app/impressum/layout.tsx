import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata: Metadata = pageMetadata(
  "/impressum",
  "Imprint",
  "Legal notice for Foldscape, a project of zauberware technologies GmbH & Co. KG.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
