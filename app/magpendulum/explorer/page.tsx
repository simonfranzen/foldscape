"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";

// Magnet colours — three distinct hues.
const MAGNET_COLORS = [
  { rgb: [255, 122, 182], name: "rose" },
  { rgb: [125, 243, 255], name: "cyan" },
  { rgb: [160, 232, 154], name: "green" },
];

// Per-locale control-panel copy. The story page localises the very same
// vocabulary in its RICH_STORY, so keeping the explorer in sync avoids a
// German user reading "Dämpfung γ" on the story page and "Damping γ" here.
type ExplorerDict = {
  basinMap: string;
  computing: string;
  ready: string;
  strength: string;
  damping: string;
  restoring: string;
  height: string;
  span: string;
  resolution: string;
  shade: string;
  recompute: string;
  legend: string;
  canvasLabel: string;
};

const RICH_EXPLORER: Record<Locale, ExplorerDict> = {
  en: {
    basinMap: "basin map",
    computing: "computing",
    ready: "ready",
    strength: "Magnet strength k",
    damping: "Damping γ",
    restoring: "Restoring ω²",
    height: "Pendulum height h",
    span: "View span ±",
    resolution: "Resolution",
    shade: "Shade by capture time",
    recompute: "⟳ Recompute",
    legend: "Magnet legend",
    canvasLabel: "Basin map of the magnetic pendulum",
  },
  de: {
    basinMap: "Bassin-Karte",
    computing: "rechne",
    ready: "bereit",
    strength: "Magnetstärke k",
    damping: "Dämpfung γ",
    restoring: "Rückstellung ω²",
    height: "Pendelhöhe h",
    span: "Ausschnitt ±",
    resolution: "Auflösung",
    shade: "Nach Einfangzeit einfärben",
    recompute: "⟳ Neu berechnen",
    legend: "Magnet-Legende",
    canvasLabel: "Bassin-Karte des magnetischen Pendels",
  },
  es: {
    basinMap: "mapa de cuencas",
    computing: "calculando",
    ready: "listo",
    strength: "Fuerza del imán k",
    damping: "Amortiguación γ",
    restoring: "Restauración ω²",
    height: "Altura del péndulo h",
    span: "Ventana ±",
    resolution: "Resolución",
    shade: "Sombrear por tiempo de captura",
    recompute: "⟳ Recalcular",
    legend: "Leyenda de imanes",
    canvasLabel: "Mapa de cuencas del péndulo magnético",
  },
  fr: {
    basinMap: "carte de bassins",
    computing: "calcul",
    ready: "prêt",
    strength: "Force d'aimant k",
    damping: "Amortissement γ",
    restoring: "Rappel ω²",
    height: "Hauteur du pendule h",
    span: "Fenêtre ±",
    resolution: "Résolution",
    shade: "Ombrer par temps de capture",
    recompute: "⟳ Recalculer",
    legend: "Légende des aimants",
    canvasLabel: "Carte de bassins du pendule magnétique",
  },
  it: {
    basinMap: "mappa di bacini",
    computing: "calcolo",
    ready: "pronto",
    strength: "Forza magnete k",
    damping: "Smorzamento γ",
    restoring: "Richiamo ω²",
    height: "Altezza del pendolo h",
    span: "Finestra ±",
    resolution: "Risoluzione",
    shade: "Ombreggia per tempo di cattura",
    recompute: "⟳ Ricalcola",
    legend: "Legenda magneti",
    canvasLabel: "Mappa di bacini del pendolo magnetico",
  },
  pt: {
    basinMap: "mapa de bacias",
    computing: "a calcular",
    ready: "pronto",
    strength: "Força do íman k",
    damping: "Amortecimento γ",
    restoring: "Restauração ω²",
    height: "Altura do pêndulo h",
    span: "Janela ±",
    resolution: "Resolução",
    shade: "Sombrear por tempo de captura",
    recompute: "⟳ Recalcular",
    legend: "Legenda de ímanes",
    canvasLabel: "Mapa de bacias do pêndulo magnético",
  },
  sv: {
    basinMap: "bäckenkarta",
    computing: "räknar",
    ready: "klar",
    strength: "Magnetstyrka k",
    damping: "Dämpning γ",
    restoring: "Återföring ω²",
    height: "Pendelhöjd h",
    span: "Vy ±",
    resolution: "Upplösning",
    shade: "Skugga efter infångningstid",
    recompute: "⟳ Räkna om",
    legend: "Magnetlegend",
    canvasLabel: "Bäckenkarta för den magnetiska pendeln",
  },
  no: {
    basinMap: "bekkenkart",
    computing: "regner",
    ready: "klar",
    strength: "Magnetstyrke k",
    damping: "Demping γ",
    restoring: "Tilbakestilling ω²",
    height: "Pendelhøyde h",
    span: "Utsnitt ±",
    resolution: "Oppløsning",
    shade: "Skyggelegg etter innfangingstid",
    recompute: "⟳ Beregn på nytt",
    legend: "Magnetlegende",
    canvasLabel: "Bekkenkart for den magnetiske pendelen",
  },
};

