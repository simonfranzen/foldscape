"use client";

import { useMemo, useState } from "react";
import { evalEml } from "@/lib/eml/compile";
import { safeParse } from "@/lib/eml/parse";

interface Row {
  label: string;
  src: string;
  groundTruth: (re: number, im: number) => [number, number];
  truthLabel: string;
}

const ROWS: Row[] = [
  {
    label: "eˣ",
    src: "eml(z, 1)",
    groundTruth: (re, im) => [Math.exp(re) * Math.cos(im), Math.exp(re) * Math.sin(im)],
    truthLabel: "Math.exp",
  },
  {
    label: "ln(z)",
    src: "eml(1, eml(eml(1, z), 1))",
    groundTruth: (re, im) => [Math.log(Math.hypot(re, im)), Math.atan2(im, re)],
    truthLabel: "Math.log",
  },
  {
    label: "id(z)",
    src: "eml(eml(1, eml(eml(1, z), 1)), 1)",
    groundTruth: (re, im) => [re, im],
    truthLabel: "z itself",
  },
];

const fmt = (n: number) => {
  if (!isFinite(n)) return "∞";
  if (Math.abs(n) < 1e3 && Math.abs(n) > 1e-2) return n.toFixed(4);
  return n.toExponential(2);
};

export function EmlVerifier() {
  const [re, setRe] = useState(2);
  const [im, setIm] = useState(0);

  const results = useMemo(() => {
    return ROWS.map((row) => {
      const parsed = safeParse(row.src);
      if (!parsed.ok) {
        return {
          ...row,
          w: [NaN, NaN] as [number, number],
          gt: [NaN, NaN] as [number, number],
          err: NaN,
        };
      }
      const w = evalEml(parsed.node, [re, im], [0, 0]);
      const gt = row.groundTruth(re, im);
      const err = Math.hypot(w[0] - gt[0], w[1] - gt[1]) / (Math.hypot(gt[0], gt[1]) + 1e-12);
      return { ...row, w, gt, err };
    });
  }, [re, im]);

  return (
    <div className="rounded-2xl border hairline glass p-6 md:p-8">
      <div className="font-mono text-[11px] tracking-widest2 text-signal-amber uppercase mb-4">
        Numerical Verification
      </div>
      <p className="text-ink-300 text-sm mb-5 leading-relaxed">
        The reconstructions are claims about identities. Pick a complex number{" "}
        <span className="math-italic text-signal-cyan">z</span> and watch each
        EML tree return the value its classical equivalent would.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <label className="block">
          <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase mb-1">
            Re(z)
          </div>
          <input
            type="number"
            step={0.1}
            value={re}
            onChange={(e) => setRe(parseFloat(e.target.value) || 0)}
            className="w-full bg-ink-950/70 border hairline rounded-md px-3 py-2 font-mono text-sm text-ink-100 outline-none focus:border-signal-cyan/60"
          />
        </label>
        <label className="block">
          <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase mb-1">
            Im(z)
          </div>
          <input
            type="number"
            step={0.1}
            value={im}
            onChange={(e) => setIm(parseFloat(e.target.value) || 0)}
            className="w-full bg-ink-950/70 border hairline rounded-md px-3 py-2 font-mono text-sm text-ink-100 outline-none focus:border-signal-cyan/60"
          />
        </label>
      </div>
      <div className="space-y-2">
        {results.map((row) => (
          <div
            key={row.src}
            className="grid grid-cols-12 gap-2 items-center rounded-md border hairline bg-ink-950/40 px-3 py-2"
          >
            <div className="col-span-2 math-italic text-lg text-ink-100">{row.label}</div>
            <div className="col-span-5 font-mono text-[11px] text-ink-200 truncate" title={row.src}>
              {row.src}
            </div>
            <div className="col-span-4 font-mono text-[11px] text-signal-cyan">
              {fmt(row.w[0])} {row.w[1] >= 0 ? "+" : "−"} {fmt(Math.abs(row.w[1]))}i
            </div>
            <div className="col-span-1 font-mono text-[10px] text-right">
              {isFinite(row.err) && row.err < 1e-6 ? (
                <span className="text-signal-cyan">≈</span>
              ) : isFinite(row.err) && row.err < 1e-3 ? (
                <span className="text-signal-amber">~</span>
              ) : (
                <span className="text-signal-rose">≠</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-[10px] font-mono text-ink-500 leading-relaxed">
        <span className="text-signal-cyan">≈</span> error &lt; 10⁻⁶ ·{" "}
        <span className="text-signal-amber">~</span> error &lt; 10⁻³ ·{" "}
        <span className="text-signal-rose">≠</span> branch cut or overflow
      </div>
    </div>
  );
}
