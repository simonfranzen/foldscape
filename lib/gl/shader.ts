import type { EmlNode } from "@/lib/eml/ast";
import { compileToGLSL } from "@/lib/eml/compile";

// Common GLSL prelude: complex arithmetic + curated palettes + domain coloring.
// We use Inigo Quilez's cosine-palette technique to map argument(w) → color
// across hand-tuned ranges instead of the full HSV rainbow. The ring
// contouring is soft-stepped so the visualization reads like stained glass
// rather than a test pattern.

export const PALETTES = [
  { id: "aurora", label: "Aurora", desc: "teal · violet · rose" },
  { id: "twilight", label: "Twilight", desc: "indigo · magenta · amber" },
  { id: "inferno", label: "Inferno", desc: "obsidian · ember · gold" },
  { id: "patina", label: "Patina", desc: "verdigris · cream · rust" },
  { id: "ink", label: "Ink", desc: "monoviolet, low chroma" },
  { id: "spectrum", label: "Spectrum", desc: "full rainbow (classic)" },
];

export type PaletteId = (typeof PALETTES)[number]["id"];

export const PALETTE_INDEX: Record<string, number> = Object.fromEntries(
  PALETTES.map((p, i) => [p.id, i]),
);

export const PRELUDE = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform vec2  uResolution;
uniform vec2  uCenter;
uniform float uScale;        // half-height in complex units
uniform vec2  uParam;        // 'p'
uniform float uTime;
uniform float uMorph;        // 0..1 lerp between A and B (lerp shader only)
uniform float uContours;     // 0..1 — strength of magnitude ring contouring
uniform float uHueShift;     // 0..1 — palette rotation
uniform int   uPalette;      // 0..5 — palette index
uniform float uGridStrength; // 0..1 — overlay grid intensity
uniform float uExposure;     // 0..2 — overall brightness/clamp control

const float PI = 3.14159265358979;
const float TAU = 6.28318530717958;

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}
vec2 cdiv(vec2 a, vec2 b) {
  float d = b.x * b.x + b.y * b.y + 1e-20;
  return vec2(a.x * b.x + a.y * b.y, a.y * b.x - a.x * b.y) / d;
}
vec2 cexp(vec2 a) {
  float e = exp(clamp(a.x, -40.0, 40.0));
  return vec2(e * cos(a.y), e * sin(a.y));
}
vec2 clog(vec2 a) {
  float r2 = a.x * a.x + a.y * a.y + 1e-30;
  return vec2(0.5 * log(r2), atan(a.y, a.x));
}
vec2 ceml(vec2 a, vec2 b) {
  return cexp(a) - clog(b);
}

// IQ cosine palette
vec3 iqPal(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(TAU * (c * t + d));
}

