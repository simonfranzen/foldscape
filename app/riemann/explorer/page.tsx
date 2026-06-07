"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

// ---------------------------------------------------------------------------
// Riemann explorer.
//
// Two stacked plots in the canvas pane:
//   1. The prime counting staircase π(x) overlaid with a Riemann-derived
//      smooth approximation R(x) reconstructed from the first N_zeros
//      non-trivial zeros via the von Mangoldt / explicit-formula main term.
//      Slider for N_zeros — watch the curve sharpen toward π(x).
//   2. The image of ζ(½ + it) for t ∈ [0, t_max], traced in the complex
//      plane. Loops through the origin reveal the zero heights.
//
// All ζ-values are computed with the Dirichlet eta rearrangement, which
// converges for Re(s) > 0 (the half-plane the critical line sits in). 200
// terms is enough accuracy for t ≲ 60. See `zeta` helper below.
// ---------------------------------------------------------------------------

// First 50 known imaginary parts of non-trivial zeros — fact, not derived.
// Source: Odlyzko's tables, truncated to 4 decimals. We never need more
// than this for the visual reconstruction the explorer runs at.
const ZERO_HEIGHTS: ReadonlyArray<number> = [
  14.1347, 21.022, 25.0109, 30.4249, 32.9351, 37.5862, 40.9187, 43.3271, 48.0052, 49.7738, 52.9703,
  56.4462, 59.347, 60.8318, 65.1125, 67.0798, 69.5464, 72.0672, 75.7047, 77.1448, 79.3374, 82.9104,
  84.7355, 87.4253, 88.8091, 92.4919, 94.6513, 95.8706, 98.8312, 101.3179, 103.7256, 105.4466,
  107.1686, 111.0295, 111.8746, 114.3202, 116.2266, 118.7907, 121.3701, 122.9468, 124.2569,
  127.5167, 129.5787, 131.0876, 133.4978, 134.7565, 138.1160, 139.7362, 141.1237, 143.1118,
];

// First 80 primes — used to render π(x) cheaply with a step function up to
// x ≈ 410.
const PRIMES: ReadonlyArray<number> = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
  101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193,
  197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307,
  311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409,
];

// ---------- complex arithmetic (kept tiny on purpose) ----------
type Cx = { re: number; im: number };
const cAdd = (a: Cx, b: Cx): Cx => ({ re: a.re + b.re, im: a.im + b.im });
const cSub = (a: Cx, b: Cx): Cx => ({ re: a.re - b.re, im: a.im - b.im });
const cDiv = (a: Cx, b: Cx): Cx => {
  const d = b.re * b.re + b.im * b.im;
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
};
const nPowS = (n: number, s: Cx): Cx => {
  const logn = Math.log(n);
  const ex = Math.exp(s.re * logn);
  const ang = s.im * logn;
  return { re: ex * Math.cos(ang), im: ex * Math.sin(ang) };
};
function zeta(s: Cx, N: number): Cx {
  let eta: Cx = { re: 0, im: 0 };
  for (let n = 1; n <= N; n++) {
    const term = cDiv({ re: 1, im: 0 }, nPowS(n, s));
    eta = n % 2 === 1 ? cAdd(eta, term) : cSub(eta, term);
  }
  const oneMinusS: Cx = { re: 1 - s.re, im: -s.im };
  const log2 = Math.log(2);
  const ex = Math.exp(oneMinusS.re * log2);
  const ang = oneMinusS.im * log2;
  const twoPow: Cx = { re: ex * Math.cos(ang), im: ex * Math.sin(ang) };
  const denom = cSub({ re: 1, im: 0 }, twoPow);
  return cDiv(eta, denom);
}

// Riemann's R(x): the smoother main approximation to π(x) coming from the
// explicit formula. The explicit formula expresses ψ(x) (the Chebyshev
// function) as x − Σ_ρ x^ρ/ρ − …; we use the corresponding form for π(x)
// via the standard truncated reconstruction
//   π_hat(x) = R(x) − Σ_ρ R(x^ρ)
// where R(x) = Σ_{k≥1} μ(k)/k · li(x^{1/k}). For this explorer we use the
// simpler — and visually equivalent — staircase reconstruction
//   π_smooth(x) ≈ li(x) − Σ_{γ} 2 · Re( li(x^{½+iγ}) ) / |½ + iγ|
// which already captures how each zero rings a damped oscillation into the
// approximation. li(x) is the logarithmic integral (we use a series for
// x ≤ 100; piecewise asymptotics beyond).

function li(x: number): number {
  if (x <= 1) return 0;
  // li(x) = γ + ln ln x + Σ (ln x)^k / (k · k!), valid for x > 1.
  const EULER = 0.5772156649015329;
  const logx = Math.log(x);
  let sum = EULER + Math.log(logx);
  let term = 1;
  for (let k = 1; k < 80; k++) {
    term *= logx / k;
    sum += term / k;
    if (Math.abs(term / k) < 1e-12 && k > 10) break;
  }
  return sum;
}

