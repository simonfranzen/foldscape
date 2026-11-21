import type { Locale } from "@/lib/i18n/types";

// Long-form "how this works" copy for an explorer. It is rendered into the
// prerendered HTML below the playground (that is what search engines index)
// and reused by the help modal, so the two can never drift apart.
export interface GuideSection {
  heading: string;
  paragraphs: string[];
  /** Optional display formula (LaTeX), rendered after the paragraphs. */
  formula?: string;
  /** Optional excerpt of the real implementation, shown verbatim. */
  code?: string;
}

export interface GuideExperiment {
  title: string;
  text: string;
}

export interface ExplorerGuideContent {
  /** Used for <meta name="description">; aim for 140 to 160 characters. */
  metaDescription: string;
  heading: string;
  intro: string;
  sections: GuideSection[];
  experimentsHeading: string;
  experiments: GuideExperiment[];
}

// EN is required; other locales fall back to it, like the atlas copy does.
export type ExplorerGuide = { en: ExplorerGuideContent } & Partial<
  Record<Exclude<Locale, "en">, ExplorerGuideContent>
>;

export function guideFor(guide: ExplorerGuide, locale: Locale): ExplorerGuideContent {
  return guide[locale] ?? guide.en;
}
