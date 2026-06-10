"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { parse, reduceTrace, PRESETS } from "@/lib/iota/reduce";
import { Info } from "@/components/Info";

const INITIAL_MAX_STEPS = 40;
const STEP_LIMIT_MIN = 5;
const STEP_LIMIT_MAX = 200;

export default function IotaReducer() {
  const { a, u } = useI18n();
  const topic = a.topics.iota;
  const [src, setSrc] = useState(PRESETS[1].src);
  const [maxSteps, setMaxSteps] = useState(INITIAL_MAX_STEPS);

  const result = useMemo(() => {
    try {
      const tree = parse(src);
      const trace = reduceTrace(tree, maxSteps);
      return { ok: true as const, ...trace };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  }, [src, maxSteps]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col bg-ink-950 p-6 lg:min-h-[calc(100vh-3.5rem)] lg:p-10">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              SKI · Iota reducer
            </div>
            {result.ok && (
              <div
                className={`glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 ${
                  result.normal ? "text-signal-cyan" : "text-signal-amber"
                }`}
              >
                {result.normal ? "✓ normal form" : "↺ ran out of steps"}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Expression
              <Info side="bottom">
                Atoms: S, K, I, ι (or lowercase i). Whitespace separates terms; juxtaposition is
                left-associative application. Parentheses group.
              </Info>
            </div>
            <textarea
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              rows={2}
              spellCheck={false}
              className="hairline w-full resize-none rounded-md border bg-ink-950/80 p-3 font-mono text-base text-ink-100 outline-none focus:border-signal-cyan/60"
            />
            {!result.ok && (
              <div className="mt-2 font-mono text-xs text-signal-rose">{result.error}</div>
            )}
          </div>

          {/* Trace */}
          {result.ok && (
            <div className="flex flex-1 flex-col">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Reduction trace · {result.steps.length} step{result.steps.length === 1 ? "" : "s"}
              </div>
              <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto pr-2">
                {result.steps.map((step, i) => {
                  const isLast = i === result.steps.length - 1;
                  return (
                    <div
                      key={i}
                      className={`rounded-md border px-4 py-2 font-mono text-sm leading-relaxed ${
                        isLast
                          ? "border-signal-cyan/60 bg-signal-cyan/5 text-ink-100"
                          : "hairline bg-ink-950/40 text-ink-200"
                      }`}
                    >
                      <span className="mr-3 text-ink-400">{i.toString().padStart(2, "0")}</span>
                      {step}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Reduction rules
            </div>
            <div className="hairline space-y-1.5 rounded-md border bg-ink-950/60 p-3 font-mono text-xs text-ink-100">
              <div>I x → x</div>
              <div>K x y → x</div>
              <div>S x y z → x z (y z)</div>
              <div className="text-signal-cyan">ι x → x S K</div>
            </div>
            <p className="text-[11px] leading-relaxed text-ink-400">
              Leftmost-outermost reduction. The first applicable rule at the topmost position fires
              per step.
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Examples
            </div>
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSrc(p.src)}
                  className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                    src === p.src
                      ? "border-signal-cyan/60 bg-signal-cyan/10"
                      : "hairline hover:border-signal-cyan/40 hover:text-ink-100"
                  }`}
                >
                  <div className="text-sm text-ink-100">{p.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{p.src}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Step limit
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[10px] text-signal-cyan">{maxSteps}</span>
              </div>
              <input
                type="range"
                value={maxSteps}
                min={STEP_LIMIT_MIN}
                max={STEP_LIMIT_MAX}
                step={1}
                onChange={(e) => setMaxSteps(parseInt(e.target.value))}
                className="w-full accent-signal-cyan"
              />
            </div>
            <p className="text-[11px] text-ink-400">
              Some expressions diverge — the trace stops at this many steps.
            </p>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
