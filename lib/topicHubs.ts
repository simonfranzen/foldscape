// Hub topics — the bright stars of the constellation. Derived from the curated
// edge graph (TOPIC_NEIGHBORS) by degree: a topic with many affinities is one
// the jury's eye should be drawn to first. We pick a small set per category so
// the canvas has anchors at every cluster, never just one hot region.
//
// Result is computed once at module load and frozen. No runtime cost on the
// landing page beyond a map lookup.

import { TOPICS, type TopicCategory, type TopicId } from "./topics";
import { TOPIC_NEIGHBORS } from "./topicEdges";

const HUBS_PER_CATEGORY = 2;

function deriveHubs(): Set<TopicId> {
  const byCat: Record<TopicCategory, { id: TopicId; deg: number }[]> = {
    logic: [],
    computation: [],
    chaos: [],
    geometry: [],
    analysis: [],
    paradox: [],
  };
  for (const t of TOPICS) {
    const deg = (TOPIC_NEIGHBORS[t.id] ?? []).length;
    byCat[t.category].push({ id: t.id, deg });
  }
  const set = new Set<TopicId>();
  (Object.keys(byCat) as TopicCategory[]).forEach((cat) => {
    byCat[cat]
      .sort((a, b) => b.deg - a.deg || a.id.localeCompare(b.id))
      .slice(0, HUBS_PER_CATEGORY)
      .forEach((x) => set.add(x.id));
  });
  return set;
}

export const TOPIC_HUBS: ReadonlySet<TopicId> = deriveHubs();

export const isHub = (id: TopicId) => TOPIC_HUBS.has(id);
