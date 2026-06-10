// Shared OpenGraph image generator for Foldscape.
//
// Two entry points:
//   renderRootOG()   — landing-page card (wordmark + tagline)
//   renderTopicOG(id) — per-topic card (title + tagline + formula)
//
// Both produce 1200x630 PNGs via next/og's ImageResponse. Edge runtime, no
// external assets, system fonts only. JSX uses inline styles since Tailwind
// is not available inside ImageResponse.

import { ImageResponse } from "next/og";
import { getTopic, type TopicCategory, type TopicId } from "@/lib/topics";
import { EN_PLACEHOLDERS } from "@/lib/i18n/placeholders";
import { palette } from "@/lib/visual/palette";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const INK = palette.canvas.bg;
const INK_SOFT = "#0b0d17";
const INK_LINE = "rgba(255,255,255,0.08)";
const TEXT_PRIMARY = "#f5f6fa";
const TEXT_MUTED = "#a8abbd";
const TEXT_FAINT = "#6b6f86";

const CATEGORY_ACCENT: Record<TopicCategory, string> = {
  logic: palette.signal.violet,
  computation: palette.signal.cyan,
  chaos: palette.signal.rose,
  geometry: palette.signal.amber,
  analysis: palette.signal.amber,
  paradox: palette.signal.rose,
};

const CATEGORY_LABEL: Record<TopicCategory, string> = {
  logic: "LOGIC",
  computation: "COMPUTATION",
  chaos: "CHAOS",
  geometry: "GEOMETRY",
  analysis: "ANALYSIS",
  paradox: "PARADOX",
};

// Topic copy in English. The atlas dictionary lives in lib/i18n/atlas.ts but
// that module pulls in client-only deps through the wider i18n graph. For OG
// rendering we keep a small, self-contained EN map: the explicit overrides
// for the first wave, plus EN_PLACEHOLDERS for everything else.
const EN_OVERRIDES: Partial<Record<TopicId, { title: string; tagline: string }>> = {
  nand: {
    title: "The Sheffer Stroke",
    tagline: "One gate is enough for all of digital logic",
  },
  iota: {
    title: "The Iota Combinator",
    tagline: "One symbol that is Turing-complete",
  },
  life: {
    title: "Conway's Game of Life",
    tagline: "Four rules. Spaceships, factories, computers.",
  },
  rule110: {
    title: "Rule 110",
    tagline: "An eight-bit rule, provably universal",
  },
  logistic: {
    title: "The Logistic Map",
    tagline: "A harmless formula where order collapses into chaos",
  },
  mandelbrot: {
    title: "The Mandelbrot Set",
    tagline: "Square and add. Forever.",
  },
  lorenz: {
    title: "The Lorenz Attractor",
    tagline: "Three lines of code, one butterfly",
  },
  fourier: {
    title: "The Fourier Transform",
    tagline: "Every signal is a sum of sine waves",
  },
  euler: {
    title: "Euler's Identity",
    tagline: "The five most important numbers, in one line",
  },
  banach: {
    title: "The Banach-Tarski Paradox",
    tagline: "Cut a ball, end up with two of the same size",
  },
};

function getTopicCopy(id: TopicId): { title: string; tagline: string } {
  const override = EN_OVERRIDES[id];
  if (override) return override;
  const placeholder = (EN_PLACEHOLDERS as Record<string, { title: string; tagline: string }>)[id];
  if (placeholder) return { title: placeholder.title, tagline: placeholder.tagline };
  return { title: id, tagline: "" };
}

