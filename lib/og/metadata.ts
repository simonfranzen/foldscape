// Per-topic OpenGraph / Twitter metadata helper. Topic page.tsx files are
// client components and cannot export generateMetadata, so each topic gets a
// tiny layout.tsx that delegates here.

import type { Metadata } from "next";
import { getTopic, type TopicId } from "@/lib/topics";
import { EN_PLACEHOLDERS } from "@/lib/i18n/placeholders";

const EN_OVERRIDES: Partial<Record<TopicId, { title: string; tagline: string }>> = {
  eml: {
    title: "The EML Calculus",
    tagline: "One operator builds (almost) every elementary function",
  },
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

export function topicMetadata(id: TopicId): Metadata {
  const topic = getTopic(id);
  const { title, tagline } = getTopicCopy(id);
  const fullTitle = `${title} — Foldscape`;
  const description =
    tagline || `${title}, an idea in the Foldscape atlas of mathematical curiosities.`;
  const url = topic.href;
  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Foldscape",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    alternates: { canonical: url },
  };
}
