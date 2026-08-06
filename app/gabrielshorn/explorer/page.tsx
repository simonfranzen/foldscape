"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

const X_MIN = 1;
const LOG_X_MAX_MIN = Math.log10(1.5);
const LOG_X_MAX_MAX = Math.log10(1000);

// Lateral surface area A = 2π ∫₁^{xMax} (1/x) · √(1 + 1/x⁴) dx. We substitute
// u = ln x, giving A = 2π ∫₀^{ln xMax} √(1 + e^{-4u}) du. In u the integrand is
// smooth and bounded, so a uniform Simpson grid stays accurate even at large
// xMax (the raw x-grid undersampled the head near x = 1 and drifted in the 4th
// significant digit past xMax ≈ 100). N even.
function surfaceArea(xMax: number, N = 2000): number {
  if (xMax <= X_MIN) return 0;
  const a = 0;
  const b = Math.log(xMax);
  const n = N % 2 === 0 ? N : N + 1;
  const h = (b - a) / n;
  const f = (u: number) => Math.sqrt(1 + Math.exp(-4 * u));
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    const u = a + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * f(u);
  }
  return 2 * Math.PI * (h / 3) * sum;
}

// Display a number with 6 significant digits.
function sig6(x: number): string {
  if (!Number.isFinite(x)) return "∞";
  if (x === 0) return "0";
  return x.toPrecision(6);
}

// --------------------------------------------------------------------------
// Per-locale UI strings for the explorer. Kept inline (the documented
// RICH_EXPLORER pattern) so the translations sit next to the controls they
// label instead of fattening the shared i18n bundles. Math-only tokens
// (formulas, "V → π · A → ∞") stay literal.
// --------------------------------------------------------------------------

type RichExplorer = {
  badge3d: string;
  badge2d: string;
  convergence: string;
  view: string;
  spin: string;
  hold: string;
  reset: string;
  xMaxTitle: string;
  animate: string;
  stop: string;
  liveValues: string;
  vCut: string;
  aExact: string;
  liveNote: string;
  painterParadox: string;
  epsilon: string;
  paintCoat: string;
  paintFill: string;
  paintNote: string;
  canvas3dLabel: string;
  canvas2dLabel: string;
};

