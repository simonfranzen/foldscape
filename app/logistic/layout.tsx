import type { Metadata } from "next";
import { topicMetadata } from "@/lib/og/metadata";
import { TopicJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = topicMetadata("logistic");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopicJsonLd id="logistic" />
      {children}
    </>
  );
}
