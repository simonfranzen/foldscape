// Per-route metadata helpers. Topic page.tsx files are client components and
// cannot export generateMetadata, so each route gets a tiny layout.tsx that
// delegates here.

import type { Metadata } from "next";
import { getTopic, type TopicId } from "@/lib/topics";
import { EN_PLACEHOLDERS } from "@/lib/i18n/placeholders";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/types";

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

// The locale lives in the ?lang= query parameter, so every translated
// variant of a path is the same path plus that parameter. The default locale
// is the bare path and doubles as x-default. Google accepts query-parameter
// hreflang as long as each URL serves that language, which the client-side
// locale switch guarantees after hydration.
export function languageAlternates(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LOCALES) {
    out[l] = l === DEFAULT_LOCALE ? path : `${path}?lang=${l}`;
  }
  out["x-default"] = path;
  return out;
}

// Titles carry the site suffix explicitly via `absolute`: the root title
// template only reaches direct children, so nested sub-rooms (explorer,
// sandbox) would otherwise lose the suffix while story pages keep it.
export function pageMetadata(
  path: string,
  title: string,
  description: string,
  type: "website" | "article" = "website",
): Metadata {
  return {
    title: { absolute: `${title} — Foldscape` },
    description,
    openGraph: {
      title: `${title} — Foldscape`,
      description,
      url: path,
      siteName: "Foldscape",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Foldscape`,
      description,
    },
    alternates: { canonical: path, languages: languageAlternates(path) },
  };
}

export function topicMetadata(id: TopicId): Metadata {
  const topic = getTopic(id);
  const { title, tagline } = getTopicCopy(id);
  const description =
    tagline || `${title}, an idea in the Foldscape atlas of mathematical curiosities.`;
  return pageMetadata(topic.href, title, description, "article");
}

// Interactive sub-rooms (explorer, sandbox, simulator, builder, reducer,
// sound) share the topic's copy but need their own canonical, otherwise they
// would inherit the story page's canonical from the topic layout.
export function topicSubpageMetadata(id: TopicId, sub: string, label: string): Metadata {
  const topic = getTopic(id);
  const { title } = getTopicCopy(id);
  const description = `${label} for ${title}: play with the parameters yourself, in the browser, no sign-up.`;
  return pageMetadata(`${topic.href}/${sub}`, `${title}: ${label}`, description);
}
