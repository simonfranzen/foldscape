import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/paths";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(
    "/about",
    "About",
    "Who makes Foldscape and why: an atlas of mathematical curiosities curated by Simon Franzen at zauberware.",
    { locale: await resolveLocale(params) },
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
