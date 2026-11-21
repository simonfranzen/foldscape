import type { Metadata } from "next";
import { pageMetadata } from "@/lib/og/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/paths";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(
    "/impressum",
    "Imprint",
    "Legal notice for Foldscape, a project of zauberware technologies GmbH & Co. KG.",
    { locale: await resolveLocale(params) },
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
