"use client";

// Procedural canvas star-field: four parallax depths × ~200 stars each. The
// canvas stays position:fixed and inhales the whole viewport; per-frame draw
// converts each star's "sky-y" to a screen-y using the layer's parallax
// speed, so scrolling the page makes deeper layers drift slower than the
// nearer ones. Twinkle is a sin phase per star; drift is a tiny horizontal
// wobble. Mouse parallax is folded in at the closest layer only.
//
// All looped state is gated by prefers-reduced-motion: the first effect
// renders a single deterministic frame and freezes.

import { useEffect, useRef } from "react";

interface StarDef {
  x: number; // normalized 0..1 across canvas width
  yBase: number; // 0..VIRTUAL_H in virtual sky coords
  r: number;
  phase: number;
  hue: number; // 200..260 (cool tint range)
  alpha: number;
}

interface LayerDef {
  count: number;
  rMin: number;
  rMax: number;
  speed: number; // 0..1, parallax factor against scroll
  twinkleHz: number;
  alpha: number; // baseline opacity (0..1)
}

// Same seeded hash as lib/cosmos/layout so star generation is deterministic
// between SSR mounts of any sibling components — though canvas runs only
// client-side, the determinism is nice for visual stability across reloads
// (a stable starfield reads as "real" rather than "every reload, a new sky").
function hash01(seed: number): number {
  let h = seed >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 0xffffffff;
}

// Virtual sky height: total scrollable sky in CSS pixels. The slowest layer
// moves at 0.08 × scrollY; the page is ~9 viewports (~9000px on desktop).
// 0.08 * 9000 = 720, so giving each layer 1600px of vertical sky means
// no star ever wraps mid-scroll — wrap math kicks in only after the user
// has scrolled past the end and rewound (or on resize).
const VIRTUAL_H = 1800;

// Dimmer, sparser layers — a real cosmos is mostly empty. Counts trimmed
// again per user feedback ("noch ein paar weniger"); each layer now sits
// about ~60% of v2. The eye still reads "starfield", just with more
// breathing room between points of light.
const LAYERS: LayerDef[] = [
  { count: 55, rMin: 0.3, rMax: 0.7, speed: 0.05, twinkleHz: 0.18, alpha: 0.25 },
  { count: 42, rMin: 0.5, rMax: 0.9, speed: 0.18, twinkleHz: 0.28, alpha: 0.35 },
  { count: 30, rMin: 0.7, rMax: 1.3, speed: 0.42, twinkleHz: 0.5, alpha: 0.5 },
  { count: 18, rMin: 1.1, rMax: 2.0, speed: 0.78, twinkleHz: 0.78, alpha: 0.7 },
];

function buildStars(layer: LayerDef, layerIdx: number): StarDef[] {
  const out: StarDef[] = [];
  for (let i = 0; i < layer.count; i++) {
    const seed = (layerIdx + 1) * 1000003 + i * 9176;
    const x = hash01(seed);
    const yBase = hash01(seed ^ 0xa1a1a1) * VIRTUAL_H;
    const r = layer.rMin + hash01(seed ^ 0xb2b2b2) * (layer.rMax - layer.rMin);
    const phase = hash01(seed ^ 0xc3c3c3) * Math.PI * 2;
    // Hue stays in a narrow cool band — 215..230 reads as "white with a
    // hint of cold sky" rather than the v1 rainbow that the user called
    // "Christmas". Range is small enough that to the eye every star is
    // essentially white.
    const hue = 215 + hash01(seed ^ 0xd4d4d4) * 15;
    const alpha = layer.alpha * (0.6 + hash01(seed ^ 0xe5e5e5) * 0.4);
    out.push({ x, yBase, r, phase, hue, alpha });
  }
  return out;
}

const STAR_LAYERS: StarDef[][] = LAYERS.map((l, i) => buildStars(l, i));

