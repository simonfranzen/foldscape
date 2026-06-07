"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Inline 2-2-1 neural net for the story page. Trains XOR by hand-rolled
// backprop (sigmoid activations, MSE loss). One click = one mini-batch of
// 16 samples. We draw the net as three columns of circles with weighted
// edges (opacity = |w|, hue = sign(w)) plus a loss-vs-step line chart below.
// Everything is pure SVG so it scales and respects prefers-reduced-motion
// trivially (no continuous animation — only on user click).

interface Props {
  caption: string;
  stepLabel: string; // "Step", "Schritt", …
  trainLabel: string; // "Train 200×"
  resetLabel: string;
  lossLabel: string; // "Loss"
  stepCounterLabel: string; // "Steps"
  hint: string;
  layerLabels: [string, string, string]; // input, hidden, output
}

// XOR truth table — the canonical "non-linear" toy problem.
const XOR: Array<{ x: [number, number]; y: number }> = [
  { x: [0, 0], y: 0 },
  { x: [0, 1], y: 1 },
  { x: [1, 0], y: 1 },
  { x: [1, 1], y: 0 },
];

const LR = 0.6; // learning rate — large because the net is tiny.

const sig = (z: number) => 1 / (1 + Math.exp(-z));

interface Net {
  // Hidden layer weights: 2 inputs -> 2 hidden. Indexed [h][i].
  W1: number[][];
  b1: number[];
  // Output layer weights: 2 hidden -> 1 output.
  W2: number[];
  b2: number;
}

function initNet(seed: number): Net {
  // Tiny LCG so reset gives a different init each time.
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return ((s & 0xffff) / 0x10000) * 2 - 1; // [-1, 1)
  };
  return {
    W1: [
      [rand(), rand()],
      [rand(), rand()],
    ],
    b1: [rand() * 0.2, rand() * 0.2],
    W2: [rand(), rand()],
    b2: rand() * 0.2,
  };
}

function forward(net: Net, x: [number, number]) {
  const z1 = [
    net.W1[0][0] * x[0] + net.W1[0][1] * x[1] + net.b1[0],
    net.W1[1][0] * x[0] + net.W1[1][1] * x[1] + net.b1[1],
  ];
  const h = [sig(z1[0]), sig(z1[1])];
  const z2 = net.W2[0] * h[0] + net.W2[1] * h[1] + net.b2;
  const o = sig(z2);
  return { h, o };
}

// One mini-batch step: full-batch SGD over all 4 XOR samples, averaged.
function trainStep(net: Net): { next: Net; loss: number } {
  // Accumulate gradients.
  const gW1 = [
    [0, 0],
    [0, 0],
  ];
  const gb1 = [0, 0];
  const gW2 = [0, 0];
  let gb2 = 0;
  let loss = 0;

  for (const { x, y } of XOR) {
    const { h, o } = forward(net, x);
    const err = o - y;
    loss += 0.5 * err * err;

    // dL/dz2 = (o - y) * o * (1 - o)   (sigmoid derivative)
    const dz2 = err * o * (1 - o);
    gW2[0] += dz2 * h[0];
    gW2[1] += dz2 * h[1];
    gb2 += dz2;

    // Back through hidden layer
    for (let j = 0; j < 2; j++) {
      const dh = dz2 * net.W2[j];
      const dz1 = dh * h[j] * (1 - h[j]);
      gW1[j][0] += dz1 * x[0];
      gW1[j][1] += dz1 * x[1];
      gb1[j] += dz1;
    }
  }

  const n = XOR.length;
  const next: Net = {
    W1: [
      [net.W1[0][0] - (LR * gW1[0][0]) / n, net.W1[0][1] - (LR * gW1[0][1]) / n],
      [net.W1[1][0] - (LR * gW1[1][0]) / n, net.W1[1][1] - (LR * gW1[1][1]) / n],
    ],
    b1: [net.b1[0] - (LR * gb1[0]) / n, net.b1[1] - (LR * gb1[1]) / n],
    W2: [net.W2[0] - (LR * gW2[0]) / n, net.W2[1] - (LR * gW2[1]) / n],
    b2: net.b2 - (LR * gb2) / n,
  };
  return { next, loss: loss / n };
}

