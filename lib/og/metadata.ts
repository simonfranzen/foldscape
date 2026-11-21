// Per-route metadata helpers. Topic page.tsx files are client components and
// cannot export generateMetadata, so each route gets a tiny layout.tsx that
// delegates here.

import type { Metadata } from "next";
import { getTopic, type TopicId } from "@/lib/topics";
import { EN_PLACEHOLDERS } from "@/lib/i18n/placeholders";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/types";
import { localePath } from "@/lib/i18n/paths";
import { ATLAS } from "@/lib/i18n/atlas";
import type { ExplorerGuide } from "@/lib/explorer-guides/types";
import { TOPIC_SEO } from "@/lib/seo/descriptions";

export const SITE_URL = "https://foldscape.zauberware.com";

const EN_OVERRIDES: Partial<Record<TopicId, { title: string; tagline: string }>> = {
  nand: { title: "The Sheffer Stroke", tagline: "One gate is enough for all of digital logic" },
  iota: { title: "The Iota Combinator", tagline: "One symbol that is Turing-complete" },
  life: {
    title: "Conway's Game of Life",
    tagline: "Four rules. Spaceships, factories, computers.",
  },
  rule110: { title: "Rule 110", tagline: "An eight-bit rule, provably universal" },
  logistic: {
    title: "The Logistic Map",
    tagline: "A harmless formula where order collapses into chaos",
  },
  mandelbrot: { title: "The Mandelbrot Set", tagline: "Square and add. Forever." },
  lorenz: { title: "The Lorenz Attractor", tagline: "Three lines of code, one butterfly" },
  fourier: { title: "The Fourier Transform", tagline: "Every signal is a sum of sine waves" },
  euler: { title: "Euler's Identity", tagline: "The five most important numbers, in one line" },
  banach: {
    title: "The Banach-Tarski Paradox",
    tagline: "Cut a ball, end up with two of the same size",
  },
};

export function getTopicCopy(id: TopicId): { title: string; tagline: string } {
  const override = EN_OVERRIDES[id];
  if (override) return override;
  const placeholder = (EN_PLACEHOLDERS as Record<string, { title: string; tagline: string }>)[id];
  if (placeholder) return { title: placeholder.title, tagline: placeholder.tagline };
  return { title: id, tagline: "" };
}

// Each translated variant of a path lives under its locale prefix
// (/de/lorenz); the default locale is the bare path and doubles as
// x-default. `locales` narrows the set for pages that are not translated
// into every language, so hreflang never points at a page in the wrong one.
export function languageAlternates(
  path: string,
  locales: readonly Locale[] = LOCALES,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of locales) out[l] = localePath(l, path);
  out["x-default"] = path;
  return out;
}

export const TITLE_SUFFIX = " · Foldscape";

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  de: "de_DE",
  es: "es_ES",
  fr: "fr_FR",
  it: "it_IT",
  pt: "pt_PT",
  sv: "sv_SE",
  no: "nb_NO",
};

interface PageMetaOptions {
  type?: "website" | "article";
  locale?: Locale;
  /** Locales this page really exists in; defaults to all of them. */
  locales?: readonly Locale[];
}

// Titles carry the site suffix explicitly via `absolute`: the root title
// template only reaches direct children, so nested sub-rooms (explorer,
// sandbox) would otherwise lose the suffix while story pages keep it.
export function pageMetadata(
  path: string,
  title: string,
  description: string,
  { type = "website", locale = DEFAULT_LOCALE, locales = LOCALES }: PageMetaOptions = {},
): Metadata {
  const url = localePath(locale, path);
  // A locale outside `locales` still renders (its UI chrome is translated)
  // but the main text is English, so it stays out of the index. It keeps a
  // self-referencing canonical: noindex combined with a canonical to another
  // URL sends search engines two contradicting instructions.
  const translated = locales.includes(locale);
  return {
    title: { absolute: `${title}${TITLE_SUFFIX}` },
    description,
    openGraph: {
      title: `${title}${TITLE_SUFFIX}`,
      description,
      url,
      siteName: "Foldscape",
      type,
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}${TITLE_SUFFIX}`,
      description,
    },
    alternates: {
      canonical: url,
      languages: languageAlternates(path, locales),
    },
    ...(translated ? {} : { robots: { index: false, follow: true } }),
  };
}

// Cut at a word boundary so a description never ends mid-word.
function clip(text: string, max = 158): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}

// Search-facing title and description for a story page. The title falls back
// to the atlas card title; the description falls back to the tagline only
// if a topic was added without an entry in TOPIC_SEO.
export function topicSeoCopy(
  id: TopicId,
  locale: Locale = DEFAULT_LOCALE,
): { title: string; description: string } {
  // The hand-written search copy exists in English only; other locales use
  // their translated atlas card (title, then tagline and body as description).
  if (locale !== DEFAULT_LOCALE) {
    const card = ATLAS[locale].topics[id];
    if (card?.title) {
      const lead = /[.!?…]$/.test(card.tagline) ? card.tagline : `${card.tagline}.`;
      return { title: card.title, description: clip(`${lead} ${card.body}`) };
    }
  }
  const { title, tagline } = getTopicCopy(id);
  const seo = TOPIC_SEO[id];
  return {
    title: seo?.title ?? title,
    description:
      seo?.description ||
      tagline ||
      `${title}, an idea in the Foldscape atlas of mathematical curiosities.`,
  };
}

export function topicMetadata(id: TopicId, locale: Locale = DEFAULT_LOCALE): Metadata {
  const topic = getTopic(id);
  const { title, description } = topicSeoCopy(id, locale);
  return pageMetadata(topic.href, title, description, { type: "article", locale });
}

// Interactive sub-rooms (explorer, sandbox, simulator, builder, reducer,
// sound) share the topic's copy but need their own canonical, otherwise they
// would inherit the story page's canonical from the topic layout. Their long
// text is the guide, so a room counts as translated exactly for the locales
// its guide covers.
export function topicSubpageMetadata(
  id: TopicId,
  sub: string,
  label: string,
  guide: ExplorerGuide,
  locale: Locale = DEFAULT_LOCALE,
): Metadata {
  const topic = getTopic(id);
  const locales = LOCALES.filter((l) => guide[l]);
  const { title } = topicSeoCopy(id, locales.includes(locale) ? locale : DEFAULT_LOCALE);
  const description = (guide[locale] ?? guide.en).metaDescription;
  return pageMetadata(`${topic.href}/${sub}`, `${title}: ${label}`, description, {
    locale,
    locales,
  });
}
