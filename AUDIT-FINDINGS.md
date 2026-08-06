# Foldscape Audit — bestätigte Findings

Multi-Agent-Review über 35/48 Topics + Basis-Layer. Jedes High/Medium wurde von einem zweiten Agenten adversarial gegengeprüft; nur bestätigte Findings sind hier.

**Summe:** 76 HIGH · 260 MEDIUM · 144 LOW (adversarial gegengeprüft) plus 13 unbestätigte High/Medium aus Topics, deren Verifier am Limit abbrach (unten mit ⚠️ UNVERIFIED markiert).

## Gar nicht reviewt (Session-/Usage-Limits)

Topics ohne jeden Review: `pvsnp, mobius, eulerchar, konigsberg, fourcolor, smallworld, backprop, diffusion, riemann`
Cross-Cutting-Sweeps ohne Review: Landing/Constellation, i18n-Bundles, Shared-Components (Formula/speakLatex, Signature-Heroes), Layout/A11y/globals.css.
Teilreviewt (gefunden, aber nicht gegengeprüft): `godel, halting, magpendulum, rsa` — siehe ⚠️ UNVERIFIED-Einträge.

## Übersicht pro Topic

| Topic | HIGH | MED | LOW |
|---|---|---|---|
| aizawa | 5 | 9 | 2 |
| apollonian | 4 | 5 | 4 |
| banach | 3 | 9 | 6 |
| boids | 1 | 8 | 5 |
| buffon | 2 | 9 | 5 |
| bzr | 1 | 4 | 4 |
| cantor | 2 | 6 | 6 |
| cardioid | 5 | 3 |  |
| chaosgame | 3 | 8 | 4 |
| collatz | 3 | 9 | 3 |
| dla | 1 | 11 | 2 |
| doublependulum | 6 | 15 | 3 |
| euler |  | 10 | 6 |
| fourier | 5 | 6 | 2 |
| gabrielshorn |  | 12 | 4 |
| galton |  | 10 | 4 |
| godel | 1 |  | 3 |
| halting | 1 | 4 | 3 |
| hilberthotel | 2 | 7 | 5 |
| iota | 1 | 4 | 3 |
| langton |  | 12 | 4 |
| life | 1 | 5 | 2 |
| logistic | 1 | 7 | 5 |
| lorenz | 3 | 7 | 5 |
| lsystem | 4 | 5 | 6 |
| magpendulum |  | 5 | 3 |
| mandelbrot | 2 | 4 | 2 |
| nand |  | 4 | 4 |
| pascalmod | 3 | 4 | 5 |
| penrose | 4 | 9 | 3 |
| phi | 1 | 7 | 7 |
| rsa |  | 2 | 2 |
| rule110 | 1 | 8 | 5 |
| sat | 1 | 3 | 3 |
| sierpinski | 2 | 9 | 5 |
| sternbrocot | 3 | 7 | 1 |
| turingpattern |  | 6 | 4 |
| ulam | 4 | 4 |  |
| wang | 2 | 14 | 4 |

---

# Findings nach Topic

## aizawa

### 🔴 HIGH · content · `app/aizawa/page.tsx:55`
**Wrong first name: the Aizawa attractor is attributed to Yoji Aizawa, not "Yoshisuke Aizawa"**

All 8 locales of RICH_STORY (EN line 55, DE line 128, ES 201, FR 274, IT 347, PT 420, SV 493, NO 566) credit "Yoshisuke Aizawa". The system is attributed to the Waseda University physicist Yoji Aizawa (standard citation: Aizawa, Y., 1982, Prog. Theor. Phys.). "Yoshisuke" appears to be a conflation with Yoshisuke Ueda, discoverer of the unrelated Ueda attractor. The wrong name is presented as fact in the prominent "01 · The big idea" card in every language.

_Fix:_ Replace "Yoshisuke Aizawa" with "Yoji Aizawa" in all 8 locale entries of RICH_STORY.

### 🔴 HIGH · math · `app/aizawa/explorer/page.tsx:196`
**Euler integration diverges to NaN within slider bounds with no finite-state guard; canvas silently goes blank**

The loop `[x, y, z] = attractor.step1(...)` has no isFinite check. Recomputation confirms divergence inside the exposed slider ranges: Halvorsen with its DEFAULT a=1.4 blows up to NaN after 119 Euler steps at dt=0.02, which is exactly its dtMax (line 103), i.e. well within the first frame at the default 2400 steps/frame; Rössler with a=0.5, c=10, dt=0.05 (all in-range: lines 61-67) hits NaN at step 625. Once NaN, every subsequent step stays NaN, the trail fades to black, and "Reset parameters" does not recover because x,y,z live in the effect closure and only reset via resetTick ("Clear & restart"). Users just see the attractor vanish permanently after dragging dt or a param.

_Fix:_ After the step, guard `if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) { x = 0.1; y = 0; z = 0; }` (and/or clamp magnitude), and lower Halvorsen's dtMax to a stable range (~0.008; default step is 0.005 and 0.02 diverges even at default a).

### 🔴 HIGH · code · `app/aizawa/explorer/page.tsx:196`
**No divergence/NaN guard: Halvorsen at its default parameter blows up to NaN within one frame at reachable dt, permanently blanking the canvas**

The render loop calls attractor.step1 (forward Euler) with no isFinite check or state clamp. Verified by simulation: Halvorsen with its DEFAULT a=1.4 and dt at the slider max 0.02 (dtMax, line 103) hits Infinity/NaN at step 119, i.e. mid-way through the first frame (default 2400 steps/frame). Also diverges at a=0.5 with dt=0.01, and Roessler diverges at a=0.5, c=10, dt=0.05 (all reachable slider values). Once x/y/z are NaN, fillRect with NaN coordinates silently no-ops forever: the trail fades to black and nothing is ever drawn again until the user guesses 'Clear & restart' (which immediately re-diverges if dt stays high). CLAUDE.md explicitly requires clamping numerical state against NaN cascades (see TuringGrayScott.tsx).

_Fix:_ After each step1 call (or once per frame) check Number.isFinite(x+y+z); on failure reset [x,y,z] to [0.1,0,0] (optionally also nudge dt down or clamp the state norm), so the orbit re-seeds instead of dying silently.

### 🔴 HIGH · content · `app/aizawa/page.tsx:105`
**Closing copy in all 8 locales promises a Lorenz-84 mode that the explorer does not have**

closingBody says 'Switch between Aizawa, Roessler, Thomas, Halvorsen and Lorenz-84 to feel the whole family' (EN line 105; same claim in de 178, es 251, fr 324, it 397, pt 470, sv 543, no 616). The explorer's ATTRACTORS record (app/aizawa/explorer/page.tsx lines 30-114) contains only aizawa, rossler, thomas, halvorsen: there is no Lorenz-84 entry, so users are sent to look for a mode that does not exist.

_Fix:_ Either drop 'Lorenz-84' from closingBody in all 8 locales, or add a lorenz84 entry to ATTRACTORS (dx=-y^2-z^2-ax+aF, dy=xy-bxz-y+G, dz=bxy+xz-z).

### 🔴 HIGH · math · `app/aizawa/page.tsx:75`
**Story lists x·y as a cross-term of the Aizawa equations, but no xy product exists in the system**

Section one in all 8 locales says 'The cross-terms (x·y, x²+y², z³, z·x³) are where the chaos lives' (EN 75, de 148, es 221, fr 294, it 367, pt 440, sv 513, no 586). Expanding the RHS of the equations shown on the same page: dx/dt=(z-b)x-dy gives terms zx, -bx, -dy; dy/dt=dx+(z-b)y gives dx, zy, -by; dz/dt=c+az-z³/3-(x²+y²)(1+ez)+fzx³ gives c, az, -z³/3, -x², -y², -ezx², -ezy², fzx³. There is no x·y term anywhere; the missing nonlinearities are z·x and z·y. (Secondary: 'strip them and the system collapses to a damped spiral' is also wrong for z, since the stripped system leaves dz/dt=c+az with a=0.95>0, which diverges exponentially.)

_Fix:_ Replace x·y with z·x, z·y in the cross-term list in all 8 locales (and soften the 'damped spiral' claim to refer to the x,y plane).

### 🟠 MED · content · `app/aizawa/page.tsx:105`
**Story promises a Lorenz-84 mode in the Explorer, but the explorer has no Lorenz-84 attractor**

closingBody in all 8 locales says "Switch between Aizawa, Rössler, Thomas, Halvorsen and Lorenz-84" (EN line 105, DE 178, ES 251, FR 324, IT 397, PT 470, SV 543, NO 616). The explorer's ATTRACTORS record (app/aizawa/explorer/page.tsx lines 30-114) contains only aizawa, rossler, thomas, halvorsen. Users following the CTA cannot find the advertised fifth system.

_Fix:_ Either add a lorenz84 entry to ATTRACTORS (dx = -y² - z² - a(x-F), dy = xy - bxz - y + G, dz = bxy + xz - z) or remove Lorenz-84 from closingBody in all 8 locales.

### 🟠 MED · i18n · `app/aizawa/page.tsx:173`
**German copy not gender-neutral: "Regelungstheoretiker"**

DE section six body reads "Regelungstheoretiker nutzen solche Systeme als Maßstäbe...". Repo convention (CLAUDE.md) mandates gender-neutral German (Studierende, Mathematiker:innen); the same sentence elsewhere in the DE story correctly uses "Kolleg:innen" (line 128), so this is an inconsistency as well.

_Fix:_ Change to "Regelungstheoretiker:innen nutzen solche Systeme...".

### 🟠 MED · animation · `components/AizawaInlineMini.tsx:128`
**No prefers-reduced-motion handling in AizawaInlineMini or the explorer canvas**

Both canvases run an unconditional requestAnimationFrame loop with continuous auto-rotation (AizawaInlineMini.tsx lines 128-131; app/aizawa/explorer/page.tsx lines 175-212). Neither checks matchMedia("(prefers-reduced-motion: reduce)") nor offers a static fallback, unlike sibling components (TopicConstellation, all signature heroes, BackpropMiniNet all check it), and CLAUDE.md states per-component canvases must check the media query and freeze.

_Fix:_ Query prefers-reduced-motion (and subscribe to changes): render one static full-orbit frame and skip auto-rotate/head animation in the mini; in the explorer, pre-integrate and draw a static point cloud instead of the live loop.

### 🟠 MED · i18n · `app/aizawa/page.tsx:791`
**Hardcoded English prose in JSX shown to all 8 locales on an otherwise fully localized page**

Despite RICH_STORY covering all 8 locales, several user-facing prose strings are English literals rendered regardless of locale: the big "just over 2" dimension headline (line 791) and its explanatory paragraph "Just above a surface, well below a solid..." (lines 792-795), "Same three equations, same five other dials..." (lines 747-750), the schematic caption "A schematic of the canonical shape..." (lines 720-723), the zoo shape labels "butterfly", "band + spiral" etc. (lines 761-766), DimDot labels "curve"/"solid" (lines 797-799), and the closing pretitle "Open the Explorer" (line 814). A German or Swedish reader sees full English sentences mid-story.

_Fix:_ Move these strings into the RichStory type (e.g. dimHeadline, dimBody, sweepNote, schematicCaption, zooShapes, dimLabels) and fill them per locale like the rest of RICH_STORY.

### 🟠 MED · a11y · `app/aizawa/explorer/page.tsx:383`
**Sliders have no accessible names and the explorer canvas is unlabeled and mouse-only**

ParamSlider and SliderRow render the label as a plain div next to an <input type="range"> with no htmlFor/id association and no aria-label (lines 380-391, 416-426); screen readers announce six anonymous sliders. Same for the b slider in AizawaInlineMini (lines 174-181) and both canvases, which have no role/aria-label (explorer line 230, mini line 162). Additionally, explorer rotation binds only mousedown/mousemove (lines 171-173), so on touch devices the advertised "drag to rotate" (line 236) does nothing, while the mini correctly uses pointer events.

_Fix:_ Add aria-label={label} to the range inputs (or wrap in <label>), add role="img" plus a descriptive aria-label to both canvases, and switch the explorer drag handlers to pointer events with touch-none like AizawaInlineMini.

### 🟠 MED · content · `app/aizawa/page.tsx:55`
**Attribution to 'Yoshisuke Aizawa' uses a wrong given name; the attractor is named after Yoji Aizawa**

All 8 locales credit 'Yoshisuke Aizawa and collaborators' (EN 55, de 128, es 201, fr 274, it 347, pt 420, sv 493, no 566). The chaos researcher the attractor is named after is Yoji Aizawa (Waseda University; Aizawa & Uezu 1982, Prog. Theor. Phys.); 'Yoshisuke' is not an attested name in the literature. The equations themselves are also known in the literature as Langford's equation, which would be worth a parenthetical, but the concrete defect is the invented first name.

_Fix:_ Change 'Yoshisuke Aizawa' to 'Yoji Aizawa' in all 8 locales (optionally note the system is also known as the Langford equation).

### 🟠 MED · animation · `app/aizawa/explorer/page.tsx:175`
**Neither the explorer canvas nor AizawaInlineMini respects prefers-reduced-motion**

The explorer loop (lines 175-212) auto-rotates and animates a trail unconditionally, and components/AizawaInlineMini.tsx (draw loop lines 69-131, auto-yaw line 128) does the same; grep confirms no matchMedia/prefers-reduced-motion in either file. The repo convention (CLAUDE.md: 'Per-component canvases also check the media query and freeze') is followed by siblings, e.g. app/diffusion/explorer/page.tsx, components/Reveal.tsx, components/NoiseLadder.tsx, components/BackpropMiniNet.tsx.

_Fix:_ Check window.matchMedia('(prefers-reduced-motion: reduce)') in both components: draw one static pre-integrated frame, disable auto-rotate/head animation, and only animate on explicit drag.

### 🟠 MED · a11y · `app/aizawa/explorer/page.tsx:230`
**Canvases have no accessible name and all range sliders are unlabeled; explorer rotation is mouse-only so touch users cannot rotate**

The explorer canvas (lines 230-233) and the mini canvas (components/AizawaInlineMini.tsx lines 162-169) have no role/aria-label (contrast TorusSpikeSVG in app/aizawa/page.tsx which sets role=img plus aria-label). Every <input type=range> renders its label in a sibling div with no htmlFor/aria-label association: ParamSlider (383-391), SliderRow (419-426), and the mini's b slider (174-182), so screen readers announce nameless sliders. Additionally the explorer registers only mousedown/mousemove/mouseup (lines 156-173) while the overlay claims 'drag to rotate' (line 236): on touch devices rotation is impossible, even though the story-page mini already uses pointer events with touch-none.

_Fix:_ Add role='img' plus a descriptive aria-label to both canvases, wire slider labels via aria-label={label} (or <label htmlFor>), and switch the explorer drag handlers to pointer events with touch-action: none.

### 🟠 MED · i18n · `app/aizawa/explorer/page.tsx:255`
**Hardcoded English UI strings shown to all 8 locales in the explorer sidebar and the story-page infographic labels**

The explorer localizes the intro (a.topics.aizawa) and u.back but hardcodes 'Attractor' (255), 'Parameters' (281), 'Reset parameters' (316), 'Steps / frame' (322), 'Auto-rotate on/off' (338), 'Clear & restart' (344), 'drag to rotate' (236) and 'steps/frame' (239). The otherwise fully-localized story page (app/aizawa/page.tsx) likewise hardcodes 'Basket-handled torus · vertical spike' (717), the schematic caption (720-723), 'Same three equations, same five other dials…' (747-750), 'Kaplan-Yorke dimension' (789), 'just over 2' (791), the dimension explainer (792-795), 'curve/solid' DimDot labels (797-799), and the closing pretitle 'Open the Explorer' (813-815). A German or Swedish reader gets a mixed-language page although RICH_STORY covers all 8 locales.

_Fix:_ Extend RichStory (and add a small RICH_EXPLORER Record<Locale,...> in the explorer, the established repo pattern) with keys for these captions and control labels.

### 🟡 LOW · visual · `app/aizawa/explorer/page.tsx:179`
**Trail-fade color mismatches palette.canvas.bg and dot color duplicates palette.signal.rose as literals**

The resize fill uses palette.canvas.bg = #06070d = rgb(6,7,13) (line 144), but the per-frame fade uses `rgba(5, 6, 10, ...)` (line 179), so trails fade toward a slightly different black than the background. The dot color `rgba(255, 122, 182, ...)` (lines 192, 206) is palette.signal.rose (#ff7ab6) hardcoded, despite the palette import; the recent refactor sweep (commits d3b/2bf) replaced exactly this kind of literal elsewhere.

_Fix:_ Derive the fade rgba from palette.canvas.bg and build the dot rgba from palette.signal.rose (e.g. a small hexToRgba helper), matching the palette-token convention.

### 🟡 LOW · i18n · `app/aizawa/page.tsx:173`
**German copy is not gender-neutral: 'Regelungstheoretiker'**

de section six reads 'Regelungstheoretiker nutzen solche Systeme…' (line 173). Repo convention (CLAUDE.md) mandates gender-neutral German (Studierende, Mathematiker:innen); the same file gets it right elsewhere ('Kolleg:innen', line 128).

_Fix:_ Change to 'Regelungstheoretiker:innen nutzen solche Systeme…'.


## apollonian

### 🔴 HIGH · math · `app/apollonian/explorer/page.tsx:146`
**placeSeed pairs the wrong complex-sqrt sign with kMinus, so the fourth seed circle is not tangent for 3 of 5 presets and the whole rendered gasket is geometrically wrong**

descartesFourthZ hard-pairs zPlus=(linear+sq)/kPlus with kPlus and zMinus=(linear-sq)/kMinus with kMinus, but in the complex Descartes theorem the center-equation sign is independent of the curvature-equation sign. Recomputation (ported the exact code to node): for seed (-3,5,8,8) the target k3=8 matches kMinus, and the code's zMinus gives center (0.000,0.375); after the im-flip heuristic on line 154-156 it becomes (0.000,-0.375), which has max tangency error 0.1667 against the other three circles (outer radius is only 0.333). The correct center is (linear+sq)/kMinus = (0.167,-0.125), tangency error 0.000000. Same failure for (-4,8,9,9): code places c3 at (-0.139,-0.333), error 0.222 (correct: (0.083,-0.111)); and (-6,11,14,15): error 0.089 (correct: (0.060,-0.080)). Since every subsequent circle is generated by reflecting through quadruples containing c3, the entire packing drawn for these presets has overlapping, non-tangent circles. Only (-1,2,2,3) and (-2,3,6,7) survive because c2 happens to land on the x-axis there. The identical code is duplicated in components/ApollonianGasket.tsx lines 99-107, so the story-page demo shows the same broken gaskets for its (-3,5,8,8) and (-6,11,14,15) presets.

_Fix:_ After matching the target curvature, compute both candidate centers (linear+sq)/k and (linear-sq)/k and keep the one whose distances to the three parent circles best satisfy tangency (|d - (r_i + r)| resp. |d - |r_i - r|| minimal); delete the sign-flip heuristic on lines 154-156. Apply the same fix in components/ApollonianGasket.tsx.

### 🔴 HIGH · content · `app/apollonian/page.tsx:1130`
**Integer-seed table rows 2-5 list curvatures that never occur in those packings**

Brute-forced each packing by exhaustive quadruple reflection (k' = 2(a+b+c) - d) up to curvature 60. Actual curvature sets: (-2,3,6,7) -> 3,6,7,10,15,19,22,27,31,34,39,42,43,54,55,58 but the table claims '7, 10, 15, 19, 22, 27, 34, 35' (35 never occurs; 31 is skipped). (-3,5,8,8) -> 5,8,12,20,21,29,32,44,45,48,53,56 but the table claims '8, 12, 17, 20, 24, 32, 33' (17, 24, 33 never occur; 21, 29 missing). (-4,8,9,9) -> 8,9,17,20,33,36,41,56,57 but the table claims '9, 12, 17, 24, 25, 28, 33' (12, 24, 25, 28 never occur). (-6,11,14,15) -> 11,14,15,23,26,35,42,47,51,59 but the table claims '15, 18, 23, 26, 30, 35, 38' (18, 30, 38 never occur; these values belong to the (-1,2,2,3) packing and look copy-pasted from it). Only row 1, (-1,2,2,3) -> '3, 6, 6, 11, 14, 15, 18, 23', is correct. The wrong numbers are shown identically to users of all 8 locales.

_Fix:_ Replace the rows with the computed values: (-2,3,6,7) -> 7, 10, 15, 19, 22, 27, 31, 34, ...; (-3,5,8,8) -> 12, 12, 20, 21, 29, 32, 44, ...; (-4,8,9,9) -> 17, 17, 20, 33, 36, 41, 56, ...; (-6,11,14,15) -> 23, 26, 35, 42, 47, 51, 59, ...

### 🔴 HIGH · math · `app/apollonian/explorer/page.tsx:98`
**descartesFourthZ pairs complex-center roots with the wrong curvature roots, so presets (−3,5,8,8), (−4,8,9,9) and (−6,11,14,15) render a geometrically broken gasket**

The code fixes the pairing zPlus=(linear+2√disc)/kPlus, zMinus=(linear−2√disc)/kMinus, but the principal branch returned by cSqrt does not guarantee that assignment; the two tangent circles are (kPlus, linear∓2√disc) for one branch choice, and for three of the five seeds the pairing is crossed. Recomputation for (−3,5,8,8): c0=(0,0,r=1/3), c1=(−2/15,0,r=1/5), c2=(1/6,1/8,r=1/8); linear=2/3+i, disc=−8/9−2i/3, √disc=1/3−i. Code picks kMinus=8 with zMinus=(linear−2√disc)/8=(0,3/8), then sign-flips to (0,−0.375). The correct k=8 center is (linear+2√disc)/8=(1/6,−1/8): |z|=5/24=r0−r3 ✓. Replicating the file's placeSeed verbatim gives worst pairwise tangency error 0.277 for (−3,5,8,8), 0.275 for (−4,8,9,9), 0.127 for (−6,11,14,15) (0 for the first two presets, whose two k-roots coincide). Because reflectThrough propagates positions linearly, every recursive circle inherits the error, so the canvas shows overlapping, non-tangent circles for those presets. The identical code is duplicated in components/ApollonianGasket.tsx (lines 49–110), so the story-page demo's (−3,5,8,8) and (−6,11,14,15) presets are broken too.

_Fix:_ In placeSeed, do not trust the fixed pairing: build the four candidates (kPlus, (linear±2√disc)/kPlus) and (kMinus, (linear±2√disc)/kMinus), keep the one whose curvature matches k3 and whose center satisfies the tangency constraints (|z−zi| ≈ r3+ri for interior circles, |z| ≈ r0−r3 for the outer), picking the minimum-residual candidate; drop the sign-flip hack. Apply the same fix in components/ApollonianGasket.tsx.

### 🔴 HIGH · math · `app/apollonian/page.tsx:1130`
**Integer-seed table lists curvatures that do not occur in four of the five packings**

BFS over the packings via k' = 2(k1+k2+k3)−k4 (verified against Descartes' identity) gives the actual curvature sets: (−2,3,6,7) → 3,6,7,10,15,19,22,27,31,34,39,… (claimed 35 never occurs, its residue 11 mod 24 is inadmissible for this packing); (−3,5,8,8) → 5,8,12,12,20,21,29,32,44,45,48,… (claimed 17, 24, 33 never occur; 17≡17 and 33≡9 mod 24 are inadmissible classes); (−4,8,9,9) → 8,9,17,17,20,33,36,41,56,… (claimed 12, 24, 25, 28 never occur; the smallest new curvatures are 17,17,20,56 so 12 is impossible); (−6,11,14,15) → 11,14,15,23,26,35,42,47,51,… (claimed 18, 30, 38 never occur; first new curvatures are 23,26,35,86). Rows 3–5 look copy-pasted from the (−1,2,2,3) list. Only row 1 is correct. The table is captioned "Every curvature in every one of these packings is an integer" and is shown in all 8 locales.

_Fix:_ Replace the rows with computed values: (−2,3,6,7) → 7, 10, 15, 19, 22, 27, 31, 34, …; (−3,5,8,8) → 8, 12, 12, 20, 21, 29, 32, …; (−4,8,9,9) → 9, 17, 17, 20, 33, 36, 41, …; (−6,11,14,15) → 15? no — use 23, 26, 35, 42, 47, 51, 86, … (23, 26, 35, 86 are the four first-generation curvatures).

### 🟠 MED · visual · `components/ApollonianGasket.tsx:190`
**Gasket is drawn at 1/|k0| scale because seed coordinates are never normalized to the unit disc**

placeSeed puts the outer circle at radius r0 = 1/|k0| (0.5 for (-2,...), 0.333 for (-3,...), 0.167 for (-6,11,14,15)), but the render maps unit coordinates to the full canvas: scale = (Math.min(W,H)/2) * margin with toPx assuming x,y in [-1,1]. So the (-6,11,14,15) preset renders at one sixth of the canvas diameter (~60 px in the 360 px story canvas), and the fixed cutoffs r < 1e-5 (growGasket) and radiusPx < 0.4 prune its small circles six times earlier than for (-1,2,2,3). The explorer has the identical issue (app/apollonian/explorer/page.tsx line 269), and its Circle interface comment on line 12 even claims 'outer disc has radius 1' which placeSeed does not deliver for |k0| != 1.

_Fix:_ Divide the viewport scale by the seed outer radius, e.g. const scale = (Math.min(W,H)/2) * margin / seed[0].r (equivalently multiply by |k0|), in both ApollonianGasket.tsx and the explorer render.

### 🟠 MED · i18n · `app/apollonian/explorer/page.tsx:384`
**Explorer control panel and several story-page fragments are English-only despite 8 supported locales**

The explorer hardcodes all UI strings in English for every locale: 'Preset packing' (384), 'integer Apollonian seed' (399), 'Recursion depth' (408), the depth hint (424), 'View' (430), the four checkbox labels (440, 450, 460, 470), 'Seed circles' (476), 'Reset view' (512), and the canvas HUD 'circles' / 'depth <=' (346-347). Only title/tagline/body come from i18n. The repo pattern for explorers with this many strings is a local RICH_EXPLORER Record<Locale,...>. The story page also leaks English into all locales: the k=1/r legend in card 02 (page.tsx 990-991), the 'Descartes, 1643' box explanation 'Two solutions: the + sign drops...' (1032-1035), the 'Hausdorff dimension' pretitle and its caption paragraph (1158, 1161-1164), and the 'seed triple' label in ApollonianDescartes.tsx (220). A German or Swedish reader gets a fully translated story with untranslated interactive panels in the middle.

_Fix:_ Add a RICH_EXPLORER Record<Locale, ...> for the explorer sidebar/HUD strings and move the story-page English fragments into the existing RichStory type (all 8 locales are already authored there).

### 🟠 MED · a11y · `app/apollonian/explorer/page.tsx:369`
**Canvases have no accessible name and the depth slider / seed select have no associated label**

The explorer canvas (line 369) and the story-page demo canvas (components/ApollonianGasket.tsx line 239) carry no role or aria-label, so screen readers announce nothing for the main content. The range input (explorer line 414, gasket line 268) and the seed <select> (gasket line 247) are labelled only by sibling <div>s ("Recursion depth", seedLabel) that are not programmatically associated (no <label htmlFor>, no aria-label/aria-labelledby). Contrast: the page's SeedSVG does set role="img" plus aria-label, and repo conventions (CLAUDE.md "DPR-aware, requestAnimationFrame-driven, accessible") expect labelled canvases.

_Fix:_ Add role="img" with a descriptive aria-label to both canvases (including the current preset and circle count), and aria-label or htmlFor-linked labels to the depth sliders and the seed select.

### 🟠 MED · code · `components/ApollonianDescartes.tsx:187`
**Curvature inputs cannot accept a typed negative number: partial input "-" is coerced to 0**

onChange does parseFloat(e.target.value) and calls setter(0) when the result is not finite. For <input type="number">, typing a leading "-" (or clearing the field) makes the DOM report value "" → parseFloat gives NaN → state becomes 0 and the controlled re-render overwrites the field with "0". So the primary use case of the calculator, entering a negative enclosing curvature like −3, is impossible by typing; only the spinner arrows work. The negative sign is central to the demo (all five presets except (1,1,1) start with a negative k₁).

_Fix:_ Keep the raw string in state (or per-field draft state) and only parse to number for the computation, leaving the field content untouched while it is a partial/invalid number; alternatively ignore non-finite parses instead of resetting to 0.

### 🟠 MED · i18n · `app/apollonian/page.tsx:1033`
**Hardcoded English prose inside an otherwise fully 8-locale-localized story page (and all-English explorer sidebar)**

The page defines RICH_STORY for all 8 locales, but three visible text blocks are English literals rendered for every locale: the explanation under the Descartes formula card (lines 1032–1035, "Two solutions: the + sign drops the small inscribed circle…"), the mono key box in encounter card 02 (lines 990–991, "k = 1/r · the curvature", "k < 0 · circle encloses the others"), and the Hausdorff card caption/paragraph (lines 1158, 1161–1164). Additionally app/apollonian/explorer/page.tsx hardcodes all sidebar UI strings in English ("Preset packing", "Recursion depth", "Show curvature labels", "Highlight triangle gaps", "Centre on packing", "Seed circles", "Reset view", "integer Apollonian seed", HUD "circles"/"depth"), while other explorers (eulerchar, mobius) use the RICH_EXPLORER pattern. A German or French reader gets mixed-language content.

_Fix:_ Move these strings into the existing RichStory type (they sit next to fields that are already per-locale), and give the explorer a small RICH_EXPLORER Record<Locale, …> following app/mobius/explorer/page.tsx.

### 🟡 LOW · code · `components/ApollonianGasket.tsx:209`
**Hardcoded color literals duplicate existing palette tokens after the repo-wide palette sweep**

ApollonianGasket.tsx uses 'rgba(232, 234, 242, 0.85)' and 'rgba(255, 122, 182, 0.95)' (lines 209-211); the explorer repeats them plus 'rgba(255, 122, 182, 0.10)' and 'rgba(232, 234, 242, 0.9/0.65)' (explorer lines 283, 314-317, 332, 342); ApollonianDescartes.tsx has four rgba literals (lines 48-51); the page's SeedSVG hardcodes three rgba strokes and fill '#e8eaf2' (page.tsx 877-881, 916). rgba(255,122,182) is exactly palette.signal.rose (#ff7ab6) and rgba(232,234,242)/#e8eaf2 is within one step of palette.ink[100] (#eaecf3). Recent commits (7bf1352, d3b593, 2bf7a41) specifically swept inline hex/rgba for palette tokens; these files were missed even though they already import palette for canvas.bg.

_Fix:_ Derive the strokes from palette.signal.rose / palette.ink[100] (with an alpha helper) instead of repeating the literals.

### 🟡 LOW · content · `app/apollonian/page.tsx:150`
**"At depth 1 you see the seed itself" is false: depth 1 renders 20 circles, not the 4-circle seed**

growGasket inserts a circle for every gap with depth ≤ maxDepth: at slider value 1 the four depth-0 gaps insert 4 circles and their twelve depth-1 gaps insert 12 more, so 4+16=20 circles are drawn. The slider minimum is 1, so the state described in the copy (seed only) is never reachable. The claim is repeated in all 8 locales (e.g. DE line 250 "Bei Tiefe 1 siehst du nur den Keim").

_Fix:_ Either set the slider min to 0 (depth 0 still adds 4 circles; seed-only would need a special case skipping growGasket) or reword the copy in all locales, e.g. "at depth 1 you see the first filling generations".

### 🟡 LOW · visual · `app/apollonian/explorer/page.tsx:268`
**"Centre on packing" toggle does not centre anything: it only changes the zoom margin**

The render code always centres on (0,0); the toggle merely switches margin between 0.92 and 0.6 (the inline comment on lines 263–267 admits this). To the user, unchecking a control named "Centre on packing" just zooms the picture out, which is misleading behaviour for a labelled control.

_Fix:_ Either implement it (fit the viewport to the bounding box of all circles vs. the outer disc) or rename the control to what it does, e.g. "Zoom to fit" / "Fill frame".

### 🟡 LOW · code · `components/ApollonianGasket.tsx:209`
**Hardcoded rgba/hex colour literals where palette tokens exist**

The repo just went through a refactor replacing hex literals with palette tokens (commits 7bf1352, d3b593, 2bf7a41), and lib/visual/palette.ts defines signal.rose #ff7ab6, signal.cyan #7df3ff, signal.amber #ffd166, ink tones. Yet ApollonianGasket hardcodes "rgba(255, 122, 182, 0.95)" and "rgba(232, 234, 242, 0.85)" (lines 209–211), the explorer repeats them plus "rgba(255, 122, 182, 0.10)" and label/HUD fills (app/apollonian/explorer/page.tsx lines 283, 314–317, 332, 342), ApollonianDescartes hardcodes the four circleColors (lines 48–51), and SeedSVG in app/apollonian/page.tsx hardcodes the same rgba values plus fill "#e8eaf2" (lines 877–881, 916) while using palette.canvas.bg one line earlier.

_Fix:_ Derive these from palette tokens (e.g. a small helper that applies alpha to palette.signal.rose etc.) to match the convention established in the recent palette sweep.


## banach

### 🔴 HIGH · math · `app/banach/explorer/page.tsx:78`
**overlaySubMsg states a false identity: g⁻¹·W(g) is not 'the whole tree' (all 8 locales)**

The animation caption's second line says "this piece, multiplied by its inverse generator, equals the whole tree" (de line 98: "ergibt den ganzen Baum", and equivalents in es/fr/it/pt/sv/no lines 117/136/155/174/193/212). Recomputation: W(a) = {reduced words starting with a}; a⁻¹·W(a) = {a⁻¹·a·w} = {w : w does not start with a⁻¹} = F₂ ∖ W(a⁻¹), i.e. the tree MINUS one of the four branches. It never equals all of F₂. The line directly above it (overlayMsg, line 77) states this correctly as "W(h) shifted by inv covers F₂ ∖ W(inv)", and the drawn animation also correctly leaves the dimmed W(inv) branch uncovered, so the sub-caption contradicts both the formula above it and the picture.

_Fix:_ Change the sub-message in all 8 locales to match the true statement, e.g. EN: "this piece, shifted by its inverse generator, becomes the other three pieces plus the identity".

### 🔴 HIGH · math · `app/banach/explorer/page.tsx:78`
**Overlay sub-message claims the shifted piece 'equals the whole tree', contradicting the correct headline right above it**

overlaySubMsg says "this piece, multiplied by its inverse generator, equals the whole tree" (same wording in all 8 locales, lines 78, 98, 117, 136, 155, 174, 193, 212). Recomputation: a⁻¹·W(a) = {a⁻¹·a·v : v reduced, v does not start with a⁻¹} = {e} ∪ W(a) ∪ W(b) ∪ W(b⁻¹) = F₂ ∖ W(a⁻¹), i.e. the whole group MINUS the piece W(a⁻¹). The overlayMsg drawn one line above it (line 77, rendered at line 400) states exactly this correct fact: "W(a) shifted by a⁻¹ covers F₂ ∖ W(a⁻¹)". The sub-line is mathematically false and directly contradicts it on screen.

_Fix:_ Change all 8 overlaySubMsg strings to say it covers everything except W(g⁻¹), e.g. EN: "this piece, multiplied by its inverse generator, covers the whole tree except W(a⁻¹)" (parameterize like overlayMsg), or "…covers the other three pieces plus the identity".

### 🔴 HIGH · math · `app/banach/explorer/page.tsx:78`
**overlaySubMsg claims the shifted piece equals the whole tree; it equals F₂ minus W(g⁻¹), contradicting the overlay line above it**

Recomputation: for g = a, a⁻¹·W(a) = {a⁻¹·a·v} = {v : v does not start with a⁻¹} = F₂ ∖ W(a⁻¹), i.e. three pieces plus the identity, never the whole group (W(a⁻¹) is missed entirely). The overlayMsg drawn one line earlier (line 77) states this correctly: "W(h) shifted by inv covers F₂ ∖ W(inv)". The sub-message directly below says "this piece, multiplied by its inverse generator, equals the whole tree", which is mathematically false and contradicts the line above. The error is replicated in all 8 locales (en line 78, de line 98, es 117, fr 136, it 155, pt 174, sv 193, no 212).

_Fix:_ Reword in all 8 locales to match the true statement, e.g. EN: "this piece, shifted by its inverse generator, becomes everything except the opposite piece — three pieces plus the identity".

### 🟠 MED · visual · `components/BanachFreeGroup.tsx:60`
**Walker path uses shrink 0.55 while the background skeleton uses 0.5, so the walked path visibly drifts off the drawn tree**

step() computes edge length as `80 * Math.pow(0.55, depth - 1)` (line 60), but buildSkeleton uses `SHRINK = 0.5` with the same rootLen 80 (lines 47, 248, 259). Both use the identical childAngle(), so directions match but lengths diverge from the second step on: walker edges 80, 44, 24.2, 13.3 vs skeleton edges 80, 40, 20, 10. After 2 steps the bright walker node sits 4px off the skeleton vertex, after 4 steps ~11.5px cumulative in a 320-unit viewBox, so the highlighted path no longer lands on the vertices of the tree it claims to walk (the hint text says every word 'is a unique vertex' of the drawn graph).

_Fix:_ Use the same constant: `const len = 80 * Math.pow(0.5, depth - 1);` (or share SHRINK between step() and buildSkeleton).

### 🟠 MED · content · `app/banach/page.tsx:180`
**German quote pair mismatched: „Volumen rein = Volumen raus« mixes low-quote opening with a closing left guillemet**

DE section 06 body contains `„Volumen rein = Volumen raus«` — it opens with the German low quote „ but closes with «, which is an OPENING French guillemet. No convention produces this pair: German is „…“ or »…«, French/repo guillemet style is «…». Every other locale in the same file uses matched «…» pairs (e.g. sv line 575, no line 654), and the repo convention explicitly requires „text“ (escaped) or guillemets.

_Fix:_ Replace with «Volumen rein = Volumen raus» (matching the DE explorer/atlas style) or the properly matched „Volumen rein = Volumen raus“.

### 🟠 MED · a11y · `app/banach/explorer/page.tsx:425`
**Explorer canvas and depth slider have no accessible names**

The main <canvas> (line 425) has no role or aria-label, so the entire visualization is invisible to screen readers, and the depth <input type="range"> (lines 449-457) has no aria-label and no associated <label> (the depthLabel text at line 443 is a plain <div>), so the slider announces with no name. This contrasts with BanachFreeGroup.tsx, which does set role="img" + aria-label on its SVG. The W(g) highlight buttons also toggle state without aria-pressed.

_Fix:_ Add aria-label={x.cayleyBadge} (or a dedicated localized string) + role="img" to the canvas, aria-label={x.depthLabel} to the range input, and aria-pressed={active} to the four W(g) toggle buttons.

### 🟠 MED · content · `app/banach/page.tsx:180`
**German quote pair mismatched: opens with „ (U+201E) but closes with « (U+00AB, an OPENING guillemet)**

DE section 06 body reads: die beruhigende Gleichung „Volumen rein = Volumen raus« ist. Byte check confirms 342 200 236 („) as opener and 302 253 («) as closer. Valid German pairs are „text“ or »text« (or the repo-sanctioned «text»); „text« is a mix of two systems and « is a left-pointing/opening mark. All other locales (es/fr/it/pt/sv/no) use matched «...» pairs for the same sentence; only DE is broken. Violates the repo CLAUDE.md rule on German low-quotes.

_Fix:_ Replace „Volumen rein = Volumen raus« with «Volumen rein = Volumen raus» (guillemets, matching the sibling locales) or „Volumen rein = Volumen raus“.

### 🟠 MED · visual · `components/BanachFreeGroup.tsx:60`
**Walker uses shrink factor 0.55 while the background skeleton uses 0.5, so the walked path drifts off the drawn tree vertices**

step() computes edge length as `80 * Math.pow(0.55, depth - 1)` (line 60), but buildSkeleton uses SHRINK = 0.5 with the same rootLen 80 (line 248) and identical childAngle geometry. Recomputation: step 1 both are 80 (match); step 2 walker = 80*0.55 = 44 vs skeleton 80*0.5 = 40 (4px off); step 3 walker = 24.2 vs 20; cumulative radial positions 148.2 vs 140 and growing. The whole point of the component (per the hint text: every reduced word is a unique vertex of the drawn tree) is that the bright walker lands on the dim skeleton nodes; from depth 2 onward it visibly floats between them. Also the walker geometric series 80/(1-0.55) = 177.8 exceeds the viewBox half-size 160, while the skeleton max 150 fits.

_Fix:_ Use one shared constant: `const len = 80 * Math.pow(0.5, depth - 1)` in step(), or extract SHRINK = 0.5 to module scope and use it in both step() and buildSkeleton().

### 🟠 MED · a11y · `app/banach/explorer/page.tsx:425`
**Explorer canvas has no accessible name/role and the depth slider has no associated label**

The main <canvas> (line 425) carries no role="img" and no aria-label, so screen readers announce nothing for the central visualization (contrast BanachFreeGroup.tsx line 100-101, which sets role="img" + aria-label on its SVG, and the repo convention of aria-labels on canvases). The depth range input (lines 449-457) is only preceded by an unassociated <div> caption, so it has no accessible name either; the four W(g) highlight toggles (line 469) also lack aria-pressed state.

_Fix:_ Add role="img" and a localized aria-label (e.g. x.cayleyBadge) to the canvas, give the range input aria-label={x.depthLabel} (or wrap in <label>), and set aria-pressed={active} on the highlight toggle buttons.

### 🟠 MED · math · `app/banach/page.tsx:91`
**Section 04 states the paradoxical decomposition wrongly: a shifted subset does not cover "the rest of the group"**

EN body: "split it into the four subsets of words starting with each generator, apply a single shift, and each subset covers what was the rest of the group." Recomputation: g⁻¹·W(g) = F₂ ∖ W(g⁻¹) = {e} ∪ W(g) ∪ (two b-pieces); it re-covers W(g) itself and misses W(g⁻¹), so it never covers the complement of W(g). Also the four subsets are not a partition of F₂ — the identity ε belongs to none of them. The same wrong phrasing is in all 8 locales (de line 170, es 249, fr 328, it 407, pt 486, sv 565, no 644). The explorer's whatYouSeeP2 states it correctly, so the story contradicts the explorer.

_Fix:_ Rephrase to the standard statement: shifting W(a⁻¹) by a yields every word not starting with a (three other pieces plus identity), so F₂ = W(a) ∪ aW(a⁻¹) and likewise for b — two pieces per copy, hence duplication.

### 🟠 MED · visual · `app/banach/explorer/page.tsx:335`
**Cayley tree is drawn at fixed pixel scale (ROOT_LEN=150) and gets clipped on small canvases**

walk(0,0,null,null,ROOT_LEN,0) with ROOT_LEN=150 and SHRINK=0.5 gives a maximum extent of 150·(1/(1−0.5)) = 300 px in each cardinal direction from the canvas centre, independent of canvas size. On a 375 px phone the canvas is ~343 px wide (p-4 padding), half-width ≈ 171 px, so the a/a⁻¹ arms are clipped from depth 2 onward (node "aa" sits at 150+75 = 225 px) and the generator labels at ROOT_LEN+18 = 168 px sit at the very edge. The b/b⁻¹ arms are similarly clipped whenever the canvas is under 600 px tall.

_Fix:_ Scale the root length to the canvas: const rootLen = Math.min(W, H) / 4 (extent then Math.min(W,H)/2), and use it for the label offsets and shift distance too.

### 🟠 MED · a11y · `app/banach/explorer/page.tsx:449`
**Depth slider has no accessible name and the main canvas has no role/aria-label**

The range input (lines 449-457) is only described by a sibling div ({x.depthLabel}, line 443) with no <label htmlFor>, aria-label, or aria-labelledby, so screen readers announce an unnamed slider. The <canvas> at line 425 has no role="img" and no aria-label / fallback content, so the entire visualization is invisible to assistive tech (contrast with components/BanachFreeGroup.tsx line 100-101, where the SVG gets role="img" plus an aria-label).

_Fix:_ Give the input aria-label={x.depthLabel} (or wrap in a <label>), and add role="img" plus a localized aria-label (e.g. x.cayleyBadge) to the canvas.

### 🟡 LOW · code · `app/banach/explorer/page.tsx:27`
**GEN_COLORS hardcodes rgb literals instead of palette tokens, and the 'violet' entry does not match the palette violet**

GEN_COLORS (lines 27-32) hardcodes "rgb(255, 122, 182)" (= #ff7ab6 = palette.signal.rose), "rgb(125, 243, 255)" (= #7df3ff = palette.signal.cyan), "rgb(255, 209, 102)" (= #ffd166 = palette.signal.amber), but the entry commented "violet" is "rgb(196, 124, 255)" = #c47cff, which is NOT palette.signal.violet (#b388ff = rgb(179, 136, 255)) nor any palette token. The renderer also hardcodes "rgba(138,144,164,0.18)" (line 347; 8a90a4 = palette.canvas.muted), "#fff" (line 376/398) and "rgba(6,7,13,0.78)" (line 396). Recent commits (7bf1352, d3b593 etc.) swept exactly this class of inline hex/rgb literals into palette tokens; this file was missed.

_Fix:_ Build GEN_COLORS from palette.signal.{rose, violet, cyan, amber} (fixing the off-palette #c47cff to #b388ff) and derive the dim/overlay rgba values from palette.canvas.muted / palette.canvas.bg.

### 🟡 LOW · i18n · `components/BanachFreeGroup.tsx:101`
**Hardcoded English strings in an otherwise fully localized component: SVG aria-label and the 'length ·' label**

The component receives caption/resetLabel/hintLabel/wordLabel props localized for all 8 locales, but the SVG's aria-label is the hardcoded English "Cayley graph of F₂" (line 101) and the word-length readout renders the hardcoded English word "length ·" (line 164) for every locale, e.g. German users see "length · 3" next to "aktuelles Wort".

_Fix:_ Pass the localized caption into aria-label (aria-label={caption}) and add a lengthLabel prop to the Props/RichStory types, filled per locale in app/banach/page.tsx.

### 🟡 LOW · animation · `app/banach/explorer/page.tsx:230`
**'Show the trick' 1.4s rAF animation ignores prefers-reduced-motion**

playTheTrick (lines 230-247) always runs a 1400ms requestAnimationFrame tween of `shift` from 0 to 1. The repo convention (globals.css blanket rule plus per-component canvas checks, per CLAUDE.md) is that canvas components check the reduced-motion media query and provide a static fallback; canvas drawing is not affected by the CSS rule, so users with reduced motion still get the full slide animation.

_Fix:_ In playTheTrick, check window.matchMedia("(prefers-reduced-motion: reduce)").matches and, if set, call setShift(1) directly (the end state plus overlay text is the meaningful content) instead of animating.

### 🟡 LOW · animation · `app/banach/explorer/page.tsx:230`
**"Show the trick" rAF animation ignores prefers-reduced-motion**

playTheTrick always runs a 1400 ms requestAnimationFrame easing loop driving setShift. Repo convention (CLAUDE.md: per-component canvases check the reduced-motion media query and freeze / provide a static fallback) is not applied here — there is no matchMedia("(prefers-reduced-motion: reduce)") check anywhere in the file, so reduced-motion users still get the sliding animation. The end state (shift = 1) is a perfectly good static fallback.

_Fix:_ In playTheTrick, if window.matchMedia("(prefers-reduced-motion: reduce)").matches, call setShift(1) and return instead of starting the rAF loop.

### 🟡 LOW · i18n · `app/banach/page.tsx:180`
**German section 06 mixes quote systems: opens with „ and closes with the opening guillemet «**

DE body contains „Volumen rein = Volumen raus« — a German low opening quote paired with «, which is itself an opening guillemet. Repo convention (CLAUDE.md) requires either escaped German quotes („text“) or matched guillemets «text». All other locales on this page use matched «…» (e.g. sv line 575, no line 654); only DE is mismatched.

_Fix:_ Change to «Volumen rein = Volumen raus» or „Volumen rein = Volumen raus“.

### 🟡 LOW · code · `app/banach/explorer/page.tsx:27`
**GEN_COLORS hardcodes rgb duplicates of palette tokens, and the violet one does not match the palette**

"rgb(255, 122, 182)" = #ff7ab6 = palette.signal.rose and "rgb(125, 243, 255)" / "rgb(255, 209, 102)" match palette.signal.cyan/amber exactly, but "rgb(196, 124, 255)" = #c47cff while palette.signal.violet is #b388ff (rgb(179, 136, 255)) — a visibly pinker violet than everywhere else (BanachFreeGroup draws its skeleton with palette.signal.violet). This survived the recent refactor sweep that replaced inline hex literals with palette tokens (commits d3b/2bf).

_Fix:_ Build GEN_COLORS from palette.signal.{rose,violet,cyan,amber} so the values cannot drift; likewise replace rgba(138,144,164,…) (= palette.canvas.muted) and rgba(6,7,13,…) (= palette.canvas.bg) with token-derived values.


## boids

### 🔴 HIGH · content · `app/boids/page.tsx:210`
**"Six years later" contradicts the film years given in the same sentence, in all 8 locales**

Section 06 says "Reynolds presented boids at SIGGRAPH 1987; six years later the bats of Batman Returns (1992) and the wildebeest stampede of The Lion King (1994) used the same engine." Recomputation: 1987 + 6 = 1993, but Batman Returns is 1992 (5 years later) and The Lion King is 1994 (7 years later), so "six years later" is wrong for both films it introduces. The same wrong phrase is duplicated in every locale (de line 281 "sechs Jahre später", es 352, fr 423, it 493, pt 564, sv 635, no 706). The shared story bundle gets it right: lib/i18n/stories.ts line 872 says "Within five years his algorithm was animating the bat swarm in Batman Returns (1992)...", so the site contradicts itself between the story page and the atlas story copy.

_Fix:_ Change to "within five years" (matching stories.ts) or "five and seven years later" in all 8 RICH_STORY variants.

### 🟠 MED · math · `app/boids/explorer/page.tsx:239`
**Torus mode wraps positions but neighbour perception uses raw screen-space displacement, so the seam breaks flocking**

With wrap=true (the default, HUD shows "torus"), positions wrap at lines 298-302, but the neighbour loop computes dx = boids[j*4] - ix, dy = ... - iy (lines 239-241) with no shortest-vector correction. A boid at x=2 and its flockmate at x=w-2 are 4px apart on the torus but ~w px apart in this code, so they do not see each other: flocks fragment every time they cross an edge, and cohesion/alignment pull only toward same-side neighbours. The repo's own BoidsDemo.tsx lines 97-105 implements exactly this correction and its comment explains why it is needed ("Without this boids systematically clump toward the screen mean as they wrap").

_Fix:_ In the inner loop, when p.wrap is on, apply the same correction as BoidsDemo: if (dx > w/2) dx -= w; else if (dx < -w/2) dx += w; likewise for dy, and use the corrected displacement for cohesion (steer toward mean displacement rather than mean absolute position).

### 🟠 MED · visual · `app/boids/explorer/page.tsx:184`
**DPR read once at mount and never refreshed; separation force and low-speed re-kick are not DPR-scaled**

getDpr() is called once (line 184) and captured by resize() and the rAF loop; there is no matchMedia re-subscription (added elsewhere in the repo in commit 7bf1352) and resize() does not re-read it, so browser zoom or moving to a monitor with a different DPR renders blurry and rescales the physics wrongly. Additionally the rule balance depends on DPR: alignment and cohesion accelerations scale with dpr (velocities and positions are in device px), and maxV = p.maxSpeed * dpr (line 217), but the separation acceleration (sepX/sm) * p.wSep * 0.6 (lines 273-274) and the stall re-kick threshold/speed 0.1 / 0.5 (lines 283-286) are unscaled constants, so on a dpr=2 display separation is effectively half as strong relative to the other rules and the flock behaves differently than on dpr=1.

_Fix:_ Re-read getDpr() inside resize() and subscribe to the matchMedia('(resolution: ...)') change event (pattern from commit 7bf1352 / useDpr), and multiply the separation acceleration and the 0.1/0.5 stall constants by dpr.

### 🟠 MED · i18n · `app/boids/page.tsx:743`
**Hardcoded English strings inside the fully localized story page (rule captions, SVG labels, demo reset button)**

The page localizes everything through RICH_STORY (all 8 locales present), but several user-visible strings are English-only for all locales: RULE_KINDS captions lines 743-745 ("Closer neighbours push the focus harder away." etc.), the figure pretitles "Rule 1 · separation" / "Rule 2 · alignment" / "Rule 3 · cohesion" at lines 818, 839, 860, the in-SVG labels "push away" / "match heading" / "steer to centre" at lines 45, 54, 67 (also baked into the SVG aria-label at line 84), and the demo reset button: BoidsDemo is invoked at line 884 without resetLabel, so it renders the EN default "Restart" even though components/BoidsDemo.tsx lines 9-11 explicitly documents that the story page should pass a locale-aware string. A German or French reader sees mixed-language rule boxes.

_Fix:_ Move the three captions, the rule pretitles, and the arrow labels into RichStory (add fields to the type and all 8 locale objects), and pass a localized resetLabel to BoidsDemo.

### 🟠 MED · animation · `components/BoidsDemo.tsx:194`
**Neither BoidsDemo nor the explorer canvas respects prefers-reduced-motion**

CLAUDE.md states "Per-component canvases also check the media query and freeze", and Reveal.tsx, TopicConstellation.tsx, NoiseLadder.tsx, BackpropMiniNet.tsx do. BoidsDemo (rAF loop lines 194-199) and app/boids/explorer/page.tsx (loop lines 202-359) run a continuous full-motion animation unconditionally; there is no matchMedia('(prefers-reduced-motion: reduce)') check and no static fallback in either file, so motion-sensitive users get a permanently swirling canvas on both the story page and the explorer.

_Fix:_ Check the reduced-motion media query in both effects: render one static frame (step once, draw once) and skip requestAnimationFrame when it matches; in the explorer, alternatively initialize running=false under reduced motion so the Play button still allows opt-in.

### 🟠 MED · math · `app/boids/explorer/page.tsx:239`
**Toroidal wrap mode uses raw screen-space displacement for neighbour search, cohesion, and alignment**

The default edge mode is toroidal (wrap=true, positions wrap at lines 298-302), but the neighbour loop computes dx = boids[j*4] - ix, dy = boids[j*4+1] - iy with no shortest-vector wrap correction, and cohesion sums raw absolute positions (cohX += boids[j*4]). So a boid at x=2 and one at x=w-2 (torus distance 4) are treated as distance w-4 and never interact, and any flock straddling a seam has its centroid computed on the far side of the screen, yanking it toward the screen centre. components/BoidsDemo.tsx lines 97-105 fixes exactly this and its comment states the consequence: "Without this boids systematically clump toward the screen mean as they wrap." The explorer, the component users actually tune, still has the bug.

_Fix:_ When p.wrap, apply the BoidsDemo wrap correction (if dx > w/2 dx -= w, etc.) before computing d2, and accumulate cohesion as wrapped displacements (cohX += dx) instead of absolute positions, steering toward (cohX/perCount).

### 🟠 MED · i18n · `app/boids/page.tsx:743`
**Rule-vignette UI strings are hardcoded English on an otherwise fully localized page**

RICH_STORY covers all 8 locales, but the three vignette captions in RULE_KINDS (lines 743-745: "Closer neighbours push the focus harder away.", "Velocity rotates toward the mean heading.", "Steers toward the neighbourhood centroid."), the badge text "Rule 1 · separation" etc. (lines 818, 839, 860, mixing the English word "Rule" with the English kind name), the in-SVG labels in RuleSVG ("push away", "match heading", "steer to centre", lines 45/54/67), and the SVG aria-label `${kind} rule` (line 84) all render in English for de/es/fr/it/pt/sv/no readers.

_Fix:_ Move the captions, the "Rule N" label, the rule names, and the arrow labels into the RichStory type and fill them per locale; pass them into RuleSVG as props.

### 🟠 MED · animation · `components/BoidsDemo.tsx:194`
**Autoplaying story-page canvas ignores prefers-reduced-motion, no static fallback**

BoidsDemo starts an unconditional requestAnimationFrame loop on mount (lines 194-199) and never checks matchMedia("(prefers-reduced-motion: reduce)"). The repo convention (CLAUDE.md: "Per-component canvases also check the media query and freeze"; implemented in components/BackpropMiniNet.tsx, NoiseLadder.tsx, TopicConstellation.tsx) is a static fallback for reduced motion. The global CSS rule only shortens CSS animations, it cannot stop a canvas rAF loop, so motion-sensitive users get 120 continuously swirling triangles mid-article. The explorer page canvas (app/boids/explorer/page.tsx line 359) at least has a Pause button, but the story demo autoplays with no way to satisfy the preference.

_Fix:_ Check the reduced-motion media query in the effect: run step() a few hundred iterations once and draw a single static frame instead of looping; re-subscribe on change like the other components.

### 🟠 MED · a11y · `app/boids/explorer/page.tsx:598`
**Range inputs have no accessible name and both canvases lack aria-labels**

Slider renders <input type="range"> (lines 598-606) with the label text in a sibling <div> (line 595), no <label htmlFor>, no aria-label. Screen readers announce seven anonymous sliders (Boids, Separation w, ..., Max speed). The explorer canvas (line 374) and the BoidsDemo canvas (components/BoidsDemo.tsx line 209) have no role/aria-label either, so the main content region is invisible to AT. The only aria-label in the file is on the colour swatches (line 514).

_Fix:_ Add aria-label={label} to the Slider input (the component already receives label), and role="img" plus a descriptive aria-label on both canvases.

### 🟡 LOW · a11y · `app/boids/explorer/page.tsx:598`
**Range inputs have no accessible name; canvases lack aria-labels; toggle buttons lack aria-pressed**

In Slider (lines 592-607) the visible label is a plain div not associated with the <input type="range"> (no htmlFor/id, no aria-label), so screen readers announce seven unnamed sliders. The explorer canvas (line 374) and the BoidsDemo canvas (components/BoidsDemo.tsx line 209) have no role/aria-label (the page's RuleSVG at line 84 does set role=img + aria-label, so the convention exists in this very room). The Sep/Ali/Coh rule toggles (line 477), the wrap toggle (line 495), and Play/Pause (line 536) convey state only via glyphs and colour, with no aria-pressed.

_Fix:_ Give each Slider an id + htmlFor (or aria-label={label}), add aria-label + role="img" to both canvases, and add aria-pressed={on} to the toggle buttons.

### 🟡 LOW · code · `app/boids/explorer/page.tsx:209`
**Hardcoded colour literals duplicating palette tokens**

The repo just swept hex literals into lib/visual/palette tokens (commits d3b/2bf/7bf). This room still hardcodes palette values: explorer line 209 "rgba(5, 6, 10, 0.20)" duplicates palette.ink[950] #05060a, and COLORS rgb strings lines 15/22/29/36 re-encode palette.signal.cyan/violet/amber/rose; BoidsDemo.tsx lines 174 and 177 hardcode the same ink-950 and signal-cyan values; app/boids/page.tsx (which already imports palette and uses palette.canvas.bg at line 85) still hardcodes "rgba(125,243,255,0.18)" (line 91), "rgba(232,234,242,0.55)" (line 95), and "#9aa0b4" (line 120), the latter not matching any palette token (ink-500 is #6d7388, ink-400 is #828aa1).

_Fix:_ Derive these from the palette (e.g. an rgba helper over palette.ink[950] / palette.signal.cyan / palette.ink values) instead of duplicating channel values inline.

### 🟡 LOW · visual · `app/boids/explorer/page.tsx:184`
**DPR read once at mount; monitor moves with different devicePixelRatio never update the canvas**

const dpr = getDpr() is captured once in the effect (line 184) and reused inside resize() and the rAF loop; sizeRef keeps that stale value forever. Dragging the window to a display with different devicePixelRatio changes neither the backing-store resolution nor the dpr-scaled radii/speeds (perR, maxV), so rendering goes blurry or double-scaled until remount. The repo has lib/hooks/useDpr.ts with matchMedia re-subscription for exactly this (comment: "Re-subscribe with the new DPR"), and commit 7bf1352/2bf7a41 moved other explorers onto it. BoidsDemo re-reads getDpr() inside resize(), but ResizeObserver only fires on box-size changes, so a pure DPR change is missed there too.

_Fix:_ Use the useDpr() hook and re-run the sizing effect on dpr change (or re-read getDpr() inside a matchMedia resolution listener), updating sizeRef and canvas backing size.

### 🟡 LOW · content · `app/boids/page.tsx:190`
**Prose claims separation is weighted by 1/distance², simulations implement a 1/distance falloff**

Section 02 in all locales says the separation steering vector is "weighted by 1/distance² so closer neighbours push harder". The actual code, RuleSVG (page.tsx lines 40-42: dx += ddx/d2 with d2 = squared distance), the explorer (line 249: sepX += -dx/d2), and BoidsDemo (line 114: inv = 1/d2, sepX -= dx*inv), divides the displacement vector (magnitude d) by d², giving a steering magnitude of d/d² = 1/d, i.e. inverse-linear, not inverse-square. The explorer additionally normalizes the separation sum to unit length (line 272), discarding magnitude entirely. The qualitative claim holds but the stated exponent does not match what the demos on the same page compute.

_Fix:_ Either say "weighted by the inverse of the distance" (matching the code) or clarify "the offset vector divided by distance squared".

### 🟡 LOW · visual · `components/BoidsDemo.tsx:174`
**Hardcoded colour literals where palette tokens exist**

BoidsDemo hardcodes "rgba(5, 6, 10, 0.25)" (= palette.ink[950] #05060a) at line 174 and "rgba(125, 243, 255, 0.92)" (= palette.signal.cyan #7df3ff) at line 177; the explorer hardcodes "rgba(5, 6, 10, 0.20)" (app/boids/explorer/page.tsx line 209) and the four signal RGB triplets in COLORS (lines 15/22/29/36); app/boids/page.tsx uses "rgba(125,243,255,0.18)" (line 91) and fill="#9aa0b4" (line 120), the latter matching no palette token at all (closest are canvas.muted #8a90a4 / ink-400 #828aa1). Recent commits (d3b593, 2bf7a41 "replace hex literals with palette tokens") swept exactly this pattern elsewhere; these are stragglers.

_Fix:_ Derive the rgba strings from lib/visual/palette (e.g. a hexToRgb helper) and replace #9aa0b4 with the intended palette token.


## buffon

### 🔴 HIGH · math · `components/BuffonNeedleSim.tsx:275`
**Live needle sim converges to ~3.32, not π, due to edge-band bias in the crossing test**

Needle centres are sampled uniformly over the full canvas height (cy = Math.random() * H, H = 280) but computeLines() places lines only at y = 38..266 (no line at y = 0, and 280 is not a multiple of d = 38). Needles in the top band that would cross the missing line at y = 0 are never counted, so the crossing probability is systematically low. Recomputation: p_sim = 7 lines * 2*E[half]/H = 0.514 vs true 2l/(pi d) = 0.5411. A 3-million-drop replication of the exact code gives p_sim = 0.5126 and a pi estimate of 3.3163. The displayed 'Delta' vs 3.14159 therefore plateaus around 0.17 forever, directly contradicting the page's promise to 'watch pi emerge'. The fastForward() no-draw branch (line 148) has the identical flaw.

_Fix:_ Test crossings against the virtual infinite grid like the explorer does: const yMod = cy % d; const dist = Math.min(yMod, d - yMod); cross = dist <= Math.abs(dy); and draw the line at y = 0 (start the drawLines loop at y = 0). Alternatively sample cy only within Math.floor(H/d)*d with a line at 0.

### 🔴 HIGH · math · `components/BuffonNeedleSim.tsx:275`
**Story-page needle simulator is systematically biased and converges to ~3.31, not pi**

dropOne() samples cy uniformly over the full canvas height H=280 but tests crossings only against the drawn lines y=38..266 (computeLines starts at y=d), so the ideal lattice line at y=0 is missing and the window is not an integer number of periods. Recomputation: ELL=0.85*38=32.3, E[vertical half-extent]=ELL/pi=10.28, each line captures 2*10.28=20.56 of cy-mass, 7 lines => P_sim = 7*20.56/280 = 0.514 (minus ~0.001 truncation at the bottom line), while the true P = 2*0.85/pi = 0.541. The displayed estimate 2*ELL*N/(D*C) therefore converges to 1.7/0.513 = 3.31, a permanent +0.17 (5.4%) bias; the on-screen delta vs 3.14159 never shrinks below ~0.17 no matter how long it runs, contradicting the page's whole message. fastForward() (lines 144-148) has the identical biased test. The explorer avoids this via a modular test (yMod) and is correct.

_Fix:_ Use the explorer's modular crossing test: const yMod = cy % D; cross = Math.abs(yMod - D/2) + (ELL/2)*Math.sin(theta) > D/2 (lattice at multiples of 38, matching the drawn lines), in both dropOne and fastForward.

### 🟠 MED · math · `app/buffon/page.tsx:182`
**Lazzarini section understates honest drop count by 3-4 orders of magnitude (10^10 vs ~10^13-10^14)**

All 8 locales claim Lazzarini's six-decimal accuracy 'would require something like 10^10 drops by honest convergence'. The estimator's standard deviation for l/d = 5/6 is pi*sqrt((1-p)/(p*N)) with p = 5/(3*pi) = 0.5305, i.e. approx 2.96/sqrt(N). For a typical error of |355/113 - pi| = 2.7e-7 that gives N approx (2.96/2.7e-7)^2 = 1.2e14; even with the optimistic c = 1 implied by the page's own error table (N = 10^6 -> ~0.001), N = 1.1e13. At 10^10 drops the typical error is ~3e-5, only 4-5 correct decimals. The claim also contradicts the adjacent table when extrapolated by the stated 1/sqrt(N) law.

_Fix:_ Change '10^10' to 'on the order of 10^13' (or 'trillions of drops') in all 8 locale bodies of section 05.

### 🟠 MED · animation · `components/BuffonNeedleSim.tsx:40`
**Needle sim autoplays a perpetual rAF animation without a prefers-reduced-motion check**

running defaults to true, so the canvas starts an endless requestAnimationFrame drop loop on mount. The component never queries (prefers-reduced-motion: reduce), unlike 13 other canvas components in the repo (all signature heroes, BackpropMiniNet, NoiseLadder, StarField, Reveal) and the stated repo convention 'Per-component canvases also check the media query and freeze'. Motion-sensitive users get continuous unavoidable animation; the global CSS rule cannot stop canvas drawing.

_Fix:_ Initialize running from window.matchMedia('(prefers-reduced-motion: reduce)') (start paused with a static pre-seeded frame, e.g. one fastForward batch), and subscribe to changes.

### 🟠 MED · i18n · `app/buffon/page.tsx:888`
**Hardcoded English blocks inside an otherwise fully localized story page**

The page authors full RICH_STORY prose for all 8 locales, but several user-facing strings are English literals rendered for every locale: 'The exact probability' and 'A sine, an integral, a uniform density - and pi emerges from straight lines.' (lines 888-895), the Lazzarini table caption 'Lazzarini, 1901 · honest convergence', headers 'N drops' / 'typical |Delta pi|' and the footnote 'The last row is not a fact about randomness...' (lines 946-978), and the Bertrand table caption 'Bertrand 1888 · three answers to one question', headers 'procedure' / 'P(longer than side)', the three procedure row labels, and the closing footnote (lines 989-1018). A German or French reader gets English mid-article.

_Fix:_ Move these strings into the RichStory type (e.g. exactProbTitle, lazzariniTable: {caption, colN, colErr, footnote}, bertrandTable: {...}) and fill them for all 8 locales like the rest of RICH_STORY.

### 🟠 MED · a11y · `app/buffon/explorer/page.tsx:376`
**Canvases and range sliders have no accessible names anywhere in the buffon room**

Explorer: both canvases (lines 310, 316) lack aria-label/role, and all three range inputs (rate line 376, needle length line 407, spacing line 419) have their captions in plain <div>s, so screen readers announce an unnamed slider. Story components: BuffonNeedleSim's canvas (BuffonNeedleSim.tsx line 168) has no aria-label, and BuffonConvergencePlot's <label> (BuffonConvergencePlot.tsx line 110) has no htmlFor while the range input (line 115) has no id or aria-label, so the 'Total drops N' label is not associated. Repo convention says demo components are 'DPR-aware, requestAnimationFrame-driven, accessible'.

_Fix:_ Add aria-label (and role='img') to each canvas describing the visualization, and associate each slider via htmlFor/id or an aria-label on the input.

### 🟠 MED · math · `app/buffon/page.tsx:182`
**Lazzarini section claims six-digit accuracy 'would require something like 10^10 drops'; the correct order is ~10^13-10^14**

Recomputation with ell/d = 5/6: p = 2(5/6)/pi = 0.5305; by the delta method sigma(pi-hat) = (pi^2/(2*5/6)) * sqrt(p(1-p)/N) = 2.96/sqrt(N). For sigma = 3e-7 (six decimals) N = (2.96/3e-7)^2 = 9.7e13; even a 50% chance of |err|<3e-7 needs ~4e13. At the claimed 10^10 drops, sigma = 3e-5, 100x too coarse (probability of six digits ~0.8%). The 10^10 figure is repeated in all 8 locales (de line 267, es 352, fr 437, it 522, pt 607, sv 692, no 777).

_Fix:_ Change '10^10' to 'around 10^14' (or 'tens of trillions') in all eight locale bodies.

### 🟠 MED · math · `app/buffon/explorer/page.tsx:291`
**Explorer pi estimate applies current slider values to counts accumulated under old parameters**

piEst = (2 * needleLen * total) / (spacing * crossings) uses the CURRENT needleLen/spacing against cumulative total/crossings, and drop() never resets counters when the sliders change. Concrete failure: drop 10 000 needles at the defaults (l=50, d=60, p=0.5305, C~5305, estimate ~3.14), then drag needle length to 90: the display instantly jumps to 2*90*10000/(60*5305) = 5.655 with |error| ~80%, and all subsequent drops mix two distributions so it never recovers to pi. The per-sample history (line 111) has the same mixing.

_Fix:_ Reset totalRef/crossRef/samplesRef (call clear()) whenever spacing or needleLen changes, or accumulate sum of per-drop 2l/d so the estimator stays valid across parameter changes.

### 🟠 MED · i18n · `app/buffon/page.tsx:888`
**Hardcoded English blocks render inside the otherwise fully 8-locale story page**

The page authors all 8 locales in RICH_STORY, but three JSX blocks are hardcoded English shown to every locale: 'The exact probability' + 'A sine, an integral, a uniform density...' (lines 888, 894), the Lazzarini table ('Lazzarini, 1901 · honest convergence', 'N drops', 'typical |Delta pi|', 'claimed 0.0000003', and the closing paragraph 'The last row is not a fact about randomness...', lines 946-978), and the Bertrand table ('Bertrand 1888 · three answers to one question', 'procedure', 'P(longer than side)', the three procedure rows, and 'Same words, three sample spaces...', lines 989-1018). German, Spanish etc. readers get untranslated English mid-page.

_Fix:_ Move these strings and table rows into the RichStory type and author them per locale like the rest of the page.

### 🟠 MED · i18n · `app/buffon/explorer/page.tsx:301`
**Explorer UI is almost entirely untranslated hardcoded English**

Except for topic title/tagline/body (a.topics.buffon) and u.back, every UI string is English for all 8 locales: 'Needle drop · d = ...' (301), 'pi = 2ln/(dk)' badge, 'Convergence · running pi estimate vs needles dropped' (313), 'Stats', 'Drops', 'Crossings', 'pi estimate', '|error|' (330-345), the l>d bias note (348-352), 'Auto drop', 'On/Off', 'Rate · drops/frame', 'Drop 1 000', 'Drop 10 000', 'Clear', plus the canvas hint 'Drop a few needles to begin sampling.' (259). Other explorers in this repo (app/eulerchar/explorer, app/mobius/explorer) use the local RICH_EXPLORER Record<Locale,...> pattern for exactly this.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, ...> covering all 8 locales for these strings, following app/mobius/explorer/page.tsx.

### 🟠 MED · animation · `components/BuffonNeedleSim.tsx:40`
**Needle simulator auto-plays on mount with no prefers-reduced-motion check**

useState(true) for `running` starts an endless requestAnimationFrame loop dropping needles the moment the component scrolls into view, and neither BuffonNeedleSim, BuffonConvergencePlot, nor the explorer checks matchMedia('(prefers-reduced-motion: reduce)'). Repo convention (CLAUDE.md, 'Accessibility + motion'): per-component canvases check the media query and freeze with a static fallback. The global CSS rule cannot stop canvas rAF animation.

_Fix:_ Initialize running to false when matchMedia('(prefers-reduced-motion: reduce)').matches, and render one static batch of needles (e.g. a single fastForward-style draw) as the fallback frame.

### 🟡 LOW · visual · `app/buffon/explorer/page.tsx:173`
**Explorer marks needles as crossing invisible virtual lines at y = 0 and below the last drawn line**

The crossing test (lines 95-98) is correct for an infinite grid of lines at every multiple of d, but the render loop 'for (let y = spacing; y < H; y += spacing)' (line 173) never draws the line at y = 0, and when H is not a multiple of d the virtual line just below the canvas edge is off-screen too. Needles near the top (and sometimes bottom) edge are highlighted amber as crossings while visibly touching no line, which looks like a counting bug to users even though the estimator is unbiased.

_Fix:_ Start the line-drawing loop at y = 0 (for (let y = 0; y <= H; y += spacing)) so every line the crossing test uses within the canvas is visible.

### 🟡 LOW · content · `app/buffon/page.tsx:187`
**Bertrand's paradox dated 1888; standard citation is Calcul des probabilites, 1889**

Section 06 in all 8 locales says 'Joseph Bertrand published a paradox in 1888' and the table caption (line 989) says 'Bertrand 1888'. The paradox was introduced in Bertrand's Calcul des probabilites, published 1889, which is the year standard references give.

_Fix:_ Change 1888 to 1889 in all 8 section-06 bodies and in the table caption.

### 🟡 LOW · i18n · `app/buffon/page.tsx:267`
**German copy uses generic masculine 'ein ernsthafter Experimentator'**

The de section 05 body ends with 'Laplaces Variante ist die, die ein ernsthafter Experimentator tatsaechlich laufen lassen wuerde.' This is a generic (non-specific) person, so the repo rule requiring gender-neutral German (Studierende, Mathematiker:innen) applies; the rest of the site follows it (e.g. 'jede:n' in the atlas Hilbert copy).

_Fix:_ Rephrase, e.g. '...die Variante, die man bei einem ernsthaften Experiment tatsaechlich laufen lassen wuerde' or 'die ein:e ernsthafte:r Experimentator:in tatsaechlich laufen lassen wuerde'.

### 🟡 LOW · content · `app/buffon/page.tsx:187`
**Bertrand's paradox dated 1888; the standard citation is Calcul des probabilites, 1889**

All eight locale bodies for section 06 say Bertrand 'published a paradox in 1888' (en 187, de 272, es 357, fr 442, it 527, pt 612, sv 697, no 782) and the hardcoded table caption says 'Bertrand 1888' (line 989). The paradox appears in Joseph Bertrand's Calcul des probabilites, published 1889, which is the year standard references give. The three answers (1/3, 1/4, 1/2) and their pairing with the three procedures are correct.

_Fix:_ Change 1888 to 1889 in all eight locale bodies and in the table caption.

### 🟡 LOW · a11y · `components/BuffonConvergencePlot.tsx:110`
**Sliders have no accessible names and info-bearing canvases have no aria labels**

BuffonConvergencePlot's <label> (line 110) has no htmlFor and the range input (line 115) has no id or aria-label, so screen readers announce an unnamed slider. Same for all three explorer range inputs (app/buffon/explorer/page.tsx lines 376, 407, 419), whose visible labels are plain divs. The three <canvas> elements (BuffonNeedleSim.tsx 168, BuffonConvergencePlot.tsx 93, explorer 310/316) carry neither aria-label nor role, unlike the repo's stated canvas conventions (the decorative SixNeedlesSVG is correctly aria-hidden).

_Fix:_ Associate labels via htmlFor/id or add aria-label to each range input, and give each canvas role='img' with a short aria-label (the adjacent live stats already convey the numbers).


## bzr

### 🔴 HIGH · content · `app/bzr/page.tsx:153`
**Closing CTA describes explorer features that do not exist (all 8 locales)**

closingBody (en line 153-154, and identically de 250-251, es 347-348, fr 444-445, it 541-542, pt 638-639, sv 735-736, no 832-833) tells the reader the Explorer gives 'the full reaction-diffusion field ... control over the diffusion ratios and the Oregonator f parameter, and the freedom to plant several defects and watch them compete.' The actual explorer (app/bzr/explorer/page.tsx) is a Hodgepodge cellular automaton (line 123 'One Hodgepodge step', header line 276 'Hodgepodge automaton') with parameters k1/k2/g (lines 356-402), Restart/Seed-spiral/Play buttons (lines 310-327) and NO diffusion, NO Oregonator f parameter, and NO 'plant defect' control. It is not a reaction-diffusion field at all. The promised UI is misdescribed in every locale.

_Fix:_ Rewrite closingBody in all 8 locales to match the real explorer: a Hodgepodge/Greenberg-Hastings-style cellular automaton with k1 (infected weight), k2 (ill weight), g (reaction rate) sliders, four colour maps, random restart and spiral seed. Drop the 'diffusion ratios', 'Oregonator f parameter' and 'plant several defects' claims.

### 🟠 MED · content · `app/bzr/page.tsx:154`
**Closing paragraph describes an Explorer that does not exist (all 8 locales)**

closingBody (en line 153-154, and the parallel de/es/fr/it/pt/sv/no strings) tells the reader the Explorer offers "the full reaction-diffusion field ... control over the diffusion ratios and the Oregonator f parameter, and the freedom to plant several defects and watch them compete for the medium." The actual explorer at app/bzr/explorer/page.tsx is a Hodgepodge cellular automaton: its controls are k1/k2/g sliders (infected weight, ill weight, reaction rate), a Speed slider, colour maps, plus Restart/Seed-spiral/Pause. There is no diffusion-ratio control, no Oregonator f parameter, and no plant-defect action (Seed spiral replaces the whole grid). Three of the four promised capabilities are absent, so the description misleads users about the room they are entering. Only "multiple colour palettes" (the colour-map buttons) actually matches.

_Fix:_ Rewrite closingBody in all 8 locales to match the Hodgepodge automaton the explorer actually ships (k1/k2/g weights, presets, colour maps, seed-spiral), or change the explorer to the reaction-diffusion field the text promises.

### 🟠 MED · a11y · `app/bzr/explorer/page.tsx:223`
**Explorer animation ignores prefers-reduced-motion (no static fallback)**

The main effect starts requestAnimationFrame(tick) unconditionally and never checks matchMedia('(prefers-reduced-motion: reduce)'). CLAUDE.md states per-component canvases must check the media query and freeze; the global CSS reduced-motion rule only shortens CSS transitions/animations, it cannot stop a canvas RAF loop. This full-viewport automaton therefore keeps animating for reduced-motion users. The code's own comments (lines 191-194) cite strobing "epilepsy risk" as the reason speed was lowered, which makes an honoured reduced-motion setting especially important here.

_Fix:_ Read the media query (and subscribe to changes); when reduce is set, render one frame and do not schedule the RAF loop (or gate `running` off), so the field is shown statically.

### 🟠 MED · a11y · `components/BzrOregonator.tsx:83`
**Both story demos animate regardless of prefers-reduced-motion**

BzrOregonator (effect at line 83) and BzrSpiralSim (effect at components/BzrSpiralSim.tsx line 130) both call requestAnimationFrame in a loop with no matchMedia('(prefers-reduced-motion: reduce)') guard and no static fallback. A grep across app/bzr and both components finds zero reduced-motion handling. This contradicts the repo convention (per-component canvases check the media query and freeze) and the reduced-motion accessibility requirement; reduced-motion users still get continuously moving traces and rotating spiral fronts.

_Fix:_ In each component, detect prefers-reduced-motion; when set, paint a single representative frame and skip scheduling the RAF loop (and ideally hide the Play/Pause affordance or default to paused).

### 🟠 MED · a11y · `components/BzrSpiralSim.tsx:130`
**Animated canvases ignore prefers-reduced-motion (no freeze / static fallback)**

CLAUDE.md states per-component canvases must check prefers-reduced-motion and freeze with a static fallback. None of the three bzr canvases do: BzrSpiralSim (rAF loop starts unconditionally at line 207), BzrOregonator (line 183), and the explorer (app/bzr/explorer/page.tsx line 264) run continuous requestAnimationFrame loops with no matchMedia('(prefers-reduced-motion: reduce)') check. The code comments themselves flag strobing as an 'epilepsy risk' (BzrSpiralSim line 20, explorer line 192), which makes honoring the reduced-motion preference important. grep for 'prefers-reduced-motion'/'matchMedia' in all three files returns nothing.

_Fix:_ Add a matchMedia('(prefers-reduced-motion: reduce)') check in each component; when reduce is set, render one static frame (or a few settled steps) and skip the rAF loop, subscribing to change events to resume/freeze like the other topic canvases.

### 🟡 LOW · a11y · `app/bzr/explorer/page.tsx:283`
**Canvases lack aria-labels; explorer range inputs have no associated labels**

The explorer canvas (line 283-291) and both demo canvases (BzrOregonator line 203, BzrSpiralSim line 225-232) have no aria-label/role or aria-hidden. Additionally the explorer's range inputs (k1, k2, g, speed at lines 362-417) use plain <div> captions with no htmlFor/id association and no aria-label, so screen-reader users hear an unlabeled slider. The task's a11y bar calls for aria-labels on canvases and labels associated with inputs.

_Fix:_ Give each canvas an aria-label describing what it shows (or aria-hidden if purely decorative), and associate each slider with a <label htmlFor> / id pair or add aria-label to the input.

### 🟡 LOW · code · `components/BzrOregonator.tsx:143`
**Hardcoded rgba grid colour instead of a palette token**

Line 143 sets ctx.strokeStyle = "rgba(232,234,242,0.07)" (an ink-100 tint) as a raw literal, while the rest of this component correctly pulls from `palette` (palette.signal.*, palette.canvas.bg). This is exactly the class of inline colour literal the recent palette-token sweep targeted. Similar raw RGB literals appear in the LUTs of BzrSpiralSim (bg/mid/hi at lines 27-29) and the explorer buildLUT, though those are numeric ramps that are harder to tokenize.

_Fix:_ Reference an ink/foreground token from lib/visual/palette (e.g. derive the grid colour from palette.canvas or an ink token) instead of the hardcoded rgba string.

### 🟡 LOW · a11y · `components/BzrOregonator.tsx:203`
**Interactive canvases lack aria-label/role and text alternative**

The three <canvas> elements carry no aria-label, role, or fallback text: BzrOregonator line 203, BzrSpiralSim line 225, and explorer app/bzr/explorer/page.tsx line 283. Screen-reader users get an unlabeled graphic. The surrounding caption/note text is not programmatically associated with the canvas.

_Fix:_ Add role="img" and a descriptive aria-label (e.g. the caption string already passed in as a prop) to each canvas element.

### 🟡 LOW · content · `app/bzr/page.tsx:186`
**German grammar error: wrong article gender in 'einer Herzkammerflimmerns'**

de card 03 (line 186) reads 'die Spiralen einer Herzkammerflimmerns'. 'Herzkammerflimmern' (das Flimmern) is neuter, so the genitive article must be 'eines', not the feminine 'einer'. The EN source (line 89) is 'the spiral waves of cardiac fibrillation'.

_Fix:_ Change to 'die Spiralen eines Herzkammerflimmerns' (or reword, e.g. 'die Spiralwellen des Herzkammerflimmerns').


## cantor

### 🔴 HIGH · math · `components/CantorPowerSetTower.tsx:105`
**Tower rung #0 (ℕ) is presented as "power set of ℕ", and this wrong statement is expanded by default on page load**

The expanded panel always renders "𝒫 {ofLabel} X" with X = (rung.level === 0 ? "ℕ" : CARD_LABELS[rung.level - 1]). For rung 0 that reads "𝒫 = power set of ℕ · Aleph-null. The smallest infinity…", i.e. it asserts ℕ is the power set of ℕ. ℕ is the base of the tower, not a power set of anything; by Cantor's own theorem |𝒫(ℕ)| > |ℕ|, so the claim contradicts the very theorem the widget illustrates. Because useState(0) at line 51 opens rung 0 initially, every visitor in all 8 locales sees the incorrect statement without clicking anything.

_Fix:_ Only render the "𝒫 {ofLabel} …" prefix for rung.level >= 1 (rung 1 = 𝒫 of ℕ, rung 2 = 𝒫 of ℝ, …); for rung 0 show just the note. While there, base rung 1's operand on "ℕ" rather than the cardinal label chain.

### 🔴 HIGH · math · `components/CantorPowerSetTower.tsx:105`
**Tower rung #0 (ℵ₀, the naturals) is labeled as "𝒫 = power set of ℕ", which is mathematically false and shown open by default**

The expanded panel renders `𝒫 {ofLabel} {rung.level === 0 ? "ℕ" : CARD_LABELS[rung.level - 1]}` for every rung, including level 0. With ofLabel = "= power set of" the user sees, on rung #0 whose cardinality label is ℵ₀ and pretty name "the naturals · ℕ": "𝒫 = power set of ℕ · Aleph-null. The smallest infinity…". But ℵ₀ = |ℕ| is the base of the tower, not |𝒫(ℕ)| (which is 2^ℵ₀, rung #1). Since `useState<number | null>(0)` opens rung 0 by default (line 51), this wrong claim is visible on page load in all 8 locales. Rungs 1+ are correct (e.g. rung 1: 𝒫 of ℵ₀ → 2^ℵ₀).

_Fix:_ For rung.level === 0 render only the note (skip the "𝒫 {ofLabel} …" prefix), e.g. `{rung.level > 0 && (<>𝒫 {ofLabel} <span>{CARD_LABELS[rung.level - 1] ?? "⋯"}</span> · </>)}{rung.note}`.

### 🟠 MED · content · `components/CantorDiagonalDemo.tsx:60`
**Inline demo uses and displays the rule s_n = (d_n,n + 1) mod 10, directly contradicting the Section 03 prose above it that says to avoid digits 0 and 9**

app/cantor/page.tsx Section 03 (line 99 EN, and the same claim in all 8 locales) says: "A safe recipe swaps each digit for one that isn't 0 or 9 (avoiding the 0.999… = 1.000… ambiguity)." The demo rendered immediately below that text computes constructed = (d + 1) % 10 and prints the rule verbatim at lines 140-143. Recomputation: d = 8 → 9 and d = 9 → 0, so the constructed real can contain exactly the digits the prose just declared unsafe. The explorer already has a correct implementation (flipDigit's plusOne skips 0 and 9), so the story page demo is the odd one out.

_Fix:_ Reuse the explorer's safe rule in the demo (skip 0 and 9, or swap 5 ↔ 6) and update the displayed rule text accordingly.

### 🟠 MED · code · `app/cantor/explorer/page.tsx:166`
**Autoplay sets revealed one full tick late; pausing in that window permanently hides "The contradiction" panel**

In the play interval, when s = N-1 the updater returns N without setting revealed; revealed/playing are only set on the NEXT tick when s >= N. So after the 16th digit is placed the contradiction box appears up to one full interval later (1.5 s at the slowest speed). Worse: if the user clicks Pause during that window, playing becomes false, the interval is cleared, and revealed stays false, while both Step (disabled={step >= N}) and Play (disabled={step >= N && !playing}) are now disabled, so the contradiction panel and the row-hover highlighting (both gated on revealed) are unreachable without a full Reset. stepOnce (lines 183-192) already handles this correctly via "if (s + 1 >= N) setRevealed(true)".

_Fix:_ Mirror stepOnce in the interval updater: when s + 1 >= N, call setRevealed(true) and setPlaying(false) before returning s + 1.

### 🟠 MED · math · `components/CantorDiagonalDemo.tsx:60`
**Demo's digit rule sₙ = (dₙ,ₙ + 1) mod 10 produces 0s and 9s, directly contradicting the "avoid 0 and 9" recipe in the section right above it**

Section 03 of the story (app/cantor/page.tsx line 99 EN, and all 7 other locales) says: "A safe recipe swaps each digit for one that isn't 0 or 9 (avoiding the 0.999… = 1.000… ambiguity)." The inline demo embedded in that same section computes `constructed = diagonalDigits.map((d) => (d + 1) % 10)` and displays the rule verbatim as "s_n = (d_n,n + 1) mod 10" (line 141). Recheck: d = 9 → s = 0, d = 8 → s = 9, so the constructed real can contain exactly the digits the text says must be avoided, reintroducing the dual-expansion loophole the page just explained. The explorer's plusOne strategy (app/cantor/explorer/page.tsx flipDigit, lines 102-108) gets this right by skipping 0 and 9; the demo does not.

_Fix:_ Use the explorer's safe rule in the demo: map d → (d+1) mod 10 but skip 0 and 9 (e.g. 8→1, 9→1), and update the displayed rule text accordingly, or reuse flipDigit's plusOne logic.

### 🟠 MED · i18n · `app/cantor/page.tsx:1059`
**Hardcoded English blocks in the middle of a fully 8-locale story page: continuum card, CH table (headers and row texts), and footnote**

The page's own header comment (lines 15-19) says the whole 8-locale bundle is editable from this file, and RICH_STORY covers all 8 locales. Yet several user-visible strings are hardcoded English JSX: "Cardinality of the continuum" (1059), "Strictly larger than ℵ₀ … actually hands you." (1062-1064), "Independence of CH from ZFC" (1081), table headers Year/Who/Result (1087-1092), all four table row texts, e.g. "Asks whether any size lives strictly between ℵ₀ and c." (1097-1100), and "The continuum hypothesis is independent of ZFC: the axioms simply don't decide it." (1110-1112). A German/Spanish/… reader gets two full English content cards between otherwise translated sections.

_Fix:_ Move these strings into RichStory (e.g. continuumCardTitle/Body, chTableTitle, chRows: Array<[string,string,string]>, chFootnote) and fill all 8 locales like the rest of the bundle.

### 🟠 MED · i18n · `app/cantor/explorer/page.tsx:206`
**Explorer UI is entirely hardcoded English for all 8 locales, despite the story page shipping a fully localized bundle and a repo convention (RICH_EXPLORER) for exactly this**

Only topic.title/tagline/body (from atlas) and u.back are localized. Everything else is English string literals: "Cantor diagonal · 16 rows × 16 digits" (206), "Building s · digit … /" (291), "s differs from r… flipped to" (306-316), the whole "The contradiction" reveal paragraph (322-327), "Transport", "Step", "Play/Pause", "Reset", "Speed", "Number source", "Decimal/Binary/Custom", "Re-shuffle the listing", "One decimal per line · digits after the dot are used", "Digit-change rule", "Swap 5 ↔ 6"/"safe; never 0 or 9", "skip 0, 9 to avoid 0.999… ambiguity", the binary-mode note (477-479), and the three Legend lines (485-497). CLAUDE.md states explorers with many UI strings should declare a local RICH_EXPLORER keyed by Locale (as app/mobius/explorer and app/eulerchar/explorer do). A de/fr/… user coming from a fully translated story lands in an English-only room.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, …> for these ~20 strings (start from app/mobius/explorer/page.tsx as template) and read it via useI18n().locale.

### 🟠 MED · content · `app/cantor/page.tsx:113`
**Section 06 conflates the aleph hierarchy with the iterated power-set (beth) hierarchy, implicitly asserting GCH one section after explaining CH is undecidable**

The section title is "ℵ₀ < ℵ₁ < ℵ₂ < ⋯ forever" while the body's ladder is "ℵ₀, 2^ℵ₀, 2^(2^ℵ₀), …". Juxtaposed under one heading ("The hierarchy"), this presents ℵ₁ = 2^ℵ₀, ℵ₂ = 2^(2^ℵ₀) as if the power-set iteration produces the alephs, i.e. the generalized continuum hypothesis, which Section 05 (lines 107-109) just told the reader is independent of ZFC (2^ℵ₀ could equal ℵ₂, ℵ₁₇, …). The successor-cardinal chain and the beth chain are both individually true but are different hierarchies. The mismatch is replicated in all 8 locales (e.g. de line 225-226, fr 452-453).

_Fix:_ Retitle the section with the beth ladder it actually describes (e.g. "ℵ₀ < 2^ℵ₀ < 2^(2^ℵ₀) < ⋯ forever", matching the CantorPowerSetTower hierarchy strip on its line 117), or add one clause noting that whether these coincide with ℵ₁, ℵ₂, … is exactly the (G)CH question.

### 🟡 LOW · code · `components/CantorDiagonalDemo.tsx:47`
**constructedLabel prop is silenced (_constructedLabel) and never rendered, so the localized "Constructed real" caption in all 8 locales is dead copy**

The page passes story.diagonalConstructed ("Constructed real" / "Konstruierte reelle Zahl" / … authored in all 8 locales, app/cantor/page.tsx line 1039) but the component renames it to _constructedLabel and the rose result row is labeled only by a bare "s" (line 115). Users get no textual explanation of what the highlighted bottom row is beyond the hint paragraph; the translation work is unreachable.

_Fix:_ Render the label next to the s row (e.g. as a caption above it or in the row header cell: `s · {constructedLabel}`), or drop the prop from the interface and the 8 locale bundles.

### 🟡 LOW · a11y · `components/CantorDiagonalDemo.tsx:149`
**Range inputs and textarea across the demo and explorer have no programmatic labels**

In CantorDiagonalDemo the <label> at lines 146-148 has no htmlFor and the rows slider (line 149) has no id or aria-label, so screen readers announce an unnamed slider. Same pattern in app/cantor/explorer/page.tsx: the speed slider (line 380) is captioned only by a sibling <div> ("Speed"), and the custom-list textarea (line 431) has no accessible name (its description at line 428 is a plain div). Additionally, the explorer's per-row disagreement highlight is mouse-only (onMouseEnter/onMouseLeave, lines 244-245) with no keyboard path.

_Fix:_ Associate labels via htmlFor/id or add aria-label to the two sliders and the textarea; consider tabIndex + focus handlers (or a button per row) for the row-highlight interaction.

### 🟡 LOW · content · `app/cantor/page.tsx:214`
**German substantivized adjectives are lowercase: "Die reellen sind überabzählbar", "alle reellen", "der reellen"**

German orthography requires capitalization of nominalized adjectives. Line 214: "Abschnitt 04 · Die reellen sind überabzählbar" (should be "Die Reellen" or "Die reellen Zahlen"), line 204: "Nimm an, du listest alle reellen" (should be "alle Reellen" / "alle reellen Zahlen"), line 216: "Die reellen haben Mächtigkeit c", line 260: "Die Potenzmenge der reellen". The EN source ("the reals") was translated without restoring the noun. The rest of the DE copy is otherwise clean and gender-neutral.

_Fix:_ Capitalize the nominal uses (die Reellen, alle Reellen, der Reellen) or spell out "die reellen Zahlen" in each spot.

### 🟡 LOW · a11y · `components/CantorDiagonalDemo.tsx:146`
**Rows slider label is not programmatically associated with the range input**

The <label> (line 146-148) has no htmlFor and the <input type="range"> (149-156) has no id or aria-label, so screen readers announce an unnamed slider. Same pattern in the explorer: the Speed slider (app/cantor/explorer/page.tsx lines 380-388) has only a sibling <span>Speed</span>, and the custom-list <textarea> (431-440) has no label/aria-label at all.

_Fix:_ Give the inputs ids and use htmlFor on the labels (or add aria-label={rowsLabel} / aria-label="Speed" / aria-label on the textarea).

### 🟡 LOW · a11y · `components/CantorPowerSetTower.tsx:74`
**Expandable rung buttons expose no expanded/collapsed state to assistive tech**

Each rung is a <button> that toggles an inline detail panel (isOpen, lines 74-110), but there is no aria-expanded attribute, so screen-reader users cannot tell whether activating a rung opened or closed its note, nor that it is a disclosure at all.

_Fix:_ Add aria-expanded={isOpen} to the rung <button> (optionally aria-controls pointing at the note div with an id).

### 🟡 LOW · code · `components/CantorDiagonalDemo.tsx:47`
**constructedLabel prop is translated in all 8 locales but never rendered**

The prop is destructured as `constructedLabel: _constructedLabel` and unused; the constructed-real row is only labeled "s" (line 115). The page ships diagonalConstructed strings for all 8 locales ("Constructed real", "Konstruierte reelle Zahl", …, app/cantor/page.tsx lines 125, 237, 352, 464, 576, 688, 800, 909) that dead-end into this ignored prop, so the intended caption never appears in any language.

_Fix:_ Either render the label next to the s row (e.g. as an aria-label/visible caption on the constructed row) or drop the prop and the 8 diagonalConstructed strings.


## cardioid

### 🔴 HIGH · math · `components/CardioidLightDemo.tsx:121`
**Amber 'envelope' overlay is the wrong cardioid and is flipped to open OUTSIDE the cup, detached from the rays it claims to envelope**

The code draws r = R(1−cosθ) centred at the source with angle theta+π: px = sx + r·cos(theta+π). Substituting u = θ+π gives r(u) = R(1+cos u), max 2R at u = 0 (+x), so the curve runs from the source (cx+R, cy) out to (cx+3R, cy), i.e. entirely outside the cup wall and mostly off-canvas (comment on line 120 even says 'opens toward −x (into the cup)'). Moreover, even un-flipped it is not the caustic. The drawn chords connect rim angle φ to 2φ (verified: hit at φ=π/2 → second intersection at π; φ=2π/3 → 4π/3). The envelope of the α→2α chord family solves to t = 1/3 constant, giving z(α) = R((2/3)e^{iα} + (1/3)e^{2iα}): cusp at z(π) = −R/3 (i.e. at (cx − R/3, cy), pointing away from the source) and far tip AT the source (z(0) = R). Cross-check via mirror equation: source at distance 2R from vertex, f = R/2 → image at 2R/3 from vertex = R/3 past centre. Tangency verified: chord (0,R)→(−R,0) touches z(α) at (−R/3, 2R/3) with matching tangent (−1,−1); chord at φ=2π/3 is the vertical tangent x = −R/2. So users see an amber heart poking out of the cup that no ray ever touches.

_Fix:_ Replace the polar loop with the true envelope: px = cx + R·((2/3)·cos(t) + (1/3)·cos(2t)), py = cy + R·((2/3)·sin(t) + (1/3)·sin(2t)) (source at angle 0 = (cx+R, cy)); delete the theta+π rotation and update the comment on lines 108–111.

### 🔴 HIGH · content · `app/cardioid/page.tsx:121`
**Story text in all 8 locales inverts the caustic geometry: cusp is NOT at the source and the far tip is NOT at 2R on the opposite wall**

lightHint (en line 121–122, and the equivalents in de/es/fr/it/pt/sv/no, e.g. de line 209–210) says 'Cusp at the source on the rim, far tip at distance 2R on the opposite wall', and Section 01 (line 85 en, mirrored in every locale) says the cardioid has 'its cusp at the source'. Recomputation (see the CardioidLightDemo finding): the catacaustic of a circle of radius R with a point source on the rim is the cardioid z(α) = R((2/3)e^{iα} + (1/3)e^{2iα}) whose smooth far tip is AT the source and whose cusp lies inside the cup at distance 4R/3 from the source (R/3 beyond the centre), confirmed by the paraxial mirror equation (1/2R + 1/s' = 2/R → image R/3 past centre). The caustic never reaches the opposite wall at all (max span 4R/3 < 2R). Every locale states the reversed picture as exact fact ('It is not an approximation; it is exact').

_Fix:_ Reword Section 01 and lightHint in all 8 locales: cusp points away from the light, sitting a third of a radius past the centre; the curve's far tip touches the rim at the source; total length of the axis is 4R/3, not 2R.

### 🔴 HIGH · math · `app/cardioid/page.tsx:90`
**Perimeter claim '8a' is wrong for the page's own equation r = 2a(1 − cos θ); the arc length is 16a**

Section 02 in all 8 locales (en line 90, de 178, es 266, fr 354, it 441, pt 528, sv 615, no 702) plus the English-only polar-form card at lines 869–872 claim 'its perimeter equals 8a — exactly eight times the parent radius'. Recomputation: for r = k(1 − cos θ), L = ∫₀^{2π} √(r² + r'²) dθ = k∫₀^{2π} √(2 − 2cosθ) dθ = k∫₀^{2π} 2|sin(θ/2)| dθ = 8k. With k = 2a (the page's equation, matching the rolling-circle construction with two circles of radius a) that is L = 16a, not 8a. The 8a figure belongs to r = a(1 − cos θ).

_Fix:_ Change '8a — eight times the parent radius' to '16a — sixteen times the parent radius' in all 8 locales and in the inline card at lines 869–872 (or restate the equation with half the scale).

### 🔴 HIGH · math · `app/cardioid/explorer/page.tsx:67`
**Cup mode reflects the parallel rays off the wrong (near, convex) hemisphere, so the drawn ray segments never touch the nephroid envelope**

Rays travel in −x from the right edge (moveTo(W+100, py), line 75) but are stopped and reflected at φ ∈ (−π/2, π/2), the RIGHT hemisphere (line 67) — the outside of the wall facing the light. Recomputed reflections: at φ=0 the reflected direction is (+1, 0) (straight back out to the right); at φ=π/4 it is (0, +1) (straight up from the rim). The reflected segments therefore fan outward/away from the cup interior, while the amber nephroid (b = R/4, cusps at ±R/2, drawn at lines 104–111 centred on the cup) sits in the middle untouched — e.g. the φ=π/4 tangent line x = 0.707R touches the nephroid at y = 0.354R, but the drawn segment starts at y = 0.707R and extends upward, away from the tangency point. Physically, light entering an open cup reflects off the FAR (left) hemisphere.

_Fix:_ Reflect at φ ∈ (π/2, 3π/2): draw the incoming ray from the right edge across the cup to the far-wall hit point, then the reflected segment back into the interior; the segments will then visibly hug the drawn nephroid.

### 🔴 HIGH · animation · `app/cardioid/explorer/page.tsx:239`
**Mandelbrot mode recomputes the full per-pixel fractal on every requestAnimationFrame tick, and the rAF loop never respects prefers-reduced-motion**

loop() (lines 233–242) calls drawMandelbrot() every frame while mode === 'mandelbrot', and drawMandelbrot (lines 171–213) does a complete createImageData + escape-time iteration (up to 40 iterations per pixel) over the whole canvas. The canvas fills the main pane (absolute inset-0, h-full w-full), so at e.g. 900×760 CSS px and dpr 2 that is ~2.7M pixels iterated 60 times per second — the frame rate collapses and the CPU burns continuously on a completely static image (contrast CardioidMandelbrotBridge, which at least caches into an ImageData ref). Additionally the explorer never checks prefers-reduced-motion, violating the repo convention that per-component canvases 'check the media query and freeze' — cup and mandelbrot modes redraw static content at 60fps and rolling mode keeps animating.

_Fix:_ Cache the rendered ImageData keyed on canvas size (as the bridge component attempts) and putImageData in the loop; skip re-drawing static modes when nothing changed, and freeze the rolling animation (draw one static frame) when matchMedia('(prefers-reduced-motion: reduce)') matches.

### 🟠 MED · content · `lib/i18n/placeholders.ts:141`
**Atlas card copy (EN fallback + DE) claims parallel sunlight in a cup envelopes a cardioid — parallel rays give a nephroid, as the explorer itself states on the same screen**

placeholders.ts:141 ('Shine a parallel beam of sunlight… That curve is a cardioid: r = 2a(1 − cos θ)') and lib/i18n/atlas.ts:335 (DE: 'Lass paralleles Sonnenlicht… Diese Kurve ist eine Kardioide') attach the cardioid equation to the parallel-ray caustic. The catacaustic of a circle under parallel rays is a nephroid (two cusps); the cardioid needs a point source on the rim — exactly what the story page's Section 05 and the explorer's own hint (app/cardioid/explorer/page.tsx:344–346, 'Parallel rays give a nephroid… A point source on the rim gives a cardioid') say. This body copy is rendered in the explorer sidebar (topic.body, explorer page line 275) directly above that contradicting hint, and on the landing atlas card. Same error also sits in the unused shared story (lib/i18n/stories.ts:1061 and stories.es.ts:979/985).

_Fix:_ Reword the atlas body in placeholders.ts and atlas.ts (and the shared stories.* cardioid intros) to use a small light/LED at the rim for the exact cardioid, or say the sunlight curve is 'nearly a cardioid (strictly a nephroid)'.

### 🟠 MED · content · `app/cardioid/page.tsx:105`
**False claim in Section 05 (all 8 locales): 'A cardioid rolling around a circle traces the astroid'**

en line 105, de 193, es 281, fr 369, it 456, pt 543, sv 630, no 717. The astroid is the 4-cusped hypocycloid traced by a point on a circle of radius a/4 rolling INSIDE a circle of radius a; it has nothing to do with a cardioid rolling around a circle (the roulette of a cardioid's cusp rolling on an equal cardioid is unrelated, and the classical neighbouring fact is that the catacaustic of a cardioid lit from its cusp is a nephroid). As written it teaches a nonexistent theorem in a section whose other two examples are correct.

_Fix:_ Replace with a true statement in all locales, e.g. 'a circle rolling inside a circle four times its size traces the astroid' or 'light shone from a cardioid's cusp reflects into a nephroid'.

### 🟠 MED · a11y · `components/CardioidLightDemo.tsx:166`
**Range sliders have no accessible name in both demos and the explorer; explorer canvas lacks an aria-label**

The ray-count slider (CardioidLightDemo.tsx:166–174), the parameter-t slider (CardioidMandelbrotBridge.tsx:185–193) and the explorer's Rays slider (app/cardioid/explorer/page.tsx:315–323) each render their visible label ('Rays' / 'Parameter t') in a sibling <div>, not in an associated <label> or aria-label, so screen readers announce an unnamed slider (the checkboxes nearby are correctly wrapped in <label>). The explorer canvas (app/cardioid/explorer/page.tsx:254) has no aria-label at all, unlike the two demo canvases which do.

_Fix:_ Give each range input an aria-label (reusing the already-passed rayCountLabel/paramLabel props) or wrap slider + caption in a <label>; add an aria-label to the explorer canvas describing the current mode.


## chaosgame

### 🔴 HIGH · math · `app/chaosgame/page.tsx:952`
**The "magic ratio" formula rₙ = 1/(1+2·cos(π/n)) is wrong for every n except 3 and 5, and it is shown and used everywhere in the room**

The correct kissing ratio for Sierpinski n-gons is rₙ = 1/(2(1+Σ_{k=1}^{⌊n/4⌋} cos(2πk/n))). Recomputation: n=6 → 1/(2(1+cos60°)) = 1/3 ≈ 0.3333, but the page formula gives 1/(1+√3) ≈ 0.3660 (geometric check: hexagon is centrally symmetric, adjacent sub-copies touch when (1−r)/(2r) = 1 → r = 1/3, so at 0.366 the six copies overlap and the attractor is not the promised clean self-similar set). n=8 → 1/(2(1+cos45°)) = 1/(2+√2) ≈ 0.2929, page gives 0.3512. n=4 → 1/2, page table asserts 1/(1+√2) ≈ 0.4142, contradicting the page's own section 04 text that r = 1/2 fills the square. The formula only coincidentally matches n=3 (1/2) and n=5 (1/φ² ≈ 0.382). It appears in: the section 04 body of all 8 locales (lines 174, 260, 346, 432, 518, 604, 690, 776), the rendered table (lines 952-981, including the wrong n=4 and n=6 notes), components/ChaosGameLive.tsx:18-19 (magic-ratio button), and app/chaosgame/explorer/page.tsx:25-27 plus the label at line 376, where "Auto magic ratio" is on by default, so the explorer renders an overlapping smear for n = 6-8 while claiming it is the clean attractor.

_Fix:_ Replace magicRatio with r = 1/(2*(1+sum_{k=1..floor(n/4)} Math.cos(2*Math.PI*k/n))) in ChaosGameLive.tsx, explorer/page.tsx, and the page table; update the formula text in the table caption, the explorer checkbox label, and the section 04 prose in all 8 locales (n=6 → 1/3; drop or correct the n=4 row).

### 🔴 HIGH · math · `app/chaosgame/explorer/page.tsx:26`
**magicRatio formula is wrong for every n except 3 — the Pentagon preset and the magic-ratio buttons draw a filled polygon instead of a fractal**

The code updates p' = p + r(v - p) (badge on line 279 says exactly this), so each map contracts distances to the vertex by (1 - r): the sub-copy scale is 1 - r, not r. The kissing sub-copy scale for a regular n-gon is s_n = 1/(2(1 + sum_{k=1..floor(n/4)} cos(2πk/n))) (s_3 = 1/2, s_4 = 1/2, s_5 = 1/φ² ≈ 0.382, s_6 = 1/3, s_8 = 0.293), so the magic JUMP ratio is r_n = 1 - s_n: 0.5, 0.5, 0.618, 0.667, 0.692, 0.707. The code's magicRatio(n) = 1/(1 + 2 cos(π/n)) gives 0.5, 0.414, 0.382, 0.366, 0.357, 0.351 — it only agrees at n = 3. Verified geometrically (hexagon copies of scale 1/3 at adjacent vertices touch exactly: center distance (1-s) = 2s) and by simulation: 200k-iteration chaos game with the site's r gives central-hole radius ≈ 0.001 for n = 4..8 (solid polygon, no fractal), while r = 1 - s_n gives hole radius 0.31-0.42 (clean Sierpiński n-gon). So the explorer's Pentagon preset (ratio: null → magic 0.382, copy scale 0.618, heavily overlapping maps) renders a filled pentagon, and autoMagic does the same for n = 4..8. Identical bug in components/ChaosGameLive.tsx lines 18-20 (the story page's '↺ magic ratio' button).

_Fix:_ In both app/chaosgame/explorer/page.tsx and components/ChaosGameLive.tsx replace magicRatio with: const s = 1/(2*(1 + Array.from({length: Math.floor(n/4)}, (_, k) => Math.cos(2*Math.PI*(k+1)/n)).reduce((a,b)=>a+b, 0))); return 1 - s; and update the 'Auto magic ratio · 1 / (1 + 2·cos(π/n))' checkbox label (explorer line 376). Note the ChaosGameLive slider max of 0.70 must rise to ≥ 0.71 to admit r_7 ≈ 0.692 (n max is 7 there).

### 🔴 HIGH · content · `app/chaosgame/page.tsx:174`
**Section 04 prose (all 8 locales) and the rendered magic-ratio table state the wrong magic ratios: r₅ = 1/φ² and r₆ = 1/(1+√3) instead of 1/φ ≈ 0.618 and 2/3**

The page defines r as the jump fraction in pₙ₊₁ = pₙ + r(vᵢ − pₙ) ('move halfway' ⇒ r = 1/2), so the magic value is 1 minus the kissing copy scale: r₅ = 1 − 1/φ² = 1/φ ≈ 0.618, r₆ = 1 − 1/3 = 2/3 ≈ 0.667, and for n = 4 the kissing ratio is exactly 1/2 (which is why the square fills — there is no unrestricted square fractal, contradicting the table's claim that 1/(1+√2) ≈ 0.4142 yields one). The prose 'rₙ = 1 / (1 + 2·cos(π/n)) … for n = 5 it is 1/φ² ≈ 0.382; for n = 6, 1/(1 + √3)' is repeated in every locale (EN 174, DE 260, ES 346, FR 432, IT 518, PT 604, SV 690, NO 776), and the table at lines 952-983 computes 0.4142/0.3820/0.3660/0.3569/0.3512 from the same wrong formula. Simulation confirms those values fill the polygon solid instead of producing self-similar attractors (central-hole radius ≈ 0.001 vs 0.31-0.42 for the correct values).

_Fix:_ Rewrite the formula in all 8 locale bodies and in the table header (line 952) as rₙ = 1 − 1/(2(1 + Σ_{k=1..⌊n/4⌋} cos(2πk/n))), compute the table cells with it (n=5 → 0.6180 = 1/φ, n=6 → 0.6667 = 2/3, n=7 → 0.6920, n=8 → 0.7071 = 1/√2), and drop or annotate the n = 4 row (its kissing ratio 1/2 degenerates to the filled square, as Section 04 itself explains).

### 🟠 MED · content · `app/chaosgame/page.tsx:345`
**Spanish section 04 title uses the nonword "halviar"; ES/PT render "gasket" as the literal calque "junta"**

Line 345: "Cuando halviar falla — y la regla que lo arregla" — "halviar" is not a Spanish verb (invented from English "halve"); Spanish readers see gibberish in a section heading. Additionally line 317 ("A los 5000 ves la junta") and the PT counterpart line 575 ("vês a junta") translate the fractal "gasket" with the mechanical-seal word "junta", which is not the term used for the Sierpinski gasket in either language.

_Fix:_ ES title: "Cuando dividir a la mitad falla — y la regla que lo arregla"; replace "la junta"/"a junta" with "el triángulo de Sierpiński" / "o triângulo de Sierpiński" (or "la criba"/"o crivo").

### 🟠 MED · animation · `components/ChaosGameLive.tsx:174`
**None of the three chaosgame canvases respects prefers-reduced-motion, and two of them run an unstoppable infinite rAF loop**

grep confirms no matchMedia/prefers-reduced-motion in components/ChaosGameLive.tsx, components/ChaosGameBarnsleyFern.tsx, or app/chaosgame/explorer/page.tsx, while other canvas components in the repo (TopicConstellation, signature heroes) all check it, and CLAUDE.md states per-component canvases must freeze. ChaosGameLive (line 142-174) and the explorer (line 172-237) additionally have no pause control at all: they draw 7000/1500+ points per frame and call setPoints/setTotalPoints forever (ChaosGameLive re-renders React state 60x/s indefinitely), even for reduced-motion users.

_Fix:_ Check window.matchMedia("(prefers-reduced-motion: reduce)") in all three components; on reduce, render a pre-computed static frame (e.g. run 30k iterations once synchronously) instead of starting the rAF loop, and stop the loop once a point budget is reached.

### 🟠 MED · i18n · `app/chaosgame/explorer/page.tsx:309`
**Explorer UI and several story-page blocks are hardcoded English for all 8 locales**

The explorer shows untranslated literals to every locale: "Presets", "Vertices n", "Jump ratio r", "Auto magic ratio", "Restriction", "None/No repeat/No neighbour/No opposite", "Speed · points/frame", "Dot colour", "Clear", "points" (line 287), preset labels (lines 39-49), and restrictionLabel() (lines 503-514) — sibling explorers (app/eulerchar/explorer, app/mobius/explorer) use a per-locale RICH_EXPLORER for exactly this. The story page, which is otherwise fully authored in 8 locales, also hardcodes English inside rendered boxes: "Three contracting maps" + explainer paragraph (page.tsx lines 903-911), the table header "shape" and "Magic ratio" label (lines 952-960), and "Hausdorff dimension" + explainer paragraph (lines 1023-1031).

_Fix:_ Add a RICH_EXPLORER Record<Locale, ...> for the explorer strings and move the story page's hardcoded box copy into the existing RICH_STORY entries.

### 🟠 MED · visual · `app/chaosgame/explorer/page.tsx:130`
**Canvas is wiped without resetting the point counter on speed/colour change and on every resize; paused fern stays blank after resize**

The explorer's main effect depends on speed and colorId (line 243) and calls sizeCanvas() on re-run, which reassigns canvas.width (line 130) and erases the accumulated fractal — but the restart effect (line 106) does not run for those deps, so countRef/totalPoints keep the old total: moving the speed slider or picking a colour blanks the picture while the label still claims e.g. "500,000 points". The same stale-counter wipe happens via ResizeObserver in all three components, and in ChaosGameBarnsleyFern (lines 84-86) a resize while paused clears the canvas permanently (the loop only runs when playing), leaving a blank image with a nonzero count.

_Fix:_ Reset countRef and the displayed count whenever the canvas is cleared (include speed/colorId in the restart effect or lift the clearing out of sizeCanvas), and in the fern redraw or resume one batch after resize while paused.

### 🟠 MED · a11y · `components/ChaosGameLive.tsx:190`
**Canvases have no accessible name and the slider labels are not associated with their inputs**

All three canvases (ChaosGameLive.tsx line 190, ChaosGameBarnsleyFern.tsx line 174, explorer/page.tsx line 283) lack role="img"/aria-label, so screen readers get nothing for the main content. In ChaosGameLive the <label> elements for the vertices and ratio sliders (lines 199, 216) neither wrap nor reference the <input type="range"> (no htmlFor/id), and the explorer's slider captions are plain <div>s (lines 330, 350, 412), so the range inputs are announced without names.

_Fix:_ Add aria-label (from the localized caption) and role="img" to each canvas; give the range inputs ids and htmlFor on their labels or aria-label props.

### 🟠 MED · i18n · `app/chaosgame/explorer/page.tsx:309`
**Explorer UI is hardcoded English for all 8 locales — no RICH_EXPLORER despite ~15 visible strings**

'Presets', 'Vertices n', 'Jump ratio r', 'Auto magic ratio', 'Restriction', 'None/No repeat/No neighbour/No opposite', 'Speed · points/frame', 'Dot colour', 'Clear', '... points' (line 287), preset labels 'Triangle/Square (no-repeat)/Pentagon/Barnsley fern', and restrictionLabel() output are all English literals. The repo convention (CLAUDE.md: explorers 'declare a local RICH_EXPLORER keyed by Locale if they need a lot of UI strings') is followed by app/eulerchar/explorer/page.tsx and app/mobius/explorer/page.tsx; here a German/French/... visitor gets a fully translated story page but an English-only explorer. Only u.back and the atlas topic header are localized.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, ...> covering the control labels, preset labels, restriction names, points label, and Clear, following the eulerchar explorer pattern.

### 🟠 MED · i18n · `app/chaosgame/page.tsx:903`
**English-only inset blocks on an otherwise fully localized story page**

The page authors all copy in 8 locales via RICH_STORY, but three visible blocks are English literals outside it: 'Three contracting maps' plus the explanation paragraph 'Each map contracts the plane by factor 1/2 ... is the Sierpiński triangle.' (lines 903-911), the magic-ratio table pretitle and 'shape' column header with English notes like 'Sierpiński triangle', 'heptagon', 'octagon' (lines 952-971), and 'Hausdorff dimension' plus 'The Sierpiński triangle has fractal dimension between a curve (1) and a region (2)...' (lines 1023-1031). German, French, etc. readers get English prose mid-page.

_Fix:_ Move these strings into the RichStory type (e.g. mapsCardTitle/mapsCardBody, tableTitle/tableShapeHeader/shapeNotes, dimensionTitle/dimensionBody) and fill them for all 8 locales.

### 🟠 MED · a11y · `app/chaosgame/explorer/page.tsx:283`
**Canvases have no accessible name and slider labels are not programmatically associated**

The explorer canvas (line 283), ChaosGameLive canvas (ChaosGameLive.tsx lines 190-194), and the fern canvas (ChaosGameBarnsleyFern.tsx lines 174-178) have no aria-label or role='img' — screen readers announce nothing for the central content (other repo components such as BackpropMiniNet, BanachFreeGroup, ApollonianDescartes do label their canvases). The explorer's range inputs (lines 336-345, 355-367, 417-425) have their captions in sibling <div>s, not <label htmlFor>/aria-label, so the n, ratio, and speed sliders are announced as unlabeled sliders; ChaosGameLive's <label> elements (lines 199, 216) likewise lack htmlFor and don't wrap their inputs.

_Fix:_ Add role='img' with a localized aria-label to each canvas, and give the sliders aria-label (or id + htmlFor) matching their visible captions.

### 🟡 LOW · content · `app/chaosgame/page.tsx:231`
**German prose uses ASCII straight quotes instead of German low-quotes or guillemets**

DE copy quotes with plain ASCII " pairs: line 231 '"verbotene" Region', line 236 '"geh halb zu Ecke i"', line 255 '(eine "Collage")', line 260 '("no repeat")'. The repo convention (CLAUDE.md) requires „text\" (escaped low-quotes) or «text» guillemets in German prose. No build breakage (the strings are single-quoted), but the rendered German shows English-style quotation marks.

_Fix:_ Replace the ASCII quote pairs in the de RichStory with „…“ low-quotes or «…» guillemets.

### 🟡 LOW · content · `app/chaosgame/page.tsx:169`
**Collage theorem dated 1988 in all locales; it was published 1985/86, only the chaos game itself dates to Barnsley's 1988 book**

Section 03 in every locale says "Michael Barnsley generalised the chaos game in 1988 with the collage theorem". The collage theorem was published earlier (Barnsley & Demko 1985, Proc. R. Soc. A; Barnsley et al. 1986, PNAS "Solution of an inverse problem for fractals"); 1988 is Fractals Everywhere, the book that introduced the chaos game. As written the sentence also implies the theorem came after the game, which inverts the actual chronology.

_Fix:_ Either date the collage theorem to 1985 or rephrase to credit the 1988 book Fractals Everywhere for popularising both (mirror the fix across all 8 locale bodies, lines 169, 255, 341, 427, 513, 599, 685, 771).

### 🟡 LOW · content · `app/chaosgame/page.tsx:231`
**German copy uses ASCII straight quotes instead of German low-quotes/guillemets**

The de RichStory uses plain ASCII double quotes: line 231 'jede "verbotene" Region' and line 260 '("no repeat")'. The repo convention (CLAUDE.md) mandates „…" (escaped) or «…» for German quotations. (Syntactically safe here because the JS strings are single-quoted, but it violates the typography convention; the other locales use their native ASCII quotes too, which is consistent with the repo only mandating this for German.)

_Fix:_ In the de object replace "verbotene" with „verbotene“ and ("no repeat") with („no repeat“) or guillemets.

### 🟡 LOW · visual · `app/chaosgame/explorer/page.tsx:20`
**Explorer violet dot colour does not match the palette token its swatch shows**

COLORS violet draws with 'rgba(168, 132, 255, 0.55)' (#a884ff) while its swatch css is bg-signal-violet and palette.signal.violet is #b388ff = rgb(179, 136, 255) (components/ChaosGameLive.tsx line 13 uses the correct 179,136,255). So the explorer's violet swatch and the dots it paints are two different violets, and the rgba literals bypass the palette tokens the recent refactor commits standardized on.

_Fix:_ Derive the draw colours from palette.signal.* (e.g. a small hexToRgba helper) so the swatch and canvas colour stay in sync; fixes the 168→179/132→136 mismatch. Same helper can replace the hardcoded rgba amber/cyan literals in ChaosGameLive.tsx (which also shadows the imported palette with a local array on line 153).


## collatz

### 🔴 HIGH · math · `app/collatz/page.tsx:135`
**treeBody claims the reverse tree holds "hundreds of integers" at depth 14, but the widget's own algorithm produces only 79 nodes**

Recomputation: replicating CollatzReverseTree.buildTree exactly (child 2n always; child (n-1)/3 when n>1, (n-1)%3==0, m>1 and m odd) gives node counts: depth 8 = 17, depth 10 = 29, depth 14 = 79. The component even displays nodes.length next to the copy, so users see "79" under a paragraph claiming "At depth 14 the tree already holds hundreds of integers." The false claim is repeated in all 8 locales (en 135, de 230, es 325, fr 420, it 515, pt 610, sv 705, no 800). The reverse Collatz tree genuinely grows slowly (~1.26x per level), so "hundreds" is simply wrong for depth 14.

_Fix:_ Change the copy in all 8 locales to the true figure (e.g. "at depth 14 the tree holds 79 integers" or reword to "dozens"), or raise the widget's maxDepth until the claim is true (depth ~20+ reaches hundreds).

### 🔴 HIGH · math · `components/CollatzTrajectoryPlot.tsx:34`
**Number arithmetic silently overflows 2^53 for allowed seeds (input max 1e9), rendering a mathematically wrong orbit, stopping time and peak**

The input allows max={1_000_000_000} (line 170) but collatzOrbit uses IEEE doubles. For seed 319 804 831 (≤ 1e9) the true orbit (BigInt recomputation) has 592 steps and peak 1 414 236 446 719 942 480 ≈ 1.41e18, far above 2^53 = 9 007 199 254 740 992. Once values exceed 2^53 the parity test n % 2 runs on rounded numbers, so the component displays a wrong trajectory: float math yields 486 steps and peak 11 483 138 644 914 128. Both stats shown to the user ("Stopping time", "Maximum height") are incorrect for such in-range seeds.

_Fix:_ Either lower the input max to a range whose peaks stay below 2^53 (e.g. 1e6, like the explorer's MAX_SEED, whose worst peak is ~5.7e10), or compute the orbit with BigInt and convert to Number only for plotting.

### 🔴 HIGH · content · `app/collatz/page.tsx:105`
**Tao's 2019 theorem is misstated as "natural density 1"; the result is in logarithmic density**

Section 04 (all 8 locales) says the set of starting integers whose orbit drops below f(n) "has natural density 1" (de line 200 "natuerliche Dichte 1", es line 295 "densidad natural 1", etc.). Tao's paper "Almost all orbits of the Collatz map attain almost bounded values" proves the statement for almost all N in the sense of logarithmic density, explicitly not natural density; the natural-density version of his theorem remains open. Stated as a theorem attribution, this is a factual error.

_Fix:_ Replace "natural density 1" with "logarithmic density 1" in all 8 locale strings of the Section 04 body.

### 🟠 MED · content · `app/collatz/page.tsx:105`
**Tao 2019 result misstated: the theorem gives logarithmic density 1, not "natural density 1"**

Section 04 says the set of starting integers whose orbit drops below f(n) "has natural density 1". Tao's paper 'Almost all orbits of the Collatz map attain almost bounded values' (arXiv:1909.03562) proves the result for logarithmic density; Tao explicitly notes that 'almost all' is in the logarithmic-density sense and that upgrading to natural density is open. The error is replicated in all 8 locales (de 200 'natürliche Dichte 1', es 295, fr 390, it 485, pt 580, sv 675, no 770).

_Fix:_ Replace "natural density 1" with "logarithmic density 1" in all 8 locales (the surrounding prose otherwise describes the result correctly).

### 🟠 MED · content · `app/collatz/page.tsx:120`
**closingBody promises explorer features that do not exist: "far greater depths" and "race seeds side by side"**

The closing copy (all 8 locales) says the Explorer "grows the reverse coral to far greater depths, and lets you race seeds side by side". In app/collatz/explorer/page.tsx the tree-depth slider is capped at max={10} (line 460) with a 280-node cap (line 163), which is shallower than the story widget's own maxDepth 14 (29 nodes at depth 10 vs 79 at depth 14). And the explorer holds a single seed state (useState(27)); there is no side-by-side / multi-seed comparison feature anywhere in the file.

_Fix:_ Either fix the copy in all 8 locales (drop "far greater depths" and the racing claim), or raise the explorer's depth cap above 14 and implement the multi-seed comparison it advertises.

### 🟠 MED · i18n · `app/collatz/explorer/page.tsx:289`
**Explorer UI is almost entirely hardcoded English with no RICH_EXPLORER, so 7 of 8 locales see English labels**

Only topic.title/tagline/body (from atlas) and u.back are localized. Everything else is English literals: "Hailstone trajectory · n = ..." (208), Stat labels "Starting n / Steps to 1 / Peak value / Peak at step" (289-292), "Inverse coral · backwards tree rooted at 1" (296), "Inverse tree hidden" (350), "Seed n" (367), "slider: 1 … 10 000" (400), "Stats/Steps/Peak value/Peak step/Path length" (425-435), "Show inverse tree" (442), "Tree depth" (453), and the explanation paragraph (466-470). The repo's own pattern for this (RICH_EXPLORER: Record<Locale, ...>) is used in app/mobius/explorer/page.tsx and app/eulerchar/explorer/page.tsx, and the collatz story page translates every widget string into all 8 locales, so a German or French reader gets a jarring English explorer.

_Fix:_ Add a local RICH_EXPLORER: Record<Locale, ...> covering these strings, following app/mobius/explorer/page.tsx.

### 🟠 MED · a11y · `app/collatz/explorer/page.tsx:386`
**Interactive controls lack accessible names; SVGs lack img semantics**

Explorer: the seed range slider (line 386) and tree-depth range slider (line 456) have no aria-label, and the seed number input (line 370) has no associated label ("Seed n" is a plain div, line 367); both large SVGs (lines 216, 301) have no role="img"/aria-label/title, so screen readers get nothing for the main visualisations. Same pattern in the story widgets: components/CollatzTrajectoryPlot.tsx line 164 renders a <label> without htmlFor and the input (167) has no id, so they are not programmatically associated; components/CollatzReverseTree.tsx line 178 range input has no aria-label (its depthLabel sits in a sibling div).

_Fix:_ Add htmlFor/id pairs (or wrap inputs in the label), aria-label on the range sliders using the existing localized label strings, and role="img" + aria-label on the explorer SVGs.

### 🟠 MED · content · `app/collatz/page.tsx:100`
**Page contradicts itself on the verification bound: 2^68 (~3 x 10^20) in the intro/cards vs 2.36 x 10^21 in Section 03**

The intro (line 59) and card 03 (line 80) say computers have checked every integer "up to roughly 2^68 — about 3 x 10^20 checks", while Section 03 (line 100) and the hardcoded formula-box annotation (line 1008) say "as of 2025 verified ... up to about 2.36 x 10^21" (= 2^71). Both are presented as the current bound on the same page, an 8x discrepancy repeated across all locales. The atlas copy in lib/i18n/atlas.ts (e.g. line 360) also uses 2^68.

_Fix:_ Pick one bound and use it consistently, e.g. keep 2^68 (~2.95 x 10^20, the published Barina result) everywhere, or explain the pair explicitly (published 2^68 in 2020, ongoing distributed check ~2^71 as of 2025).

### 🟠 MED · i18n · `app/collatz/explorer/page.tsx:208`
**Explorer UI is entirely hardcoded English on an 8-locale site**

Apart from a.topics.collatz and u.back, every visible string is an English literal shown to all locales: "Hailstone trajectory · n =" (line 208), "Seed n" (367), "slider: 1 … 10 000 · input: ..." (400), "Stats", "Steps", "Peak value", "Peak step", "Path length" (428-435), "Show inverse tree" (442), "Tree depth" (453), the whole explanation paragraph (466-470), "Inverse tree hidden" (350), the Stat labels "Starting n", "Steps to 1" (289-292), and the FAMOUS_SEEDS labels "111 steps · peak 9232" (8-13). The repo convention (CLAUDE.md) is a local RICH_EXPLORER Record<Locale, ...> for exactly this case, and the sibling story page localises the equivalent strings (trajectoryStepsLabel, treeDepthLabel, ...) for all 8 locales.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, ...> covering these strings (the story page's RichStory already contains translations for most of them that can be reused).

### 🟠 MED · i18n · `app/collatz/page.tsx:1006`
**Conjecture formula box carries an English-only paragraph shown under all locales**

The JSX block at lines 1006-1009 ("For every positive integer n there is a finite number of steps k after which T iterated k times lands on 1. Verified for n <= 2.36 x 10^21. Never proved.") is a hardcoded literal outside RICH_STORY, so German/Spanish/etc. readers get an English paragraph in the middle of an otherwise fully localised page. Every other piece of prose on this page goes through RICH_STORY[locale].

_Fix:_ Move the sentence into RichStory (e.g. conjectureNote) with translations for all 8 locales, like erdosNote directly below it.

### 🟠 MED · math · `components/CollatzTrajectoryPlot.tsx:173`
**Seed input has no upper clamp, so typed seeds beyond 2^53 render silently wrong orbits**

The onChange handler only checks `Number.isFinite(v) && v >= 1`; the HTML max={1_000_000_000} attribute does not constrain typed input, so any value can enter state. For typed seeds above Number.MAX_SAFE_INTEGER (9.007e15), the double is already rounded (e.g. Number("100000000000000003") === 100000000000000000) and 3n+1 loses the +1, so parity tests and the plotted orbit are mathematically wrong with no warning. The explorer page handles this correctly (applySeedInput rejects values above MAX_SEED = 1e6); this component has no equivalent guard. (Seeds within the advertised 1e9 range are safe: I verified the largest excursion there, 966,616,035,460 for n = 670617279/63728127, stays far below 2^53.)

_Fix:_ Clamp in onChange, e.g. `setSeed(Math.min(1_000_000_000, Math.floor(v)))`, mirroring the explorer's applySeedInput guard.

### 🟠 MED · a11y · `components/CollatzTrajectoryPlot.tsx:164`
**Interactive controls lack accessible names / label association across both demos and the explorer**

components/CollatzTrajectoryPlot.tsx line 164: the <label> for the seed input has no htmlFor and the input (line 167) has no id, so screen readers announce an unlabeled spinbutton. components/CollatzReverseTree.tsx line 178: the depth range input has no aria-label; its visible caption is a plain div (line 174). app/collatz/explorer/page.tsx: the seed number input (line 370), seed slider (line 386) and tree-depth slider (line 456) have no accessible names, and the two data-bearing SVGs (lines 216, 301) have no role="img"/aria-label (the story components do set aria-labels on their canvas/SVG).

_Fix:_ Add id/htmlFor pairs for label+input, aria-label on the three sliders and the explorer seed input (reusing the existing i18n strings), and role="img" + aria-label on the two explorer SVGs.

### 🟡 LOW · i18n · `app/collatz/page.tsx:195`
**German generic masculine "Zahlentheoretikern" violates the repo's gender-neutral German rule**

de section 03 reads "unabhängig von Kakutani, Ulam und den Zahlentheoretikern in Syracuse wiederentdeckt". CLAUDE.md mandates gender-neutral German prose (Studierende, Mathematiker:innen); this is the only generic-masculine noun in the German copy of this room.

_Fix:_ Change to "den Zahlentheoretiker:innen in Syracuse".

### 🟡 LOW · visual · `components/CollatzTrajectoryPlot.tsx:107`
**Hardcoded colour literals duplicate existing palette tokens across the collatz room**

After the recent palette-token sweep (commits d3b/2bf/7bf), several literals remain that are exact duplicates of tokens in lib/visual/palette.ts: CollatzTrajectoryPlot.tsx line 107 "rgba(255,122,182,0.9)" (= signal.rose #ff7ab6) and line 91 "rgba(138,144,164,0.18)" (= canvas.muted #8a90a4); app/collatz/page.tsx lines 858-859 "#06070d" (= canvas.bg) and "rgba(255,122,182,0.9)"; app/collatz/explorer/page.tsx lines 229 (canvas.muted), 244 and 321 "rgba(255, 209, 102, …)" (= signal.amber #ffd166), 337 "#e6e8ef"; components/CollatzReverseTree.tsx line 165 "#e8eaf2" (near-duplicate of ink.100 #eaecf3).

_Fix:_ Replace with palette tokens plus alpha (e.g. derive rgba from palette.signal.rose, or use the token with strokeOpacity/fillOpacity as the neighbouring code already does).

### 🟡 LOW · i18n · `app/collatz/page.tsx:195`
**German copy uses non-gender-neutral "Zahlentheoretikern"**

DE Section 03 body: "unabhaengig von Kakutani, Ulam und den Zahlentheoretikern in Syracuse wiederentdeckt". The repo convention (CLAUDE.md: gender-neutral German, e.g. Mathematiker:innen) requires the gender-neutral form here; the rest of the German copy on the page complies.

_Fix:_ Change to "den Zahlentheoretiker:innen in Syracuse".


## dla

### 🔴 HIGH · content · `app/dla/explorer/page.tsx:53`
**"fast" preset note says "80 walkers/frame" but the preset actually sets 300 walkers, in all 8 locales**

PRESETS (line 22) defines { id: "fast", walkers: 300 }, while the note shown on the preset card says "80 walkers/frame" (en line 53, de line 75 "80 Wanderer/Frame", es 97, fr 119, it 141, pt 163, sv 185, no 207). 80 is the walker count of the "classic" preset (line 21), so the label was copy-pasted onto the wrong card. Clicking the card sets the slider and status badge to 300, directly contradicting the note the user just read.

_Fix:_ Change the note to "300 walkers/frame" (and its translations) in all 8 COPY locales, or change the preset to walkers: 80.

### 🟠 MED · content · `app/dla/explorer/page.tsx:53`
**"Fast" preset note says "80 walkers/frame" but the preset sets walkers: 300 (80 belongs to "classic"), in all 8 locales**

PRESETS (lines 21-22) define classic = 80 walkers and fast = 300 walkers, yet the note rendered on the fast preset card reads "80 walkers/frame" in every locale (en line 53, de 75, es 97, fr 119, it 141, pt 163, sv 185, no 207). Users clicking "Centre · fast" get 300 walkers while the card claims 80.

_Fix:_ Change the fast note to "300 walkers/frame" (and the localized equivalents), or derive the number from the Preset object so copy cannot drift from the data.

### 🟠 MED · math · `app/dla/explorer/page.tsx:390`
**Walkers can step onto already-frozen cells when stickiness < 1: they tunnel through arms, overwrite grid cells, and the "stuck" counter overcounts**

step() moves a walker (lines 379-388) with no occupancy check, then sticks it if hasStuckNeighbour && Math.random() < stickiness (line 390). With stickiness < 1 a walker adjacent to the cluster that fails the stick roll can, on the next tick, move ONTO a frozen cell (grid[idx] > 0). It then passes the neighbour test (interior cells have frozen neighbours), so line 393 overwrites grid[idx] and line 394 increments stuckCount even though no new cell was added, so the displayed stuck count exceeds the true cluster size. Walkers can also walk straight through one-cell-thick branches and freeze in the interior, which is not DLA (in DLA the cluster is impenetrable; low stickiness only delays surface attachment, exactly what the story's Section 06 describes: "walkers bounce off the cluster a few times before freezing"). Identical bug in components/DlaMiniSim.tsx lines 103-120.

_Fix:_ Before accepting a move, reject steps into occupied cells (revert the coordinate if grid[target] > 0), and/or only freeze when grid[idx] === 0 so stuckCount stays correct. Apply the same fix in DlaMiniSim.tsx.

### 🟠 MED · content · `app/dla/page.tsx:273`
**Story claims a ring seed makes the coral grow inwards, but the explorer spawns all walkers outside the ring, so it grows outwards**

Section 06 in every locale says the ring variant grows inwards (en line 273 "swap it for a ring and the coral grows inwards", de line 351 "die Koralle wächst nach innen", etc.), and the explorer's ring preset note says "inside-out coral". But spawnWalker in app/dla/explorer/page.tsx (lines 344-354) uses the same spawn circle of radius min(gridW,gridH)/2 - 2 for point and ring seeds, while the ring itself has radius min/3 (line 318). Since min/2 - 2 > min/3 for any grid larger than ~12 cells, every walker starts outside the ring and accretes on its outer edge; the interior stays empty. Inward growth requires spawning walkers inside the ring.

_Fix:_ In spawnWalker, special-case seed === "ring" to spawn walkers inside the ring (e.g. uniformly in a disc of radius r - 2 around the centre), which also matches the preset note.

### 🟠 MED · i18n · `components/DlaMiniSim.tsx:172`
**Mini-sim UI is hardcoded English on an otherwise fully 8-locale story page**

The page passes only a localized caption; every other visible string in DlaMiniSim is EN-only: "centre seed" (line 172), "{n} stuck" (line 175), "Walkers / frame" (line 181), "Stickiness" (line 190), "Pause"/"Play" (line 207), "Reset" (line 213), and the explanatory paragraph "More walkers · faster growth..." (lines 216-219). A German or Spanish reader of /dla gets an English control panel in the middle of a fully translated story, while the sibling explorer localizes exactly these strings for all 8 locales.

_Fix:_ Extend Props with the needed labels (or a small labels object) and add them to the RichStory per-locale data in app/dla/page.tsx, mirroring how miniSimCaption is already passed.

### 🟠 MED · visual · `app/dla/explorer/page.tsx:229`
**Explorer colour option draws the cluster in signal-rose pink but shows a signal-coral orange swatch**

COLORS.rose (lines 229-235) pairs rgb "255, 122, 182" (= palette.signal.rose #ff7ab6, pink) with tw/border/bg/swatch classes all using signal-coral (#ff8a5c, orange). The swatch button the user clicks renders orange (bg-signal-coral, line 234) while the canvas paints the cluster pink, and the selected-state border/badge tint (coral) never matches what is drawn. The other three entries (cyan, violet, amber) are internally consistent.

_Fix:_ Make the entry self-consistent: either rgb "255, 138, 92" (#ff8a5c) to match the coral classes and the page's coral accent, or switch the classes to text-signal-rose/border-signal-rose/bg-signal-rose.

### 🟠 MED · animation · `app/dla/explorer/page.tsx:425`
**Neither DLA canvas checks prefers-reduced-motion; both run an unconditional rAF loop with no static fallback**

The explorer effect (lines 279-441) and DlaMiniSim (lines 35-160) start requestAnimationFrame loops that animate indefinitely regardless of the user's motion preference. The repo convention (CLAUDE.md: "Per-component canvases also check the media query and freeze", implemented in TopicConstellation, all signature heroes, StarField, Reveal, and app/diffusion/explorer/page.tsx) is not followed; the global CSS reduced-motion rule only affects CSS animations, not canvas rAF drawing.

_Fix:_ Read matchMedia("(prefers-reduced-motion: reduce)") in the effect; when it matches, grow the cluster synchronously for a fixed number of steps and draw one static frame instead of looping (subscribe to changes like the other components do).

### 🟠 MED · a11y · `app/dla/explorer/page.tsx:634`
**Range sliders have no accessible name and the simulation canvases have no role/aria-label**

In both SliderRow implementations (app/dla/explorer/page.tsx lines 628-644, components/DlaMiniSim.tsx lines 243-258) the visible label is a sibling <div>, and the <input type="range"> carries no aria-label, id/htmlFor, or aria-labelledby, so screen readers announce an unnamed slider for walkers/stickiness/cell size. The <canvas> elements (explorer line 456, DlaMiniSim line 169) also expose no role="img"/aria-label, unlike the page's decorative SVGs which do (page.tsx lines 71-72, 122-123).

_Fix:_ Give the input an id and wrap the label text in <label htmlFor> (or set aria-label={label}), and add role="img" plus a localized aria-label to both canvases.

### 🟠 MED · math · `app/dla/explorer/page.tsx:319`
**Ring seed is sampled with a fixed 360 steps, leaving gaps in the ring at default settings on desktop viewports**

seedCluster draws the ring by rounding 360 points on a circle of radius r = min(gridW, gridH)/3 (lines 318-331). The ring is gap-free only while its circumference 2*pi*r <= 360, i.e. r <= 57.3, i.e. min(gridW, gridH) <= 172. At the default cell = 3 the canvas pane is min-h-[calc(100vh-3.5rem)]; on a ~1000 px tall viewport gridH = clientHeight/cell (DPR cancels since both canvas.width and cellPx scale by dpr) is roughly 315, so r is about 105 and the circumference about 660 cells: consecutive samples land ~1.8 cells apart, and at cell = 2 about 2.8 cells apart. The "ring" renders as a dotted circle with holes that walkers stream through, so the seed is not a closed ring.

_Fix:_ Make the step count depend on the radius, e.g. const steps = Math.ceil(2 * Math.PI * r * 2), or rasterise the circle with a midpoint-circle algorithm.

### 🟠 MED · i18n · `components/DlaMiniSim.tsx:172`
**DlaMiniSim UI is hardcoded English inside a fully 8-locale story page**

The story page localises everything (RICH_STORY covers all 8 locales) and passes only `caption` to <DlaMiniSim/> (app/dla/page.tsx line 916). But the component hardcodes "centre seed" (line 172), "stuck" (line 175), "Walkers / frame" (line 181), "Stickiness" (line 190), "Pause"/"Play" (line 207), "Reset" (line 213) and the whole explainer paragraph "More walkers · faster growth. Lower stickiness · denser, blobbier cluster..." (lines 216-219). German, Spanish, etc. readers get an English control panel in the middle of an otherwise translated page, while the full Explorer localises exactly these strings via COPY.

_Fix:_ Extend Props with the labels (walkersLabel, stickinessLabel, play/pause/reset, seedBadge, stuckLabel, hint) and add them to RichStory in app/dla/page.tsx for all 8 locales, mirroring the explorer's COPY.

### 🟠 MED · a11y · `components/DlaMiniSim.tsx:35`
**Neither DLA canvas checks prefers-reduced-motion; the rAF simulation autoplays on mount with no static fallback**

DlaMiniSim starts with running = true and requestAnimationFrame loops unconditionally (lines 145-154); app/dla/explorer/page.tsx does the same (lines 425-434). Neither file contains a matchMedia("prefers-reduced-motion") check (grep confirms zero hits), while the repo convention (CLAUDE.md: "Per-component canvases also check the media query and freeze") is followed by comparable components: app/diffusion/explorer/page.tsx, components/BackpropMiniNet.tsx, and all signature heroes. Users with reduced-motion get a permanently animating flicker of hundreds of walker cells.

_Fix:_ Read the prefers-reduced-motion media query in both effects; when it matches, initialise running to false (or run the sim a fixed number of synchronous steps and draw one static frame) and re-check on the media query's change event.

### 🟠 MED · content · `lib/i18n/atlas.ts:305`
**German atlas card says Witten and Sander "bewiesen" (proved) D ≈ 1.71; it is a numerical result, no proof exists, and EN says "showed"**

DE body: "Witten und Sander bewiesen 1981, dass das Ergebnis ... eine fraktale Dimension von ≈ 1,71 hat". The EN source (lib/i18n/placeholders.ts line 110) correctly says "showed". Witten & Sander's 1981 PRL paper measured the dimension from simulations; the value ≈ 1.71 has never been mathematically proven (rigorous results are limited to bounds, e.g. Kesten's growth bound), so "bewiesen" both overstates the mathematics and diverges from the EN text.

_Fix:_ Replace "bewiesen" with "zeigten" in the DE atlas body.

### 🟡 LOW · i18n · `app/dla/page.tsx:944`
**Big dimension display hardcodes "≈ 1.71" with a decimal point for all locales, while the surrounding prose uses "1,71"**

The Section 04 callout renders the literal string "≈ 1.71" (line 944) regardless of locale, but the localized bodies right next to it write the decimal-comma form "1,71" in de (line 341), es (420), fr (499), it (578), pt (656), sv (735), and no (813). The same panel therefore shows both notations at once for 7 of 8 locales.

_Fix:_ Move the display string into RichStory (e.g. dimensionValue: "≈ 1,71" for comma locales) or format via locale-aware number formatting.

### 🟡 LOW · visual · `app/dla/explorer/page.tsx:229`
**COLORS.rose pairs the rose canvas colour (255,122,182 = palette.signal.rose #ff7ab6) with signal-coral swatch/border classes (#ff8a5c), so the picker swatch does not match what is drawn**

COLORS.rose (lines 228-235) draws the cluster with rgb "255, 122, 182", which is exactly palette.signal.rose (#ff7ab6, pink), but its tw/border/bg/swatch classes are all signal-coral (#ff8a5c = rgb(255,138,92), orange). The colour picker therefore shows an orange swatch while the canvas paints pink. The story page has the same drift: page accent is coral, but DendriteSVG/TipsVsValleysSVG (app/dla/page.tsx lines 82, 127) and DlaMiniSim hardcode rgba(255,122,182,...) literals instead of palette tokens.

_Fix:_ Make the first entry self-consistent: either rgb "255, 138, 92" with the existing signal-coral classes (matching the page accent), or keep the rgb and switch the classes to signal-rose; derive the rgb strings from palette.signal.* instead of literals.


## doublependulum

### 🔴 HIGH · code · `app/doublependulum/explorer/page.tsx:151`
**Pause button (and Ghost toggle) silently resets the explorer simulation to initial conditions**

The main effect reinitializes mainRef/ghostRef to {th1: initTh1, th2: initTh2, w1: 0, w2: 0} at lines 151-152 and clears the trails, and its dependency array at line 337 includes `running` and `showGhost`. Clicking Pause therefore tears the effect down and re-runs it, snapping the pendulum back to its start pose and wiping the trail; clicking Play resets it again. Toggling the ghost twin has the same destructive effect. Pause is functionally identical to Reset, which is clearly not the intended behavior (there is a separate Reset button driven by resetTick).

_Fix:_ Move the sim state and trail buffers out of the effect into refs that survive re-runs (as DoublePendulumSim does with stateRef), reinitialize them only in a separate effect keyed on [initTh1, initTh2, trailLen, resetTick], and read `running`/`showGhost` from refs inside the rAF loop instead of listing them as effect deps.

### 🔴 HIGH · code · `components/DoublePendulumTwin.tsx:122`
**Pausing the twin-divergence demo restarts both pendulums from t = 0, destroying the experiment it demonstrates**

States `a`, `b`, `simT`, `trailA`, `trailB` are all local to the effect (lines 120-128) and the dep array at line 255 includes `running`. Toggling Pause re-runs the effect, resetting both pendulums to the initial 120° / 120°+10⁻⁵° configuration and simT to 0, while the stats readout keeps showing the stale pre-pause t until the next 0.1s sample, then jumps back to ~0.1s. The whole point of the demo is watching divergence accumulate over time, and any pause silently discards it. (Also, the header comment at line 7 says "one starts at θ₁ = 90°" but INIT_TH1_DEG is 120.)

_Fix:_ Hold a/b/simT and the trails in refs initialized on mount and on resetTick only; gate integration on a runningRef read inside the loop rather than re-running the effect on `running`. Fix the 90° comment to 120°.

### 🔴 HIGH · content · `app/doublependulum/page.tsx:141`
**Section five calls the high-energy Poincaré cloud "the chaotic attractor", which is impossible in this frictionless system**

The page repeatedly and correctly stresses the model has no friction ("completely free of friction or noise", section two), i.e. it is a conservative Hamiltonian system. By Liouville's theorem such systems preserve phase-space volume and cannot have attractors of any kind; the correct term for the fuzzy high-energy region is the chaotic sea / stochastic layer, which the page itself uses in the Poincaré caption (line 1219-1220, "chaotic sea") and in RegimeChaosBody. The wrong parenthetical "(the chaotic attractor)" is replicated in all 8 locales (en line 141, de line 261 "der chaotische Attraktor", es line 381, fr line 501, it line 621, pt line 741, sv line 861, no line 981).

_Fix:_ Replace "(the chaotic attractor)" with "(the chaotic sea)" and the corresponding term in the other 7 locales.

### 🔴 HIGH · code · `app/doublependulum/explorer/page.tsx:337`
**Pause button resets the whole simulation instead of freezing it**

The sim effect initializes mainRef/ghostRef and clears the trails inside its body (lines 151-163), and `running` is in the dependency array (line 337). Clicking Pause therefore tears down and re-runs the effect: the pendulum snaps back to the initial angles, trails are wiped, and Play restarts from t=0. The same happens when toggling 'Ghost twin' (`showGhost` is also a dep). The comment claims re-running is intentional 'when any of these change', but that is only sensible for physical params; a Pause control that loses all progress contradicts its label. DoublePendulumSim.tsx shows the intended pattern: state lives in a ref outside the effect so toggling `running` preserves it.

_Fix:_ Move the state/trail initialization out of the render effect (e.g. into refs initialized in a separate effect keyed only on [m1, m2, L1, L2, g, initTh1, initTh2, trailLen, resetTick]), or gate the re-init so it does not run when only `running`/`showGhost` changed.

### 🔴 HIGH · code · `components/DoublePendulumTwin.tsx:255`
**Pause resets both twin pendulums to t=0 while the t/|Δ| readout keeps stale values**

`a`, `b`, `simT`, and the trails are declared inside the useEffect (lines 120-128) whose deps include `running` (line 255). Pressing Pause re-runs the effect, reinitializing both pendulums to θ₁=120°, θ₂=−10° and clearing the trails, so the demo cannot be paused mid-divergence, which is the entire point of the demo. Meanwhile `stats` (t and |Δ|) is React state that is not reset, so the UI shows e.g. 't 12.30s · |Δ| 3.1e+0' next to two pendulums frozen in their initial pose. The sibling DoublePendulumSim keeps its state in a ref outside the effect and pauses correctly.

_Fix:_ Hoist `a`/`b`/`simT`/trails into refs initialized in an effect keyed only on `resetTick` (and reset `stats` there), so toggling `running` only starts/stops integration.

### 🔴 HIGH · code · `components/DoublePendulumTwin.tsx:255`
**Pause button silently resets the twin-divergence experiment instead of pausing it**

All simulation state (a, b, simT, trails) is initialized inside the useEffect body (lines 120-127), and `running` is in the dependency array (line 255). Toggling Pause tears down and re-runs the effect, re-creating both pendulums at the initial angles with simT = 0. Pressing Play re-runs it again, so the sim always restarts from t = 0. Worse, `stats` is not reset on pause, so the readout keeps showing the old t (e.g. 12.30s) while the sim has restarted; after Play it jumps back to 0.1s. The whole point of this demo is watching t and |delta| grow, and Pause destroys that. Contrast DoublePendulumSim, which keeps state in a ref outside the effect and pauses correctly.

_Fix:_ Move a/b/simT/trails into refs initialized on mount and on resetTick only; keep `running` out of the init path (read it via a ref inside the rAF loop, or gate stepping without re-running the effect).

### 🟠 MED · i18n · `app/doublependulum/explorer/page.tsx:375`
**Explorer UI is entirely hardcoded English for all 8 locales**

Every control label is an English literal: "m₁ — upper mass" (375), "L₁ — upper rod (px)" (403), "g — gravity (px/s²)" (431), "θ₁ initial" (447), "Speed (× real time)" (477), "Time step dt" (490), "Trail length" (503), "❚❚ Pause"/"▶ Play" (527), "Ghost twin · on/off" (544), "Readout" (550), "divergence = … (ghost off)" (557), and the blow-up toast "Numerical blow-up — resetting" (359). The story page ships a full 8-locale RICH_STORY (which even defines play/pause/reset translations), so German, French etc. users get a fully translated story followed by an all-English explorer. The repo convention is a local RICH_EXPLORER keyed by Locale for exactly this case.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, ...> covering the control labels, toggle states, readout captions, and the blow-up hint, mirroring the pattern used in other explorers.

### 🟠 MED · animation · `components/DoublePendulumSim.tsx:112`
**None of the three doublependulum canvases respect prefers-reduced-motion; all autoplay indefinitely**

DoublePendulumSim, DoublePendulumTwin, and the explorer all start with running=true and run an unconditional requestAnimationFrame loop; none of the three files contains a matchMedia("prefers-reduced-motion") check (verified by reading all three in full). CLAUDE.md states "Per-component canvases also check the media query and freeze", and other demos in the repo follow this. Motion-sensitive users get three perpetually animating canvases with no static fallback.

_Fix:_ On mount, read matchMedia("(prefers-reduced-motion: reduce)"); if it matches, initialize running=false and render one static frame (rods + bobs at the initial angles), keeping the Play button available as explicit opt-in. Same in DoublePendulumTwin.tsx and app/doublependulum/explorer/page.tsx.

### 🟠 MED · a11y · `components/DoublePendulumSim.tsx:221`
**Canvases have no accessible name and sliders have no programmatically associated labels**

The <canvas> elements in DoublePendulumSim (line 221), DoublePendulumTwin (lines 269, 278), and the explorer (line 347) carry no role, aria-label, or fallback text, so screen readers announce nothing. All range inputs (Sim lines 231/245; explorer lines 377-513) are visually labelled by sibling <div>s with no htmlFor/id or aria-label association, so a screen-reader user hears only "slider" with a bare number. Contrast with the decorative SVGs on the story page, which do set role="img" and aria-label.

_Fix:_ Add role="img" plus a translated aria-label to each canvas, and either wrap each slider in a <label> or give it an aria-label (e.g. aria-label="θ₁ initial angle in degrees").

### 🟠 MED · content · `app/doublependulum/page.tsx:266`
**German section six uses non-gender-neutral "Regelungstechniker"**

de sections[5] body reads "wo Regelungstechniker das Chaos bekämpfen". The repo convention (CLAUDE.md) mandates gender-neutral German prose (Studierende, Mathematiker:innen); this is the only person-noun in the doublependulum German copy that violates it.

_Fix:_ Change to "wo Regelungstechniker:innen das Chaos bekämpfen" (or "wo die Regelungstechnik das Chaos bekämpft").

### 🟠 MED · content · `app/doublependulum/page.tsx:179`
**Closing copy in all 8 locales promises Poincaré sections in the Explorer, which the Explorer does not have**

closingBody (EN line 179, and the equivalent key in de/es/fr/it/pt/sv/no) says 'You can also draw Poincaré sections and watch the KAM tori shred as you crank up the energy.' The explorer (app/doublependulum/explorer/page.tsx) contains no Poincaré-section feature at all, only the live pendulum, sliders, ghost twin, and trails. Also 'races two near-identical starts side by side' is inaccurate: the ghost twin is overlaid on the same canvas, not side by side.

_Fix:_ Either add a Poincaré-section mode to the explorer, or rewrite closingBody in all 8 locales to describe only what exists (masses, lengths, initial angles, ghost twin, trails).

### 🟠 MED · math · `app/doublependulum/page.tsx:141`
**High-energy Poincaré cloud is called 'the chaotic attractor', but a frictionless double pendulum has no attractor**

Section five in every locale says the high-energy section is 'a fuzzy two-dimensional cloud (the chaotic attractor)' (EN line 141, DE line 261 'der chaotische Attraktor', es/fr/it/pt/sv/no likewise). The same page repeatedly stresses the system is 'completely free of friction or noise', i.e. it is a conservative Hamiltonian system; by Liouville's theorem phase-space volume is preserved and no attractors exist. The correct term for the cloud is the chaotic sea / stochastic layer on the energy shell, which the very next inline caption (line 1219-1220) uses correctly.

_Fix:_ Replace 'chaotic attractor' with 'chaotic sea' (or 'stochastic region') in sections[4].body in all 8 locales.

### 🟠 MED · math · `app/doublependulum/explorer/page.tsx:181`
**Speed slider cannot go below 0.3x at default dt and the mapping assumes a 60 Hz display**

steps = Math.max(1, Math.round((1/60)*speed/dt)). Recomputation with default dt=0.005: speed=0.1 gives round(0.001667/0.005)=round(0.333)=0, clamped to 1 step, i.e. 0.005 sim-sec per frame = 0.3x at 60 fps, although the slider offers 0.1x and displays '0.10x'. All speeds between 0.1 and ~0.45 collapse to the same 0.3x. With dt=0.02 the floor is 1.2x, so 'slow motion' is entirely unreachable. Additionally the 1/60 constant means the whole sim runs 2x faster than labeled on 120 Hz displays.

_Fix:_ Accumulate fractional steps across frames (carry the remainder of targetSimSecPerFrame/dt) and derive frame time from the rAF timestamp delta instead of assuming 1/60 s.

### 🟠 MED · animation · `components/DoublePendulumSim.tsx:112`
**No prefers-reduced-motion handling in any of the room's three canvas animations**

grep for 'prefers-reduced-motion' across app/doublependulum/ and components/DoublePendulum* returns zero hits. DoublePendulumSim, DoublePendulumTwin, and the explorer all run an unconditional requestAnimationFrame loop with continuously moving rods and trails. CLAUDE.md states 'Per-component canvases also check the media query and freeze', and sibling components (NoiseLadder.tsx:196, TopicConstellation.tsx:341) implement it.

_Fix:_ Check window.matchMedia('(prefers-reduced-motion: reduce)') in all three components; start with running=false (or render a single static frame) when it matches, as NoiseLadder does.

### 🟠 MED · a11y · `app/doublependulum/explorer/page.tsx:347`
**Canvases have no accessible name and none of the 12 range sliders has an associated label**

The explorer canvas (line 347) and both canvases in DoublePendulumSim.tsx (line 221) / DoublePendulumTwin.tsx (lines 269, 278) have no aria-label or role, so screen readers announce nothing. All 10 explorer sliders (m1, m2, L1, L2, g, th1/th2 initial, speed, dt, trail) and the 2 sliders in DoublePendulumSim use plain <div> captions not associated with the <input type=range>, and the inputs have no aria-label. Other explorers in the repo (backprop, boids, chaosgame, dla, lsystem, sierpinski) do use aria-label.

_Fix:_ Add role="img" plus a descriptive aria-label to each canvas, and either wrap each slider caption in a <label htmlFor> or add aria-label to each range input.

### 🟠 MED · code · `app/doublependulum/explorer/page.tsx:337`
**Explorer Pause, Speed, Trail-length, and Ghost-twin toggle all wipe the simulation state**

The effect that owns mainRef/ghostRef reinitializes them to the initial angles (lines 151-152) and re-runs on every dep change, and the dep array includes `running`, `speed`, `trailLen`, and `showGhost`. So pressing Pause resets the pendulum to its start pose, nudging the speed slider mid-flight restarts the run, and toggling the ghost overlay throws away the accumulated divergence you were watching. Reinitializing on physical-parameter change (m, L, g, dt, initial angles) is defensible; doing it for playback controls is not, and the on-screen E/delta readouts keep stale values across the reset.

_Fix:_ Split the effect: one effect (deps: params + resetTick) reinitializes state; a separate render loop reads running/speed/showGhost/trailLen from refs so playback controls do not reset the physics.

### 🟠 MED · content · `app/doublependulum/page.tsx:141`
**Frictionless double pendulum described as having a 'chaotic attractor' in all 8 locales**

Section 5 (EN line 141: 'at high energy a fuzzy two-dimensional cloud (the chaotic attractor)', and the same phrase in de/es/fr/it/pt/sv/no bodies) calls the high-energy Poincare cloud an attractor. The page itself states the equations are 'completely free of friction or noise' (line 126): the system is Hamiltonian, and by Liouville's theorem a volume-preserving flow cannot have attractors. The correct term, used elsewhere on the same page ('chaotic sea', line 1219), is the chaotic sea / stochastic region. Calling it an attractor is a real physics error taught to readers.

_Fix:_ Replace '(the chaotic attractor)' with '(the chaotic sea)' or '(the stochastic region)' in all 8 locale bodies of section 5.

### 🟠 MED · i18n · `app/doublependulum/explorer/page.tsx:375`
**English-only UI leaks into non-EN locales: entire explorer control panel plus three explainer paragraphs on the story page**

The explorer hardcodes every control string in English for all 8 locales: 'm1 — upper mass', 'L1 — upper rod (px)', 'g — gravity (px/s2)', 'Speed (x real time)', 'Time step dt', 'Trail length', 'Pause'/'Play'/'Reset', 'Ghost twin · on/off', 'Readout', 'divergence', and the 'Numerical blow-up — resetting' toast (lines 359-544); only title/tagline/body and u.back are localized. Meanwhile the story page, which painstakingly translates even Play/Pause, still renders hardcoded English in every locale: the L=T-V explainer (page.tsx 1107-1110), the ODE explainer (1139-1142), the Poincare caption (1218-1221), and the SVG label 'KAM islands · stochastic sea' (1366). A German or French reader gets a half-English page.

_Fix:_ Add a RICH_EXPLORER Record<Locale, ...> for the explorer controls (per repo convention) and move the three story-page explainer paragraphs plus the SVG label into RICH_STORY.

### 🟠 MED · animation · `app/doublependulum/explorer/page.tsx:181`
**Sim speed is tied to display refresh rate; speed slider is also wrong at low speed with large dt**

All three sims advance a fixed amount of sim time per requestAnimationFrame callback assuming 60 Hz: explorer uses targetSimSecPerFrame = (1/60)*speed (line 180), DoublePendulumSim steps SUBSTEPS*DT = 4/240 = 1/60 s per frame (DoublePendulumSim.tsx 136-138), DoublePendulumTwin 6/240 = 1/40 s per frame. On a 120 Hz display everything runs 2x faster than labeled, so 'Speed 1.0 ~ real time' is false. Additionally steps = Math.max(1, Math.round(((1/60)*speed)/dt)) clamps to 1: with speed = 0.1 and dt = 0.02, requested 0.00167 s/frame but actual 0.02 s/frame, i.e. 12x the requested speed, so the slow-motion end of the Speed slider does nothing once dt is large.

_Fix:_ Accumulate real elapsed time from the rAF timestamp and integrate floor(elapsed*speed/dt) steps per frame (carrying the remainder), which fixes both the refresh-rate dependence and the min-1-step clamp.

### 🟠 MED · a11y · `components/DoublePendulumSim.tsx:112`
**None of the three canvas sims respects prefers-reduced-motion; all autoplay**

DoublePendulumSim, DoublePendulumTwin, and the explorer all start with running = true and run an unconditional requestAnimationFrame loop; none checks matchMedia('(prefers-reduced-motion: reduce)') (verified by reading all three files in full). CLAUDE.md states the repo convention: 'Per-component canvases also check the media query and freeze', with a static fallback. The global CSS reduced-motion rule cannot stop canvas rAF animation, so motion-sensitive users get three permanently swinging pendulums.

_Fix:_ On mount, read the reduced-motion media query; if it matches, initialize running = false and render a single static frame (the pendulum at its initial pose), as the signature heroes do.

### 🟠 MED · a11y · `components/DoublePendulumSim.tsx:221`
**Canvases have no accessible name and range sliders have no associated labels**

All four canvases (DoublePendulumSim.tsx 221, DoublePendulumTwin.tsx 269 and 278, explorer/page.tsx 347) are bare <canvas> elements with no role, aria-label, or fallback content, so screen readers announce nothing. Every range input (DoublePendulumSim.tsx 231 and 245; explorer/page.tsx 378, 391, 405, 419, 433, 449, 464, 479, 492, 505) has its visible label text in a sibling <div>, not a <label htmlFor> or aria-label, so the sliders are announced as unnamed sliders. This violates the repo's stated a11y conventions (aria-labels on canvases/controls, labels associated with inputs).

_Fix:_ Add role="img" plus a descriptive aria-label to each canvas, and either wrap slider labels in <label> elements or add aria-label to each range input (using the already-localized label strings).

### 🟡 LOW · visual · `components/DoublePendulumSim.tsx:153`
**While paused, the tip trail erodes to a single point within ~4 seconds**

trail.push([x2, y2]) at line 153 runs every animation frame regardless of `running`, so when paused the ring buffer (TRAIL_MAX = 200) fills with 200 copies of the frozen tip position at 60 fps, shifting all history out in about 3.3 s while the fade fill keeps darkening it. The explorer guards this correctly with `if (running && cap > 0)` at line 237; the Sim (and Twin, line 157) do not.

_Fix:_ Only push to the trail when `running` is true, mirroring the explorer's guard.

### 🟡 LOW · i18n · `app/doublependulum/page.tsx:266`
**German copy: 'Regelungstechniker' is not gender-neutral, and DE/ES use the English decimal point in 90.00001°**

Line 266 (de sections[5].body): 'wo Regelungstechniker das Chaos bekämpfen' uses the generic masculine, violating the repo's gender-neutral German rule (Mathematiker:innen pattern). Separately, the DE encounter card (lines 225-226) and the ES card (lines 345-346) write '90.00001°' with a decimal point, while fr/it/pt/sv/no correctly localize it as '90,00001°'; German and Spanish also use the decimal comma.

_Fix:_ Change to 'wo Regelungstechniker:innen das Chaos bekämpfen' and use '90,00001°' in the de and es card title and body.

### 🟡 LOW · i18n · `app/doublependulum/page.tsx:266`
**German prose not gender-neutral: 'Regelungstechniker'**

The de section six body reads 'wo Regelungstechniker das Chaos bekaempfen'. Repo convention requires gender-neutral German (Studierende, Mathematiker:innen), so this generic masculine plural violates it. It is the only occurrence in the de copy; the rest of the German text is clean (no unescaped low quotes anywhere).

_Fix:_ Change to 'wo Regelungstechniker:innen das Chaos bekaempfen' (or 'wo die Regelungstechnik das Chaos bekaempft').


## euler

### 🟠 MED · i18n · `app/euler/explorer/page.tsx:352`
**Explorer UI is hardcoded English and shown untranslated in all 8 locales**

Every control label in the explorer is an English literal: "Complex plane · unit circle" (line 352), "Angle θ" (380), "❚❚ Pause"/"▶ Play" (426), "⟳ Reset" (432), "Speed · rad/s" (436), "The identity moment" (454) and the full sentence "At θ = π the point lands exactly at z = −1. Adding 1 gives 0:" (456-458). Only topic.title/tagline/body and u.back come from i18n, so a de/fr/sv user sees a mixed-language page. This breaks the repo's own pattern: sibling explorers declare a local RICH_EXPLORER keyed by Locale for exactly these strings, and the euler story page next door localises everything into 8 locales.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, ...> (like other explorers) covering the panel captions, Play/Pause/Reset, speed label, and the identity-moment sentence, and read it via useI18n().locale.

### 🟠 MED · content · `app/euler/page.tsx:244`
**German section 05 uses generic masculine "Elektrotechniker", violating the repo's gender-neutral German rule**

DE section 05 body reads "Elektrotechniker schreiben die Impedanz einer Schaltung als komplexe Zahl…". CLAUDE.md mandates gender-neutral German (Studierende, Mathematiker:innen), and the same file follows the rule two paragraphs earlier ("unter arbeitenden Mathematiker:innen", line 214), so this occurrence is an inconsistency, not a style choice.

_Fix:_ Change to "Elektrotechniker:innen schreiben die Impedanz…" (or "In der Elektrotechnik schreibt man die Impedanz…").

### 🟠 MED · a11y · `app/euler/explorer/page.tsx:386`
**Explorer sliders and canvases have no accessible names**

The θ range input (lines 386-394) and the speed range input (438-446) have no aria-label and no associated <label> (the nearby "Angle θ"/"Speed · rad/s" divs are plain divs, not linked via htmlFor/id), so screen readers announce them as unnamed sliders. Both canvases (planeRef line 359, stripRef line 365) also lack aria-label/role. Contrast: the story-page demos do set aria-labels on canvas and sliders (EulerUnitCircle.tsx lines 167, 183), so the explorer falls below the project's own bar.

_Fix:_ Add aria-label to both range inputs (e.g. "angle theta", "animation speed in radians per second") and role="img" + aria-label to both canvases.

### 🟠 MED · visual · `components/EulerUnitCircle.tsx:165`
**Fixed 360px canvases overflow the viewport on narrow phones (missing maxWidth)**

EulerUnitCircle renders style={{ width: SIZE, height: SIZE }} with SIZE=360, and EulerTaylorBuilder.tsx line 212 does the same with W=360; neither has maxWidth. Minimum content width = 360 (canvas) + 48 (card p-6) + 48 (main px-6) = 456px, so on a 375-390px phone the page scrolls horizontally. Sibling demos guard against exactly this: BuffonNeedleSim.tsx:171, ChaosGameLive.tsx:193, CollatzTrajectoryPlot.tsx:157 all add maxWidth: "100%".

_Fix:_ Add maxWidth: "100%" (and height: "auto" or an aspect-ratio wrapper) to both canvases, matching BuffonNeedleSim/ChaosGameLive.

### 🟠 MED · i18n · `app/euler/page.tsx:1230`
**Hardcoded English explainer sentence and "half-turn" label leak into all locales on the story page**

The Section 02 inset panel renders the literal "Four quarter-turns close the loop. Each ×i is a 90° rotation; i² = −1 is two of them." (lines 1229-1231), and the card-02 mini-panel renders "half-turn" (line 1151) — both hardcoded in JSX while every other string on this page comes from the 8-locale RICH_STORY. German, Swedish, etc. readers see these two English fragments mid-story.

_Fix:_ Move both strings into RichStory (e.g. quarterTurnNote, halfTurnLabel) and translate them for all 8 locales like the rest of the page.

### 🟠 MED · i18n · `app/euler/explorer/page.tsx:352`
**Explorer UI is hardcoded English for all 8 locales**

Every UI string in the explorer is an English literal: "Complex plane · unit circle" (line 352), "Angle θ" (380), "Pause"/"Play" (426), "Reset" (432), "Speed · rad/s" (436), "The identity moment" (454), and the prose "At θ = π the point lands exactly at z = −1. Adding 1 gives 0:" (457). Only topic.title/tagline/body and u.back come from i18n. The sibling explorers app/eulerchar/explorer/page.tsx and app/mobius/explorer/page.tsx use the repo's RICH_EXPLORER Record<Locale, ...> pattern, so a German/Spanish/... visitor gets a localized story page at /euler but an English-only room at /euler/explorer.

_Fix:_ Add a local RICH_EXPLORER: Record<Locale, ...> covering the seven labels and the identity-moment sentence, following app/eulerchar/explorer/page.tsx.

### 🟠 MED · i18n · `app/euler/page.tsx:1230`
**Untranslated English captions inside two otherwise fully localized story inserts**

The i·i·i·i box renders the hardcoded sentence "Four quarter-turns close the loop. Each ×i is a 90° rotation; i² = −1 is two of them." (lines 1229-1231), and the encounter card 02 walkthrough renders the hardcoded words "start", "half-turn", "land" (lines 1148-1157). The page defines a complete RichStory for all 8 locales, so on de/es/fr/it/pt/sv/no these English fragments leak into the middle of translated sections.

_Fix:_ Add fields to RichStory (e.g. quarterTurnCaption, walkStart, walkHalfTurn, walkLand) and fill them for all 8 locales; render from story instead of literals.

### 🟠 MED · content · `app/euler/page.tsx:244`
**German section 05 uses non-gender-neutral "Elektrotechniker"**

DE Abschnitt 05 body starts "Elektrotechniker schreiben die Impedanz einer Schaltung ...". The repo rule (CLAUDE.md: German prose is gender-neutral, Mathematiker:innen) is followed elsewhere on the same page (line 214 uses "Mathematiker:innen") but violated here. The EN counterpart says "Electrical engineers".

_Fix:_ Change to "Elektrotechniker:innen schreiben ..." (or "Elektroingenieur:innen").

### 🟠 MED · animation · `app/euler/explorer/page.tsx:49`
**θ wrap uses a single TAU subtraction, so a background-tab dt spike throws θ far outside [0, 2π]**

requestAnimationFrame halts in hidden tabs, so on the first frame after the user returns, dt = (now − prev)/1000 equals the whole hidden duration. With speed 3 rad/s and 60 s hidden, next = θ + 180 rad; the wrap `if (next > TAU) next -= TAU` subtracts 2π once, leaving ≈ 173.7 rad. The readout then shows "θ = 173.7 rad · 9950°", the slider (max = TAU) is pinned, the strip cursor x = padL + (173.7/6.283)·innerW draws far off-canvas, and θ unwinds one TAU per frame for ~27 frames as a visible fast rewind.

_Fix:_ Clamp dt (e.g. const dt = Math.min((now − prev)/1000, 0.1)) or wrap with modulo: next = ((next % TAU) + TAU) % TAU.

### 🟠 MED · a11y · `app/euler/explorer/page.tsx:386`
**Explorer canvases and both range sliders have no accessible names**

The θ slider (line 386) and speed slider (line 438) are <input type=range> with no aria-label or associated <label>; screen readers announce them only as unnamed sliders. Both <canvas> elements (lines 359, 365) also lack aria-label/role, unlike the story-page demos (EulerUnitCircle.tsx lines 167 and 183 set aria-labels). The nearby text divs ("Angle θ", "Speed · rad/s") are not programmatically associated.

_Fix:_ Add aria-label="angle theta" and aria-label="animation speed" to the sliders (via the RICH_EXPLORER strings) and aria-labels to both canvases.

### 🟡 LOW · animation · `app/euler/explorer/page.tsx:210`
**Three unconditional rAF loops redraw and reallocate canvas backing stores at 60fps even when paused and idle**

The plane effect (lines 209-214) and strip effect (328-333) each run a requestAnimationFrame loop that calls render() every frame regardless of whether θ changed; render() re-assigns canvas.width/height every call (lines 67-68, 230-231), which reallocates the backing store each frame. The θ-animation effect (40-57) also keeps its own rAF alive while paused. With Play off and nothing changing, the page still does full clears/redraws of two canvases at display refresh rate (battery drain), and the ResizeObservers registered at 206/325 are made redundant by the loops.

_Fix:_ Only run the render loops while running===true (or render on state change + ResizeObserver), and resize the canvas only when clientWidth/clientHeight or dpr actually changed.

### 🟡 LOW · content · `app/euler/page.tsx:88`
**Feynman's "most remarkable formula / our jewel" quote is about Euler's formula, but the card attributes it to the identity**

Card 03 says "Feynman called it 'the most remarkable formula in mathematics' — 'our jewel'" where "it" refers to the identity e^(iπ)+1=0. In the Feynman Lectures (Vol. I, ch. 22) the sentence is: "we summarize with this, the most remarkable formula in mathematics: e^(iθ) = cos θ + i sin θ. This is our jewel." — i.e. the general formula, not the θ=π special case. The page itself distinguishes the two carefully in Section 03, so the card contradicts it. Same attribution repeated in all 8 locales (lines 214, 340, 466, 592, 718, 844, 969).

_Fix:_ Reword to "Feynman called Euler's formula, of which this is the θ = π case, 'the most remarkable formula in mathematics' — 'our jewel'" (in all locales).

### 🟡 LOW · i18n · `app/euler/page.tsx:969`
**Grammar errors in the Norwegian and Italian locales ("vårt juvel", "quando Cardano servì")**

Norwegian line 969: "«vårt juvel»" — juvel is a masculine noun, so the possessive must be "vår juvel". Italian line 602: "quando Cardano servì una radice di un negativo" — servire in the sense of 'to need' takes a dative subject, so "Cardano servì" means 'Cardano served'; it must be "quando a Cardano servì una radice" (or "quando Cardano ebbe bisogno di una radice").

_Fix:_ no: change to "vår juvel"; it: change to "quando a Cardano servì una radice di un numero negativo".

### 🟡 LOW · animation · `app/euler/explorer/page.tsx:210`
**Three rAF loops run at 60 fps forever and both canvases reallocate their backing store every frame**

The θ tick loop (line 43) plus two per-canvas render loops (lines 210 and 329) run unconditionally, even when running=false and θ is static, so the page redraws both canvases at full frame rate while completely idle. Worse, render() sets canvas.width/canvas.height every call (lines 67-68, 230-231), which clears and reallocates the bitmap each frame. The ResizeObserver already re-renders on size change, making the loops redundant when paused.

_Fix:_ Move canvas sizing into the ResizeObserver callback only, and drive renders from state changes (theta/dpr deps) or gate the rAF loops on runningRef.current.

### 🟡 LOW · visual · `components/EulerUnitCircle.tsx:165`
**Fixed 360 px canvas overflows its card on narrow phones**

The canvas gets style={{ width: SIZE, height: SIZE }} with SIZE = 360. On a 360 px viewport the available content width is ~264 px (main px-6 = 48 px plus card p-6 = 48 px), so the canvas overflows the rounded card; flex justify-center does not shrink it and no max-width/CSS clamp exists (globals.css has no canvas rule). Same issue in EulerTaylorBuilder.tsx line 212 (W = 360).

_Fix:_ Add className maxWidth handling (e.g. style={{ width: "100%", maxWidth: SIZE, aspectRatio: "1" }}) and derive the drawing size from clientWidth as the explorer canvases do.

### 🟡 LOW · content · `app/euler/page.tsx:1053`
**Norwegian copy: "sykliske kropper" mistranslates cyclotomic fields, and "vårt juvel" has wrong gender**

Line 1053: the number-theory card says roots of unity "avler sykliske kropper" (cyclic fields); the mathematical term is "syklotomiske kropper" (cyclotomic fields), matching EN "cyclotomic fields", SV "cyklotomiska kroppar", DE "Kreisteilungskörper". Line 969: "«vårt juvel»" is ungrammatical since juvel is masculine (en juvel), so it must be "«vår juvel»".

_Fix:_ Change "sykliske kropper" to "syklotomiske kropper" and "vårt juvel" to "vår juvel".


## fourier

### 🔴 HIGH · math · `app/fourier/explorer/page.tsx:37`
**Explorer 'Single pulse' mode: sine-only coefficients 0.4/k can never converge to the Gaussian pulse target, so the amber 'sum' contradicts the white target**

target('pulse', t) = 2·exp(−200(t−0.5)²) − 1 is even about t = 0.5, but partialSum uses only sin(2πkt) terms, which are all odd about t = 0.5 (sin(2πk(0.5+s)) = ±sin(2πks)). Recomputation: Σₖ (0.4/k)·sin(2πkt) converges to the sawtooth ramp 0.2π(1−2t). At t = 0.5 (pulse peak, target = +1) the partial sum with N = 48 is 0.0; at t = 0.1 the partial sum is +0.495 while the target is −0.9999. Users see the 'Fourier sum' converging to a descending ramp with a jump at t = 0, nothing like the displayed pulse — the exact opposite of the room's core lesson. The comment 'roughly constant amplitude across k' is also wrong for 0.4/k.

_Fix:_ Represent the pulse with cosine harmonics, e.g. give each harmonic a phase: draw a·cos(2πk(t−0.5)) with a ≈ c·exp(−k²/σ²) (true Gaussian spectrum), and extend partialSum/rendering to honour the phase; or drop the 'pulse' option.

### 🔴 HIGH · math · `app/fourier/page.tsx:823`
**Displayed Gibbs formula is off by a factor of 2: (2/π)∫₀^π sinc(x)dx − 1 = 0.179, not 0.08949**

Recomputation: Si(π) = ∫₀^π sin(x)/x dx = 1.8519370…, so (2/π)·Si(π) − 1 = 0.17898, i.e. 17.9%. The page equates that expression to ≈ 0.08949 and labels it 'max overshoot / jump'. The correct overshoot-per-jump is (1/π)·Si(π) − 1/2 = 0.08949. So the formula and the number shown side by side disagree by exactly 2× (the 0.179 figure is the two-sided over+undershoot).

_Fix:_ Change the displayed identity to: max overshoot / jump = (1/π) ∫₀^π sinc(x) dx − 1/2 ≈ 0.08949.

### 🔴 HIGH · math · `components/FourierHarmonicBuilder.tsx:38`
**Triangle target is a quarter period out of phase with its own Fourier partial sum (also in the explorer), so the amber sum visibly converges to the wrong curve**

target('triangle', u) = 4|u−0.5|−1 has value +1 at t = 0 and 0 at t = 0.25. The coefficients (8/π²)(−1)^m/(2m+1)² on sin((2m+1)·2πt) instead produce the triangle with value 0 at t = 0 and +1 at t = 0.25. Recomputation with 50 terms: partial(0) = 0.000 vs target(0) = 1.0; partial(0.25) = 0.9959 vs target(0.25) = 0.0. The white 'target' and amber 'sum' are shifted by T/4 on screen for the Triangle button. Same pair of functions is duplicated in app/fourier/explorer/page.tsx (target line 55, coefficients lines 31-34), so the explorer has the identical bug. Square and sawtooth check out.

_Fix:_ Make the triangle target match the sine-phase series: return u < 0.25 ? 4*u : u < 0.75 ? 2 - 4*u : 4*u - 4; apply the same fix in app/fourier/explorer/page.tsx.

### 🔴 HIGH · math · `app/fourier/page.tsx:823`
**Displayed Gibbs identity is off by a factor of 2: the shown expression equals 0.17898, not 0.08949**

The card renders 'max overshoot / jump = (2/π) ∫₀^π sinc(x) dx − 1 ≈ 0.08949'. Recomputation: Si(π) = ∫₀^π sin(x)/x dx = 1.8519371, so (2/π)·Si(π) − 1 = 0.178980. That quantity is the overshoot relative to the HALF-jump. The overshoot per full jump (which the label claims, and which matches the 8.95 % used everywhere else on the page) is (1/π)·Si(π) − 1/2 = 0.089490. So the equation and its stated numeric value contradict each other on screen.

_Fix:_ Change the expression to '(1/π) ∫₀^π sinc(x) dx − 1/2 ≈ 0.08949' (or keep (2/π)…−1 and relabel it 'overshoot / half-jump ≈ 0.17898').

### 🔴 HIGH · math · `components/FourierHarmonicBuilder.tsx:38`
**Triangle-wave target is phase-shifted a quarter period from the Fourier series being summed, so the amber sum never converges onto the white target**

target() returns 4|u−0.5|−1 (value +1 at t=0, −1 at t=0.5), but coeff() implements (8/π²)Σ(−1)^m sin((2m+1)·2πt)/(2m+1)², whose limit is the sine-phase triangle (2/π)asin(sin 2πt). Numerical check: series(0)=0 vs target(0)=+1; series(0.25)=+1 vs target(0.25)=0; series(0.5)=0 vs target(0.5)=−1. The drawn partial sum is the target shifted by a quarter period, visibly 'wrong' to every user who selects Triangle. The identical bug is duplicated in app/fourier/explorer/page.tsx lines 30–34 vs 55 (same coeff/target pair). Square and sawtooth check out.

_Fix:_ Make the target match the series: return the sine-phase triangle, e.g. piecewise u<0.25 ? 4u : u<0.75 ? 2−4u : 4u−4 (equivalently (2/π)·Math.asin(Math.sin(2πu))), in both FourierHarmonicBuilder.tsx and app/fourier/explorer/page.tsx.

### 🟠 MED · content · `app/fourier/page.tsx:93`
**'One theorem, three centuries old' — Fourier analysis is about two centuries old, not three**

Fourier presented his heat memoir in 1807 and published Théorie analytique de la chaleur in 1822; 2026 − 1822 ≈ 204 years, and even from the 1807 memoir it is ~219. Three centuries would place it around 1726, before Fourier was born (1768). The claim is repeated in all 8 locales (lines 93, 174, 255, 335, 415, 495, 575, 656) and clashes with the same page citing Dirichlet 1829 and Gauss 1805 correctly.

_Fix:_ Change to 'two centuries old' (zwei Jahrhunderte / deux siècles / due secoli / dois séculos / dos siglos / två sekler / to århundrer) in every locale.

### 🟠 MED · i18n · `app/fourier/explorer/page.tsx:11`
**Explorer UI is entirely hardcoded English despite the 8-locale site and the RICH_EXPLORER convention**

WAVE_LABELS ('Square wave', 'Single pulse', …), 'Target wave', 'Harmonics', 'Layers', 'Target (white)', 'Individual harmonics (cyan)', 'Spectrum · amplitude per harmonic', the Gibbs helper text (lines 272-275), and the English-only pluralisation `{N} harmonic{N === 1 ? "" : "s"}` (line 194) are all shown untranslated to de/es/fr/it/pt/sv/no users, while the sidebar right next to them renders the fully translated atlas copy. CLAUDE.md documents a local RICH_EXPLORER Record<Locale, …> pattern for exactly this case; none is used here.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, …> constant covering all 8 locales for wave labels, panel headings, toggle labels, and the Gibbs note; use a count-aware harmonics label per locale.

### 🟠 MED · i18n · `app/fourier/page.tsx:803`
**Story page and its demo components ship several English-only prose blocks outside RICH_STORY**

Despite RICH_STORY covering all 8 locales, these visible strings are hardcoded English for every locale: 'Each k is one independent axis…' (page.tsx 803-806), 'Fourier series' label (798), 'What an oscilloscope or a microphone records.' (849) and 'What a spectrum analyser or your inner ear sees.' (859-861), 'The FFT is not faster mathematics…' (905-909), 'Multiply by ℏ…' and 'The Gaussian minimises both…' (925-933), plus in the components the legends 'White: the target. Violet: …' (components/FourierHarmonicBuilder.tsx 185-189), 'Top: the waveform you just synthesised…' and the '▶ Hear it' / '■ Stop' button (components/FourierSpectrumPlay.tsx 296-308) and the Square/Sawtooth/Triangle buttons (FourierHarmonicBuilder.tsx 9-13). A German reader gets a page that is 90% German with recurring English caption paragraphs.

_Fix:_ Move these strings into the existing RICH_STORY.labels (they already flow into both components via props) and add caption/legend/button props to FourierHarmonicBuilder and FourierSpectrumPlay.

### 🟠 MED · a11y · `app/fourier/explorer/page.tsx:201`
**Canvases have no accessible name/role and range sliders lack an associated label across the fourier room**

All four canvases (explorer lines 201 and 207, FourierHarmonicBuilder.tsx 167-171, FourierSpectrumPlay.tsx 270-279) have no aria-label, role='img', or fallback content, so screen readers announce nothing for the central visualisation. The explorer's N slider (lines 248-256) has no label element or aria-label (the visible 'Harmonics' heading is an unassociated div); FourierSpectrumPlay's five Knob range inputs (lines 39-48) only have a sibling div ('1f', '2f', …), not a <label> or aria-label; FourierHarmonicBuilder's 'N =' label (173-175) is not linked via htmlFor/id. This contradicts the repo's own bar ('DPR-aware, requestAnimationFrame-driven, accessible').

_Fix:_ Add role='img' plus a translated aria-label to each canvas, and give every range input an aria-label (or wrap it in a real <label>/use htmlFor with an id).

### 🟠 MED · math · `app/fourier/explorer/page.tsx:37`
**'Single pulse' mode is mathematically impossible as coded: an even pulse about t=0.5 has zero sine coefficients, and a=0.4/k actually sums to a descending ramp**

target('pulse') is a Gaussian bump exp(−200(u−0.5)²)·2−1, which is even about t=0.5; every sin(2πkt) is odd about t=0.5, so ALL its sine coefficients vanish (it needs cosines plus a DC term ≈ −0.75, which the sine-only partialSum can never produce). The coefficients used instead, a=0.4/k, sum to Σ 0.4 sin(2πkt)/k → 0.2π(1−2t): numerically at t=0.1/0.5/0.9 the sum is +0.50/0.00/−0.50 while the target is −1.0/+1.0/−1.0. The white target and amber 'reconstruction' are unrelated curves, contradicting the demo's premise that raising N approaches the target.

_Fix:_ Either drop pulse mode, or switch the model to a·sin(kωt+φₖ) / cosine terms with the true pulse coefficients (b₀ DC + cosine series of the Gaussian about t=0.5), and shift the drawn target accordingly.

### 🟠 MED · i18n · `app/fourier/explorer/page.tsx:11`
**Fourier room leaks hardcoded English UI copy into all 8 locales despite a fully translated RICH_STORY**

The explorer has no RICH_EXPLORER at all: WAVE_LABELS ('Square wave'…), 'Target wave', 'Harmonics', 'Layers', 'Spectrum · amplitude per harmonic', 'Target (white)', 'Individual harmonics (cyan)', and the Gibbs hint (lines 272–275) are English for de/es/fr/it/pt/sv/no users. The story page does the same for several user-facing explanation paragraphs outside RICH_STORY: page.tsx lines 798, 803–806, 826–828, 849, 859–861, 905–909, 925–933; plus component hint texts in FourierHarmonicBuilder.tsx 185–189 and FourierSpectrumPlay.tsx 296–299 and the '▶ Hear it / ■ Stop' button (308). The page authors clearly intended full localisation (RICH_STORY covers all 8 locales including tiny captions), so these are misses, not design.

_Fix:_ Add a RICH_EXPLORER Record<Locale,...> for the explorer, extend RichStory.labels for the story-page paragraphs, and pass caption/hint strings into the two demo components as props.

### 🟡 LOW · content · `app/fourier/page.tsx:410`
**Italian grammar error: 'la sua trasformata si spalmare necessariamente' (infinitive instead of conjugated verb)**

In the it locale's step-five body: 'Stringi un segnale in una finestra temporale stretta e la sua trasformata si spalmare necessariamente su molte frequenze'. 'si spalmare' is ungrammatical; the reflexive third person singular is 'si spalma'. All other locales use the correctly conjugated verb (se desparrama / s'étale / se espalha / breder ut sig).

_Fix:_ Change 'si spalmare' to 'si spalma'.

### 🟡 LOW · content · `app/fourier/page.tsx:73`
**'Gibbs proved in 1899' misattributes: Gibbs described the overshoot without proof; Wilbraham found it in 1848 and Bôcher proved it in 1906**

Step two in all 8 locales states Gibbs 'proved in 1899 that … partial sums always overshoot by exactly this constant'. Historically, Henry Wilbraham published the phenomenon in 1848; Gibbs' 1899 Nature letter (correcting his 1898 one) stated the correct limit behaviour without proof; the rigorous proof and the name 'Gibbs phenomenon' are due to Maxime Bôcher (1906). Saying Gibbs 'proved' it in 1899 is the kind of attribution error the site otherwise avoids (it correctly credits Gauss 1805 for the FFT).

_Fix:_ Reword to 'Gibbs described in 1899' (de 'beschrieb', es 'describió', etc.), optionally crediting Wilbraham/Bôcher.


## gabrielshorn

### 🟠 MED · math · `app/gabrielshorn/explorer/page.tsx:15`
**Surface area labeled "A (exact)" is wrong in the 4th-6th displayed significant digits near the top of the x_max range**

surfaceArea uses composite Simpson with N=2000 uniform subintervals over [1, x_max]. At x_max=1000 the step is h≈0.5, too coarse for the sharply curved integrand near x=1. Recomputation (adaptive Simpson to 1e-12): true A(1000)=44.11267, the explorer computes 44.17394 (error 0.061, 0.14%). The UI prints this via sig6() as 6 significant digits under the label "A (exact)" (line 573), so users see 44.1739 where 44.1127 is correct. At x_max=100 the error is already visible in the 7th digit and grows with x_max.

_Fix:_ Integrate in u = ln x: A = 2π ∫₀^{ln X} √(1 + e^(-4u)) du. The transformed integrand is smooth and bounded, so uniform Simpson in u converges to full precision at any x_max. Alternatively drop the "exact" label or use a log-spaced/adaptive grid.

### 🟠 MED · i18n · `app/gabrielshorn/page.tsx:755`
**Two full explanation panels on the story page are hardcoded English and shown to all 8 locales**

The page defines a complete RICH_STORY for all 8 locales, but the JSX inserts untranslated English literals rendered regardless of locale: "The volume integral" (line 755) with the paragraph "Each cross-section is a disc of radius 1/x. Squaring sends the radii toward zero fast enough..." (lines 760-763), and "The surface integral" (line 779) with "The lower bound is the harmonic integral — the continuous cousin of 1 + 1/2 + 1/3 + ... It diverges..." (lines 784-787). A German or Swedish reader gets English prose in the middle of an otherwise fully localized page.

_Fix:_ Add volumeIntegralPretitle/volumeIntegralNote and surfaceIntegralPretitle/surfaceIntegralNote fields to the RichStory type, fill them for all 8 locales, and reference story.* in the JSX.

### 🟠 MED · i18n · `app/gabrielshorn/explorer/page.tsx:456`
**Explorer UI is almost entirely hardcoded English for all 8 locales**

Only topic.title/tagline/body and u.back are localized. Everything else is English literals shown to every locale: "Solid of revolution · drag to rotate" / "Side view ..." (456-457), "View" (483), "Spin"/"Hold" (518), "Reset" (524), "x_max — cutoff (log scale)" (533), "Animate growth"/"Stop" (545), "Live values" (567), "V (cut)" (570), the explanatory paragraph at 582-585, "Painter's paradox" (590), "ε (paint thickness)" (593), "Paint to coat at ε" (606), and the paragraph at 611-614. Other explorers in the repo (app/eulerchar/explorer/page.tsx, app/mobius/explorer/page.tsx) use the documented local RICH_EXPLORER: Record<Locale, ...> pattern for exactly this amount of UI copy.

_Fix:_ Declare a local RICH_EXPLORER keyed by Locale covering all 8 locales (as in app/mobius/explorer/page.tsx) and move all UI strings and both explanatory paragraphs into it.

### 🟠 MED · animation · `components/GabrielsHornRenderer.tsx:193`
**Auto-spinning 3D canvases ignore prefers-reduced-motion, no static fallback**

GabrielsHornRenderer runs a permanent requestAnimationFrame loop that auto-rotates the horn (yawRef.current += 0.004, line 193); the explorer's 3D view does the same (app/gabrielshorn/explorer/page.tsx line 398). Neither file contains any matchMedia("prefers-reduced-motion") check (verified by grep), while other canvas components in the repo (BackpropMiniNet.tsx, NoiseLadder.tsx, TopicConstellation.tsx) do, and CLAUDE.md states per-component canvases must check the media query and freeze with a static fallback. Users with reduced motion enabled still get a continuously spinning, motion-blur-trailed animation.

_Fix:_ Query matchMedia("(prefers-reduced-motion: reduce)") in the draw effects (re-subscribing on change, as done elsewhere in the repo); when reduced, render one static frame and skip the auto-spin/rAF loop while keeping drag-to-rotate working.

### 🟠 MED · a11y · `app/gabrielshorn/explorer/page.tsx:464`
**No aria-labels on canvases and no label association on the range sliders in the whole room**

grep for aria-label over app/gabrielshorn/**, GabrielsHornRenderer.tsx and GabrielsHornGrowGraph.tsx returns zero hits, while most other demo components in components/ carry them. The main explorer canvas (line 464), the x_max slider (line 548) and the ε slider (line 596), plus the renderer's canvas (GabrielsHornRenderer.tsx line 230) and its X_max slider (line 242), have no aria-label and their visible text labels are plain <div>/<span> elements not associated via <label htmlFor> or aria-labelledby. Screen reader users hear only "slider" with no purpose, and the interactive canvases are unnamed.

_Fix:_ Add role="img" plus a descriptive aria-label to each canvas and aria-label (or htmlFor/id pairs) to the three range inputs, sourcing the strings from the i18n bundles.

### 🟠 MED · visual · `app/gabrielshorn/explorer/page.tsx:433`
**Explorer 3D rotation uses mouse events only, so touch users cannot rotate the horn**

onCanvasMouseDown (line 433) plus window-level "mousemove"/"mouseup" listeners (lines 424-425) are the only drag path; there are no pointer or touch handlers and no touch-action CSS on the canvas. On touch devices a drag scrolls the page instead of rotating, so the advertised "drag to rotate" (line 456) is dead on mobile. The sibling component GabrielsHornRenderer.tsx does this correctly with onPointerDown/Move/Up, setPointerCapture and the touch-none class (lines 205-236), so the fix pattern already exists in the room.

_Fix:_ Replace the mouse listeners with pointer events plus setPointerCapture and add touch-none to the canvas, mirroring GabrielsHornRenderer.tsx.

### 🟠 MED · math · `app/gabrielshorn/explorer/page.tsx:15`
**"A (exact)" shows wrong digits at large x_max: uniform Simpson with N=2000 undersamples the integrand spike near x = 1**

surfaceArea() uses composite Simpson on a uniform grid over [1, xMax] with N=2000, so at xMax=1000 the step is h≈0.5 right where the integrand (1/x)·sqrt(1+1/x^4) has all its curvature. Recomputation (Simpson N=2,000,000 as reference): true A(1000)=44.1127, code returns 44.1739 (rel. err. 1.4e-3); A(300): 36.5479 vs 36.5488. The UI displays this via sig6() under the label "A (exact)" (line 574), so digits 4-6 of the 6 shown are wrong over much of the upper slider range. The story-page renderer (N=600, xMax≤50) is fine: 25.290014 vs 25.289925.

_Fix:_ Substitute u = ln x: A = 2π ∫₀^{ln X} sqrt(1 + e^{-4u}) du and apply Simpson on the (smooth, well-scaled) u-grid; alternatively use log-spaced samples or raise N with xMax. Or stop labelling it "exact" and show fewer digits.

### 🟠 MED · animation · `components/GabrielsHornRenderer.tsx:193`
**Auto-spinning rAF loops never check prefers-reduced-motion; no static fallback**

Both this renderer (yawRef.current += 0.004 every frame, line 193) and the explorer's 3D view (app/gabrielshorn/explorer/page.tsx line 398, plus spin defaulting to true) run an endless requestAnimationFrame auto-rotation with no matchMedia("(prefers-reduced-motion: reduce)") check anywhere in either file (grep confirms zero hits). CLAUDE.md states per-component canvases check the media query and freeze, and TopicConstellation plus every signature hero do; these two canvases are the exception.

_Fix:_ Query prefers-reduced-motion (and subscribe to changes); when reduced, render one static frame instead of starting the spin loop, and default the explorer's spin/animate toggles to off.

### 🟠 MED · code · `app/gabrielshorn/explorer/page.tsx:413`
**Explorer 3D rotation is mouse-only, so touch users cannot rotate the horn**

Drag handling uses onMouseDown on the canvas (line 433) plus window-level "mousemove"/"mouseup" listeners (lines 424-425). Touch drags fire pointer/touch events, not continuous mouse events, so on phones and tablets the advertised "drag to rotate" does nothing; the sibling GabrielsHornRenderer already does this correctly with onPointerDown/Move/Up, setPointerCapture and touch-none.

_Fix:_ Port the pointer-event handling from GabrielsHornRenderer (pointerdown/move/up with pointer capture and a touch-none canvas class) and drop the window mouse listeners.

### 🟠 MED · i18n · `app/gabrielshorn/page.tsx:755`
**Hardcoded English blocks ("The volume integral", "The surface integral" plus their explanation paragraphs) inside an otherwise fully 8-locale page**

RICH_STORY translates every other string into all 8 locales, but the two formula panels are hardcoded English JSX: label "The volume integral" (line 755) with the paragraph "Each cross-section is a disc of radius 1/x..." (lines 760-763), and "The surface integral" (line 779) with "The lower bound is the harmonic integral..." (lines 784-787). German, Spanish, etc. readers get full English sentences mid-story.

_Fix:_ Add fields (e.g. volumeIntegralLabel/volumeIntegralNote, surfaceIntegralLabel/surfaceIntegralNote) to RichStory and fill them for all 8 locales.

### 🟠 MED · i18n · `app/gabrielshorn/explorer/page.tsx:582`
**Explorer sidebar prose and controls are English-only for all 8 locales**

Whole explanatory sentences are hardcoded EN: "As x_max → ∞: V → π (finite), A → ∞ (the harmonic integral diverges)..." (lines 582-585), "Honest paint has nonzero thickness..." (lines 611-614), plus control labels "View", "Spin"/"Hold", "Reset", "x_max — cutoff (log scale)", "Animate growth", "Live values", "Painter's paradox" and the header badges (lines 455-461). The repo's RICH_EXPLORER pattern exists for exactly this (app/mobius/explorer, app/eulerchar/explorer), and the matching story page is fully translated, so DE/ES/FR/... users hit an English wall in the interactive room.

_Fix:_ Declare a local RICH_EXPLORER: Record<Locale, ...> covering the sidebar prose and control labels, following app/mobius/explorer/page.tsx.

### 🟠 MED · a11y · `components/GabrielsHornRenderer.tsx:230`
**Interactive canvases and range sliders have no accessible names**

grep shows zero aria-label in GabrielsHornRenderer.tsx, GabrielsHornGrowGraph.tsx and app/gabrielshorn/explorer/page.tsx. The three canvases (renderer line 230, grow graph line 161, explorer line 464) expose nothing to screen readers, and the three sliders (renderer X_max line 242, explorer x_max line 548 and epsilon line 596) are bare <input type="range"> whose visible captions are unassociated divs, so a screen reader announces them as unnamed sliders.

_Fix:_ Add role="img" + descriptive aria-label (from the localized strings) to each canvas, and aria-label (or htmlFor/id association) on each range input, e.g. aria-label={xMaxLabel}.

### 🟡 LOW · i18n · `app/gabrielshorn/page.tsx:285`
**French topic name inconsistent: story page says "La corne de Gabriel", atlas card and explorer sidebar say "La trompette de Gabriel"**

app/gabrielshorn/page.tsx line 285 titles the FR story "La corne de Gabriel" (also "la corne" throughout the FR prose), while lib/i18n/atlas.ts line 883 has title "La trompette de Gabriel". The explorer sidebar renders the atlas title (a.topics.gabrielshorn.title), so a French user navigating story → explorer sees the object renamed mid-flow. All other locales are consistent between the two sources (es "cuerno"/"cuerno", it "corno"/"corno", pt "trombeta"/"trombeta").

_Fix:_ Pick one French name ("La trompette de Gabriel" is the common French term) and use it in both the RICH_STORY fr entry and lib/i18n/atlas.ts.

### 🟡 LOW · content · `app/gabrielshorn/page.tsx:186`
**Garbled German caption: "Interaktiv · drehen ziehen, X_max schieben"**

The DE hornCaption reads "drehen ziehen" which is not grammatical German; the EN source is "drag to rotate". Every other locale renders this correctly (es "arrastra para girar", fr "fais tourner", sv "dra för att rotera").

_Fix:_ Change to "Interaktiv · ziehen zum Drehen, X_max schieben".

### 🟡 LOW · content · `app/gabrielshorn/page.tsx:186`
**German hornCaption "Interaktiv · drehen ziehen, X_max schieben" is garbled**

The EN source is "drag to rotate, slide X_max"; the DE string juxtaposes two bare infinitives ("drehen ziehen") which is not grammatical German. Every other DE string on the page reads naturally, so this looks like a lost word during translation.

_Fix:_ Change to "Interaktiv · ziehen zum Drehen, X_max schieben".

### 🟡 LOW · code · `components/GabrielsHornRenderer.tsx:29`
**surfaceUpTo comment claims "adaptive step count — denser near x = 1" and a "log-spaced grid", but the code is a fixed uniform grid**

Lines 29-31 describe adaptive, log-spaced Simpson sampling; the implementation (lines 32-41) uses a constant N=600 with uniform h=(b-a)/N and no log spacing. Repo convention is that comments state real invariants; this one documents behavior that does not exist and could mislead a future edit that extends the slider range past 50 (where uniform sampling degrades, see the explorer finding).

_Fix:_ Fix the comment to say "uniform composite Simpson, N=600, adequate for X ≤ 50", or actually implement the log-substituted integral shared with the explorer.


## galton

### 🟠 MED · i18n · `app/galton/explorer/page.tsx:246`
**Explorer UI is hardcoded English for all 8 locales**

The story page carries a full 8-locale RICH_STORY, but the explorer it links to renders English-only strings for everyone: "Rows N" (l.246), "Spawn / frame" (l.258), "Right-bias p" (l.267), "Overlay 𝒩(Np, Np(1−p))" (l.285), "❚❚ Pause"/"▶ Play" (l.298), "⟳ Clear histogram" (l.304), the HUD "{rows} rows · p = …" and "… balls" (l.227-230), and the in-canvas label "bins · X landed" (l.197). Only u.back is translated. The DE closing copy on the story page explicitly promises these Explorer features ("N bis 40 treiben, die Münze verzerren …"), then delivers an English panel. Other explorers (eulerchar, mobius) use the RICH_EXPLORER pattern.

_Fix:_ Add a local RICH_EXPLORER: Record<Locale, …> covering the slider labels, overlay checkbox, play/pause/clear buttons, and HUD strings, following app/eulerchar/explorer/page.tsx.

### 🟠 MED · i18n · `app/galton/page.tsx:844`
**Story page renders hardcoded English aside boxes in all locales**

Despite the meticulous 8-locale RICH_STORY, four inline aside boxes are English literals shown to every locale: "N = 10 · row of Pascal" (l.844), "N = 10 · bin probabilities × 1024" plus "Total = 1024 = 2¹⁰. The centre fattens; the edges starve. Already a bell — and N is still tiny." (l.906-914), "Independent, finite variance, any distribution. The standardised sum always converges to the standard normal — the bell is the universal attractor of averaging." (l.970-972), and "Where the bell breaks" / "Mandelbrot, 1963: financial returns are «wild», not «mild»." (l.999-1004). A German or Swedish reader gets full English sentences mid-story.

_Fix:_ Move these strings into the RichStory type (e.g. pascalBoxLabel, pascalBoxNote, cltBoxNote, breakBoxLabel, breakBoxNote) and fill all 8 locales like the rest of RICH_STORY.

### 🟠 MED · animation · `components/GaltonInlineSim.tsx:48`
**Continuous rAF animation ignores prefers-reduced-motion (no static fallback, no pause)**

GaltonInlineSim runs an unconditional requestAnimationFrame loop that spawns and animates balls forever; there is no prefers-reduced-motion check and not even a pause control (only reset). The repo convention (CLAUDE.md: "Per-component canvases also check the media query and freeze") is followed by e.g. components/BackpropMiniNet.tsx and components/NoiseLadder.tsx but not here. app/galton/explorer/page.tsx (l.40-218) has the same gap, though it at least offers a Pause button; the inline sim on the story page auto-plays motion indefinitely for reduced-motion users.

_Fix:_ Check window.matchMedia("(prefers-reduced-motion: reduce)") in the effect: render one static frame (e.g. pre-filled binomial histogram plus pegs) and skip the rAF loop, re-evaluating on the media query's change event.

### 🟠 MED · content · `app/galton/page.tsx:86`
**Quincunx dated 1889; Galton built and demonstrated it in 1873/74**

Section 01 in every locale says "Francis Galton's 1889 quincunx" (EN l.86, DE l.177, ES l.268, FR l.359, IT l.450, PT l.540, SV l.630, NO l.720). Galton had the quincunx built in 1873 and demonstrated it at his Royal Institution lecture on 27 February 1874; 1889 is only the publication year of Natural Inheritance, which reused (a two-stage version of) the device 15 years later. As written, the sentence attributes the invention to 1889.

_Fix:_ Change to "Francis Galton's 1874 quincunx" (or "designed in 1873, popularised in Natural Inheritance 1889") in all 8 locales.

### 🟠 MED · a11y · `components/GaltonInlineSim.tsx:218`
**Range inputs have no accessible name and canvases no aria-label**

In GaltonInlineSim the "Rows N" and "Spawn / frame" texts live in sibling <div>s, not <label>s, and the <input type="range"> elements (l.218, l.238) carry no aria-label; the canvas (l.195) has no role/aria-label, and the reset button's only content is "⟳" (l.203-208). Same pattern in GaltonNormalOverlay (input l.173, canvas l.152) and the explorer's SliderRow (app/galton/explorer/page.tsx l.345). Screen readers announce these sliders as unnamed. 23 other components in components/ do set aria-label, so this room falls below the repo's own bar.

_Fix:_ Give each range input aria-label={rowsLabel} etc. (or wrap in <label>), add role="img" plus a descriptive aria-label to the canvases, and an aria-label on the ⟳ button.

### 🟠 MED · i18n · `app/galton/page.tsx:913`
**Several visible prose callout boxes are hardcoded English on a page that is otherwise fully localized in 8 languages**

The page declares a complete RICH_STORY for all 8 locales, but the JSX contains untranslated English sentences rendered to every locale: line 844 "N = 10 · row of Pascal", line 906 "N = 10 · bin probabilities × 1024", lines 912-915 "Total = 1024 = 2¹⁰. The centre fattens; the edges starve. Already a bell — and N is still tiny.", lines 970-973 "Independent, finite variance, any distribution. The standardised sum always converges to the standard normal — the bell is the universal attractor of averaging.", line 999 "Where the bell breaks", and lines 1001-1004 "Cauchy · Lévy · Pareto ... financial returns are «wild», not «mild»." A German or Swedish reader gets full English paragraphs mid-story.

_Fix:_ Move these strings into the RichStory type (e.g. pascalCalloutTitle/pascalCalloutBody, cltCalloutBody, breakCalloutTitle/breakCalloutBody) and fill them per locale like the rest of the RICH_STORY blocks.

### 🟠 MED · content · `app/galton/page.tsx:86`
**Quincunx dated 1889 in all 8 locales; Galton built and demonstrated it in 1873/74, 1889 is Natural Inheritance**

Section 01 says "Francis Galton's 1889 quincunx is a board of N staggered rows of pegs" (EN line 86, DE line 177, ES line 268, FR line 359, IT line 450, PT line 540, SV line 630, NO line 720). Galton had the first quincunx built in 1873 and demonstrated it at the Royal Institution in February 1874; 1889 is the publication year of his book Natural Inheritance, which described the (two-stage) device. Attributing the device itself to 1889 is a factual error repeated in every locale.

_Fix:_ Change the wording to date the device to 1873/74 (e.g. "Francis Galton's quincunx, built in 1873 and popularised in his 1889 Natural Inheritance, ...") in all 8 locale blocks.

### 🟠 MED · math · `app/galton/explorer/page.tsx:273`
**Changing the bias slider does not clear the histogram, so the 𝒩(Np, Np(1−p)) overlay is fitted against data sampled from a mixture of different p values**

Changing Rows N triggers setResetTick (line 253-254) and wipes histRef, but the Right-bias slider only calls setBias (line 273). The Gaussian overlay (lines 170-183) computes mu = rows*cfg.bias and sigma2 = rows*p(1-p) from the CURRENT p and scales it to the TOTAL accumulated count, while the histogram permanently contains balls landed under every previous p. Concretely: run at p=0.50 for 5000 balls, slide to p=0.80 and the rose curve jumps to mu=0.8N while the bars stay centred at 0.5N forever growing as a bimodal mixture, visually contradicting the theorem the overlay is supposed to demonstrate.

_Fix:_ Reset the histogram when bias changes, e.g. onChange={(v) => { setBias(v); setResetTick((t) => t + 1); }} (and add bias to the effect deps, or keep reading it from paramsRef after the reset).

### 🟠 MED · animation · `components/GaltonInlineSim.tsx:178`
**Autoplaying canvas animations ignore prefers-reduced-motion, against the repo's own convention**

GaltonInlineSim runs an unconditional requestAnimationFrame loop that spawns and animates balls forever (lines 118-180); app/galton/explorer/page.tsx does the same (lines 110-212, autostarts with running=true). Neither checks matchMedia("(prefers-reduced-motion: reduce)"). CLAUDE.md states "Per-component canvases also check the media query and freeze", and many components in the repo do (TopicConstellation, NoiseLadder, all signature heroes). The only global mitigation in globals.css shortens CSS animations, which does nothing for rAF canvases. GaltonNormalOverlay is static and fine.

_Fix:_ In both components, read the reduced-motion media query; when it matches, render one static frame (e.g. pre-fill the histogram with the exact binomial and skip spawning/stepping) instead of looping, and re-check on the media query's change event.

### 🟠 MED · a11y · `components/GaltonInlineSim.tsx:195`
**Canvases, range sliders and the icon-only reset button have no accessible names**

All three galton canvases (GaltonInlineSim.tsx line 195-198, GaltonNormalOverlay.tsx line 152-155, explorer page.tsx line 224) lack aria-label/role, unlike e.g. CardioidLightDemo.tsx line 156 which sets aria-label on its canvas. The sliders' captions are sibling <div>s with no htmlFor/aria-label association (GaltonInlineSim lines 213-229 and 233-246; explorer SliderRow lines 341-353), so screen readers announce bare unnamed sliders. The reset button's only content is the glyph "⟳" (GaltonInlineSim lines 203-208, explorer "⟳ Clear histogram" is fine), giving it no usable name.

_Fix:_ Add aria-label to each canvas (localized via a new prop fed from RICH_STORY), aria-label on each <input type="range"> (reuse the visible label string), and aria-label (e.g. the existing ballsLabel reset wording or "Reset") on the ⟳ button.

### 🟡 LOW · content · `components/GaltonInlineSim.tsx:119`
**"Spawn / frame" label overstates the spawn rate by 4x**

Balls are only spawned inside the STEP_EVERY gate: `if (frame % STEP_EVERY === 0)` with STEP_EVERY = 4 (l.72, l.119-122), so a setting of "Spawn / frame = 1" actually spawns 1 ball per 4 frames (~15/s at 60fps), not per frame. The explorer has the identical gate (app/galton/explorer/page.tsx l.62, l.113-117). The slider works, but the user-facing unit in all 8 locales (simSpawnLabel "Spawn / frame") is wrong by the gating factor.

_Fix:_ Rename the label to "Spawn / step" or "Balls / tick" (updating simSpawnLabel in all locales), or spawn every frame and only gate the b.y++ physics step.

### 🟡 LOW · math · `app/galton/page.tsx:968`
**iid CLT formula displayed under the Lyapunov/Lindeberg (non-iid) caption**

The box captioned "Lyapunov 1901 · Lindeberg 1922" shows (X₁ + X₂ + … + Xₙ − nμ) / (σ√n) → 𝒩(0, 1), which presumes one common μ and σ, i.e. the identically-distributed case. The surrounding Section 04 text in all locales stresses "take ANY independent random variables" (heterogeneous), which is exactly what Lindeberg/Lyapunov cover with sₙ = √(Σσᵢ²) instead of σ√n. Formula and attribution are individually fine but mismatched: the displayed statement is the classical iid CLT, not the theorems named above it.

_Fix:_ Either caption the box "Classical CLT (iid)" or display the Lindeberg form (ΣXᵢ − Σμᵢ)/√(Σσᵢ²) → 𝒩(0, 1).

### 🟡 LOW · content · `components/GaltonInlineSim.tsx:119`
**"Spawn / frame" label is wrong by a factor of 4: spawning is gated to every 4th frame**

Both the inline sim (lines 117-121) and the explorer (lines 110-116) push cfg.spawnRate balls only when frame % STEP_EVERY === 0 with STEP_EVERY = 4, so the actual rate is spawnRate per 4 frames (about spawnRate × 15/s at 60fps), not per frame. The user-facing label in all 8 RICH_STORY locales (app/galton/page.tsx, e.g. line 121 "Spawn / frame") and the explorer sidebar (line 258) says per frame.

_Fix:_ Rename the label to "Spawn / step" (or "Spawn rate") in the RICH_STORY simSpawnLabel of all locales and in the explorer SliderRow, or spawn every frame while keeping only the b.y++ physics gated.

### 🟡 LOW · i18n · `app/galton/page.tsx:475`
**Grammar errors in the Italian and Norwegian locale blocks**

IT line 475: "Cadi quest'ipotesi e prendono il sopravvento..." — cadere is intransitive; "cadi" (you fall) cannot take an object, so the sentence is ungrammatical. NO line 730: "et århundre før den generelle utsagnet" — utsagn is neuter, so the article must be "det", not "den". NO line 735: "skarpsleipet av Lindeberg" is not a Norwegian word (intended: sharpened).

_Fix:_ IT: "Lascia cadere quest'ipotesi..." (or "Abbandona quest'ipotesi"). NO line 730: "det generelle utsagnet". NO line 735: "skjerpet av Lindeberg i 1922".


## godel

### 🔴 HIGH · ⚠️ UNVERIFIED · math · `app/godel/explorer/page.tsx:82`
**Explorer shows a Gödel number for "∀x (0 = 0)" that silently omits the variable x, so the displayed number does not encode the displayed formula**

The FORMULAS entry has expr "∀x (0 = 0)" but tokens ["∀", "(", "0", "=", "0", ")"] — no "x" token, and ALPHABET (lines 44-55) has no code for variables at all. Step 2 renders the header "∀x (0 = 0) becomes a single number" and then shows godelNumber(tokens) = 2^3·3^9·5^6·7^5·11^6·13^10, which is the Gödel number of "∀(0=0)", not of the advertised 7-symbol formula. This directly contradicts the step's own lesson text ("Prime factorisation is unique, so the encoding is reversible"): decoding the shown number can never recover the x. The sidebar also reports symbolsCount(6) = "6 symbols" for a formula displayed with 7 symbols. (If a glyph were passed that is missing from ALPHABET, lookupCode returns 0 and the symbol contributes factor 1, silently vanishing — same failure mode.)

_Fix:_ Add a variable symbol to ALPHABET (e.g. { glyph: "x", meaningKey: "variable", code: 11 }, with a matching meanings key in all 8 locales) and include "x" in the tokens array; PRIMES already has 10 entries so a 7-token formula still fits. Alternatively swap the fourth formula for one expressible in the current alphabet, e.g. expr "0 + 0 = 0" with tokens ["0", "+", "0", "=", "0"].

### 🟡 LOW · content · `app/godel/page.tsx:45`
**Story page and explorer of the same room assign conflicting Gödel codes to the same symbols**

The story's GODEL_SYMBOL_TABLE assigns "·" (times) → 9 and "(" → 10; the explorer's ALPHABET (app/godel/explorer/page.tsx lines 53-54) assigns "(" → 9 and ")" → 10, with no times symbol. Codes 1-8 agree between the two files. A learner who reads the story table and then opens the explorer sees "(" carry two different codes within one topic room. Both files carry the "illustrative, conventions vary" caveat, but the inconsistency is internal to the site, not across sources.

_Fix:_ Unify the two tables — e.g. extend both to 11 entries ("·" → 9, "(" → 10, ")" → 11) or drop "·" from the story table so codes 1-10 match the explorer exactly; ideally hoist the shared alphabet into a small lib module both pages import.

### 🟡 LOW · i18n · `lib/i18n/stories.ts:1715`
**German story section uses generic masculine "Jeder", violating the repo's gender-neutral German convention**

In s.pages.godel section 1 (DE): "Jeder mit Papier und Geduld könnte im Prinzip jede mathematische Frage klären." CLAUDE.md mandates gender-neutral German prose (Studierende, Mathematiker:innen); the generic masculine "Jeder" for persons breaks that rule. The EN source ("Anyone with paper and patience") is person-neutral.

_Fix:_ Rephrase gender-neutrally, e.g. "Alle mit Papier und Geduld könnten im Prinzip jede mathematische Frage klären."

### 🟡 LOW · code · `components/signature/GodelLoopHero.tsx:83`
**Hardcoded rgba() colour literals duplicate existing palette tokens**

Line 83 uses stroke="rgba(179,136,255,0.18)" — 179,136,255 is exactly palette.signal.violet (#b388ff) — and line 93 uses fill="rgba(5,6,10,0.85)" — 5,6,10 is exactly palette.ink[950] (#05060a). The component already imports palette and uses palette.signal.violet three lines later; recent repo-wide commits (d3b3593, 2bf7a41) swept inline colour literals into palette tokens, and these rgba() forms were missed, so a future palette change would leave the ghost stroke and marker chip out of sync.

_Fix:_ Derive them from the tokens, e.g. a small withAlpha(hex, a) helper or SVG stroke-opacity/fill-opacity attributes: stroke={palette.signal.violet} strokeOpacity="0.18" and fill={palette.ink[950]} fillOpacity="0.85".


## halting

### 🔴 HIGH · ⚠️ UNVERIFIED · math · `app/halting/explorer/page.tsx:200`
**Count to 100 claims 'halts after exactly 201 instruction steps' but the VM halts at step 301**

COUNT_TO_100 = '+'.repeat(100) + '[-]'. Recomputation with the stepVM semantics (every executed instruction increments step): 100 '+' = 100 steps; entering '[' = 1 step; then 100 loop iterations each costing 2 steps ('-' then ']', which jumps back while the cell is nonzero and falls through on the last pass) = 200 steps. Total 100 + 1 + 200 = 301. The status line therefore literally displays 'halted at step 301' right next to the sidebar 'truth' claiming 201, so the UI contradicts itself in front of the user.

_Fix:_ Change the truth string to 'Halts after exactly 301 instruction steps.' (or reword to 'after ~300 steps' if you do not want to commit to the counting convention).

### 🟠 MED · ⚠️ UNVERIFIED · i18n · `app/halting/explorer/page.tsx:187`
**Explorer is entirely English-only: no RICH_EXPLORER despite heavy UI prose, unlike sibling explorers**

All program labels, descriptions, and truth lines (PROGRAMS, lines 187-235), the status line strings ('halted at step …', 'still running after … steps — we cannot say if it ever halts', lines 308-316), and section headers ('Program', 'Controls', 'Step limit', 'Speed', 'Tape', 'Ground truth', the step-cap explainer at lines 476-479) are hardcoded English. The story page localizes its DIAGRAM for all 8 locales, and other prose-heavy explorers (app/eulerchar/explorer/page.tsx, app/mobius/explorer/page.tsx, app/doublependulum/page.tsx) declare per-locale RICH_EXPLORER/RICH_STORY records, so a de/fr/… visitor gets a fully translated story page and then an all-English explorer.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, …> covering the program labels/descriptions/truths, control captions, and the three status-line templates, per the repo convention.

### 🟠 MED · ⚠️ UNVERIFIED · code · `app/halting/explorer/page.tsx:99`
**stepVM mutates state.tape in place inside setState updaters; StrictMode double-invocation corrupts the tape in dev**

stepVM writes tape[pointer] = (tape[pointer] + 1) & 0xff (lines 99, 103) on the Uint8Array owned by the previous state, and is called inside setState updater functions (stepOnce line 267, the batch loop lines 286-297). next.config.mjs sets reactStrictMode: true, and React StrictMode intentionally invokes updater functions twice in development to surface exactly this impurity: both invocations mutate the same shared Uint8Array, so every '+'/'-' is applied twice. In dev, 'Count to 100' visibly counts cell 0 up by 2 per step. Production is unaffected, but the updater is genuinely impure.

_Fix:_ Copy the tape before mutating in stepVM (const tape = state.tape.slice() or new Uint8Array(state.tape)) so the updater is pure; the per-frame batch already reuses the returned state so only one copy per stepVM call is added.

### 🟠 MED · ⚠️ UNVERIFIED · a11y · `app/halting/explorer/page.tsx:467`
**Both range sliders (step limit, speed) have no accessible name**

The inputs at lines 467-475 and 486-494 carry no aria-label and their visual captions ('Step limit · {stepCap}', 'Speed · {speed} steps/sec') are plain divs not associated via <label htmlFor> or aria-labelledby, so screen readers announce two anonymous sliders. Sibling explorers do label their inputs (aria-label at app/boids/explorer/page.tsx:514, app/chaosgame/explorer/page.tsx:437, app/dla/explorer/page.tsx:565, app/lsystem/explorer/page.tsx:475), so this deviates from the repo's own a11y convention.

_Fix:_ Add aria-label="Step limit" and aria-label="Speed in steps per second" to the two range inputs (or convert the caption divs to <label> elements wired with htmlFor/id).

### 🟠 MED · ⚠️ UNVERIFIED · i18n · `app/halting/page.tsx:158`
**finalLabel="Try it." is hardcoded English and rendered for all 8 locales**

The page carefully localizes its DIAGRAM record for all 8 locales, but the StoryPageShell finalLabel prop (rendered visibly at components/StoryPageShell.tsx:259) is the English literal "Try it." regardless of locale. Other pages pass localized values: app/doublependulum/page.tsx carries per-locale finalLabel entries ("Lass es los.", "Suéltalo.", …) and cardioid/riemann/sierpinski use story.closingTitle.

_Fix:_ Add a finalLabel field to the local DIAGRAM record (all 8 locales) and pass finalLabel={d.finalLabel}, or reuse an existing localized UI string.

### 🟡 LOW · content · `app/halting/page.tsx:124`
**Swedish and Norwegian write 'Stoppproblemet' with a triple p, contradicting the site's own atlas spelling**

sv conclusionBody (line 124) says 'Stoppproblemet är oavgörbart.' and no conclusionBody (line 137) says 'Stoppproblemet er uavgjørbart.' Both Swedish and Norwegian orthography reduce three identical consecutive consonants in compounds to two, and lib/i18n/atlas.ts itself titles the topic 'Stopproblemet' (sv, line 1603) and 'Stoppe-problemet' (no, line 1838), so the page contradicts the atlas card shown for the same topic.

_Fix:_ Change to 'Stopproblemet' in the sv entry and 'Stopproblemet' (or 'Stoppe-problemet' to match the atlas title) in the no entry.

### 🟡 LOW · i18n · `app/halting/page.tsx:65`
**Spanish uses the non-existent verb 'buclar' ('D bucla para siempre con D')**

Lines 65 and 69 use 'bucla' as a conjugated verb ('D bucla para siempre con D', 'Pero H dijo que D bucla'). Spanish has no standard verb 'buclar'; 'bucle' is only a noun. The site's own Spanish atlas copy for this topic (lib/i18n/atlas.ts:665) correctly uses 'hacer bucle' phrasing.

_Fix:_ Use 'D entra en un bucle infinito con D' / 'Pero H dijo que D entra en bucle.' to match the atlas wording.

### 🟡 LOW · visual · `components/signature/HaltingTapeHero.tsx:32`
**Tape-hero head never moves ('_setHeadIdx' is dead) and the halt setTimeout is never cleared on unmount**

headIdx is initialized to the middle cell and its setter is intentionally unused (line 32), so the head stays pinned while the aria-label ('a moving head', line 85) and the caption 'STEP · WRITE · MOVE' promise motion; only the occasional tape shift creates movement. Additionally, the setTimeout(() => setHalted(false), 1100) at line 53 has no cleanup, so unmounting during the 1.1s halt beat calls setHalted on an unmounted component (harmless in React 18 but a leak; every other listener/raf in the file is cleaned up).

_Fix:_ Either animate headIdx (e.g. drift it a cell on some ticks) or drop the unused state and soften the aria-label; store the timeout id in a ref and clearTimeout it in the effect cleanup.


## hilberthotel

### 🔴 HIGH · i18n · `app/hilberthotel/page.tsx:789`
**Norwegian uses "oversettbar" (= translatable) where it must say uncountable ("overtellbar")**

In the no locale, section 06 pretitle is "Den oversettbare broen" (line 789), the body says "De reelle er oversettbare" (line 791), and cardinalityUncountable is "oversettbar" (line 820). Norwegian "oversettbar" derives from "oversette" (to translate) and means "translatable"; the set-theory term for uncountable is "overtellbar" (cf. the Swedish block which correctly uses "överuppräknelig"). Norwegian readers are told the reals are "translatable", which is wrong content in the key term of the whole section, shown in three places including the widget badge.

_Fix:_ Replace all three occurrences: "Den overtellbare broen", "De reelle er overtellbare", cardinalityUncountable: "overtellbar" (or "ikke tellbar").

### 🔴 HIGH · math · `components/HilbertHotelCardinality.tsx:68`
**Reals mode: rows never have more than 8 digits, so the diagonal construction breaks for rows 9-10**

s = frac.toFixed(8).slice(2, 2 + Math.max(count, 8)): toFixed(8) yields at most 8 fractional digits, so slice can never return more than 8 chars regardless of count (verified by running the exact code: every row prints len=8 at count=10). With the slider at 9 or 10, rows 9 and 10 display only 8 digits, the bolded diagonal digit (j === i) does not exist for i >= 8, and the diagonal real's 9th/10th digits are computed from the phantom fallback "0" (line 90, d = s[n] ?? "0" -> "6"). The demo's central claim, "the diagonal real differs from row n at the n-th digit", is visibly not demonstrated for those rows. Side note: the flip ((d+5)%9)+1 produces 1..9 (d=3 -> 9), not "{1..8}" as the line 91 comment claims.

_Fix:_ Generate at least max(count,8)+ digits per row, e.g. frac.toFixed(12).slice(2, 2 + Math.max(count, 8)) (12 > max slider 10), reusing the same expression in both the rows and diagonal memos; optionally fix the flip to ((d+5)%8)+1 to actually stay in 1..8.

### 🟠 MED · code · `components/HilbertHotelCardinality.tsx:162`
**count is not clamped when switching to reals mode, so it can exceed the mode's max of 10**

The slider max is mode-dependent (max={mode === "reals" ? 10 : 16}) but setMode never adjusts count. Set count=16 in doubles/pairs, then click "N -> R ?": the state stays 16, the table renders 16 real rows (each with only 8 digits, compounding the diagonal bug above), the count readout shows 16 while the thumb is clamped to 10, and the diagonal gets 16 digits, half of them fabricated from the "0" fallback.

_Fix:_ Clamp on mode change: in the reals button handler do setCount((c) => Math.min(c, 10)) alongside setMode("reals"), or compute an effective count = Math.min(count, mode === "reals" ? 10 : 16) in the memos.

### 🟠 MED · content · `app/hilberthotel/page.tsx:197`
**German copy uses generic masculine forms, violating the repo's gender-neutral German rule**

Line 197: "Ein Reisender klopft" and "frei für den Neuen"; line 232 (inlineHint): "Rose ist ein Buspassagier" and "bei Buspassagieren". CLAUDE.md mandates gender-neutral German (Studierende, Mathematiker:innen), and the same file already does it correctly elsewhere ("k Passagier:innen", "Bus-k-Passagier:in m"), so these four spots are inconsistent within the same locale bundle.

_Fix:_ Rewrite neutrally, e.g. "Eine reisende Person klopft" / "frei für den neuen Gast", and "Rose ist ein Gast aus dem Bus" / "bei Busgästen" (or "Buspassagier:in" / "Buspassagier:innen").

### 🟠 MED · a11y · `app/hilberthotel/explorer/page.tsx:492`
**All three range sliders in the room have no accessible name**

grep confirms zero aria-label occurrences across explorer/page.tsx, HilbertHotelInline.tsx and HilbertHotelCardinality.tsx. The k slider (explorer line 492), speed slider (explorer line 551) and rows slider (HilbertHotelCardinality.tsx line 158) are bare <input type="range"> elements; their visible captions are sibling <div>/<span> text with no htmlFor/id association, so screen readers announce only "slider" with no name.

_Fix:_ Add aria-label={...} to each range input (e.g. aria-label="k — new guests", aria-label="speed, steps per second", aria-label={sliderLabel}) or associate the existing caption via <label htmlFor> and an id.

### 🟠 MED · math · `components/HilbertHotelInline.tsx:34`
**Buses-scenario gap note claims all ∅ rooms are non-prime-powers, but room 11 shows ∅ and 11 = 11¹ is a prime power**

With ROOMS = 12 and BUS_PRIMES = [3, 5, 7], the buses scenario fills rooms 2, 4, 8 (existing → 2ⁿ), 3, 9 (bus 1), 5 (bus 2), 7 (bus 3). Empty rooms marked ∅: 1, 6, 10, 11, 12. The gapNoteLabel in all 8 locales says the grey ∅ rooms "are numbers that are not a prime power — no one maps there". Recomputation: 6 = 2·3, 10 = 2·5, 12 = 2²·3 are indeed not prime powers, but 11 = 11¹ IS a prime power; in the real scheme bus 4 passenger 1 (p₄ = 11) maps to room 11. The widget's own ∅ marking contradicts the printed mathematical claim.

_Fix:_ Either extend BUS_PRIMES to [3, 5, 7, 11] so room 11 gets bus 4 passenger 1 (as the explorer already does with 8 primes), or reword the gap note to "rooms no shown guest or bus maps to".

### 🟠 MED · math · `components/HilbertHotelCardinality.tsx:68`
**Reals mode: rows are capped at 8 digits while the diagonal grows with count, so the diagonal demo breaks for rows 9+**

Row digits come from frac.toFixed(8).slice(2, 2 + Math.max(count, 8)): toFixed(8) yields only 8 fractional digits, so s is always 8 chars regardless of count (slider allows up to 10 in reals mode). The diagonal (line 86-95) pushes one digit per row, so for count = 9 or 10 it is longer than every displayed row, the highlighted j === i diagonal cell does not exist for rows 9-10 (s[n] is undefined, falls back to "0"), and the on-screen claim "differs from row n at the n-th digit" is not demonstrable. Worse, setMode never clamps count: switching from doubles/pairs (max 16) to reals leaves count = 16 while the slider max is 10 — the label shows 16, the thumb shows 10, and 16 rows render with the diagonal highlight missing from row 9 on.

_Fix:_ Generate at least max-count digits per row (e.g. derive 10+ digits from the seed instead of toFixed(8)), and clamp count to the mode's max inside the mode-switch handlers (setCount(c => Math.min(c, 10)) when entering reals).

### 🟠 MED · i18n · `app/hilberthotel/page.tsx:950`
**Hardcoded English blocks in an otherwise fully 8-locale story page**

The page carries a complete RICH_STORY for all 8 locales, yet several user-visible strings are English literals rendered for every locale: "Prime-power assignment" (line 950), table headers "Who" / "Room" / "First rooms" (lines 955-961), row labels "Existing guest n" / "Bus 1 passenger m" (lines 966-970), the footnote "Unique prime factorisation guarantees…" (lines 980-983), the link "→ /cantor · the full diagonal argument" (line 1016), and "Take it further" (line 1026). A German or Swedish reader gets an English table dropped into the middle of translated prose.

_Fix:_ Move these strings into the RichStory type (e.g. primeTableTitle, primeTableHeaders, primeTableRows, primeTableNote, cantorLinkLabel, takeItFurther) and fill them for all 8 locales like the rest of the bundle.

### 🟠 MED · i18n · `app/hilberthotel/explorer/page.tsx:288`
**Explorer UI is English-only except for the atlas title/tagline/body**

Only topic.title/tagline/body (from a.topics.hilberthotel) and u.back are localized. Everything else is hardcoded English: scenarioLabels and scenario descs (lines 288-293, 457-464), "Hilbert Hotel · rooms 1…64 (continues ad infinitum)" (line 309), "Lobby queue", "— all checked in —", "guests in rooms beyond #" (lines 384-420), "Step/Play/Pause/Reset", "Scenario", "Controls", "Speed", "Legend", "Existing guest", "New guest (one / k / ℵ₀)", "Bus … prime …" and the guest tooltips (lines 352-358). The repo's stated pattern for string-heavy explorers is a local RICH_EXPLORER keyed by Locale (see app/eulerchar/explorer/page.tsx, app/mobius/explorer/page.tsx); a non-English user lands here from a fully translated story page.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, …> bundle covering the scenario labels/descs, control labels, legend and tooltips, following the eulerchar/mobius explorer pattern.

### 🟡 LOW · i18n · `app/hilberthotel/explorer/page.tsx:309`
**Explorer UI is hardcoded English for all 8 locales while the story page is fully localized**

Scenario labels/descriptions (lines 288-299, 457-464), "Lobby queue", "all checked in", "Step/Play/Pause/Reset", "Speed", "Legend", "Existing guest", guest tooltips, and the header "rooms 1…64 (continues ad infinitum)" are all English literals; only topic.title/tagline/body and u.back come from i18n. A German or French visitor gets a half-translated room. Other explorers share this pattern (backprop, halting, sat), but this room's story page ships a meticulous 8-locale RICH_STORY, making the gap conspicuous.

_Fix:_ Add a local RICH_EXPLORER: Record<Locale, ...> (the pattern used in app/mobius/explorer and app/eulerchar/explorer) covering the control, legend and tooltip strings.

### 🟡 LOW · i18n · `app/hilberthotel/page.tsx:606`
**Portuguese closingBody contains the Spanish word "truco" instead of "truque"**

pt closingBody: "…para perceber por que este truco em particular deixa de funcionar." "truco" is Spanish (used correctly in the es bundle, line 318); Portuguese is "truque", which the pt bundle itself uses in section 06 ("o truque parte-se", line 601).

_Fix:_ Change "este truco em particular" to "este truque em particular".

### 🟡 LOW · content · `app/hilberthotel/page.tsx:681`
**Swedish grammar error: "Rum 1 till k tömmas" should be "töms"**

sv section 03 body: "Rum 1 till k tömmas i en rörelse" uses the infinitive passive "tömmas" as a finite verb; correct present-tense Swedish is "töms" ("Rum 1 till k töms i en rörelse").

_Fix:_ Replace "tömmas" with "töms".

### 🟡 LOW · content · `app/hilberthotel/page.tsx:197`
**German copy uses generic masculine ("Ein Reisender", "ein Buspassagier") against the repo's gender-neutral convention**

CLAUDE.md mandates gender-neutral German. Line 197: "Ein Reisender klopft … Zimmer 1 ist frei für den Neuen." and line 232 (de inlineHint): "Rose ist ein Buspassagier … bei Buspassagieren" use the generic masculine, while the same DE block correctly writes "Passagier:innen" in sections 03 and 05 — the file is internally inconsistent.

_Fix:_ Rephrase neutrally, e.g. "Eine reisende Person klopft … Zimmer 1 ist frei für den neuen Gast." and "Rose ist ein Gast aus einem Bus … (bzw. Bus·Sitz bei Busgästen)".

### 🟡 LOW · a11y · `components/HilbertHotelCardinality.tsx:158`
**Range sliders have no accessible name in the cardinality widget and the explorer**

The rows slider (HilbertHotelCardinality.tsx line 158), the k slider (app/hilberthotel/explorer/page.tsx line 492) and the speed slider (line 551) are <input type="range"> elements with no aria-label, no id, and no associated <label> — the visible caption is a sibling <div>/<span>, so screen readers announce an unnamed slider. grep confirms zero aria-label occurrences across all three hilberthotel files.

_Fix:_ Add aria-label={sliderLabel} (cardinality) and aria-label="k — new guests" / "speed, steps per second" (explorer), or wire the captions up via htmlFor/id.


## iota

### 🔴 HIGH · math · `app/iota/page.tsx:1030`
**S-derivation trace shows a mathematically wrong step: "(ι (ι ι)) S K (S K)" instead of "(ι (ι ι)) S K S K"**

Recomputation: after step 1, the term is (ι (ι (ι ι))) S K. The only redex is ι applied to (ι (ι ι)), which rewrites to (ι (ι ι)) S K; applied to the remaining S and K this yields, left-associated, ((ι (ι ι)) S K) S K = (ι (ι ι)) S K S K. The page prints the last K argument grouped as "(S K)", i.e. ((ι (ι ι)) S K)(S K), a different term. I ran the repo's own engine (lib/iota/reduce.ts reduceTrace on "ι (ι (ι (ι ι)))"): step 2 is "ι (ι ι) S K S K" (flat), so the interactive Reducer one section below contradicts this static trace. The K trace right above it (line 997, "S S K K S K S K") uses the correct flat grouping.

_Fix:_ Change line 1030 to "→ (ι (ι ι)) S K S K   — repeat on the next layer".

### 🟠 MED · content · `app/iota/page.tsx:1036`
**Iota counts are wrong: "Four iotas" for the S expression (has five) and "three strokes" for the K expression (has four)**

ι (ι (ι (ι ι))) contains five ι symbols (1+1+1+2), yet line 1036 says "Four iotas, no other primitives — and S appears." Likewise the Section-04 story body claims K falls out "From three strokes of one symbol" for ℩(℩(℩℩)), which contains four iotas — repeated in all 8 locales (en line 102, de 194 "Aus drei Strichen", es 285 "tres trazos", fr 377, it 468, pt 559, sv 650, no 741).

_Fix:_ Line 1036: "Five iotas, no other primitives". In the 8 locale bodies for Section 04, change three→four ("From four strokes of one symbol" / "Aus vier Strichen" etc.), or rephrase to count nesting depth explicitly.

### 🟠 MED · i18n · `components/IotaReducerMini.tsx:179`
**Reducer controls are English-only, contradicting the localized instructions that name a translated Step button**

The mini reducer's UI strings are hardcoded English: "custom expression (overrides preset)" (line 101), "reset"/"back"/"step →"/"to end" (163-187), "normal form"/"step limit"/"done"/"reducing…" (130-134), plus the rule footnote (191-195). But the page's localized reducerBody explicitly tells users to press a translated button: de "Schritt drücken" (app/iota/page.tsx:211), es "Pulsa Paso" (302), fr "Appuie sur Étape" (394), it "Premi Passo" (485), pt "Prime Passo" (576), sv "Tryck Steg" (667), no "Trykk Steg" (758) — no such button exists; it is always labeled "step →". The full /iota/reducer page has the same problem (all chrome English-only: "Expression", "Reduction trace", "Examples", "Step limit", "Some expressions diverge…") while its sidebar topic copy IS localized via atlas.

_Fix:_ Extend the labels-prop pattern already used by IotaKSPlayground: pass a localized labels object (step/back/reset/toEnd/normalForm/stepLimit/customExpression/...) from RICH_STORY into IotaReducerMini, and add a RICH_EXPLORER Record<Locale,...> to app/iota/reducer/page.tsx per the repo convention.

### 🟠 MED · i18n · `app/iota/page.tsx:916`
**Multiple explainer blocks in the story page are hardcoded English and shown untranslated to all 8 locales**

Although the page carries a complete 8-locale RICH_STORY, several JSX asides bypass it: "every computable function" (line 875), the λ-calculus box ("abstraction", "application", "a function from x to M", "apply M to N", "A combinator is a λ-term with no free variables. It carries no context, only structure.", lines 897-918), "K · the constant" / "S · substitution-with-sharing" (930, 938), "One symbol. One rewrite rule … falls out as a corollary." (975-978), the trace annotations and "The exact chain depends on the reduction strategy … lands on K in a small handful of steps." (993-1013), "Four iotas … walk every step." (1035-1045), and "The last three arrows are textbook results; the first is Barker's contribution …" (1084-1088). A German or Swedish reader gets full English paragraphs sandwiched between translated sections.

_Fix:_ Move these strings into the RichStory type (e.g. lambdaBox, kSBox, kDerivationNote, sDerivationNote, chainNote fields) and fill them for all 8 locales like the rest of the bundle.

### 🟠 MED · content · `app/iota/page.tsx:342`
**French card 01 contains a nonsense duplicated phrase: "jamais écrit, ou jamais écrit"**

fr encounter card 01 reads "…n'importe quel programme informatique jamais écrit, ou jamais écrit." The EN source is "any computer program that has ever been written, or ever could be" — the second clause was copy-pasted instead of translated as a potential, so the French sentence says "ever written, or ever written".

_Fix:_ Change to "…n'importe quel programme informatique jamais écrit, ou qui pourrait jamais l'être."

### 🟡 LOW · a11y · `components/IotaReducerMini.tsx:100`
**Custom-expression input has no accessible name: <label> is a sibling without htmlFor**

Lines 100-113: the <label className="mb-1 block…">custom expression (overrides preset)</label> neither wraps the <input> nor carries htmlFor, so screen readers announce an unlabeled text field. Contrast IotaKSPlayground (components/IotaKSPlayground.tsx:65-100) where each <label> correctly wraps its input.

_Fix:_ Wrap the input in the <label> (as IotaKSPlayground does) or add id="iota-custom-expr" on the input and htmlFor on the label.

### 🟡 LOW · a11y · `app/iota/reducer/page.tsx:153`
**Step-limit range slider and expression textarea have no accessible names**

The <input type="range"> (lines 153-161) has no aria-label; the "Step limit" heading (146-148) is an unassociated <div>. Same for the expression <textarea> (57-63): the "Expression" caption (50-56) is a plain div, so both controls are announced without a name.

_Fix:_ Add aria-label="Step limit" (or htmlFor/id pairing with a real <label>) to the range input, and aria-label="Expression" or a labelled <label> for the textarea.

### 🟡 LOW · visual · `components/IotaReducerMini.tsx:118`
**Inline rgba literals duplicate the signal-cyan/signal-rose palette tokens**

style={{ borderColor: result.ok ? "rgba(125,243,255,0.35)" : "rgba(255,122,182,0.45)" }} hardcodes the palette values: tailwind.config.ts defines signal.cyan #7df3ff = rgb(125,243,255) and signal.rose #ff7ab6 = rgb(255,122,182). The repo just finished a sweep replacing inline hex/rgba with palette tokens (commits 7bf1352, d3b593, 2bf7a41); this one was missed.

_Fix:_ Drop the style prop and toggle Tailwind classes instead: className={result.ok ? "border-signal-cyan/35 …" : "border-signal-rose/45 …"}.


## langton

### 🟠 MED · math · `app/langton/explorer/page.tsx:24`
**Preset descriptions misstate known multi-color ant behaviors: RRLLLRLLLRRR is not a spiral, RLR is not a triangle**

The standard catalogue of multi-color turmites (Propp / Wikipedia 'Extension to multiple colors') gives: RLR grows chaotically; LLRR grows symmetrically; LRRRRRLLR fills space in a square around itself; RRLLLRLLLRRR creates a filled TRIANGLE shape that grows and moves; LLRRRLRLRLLR is the rule that creates a convoluted highway. The explorer labels RRLLLRLLLRRR as 'Spiral / tight spiral arms' (line 24), which it does not produce, and labels RLR as 'Triangle' (line 21) while its own note correctly says 'growing chaotic'. The 'Triangle' label belongs to RRLLLRLLLRRR.

_Fix:_ Rename preset RLR to 'Chaotic' and preset RRLLLRLLLRRR to 'Triangle' with note 'filled triangle, grows and moves'; if a spiral preset is wanted, use a rule actually known to spiral (e.g. LLRRRLRLRLLR for a convoluted highway is another verified option).

### 🟠 MED · content · `app/langton/page.tsx:148`
**Gajardo-Moreira-Goles 2002 result misattributed to a subset of generalized ants; they proved it for the classic RL ant**

Section 06 in all 8 locales says 'A subset [of n-color generalized ants], identified by Gajardo, Moreira and Goles in 2002, is Turing-complete', and encounter card 03 (line 114) says they 'proved that generalised ants can simulate any Turing machine'. The actual result (Gajardo, Moreira, Goles, 'Complexity of Langton's ant', Discrete Applied Mathematics 117, 2002) is about the ORIGINAL two-color RL ant: any boolean circuit / Turing machine can be simulated by encoding it into the classic ant's initial configuration, making the classic ant's trajectory P-hard and computation-universal. Attributing universality only to a subset of generalized ants both misstates the theorem and understates it; the same error is copy-translated into de/es/fr/it/pt/sv/no.

_Fix:_ Reword card 03 and section 06 in all locales: the 2002 GMG construction encodes circuits into the starting configuration of the classic RL ant itself, proving the plain two-rule ant is computation-universal; generalizations add colors but universality does not require them.

### 🟠 MED · visual · `app/langton/explorer/page.tsx:68`
**Window resize wipes the entire trail: canvas dimensions reassigned unconditionally with no repaint, and gridW/gridH go stale**

The ResizeObserver callback (lines 67-73) sets canvas.width/height unconditionally; assigning width/height clears a canvas (even when assigning the same value, as happens on the initial observe delivery). Unlike LangtonMiniRunner (which guards with `if (canvas.width !== w)` and has paintAll), the explorer has no full-grid repaint function, so after any window resize the accumulated trail vanishes while the simulation keeps running on the old gridW/gridH (computed once at lines 78-79), leaving the ant drawing into a grid that no longer matches the visible canvas (blank margins or clipped cells).

_Fix:_ Guard the assignments like the mini runner, and on an actual size change either call reseed() or add a paintAll() that redraws the grid from the Uint8Array and recomputes gridW/gridH (migrating or clamping ax/ay).

### 🟠 MED · a11y · `app/langton/explorer/page.tsx:157`
**Explorer and mini-runner canvases have no accessible name, and range sliders have no associated labels**

The explorer canvas (line 157) and the LangtonMiniRunner canvas (components/LangtonMiniRunner.tsx line 183) have no role/aria-label, unlike the inline HighwaySVG which does (page.tsx line 42). The SliderRow inputs (explorer page.tsx line 285) render their label in a sibling div with no <label htmlFor>/aria-label, so screen readers announce an unnamed slider; same for the mini runner speed slider (LangtonMiniRunner.tsx line 223, 'speed' is a plain span).

_Fix:_ Add role="img" plus a descriptive aria-label to both canvases, and give each range input an aria-label (or wrap with <label>) using the visible label text.

### 🟠 MED · animation · `components/LangtonMiniRunner.tsx:37`
**Neither LangtonMiniRunner nor the explorer respects prefers-reduced-motion; both autoplay a continuous rAF animation**

Both components start with running=true (LangtonMiniRunner.tsx line 37, explorer page.tsx line 52) and run an unconditional requestAnimationFrame loop with no matchMedia('(prefers-reduced-motion: reduce)') check. The repo convention (CLAUDE.md: 'Per-component canvases also check the media query and freeze') is implemented in e.g. app/diffusion/explorer/page.tsx lines 765-776, but the langton room ignores the preference entirely, so motion-sensitive users get a permanently animating full-viewport canvas.

_Fix:_ Mirror the diffusion explorer pattern: read the media query, initialize running=false (or freeze the loop after painting one static frame) when reduce is set, and subscribe to changes.

### 🟠 MED · i18n · `app/langton/page.tsx:893`
**Hardcoded English UI strings on the fully localized page: legend block, 'run it yourself', and all mini-runner controls**

The page carries a complete 8-locale RICH_STORY, yet the runner legend ('hint', 'violet cells · black squares', 'amber pixel · the ant', 'empty · white squares', lines 888-901) and the closing pretitle 'run it yourself' (line 961) are hardcoded English literals rendered identically for de/es/fr/it/pt/sv/no. LangtonMiniRunner's controls ('Pause'/'Play', 'step', '+100', 'reset', 'speed', the 'step'/'dir' readout) and the explorer sidebar ('Rule', 'Steps / frame', 'Cell size (px)', 'Pause'/'Play', 'Reset', 'rule = X · N colours') are likewise untranslated, while adjacent copy (runnerHint, runnerLabel) is fully localized, so e.g. the German page mixes 'Schiebe den Regler auf 1...' with an English 'hint'/'speed'/'step' UI.

_Fix:_ Move these strings into the RichStory type (page) and into props/RICH-style records or the shared UI bundle `u` (runner + explorer), following the runnerLabel/runnerHint pattern already in place.

### 🟠 MED · content · `app/langton/page.tsx:148`
**Turing-universality result misattributed to generalised n-colour ants instead of the classic RL ant**

Section 06 claims "A subset [of generalised n-colour ants], identified by Gajardo, Moreira and Goles in 2002, is Turing-complete" and card 03 (line 114) says they "proved that generalised ants can simulate any Turing machine". The actual result (Gajardo, Moreira, Goles, "Complexity of Langton's ant", Discrete Applied Mathematics 117, 2002; construction announced 2000) shows that the trajectory of a single CLASSIC RL ant can compute any boolean circuit encoded in the starting configuration, which yields universal computation for the original two-colour ant, not for a special subset of generalised ants. The same misstatement is replicated in all 8 locales (de line 200/235, es, fr, it, pt, sv, no).

_Fix:_ Reword card 03 and section 06 in every locale: GMG showed the original RL ant itself computes any boolean circuit from a suitable finite starting configuration (hence universality); generalisations to n colours are a separate topic.

### 🟠 MED · content · `app/langton/explorer/page.tsx:24`
**Preset labels misdescribe rule behaviour: RRLLLRLLLRRR is not a spiral, and RLR is labelled Triangle while its own note says chaotic**

In the standard multi-colour ant taxonomy (Propp / the Wikipedia Langton's-ant table this list clearly derives from): RLR grows chaotically; LLRR grows symmetrically; LRRRRRLLR fills a square around itself; RRLLLRLLLRRR creates a filled TRIANGLE shape that grows and moves. Line 21 labels RLR "Triangle" while its note correctly says "growing chaotic" (self-contradictory), and line 24 labels RRLLLRLLLRRR "Spiral · tight spiral arms", which is not what that rule produces. The labels look shuffled.

_Fix:_ Rename RLR to "Chaotic" (note: grows chaotically) and RRLLLRLLLRRR to "Growing triangle" (note: filled triangle that grows and moves), or swap in an actual spiral rule such as LLRRRLRLRLLR (convoluted highway) with a correct note.

### 🟠 MED · visual · `app/langton/explorer/page.tsx:67`
**Resize wipes the trail and desyncs grid dimensions from the canvas**

The ResizeObserver callback unconditionally reassigns canvas.width/height (line 68-69), which clears the bitmap even when the size is unchanged (the initial observe() callback fires right after reseed() and erases its background fill), and it never recomputes gridW/gridH or repaints from `grid`. After any real resize (mobile URL-bar collapse, window drag) the accumulated trail vanishes and the ant keeps stepping on a grid sized for the OLD canvas: gridW/gridH at lines 78-79 are only set inside reseed(), so cells are drawn out of bounds or a dead band appears. LangtonMiniRunner.tsx (lines 59-67) guards the clear with `if (canvas.width !== w)` but has the same stale-grid/no-repaint problem on genuine resizes.

_Fix:_ Guard the assignments like the mini runner does, and on an actual size change either call reseed() or recompute gridW/gridH, reallocate/copy the grid, and repaint all cells from state.

### 🟠 MED · i18n · `app/langton/page.tsx:893`
**Hardcoded English strings inside an otherwise fully localised story page**

The page carries a complete 8-locale RICH_STORY, but several visible strings are hardcoded English JSX for every locale: "hint" (line 890), the runner legend "violet cells · black squares" / "amber pixel · the ant" / "empty · white squares" (lines 894-900), the "· live" suffix (line 871), and "run it yourself" in the closing CTA (line 961). German, Spanish, French, Italian, Portuguese, Swedish and Norwegian readers see raw English here.

_Fix:_ Add hintLabel, legend entries, liveSuffix and runItYourself fields to the RichStory type and fill them in all 8 locale objects (the type is local, so this stays within the inline pattern).

### 🟠 MED · a11y · `app/langton/explorer/page.tsx:157`
**Canvases have no accessible name and range sliders are not associated with their labels**

The explorer canvas (line 157) and the LangtonMiniRunner canvas (components/LangtonMiniRunner.tsx line 183) have no role/aria-label, unlike the page's HighwaySVG which correctly sets role=img + aria-label. SliderRow's <input type=range> (line 285) renders its label as a sibling <div>, so screen readers announce an unnamed slider; the mini runner's speed slider (LangtonMiniRunner.tsx line 223) has the same problem with a bare <span>. Other rooms in the repo do label comparable controls (e.g. app/dla/explorer/page.tsx line 565 passes aria-label).

_Fix:_ Give both canvases role="img" and a descriptive aria-label (e.g. "Langton's ant simulation, rule RL"), and add aria-label={label} to SliderRow's input and aria-label="speed" (localised) to the mini runner slider, or wire them up with htmlFor/id.

### 🟠 MED · animation · `components/LangtonMiniRunner.tsx:50`
**Auto-playing canvas animations ignore prefers-reduced-motion**

Both LangtonMiniRunner (running defaults to true, rAF loop starts on mount) and the explorer (app/langton/explorer/page.tsx line 52, running=true) animate continuously with no matchMedia("(prefers-reduced-motion: reduce)") check and no static fallback. CLAUDE.md states the repo convention that per-component canvases check the media query and freeze, and the global CSS rule only affects CSS transitions/animations, not rAF-driven canvas drawing.

_Fix:_ Read the media query in each effect (and subscribe to changes) and initialise running=false / freeze the loop after painting one static frame when reduce is set, leaving Play as an explicit opt-in.

### 🟡 LOW · content · `app/langton/page.tsx:163`
**'104 steps per loop · ... · indefinite period' contradicts itself; the period is exactly 104**

highwayDetail in every locale states the period twice with conflicting values: '104 steps per loop' then 'indefinite period' (DE line 250 'unbegrenzte Periode', ES 'período indefinido', etc.). The highway cycle's period is exactly 104 steps; what is unbounded is the duration/translation, not the period. The string is shown in two places (under the mini runner via the caption prop, line 882, and under the schematic, line 935).

_Fix:_ Replace the last clause with 'runs forever' / 'endlose Wiederholung' (repeats indefinitely) in all 8 locales so 'period' keeps its single, correct value of 104.

### 🟡 LOW · visual · `app/langton/page.tsx:894`
**Legend colors mislead ('violet cells' rendered in cyan) and #b388ff is hardcoded where the signal-violet token exists**

Line 894 renders the legend entry 'violet cells' with className text-signal-cyan, so the swatch text is cyan while the cells it describes are violet (ANT_COLORS.black = palette.signal.violet); line 897 similarly relies on text color as the legend key, making the cyan one actively wrong. Additionally line 854 uses bg-[#b388ff], the exact value of the signal.violet token (tailwind.config.ts line 21 and lib/visual/palette.ts), contradicting the recent repo-wide refactor replacing inline hex with palette tokens (commits 2bf7a41, d3b593).

_Fix:_ Use text-signal-violet for the 'violet cells' legend entry and replace bg-[#b388ff] with bg-signal-violet.

### 🟡 LOW · content · `app/langton/page.tsx:163`
**"indefinite period" contradicts the 104-step period it sits next to**

highwayDetail reads "104 steps per loop · 2 cells of translation · indefinite period" (DE line 250: "unbegrenzte Periode", sv "obegränsad period", etc.). The period is exactly 104 steps, which the same line states; what is unbounded is the duration of the highway run, not its period, so the phrase is mathematically self-contradictory.

_Fix:_ Change the third clause in all locales to something like "runs forever" / "läuft unbegrenzt weiter" instead of calling the period indefinite/unlimited.

### 🟡 LOW · visual · `app/langton/page.tsx:854`
**Hardcoded hex where a palette token exists, and the legend tints "violet cells" cyan**

Line 854 uses bg-[#b388ff], which is exactly palette.signal.violet (lib/visual/palette.ts line 15); recent commits (d3b/2bf) specifically swept such literals to tokens, so bg-signal-violet should be used. Additionally the runner legend at line 894 renders the words "violet cells" with className text-signal-cyan while the cells it describes are signal-violet, so the swatch-coloured label lies about its own colour.

_Fix:_ Replace bg-[#b388ff] with bg-signal-violet and change the legend span at line 894 to text-signal-violet.


## life

### 🔴 HIGH · content · `app/life/page.tsx:127`
**Gemini spaceship described as a "4 217 466-cell construction" with a 33.8-million-generation period; both numbers are wrong**

Section 05 (all 8 locales, e.g. EN line 127, DE line 237, ES line 347) says Andrew Wade's Gemini is a "4 217 466-cell construction that copies itself across the grid every 33.8 million generations". Per LifeWiki, Gemini's live-cell population is 846,278; the ~4.2M figure is its bounding-box dimension (4,217,807 x 4,220,191), and even that digit string does not match (4,217,466 vs 4,217,807). Its period is 33,699,586 generations, which rounds to 33.7 million, not 33.8. The text conflates bounding box with cell count and misrounds the period, in every locale.

_Fix:_ Change to "a pattern of 846,278 live cells spanning a roughly 4.2-million-cell-wide bounding box, copying itself every 33.7 million generations" (and mirror in the other 7 locale blocks).

### 🟠 MED · content · `lib/i18n/stories.ts:130`
**Hero intro claims "Conway published the rules in 1970 in a Scientific American column"; the column was Martin Gardner's**

s.pages.life.intro (rendered in the /life hero) states "Conway published the rules in 1970 in a Scientific American column." Conway had no Scientific American column; the rules were published by Martin Gardner in his "Mathematical Games" column (October 1970). The DE version (line 1471, "Conway veroeffentlichte die Regeln 1970 in einer Kolumne von Scientific American") and the six other locale story files repeat the same misattribution.

_Fix:_ Reword to credit Gardner, e.g. "Martin Gardner introduced Conway's rules in his October 1970 Scientific American column" in stories.ts (EN+DE) and the six stories.<locale>.ts files.

### 🟠 MED · i18n · `app/life/page.tsx:1355`
**Substantial hardcoded English copy shown to all 8 locales despite the page carrying a full RICH_STORY**

The Wires/Gates/Memory/Clock card texts (lines 1355-1359, four full English sentences), the rule-explorer section heading "Rule explorer · flip a digit" / "Change the physics. Watch it diverge." (lines 1377-1381), the gun stat labels "Year" / "Cells in the gun" / "Glider every" / "30 gens" (lines 1322-1337), and the mini-grid labels "B3/S23 · two simple shapes", "Block · still", "gen 1 · same", "Blinker · gen 0", "gen 1 · flipped" (lines 1149-1177) are all literal English JSX, so a German or French reader gets mixed-language sections. Notably RICH_STORY.ruleLabels.title ("Regel-Explorer", "Explorateur de regles", ...) is already translated in all 8 locales but the heading at line 1377 ignores it.

_Fix:_ Move these strings into the RichStory type (they follow the existing ruleBlock/zooBlock pattern) and fill the 8 locale objects; at minimum reuse story.ruleLabels.title/caption for the rule-explorer section heading.

### 🟠 MED · animation · `components/LifeGliderDemo.tsx:53`
**LifeGliderDemo and LifeRuleExplorer autoplay canvas rAF loops without a prefers-reduced-motion check or static fallback**

LifeGliderDemo starts an unconditional requestAnimationFrame loop on mount (lines 123-141) and LifeRuleExplorer initialises running=true (LifeRuleExplorer.tsx line 110) with its loop at lines 168-193; neither queries matchMedia("(prefers-reduced-motion: reduce)"). The repo convention (CLAUDE.md: "Per-component canvases also check the media query and freeze") is violated: the global CSS reduced-motion rule cannot stop JS-driven canvas animation, so motion-sensitive users get two perpetually animating canvases per demo pair. LifeMiniSandbox is fine because it only animates after the user presses Play.

_Fix:_ In both components, check the reduced-motion media query (and subscribe to changes): render one static frame (draw() once) instead of starting the loop, and default running to false in LifeRuleExplorer when reduce is set.

### 🟠 MED · a11y · `app/life/sandbox/page.tsx:342`
**Speed slider has no accessible name and none of the four life canvases carries a role/aria-label**

The range input at line 342 is only described by a sibling <span> with no htmlFor/id association, so screen readers announce an unlabeled slider. The interactive canvases (sandbox page line 255, LifeMiniSandbox.tsx line 376) and the display canvases (LifeGliderDemo.tsx line 152, LifeRuleExplorer.tsx line 246) have no aria-label, role, or aria-hidden, and the draw-on-grid interaction is pointer-only with no keyboard path. This contrasts with the repo's stated accessibility bar (cf. Formula/hero components).

_Fix:_ Give the slider aria-label={u.life.speed} (or wrap in <label>); add role="img" plus a localized aria-label to each canvas (e.g. the glider demo) or aria-hidden="true" where the adjacent gen/pop readout already conveys state.

### 🟠 MED · code · `components/LifeMiniSandbox.tsx:331`
**Pointer-to-cell mapping uses a stale canvas buffer size, so the first click after a resize toggles the wrong cell**

cellAt() computes cellSize from canvas.width, but the backing-store size is only re-synced inside draw(), and there is no ResizeObserver. While paused, a window/layout resize changes the CSS rect but not canvas.width; the next pointerdown then scales client coordinates by the fresh rect and dpr while dividing by a cellSize derived from the stale buffer. Concrete case: CSS width shrinks 800px to 400px at dpr 1 (buffer still 800, cellSize 20); a click at CSS x=200 sits visually on column 20 but floor(200/20)=10, so column 10 toggles. The same stale-cellSizeRef pattern exists in app/life/sandbox/page.tsx onPointerEvent (lines 189-196). LifeGliderDemo, by contrast, correctly uses a ResizeObserver.

_Fix:_ Derive cellSize from rect.width/rect.height (CSS pixels) in the pointer handlers instead of canvas.width, or add a ResizeObserver that re-syncs the buffer and redraws (as LifeGliderDemo does).

### 🟡 LOW · visual · `components/LifeGliderDemo.tsx:96`
**Rogue hardcoded background hex "#070811" instead of a palette token**

LifeGliderDemo line 96 (ctx.fillStyle = "#070811") and app/life/sandbox/page.tsx line 107 (gradient stop "#070811") hardcode a colour that does not exist in lib/visual/palette.ts at all (canvas.bg is #06070d, ink.950 is #05060a). Sibling life components (LifeMiniSandbox line 233, LifeRuleExplorer line 145) already use palette.canvas.bg, and recent commits (7bf1352, d3b...) were a sweep replacing hex literals with palette tokens; these two were missed, leaving the two zoo canvases a slightly different black from every other life canvas.

_Fix:_ Replace both "#070811" literals with palette.canvas.bg (the sandbox gradient can go canvas.bg -> ink[950]).

### 🟡 LOW · i18n · `app/life/page.tsx:208`
**German copy uses generic masculine "Bastler", violating the repo's gender-neutral German rule**

DE encounter card 03 reads "1982 bauten Bastler Logikgatter aus Gleiterstroemen". CLAUDE.md mandates gender-neutral German (Studierende, Mathematiker:innen), and the shared story copy already complies ("Gemeinschaft von Mathematiker:innen" in lib/i18n/stories.ts line 1472), so this word is an outlier.

_Fix:_ Change "Bastler" to "Bastler:innen" (or "Hobbyist:innen").


## logistic

### 🔴 HIGH · math · `app/logistic/page.tsx:74`
**The r = 3 bifurcation is called a pitchfork bifurcation; it is a period-doubling (flip) bifurcation**

Section 2 of RICH_STORY says in all 8 locales that the fixed point splitting into a 2-cycle at r = 3 'is a pitchfork bifurcation, the simplest way a system can break a symmetry' (EN line 74, DE 'Heugabel-Bifurkation' line 147, ES line 219, FR line 292, IT line 364, PT line 436, SV line 508, NO line 580). Recomputation: at r = 3 the fixed point x* = 1 − 1/r has multiplier f'(x*) = 2 − r = −1, the signature of a flip/period-doubling bifurcation (eigenvalue crosses −1, a 2-cycle is born). A pitchfork bifurcation has multiplier +1 and produces two new FIXED points, which is not what happens here; only the second-iterate map f² undergoes a pitchfork, and the text does not say that. The 'breaks a symmetry' framing is also wrong since the logistic map has no symmetry to break at r = 3.

_Fix:_ In all 8 locales replace 'pitchfork bifurcation' with 'period-doubling bifurcation' (DE: Periodenverdopplungs-Bifurkation, etc.) and drop or rephrase the symmetry-breaking sentence, e.g. 'the simplest way a steady state can give way to oscillation'.

### 🟠 MED · math · `app/logistic/page.tsx:89`
**Claim that at r = 4 the map is 'conjugate to the doubling map on [0,1]'; it is only semi-conjugate (it is conjugate to the tent map)**

Section 5 in all 8 locales (EN line 89, DE line 162, ES line 234, FR line 307, IT line 379, PT line 451, SV line 523, NO line 595) states the r = 4 logistic map is conjugate to the doubling map. Recomputation: with h(θ) = sin²(πθ), h(2θ mod 1) = sin²(2πθ) = 4 sin²(πθ)cos²(πθ) = 4x(1−x), so h intertwines the two maps, but h(θ) = h(1−θ) makes h 2-to-1, hence not a homeomorphism: this is a semi-conjugacy (the logistic map is a factor of the doubling map). The true conjugacy is with the tent map via the homeomorphism x = sin²(πy/2). Since conjugacy vs. semi-conjugacy is exactly the kind of precision the sentence trades on, the statement as written is mathematically wrong.

_Fix:_ Say 'conjugate to the tent map on [0,1]' or 'a factor of (semi-conjugate to) the doubling map' in all 8 locales; the deterministic-randomness punchline survives either fix.

### 🟠 MED · i18n · `app/logistic/explorer/page.tsx:9`
**Explorer UI is hardcoded English for all 8 locales, although every locale's story page promises localized famous-value presets**

FAMOUS_R labels (lines 9-18: "Calm fixed point", "Onset of chaos", ...), "Bifurcation diagram · r ∈ ..." (line 180), "Time series · last N iterations (after N burn-in)" (line 190), "Growth rate r" (208), "x₀ — starting point" (242), "Burn-in" (261), "Show" (273) are all English literals, while the repo pattern for explorers is a local RICH_EXPLORER Record<Locale, ...> and this room's story page carries full 8-locale copy that explicitly points at this panel ("Wähl die berühmten Werte im Seitenpanel"). Related leak on the story page itself: the worked-example <pre> at app/logistic/page.tsx line 859 ends in English ("x₃ = 0.60 → fixed point reached") for every locale.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, ...> (per the app/banach pattern) covering the preset labels and panel strings, and localize (or symbolize, e.g. "x₃ = x₂ = 0.60") the fixed-point annotation in the story page pre block.

### 🟠 MED · animation · `components/LogisticRTimeSeries.tsx:61`
**Both logistic demos run endless requestAnimationFrame loops with no prefers-reduced-motion check or static fallback**

LogisticRTimeSeries starts an unconditional rAF loop at mount (lines 61-122) that iterates and repaints every frame forever; LogisticDivergeDemo autoplays (running defaults to true, components/LogisticDivergeDemo.tsx line 43) with its own perpetual rAF loop (lines 122-141). Neither queries matchMedia("(prefers-reduced-motion: reduce)"). CLAUDE.md states per-component canvases must check the media query and freeze with a static fallback, and sibling components (Reveal, StarField, signature heroes, NoiseLadder, BackpropMiniNet) all do; the global CSS rule cannot stop canvas rAF animation.

_Fix:_ In both components read matchMedia("(prefers-reduced-motion: reduce)") (and subscribe to changes); when reduced, render one static frame of the series/orbits instead of starting the rAF loop, and default running to false in LogisticDivergeDemo.

### 🟠 MED · a11y · `app/logistic/explorer/page.tsx:213`
**No accessible names anywhere in the room: all range sliders are unlabeled and all canvases lack role/aria-label**

grep for aria-label across app/logistic/, components/LogisticRTimeSeries.tsx and components/LogisticDivergeDemo.tsx returns zero hits. The explorer's four <input type="range"> (r line 213, x₀ line 247, burn-in line 262, show line 275) have only visually adjacent <div> text, not <label htmlFor> or aria-label, so screen readers announce bare unnamed sliders; the same holds for the r sliders in both demo components (LogisticRTimeSeries line 211, LogisticDivergeDemo line 180). The five data canvases (explorer lines 187 and 193, demo canvases) have no role="img"/aria-label describing what they show.

_Fix:_ Give each slider an aria-label (or wrap the caption div in a <label>) with localized text, and add role="img" plus a descriptive aria-label to each canvas (e.g. "Bifurcation diagram of the logistic map, r from 2.5 to 4").

### 🟠 MED · visual · `components/LogisticRTimeSeries.tsx:45`
**DPR captured once at mount: canvases never re-scale when devicePixelRatio changes despite using useDpr**

LogisticRTimeSeries reads const dpr = dprRef.current inside a deps-[] effect (line 45) and sizes the series canvas backing store once; the rAF loop then draws with that stale transform forever. LogisticDivergeDemo does the same in its [resetTick] effect (line 59), and the explorer's time-series effect captures dpr at line 115 outside the render callback, so even ResizeObserver redraws use the mount-time dpr until another slider changes. useDpr() triggers a React re-render on DPR change (the hook exists exactly for this, cf. commit 7bf1352 "re-subscribe matchMedia on DPR change + DPR misses"), but since dpr is not in any effect dependency array and the heavy bifurcation effect deps are [], moving the window to a monitor with different DPR or zooming leaves every canvas blurry or mis-scaled.

_Fix:_ Add dpr to the dependency arrays of the canvas-sizing effects (re-run sizing + redraw on change), or read dprRef.current inside each render/draw callback and re-apply canvas.width/height + setTransform there.

### 🟠 MED · animation · `components/LogisticRTimeSeries.tsx:63`
**Both logistic demos run infinite rAF animations with no prefers-reduced-motion check**

LogisticRTimeSeries starts an unconditional requestAnimationFrame loop stepping every 60 ms (lines 61-122) and LogisticDivergeDemo does the same with running=true by default (components/LogisticDivergeDemo.tsx lines 122-141, useState(true) at line 43). Neither queries '(prefers-reduced-motion: reduce)' nor offers a static fallback. This violates the repo invariant stated in CLAUDE.md ('Per-component canvases also check the media query and freeze') and the pattern used by NoiseLadder.tsx (line 196), TopicConstellation.tsx (line 341), and Reveal.tsx: users who requested reduced motion get two perpetually animating canvases on the story page.

_Fix:_ In both components check window.matchMedia('(prefers-reduced-motion: reduce)') on mount: draw one static frame (full buffered orbit) and skip the rAF loop, or start LogisticDivergeDemo paused, mirroring the NoiseLadder approach.

### 🟠 MED · a11y · `app/logistic/explorer/page.tsx:213`
**No accessible names on any slider or canvas in the logistic room**

All range inputs are labelled only by sibling <div>s, never by <label> or aria-label: explorer r slider (line 213), x₀ (line 247), burn-in (line 262), show (line 275); LogisticRTimeSeries r slider (components/LogisticRTimeSeries.tsx line 211); LogisticDivergeDemo r slider (components/LogisticDivergeDemo.tsx line 180). A screen reader announces them all as unnamed 'slider'. Likewise every canvas (explorer lines 187 and 193, LogisticRTimeSeries lines 189 and 199, LogisticDivergeDemo lines 156 and 166) has no role='img'/aria-label or fallback text, so the bifurcation diagram, time series, cobweb and both orbits are invisible to assistive tech.

_Fix:_ Give each input an aria-label (e.g. aria-label='Growth rate r') or wrap the existing caption in a <label htmlFor>, and add role='img' plus a descriptive aria-label to each canvas.

### 🟡 LOW · visual · `components/LogisticRTimeSeries.tsx:191`
**Inline style width: 360 overrides w-full/max-w-[360px], so demo canvases overflow the card on narrow phones**

style={{ width: W, height: H }} with W = 360 (line 191, and LogisticDivergeDemo lines 158 and 168) wins over the w-full max-w-[360px] classes because inline styles beat class rules. On viewports narrower than ~410px (360px canvas + card p-5 padding) the canvas keeps its fixed 360px CSS width, overflowing the rounded card and forcing horizontal page scroll, violating the repo's responsive rule that wide content must not make the body scroll horizontally.

_Fix:_ Drop the inline width/height style (keep the width/height backing-store attributes) and size via classes only, or set style={{ width: "100%", maxWidth: W, height: H }} and derive the drawing width from canvas.clientWidth.

### 🟡 LOW · i18n · `app/logistic/page.tsx:600`
**Norwegian body uses the nonsense word "uoverkjørbar" for "uncountable" (plus Swedish gender misagreement "Känslig beroende")**

Line 600 (no, step six): "en uoverkjørbar mengde som aldri gjentar seg" — "uoverkjørbar" means roughly "impossible to drive over" and is not a mathematical term; the intended word for "uncountably many" is "overtellbar" (mengde). Same file line 532 has a second small language defect: Swedish demoCaption2 "Känslig beroende" misagrees in gender — "beroende" is neuter, so it must be "Känsligt beroende".

_Fix:_ Line 600: "... og en overtellbar mengde baner som aldri gjentar seg"; line 532: "Känsligt beroende · två banor, ε ifrån varandra".

### 🟡 LOW · code · `components/LogisticRTimeSeries.tsx:42`
**useDpr subscription never retriggers drawing, so canvases go blurry/stale after a DPR change**

All three logistic files subscribe to DPR via useDpr() but funnel it through a ref and exclude it from effect deps: LogisticRTimeSeries series effect has deps [] (line 123) and cobweb effect deps [r] (line 180); LogisticDivergeDemo effect deps [resetTick] (line 142); explorer time-series effect captures 'const dpr = dprRef.current' once at setup (app/logistic/explorer/page.tsx line 115) with deps [r, x0, skipIter, showCount]. When the window moves to a monitor with a different devicePixelRatio, useDpr fires a re-render but no effect re-runs, so canvas backing stores keep the old resolution (blurry on 1→2, wasteful on 2→1) until the user happens to touch a slider; the LogisticRTimeSeries series canvas never recovers without a remount. This defeats the purpose of the recent 're-subscribe matchMedia on DPR change' fix in useDpr.

_Fix:_ Add dpr to the dependency arrays (re-init buffers on change) instead of routing it through refs, matching how the resize path already re-runs renderHeavy in the explorer.

### 🟡 LOW · visual · `app/logistic/page.tsx:884`
**demoCaption1 is rendered twice, stacked directly above itself**

Section 2 renders story.demoCaption1 ('Live demo · slide r to change the regime') as a section label (lines 880-882) and then passes the same string as the caption prop to LogisticRTimeSeries (line 884), which renders it again as the time-series canvas heading (components/LogisticRTimeSeries.tsx line 187). The user sees the identical mono-caps line twice in a row, and the series canvas loses its intended 'Time series · xₙ' label (the component default that the prop overrides). The cobweb canvas next to it keeps its distinct caption, making the duplication obvious.

_Fix:_ Either drop the outer label div or add a distinct timeSeriesCaption string per locale (e.g. EN 'Time series · xₙ') and pass that as the caption prop.

### 🟡 LOW · i18n · `app/logistic/page.tsx:600`
**Norwegian 'uoverkjørbar mengde' is a non-word; Swedish 'Känslig beroende' has wrong gender agreement**

NO section 6 (line 600) renders 'uncountably many' as 'en uoverkjørbar mengde' — 'uoverkjørbar' literally means 'not able to be driven over' and does not exist as a math term; the intended word is 'overtellbar'/'ikke tellbar' (uncountable) or simply 'utallige'. Separately, the Swedish caption 'Känslig beroende' (line 532) breaks agreement: 'beroende' is an ett-word, so it must be 'Känsligt beroende' (cf. the standard term 'känsligt beroende av begynnelsevillkor').

_Fix:_ NO line 600: 'en ikke-tellbar mengde baner som aldri gjentar seg' (or 'utallige baner'); SV line 532: 'Känsligt beroende · två banor, ε ifrån varandra'.


## lorenz

### 🔴 HIGH · code · `components/LorenzTwoOrbits.tsx:175`
**Pause button wipes both canvases and restarts the simulation from t = 0 because `running` is in the effect deps**

The whole sim lives inside useEffect with deps [running, resetTick, dpr]. Toggling Pause tears the effect down and re-runs it: resize() reassigns c.width (which clears the bitmap) and repaints the background, and a, b, prevA, prevB, simT are re-initialized to [0.1, 0, 1] / 0 (lines 73-93). So pressing Pause erases the drawn trajectories, and pressing Play afterwards restarts the run from t = 0 instead of resuming, while the stats readout keeps showing the stale pre-pause t/|Δ| until the first new stats tick. Pause effectively behaves like a destructive Reset, defeating the point of the pause/resume controls in the section demonstrating divergence over time.

_Fix:_ Keep `running` out of the effect deps: mirror it into a ref (runningRef.current = running) read inside step(), so pausing merely stops stepping and resuming continues from the current state; only resetTick and dpr should rebuild the sim.

### 🔴 HIGH · math · `app/lorenz/page.tsx:125`
**Legend states the initial offset as "a hundredth of a millionth" (10⁻⁸), but ε = 10⁻⁵, in all 8 locales**

EPSILON in LorenzTwoOrbits.tsx is 1e-5 and the captions directly above say x₀ = 0.1 + 10⁻⁵. Recomputation: a hundredth of a millionth = 0.01 × 10⁻⁶ = 10⁻⁸, a factor of 1000 too small. 10⁻⁵ is "a hundred-thousandth" or "ten millionths". The same wrong phrasing is copied into every locale: de line 210 ("ein Hundertstel eines Millionstels"), es 295, fr 380, it 465, pt 550, sv 635, no 720. It also contradicts encounter card 02, which correctly says 0.00001.

_Fix:_ Change the legend in all 8 locales to "a hundred-thousandth" / "ten millionths" (de: "ein Hunderttausendstel", etc.), or simply state "differ by 10⁻⁵".

### 🔴 HIGH · math · `app/lorenz/page.tsx:125`
**Legend in all 8 locales says the initial offset is 'a hundredth of a millionth' (1e-8) but the actual ε is 1e-5**

Recomputation: (1/100)·(1/1 000 000) = 1e-8, but EPSILON = 1e-5 in components/LorenzTwoOrbits.tsx line 18, the captions right above say 'x₀ = 0.1 + 10⁻⁵', and encounter card 02 says 0.00001. 1e-5 is 'a hundred-thousandth' (or 'ten millionths'), off by a factor of 1000 from the legend. The error is copied into every locale: en 124-125, de 209-210 ('ein Hundertstel eines Millionstels'), es 294-295, fr 379-380, it 464-465, pt 549-550, sv 634-635, no 719-720.

_Fix:_ Change the legend in all 8 locales to 'a hundred-thousandth' / 'one part in a hundred thousand' (matching the shared story's correct phrasing in lib/i18n/stories.ts line 302), e.g. de: 'um ein Hunderttausendstel'.

### 🟠 MED · i18n · `app/lorenz/explorer/page.tsx:157`
**Explorer control panel is hardcoded English for all 8 locales**

The slider labels "σ — Prandtl" (157), "ρ — Rayleigh" (169), "β — geometry" (181), "Time step dt" (206), "Projection" (222), the reset button "⟳ Classic chaos · 10 / 28 / 8⁄3" (200) and "❚❚ Pause" / "▶ Play" (250) are English string literals, while the header of the same page (topic.title/tagline/body) and u.back are fully localized. Other explorers (app/eulerchar/explorer/page.tsx, app/mobius/explorer/page.tsx) use the RICH_EXPLORER Record<Locale, ...> pattern for exactly these UI strings, so a de/fr/... visitor gets a half-translated screen here.

_Fix:_ Add a local RICH_EXPLORER: Record<Locale, ...> (per repo convention) covering the slider labels, projection heading, classic-preset button, and play/pause labels.

### 🟠 MED · i18n · `app/lorenz/page.tsx:804`
**Story page leaks untranslated English literals despite RICH_STORY claiming full 8-locale coverage**

Hardcoded English shown to every locale: "The system" (804), "C₊ and C₋ · the two unstable fixed points" (849), the whole wings caption paragraph "Each wing forms around one of the equilibria ... keeps the trajectory in motion." (853-855), the DimDot labels "curve" and "solid" (894, 896), and the "jump" annotation inside WingsSVG (1115). The file's own header comment (lines 16-18) says the layered content is "fully translated into all eight supported locales", and everything else on the page goes through RICH_STORY.

_Fix:_ Move these five strings into RichStory (e.g. systemLabel, wingsLabel, wingsCaption, dimCurveLabel/dimSolidLabel, jumpLabel) and fill them for all 8 locales.

### 🟠 MED · animation · `components/LorenzInlineRho.tsx:76`
**None of the three Lorenz canvases respects prefers-reduced-motion**

LorenzInlineRho (continuous rAF redraw + auto yaw drift, line 133), LorenzTwoOrbits (rAF loop, line 167), and the explorer canvas (rAF loop, app/lorenz/explorer/page.tsx line 121) all animate unconditionally. The repo convention (CLAUDE.md: "Per-component canvases also check the media query and freeze") is followed by TopicConstellation and every signature hero (grep for prefers-reduced-motion confirms), but no Lorenz component queries it; the global CSS rule cannot stop rAF-driven canvas motion.

_Fix:_ Check matchMedia("(prefers-reduced-motion: reduce)") in each component: render a single static frame (the pre-integrated trajectory) and skip the rAF loop / yaw drift; keep the slider re-rendering the static frame on change.

### 🟠 MED · a11y · `components/LorenzInlineRho.tsx:168`
**Interactive canvases have no accessible name and range inputs have no associated labels**

The drag-to-rotate canvas (line 168) has no role/aria-label; the ρ slider (line 180) has no aria-label and the visible "ρ" text is an unassociated div. Same in LorenzTwoOrbits (canvases at lines 189 and 198, no aria-label) and the explorer (canvas at app/lorenz/explorer/page.tsx line 135; the four sliders at lines 159, 171, 183, 208 have their labels in sibling divs with no htmlFor/aria-label, so screen readers announce them as unnamed sliders). The static SVGs on the story page do carry role="img" + aria-label (e.g. page.tsx 978, 1016), so the interactive pieces fall below the repo's own bar.

_Fix:_ Add aria-label + role="img" (or a visually-hidden description) to each canvas, and wire every range input to its label via <label htmlFor> or aria-label, sourced from the localized strings.

### 🟠 MED · animation · `components/LorenzInlineRho.tsx:49`
**None of the three Lorenz canvas animations respects prefers-reduced-motion**

LorenzInlineRho (autoplaying rAF loop with yaw drift, line 49-143), LorenzTwoOrbits (autoplays with running=true default, components/LorenzTwoOrbits.tsx line 60) and the explorer (app/lorenz/explorer/page.tsx lines 19, 41-129) all run continuous requestAnimationFrame animation with no matchMedia('(prefers-reduced-motion: reduce)') check. CLAUDE.md states per-component canvases check the media query and freeze, and 13 other components (Reveal, StarField, NoiseLadder, all signature heroes, …) do exactly that. These three render nothing static for reduced-motion users, they just keep animating.

_Fix:_ Check the reduced-motion media query in each effect; render one static pre-integrated trajectory frame and start LorenzTwoOrbits/explorer with running=false when it matches.

### 🟠 MED · i18n · `app/lorenz/explorer/page.tsx:156`
**Explorer sidebar and story-page infographic labels are hardcoded English despite fully translated surroundings**

The explorer localizes topic.title/tagline/body and u.back but every control label is an English literal: 'σ — Prandtl' (156), 'ρ — Rayleigh' (168), 'β — geometry' (180), '⟳ Classic chaos' (200), 'Time step dt' (206), 'Projection' (222), 'Pause'/'Play' (250). The story page does the same inside its otherwise 8-locale RICH_STORY: 'The system' (804), 'C₊ and C₋ · the two unstable fixed points' (849), the whole WingsSVG caption paragraph (852-855), 'jump' (1115), and DimDot labels 'curve'/'solid' (894/896). A German or Swedish reader gets mixed-language UI.

_Fix:_ Move these strings into RICH_STORY (story page) and a local RICH_EXPLORER Record<Locale, ...> (explorer), following the pattern already used for twoOrbits play/pause/reset labels.

### 🟠 MED · a11y · `app/lorenz/explorer/page.tsx:135`
**Canvases have no accessible name and range sliders have no associated labels**

The explorer canvas (line 135) and both canvases in LorenzTwoOrbits (lines 189, 198) plus the LorenzInlineRho canvas (line 168) have no aria-label or role, so screen readers announce nothing. All five range inputs (explorer lines 159-216, LorenzInlineRho line 180) rely on adjacent <div> text that is not programmatically associated (no <label htmlFor>, no aria-label), so they are announced as unnamed sliders. The LorenzInlineRho canvas is additionally drag-to-rotate only (pointer events, lines 145-159) with no keyboard alternative.

_Fix:_ Add role="img" + aria-label to each canvas, wrap each slider in a <label> or add aria-label (values exist in RICH_STORY, e.g. rhoLabel), and expose rotation via arrow keys on a focusable canvas.

### 🟡 LOW · visual · `app/lorenz/explorer/page.tsx:118`
**Trail point size 1.6px is not DPR-scaled, so the attractor renders half-weight on retina**

fillRect(cx + u2 * scale, cy - v * scale, 1.6, 1.6) draws in device pixels; with the useDpr-scaled backing store (canvas.width = clientWidth * dpr, line 47) a 1.6 device-pixel dot is 0.8 CSS px at dpr 2. The sibling components consistently scale stroke sizes by dpr (LorenzInlineRho lines 105, 129; LorenzTwoOrbits lines 122, 151), so the explorer's trail looks noticeably thinner than designed on hi-DPI screens.

_Fix:_ Use ctx.fillRect(..., 1.6 * dpr, 1.6 * dpr).

### 🟡 LOW · content · `app/lorenz/page.tsx:68`
**"0.00001 — about the width of a virus" is off by roughly two orders of magnitude**

Reading the offset as metres (the only reading that gives the comparison meaning), 0.00001 m = 10 µm, which is the scale of a bacterium or red blood cell; viruses are about 0.02-0.3 µm (2×10⁻⁸ to 3×10⁻⁷ m) wide, i.e. ~100× smaller. The comparison is repeated in all 8 locales (de 153, es 238, fr 323, it 408, pt 493, sv 578, no 663).

_Fix:_ Say "about the width of a bacterium" (or "a tenth of a hair's width"), or drop the physical comparison since the Lorenz variables are dimensionless.

### 🟡 LOW · content · `app/lorenz/page.tsx:68`
**'0.00001 — about the width of a virus' overstates virus size by roughly 100x**

Read as meters, 0.00001 m = 10 µm, which is the scale of a bacterium or human cell; viruses are 20-400 nm (1e-7 m and below). The analogy appears in all 8 locales (en 68, de 153, es 238, fr 323, it 408, pt 493, sv 578, no 663) and is echoed by section four's 'virus-sized error' titles.

_Fix:_ Say 'about the width of a bacterium' or 'a tenth of a hair's width', or drop the physical comparison since the Lorenz variables are dimensionless.

### 🟡 LOW · visual · `components/LorenzInlineRho.tsx:79`
**Hardcoded rgba color literals where palette tokens exist**

The motion-trail fade uses the literal "rgba(5, 6, 10, 0.18)" in LorenzInlineRho line 79 and app/lorenz/explorer/page.tsx line 77, duplicating palette.canvas.bg; head/stroke colors like "rgba(255, 209, 102, 0.95)" (line 127) and the SVG strokes in app/lorenz/page.tsx (980, 1004, 1026, 1066, 1103) inline the signal-cyan/violet/amber/rose channel values. The repo just did a sweep replacing such literals with lib/visual/palette tokens (commits 2bf7a41, d3b3593), and these files partially use palette.* already, so the literals will drift if the palette changes.

_Fix:_ Derive these from palette.canvas.bg / palette.signal.* (with an alpha helper) as done elsewhere after the palette sweep.

### 🟡 LOW · content · `lib/i18n/stories.ts:287`
**Shared story implies Ellen Fetter and Margaret Hamilton worked on the 1963 model simultaneously**

'With Ellen Fetter doing the numerical runs and Margaret Hamilton handling the calculations' describes two people doing the same job at once. Historically they were sequential: Hamilton programmed Lorenz's earlier 12-variable weather runs on the LGP-30 (~1959-1961, where the sensitivity accident happened) and left for MIT's instrumentation lab; Fetter succeeded her and did the computations behind the 1963 three-variable paper. Same phrasing in the DE version (line 1628, 'an den numerischen Rechnungen … bei den Vorab-Berechnungen').

_Fix:_ Rephrase to the sequence, e.g. 'Margaret Hamilton had programmed the earlier weather runs; Ellen Fetter ran the computations for the three-equation model', in EN and DE.


## lsystem

### 🔴 HIGH · math · `components/LsystemTurtleRenderer.tsx:139`
**Story-page Hilbert preset has the same A/B-drawn bug and renders an incorrect Hilbert curve**

Same root cause as the explorer: the bounds pass (line 139) and draw pass (line 180) both advance the turtle for ch==='F'||'G'||'A'||'B'. The 'Hilbert curve' preset (axiom A, A→+BF-AFA-FB+, B→-AF+BFB+FA-) relies on A and B being silent (only F draws). Because A and B emit forward segments, the shape shown under the label 'Hilbert curve' on the story page is wrong (7 segments at order 1 instead of 3). The dragon and koch-snowflake presets in this component are unaffected because they use only F plus non-drawing X/Y.

_Fix:_ Mirror the explorer fix: restrict the draw set to F (and G) for the Hilbert preset so A/B act only as rewrite variables, not pen moves.

### 🔴 HIGH · math · `app/lsystem/explorer/page.tsx:114`
**Hilbert curve renders wrong because A and B are treated as draw-forward commands**

isDraw() (and the identical inline test at components/LsystemTurtleRenderer.tsx lines 139/180) returns true for F, G, A, B. In the standard Sierpinski arrowhead preset (A->B-A-B, B->A+B+A) A and B correctly mean "draw forward", but in the Hilbert preset (axiom A, A->+BF-AFA-FB+, B->-AF+BFB+FA-, angle 90) A and B are pure state symbols: only F draws. Trace of one Hilbert iteration with only F drawing gives the classic U/hook (up, right, down); with A and B ALSO drawing, +BF-AFA-FB+ emits segments for B,A,A,B as well (4 of every 7 drawn segments are spurious), so the shape is not a Hilbert curve at all. Every final-iteration Hilbert string still contains many A/B symbols, so the distortion is always present. Both the story-page turtle renderer and the explorer therefore show a mislabeled 'Hilbert curve'.

_Fix:_ A/B must draw for the arrowhead but not for Hilbert, so a single global isDraw cannot serve both. Either give Hilbert non-drawing symbols (e.g. rename its states to L/R and keep only F drawing) or make the draw-alphabet a per-preset field. Simplest: change Hilbert rules to use L/R instead of A/B (A->+RF-LFL-FR+ style) and drop A/B from isDraw.

### 🔴 HIGH · math · `components/LsystemTurtleRenderer.tsx:139`
**Hilbert curve renders wrong: A and B are drawn as forward moves but are non-drawing variables**

The turtle treats a symbol as "move forward" when ch is F|G|A|B (lines 139 and 180). The Hilbert preset (axiom A, A→+BF-AFA-FB+, B→-AF+BFB+FA-) is the classic formulation where only F draws and A/B are silent state variables. Recompute order 1: axiom A → +BF-AFA-FB+. Correct interpretation (only F draws) yields 3 forward segments (the Hilbert 'cup'). Here A and B also draw, so the same string produces 7 segments (B,F,A,F,A,F,B). At depth 5 the leftover A/B letters add thousands of spurious segments and the figure is not a Hilbert curve at all.

_Fix:_ Make A/B non-drawing here (drop A,B from the draw test) and rename the Sierpiński-arrowhead's drawing variables. Simplest: change the Hilbert preset to use non-drawing letters, e.g. A→X, B→Y with X→+YF-XFX-FY+, Y→-XF+YFY+FX-, so only F draws.

### 🔴 HIGH · math · `app/lsystem/explorer/page.tsx:114`
**Explorer draws A/B as forward moves, breaking Hilbert (and colliding with the arrowhead convention)**

isDraw() returns true for F|G|A|B (line 114). The Sierpiński-arrowhead preset (A→B-A-B, B→A+B+A) legitimately needs A and B to draw, but the Hilbert preset (A→+BF-AFA-FB+, B→-AF+BFB+FA-) needs A and B to be silent. A single isDraw cannot satisfy both, and as written Hilbert is rendered wrong: at depth 5 the many residual A/B symbols each emit an extra unit segment, so the output is a dense tangle rather than the space-filling Hilbert curve.

_Fix:_ Keep A/B drawing only for the arrowhead and rewrite Hilbert with non-drawing symbols (e.g. X/Y): X→+YF-XFX-FY+, Y→-XF+YFY+FX-, angle 90, so only F draws.

### 🟠 MED · math · `app/lsystem/explorer/page.tsx:428`
**Angle slider max (90°) cannot represent the Sierpiński-triangle preset's 120°; nudging it corrupts the figure**

The Sierpiński triangle preset sets angle=120 (correct: F-G-G, F→F-G+F+G-F, G→GG needs 120°). The angle <input type=range> has min=15 max=90 (line 424-431). On preset load the canvas still uses the 120 state value so it draws correctly, but the slider thumb is pinned at 90 while the label reads 120°, and the moment the user touches the slider the angle snaps to ≤90 and the Sierpiński triangle breaks. The Lévy C (45), dragon/koch-curve/koch-snowflake/hilbert (90/60) all fit; only 120 exceeds the range.

_Fix:_ Raise the angle slider max to at least 120 (e.g. max={120}) so every preset's angle is representable and adjustable.

### 🟠 MED · math · `app/lsystem/explorer/page.tsx:410`
**Iterations slider max (8) cannot represent the Dragon preset's 12 iterations; nudging it drops depth**

The Dragon preset sets iterations=12 (and the header/status chips show '12 iter'). The iterations <input type=range> is min=1 max=8 (line 406-413). generated uses Math.min(iterations,12) so the initial 12-iteration dragon draws, but the slider thumb is pinned at 8 while the readout says 12, and any slider interaction snaps iterations to ≤8, losing the intended detail. The preset/control ranges are out of sync.

_Fix:_ Raise the iterations slider max to 12 (matching the expand() clamp and the dragon preset), or lower the dragon preset's default iterations to within the slider range.

### 🟠 MED · code · `app/lsystem/explorer/page.tsx:410`
**Iterations slider max (8) is below the Dragon (12) and Levy C (10) presets' own defaults**

The iterations slider is fixed at min=1 max=8, but the Dragon preset defaults to iterations=12 (line 62) and Levy C to 10 (line 89). On selecting Dragon, setIterations(12) runs and the canvas renders at depth 12 (generated uses Math.min(iterations,12)), yet the slider thumb is pinned at 8. Any interaction with the slider drops the depth to <=8, and the user can never restore the preset's intended depth. The slider readout and the actual rendered depth disagree on load.

_Fix:_ Raise the iterations slider max to cover the largest preset default (e.g. max={12}), or derive the max per-preset. Keep it in sync with the Math.min(iterations,12) cap used in expand().

### 🟠 MED · code · `app/lsystem/explorer/page.tsx:429`
**Angle slider max is 90° but the Sierpiński triangle preset needs 120°**

The angle range input is min=15 max=90 (lines 427-429). Selecting the Sierpiński triangle preset sets angle state to 120 (useEffect at 170-175, preset.angle=120). Initial draw is correct because the state is 120, but the slider cannot represent 120 (thumb pins at 90) and the moment the user touches it the value snaps to <=90, collapsing the triangle, with no way to return to 120.

_Fix:_ Raise the angle slider max to at least 120 (e.g. max={120}) so every preset angle is representable and restorable.

### 🟠 MED · code · `app/lsystem/explorer/page.tsx:410`
**Iterations slider max is 8 but dragon (12) and Lévy C (10) presets exceed it**

The iterations range input is min=1 max=8 (lines 408-411). The dragon preset sets iterations=12 and Lévy C sets 10 via the preset-sync effect. generated uses Math.min(iterations,12) so the initial render honors 12/10, but the slider caps at 8; any drag drops these presets to <=8 detail with no way back to their intended depth, and the slider position misrepresents the actual value.

_Fix:_ Set the iterations slider max to at least 12 (match the Math.min(...,12) cap), or clamp each preset's default to <=8.

### 🟡 LOW · content · `app/lsystem/page.tsx:169`
**German intro uses ungrammatical transitive 'wächst … die Bäume'**

EN card 03: 'the same idea now grows the trees…'. The DE translation renders this as 'Heute wächst dieselbe Idee die Bäume in deinem Lieblings-Videospiel…'. German 'wachsen' is intransitive and cannot take a direct object; 'wächst … die Bäume' is grammatically wrong. All other locales handle it correctly with a causative ('hace crecer', 'fait pousser', 'fa crescere', 'faz crescer', 'låter … växa', 'får … til å vokse'); only DE is off.

_Fix:_ Use a causative construction, e.g. 'Heute lässt dieselbe Idee die Bäume in deinem Lieblings-Videospiel wachsen, die Farne in Animationsfilmen …'.

### 🟡 LOW · content · `lib/topics.ts:220`
**Topic registry formula 'A → ABA · B → BBB' matches no grammar in the room and isn't the canonical algae rule**

The lsystem topic card formula is 'A → ABA · B → BBB'. Every part of the story uses the canonical Lindenmayer algae grammar A→AB, B→A (which yields the Fibonacci lengths 1,2,3,5,8,13). A→ABA, B→BBB is an arbitrary rule that appears nowhere on the page and is not Fibonacci-generating, so the atlas card advertises a different (and less meaningful) grammar than the room teaches.

_Fix:_ Change the registry formula to the grammar the room actually centers on, e.g. 'A → AB · B → A', or the fractal-plant badge used on the page.

### 🟡 LOW · a11y · `app/lsystem/explorer/page.tsx:338`
**Interactive L-system canvases have no accessible label**

The explorer canvas (line 338) and the story-page turtle canvas (components/LsystemTurtleRenderer.tsx line 238) are rendered with no aria-label or role, so screen-reader users get no description of the fractal being drawn or which preset/parameters produced it.

_Fix:_ Add an aria-label (e.g. `aria-label={`${preset.label}, ${iterations} iterations, ${angle} degrees`}`) or role="img" with a descriptive label to each canvas.

### 🟡 LOW · content · `components/LsystemRewriteStepper.tsx:30`
**Rewrite-stepper 'Sierpiński' preset uses a rule that is not a Sierpiński generator**

Preset labels F→F+F-F+F at 60° as 'Sierpiński' with the note 'a Sierpiński curve appears'. Tracing one generator application from heading 0° (F,+,F,-,F,+,F) gives the open, non-closing zigzag (0,0)→(1,0)→(1.5,0.866)→(2.5,0.866)→(3,1.732), ending at heading 60° with net length sqrt(12). A genuine Sierpiński arrowhead generator is endpoint/heading preserving and parity-alternating (A→B-A-B, B→A+B+A); a single self-similar F rule like this does not yield a Sierpiński figure. The widget is also text-only and never draws, so the claim is unverifiable to the user.

_Fix:_ Either relabel this preset (it resembles a Koch-family generator) or replace it with a real Sierpiński rule set consistent with the explorer's arrowhead/triangle presets.

### 🟡 LOW · content · `lib/topics.ts:220`
**Atlas formula for lsystem (A → ABA · B → BBB) is arbitrary and inconsistent with the page's canonical grammar**

The topic card shows formula 'A → ABA · B → BBB', which is not a recognized L-system and does not match the grammar used everywhere else on the topic (the algae system A → AB, B → A, highlighted in the story hero and the rewrite stepper). It reads as a placeholder.

_Fix:_ Use the canonical algae grammar 'A → AB · B → A' (or the fractal-plant rule already shown as the story formula badge) for consistency.

### 🟡 LOW · a11y · `app/lsystem/explorer/page.tsx:338`
**Explorer render canvas has no accessible name**

The <canvas> (line 338) that shows the whole fractal has no aria-label/role, so screen-reader users get no description of the primary output. Same gap in components/LsystemTurtleRenderer.tsx line 238.

_Fix:_ Add an aria-label describing the current figure (e.g. `aria-label={`${preset.label} L-system, ${iterations} iterations`}`) or role="img" with a text alternative.


## magpendulum

### 🟠 MED · ⚠️ UNVERIFIED · math · `app/magpendulum/page.tsx:141`
**Section 01 misstates the force law of its own model: horizontal force scales as r/(r²+h²)^(3/2) ~ 1/r², not 1/(r²+h²)^(3/2) ~ 1/r³**

All 8 locales say the magnets pull with "a horizontal force component that scales as 1/(r² + h²)^(3/2) — near-cubic when the horizontal distance r is large". The simulated model (explorer/page.tsx line 53 and MagPendulumBasinMini.tsx line 42) is F = -k(p-m)/((p-m)²+h²)^(3/2), so the horizontal force magnitude is k·r/(r²+h²)^(3/2): the numerator carries a factor r. Recomputation for r >> h: k·r/r³ = k/r² (inverse-square falloff), not near-cubic. Only the per-displacement kernel is cubic. The same wrong claim is repeated in de (line 223, "annähernd 1/r³"), es 305, fr 388, it 470, pt 552, sv 634, no 716.

_Fix:_ Reword in all locales: the force is k(p−m)/((p−m)²+h²)^(3/2), i.e. magnitude ~1/r² in the far field (inverse-square), with the h² term softening the near field; or say the attraction kernel 1/(r²+h²)^(3/2) multiplies the displacement.

### 🟠 MED · ⚠️ UNVERIFIED · content · `app/magpendulum/page.tsx:161`
**Wada history mis-attributed: Hénon-Heiles is Aguirre/Vallejo/Sanjuán 2001, not Kennedy-Yorke 1991, and the trio's magnetic-pendulum credit is unsupported**

Section 05 (all 8 locales, e.g. lines 161, 243, 325, 408, 490, 572, 654, 736) says Kennedy and Yorke coined "Wada basins" in 1991 "(originally for the Hénon-Heiles system)" and that "Aguirre, Vallejo and Sanjuán demonstrated the property explicitly for the magnetic pendulum in the early 2000s". The Wada property in the Hénon-Heiles Hamiltonian is precisely the Aguirre, Vallejo, Sanjuán result (Phys. Rev. E 64, 066208, 2001); Kennedy & Yorke's 1991 Physica D paper "Basins of Wada" predates that work and did not treat Hénon-Heiles. The text swaps the systems: it hangs Hénon-Heiles on Kennedy-Yorke and reassigns the trio to the magnetic pendulum, for which they are not the standard reference.

_Fix:_ Fix the parenthetical: Kennedy & Yorke 1991 coined the term with abstract dynamical-systems examples; Aguirre, Vallejo and Sanjuán showed Wada basins in the Hénon-Heiles system (2001). Either drop the magnetic-pendulum attribution or cite a source that actually establishes it (e.g. Daza et al.'s Wada-testing papers).

### 🟠 MED · ⚠️ UNVERIFIED · i18n · `app/magpendulum/explorer/page.tsx:243`
**Explorer UI is entirely hardcoded English on an 8-locale site (no RICH_EXPLORER)**

All control strings are English literals rendered for every locale: "Magnet strength k" (243), "Damping γ" (252), "Restoring ω²" (261), "Pendulum height h" (270), "View span ±" (279), "Resolution" (288), "Shade by capture time" (306), "⟳ Recompute" (312), "Magnet legend" (318), plus the status chips "basin map · …" (224) and "computing …%" / "ready" (227). The story page went to the trouble of localising the same labels (basinDamping, basinStrength, basinComputing, basinReady in RICH_STORY), so a German user gets "Dämpfung γ" on the story page and "Damping γ" in the explorer. Repo convention is a local RICH_EXPLORER keyed by Locale.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, ...> covering the slider labels, checkbox, recompute button, legend heading, and computing/ready status, mirroring the vocabulary already translated in the story page's RICH_STORY.

### 🟠 MED · ⚠️ UNVERIFIED · a11y · `app/magpendulum/explorer/page.tsx:373`
**Range sliders have no accessible name and basin canvases have no role/aria-label (explorer and mini)**

In both SliderRow implementations (app/magpendulum/explorer/page.tsx lines 367-382 and components/MagPendulumBasinMini.tsx lines 256-271) the label is a plain sibling <div>; the <input type="range"> has no id/htmlFor, aria-label, or aria-labelledby, so screen readers announce six unnamed sliders. The result canvases (explorer line 221, mini line 196) also carry no role="img"/aria-label, unlike the page's BasinSketchSVG which does (page.tsx lines 69-70).

_Fix:_ Give each slider aria-label={label} (or convert the label div to <label htmlFor>), and add role="img" plus a descriptive aria-label to both canvases.

### 🟠 MED · ⚠️ UNVERIFIED · visual · `app/magpendulum/explorer/page.tsx:182`
**Square ±span domain is stretched onto the non-square explorer pane, and the canvas never re-renders on resize**

The R×R offscreen bitmap covering x,y ∈ [−span, span] is drawn with ctx.drawImage(tmp, 0, 0, W, H) where W and H come from a pane sized 1fr × (100vh−3.5rem) (line 219-221), which is essentially never square. The equilateral magnet triangle and the basins are therefore anisotropically distorted (the mini avoids this with an aspect-square container). Additionally the effect deps (line 215) contain no size signal and there is no ResizeObserver/resize listener, so after a window resize the stale bitmap is CSS-stretched until the user touches a slider.

_Fix:_ Letterbox the square domain (use size = min(W, H), centre it, and map magnet overlay through the same transform), or derive spanX/spanY from the aspect ratio; add a ResizeObserver on the canvas that retriggers the render.

### 🟡 LOW · math · `lib/topics.ts:509`
**Atlas formula mixes symbols: θ̈ on the left, planar vector p on the right**

The glyph formula is "θ̈ = −Σᵢ kᵢ (p − mᵢ) / r³": θ̈ is an angular acceleration but the right-hand side is the planar position-vector force term; the story hero consistently uses p̈ (page.tsx line 783-785). Relatedly, the hero badge says "m·p̈ = …" while formulaLatex renders the same equation without the mass m, so badge and KaTeX disagree.

_Fix:_ Change topics.ts to "p̈ = −Σᵢ kᵢ (p − mᵢ) / r³" and drop the "m·" from the badge (or add m to both).

### 🟡 LOW · content · `app/magpendulum/page.tsx:880`
**Closing CTA section reuses the "First encounter" eyebrow label**

The closing card renders {story.encounter.pretitle} ("First encounter" / "Erste Begegnung" …) as the eyebrow above the closing title "Find the Wada boundary", which is semantically wrong at the end of the page and looks like a copy-paste of the opening section's markup (line 793-795).

_Fix:_ Add a dedicated closingPretitle field to RichStory (or reuse story.page.pretitle) and render that in the closing section.

### 🟡 LOW · content · `app/magpendulum/page.tsx:223`
**Gender/article errors in DE and NO prose: "Ein kleiner Eisenpendel", "En liten jernlodd"**

DE section 01 (line 223) opens "Ein kleiner Eisenpendel hängt …" but Pendel is neuter (das Pendel), so it must be "Ein kleines Eisenpendel hängt …" (also "ziehen ihn an" → "ziehen es an", "holt ihn zurück" → "holt es zurück", "entzieht ihm" stays). NO section 01 (line 716) has "En liten jernlodd henger …" but lodd is neuter (et lodd): "Et lite jernlodd henger …".

_Fix:_ Correct the articles and the dependent pronouns in the DE and NO section-01 bodies.


## mandelbrot

### 🔴 HIGH · math · `app/mandelbrot/page.tsx:143`
**Julia gallery caption claims c = -0.4 + 0.6i is connected and inside the main cardioid, but that c escapes (outside the Mandelbrot set)**

Recomputation: iterating z -> z^2 + c from 0 with c = -0.4 + 0.6i gives |z25| = 1.912, |z26| = 4.14, |z27| = 17.7, |z28| = 314 (verified with a node script), so the orbit provably diverges: c is OUTSIDE the Mandelbrot set and its Julia set is disconnected Cantor dust. The cardioid membership test |1 - sqrt(1-4c)| also fails (~1.85 > 1). Yet juliaCaptions.c1 says "c = -0.4 + 0.6i · connected" and juliaBody (line 140) says "The first c sits inside the main cardioid — a connected, nearly-circular Julia." The JuliaMini canvas at line 1438 renders the actual dust, visibly contradicting its own caption. The wrong claim is duplicated in all 8 locales (lines 143, 254, 367, 480, 593, 706, 818, 930).

_Fix:_ Use a c that is actually inside the main cardioid, e.g. c = -0.12 + 0.24i (verified: passes the cardioid test and stays bounded for 100000 iterations, quasi-circle Julia), and update the caption/body in all 8 locales.

### 🔴 HIGH · math · `app/mandelbrot/page.tsx:145`
**Julia gallery caption claims c = 0.3 + 0.5i is disconnected / just outside the set, but its orbit is bounded (period-4 cycle)**

Recomputation: iterating z -> z^2 + c with c = 0.3 + 0.5i for 200000 steps never escapes; the tail cycles exactly through 4 values (0.3156+0.5034i, 0.1462+0.8178i, -0.3473+0.7391i, -0.1257-0.0135i), i.e. c sits in a period-4 bulb of the Mandelbrot set, so its Julia set is CONNECTED. juliaCaptions.c3 says "c = 0.3 + 0.5i · disconnected" and juliaBody says "The third is just outside the set — the Julia set shatters into disconnected Fatou dust." The JuliaMini at line 1440 renders a connected filled shape that contradicts the caption. Wrong in all 8 locales (lines 145, 256, 369, 482, 595, 708, 820, 932). Aside: "Fatou dust" is also a misnomer; the dust is the Julia set (Cantor set), the Fatou set is its complement.

_Fix:_ Replace with a c that verifiably escapes, e.g. c = 0.3 + 0.6i (escapes at step 15, near-boundary so the dust still looks interesting) or 0.4 + 0.4i (escapes at step 9), and fix the "Fatou dust" wording.

### 🟠 MED · i18n · `app/mandelbrot/page.tsx:1118`
**Hardcoded English UI strings on a page that otherwise carries a full 8-locale RICH_STORY**

Despite RICH_STORY covering all 8 locales, several user-visible strings are English literals rendered for every locale: the MandelOrbitDemo labels "inside the set" (1118), "on the boundary" (1130), "outside the set" (1140); the "hint" heading (1170); the legend "violet web · orbit bounded", "rose flash · orbit escaped", "yellow dot · your c" (1177-1183); "bounded"/"escape" in the encounter card (1052, 1056); and MandelCDragger's status text `escaped @ ${steps}` / `bounded · step ${steps}` (components/MandelCDragger.tsx:279). A German/Spanish/etc. reader gets mixed-language UI in the two interactive sections.

_Fix:_ Move these strings into the RichStory type (e.g. orbitLabels, legend, statusEscaped/statusBounded fields) and pass them as props to MandelOrbitDemo / MandelCDragger.

### 🟠 MED · animation · `components/MandelCDragger.tsx:216`
**No prefers-reduced-motion handling in MandelOrbitDemo, MandelCDragger, or the explorer's MandelRenderer**

grep confirms neither components/MandelOrbitDemo.tsx, components/MandelCDragger.tsx, nor lib/gl/mandelbrot.ts contains any matchMedia/prefers-reduced-motion check, while the repo convention (CLAUDE.md: "Per-component canvases also check the media query and freeze") is followed by TopicConstellation and every signature hero. MandelOrbitDemo and MandelCDragger run continuous rAF loops (lines 148 and 216), and MandelRenderer.start() (lib/gl/mandelbrot.ts:195-206) animates the interior glow via uTime forever, so reduced-motion users still get perpetual animation. The global CSS reduced-motion rule cannot stop canvas/WebGL animation.

_Fix:_ Check matchMedia("(prefers-reduced-motion: reduce)") in each effect: render one static frame (orbit fully drawn, time frozen at 0) and skip the rAF loop; re-subscribe on change.

### 🟠 MED · code · `app/mandelbrot/page.tsx:1514`
**useRefCanvas creates a new ref callback every render, so each page re-render synchronously recomputes all three Julia sets**

useRefCanvas returns an inline ref callback with no memoization. Every re-render of the page hands React a new function identity, which runs the old cleanup and re-invokes the callback, kicking off a full-resolution CPU render (W x H pixels x up to 180 iterations, ~1M+ pixel iterations at DPR 2) for each of the 3 JuliaCanvas instances. The iteration slider (line 1279) sets page-level state, so every input event while dragging re-renders the page and re-renders three Julia sets on the main thread — visible jank that has nothing to do with the slider's own MandelMini. (React 19 is in use, so the returned cleanup does run; on React <19 this would additionally leak ResizeObservers.)

_Fix:_ Convert JuliaCanvas to a normal useRef + useEffect component keyed on `c` (like MandelMini), or wrap the callback in useCallback with [c] so re-renders with unchanged c do not re-render the fractal.

### 🟠 MED · a11y · `app/mandelbrot/explorer/page.tsx:350`
**Range inputs and canvases lack accessible names; the c-dragger is pointer-only**

The explorer's Slider renders <input type=range> with no aria-label and no associated <label> (the label text is a sibling div), so screen readers announce three anonymous sliders (iterations, hue shift, exposure). Same for the story page's iteration slider (app/mandelbrot/page.tsx:1273). None of the canvases (explorer canvas line 148, MandelCDragger.tsx:272, MandelOrbitDemo.tsx:159, JuliaCanvas) have role="img"/aria-label, unlike e.g. CardioidLightDemo.tsx:156 which does. MandelCDragger is additionally operable only via pointer events — no keyboard way to move c.

_Fix:_ Pass a label into Slider and set it as aria-label on the input; add role="img" + descriptive aria-label to the canvases; give MandelCDragger keyboard support (focusable canvas with arrow-key nudges) or an equivalent pair of number inputs.

### 🟡 LOW · content · `app/mandelbrot/page.tsx:130`
**Dragger hint sends users to the cardioid's tip for the period-2 bulb, which actually attaches on the opposite side**

draggerHint says "Try just outside the cardioid's tip — that's where the period-2 bulb attaches" (DE line 241 "Kardioidenspitze", and equivalents in all locales). The cardioid's tip/cusp is at c = 1/4 (right side, elephant valley); the period-2 bulb (disc of radius 1/4 around c = -1) attaches at c = -3/4, the cardioid's smooth leftmost point. A user following the hint drags to the wrong side and never finds the bulb — the silhouette in MandelCDragger (quickInSet, period-2 disc at (x+1)^2+y^2 < 0.0625) shows it on the left.

_Fix:_ Reword to "just left of the cardioid, near c = -0.75" (and translate accordingly in all 8 locales).

### 🟡 LOW · visual · `lib/gl/mandelbrot.ts:117`
**MandelRenderer snapshots devicePixelRatio once in the constructor and never refreshes it**

this.dpr = getDpr() is set at construction and reused in resize() for the life of the renderer. Dragging the browser window to a monitor with a different DPR (or browser zoom change) keeps the canvas backing store at the stale ratio — blurry or oversampled rendering until the page remounts. The repo recently swept other explorers onto the reactive useDpr hook (commits 2bf7a41, 7bf1352 "re-subscribe matchMedia on DPR change"); this renderer was missed. MandelOrbitDemo/MandelCDragger call getDpr() inside resize(), but only re-run it when the ResizeObserver fires, so a pure DPR change is missed there too.

_Fix:_ Read getDpr() inside resize() in MandelRenderer (or expose a setDpr and drive it from useDpr in the explorer page, re-rendering on change).


## nand

### 🟠 MED · i18n · `app/nand/builder/page.tsx:26`
**Builder room UI is hardcoded English for all 8 locales**

The interactive builder page has no per-locale strings at all: GATES descriptions (line 26 'The primitive itself. 1 unless both inputs are 1.', 34, 42, 53, 65), 'Inputs' (129), 'Output' (141), 'Internal NANDs' (159), 'Choose a gate' (193), 'Truth table ·' (224), and 'The current input row is highlighted.' (250) render in English for de/es/fr/it/pt/sv/no users. Ironically the story page already ships fully translated builder labels and gate descriptions (story.builder.labels in app/nand/page.tsx) for the inline NandGateBuilder widget, so translations exist but the actual room ignores them. Only topic.title/tagline/body and u.back are localized.

_Fix:_ Add a local RICH_EXPLORER: Record<Locale, ...> (repo pattern, cf. other explorers) covering the gate descriptions and the six UI labels, or reuse the already-translated story.builder.labels strings.

### 🟠 MED · content · `app/nand/page.tsx:196`
**XOR hardware row: 12 transistors is inconsistent with its own note 'typically 4 NANDs'**

Recomputation: the same table states NAND = 4 transistors, so an XOR built from 4 NAND gates is 4 x 4 = 16 transistors, not 12. The 12T figure is correct for an AOI/complex-gate static CMOS XOR, but the attached note '{typically 4 NANDs, or pass-transistor tricks}' describes the 16T construction. The count and the note contradict each other, and the mismatch is replicated in all 8 locales (lines 196, 334, 468, 603, 737, 871, 1005, 1139).

_Fix:_ Either change the note to 'complex-gate (AOI) design; 16 as 4 NANDs, fewer with pass-transistor tricks' or change the count to 16 to match the 4-NAND note; apply in all 8 locale objects.

### 🟠 MED · visual · `app/nand/builder/page.tsx:146`
**bg-current/10 is not a valid Tailwind 3.4 class, so the active output circle's tint never renders**

Verified by compiling a test file with the project's tailwindcss 3.4.17: 'bg-current' and 'border-current' generate CSS, but 'bg-current/10' produces no rule at all (Tailwind cannot apply an alpha modifier to the currentColor keyword). When output = 1 the circle gets `${G.accent} bg-current/10 border-current`, so the intended 10% accent fill is silently missing; only border, text, and box-shadow appear.

_Fix:_ Map per-gate background classes next to G.accent (e.g. bg-signal-violet/10, bg-signal-cyan/10, ...) or use an inline style with a palette token plus alpha.

### 🟠 MED · a11y · `components/NandTruthTable.tsx:93`
**Clickable truth-table rows are not keyboard operable**

Row selection is implemented as onClick on a bare <tr> (line 93) with cursor-pointer styling. There is no tabIndex, no role, no onKeyDown, and no aria-selected/aria-pressed, so keyboard and screen-reader users cannot activate a row at all, and the affordance (labels.flip: 'Click a row to highlight it.') is unusable without a mouse.

_Fix:_ Add tabIndex={0}, an Enter/Space onKeyDown handler, and aria-selected (or move the interaction onto a real <button> in the first cell) plus a visible focus style.

### 🟡 LOW · a11y · `app/nand/builder/page.tsx:279`
**BitButton has no accessible name or toggle state**

The a/b input toggles render the label ('a'/'b') in a sibling div that is not associated with the button; the button's only content is the digit '0' or '1' and there is no aria-label or aria-pressed. A screen reader announces just '0, button' with no way to tell which input it controls or that it is a toggle.

_Fix:_ Add aria-label={`input ${label}`} (localized) and aria-pressed={value === 1} to the button in BitButton.

### 🟡 LOW · i18n · `app/nand/page.tsx:1450`
**Hardcoded English captions 'NAND · the chip's choice' / 'NOR · Apollo's choice' shown in every locale**

In the Section 06 cards these two strings (lines 1450 and 1459) are literals outside RICH_STORY, so German, Spanish, etc. readers of an otherwise fully translated page see English. Same issue in components/NandGateBuilder.tsx line 206: the SVG aria-label `Circuit: ${target} built from N NAND gates` is English-only even though the component already receives a localized labels prop.

_Fix:_ Move both card captions into RichStory (all 8 locales) and pass a localized aria-label (or a format function) into NandGateBuilder's labels prop.

### 🟡 LOW · content · `app/nand/page.tsx:915`
**Swedish typo: 'Sheffers strack' / 'Sheffer-strack' should be 'streck'**

Line 915 uses 'Sheffers strack a ↑ b' and later in the same sentence 'ibland Sheffer-strack'. 'Strack' is not a Swedish word; the Swedish term is 'streck' (stroke/line), and the sv atlas copy in lib/i18n/atlas.ts correctly uses 'Sheffer-strecket', so the story page is inconsistent with the atlas card.

_Fix:_ Replace both occurrences with 'Sheffers streck' / 'Sheffer-streck' in the sv section.

### 🟡 LOW · code · `components/NandGateBuilder.tsx:229`
**Hardcoded color literals where palette tokens exist (and one drifts from the palette)**

The component imports lib/visual/palette and uses tokens for accent/wires/pads, but still hardcodes fill="#e8eaf2" for the a/b and out labels (lines 229 and 282; palette.ink[100] is #eaecf3, so the text color silently diverges from the ink scale), fill "rgba(179, 136, 255, 0.10)" for the gate body (line 57, which is palette.signal.violet with alpha), and grid stroke "rgba(232,234,242,0.04)" (line 211). Recent repo commits (d3b/2bf) specifically swept such literals into palette tokens; this file was missed.

_Fix:_ Use palette.ink[100] for the SVG text fills and derive the violet/grid rgba values from palette.signal.violet / palette.ink tokens (e.g. a small hexToRgba helper as used elsewhere).


## pascalmod

### 🔴 HIGH · math · `app/pascalmod/explorer/page.tsx:65`
**Palette index wraps nonzero residues onto the background colour, so cells that are nonzero mod p render as blank**

The explorer's PALETTE has 12 entries with index 0 = palette.canvas.bg, and cells are painted with PALETTE[r % PALETTE.length]. For modulus 13 (selectable, line 116), residue 12 maps to 12 % 12 = 0 = background: e.g. C(12,1) = 12 ≡ 12 (mod 13) is nonzero but is drawn in the background colour, i.e. displayed as if divisible by 13. Same for residue 12 under p = 17 and 23. The residue legend (line 166) has the matching flaw: for p ≥ 13 the residue-12 swatch is identical to the residue-0 swatch. components/PascalmodViewer.tsx line 93 has the same bug with its 16-entry palette: for p = 17, 19, 23 residue 16 maps to index 0 = background (e.g. C(16,1) = 16 ≢ 0 mod 17 rendered invisible). The fractal shown for these moduli is mathematically wrong: nonzero cells are missing.

_Fix:_ Never let a nonzero residue land on index 0: use ctx.fillStyle = PALETTE[1 + (r - 1) % (PALETTE.length - 1)] (and the same formula for the legend swatches with i >= 1) in both app/pascalmod/explorer/page.tsx and components/PascalmodViewer.tsx.

### 🔴 HIGH · math · `app/pascalmod/explorer/page.tsx:65`
**Residue 12 is painted with the background colour for p = 13, 17, 23, so non-divisible cells render as blank**

PALETTE has 12 entries and index 0 is palette.canvas.bg (the 'divisible by p' blank). The draw loop uses ctx.fillStyle = PALETTE[r % PALETTE.length], so any nonzero residue r = 12 maps to 12 % 12 = 0 = background. The modulus buttons offer 13, 17, and 23, all of which produce residue 12 (e.g. C(12, 1) = 12 ≡ 12 mod 13). Those cells disappear, which directly contradicts the page's central claim that a blank cell means C(n, k) ≡ 0 mod p (Kummer). The residue legend even exposes it: for modulus ≥ 13 the residue-12 swatch is identical to residue 0.

_Fix:_ Colour nonzero residues with PALETTE[1 + (r - 1) % (PALETTE.length - 1)] (and use the same formula in the legend), so the background colour is reserved exclusively for residue 0.

### 🔴 HIGH · math · `components/PascalmodViewer.tsx:93`
**Same background-collision bug: residue 16 invisible for p = 17, 19, 23 in the story-page viewer**

PALETTE here has 16 entries with index 0 = palette.canvas.bg, and the fill uses PALETTE[r % PALETTE.length]. For the offered moduli 17, 19, and 23, residue 16 maps to 16 % 16 = 0 = background, so cells with C(n, k) ≡ 16 (mod p) are drawn blank even though they are not divisible by p (e.g. C(16, 1) = 16 ≡ 16 mod 17). The rendered 'gasket' therefore has spurious holes for exactly the large primes the story invites readers to explore. The `?? "#ffd166"` fallback never fires since r % 16 is always in range.

_Fix:_ Map nonzero residues via PALETTE[1 + (r - 1) % (PALETTE.length - 1)] so index 0 stays exclusive to residue 0.

### 🟠 MED · content · `app/pascalmod/page.tsx:112`
**Section 04 claims mod 3 gives 'a triangle of three-by-three copies'; the correct per-level count is six**

The tile count per self-similarity level is p(p+1)/2, which the same sentence uses correctly for p = 5 (15 = 5·6/2, 'fifteen-piece micro-tile') and p = 7 (28 = 7·8/2, 'twenty-eight-piece'). For p = 3 the count is 3·4/2 = 6, but the text says 'a triangle of three-by-three copies' (reads as 9). The error is replicated in all 8 locales (de line 209 'drei-mal-drei-Kopien', es 306, fr 403, it 500, pt 597, sv 694, no 791) and also contradicts the page's own dimension table (log 6 / log 3 ≈ 1.631 at line 990 requires 6 copies, not 9).

_Fix:_ Reword to 'a triangle of six copies' (sechs Kopien, seis copias, etc.) in all 8 locale objects so the p = 3 count matches p(p+1)/2 like the p = 5 and p = 7 examples.

### 🟠 MED · content · `app/pascalmod/page.tsx:154`
**Closing copy promises explorer features that don't exist: per-residue palette switching, and 'every prime from 2 to 23' while 19 is missing**

closingBody in all 8 locales says the Explorer lets you 'switch palettes per residue' and 'step through every prime modulus from 2 to 23'. The explorer (app/pascalmod/explorer/page.tsx line 116) offers moduli [2, 3, 5, 7, 11, 13, 17, 23]: the prime 19 is absent, and there is no palette control anywhere in the explorer, only a fixed read-only residue legend. Users following the CTA cannot do either advertised thing.

_Fix:_ Add 19 to the explorer's modulus button array (also fixes the 4-column grid to a clean 3 rows of 3... adjust grid-cols as needed), and either implement a palette toggle or drop the 'switch palettes per residue' clause from closingBody in all 8 locales.

### 🟠 MED · i18n · `app/pascalmod/explorer/page.tsx:113`
**Explorer sidebar UI strings are hardcoded English for all 8 locales**

'Modulus p' (line 113), 'Primes give clean gaskets — Kummer's theorem.' (line 131), 'Rows' (line 138), 'More rows = finer fractal detail.' (line 151), 'Residue legend' (line 156) and the canvas overlay '· {rows} rows' (line 94) are literal English strings, while the page pulls topic.title/tagline/body from the localized atlas bundle. A German/Spanish/etc. visitor gets a mixed-language explorer. The repo convention (CLAUDE.md) is a local RICH_EXPLORER keyed by Locale for exactly this case, and the story page's RICH_STORY already contains translated modulusLabel/rowsLabel strings that could be reused.

_Fix:_ Add a small RICH_EXPLORER: Record<Locale, ...> (or reuse the viewer label strings from the story's i18n) covering the six sidebar/overlay strings, selected via useI18n().locale.

### 🟠 MED · math · `app/pascalmod/page.tsx:112`
**Section 04 says p = 3 gives 'three-by-three copies'; the correct tile count is six**

The sentence's own parallel numbers are the triangular numbers T(p) = p(p+1)/2: it correctly states p = 5 gives a fifteen-piece micro-tile (5·6/2 = 15) and p = 7 a twenty-eight-piece one (7·8/2 = 28). For p = 3 the analogous count is 3·4/2 = 6 copies arranged in a side-3 triangle, not 'three-by-three' (which reads as 9). The same wrong phrasing is replicated in all 8 locales (de line 209 'drei-mal-drei-Kopien', es 306, fr 403, it 500, pt 597, sv 694, no 791).

_Fix:_ Reword to 'a triangle of six copies' (sechs Kopien, seis copias, ...) in all 8 locale objects, keeping the T(p) pattern consistent with 15 and 28.

### 🟡 LOW · a11y · `app/pascalmod/explorer/page.tsx:91`
**Canvases lack aria-labels, rows sliders are not programmatically labelled, explorer modulus buttons lack aria-pressed**

Both the explorer canvas (line 91) and the PascalmodViewer canvas (components/PascalmodViewer.tsx line 122) have no aria-label or role, unlike the repo convention (e.g. components/UlamSpiralMini.tsx line 160 gives its canvas aria-label="Ulam spiral"). The rows range inputs (explorer line 142, viewer line 178) have only an adjacent div as a visual label, no htmlFor/aria-label association, so screen readers announce an unnamed slider. The explorer's modulus buttons (lines 117-127) omit aria-pressed even though the equivalent buttons in PascalmodViewer (line 152) and PascalmodCarryDemo (line 169) set it.

_Fix:_ Add aria-label to both canvases (e.g. `Pascal's triangle mod ${modulus}`), aria-label={rowsLabel} on both range inputs, and aria-pressed={modulus === p} on the explorer's modulus buttons.

### 🟡 LOW · content · `app/pascalmod/page.tsx:122`
**Typos: EN 'The picture still self-similar overall' (missing 'is'); DE heading 'Zusammengesetzte Modulen' (wrong plural)**

Line 122 (EN section 06 body): 'The picture still self-similar overall — Chinese Remainder Theorem stacks...' is missing the verb ('is still self-similar'). Line 217 (DE section 06 pretitle): 'Zusammengesetzte Modulen' uses a non-existent nominative plural; the plural of the mathematical Modul(us) is 'Moduln' (the Norwegian counterpart at line 799 correctly says 'moduler').

_Fix:_ EN: 'The picture is still self-similar overall'. DE: 'Abschnitt 06 · Zusammengesetzte Moduln'.

### 🟡 LOW · i18n · `components/PascalmodViewer.tsx:190`
**Legend heading 'residues' is hardcoded English in the otherwise fully localized viewer**

Every other string in PascalmodViewer arrives via props from RICH_STORY (modulusLabel, rowsLabel, primesOnlyLabel, includeCompositesLabel, caption), but the legend heading at line 190 is the literal 'residues', so it stays English in the other 7 locales.

_Fix:_ Add a residuesLabel prop wired from RICH_STORY[locale].viewer like the other labels.

### 🟡 LOW · content · `app/pascalmod/page.tsx:122`
**EN typo 'The picture still self-similar overall' and wrong German plural 'Modulen'**

Line 122 (EN section 06): 'The picture still self-similar overall' is missing 'is'. Line 217 (DE section 06 pretitle): 'Zusammengesetzte Modulen' is not a valid German plural; the mathematical plural is 'Moduln'. The DE title on line 218, 'Nicht-Primes n', is also Denglisch ('Nicht-primes' mixes English inflection into German).

_Fix:_ EN: 'The picture is still self-similar overall'. DE: 'Zusammengesetzte Moduln' and e.g. 'Nicht-primes n' -> 'Zusammengesetztes n: das Fraktal bleibt, verwischt'.

### 🟡 LOW · a11y · `app/pascalmod/explorer/page.tsx:91`
**Canvases have no accessible name and explorer modulus buttons lack aria-pressed**

The explorer canvas (line 91) and the viewer canvas (components/PascalmodViewer.tsx line 122) carry no aria-label or role, unlike comparable demos in the repo (e.g. components/UlamSpiralMini.tsx line 160 sets aria-label="Ulam spiral"), so screen readers announce nothing for the main visual. The explorer's modulus toggle buttons (lines 117-127) also omit aria-pressed, while the story-page viewer's equivalent buttons set it (PascalmodViewer.tsx line 152).

_Fix:_ Add role="img" plus a descriptive aria-label (e.g. 'Pascal's triangle coloured modulo p') to both canvases, and aria-pressed={modulus === p} on the explorer modulus buttons.


## penrose

### 🔴 HIGH · math · `components/PenroseTiling.tsx:115`
**Story-page demo displays a kite/dart ratio that converges to 1/phi (0.618), not phi, because it actually renders the P3 rhombus tiling with swapped labels**

The deflation rules (lines 58-76) are the preshing-style Robinson subdivision that generates the P3 RHOMBUS tiling, not P2 kites/darts. Simulation of the exact code: at depth 6 there are 890 type-0 and 1440 type-1 half-tiles, so the displayed 'kites / darts' value (line 231, counts from line 115 with type0 labelled kites) is 890/1440 = 0.6181 = 1/phi. It is rendered directly next to the reference row 'phi = 1.6180' (line 236) and a hint in all 8 locales claiming 'the kite-to-dart ratio walks toward phi = 1.618' (page.tsx line 127). Geometry check: pairing mirrored triangles along the hidden B-C seam (the edges the outline pass deliberately skips, lines 160-171) yields quadrilaterals with angles 36/144/36/144 (thin rhombus) for type 0 and 72/108/72/108 (thick rhombus) for type 1, and all four sides equal - rhombi, never kites (72/72/72/144) or darts. Both triangle types have equal legs (0.0557 at depth 6), whereas true P2 half-kites have legs phi times the half-dart legs. So the canvas shows P3 rhombi, the counts label thin rhombi 'kites' and thick rhombi 'darts', and the headline numeric claim of the whole interactive (ratio -> phi) is contradicted by the number it prints.

_Fix:_ Either implement a real P2 kite/dart subdivision (half-kite -> 2 half-kites + 1 half-dart, half-dart -> 1 half-kite + 1 half-dart, with P2 edge proportions), or honestly relabel the demo as P3 thin/thick rhombi and display thick/thin (1440/890 -> phi) so the printed ratio matches the phi claim.

### 🔴 HIGH · math · `app/penrose/explorer/page.tsx:247`
**Explorer 'P2 kite + dart' mode renders the identical P3 rhombus geometry recolored; no kites or darts ever appear on screen**

buildP2Tiling (line 114) is byte-for-byte the same as the P3 buildTiling - same seed, same subdivision. The comment (lines 105-111) claims 'the difference is purely interpretation', but that is false: pairing these mirrored half-triangles along the hidden B-C seams produces thin (36/144) and thick (72/108) rhombi (verified numerically), so with outlines on, the P2 canvas shows exactly the same rhombus tiling as P3 mode, just amber/violet instead of violet/rose. The code even swaps labels (isKite = t === 1, line 247) specifically so the count ratio hits phi - i.e. thick-rhombus halves are counted as 'kites' - papering over the fact that the geometry is not P2. The story page explicitly promises 'switch between the kite + dart (P2) and the rhombi (P3) variants' (line 144 and its 7 translations), so users are shown rhombi labelled kites and darts.

_Fix:_ Implement genuine P2 geometry (Robinson half-kite/half-dart triangles with legs in ratio phi and the P2 subdivision), or remove/relabel the P2 mode until it exists.

### 🔴 HIGH · math · `app/penrose/page.tsx:113`
**False claim in Section 05 (all 8 locales): 'The kite's diagonals are in golden ratio; so are the dart's'**

Recomputation: the P2 kite (angles 72/72/72/144, long sides phi, short sides 1) has axis diagonal = phi = 1.618 and cross diagonal = 2*phi*sin(36) = 1.902, ratio = 1.1756 = 2*sin(36), not phi. The dart (from the same side-phi rhombus) has axis diagonal = phi^2 - phi = 1 and cross diagonal = 2*phi*sin(36) = 1.902, ratio = 1.902, also not phi. The claim appears verbatim in every locale (de line 207, es 301, fr 395, it 489, pt 583, sv 677, no 770). The true phi facts nearby (kite:dart count ratio, 1:phi Robinson side ratios, phi inflation scaling) are correct; only the diagonal claim is wrong.

_Fix:_ Replace with a true statement, e.g. 'the kite's area is phi times the dart's, and each tile's long edge is phi times its short edge', in all 8 locales.

### 🔴 HIGH · math · `components/PenroseTiling.tsx:115`
**Story demo's displayed kites/darts ratio converges to 1/phi (0.618), contradicting the phi = 1.618 claim shown right next to it**

The deflate() rules (lines 61-73) map type-0 -> {type-0, type-1} and type-1 -> {type-0, 2x type-1}, i.e. substitution matrix [[1,1],[1,2]], so type-1 outnumbers type-0 by phi. Counting from the 10-triangle sun seed: (t0,t1) = (10,0) -> (10,10) -> (20,30) -> (50,80) -> (130,210). The component labels type-0 as kites (line 111), so at the default depth 4 the UI shows kites/darts = 65/105 = 0.6190, converging to 0.6180 = 1/phi, while the row directly below prints 'phi ~ 1.6180' (line 236) and every locale's hint says the ratio walks toward phi ~ 1.618. The explorer (app/penrose/explorer/page.tsx lines 241-247) uses the identical rules but labels type-1 as kites to get 1.618, so the two rooms literally contradict each other with the same math.

_Fix:_ Count type-1 halves as kites and type-0 as darts (matching the explorer's convention) so the displayed ratio converges to 1.618, and fix the header comment (lines 13-14) accordingly; or display darts/kites.

### 🟠 MED · content · `app/penrose/page.tsx:108`
**Section 04's inflation recipe is mathematically impossible as stated (all 8 locales)**

The text says: 'split each kite into two half-kites and a half-dart, each dart into two half-darts. Reassemble the pieces and you get a new kite-and-dart tiling at exactly phi times the original scale.' Two half-kites already ARE the whole kite, so a kite cannot yield two half-kites plus an extra half-dart (area 2*A_halfkite + A_halfdart > A_kite); and a dart splitting into just two half-darts is a trivial bisection, not a composition step. The correct Robinson rules are per half-tile: half-kite -> 2 half-kites + 1 half-dart, half-dart -> 1 half-kite + 1 half-dart (area-conservation verified numerically), and that subdivision produces the SMALLER (1/phi) tiling, not the phi-times-larger parent; composition (Conway/Gardner) instead cuts only the darts in half and regroups. Same garbled recipe in de 202, es 296, fr 390, it 484, pt 578, sv 672, no 765.

_Fix:_ State the correct rules (half-kite -> two half-kites + one half-dart; half-dart -> one of each; running it backwards merges pieces into a phi-times-larger tiling) in all locales.

### 🟠 MED · content · `app/penrose/page.tsx:127`
**Inflation/deflation used with contradictory meanings across the same page and explorer**

Section 04 (line 108) defines inflation = coarsen to phi-times-larger scale and deflation = subdivide to 1/phi. But the interactive copy says 'Each inflation step subdivides every tile into pieces 1/phi times smaller' (line 127 hint, and the equivalent in all 7 other locales), the encounter card prints 'each inflation scales by phi' (hardcoded, line 945) directly above the mini-SVG captioned 'scale by 1/phi' (line 894) - two adjacent lines asserting opposite scale factors - and the fixed callout at line 1091 says 'Inflation grows the tiling by exactly phi each step' while the demo it explains shrinks tiles. The explorer status bar even names the identical operation 'inflation depth' in P3 mode and 'deflation depth' in P2 mode (explorer/page.tsx lines 391-393).

_Fix:_ Pick one convention (subdivision = deflation, per Section 04) and align the hint/title copy in all locales, the card box at 944-945, the SVG caption, and the explorer status-bar labels.

### 🟠 MED · content · `app/penrose/explorer/page.tsx:497`
**Explorer claims 'Depth 6 already exceeds 10 000 tiles' but depth 6 yields ~1 190 rhombi, and the depth>6 warning is dead code**

Simulated exactly: depth 6 produces 2 330 half-triangles, which trianglesToRhombi pairs into 1 190 rhombi (1 140 interior pairs + 50 boundary leftovers) - the counter next to this very text displays that number, directly contradicting the '10 000' claim. Additionally the warning at line 490 ('Depths above 6 may stutter') can never render because the slider is clamped to max=6 (line 484). The phi^2 = 2.618 growth-factor claim is correct.

_Fix:_ Change the depth-6 note to the real count (about 1 200 rhombi / 2 300 half-tiles) or trigger it from depth 5; delete the unreachable depth > 6 branch.

### 🟠 MED · i18n · `app/penrose/page.tsx:971`
**Hardcoded English blocks embedded in the fully 8-locale story page (and an entirely untranslated explorer sidebar)**

The page carries a complete RICH_STORY for all 8 locales, yet substantial user-facing prose is hardcoded English in JSX: the crystallographic-restriction callout ('Crystallographic restriction', 'Only 2-, 3-, 4-, 6-fold rotations are compatible...', lines 971-987), 'The tile-count race' table with headers year/who/tiles (1003-1014), the Inflation callout paragraph (1085-1094), 'kites / darts -> phi / each inflation scales by phi' (944-945), and the six-entry timeline 'Timeline - paper -> matter -> Nobel' (1143-1181). A German or Swedish reader gets whole English paragraphs mid-story. The explorer has no RICH_EXPLORER at all: 'Mode', 'Inflation depth', 'Seed rotation', 'Display', 'Show outlines/colors', 'Matching arrows', 'Centre - reset rotation' and both explanatory paragraphs are English-only (explorer/page.tsx 445-541).

_Fix:_ Move these strings into the existing RICH_STORY records and add a RICH_EXPLORER: Record<Locale, ...> to the explorer, per the repo's inline-rich-copy pattern.

### 🟠 MED · a11y · `components/PenroseTiling.tsx:208`
**Canvases and range sliders across the Penrose room have no accessible names; toggles lack pressed state**

PenroseTiling's canvas (line 196) and depth slider (line 208), PenroseGoldenRatio's canvas (line 196) and levels slider (line 215), and the explorer's canvas (line 400), depth slider (line 481) and rotation slider (line 509) all lack aria-label/role; the visible labels are sibling divs with no htmlFor/id association, so screen readers announce bare unnamed sliders. The explorer's Toggle buttons (explorer/page.tsx line 569) convey on/off only via text color/suffix without aria-pressed. This contrasts with the repo's stated standard (demo components 'DPR-aware, requestAnimationFrame-driven, accessible') and with other components that do label canvases.

_Fix:_ Add aria-label (from the existing localized depthLabel/levelsLabel props) to each input and role='img' plus a descriptive aria-label to each canvas; add aria-pressed={value} to the Toggle button.

### 🟠 MED · math · `app/penrose/explorer/page.tsx:247`
**P2 mode labels the obtuse half-DART gnomons as kites, contradicting its own comment, and renders rhombi rather than kite/dart shapes**

The comment at lines 102-103 states 'type 0 -> half of a KITE (golden triangle, 36 deg at A); type 1 -> half of a DART', which is geometrically correct (the 36-72-72 acute triangle is the half-kite, the 36-36-108 gnomon the half-dart). But isKite = (t) => t === 1 (line 247) labels the gnomons as kites purely to force the count ratio to phi (rationalized in the comment at 241-246 as 'conventional'; it is not - in a true P2 deflation, half-kite -> 2 half-kites + 1 half-dart, half-dart -> 1 half-kite + 1 half-dart, and kites genuinely dominate). Additionally, pass 2 hides the B-C seams (lines 260-272); mirrored halves paired across B-C form thin/thick RHOMBI, not kites/darts (kites/darts pair across a leg edge, the axis of symmetry), so 'P2 kite + dart' mode shows the same P3 rhombus picture recolored - no kite or dart shape ever appears.

_Fix:_ Implement the genuine P2 Robinson substitution (half-kite -> 2 half-kites + 1 half-dart; half-dart -> 1 half-kite + 1 half-dart) and hide the leg seams for pairing, so shapes and counts are both correct; at minimum reconcile the isKite() convention with the comment at lines 102-109.

### 🟠 MED · math · `app/penrose/page.tsx:108`
**Inflation recipe stated in Section 04 is mathematically impossible (kite split into pieces exceeding its own area)**

All 8 locales say: 'split each kite into two half-kites and a half-dart, each dart into two half-darts. Reassemble ... at exactly phi times the original scale.' At the same scale, two half-kites already equal one full kite, so a kite cannot be cut into two half-kites PLUS a half-dart - the pieces outstrip the kite's area. The standard composition (Gardner/Grunbaum-Shepherd) bisects only the darts: kites stay whole, each dart is cut along its axis into two half-darts, and the pieces regroup so a larger kite = 2 kites + 2 half-darts and a larger dart = 1 kite + 2 half-darts.

_Fix:_ Reword in all 8 locales: only darts are bisected; kites remain whole; larger kite = 2 kites + 2 half-darts, larger dart = 1 kite + 2 half-darts.

### 🟠 MED · content · `app/penrose/page.tsx:127`
**Page contradicts itself on what 'inflation' means: Section 04 says inflation scales UP by phi, the interactive says each 'inflation step' subdivides tiles 1/phi SMALLER**

Section 04 (line 108, all locales) defines inflation as producing the parent tiling at phi times the scale and deflation as producing the child at 1/phi. Yet the interactive directly above uses 'Inflation depth' as its slider label and its hint (line 127) says 'Each inflation step subdivides every tile into pieces 1/phi times smaller' - that is the operation the page itself just called deflation. The explorer compounds it: the status bar shows 'P3 - inflation depth' but 'P2 - deflation depth' (app/penrose/explorer/page.tsx lines 391-393) for the exact same subdivision, and its sidebar section is titled 'Inflation depth' in both modes.

_Fix:_ Pick one convention: call the demo control 'Deflation depth' (matching Section 04's definitions), or consistently define inflation as subdivision everywhere including Section 04.

### 🟠 MED · a11y · `components/PenroseTiling.tsx:196`
**All three penrose canvases lack role/aria-label and all range sliders lack accessible names**

The canvases in PenroseTiling.tsx (line 196), PenroseGoldenRatio.tsx (line 196), and app/penrose/explorer/page.tsx (line 400) have no role="img" or aria-label, so screen readers get nothing. The range inputs (PenroseTiling.tsx line 208, PenroseGoldenRatio.tsx line 215, explorer lines 481 and 509) have no aria-label and their visible caption divs are not associated via label/htmlFor, so the sliders announce as unnamed. Other demos in the repo do carry aria-labels (e.g. SierpinskiSubdivision.tsx line 69, CardioidLightDemo.tsx), and CLAUDE.md calls out demos as 'accessible'.

_Fix:_ Add role="img" plus a descriptive aria-label to each canvas and aria-label={depthLabel} / {levelsLabel} / 'Inflation depth' / 'Seed rotation' to the range inputs.

### 🟡 LOW · content · `app/penrose/explorer/page.tsx:496`
**'Depth 6 already exceeds 10 000 tiles' is false by ~9x, and the depth > 6 warning is dead code**

From the 10-half-tile sun seed the counts are (t0,t1): depth 5 = (340,550), depth 6 = (890,1440), so depth 6 yields 2330 half-tiles = ~1165 rhombi (tileCount displays about 1165 plus unpaired boundary halves) - nowhere near 10 000. Also the slider at lines 481-489 has max=6, so the `depth > 6` branch at line 490 ('Depths above 6 may stutter') can never render.

_Fix:_ Correct the depth-6 message to ~1200 rhombi (or 'a few thousand half-tiles'), and either remove the depth > 6 branch or raise the slider max.

### 🟡 LOW · visual · `components/PenroseGoldenRatio.tsx:145`
**Innermost quarter-arc of the golden spiral is disconnected from the rest of the spiral**

For i === 0 the code uses d = 0 (arc centered at the square's top-left, endpoints (1,0) and (0,1) in tile coordinates). The chain of arcs for i >= 1 is continuous - square 1's arc runs (2,0) -> (1,1), square 2's ends at (2,0), etc. - but square 0's arc touches neither (1,1) nor any neighbor endpoint, so the spiral visibly breaks at its center, undermining the caption's claim that 'the arcs join into the golden spiral'. Recheck: with d = 1 the seed arc would be centered at (0,1) with endpoints (0,0) -> (1,1), joining square 1's arc end at (1,1).

_Fix:_ Treat the seed square as d = 1 instead of d = 0: `const d = i === 0 ? 1 : (i - 1) % 4;`

### 🟡 LOW · i18n · `app/penrose/page.tsx:741`
**Norwegian locale uses the non-word plural 'flisleggings' (English -s on a Norwegian noun) and mistranslates 'decades-old' as 'a decade old'**

Line 741 (no.encounter.cards[2]) has 'bare aperiodiske flisleggings' and 'Penroses flisleggings var...' - Norwegian pluralizes flislegging as 'flislegginger', the trailing English -s is a copy-editing error. Also line 731 renders EN 'a decades-old question' as 'et tiaar gammelt spoersmaal' ('a decade-old question'), understating Wang 1961 -> Penrose 1974 by calling it one decade.

_Fix:_ Replace both occurrences with 'flislegginger' and change line 731 to 'et flere tiaar gammelt spoersmaal' (or equivalent phrasing).


## phi

### 🔴 HIGH · math · `components/PhiFibonacciConvergence.tsx:214`
**Ratio column is off by one versus its header: row n shows F(n)/F(n-1) under the header 'Fₙ₊₁ / Fₙ'**

Trace of the rows loop: out starts with {n:1, fn:1, ratio:null}; prev=1, curr=1. Iteration n=2 pushes ratio=curr/prev=1/1=1 with fn=1; n=3 pushes ratio=2/1=2 with fn=2; n=4 pushes 3/2=1.5 with fn=3. So the row labeled n displays Fₙ and the ratio Fₙ/Fₙ₋₁. The column header (fibonacci.ratioHeader, 'Fₙ₊₁ / Fₙ' in all 8 locales, app/phi/page.tsx line 124 etc.) claims the row shows Fₙ₊₁/Fₙ — for row n=3 that would be F4/F3 = 1.5, but 2.0 is displayed. Every table row users see is mislabeled by one index.

_Fix:_ In the loop, compute the forward ratio for the row: push { n, fn: curr, ratio: prev+curr === 0 ? null : (prev + curr) / curr } (i.e. Fₙ₊₁/Fₙ), or change the header key in all locales to 'Fₙ / Fₙ₋₁'.

### 🟠 MED · math · `components/PhiFibonacciConvergence.tsx:213`
**Ratio column is off by one versus its "Fₙ₊₁ / Fₙ" header: row n actually shows Fₙ/Fₙ₋₁**

rows are built as out.push({ n, fn: curr, ratio: curr / prev }) inside the loop starting at n=2 with prev=1, curr=1. So row n=2 renders F₂=1 with ratio 1/1=1 and row n=5 renders F₅=5 with ratio 5/3≈1.66667. But the column header (ratioHeader, "Fₙ₊₁ / Fₙ" in all 8 locales) claims the row-n value is Fₙ₊₁/Fₙ, which for n=5 would be F₆/F₅=8/5=1.6. A reader who checks the labeled quantity against the Fₙ column in the same row gets a contradiction. The explorer's RatiosPanel gets the same indexing right (ratios[i]=FIB[i+1]/FIB[i] labeled n=i+1), so the two views disagree for the same n.

_Fix:_ In the loop, push the forward ratio for the row's own n (e.g. compute next = prev + curr first and set ratio = next / curr, with row n=1 getting F₂/F₁ = 1), or relabel the header to Fₙ / Fₙ₋₁ in all 8 locale strings on app/phi/page.tsx.

### 🟠 MED · content · `app/phi/page.tsx:132`
**Closing copy (all 8 locales) promises a Binet-formula view the explorer does not have**

closingBody says "watch the Binet formula track Fₙ exactly" (DE: "Binets Formel exakt mit Fₙ vergleichen", and equivalents in es/fr/it/pt/sv/no, lines 218/304/390/476/562/648/734). app/phi/explorer/page.tsx has exactly three panels (spiral, ratios, sunflower) and contains no Binet comparison at all (grep for "Binet" in the explorer returns nothing). Users are sent to the explorer with a false expectation.

_Fix:_ Either add a Binet overlay/readout to the ratios panel (plot φⁿ/√5 or show (φⁿ−ψⁿ)/√5 next to Fₙ), or rewrite closingBody in all 8 locales to promise only the spiral depth, ratio chart, and continuous divergence-angle sweep.

### 🟠 MED · i18n · `app/phi/page.tsx:820`
**Hardcoded English captions "First Fibonacci numbers" and "Continued fraction" leak into all 7 non-EN locales**

The page is otherwise fully localized via RICH_STORY (all 8 locales covered), but the two inset-box labels at line 820 ("First Fibonacci numbers") and line 850 ("Continued fraction") are literal JSX strings, so a German/Spanish/etc. reader sees English captions in the middle of translated sections.

_Fix:_ Add two optional fields to the RichStory type (e.g. firstNumbersLabel, continuedFractionLabel), fill them per locale, and render story.<field> instead of the literals.

### 🟠 MED · content · `app/phi/page.tsx:131`
**closingBody promises explorer features that do not exist (Binet formula view, zoom into the spiral)**

All 8 locales say the Explorer lets you 'watch the Binet formula track Fₙ exactly, and zoom into the golden spiral at any depth' (en line 131-132, de 217-218, es 303-304, fr 389-390, it 475-476, pt 561-562, sv 647-648, no 733-734). app/phi/explorer/page.tsx has exactly three panels (spiral, ratios, sunflower); Binet's formula appears nowhere in the explorer, and the spiral panel has a depth slider (3-14) but no zoom. Users are promised a feature and land on a page without it.

_Fix:_ Reword closingBody in all locales to match the real explorer (depth-adjustable spiral, ratio chart, continuous divergence-angle sweep), or add a Binet comparison readout to the ratios panel.

### 🟠 MED · content · `app/phi/page.tsx:119`
**Sunflower hint says 'drag the angle 1° away from golden' but the slider only reaches ~0.5° away**

The hint in all 8 locales instructs dragging 1° off golden (en line 119, de 205, es 291, fr 377, it 463, pt 549, sv 635, no 721). PhiSunflowerSim.tsx lines 112-113 clamp the slider to min=137.0, max=138.0; the golden angle is 137.5078°, so the maximum reachable deviation is 137.0 (−0.508°) or 138.0 (+0.492°). The instructed 1° deviation (136.5° or 138.5°) is unreachable.

_Fix:_ Change the hint to 'a fraction of a degree' / '0.5°' in all locales, or widen the slider range to 136.5-138.5.

### 🟠 MED · i18n · `app/phi/explorer/page.tsx:142`
**Explorer UI is hardcoded English for all 8 locales despite carrying substantial prose**

Panel labels ('Spiral'/'Ratios'/'Sunflower', lines 48-50, 104-106), control captions ('Depth · squares to show' 127, 'n — terms' 152, 'Divergence angle α' 180, 'Seed count' 211, 'The constant' 231, 'Snap to φ angle (360°/φ²)' 201), three full explanatory paragraphs (142-145, 169-172, 203-206), the status bar strings (78-84), and canvas annotations ('no spiral arms' / 'spiral arms appear', 662-663) are all English literals. Only topic.title/tagline/body and u.back are localized, so a German or Spanish visitor gets an almost entirely English room. Per CLAUDE.md, explorers with this much UI copy should declare a local RICH_EXPLORER keyed by Locale (as app/eulerchar and app/mobius do).

_Fix:_ Add a RICH_EXPLORER: Record<Locale, ...> covering the panel labels, control captions, explanatory paragraphs, and canvas annotation strings, mirroring the eulerchar/mobius explorer pattern.

### 🟠 MED · a11y · `app/phi/explorer/page.tsx:133`
**Explorer sliders have no associated labels and the three canvases have no aria-labels**

All four range inputs (lines 133-141 depth, 160-168 ratiosN, 188-196 angle, 216-224 seeds) sit under plain <div> captions with no htmlFor/id association and no aria-label, so screen readers announce them as unnamed sliders. The three panel canvases (lines 474, 599, 679) are bare <canvas> elements with no role/aria-label. The story-page components set the repo bar: PhiSunflowerSim.tsx uses label htmlFor='phi-sun-angle'/'phi-sun-seeds' and aria-label='Sunflower phyllotaxis simulation' on the canvas; the explorer regresses from that.

_Fix:_ Give each slider an id + <label htmlFor> (or aria-label) and add role='img' + aria-label to the three panel canvases.

### 🟡 LOW · content · `app/phi/page.tsx:71`
**Encounter card 02 lists 8 ratios derived from only 8 terms; the last ratio 1.619 needs the unlisted term 34**

"1, 1, 2, 3, 5, 8, 13, 21 — divide each by the one before" yields 7 ratios (1, 2, 1.5, 1.667, 1.6, 1.625, 1.615), but the card lists 8, ending in 1.619. Recomputation: 21/13 = 1.61538 → 1.615, and 1.619 = 34/21 = 1.61905, which requires the 9th term 34 that is not in the shown sequence. The same mismatch is replicated in all 8 locales (lines 157, 243, 329, 415, 501, 587, 673).

_Fix:_ Extend the shown sequence to "…, 21, 34" or drop the trailing 1.619 from the ratio list, in all 8 locale strings.

### 🟡 LOW · content · `app/phi/page.tsx:119`
**Sunflower hint says "drag the angle 1° away from golden" but the slider only spans ±0.5°**

The hint (and its 7 translations, lines 205/291/377/463/549/635/721) instructs dragging 1° away from 137.51°, but PhiSunflowerSim's range input is min=137.0, max=138.0 (components/PhiSunflowerSim.tsx lines 112-113), so the maximum reachable deviation is −0.51°/+0.49°. The instruction as written cannot be followed. Related: the comment at PhiSunflowerSim.tsx line 27 claims the step makes 137.5077 "reachable exactly", but step=0.01 only reaches 137.51 (the isGolden tolerance of 0.005 papers over it).

_Fix:_ Change the hint to "half a degree" (all 8 locales), or widen the slider to 136.5-138.5; fix the stale step comment in PhiSunflowerSim.tsx.

### 🟡 LOW · a11y · `app/phi/explorer/page.tsx:474`
**All three explorer canvases have no accessible name or role**

SpiralPanel (line 474), RatiosPanel (line 599), and SunflowerPanel (line 679) each render <canvas className="block h-full w-full" /> with no aria-label, role, or fallback content, so screen-reader users get nothing for the main visualization surface. The story-page counterpart PhiSunflowerSim does set an aria-label (though that one is hardcoded English, line 94, despite the component receiving localized props).

_Fix:_ Add role="img" plus a descriptive aria-label to each explorer canvas (e.g. "Golden spiral from nested Fibonacci squares, depth N"), and pass a localized ariaLabel prop into PhiSunflowerSim instead of the English literal.

### 🟡 LOW · code · `components/PhiFibonacciConvergence.tsx:319`
**Hardcoded rgba channel literals duplicate palette tokens that the same files already import**

PhiFibonacciConvergence.tsx line 319 uses stroke="rgba(125,243,255,0.35)" (signal.cyan #7df3ff) while importing palette and using palette.signal.amber three lines below. app/phi/explorer/page.tsx does the same at lines 428/437/447 (255,209,102 = signal.amber #ffd166), 453 (255,122,182 = signal.rose #ff7ab6), 535 (125,243,255 = signal.cyan), and 547/563. Recent refactor commits (2bf7a41, d3b593) deliberately replaced such literals with palette tokens; these copies will silently drift if the palette changes.

_Fix:_ Derive the rgba strings from the palette tokens (e.g. a small hexToRgba(palette.signal.cyan, 0.35) helper, as presumably used elsewhere after the palette refactor) instead of restating the channel values.

### 🟡 LOW · i18n · `app/phi/page.tsx:820`
**Hardcoded English captions 'First Fibonacci numbers' and 'Continued fraction' on an otherwise fully localized story page**

Lines 820 and 850 render literal English strings inside the JSX while every other visible string on the page comes from RICH_STORY (which covers all 8 locales). German, French, etc. readers see these two English box captions mid-story.

_Fix:_ Add two fields (e.g. firstNumbersLabel, continuedFractionLabel) to the RichStory type and fill them for all 8 locales.

### 🟡 LOW · content · `app/phi/page.tsx:71`
**Encounter card 02 lists eight ratios from eight terms; the last ratio 1.619 needs the unlisted term 34**

'1, 1, 2, 3, 5, 8, 13, 21 — divide each by the one before: 1, 2, 1.5, 1.667, 1.6, 1.625, 1.615, 1.619.' Eight terms yield only seven consecutive ratios (1/1=1, 2/1=2, 3/2=1.5, 5/3≈1.667, 8/5=1.6, 13/8=1.625, 21/13≈1.615). The eighth listed ratio 1.619 = 34/21 requires the term 34, which is not in the list. Replicated in all 8 locales (lines 71, 157, 243, 329, 415, 501, 587, 673).

_Fix:_ Either extend the term list to '…, 21, 34' or drop the final ratio 1.619 in all locales.

### 🟡 LOW · visual · `components/PhiSunflowerSim.tsx:123`
**'Golden' snap button sets 137.51°, so the readout shows a nonzero offset (+0.002°) while the button claims golden; comments contradict the code**

The button sets angle to 137.51 while GOLDEN_DEG = 137.507764, so after snapping, the 'α − 360°/φ²' readout displays '+0.002°' even though the button highlights as golden (isGolden threshold 0.005, line 81). The comments are also wrong: line 27 says 'Step in hundredths of a degree so 137.5077 (golden) is reachable exactly' — with min=137.0 and step=0.01 the grid contains 137.51, never 137.5077 — and the header comment (line 8-9) says the control steps 'in tenths of a degree'. The explorer handles this correctly by snapping to the exact GOLDEN_ANGLE_DEG (app/phi/explorer/page.tsx line 198).

_Fix:_ Snap to GOLDEN_DEG (the range input accepts off-step values set programmatically) and round only the display, or clamp the displayed diff to 0.000° when isGolden; fix the two stale comments.


## rsa

### 🟠 MED · ⚠️ UNVERIFIED · i18n · `app/rsa/page.tsx:53`
**Story page hardcodes English for the whole worked-example section and finalLabel, shown untranslated to all 8 locales**

The page pulls its four sections from the localized s.pages.rsa bundle, but everything after that is English string literals: finalLabel="Try the maths." (line 53), the "Worked example · a complete key pair on small numbers" header (line 65), the h2 "p = 17, q = 11 — the textbook RSA key." (line 68), the explanatory paragraph (lines 70-74), the table headers Symbol/Formula/Value/Meaning (lines 79-98), all KEY_ROWS meaning strings (lines 18-35), and the entire "Round trip" card (lines 115-125). A German/Spanish/etc. reader gets a fully localized top half and an English bottom half. This breaks the repo's story-page convention: comparable shared-story pages localize these extras per locale, e.g. app/pvsnp/page.tsx defines finalLabel in all 8 locales (lines 62-237) and app/doublependulum/page.tsx does the same.

_Fix:_ Move the worked-example copy (section header, h2, paragraph, table headers, KEY_ROWS meanings, round-trip text) and finalLabel into a local RICH_STORY-style Record<Locale, ...> covering all 8 locales, following the pattern in app/pvsnp/page.tsx.

### 🟠 MED · ⚠️ UNVERIFIED · a11y · `app/rsa/explorer/page.tsx:553`
**Plaintext input, text input, and public-exponent select have no accessible label**

The p and q selects are correctly wrapped in <label> elements (lines 479-506), but the e select (lines 528-543), the plaintext m input (lines 553-559), and the try-as-text input (lines 570-577) are not: their visible captions ("Public exponent e" line 526, "Plaintext m (integer, 0 ≤ m < n)" line 551, "Try as text" line 568) are sibling <div>s with no htmlFor/id association and the controls carry no aria-label. A screen reader announces these three controls as unlabeled edit fields/combo boxes.

_Fix:_ Wrap each control and its caption in a <label> (as done for p and q), or add id + htmlFor, or put an aria-label on the select/inputs.

### 🟡 LOW · content · `app/rsa/explorer/page.tsx:300`
**Extended-Euclid panel header conflates the (possibly negative) Bezout coefficient s with d**

The header reads "Extended Euclidean · finding d so that e·d + φ(n)·t = 1", but the quantity satisfying that Bezout identity in the table is s, which is often negative and then not equal to d. Recomputation for e=3, φ(n)=160 (selectable: p=17, q=11, e=3): the algorithm yields s=−53, t=1 (3·(−53)+160·1=1), while d=−53 mod 160=107. The Bezout line below (lines 339-346) gets this right ("Reducing s mod φ(n) gives d"), so the header contradicts the panel's own explanation whenever s<0.

_Fix:_ Change the header to "finding s so that e·s + φ(n)·t = 1, then d = s mod φ(n)" or similar.

### 🟡 LOW · code · `app/rsa/explorer/page.tsx:605`
**"Recompute" button is a no-op**

The click handler is setM((cur) => cur) (line 611). Returning the identical state value makes React bail out, and even if a render occurred, every useMemo in the component depends only on state that the controlled inputs already update on change, so nothing would recompute anyway. The comment claims it forces the memos to re-run "after editing the text field", but the text field's onChange (line 573) already triggers that on every keystroke. The button presents a false affordance: it visibly does nothing.

_Fix:_ Remove the Recompute button (all derived values are already fully reactive), or repurpose it as a reset-to-defaults action (setP(17n); setQ(11n); setEVal(7n); setM("88")).


## rule110

### 🔴 HIGH · content · `app/rule110/page.tsx:105`
**Rule 90 is presented as the Class 2 exemplar in the four-classes gallery, but it is Wolfram Class 3**

classesLabels.c2 reads "Class 2 · Rule 90 — Sierpiński" (same in all 8 locales, lines 105/189/273/358/442/526/610/694) and ClassPanel at line 838 renders Rule 90 under that label. Wolfram's classification (NKS, MathWorld) places the additive rules 60/90/105/150 in Class 3 alongside Rule 30; Class 2 is defined, in this very page's Section 01 body (line 74), as "stripes or simple periodic patterns", which the nested Sierpiński pattern is not. So the gallery contradicts both the standard classification and the page's own class definition one paragraph above.

_Fix:_ Use a genuine Class 2 rule for the c2 panel (e.g. Rule 108 or Rule 250, which produce simple periodic stripes) and update the labels in all 8 locales; keep Rule 90's Sierpiński panel in the Section 03 rivals gallery where it is correctly described as fractal, not as a class exemplar.

### 🟠 MED · content · `lib/i18n/atlas.ts:145`
**Atlas copy credits "Cook and Wolfram" with proving Rule 110 Turing-complete; the proof is Cook's alone**

EN body: "Cook and Wolfram proved this single rule is Turing-complete" (repeated in de:265, es:550, fr:785, it:1020, pt:1255, sv, no). Wolfram conjectured universality in the 1980s; Matthew Cook proved it and published in Complex Systems 2004. The story page itself says "Matthew Cook proved at Wolfram Research" and even recounts the publication dispute between Cook and Wolfram, so the atlas card contradicts the room it links to. This body text is also shown in the simulator sidebar (app/rule110/simulator/page.tsx line 178).

_Fix:_ Reword to "Matthew Cook proved (conjectured by Wolfram) that this single rule is Turing-complete" in all 8 locales.

### 🟠 MED · math · `app/rule110/simulator/page.tsx:130`
**Generation counter undercounts whenever speed exceeds the display refresh rate**

The while loop at lines 122-129 can push multiple generations per animation frame (at speed=120 gen/s on a 60 Hz display, acc grows ~0.01667 s per frame while dt=1/120=0.00833 s, so the loop runs twice and appends 2 rows), but line 130 runs setGeneration((g) => g + 1) exactly once per frame. The on-canvas "gen N" HUD therefore shows roughly half the true generation count at max speed, and the error grows with speed and on lower-refresh displays.

_Fix:_ Count the loop iterations (let n = 0; ... n++;) and call setGeneration((g) => g + n) so the counter tracks rows actually appended.

### 🟠 MED · animation · `components/Rule110Demo.tsx:92`
**No prefers-reduced-motion handling: rAF loop runs forever and the random-seed panels flash new content every cycle**

Rule110Demo runs an unconditional requestAnimationFrame loop that fully re-renders the canvas every cycleMs (the story page mounts 8 instances; the Rule 110 rivals panel uses initial="random", so it visibly re-randomises every 9 s regardless of the user's motion preference). CLAUDE.md states per-component canvases check the reduced-motion media query and freeze with a static fallback; TuringGrayScott-style components do. The simulator page (app/rule110/simulator/page.tsx) likewise autoplays (running=true) with no reduced-motion check.

_Fix:_ Query matchMedia("(prefers-reduced-motion: reduce)") in the effect: render once statically and skip the rAF loop (and default the simulator to paused) when it matches, re-subscribing on change like other demos in the repo.

### 🟠 MED · i18n · `app/rule110/page.tsx:986`
**Hardcoded English UI copy on a page that is otherwise fully localized in 8 languages**

The live-rule info card renders the English sentence "Flip a bit in the table above and the canvas redraws instantly." (lines 985-987) and the header "live · rule {rule}" (line 970) directly in JSX, outside RICH_STORY, so German/Spanish/etc. readers get English mid-page. Same leakage in Rule110MiniSimulator.tsx ("steps" line 130, "single" 153, "random" 167, "rule {rule}" 123) and the simulator page ("Famous rules" 186, the Info tooltip body 188-189, "Custom rule" 215, "Seed" 239, "toroidal · time flows downward" 168), even though the same sidebar pulls u.life.* translations for controls.

_Fix:_ Move these strings into the existing RICH_STORY records (all 8 locales are already authored) and pass caption/label props to Rule110MiniSimulator; add the simulator headings to u.life or a local RICH_EXPLORER record.

### 🟠 MED · a11y · `components/Rule110MiniSimulator.tsx:133`
**Sliders and canvases lack accessible names**

The steps range input (line 133) has no aria-label and the visible "steps" span is not associated via label/htmlFor or aria-labelledby; same for the rule slider (app/rule110/simulator/page.tsx line 222) and speed slider (line 294). All three canvases are unnamed: Rule110Demo.tsx line 107, Rule110MiniSimulator.tsx line 117, simulator page line 154 render <canvas> with no role/aria-label, so screen readers get nothing for the central content (Formula and other repo components do set aria-labels).

_Fix:_ Add aria-label to each range input (e.g. "Number of generations", "Rule number 0-255", "Speed in generations per second") and role="img" plus a descriptive aria-label (rule number and seed) to each canvas.

### 🟠 MED · i18n · `app/rule110/simulator/page.tsx:186`
**Simulator sidebar mixes translated strings with hardcoded English shown to all 8 locales**

The page pulls topic copy from a.topics.rule110 and control labels from u.life.*, but leaves many user-facing strings in English for every locale: "Famous rules" (line 186), the Info tooltip text (lines 188-190), "Custom rule" (line 215), "Seed" (line 239), the FAMOUS_RULES notes like "Turing-complete (Cook)" / "Traffic flow model" (lines 16-23), and the HUD badges "elementary CA · 240 cells" (line 164) and "toroidal · time flows downward" (line 168). A German or French visitor sees a half-translated panel. Other explorers in the repo use a local RICH_EXPLORER Record<Locale, ...> for exactly this.

_Fix:_ Add a local RICH_EXPLORER: Record<Locale, ...> (or extend u) covering the section headings, Info text, rule notes, and HUD badges; keep only the rule numbers hardcoded.

### 🟠 MED · animation · `components/Rule110Demo.tsx:92`
**No prefers-reduced-motion handling anywhere in the rule110 room; rAF loops run unconditionally**

grep for prefers-reduced-motion/reducedMotion across app/rule110 and components/Rule110*.tsx returns nothing. Rule110Demo runs a permanent requestAnimationFrame loop that regenerates the whole picture every cycleMs (6 instances on the story page, the rule-110 panel re-randomising each cycle), and app/rule110/simulator/page.tsx auto-plays on load (useState(true) at line 54) with a 60 fps rAF loop that keeps drawing even while paused. CLAUDE.md states per-component canvases check the media query and freeze with a static fallback; this room never does.

_Fix:_ Check matchMedia("(prefers-reduced-motion: reduce)") in Rule110Demo (render once, skip the rAF loop) and default the simulator to paused / stop the rAF redraw when the query matches.

### 🟠 MED · a11y · `app/rule110/simulator/page.tsx:154`
**Canvases have no accessible name and range sliders have no associated labels**

The full-screen simulator canvas (line 154), the Rule110MiniSimulator canvas (components/Rule110MiniSimulator.tsx line 117) and the Rule110Demo canvas (components/Rule110Demo.tsx line 107) carry no role/aria-label, so screen readers get nothing for the room's primary content. The "Custom rule" slider (line 222), the speed slider (line 294) and the mini-simulator's steps slider (Rule110MiniSimulator.tsx line 133) are bare <input type="range"> with the visible caption in a sibling span, not a <label> or aria-label, so they announce as unlabeled sliders.

_Fix:_ Add role="img" plus a descriptive (localized) aria-label to each canvas and aria-label (or htmlFor/id label association) to the three sliders.

### 🟡 LOW · visual · `components/Rule110MiniSimulator.tsx:22`
**Hardcoded hex colour "#11131c" bypasses the palette module the repo just standardized on**

COLOURS.edge is the literal "#11131c" while the adjacent keys use palette.signal.cyan / palette.canvas.bg. The value also matches no palette token (ink.800 is #11141d, canvas.bgAlt is #0b0d18), so it silently drifts from the design system; recent commits (d3b/2bf/7bf) explicitly swept such hex literals into palette tokens. Related low-grade issue in app/rule110/simulator/page.tsx lines 90-94: canvas.clientWidth * dpr is not floored, so on fractional-DPR displays (Windows 125%/150%) canvas.width !== W is true every frame and the backing buffer is reallocated at 60 fps (Rule110MiniSimulator floors correctly at line 77).

_Fix:_ Use palette.ink[800] (or add a canvas token) for edge, and Math.floor the W/H computation in the simulator's draw() as the mini simulator does.

### 🟡 LOW · code · `app/rule110/simulator/page.tsx:81`
**Stray double semicolon after the ctx guard**

Line 81 reads `if (!ctx) return;;` — the second semicolon is an empty statement left behind by an edit. Harmless at runtime but it is exactly the kind of noise ESLint's no-extra-semi/prettier pass normally removes.

_Fix:_ Change to `if (!ctx) return;` (npm run format would also fix it).

### 🟡 LOW · i18n · `app/rule110/page.tsx:986`
**Two hardcoded English strings on an otherwise fully localized story page**

The live-rule info card renders "Flip a bit in the table above and the canvas redraws instantly." (line 986) and the badge "live · rule {rule}" (line 970) as literal English, while every surrounding string comes from RICH_STORY which is carefully translated into all 8 locales. Also Rule110LookupTable.tsx line 59 hardcodes the English aria-label `Toggle output for ${pattern}`. German/Swedish/etc. readers get English sentences mid-page.

_Fix:_ Move both strings into the RichStory type (all 8 locales) and pass a localized aria-label template into Rule110LookupTable.

### 🟡 LOW · content · `app/rule110/page.tsx:168`
**German grammar error: "derselbe Saat" — Saat is feminine, must be "dieselbe Saat"**

Line 168: "Wähle Regel 90 und derselbe Saat malt ein perfektes Sierpiński-Dreieck" and line 193: rivalsCaption "Derselbe Saat, drei Regeln". "Die Saat" is feminine, so the correct forms are "dieselbe Saat" / "Dieselbe Saat". Line 186 ("Einzelzellen-Saat") is fine. The masculine article appears twice, so it reads as a systematic mistake, not a typo.

_Fix:_ Change both occurrences to "dieselbe Saat" / "Dieselbe Saat, drei Regeln" (or reword to "Gleiche Saat, drei Regeln").

### 🟡 LOW · content · `lib/i18n/atlas.ts:145`
**Atlas card credits the Turing-completeness proof to "Cook and Wolfram"; the proof is Cook's**

The rule110 atlas body says "Cook and Wolfram proved this single rule is Turing-complete" (same wording in all locales, e.g. DE line ~265 "Cook und Wolfram bewiesen"). Matthew Cook alone proved universality (published solo in Complex Systems, 2004); Wolfram conjectured it. The story page itself states this correctly everywhere ("Matthew Cook proved at Wolfram Research..."), so the atlas card contradicts the room it links to.

_Fix:_ Reword to "Matthew Cook proved (confirming Wolfram's conjecture) that this single rule is Turing-complete" across the locale variants.


## sat

### 🔴 HIGH · math · `app/sat/page.tsx:98`
**XOR-SAT is claimed to be solvable in linear time in all 8 locales, but no linear-time algorithm is known**

Section 05 (EN, line 98): "2-SAT — at most two literals per clause — is solvable in linear time; so are Horn and XOR formulas." 2-SAT (Aspvall–Plass–Tarjan) and Horn-SAT (Dowling–Gallier) are genuinely linear-time, but XOR-SAT is solved by Gaussian elimination over GF(2), which is O(n^3) (or ~O(n^ω) with fast matrix methods) — polynomial, not linear. The same claim is repeated verbatim in de (line 172), es (246), fr (320), it (394), pt (468), sv (542), no (616).

_Fix:_ Rephrase in every locale: keep "linear time" for 2-SAT and Horn, and say XOR formulas are solvable in polynomial time via Gaussian elimination (e.g. "…is solvable in linear time, as are Horn formulas; XOR formulas fall in polynomial time via Gaussian elimination").

### 🟠 MED · content · `app/sat/page.tsx:88`
**Hamiltonian path cited as one of Karp's 21 problems; Karp's 1972 list contains the Hamiltonian circuit, not the path**

Section 03 (EN, line 88): "Richard Karp showed 21 famous problems — graph colouring, Hamiltonian path, subset sum — reduce to it too." Karp's 1972 list includes directed and undirected Hamiltonian CIRCUIT (plus chromatic number and knapsack/subset-sum), but not Hamiltonian path. The error is replicated in all 8 locales (de line 162 "Hamilton-Pfad", es 236 "camino hamiltoniano", fr 310, it 384, pt 458, sv 532 "hamiltonsk väg", no 606 "hamiltonsk sti").

_Fix:_ Change "Hamiltonian path" to "Hamiltonian cycle/circuit" (Hamilton-Kreis, ciclo hamiltoniano, cycle hamiltonien, …) in every locale.

### 🟠 MED · i18n · `app/sat/explorer/page.tsx:519`
**Explorer UI is entirely hardcoded English while the sidebar header is localized, giving 7 locales a mixed-language page**

The sidebar pulls topic.title/tagline/body from the localized atlas bundle (lines 391-394), but everything else is English string literals: preset labels (lines 32, 45, 60), panel headings "Assignment"/"Formula"/"Controls"/"Speed"/"Clause colour" (260, 289, 399, 422, 460, 477), button labels Step/Play/Pause/Reset (433-453), legend entries (478-484), clause tooltips (306-314), status badges (250-254), and the whole describe() narration (516-531). A German or Swedish reader sees localized prose directly above English narration. Sibling explorers (app/eulerchar/explorer, app/mobius/explorer) solve this with a local RICH_EXPLORER Record<Locale,...>, so this room falls short of the repo's own pattern.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, ...> covering the preset labels, panel headings, control/legend strings, and a describe() string set per locale, following app/eulerchar/explorer/page.tsx.

### 🟠 MED · a11y · `app/sat/explorer/page.tsx:464`
**Speed range slider has no accessible name**

The <input type="range"> at lines 464-472 has no aria-label, no id, and no associated <label>; the "Speed" text at line 460 is a plain <div> with no htmlFor/id link. Screen readers announce it only as an unnamed slider with value 1-12.

_Fix:_ Add aria-label="Steps per second" (or wrap with a <label htmlFor> tied to an id on the input).

### 🟡 LOW · animation · `components/signature/SatClauseHero.tsx:219`
**Reduced-motion mode still shows an infinitely pulsing dot: SMIL <animate> ignores prefers-reduced-motion**

The component's contract (comment lines 9-10) is "Reduced motion: a static satisfying snapshot, no animation." But in reduced mode assignment = findSat() so solved is always true, which renders the <circle> with <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"> (lines 217-221). SMIL animation is not touched by the global CSS reduced-motion rules in globals.css, so users who requested reduced motion get a permanently pulsing element.

_Fix:_ Gate the <animate> on !reduced: render {solved && !reduced && <circle>…} or render a static full-opacity circle when reduced.

### 🟡 LOW · visual · `components/signature/SatClauseHero.tsx:181`
**Satisfied-clause box uses a hardcoded green rgba(166,225,161,…) that mismatches the palette.signal.teal used for the literals inside it**

Line 62 sets GREEN = palette.signal.teal (#7be0c0 = rgb(123,224,192)) for satisfied literal text, but the clause rect fill/stroke on lines 181-182 hardcode rgba(166,225,161,…) (#a6e1a1), a different green, so the box and its text disagree. Lines 140-141 similarly hardcode rgba(125,243,255,…) / rgba(15,18,28,…) / rgba(138,144,164,…) instead of deriving from palette.signal.cyan / palette.ink / palette.canvas.muted — the exact class of literal the recent palette-token sweep commits (d3b, 7bf) removed elsewhere.

_Fix:_ Derive all rgba values from palette tokens (e.g. a small withAlpha(hex, a) helper on palette.signal.teal / cyan / ink[950] / canvas.muted) so the box green equals the literal green.

### 🟡 LOW · code · `app/sat/explorer/page.tsx:204`
**Preset switch renders one frame with stale solver state (assignment length mismatch) before the useEffect reset runs**

Switching presets updates presetId synchronously, but state is only reset in useEffect (lines 204-207), which runs after paint. For one painted frame the new preset renders against the old assignment: going unsat (3 vars) → big (5 vars), state.assignment[3] and [4] are undefined, so litVal treats them as assigned-false (litVal returns undefined which clauseStatus reads as false), clauses can flash as conflict, and the vars row shows "F" instead of "?" (val === null check fails for undefined at line 279). Trail chips from the old run can also render preset.vars[t.v] === undefined as "undefined=T" (line 366) when the new preset has fewer vars.

_Fix:_ Reset synchronously: track the previous presetId in render and call setState(initState(preset)) during render when it changed (React's sanctioned pattern), or key the whole solver view with key={presetId} and initialize state from props.


## sierpinski

### 🔴 HIGH · math · `app/sierpinski/page.tsx:94`
**Story claims the Sierpinski gasket is "everywhere dense inside the original triangle", which is mathematically false**

EN Section 01 (line 94): "the leftover set has Lebesgue area zero — and yet it is everywhere dense inside the original triangle." Recomputation: the gasket S is an intersection of closed sets, hence closed, so its closure is S itself. The open central triangle removed at step 1 is disjoint from S, so cl(S) cannot cover the filled triangle: S is NOT dense in it. In fact S is nowhere dense (closed with empty interior). The false claim is repeated in all 8 locales: de line 192 ("überall im ursprünglichen Dreieck dicht"), es 291, fr 390, it 489, pt 588, sv 686, no 784, and the unqualified "dense" in the subdivision hints (de 227 "ist trotzdem dicht", sv 721, no 819, it 524, es 326, pt 623). Only the EN hint (line 129) hedges with "dense everywhere it touches".

_Fix:_ Replace the density claim with a true property, e.g. "area zero, yet uncountable, connected, and with no isolated points (a perfect set)" or "empty interior yet self-similar at every scale", in all 8 locales and in the hint strings.

### 🔴 HIGH · visual · `components/SierpinskiThreeRoutes.tsx:82`
**Pascal and Chaos panes render blank on mobile because canvases are sized while display:none and never redraw when their tab becomes visible**

On <md the Panel wrapper for the inactive tabs gets className `hidden md:block` (line 264), so at mount (activeTab=0) PascalPane's and ChaosPane's canvases have clientWidth/clientHeight 0. Their draw effects run once with deps [dpr] (lines 117, 185) and size the canvas to Math.max(1, 0*dpr) = 1px. Tapping the 'Pascal mod 2' or 'Chaos game' tab re-renders the parent but does not re-run the effects (activeTab is not a dependency and is not passed to the panes), so mobile users see an empty 1x1 canvas in both tabs. Desktop (md+) is unaffected because all three panels are visible at mount.

_Fix:_ Pass the panel's `visible` flag down to PascalPane/ChaosPane and include it in the effect deps (skipping work while hidden), or drive sizing+drawing from a ResizeObserver so the pane draws itself as soon as it gets nonzero layout.

### 🟠 MED · content · `app/sierpinski/page.tsx:150`
**Closing copy promises explorer features that do not exist (Chaos Game on arbitrary polygons, three constructions side by side)**

closingBody in all 8 locales (EN lines 150-151, DE 248-249, ES 347-348, FR 446-447, IT 545-546, PT 644-645, SV 742-743, NO 840-841) says the explorer lets you "run the Chaos Game on arbitrary polygons" and "toggle between the three constructions side by side". app/sierpinski/explorer/page.tsx supports only the fixed triangle for the chaos mode (triangleVertices, lines 498-514; no polygon control exists) and renders exactly one mode at a time on a single canvas (mode state, line 83) — never side by side. It also has four modes (incl. Rule 90), not three.

_Fix:_ Reword the closing copy to match the real explorer (four constructions, one at a time, triangle-only chaos game), or add the promised polygon/side-by-side features.

### 🟠 MED · animation · `components/SierpinskiThreeRoutes.tsx:168`
**Canvas animations ignore prefers-reduced-motion; no static fallback**

ChaosPane runs a requestAnimationFrame loop plotting 2400 dots over ~2s with no matchMedia('(prefers-reduced-motion: reduce)') check (lines 163-184). The explorer is worse: subdivision mode animates depth growth via setTimeout+rAF (app/sierpinski/explorer/page.tsx lines 127-165) and chaos mode runs an rAF loop forever (lines 198-220), also without any reduced-motion check. Repo convention (CLAUDE.md, Accessibility + motion): "Per-component canvases also check the media query and freeze" — the global CSS rule cannot affect canvas rAF loops. grep confirms zero prefers-reduced-motion hits in the sierpinski components/pages.

_Fix:_ When the reduced-motion query matches, draw the final state synchronously (all 2400 chaos points at once, subdivision at full depth) and skip the rAF/setTimeout loops; in the explorer's chaos mode stop after one full batch instead of looping.

### 🟠 MED · i18n · `app/sierpinski/page.tsx:1019`
**Story page hardcodes English UI blocks that render untranslated in all 8 locales**

Although the page carries a full 8-locale RICH_STORY, several user-visible blocks are hardcoded English JSX outside it: "Hausdorff dimension" + "Strictly between a curve (dim 1)..." (lines 1019, 1024-1027), "The three contractions" + vertex descriptions (lines 1040, 1044-1054), the three route-link cards "→ See the arithmetic route in full" / "→ Play the random walk yourself" / "→ Recursive construction, deep" (lines 1077, 1086, 1095), and "The family" table with headers name/ambient/copies/scale/dimension and row labels (lines 1138-1162). A German or French reader gets mixed-language sections mid-story.

_Fix:_ Move these strings into the RichStory type and per-locale objects (they already exist for everything else on the page) and render from story.*.

### 🟠 MED · i18n · `app/sierpinski/explorer/page.tsx:18`
**Explorer UI is English-only despite the 8-locale site; no RICH_EXPLORER**

All mode labels/badges (MODES, lines 18-38), control labels "Depth" (364), "Points / frame" (388), "Rows" (412), "Generations" (436), "Construction" (341), "Cell colour" (457), "Restart" (325, 478) and the hint texts (378-380, 403-405, 426-428, 449-451) are hardcoded English; only topic.title/tagline/body and u.back are localized. Other explorers in the repo (app/eulerchar/explorer/page.tsx, app/mobius/explorer/page.tsx) use the RICH_EXPLORER Record<Locale,...> pattern the CLAUDE.md prescribes. Bonus content nit: line 427 says "Black where C(n, k) is odd" but the cells are drawn in the selected signal colour, not black.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, ...> covering the mode labels, control labels, and hints (and fix "Black" to "Filled"/"Coloured").

### 🟠 MED · content · `app/sierpinski/page.tsx:242`
**Non-words / typos in German and Swedish copy: "hinjumpen", "lossen", "sudd as bort"**

DE legendChaos line 242: "halb hinjumpen" — "hinjumpen" is Denglish, not a German word (should be "hinspringen"). DE closingBody line 249: "das Chaosspiel auf beliebige Polygone lossen" — "lossen" is not a word (should be "loslassen" or "laufen lassen"). SV card 03 line 677: "de jämna cellerna sudd as bort" — stray space, should be "suddas bort". All three are shown verbatim to users.

_Fix:_ de: "halb hinspringen" (line 242) and "das Chaosspiel auf beliebigen Polygonen laufen lassen" (line 249); sv: "suddas bort" (line 677).

### 🟠 MED · animation · `components/SierpinskiThreeRoutes.tsx:131`
**Chaos Game animations ignore prefers-reduced-motion; no static fallback**

ChaosPane starts an unconditional requestAnimationFrame loop placing 2400 dots (lines 163-183), and the explorer (app/sierpinski/explorer/page.tsx) likewise animates the subdivision build-up (280ms steps) and runs the chaos rAF loop forever without checking the reduced-motion media query. CLAUDE.md states the convention that per-component canvases check `(prefers-reduced-motion: reduce)` and freeze with a static fallback; the global CSS rule only covers CSS animations, not rAF-driven canvas work.

_Fix:_ Check window.matchMedia('(prefers-reduced-motion: reduce)') in both components; when it matches, draw the final state synchronously (all 2400 dots / full-depth gasket / a fixed batch of chaos points) instead of animating.

### 🟠 MED · animation · `app/sierpinski/explorer/page.tsx:150`
**Subdivision depth animation is spoiled by the ResizeObserver's guaranteed initial callback drawing the full-depth gasket immediately**

In subdivision mode, step() animates depth 0 -> `depth` in 280ms increments, but the ResizeObserver registered right after (lines 150-159) always fires once upon observe() with the element's initial size, and its callback draws recurseSub(..., depth), i.e. the finished fractal. The next scheduled step then clears and draws depth 1, so the user sees the final image flash for ~280ms before the build-up restarts from the beginning.

_Fix:_ Skip the first ResizeObserver callback (e.g. a `first` flag) or make the RO callback redraw at the animation's `current` depth instead of the target `depth`.

### 🟠 MED · content · `app/sierpinski/page.tsx:114`
**EN Menger sponge description states the wrong removal set: 'erasing the centre face and the centre of each face' never removes the cube's central cell**

Recomputation: the sponge keeps 20 of 27 subcubes by removing the 6 face-centre cubes plus the 1 body-centre cube (27 - 7 = 20). The EN Section 05 body says 'keeping twenty and erasing the centre face and the centre of each face', which mentions faces twice and never the central cube, so the described construction does not yield 20 pieces. All other locales are correct (DE line 212: 'lösch die Mittelseiten und die zentrale Zelle'; ES line 311: 'borra el centro de cada cara y el centro del cubo'; SV, NO, FR, IT, PT likewise).

_Fix:_ EN: '...keeping twenty and erasing the centre of each face plus the cube's central cell: Menger's sponge...'.

### 🟠 MED · content · `app/sierpinski/page.tsx:150`
**Closing copy in all 8 locales promises Chaos Game 'on arbitrary polygons', a feature the explorer does not have**

EN closingBody (line 150-151): 'run the Chaos Game on arbitrary polygons' (DE line 249 'auf beliebige Polygone', ES/FR/IT/PT/SV/NO equivalents). The explorer (app/sierpinski/explorer/page.tsx) hardcodes triangleVertices() with exactly 3 vertices in chaos mode and offers no polygon/vertex-count control. The copy also says 'toggle between the three constructions side by side', but the explorer has four modes (incl. Rule 90) shown one at a time on a single canvas.

_Fix:_ Reword the closing body in all 8 locales to match the explorer (four constructions, one canvas, triangle chaos game), or add a vertex-count control to the chaos mode.

### 🟡 LOW · a11y · `app/sierpinski/explorer/page.tsx:369`
**Range sliders have no programmatic labels and the main canvas has no accessible name**

All four explorer sliders (Depth line 369, Points/frame 394, Rows 417, Generations 440) and the story-page depth slider (components/SierpinskiSubdivision.tsx line 92) are bare <input type="range"> with the visible label in a sibling div — no <label htmlFor>, aria-label, or aria-labelledby, so screen readers announce an unnamed slider. The explorer's main canvas (line 311) has no aria-label or role either (the ThreeRoutes canvases in components/SierpinskiThreeRoutes.tsx lines 121/189 likewise, though those sit next to text legends).

_Fix:_ Add aria-label={depthLabel} (etc.) to each slider and an aria-label describing the active construction to the explorer canvas (or aria-hidden on the purely decorative ThreeRoutes canvases).

### 🟡 LOW · visual · `app/sierpinski/explorer/page.tsx:53`
**Violet draw colour rgba(168,132,255) does not match palette.signal.violet (#b388ff); hardcoded rgba literals bypass palette tokens**

COLORS.violet uses rgba(168, 132, 255, ...) = #a884ff (lines 53-54) and the chaos-mode outline/vertex dots hardcode rgba(168,132,255,...) (lines 173, 181, 230), but lib/visual/palette.ts defines signal.violet as #b388ff = rgb(179,136,255). The swatch button uses the Tailwind class bg-signal-violet (#b388ff) while the canvas draws #a884ff, so the picker chip and the drawn dots visibly differ. Cyan/amber/rose rgba values do match their tokens. components/SierpinskiThreeRoutes.tsx also hardcodes rgba(255, 209, 102, ...) (lines 100, 170) instead of deriving from palette.signal.amber — the pattern the recent refactor commits (d3b/2bf) were removing elsewhere.

_Fix:_ Derive the rgba strings from palette.signal.* (e.g. a small hexToRgba helper) so violet becomes rgba(179,136,255,...) and the literals stay in sync with the tokens.

### 🟡 LOW · i18n · `app/sierpinski/page.tsx:249`
**Typos in DE and SV prose: 'lossen' and 'sudd as bort'**

DE closingBody line 249: 'das Chaosspiel auf beliebige Polygone lossen' — 'lossen' is not a German word (should be 'loslassen' or 'laufen lassen'). SV encounter card 03 line 677: 'de jämna cellerna sudd as bort' — stray space inside 'suddas'.

_Fix:_ DE: '...auf beliebigen Polygonen laufen lassen'; SV: '...cellerna suddas bort'.

### 🟡 LOW · a11y · `components/SierpinskiSubdivision.tsx:92`
**Range sliders and canvases lack accessible names**

The depth slider (line 92) has its visible label in a sibling <span> with no htmlFor/id association and no aria-label. Same pattern for all four explorer sliders (app/sierpinski/explorer/page.tsx lines 369, 394, 417, 440) and the explorer's <canvas> (line 311); PascalPane/ChaosPane canvases and the SubdivisionPane SVG in SierpinskiThreeRoutes.tsx also carry no aria-label/role (only SierpinskiSubdivision's SVG has one). Screen-reader users get unnamed 'slider' controls.

_Fix:_ Wire each slider to its label via id/htmlFor or add aria-label={depthLabel} etc.; give the canvases role='img' plus an aria-label (or aria-hidden if purely decorative).

### 🟡 LOW · visual · `app/sierpinski/explorer/page.tsx:53`
**Hardcoded violet rgba(168,132,255) does not match palette.signal.violet (#b388ff)**

COLORS.violet solid/soft (lines 53-54) and the chaos triangle outline/vertices (lines 173, 181, 230) hardcode rgb(168,132,255) = #a884ff, while lib/visual/palette.ts defines signal.violet as #b388ff = rgb(179,136,255) — the swatch button uses bg-signal-violet, so the picker chip and the drawn dots are different violets. (Cyan/amber/rose literals do match their tokens.) SierpinskiThreeRoutes.tsx also duplicates amber as 'rgba(255, 209, 102, ...)' at lines 100 and 170 instead of deriving from palette.signal.amber, contrary to the recent palette-token refactor sweep.

_Fix:_ Derive the rgba strings from palette.signal.* (e.g. a small hexToRgba helper) so canvas colours stay in sync with the tokens; fix the violet literals to 179,136,255.


## sternbrocot

### 🔴 HIGH · math · `components/SternBrocotWalk.tsx:82`
**Convergents table lists semiconvergents (first node of each run) instead of the actual convergents**

The code pushes path[i] when path[i-1].side !== path[i].side, i.e. the FIRST node of the new run. The convergents are the LAST node of each run (path[i-1]). Recomputation for pi (preset on the story page): path nodes are 1/1(R) 2/1(R) 3/1(R) 4/1(L) 7/2(L) ... 22/7(L) 25/8(R) ...; direction changes at 4/1 and 25/8, so the table headed "Best rational approximations — the convergents" shows 1/1 (err 2.14), 4/1 (err 8.6e-1) and 25/8 (err 1.7e-2), while the true convergents 3/1 (err 1.4e-1) and 22/7 (err 1.3e-3) never appear. 4/1 is not even a best approximation (3/1 has the same denominator and is far closer). It only looks right for phi because all runs there have length 1.

_Fix:_ Detect end-of-run instead: for i in 0..path.length-2, if path[i].side !== path[i+1].side push path[i]; keep the final visited node. Drop the unconditional 1/1 row when the first run is longer than 1.

### 🔴 HIGH · math · `app/sternbrocot/explorer/page.tsx:117`
**Continued-fraction panel shows a wrong expansion for targets < 1 and for rational targets**

pathToCF returns raw run-lengths, but the UI prints them as "[a0; a1; ...]" and "= cfExpr(cf)", asserting equality with the target. For x < 1 the first run is L, so the run-lengths encode the CF of 1/x, not x: preset "1/3" gives path L L L R^k..., runs [3, k, ...], displayed "= 3 + 1/(k + ...)" which is about 3.0 for a target of 0.3333. Preset "2/3" similarly shows an expression near 1.5. For rational targets hit exactly, the last term is short by one: path to 22/7 is R^3 L^6, displayed [3; 6] = 3 + 1/6 = 19/6 = 3.1667, not 22/7 = 3.1429. Also line 114's .replace(";", ";") is a no-op, so the bracket renders non-standard [3; 7; 15] instead of [3; 7, 15, ...].

_Fix:_ If the first move is L, emit a0 = 0 and shift runs to a1, a2, ...; when the walk terminates on the target, add 1 to the final run (or append a trailing 1) so the expression actually equals the target; join as `${a0}; ` + rest.join(", ").

### 🔴 HIGH · math · `app/sternbrocot/page.tsx:101`
**Section 04 claims every prefix of the walk is a best rational approximation, which is false**

EN sec04 (and all 7 other locales, e.g. de line 184): "Halt the walk after any finite number of steps and the fraction you stand on is a best rational approximation of the target: no fraction with a smaller denominator gets closer." Counterexample on pi's own path: node 25/8 = 3.125 has error 1.66e-2, while 22/7 (denominator 7 < 8, and it lies earlier on the same path) has error 1.26e-3. Only the last node of each L/R run (the convergents) are best approximations; intermediate nodes are semiconvergents. This is the same misconception coded into SternBrocotWalk.

_Fix:_ Reword in all 8 locales to: stop at the end of a run (just before the direction flips) and you are on a convergent, a best rational approximation; intermediate stops give semiconvergents.

### 🟠 MED · content · `app/sternbrocot/page.tsx:106`
**Farey section states that the fractions AT depth n with denominator <= n form the Farey sequence F_n; the correct statement needs all depths up to n**

Recomputation for n = 2: the nodes at exactly depth 2 of the tree are 1/3, 2/3, 3/2, 3/1. Keeping those in [0,1] with denominator <= 2 leaves nothing, yet F_2 = {0/1, 1/2, 1/1}. 1/2 lives at depth 1, not depth 2, so reading a single level can never produce F_n. The claim is repeated identically in all 8 locales (de line 189, es 272, fr 355, it 438, pt 521, sv 604, no 687).

_Fix:_ Reword in all locales to 'read all fractions down to depth n (the subtree), keep denominator <= n, and in-order they give F_n' (all F_n members appear by depth n-1 since a fraction with denominator q has depth at most q-1).

### 🟠 MED · math · `app/sternbrocot/explorer/page.tsx:153`
**Step-number column is wrong whenever the path is shorter than 32 rows, which is the case at the default depth of 20**

The expression `path.length - 32 + i + 1 > 0 ? path.length - 32 + i + 1 : i + 1` mixes two numbering schemes. With the default depth 20 the path has up to 21 entries, slice(-32) returns all of them, and for i >= 11 the first branch becomes positive but wrong: rows display 1,2,...,11 followed by 1,2,...,10 again (e.g. i = 11 shows '1' instead of '12'). Correct output requires branching on whether the slice actually truncated.

_Fix:_ Use `path.length > 32 ? path.length - 32 + i + 1 : i + 1`.

### 🟠 MED · a11y · `app/sternbrocot/explorer/page.tsx:184`
**Number input and depth slider have no accessible names; adjacent 'Target'/'Depth' texts are plain divs, not associated labels**

Explorer: <input type=number> at 184-190 and <input type=range> at 220-228 carry neither aria-label nor a <label htmlFor>. Same pattern in components/SternBrocotWalk.tsx (input at 105-111, label text is a div at 102) and components/SternBrocotTree.tsx (range at 211-219, plus the SVG aria-label at 153 is hardcoded English while every visible label is localized). Screen-reader users get unnamed spinbutton/slider controls.

_Fix:_ Wire the existing label strings via <label htmlFor>/id or aria-label on each input, and pass a localized aria-label prop to the tree SVG (the story already has treeCaption available).

### 🟠 MED · content · `app/sternbrocot/page.tsx:106`
**Farey section states that filtering depth-n tree level by denominator <= n yields F_n, which is false**

EN sec05 (mirrored in all locales): "Read the fractions at depth n of the Stern–Brocot tree in left-to-right order, keeping only those with denominator <= n. That is the Farey sequence F_n." Recomputation for n = 2: depth-2 nodes in [0,1] are 1/3 and 2/3, both with denominator 3, so the filter leaves the empty set, but F_2 = {0/1, 1/2, 1/1}. F_n consists of all tree nodes in [0,1] with denominator <= n regardless of depth (1/2 sits at depth 1, 1/n at depth n-1), plus the endpoints.

_Fix:_ Reword in all 8 locales: collect every node of the tree (any depth) with denominator <= n that lies in [0,1], plus 0/1; sorted left-to-right that is F_n.

### 🟠 MED · content · `app/sternbrocot/page.tsx:859`
**pi's L/R path shown as "R³ L⁷ R¹⁵ L¹ R²⁹² R¹ …" — two consecutive R runs are impossible; last term must be L¹**

Runs in a Stern–Brocot path strictly alternate R/L by construction (a run ends exactly when the direction flips). pi = [3; 7, 15, 1, 292, 1, ...] maps to R³ L⁷ R¹⁵ L¹ R²⁹² L¹ R¹ .... The displayed tail "R²⁹² R¹" is both an impossible sequence and the wrong letter for CF term a5 = 1. The convergent list on line 861 (3, 22/7, 333/106, 355/113, 103993/33102) is correct.

_Fix:_ Change the string to "R³ L⁷ R¹⁵ L¹ R²⁹² L¹ …".

### 🟠 MED · code · `app/sternbrocot/explorer/page.tsx:153`
**Step column in the convergents table shows wrong step numbers whenever path length is under 32**

The expression `path.length - 32 + i + 1 > 0 ? path.length - 32 + i + 1 : i + 1` is wrong for 11 < path.length < 32, which includes the DEFAULT state (depth slider = 20 gives a 21-row path since slice(-32) returns everything). There it evaluates to i - 10: rows read 1,2,...,11 (fallback branch) then 1,2,...,10 (i - 10 branch) instead of 1..21. The intended offset only works when path.length >= 32.

_Fix:_ Use `Math.max(0, path.length - 32) + i + 1`.

### 🟠 MED · i18n · `app/sternbrocot/explorer/page.tsx:102`
**Explorer UI is hardcoded English for all 8 locales; story page interstitials likewise**

Every label in the explorer is an English literal: "Path · L = smaller · R = larger" (102), "Continued fraction · run-length encoding of the path" (111), "Best rational approximations · the convergents along the walk" (123), table heads step/fraction/decimal/error/side (129-143), "Target" (182), "Famous numbers" (195), "Depth" (216). The repo pattern is a local RICH_EXPLORER keyed by Locale, and the story page even defines translated equivalents (walkStepHead etc.) that the explorer ignores. The story page itself also hardcodes English interstitials shown to all locales: "The mediant in one line" + caption (page.tsx 801-808), "Interactive · the tree" / "First levels — every fraction, exactly once" (828-832), "π's path" (858), "Interactive · walk a real number" / "Type a number — watch the convergents appear" (872-876), and the Hurwitz box copy (906-914), despite RICH_STORY carrying full translations for everything else.

_Fix:_ Add a RICH_EXPLORER Record<Locale, ...> in the explorer and extend RichStory with the interstitial caption strings on the story page.

### 🟡 LOW · a11y · `app/sternbrocot/explorer/page.tsx:184`
**Number inputs and range sliders have no accessible name**

The target number input (explorer 184-190), the depth range slider (explorer 220-227), the tree depth slider (components/SternBrocotTree.tsx 211-219), and the walk target input (components/SternBrocotWalk.tsx 105-111) are all preceded by a plain div label with no htmlFor/id association and carry no aria-label, so screen readers announce them as unnamed spinbutton/slider controls.

_Fix:_ Turn the caption divs into <label htmlFor> with matching ids, or add aria-label={inputLabel}/aria-label={depthLabel} to each control.


## turingpattern

### 🟠 MED · content · `app/turingpattern/explorer/page.tsx:18`
**Explorer "Spots" preset uses the canonical Mitosis parameters (F=0.0367, k=0.0649)**

The explorer's default preset labels F=0.0367, k=0.0649 as "Spots" / "Discrete round dots, like a leopard." But these exact values are the well-known Gray-Scott mitosis (self-replicating spots) preset — and the same topic's own gallery/demo label the identical numbers "Mitosis": components/TuringGrayScott.tsx:21 has `{ id: "mitosis", ..., F: 0.0367, k: 0.0649 }` and page.tsx gallery regime `mitosis` is F:0.0367, k:0.0649 (page.tsx:172-173). So the explorer opens on parameters that visibly show splitting/replicating dots while claiming to show static leopard spots, and it contradicts the other two components in the same room. (The explorer separately has a "Mitosis" preset at 0.0545/0.062, which is not the canonical mitosis, so the presets are scrambled.)

_Fix:_ Rename the explorer preset at F=0.0367/k=0.0649 to "Mitosis" (matching the gallery/demo) and give the "Spots" label a genuine spots regime, e.g. F≈0.025-0.035, k≈0.06-0.065, consistent with the gallery spots value (0.025/0.06).

### 🟠 MED · content · `app/turingpattern/page.tsx:89`
**"his last paper" for the 1952 morphogenesis paper is factually wrong (all 8 locales)**

Card 03 states Turing wrote reaction-diffusion down "in his last paper, 'The Chemical Basis of Morphogenesis' (1952)". The morphogenesis paper (1952) was not his last paper: he subsequently published "Some calculations of the Riemann zeta-function" (1953) and "Solvable and unsolvable problems" (1954). It was arguably his last major theoretical work but not his last paper. The same claim is repeated in de (line 213), es (337), fr (462), it (586), pt (710), sv (834), no (958).

_Fix:_ Replace "his last paper" with "his final major work" / "his last biology paper" / "a 1952 paper" in all 8 locales (e.g. EN "Turing wrote this down in 1952, in 'The Chemical Basis of Morphogenesis' ...").

### 🟠 MED · content · `app/turingpattern/page.tsx:119`
**Claiming reaction-diffusion is "the same mathematics" as cosmic-web / early-universe structure is a factual overreach**

Section 05 (EN) says the same mathematics "even [describes] the cosmic web of galaxies sketched out by gravitational instability in the early universe," and card 03 / intro list "density patterns in the early universe" alongside genuine reaction-diffusion examples. Large-scale structure formation is driven by gravitational (Jeans/Zel'dovich) instability, which is not the Turing reaction-diffusion mechanism nor the same equations; they are different instabilities. Seashell and sand-ripple examples are legitimate, but the cosmology claim is presented as fact and is wrong. Repeated across all 8 locales (de 243, es 367, fr 492, it 616, pt 740, sv 864, no 988; plus the intro/card 03 mentions).

_Fix:_ Drop the early-universe / cosmic-web item, or reframe it explicitly as a loose analogy about self-organising instabilities rather than "the same mathematics."

### 🟠 MED · a11y · `components/TuringGrayScott.tsx:135`
**None of the three animated canvases respect prefers-reduced-motion**

TuringGrayScott (rAF loop started at line 218), TuringGallery MiniCell (line 200), and the explorer (line 256) all run a continuous requestAnimationFrame simulation with no `matchMedia('(prefers-reduced-motion: reduce)')` check and no static fallback. CLAUDE.md's convention (Accessibility + motion, and demo-component guidance) requires per-component canvases to check the media query and freeze / show a static fallback. Users who requested reduced motion get perpetual animation.

_Fix:_ Add a prefers-reduced-motion check: when reduce is set, run the simulation to a settled state once and stop the rAF loop (render a static frame), and subscribe to matchMedia changes for cleanup, mirroring the pattern used by the signature heroes.

### 🟠 MED · content · `app/turingpattern/explorer/page.tsx:366`
**Explorer swaps the activator/inhibitor labels on the diffusion sliders, contradicting the model and the story's Turing condition**

The explorer labels D_a (default 0.16) as "activator diffusion" (line 366) and D_b (default 0.08) as "inhibitor diffusion" (line 383). But the equation shown right above (line 275) is ∂a/∂t = D_a∇²a − ab² + F(1−a): a is the fed, consumed substrate and b is the autocatalytic species (u+2v→3v makes b the activator). So a is the inhibitor-like substrate and b is the activator. The labels are reversed. Worse, this makes the defaults have the 'activator' (D_a=0.16) diffusing FASTER than the 'inhibitor' (D_b=0.08), directly contradicting the story's own 'Turing condition' panel (page.tsx line 1248: 'D_v / D_u ≫ 1 … the inhibitor must outrun the activator'). The numerics are correct Gray-Scott (substrate a diffuses 2× faster than activator b); only the two UI labels are wrong.

_Fix:_ Relabel line 366 to 'D_a · substrate (inhibitor) diffusion' and line 383 to 'D_b · activator diffusion', so the faster species reads as the inhibitor, matching the story's Turing condition.

### 🟠 MED · content · `app/turingpattern/explorer/page.tsx:18`
**Explorer preset 'Spots' uses the canonical mitosis parameters that the story gallery labels 'Mitosis'**

Explorer PRESETS has { name: 'Spots', F: 0.0367, k: 0.0649 } (line 18) and { name: 'Mitosis', F: 0.0545, k: 0.062 } (line 19). The pair F=0.0367, k=0.0649 is the well-known self-replicating 'mitosis' regime (Pearson/Karl Sims), and the story gallery on the same topic labels exactly F=0.0367, k=0.0649 as 'Mitosis' (page.tsx en line 172, and all 8 locales). So within one room the identical (F,k) is called 'Spots' in the explorer and 'Mitosis' in the gallery. The explorer's 'Spots' is misnamed; canonical stable spots sit nearer F≈0.025, k≈0.06 (the value the gallery correctly uses for 'Spots').

_Fix:_ Rename the explorer 'Spots' preset to 'Mitosis' (or change its parameters to F≈0.025, k≈0.06) and give the current 'Mitosis' preset a distinct label/value so the two widgets agree.

### 🟡 LOW · a11y · `app/turingpattern/explorer/page.tsx:279`
**Simulation canvas and range sliders lack accessible labels**

The explorer <canvas> (line 279) has no aria-label/role, so screen readers announce nothing for the main output. The F/k/D_a/D_b/speed range inputs (lines 337-438) use plain <div> captions rather than <label htmlFor> or aria-label, so they are unlabeled controls. Same pattern in TuringGrayScott.tsx sliders (lines 271, 289) and its canvas (line 236). The decorative LeopardZebraGlyph SVG is correctly labeled, showing the intent elsewhere.

_Fix:_ Add an aria-label to each canvas (e.g. "Gray-Scott reaction-diffusion simulation") and associate each slider with a <label>/htmlFor or add aria-label to the input.

### 🟡 LOW · a11y · `app/turingpattern/explorer/page.tsx:173`
**requestAnimationFrame simulation loops ignore prefers-reduced-motion in all three Turing canvases**

The explorer's animation effect (line 173), TuringGrayScott (components/TuringGrayScott.tsx line 135), and TuringGallery's MiniCell (components/TuringGallery.tsx line 125) each start a requestAnimationFrame loop unconditionally with no window.matchMedia('(prefers-reduced-motion: reduce)') check and no static fallback. CLAUDE.md states 'Per-component canvases also check the media query and freeze.' None of these do, so users who request reduced motion still get continuous canvas animation.

_Fix:_ Gate the rAF loop on a prefers-reduced-motion check: when reduce is set, run the sim to a converged frame once (or a fixed number of steps) and stop calling requestAnimationFrame, leaving a static pattern.

### 🟡 LOW · content · `components/TuringGrayScott.tsx:20`
**'Coral' preset parameters differ between the two widgets on the same page**

TuringGrayScott's inline DEFAULT_PRESETS defines coral as F=0.062, k=0.062 (line 20), while the story gallery passes coral as F=0.054, k=0.063 (page.tsx line 165 and every locale). Both widgets sit on the same story page and claim to run 'the same equations', yet label different (F,k) points as 'Coral'. F=0.062,k=0.062 is not the usual coral-growth regime (~0.0545/0.062).

_Fix:_ Align TuringGrayScott's coral preset to F≈0.0545, k≈0.062 to match the gallery and the canonical coral regime.

### 🟡 LOW · a11y · `app/turingpattern/explorer/page.tsx:279`
**Simulation canvases have no accessible name**

The explorer canvas (line 279) and the TuringGrayScott canvas (components/TuringGrayScott.tsx line 236) carry no aria-label or role, so screen readers announce nothing for the main visual output. (The gallery MiniCell canvases are at least wrapped in labelled buttons.)

_Fix:_ Add role="img" and an aria-label such as aria-label="Live Gray-Scott reaction-diffusion simulation" to the canvas elements.


## ulam

### 🔴 HIGH · math · `components/UlamSpiralMini.tsx:59`
**spiralCoord places every ring's top row one cell too high, so the rendered spiral is not the Ulam spiral**

In the second branch, y starts at -(k-1) and `y += sideLen` yields -(k-1)+2k = k+1, but the top row of ring k is y = k (the right column already ends at (k, k)). Recomputation with the exact code: n=4 -> (0,2) instead of (0,1); n=5 -> (-1,2) instead of (-1,1); adjacency between consecutive integers breaks at n = 4, 6, 14, 18, 32, 38, 58, ... (Manhattan distance 2), and cells (0,1), (-1,1), (1,2), (-2,2), ... are never occupied by any n. Consequences: the top-left corner cell of every ring stays empty, primes in top rows are drawn one row too high (kinking the very diagonals the page is about), and the outermost ring's top row lands at y = half+1 which the `Math.abs(y) > half` cull silently drops, so those primes never render and the drawn primes no longer match the primesCount label.

_Fix:_ Change `y += sideLen;` to `y += sideLen - 1;` (equivalently `y = k;`) in the second branch. Verified: with that one change all consecutive coordinates are adjacent and n=1..side² tiles the grid bijectively.

### 🔴 HIGH · math · `app/ulam/explorer/page.tsx:46`
**Explorer duplicates the same spiralCoord off-by-one bug (top row at y = k+1 instead of y = k)**

spiralCoord here is a byte-for-byte copy of the buggy function in UlamSpiralMini.tsx; the code even contradicts its own comment on line 40 ("we go up to (k, k); then left to (-k, k)") because `y += sideLen` puts the leftward run at y = k+1 and the left column then starts at k-1, skipping (-k, k). At the default side = 251 that misplaces the top rows of 125 rings and drops the outermost ring's top row entirely via the |y| > half cull.

_Fix:_ Apply the same fix as in UlamSpiralMini: `y += sideLen - 1;`. Consider extracting spiralCoord (and buildSieve) into a shared lib module so the two copies cannot drift.

### 🔴 HIGH · content · `app/ulam/page.tsx:136`
**quadraticNote claims Euler's quadratic hits "40 / 41", but the widget it annotates computes and displays 41 / 41**

UlamQuadraticTester evaluates n² − n + 41 for n = 0..40 (RANGE = 41). Recomputation: every one of the 41 values is prime (41, 41, 43, 47, ..., 1601; the first composite is 41² = 1681 at n = 41), verified by running the component's own isPrime over the range: hits = 41. So the stat line renders "41 / 41 prime · 100%" while the note directly beneath asserts "Euler's quadratic hits 40 / 41". The wrong claim is repeated in all 8 locales (lines 136, 238, 340, 442, 544, 646, 748, 850).

_Fix:_ Change the note in all 8 locales to 41 / 41 (mentioning that 41 appears twice, at n = 0 and n = 1), or switch the default/preset polynomial to n² + n + 41 and the range to n = 0..39 if the intent was the classic 40-hit streak.

### 🔴 HIGH · content · `app/ulam/page.tsx:87`
**Section 01 describes an impossible spiral walk: "down for 6, 7, 8, then right for 9, 10, 11, 12"**

In the standard spiral (1 centre, 2 right, 3 up), recomputed coordinates are 6:(-1,0), 7:(-1,-1) (down twice), 8:(0,-1), 9:(1,-1), 10:(2,-1) (right three times), 11:(2,0), 12:(2,1) (up). The claimed walk (three downs, four rights) does not even produce a square spiral (side lengths must go 1,1,2,2,3,3,...), and it contradicts encounter card 01 on the same page, which correctly says "right, up, left, left, down, down, right, right, right". The wrong text is replicated in all 8 locales (lines 87, 189, 291, 393, 495, 597, 699, 801).

_Fix:_ Change to "... down for 6 and 7, right for 8, 9, 10, then up for 11, 12, 13" in all eight locale blocks.

### 🟠 MED · math · `app/ulam/page.tsx:97`
**Euler streak misstated for the minus form: n² − n + 41 is prime for n = 0..40 (41 values), not "0 to 39 — forty"**

n² − n + 41 = (n−1)² + (n−1) + 41, so its prime streak runs one further than the plus form: recomputed, n = 0..40 all give primes (n = 40 gives 1601, prime) and the first composite is n = 41 (1681 = 41²). The classic "prime for n = 0 to 39" statement belongs to n² + n + 41. The mismatch recurs in the hero card at line 975 ("Prime for every n from 0 to 39") and in the atlas copy (lib/i18n/atlas.ts line 325 de, and the parallel en entry), across all locales.

_Fix:_ Either state n² + n + 41 with 0..39, or keep n² − n + 41 and say it is prime for every n from 0 to 40, first failing at n = 41 = its own root of 41².

### 🟠 MED · content · `app/ulam/page.tsx:73`
**Misattribution: Ulam, Stein and Wells did not print the 65 000-cell spiral "in Scientific American"**

Stein, Ulam and Wells published "A Visual Display of Some Properties of the Distribution of Primes" in the American Mathematical Monthly 71 (1964); the ~65 000-number MANIAC pictures reached Scientific American via Martin Gardner's Mathematical Games column (March 1964), not as a publication by the three authors. The claim is repeated in all 8 locales (lines 73, 174, 276, 378, 480, 582, 684, 786).

_Fix:_ Reword to: they published it in the American Mathematical Monthly in 1964, and Martin Gardner's Scientific American column made the 65 000-cell picture famous the same year.

### 🟠 MED · i18n · `app/ulam/explorer/page.tsx:141`
**Explorer UI is hardcoded English for all 8 locales**

"spiral · ... numbers" (141), "... primes" (144), "Grid side" (161), "Odd numbers keep 1 centred." (174), "Highlight a quadratic" (179), "Pink = the diagonal the quadratic carves out." (197) and the "Off" quadratic label (11) are literals; only title/tagline/body and u.back come from i18n. The story page localizes the exact same strings (spiralSideLabel, spiralHighlightLabel, spiralPrimes/Numbers, hint) in all 8 languages, so a de/fr/sv visitor gets a half-English explorer. The repo convention for this is a local RICH_EXPLORER keyed by Locale.

_Fix:_ Add a RICH_EXPLORER Record<Locale, ...> (or reuse the story page's spiral* strings via a shared module) covering the six hardcoded strings and the "Off" label.

### 🟠 MED · a11y · `app/ulam/explorer/page.tsx:138`
**Explorer canvas has no aria-label and both grid-side sliders have no accessible name**

The explorer canvas (line 138) carries no aria-label/role at all (UlamSpiralMini's canvas does, though its "Ulam spiral" label is untranslated). The range inputs in explorer (line 165) and UlamSpiralMini (line 178) are only preceded by sibling <div>s ("Grid side"), not associated via <label>/aria-label/aria-labelledby, so screen readers announce an unnamed slider; the same applies to the quadratic-preset group headings.

_Fix:_ Add a localized aria-label to the explorer canvas, and give each range input an aria-label (or wrap it with the existing label text in a <label>), mirroring how UlamQuadraticTester's NumberField already wraps its input in a <label>.


## wang

### 🔴 HIGH · math · `components/WangAperiodicTiler.tsx:57`
**Demo tile sets are labeled as the real Culik-1996 / Jeandel-Rao-2015 aperiodic sets but both admit 2x2 periodic tilings, so the page's aperiodicity claim is mathematically false**

The UI presents the sets as "Culik · 13" (attrib "Culik 1996") and "Jeandel–Rao · 11" (attrib "Jeandel–Rao 2015"), and app/wang/page.tsx:163 (aperiodicHint, all 8 locales) asserts "Whichever set you pick, the patch never settles into a small repeating block — that is what aperiodic means." Recomputation: CULIK13 tiles 5=[N2,E0,S3,W1] and 6=[N3,E1,S2,W0] tile a 2x2 torus [[5,6],[6,5]]: horizontals 5.E=0=6.W, 6.E=1=5.W; verticals 5.S=3=6.N, 6.S=2=5.N — a valid 2x2 periodic tiling of the plane. JEANDEL_RAO11 likewise: [[2,7],[5,6]] with 2=[0,2,2,1], 7=[1,1,0,2], 5=[2,1,0,0], 6=[0,0,1,1] satisfies all wrap constraints (verified by exhaustive torus search, no set needed beyond 2x2). The real Jeandel–Rao set also uses 4 edge colours; this one uses 3. The code comment (lines 13-16) admits the sets are illustrative, but the user-facing labels, attributions and hint state the opposite. Same fake CULIK13 list is Set B in app/wang/explorer/page.tsx:58 (there at least described honestly as "aperiodic-style").

_Fix:_ Either transcribe the actual published Culik 13-tile and Jeandel–Rao 11-tile tables (both are small and public), or relabel the buttons/attribs as "illustrative, in the spirit of Culik/Jeandel–Rao" and rewrite aperiodicHint (and tryIt at page.tsx:113) so it no longer claims the displayed patch is aperiodic.

### 🔴 HIGH · math · `components/WangAperiodicTiler.tsx:57`
**Demo tile sets labeled "Culik 1996" and "Jeandel-Rao 2015" are invented and both tile the plane periodically, contradicting the aperiodicity claim shown to users**

The UI labels the sets "Culik · 13" (attrib "Culik 1996") and "Jeandel-Rao · 11" (attrib "Jeandel-Rao 2015"), and the story copy asserts aperiodicity as fact: page.tsx tryIt says "watch an 11- or 13-tile aperiodic set fill a region" and aperiodicHint (page.tsx line 163) says "Whichever set you pick, the patch never settles into a small repeating block". The code comment (lines 13-16) admits the numbers are illustrative, and a brute-force torus search confirms both sets are periodic. CULIK13: checkerboard of #5=[N2,E0,S3,W1] and #6=[N3,E1,S2,W0] tiles a 2x2 torus (5.E=0=6.W, 6.E=1=5.W, 5.S=3=6.N, 6.S=2=5.N, all wraps symmetric), so the plane tiles with a repeating 2x2 block. JEANDEL_RAO11: block #2=[0,2,2,1],#7=[1,1,0,2] over #5=[2,1,0,0],#6=[0,0,1,1] is a valid 2x2 torus (row 0: 2->2, wrap 1->1; row 1: 1->1, wrap 0->0; col 0: 2->2, wrap 0->0; col 1: 0->0, wrap 1->1). Also the real Jeandel-Rao set uses 4 edge colours; the coded one uses 3, further proof it is not the published table.

_Fix:_ Either transcribe the actual published Culik-13 and Jeandel-Rao-11 tile tables, or relabel honestly ("in the spirit of Culik 1996", as the explorer's Set B already does) and soften tryIt/aperiodicHint in all 8 locales so they no longer claim the rendered patch is aperiodic.

### 🟠 MED · content · `app/wang/page.tsx:105`
**Encounter card 02 says "Three tiles, four edge colours" but the rendered example uses only two colours**

TILE_A=[0,1,1,1], TILE_B=[1,1,0,1], TILE_C=[0,1,0,1] (lines 52-54) use only colour indices 0 and 1, so the MiniTile diagram shows only cyan and violet. Yet the card body in every locale claims four edge colours (EN line 105 "Three tiles, four edge colours", DE line 189 "Drei Kacheln, vier Kantenfarben", ES/FR/IT/PT/SV/NO identical). The adjacent code comment at line 50 is also wrong: it claims the valid 2x2 is [A B / C C] with "A.S=C.N=0", but A.S=1 and C.N=0; the actually rendered patch is [B B / A A] (lines 847-850), which IS valid (B.S=0=A.N, B.E=1=B.W, A.E=1=A.W).

_Fix:_ Either change the copy in all 8 locales to "two edge colours", or redesign TILE_A/B/C to genuinely use four colours; fix the stale comment at line 50 to describe the [B B / A A] patch.

### 🟠 MED · content · `app/wang/page.tsx:140`
**Claim that Penrose published the two-rhombus aperiodic tiling in 1974 is wrong**

Section 05 in all 8 locales states "In 1974 Roger Penrose published an aperiodic tiling using just two rhombi" (EN line 140, DE line 224, etc.). Penrose's 1974 paper ("The role of aesthetics in pure and applied mathematical research") introduced the six-tile pentagon-based P1 tiling. The two-tile sets, the kite-and-dart (P2) and the two rhombi (P3), came later, around 1976-1978. Year and tile count as combined here are historically incorrect.

_Fix:_ Either say "In 1974 Penrose published his first aperiodic tiling of six tiles, soon refined to just two rhombi", or keep "two rhombi" and move the date to the late 1970s, consistently across all 8 locales.

### 🟠 MED · i18n · `app/wang/explorer/page.tsx:87`
**Explorer UI is entirely hardcoded English for all 8 locales**

Set names and descriptions (lines 87-107), "Tiling search" (372), stat labels "Placed/Backtracks/Progress/Status" (383-396), status values "complete"/"no tiling found"/"searching" (395), "Tile set" (412), "Grid size" (438), "Speed" (458), "Restart" (478), "Show the tile palette" (484), "Edge colours" (498) are all English literals; only topic title/tagline/body and the back link are localized. The repo convention (CLAUDE.md) is a local RICH_EXPLORER keyed by Locale for explorers with many UI strings, and the story page itself carries a full 8-locale RICH_STORY. The story page also leaks hardcoded English inside localized flow: "valid 2x2" (page.tsx 854), the Berger 1966 box prose (896-899), the record table incl. "Shrinking the aperiodic record" and row texts (940-963), and the hat/spectre box (1016-1017).

_Fix:_ Add a RICH_EXPLORER Record<Locale, ...> for the explorer strings and move the story page's hardcoded English blocks (Berger box, record table labels, hat/spectre box, "valid 2x2") into the existing RICH_STORY per locale.

### 🟠 MED · animation · `app/wang/explorer/page.tsx:304`
**Explorer animation loop ignores prefers-reduced-motion**

The requestAnimationFrame search loop (lines 304-347) runs unconditionally; there is no matchMedia("(prefers-reduced-motion: reduce)") check anywhere in the file. Repo convention (CLAUDE.md, "Accessibility + motion") is that per-component canvases check the media query and freeze with a static fallback. Users with reduced motion enabled still get a continuously animating canvas with a moving cursor highlight.

_Fix:_ On prefers-reduced-motion, run the search synchronously (or in a few large batches) to a finished state and draw once, instead of animating placement-by-placement; re-check via a matchMedia listener.

### 🟠 MED · visual · `components/WangAperiodicTiler.tsx:241`
**Aperiodic tiler canvas is not DPR-aware and carries a hardcoded hex colour**

The canvas is fixed at width=360 height=280 attribute pixels with no devicePixelRatio scaling (unlike the explorer, which uses the useDpr hook and ctx.setTransform), so the patch renders blurry on retina displays, violating the repo's "DPR-aware" demo convention. Additionally COLOURS at line 7 appends the hardcoded hex "#9ad7ff" alongside palette tokens; it is dead anyway since both tile sets only use colour indices 0-3.

_Fix:_ Size the backing store with useDpr (width = cssWidth * dpr, ctx.setTransform(dpr,0,0,dpr,0,0)) and drop the unused "#9ad7ff" entry or replace it with a palette token.

### 🟠 MED · content · `app/wang/page.tsx:150`
**closingBody in all 8 locales promises the Explorer lets you "zoom into any region of the growing patch", but the explorer has no zoom at all**

EN closingBody: "...watch the algorithm backtrack live... and zoom into any region of the growing patch." The same zoom promise is repeated in de (234), es (318), fr (402), it (486), pt (570), sv (654), no (738). app/wang/explorer/page.tsx contains no zoom/pan interaction of any kind — controls are set selector, grid-size slider, speed slider, and restart. Users are promised a feature that does not exist.

_Fix:_ Drop the zoom claim from closingBody in all 8 locales (or add zoom to the explorer). Also soften "switch between an explicitly periodic set and the aperiodic ones" given Set B is only "aperiodic-style".

### 🟠 MED · content · `app/wang/page.tsx:140`
**Section 05 misdates Penrose's two-rhomb tiling to 1974 and Shechtman's observation to 1984 (in all 8 locales)**

EN: "In 1974 Roger Penrose published an aperiodic tiling using just two rhombi". Penrose's 1974 paper ("The role of aesthetics in pure and applied mathematical research") presented the six-prototile P1 pentagon tiling; the kite-and-dart (P2) and the two-rhomb P3 tiling came later (~1976-78, popularized 1977). Second: "Ten years later, in 1984, Dan Shechtman observed sharp diffraction patterns..." — Shechtman made the observation on 8 April 1982; 1984 is the publication date (PRL, Nov 1984). Both errors are replicated verbatim in de/es/fr/it/pt/sv/no sections[4].

_Fix:_ Either say "In 1974 Penrose published his first aperiodic tiling (six tiles), later refined to just two rhombi", and "observed in 1982 (published 1984)", in all locales.

### 🟠 MED · content · `app/wang/page.tsx:105`
**Encounter card 02 claims "Three tiles, four edge colours" but the rendered diagram tiles use only two colours**

TILE_A=[0,1,1,1], TILE_B=[1,1,0,1], TILE_C=[0,1,0,1] (lines 52-54) use only colour indices 0 and 1, so the MiniTile diagram shows only cyan and violet. Yet the card body says "Three tiles, four edge colours" — repeated in every locale (de:189 "vier Kantenfarben", es:273 "cuatro colores de arista", fr:357, it:441, pt:525, sv:609, no:693). The text directly contradicts the picture beside it.

_Fix:_ Change the copy to "two edge colours" in all 8 locales, or redesign TILE_A/B/C to actually use all four palette colours while keeping the 2x2 patch valid.

### 🟠 MED · i18n · `app/wang/page.tsx:896`
**Hardcoded English prose blocks on an otherwise fully translated story page (Berger callout, record table, hat/spectre callout), plus an entirely English explorer UI**

The story page carries a full RICH_STORY for 8 locales, but several user-facing strings are hardcoded English literals rendered for every locale: the Berger callout body "No algorithm decides, in general, whether a finite Wang tile set tiles the plane..." (lines 896-899), table caption "Shrinking the aperiodic record" (940) with headers "Year/Author/Tiles" (946-952) and row text like "Hao Wang — conjecture: none exist" / "proven minimum" (957-963), the "valid 2x2" label (854), and the hat/spectre paragraph "The «hat» (March 2023) tiles only aperiodically..." (1015-1017). app/wang/explorer/page.tsx likewise hardcodes all UI copy (set names/descriptions 87-107, "Tile set", "Grid size", "Speed", "Restart", "Placed/Backtracks/Progress/Status", "no tiling found") despite the repo's RICH_EXPLORER pattern for explorers with many UI strings.

_Fix:_ Move these strings into the RichStory type (they sit next to fully translated content, so the leak is conspicuous) and add a small RICH_EXPLORER record for the explorer's labels.

### 🟠 MED · a11y · `app/wang/explorer/page.tsx:444`
**Explorer controls and canvas have no accessible names, and the auto-playing search ignores prefers-reduced-motion**

The grid-size range input (line 444) and speed range input (462) have no aria-label and no associated <label> — the visible captions are plain divs, so screen readers announce two anonymous sliders. The <canvas> (379) has no role, aria-label, or fallback text. The backtracking search starts animating automatically on mount and the rAF loop (304-347) never checks matchMedia("(prefers-reduced-motion: reduce)") and offers no pause button; CLAUDE.md states per-component canvases check the media query and freeze (e.g. diffusion explorer does). The loop also keeps scheduling rAF every frame forever after done/stuck.

_Fix:_ Add aria-label to both sliders and role="img" + aria-label to the canvas; on prefers-reduced-motion render the finished patch in one synchronous pass (or start paused); stop scheduling rAF once done/stuck.

### 🟠 MED · content · `app/wang/page.tsx:150`
**closingBody promises the Explorer lets you "zoom into any region of the growing patch", but the explorer has no zoom**

All 8 locales promise zoom (EN line 150 "zoom into any region of the growing patch", DE line 234 "in jede Region der wachsenden Fläche zoomen", etc.). app/wang/explorer/page.tsx has no zoom/pan interaction of any kind: the canvas has no pointer handlers, and the only controls are tile set, grid size, speed, and restart.

_Fix:_ Drop the zoom promise from closingBody in all 8 locales (the backtracking and set-switching claims are accurate), or add a zoom interaction to the explorer.

### 🟠 MED · i18n · `app/wang/explorer/page.tsx:90`
**Explorer UI is hardcoded English for all 8 locales**

Set names/descriptions (lines 90-104: "Set A · periodic, 5 tiles", "Two colours, five tiles — every placement easy..."), "Tiling search" (372), Stat labels "Placed"/"Backtracks"/"Progress"/"Status" (383-394), status values "complete"/"no tiling found"/"searching" (395), "Tile set" (412), "Grid size" (438), "Speed" (458), "Restart" (478), "Show the tile palette" (484), and "Edge colours" (498) are all English string literals. Only topic.title/tagline/body and u.back come from i18n, so a de/es/fr/... visitor gets a mostly English page while the story page is fully translated. The repo convention (CLAUDE.md) is a local RICH_EXPLORER keyed by Locale for exactly this case.

_Fix:_ Add a RICH_EXPLORER: Record<Locale, ...> covering the set names/descriptions, stat labels, status strings, and control captions, following app/wang/page.tsx's RICH_STORY pattern.

### 🟠 MED · animation · `app/wang/explorer/page.tsx:304`
**Explorer animation ignores prefers-reduced-motion**

The requestAnimationFrame search loop (lines 304-347) runs unconditionally; nothing in app/wang/ or the two Wang components queries matchMedia("(prefers-reduced-motion: reduce)") (grep confirms zero hits). CLAUDE.md states per-component canvases must check the media query and freeze with a static fallback; this canvas animates continuously for users who requested reduced motion.

_Fix:_ On reduced motion, run the backtracking search to completion synchronously (or in a few large batches without per-step animation) and draw the finished patch once; skip the cursor-highlight animation.

### 🟠 MED · visual · `components/WangAperiodicTiler.tsx:241`
**Aperiodic tiler canvas has no DPR scaling, rendering blurry on hi-DPI screens**

The canvas is fixed at width={360} height={280} and drawn 1:1 (the effect at lines 199-226 uses canvas.width/height directly, no devicePixelRatio transform). The repo standard is the useDpr hook, which app/wang/explorer/page.tsx already uses (canvas.width = clientWidth * dpr plus ctx.setTransform). On any retina display the tile patch renders at half resolution.

_Fix:_ Use useDpr(): set canvas.width/height to CSS size * dpr, keep CSS size via style or class, and ctx.setTransform(dpr,0,0,dpr,0,0) before drawing, re-running the draw effect on dpr change.

### 🟡 LOW · a11y · `app/wang/explorer/page.tsx:444`
**Range sliders and canvas lack accessible names**

The "Grid size" (lines 444-452) and "Speed" (462-470) range inputs have no aria-label and no associated <label> element; the visible captions are plain divs, so screen readers announce unnamed sliders. The main canvas (line 379) has no role or aria-label either, so the tiling visualization is invisible to assistive tech (compare WangTileGrid, whose cells at least carry aria-label="Cell r, c").

_Fix:_ Add aria-label="Grid size" / aria-label="Speed" (localized) to the inputs or wire the caption divs via htmlFor/id, and give the canvas role="img" with a localized aria-label describing the tiling search.

### 🟡 LOW · visual · `components/WangAperiodicTiler.tsx:241`
**Aperiodic tiler canvas is a fixed 360x280 backing store with no DPR scaling — blurry on hiDPI displays**

The canvas is declared width={360} height={280} and drawn at 1x (lines 199-226 never touch devicePixelRatio), so on retina screens the patch renders at half resolution and the 0.5px hairline grid smears. The repo has lib/hooks/useDpr.ts exactly for this, and the wang explorer already uses it (commit 2bf7a41 "use useDpr hook in explorer"); this story-page component was missed. It also has no aria-label/role on the canvas. The unused fifth colour "#9ad7ff" (line 7) is a raw hex where palette tokens are the convention, and no tile in either set references index 4.

_Fix:_ Use useDpr(): size the backing store to cssSize * dpr with ctx.setTransform(dpr,0,0,dpr,0,0), add role="img" + aria-label, and delete the dead "#9ad7ff" entry.

### 🟡 LOW · i18n · `app/wang/page.tsx:593`
**Swedish story uses "halterproblemet" for the halting problem — not a Swedish word, and inconsistent with the rest of the site**

sv intro (line 593): "gömde halterproblemet i ett barnspel" and sv section 03 (634): "och det är halterproblemet". Swedish for the halting problem is "stopproblemet" (used elsewhere in this repo: lib/i18n/stories.sv.ts:760 "Turings bevis att stopproblemet är oavgörbart"); "halter" is the plural of "halt" (content/level), so "halterproblemet" reads as nonsense. The same site thus names the concept differently in Swedish depending on the page.

_Fix:_ Replace both occurrences with "stopproblemet".

### 🟡 LOW · a11y · `app/wang/explorer/page.tsx:444`
**Sliders have no accessible name and canvases have no aria-label**

The grid-size range input (line 444) and speed range input (line 462) are only described by sibling <div>s ("Grid size", "Speed"), not by <label htmlFor> or aria-label, so screen readers announce unnamed sliders. The explorer canvas (line 379) and the WangAperiodicTiler canvas (WangAperiodicTiler.tsx line 241) have no role/aria-label either, unlike the repo's stated convention of accessible, DPR-aware canvases.

_Fix:_ Add aria-label (or id + label htmlFor) to both range inputs, and role="img" with a descriptive aria-label to both canvases.