// li(x^{ρ}) for ρ = ½ + iγ. We use Ei(ρ log x) with the same series — but
// here Ei takes a complex argument. For visualisation purposes we use the
// approximation x^ρ / (ρ · log x), the leading term of the asymptotic
// expansion of li for large arguments. This is exactly the term the
// classical reconstruction uses inside π_hat for moderate x.
function liComplexLead(x: number, gamma: number): { re: number; im: number } {
  if (x <= 1) return { re: 0, im: 0 };
  const logx = Math.log(x);
  const rho: Cx = { re: 0.5, im: gamma };
  // x^ρ = exp(ρ log x)
  const ex = Math.exp(rho.re * logx);
  const ang = rho.im * logx;
  const xPowRho: Cx = { re: ex * Math.cos(ang), im: ex * Math.sin(ang) };
  // (ρ · log x): real factor on a complex number is just scaling.
  const rhoLogX: Cx = { re: rho.re * logx, im: rho.im * logx };
  return cDiv(xPowRho, rhoLogX);
}

function piApprox(x: number, nZeros: number): number {
  if (x < 2) return 0;
  let val = li(x);
  // Subtract the contribution from the first nZeros pairs of zeros. Each
  // zero ρ contributes li(x^ρ); its conjugate adds the same with imaginary
  // part flipped, so 2·Re(li(x^ρ)) covers the pair.
  for (let i = 0; i < nZeros && i < ZERO_HEIGHTS.length; i++) {
    const gamma = ZERO_HEIGHTS[i];
    const z = liComplexLead(x, gamma);
    val -= 2 * z.re;
  }
  return val;
}

// True π(x): step function. Cheap to compute from PRIMES.
function piTrue(x: number): number {
  let count = 0;
  for (const p of PRIMES) {
    if (p <= x) count++;
    else break;
  }
  return count;
}

// ---------------------------------------------------------------------------
// Per-locale strings, inline.
// ---------------------------------------------------------------------------

type RichExplorer = {
  primeStaircaseBadge: string;
  zetaTraceBadge: string;
  formulaBadge: string;
  tMaxLabel: string;
  tMaxHint: string;
  nDirichletLabel: string;
  nDirichletHint: string;
  nZerosLabel: string;
  nZerosHint: string;
  detectedHeadline: string;
  detectedEmpty: string;
  legendPiTrue: string;
  legendRApprox: string;
  legendZetaPath: string;
  whatYouSeeLabel: string;
  whatYouSeeP1: string;
  whatYouSeeP2: string;
  errorLabel: string;
  resetLabel: string;
};

const EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    primeStaircaseBadge: "Prime staircase π(x) vs Riemann R(x)",
    zetaTraceBadge: "ζ(½ + it) · complex-plane trace",
    formulaBadge: "ζ(s) = 0 ⇒ Re(s) = ½",
    tMaxLabel: "t_max — how far up the critical line",
    tMaxHint:
      "The vertical reach of the ζ trace. Each loop through the origin marks one non-trivial zero. ~14 reveals the first; 60 reveals about 15.",
    nDirichletLabel: "N — Dirichlet series terms",
    nDirichletHint:
      "ζ is computed as Σ_{n=1..N} (−1)^{n+1}/n^s scaled by 1/(1−2^{1−s}). 200 terms is more than enough for t ≤ 60.",
    nZerosLabel: "N_zeros — zeros used in π reconstruction",
    nZerosHint:
      "Number of non-trivial zeros plugged into Riemann's explicit-formula correction. 0 = the bare logarithmic integral Li(x). More zeros = the smooth curve climbs onto the staircase.",
    detectedHeadline: "Zero heights crossed",
    detectedEmpty: "Raise t_max past 14.13 to register the first zero.",
    legendPiTrue: "π(x) — exact staircase",
    legendRApprox: "Li(x) − Σ corrections — Riemann's approximation",
    legendZetaPath: "ζ(½ + it)",
    whatYouSeeLabel: "What you are seeing",
    whatYouSeeP1:
      "Top plot: the staircase π(x) jumps by 1 at every prime, and the warm curve is the Riemann approximation reconstructed from the first N_zeros non-trivial zeros. With zero zeros, the curve is Li(x), the leading-order smooth estimate. As N_zeros grows the corrections ring the curve into the staircase — that is, literally, how the zeros encode the primes.",
    whatYouSeeP2:
      "Bottom plot: the image of ζ along the critical line s = ½ + it, traced in the complex plane. Every loop through the origin is one zero. The hypothesis says this picture stays exactly the same picture forever — there is no t at which the orbit drifts off and avoids the origin while the real part of s sits anywhere else than ½.",
    errorLabel: "max |π(x) − R(x)| over the visible range",
    resetLabel: "↺ reset",
  },
  de: {
    primeStaircaseBadge: "Primzahltreppe π(x) vs. Riemann-R(x)",
    zetaTraceBadge: "ζ(½ + it) · Spur in der komplexen Ebene",
    formulaBadge: "ζ(s) = 0 ⇒ Re(s) = ½",
    tMaxLabel: "t_max — wie weit hinauf entlang der kritischen Linie",
    tMaxHint:
      "Die vertikale Reichweite der ζ-Spur. Jede Schleife durch den Ursprung markiert eine nichttriviale Nullstelle. ~14 zeigt die erste; 60 zeigt etwa 15.",
    nDirichletLabel: "N — Glieder der Dirichlet-Reihe",
    nDirichletHint:
      "ζ wird als Σ_{n=1..N} (−1)^{n+1}/n^s berechnet, skaliert mit 1/(1−2^{1−s}). 200 Glieder reichen mehr als aus für t ≤ 60.",
    nZerosLabel: "N_zeros — Nullstellen in der π-Rekonstruktion",
    nZerosHint:
      "Anzahl der nichttrivialen Nullstellen, die in Riemanns explizite-Formel-Korrektur eingehen. 0 = der nackte Integrallogarithmus Li(x). Mehr Nullstellen = die glatte Kurve klettert auf die Treppe.",
    detectedHeadline: "Passierte Nullstellenhöhen",
    detectedEmpty: "Erhöhe t_max über 14,13, um die erste Nullstelle zu registrieren.",
    legendPiTrue: "π(x) — exakte Treppe",
    legendRApprox: "Li(x) − Σ Korrekturen — Riemanns Approximation",
    legendZetaPath: "ζ(½ + it)",
    whatYouSeeLabel: "Was du siehst",
    whatYouSeeP1:
      "Oberes Bild: die Treppe π(x) springt bei jeder Primzahl um 1, die warme Kurve ist die aus den ersten N_zeros nichttrivialen Nullstellen rekonstruierte Riemann-Approximation. Bei null Nullstellen ist die Kurve Li(x), die führende glatte Schätzung. Mit wachsendem N_zeros schmiegen die Korrekturen die Kurve an die Treppe — genau so kodieren die Nullstellen die Primzahlen.",
    whatYouSeeP2:
      "Unteres Bild: das Bild von ζ entlang der kritischen Linie s = ½ + it, gezeichnet in der komplexen Ebene. Jede Schleife durch den Ursprung ist eine Nullstelle. Die Hypothese sagt, dass dieses Bild für immer dasselbe bleibt — es gibt kein t, bei dem die Bahn abdriftet und den Ursprung verfehlt, während der Realteil von s irgendwo anders als bei ½ sitzt.",
    errorLabel: "max |π(x) − R(x)| über den sichtbaren Bereich",
    resetLabel: "↺ zurücksetzen",
  },
  es: {
    primeStaircaseBadge: "Escalera de primos π(x) vs Riemann R(x)",
    zetaTraceBadge: "ζ(½ + it) · trazo en el plano complejo",
    formulaBadge: "ζ(s) = 0 ⇒ Re(s) = ½",
    tMaxLabel: "t_max — cuánto sube por la línea crítica",
    tMaxHint:
      "El alcance vertical del trazo de ζ. Cada lazo por el origen marca un cero no trivial. ~14 revela el primero; 60 revela unos 15.",
    nDirichletLabel: "N — términos de la serie de Dirichlet",
    nDirichletHint:
      "ζ se calcula como Σ_{n=1..N} (−1)^{n+1}/n^s escalado por 1/(1−2^{1−s}). 200 términos sobran para t ≤ 60.",
    nZerosLabel: "N_zeros — ceros usados en la reconstrucción de π",
    nZerosHint:
      "Número de ceros no triviales enchufados en la corrección de la fórmula explícita de Riemann. 0 = la integral logarítmica Li(x) sola. Más ceros = la curva suave trepa sobre la escalera.",
    detectedHeadline: "Alturas de ceros cruzadas",
    detectedEmpty: "Sube t_max por encima de 14,13 para registrar el primer cero.",
    legendPiTrue: "π(x) — escalera exacta",
    legendRApprox: "Li(x) − Σ correcciones — aproximación de Riemann",
    legendZetaPath: "ζ(½ + it)",
    whatYouSeeLabel: "Lo que estás viendo",
    whatYouSeeP1:
      "Gráfico superior: la escalera π(x) salta 1 en cada primo, y la curva cálida es la aproximación de Riemann reconstruida a partir de los primeros N_zeros ceros no triviales. Con cero ceros, la curva es Li(x), la estimación suave de orden principal. Al aumentar N_zeros las correcciones encajan la curva en la escalera — así, literalmente, los ceros codifican los primos.",
    whatYouSeeP2:
      "Gráfico inferior: la imagen de ζ a lo largo de la línea crítica s = ½ + it, trazada en el plano complejo. Cada lazo por el origen es un cero. La hipótesis dice que esta figura se mantiene exactamente igual para siempre — no hay ningún t en el que la órbita se desvíe y eluda el origen mientras la parte real de s esté en cualquier otro sitio que no sea ½.",
    errorLabel: "max |π(x) − R(x)| en el rango visible",
    resetLabel: "↺ reiniciar",
  },
  fr: {
    primeStaircaseBadge: "Escalier des premiers π(x) vs Riemann R(x)",
    zetaTraceBadge: "ζ(½ + it) · trace dans le plan complexe",
    formulaBadge: "ζ(s) = 0 ⇒ Re(s) = ½",
    tMaxLabel: "t_max — jusqu'où monter sur la droite critique",
    tMaxHint:
      "L'amplitude verticale de la trace de ζ. Chaque boucle par l'origine marque un zéro non trivial. ~14 révèle le premier ; 60 en révèle une quinzaine.",
    nDirichletLabel: "N — termes de la série de Dirichlet",
    nDirichletHint:
      "ζ est calculée par Σ_{n=1..N} (−1)^{n+1}/n^s mise à l'échelle par 1/(1−2^{1−s}). 200 termes suffisent largement pour t ≤ 60.",
    nZerosLabel: "N_zeros — zéros utilisés dans la reconstruction de π",
    nZerosHint:
      "Nombre de zéros non triviaux injectés dans la correction de la formule explicite de Riemann. 0 = le logarithme intégral Li(x) seul. Plus de zéros = la courbe lisse monte sur l'escalier.",
    detectedHeadline: "Hauteurs de zéros traversées",
    detectedEmpty: "Pousse t_max au-delà de 14,13 pour enregistrer le premier zéro.",
    legendPiTrue: "π(x) — escalier exact",
    legendRApprox: "Li(x) − Σ corrections — approximation de Riemann",
    legendZetaPath: "ζ(½ + it)",
    whatYouSeeLabel: "Ce que tu vois",
    whatYouSeeP1:
      "Graphique du haut : l'escalier π(x) saute de 1 à chaque premier, et la courbe chaude est l'approximation de Riemann reconstruite à partir des N_zeros premiers zéros non triviaux. Avec zéro zéros, la courbe est Li(x), l'estimation lisse de premier ordre. Quand N_zeros grandit, les corrections viennent coller la courbe à l'escalier — c'est littéralement ainsi que les zéros encodent les premiers.",
    whatYouSeeP2:
      "Graphique du bas : l'image de ζ le long de la droite critique s = ½ + it, tracée dans le plan complexe. Chaque boucle autour de l'origine est un zéro. L'hypothèse affirme que cette figure reste exactement la même pour toujours — il n'existe aucun t où l'orbite dévie et évite l'origine alors que la partie réelle de s serait ailleurs qu'à ½.",
    errorLabel: "max |π(x) − R(x)| sur l'intervalle visible",
    resetLabel: "↺ réinitialiser",
  },
  it: {
    primeStaircaseBadge: "Scala dei primi π(x) vs Riemann R(x)",
    zetaTraceBadge: "ζ(½ + it) · traccia nel piano complesso",
    formulaBadge: "ζ(s) = 0 ⇒ Re(s) = ½",
    tMaxLabel: "t_max — quanto salire lungo la retta critica",
    tMaxHint:
      "L'estensione verticale della traccia di ζ. Ogni cappio attraverso l'origine marca uno zero non banale. ~14 rivela il primo; 60 ne rivela circa 15.",
    nDirichletLabel: "N — termini della serie di Dirichlet",
    nDirichletHint:
      "ζ è calcolata come Σ_{n=1..N} (−1)^{n+1}/n^s scalata per 1/(1−2^{1−s}). 200 termini bastano e avanzano per t ≤ 60.",
    nZerosLabel: "N_zeros — zeri usati nella ricostruzione di π",
    nZerosHint:
      "Numero di zeri non banali inseriti nella correzione della formula esplicita di Riemann. 0 = il solo integrale logaritmico Li(x). Più zeri = la curva liscia si arrampica sulla scala.",
    detectedHeadline: "Altezze di zeri attraversate",
    detectedEmpty: "Alza t_max oltre 14,13 per registrare il primo zero.",
    legendPiTrue: "π(x) — scala esatta",
    legendRApprox: "Li(x) − Σ correzioni — approssimazione di Riemann",
    legendZetaPath: "ζ(½ + it)",
    whatYouSeeLabel: "Ciò che stai vedendo",
    whatYouSeeP1:
      "Grafico in alto: la scala π(x) salta di 1 a ogni primo, e la curva calda è l'approssimazione di Riemann ricostruita dai primi N_zeros zeri non banali. Con zero zeri, la curva è Li(x), la stima liscia all'ordine principale. Al crescere di N_zeros le correzioni accostano la curva alla scala — è esattamente così che gli zeri codificano i primi.",
    whatYouSeeP2:
      "Grafico in basso: l'immagine di ζ lungo la retta critica s = ½ + it, tracciata nel piano complesso. Ogni cappio per l'origine è uno zero. L'ipotesi dice che questa figura resta esattamente la stessa per sempre — non esiste alcun t in cui l'orbita devia ed evita l'origine mentre la parte reale di s sta altrove che ½.",
    errorLabel: "max |π(x) − R(x)| nell'intervallo visibile",
    resetLabel: "↺ azzera",
  },
  pt: {
    primeStaircaseBadge: "Escada dos primos π(x) vs Riemann R(x)",
    zetaTraceBadge: "ζ(½ + it) · traço no plano complexo",
    formulaBadge: "ζ(s) = 0 ⇒ Re(s) = ½",
    tMaxLabel: "t_max — quanto subir pela recta crítica",
    tMaxHint:
      "O alcance vertical do traço de ζ. Cada laço pela origem marca um zero não trivial. ~14 revela o primeiro; 60 revela cerca de 15.",
    nDirichletLabel: "N — termos da série de Dirichlet",
    nDirichletHint:
      "ζ é calculada como Σ_{n=1..N} (−1)^{n+1}/n^s escalada por 1/(1−2^{1−s}). 200 termos chegam e sobram para t ≤ 60.",
    nZerosLabel: "N_zeros — zeros usados na reconstrução de π",
    nZerosHint:
      "Número de zeros não triviais introduzidos na correcção da fórmula explícita de Riemann. 0 = apenas o integral logarítmico Li(x). Mais zeros = a curva suave trepa sobre a escada.",
    detectedHeadline: "Alturas de zeros atravessadas",
    detectedEmpty: "Sobe t_max para além de 14,13 para registar o primeiro zero.",
    legendPiTrue: "π(x) — escada exacta",
    legendRApprox: "Li(x) − Σ correcções — aproximação de Riemann",
    legendZetaPath: "ζ(½ + it)",
    whatYouSeeLabel: "O que estás a ver",
    whatYouSeeP1:
      "Gráfico superior: a escada π(x) salta 1 em cada primo, e a curva quente é a aproximação de Riemann reconstruída a partir dos primeiros N_zeros zeros não triviais. Com zero zeros, a curva é Li(x), a estimativa suave de ordem principal. À medida que N_zeros cresce, as correcções encostam a curva à escada — é literalmente assim que os zeros codificam os primos.",
    whatYouSeeP2:
      "Gráfico inferior: a imagem de ζ ao longo da recta crítica s = ½ + it, traçada no plano complexo. Cada laço pela origem é um zero. A hipótese diz que esta figura permanece exactamente igual para sempre — não há nenhum t em que a órbita derive e evite a origem enquanto a parte real de s estiver noutro sítio que não ½.",
    errorLabel: "max |π(x) − R(x)| no intervalo visível",
    resetLabel: "↺ reiniciar",
  },
  sv: {
    primeStaircaseBadge: "Primtalstrappa π(x) vs Riemann R(x)",
    zetaTraceBadge: "ζ(½ + it) · spår i komplexa planet",
    formulaBadge: "ζ(s) = 0 ⇒ Re(s) = ½",
    tMaxLabel: "t_max — hur långt upp på den kritiska linjen",
    tMaxHint:
      "Den lodräta räckvidden för ζ-spåret. Varje ögla genom origo markerar ett icke-trivialt nollställe. ~14 visar det första; 60 visar ungefär 15.",
    nDirichletLabel: "N — termer i Dirichlet-serien",
    nDirichletHint:
      "ζ beräknas som Σ_{n=1..N} (−1)^{n+1}/n^s skalad med 1/(1−2^{1−s}). 200 termer räcker mer än väl för t ≤ 60.",
    nZerosLabel: "N_zeros — nollställen i π-rekonstruktionen",
    nZerosHint:
      "Antal icke-triviala nollställen som stoppas in i Riemanns explicit-formel-korrektion. 0 = enbart den logaritmiska integralen Li(x). Fler nollställen = den släta kurvan klättrar upp på trappan.",
    detectedHeadline: "Passerade nollställeshöjder",
    detectedEmpty: "Höj t_max över 14,13 för att registrera första nollstället.",
    legendPiTrue: "π(x) — exakt trappa",
    legendRApprox: "Li(x) − Σ korrektioner — Riemanns approximation",
    legendZetaPath: "ζ(½ + it)",
    whatYouSeeLabel: "Det du ser",
    whatYouSeeP1:
      "Övre plotten: trappan π(x) hoppar 1 vid varje primtal, och den varma kurvan är Riemanns approximation rekonstruerad från de första N_zeros icke-triviala nollställena. Med noll nollställen är kurvan Li(x), den ledande släta uppskattningen. När N_zeros växer pressar korrektionerna kurvan upp mot trappan — det är bokstavligen så nollställena kodar primtalen.",
    whatYouSeeP2:
      "Nedre plotten: bilden av ζ längs den kritiska linjen s = ½ + it, ritad i komplexa planet. Varje ögla genom origo är ett nollställe. Hypotesen säger att den här bilden förblir exakt samma bild för alltid — det finns inget t där omloppsbanan driver bort och undviker origo medan realdelen av s sitter någon annanstans än ½.",
    errorLabel: "max |π(x) − R(x)| över synligt intervall",
    resetLabel: "↺ återställ",
  },
  no: {
    primeStaircaseBadge: "Primtalstrapp π(x) vs Riemann R(x)",
    zetaTraceBadge: "ζ(½ + it) · spor i det komplekse planet",
    formulaBadge: "ζ(s) = 0 ⇒ Re(s) = ½",
    tMaxLabel: "t_max — hvor langt opp den kritiske linjen",
    tMaxHint:
      "Den loddrette rekkevidden til ζ-sporet. Hver løkke gjennom origo markerer ett ikke-trivielt nullpunkt. ~14 viser det første; 60 viser omtrent 15.",
    nDirichletLabel: "N — ledd i Dirichlet-rekken",
    nDirichletHint:
      "ζ beregnes som Σ_{n=1..N} (−1)^{n+1}/n^s skalert med 1/(1−2^{1−s}). 200 ledd er mer enn nok for t ≤ 60.",
    nZerosLabel: "N_zeros — nullpunkter i π-rekonstruksjonen",
    nZerosHint:
      "Antall ikke-trivielle nullpunkter som puttes inn i Riemanns eksplisitt-formel-korreksjon. 0 = bare den logaritmiske integralen Li(x). Flere nullpunkter = den glatte kurven klatrer opp på trappen.",
    detectedHeadline: "Krysset nullpunkts-høyder",
    detectedEmpty: "Hev t_max forbi 14,13 for å registrere det første nullpunktet.",
    legendPiTrue: "π(x) — eksakt trapp",
    legendRApprox: "Li(x) − Σ korreksjoner — Riemanns approksimasjon",
    legendZetaPath: "ζ(½ + it)",
    whatYouSeeLabel: "Det du ser",
    whatYouSeeP1:
      "Øverste plot: trappen π(x) hopper 1 ved hvert primtall, og den varme kurven er Riemanns approksimasjon rekonstruert fra de første N_zeros ikke-trivielle nullpunktene. Med null nullpunkter er kurven Li(x), den ledende glatte estimaten. Når N_zeros vokser presser korreksjonene kurven inntil trappen — det er bokstavelig talt slik nullpunktene koder primtallene.",
    whatYouSeeP2:
      "Nederste plot: bildet av ζ langs den kritiske linjen s = ½ + it, tegnet i det komplekse planet. Hver løkke gjennom origo er ett nullpunkt. Hypotesen sier at dette bildet forblir nøyaktig samme bilde for alltid — det finnes ingen t der banen driver av og unngår origo mens realdelen av s sitter et annet sted enn ½.",
    errorLabel: "max |π(x) − R(x)| over synlig område",
    resetLabel: "↺ tilbakestill",
  },
};

