import type { MetadataRoute } from "next";
import { TOPICS, type TopicId } from "@/lib/topics";
import { STATIC_PAGES, TOPIC_SUBROUTES } from "@/lib/seo/routes";
import { SITE_URL, languageAlternates } from "@/lib/og/metadata";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/types";
import { EXPLORER_GUIDES } from "@/lib/explorer-guides";
import { localePath } from "@/lib/i18n/paths";

// Sub-rooms carry their long text in a guide. A room is listed in the
// locales its guide covers, mirroring topicSubpageMetadata, so the sitemap
// never advertises a variant that is marked noindex.
function guideLocales(id: TopicId, sub: string): readonly Locale[] {
  const guide = EXPLORER_GUIDES[`${id}/${sub}`];
  return guide ? LOCALES.filter((l) => guide[l]) : [DEFAULT_LOCALE];
}

// One <url> per language variant, each listing all its siblings, which is
// the form Google asks for when hreflang lives in the sitemap.
function entries(path: string, locales: readonly Locale[] = LOCALES): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(path, locales)).map(([l, p]) => [l, `${SITE_URL}${p}`]),
  );
  return locales.map((l) => ({
    url: `${SITE_URL}${localePath(l, path)}`,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [...entries("/")];
  for (const topic of TOPICS) {
    out.push(...entries(topic.href));
    for (const sub of TOPIC_SUBROUTES[topic.id] ?? []) {
      out.push(...entries(`${topic.href}/${sub}`, guideLocales(topic.id, sub)));
    }
  }
  for (const p of STATIC_PAGES) out.push(...entries(p));
  return out;
}
