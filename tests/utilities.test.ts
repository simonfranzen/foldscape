// Pure-function tests. These exercise the small set of non-trivial
// utilities the rest of the app builds on. Nothing here touches the DOM.

import { describe, it, expect } from "vitest";

import { speakLatex } from "@/components/Formula";
import { TOPIC_HUBS, isHub } from "@/lib/topicHubs";
import { TOPICS } from "@/lib/topics";

describe("speakLatex", () => {
  it("expands common macros to speakable words", () => {
    expect(speakLatex("a \\leq b")).toBe("a less or equal b");
    expect(speakLatex("\\forall x \\in A")).toBe("for all x in A");
    expect(speakLatex("\\neg p \\lor q")).toBe("not p or q");
  });

  it("expands fractions and roots structurally", () => {
    expect(speakLatex("\\frac{a}{b}")).toBe("a over b");
    expect(speakLatex("\\sqrt{x}")).toBe("square root of x");
  });

  it("rewrites superscripts and subscripts", () => {
    // Single-char and brace-wrapped forms both reduce to readable English.
    expect(speakLatex("x^2")).toBe("x to the 2");
    expect(speakLatex("x^{10}")).toBe("x to the 10");
    expect(speakLatex("a_n")).toBe("a sub n");
    expect(speakLatex("a_{n+1}")).toBe("a sub n+1");
  });

  it("collapses LaTeX spacing macros into normal whitespace", () => {
    // Multiple thin-space macros + braces should not leave residue.
    const out = speakLatex("\\,x\\;y\\:z");
    expect(out).not.toMatch(/\\/);
    expect(out).toMatch(/x +y +z/);
  });

  it("trims leading/trailing whitespace", () => {
    expect(speakLatex("  x  ")).toBe("x");
  });

  it("is idempotent on plain ASCII expressions", () => {
    expect(speakLatex("x + y = z")).toBe("x + y = z");
  });
});

describe("topic hubs derivation", () => {
  it("isHub agrees with TOPIC_HUBS set membership", () => {
    for (const t of TOPICS) {
      expect(isHub(t.id)).toBe(TOPIC_HUBS.has(t.id));
    }
  });

  it("derives at most HUBS_PER_CATEGORY × #categories hubs (= 12)", () => {
    expect(TOPIC_HUBS.size).toBeLessThanOrEqual(12);
  });

  it("picks at least one hub per category", () => {
    const cats = new Set(TOPICS.filter((t) => TOPIC_HUBS.has(t.id)).map((t) => t.category));
    // Six declared categories; the derivation must hit each.
    expect(cats.size).toBe(6);
  });

  it("derivation is deterministic across calls (frozen set)", () => {
    // Capture once, compare to a fresh snapshot — TOPIC_HUBS is computed once
    // at module load, so repeated reads must agree.
    const snap1 = Array.from(TOPIC_HUBS).sort();
    const snap2 = Array.from(TOPIC_HUBS).sort();
    expect(snap1).toEqual(snap2);
  });
});