const RICH_EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    badge3d: "Solid of revolution · drag to rotate",
    badge2d: "Side view · y = ±1/x · x ∈ [1, x_max]",
    convergence: "V → π · A → ∞",
    view: "View",
    spin: "Spin",
    hold: "Hold",
    reset: "Reset",
    xMaxTitle: "x_max, cutoff (log scale)",
    animate: "Animate growth",
    stop: "Stop",
    liveValues: "Live values",
    vCut: "V (cut)",
    aExact: "A (exact)",
    liveNote:
      "As x_max → ∞: V → π (finite), A → ∞ (the harmonic integral diverges). The lower bound 2π · ln(x_max) makes the divergence visible.",
    painterParadox: "Painter's paradox",
    epsilon: "ε (paint thickness)",
    paintCoat: "Paint to coat at ε",
    paintFill: "Paint to fill (V)",
    paintNote:
      "Honest paint has nonzero thickness. Coating an infinite surface then already costs infinite volume, and the paradox dissolves.",
    canvas3dLabel: "Gabriel's Horn as a 3D solid of revolution, cut off at x_max",
    canvas2dLabel: "Side profile of Gabriel's Horn, y = ±1/x for x from 1 to x_max",
  },
  de: {
    badge3d: "Rotationskörper · ziehen zum Drehen",
    badge2d: "Seitenansicht · y = ±1/x · x ∈ [1, x_max]",
    convergence: "V → π · A → ∞",
    view: "Ansicht",
    spin: "Dreht",
    hold: "Hält",
    reset: "Zurücksetzen",
    xMaxTitle: "x_max, Abschneidung (log. Skala)",
    animate: "Wachstum animieren",
    stop: "Stopp",
    liveValues: "Live-Werte",
    vCut: "V (Schnitt)",
    aExact: "A (exakt)",
    liveNote:
      "Für x_max → ∞: V → π (endlich), A → ∞ (das harmonische Integral divergiert). Die untere Schranke 2π · ln(x_max) macht die Divergenz sichtbar.",
    painterParadox: "Malerparadoxon",
    epsilon: "ε (Farbdicke)",
    paintCoat: "Farbe zum Streichen bei ε",
    paintFill: "Farbe zum Füllen (V)",
    paintNote:
      "Echte Farbe hat eine Dicke ungleich null. Eine unendliche Fläche zu überziehen kostet dann schon unendliches Volumen, und das Paradoxon löst sich auf.",
    canvas3dLabel: "Gabriels Horn als 3D-Rotationskörper, abgeschnitten bei x_max",
    canvas2dLabel: "Seitenprofil von Gabriels Horn, y = ±1/x für x von 1 bis x_max",
  },
  es: {
    badge3d: "Sólido de revolución · arrastra para girar",
    badge2d: "Vista lateral · y = ±1/x · x ∈ [1, x_max]",
    convergence: "V → π · A → ∞",
    view: "Vista",
    spin: "Gira",
    hold: "Fija",
    reset: "Reiniciar",
    xMaxTitle: "x_max, corte (escala log)",
    animate: "Animar crecimiento",
    stop: "Detener",
    liveValues: "Valores en vivo",
    vCut: "V (corte)",
    aExact: "A (exacta)",
    liveNote:
      "Cuando x_max → ∞: V → π (finito), A → ∞ (la integral armónica diverge). La cota inferior 2π · ln(x_max) hace visible la divergencia.",
    painterParadox: "Paradoja del pintor",
    epsilon: "ε (grosor de pintura)",
    paintCoat: "Pintura para cubrir con ε",
    paintFill: "Pintura para llenar (V)",
    paintNote:
      "La pintura real tiene grosor no nulo. Cubrir una superficie infinita ya cuesta entonces volumen infinito, y la paradoja se disuelve.",
    canvas3dLabel: "El cuerno de Gabriel como sólido de revolución 3D, cortado en x_max",
    canvas2dLabel: "Perfil lateral del cuerno de Gabriel, y = ±1/x para x de 1 a x_max",
  },
  fr: {
    badge3d: "Solide de révolution · glisse pour tourner",
    badge2d: "Vue de côté · y = ±1/x · x ∈ [1, x_max]",
    convergence: "V → π · A → ∞",
    view: "Vue",
    spin: "Tourne",
    hold: "Fige",
    reset: "Réinitialiser",
    xMaxTitle: "x_max, coupure (échelle log)",
    animate: "Animer la croissance",
    stop: "Arrêter",
    liveValues: "Valeurs en direct",
    vCut: "V (coupe)",
    aExact: "A (exacte)",
    liveNote:
      "Quand x_max → ∞ : V → π (fini), A → ∞ (l'intégrale harmonique diverge). La borne inférieure 2π · ln(x_max) rend la divergence visible.",
    painterParadox: "Paradoxe du peintre",
    epsilon: "ε (épaisseur de peinture)",
    paintCoat: "Peinture pour couvrir à ε",
    paintFill: "Peinture pour remplir (V)",
    paintNote:
      "La vraie peinture a une épaisseur non nulle. Couvrir une surface infinie coûte alors déjà un volume infini, et le paradoxe se dissout.",
    canvas3dLabel: "La trompette de Gabriel comme solide de révolution 3D, coupée à x_max",
    canvas2dLabel: "Profil latéral de la trompette de Gabriel, y = ±1/x pour x de 1 à x_max",
  },
  it: {
    badge3d: "Solido di rotazione · trascina per ruotare",
    badge2d: "Vista laterale · y = ±1/x · x ∈ [1, x_max]",
    convergence: "V → π · A → ∞",
    view: "Vista",
    spin: "Ruota",
    hold: "Ferma",
    reset: "Reimposta",
    xMaxTitle: "x_max, taglio (scala log)",
    animate: "Anima la crescita",
    stop: "Ferma",
    liveValues: "Valori dal vivo",
    vCut: "V (taglio)",
    aExact: "A (esatta)",
    liveNote:
      "Per x_max → ∞: V → π (finito), A → ∞ (l'integrale armonico diverge). L'estremo inferiore 2π · ln(x_max) rende visibile la divergenza.",
    painterParadox: "Paradosso del pittore",
    epsilon: "ε (spessore vernice)",
    paintCoat: "Vernice per rivestire a ε",
    paintFill: "Vernice per riempire (V)",
    paintNote:
      "La vernice vera ha spessore non nullo. Rivestire una superficie infinita costa allora già volume infinito, e il paradosso si dissolve.",
    canvas3dLabel: "Il corno di Gabriele come solido di rotazione 3D, tagliato a x_max",
    canvas2dLabel: "Profilo laterale del corno di Gabriele, y = ±1/x per x da 1 a x_max",
  },
  pt: {
    badge3d: "Sólido de revolução · arrasta para rodar",
    badge2d: "Vista lateral · y = ±1/x · x ∈ [1, x_max]",
    convergence: "V → π · A → ∞",
    view: "Vista",
    spin: "Roda",
    hold: "Fixa",
    reset: "Repor",
    xMaxTitle: "x_max, corte (escala log)",
    animate: "Animar crescimento",
    stop: "Parar",
    liveValues: "Valores ao vivo",
    vCut: "V (corte)",
    aExact: "A (exata)",
    liveNote:
      "Quando x_max → ∞: V → π (finito), A → ∞ (o integral harmónico diverge). O limite inferior 2π · ln(x_max) torna a divergência visível.",
    painterParadox: "Paradoxo do pintor",
    epsilon: "ε (espessura da tinta)",
    paintCoat: "Tinta para cobrir a ε",
    paintFill: "Tinta para encher (V)",
    paintNote:
      "A tinta real tem espessura não nula. Cobrir uma superfície infinita custa então já volume infinito, e o paradoxo dissolve-se.",
    canvas3dLabel: "A trombeta de Gabriel como sólido de revolução 3D, cortada em x_max",
    canvas2dLabel: "Perfil lateral da trombeta de Gabriel, y = ±1/x para x de 1 a x_max",
  },
  sv: {
    badge3d: "Rotationskropp · dra för att rotera",
    badge2d: "Sidvy · y = ±1/x · x ∈ [1, x_max]",
    convergence: "V → π · A → ∞",
    view: "Vy",
    spin: "Snurrar",
    hold: "Stilla",
    reset: "Återställ",
    xMaxTitle: "x_max, avskärning (log-skala)",
    animate: "Animera tillväxt",
    stop: "Stopp",
    liveValues: "Livevärden",
    vCut: "V (kapad)",
    aExact: "A (exakt)",
    liveNote:
      "När x_max → ∞: V → π (ändlig), A → ∞ (den harmoniska integralen divergerar). Den nedre gränsen 2π · ln(x_max) gör divergensen synlig.",
    painterParadox: "Målarens paradox",
    epsilon: "ε (färgtjocklek)",
    paintCoat: "Färg för att täcka vid ε",
    paintFill: "Färg för att fylla (V)",
    paintNote:
      "Riktig färg har tjocklek skild från noll. Att täcka en oändlig yta kostar då redan oändlig volym, och paradoxen löses upp.",
    canvas3dLabel: "Gabriels horn som en 3D-rotationskropp, avskuren vid x_max",
    canvas2dLabel: "Sidoprofil av Gabriels horn, y = ±1/x för x från 1 till x_max",
  },
  no: {
    badge3d: "Rotasjonslegeme · dra for å rotere",
    badge2d: "Sidevisning · y = ±1/x · x ∈ [1, x_max]",
    convergence: "V → π · A → ∞",
    view: "Visning",
    spin: "Snurrer",
    hold: "Fast",
    reset: "Nullstill",
    xMaxTitle: "x_max, avskjæring (log-skala)",
    animate: "Animer vekst",
    stop: "Stopp",
    liveValues: "Sanntidsverdier",
    vCut: "V (kuttet)",
    aExact: "A (eksakt)",
    liveNote:
      "Når x_max → ∞: V → π (endelig), A → ∞ (det harmoniske integralet divergerer). Den nedre grensen 2π · ln(x_max) gjør divergensen synlig.",
    painterParadox: "Malerens paradoks",
    epsilon: "ε (malingstykkelse)",
    paintCoat: "Maling for å dekke ved ε",
    paintFill: "Maling for å fylle (V)",
    paintNote:
      "Ekte maling har tykkelse ulik null. Å dekke en uendelig flate koster da allerede uendelig volum, og paradokset løser seg opp.",
    canvas3dLabel: "Gabriels horn som et 3D-rotasjonslegeme, kuttet ved x_max",
    canvas2dLabel: "Sideprofil av Gabriels horn, y = ±1/x for x fra 1 til x_max",
  },
};