export function BackpropMiniNet({
  caption,
  stepLabel,
  trainLabel,
  resetLabel,
  lossLabel,
  stepCounterLabel,
  hint,
  layerLabels,
}: Props) {
  const seedRef = useRef(1);
  const [net, setNet] = useState<Net>(() => initNet(seedRef.current));
  const [losses, setLosses] = useState<number[]>([]);
  const [steps, setSteps] = useState(0);
  const burstRef = useRef<number | null>(null);

  const doOne = useCallback(() => {
    setNet((n) => {
      const { next, loss } = trainStep(n);
      setLosses((ls) => {
        const merged = [...ls, loss];
        // Cap history so the chart stays readable.
        return merged.length > 240 ? merged.slice(-240) : merged;
      });
      return next;
    });
    setSteps((s) => s + 1);
  }, []);

  // Train-fast: dispatches 200 mini-batch steps via rAF chunks (8/frame) so
  // the curve animates smoothly without blocking the UI.
  const trainFast = useCallback(() => {
    if (burstRef.current !== null) return;
    let remaining = 200;
    const tick = () => {
      const chunk = Math.min(8, remaining);
      for (let i = 0; i < chunk; i++) doOne();
      remaining -= chunk;
      if (remaining > 0) {
        burstRef.current = requestAnimationFrame(tick);
      } else {
        burstRef.current = null;
      }
    };
    burstRef.current = requestAnimationFrame(tick);
  }, [doOne]);

  const reset = useCallback(() => {
    if (burstRef.current !== null) {
      cancelAnimationFrame(burstRef.current);
      burstRef.current = null;
    }
    seedRef.current = (seedRef.current * 7 + 31) >>> 0 || 1;
    setNet(initNet(seedRef.current));
    setLosses([]);
    setSteps(0);
  }, []);

  useEffect(() => {
    return () => {
      if (burstRef.current !== null) cancelAnimationFrame(burstRef.current);
    };
  }, []);

  // Layout — three columns at fixed x positions.
  const W = 760;
  const H = 320;
  const COL_X = [140, W / 2, W - 140];
  const INPUT_Y = [110, 210];
  const HIDDEN_Y = [110, 210];
  const OUTPUT_Y = 160;

  // Edge style derived from a weight.
  const edgeStyle = (w: number) => {
    const a = Math.min(1, Math.abs(w) / 4);
    const color = w >= 0 ? "rgb(255, 209, 102)" : "rgb(125, 243, 255)";
    const width = 0.6 + a * 2.4;
    return { stroke: color, opacity: 0.18 + a * 0.7, strokeWidth: width };
  };

  // Loss chart geometry (below the net).
  const CHART_H = 90;
  const CHART_Y = H + 32;
  const TOTAL_H = H + CHART_H + 80;
  const maxLoss = Math.max(0.25, ...losses);
  const path = losses
    .map((l, i) => {
      const x = (i / Math.max(1, losses.length - 1)) * (W - 80) + 40;
      const y = CHART_Y + CHART_H - (l / maxLoss) * (CHART_H - 12) - 6;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  // Current predictions for the four XOR samples — shown as a tiny table.
  const preds = XOR.map(({ x, y }) => {
    const { o } = forward(net, x);
    return { x, y, o };
  });

  return (
    <figure
      className="hairline glass overflow-hidden rounded-2xl border"
      aria-label="Tiny 2-2-1 neural network learning XOR via backpropagation."
    >
      <figcaption className="hairline border-b px-4 py-3 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${TOTAL_H}`}
        className="block h-auto w-full"
        role="img"
        aria-hidden="true"
      >
        {/* Column headers */}
        {layerLabels.map((label, i) => (
          <text
            key={i}
            x={COL_X[i]}
            y={48}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="10"
            fill="#8a90a4"
          >
            {label}
          </text>
        ))}

        {/* Edges: input → hidden */}
        {INPUT_Y.map((iy, i) =>
          HIDDEN_Y.map((hy, j) => {
            const w = net.W1[j][i];
            const s = edgeStyle(w);
            return (
              <line
                key={`e1-${i}-${j}`}
                x1={COL_X[0]}
                y1={iy}
                x2={COL_X[1]}
                y2={hy}
                stroke={s.stroke}
                strokeOpacity={s.opacity}
                strokeWidth={s.strokeWidth}
              />
            );
          }),
        )}

        {/* Edges: hidden → output */}
        {HIDDEN_Y.map((hy, j) => {
          const w = net.W2[j];
          const s = edgeStyle(w);
          return (
            <line
              key={`e2-${j}`}
              x1={COL_X[1]}
              y1={hy}
              x2={COL_X[2]}
              y2={OUTPUT_Y}
              stroke={s.stroke}
              strokeOpacity={s.opacity}
              strokeWidth={s.strokeWidth}
            />
          );
        })}

        {/* Input neurons */}
        {INPUT_Y.map((y, i) => (
          <g key={`in-${i}`}>
            <circle cx={COL_X[0]} cy={y} r="20" fill="rgba(5,6,10,0.85)" stroke="#a8abbd" />
            <text
              x={COL_X[0]}
              y={y + 5}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="13"
              fill="#eaecf3"
            >
              x{i + 1}
            </text>
          </g>
        ))}

        {/* Hidden neurons */}
        {HIDDEN_Y.map((y, j) => (
          <g key={`h-${j}`}>
            <circle
              cx={COL_X[1]}
              cy={y}
              r="22"
              fill="rgba(5,6,10,0.9)"
              stroke="rgba(255,209,102,0.7)"
            />
            <text
              x={COL_X[1]}
              y={y + 5}
              textAnchor="middle"
              fontFamily="var(--font-serif)"
              fontStyle="italic"
              fontSize="14"
              fill="#ffd166"
            >
              h{j + 1}
            </text>
          </g>
        ))}

        {/* Output neuron */}
        <g>
          <circle
            cx={COL_X[2]}
            cy={OUTPUT_Y}
            r="24"
            fill="rgba(5,6,10,0.9)"
            stroke="rgba(255,122,182,0.75)"
          />
          <text
            x={COL_X[2]}
            y={OUTPUT_Y + 5}
            textAnchor="middle"
            fontFamily="var(--font-serif)"
            fontStyle="italic"
            fontSize="14"
            fill="#ff7ab6"
          >
            ŷ
          </text>
        </g>

        {/* Loss chart frame */}
        <line
          x1={40}
          y1={CHART_Y + CHART_H - 6}
          x2={W - 40}
          y2={CHART_Y + CHART_H - 6}
          stroke="rgba(138,144,164,0.4)"
        />
        <line
          x1={40}
          y1={CHART_Y + CHART_H - 6}
          x2={40}
          y2={CHART_Y - 4}
          stroke="rgba(138,144,164,0.4)"
        />
        <text
          x={48}
          y={CHART_Y + 8}
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="#8a90a4"
        >
          {lossLabel}
        </text>
        <text
          x={W - 44}
          y={CHART_Y + CHART_H + 4}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="#8a90a4"
        >
          {stepCounterLabel}: {steps}
        </text>
        {losses.length > 1 && (
          <path d={path} fill="none" stroke="#ffd166" strokeWidth="1.6" strokeLinejoin="round" />
        )}
      </svg>

      {/* Prediction table + buttons */}
      <div className="hairline grid grid-cols-1 gap-4 border-t p-4 md:grid-cols-[1fr_auto]">
        <div className="grid grid-cols-4 gap-2 font-mono text-[11px]">
          {preds.map((p, i) => {
            const close = Math.abs(p.o - p.y) < 0.15;
            return (
              <div
                key={i}
                className={`hairline rounded-md border px-2 py-1.5 text-center ${
                  close ? "border-signal-amber/50 text-signal-amber" : "text-ink-200"
                }`}
              >
                <div className="text-[10px] text-ink-400">
                  {p.x[0]} ⊕ {p.x[1]} = {p.y}
                </div>
                <div className="mt-0.5 text-sm">{p.o.toFixed(3)}</div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={doOne}
            className="hairline rounded-md border bg-signal-amber/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/20"
          >
            {stepLabel}
          </button>
          <button
            onClick={trainFast}
            className="hairline rounded-md border bg-signal-amber/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/20"
          >
            {trainLabel}
          </button>
          <button
            onClick={reset}
            className="hairline rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:text-ink-100"
          >
            {resetLabel}
          </button>
        </div>
      </div>

      <p className="hairline border-t px-4 py-3 text-[11px] leading-relaxed text-ink-300">{hint}</p>
    </figure>
  );
}
