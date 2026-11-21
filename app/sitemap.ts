import type { MetadataRoute } from "next";
import { TOPICS } from "@/lib/topics";
import { STATIC_PAGES, TOPIC_SUBROUTES } from "@/lib/seo/routes";
import { SITE_URL, languageAlternates } from "@/lib/og/metadata";

// Every URL lists its eight language variants as alternates so search
// engines can pair them; the bare path is English and x-default.
//
// No lastModified: a build timestamp on every URL is a signal Google learns
// to ignore, and there is no honest per-route date available at build time
// (shallow CI clones rule out git). changeFrequency and priority are left out
// because Google ignores both.
function entry(path: string): MetadataRoute.Sitemap[number] {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([l, p]) => [l, `${SITE_URL}${p}`]),
  );
  return {
    url: `${SITE_URL}${path}`,
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [entry("/")];
  for (const topic of TOPICS) {
    out.push(entry(topic.href));
    for (const sub of TOPIC_SUBROUTES[topic.id] ?? []) {
      out.push(entry(`${topic.href}/${sub}`));
    }
  }
  for (const p of STATIC_PAGES) out.push(entry(p));
  return out;
}