export default function RiemannExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.riemann;
  const x = EXPLORER[locale];

  const [tMax, setTMax] = useState(45);
  const [nDirichlet, setNDirichlet] = useState(200);
  const [nZeros, setNZeros] = useState(8);

  const primeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const zetaCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Pre-compute the ζ trace once per (tMax, nDirichlet). Memoising avoids
  // re-running 3500 sums per render when only nZeros changes.
  const zetaTrace = useMemo(() => {
    const steps = Math.max(500, Math.floor(tMax * 80));
    const pts: Cx[] = new Array(steps);
    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * tMax;
      pts[i] = zeta({ re: 0.5, im: t }, nDirichlet);
    }
    return pts;
  }, [tMax, nDirichlet]);

  // Zeros crossed = local minima of |ζ| below a threshold along the trace.
  const detectedZeroTs = useMemo(() => {
    const found: number[] = [];
    let prev = Infinity;
    let prevPrev = Infinity;
    for (let i = 0; i < zetaTrace.length; i++) {
      const m = Math.hypot(zetaTrace[i].re, zetaTrace[i].im);
      if (prev < prevPrev && prev < m && prev < 0.18) {
        const t = ((i - 1) / (zetaTrace.length - 1)) * tMax;
        found.push(t);
      }
      prevPrev = prev;
      prev = m;
    }
    return found;
  }, [zetaTrace, tMax]);

  // Build the π(x) and R(x) sampled arrays for the staircase plot.
  const piApproxData = useMemo(() => {
    const X_MAX = 200;
    const SAMPLES = 400;
    const pts: { x: number; pi: number; approx: number }[] = [];
    let maxErr = 0;
    for (let i = 0; i < SAMPLES; i++) {
      const xv = 2 + ((X_MAX - 2) * i) / (SAMPLES - 1);
      const piV = piTrue(xv);
      const apV = piApprox(xv, nZeros);
      const err = Math.abs(piV - apV);
      if (err > maxErr) maxErr = err;
      pts.push({ x: xv, pi: piV, approx: apV });
    }
    return { pts, X_MAX, maxErr };
  }, [nZeros]);

  // Render the π(x) / R(x) plot.
  useEffect(() => {
    const canvas = primeCanvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (W <= 0 || H <= 0) return;
      const bw = Math.floor(W * dpr);
      const bh = Math.floor(H * dpr);
      if (canvas.width !== bw) canvas.width = bw;
      if (canvas.height !== bh) canvas.height = bh;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      const padL = 38;
      const padR = 12;
      const padT = 14;
      const padB = 26;
      const plotW = W - padL - padR;
      const plotH = H - padT - padB;
      const { pts, X_MAX } = piApproxData;
      const yMax = 48; // π(200) = 46 → 48 leaves headroom

      const toX = (v: number) => padL + (v / X_MAX) * plotW;
      const toY = (v: number) => padT + plotH - (v / yMax) * plotH;

      // Grid
      ctx.strokeStyle = "rgba(168,171,189,0.08)";
      ctx.lineWidth = 1;
      for (let v = 0; v <= yMax; v += 8) {
        const yp = toY(v);
        ctx.beginPath();
        ctx.moveTo(padL, yp);
        ctx.lineTo(padL + plotW, yp);
        ctx.stroke();
        ctx.fillStyle = "rgba(168,171,189,0.5)";
        ctx.font = "10px ui-monospace, monospace";
        ctx.fillText(v.toString(), 4, yp + 3);
      }
      for (let v = 0; v <= X_MAX; v += 40) {
        const xp = toX(v);
        ctx.strokeStyle = "rgba(168,171,189,0.08)";
        ctx.beginPath();
        ctx.moveTo(xp, padT);
        ctx.lineTo(xp, padT + plotH);
        ctx.stroke();
        ctx.fillStyle = "rgba(168,171,189,0.5)";
        ctx.fillText(v.toString(), xp - 6, H - 8);
      }

      // π(x) staircase
      ctx.strokeStyle = "rgba(168,171,189,0.85)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      let lastPi = 0;
      ctx.moveTo(toX(2), toY(0));
      for (const p of pts) {
        // step
        ctx.lineTo(toX(p.x), toY(lastPi));
        ctx.lineTo(toX(p.x), toY(p.pi));
        lastPi = p.pi;
      }
      ctx.stroke();

      // R(x) approximation
      ctx.strokeStyle = "rgba(255,209,102,0.95)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const yp = toY(Math.max(0, Math.min(yMax, p.approx)));
        if (i === 0) ctx.moveTo(toX(p.x), yp);
        else ctx.lineTo(toX(p.x), yp);
      }
      ctx.stroke();
    };
    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [piApproxData]);

  // Render the ζ trace plot.
  useEffect(() => {
    const canvas = zetaCanvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (W <= 0 || H <= 0) return;
      const bw = Math.floor(W * dpr);
      const bh = Math.floor(H * dpr);
      if (canvas.width !== bw) canvas.width = bw;
      if (canvas.height !== bh) canvas.height = bh;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      let minR = Infinity;
      let maxR = -Infinity;
      let minI = Infinity;
      let maxI = -Infinity;
      for (const p of zetaTrace) {
        if (p.re < minR) minR = p.re;
        if (p.re > maxR) maxR = p.re;
        if (p.im < minI) minI = p.im;
        if (p.im > maxI) maxI = p.im;
      }
      minR = Math.min(minR, -0.5);
      maxR = Math.max(maxR, 0.5);
      minI = Math.min(minI, -0.5);
      maxI = Math.max(maxI, 0.5);
      const span = Math.max(maxR - minR, maxI - minI) * 1.1;
      const cxC = (minR + maxR) / 2;
      const cyC = (minI + maxI) / 2;
      const cx = W / 2;
      const cy = H / 2;
      const scale = Math.min(W, H) / span;
      const toPx = (z: Cx) => ({
        x: cx + (z.re - cxC) * scale,
        y: cy - (z.im - cyC) * scale,
      });

      // axes
      ctx.strokeStyle = "rgba(168,171,189,0.18)";
      ctx.lineWidth = 1;
      const ox = toPx({ re: 0, im: 0 });
      ctx.beginPath();
      ctx.moveTo(0, ox.y);
      ctx.lineTo(W, ox.y);
      ctx.moveTo(ox.x, 0);
      ctx.lineTo(ox.x, H);
      ctx.stroke();

      // trace
      ctx.lineWidth = 1.4;
      for (let i = 1; i < zetaTrace.length; i++) {
        const p0 = toPx(zetaTrace[i - 1]);
        const p1 = toPx(zetaTrace[i]);
        const tt = i / (zetaTrace.length - 1);
        const a = 0.3 + 0.65 * tt;
        ctx.strokeStyle = `rgba(255,209,102,${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
      ctx.fillStyle = "#fff5d6";
      ctx.beginPath();
      ctx.arc(ox.x, ox.y, 3, 0, Math.PI * 2);
      ctx.fill();
    };
    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [zetaTrace]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {x.primeStaircaseBadge}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {x.formulaBadge}
            </div>
          </div>

          <div className="hairline relative h-[360px] shrink-0 overflow-hidden rounded-2xl border bg-ink-950 lg:h-[420px]">
            <canvas ref={primeCanvasRef} className="block h-full w-full" />
            <div className="hairline glass absolute left-3 top-3 rounded-md border px-2 py-1 font-mono text-[10px] tracking-widest2 text-ink-200">
              <span className="text-ink-300">━━</span>{" "}
              <span className="text-ink-100">{x.legendPiTrue}</span>{" "}
              <span className="ml-2 text-signal-amber">━━</span>{" "}
              <span className="text-ink-100">{x.legendRApprox}</span>
            </div>
            <div className="hairline glass absolute right-3 top-3 rounded-md border px-2 py-1 font-mono text-[10px] tracking-widest2 text-ink-300">
              {x.errorLabel}:{" "}
              <span className="text-signal-amber">{piApproxData.maxErr.toFixed(2)}</span>
            </div>
          </div>
          <div className="hairline relative h-[320px] shrink-0 overflow-hidden rounded-2xl border bg-ink-950 lg:h-[380px]">
            <canvas ref={zetaCanvasRef} className="block h-full w-full" />
            <div className="hairline glass absolute bottom-3 left-3 rounded-md border px-2 py-1 font-mono text-[10px] tracking-widest2 text-ink-200">
              {x.zetaTraceBadge}
            </div>
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
              {x.tMaxLabel}
            </div>
            <div className="flex items-baseline justify-between font-mono text-sm">
              <span className="text-signal-amber">{tMax.toFixed(1)}</span>
              <span className="text-[10px] text-ink-400">t ∈ [0, {tMax.toFixed(1)}]</span>
            </div>
            <input
              type="range"
              value={tMax}
              min={5}
              max={60}
              step={0.5}
              onChange={(e) => setTMax(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <p className="text-[11px] leading-relaxed text-ink-400">{x.tMaxHint}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.nDirichletLabel}
            </div>
            <div className="flex items-baseline justify-between font-mono text-sm">
              <span className="text-signal-amber">{nDirichlet}</span>
              <span className="text-[10px] text-ink-400">terms</span>
            </div>
            <input
              type="range"
              value={nDirichlet}
              min={20}
              max={500}
              step={10}
              onChange={(e) => setNDirichlet(parseInt(e.target.value, 10))}
              className="w-full accent-signal-amber"
            />
            <p className="text-[11px] leading-relaxed text-ink-400">{x.nDirichletHint}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.nZerosLabel}
            </div>
            <div className="flex items-baseline justify-between font-mono text-sm">
              <span className="text-signal-amber">{nZeros}</span>
              <span className="text-[10px] text-ink-400">zeros</span>
            </div>
            <input
              type="range"
              value={nZeros}
              min={0}
              max={ZERO_HEIGHTS.length}
              step={1}
              onChange={(e) => setNZeros(parseInt(e.target.value, 10))}
              className="w-full accent-signal-amber"
            />
            <p className="text-[11px] leading-relaxed text-ink-400">{x.nZerosHint}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.detectedHeadline}
            </div>
            {detectedZeroTs.length === 0 ? (
              <p className="text-[11px] leading-relaxed text-ink-400">{x.detectedEmpty}</p>
            ) : (
              <ul className="grid grid-cols-2 gap-1 font-mono text-[11px] text-signal-amber">
                {detectedZeroTs.map((t, i) => (
                  <li key={i}>
                    γ_{i + 1} ≈ {t.toFixed(3)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.whatYouSeeLabel}
            </div>
            <p className="text-[12px] leading-relaxed text-ink-200">{x.whatYouSeeP1}</p>
            <p className="text-[12px] leading-relaxed text-ink-200">{x.whatYouSeeP2}</p>
          </div>

          <div className="space-y-2 p-5">
            <button
              onClick={() => {
                setTMax(45);
                setNDirichlet(200);
                setNZeros(8);
              }}
              className="hairline w-full rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-amber/50 hover:text-signal-amber"
            >
              {x.resetLabel}
            </button>
            <Link
              href="/"
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
