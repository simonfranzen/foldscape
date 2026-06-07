// Hub topics — the bright stars of the constellation. Hand-curated, not
// auto-derived by edge degree. Each entry is the "everyone knows this"
// landmark of its category: the math problem most likely to ring a bell with
// a smart non-mathematician. Tweak with care; these decisions shape the
// jury's first 5 seconds on the page.
//
// Result is frozen at module load. No runtime cost beyond a Set.has().

import { TOPICS, type TopicCategory, type TopicId } from "./topics";

const CURATED_HUBS: Record<TopicCategory, TopicId[]> = {
  logic: ["nand"],
  computation: ["life", "halting"],
  chaos: ["lorenz", "mandelbrot"],
  geometry: ["penrose", "sierpinski"],
  analysis: ["fourier", "riemann"],
  paradox: ["godel", "banach"],
};

// Validate at module load: every curated id must exist in TOPICS and be in the
// declared category. Catches typos + topic-removal collisions immediately
// instead of letting the constellation silently mis-render.
const validHubIds = new Set<TopicId>();
const validIds = new Set(TOPICS.map((t) => t.id));
const catOf = new Map(TOPICS.map((t) => [t.id, t.category]));
for (const [cat, ids] of Object.entries(CURATED_HUBS) as [TopicCategory, TopicId[]][]) {
  for (const id of ids) {
    if (!validIds.has(id)) {
      throw new Error(`topicHubs: unknown TopicId "${id}" in category ${cat}`);
    }
    if (catOf.get(id) !== cat) {
      throw new Error(`topicHubs: ${id} is in category ${catOf.get(id)}, not ${cat}`);
    }
    validHubIds.add(id);
  }
}

export const TOPIC_HUBS: ReadonlySet<TopicId> = validHubIds;

export const isHub = (id: TopicId) => TOPIC_HUBS.has(id);
