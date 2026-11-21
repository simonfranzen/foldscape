import type { Metadata } from "next";
import { topicMetadata } from "@/lib/og/metadata";
import { TopicJsonLd } from "@/lib/seo/jsonld";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/paths";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return topicMetadata("lorenz", await resolveLocale(params));
}

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode } & LocaleParams) {
  return (
    <>
      <TopicJsonLd id="lorenz" locale={await resolveLocale(params)} />
      {children}
    </>
  );
}