vec3 paletteAurora(float t) {
  // teal → violet → rose
  return iqPal(t,
    vec3(0.42, 0.40, 0.55),
    vec3(0.55, 0.50, 0.55),
    vec3(1.0, 0.85, 0.55),
    vec3(0.65, 0.85, 0.20));
}
vec3 paletteTwilight(float t) {
  // indigo → magenta → amber
  return iqPal(t,
    vec3(0.50, 0.40, 0.55),
    vec3(0.55, 0.50, 0.45),
    vec3(1.0, 1.0, 0.6),
    vec3(0.92, 0.55, 0.18));
}
vec3 paletteInferno(float t) {
  // obsidian → ember → gold
  return iqPal(t,
    vec3(0.42, 0.32, 0.30),
    vec3(0.50, 0.45, 0.40),
    vec3(1.10, 0.65, 0.30),
    vec3(0.05, 0.18, 0.50));
}
vec3 palettePatina(float t) {
  // verdigris → cream → rust
  return iqPal(t,
    vec3(0.55, 0.55, 0.40),
    vec3(0.40, 0.45, 0.35),
    vec3(0.85, 0.90, 0.65),
    vec3(0.20, 0.50, 0.85));
}
vec3 paletteInk(float t) {
  // mono violet
  vec3 base = iqPal(t,
    vec3(0.36, 0.30, 0.48),
    vec3(0.30, 0.25, 0.40),
    vec3(1.0, 1.0, 1.0),
    vec3(0.0, 0.10, 0.20));
  // very low chroma, push to violet
  float gray = dot(base, vec3(0.299, 0.587, 0.114));
  return mix(vec3(gray), base * vec3(0.85, 0.70, 1.20), 0.55);
}
vec3 paletteSpectrum(float t) {
  // classic rainbow via HSV
  vec3 c = vec3(t, 0.95, 1.0);
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 palette(float t) {
  if (uPalette == 0) return paletteAurora(t);
  if (uPalette == 1) return paletteTwilight(t);
  if (uPalette == 2) return paletteInferno(t);
  if (uPalette == 3) return palettePatina(t);
  if (uPalette == 4) return paletteInk(t);
  return paletteSpectrum(t);
}

// Soft sawtooth used for ring brightness — gentler than abs(sin).
float softRings(float x) {
  float f = fract(x);
  return smoothstep(0.0, 0.5, f) * smoothstep(1.0, 0.5, f);
}

vec3 domainColor(vec2 w) {
  float ang = atan(w.y, w.x);
  float hueT = fract(ang / TAU + 0.5 + uHueShift);
  vec3 base = palette(hueT);

  // log-magnitude: doubling rings
  float mag = log(length(w) + 1e-9);
  // soft contour rings (≈0..1)
  float ring = softRings(mag * 0.5);
  ring = mix(0.85, 0.4 + 0.8 * ring, uContours);

  // brightness falloff at extreme magnitudes
  float lit = clamp(0.35 + 0.85 * smoothstep(-14.0, -2.0, mag), 0.0, 1.0);
  lit *= clamp(1.05 - smoothstep(6.0, 16.0, mag), 0.0, 1.0);

  vec3 col = base * ring * lit * uExposure;
  // saturation pull near singularities (brighter toward white at huge mag)
  col = mix(col, vec3(1.0), smoothstep(10.0, 16.0, mag));
  // sink at near-zero magnitudes (toward ink)
  col = mix(vec3(0.04, 0.04, 0.07), col, smoothstep(-16.0, -4.0, mag));
  return col;
}

vec3 grid(vec2 z, vec3 base) {
  if (uGridStrength <= 0.0) return base;
  vec2 g = abs(fract(z + 0.5) - 0.5);
  float w = fwidth(z.x);
  float line = smoothstep(0.0, w * 1.4, min(g.x, g.y));
  return mix(base, vec3(0.85, 0.85, 0.95), (1.0 - line) * 0.08 * uGridStrength);
}
`;

export const VERTEX_SHADER = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export function buildFragmentShader(node: EmlNode): string {
  const { body, ret } = compileToGLSL(node);
  return `${PRELUDE}

vec2 evalA(vec2 z) {
${body || "  // identity"}
  return ${ret};
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec2 z  = uCenter + uv * uScale;
  vec2 w  = evalA(z);
  vec3 col = domainColor(w);
  col = grid(z, col);
  // vignette
  float r = length(uv * vec2(uResolution.x / uResolution.y, 1.0));
  col *= smoothstep(1.7, 0.15, r);
  outColor = vec4(col, 1.0);
}
`;
}

export function buildLerpShader(a: EmlNode, b: EmlNode): string {
  const ca = compileToGLSL(a);
  const cb = compileToGLSL(b);
  const renumber = (body: string, prefix: string) => body.replace(/\bt(\d+)\b/g, `${prefix}$1`);
  const renumberRet = (ret: string, prefix: string) =>
    /^t\d+$/.test(ret) ? `${prefix}${ret.slice(1)}` : ret;
  const aBody = renumber(ca.body, "a");
  const bBody = renumber(cb.body, "b");
  const aRet = renumberRet(ca.ret, "a");
  const bRet = renumberRet(cb.ret, "b");
  return `${PRELUDE}

vec2 evalA(vec2 z) {
${aBody || "  // identity"}
  return ${aRet};
}
vec2 evalB(vec2 z) {
${bBody || "  // identity"}
  return ${bRet};
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec2 z  = uCenter + uv * uScale;
  vec2 wa = evalA(z);
  vec2 wb = evalB(z);
  vec2 w = mix(wa, wb, smoothstep(0.0, 1.0, uMorph));
  vec3 col = domainColor(w);
  col = grid(z, col);
  float r = length(uv * vec2(uResolution.x / uResolution.y, 1.0));
  col *= smoothstep(1.7, 0.15, r);
  outColor = vec4(col, 1.0);
}
`;
}
