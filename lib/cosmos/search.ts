// Forgiving topic search. The earlier landing only matched exact substrings,
// so a visitor typing "gameoflife" — no spaces, casual — found nothing.
// This module normalises both sides (lowercase, strip non-alphanumeric,
// collapse accents) and adds a tiny alias table for the topics whose
// "common name" differs from their id (Game of Life, P=NP, Möbius, …).
// It's deliberately small — no Levenshtein, no Trie. The expensive bits
// would burn far more than they earn for 49 items.

import type { TopicId } from "@/lib/topics";

// Per-topic alternate names that visitors are likely to type. Used in
// addition to the topic's title + tagline + formula + id from the i18n
// bundle. Keep entries short and high-confidence.
export const TOPIC_ALIASES: Partial<Record<TopicId, string[]>> = {
  life: ["gameoflife", "game of life", "conway", "conway life", "spielleben"],
  rule110: ["rule 110", "wolfram"],
  godel: ["gödel", "goedel", "unvollständigkeit", "incompleteness"],
  banach: ["banach tarski", "banach-tarski", "duplikation"],
  riemann: ["riemann hypothesis", "riemannvermutung", "zeta", "ζ"],
  pvsnp: ["p vs np", "p versus np", "p=np", "pequalnp", "millennium"],
  sat: [
    "satisfiability",
    "boolean satisfiability",
    "erfüllbarkeit",
    "3sat",
    "3-sat",
    "cnf",
    "cook levin",
    "cook-levin",
    "dpll",
    "aussagenlogik",
  ],
  fourcolor: ["four colour", "four color", "vierfarben", "4 colors"],
  konigsberg: ["königsberg", "koenigsberg", "seven bridges", "sieben brücken"],
  euler: ["eulers identity", "eulersche identität", "e to the i pi"],
  mobius: ["möbius", "moebius", "mobius strip", "one sided"],
  doublependulum: ["double pendulum", "doppelpendel", "chaotic pendulum"],
  hilberthotel: ["hilbert hotel", "hilberts hotel", "unendlich hotel"],
  halting: ["halteproblem", "halting problem", "turing"],
  mandelbrot: ["fractal", "fraktal", "m set"],
  collatz: ["3n+1", "syracuse", "kakutani"],
  rsa: ["public key", "kryptographie", "öffentlicher schlüssel"],
  gabrielshorn: ["gabriels horn", "torricelli"],
  sierpinski: ["sierpinski triangle", "sierpinski dreieck", "triforce"],
  fourier: ["fourier transform", "fourier-transformation", "spectrum"],
  apollonian: ["apollonian gasket", "apollonisches netz"],
  phi: ["golden ratio", "goldener schnitt", "fibonacci"],
  buffon: ["buffon needle", "buffonsche nadel", "monte carlo pi"],
};

// Normalise: lowercase, strip diacritics, drop everything that isn't a
// letter or digit. So "Game of Life" → "gameoflife", "Gödel" → "godel",
// "Bürgi-Brocot" → "burgibrocot".
function normalise(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export interface SearchableTopic {
  id: TopicId;
  title: string;
  tagline: string;
  formula?: string;
}

// Build the haystack for one topic by joining everything we'd want to
// match against, then normalising once. Cached by caller — the dict
// changes only when the locale changes.
export function buildHaystack(t: SearchableTopic): string {
  const aliases = TOPIC_ALIASES[t.id] ?? [];
  const parts = [t.id, t.title, t.tagline, t.formula ?? "", ...aliases];
  return parts.map(normalise).join(" ");
}

// Score a topic against a normalised query. Returns 0 if no match, 1 for
// a substring hit, 2 for a full-token hit. Higher scores rank earlier.
export function scoreTopic(haystack: string, q: string): number {
  if (!q) return 1; // empty query: everything ranks equal
  if (haystack.includes(q)) return 2;
  // Per-token: if every space-separated token of the query lives in the
  // haystack (in any order), still count as a (weaker) match.
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1 && tokens.every((t) => haystack.includes(t))) return 1;
  return 0;
}

export function normaliseQuery(raw: string): string {
  return normalise(raw);
}
