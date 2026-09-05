import type { MetadataRoute } from "next";
import { TOPICS } from "@/lib/topics";
import { STATIC_PAGES, TOPIC_SUBROUTES } from "@/lib/seo/routes";
import { SITE_URL, languageAlternates } from "@/lib/og/metadata";

// Every URL lists its eight language variants as alternates so search
// engines can pair them; the bare path is English and x-default.
function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
): MetadataRoute.Sitemap[number] {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([l, p]) => [l, `${SITE_URL}${p}`]),
  );
  return {
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [entry("/", 1, "weekly")];
  for (const topic of TOPICS) {
    out.push(entry(topic.href, 0.8, "monthly"));
    for (const sub of TOPIC_SUBROUTES[topic.id] ?? []) {
      out.push(entry(`${topic.href}/${sub}`, 0.6, "monthly"));
    }
  }
  for (const p of STATIC_PAGES) out.push(entry(p, 0.3, "yearly"));
  return out;
}