interface Magnet {
  x: number;
  y: number;
}

// Equations of motion (planar projection):
//   p̈ = − γ·ṗ − ω²·p − Σ kᵢ (p − mᵢ) / ((p − mᵢ)² + h²)^(3/2)
// where p is the pendulum (x, y) coordinate above the plate, h is the height
// of the pendulum above the plate (regularises the singularity), γ is the
// drag coefficient, ω² the restoring spring towards the centre, and k the
// magnet strength.

function simulateUntilSettled(
  startX: number,
  startY: number,
  magnets: Magnet[],
  k: number,
  gamma: number,
  omega2: number,
  h: number,
  maxSteps: number,
): { winner: number; steps: number } {
  let x = startX;
  let y = startY;
  let vx = 0;
  let vy = 0;
  const dt = 0.02;
  const settleR2 = 0.06; // distance² below which we count as captured
  const settleV2 = 0.005;
  for (let step = 0; step < maxSteps; step++) {
    let ax = -gamma * vx - omega2 * x;
    let ay = -gamma * vy - omega2 * y;
    for (let i = 0; i < magnets.length; i++) {
      const dx = x - magnets[i].x;
      const dy = y - magnets[i].y;
      const r2 = dx * dx + dy * dy + h * h;
      const r3 = r2 * Math.sqrt(r2);
      ax -= (k * dx) / r3;
      ay -= (k * dy) / r3;
    }
    vx += ax * dt;
    vy += ay * dt;
    x += vx * dt;
    y += vy * dt;
    // Numerical safeguard: bail out on blow-up rather than producing junk.
    if (!Number.isFinite(x) || !Number.isFinite(y) || x * x + y * y > 1e6) {
      break;
    }
    // capture check every few steps
    if ((step & 7) === 0) {
      for (let i = 0; i < magnets.length; i++) {
        const dx = x - magnets[i].x;
        const dy = y - magnets[i].y;
        const d2 = dx * dx + dy * dy;
        const v2 = vx * vx + vy * vy;
        if (d2 < settleR2 && v2 < settleV2) return { winner: i, steps: step };
      }
    }
  }
  // pick closest
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < magnets.length; i++) {
    const dx = x - magnets[i].x;
    const dy = y - magnets[i].y;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestD) {
      bestD = d2;
      best = i;
    }
  }
  return { winner: best, steps: maxSteps };
}

