import type { Metadata } from "next";
import { topicSubpageMetadata } from "@/lib/og/metadata";
import { JsonLd, topicSubpageJsonLd } from "@/lib/seo/jsonld";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/paths";
import { BACKPROP_GUIDE } from "@/lib/explorer-guides/backprop";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return topicSubpageMetadata(
    "backprop",
    "explorer",
    "Explorer",
    BACKPROP_GUIDE,
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
      <JsonLd data={topicSubpageJsonLd("backprop", "explorer", "Explorer", locale)} />
      {children}
    </>
  );
}