// Quiet "fading forms" replace the v3 comet streak (user feedback: comet
// was too loud). One geometric ghost at a time — a hexagon, ring, square,
// or triangle — materialises at a stable seed-picked spot, swells over
// ~5 s, dwells for ~4 s, then fades over ~5 s. Between forms there's a
// 6–14 s breath of pure star. The shape is always low-opacity (peak < 0.15)
// so it never competes with the stars, but the eye catches the bloom.
interface FadingForm {
  cx: number;
  cy: number;
  radius: number;
  kind: 0 | 1 | 2 | 3; // 0 hex, 1 ring, 2 square, 3 triangle
  life: number;
  maxLife: number;
}

function spawnForm(width: number, height: number, seed: number): FadingForm {
  const margin = 80;
  const cx = margin + ((seed * 51) % Math.max(1, width - margin * 2));
  const cy = margin + ((seed * 27) % Math.max(1, height - margin * 2));
  // Radius scales with viewport — bigger on desktop, smaller on phones.
  const baseR = Math.min(width, height) * 0.18;
  const jitter = ((seed * 7) % 60) - 30;
  return {
    cx,
    cy,
    radius: Math.max(40, baseR + jitter),
    kind: (seed % 4) as 0 | 1 | 2 | 3,
    life: 0,
    maxLife: 14, // 5 in, 4 dwell, 5 out
  };
}

