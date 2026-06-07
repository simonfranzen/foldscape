"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { TOPICS, type TopicId } from "@/lib/topics";
import { TOPIC_NEIGHBORS } from "@/lib/topicEdges";
import { CATEGORY_HOVER_BORDER, CATEGORY_SWATCH } from "@/lib/topicCategoryStyles";

// "Related topics" panel — shared between StoryPageShell (43 pages) and the
// two custom-layout story pages (eml, life). Pulls neighbours from the same
// affinity graph the landing constellation uses, caps at six cards, renders
// each as a Link with category swatch + formula glyph + locale-aware title.

const RELATED_CAP = 6;

interface Props {
  topicId: TopicId;
  accent: string; // matches the host page's accent class, e.g. "text-signal-violet"
}

export function RelatedTopics({ topicId, accent }: Props) {
  const { a, u } = useI18n();
  const neighbours = (TOPIC_NEIGHBORS[topicId] ?? [])
    .slice(0, RELATED_CAP)
    .map((id) => TOPICS.find((t) => t.id === id))
    .filter((t): t is (typeof TOPICS)[number] => Boolean(t));
  if (neighbours.length === 0) return null;
  return (
    <Reveal>
      <section className="glass hairline mx-auto mt-16 max-w-5xl space-y-5 rounded-2xl border p-8 md:p-10">
        <div className="space-y-2">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>
            {u.related?.label ?? "Related topics"}
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-ink-200">
            {u.related?.lead ?? "Topics in the same vein."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {neighbours.map((neighbour) => {
            const meta = a.topics[neighbour.id];
            return (
              <Link
                key={neighbour.id}
                href={neighbour.href}
                className={`hairline group flex flex-col gap-2 rounded-md border bg-ink-950/40 p-4 transition-colors ${CATEGORY_HOVER_BORDER[neighbour.category]}`}
              >
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${CATEGORY_SWATCH[neighbour.category]} opacity-80`}
                />
                <div className="math-italic text-lg leading-snug text-ink-100">{meta.title}</div>
                <div className="line-clamp-2 text-sm leading-snug text-ink-300">{meta.tagline}</div>
                {neighbour.formula && (
                  <div className="mt-auto pt-1 font-mono text-xs text-ink-400">
                    {neighbour.formula}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </Reveal>
  );
}
