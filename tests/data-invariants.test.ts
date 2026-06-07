// Data invariants for the atlas. These are pure data assertions — no DOM,
// no React. They are the cheapest tests in this suite and the most likely
// to catch real regressions (a missing locale string, a topic with no page,
// an edge that points at a deleted topic, etc.).

import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { TOPICS, type TopicId } from "@/lib/topics";
import { TOPIC_EDGES } from "@/lib/topicEdges";
import { TOPIC_HUBS } from "@/lib/topicHubs";
import { TOPIC_LINKS } from "@/lib/topicLinks";
import { ATLAS } from "@/lib/i18n/atlas";
import { MESSAGES } from "@/lib/i18n/messages";
import { UI } from "@/lib/i18n/ui";
import { LOCALES, type Locale } from "@/lib/i18n/types";

const TOPIC_IDS = TOPICS.map((t) => t.id);
const TOPIC_ID_SET = new Set<TopicId>(TOPIC_IDS);
const REPO_ROOT = join(__dirname, "..");

const HUBS_PER_CATEGORY = 2;
const CATEGORIES = ["logic", "computation", "chaos", "geometry", "analysis", "paradox"] as const;

// Walk every key path in `template` and collect missing paths in `candidate`.
// A key is considered required iff its value in the EN template is not
// undefined; optional fields are simply absent in the template and don't
// generate a check. Arrays are treated as leaves — we don't recurse into them.
function missingKeyPaths(template: unknown, candidate: unknown, prefix = ""): string[] {
  if (template === null || typeof template !== "object" || Array.isArray(template)) return [];
  if (candidate === null || typeof candidate !== "object" || Array.isArray(candidate)) {
    return [prefix || "<root>"];
  }
  const missing: string[] = [];
  for (const key of Object.keys(template as Record<string, unknown>)) {
    const tVal = (template as Record<string, unknown>)[key];
    if (tVal === undefined) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (!(key in (candidate as Record<string, unknown>))) {
      missing.push(path);
      continue;
    }
    const cVal = (candidate as Record<string, unknown>)[key];
    if (cVal === undefined) {
      missing.push(path);
      continue;
    }
    missing.push(...missingKeyPaths(tVal, cVal, path));
  }
  return missing;
}

describe("topic registry", () => {
  it("every Topic.href matches /<id>", () => {
    for (const t of TOPICS) {
      expect(t.href).toBe(`/${t.id}`);
    }
  });

  it("topic ids are unique", () => {
    expect(new Set(TOPIC_IDS).size).toBe(TOPIC_IDS.length);
  });

  it("there is a story page on disk for every topic", () => {
    const missing = TOPICS.filter((t) => !existsSync(join(REPO_ROOT, "app", t.id, "page.tsx"))).map(
      (t) => t.id,
    );
    expect(missing, `missing app/<id>/page.tsx for: ${missing.join(", ")}`).toEqual([]);
  });
});

describe("topic edges", () => {
  it("every edge endpoint references a known topic id", () => {
    const dangling: string[] = [];
    for (const e of TOPIC_EDGES) {
      if (!TOPIC_ID_SET.has(e.a)) dangling.push(`edge.a=${e.a}`);
      if (!TOPIC_ID_SET.has(e.b)) dangling.push(`edge.b=${e.b}`);
    }
    expect(dangling).toEqual([]);
  });

  it("no self-loops", () => {
    const loops = TOPIC_EDGES.filter((e) => e.a === e.b);
    expect(loops).toEqual([]);
  });
});

describe("topic links", () => {
  it("TOPIC_LINKS has an entry for every TopicId", () => {
    const missing = TOPIC_IDS.filter((id) => !(id in TOPIC_LINKS));
    expect(missing).toEqual([]);
  });

  it("every TOPIC_LINKS entry has at least one link with a non-empty href", () => {
    for (const id of TOPIC_IDS) {
      const links = TOPIC_LINKS[id];
      expect(links.length, `${id} has no links`).toBeGreaterThan(0);
      for (const l of links) {
        expect(l.href.length).toBeGreaterThan(0);
        expect(l.label.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("topic hubs", () => {
  it("hub count is bounded by HUBS_PER_CATEGORY × #categories", () => {
    expect(TOPIC_HUBS.size).toBeLessThanOrEqual(HUBS_PER_CATEGORY * CATEGORIES.length);
  });

  it("every category has at least one hub (non-empty derivation)", () => {
    const hubsByCat = new Map<string, number>();
    for (const id of TOPIC_HUBS) {
      const topic = TOPICS.find((t) => t.id === id)!;
      hubsByCat.set(topic.category, (hubsByCat.get(topic.category) ?? 0) + 1);
    }
    for (const cat of CATEGORIES) {
      expect(hubsByCat.get(cat) ?? 0, `category ${cat} has no hubs`).toBeGreaterThan(0);
    }
  });
});

describe("i18n: ATLAS topics coverage", () => {
  for (const locale of LOCALES) {
    it(`${locale}: has an entry for every TopicId`, () => {
      const dict = ATLAS[locale as Locale];
      const missing = TOPIC_IDS.filter((id) => !dict.topics[id]);
      expect(missing).toEqual([]);
    });

    it(`${locale}: every topic entry has non-empty title/tagline/body`, () => {
      const dict = ATLAS[locale as Locale];
      const blanks: string[] = [];
      for (const id of TOPIC_IDS) {
        const e = dict.topics[id];
        if (!e || !e.title || !e.tagline || !e.body) blanks.push(id);
      }
      expect(blanks).toEqual([]);
    });
  }
});

describe("i18n: EN ↔ DE key parity", () => {
  // EN and DE are the two locales the project guarantees are fully filled in
  // for every key (per CLAUDE.md). The other six locales may legitimately
  // omit fields that the interface declares optional — the call sites
  // fall back to the EN literal via `??`. So we only enforce parity between
  // EN and DE here; the other locales are covered by the targeted
  // "topics map is non-empty" check above, which is the high-value invariant.
  const bundles: Array<{ name: string; dict: Record<Locale, unknown> }> = [
    { name: "MESSAGES", dict: MESSAGES as Record<Locale, unknown> },
    { name: "ATLAS", dict: ATLAS as Record<Locale, unknown> },
    { name: "UI", dict: UI as Record<Locale, unknown> },
  ];

  for (const { name, dict } of bundles) {
    it(`${name}: DE carries every key present in EN`, () => {
      const missing = missingKeyPaths(dict.en, dict.de);
      expect(missing, `${name}.de missing: ${missing.join(", ")}`).toEqual([]);
    });
    it(`${name}: EN carries every key present in DE`, () => {
      const missing = missingKeyPaths(dict.de, dict.en);
      expect(missing, `${name}.en missing: ${missing.join(", ")}`).toEqual([]);
    });
  }
});
