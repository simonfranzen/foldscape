import type { MetadataRoute } from "next";
import { TOPICS } from "@/lib/topics";
import { STATIC_PAGES, TOPIC_SUBROUTES } from "@/lib/seo/routes";
import { SITE_URL, languageAlternates } from "@/lib/og/metadata";
import { LOCALES, type Locale } from "@/lib/i18n/types";
import { localePath } from "@/lib/i18n/paths";

// Sub-rooms carry their long text in a guide that exists in these locales
// only; the other locale variants are noindex and stay out of the sitemap.
// Keep in sync with the locales filled in lib/explorer-guides/*.
const GUIDE_LOCALES: readonly Locale[] = ["en", "de"];

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
      out.push(...entries(`${topic.href}/${sub}`, GUIDE_LOCALES));
    }
  }
  for (const p of STATIC_PAGES) out.push(...entries(p));
  return out;
}
