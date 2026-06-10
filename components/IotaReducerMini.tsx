"use client";

import { useMemo, useState } from "react";
import { parse, reduceTrace } from "@/lib/iota/reduce";

// Inline, story-page reducer. Tiny by design — pick one of a few preset
// derivations (or type your own), then walk forward / backward one step at
// a time. The current step glows cyan; previous steps fade into the past.
//
// Differs from /iota/reducer in scope: it's a teaser, not the full tool.

const MINI_MAX_STEPS = 40;

interface Preset {
  id: string;
  label: string;
  src: string;
  note: string;
}

const PRESETS: Preset[] = [
  { id: "k", label: "ι (ι (ι ι))  →  K", src: "ι (ι (ι ι))", note: "Three-deep nest gives K." },
  {
    id: "s",
    label: "ι (ι (ι (ι ι)))  →  S",
    src: "ι (ι (ι (ι ι)))",
    note: "Four-deep nest gives S.",
  },
  { id: "ki", label: "ι (ι ι)  →  S K", src: "ι (ι ι)", note: "An intermediate landing spot." },
  { id: "i-from-skk", label: "S K K x  →  x", src: "S K K I", note: "Identity in disguise." },
];

interface Props {
  caption?: string;
}

export function IotaReducerMini({ caption }: Props) {
  const [presetId, setPresetId] = useState<string>(PRESETS[0].id);
  const [custom, setCustom] = useState<string>("");
  const [step, setStep] = useState(0);

  const src = custom.trim().length > 0 ? custom : (PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]).src;

  const result = useMemo(() => {
    try {
      const tree = parse(src);
      const trace = reduceTrace(tree, MINI_MAX_STEPS);
      return { ok: true as const, ...trace };
    } catch (e) {
      return {
        ok: false as const,
        error: (e as Error).message,
        steps: [] as string[],
        normal: false,
        hitLimit: false,
      };
    }
  }, [src]);

  const clamped = result.ok ? Math.min(step, result.steps.length - 1) : 0;
  const cur = result.ok ? result.steps[clamped] : "";
  const next = result.ok && clamped < result.steps.length - 1 ? result.steps[clamped + 1] : null;
  const atEnd = result.ok ? clamped >= result.steps.length - 1 : true;

  const choosePreset = (id: string) => {
    setPresetId(id);
    setCustom("");
    setStep(0);
  };

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
          {caption}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => {
          const active = custom.trim().length === 0 && presetId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => choosePreset(p.id)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                active
                  ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                  : "hairline text-ink-300 hover:border-signal-cyan/40 hover:text-ink-100"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
          custom expression (overrides preset)
        </label>
        <input
          type="text"
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value);
            setStep(0);
          }}
          placeholder="try: ι (ι (ι ι))"
          spellCheck={false}
          className="hairline w-full rounded-md border bg-ink-950/80 px-3 py-2 font-mono text-sm text-ink-100 outline-none focus:border-signal-cyan/60"
        />
      </div>

      <div
        className="flex min-h-[110px] flex-col gap-3 rounded-md border bg-ink-950/70 p-4"
        style={{ borderColor: result.ok ? "rgba(125,243,255,0.35)" : "rgba(255,122,182,0.45)" }}
      >
        {result.ok ? (
          <>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2">
              <span className="text-ink-400">
                step <span className="text-signal-cyan">{clamped.toString().padStart(2, "0")}</span>{" "}
                / {(result.steps.length - 1).toString().padStart(2, "0")}
              </span>
              <span className={result.normal ? "text-signal-cyan" : "text-signal-amber"}>
                {atEnd
                  ? result.normal
                    ? "normal form"
                    : result.hitLimit
                      ? "step limit"
                      : "done"
                  : "reducing…"}
              </span>
            </div>
            <pre
              key={clamped}
              className="whitespace-pre-wrap break-words font-mono text-base leading-snug text-ink-100 md:text-lg"
            >
              {cur}
            </pre>
            {next && (
              <pre className="hairline whitespace-pre-wrap break-words border-t pt-2 font-mono text-xs leading-snug text-ink-400">
                <span className="text-ink-500">next →</span> {next}
              </pre>
            )}
          </>
        ) : (
          <div className="font-mono text-xs leading-relaxed text-signal-rose">
            parse error: {result.error}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setStep(0)}
          disabled={!result.ok || clamped === 0}
          className="hairline rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-ink-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ↺ reset
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={!result.ok || clamped === 0}
          className="hairline rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-ink-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← back
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => s + 1)}
          disabled={!result.ok || atEnd}
          className="rounded-md border border-signal-cyan/60 bg-signal-cyan/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          step →
        </button>
        <button
          type="button"
          onClick={() => result.ok && setStep(result.steps.length - 1)}
          disabled={!result.ok || atEnd}
          className="hairline rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-ink-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ⇥ to end
        </button>
      </div>

      <p className="font-mono text-[11px] leading-relaxed text-ink-400">
        Reduction rule applied at each step: <span className="text-signal-cyan">ι x → x S K</span>,
        then <span className="text-signal-cyan">K x y → x</span> and{" "}
        <span className="text-signal-cyan">S x y z → x z (y z)</span>, leftmost-outermost.
      </p>
    </div>
  );
}