export default function GabrielsHornExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.gabrielshorn;
  const tr = RICH_EXPLORER[locale];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [logXMax, setLogXMax] = useState<number>(Math.log10(10));
  const [epsilon, setEpsilon] = useState<number>(0.01);
  const [animate, setAnimate] = useState<boolean>(false);
  const [view, setView] = useState<"3d" | "2d">("3d");
  const [spin, setSpin] = useState<boolean>(true);
  const animRef = useRef<number | null>(null);
  const dpr = useDpr();

  // Honour prefers-reduced-motion: freeze the auto-spin and the growth
  // animation, but keep drag-to-rotate and the sliders working. Re-subscribe
  // on change so toggling the OS setting live takes effect without a reload.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);
  useEffect(() => {
    if (reduced) {
      setSpin(false);
      setAnimate(false);
    }
  }, [reduced]);

  // 3D rotation state.
  const yawRef = useRef(0.7);
  const pitchRef = useRef(0.25);
  const draggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });
  // Exposed so drag handlers can repaint on demand while the rAF loop is off
  // (reduced motion).
  const drawRef = useRef<() => void>(() => {});

  const xMax = Math.pow(10, logXMax);

  // Animate growth: smoothly cycle xMax through the slider range.
  useEffect(() => {
    if (!animate) {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setLogXMax((prev) => {
        const next = prev + dt * 0.25; // logarithmic units per second
        if (next > LOG_X_MAX_MAX) return LOG_X_MAX_MIN;
        return next;
      });
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
      animRef.current = null;
    };
  }, [animate]);

  // 2D side-view renderer.
  useEffect(() => {
    if (view !== "2d") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Background
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // Layout: leave a small left margin for the y-axis labels and a
      // bottom margin for the x-axis labels.
      const padL = 44;
      const padR = 16;
      const padT = 16;
      const padB = 28;
      const plotW = W - padL - padR;
      const plotH = H - padT - padB;

      // Mapping: x in [1, xMax] -> [padL, padL + plotW]; y in [-1, 1] -> [padT, padT + plotH]
      const toPx = (x: number) => padL + ((x - X_MIN) / (xMax - X_MIN)) * plotW;
      const toPy = (y: number) => padT + ((1 - y) / 2) * plotH;

      // Gridlines
      ctx.strokeStyle = "rgba(138,144,164,0.10)";
      ctx.lineWidth = 1;
      // Horizontal y-grid at -1, -0.5, 0, 0.5, 1
      const yTicks = [-1, -0.5, 0, 0.5, 1];
      ctx.beginPath();
      for (const y of yTicks) {
        const py = toPy(y);
        ctx.moveTo(padL, py);
        ctx.lineTo(padL + plotW, py);
      }
      ctx.stroke();

      // Vertical x-grid: choose ~6 logarithmically spaced ticks
      const xTicks: number[] = [];
      const decades = Math.log10(xMax);
      if (decades <= 1.5) {
        const step = Math.max(1, Math.round((xMax - 1) / 5));
        for (let v = 1; v <= xMax; v += step) xTicks.push(v);
        if (xTicks[xTicks.length - 1] !== xMax) xTicks.push(xMax);
      } else {
        for (let d = 0; d <= Math.floor(decades) + 1; d++) {
          const v = Math.pow(10, d);
          if (v >= 1 && v <= xMax) xTicks.push(v);
        }
        if (xTicks[xTicks.length - 1] !== xMax) xTicks.push(xMax);
      }
      ctx.beginPath();
      for (const v of xTicks) {
        const px = toPx(v);
        ctx.moveTo(px, padT);
        ctx.lineTo(px, padT + plotH);
      }
      ctx.stroke();

      // Axes
      ctx.strokeStyle = "rgba(138,144,164,0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      // x-axis at y=0
      ctx.moveTo(padL, toPy(0));
      ctx.lineTo(padL + plotW, toPy(0));
      // y-axis at x = X_MIN
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, padT + plotH);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = "rgba(200,205,220,0.7)";
      ctx.font = "10px ui-monospace, monospace";
      for (const y of yTicks) {
        const py = toPy(y);
        ctx.fillText(y.toFixed(1), 6, py + 3);
      }
      for (const v of xTicks) {
        const px = toPx(v);
        const label = v >= 100 ? v.toExponential(0) : v.toFixed(v < 10 ? 1 : 0);
        ctx.fillText(label, px - 8, H - padB + 14);
      }

      // Build the horn boundary polyline (in plot coords).
      // Sample x logarithmically across [1, xMax] for visual fidelity.
      const SAMPLES = 600;
      type P = { x: number; yTop: number; yBot: number };
      const pts: P[] = new Array(SAMPLES + 1);
      const lx0 = Math.log(X_MIN);
      const lx1 = Math.log(xMax);
      for (let i = 0; i <= SAMPLES; i++) {
        const lx = lx0 + ((lx1 - lx0) * i) / SAMPLES;
        const x = Math.exp(lx);
        const y = 1 / x;
        pts[i] = { x, yTop: y, yBot: -y };
      }

      // Filled interior with a gradient ("paint").
      const grad = ctx.createLinearGradient(padL, toPy(1), padL, toPy(-1));
      grad.addColorStop(0, "rgba(255, 209, 102, 0.18)");
      grad.addColorStop(0.5, "rgba(255, 209, 102, 0.34)");
      grad.addColorStop(1, "rgba(255, 209, 102, 0.18)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(toPx(pts[0].x), toPy(pts[0].yTop));
      for (let i = 1; i <= SAMPLES; i++) ctx.lineTo(toPx(pts[i].x), toPy(pts[i].yTop));
      for (let i = SAMPLES; i >= 0; i--) ctx.lineTo(toPx(pts[i].x), toPy(pts[i].yBot));
      ctx.closePath();
      ctx.fill();

      // Boundary curves.
      ctx.strokeStyle = "rgba(255, 209, 102, 0.95)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i <= SAMPLES; i++) {
        const px = toPx(pts[i].x);
        const py = toPy(pts[i].yTop);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i <= SAMPLES; i++) {
        const px = toPx(pts[i].x);
        const py = toPy(pts[i].yBot);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Cap at the cutoff: a vertical line at x = xMax between -1/xMax and 1/xMax
      ctx.strokeStyle = "rgba(125, 243, 255, 0.7)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(toPx(xMax), toPy(1 / xMax));
      ctx.lineTo(toPx(xMax), toPy(-1 / xMax));
      ctx.stroke();

      // Cutoff label
      ctx.fillStyle = palette.signal.cyan;
      ctx.font = "11px ui-monospace, monospace";
      const cutLabel = `x_max = ${sig6(xMax)}`;
      const lblX = Math.min(toPx(xMax) - 6, padL + plotW - 110);
      ctx.fillText(cutLabel, Math.max(padL + 4, lblX), padT + 12);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [xMax, view, dpr]);

  // 3D mesh renderer (solid of revolution). Auto-spins; drag to rotate.
  useEffect(() => {
    if (view !== "3d") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    let raf = 0;

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      // Under reduced motion the loop won't repaint, so redraw on resize.
      if (reduced) drawRef.current();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Parametric mesh: x ∈ [1, xMax] log-spaced, θ ∈ [0, 2π].
    const Nx = 56;
    const Nt = 36;
    const xs: number[] = [];
    const lnA = Math.log(1);
    const lnB = Math.log(xMax);
    for (let i = 0; i <= Nx; i++) {
      const t = i / Nx;
      xs.push(Math.exp(lnA + (lnB - lnA) * t));
    }

    // First full clear for crisp first frame.
    ctx.fillStyle = palette.canvas.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      if (reduced) {
        // Static frame: opaque clear so drag repaints leave no motion trail.
        ctx.fillStyle = palette.canvas.bg;
        ctx.fillRect(0, 0, W, H);
      } else {
        // Slight trail clear for motion blur.
        ctx.fillStyle = "rgba(6, 7, 13, 0.28)";
        ctx.fillRect(0, 0, W, H);
      }

      const yaw = yawRef.current;
      const pitch = pitchRef.current;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);

      // Centre the horn in the canvas, scale so the horn fits.
      // For log-mapped xMax the visible body extent in projected x is ~ln(xMax)+1.
      const bodyExtent = Math.max(2, Math.log(xMax) + 2);
      const scale = Math.min(W / (bodyExtent + 2), H / 3.5);
      const ox = W * 0.22;
      const oy = H / 2;

      // 3D project: rotate yaw around y-axis, then pitch around x-axis.
      // We compress along x logarithmically so very long horns still fit.
      const project = (x: number, y: number, z: number): [number, number, number] => {
        const xc = Math.log(x); // log-compressed axial coordinate, 0 at x=1
        const xr = cy * xc + sy * z;
        const zr = -sy * xc + cy * z;
        const yr = cp * y - sp * zr;
        const zr2 = sp * y + cp * zr;
        const depth = 8 + zr2;
        const k = 8 / Math.max(0.2, depth);
        return [ox + xr * scale * k, oy - yr * scale * k, zr2];
      };

      // Rings (circular cross sections).
      const ringStep = Math.max(2, Math.floor(Nx / 20));
      for (let i = 0; i <= Nx; i += ringStep) {
        const x = xs[i];
        const r = 1 / x;
        ctx.lineWidth = 0.8 * dpr;
        ctx.beginPath();
        for (let j = 0; j <= Nt; j++) {
          const theta = (j / Nt) * Math.PI * 2;
          const y = r * Math.cos(theta);
          const z = r * Math.sin(theta);
          const [px, py] = project(x, y, z);
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        const t = i / Nx;
        const cr = Math.floor(255 + (179 - 255) * t);
        const cg = Math.floor(209 + (136 - 209) * t);
        const cb = Math.floor(102 + (255 - 102) * t);
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.22 + 0.5 * (1 - t)})`;
        ctx.stroke();
      }

      // Longitudinal ribs.
      const ribs = 14;
      for (let j = 0; j < ribs; j++) {
        const theta = (j / ribs) * Math.PI * 2;
        ctx.lineWidth = 0.9 * dpr;
        ctx.beginPath();
        for (let i = 0; i <= Nx; i++) {
          const x = xs[i];
          const r = 1 / x;
          const y = r * Math.cos(theta);
          const z = r * Math.sin(theta);
          const [px, py] = project(x, y, z);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        const facing = Math.cos(theta + yaw);
        const alpha = 0.2 + 0.45 * Math.max(0, facing);
        ctx.strokeStyle = `rgba(255, 209, 102, ${alpha})`;
        ctx.stroke();
      }

      // Axis indicator (dashed pink, runs through center).
      ctx.strokeStyle = "rgba(255, 122, 182, 0.35)";
      ctx.lineWidth = 0.8 * dpr;
      ctx.setLineDash([4 * dpr, 4 * dpr]);
      ctx.beginPath();
      const [ax0, ay0] = project(1, 0, 0);
      const [ax1, ay1] = project(xMax, 0, 0);
      ctx.moveTo(ax0, ay0);
      ctx.lineTo(ax1, ay1);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cap at the mouth (x = 1, disc of radius 1).
      ctx.strokeStyle = "rgba(255, 209, 102, 0.85)";
      ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath();
      for (let j = 0; j <= 60; j++) {
        const theta = (j / 60) * Math.PI * 2;
        const y = Math.cos(theta);
        const z = Math.sin(theta);
        const [px, py] = project(1, y, z);
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Cap at the cutoff x = xMax (radius 1/xMax) — cyan to match 2D mode.
      const rEnd = 1 / xMax;
      ctx.strokeStyle = "rgba(125, 243, 255, 0.9)";
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath();
      for (let j = 0; j <= 60; j++) {
        const theta = (j / 60) * Math.PI * 2;
        const y = rEnd * Math.cos(theta);
        const z = rEnd * Math.sin(theta);
        const [px, py] = project(xMax, y, z);
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Auto-spin if not dragging and spin is enabled (never under reduced
      // motion, where the rAF loop is not scheduled at all).
      if (!reduced) {
        if (!draggingRef.current && spin) yawRef.current += 0.004;
        raf = requestAnimationFrame(draw);
      }
    };
    drawRef.current = draw;
    if (!reduced) raf = requestAnimationFrame(draw);
    else draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [xMax, view, spin, dpr, reduced]);

  // Pointer-based drag so touch devices can rotate too (the old mouse-only
  // listeners were dead on phones/tablets). setPointerCapture keeps the drag
  // alive if the pointer leaves the canvas; touch-none on the canvas stops the
  // page from scrolling mid-rotate.
  const onCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (view !== "3d") return;
    draggingRef.current = true;
    lastRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLCanvasElement).setPointerCapture?.(e.pointerId);
  };
  const onCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (view !== "3d" || !draggingRef.current) return;
    const dx = e.clientX - lastRef.current.x;
    const dy = e.clientY - lastRef.current.y;
    lastRef.current = { x: e.clientX, y: e.clientY };
    yawRef.current += dx * 0.01;
    pitchRef.current = Math.max(-0.9, Math.min(0.9, pitchRef.current + dy * 0.01));
    // Under reduced motion the rAF loop is off, so repaint on each drag step.
    if (reduced) drawRef.current();
  };
  const onCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = false;
    (e.target as HTMLCanvasElement).releasePointerCapture?.(e.pointerId);
  };

  const resetRotation = () => {
    yawRef.current = 0.7;
    pitchRef.current = 0.25;
  };

  const V = Math.PI * (1 - 1 / xMax);
  const A = surfaceArea(xMax);
  const ALow = 2 * Math.PI * Math.log(xMax);
  const paintVol = A * epsilon;

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {view === "3d" ? tr.badge3d : tr.badge2d}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {tr.convergence}
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={view === "3d" ? tr.canvas3dLabel : tr.canvas2dLabel}
              className={`block h-full w-full ${view === "3d" ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
              onPointerDown={onCanvasPointerDown}
              onPointerMove={onCanvasPointerMove}
              onPointerUp={onCanvasPointerUp}
              onPointerLeave={onCanvasPointerUp}
            />
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tr.view}
            </div>
            <div className="flex items-center gap-2">
              <div className="hairline inline-flex overflow-hidden rounded-md border">
                <button
                  onClick={() => setView("3d")}
                  className={`px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    view === "3d"
                      ? "bg-signal-amber/15 text-signal-amber"
                      : "text-ink-300 hover:text-ink-100"
                  }`}
                >
                  3D
                </button>
                <button
                  onClick={() => setView("2d")}
                  className={`hairline border-l px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    view === "2d"
                      ? "bg-signal-amber/15 text-signal-amber"
                      : "text-ink-300 hover:text-ink-100"
                  }`}
                >
                  2D
                </button>
              </div>
              {view === "3d" && (
                <>
                  <button
                    onClick={() => setSpin((v) => !v)}
                    className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                      spin
                        ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                        : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                    }`}
                  >
                    {spin ? tr.spin : tr.hold}
                  </button>
                  <button
                    onClick={resetRotation}
                    className="hairline rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-ink-100"
                  >
                    {tr.reset}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tr.xMaxTitle}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-amber">{sig6(xMax)}</span>
              <button
                onClick={() => setAnimate((v) => !v)}
                className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                  animate
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                }`}
              >
                {animate ? tr.stop : tr.animate}
              </button>
            </div>
            <input
              type="range"
              value={logXMax}
              min={LOG_X_MAX_MIN}
              max={LOG_X_MAX_MAX}
              step={0.001}
              aria-label={tr.xMaxTitle}
              onChange={(e) => setLogXMax(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="flex justify-between font-mono text-[10px] text-ink-400">
              <span>1.5</span>
              <span>10</span>
              <span>100</span>
              <span>1000</span>
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tr.liveValues}
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-xs">
              <span className="text-ink-300">{tr.vCut}</span>
              <span className="text-signal-amber">π · (1 − 1/x_max) = {sig6(V)}</span>

              <span className="text-ink-300">{tr.aExact}</span>
              <span className="text-signal-amber">{sig6(A)}</span>

              <span className="text-ink-300">A ≥ 2π ln(x_max)</span>
              <span className="text-ink-200">{sig6(ALow)}</span>

              <span className="text-ink-300">V / π</span>
              <span className="text-ink-200">{sig6(V / Math.PI)}</span>
            </div>
            <p className="pt-2 text-[11px] leading-relaxed text-ink-400">{tr.liveNote}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tr.painterParadox}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-ink-300">{tr.epsilon}</span>
              <span className="text-signal-amber">{sig6(epsilon)}</span>
            </div>
            <input
              type="range"
              value={epsilon}
              min={0.001}
              max={0.1}
              step={0.001}
              aria-label={tr.epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-xs">
              <span className="text-ink-300">{tr.paintCoat}</span>
              <span className="text-signal-amber">A · ε = {sig6(paintVol)}</span>
              <span className="text-ink-300">{tr.paintFill}</span>
              <span className="text-ink-200">{sig6(V)}</span>
            </div>
            <p className="pt-1 text-[11px] leading-relaxed text-ink-400">{tr.paintNote}</p>
          </div>

          <div className="p-5">
            <Link
              href="/gabrielshorn"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
