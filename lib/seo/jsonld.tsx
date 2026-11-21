// Schema.org structured data, rendered as <script type="application/ld+json">
// from server components so it lands in the prerendered HTML. No "use client":
// the markup must exist before hydration for crawlers that never run JS.

import { getTopic, type TopicId } from "@/lib/topics";
import { SITE_URL, topicSeoCopy } from "@/lib/og/metadata";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/types";
import { localePath } from "@/lib/i18n/paths";

type JsonLdData = Record<string, unknown>;

const SITE_NAME = "Foldscape";
const ORG_ID = "https://www.zauberware.com/#organization";
const WEBSITE_ID = `${SITE_URL}/#website`;
const AUTHOR = { "@type": "Person", name: "Simon Franzen", url: "https://www.zauberware.com" };

// JSON.stringify does not escape "<", so a string containing "</script>"
// would close the tag early. The escaped form reads identically to a JSON parser.
export function serializeJsonLd(data: JsonLdData | JsonLdData[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

export function siteJsonLd(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "zauberware",
        url: "https://www.zauberware.com",
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        inLanguage: [...LOCALES],
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

function breadcrumb(items: Array<{ name: string; url: string }>): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// Article for Google's rich result, LearningResource for what the page is.
// The image is the route's generated Open Graph card.
export function topicJsonLd(id: TopicId, locale: Locale = DEFAULT_LOCALE): JsonLdData[] {
  const topic = getTopic(id);
  const { title, description } = topicSeoCopy(id, locale);
  const url = `${SITE_URL}${localePath(locale, topic.href)}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": ["Article", "LearningResource"],
      headline: title,
      name: title,
      description,
      image: `${url}/opengraph-image`,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      inLanguage: locale,
      isAccessibleForFree: true,
      author: AUTHOR,
      publisher: {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "zauberware",
        url: "https://www.zauberware.com",
      },
      isPartOf: { "@id": WEBSITE_ID },
    },
    breadcrumb([
      { name: SITE_NAME, url: `${SITE_URL}${localePath(locale, "/")}` },
      { name: title, url },
    ]),
  ];
}

// For the interactive sub-rooms (explorer, sandbox, builder, ...): a
// three-level breadcrumb Foldscape > Topic > Room. Render it with
// <JsonLd data={topicSubpageJsonLd("lorenz", "explorer", "Explorer")} />
// from the sub-route's layout.tsx.
export function topicSubpageJsonLd(
  id: TopicId,
  sub: string,
  label: string,
  locale: Locale = DEFAULT_LOCALE,
): JsonLdData[] {
  const topic = getTopic(id);
  const { title } = topicSeoCopy(id, locale);
  const topicUrl = `${SITE_URL}${localePath(locale, topic.href)}`;
  return [
    breadcrumb([
      { name: SITE_NAME, url: `${SITE_URL}${localePath(locale, "/")}` },
      { name: title, url: topicUrl },
      { name: label, url: `${topicUrl}/${sub}` },
    ]),
  ];
}

// Topic layouts are server components; this keeps each one a single line.
export function TopicJsonLd({ id, locale }: { id: TopicId; locale?: Locale }) {
  return <JsonLd data={topicJsonLd(id, locale)} />;
}