// Decorative SVG harmonic waves echoing the landing backdrop. Rendered as a
// background data URL so the layout flex tree stays clean. Three sine curves
// at low opacity drifting across the canvas.
function harmonicBackdrop(accent: string): string {
  const w = 1200;
  const h = 630;
  const paths: string[] = [];
  const waves = [
    { amp: 70, freq: 2.2, phase: 0.0, y: 200, op: 0.1, stroke: accent },
    { amp: 90, freq: 1.4, phase: 1.1, y: 320, op: 0.07, stroke: palette.signal.cyan },
    { amp: 60, freq: 3.1, phase: 2.4, y: 460, op: 0.08, stroke: accent },
    { amp: 110, freq: 0.9, phase: 0.6, y: 540, op: 0.05, stroke: "#ffffff" },
  ];
  for (const wv of waves) {
    let d = `M 0 ${wv.y}`;
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * w;
      const y = wv.y + Math.sin(t * Math.PI * 2 * wv.freq + wv.phase) * wv.amp;
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    paths.push(
      `<path d="${d}" fill="none" stroke="${wv.stroke}" stroke-opacity="${wv.op}" stroke-width="1.4"/>`,
    );
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${paths.join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const SERIF =
  '"Cormorant Garamond", "Iowan Old Style", "Apple Garamond", Garamond, "Times New Roman", Times, serif';
const MONO = '"JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, "Courier New", monospace';

// --------------------------------------------------------------------- root

export function renderRootOG(): ImageResponse {
  const accent = palette.signal.violet;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: INK,
        backgroundImage: `radial-gradient(ellipse at 50% 38%, ${accent}22 0%, ${INK}00 55%), url("${harmonicBackdrop(accent)}")`,
        backgroundSize: "100% 100%, 100% 100%",
        position: "relative",
        padding: "72px",
        color: TEXT_PRIMARY,
      }}
    >
      {/* Top pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${INK_LINE}`,
          backgroundColor: INK_SOFT,
          padding: "12px 32px",
          borderRadius: 999,
          fontFamily: MONO,
          fontSize: 16,
          letterSpacing: 2.5,
          color: TEXT_MUTED,
          textTransform: "uppercase",
          marginBottom: 48,
          whiteSpace: "nowrap",
        }}
      >
        An atlas of mathematical curiosities
      </div>

      {/* Wordmark */}
      <div
        style={{
          display: "flex",
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 188,
          lineHeight: 1,
          letterSpacing: -2,
          color: TEXT_PRIMARY,
        }}
      >
        Foldscape
      </div>

      {/* Tagline */}
      <div
        style={{
          display: "flex",
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 44,
          marginTop: 28,
          color: TEXT_MUTED,
        }}
      >
        From almost nothing — everything.
      </div>

      {/* Bottom strap */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 44,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: MONO,
          fontSize: 14,
          letterSpacing: 3,
          color: TEXT_FAINT,
          textTransform: "uppercase",
        }}
      >
        github.com/zauberware/foldscape · CC BY 4.0
      </div>
    </div>,
    { ...OG_SIZE },
  );
}

// -------------------------------------------------------------------- topic

export function renderTopicOG(id: TopicId): ImageResponse {
  const topic = getTopic(id);
  const accent = CATEGORY_ACCENT[topic.category];
  const categoryLabel = CATEGORY_LABEL[topic.category];
  const { title, tagline } = getTopicCopy(id);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: INK,
        backgroundImage: `radial-gradient(ellipse at 0% 50%, ${accent}33 0%, ${INK}00 45%), url("${harmonicBackdrop(accent)}")`,
        backgroundSize: "100% 100%, 100% 100%",
        position: "relative",
        padding: "64px 72px",
        color: TEXT_PRIMARY,
      }}
    >
      {/* Left-edge accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: accent,
          opacity: 0.85,
        }}
      />

      {/* Top: category pill + brand */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: `1px solid ${accent}66`,
            backgroundColor: `${accent}14`,
            padding: "10px 26px",
            borderRadius: 999,
            fontFamily: MONO,
            fontSize: 14,
            letterSpacing: 2.2,
            color: accent,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Foldscape · {categoryLabel}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 30,
            color: TEXT_MUTED,
          }}
        >
          Foldscape
        </div>
      </div>

      {/* Title block — vertically centred */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          maxWidth: 980,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: title.length > 28 ? 88 : 108,
            lineHeight: 1.02,
            letterSpacing: -1.5,
            color: TEXT_PRIMARY,
          }}
        >
          {title}
        </div>
        {tagline ? (
          <div
            style={{
              display: "flex",
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 36,
              lineHeight: 1.25,
              marginTop: 28,
              color: TEXT_MUTED,
            }}
          >
            {tagline}
          </div>
        ) : null}
      </div>

      {/* Footer band: formula pill + url */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 16,
        }}
      >
        {topic.formula ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: `1px solid ${INK_LINE}`,
              backgroundColor: INK_SOFT,
              padding: "12px 22px",
              borderRadius: 14,
              fontFamily: MONO,
              fontSize: 22,
              color: TEXT_PRIMARY,
              maxWidth: 820,
            }}
          >
            {topic.formula}
          </div>
        ) : (
          <div style={{ display: "flex" }} />
        )}
        <div
          style={{
            display: "flex",
            fontFamily: MONO,
            fontSize: 14,
            letterSpacing: 3,
            color: TEXT_FAINT,
            textTransform: "uppercase",
          }}
        >
          foldscape.zauberware.com
        </div>
      </div>
    </div>,
    { ...OG_SIZE },
  );
}