function drawForm(
  ctx: CanvasRenderingContext2D,
  f: FadingForm,
  rotation: number,
): void {
  // Triangular envelope: 0..0.36 fade in, 0.36..0.64 dwell, 0.64..1 fade out.
  const u = f.life / f.maxLife;
  let envelope: number;
  if (u < 0.36) envelope = u / 0.36;
  else if (u < 0.64) envelope = 1;
  else envelope = 1 - (u - 0.64) / 0.36;
  const alpha = envelope * 0.14;
  if (alpha <= 0.005) return;
  ctx.save();
  ctx.translate(f.cx, f.cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = `rgba(220, 230, 255, ${alpha})`;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  if (f.kind === 0) {
    // Hexagon
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      const x = Math.cos(a) * f.radius;
      const y = Math.sin(a) * f.radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  } else if (f.kind === 1) {
    // Ring
    ctx.arc(0, 0, f.radius, 0, Math.PI * 2);
  } else if (f.kind === 2) {
    // Rotated square
    const s = f.radius;
    ctx.moveTo(-s, 0);
    ctx.lineTo(0, -s);
    ctx.lineTo(s, 0);
    ctx.lineTo(0, s);
    ctx.closePath();
  } else {
    // Triangle
    for (let i = 0; i < 3; i++) {
      const a = (Math.PI * 2 * i) / 3 - Math.PI / 2;
      const x = Math.cos(a) * f.radius;
      const y = Math.sin(a) * f.radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
  ctx.stroke();
  ctx.restore();
}

export function StarField() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const scrollYRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const formRef = useRef<FadingForm | null>(null);
  const nextFormAt = useRef(2); // first form appears after a 2 s settle
  const formSeed = useRef(1);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let width = 0;
    let height = 0;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;

    // When returning from a topic page (back-navigation, bfcache),
    // canvas.clientWidth/Height can briefly read 0 before layout settles.
    // Fall back to window.innerWidth/Height so the draw loop always has
    // sane dimensions — without this we'd skip every star (off-screen
    // clip kicks in) and the cosmos looks empty (user feedback:
    // "wenn ich einmal reinklicke und zurückklicke sehe ich keine sterne").
    const resize = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Sync scroll position at mount so the parallax doesn't snap from 0
    // on remount (which can happen mid-cosmos when navigating back).
    scrollYRef.current = window.scrollY;

    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    // If the browser restored the page from bfcache, force a fresh
    // resize + scroll sync so the canvas re-syncs to the new viewport.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        resize();
        scrollYRef.current = window.scrollY;
      }
    };
    window.addEventListener("pageshow", onPageShow);
    const onMouse = (e: MouseEvent) => {
      if (reduced || coarsePointer) return;
      // -1..1 across the viewport
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse);

    const t0 = performance.now();
    let lastFrame = t0;
    const draw = (now: number) => {
      rafRef.current = null;
      const t = (now - t0) / 1000;
      const dt = Math.min(0.1, (now - lastFrame) / 1000);
      lastFrame = now;
      ctx.clearRect(0, 0, width, height);
      const scrollY = scrollYRef.current;
      const { x: mx, y: my } = mouseRef.current;

      for (let li = 0; li < LAYERS.length; li++) {
        const layer = LAYERS[li];
        const stars = STAR_LAYERS[li];
        // Mouse parallax: only the closest layer shifts noticeably. Keeps the
        // effect subtle and reduces visual jitter on slower devices.
        const mxOff = li === LAYERS.length - 1 ? mx * 8 : mx * (1 + li);
        const myOff = li === LAYERS.length - 1 ? my * 6 : my * (0.5 + li * 0.4);

        for (const s of stars) {
          // Wrap-around in case the user scrolls past the virtual sky height.
          let y = (s.yBase - scrollY * layer.speed) % VIRTUAL_H;
          if (y < 0) y += VIRTUAL_H;
          // Map virtual-sky-Y onto the viewport. We anchor the virtual sky so
          // the slowest layer has stars filling the viewport at scrollY=0 —
          // a 2-screen safety margin above/below means no edge gaps.
          if (y > height + 200 || y < -200) continue;
          // Twinkle — real stars don't blink like Christmas lights. The
          // amplitude here is 6 % (0.94..1.0), barely perceptible, and the
          // frequency is halved compared to v3. Reads as "the eye thinks
          // it sees motion" rather than fairy lights flashing.
          const tw = reduced ? 1 : 0.94 + 0.06 * Math.sin(t * layer.twinkleHz * Math.PI + s.phase);
          const a = s.alpha * tw;
          const px = s.x * width + mxOff;
          const py = y + myOff;
          // Halo only on the closest layer, and even then half the v1
          // intensity. The user's note "weniger ist mehr" applies hardest
          // here: gauzy halos on every star turn the sky into a smear.
          if (li === LAYERS.length - 1) {
            const grad = ctx.createRadialGradient(px, py, 0, px, py, s.r * 3);
            grad.addColorStop(0, `hsla(${s.hue}, 35%, 92%, ${a * 0.4})`);
            grad.addColorStop(1, `hsla(${s.hue}, 35%, 90%, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, s.r * 3, 0, Math.PI * 2);
            ctx.fill();
          }
          // Low saturation (8% — the tint is a whisper, not a hue).
          ctx.fillStyle = `hsla(${s.hue}, 8%, 96%, ${a})`;
          ctx.beginPath();
          ctx.arc(px, py, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Fading-form pass — one geometric ghost at a time, emerges and
      // dissolves over its lifetime. Drawn over stars but at low opacity
      // so it reads as a "depth bloom" rather than a flashy event.
      if (!reduced && width > 0 && height > 0) {
        if (formRef.current == null && t >= nextFormAt.current) {
          formSeed.current = (formSeed.current * 1103515245 + 12345) >>> 0;
          formRef.current = spawnForm(width, height, formSeed.current);
        }
        const f = formRef.current;
        if (f) {
          f.life += dt;
          if (f.life >= f.maxLife) {
            formRef.current = null;
            // Quiet between forms — 6–14 s gap so they feel like rare events.
            nextFormAt.current = t + 6 + (formSeed.current % 8000) / 1000;
          } else {
            // Forms drift their rotation slowly over their life so they
            // never look quite static.
            const rot = (f.life / f.maxLife) * 0.6 + (f.cx % 100) * 0.03;
            drawForm(ctx, f, rot);
          }
        }
      }

      if (!reduced) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("pageshow", onPageShow);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
