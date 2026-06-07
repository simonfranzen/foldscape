"use client";

import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { TOPIC_APPLICATIONS } from "@/lib/topicApplications";
import type { TopicId } from "@/lib/topics";

// "Where you meet it" panel — shared between StoryPageShell (used by 43
// pages) and the two custom-layout pages (eml, life) that bypass it. Extracted
// so the inline icons + locale-fallback logic live in exactly one place.

interface Props {
  topicId: TopicId;
  // Accent class for the section heading + the icon colour, e.g.
  // "text-signal-amber". Defaults match StoryPageShell's per-topic accent.
  accent: string;
}

export function TopicApplications({ topicId, accent }: Props) {
  const { u, locale } = useI18n();
  const applications =
    TOPIC_APPLICATIONS[locale]?.[topicId] ?? TOPIC_APPLICATIONS.en[topicId];
  if (!applications || applications.length === 0) return null;
  return (
    <Reveal>
      <section className="glass hairline mx-auto mt-16 max-w-5xl space-y-5 rounded-2xl border p-8 md:p-10">
        <div className="space-y-2">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>
            {u.applications?.label ?? "Where you meet it"}
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-ink-200">
            {u.applications?.lead ?? "How and where this technique lives in the world today."}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {applications.map((app, i) => (
            <div
              key={i}
              className="hairline flex gap-4 rounded-md border bg-ink-950/40 p-4 transition-colors hover:border-ink-300/40"
            >
              {/* Filigree per-application icon via CSS mask — see the same
                  rationale in StoryPageShell.tsx. */}
              <span
                aria-hidden="true"
                className={`h-11 w-11 flex-shrink-0 select-none bg-current ${accent} opacity-90`}
                style={{
                  WebkitMaskImage: `url(/icons/${topicId}/${i}.svg)`,
                  maskImage: `url(/icons/${topicId}/${i}.svg)`,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              />
              <div className="min-w-0 space-y-2">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>
                  {app.domain}
                </div>
                <div className="text-sm leading-relaxed text-ink-100">{app.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
