"use client";

import { useState } from "react";

// Builds intuition for K and S as plain higher-order functions, before the
// reader meets them inside the iota chain. K throws one argument away; S
// "shares" its third argument with the first two. Plug in three values, see
// the result on the right.

interface Props {
  caption?: string;
  labels?: {
    kHeading: string;
    sHeading: string;
    kBody: string;
    sBody: string;
    kResult: string;
    sResult: string;
    inputX: string;
    inputY: string;
    inputZ: string;
  };
}

const DEFAULTS = {
  kHeading: "K — the constant function",
  sHeading: "S — the substitution function",
  kBody: "K takes two arguments and returns the first. The second is discarded.",
  sBody:
    "S takes three arguments and rewrites them as x z (y z): both x and y are applied to the shared input z.",
  kResult: "K (x, y) = x",
  sResult: "S (x, y, z) = x z (y z)",
  inputX: "x",
  inputY: "y",
  inputZ: "z",
};

export function IotaKSPlayground({ caption, labels = DEFAULTS }: Props) {
  const [x, setX] = useState("cat");
  const [y, setY] = useState("dog");
  const [z, setZ] = useState("3");

  // We treat x, y, z as opaque strings. For K we just return x. For S we
  // build the symbolic expression x z (y z) — the reader sees how the value
  // z is "shared" between the two function-position slots.
  const kResult = x;
  const sResultSymbolic = `${x} ${z} (${y} ${z})`;

  // Bonus: if x and y are numbers, treat them as constant functions and
  // compute a numeric answer too. K(2,5)=2; S(λa.a+1, λa.a*2, 3) = (3+1)*?
  // — but we keep it dead simple: if x/y/z are numbers, show numeric S
  // assuming x and y are themselves the *constant functions* returning x, y.
  // Then x z = x, y z = y, so S = x · y? No — concatenation only makes
  // sense symbolically. Keep this pane purely string-substitution.

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-5">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
          {caption}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
            {labels.inputX}
          </span>
          <input
            type="text"
            value={x}
            onChange={(e) => setX(e.target.value)}
            spellCheck={false}
            className="hairline w-full rounded-md border bg-ink-950/80 px-3 py-2 font-mono text-sm text-ink-100 outline-none focus:border-signal-cyan/60"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
            {labels.inputY}
          </span>
          <input
            type="text"
            value={y}
            onChange={(e) => setY(e.target.value)}
            spellCheck={false}
            className="hairline w-full rounded-md border bg-ink-950/80 px-3 py-2 font-mono text-sm text-ink-100 outline-none focus:border-signal-cyan/60"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
            {labels.inputZ}
          </span>
          <input
            type="text"
            value={z}
            onChange={(e) => setZ(e.target.value)}
            spellCheck={false}
            className="hairline w-full rounded-md border bg-ink-950/80 px-3 py-2 font-mono text-sm text-ink-100 outline-none focus:border-signal-cyan/60"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* K panel */}
        <div className="hairline space-y-2 rounded-md border bg-ink-950/70 p-4">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
            {labels.kHeading}
          </div>
          <div className="font-mono text-xs text-ink-300">{labels.kResult}</div>
          <div className="hairline space-y-1 border-t pt-2">
            <div className="font-mono text-xs text-ink-400">
              K (<span className="text-signal-cyan">{x || "·"}</span>,{" "}
              <span className="text-ink-500 line-through">{y || "·"}</span>) =
            </div>
            <div className="break-words font-mono text-base text-ink-100 md:text-lg">
              {kResult || "·"}
            </div>
          </div>
          <p className="pt-1 text-[11px] leading-relaxed text-ink-400">{labels.kBody}</p>
        </div>

        {/* S panel */}
        <div className="hairline space-y-2 rounded-md border bg-ink-950/70 p-4">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
            {labels.sHeading}
          </div>
          <div className="font-mono text-xs text-ink-300">{labels.sResult}</div>
          <div className="hairline space-y-1 border-t pt-2">
            <div className="font-mono text-xs text-ink-400">
              S (<span className="text-signal-cyan">{x || "·"}</span>,{" "}
              <span className="text-signal-cyan">{y || "·"}</span>,{" "}
              <span className="text-signal-cyan">{z || "·"}</span>) =
            </div>
            <div className="break-words font-mono text-base text-ink-100 md:text-lg">
              {sResultSymbolic}
            </div>
          </div>
          <p className="pt-1 text-[11px] leading-relaxed text-ink-400">{labels.sBody}</p>
        </div>
      </div>
    </div>
  );
}
