import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/paths";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(
    "/datenschutz",
    "Privacy",
    "How Foldscape handles data: no cookies, no tracking, hosting logs only.",
    { locale: await resolveLocale(params) },
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
