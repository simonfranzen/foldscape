import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { JsonLd, topicSubpageJsonLd } from "@/lib/seo/jsonld";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/paths";
import { KONIGSBERG_GUIDE } from "@/lib/explorer-guides/konigsberg";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return topicSubpageMetadata(
    "konigsberg",
    "explorer",
    "Explorer",
    KONIGSBERG_GUIDE,
    await resolveLocale(params),
  );
}

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode } & LocaleParams) {
  const locale = await resolveLocale(params);
  return (
    <>
      <JsonLd data={topicSubpageJsonLd("konigsberg", "explorer", "Explorer", locale)} />
      {children}
    </>
  );
}