export default function MagpendulumExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.magpendulum;
  const ex = RICH_EXPLORER[locale];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [k, setK] = useState(0.4);
  const [gamma, setGamma] = useState(0.18);
  const [omega2, setOmega2] = useState(0.5);
  const [h, setH] = useState(0.18);
  const [resolution, setResolution] = useState(180); // px per axis
  const [span, setSpan] = useState(2.0); // coordinate window ±span
  const [shade, setShade] = useState(true);
  const [progress, setProgress] = useState(0);
  const [computing, setComputing] = useState(false);

  // Magnets at vertices of an equilateral triangle of radius 1.
  const magnets: Magnet[] = [
    { x: 0, y: -1 },
    { x: -Math.sin((Math.PI * 2) / 3), y: 0.5 },
    { x: Math.sin((Math.PI * 2) / 3), y: 0.5 },
  ];

  const [rev, setRev] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = Math.floor(canvas.clientWidth * dpr);
    const H = Math.floor(canvas.clientHeight * dpr);
    canvas.width = W;
    canvas.height = H;

    // The domain x,y ∈ [−span, span] is square; letterbox it into the largest
    // centred square so the equilateral magnet triangle and the basins are not
    // anisotropically stretched onto the non-square pane.
    const side = Math.min(W, H);
    const offX = (W - side) / 2;
    const offY = (H - side) / 2;

    setComputing(true);
    setProgress(0);

    // Render at `resolution` then upscale.
    const R = resolution;
    const tmp = document.createElement("canvas");
    tmp.width = R;
    tmp.height = R;
    const tctx = tmp.getContext("2d");
    if (!tctx) return;
    const img = tctx.createImageData(R, R);

    let row = 0;
    const maxSteps = 3000;

    // Background fill while computing
    ctx.fillStyle = palette.canvas.bg;
    ctx.fillRect(0, 0, W, H);

    let cancelled = false;
    const step = () => {
      if (cancelled) return;
      const sliceRows = 6;
      for (let s = 0; s < sliceRows && row < R; s++, row++) {
        for (let col = 0; col < R; col++) {
          const sx = ((col + 0.5) / R) * (2 * span) - span;
          const sy = ((row + 0.5) / R) * (2 * span) - span;
          const { winner, steps } = simulateUntilSettled(
            sx,
            sy,
            magnets,
            k,
            gamma,
            omega2,
            h,
            maxSteps,
          );
          const c = MAGNET_COLORS[winner];
          const idx = (row * R + col) * 4;
          let r = c.rgb[0];
          let g = c.rgb[1];
          let b = c.rgb[2];
          if (shade) {
            const tint = 1 - Math.min(1, steps / maxSteps);
            r = Math.floor(r * (0.35 + tint * 0.65));
            g = Math.floor(g * (0.35 + tint * 0.65));
            b = Math.floor(b * (0.35 + tint * 0.65));
          }
          img.data[idx] = r;
          img.data[idx + 1] = g;
          img.data[idx + 2] = b;
          img.data[idx + 3] = 255;
        }
      }
      tctx.putImageData(img, 0, 0);
      // upscale paint into the centred square (letterboxed on the long axis)
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, offX, offY, side, side);

      // overlay magnets every redraw, through the same square transform
      const drawMagnets = () => {
        for (let i = 0; i < magnets.length; i++) {
          const m = magnets[i];
          const px = offX + ((m.x + span) / (2 * span)) * side;
          const py = offY + ((m.y + span) / (2 * span)) * side;
          ctx.fillStyle = "rgba(5, 6, 10, 0.6)";
          ctx.beginPath();
          ctx.arc(px, py, 7 * dpr, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgb(${MAGNET_COLORS[i].rgb.join(",")})`;
          ctx.beginPath();
          ctx.arc(px, py, 5 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      drawMagnets();

      setProgress(row / R);
      if (row < R) {
        requestAnimationFrame(step);
      } else {
        setComputing(false);
      }
    };
    requestAnimationFrame(step);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k, gamma, omega2, h, resolution, span, shade, rev, dpr]);

  // The render effect reads clientWidth/clientHeight but has no size signal in
  // its deps, so without this the bitmap is left CSS-stretched after a window
  // resize until the user touches a slider. Retrigger it on any pane resize.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;
    let last = 0;
    const ro = new ResizeObserver(() => {
      // Ignore the initial observation (already drawn by the render effect).
      if (last) setRev((r) => r + 1);
      last = 1;
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full"
            role="img"
            aria-label={ex.canvasLabel}
          />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {ex.basinMap} · {resolution} × {resolution}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-coral">
              {computing ? `${ex.computing} ${(progress * 100).toFixed(0)}%` : ex.ready}
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-coral">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <SliderRow
              label={ex.strength}
              value={k}
              min={0.05}
              max={1.5}
              step={0.01}
              display={k.toFixed(2)}
              onChange={setK}
            />
            <SliderRow
              label={ex.damping}
              value={gamma}
              min={0.01}
              max={0.6}
              step={0.01}
              display={gamma.toFixed(2)}
              onChange={setGamma}
            />
            <SliderRow
              label={ex.restoring}
              value={omega2}
              min={0.05}
              max={2}
              step={0.05}
              display={omega2.toFixed(2)}
              onChange={setOmega2}
            />
            <SliderRow
              label={ex.height}
              value={h}
              min={0.05}
              max={0.6}
              step={0.01}
              display={h.toFixed(2)}
              onChange={setH}
            />
            <SliderRow
              label={ex.span}
              value={span}
              min={0.8}
              max={4}
              step={0.1}
              display={span.toFixed(1)}
              onChange={setSpan}
            />
            <SliderRow
              label={ex.resolution}
              value={resolution}
              min={60}
              max={360}
              step={20}
              display={`${resolution}px`}
              onChange={setResolution}
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-ink-300">
              <input
                type="checkbox"
                checked={shade}
                onChange={(e) => setShade(e.target.checked)}
                className="accent-signal-coral"
              />
              <span>{ex.shade}</span>
            </label>
            <button
              onClick={() => setRev((r) => r + 1)}
              className="hairline w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-coral/40 hover:text-signal-coral"
            >
              {ex.recompute}
            </button>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.legend}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MAGNET_COLORS.map((c, i) => (
                <div
                  key={i}
                  className="hairline flex items-center gap-1.5 rounded-md border px-2 py-1"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: `rgb(${c.rgb.join(",")})` }}
                  />
                  <span className="font-mono text-[10px] text-ink-300">M{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-coral/40 hover:text-signal-coral"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</div>
        <div className="font-mono text-[10px] text-ink-400">{display}</div>
      </div>
      <input
        type="range"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-signal-coral"
      />
    </div>
  );
}
