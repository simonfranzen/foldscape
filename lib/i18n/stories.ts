// Long-form story content for individual topic landing pages. Currently
// authored in English (full) and German (full); other locales fall back to
// the English copy until a native pass is done.

import type { Locale } from "./types";
import { es } from "./stories.es";
import { fr } from "./stories.fr";
import { it } from "./stories.it";
import { pt } from "./stories.pt";
import { sv } from "./stories.sv";
import { no } from "./stories.no";

export interface StoryPage {
  pretitle: string;
  title: string;
  tagline: string;
  intro: string;
  ctaInteractive: string;
  sections: Array<{
    pretitle: string;
    title: string;
    body: string;
  }>;
}

export interface StoriesDict {
  sectionLabels: Record<string, string>;
  pages: {
    mandelbrot: StoryPage;
    life: StoryPage;
    nand: StoryPage;
    iota: StoryPage;
    rule110: StoryPage;
    logistic: StoryPage;
    lorenz: StoryPage;
    fourier: StoryPage;
    euler: StoryPage;
    banach: StoryPage;
    lsystem: StoryPage;
    wang: StoryPage;
    collatz: StoryPage;
    doublependulum: StoryPage;
    bzr: StoryPage;
    turingpattern: StoryPage;
    sierpinski: StoryPage;
    chaosgame: StoryPage;
    penrose: StoryPage;
    apollonian: StoryPage;
    phi: StoryPage;
    buffon: StoryPage;
    hilberthotel: StoryPage;
    gabrielshorn: StoryPage;
    cantor: StoryPage;
    boids: StoryPage;
    aizawa: StoryPage;
    dla: StoryPage;
    langton: StoryPage;
    pascalmod: StoryPage;
    sternbrocot: StoryPage;
    ulam: StoryPage;
    cardioid: StoryPage;
    galton: StoryPage;
    magpendulum: StoryPage;
    godel: StoryPage;
    halting: StoryPage;
    pvsnp: StoryPage;
    rsa: StoryPage;
    mobius: StoryPage;
    eulerchar: StoryPage;
    konigsberg: StoryPage;
    fourcolor: StoryPage;
    smallworld: StoryPage;
  };
  // Localised section labels (used by the story pages themselves; the
  // topic-card "Story / Explorer" labels above already come from sectionLabels.
  storyLabels: {
    nowTryIt: string;
    readyToFly: string;
    yourTurn: string;
    stepIntoIt: string;
    buildWithOne: string;
  };
}

const en: StoriesDict = {
  sectionLabels: {
    cathedral: "Cathedral",
    atelier: "Atelier",
    resonance: "Resonance",
    story: "Story",
    explorer: "Explorer",
    sandbox: "Sandbox",
    sound: "Sound",
  },
  pages: {
    mandelbrot: {
      pretitle: "Topic II · Chaos",
      title: "The Mandelbrot Set",
      tagline: "Square and add. Forever.",
      intro:
        "One of the most photographed objects in mathematics is the visualisation of an absurdly simple rule. Below: what the rule is, what we are actually looking at, and a button straight into the Explorer for when you want to fly.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The rule",
          title: "Pick a complex number, then iterate",
          body: "Choose any complex number c. Start a sequence at z₀ = 0 and keep applying zₙ₊₁ = zₙ² + c. That is the entire rule. We then ask one yes/no question: does the sequence stay bounded, or does it eventually escape to infinity? The set of values of c for which the sequence stays bounded — that is the Mandelbrot set. Everything else, including the famous picture, is just a colourful answer to that question.",
        },
        {
          pretitle: "Step two · Watching the orbit",
          title: "Three points, three fates",
          body: "It helps to actually watch the sequence. For a c deep inside the set, the orbit tightens around a small loop and never leaves. For a c just outside, the orbit drifts outward and then explodes within a handful of steps. For a c right on the boundary, the orbit dances forever, never settling and never escaping. The three animated panels below show those three regimes side by side.",
        },
        {
          pretitle: "Step three · Why the picture is infinite",
          title: "The boundary never simplifies",
          body: "Once you colour each c by how quickly its orbit escapes, the boundary lights up. The astonishing fact, proven by Tan Lei and others, is that the boundary is self-similar in a deep sense — wherever you zoom, you find new tiny copies of the whole shape, surrounded by filigree that never repeats. That is why the Explorer goes down to 10¹⁰ zoom: there is genuinely something new at every scale.",
        },
        {
          pretitle: "Step four · The fixed points",
          title: "Where the math is hiding",
          body: "Inside the big cardioid in the centre, the iteration converges to a single fixed point. Inside each round disc attached to it, the iteration converges to a 2-cycle, then a 4-cycle, then 8 — the same period-doubling cascade as the logistic map. The Mandelbrot set is, in a precise sense, a map of where the logistic story is calm and where it goes chaotic. Two famous chaotic systems, one picture.",
        },
      ],
    },
    life: {
      pretitle: "Topic III · Computation",
      title: "Conway's Game of Life",
      tagline: "Four rules. Universes follow.",
      intro:
        "Martin Gardner introduced Conway's rules in his October 1970 Scientific American column. Two pages of magazine, four lines of rule, and a community of mathematicians has spent fifty years discovering what was already inside them. The Sandbox lets you draw and run any pattern — but first, the four rules in action.",
      ctaInteractive: "→ Open the Sandbox",
      sections: [
        {
          pretitle: "Step one · The rules",
          title: "Birth, survival, death — and nothing else",
          body: "The grid is infinite, every cell is either alive or dead, and every cell looks at its eight neighbours. If a dead cell finds exactly three living neighbours around it, it flips on; if a living cell already has two or three live neighbours, it carries over to the next step. Any other case — too few neighbours, too many neighbours, no neighbours — kills the cell. The four animated demos below show each rule firing on a five-by-five grid.",
        },
        {
          pretitle: "Step two · From rules to motion",
          title: "The Glider walks",
          body: "A pattern of five cells, the Glider, is the smallest moving thing in Life. Watch it step. After four generations it has returned to its original shape but shifted one cell diagonally. That is how movement works in a world with no concept of motion: a shape that, after a few applications of the rules, equals itself somewhere else.",
        },
        {
          pretitle: "Step three · From motion to computation",
          title: "Gliders carry information",
          body: "If a glider moves, it can be aimed. If it can be aimed, it can collide with other gliders. From collisions you can build AND, OR, NOT — and from those, every Boolean circuit. People have built Turing machines, Game of Life simulators, and entire programmable computers entirely out of carefully arranged gliders. The Sandbox holds the Gosper Glider Gun preset: a pattern that fires a glider every thirty generations, forever.",
        },
        {
          pretitle: "Step four · What this tells us",
          title: "Complexity does not need complex rules",
          body: "The deeper claim is philosophical. Life shows that elaborate structure — motion, replication, computation, even consciousness, if you believe the strong versions — can sit inside a rule small enough to write on a postcard. It is the same lesson NAND offers for logic and Rule 110 for cellular automata. A small primitive, applied with discipline, is enough.",
        },
      ],
    },
    nand: {
      pretitle: "Topic · Logic",
      title: "The Sheffer Stroke",
      tagline: "One gate is enough for all of digital logic.",
      intro:
        "The NAND gate is the simplest computer hardware you can hold in your head. The Builder lets you swap between gates and watch their NAND skeleton update in real time.",
      ctaInteractive: "→ Open the Builder",
      sections: [
        {
          pretitle: "Step one · The gate",
          title: "Four lines, settled in 1913",
          body: "Henry Sheffer's stroke (a ↑ b) is the negation of AND. It outputs 1 unless both inputs are 1. Sheffer's 1913 paper showed that this single operator — together with constants and variables — can express any proposition of classical Boolean logic. Charles Sanders Peirce had quietly recorded the dual fact for NOR (↓) in an unpublished manuscript some thirty years earlier — both NAND and NOR are functionally complete, and the two arrived at their results independently.",
        },
        {
          pretitle: "Step two · Building everything else",
          title: "Same stone, many shapes",
          body: "The trick is composition. Feed NAND's output back into another NAND, sometimes wiring a copy of an input to itself, and the four classical gates fall out almost immediately. NOT is one NAND. AND is two. OR is three. XOR is four. Every other Boolean expression can then be assembled from these.",
        },
        {
          pretitle: "Step three · Why chips care",
          title: "A sea of NANDs in silicon",
          body: "CMOS transistors implement NAND with four transistors — fewer than AND or OR. Because every Boolean expression reduces to NANDs, chip designers often synthesise an entire circuit in nothing else: a row of identical NAND cells, wired into adders, multiplexers, memory, eventually a CPU. Every modern computer is, physically, the Sheffer stroke iterated a few billion times.",
        },
        {
          pretitle: "Step four · The other side",
          title: "NAND won the chip, NOR won the Moon",
          body: "NOR (¬(a ∨ b)) is the other functionally complete single gate. The Apollo Guidance Computer that landed humans on the Moon was built entirely from NOR gates. NAND won the consumer-chip race; NOR won the Moon. Two ways to build a universe — pick a side.",
        },
      ],
    },
    iota: {
      pretitle: "Topic · Computation",
      title: "The Iota Combinator",
      tagline: "One symbol, Turing-complete.",
      intro:
        "Iota is the simplest known one-combinator basis: a single rewrite rule from which every computable function follows. The Reducer reads any SKI or Iota expression and rewrites it, step by step, to its normal form.",
      ctaInteractive: "→ Open the Reducer",
      sections: [
        {
          pretitle: "Step one · Combinatory logic",
          title: "Two letters that compute everything",
          body: "In the 1920s Moses Schönfinkel and Haskell Curry showed that all of computation could be built from two tiny rules. Call them S and K. They take other things as input and rearrange them — no variables required. Together they form the SKI combinator calculus, which is provably as powerful as any lambda calculus, any programming language, any Turing machine.",
        },
        {
          pretitle: "Step two · One symbol",
          title: "Chris Barker's Iota",
          body: "In 2001 Chris Barker found a single combinator that contains both S and K. He called it Iota (ι, ℩) and defined it as ι x = x S K. From that single line, both S and K can be re-derived. Apply Iota to Iota in a specific pattern, and S falls out. A different pattern gives K. With nothing but the symbol ι and parentheses, any computable function can be expressed.",
        },
        {
          pretitle: "Step three · The shape of a proof",
          title: "Universality in a single symbol",
          body: "The argument is short. Iota's definition gives x S K when applied to x. Choose x cleverly — Iota again, applied to Iota, applied to Iota — and the unfolding strips off layers until just K remains. Choose another pattern, and only S remains. Since S and K together are Turing-complete (Schönfinkel, 1924), and Iota produces both, Iota alone must be too.",
        },
        {
          pretitle: "Step four · Why it matters",
          title: "A philosophical receipt",
          body: "Iota does not produce fast or readable programs — it produces existence proofs. Any algorithm that could be written in any language can be encoded as an Iota expression. The Reducer in the next room lets you type an expression and watch it rewrite, step by step, to its normal form (when one exists). It is computation at its most stripped down: a single symbol, a single rule, the whole of mathematics.",
        },
      ],
    },
    rule110: {
      pretitle: "Topic · Computation",
      title: "Rule 110",
      tagline: "An eight-bit rule, provably universal.",
      intro:
        "One byte of rule, applied to a row of bits, is enough to encode any computation. The Simulator lets you change rule, seed and speed live.",
      ctaInteractive: "→ Open the Simulator",
      sections: [
        {
          pretitle: "Step one · The setup",
          title: "A row of cells, one rule, repeat",
          body: "An elementary cellular automaton runs on a row of cells, each of which is black or white. The next generation is drawn underneath: each cell looks at itself and its two immediate neighbours — three cells — and decides its colour by a fixed rule. Eight possible neighbourhood patterns; for each, a single bit answer. Eight bits = one byte = one of 256 possible rules. Stephen Wolfram numbered them 0 to 255 in binary.",
        },
        {
          pretitle: "Step two · Reading rule 110",
          title: "Eight patterns, one byte",
          body: "Write the eight three-cell patterns in descending binary order: 111, 110, 101, …, 000. Below each pattern, write the next-generation value for the middle cell. Read the row of answers as a single binary number — for rule 110 it spells 01101110, which is 110 in decimal. The rule is just that byte.",
        },
        {
          pretitle: "Step three · One pixel grows a universe",
          title: "Start from a single dot",
          body: "Seed the top row with a single black cell, everything else white. Apply the rule; draw the next generation below. Repeat for a few hundred rows. With rule 110 the result is neither the boring all-black/all-white of rules like 0 or 255, nor the simple Sierpiński of rule 90 — it is a permanent moving traffic of triangular gliders against a striped background, layered into something that genuinely never settles.",
        },
        {
          pretitle: "Step four · The Cook proof",
          title: "It is, provably, a computer",
          body: "In the late 1990s Matthew Cook showed how to arrange specific glider patterns in rule 110 so that their collisions act as logic gates — and then how to assemble a working cyclic tag system, which is itself Turing-complete. The proof is intricate, but the consequence is clean: this eight-bit rule, applied to a row of bits, is universal. Whatever computation you can do, you can do it in rule 110.",
        },
      ],
    },
    logistic: {
      pretitle: "Topic · Chaos",
      title: "The Logistic Map",
      tagline: "An innocent formula where order tips into chaos.",
      intro:
        "A pocket-sized model for next year's population that, with one knob turned, becomes the most studied piece of chaos in mathematics. The Explorer lets you turn that knob in real time.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The formula",
          title: "A formula for tomorrow's population",
          body: "The 1845 logistic equation of Pierre-François Verhulst, sampled at discrete time, gives the map xₙ₊₁ = r · xₙ · (1 − xₙ). Read x as a fraction of carrying capacity between 0 and 1; r as the growth rate. The term (1 − x) is the brake — too many individuals starve the next generation. With 0 ≤ r ≤ 4 the iteration stays bounded.",
        },
        {
          pretitle: "Step two · From peace to chaos",
          title: "Doubling, doubling, gone",
          body: "For r below 1 every population dies out. From 1 up to 3 it settles to a single fixed point — a steady population. At r = 3 the fixed point loses stability and splits into a 2-cycle: this year up, next year down. At r ≈ 3.449 the 2-cycle becomes a 4-cycle, at r ≈ 3.544 an 8-cycle, and the doublings pile up faster and faster until r ≈ 3.56995, where the system finally falls into chaos.",
        },
        {
          pretitle: "Step three · Feigenbaum's universal constant",
          title: "A number that travels between systems",
          body: "Measure the ratio between the lengths of two successive doubling intervals. The number that comes out is δ ≈ 4.66920… — Mitchell Feigenbaum's constant. The astonishing fact is that the same constant appears in completely unrelated systems: the Hénon map, the Duffing oscillator, even experimental fluid convection. Period-doubling is a universal route to chaos, and δ is its fingerprint.",
        },
        {
          pretitle: "Step four · Islands of order",
          title: "Where calm hides inside the chaos",
          body: "Inside the chaotic regime the system suddenly settles back into a stable 3-cycle at r ≈ 1 + √8 ≈ 3.8284. From there it doubles again — period 6, 12, 24 — and re-enters chaos. The Li-Yorke theorem makes the punchline rigorous: 'period three implies chaos.' Robert May's 1976 paper, 'Simple mathematical models with very complicated dynamics', put the whole story in front of biologists. It hasn't left since.",
        },
      ],
    },
    lorenz: {
      pretitle: "Topic · Chaos",
      title: "The Lorenz Attractor",
      tagline: "Three lines of code, one butterfly.",
      intro:
        "A toy model of the atmosphere that accidentally invented chaos theory. The Explorer integrates the equations live and lets you watch the trajectory refuse to repeat.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · A toy atmosphere",
          title: "Lorenz, 1963",
          body: "Edward Lorenz, MIT meteorologist, was trying to simulate convection — air heated from below, cooled from above. Margaret Hamilton had programmed the earlier weather runs; Ellen Fetter ran the computations behind the three-equation model. He cut the problem down to three variables and three equations. The 1963 paper, 'Deterministic Nonperiodic Flow', argued that even this drastic simplification could behave unpredictably. The paper went largely unread for a decade.",
        },
        {
          pretitle: "Step two · The three equations",
          title: "Three coupled lines",
          body: "dx/dt = σ(y − x). dy/dt = x(ρ − z) − y. dz/dt = xy − βz. σ is the Prandtl number, ρ the Rayleigh number, β the geometric aspect ratio. The famous chaotic values are σ = 10, ρ = 28, β = 8/3, fixed by Lorenz himself. Change ρ and the system runs through a long catalogue of behaviours — fixed points, periodic orbits, transient chaos — before it reaches the canonical butterfly.",
        },
        {
          pretitle: "Step three · The butterfly",
          title: "An attractor in 3D",
          body: "Integrate forward in time and the trajectory loops around two unstable equilibria, jumping between them in a sequence that never repeats. The shape, in three dimensions, looks like a butterfly's wings — hence the name. The attractor is not a curve nor a surface; its Hausdorff dimension is about 2.06. It is a strange attractor: dense in itself, never closed, fractal at every scale.",
        },
        {
          pretitle: "Step four · Sensitive dependence",
          title: "Why weather forecasts have a horizon",
          body: "Take two starting points that differ by one part in a hundred thousand. After a short time the two trajectories are completely uncorrelated. Lorenz formalised this as sensitive dependence on initial conditions; the leading Lyapunov exponent is positive. In a 1972 lecture he asked whether 'a butterfly flapping its wings in Brazil might set off a tornado in Texas' — and gave the metaphor that defined the field. The reason weather forecasts decay after about two weeks is the same exponent, in the real atmosphere.",
        },
      ],
    },
    fourier: {
      pretitle: "Topic · Analysis",
      title: "The Fourier Transform",
      tagline: "Every signal is a sum of sine waves.",
      intro:
        "One of the deepest single facts in mathematics — and the silent engine of MP3, JPEG, Wi-Fi and MRI. The Explorer lets you add harmonics one at a time and watch a square wave appear out of pure sines.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · Fourier's claim",
          title: "Heat conduction, 1822",
          body: "Joseph Fourier published his 'Analytical Theory of Heat' in 1822. To solve the heat equation he made an outrageous-sounding claim: any function, continuous or jumpy, can be written as a sum of pure sines and cosines. The mathematicians of his day didn't believe him. It took half a century of refinement (Dirichlet, Riemann, Lebesgue) for the claim to settle into a theorem.",
        },
        {
          pretitle: "Step two · The recipe",
          title: "Sum of pure tones",
          body: "For a periodic function: a Fourier series — a sum over discrete frequencies. For an arbitrary integrable function: a Fourier transform f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — a continuous spectrum. Both say the same thing in different ways: a signal in time, however complicated, decomposes into pure oscillations. A chord becomes its notes. A photograph becomes its stripes.",
        },
        {
          pretitle: "Step three · Why your phone works",
          title: "Hidden inside MP3, JPEG, MRI, Wi-Fi",
          body: "Identify which frequencies matter; throw the others away; compress. MP3 keeps the audible bands and discards what the ear cannot hear. JPEG splits an image into 8×8 blocks and keeps the dominant spatial frequencies. MRI scanners physically measure frequency-space samples and inverse-Fourier-transform back to anatomy. Wi-Fi and 5G use OFDM, packing data onto thousands of carrier frequencies in parallel. The Cooley–Tukey FFT (1965) made all of this fast enough to be practical.",
        },
        {
          pretitle: "Step four · The uncertainty trade",
          title: "Sharper in time, blurrier in frequency",
          body: "Squeeze a signal into a narrow time window and its Fourier transform necessarily smears across many frequencies — and vice versa. This is not engineering; it is mathematics. The Gaussian function sits at the trade-off's optimum: it is its own Fourier transform. The same inequality, in physics, becomes Heisenberg's uncertainty principle. Time and frequency are dual coordinates; you cannot sharpen both at once.",
        },
      ],
    },
    euler: {
      pretitle: "Topic · Analysis",
      title: "Euler's Identity",
      tagline: "Five numbers, one line.",
      intro:
        "e^(iπ) + 1 = 0 — five constants from five different corners of mathematics, locked into a single equality. The Explorer next door lets you watch e^(iθ) sweep around the unit circle in real time, so you can see, with your own eyes, the moment at θ = π when the identity actually happens.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The five constants",
          title: "0, 1, e, i, π — five strangers in one room",
          body: "Each of the five numbers arrives from a different country. 0 is the additive identity — nothing. 1 is the multiplicative identity — unity. e ≈ 2.71828 is the natural rate of compound growth, born in calculus. i is the imaginary unit, defined by i² = −1, born in algebra trying to solve cubic equations. π ≈ 3.14159 is the ratio of a circle's circumference to its diameter, born in geometry. They normally never meet — and yet a single equation, six symbols long, ties all five together with nothing but +, ·, =, and exponentiation.",
        },
        {
          pretitle: "Step two · Euler's formula",
          title: "e^(iθ) = cos θ + i sin θ",
          body: "The identity is what Euler's formula gives back at one chosen angle, published in his 1748 Introductio in analysin infinitorum. For any real number θ, the formula says that e^(iθ) — an exponential with an imaginary exponent — equals cos θ + i sin θ. Geometrically: as θ grows, the point e^(iθ) walks counter-clockwise around the unit circle in the complex plane. Multiplying by e^(iθ) is rotation by angle θ. Growth and rotation, the two things e and i secretly do, turn out to be the same operation seen from two sides.",
        },
        {
          pretitle: "Step three · Substitute θ = π",
          title: "The one-line proof",
          body: "Set θ = π in Euler's formula. The right-hand side becomes cos π + i sin π = −1 + i·0 = −1. The left-hand side is e^(iπ). So e^(iπ) = −1, and adding 1 to both sides gives e^(iπ) + 1 = 0. Geometrically, that is a half-turn: starting at the point 1 on the unit circle and rotating by π radians — 180° — lands exactly at −1. The identity is the algebraic statement of that single, perfect half-turn.",
        },
        {
          pretitle: "Step four · The most beautiful equation",
          title: "Why mathematicians vote for it",
          body: 'Richard Feynman, aged fourteen, called Euler\'s formula "the most remarkable formula in mathematics" — "our jewel" — in his Lectures on Physics. A 1990 Mathematical Intelligencer poll named the identity the most beautiful theorem in mathematics; a 2004 Physics World reader poll ranked it alongside Maxwell\'s equations as the greatest equation ever. The appeal is that it uses each of the basic arithmetic operations exactly once (addition, multiplication, exponentiation), each of the basic constants exactly once (0, 1, e, i, π), and contains no extra clutter. Few equations are so short, and none so often quoted as proof that mathematics is beautiful.',
        },
      ],
    },
    banach: {
      pretitle: "Topic · Paradox",
      title: "The Banach–Tarski Paradox",
      tagline: "Cut a ball, end up with two.",
      intro:
        "A solid ball, split into a handful of pieces, can be reassembled into two solid balls each identical to the original — no stretching, no extra matter. The Explorer draws the engine behind the trick: the free group F₂ of two rotations, whose self-similar Cayley tree contains four shifted copies of itself. That branching structure is, almost literally, where the second ball comes from.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The statement",
          title: "One ball in, two balls out",
          body: "Take a solid ball B³ in three-dimensional space. The Banach–Tarski theorem (1924) says you can partition it into finitely many disjoint pieces — five suffices, and five is the minimum — apply rigid motions (rotations and translations) to those pieces, and end up with two disjoint solid balls, each congruent to the original. Nothing is stretched, deformed, or duplicated; the pieces are simply rearranged. The conclusion is, as a piece of pure mathematics, completely rigorous: B³ = B³ ⊔ B³.",
        },
        {
          pretitle: "Step two · The Axiom of Choice",
          title: "Where the strangeness enters",
          body: "The construction is impossible in ZF set theory alone. Banach and Tarski's proof needs the Axiom of Choice to pick one representative from each of uncountably many orbits of a rotation action on the sphere. That single use of Choice forces the pieces to be nonmeasurable: they have no well-defined volume in the Lebesgue sense, so the equation 'volume of one ball = volume of two balls' never gets written down. The pieces are not regions you could ever physically cut — they are dense, unmeasurable point clouds existing only as logical objects.",
        },
        {
          pretitle: "Step three · The free group of rotations",
          title: "F₂, generated by two rotations",
          body: "The heart of the proof is purely group-theoretic. Two suitably chosen rotations a and b of the unit sphere S² satisfy no relation other than the trivial ones: they generate a free group F₂ of rank 2 — every reduced word in a, a⁻¹, b, b⁻¹ acts as a different rotation. F₂ admits a paradoxical decomposition: it splits into four sets W(a), W(a⁻¹), W(b), W(b⁻¹) (words starting with each generator) plus the identity, and each shifted set covers the rest of the group. Push this through Hausdorff's 1914 sphere paradox, lift from S² to the solid ball, and the duplication on the group becomes a duplication of B³.",
        },
        {
          pretitle: "Step four · Why it doesn't break the world",
          title: "Nonmeasurable pieces, real-world atoms",
          body: "Lebesgue measure is countably additive on measurable sets; if the pieces were measurable, the volume of the two output balls would have to equal the volume of the input ball, contradicting itself. So the theorem politely tells you the pieces cannot be measurable — and indeed they aren't. The real world doesn't care: physical matter is finitely many atoms, not arbitrary subsets of ℝ³, and you can't perform a cut along a nonmeasurable boundary. The paradox lives entirely inside the continuum, where infinity has more room to manoeuvre than intuition allows.",
        },
      ],
    },
    lsystem: {
      pretitle: "Topic · Geometry",
      title: "L-Systems",
      tagline: "Letter-by-letter rewrites that grow into plants.",
      intro:
        "An L-system is a tiny grammar: a starting string, a few rewrite rules, and a turtle that turns letters into lines. In the Explorer you edit the axiom and the rules, slide the iteration depth, and watch the turtle draw the resulting fractal — Koch flakes, dragons, ferns, Hilbert curves — out of a handful of characters.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · A string and three rules",
          title: "Axiom, alphabet, rewrite",
          body: "An L-system has three pieces. An alphabet of symbols. An axiom — a starting string. A set of production rules, one per symbol, that say what each symbol becomes in the next generation. The defining trick is parallelism: at every step every symbol is rewritten simultaneously, the way every cell in a body divides at once. Aristid Lindenmayer, a Hungarian biologist at Utrecht, introduced the formalism in 1968 to model the cell-by-cell growth of algae and plants. In the simplest (context-free, deterministic) variant the rules look at one symbol at a time; context-sensitive versions look at neighbours; stochastic versions pick rules at random.",
        },
        {
          pretitle: "Step two · The turtle interpretation",
          title: "A virtual pen that grows the fractal",
          body: "Symbols on their own are just text. The geometry appears when you feed the string to a turtle: F means draw forward by one unit, G means draw forward too, + turns the heading left by a fixed angle, − turns right. Two more symbols stack and pop state: [ pushes the current position and heading onto a stack, ] pops them back. With just push and pop, a single 1-D string suddenly branches — the bracket pairs become twigs and side-stems. Symbols outside the drawing alphabet (X, Y, A, B …) are silent variables: they carry information forward through rewrites but the turtle ignores them.",
        },
        {
          pretitle: "Step three · Classic examples",
          title: "Four rules, four fractals",
          body: "Koch snowflake: axiom F++F++F, rule F → F−F++F−F, angle 60°. Four iterations and the triangle has crinkled into a snowflake. Dragon curve: axiom FX, rules X → X+YF+, Y → −FX−Y, angle 90°; after a dozen rewrites it folds into Heighway's dragon. Sierpiński arrowhead: A → B−A−B, B → A+B+A, angle 60°, alternates parity to sweep out the Sierpiński triangle. Fractal plant: X → F+[[X]−X]−F[−FX]+X, F → FF, angle 25° — Lindenmayer and Prusinkiewicz's canonical fern, branches and all. Same machinery, wildly different organisms.",
        },
        {
          pretitle: "Step four · Why botanists love them",
          title: "From a 1968 paper to every video-game forest",
          body: "Lindenmayer was not a mathematician chasing pretty pictures — he was a biologist trying to capture how a multicellular organism develops from one tip. L-systems gave botany its first formal grammar for growth: branching topology, internode lengths, leaf placement, all from a few rewriting rules. Przemyslaw Prusinkiewicz's 1990 book \"The Algorithmic Beauty of Plants\" turned the idea into a working pipeline, and from there it leaked into computer graphics. Most procedural trees in games and films, the ferns in Speedtree, the vegetation in Pixar shorts, the cities-of-pipes in demoscene productions — all descend from Lindenmayer's parallel rewrite. A grammar for cells became a grammar for worlds.",
        },
      ],
    },
    wang: {
      pretitle: "Topic · Computation",
      title: "Wang Tiles",
      tagline: "Squares with coloured edges that can encode any computation.",
      intro:
        "Hao Wang's 1961 puzzle — squares whose four coloured edges must match their neighbours — turned out to hide the halting problem inside a children's matching game. The Explorer lets you pick a tile set and watch the plane fill in, cell by cell, backtracking when no tile fits.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The rules",
          title: "Square tiles, four coloured edges, no rotation",
          body: "A Wang tile is a unit square whose four edges carry colours. You may place a tile only when each of its edges matches the colour of the edge it touches on the neighbouring tile — north against south, east against west. Tiles may not be rotated or reflected; the colour assignment is fixed. Given a finite set of such tiles, the question is whether you can use copies of them to tile the whole infinite plane.",
        },
        {
          pretitle: "Step two · Wang's conjecture and its disproof",
          title: "From an algorithm that should exist to one that cannot",
          body: "Hao Wang conjectured in 1961 that every finite set of tiles that can tile the plane must admit a periodic tiling — and from that he would have derived an algorithm to decide the Domino Problem (does a given set tile the plane at all?). In 1966 his student Robert Berger disproved both at once: he constructed an aperiodic set of 20,426 Wang tiles, and proved that the Domino Problem is undecidable. There is no algorithm that, given a tile set, can always decide whether it tiles the plane.",
        },
        {
          pretitle: "Step three · Computation in the tiling",
          title: "Encoding a Turing machine as a tile set",
          body: "Berger's trick was to translate the configurations of a Turing machine into Wang tiles, so that each valid row of tiles encodes one step of the machine and each valid column encodes the passage of time. A tiling of the upper half-plane then exists if and only if the machine never halts on its blank input — which is the halting problem, the canonical undecidable problem. The same construction shrank over the decades: Berger reduced his set to 104, Robinson to 56, and in 1996 Karel Culik II published the long-standing record of 13 aperiodic Wang tiles. Jeandel and Rao later proved the true minimum is 11.",
        },
        {
          pretitle: "Step four · Where they end up in the wild",
          title: "From undecidability to procedural texture",
          body: "Beyond the foundational drama, Wang tiles found a quiet second life in computer graphics. A small carefully chosen set lets a renderer tile a wall, a forest floor, or a terrain heightmap with no visible repeats — the matching constraints stitch chunks together without seams, far cheaper than generating a giant unique texture. They are close cousins of Penrose tilings and the quasicrystals Dan Shechtman discovered in 1982 (Nobel Prize 2011): all three are ways of forcing an infinite pattern that never quite repeats itself.",
        },
      ],
    },
    collatz: {
      pretitle: "Topic · Chaos",
      title: "The Collatz Conjecture",
      tagline: "If even, halve. If odd, triple and add one.",
      intro:
        "One of the simplest unsolved problems in mathematics: a four-word rule that nobody can prove always terminates. The Explorer below plots the hailstone trajectory of any starting number and grows the inverse coral — the backwards tree of all integers, rooted at 1.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The rule",
          title: "Two cases, one instruction",
          body: "Pick any positive integer n. If n is even, replace it with n/2. If n is odd, replace it with 3n + 1. Repeat. That is the whole rule. Try n = 7: it goes 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, and then loops 1 → 4 → 2 → 1 forever. Every starting point we have ever tested ends in that same little loop.",
        },
        {
          pretitle: "Step two · The conjecture",
          title: "Every road leads to 1",
          body: "Lothar Collatz proposed the conjecture in 1937, two years after his doctorate. The claim is breathtakingly simple: for every positive integer n, the iteration eventually reaches 1. It is also known as the Syracuse problem, Kakutani's problem, and the Ulam conjecture — multiple mathematicians stumbled onto the same beast independently. As of 2025 it has been verified by computer for every positive integer up to roughly 2.36 × 10²¹. Nobody knows why.",
        },
        {
          pretitle: "Step three · Records and surprises",
          title: "Hailstones over Syracuse",
          body: "The trajectories are nicknamed hailstone sequences because, like hail in a thundercloud, they rise and fall erratically before finally hitting the ground. The most famous small case is n = 27: it takes 111 steps to reach 1 and along the way it peaks at 9232 — about 340 times its starting value. Other notable seeds: n = 97 takes 118 steps; n = 871 takes 178 steps; n = 6171 takes 261 steps. Tiny inputs, wildly disproportionate orbits.",
        },
        {
          pretitle: "Step four · Why it resists",
          title: "A coral nobody can prune",
          body: "Paul Erdős, looking at it, shrugged: 'Mathematics may not be ready for such problems.' He offered $500 for a solution and the prize is still unclaimed. The deepest progress is Terence Tao's 2019 paper showing that almost all Collatz orbits attain almost bounded values — a probabilistic near-miss, not a proof. Run the rule backwards instead of forwards and the integers self-assemble into a single infinite tree rooted at 1, branching outward like coral. The Explorer next door grows that coral, and lets you drop any seed into the hailstorm.",
        },
      ],
    },
    doublependulum: {
      pretitle: "Topic · Chaos",
      title: "The Double Pendulum",
      tagline: "Two pendulums chained, total chaos.",
      intro:
        "A mechanical system simple enough to draw on a napkin and chaotic enough to outrun any forecast. The Explorer integrates the equations of motion in real time and lets you race two near-identical starts so you can watch them diverge for yourself.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The setup",
          title: "Two pendulums, one bob hanging from another",
          body: "Take a simple pendulum — a rigid massless rod of length L₁ with a bob of mass m₁ at its end, pivoting under gravity. Now attach a second rod of length L₂ with mass m₂ to the bob of the first. The configuration is described by just two angles, θ₁ and θ₂, measured from the vertical. Together with the angular velocities ω₁ = θ̇₁ and ω₂ = θ̇₂, that is the entire state: a point in a four-dimensional phase space, evolving deterministically under Newton.",
        },
        {
          pretitle: "Step two · The Lagrangian",
          title: "Kinetic minus potential, then crank Euler-Lagrange",
          body: "Write the kinetic energy T of both bobs and the potential energy V from gravity. The Lagrangian L = T − V comes out cleanly, but the equations of motion ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 produce two coupled, nonlinear, second-order ODEs for θ̈₁ and θ̈₂. The coupling is through sin(θ₁−θ₂) and cos(θ₁−θ₂) terms; the nonlinearity is unavoidable. No closed-form solution exists. To watch the system move you have to integrate numerically — and that is exactly what the Explorer does, step by step, with RK4.",
        },
        {
          pretitle: "Step three · Chaos",
          title: "Small energy: pretty. Large energy: unpredictable.",
          body: "At low energy the bobs swing gently and the motion is quasiperiodic — the trajectory winds around an invariant torus in phase space and never quite repeats but stays bounded and orderly. Push the energy higher and the system crosses into chaos: the largest Lyapunov exponent becomes positive, and two starts that differ by one part in a million separate completely within a few seconds. The double pendulum is the textbook physical demonstration of deterministic chaos — deterministic in the equations, unpredictable in practice.",
        },
        {
          pretitle: "Step four · Where it shows up",
          title: "Robots, walking, control theory, museums",
          body: "The same coupled-rotor equations describe two-link robotic arms (where chaos is something to suppress, not celebrate), the biomechanics of a swinging leg in human gait, and many compound oscillators in engineering. Control theorists use the double pendulum as a benchmark for stabilising unstable nonlinear systems — balancing it upright is a classic hard problem. And every good science museum has one swinging in a glass case, drawing a trace that visitors can never quite predict.",
        },
      ],
    },
    bzr: {
      pretitle: "Topic · Chaos",
      title: "The Belousov–Zhabotinsky Reaction",
      tagline: "A chemical clock that draws spirals.",
      intro:
        "A real chemical mixture that refuses to settle: it pulses through colours in a beaker and grows rotating spirals in a Petri dish. The Explorer simulates a 3-variable Oregonator-style reaction-diffusion grid so you can watch the same instability self-organise into waves.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The accidental discovery",
          title: "A reaction that should have been impossible",
          body: "In the early 1950s the Soviet chemist Boris Belousov, looking for an inorganic analogue of the Krebs cycle, mixed bromate, citric acid and a cerium catalyst — and watched the solution flip colour rhythmically, on and on. Reviewers rejected his paper: a chemical reaction visibly oscillating in time looked like a violation of the second law of thermodynamics. Belousov gave up publishing it. A decade later, in 1961, the graduate student Anatol Zhabotinsky picked the recipe up, swapped citric for malonic acid, and demonstrated the oscillations cleanly enough that the result could no longer be denied.",
        },
        {
          pretitle: "Step two · How it looks",
          title: "A clock in a beaker, spirals in a dish",
          body: "The modern recipe is bromate (BrO₃⁻) plus bromide, malonic acid as fuel, and a redox catalyst — cerium, or more visibly ferroin, in a sulphuric-acid bath. Stirred in a beaker, the solution flips colour at regular intervals (blue ↔ red with ferroin) like a chemical metronome. Poured into a thin Petri dish so that diffusion matters, the same recipe spontaneously grows rotating spiral waves and concentric target patterns over the course of minutes. Stir it and the pattern erases; leave it alone and a new one is drawn.",
        },
        {
          pretitle: "Step three · The Oregonator",
          title: "Three variables, one oscillation",
          body: "In 1972 Richard Field, Endre Körös and Richard Noyes — working at the University of Oregon — distilled the chemistry into the Oregonator: a 3-variable nonlinear ODE system tracking the key intermediates (HBrO₂, Br⁻, and the oxidised catalyst). It oscillates for exactly the reasons the beaker does. Add diffusion terms and the ODEs become reaction-diffusion PDEs; in the Tyson–Fife reduction the same model reproduces the spiral waves on a 2D sheet. The Explorer next door runs a discrete-cell cousin of this PDE that is cheap enough for a browser yet faithful enough to spiral.",
        },
        {
          pretitle: "Step four · Why it matters",
          title: "Chemistry that organises itself",
          body: "BZR was the experimental smoking gun that pushed chemistry away from equilibrium thinking. Far from equilibrium, matter does not just dissipate — it can spontaneously organise into structured patterns in space and time. Ilya Prigogine built the theory of these dissipative structures and was awarded the Nobel Prize in Chemistry in 1977 for it. Today BZR is the textbook example of non-equilibrium self-organisation, a sibling of Turing's morphogen patterns, and an ancestor of every reaction-diffusion model in biology, neuroscience and chemical engineering.",
        },
      ],
    },
    turingpattern: {
      pretitle: "Topic · Analysis",
      title: "Turing Patterns",
      tagline: "How leopards get their spots.",
      intro:
        "The Explorer simulates a Gray-Scott reaction-diffusion grid in real time: two virtual chemicals competing on a 200×200 lattice. Turn the feed and kill rate knobs and the field morphs continuously between spots, stripes, mazes and self-replicating coral.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · Turing's question",
          title: "Where do the patterns on an animal come from?",
          body: "A leopard embryo starts as a nearly uniform ball of cells. Somewhere along the way, regular spots appear on its coat — same spacing, same size, in the right places. The same problem shows up for zebra stripes, angelfish bands and the rings on a seashell. In 1952 Alan Turing published 'The Chemical Basis of Morphogenesis' and proposed a startling answer: the patterns are pure chemistry. Two diffusing substances with very different reach, reacting with each other, can spontaneously break symmetry and lay down a stable design on top of a uniform background.",
        },
        {
          pretitle: "Step two · The recipe",
          title: "Short-range activation, long-range inhibition",
          body: "Turing's mechanism takes two chemicals: an ACTIVATOR a that catalyses its own production and the production of an INHIBITOR b, plus the inhibitor itself, which destroys the activator. The crucial extra ingredient is diffusion: the inhibitor must spread much faster than the activator. A small fluctuation that raises a in one spot triggers a runaway local burst of activator — but it also produces inhibitor, which races outward and suppresses the activator in a wide ring around. That ring of suppression keeps the next burst at arm's length, and the burst-and-ring rhythm tiles the plane with regular spots, stripes or mazes.",
        },
        {
          pretitle: "Step three · One equation, many patterns",
          title: "The Gray-Scott phase diagram",
          body: "The standard playable form is the Gray-Scott model: ∂a/∂t = D_a∇²a − ab² + F(1 − a) and ∂b/∂t = D_b∇²b + ab² − (F + k)b. Just two knobs do the heavy lifting — F, the feed rate at which fresh activator is supplied, and k, the kill rate at which inhibitor decays. Pearson's 1993 paper mapped the (F, k) plane into a now-famous atlas of named regions: holes, spots, stripes, mitosis-like self-replicating dots, the unstable U-skate world, mazes, solitons and full chaos. The same two differential equations contain all of them; you just move the cursor.",
        },
        {
          pretitle: "Step four · The patterns are real",
          title: "From the test tube to the pufferfish",
          body: "For decades Turing's mechanism was a beautiful idea without an experiment. Then in 1990 the CIMA reactor (chlorite-iodide-malonic acid in a gel) produced the first laboratory Turing pattern in pure chemistry, with starch acting as the inhibitor's brake. Since then biologists have caught the same mechanism red-handed in living tissue: Akiyama and Tanaka in 2014 read the activator and inhibitor signals straight off the African pufferfish; Sheth and colleagues showed Turing dynamics setting mouse digit spacing; the same chemistry governs hair-follicle spacing, feather buds and seashell pigmentation. Coats, fingerprints, ridges — Turing's 1952 sketch, measured.",
        },
      ],
    },
    sierpinski: {
      pretitle: "Topic · Geometry",
      title: "The Sierpiński Triangle",
      tagline: "One fractal, four roads in.",
      intro:
        "Wacław Sierpiński described it in 1915, but the same triangular hole-in-a-hole pattern had already been carved into the floors of 13th-century Cosmatesque churches. The astonishing fact is that the shape arrives by at least four completely different routes — recursion, randomness, arithmetic, a one-line cellular automaton — and the Explorer lets you watch all four side by side.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · Recursive subdivision",
          title: "Cut the centre out, then recurse",
          body: "Take an equilateral triangle. Join the midpoints of its three sides; this divides it into four congruent smaller triangles. Remove the central one and keep the three corners. Now apply the same operation to each of those corners — and again, and again. After infinitely many steps you have the Sierpiński triangle: a self-similar set whose total area is zero and whose boundary has infinite length. Each round keeps three quarters of the previous area, so the limit is unavoidable.",
        },
        {
          pretitle: "Step two · The chaos game route",
          title: "Halfway, again and again",
          body: "Place three vertices in a triangle. Drop a point anywhere; then, repeatedly, choose one of the three vertices uniformly at random and jump halfway toward it. Plot every step. Within a few thousand jumps the cloud of points has resolved into the Sierpiński triangle — exactly, in the limit. Pure random play, no instructions about geometry, no memory: just a halving step and three targets. The fractal is what the random walk cannot help but trace.",
        },
        {
          pretitle: "Step three · Pascal's triangle mod 2",
          title: "Odd entries draw it for you",
          body: "Write out Pascal's triangle and colour every odd entry black, every even entry white. The result, row by row, is the Sierpiński triangle. The reason is Lucas's theorem: a binomial coefficient C(n, k) is odd exactly when the binary digits of k are a subset of the binary digits of n. So the black cells live where the bits of k fit inside the bits of n — and that condition, drawn in a triangle, is Sierpiński's pattern. Combinatorics and geometry land in the same place.",
        },
        {
          pretitle: "Step four · Rule 90 and the IFS",
          title: "One cell, one rule, the same shape",
          body: "Wolfram's elementary cellular automaton Rule 90 says: a cell's next state is the XOR of its two neighbours. Start a single black cell in an otherwise white row and step forward. Each new generation drawn beneath the last reproduces Sierpiński's triangle exactly. The deepest reading is that all four routes describe the same attractor: an iterated function system of three contraction maps, each with ratio 1/2, fixed at the three vertices. Whichever recipe you follow, you converge on the same fixed set — Hausdorff dimension log 3 / log 2 ≈ 1.585.",
        },
      ],
    },
    chaosgame: {
      pretitle: "Topic · Geometry",
      title: "The Chaos Game",
      tagline: "Roll a die, draw a fractal.",
      intro:
        "Place a few dots, pick one at random over and over, and walk halfway towards it — a rule that sounds like noise, but condenses into a perfect fractal after a few thousand steps. The Explorer animates the procedure live and lets you tune the number of vertices, the jump ratio and the rules that govern which vertex you may pick next.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The rule",
          title: "Three dots, a die, and one short step",
          body: "Place the vertices of a polygon. Pick any starting point — on, off, inside the polygon doesn't matter. Now roll a die to choose a vertex at random, walk a fixed fraction of the way from your current position towards it, and mark the new spot with a dot. Treat that dot as your new position and repeat. The rule has only two ingredients: a list of vertices and a jump ratio r. That is the whole chaos game, formalised by Michael Barnsley in his 1988 work on iterated function systems.",
        },
        {
          pretitle: "Step two · From randomness, the Sierpiński triangle",
          title: "The right ratio for every polygon",
          body: "On an equilateral triangle with jump ratio r = 1/2 the dots condense into the Sierpiński triangle — after a short warm-up no point can ever land in the central holes. For a regular n-gon there is a magic ratio rₙ = 1 / (1 + 2·cos(π/n)) that gives a clean self-similar fractal. The table below collects the values for n = 3 to 8: notice that the triangle's 1/2 and the pentagon's 1/(1 + φ) = 1/φ² ≈ 0.382 fall straight out of the same formula. Use a different ratio and the picture either over- or under-laps until the fractal smears away.",
        },
        {
          pretitle: "Step three · Other shapes from other rules",
          title: "Squares, restrictions, and Barnsley's fern",
          body: "On a square with r = 1/2 the rule fails: the dots fill the interior uniformly and no fractal appears. The fix is a restriction rule — for example, forbid the same vertex twice in a row, or forbid the vertex one step round from the previous one — and a delicate fractal returns. Push the idea further and the vertices vanish entirely: Barnsley's fern is the chaos game with four affine transformations chosen by weighted dice (probabilities 0.01, 0.85, 0.07, 0.07), and out of that randomness grows a botanically convincing leaf.",
        },
        {
          pretitle: "Step four · Why it works",
          title: "Attractors of iterated function systems",
          body: "Each available move — \"jump halfway to vertex i\" — is a contraction map on the plane. A finite set of such contractions is an Iterated Function System (IFS), and Barnsley's theorem guarantees a unique compact attractor: the fixed point of the whole system. The chaos game samples that attractor by picking maps at random, and Hutchinson's theorem says the sampled dots, with probability one, become dense in it. You could draw the same picture deterministically by applying every map to every shape — the random walk is just the cheap, beautiful way in.",
        },
      ],
    },
    penrose: {
      pretitle: "Topic · Geometry",
      title: "Penrose Tilings",
      tagline: "Tiles that cover the plane and never repeat.",
      intro:
        "Two tile shapes are enough to cover an infinite plane with a pattern that never quite repeats itself. The Explorer grows P3 (two rhombi) or P2 (kite + dart) tilings by inflation; you set the depth, the seed rotation, and watch a perfectly aperiodic geometry assemble itself.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · Two tiles, never repeating",
          title: "Penrose, 1974",
          body: "Roger Penrose introduced his first aperiodic tiling (P1) in 1974, using six prototiles built around the pentagon. He quickly trimmed the set down to two: the kite + dart pair (P2), and the two-rhombi pair (P3) — a thin rhombus with angles 36°/144° and a thick rhombus with angles 72°/108°. Each tile carries Conway's matching rules — colored arrows or notches on the edges that fix which tiles may sit next to which. Without them you could tile periodically with kites and darts; with them, every legal tiling is forced to be aperiodic.",
        },
        {
          pretitle: "Step two · Five-fold symmetry",
          title: "A forbidden symmetry",
          body: "Every angle in the tiling is a multiple of 36° — the interior angle of a regular pentagon. Around special vertices the pattern has perfect five-fold rotational symmetry, the same kind a pentagon has. Classical crystallography proves that no periodic tiling of the plane can have five-fold symmetry: only 2-, 3-, 4-, and 6-fold rotations are compatible with a lattice. Penrose's tilings sidestep the theorem by refusing to be periodic in the first place. The surprise is that you can still have local five-fold order without ever closing into a repeating cell.",
        },
        {
          pretitle: "Step three · The golden ratio is built in",
          title: "φ = (1 + √5) / 2",
          body: "Count the tiles in any large patch and you find the golden ratio waiting. The number of kites divided by the number of darts converges to φ = (1+√5)/2 ≈ 1.618; the same for thick rhombi divided by thin rhombi. The side-length ratios inside the Robinson triangles that build each rhombus are 1 : φ, and the inflation rule that grows the tiling scales lengths by φ at every step. The tiling is, in a precise sense, the golden ratio rendered as a pattern in the plane.",
        },
        {
          pretitle: "Step four · Quasicrystals",
          title: "Shechtman, 1982",
          body: 'In April 1982 Dan Shechtman shot an electron beam at a rapidly cooled aluminium-manganese alloy and saw a diffraction pattern with sharp five-fold symmetry — a thing every textbook said could not exist. Linus Pauling famously ridiculed him for years ("there is no such thing as quasicrystals, only quasi-scientists"). The Penrose tiling was the existing piece of paper-mathematics that proved it could: a long-range-ordered, five-fold-symmetric, aperiodic pattern. Shechtman was vindicated with the 2011 Nobel Prize in Chemistry, and Penrose tilings became the canonical two-dimensional model for what we now call quasicrystals.',
        },
      ],
    },
    apollonian: {
      pretitle: "Topic · Geometry",
      title: "Apollonian Circle Packing",
      tagline: "Circles inside circles inside circles.",
      intro:
        "Start with three mutually tangent circles and a rule for what counts as tangent. The Explorer recursively fills every curved triangular gap with a new circle, then fills the smaller gaps in turn — pick the starting curvatures and watch a gasket emerge that is fractal forever.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The starting position",
          title: "Three circles touching",
          body: "Draw three circles in the plane, each one tangent to the other two — they touch at three points and enclose a curved triangular gap. Around 200 BC, Apollonius of Perga posed the natural follow-up: which circles are tangent to all three given circles at once? For a triple of mutually tangent circles there are exactly two answers — one small circle inscribed inside the curved gap, and one big circle that circumscribes all three. Both of those new circles join the original three to form a quadruple of mutually tangent circles. That quadruple is the seed of everything that follows.",
        },
        {
          pretitle: "Step two · Descartes' theorem",
          title: "Curvatures, locked in algebra",
          body: "Write each circle's curvature as k = 1/r, with one convention: if a circle encloses the others (the outer one), take its curvature negative. Writing to his correspondent Princess Elisabeth of Bohemia in 1643, Descartes proved that for any four mutually tangent circles the curvatures satisfy (k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²). Solving the quadratic for the fourth curvature gives k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). The two signs are exactly Apollonius' two answers: the + sign yields the small inscribed circle, the − sign yields the other tangent circle on the opposite side.",
        },
        {
          pretitle: "Step three · Recursive filling",
          title: "Every gap is a new seed",
          body: "Once the seed quadruple is in place, every curved triangular gap is itself bounded by three mutually tangent circles — exactly the configuration we started from. Drop the inscribed circle into each gap using the + sign of Descartes' formula. That circle splits its old gap into three new, smaller curved triangles, and the process recurses. Continue forever and the union of all circles you have drawn is the Apollonian gasket. The leftover dust has Lebesgue measure zero, but Hausdorff dimension about 1.3056867 — a true fractal, between a curve and a surface.",
        },
        {
          pretitle: "Step four · The integer surprise",
          title: "When every curvature is a whole number",
          body: "Choose the four seed curvatures (k₁, k₂, k₃, k₄) to be integers. Then Descartes' formula k₄ = k₁+k₂+k₃ ± 2√(…) forces every subsequent curvature to be an integer as well — the square root collapses thanks to (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²), and each new circle inherits the integrality of its parents. The packing (−1, 2, 2, 3) fills with curvatures 6, 11, 14, 15, 18, 23, … and every other integer Apollonian packing — (−2, 3, 6, 7), (−3, 5, 8, 8), (−4, 8, 9, 9), (−6, 11, 14, 15) — does the same. Which integers appear, and which never do, is an open question in arithmetic geometry: a hidden number-theoretic skeleton, sitting inside a picture of circles.",
        },
      ],
    },
    phi: {
      pretitle: "Topic · Geometry",
      title: "Golden Ratio & Fibonacci",
      tagline: "One simple recurrence. The ratio that hides everywhere.",
      intro:
        "The Explorer follows the Fibonacci sequence as its consecutive ratios close in on φ, draws the golden spiral built from nested Fibonacci squares, and lets you tilt the sunflower phyllotaxis pattern by the golden angle. Three views, one number — and the difference between where φ really shows up and where the infographics oversell it.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The defining equation",
          title: "A number equal to its own square minus one",
          body: "Solve φ² = φ + 1. The positive root is φ = (1 + √5) / 2 ≈ 1.6180339887. That single equation contains nearly everything: divide both sides by φ and you get φ = 1 + 1/φ, so 1/φ = φ − 1 ≈ 0.6180339887. The reciprocal is the original minus one — a property no other positive number has. The negative root is ψ = (1 − √5)/2 ≈ −0.6180, and the pair (φ, ψ) is the engine behind every Fibonacci identity below.",
        },
        {
          pretitle: "Step two · Fibonacci",
          title: "Add the last two, forever",
          body: "Start with F₀ = 0, F₁ = 1, then iterate Fₙ₊₁ = Fₙ + Fₙ₋₁: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … . Take the ratio of consecutive terms — 1, 2, 1.5, 1.667, 1.6, 1.625, 1.615, 1.619 — and it homes in on φ. Binet's closed form makes that limit exact: Fₙ = (φⁿ − ψⁿ)/√5. Because |ψ| < 1, the ψⁿ term decays away and Fₙ ends up rounding-close to φⁿ/√5 for every n.",
        },
        {
          pretitle: "Step three · The golden angle and sunflowers",
          title: "Why a sunflower turns by 137.508° per seed",
          body: "Take a disk, place seeds one after another, and rotate by a fixed angle between each. Vogel's model puts seed n at radius rₙ = c√n (so the area per seed is constant) and angle θₙ = n · α. Choose α = 360°/φ² ≈ 137.508° — the golden angle — and the seeds pack densely with no gaps and no preferred direction. Any rational fraction of a turn would line up after a few rotations and leave radial gaps; φ is the worst-approximable irrational, so the pattern never repeats. Sunflowers, pinecones, Romanesco broccoli and the leaves of many plants use exactly this trick.",
        },
        {
          pretitle: "Step four · Healthy skepticism",
          title: "Where φ really is — and where it isn't",
          body: "φ does not govern the Parthenon, the Mona Lisa, or the Nautilus shell, despite countless infographics; those fits are dubious at best and confirmation bias at worst. Where φ honestly appears is in growth and optimization: phyllotaxis (above), continued-fraction theory (φ = [1; 1, 1, 1, …] makes it the slowest-converging — the “most irrational” — number), and the geometry of Penrose tilings and quasicrystals, whose long-range order is built from φ. Real, beautiful, and narrower than the posters suggest.",
        },
      ],
    },
    buffon: {
      pretitle: "Topic · Analysis",
      title: "Buffon's Needle",
      tagline: "Drop sticks on lined paper. π falls out.",
      intro:
        "Georges-Louis Leclerc, Comte de Buffon, asked the question in 1733 and published it in 1777: drop a needle on a floor of parallel lines and count the crossings. The ratio gives back π — a constant from circles emerging out of straight needles on straight wood. The Explorer simulates the drops live and lets you watch the estimate creep towards π = 3.14159…",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The setup",
          title: "Parallel lines and a needle",
          body: "Rule a floor with parallel lines a distance d apart. Take a needle of length ℓ, with ℓ ≤ d, and drop it from above so that its centre lands at a uniform random position and its angle is uniform on [0, π]. The needle either crosses one of the lines or it doesn't. That is the whole setup — two parameters, one yes/no question, repeated a great many times.",
        },
        {
          pretitle: "Step two · The probability",
          title: "Why π shows up",
          body: "Integrate over the centre's vertical offset and the angle θ, and the probability the needle crosses a line works out to exactly P = 2ℓ / (πd). Rearrange: π = 2ℓn / (d·k), where n is the total number of needles dropped and k is the number that crossed a line. π emerges from straight needles falling on straight lines because the angle θ averages a sine — and a sine, integrated over a half-circle, secretly carries π.",
        },
        {
          pretitle: "Step three · Slow convergence",
          title: "Lazzarini's suspicious six digits",
          body: "Monte Carlo error decays as 1/√n. To pin down three decimal places of π you need on the order of 10⁵ needles, and even ten million is far from enough for high precision. In 1901 the Italian mathematician Mario Lazzarini reported π ≈ 3.1415929 from only 3408 throws — six correct digits, suspiciously close to the well-known approximation 355/113. He almost certainly stopped at the lucky moment, or arranged the experiment to land there. The convergence is genuinely slow; Lazzarini's number is too pretty to be honest.",
        },
        {
          pretitle: "Step four · Buffon's noodle",
          title: "Length is all that matters",
          body: "The same calculation works for ℓ > d, where multiple crossings per throw become possible and the closed-form is more elaborate. More striking is Buffon's noodle: take any planar curve C of length L, however twisted or kinked, and drop it on the same lined floor. The expected number of crossings is 2L / (πd), regardless of the shape. Straight needle or wriggling noodle: only the length counts. The same π, hiding in any curve at all.",
        },
      ],
    },
    hilberthotel: {
      pretitle: "Topic · Paradox",
      title: "Hilbert's Hotel",
      tagline: "Always room for one more — even when full.",
      intro:
        "David Hilbert sketched the hotel in a 1924 lecture and George Gamow carried it to the public in his 1947 book One, Two, Three… Infinity. The Explorer animates the four classical scenarios — one guest, k guests, ℵ₀ guests, and ℵ₀ buses of ℵ₀ guests — and shows that an already-full infinite hotel can absorb them all.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · Imagine the hotel",
          title: "Infinitely many rooms, every one occupied",
          body: "The hotel has a room for every counting number: 1, 2, 3, and on forever. Tonight every single room is taken — a guest in 1, a guest in 2, a guest in 17, a guest in 10¹⁰⁰. Common sense calls this 'full': there is no room without a guest. Mathematics disagrees, because 'full' is a finite idea and the room set here is countably infinite. The cardinality of the guests is ℵ₀, and ℵ₀ is not a number — it is the size of the natural numbers.",
        },
        {
          pretitle: "Step two · One new guest",
          title: "Shift n → n+1 and room 1 falls vacant",
          body: "A traveller knocks. The manager broadcasts a single instruction: every guest, move from room n to room n+1. The guest in 1 goes to 2, the guest in 2 goes to 3, and so on; nobody is displaced because there is always a higher-numbered room waiting. After the shift, room 1 is empty and the newcomer checks in. The 'full' hotel was never full in the finite sense — it had ℵ₀ + 1 = ℵ₀ all along.",
        },
        {
          pretitle: "Step three · Infinitely many new guests",
          title: "Send guest n to room 2n; every odd room opens",
          body: "Now a countably infinite queue arrives. The manager asks every existing guest in room n to move to room 2n. Guest 1 walks to room 2, guest 2 to room 4, guest 3 to room 6 — every even room stays occupied and every odd room becomes free. The newcomers fill 1, 3, 5, 7, … in order, and everyone has a key. This is the equality ℵ₀ + ℵ₀ = ℵ₀: two copies of the naturals fit inside one copy without loss.",
        },
        {
          pretitle: "Step four · Infinite buses, infinitely many passengers each",
          title: "Prime powers absorb ℵ₀ × ℵ₀",
          body: "A fleet of countably infinitely many buses pulls up, each carrying countably infinitely many passengers. Send each existing guest from room n to room 2ⁿ — they occupy the powers of two. For bus k (k = 1, 2, 3, …), let pₖ be the k-th odd prime (3, 5, 7, 11, 13, …) and send passenger m to room pₖᵐ. Bus 1 lands on 3, 9, 27, 81, …; bus 2 on 5, 25, 125, …; bus 3 on 7, 49, …. By the fundamental theorem of arithmetic every prime power is unique, so no two guests collide. ℵ₀ × ℵ₀ = ℵ₀.",
        },
      ],
    },
    gabrielshorn: {
      pretitle: "Topic · Paradox",
      title: "Gabriel's Horn",
      tagline: "Finite volume, infinite surface.",
      intro:
        "A shape from 1641 that swallowed every intuition mathematicians had about infinity. The Explorer cuts the horn off at a variable x, draws the side view, and computes the volume and the surface area live — watch one stay tame and the other run away.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The shape",
          title: "Rotate y = 1/x around the axis",
          body: "Take the curve y = 1/x for x ≥ 1 and spin it around the x-axis. The result is a slender horn that flares out near x = 1 and tapers forever toward zero radius as x grows. Each cross-section perpendicular to the axis is a disc of radius 1/x. The horn extends infinitely far to the right, yet at every point its width is shrinking. Evangelista Torricelli described the figure in 1641 — three decades before Newton and Leibniz had calculus to lean on.",
        },
        {
          pretitle: "Step two · Compute the volume",
          title: "V = π — exactly",
          body: "Slice the horn into discs of thickness dx and radius 1/x. The volume of each disc is π · (1/x)² · dx. Add them all up from 1 to infinity: V = π ∫₁^∞ (1/x)² dx = π · [−1/x]₁^∞ = π. Finite. The whole infinite horn could be filled to the brim with exactly π cubic units of paint. The convergent integral ∫ 1/x² dx is what keeps it bounded — the squares vanish fast enough for the sum to settle.",
        },
        {
          pretitle: "Step three · Compute the surface",
          title: "A = ∞ — exactly",
          body: "The lateral surface area is A = 2π ∫₁^∞ (1/x) · √(1 + 1/x⁴) dx. The square-root factor is always at least 1, so A ≥ 2π ∫₁^∞ (1/x) dx = 2π · [ln x]₁^∞. That is the harmonic integral, and it diverges. No matter how far you walk along the horn you keep adding lateral area, and the total never stops growing. The surface is infinite — no finite amount of paint will cover it.",
        },
        {
          pretitle: "Step four · The painter's paradox",
          title: "Fill it; never paint it",
          body: "So here is the riddle: pour in π units of paint and the horn is full — including its inside wall. Yet to coat the outside you would need infinitely much. Torricelli found the result counter-intuitive even before calculus existed to name the trick. The modern resolution is that 'painting' assumes a coat of nonzero thickness ε, which over an infinite surface needs infinite volume. Drop that assumption and the paradox dissolves: the mathematical 'paint' inside has zero thickness on the wall, and the inside wall is the same infinite surface as the outside. The name comes later — the horn of the archangel Gabriel, sounded to announce judgement day.",
        },
      ],
    },
    cantor: {
      pretitle: "Topic · Paradox",
      title: "Cantor's Diagonal Argument",
      tagline: "Infinity comes in sizes.",
      intro:
        "Georg Cantor's 1891 diagonal argument is the cleanest proof in mathematics that some infinities are larger than others. The Explorer animates the construction live: pick any listing of decimals in [0,1] and watch a new real number step out of the diagonal — one that cannot be on your list, no matter how cleverly you ordered it.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · Setting up the impossible",
          title: "Assume the reals can be listed",
          body: "Cantor's proof is by contradiction. Assume the real numbers between 0 and 1 are countable — that is, they can be arranged in an infinite sequence r₁, r₂, r₃, …, with every real appearing somewhere on the list. Notice we never say which order: the argument has to work for any ordering you can possibly invent. If we can find one real that the listing missed, the assumption that any such complete listing exists is dead.",
        },
        {
          pretitle: "Step two · Reading the diagonal",
          title: "A digit at a time, down the staircase",
          body: "Write each rₙ as a decimal expansion 0.d_{n,1} d_{n,2} d_{n,3} …, so d_{n,k} is the k-th digit of the n-th real. Now read straight down the diagonal: d_{1,1}, then d_{2,2}, then d_{3,3}, and so on. Build a new number s = 0.s₁ s₂ s₃ … by choosing each digit sₙ to differ from d_{n,n}. A safe recipe is to swap 5 ↔ 6 (any rule that avoids 0 and 9 sidesteps the 0.999… = 1.000… ambiguity).",
        },
        {
          pretitle: "Step three · Why s is missing",
          title: "Different in the n-th digit, every time",
          body: "By construction s differs from r₁ in the first decimal place, from r₂ in the second, from r₃ in the third — from rₙ in the n-th, for every n. So s cannot equal any rₙ on the list. Yet s is a perfectly good real number in [0, 1]. The list was supposed to contain every such real, and here is one it missed. The assumption collapses: no enumeration of the reals can ever be complete. Even the sliver [0, 1] holds strictly more numbers than ℕ can index.",
        },
        {
          pretitle: "Step four · A new kind of infinity",
          title: "Continuum, halting, Gödel — same diagonal",
          body: "The reals have cardinality strictly greater than the naturals: |ℝ| = 2^ℵ₀ = c > ℵ₀. The same diagonal trick fuels Turing's proof that the halting problem is undecidable, and Gödel's first incompleteness theorem — both build a sentence that disagrees with every entry on a list of candidates. Cantor then asked whether any cardinality lives strictly between ℵ₀ and c. This is the continuum hypothesis. Gödel (1940) and Cohen (1963) showed together that it is independent of ZFC: assume it true and the axioms stay consistent; assume it false and the axioms stay consistent. Mathematics, on this point, leaves the door open.",
        },
      ],
    },
    boids: {
      pretitle: "Topic · Computation",
      title: "Boids",
      tagline: "Three local rules. A whole flock.",
      intro:
        "Craig Reynolds gave each simulated bird three small instincts in 1986 and let them loose — no leader, no global plan, no shared map. From those three local urges, a flock emerged. The Explorer lets you tune the three rules in real time and watch the whole choreography ripple out.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The agent",
          title: "A dot with a heading",
          body: "Every boid is a tiny moving point: it has a position and a velocity. That is the entire memory each agent carries. It cannot see the whole flock — only the handful of neighbours within a small perception radius. There is no map, no leader to follow, no message passing between agents. Just a position, a velocity, and what is within sight.",
        },
        {
          pretitle: "Step two · The three rules",
          title: "Separation, alignment, cohesion",
          body: "Each frame, every boid computes three small steering vectors from the neighbours inside its perception radius. SEPARATION: steer away from any boid that has come too close, weighted by how close. ALIGNMENT: nudge your velocity toward the average velocity of your neighbours. COHESION: steer toward the centre of mass of the neighbours you can see. The three vectors are summed with weights and added to the velocity each frame. That is the whole algorithm.",
        },
        {
          pretitle: "Step three · Emergence",
          title: "No leader, no plan, no chat",
          body: "Starting from random positions and random headings, the boids organise themselves into tight flocks within a few seconds. Streams form, split around obstacles, and re-merge — exactly the choreography of real starling murmurations, sardine bait balls, and bat swarms. Nothing in the program knows about flocks. The flock is what the three rules look like from outside. It is one of the cleanest demonstrations of emergence in all of computer science.",
        },
        {
          pretitle: "Step four · Where it ends up",
          title: "From SIGGRAPH 1987 to the night sky",
          body: "Reynolds called the agents boids — short for bird-oid object — and presented the paper 'Flocks, Herds, and Schools: A Distributed Behavioral Model' at SIGGRAPH 1987. Within five years his algorithm was animating the bat swarm in Batman Returns (1992) and the wildebeest stampede in The Lion King (1994). Today the same three rules drive evacuation simulations, robotic swarm research, and the choreography of Intel's 1000-drone light shows. The flocking model is a sibling of particle swarm optimisation — the same insight, repurposed for search.",
        },
      ],
    },
    aizawa: {
      pretitle: "Topic · Chaos",
      title: "The Aizawa Attractor",
      tagline: "Lorenz's stranger, weirder cousin.",
      intro:
        "Three coupled differential equations drag a single point through 3D space. Unlike Lorenz's butterfly, the trajectory here folds itself into a knotted, basket-handled torus with a vertical spike through its heart — one of the most visually distinctive strange attractors in chaos theory.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The equations",
          title: "Three equations, seven parameters",
          body: "ẋ = (z − b)·x − d·y · ẏ = d·x + (z − b)·y · ż = c + a·z − z³/3 − (x² + y²)·(1 + e·z) + f·z·x³. Pick any starting point. Integrate forward in time using a small step (Euler's method works; Runge–Kutta is better). The point traces a curve in space. Run for thousands of steps and the curve loops back to within an arm's length of itself, then peels off — never repeating exactly, always staying within a bounded region. That is the strange attractor.",
        },
        {
          pretitle: "Step two · The default geometry",
          title: "Vase, basket, spike",
          body: "With Aizawa's classical parameters (a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1), the trajectory winds around a torus in the lower half of the figure, then loops up through a thin vertical neck and back down into the torus on the opposite side. The result looks like a fluted vase with a thread running through it. From the right angle it looks like a basket. From another it looks like a heart with a spike. The visual is part of why the Aizawa attractor escaped textbooks: it photographs better than any of the others.",
        },
        {
          pretitle: "Step three · Tuning the dials",
          title: "Sensitive geometry",
          body: "Aizawa is more parameter-rich than Lorenz, which gives it more sensitivity to tuning. Decrease the parameter c by 0.1 and the spike retracts into the basket. Increase d and the loops below become tighter, denser, like a tighter weave. Some parameter combinations collapse onto a limit cycle (no chaos any more); others blow up to infinity. The chaotic regime is a narrow band of parameter space, and the geometry inside that band morphs continuously as you slide the dials.",
        },
        {
          pretitle: "Step four · A small family",
          title: "Rössler, Thomas, and friends",
          body: "Aizawa is one entry in a small family of three-equation strange attractors discovered through the 1970s and 1980s. Rössler (1976) is simpler still — just a single nonlinear term, and the trajectory is a flat spiral with a folding twist, like a Möbius rosette. Thomas's cyclically-symmetric attractor uses only sine functions and produces a tangle of cubes connected by chaotic threads. All three live in 3D with continuous trajectories — no time-step, no grid, no discretisation, only mathematics dragging a point along.",
        },
      ],
    },
    dla: {
      pretitle: "Topic · Chaos",
      title: "Diffusion-Limited Aggregation",
      tagline: "Random walkers freeze on touch — and grow corals.",
      intro:
        "One seed pixel. A swarm of particles, each on its own random walk. The moment a wandering particle bumps into the cluster, it sticks forever. Repeat ten thousand times and a branching dendrite blooms out of nothing — the same shape that copper takes when electroplated, that lichen takes on a wall, that lightning leaves on bare skin.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The setup",
          title: "A seed and a fog of walkers",
          body: "Pixel-grid playground. Place a single black pixel in the middle: the seed. Now release a particle at a random spot far away from the seed. The particle performs a random walk — each step picks one of four directions uniformly — and continues until it either lands next to the cluster (and becomes part of it) or wanders too far away (and is forgotten). Release the next particle. And the next. Ten thousand particles in, you have a picture.",
        },
        {
          pretitle: "Step two · The sticking rule",
          title: "Touch = freeze, forever",
          body: "There is one rule. A walking particle that becomes adjacent to any pixel of the cluster turns into a cluster pixel itself, and stops moving. That's the whole physics. The reason the structure is branchy and not blobby is geometric: a wandering walker is far more likely to be intercepted by an exposed tip of the cluster than to thread its way down into a deep fjord. Tips grow faster than valleys. Branches form. The interior is starved of new arrivals.",
        },
        {
          pretitle: "Step three · The fractal dimension",
          title: "1.71 — independent of the seed",
          body: "Witten and Sander published the model in 1981 and showed numerically that on a 2D lattice the resulting cluster has fractal dimension ≈ 1.71. That's strictly between a curve (dimension 1) and a filled region (dimension 2), and — crucially — it does not depend on the seed shape, the lattice type, or the spawn radius. Different physical processes that look superficially nothing alike yield exactly the same dimension. The number is universal in the same sense that π is.",
        },
        {
          pretitle: "Step four · Where it appears",
          title: "Copper, lightning, lichen, neurons",
          body: "Replace the abstract walkers with copper ions in a sulfate solution and turn on a current; the metal deposits onto the cathode in the same dendritic pattern. Replace them with electrons leaking through a dielectric and you get a Lichtenberg figure — the lightning-shaped scar that high voltage leaves on wood, on acrylic, or on a struck human body. Replace them with airborne spores landing on a tree and you get the silhouette of a lichen colony. Whenever diffusion bumps into something irreversibly sticky, you can predict the picture from one rule.",
        },
      ],
    },
    langton: {
      pretitle: "Topic · Computation",
      title: "Langton's Ant",
      tagline: "Two rules · ten thousand steps · a highway.",
      intro:
        "Place a single ant on an infinite grid of white squares. Two rules tell her what to do. For the first ten thousand steps the trail looks like chaos. Then — without warning — she switches into a perfectly periodic 104-step pattern that walks off to infinity. Two rules, an unexplained emergent miracle.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The rules",
          title: "Two lines is the whole program",
          body: "There is one ant facing one of four directions, on an infinite square grid where every cell is either white or black. Each tick: look at the cell you are standing on. If it is WHITE: flip it to black, turn 90° clockwise, step forward one cell. If it is BLACK: flip it to white, turn 90° counter-clockwise, step forward one cell. That is the complete specification — Christopher Langton wrote it down in 1986. There is no random number, no neighbourhood look-up, no parameters. Two lines.",
        },
        {
          pretitle: "Step two · Three regimes",
          title: "Simple symmetry, then chaos, then…",
          body: "Run the ant from a blank grid and watch. For about 100 steps the trail is small and bilaterally symmetric — the rules are deterministic, the start is empty, the pattern has to respect both axes. Around step 500 the symmetry shatters and the trail looks essentially random: a tangle of black squares with no structure visible at any scale. That phase lasts roughly ten thousand steps and frustrated researchers for nearly a decade. Then the third regime begins.",
        },
        {
          pretitle: "Step three · The highway",
          title: "A 104-step loop, drifting forever",
          body: "Somewhere around step 10,000 — the exact moment depends on the initial bit pattern but it's always near there — the ant locks into a repeating 104-step cycle that translates her two cells diagonally each loop. From the outside it looks like she's laying down a tidy striped 'highway' off into the corner. She will follow it, undisturbed, forever. Bunimovich and Troubetzkoy proved in 1992 that no matter what finite arrangement of black cells you start with, the ant's trajectory is always unbounded — she can't be trapped. Whether the highway always appears is still an open conjecture. It always has so far.",
        },
        {
          pretitle: "Step four · Why it matters",
          title: "Universality, hidden in two lines",
          body: "Take the ant and replace 'two colours' with 'n colours' and a different turn rule per colour. Some of those generalised ants are Turing-complete — Gajardo, Moreira and Goles proved it: you can encode any computer program into the initial bit pattern, and the ant's trajectory is the run of that program. So a system simple enough to fit on a napkin is, in disguise, every possible computer that will ever be built. That is the puzzle of cellular emergence in its purest form.",
        },
      ],
    },
    pascalmod: {
      pretitle: "Topic · Geometry",
      title: "Pascal's Triangle (mod n)",
      tagline: "Colour by divisibility — a fractal falls out.",
      intro:
        "Pascal's triangle is the lookup table for the binomial coefficients C(n, k). Each number is just the sum of the two above it. Reduce every entry modulo a prime and the resulting colour pattern is a perfect, infinite fractal. Why? Because of when carries happen in base-p addition.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The triangle",
          title: "Numbers from the simplest rule on Earth",
          body: "Write a 1 at the apex. Underneath, every entry is the sum of the two above it (treat the empty positions as zero). The first six rows: 1 · 1 1 · 1 2 1 · 1 3 3 1 · 1 4 6 4 1 · 1 5 10 10 5 1. The numbers are the binomial coefficients C(n, k) — they count the number of ways to choose k items from n. They appear in probability, in algebra (the expansion of (a + b)ⁿ), in combinatorics. They are also the only ingredient needed to see a fractal.",
        },
        {
          pretitle: "Step two · Colour by remainder",
          title: "Mod 2: odd cells filled, even cells blank",
          body: "Now replace every entry with its remainder modulo 2 (its parity). Fill the 1s, leave the 0s blank, and step back. What you see is the Sierpiński triangle — exact, infinite, generated purely by counting. Take any block of 2^k rows and the picture is three copies of the same block of size 2^(k-1) arranged in a triangle, with a hole in the middle. The same self-similar structure goes all the way down.",
        },
        {
          pretitle: "Step three · Kummer's theorem",
          title: "The hidden law: count the carries",
          body: "Why does Pascal mod p factor itself this cleanly? In 1852, Kummer proved a startling fact. The highest power of a prime p that divides C(n, k) equals the number of carries that happen when you add k and (n − k) in base p. So C(n, k) is divisible by p (mod 0) exactly when there is at least one carry; it is non-zero mod p exactly when k can be added to (n − k) in base p with no carry — i.e. when every base-p digit of k is at most the corresponding base-p digit of n. The fractal is, secretly, a picture of when base-p addition is clean.",
        },
        {
          pretitle: "Step four · Other primes",
          title: "Different p, different gasket",
          body: "For p = 3 you get a triangular gasket with three colours and a 3-fold self-similar structure. For p = 5 the period is 5; for p = 7 the gasket is denser still. As p grows, the fractal Hausdorff dimension approaches 2 — the picture fills up. For non-prime moduli the structure exists but becomes irregular (Kummer's clean carry-counting only works for primes). One simple combinatorial table, an infinite family of fractals.",
        },
      ],
    },
    sternbrocot: {
      pretitle: "Topic · Analysis",
      title: "The Stern–Brocot Tree",
      tagline: "Every fraction, exactly once — built by adding badly.",
      intro:
        "Start with 0/1 and 1/0 — the two impossibilities. Slide a new fraction in between by adding the numerators and denominators separately, the way a child would. Repeat forever. The infinite tree you build contains every positive fraction once, in lowest terms — and the path to each is exactly its continued-fraction expansion.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The mediant",
          title: "Add the bits separately, get something new",
          body: "Take two fractions, a/b and c/d. Their mediant is (a + c) / (b + d). This is, of course, the wrong way to add fractions. But it does produce something interesting: a fraction strictly between a/b and c/d. Start with 0/1 and 1/0 (treat 1/0 as +∞). Their mediant is 1/1. Slide 1/1 in between them. Now take the new pairs: (0/1, 1/1) yields 1/2; (1/1, 1/0) yields 2/1. Slide both in. Repeat. The fractions march across the number line, every one already in lowest terms.",
        },
        {
          pretitle: "Step two · Every fraction, once",
          title: "Nothing is missed, nothing is repeated",
          body: "It is a theorem — provable in a few lines — that the branches of the Stern–Brocot tree enumerate the positive rationals without omission and without repetition: each reduced fraction p/q lands at one and only one node, p and q already coprime. So the tree is, simultaneously, a complete listing of the positive rationals, a witness that there are only countably many, and a structurally fair way to build them. Stern (1858) and Brocot (1861) discovered the same tree independently — Stern as a piece of number theory, Brocot as a clockmaker's tool for picking gear ratios.",
        },
        {
          pretitle: "Step three · The continued-fraction path",
          title: "Left and right encode the expansion",
          body: "Pick any positive number — rational or irrational. Walk down the tree starting at 1/1. At each step go LEFT if your target is smaller than the current fraction, RIGHT if larger. Write down the sequence of moves as a run-length list. That list is exactly the continued-fraction expansion of your target. For instance: golden ratio φ = (1+√5)/2 ≈ 1.618 produces the path R, L, R, L, R, L, … — alternating one-by-one — which encodes the continued fraction [1; 1, 1, 1, 1, …]. φ is, in this sense, the irrational number 'hardest' to approximate by rationals.",
        },
        {
          pretitle: "Step four · Best approximations",
          title: "Stopping early gives the convergents",
          body: "Stop the walk after any finite number of steps. The fraction you are standing on is a best rational approximation of your target — better than any rational with smaller denominator. So the sequence of fractions you visit on the way to π gives you 3, 22/7, 333/106, 355/113, 103993/33102 — the famous convergents that human cultures kept rediscovering over the centuries. The same construction that enumerates the rationals also picks out the very best ones.",
        },
      ],
    },
    ulam: {
      pretitle: "Topic · Analysis",
      title: "The Ulam Spiral",
      tagline: "Primes lining up on diagonals nobody can fully explain.",
      intro:
        "Stanisław Ulam, bored in a 1963 lecture, doodled the integers in a square spiral and circled the primes. The primes did not scatter. They crowded along visible diagonals. Why primes prefer certain quadratic forms over others is one of the deepest unsolved problems in number theory — Ulam saw it on a napkin.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The spiral",
          title: "1 in the middle, then walk in squares",
          body: "Write 1 at the centre. Step right to write 2. Step up to write 3. Step left for 4 and 5. Step down for 6, 7, and 8. Continue in an outward-growing square spiral. By the time you have placed a hundred numbers you have a 10 × 10 grid where every cell holds a positive integer and integers next to each other on the page are no longer next to each other on the number line. That is the entire construction.",
        },
        {
          pretitle: "Step two · Colour the primes",
          title: "A pattern that should not be there",
          body: "Now fill in only the cells whose number is prime — leave the rest blank. If the primes were truly random among the integers, the grid would look like uniform speckle, like static. Instead, the eye is pulled along clear diagonal lines streaming across the picture. The pattern is not subtle: even a thirty-by-thirty patch already shows it. Ulam, Myron Stein, and Mark Wells published the observation in 1964 with a 65 000-number grid printed across multiple pages of Scientific American.",
        },
        {
          pretitle: "Step three · Why diagonals",
          title: "Each diagonal is a polynomial 4n² + bn + c",
          body: "Numbers along any diagonal of the Ulam spiral satisfy a quadratic formula of the form 4n² + bn + c. A diagonal full of primes therefore means the polynomial is unusually prime-rich. Some are spectacular. Euler's polynomial n² − n + 41 — discovered in 1772 — produces primes for every n from 0 to 40, and corresponds to a visible diagonal streak. Whether infinitely many primes lie on such a diagonal is, for any specific diagonal, unproven. The Bunyakovsky conjecture says yes; nobody has shown it.",
        },
        {
          pretitle: "Step four · The deeper problem",
          title: "An open question wearing make-up",
          body: "The Ulam spiral is a cosmetic rearrangement of the integers, but the visible diagonals encode a deep open question: which quadratic polynomials in ℤ[x] produce infinitely many primes? Several Hardy–Littlewood and Bateman–Horn conjectures predict exact densities for these primes — they match the picture spectacularly well — but every prediction is conditional. Ulam's doodle is a window onto the most stubborn part of analytic number theory, accidentally visible to anyone with squared paper.",
        },
      ],
    },
    cardioid: {
      pretitle: "Topic · Geometry",
      title: "The Coffee-Cup Cardioid",
      tagline: "The light curve in your cup is Mandelbrot's heart.",
      intro:
        "Put a small point source of light (an LED) on the rim of a cylindrical coffee cup. The reflections from the inside wall do not focus back at a point, they envelope a heart-shaped curve drifting on the surface of the coffee. That curve is the cardioid r = 2a(1 − cos θ). The very same equation describes the main bulb of the Mandelbrot set. Every morning, the most famous shape in dynamics is being drawn in light.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The optics",
          title: "Why light bunches up in a cup",
          body: "A circle reflects each incoming ray at twice the angle the surface makes with it, the law of reflection. Put a small point source right on the rim of a cylindrical cup: the rays it throws across the interior strike the far wall and fan outward by twice the local angle. They do not reconverge to a single focal point, because the curvature varies; instead, the family of reflected rays envelopes a smooth curve. The mathematicians' word for this envelope is a catacaustic. The catacaustic of a circle lit by a point source on its rim is exactly a cardioid. Parallel rays, the sunlight case, give the two-cusped nephroid instead.",
        },
        {
          pretitle: "Step two · The equation",
          title: "r = 2a (1 − cos θ)",
          body: "In polar coordinates centred at a chosen vertex, the cardioid is r(θ) = 2a(1 − cos θ). When θ = 0 the radius is 0 (the cusp). When θ = π the radius is 4a (the far tip). The curve is traced by a point on the rim of a circle of radius a rolling around the outside of a fixed circle of the same radius — that's where the word comes from: cardia means heart. It is one of the most-studied algebraic curves in classical analysis.",
        },
        {
          pretitle: "Step three · Mandelbrot's main bulb",
          title: "Same equation, a completely different universe",
          body: "Now leave optics behind. Zoom into the Mandelbrot set z ↦ z² + c. The big heart-shaped blob in the centre — the largest component — is a cardioid. Exactly. Its boundary is parameterised by c(t) = (1/2)·e^(it) − (1/4)·e^(2it), and that equation is algebraically a cardioid (in the variable c). The c-values inside that bulb correspond to dynamics with a single attracting fixed point. The shape that appears in a cup and the shape that appears in iteration theory are the same shape — and there is no simple reason why.",
        },
        {
          pretitle: "Step four · And the smaller bulbs",
          title: "An infinite ladder of attached circles",
          body: "The main cardioid in the Mandelbrot set has smaller circular discs hanging off it at every rational fraction p/q. Each disc corresponds to dynamics where the attracting cycle has period q. The largest disc, on the left, has period 2; the next two have period 3; then four discs of period 4; and so on. The fractal at the boundary of the Mandelbrot set is precisely the boundary between these stable regions and chaos. Coffee, optics, complex iteration, the deepest objects in dynamics — all wearing the same shape.",
        },
      ],
    },
    galton: {
      pretitle: "Topic · Analysis",
      title: "The Galton Board",
      tagline: "Bouncing balls always draw the same bell.",
      intro:
        "Francis Galton's quincunx is a triangle of pegs. Release a marble at the apex: at every peg it veers left or right on a fifty-fifty coin flip, until gravity drops it into one of the catch bins along the floor. Drop ten thousand marbles and the bins fill — always — into the shape of the normal distribution. The bell is not a coincidence. It is the Central Limit Theorem made tactile.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The contraption",
          title: "A staircase of fair coin flips",
          body: "A board with N rows of pegs offset by half a peg. Drop a marble in at the top. At every peg it strikes, it bounces left or right with equal probability — an independent coin flip. After N pegs the marble has fallen into one of N + 1 collection bins, where the bin index is the number of right-bounces minus the number of left-bounces, shifted to be non-negative. One marble teaches you nothing. The shape only appears in the limit.",
        },
        {
          pretitle: "Step two · The Pascal landing",
          title: "The bin counts are binomial",
          body: "After N rows, the probability that the marble lands in bin k (numbered 0 to N) is C(N, k) / 2^N. The numerators are the entries of row N of Pascal's triangle. So a Galton board is, secretly, a physical lookup of binomial coefficients. With N = 10 the central bins receive entries 252, 210, 210 — and the outermost bins receive entry 1 (only one path of all 1024). The shape is already a discrete bell.",
        },
        {
          pretitle: "Step three · The Central Limit Theorem",
          title: "The bell is unavoidable",
          body: "As N grows, the binomial probability mass function converges to the Gaussian density (1/√(2πNpq)) · exp(−(k − Np)² / (2Npq)). This is the De Moivre–Laplace theorem (1733), the historical first case of the Central Limit Theorem. The general CLT says far more: take ANY random variable with finite variance — bias, skew, distribution be damned — and sum N independent copies. After rescaling, the sum converges to a Gaussian. The bell is what averages always become.",
        },
        {
          pretitle: "Step four · Why it shows up everywhere",
          title: "Any sum of many small kicks",
          body: "Heights are made of thousands of independent small contributions. So are test scores, IQ scores, measurement errors, financial daily returns (under restrictive assumptions). Each is a sum of many small independent random variables, so each is approximately Gaussian. That is why bell curves rule statistics and why standard deviation has a name. The Galton board is the most physical way to see the theorem at work — at 1000 marbles the bell is already smooth, even though no marble individually knows anything about it.",
        },
      ],
    },
    magpendulum: {
      pretitle: "Topic · Chaos",
      title: "The Magnetic Pendulum",
      tagline: "Colour each start by its winner — and a fractal appears.",
      intro:
        "Suspend an iron pendulum over three magnets arranged in a triangle. Newton's laws, magnetic attraction, a touch of friction — deterministic, all of it. And yet the question 'which magnet does it land over?' has no smooth answer. Colour each starting point by its eventual winner: red, green and blue basins, interlocked at every scale.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The physics",
          title: "Three pulls, a damping, gravity to the centre",
          body: "Mount a small iron weight on a flexible string above a plate. Place three identical magnets on the plate in an equilateral triangle. The pendulum is pulled toward each magnet with a force proportional to 1/r² (or 1/r³ for an inverse-cube model — both are used in the literature; the qualitative fractal appears for either). A weak spring also pulls the pendulum back toward the centre of the triangle. Air resistance steadily drains energy. The equations of motion are deterministic; the only unknown is the starting position.",
        },
        {
          pretitle: "Step two · The basins of attraction",
          title: "Three regions in starting-point space",
          body: "Release the pendulum from a starting point above the plate and integrate the equations. Eventually the pendulum's amplitude decays and it settles directly above one of the three magnets — the winner. Repeat for every starting point in a fine grid, colour each by its winner: red for magnet 1, green for magnet 2, blue for magnet 3. The plate is now coloured into three basins of attraction. The interior of each basin is a neat coloured region. The boundary, however, is not a curve — it is a fractal.",
        },
        {
          pretitle: "Step three · The fractal frontier",
          title: "Every boundary point borders all three colours",
          body: "Zoom into the boundary between any two colours and you find the third colour interleaved in there. Zoom again and you find all three colours arbitrarily close to any boundary point. This is the defining property of a Wada basin — a topological monstrosity discovered by Yoneyama in 1917, then weaponised by chaos theorists in the 1990s. Determinism stays intact: same start → same outcome. But the slightest change in starting position can flip the answer to any of the three magnets. Predictability is gone.",
        },
        {
          pretitle: "Step four · Why this matters",
          title: "Chaos has a colour",
          body: "The magnetic pendulum is the cleanest visualisation of sensitive dependence on initial conditions in any classical mechanical system. The same kind of fractal basin appears in solvers of Newton's method (zoom into the boundary of the Newton basins for a cubic and you get the same picture), in models of the long-term solar system, in chaotic billiards, in the Lorenz attractor's stable-fixed-point regimes. Wherever competing attractors coexist, their basin boundaries tend to be fractal. The world is full of these hidden frontiers; the magnetic pendulum just lets you see one.",
        },
      ],
    },
    godel: {
      pretitle: "Topic · Paradox",
      title: "Gödel's Incompleteness",
      tagline: "Mathematics will never be complete.",
      intro:
        "Kurt Gödel, Vienna, 1931. In any consistent formal system rich enough to express arithmetic, there are true statements the system itself cannot prove. The Explorer walks you through Gödel numbering and the construction of the self-referential sentence G that says, in arithmetic, «I am not provable».",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · Hilbert's dream",
          title: "Mechanise all of mathematics",
          body: "Early twentieth century. Whitehead and Russell's Principia Mathematica (1910–1913) tried to derive every theorem of arithmetic from a single tower of logical axioms. David Hilbert, in his 1900 Paris programme and then his 1920s formalist push, asked for a finite, mechanical system from which every true statement could be proved, and whose consistency could be proved from inside. A complete, consistent, decidable formal mathematics. Anyone with paper and patience could, in principle, settle every mathematical question. That was the dream.",
        },
        {
          pretitle: "Step two · Gödel numbering",
          title: "Arithmetic that talks about itself",
          body: "Gödel's first move was a coding trick. Assign each symbol of the formal language a number — ¬ → 1, ∨ → 2, ∀ → 3, =, +, ·, parentheses, variables, and so on. Then encode a whole formula (s₁, s₂, …, sₖ) as the single natural number 2^s₁ · 3^s₂ · 5^s₃ · … using consecutive primes. By the uniqueness of prime factorisation the encoding is reversible. Proofs — sequences of formulas — get numbers too. Suddenly properties like «x is a proof of y» become arithmetic predicates Prov(x, y) that the formal system can express about its own statements.",
        },
        {
          pretitle: "Step three · The diagonal trick",
          title: "G says: «G is not provable»",
          body: "Using the diagonal lemma — descended directly from Cantor's 1891 diagonal argument — Gödel constructed a sentence G whose Gödel number is ⌜G⌝, and which is arithmetically equivalent to ¬∃x Prov(x, ⌜G⌝): «no number x is a proof of the formula with Gödel number ⌜G⌝». In plain language: G says «I am not provable in this system». Now the squeeze. If G is provable, the system proves a false statement and is inconsistent. If G is unprovable, then what G claims is exactly true — but the system cannot prove it. Either way Hilbert's dream of a complete consistent arithmetic collapses. The Second Incompleteness Theorem follows almost immediately: such a system cannot prove its own consistency, for if it could, it would also prove G, contradicting the First.",
        },
        {
          pretitle: "Step four · Where it spread",
          title: "Tarski, Turing, Church, and every proof assistant since",
          body: "The same diagonal trick keeps reappearing. Alfred Tarski (1933) proved that truth in arithmetic is not definable inside arithmetic — undefinability of truth. Alan Turing (1936) showed the halting problem is undecidable by diagonalising over Turing machines. Alonzo Church (1936) proved that first-order logic itself is undecidable. Each result is, structurally, a cousin of Gödel's: a system rich enough to describe itself contains a question it cannot answer about itself. Modern proof assistants — Coq, Lean, Isabelle, HOL — operate under Gödel's bounds: they can mechanise an enormous amount of mathematics, but they cannot prove their own consistency, and there are concrete number-theoretic statements (Goodstein's theorem, Paris–Harrington) that are true and provably unprovable in Peano arithmetic. The dream is gone; the building is bigger than ever.",
        },
      ],
    },
    halting: {
      pretitle: "Topic · Computation",
      title: "The Halting Problem",
      tagline: "No program can predict every other program.",
      intro:
        "Alan Turing, 1936. Given a program P and an input x, can we always decide whether P halts on x? Turing said no — and proved it with a self-referential diagonal trick that no machine can dodge. The Explorer runs a handful of toy programs on a small tape so you can watch some terminate, others run forever, and one program — the diagonal D — twist itself into the contradiction Turing wrote down.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The question",
          title: "Does P halt on x?",
          body: "Given the source code of a program P and an input x, decide whether P eventually finishes or whether it runs forever. It sounds like something a clever enough analyser should always be able to determine — programs are finite strings of symbols, after all, and a computer can simulate them. David Hilbert, in his Entscheidungsproblem of 1928, asked for exactly such a universal decision procedure. By the mid-1930s Alonzo Church (via the λ-calculus) and Alan Turing (via what we now call Turing machines) were closing in on the same answer from opposite directions.",
        },
        {
          pretitle: "Step two · Turing's contradiction",
          title: "Assume halts(P, x), then build D",
          body: "Suppose, for contradiction, there exists a total computable function halts(P, x) that returns ⊤ when P halts on input x and ⊥ otherwise. Then we can write a new program D(P): compute halts(P, P); if it returns ⊤, loop forever; if it returns ⊥, halt immediately. D is allowed — every step of it is computable by assumption. Now ask: what does halts(D, D) return? If halts(D, D) = ⊤, then by the definition of D the program D loops on input D — so D does not halt on D, contradicting ⊤. If halts(D, D) = ⊥, then D halts on D — contradicting ⊥. Either answer breaks the definition, so no such halts can exist. (Turing 1936, ‘On Computable Numbers, with an Application to the Entscheidungsproblem’.)",
        },
        {
          pretitle: "Step three · Diagonalisation in disguise",
          title: "Cantor, Gödel, Turing — the same move",
          body: "The same trick powers Cantor's diagonal (build a real that disagrees with the n-th listed real in the n-th digit), Gödel's first incompleteness theorem (build a sentence that says ‘I am not provable’), and Turing's halting argument (build a program that does the opposite of what the decider says). Each construction lays the candidates out in a list and reads down the diagonal to forge an object the list cannot contain. The halting problem was the first concrete decision problem to be proved undecidable — the moment the limits of computation became a theorem.",
        },
        {
          pretitle: "Step four · Why it matters today",
          title: "Rice's theorem and the practical fallout",
          body: "Rice's theorem (Henry Gordon Rice, 1953) generalises Turing: any non-trivial semantic property of programs — ‘does it ever return zero?’, ‘does it leak memory?’, ‘is it malicious?’ — is undecidable. Static analysers must therefore approximate: they over-report (false positives) or under-report (missed bugs), never both clean and complete. Compilers time out when optimising, refusing to inline beyond a heuristic. Antivirus engines can never catch all malware in general. Cloud autoscalers cannot promise that a submitted job will halt; they cap CPU time instead. The halting problem is not a curiosity — it is the wall that every program-about-programs eventually hits.",
        },
      ],
    },
    pvsnp: {
      pretitle: "Topic · Computation",
      title: "P vs NP",
      tagline: "The biggest open question in computer science.",
      intro:
        "Some problems are easy to solve. Others are easy to check once somebody hands you the answer. P vs NP asks whether those two classes are secretly the same — and a yes would shatter modern cryptography. The Explorer is a small 3-SAT solver that lets you watch why verification is trivial but search is brutal: drop in a formula, then follow DPLL down the backtracking tree as it tries assignments and prunes whole branches with a single contradiction.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · Two classes of problems",
          title: "Solvable quickly vs verifiable quickly",
          body: "P is the class of decision problems a deterministic machine can solve in polynomial time — multiply two numbers, sort a list, check whether a graph is connected. NP is the class where, given a candidate solution, a polynomial-time machine can verify the answer is correct. The two are not obviously the same. Sudoku is the textbook example: filling in a 9×9 grid is genuinely hard, but if a friend hands you a completed grid you can confirm every row, column and box in a single linear sweep. The hard part is finding the solution; the easy part is checking it.",
        },
        {
          pretitle: "Step two · NP-completeness",
          title: "Cook 1971, Karp 1972, Levin independently",
          body: "In 1971 Stephen Cook proved the Cook-Levin theorem: every problem in NP reduces in polynomial time to Boolean satisfiability (SAT). Leonid Levin published the same result independently in the Soviet Union. A year later Richard Karp showed 21 classical problems — 3-SAT, Hamiltonian Path, Clique, Subset Sum, the Travelling Salesman decision version — are all polynomial-time inter-reducible. Today the list runs into thousands: Sudoku N×N, Tetris, generalised Minesweeper, even protein folding lattice models all belong to the same equivalence class. Solve one efficiently and you have solved them all. Cook-Karp-Levin reductions turned a question about one problem into a question about every interesting search problem at once.",
        },
        {
          pretitle: "Step three · What if P = NP?",
          title: "Cryptography falls, biology bends, the universe gets boring",
          body: "A polynomial-time algorithm for 3-SAT would compose with Karp reductions to crack RSA (factoring becomes feasible), break elliptic-curve cryptography, decrypt every TLS session ever recorded, and forge every digital signature. Protein folding would collapse into a polynomial-time look-up. Optimal scheduling, optimal compiler register allocation, optimal route planning — all the NP-hard problems engineers currently approximate — would have exact polynomial solutions. Most computer scientists bet against: Scott Aaronson's poll of the field puts >80% on P ≠ NP. But neither a proof nor a refutation exists. The class containment we do know is P ⊆ NP ⊆ PSPACE ⊆ EXP, with P ⊊ EXP proved by the time hierarchy theorem — so at least one of those containments is strict, but nobody knows which.",
        },
        {
          pretitle: "Step four · The $1 million prize",
          title: "Clay Millennium Problem, 2000",
          body: "The Clay Mathematics Institute named P vs NP one of the seven Millennium Prize Problems in May 2000, with a $1 000 000 award for a correct resolution either way. It is the only one of the seven that touches everyday technology directly. Dozens of false proofs are circulated every year — Vinay Deolalikar's 2010 announcement was the most prominent recent attempt and unravelled within weeks. The community-wide expectation is that the answer is P ≠ NP. The unsolved question is not what the answer is, but why — and which fragment of mathematics will turn out to contain the right lower-bound technique. Forty-plus years of barriers (relativisation, natural proofs, algebrisation) say it will not come from any method we currently know.",
        },
      ],
    },
    rsa: {
      pretitle: "Topic · Computation",
      title: "RSA & One-Way Functions",
      tagline: "Multiplying is easy. Factoring is impossible.",
      intro:
        "Rivest, Shamir and Adleman, 1977 — the first published public-key cryptosystem and still, almost half a century later, the one securing most of the working internet. The Explorer walks through a complete RSA key-generation, encryption, and decryption on small numbers so you can see every step: choose primes, derive the public and private exponents, then encrypt a message and watch the same maths peel it back open.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The asymmetry",
          title: "One-way functions: easy forward, hard back",
          body: "Multiplying two huge primes p and q is fast — a few milliseconds on a phone. Recovering p and q from their product n = p · q is not: the best classical algorithm known (the general number field sieve) runs in sub-exponential but super-polynomial time, and a 2048-bit n is comfortably out of reach for every machine ever built. This one-way property — cheap forward, ruinously expensive backward — is the foundation of public-key cryptography. RSA dresses the asymmetry up so that a public key can be handed to anyone and only the holder of the matching private key can read what was written back.",
        },
        {
          pretitle: "Step two · Key generation",
          title: "Pick e, derive d via extended Euclid",
          body: "Compute φ(n) = (p − 1)(q − 1), Euler's totient — the count of integers in [1, n] coprime to n. Pick a small public exponent e coprime to φ(n); 65537 is the canonical choice because it's prime, has only two bits set, and survives every known low-exponent attack. Then compute the private exponent d = e⁻¹ mod φ(n) using the extended Euclidean algorithm: it returns Bézout coefficients (x, y) with e·x + φ(n)·y = 1, and reducing x mod φ(n) gives d. The public key is the pair (n, e); the private key is (n, d). Throw p and q away once d is in hand.",
        },
        {
          pretitle: "Step three · Encrypt and decrypt",
          title: "c = m^e mod n,   m = c^d mod n",
          body: "Treat the plaintext m as an integer in [0, n). The ciphertext is c = m^e mod n; decryption is m = c^d mod n. The reason it works comes straight from Euler and Fermat: because ed ≡ 1 mod φ(n), we have m^(ed) = m^(1 + kφ(n)) ≡ m mod n for every m coprime to n (Euler's theorem), and a short argument with the Chinese remainder theorem extends the identity to every m in [0, n). Square-and-multiply turns the giant exponents into a few thousand modular multiplications — fast in practice, mathematically exact.",
        },
        {
          pretitle: "Step four · Where it stands today",
          title: "From TLS to the post-quantum migration",
          body: "RSA is the maths under every TLS handshake your browser still negotiates with an RSA certificate, under SSH host keys, under the code-signing chains that authenticate apps from Apple and Google, under electronic passports and the early generations of blockchain. But in 1994 Peter Shor wrote down a quantum algorithm that factors integers in polynomial time — given a sufficiently large fault-tolerant quantum computer, RSA breaks. None exists yet, but the timeline is uncertain enough that NIST has standardised post-quantum replacements (CRYSTALS-Kyber for key exchange in 2024, CRYSTALS-Dilithium for signatures) and the global migration is already under way.",
        },
      ],
    },
    mobius: {
      pretitle: "Topic · Geometry",
      title: "Möbius Strip & Klein Bottle",
      tagline: "Surfaces with only one side.",
      intro:
        "Take a paper strip, give it half a twist, glue the ends together — and you have a surface with one side and one edge. The Explorer renders a rotating 3-D Möbius strip you can slice along different ratios to see what falls out: cut down the middle and it stays in one piece; cut along the third and you get two interlocked rings. A button flips to the Klein bottle, the closed analogue that needs four dimensions to live without crossing itself.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The half-twist",
          title: "Glue the ends with a flip",
          body: "Take a rectangular paper strip. Give one end a half-twist (180°) before gluing it to the other. The result has one edge and one side. Walk along it with a pen and you cover what looks like both 'sides' without ever crossing the boundary; trace the rim and you return to where you started after going around twice. Discovered independently by August Ferdinand Möbius and Johann Benedict Listing in 1858 — the first non-orientable surface ever explicitly written down. Its Euler characteristic is χ = 0.",
        },
        {
          pretitle: "Step two · Cutting surprises",
          title: "What scissors reveal about topology",
          body: "Cut the Möbius strip down the middle. It does not fall apart — you get one longer strip with two full twists (four half-twists), and crucially that strip is two-sided again. Cut a Möbius strip a third of the way in from one edge, keeping the cut parallel to the edge all the way around, and the scissors travel twice around before closing the loop: out come two interlocked rings — a narrower fresh Möbius strip (still with one half-twist) and a longer two-sided ring with two half-twists (no longer a Möbius strip at all), the two linked through each other. Topology is full of these surprises — the global twist hidden by local flatness.",
        },
        {
          pretitle: "Step three · The Klein bottle",
          title: "Felix Klein, 1882",
          body: "Now take a tube and glue one end to the other after threading it through the wall of the tube — matching the circles with opposite orientation. In four-dimensional space this is a perfectly smooth, closed, non-orientable surface: no boundary, no inside, no outside. Felix Klein described it in 1882. In three dimensions the threading forces the tube to pass through itself, so every glass Klein bottle you have ever seen is an immersion, not a true embedding. Glue two Möbius strips along their single edges and the result is exactly a Klein bottle.",
        },
        {
          pretitle: "Step four · Where they live",
          title: "From belt drives to chemistry",
          body: "Möbius strips show up as conveyor and printer belts (the wear distributes over the entire surface, doubling lifetime), as Max Bill's Endless Ribbon sculptures, as Möbius resistors that cancel their own self-inductance, as superconducting microwave Möbius waveguides — and, since 2003, as Möbius aromatic molecules synthesised by Rainer Herges. The familiar recycling triangle is, strictly, a Möbius strip with three half-twists — still one-sided, but more twisted than the classical single-half-twist band. Above all, the Möbius strip and the Klein bottle are the entry points to the classification of surfaces — the theorem that every closed surface is determined up to homeomorphism by genus, orientability and a single integer χ.",
        },
      ],
    },
    eulerchar: {
      pretitle: "Topic · Geometry",
      title: "Euler Characteristic",
      tagline: "V − E + F = 2, no matter the shape.",
      intro:
        "Descartes wrote it down in 1639 and Euler rediscovered it a century later: count the vertices, edges and faces of any convex polyhedron and V − E + F always equals 2. The Explorer cycles through the Platonic and Archimedean solids and tallies V, E, F live — you watch the formula hold across cube, dodecahedron and soccer ball. Then bend the surface around a doughnut and watch the constant change.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · Count vertices, edges, faces",
          title: "The constant that refuses to budge",
          body: "Take a cube: 8 vertices, 12 edges, 6 faces. Subtract and add: 8 − 12 + 6 = 2. Try a tetrahedron: 4 − 6 + 4 = 2. The soccer ball — a truncated icosahedron, twelve pentagons and twenty hexagons stitched along their edges — has 60 vertices, 90 edges, 32 faces, and 60 − 90 + 32 = 2 again. Cycle through every Platonic and Archimedean solid the Greeks ever drew, and the answer is the same. The constant is not a coincidence.",
        },
        {
          pretitle: "Step two · Topology, not geometry",
          title: "Squeeze the cube into a sphere",
          body: "Inflate the cube until it bulges into a perfect sphere. The corners round off, the straight edges curve, the flat faces puff outwards — V − E + F is still 2. The same is true if you crush it into a pancake, twist it into an egg, or pull it into any shape you like, as long as you do not tear, glue or punch a hole. The number depends only on the topology. χ = 2 for any shape topologically equivalent to a sphere — for the surface of every convex polyhedron, every smooth ovoid, every potato.",
        },
        {
          pretitle: "Step three · Holes lower it",
          title: "Each handle costs you two",
          body: "Now wrap the surface around a doughnut. Triangulate the torus any way you like — V − E + F drops to 0. A double torus, two doughnuts glued side by side, gives χ = −2. The rule is χ = 2 − 2g, where g is the number of holes (the genus). Each handle you sew on costs you 2. The Euler characteristic measures topology in a single integer: it tells you how many holes a closed surface has, no matter how it is drawn or stretched.",
        },
        {
          pretitle: "Step four · Why it matters",
          title: "From soccer balls to the Fields Medal",
          body: "Buckyball chemistry is forced by χ: every fullerene cage built from pentagons and hexagons must contain exactly 12 pentagons, because the Euler characteristic of a sphere is 2. Buckminster Fuller's geodesic domes follow the same rule. 3D-printing slicers use V − E + F to validate that a mesh is closed and printable. Gauss-Bonnet relates the total curvature of a smooth surface to 2π·χ, tying geometry to topology in a single equation. The Atiyah-Singer index theorem (Fields Medal 1966) is the modern descendant of the same idea — and Lakatos's Proofs and Refutations traces the two centuries of edge cases that almost broke V − E + F = 2 and then strengthened it.",
        },
      ],
    },
    konigsberg: {
      pretitle: "Topic · Analysis",
      title: "The Königsberg Bridges",
      tagline: "Seven bridges, one impossible walk.",
      intro:
        "Could you walk through Königsberg, cross every bridge exactly once, and end up where you started? The Explorer lets you try the walk yourself, watch the parity argument live as you cross each bridge, and add or remove bridges to make the walk possible.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The puzzle",
          title: "A walk no one could find",
          body: "Königsberg straddled the Pregel river with two islands and two riverbanks — four land masses in total — connected by seven bridges. The townspeople asked a Sunday-stroll question: could you take a walk through the city that crossed every bridge exactly once and ended where you started? Everyone tried. Everyone failed. Nobody could prove it was impossible.",
        },
        {
          pretitle: "Step two · Euler's reduction",
          title: "Geometry becomes topology",
          body: "In 1736 Leonhard Euler did something nobody had done before. He ignored distances. He ignored angles. He ignored which bridge was upstream of which. He drew the four land masses as four dots and the seven bridges as seven edges. The map became a graph. The problem of position — geometria situs — was born, and with it both graph theory and topology.",
        },
        {
          pretitle: "Step three · The parity argument",
          title: "Every land mass needs an even count",
          body: "Every time you enter a land mass, you use one bridge; when you leave, you use another. So each land mass needs an even number of bridges incident to it — except, possibly, the start and the end of the walk. Königsberg had four land masses, all with an odd number of bridges. Four odd-degree vertices is two too many. Impossible.",
        },
        {
          pretitle: "Step four · The birth of graph theory",
          title: "From a Sunday stroll to the modern world",
          body: "The same parity argument now powers GPS routing, the Chinese Postman Problem (used to optimise routes for snowploughs, garbage trucks and postal workers), and DNA assembly — every modern genome assembler walks an Eulerian path through a de Bruijn graph. WWII destroyed two of Königsberg's bridges; only five of the original seven remain. The current graph has exactly two odd-degree vertices, so today the walk is finally possible — though Euler is no longer there to take it.",
        },
      ],
    },
    fourcolor: {
      pretitle: "Topic · Analysis",
      title: "The Four Colour Theorem",
      tagline: "Every flat map needs at most four colours.",
      intro:
        "Any map drawn on the plane can be coloured with at most four colours so that no two regions sharing a border get the same colour. The Explorer lets you build maps and watch a backtracking colouring algorithm assign at most four colours — region by region, with the smallest valid choice each time.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The conjecture",
          title: "Francis Guthrie, 1852",
          body: "While colouring a map of the counties of England, the young Francis Guthrie noticed that four colours always seemed to suffice. He asked his brother Frederick, who asked their teacher Augustus De Morgan, who asked everyone. The conjecture looked harmless — and stumped mathematicians for 124 years. Several published proofs (Kempe 1879, Tait 1880) turned out to contain subtle gaps that nobody spotted for over a decade.",
        },
        {
          pretitle: "Step two · Why three is not enough, five is too many",
          title: "Four is the sharp bound",
          body: "Three colours are demonstrably not enough — four mutually adjacent regions can already be drawn in the plane (think of three countries meeting at a corner with a fourth surrounding them). The five-colour theorem, due to Heawood in 1890, is provable in a page using Euler's formula V − E + F = 2 and a careful degree argument. Closing the gap from five down to four is what took another eighty-six years.",
        },
        {
          pretitle: "Step three · The Appel-Haken proof, 1976",
          title: "The first theorem proven by computer",
          body: 'Kenneth Appel and Wolfgang Haken at the University of Illinois reduced the problem to a finite list of 1834 "unavoidable configurations" — and then showed each one is reducible. Their proof ran on an IBM 370 for around 1200 hours. Many mathematicians refused to accept it: a proof a human cannot read in its entirety, they argued, is not a proof. The University of Illinois mathematics department\'s outgoing mail was franked with "Four Colors Suffice" for years.',
        },
        {
          pretitle: "Step four · Where it stands",
          title: "Robertson-Sanders-Seymour-Thomas, Gonthier, and beyond",
          body: "In 1996 Robertson, Sanders, Seymour and Thomas simplified the proof to 633 configurations and a cleaner discharging argument. In 2005 Georges Gonthier mechanised the entire proof inside the Coq proof assistant — every logical step, including the case analysis, machine-verified end to end. The theorem now powers frequency assignment in cellular networks, register allocation in compilers, and scheduling and timetabling problems wherever conflicts form a planar graph.",
        },
      ],
    },
    smallworld: {
      pretitle: "Topic · Analysis",
      title: "Six Degrees & Small Worlds",
      tagline: "Any two people, six handshakes apart.",
      intro:
        "Stanley Milgram sent letters to strangers and found that, on average, six forwards got them across America. Forty years later Watts and Strogatz showed why: a sprinkle of random shortcuts on an otherwise regular network collapses the average path length without touching local clustering. The Explorer lets you tune the Watts-Strogatz rewiring probability p and watch the average path length L collapse in real time.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The letter experiment",
          title: "Milgram, 1967",
          body: "Stanley Milgram, then at Harvard, sent letters to random people in Omaha and Wichita and asked them to forward the letter, hand to hand, to a target stockbroker in Boston — but only via someone they knew personally on a first-name basis. Most letters never made it. The ones that did averaged about six links from sender to target. The pop-culture phrase «six degrees of separation» was born. The shortcut: society has hubs, and the hubs do most of the routing.",
        },
        {
          pretitle: "Step two · Watts and Strogatz, 1998",
          title: "Rewiring with probability p",
          body: "Start with a ring lattice: N nodes on a circle, each connected to its k nearest neighbours on either side. The graph has high clustering C — your friends are each other's friends — but a long average path length L of order N/k. Now re-wire each edge with probability p to a random destination. As p climbs from 0, L collapses logarithmically while C barely moves. A few random shortcuts shrink the world. The sweet spot, around p ≈ 0.01 to 0.1, is the small-world regime: high C like a lattice, low L like a random graph.",
        },
        {
          pretitle: "Step three · Where the world really is small",
          title: "Films, brains, grids, the web",
          body: "Academic collaboration graphs gave us the Erdős number; Hollywood gave us the Bacon number (the «Six Degrees of Kevin Bacon» game). The C. elegans worm has a perfectly mapped 302-neuron brain with small-world connectivity; human connectomes show the same signature at far larger scale. Power grids, the Internet, citation networks, Wikipedia's link graph, protein-interaction networks — the small-world regime keeps turning up wherever someone bothers to measure L and C. The world is small, structurally, almost everywhere.",
        },
        {
          pretitle: "Step four · Consequences",
          title: "Fast spread, smart search, sick brains",
          body: "On small-world networks, viruses, rumours and ideas reach everyone fast — wonderful for innovation diffusion, terrible during a pandemic. Kleinberg (2000) proved that decentralised greedy search succeeds on small worlds only when the shortcut distribution has the right exponent, explaining why Milgram's letter-forwarders could actually find the target. And clinical neuroscience now uses small-world coefficients (σ, ω) as biomarkers: Alzheimer's and schizophrenia both show measurable departures from the healthy small-world signature.",
        },
      ],
    },
  },
  storyLabels: {
    nowTryIt: "Now try it.",
    readyToFly: "Ready to fly?",
    yourTurn: "Your turn.",
    stepIntoIt: "Step into it.",
    buildWithOne: "Build with one stone.",
  },
};

const de: StoriesDict = {
  sectionLabels: {
    cathedral: "Kathedrale",
    atelier: "Atelier",
    resonance: "Resonanz",
    story: "Story",
    explorer: "Explorer",
    sandbox: "Sandbox",
    sound: "Klang",
  },
  pages: {
    mandelbrot: {
      pretitle: "Thema II · Chaos",
      title: "Die Mandelbrot-Menge",
      tagline: "Quadrieren und addieren. Immer wieder.",
      intro:
        "Eines der meistfotografierten Objekte der Mathematik ist die Visualisierung einer absurd einfachen Regel. Unten: was die Regel ist, was wir eigentlich anschauen — und ein Knopf direkt in den Explorer, wenn du fliegen willst.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Die Regel",
          title: "Wähle eine komplexe Zahl, dann iteriere",
          body: "Wähle eine beliebige komplexe Zahl c. Starte eine Folge bei z₀ = 0 und wende immer wieder zₙ₊₁ = zₙ² + c an. Das ist die ganze Regel. Wir stellen dann eine einzige Ja/Nein-Frage: bleibt die Folge beschränkt — oder wandert sie irgendwann ins Unendliche? Die Menge der c, für die die Folge beschränkt bleibt, ist die Mandelbrot-Menge. Alles weitere, auch das berühmte Bild, ist nur eine bunte Antwort auf diese Frage.",
        },
        {
          pretitle: "Schritt zwei · Die Bahn beobachten",
          title: "Drei Punkte, drei Schicksale",
          body: "Es hilft, die Folge tatsächlich zu sehen. Für ein c tief im Inneren der Menge zieht sich die Bahn auf eine kleine Schleife zusammen und verlässt sie nie. Für ein c knapp außerhalb wandert die Bahn nach außen und explodiert binnen weniger Schritte. Für ein c direkt am Rand tanzt die Bahn ewig, ohne sich je zu beruhigen oder zu entkommen. Die drei animierten Felder unten zeigen diese drei Regime nebeneinander.",
        },
        {
          pretitle: "Schritt drei · Warum das Bild unendlich ist",
          title: "Der Rand wird nie einfacher",
          body: "Sobald du jedes c danach einfärbst, wie schnell seine Bahn entkommt, leuchtet der Rand auf. Die erstaunliche Tatsache, bewiesen unter anderem von Tan Lei, ist: der Rand ist in einem tiefen Sinn selbstähnlich — wo immer du hineinzoomst, findest du neue winzige Kopien der ganzen Form, umgeben von Filigran, das sich nie wiederholt. Deshalb geht der Explorer bis zu 10¹⁰ Zoom: es gibt auf jeder Skala wirklich etwas Neues.",
        },
        {
          pretitle: "Schritt vier · Die Fixpunkte",
          title: "Wo die Mathematik sich versteckt",
          body: "Innerhalb der großen Kardioide in der Mitte konvergiert die Iteration zu einem einzigen Fixpunkt. Innerhalb jeder runden Scheibe, die daran hängt, zu einem 2-Zyklus, dann 4, dann 8 — dieselbe Verdoppelungs-Kaskade wie bei der logistischen Abbildung. Die Mandelbrot-Menge ist in präzisem Sinn eine Karte davon, wo die logistische Geschichte ruhig ist und wo sie ins Chaos kippt. Zwei berühmte chaotische Systeme, ein Bild.",
        },
      ],
    },
    life: {
      pretitle: "Thema III · Berechnung",
      title: "Conways Game of Life",
      tagline: "Vier Regeln. Universen folgen.",
      intro:
        "Martin Gardner stellte Conways Regeln im Oktober 1970 in seiner Kolumne im Scientific American vor. Zwei Magazinseiten, vier Regelzeilen — und eine Gemeinschaft von Mathematiker:innen hat seither fünfzig Jahre damit verbracht zu entdecken, was schon darin steckte. Die Sandbox erlaubt dir, jedes Muster zu zeichnen und laufen zu lassen — vorher: die vier Regeln in Aktion.",
      ctaInteractive: "→ Sandbox öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Die Regeln",
          title: "Geburt, Überleben, Tod — und sonst nichts",
          body: "Das Gitter ist unendlich, jede Zelle ist entweder lebendig oder tot, und jede Zelle schaut auf ihre acht Nachbarn. Findet eine tote Zelle ringsum genau drei lebende Nachbarn, geht sie an; hat eine lebende Zelle zwei oder drei lebende Nachbarn, hält sie sich bis zur nächsten Runde. Jeder andere Fall — zu wenige Nachbarn, zu viele Nachbarn, keine Nachbarn — tötet die Zelle. Die vier animierten Demos unten zeigen, wie jede Regel auf einem 5×5-Gitter zündet.",
        },
        {
          pretitle: "Schritt zwei · Von Regeln zur Bewegung",
          title: "Der Gleiter wandert",
          body: "Ein Muster aus fünf Zellen, der Gleiter, ist das kleinste bewegliche Ding in Life. Beobachte seine Schritte. Nach vier Generationen ist er wieder in seiner ursprünglichen Form — aber um eine Zelle diagonal verschoben. So funktioniert Bewegung in einer Welt, die den Begriff Bewegung nicht kennt: eine Form, die nach wenigen Regel-Anwendungen sich selbst woanders gleicht.",
        },
        {
          pretitle: "Schritt drei · Von Bewegung zu Berechnung",
          title: "Gleiter tragen Information",
          body: "Wenn ein Gleiter sich bewegt, kann er gezielt geschickt werden. Wenn er gezielt geschickt werden kann, kann er mit anderen Gleitern kollidieren. Aus Kollisionen lassen sich UND, ODER, NICHT bauen — und daraus jeder boolesche Schaltkreis. Es sind Turing-Maschinen, Game-of-Life-Simulatoren und ganze programmierbare Computer ausschließlich aus sorgfältig angeordneten Gleitern gebaut worden. Die Sandbox enthält die Gosper-Gleiter-Kanone als Preset: ein Muster, das alle dreißig Generationen einen Gleiter abfeuert, für immer.",
        },
        {
          pretitle: "Schritt vier · Was uns das sagt",
          title: "Komplexität braucht keine komplexen Regeln",
          body: "Die tiefere Aussage ist philosophisch. Life zeigt, dass aufwendige Struktur — Bewegung, Replikation, Berechnung, ja in den starken Varianten sogar Bewusstsein — in einer Regel sitzen kann, die auf eine Postkarte passt. Es ist dieselbe Lektion, die NAND für die Logik liefert und Regel 110 für Zellularautomaten. Ein kleiner Baustein, mit Disziplin angewendet, reicht.",
        },
      ],
    },
    nand: {
      pretitle: "Thema · Logik",
      title: "Der Sheffer-Strich",
      tagline: "Ein Gatter genügt für die gesamte digitale Logik.",
      intro:
        "Das NAND-Gatter ist die einfachste Computerhardware, die du dir vorstellen kannst. Im Builder wechselst du zwischen Gattern und siehst live, wie ihr NAND-Skelett darunter aktualisiert.",
      ctaInteractive: "→ Builder öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Das Gatter",
          title: "Vier Zeilen, festgelegt 1913",
          body: "Henry Sheffers Strich (a ↑ b) ist die Negation von UND. Er liefert 1, außer wenn beide Eingänge 1 sind. Sheffers Arbeit von 1913 zeigte, dass dieser eine Operator — zusammen mit Konstanten und Variablen — jeden Satz der klassischen booleschen Logik ausdrücken kann. Charles Sanders Peirce hatte die duale Tatsache für NOR (↓) bereits dreißig Jahre zuvor in einem unveröffentlichten Manuskript notiert — sowohl NAND als auch NOR sind funktional vollständig, und beide gelangten unabhängig voneinander zu ihrem Ergebnis.",
        },
        {
          pretitle: "Schritt zwei · Alles andere bauen",
          title: "Derselbe Stein, viele Formen",
          body: "Der Trick ist Komposition. Speise den Ausgang eines NAND in ein weiteres NAND, manchmal mit einer Kopie der Eingabe an sich selbst verdrahtet — und die vier klassischen Gatter fallen fast unmittelbar heraus. NICHT ist ein NAND. UND sind zwei. ODER sind drei. XOR sind vier. Jeder weitere boolesche Ausdruck lässt sich daraus zusammensetzen.",
        },
        {
          pretitle: "Schritt drei · Warum Chips das nutzen",
          title: "Ein Meer aus NANDs im Silizium",
          body: "CMOS-Transistoren realisieren NAND mit vier Transistoren — weniger als UND oder ODER. Da sich jeder boolesche Ausdruck auf NANDs reduzieren lässt, synthetisieren Chipdesigner ganze Schaltungen oft aus nichts anderem: eine Reihe identischer NAND-Zellen, verdrahtet zu Addierern, Multiplexern, Speicher, schließlich einer CPU. Jeder moderne Computer ist physikalisch der Sheffer-Strich, ein paar Milliarden Mal iteriert.",
        },
        {
          pretitle: "Schritt vier · Die andere Seite",
          title: "NAND gewann den Chip, NOR gewann den Mond",
          body: "NOR (¬(a ∨ b)) ist das andere funktional vollständige Einzelgatter. Der Apollo Guidance Computer, der Menschen auf dem Mond landete, war ausschließlich aus NOR-Gattern gebaut. NAND gewann das Rennen um Consumer-Chips; NOR gewann den Mond. Zwei Wege, ein Universum zu bauen — such dir eine Seite aus.",
        },
      ],
    },
    iota: {
      pretitle: "Thema · Berechnung",
      title: "Der Iota-Kombinator",
      tagline: "Ein Symbol, Turing-vollständig.",
      intro:
        "Iota ist die einfachste bekannte Ein-Kombinator-Basis: eine einzelne Umschreibungsregel, aus der jede berechenbare Funktion folgt. Der Reducer liest jeden SKI- oder Iota-Ausdruck und schreibt ihn Schritt für Schritt zu seiner Normalform um.",
      ctaInteractive: "→ Reducer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Kombinatorische Logik",
          title: "Zwei Buchstaben, die alles berechnen",
          body: "In den 1920er Jahren zeigten Moses Schönfinkel und Haskell Curry, dass sich die gesamte Berechnung aus zwei winzigen Regeln aufbauen lässt. Nenn sie S und K. Sie nehmen andere Dinge als Eingabe und ordnen sie um — keine Variablen nötig. Zusammen bilden sie den SKI-Kalkül, der nachweislich so mächtig ist wie jeder Lambda-Kalkül, jede Programmiersprache, jede Turing-Maschine.",
        },
        {
          pretitle: "Schritt zwei · Ein Symbol",
          title: "Chris Barkers Iota",
          body: "2001 fand Chris Barker einen einzelnen Kombinator, der sowohl S als auch K enthält. Er nannte ihn Iota (ι, ℩) und definierte ihn als ι x = x S K. Aus dieser einen Zeile lassen sich S und K wiederherstellen. Wende Iota in einem bestimmten Muster auf Iota an, und S fällt heraus. Ein anderes Muster gibt K. Mit nichts als dem Symbol ι und Klammern lässt sich jede berechenbare Funktion ausdrücken.",
        },
        {
          pretitle: "Schritt drei · Form des Beweises",
          title: "Universalität in einem einzigen Symbol",
          body: "Das Argument ist kurz. Iotas Definition liefert x S K, wenn Iota auf x angewendet wird. Wähle x geschickt — wieder Iota, angewendet auf Iota, angewendet auf Iota — und das Auseinanderfalten schält die Schichten ab, bis nur K übrig bleibt. Ein anderes Muster, und nur S bleibt übrig. Da S und K zusammen Turing-vollständig sind (Schönfinkel, 1924) und Iota beide produziert, muss Iota es allein auch sein.",
        },
        {
          pretitle: "Schritt vier · Warum das wichtig ist",
          title: "Eine philosophische Quittung",
          body: "Iota produziert keine schnellen oder lesbaren Programme — es liefert Existenzbeweise. Jeder Algorithmus, der in irgendeiner Sprache geschrieben werden kann, lässt sich als Iota-Ausdruck kodieren. Der Reducer im nächsten Raum erlaubt dir, einen Ausdruck einzutippen und Schritt für Schritt zuzuschauen, wie er sich auf die Normalform zubewegt (sofern eine existiert). Berechnung in ihrer minimalsten Form: ein einziges Symbol, eine einzige Regel, die ganze Mathematik.",
        },
      ],
    },
    rule110: {
      pretitle: "Thema · Berechnung",
      title: "Regel 110",
      tagline: "Eine Achtbit-Regel, nachweislich universell.",
      intro:
        "Ein Byte an Regel, angewendet auf eine Reihe Bits, reicht, um jede Berechnung zu kodieren. Der Simulator erlaubt dir, Regel, Saat und Geschwindigkeit live zu verändern.",
      ctaInteractive: "→ Simulator öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Der Aufbau",
          title: "Eine Reihe Zellen, eine Regel, wiederholen",
          body: "Ein elementarer Zellularautomat läuft auf einer Reihe von Zellen, die jeweils schwarz oder weiß sind. Die nächste Generation wird darunter gezeichnet: jede Zelle schaut sich selbst und ihre zwei direkten Nachbarn an — drei Zellen — und entscheidet ihre Farbe nach einer festen Regel. Acht mögliche Nachbarschaftsmuster; für jedes eine 1-Bit-Antwort. Acht Bit = ein Byte = eine von 256 möglichen Regeln. Stephen Wolfram nummerierte sie von 0 bis 255 in Binärdarstellung.",
        },
        {
          pretitle: "Schritt zwei · Regel 110 lesen",
          title: "Acht Muster, ein Byte",
          body: "Schreibe die acht Drei-Zellen-Muster in absteigender Binärreihenfolge: 111, 110, 101, …, 000. Unter jedes Muster schreibst du den Wert der nächsten Generation für die mittlere Zelle. Lies die Antwortreihe als eine einzige Binärzahl — bei Regel 110 ergibt das 01101110, also 110 in Dezimal. Die Regel ist genau dieses Byte.",
        },
        {
          pretitle: "Schritt drei · Ein Pixel wächst zu einem Universum",
          title: "Starte mit einem einzigen Punkt",
          body: "Setze die obere Reihe mit einer einzigen schwarzen Zelle, alles andere weiß. Wende die Regel an; zeichne die nächste Generation darunter. Wiederhole das für einige hundert Reihen. Bei Regel 110 ist das Ergebnis weder das langweilige Komplett-Schwarz/Weiß von Regeln wie 0 oder 255, noch das schlichte Sierpiński von Regel 90 — es ist ein permanenter Verkehr aus dreieckigen Gleitern vor einem gestreiften Hintergrund, geschichtet zu etwas, das wirklich nie zur Ruhe kommt.",
        },
        {
          pretitle: "Schritt vier · Der Beweis von Cook",
          title: "Es ist, beweisbar, ein Computer",
          body: "In den späten 1990ern zeigte Matthew Cook, wie sich bestimmte Gleitermuster in Regel 110 so anordnen lassen, dass ihre Kollisionen als Logikgatter wirken — und wie sich daraus ein funktionierendes zyklisches Tag-System zusammensetzen lässt, das selbst Turing-vollständig ist. Der Beweis ist verschachtelt, aber die Konsequenz ist sauber: diese Achtbit-Regel, angewendet auf eine Reihe Bits, ist universell. Was auch immer du berechnen kannst, kannst du in Regel 110 tun.",
        },
      ],
    },
    logistic: {
      pretitle: "Thema · Chaos",
      title: "Die logistische Abbildung",
      tagline: "Eine harmlose Formel, in der Ordnung in Chaos kippt.",
      intro:
        "Ein Spielzeugmodell für die Bevölkerung von morgen, das mit einer einzigen Stellschraube zum meistuntersuchten Stück Chaos der Mathematik wird. Der Explorer lässt dich genau diese Schraube live drehen.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Die Formel",
          title: "Eine Formel für die Bevölkerung von morgen",
          body: "Die logistische Gleichung von Pierre-François Verhulst aus dem Jahr 1845, in diskreter Zeit abgetastet, ergibt die Abbildung xₙ₊₁ = r · xₙ · (1 − xₙ). Lies x als Anteil der Kapazitätsgrenze zwischen 0 und 1; r als Wachstumsrate. Der Term (1 − x) ist die Bremse — zu viele Individuen lassen die nächste Generation verhungern. Mit 0 ≤ r ≤ 4 bleibt die Iteration beschränkt.",
        },
        {
          pretitle: "Schritt zwei · Vom Frieden ins Chaos",
          title: "Verdoppeln, verdoppeln, weg",
          body: "Für r unter 1 stirbt jede Population aus. Von 1 bis 3 stellt sich ein einzelner Fixpunkt ein — eine stabile Bevölkerung. Bei r = 3 verliert der Fixpunkt seine Stabilität und spaltet sich in einen 2-Zyklus auf: dieses Jahr hoch, nächstes Jahr runter. Bei r ≈ 3,449 wird daraus ein 4-Zyklus, bei r ≈ 3,544 ein 8-Zyklus, und die Verdoppelungen häufen sich immer schneller, bis das System bei r ≈ 3,56995 endgültig ins Chaos fällt.",
        },
        {
          pretitle: "Schritt drei · Feigenbaums universelle Konstante",
          title: "Eine Zahl, die zwischen Systemen reist",
          body: "Miss das Verhältnis der Längen zweier aufeinanderfolgender Verdoppelungs-Intervalle. Heraus kommt δ ≈ 4,66920… — Mitchell Feigenbaums Konstante. Das Erstaunliche: dieselbe Konstante taucht in völlig unzusammenhängenden Systemen auf — der Hénon-Abbildung, dem Duffing-Oszillator, sogar in experimentellen Strömungsversuchen. Periodenverdopplung ist ein universeller Weg ins Chaos, und δ ist ihr Fingerabdruck.",
        },
        {
          pretitle: "Schritt vier · Inseln der Ordnung",
          title: "Wo sich Ruhe im Chaos versteckt",
          body: "Mitten im chaotischen Regime fällt das System plötzlich in einen stabilen 3-Zyklus zurück, bei r ≈ 1 + √8 ≈ 3,8284. Von dort verdoppelt es sich erneut — Periode 6, 12, 24 — und betritt das Chaos wieder. Das Li-Yorke-Theorem macht die Pointe streng: 'Periode drei impliziert Chaos.' Robert Mays Aufsatz von 1976, 'Simple mathematical models with very complicated dynamics', stellte die ganze Geschichte den Biologen vor die Tür. Seither ist sie nicht wieder gegangen.",
        },
      ],
    },
    lorenz: {
      pretitle: "Thema · Chaos",
      title: "Der Lorenz-Attraktor",
      tagline: "Drei Zeilen Code, ein Schmetterling.",
      intro:
        "Ein Spielzeugmodell der Atmosphäre, das versehentlich die Chaostheorie erfand. Der Explorer integriert die Gleichungen live und lässt dich zusehen, wie die Bahn sich weigert, sich zu wiederholen.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Eine Spielzeug-Atmosphäre",
          title: "Lorenz, 1963",
          body: "Edward Lorenz, Meteorologe am MIT, wollte Konvektion simulieren — Luft, die unten erwärmt und oben gekühlt wird. Margaret Hamilton hatte die früheren Wetterläufe programmiert; Ellen Fetter führte die Berechnungen hinter dem Drei-Gleichungen-Modell aus. Er reduzierte das Problem auf drei Variablen und drei Gleichungen. Sein Paper von 1963, 'Deterministic Nonperiodic Flow', argumentierte, dass selbst diese radikale Vereinfachung sich unvorhersehbar verhalten kann. Es blieb über ein Jahrzehnt weitgehend ungelesen.",
        },
        {
          pretitle: "Schritt zwei · Die drei Gleichungen",
          title: "Drei gekoppelte Zeilen",
          body: "dx/dt = σ(y − x). dy/dt = x(ρ − z) − y. dz/dt = xy − βz. σ ist die Prandtl-Zahl, ρ die Rayleigh-Zahl, β das geometrische Seitenverhältnis. Die berühmten chaotischen Werte sind σ = 10, ρ = 28, β = 8/3 — von Lorenz selbst festgelegt. Verändere ρ und das System durchläuft einen langen Katalog von Verhalten — Fixpunkte, periodische Bahnen, transientes Chaos — bevor es den kanonischen Schmetterling erreicht.",
        },
        {
          pretitle: "Schritt drei · Der Schmetterling",
          title: "Ein Attraktor in 3D",
          body: "Integriere vorwärts in der Zeit, und die Bahn windet sich um zwei instabile Gleichgewichte, springt zwischen ihnen hin und her in einer Folge, die sich nie wiederholt. Die Form sieht in drei Dimensionen aus wie die Flügel eines Schmetterlings — daher der Name. Der Attraktor ist weder Kurve noch Fläche; seine Hausdorff-Dimension liegt bei etwa 2,06. Es ist ein seltsamer Attraktor: dicht in sich, niemals geschlossen, fraktal auf jeder Skala.",
        },
        {
          pretitle: "Schritt vier · Sensitive Abhängigkeit",
          title: "Warum Wettervorhersagen ein Horizont haben",
          body: "Nimm zwei Startpunkte, die sich um den Faktor 10⁻⁵ unterscheiden. Nach kurzer Zeit sind die beiden Bahnen vollständig unkorreliert. Lorenz formalisierte das als sensitive Abhängigkeit von den Anfangsbedingungen; der größte Lyapunov-Exponent ist positiv. In einem Vortrag von 1972 fragte er, ob 'der Flügelschlag eines Schmetterlings in Brasilien einen Tornado in Texas auslösen könnte' — und gab der Disziplin damit ihr Bild. Genau dieser Exponent ist es, der jede Wettervorhersage nach etwa zwei Wochen zerlaufen lässt.",
        },
      ],
    },
    fourier: {
      pretitle: "Thema · Analysis",
      title: "Die Fourier-Transformation",
      tagline: "Jedes Signal ist eine Summe von Sinuswellen.",
      intro:
        "Eine der tiefsten einzelnen Tatsachen der Mathematik — und der leise Motor von MP3, JPEG, WLAN und MRT. Der Explorer lässt dich Harmonische nacheinander hinzufügen und zusehen, wie eine Rechteckwelle aus reinen Sinüssen entsteht.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Fouriers Behauptung",
          title: "Wärmeleitung, 1822",
          body: "Joseph Fourier veröffentlichte 1822 seine 'Analytische Theorie der Wärme'. Um die Wärmegleichung zu lösen, stellte er eine ungeheuerliche Behauptung auf: jede Funktion, stetig oder springend, lässt sich als Summe reiner Sinus- und Cosinuswellen schreiben. Die Mathematiker:innen seiner Zeit glaubten ihm nicht. Es dauerte ein halbes Jahrhundert (Dirichlet, Riemann, Lebesgue), bis aus der Behauptung ein Theorem wurde.",
        },
        {
          pretitle: "Schritt zwei · Das Rezept",
          title: "Summe reiner Töne",
          body: "Für eine periodische Funktion: eine Fourier-Reihe — eine Summe über diskrete Frequenzen. Für eine beliebige integrierbare Funktion: eine Fourier-Transformierte f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — ein kontinuierliches Spektrum. Beide sagen auf unterschiedliche Weise dasselbe: ein Signal in der Zeit, wie kompliziert auch immer, zerfällt in reine Schwingungen. Ein Akkord wird zu seinen Tönen. Ein Foto wird zu seinen Streifen.",
        },
        {
          pretitle: "Schritt drei · Warum dein Handy funktioniert",
          title: "Versteckt in MP3, JPEG, MRT, WLAN",
          body: "Bestimme die wichtigen Frequenzen; wirf den Rest weg; komprimiere. MP3 behält die hörbaren Bänder und verwirft, was das Ohr nicht hört. JPEG zerlegt ein Bild in 8×8-Blöcke und behält die dominanten räumlichen Frequenzen. MRT-Scanner messen physikalisch Stichproben im Frequenzraum und transformieren rückwärts auf die Anatomie. WLAN und 5G nutzen OFDM und verteilen Daten parallel auf Tausende von Trägerfrequenzen. Die Cooley-Tukey-FFT (1965) machte all das schnell genug, um praktisch zu sein.",
        },
        {
          pretitle: "Schritt vier · Der Unschärfe-Handel",
          title: "Schärfer in der Zeit, unschärfer in der Frequenz",
          body: "Pferche ein Signal in ein schmales Zeitfenster, und seine Fourier-Transformierte verteilt sich zwangsläufig auf viele Frequenzen — und umgekehrt. Das ist keine Ingenieurstatsache; das ist Mathematik. Die Gauß-Funktion sitzt am Optimum dieses Handels: sie ist ihre eigene Fourier-Transformierte. Dieselbe Ungleichung wird in der Physik zu Heisenbergs Unschärferelation. Zeit und Frequenz sind duale Koordinaten; man kann sie nicht beide zugleich scharfstellen.",
        },
      ],
    },
    euler: en.pages.euler,
    banach: en.pages.banach,
    lsystem: en.pages.lsystem,
    wang: en.pages.wang,
    collatz: en.pages.collatz,
    doublependulum: en.pages.doublependulum,
    bzr: en.pages.bzr,
    turingpattern: en.pages.turingpattern,
    sierpinski: en.pages.sierpinski,
    chaosgame: en.pages.chaosgame,
    penrose: en.pages.penrose,
    apollonian: en.pages.apollonian,
    phi: en.pages.phi,
    buffon: en.pages.buffon,
    hilberthotel: en.pages.hilberthotel,
    gabrielshorn: en.pages.gabrielshorn,
    cantor: en.pages.cantor,
    boids: en.pages.boids,
    aizawa: en.pages.aizawa,
    dla: en.pages.dla,
    langton: en.pages.langton,
    pascalmod: en.pages.pascalmod,
    sternbrocot: en.pages.sternbrocot,
    ulam: en.pages.ulam,
    cardioid: en.pages.cardioid,
    galton: en.pages.galton,
    magpendulum: en.pages.magpendulum,
    godel: {
      pretitle: "Thema · Paradoxon",
      title: "Gödels Unvollständigkeit",
      tagline: "Die Mathematik wird nie vollständig sein.",
      intro:
        "Kurt Gödel, Wien, 1931. In jedem widerspruchsfreien formalen System, das reich genug ist, um die Arithmetik auszudrücken, gibt es wahre Aussagen, die das System selbst nicht beweisen kann. Der Explorer führt dich durch die Gödel-Nummerierung und die Konstruktion des selbstbezüglichen Satzes G, der in der Sprache der Arithmetik sagt: «Ich bin nicht beweisbar».",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Hilberts Traum",
          title: "Die ganze Mathematik mechanisieren",
          body: "Frühes zwanzigstes Jahrhundert. Whitehead und Russells Principia Mathematica (1910–1913) versuchten, jeden Satz der Arithmetik aus einem einzigen Turm logischer Axiome herzuleiten. David Hilbert verlangte in seinem Pariser Programm von 1900 und dann in seinem formalistischen Vorstoß der 1920er Jahre ein endliches, mechanisches System, aus dem sich jede wahre Aussage beweisen lässt und dessen Widerspruchsfreiheit von innen nachweisbar ist. Eine vollständige, widerspruchsfreie, entscheidbare formale Mathematik. Alle mit Papier und Geduld könnten im Prinzip jede mathematische Frage klären. Das war der Traum.",
        },
        {
          pretitle: "Schritt zwei · Die Gödel-Nummerierung",
          title: "Arithmetik, die über sich selbst spricht",
          body: "Gödels erster Schritt war ein Kodierungs-Trick. Weise jedem Symbol der formalen Sprache eine Zahl zu — ¬ → 1, ∨ → 2, ∀ → 3, =, +, ·, Klammern, Variablen und so weiter. Eine ganze Formel (s₁, s₂, …, sₖ) wird dann als die einzelne natürliche Zahl 2^s₁ · 3^s₂ · 5^s₃ · … aufeinanderfolgender Primzahlen kodiert. Wegen der Eindeutigkeit der Primfaktorzerlegung ist die Kodierung umkehrbar. Auch Beweise — also Folgen von Formeln — bekommen Zahlen. Plötzlich werden Eigenschaften wie «x ist ein Beweis von y» zu arithmetischen Prädikaten Prov(x, y), die das formale System über seine eigenen Aussagen ausdrücken kann.",
        },
        {
          pretitle: "Schritt drei · Der Diagonal-Trick",
          title: "G sagt: «G ist nicht beweisbar»",
          body: "Mit dem Diagonal-Lemma — ein direkter Nachfahre von Cantors Diagonalargument von 1891 — konstruierte Gödel einen Satz G, dessen Gödel-Nummer ⌜G⌝ ist und der arithmetisch äquivalent zu ¬∃x Prov(x, ⌜G⌝) ist: «keine Zahl x ist ein Beweis der Formel mit der Gödel-Nummer ⌜G⌝». In Klartext: G sagt «Ich bin in diesem System nicht beweisbar». Jetzt die Zange. Wenn G beweisbar ist, beweist das System eine falsche Aussage und ist widersprüchlich. Wenn G unbeweisbar ist, dann ist genau das, was G behauptet, wahr — aber das System kann es nicht beweisen. So oder so kollabiert Hilberts Traum einer vollständigen widerspruchsfreien Arithmetik. Der Zweite Unvollständigkeitssatz folgt fast unmittelbar: ein solches System kann seine eigene Widerspruchsfreiheit nicht beweisen, denn könnte es das, würde es auch G beweisen — und damit dem Ersten widersprechen.",
        },
        {
          pretitle: "Schritt vier · Wo es weiterwirkt",
          title: "Tarski, Turing, Church und jeder Beweisassistent seither",
          body: "Derselbe Diagonal-Trick taucht immer wieder auf. Alfred Tarski (1933) bewies, dass die Wahrheit in der Arithmetik innerhalb der Arithmetik nicht definierbar ist — die Undefinierbarkeit der Wahrheit. Alan Turing (1936) zeigte, dass das Halteproblem unentscheidbar ist, indem er über Turing-Maschinen diagonalisierte. Alonzo Church (1936) bewies, dass die Logik erster Stufe selbst unentscheidbar ist. Jedes dieser Ergebnisse ist strukturell ein Cousin von Gödels Satz: ein System, das reich genug ist, sich selbst zu beschreiben, enthält eine Frage über sich, die es nicht beantworten kann. Moderne Beweisassistenten — Coq, Lean, Isabelle, HOL — operieren innerhalb von Gödels Grenzen: sie können enorm viel Mathematik mechanisieren, aber sie können ihre eigene Widerspruchsfreiheit nicht beweisen, und es gibt konkrete zahlentheoretische Aussagen (Goodsteins Theorem, Paris–Harrington), die wahr und in der Peano-Arithmetik nachweislich unbeweisbar sind. Der Traum ist vorbei; das Gebäude ist größer denn je.",
        },
      ],
    },
    halting: {
      pretitle: "Thema · Berechnung",
      title: "Das Halteproblem",
      tagline: "Kein Programm kann jedes andere Programm vorhersagen.",
      intro:
        "Alan Turing, 1936. Lässt sich für ein Programm P und eine Eingabe x stets entscheiden, ob P auf x hält? Turing sagte Nein — und bewies es mit einem selbstbezüglichen Diagonal-Trick, dem keine Maschine entkommen kann. Der Explorer lässt eine Handvoll Spielzeug-Programme auf einem kleinen Band laufen, damit du zuschauen kannst, wie einige terminieren, andere ewig laufen, und ein Programm — die Diagonale D — sich in genau den Widerspruch verdreht, den Turing aufgeschrieben hat.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Die Frage",
          title: "Hält P auf x?",
          body: "Gegeben der Quellcode eines Programms P und eine Eingabe x: entscheide, ob P irgendwann fertig wird oder ob es ewig läuft. Es klingt nach etwas, das ein hinreichend kluger Analysierer immer entscheiden können müsste — Programme sind schließlich endliche Zeichenketten, und ein Computer kann sie simulieren. David Hilbert verlangte 1928 in seinem Entscheidungsproblem genau ein solches universelles Entscheidungsverfahren. Mitte der 1930er Jahre näherten sich Alonzo Church (über den λ-Kalkül) und Alan Turing (über das, was wir heute Turing-Maschinen nennen) derselben Antwort von entgegengesetzten Seiten.",
        },
        {
          pretitle: "Schritt zwei · Turings Widerspruch",
          title: "Nimm halts(P, x) an, dann baue D",
          body: "Angenommen, zum Widerspruch, es gäbe eine totale berechenbare Funktion halts(P, x), die ⊤ liefert, wenn P auf der Eingabe x hält, und sonst ⊥. Dann können wir ein neues Programm D(P) schreiben: berechne halts(P, P); liefert es ⊤, gehe in eine Endlosschleife; liefert es ⊥, halte sofort an. D ist erlaubt — jeder seiner Schritte ist nach Annahme berechenbar. Nun frage: was liefert halts(D, D)? Wenn halts(D, D) = ⊤, dann läuft D nach Definition auf der Eingabe D in eine Schleife — also hält D nicht auf D, im Widerspruch zu ⊤. Wenn halts(D, D) = ⊥, dann hält D auf D — im Widerspruch zu ⊥. Jede Antwort sprengt die Definition, also kann ein solches halts nicht existieren. (Turing 1936, ‚On Computable Numbers, with an Application to the Entscheidungsproblem'.)",
        },
        {
          pretitle: "Schritt drei · Diagonalisierung in Verkleidung",
          title: "Cantor, Gödel, Turing — derselbe Zug",
          body: "Derselbe Trick treibt Cantors Diagonale an (konstruiere eine reelle Zahl, die mit der n-ten Zahl der Liste in der n-ten Stelle nicht übereinstimmt), Gödels ersten Unvollständigkeitssatz (konstruiere einen Satz, der sagt ‚Ich bin nicht beweisbar') und Turings Halte-Argument (konstruiere ein Programm, das das Gegenteil dessen tut, was der Entscheider sagt). Jede Konstruktion legt die Kandidaten in einer Liste aus und liest entlang der Diagonale ein Objekt zusammen, das die Liste nicht enthalten kann. Das Halteproblem war das erste konkrete Entscheidungsproblem, von dem die Unentscheidbarkeit bewiesen wurde — der Moment, in dem die Grenzen der Berechenbarkeit zum Theorem wurden.",
        },
        {
          pretitle: "Schritt vier · Warum es heute zählt",
          title: "Rices Satz und die praktischen Folgen",
          body: "Rices Satz (Henry Gordon Rice, 1953) verallgemeinert Turing: jede nicht-triviale semantische Eigenschaft von Programmen — ‚gibt es jemals null zurück?', ‚leckt es Speicher?', ‚ist es bösartig?' — ist unentscheidbar. Statische Analysierer müssen daher approximieren: sie melden zu viel (Falsch-Positive) oder zu wenig (übersehene Fehler), nie beides sauber und vollständig. Compiler brechen beim Optimieren ab und weigern sich, jenseits einer Heuristik weiter zu inlinen. Antivirus-Engines können generell nie alle Schadsoftware fangen. Cloud-Autoscaler können nicht versprechen, dass ein abgegebener Job hält; sie deckeln stattdessen die CPU-Zeit. Das Halteproblem ist keine Kuriosität — es ist die Wand, an die jedes Programm-über-Programme irgendwann stößt.",
        },
      ],
    },
    pvsnp: {
      pretitle: "Thema · Berechnung",
      title: "P vs NP",
      tagline: "Die größte offene Frage der Informatik.",
      intro:
        "Manche Probleme sind leicht zu lösen. Andere sind leicht zu prüfen, sobald jemand dir die Antwort reicht. P vs NP fragt, ob diese beiden Klassen heimlich dasselbe sind — und ein Ja würde die moderne Kryptographie zertrümmern. Der Explorer ist ein kleiner 3-SAT-Solver, mit dem du sehen kannst, warum Verifikation trivial, Suche aber brutal ist: wirf eine Formel hinein und folge DPLL den Backtracking-Baum hinunter, während es Belegungen probiert und ganze Zweige mit einem einzigen Widerspruch abschneidet.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Zwei Klassen von Problemen",
          title: "Schnell lösbar vs. schnell verifizierbar",
          body: "P ist die Klasse der Entscheidungsprobleme, die eine deterministische Maschine in Polynomzeit lösen kann — zwei Zahlen multiplizieren, eine Liste sortieren, prüfen, ob ein Graph zusammenhängend ist. NP ist die Klasse, in der eine Polynomzeit-Maschine, sobald sie eine Kandidatenlösung erhält, verifizieren kann, dass die Antwort stimmt. Dass beide dasselbe sind, ist nicht offensichtlich. Sudoku ist das Schulbeispiel: ein 9×9-Gitter auszufüllen ist wirklich schwer, aber wenn eine Freundin dir ein fertiges Gitter reicht, kannst du Zeile, Spalte und Block in einem einzigen linearen Durchgang bestätigen. Der schwere Teil ist die Lösung zu finden; der leichte Teil ist sie zu prüfen.",
        },
        {
          pretitle: "Schritt zwei · NP-Vollständigkeit",
          title: "Cook 1971, Karp 1972, Levin unabhängig",
          body: "1971 bewies Stephen Cook den Satz von Cook-Levin: jedes Problem in NP lässt sich in Polynomzeit auf die boolesche Erfüllbarkeit (SAT) reduzieren. Leonid Levin veröffentlichte dasselbe Ergebnis unabhängig in der Sowjetunion. Ein Jahr später zeigte Richard Karp, dass 21 klassische Probleme — 3-SAT, Hamiltonkreis, Clique, Subset Sum, die Entscheidungsversion des Travelling Salesman — alle in Polynomzeit aufeinander reduzierbar sind. Heute geht die Liste in die Tausende: Sudoku N×N, Tetris, verallgemeinertes Minesweeper, selbst Gitter-Modelle der Proteinfaltung gehören zur selben Äquivalenzklasse. Löse eines effizient, und du hast alle gelöst. Cook-Karp-Levin-Reduktionen verwandelten eine Frage über ein Problem in eine Frage über jedes interessante Suchproblem auf einmal.",
        },
        {
          pretitle: "Schritt drei · Was, wenn P = NP?",
          title: "Kryptographie fällt, Biologie biegt sich, das Universum wird langweilig",
          body: "Ein Polynomzeit-Algorithmus für 3-SAT würde sich mit Karp-Reduktionen zusammensetzen lassen, um RSA zu knacken (Faktorisieren wird machbar), elliptische-Kurven-Kryptographie zu brechen, jede jemals aufgezeichnete TLS-Sitzung zu entschlüsseln und jede digitale Signatur zu fälschen. Proteinfaltung würde zu einem Polynomzeit-Lookup zusammenfallen. Optimale Planung, optimale Registerzuteilung im Compiler, optimale Routenplanung — alle NP-harten Probleme, die Ingenieure heute approximieren — hätten exakte polynomielle Lösungen. Die meisten Informatiker:innen wetten dagegen: Scott Aaronsons Umfrage im Fach setzt >80% auf P ≠ NP. Aber weder Beweis noch Widerlegung existieren. Die einzige Einbettung, die wir sicher kennen, ist P ⊆ NP ⊆ PSPACE ⊆ EXP, wobei P ⊊ EXP durch den Zeithierarchiesatz bewiesen ist — mindestens eine dieser Einbettungen ist also strikt, aber niemand weiß, welche.",
        },
        {
          pretitle: "Schritt vier · Der 1-Millionen-Dollar-Preis",
          title: "Clay-Millennium-Problem, 2000",
          body: "Das Clay Mathematics Institute zählte P vs NP im Mai 2000 zu den sieben Millennium-Preis-Problemen, mit 1 000 000 Dollar für eine korrekte Auflösung in beide Richtungen. Es ist das einzige der sieben, das die Alltagstechnik direkt berührt. Dutzende falscher Beweise zirkulieren jedes Jahr — Vinay Deolalikars Ankündigung von 2010 war der prominenteste jüngere Versuch und löste sich innerhalb von Wochen in Luft auf. Die gemeinschaftliche Erwartung lautet, dass die Antwort P ≠ NP ist. Die ungelöste Frage ist nicht, wie die Antwort lautet, sondern warum — und welcher Teil der Mathematik die passende Technik für untere Schranken liefern wird. Über vierzig Jahre an Barrieren (Relativierung, natürliche Beweise, Algebraisierung) sagen, sie wird nicht aus einer Methode kommen, die wir heute kennen.",
        },
      ],
    },
    rsa: {
      pretitle: "Thema · Berechnung",
      title: "RSA & Einwegfunktionen",
      tagline: "Multiplizieren ist leicht. Faktorisieren ist unmöglich.",
      intro:
        "Rivest, Shamir und Adleman, 1977 — das erste veröffentlichte Public-Key-Verfahren und, fast ein halbes Jahrhundert später, immer noch das, was den Großteil des laufenden Internets absichert. Der Explorer führt dich an kleinen Zahlen durch eine vollständige RSA-Schlüsselerzeugung, Verschlüsselung und Entschlüsselung, damit du jeden Schritt siehst: Primzahlen wählen, öffentlichen und privaten Exponenten ableiten, dann eine Nachricht verschlüsseln und zusehen, wie dieselbe Mathematik sie wieder aufzieht.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Die Asymmetrie",
          title: "Einwegfunktionen: leicht vorwärts, schwer zurück",
          body: "Zwei riesige Primzahlen p und q zu multiplizieren ist schnell — wenige Millisekunden auf einem Smartphone. p und q aus ihrem Produkt n = p · q wiederzugewinnen, ist es nicht: der beste bekannte klassische Algorithmus (das allgemeine Zahlkörpersieb) läuft in subexponentieller, aber superpolynomieller Zeit, und ein 2048-Bit-n liegt bequem außerhalb der Reichweite jeder je gebauten Maschine. Diese Einweg-Eigenschaft — billig vorwärts, ruinös teuer rückwärts — ist das Fundament der Public-Key-Kryptographie. RSA kleidet die Asymmetrie so ein, dass ein öffentlicher Schlüssel an jeden weitergegeben werden kann und nur der Inhaber des passenden privaten Schlüssels lesen kann, was zurückgeschrieben wurde.",
        },
        {
          pretitle: "Schritt zwei · Schlüsselerzeugung",
          title: "Wähle e, leite d über den erweiterten Euklid ab",
          body: "Berechne φ(n) = (p − 1)(q − 1), Eulers Totient — die Anzahl der zu n teilerfremden Zahlen in [1, n]. Wähle einen kleinen öffentlichen Exponenten e, teilerfremd zu φ(n); 65537 ist die kanonische Wahl, weil es prim ist, nur zwei gesetzte Bits hat und jeden bekannten Angriff mit kleinem Exponenten übersteht. Berechne dann den privaten Exponenten d = e⁻¹ mod φ(n) mit dem erweiterten euklidischen Algorithmus: er liefert Bézout-Koeffizienten (x, y) mit e·x + φ(n)·y = 1, und x mod φ(n) ergibt d. Der öffentliche Schlüssel ist das Paar (n, e); der private Schlüssel ist (n, d). Wirf p und q weg, sobald du d in der Hand hast.",
        },
        {
          pretitle: "Schritt drei · Verschlüsseln und entschlüsseln",
          title: "c = m^e mod n,   m = c^d mod n",
          body: "Behandle den Klartext m als ganze Zahl in [0, n). Der Geheimtext ist c = m^e mod n; entschlüsselt wird mit m = c^d mod n. Der Grund, warum das funktioniert, kommt direkt von Euler und Fermat: weil ed ≡ 1 mod φ(n), gilt m^(ed) = m^(1 + kφ(n)) ≡ m mod n für jedes zu n teilerfremde m (Eulers Satz), und ein kurzes Argument mit dem chinesischen Restsatz dehnt die Identität auf jedes m in [0, n) aus. Square-and-Multiply verwandelt die riesigen Exponenten in ein paar tausend modulare Multiplikationen — in der Praxis schnell, mathematisch exakt.",
        },
        {
          pretitle: "Schritt vier · Wo es heute steht",
          title: "Von TLS zur Post-Quanten-Migration",
          body: "RSA ist die Mathematik unter jedem TLS-Handshake, den dein Browser noch mit einem RSA-Zertifikat aushandelt, unter SSH-Host-Schlüsseln, unter den Code-Signing-Ketten, die Apps von Apple und Google authentifizieren, unter elektronischen Reisepässen und den frühen Generationen der Blockchain. Doch 1994 schrieb Peter Shor einen Quantenalgorithmus auf, der ganze Zahlen in Polynomzeit faktorisiert — sobald ein hinreichend großer fehlertoleranter Quantencomputer existiert, bricht RSA. Noch existiert keiner, aber der Zeitplan ist unsicher genug, dass NIST Post-Quanten-Nachfolger standardisiert hat (CRYSTALS-Kyber für den Schlüsselaustausch 2024, CRYSTALS-Dilithium für Signaturen), und die weltweite Migration ist bereits im Gange.",
        },
      ],
    },
    mobius: {
      pretitle: "Thema · Geometrie",
      title: "Möbiusband & Kleinsche Flasche",
      tagline: "Flächen mit nur einer Seite.",
      intro:
        "Nimm einen Papierstreifen, gib ihm eine halbe Drehung, klebe die Enden zusammen — und du hast eine Fläche mit einer Seite und einer Kante. Der Explorer zeigt ein rotierendes 3D-Möbiusband, das du an verschiedenen Verhältnissen aufschneiden kannst, um zu sehen, was dabei herausfällt: in der Mitte aufschneiden, und es bleibt ein Stück; auf einem Drittel aufschneiden, und du bekommst zwei ineinander verschlungene Ringe. Eine Schaltfläche wechselt zur Kleinschen Flasche, dem geschlossenen Analogon, das vier Dimensionen braucht, um ohne Selbstschnitt zu existieren.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Die halbe Drehung",
          title: "Klebe die Enden mit einem Dreh",
          body: "Nimm einen rechteckigen Papierstreifen. Gib einem Ende eine halbe Drehung (180°), bevor du es ans andere klebst. Das Ergebnis hat eine Kante und eine Seite. Wandere mit einem Stift darüber, und du bedeckst, was wie beide ‚Seiten' aussieht, ohne je den Rand zu überqueren; verfolge die Kante, und du kommst erst nach zwei Umrundungen wieder am Startpunkt an. Unabhängig entdeckt von August Ferdinand Möbius und Johann Benedict Listing 1858 — die erste nicht-orientierbare Fläche, die jemals explizit aufgeschrieben wurde. Ihre Euler-Charakteristik ist χ = 0.",
        },
        {
          pretitle: "Schritt zwei · Überraschungen mit der Schere",
          title: "Was Schnitte über Topologie verraten",
          body: "Schneide das Möbiusband in der Mitte auf. Es fällt nicht auseinander — du erhältst einen längeren Streifen mit zwei vollen Drehungen (vier halben Drehungen), und entscheidend: dieser Streifen ist wieder zweiseitig. Schneide ein Möbiusband ein Drittel vom Rand entfernt auf, parallel zur Kante einmal ringsum, und die Schere reist zweimal um das Band, bevor sich der Schnitt schließt: heraus kommen zwei ineinander verschlungene Ringe — ein schmäleres, neues Möbiusband (innen, mit nach wie vor einer halben Drehung) und ein längerer, zweiseitiger Ring mit zwei vollen Halbdrehungen, der kein Möbiusband mehr ist, beide ineinander gehakt. Die Topologie steckt voller solcher Überraschungen — die globale Verdrehung, die sich hinter lokaler Flachheit versteckt.",
        },
        {
          pretitle: "Schritt drei · Die Kleinsche Flasche",
          title: "Felix Klein, 1882",
          body: "Nimm jetzt einen Schlauch und klebe ein Ende ans andere, nachdem du es durch die Wand des Schlauchs gefädelt hast — die Kreise dabei mit entgegengesetzter Orientierung aufeinanderlegend. Im vierdimensionalen Raum ist das eine vollkommen glatte, geschlossene, nicht-orientierbare Fläche: keine Kante, kein Innen, kein Außen. Felix Klein beschrieb sie 1882. In drei Dimensionen zwingt das Durchfädeln den Schlauch, sich selbst zu durchdringen, sodass jede gläserne Kleinsche Flasche, die du je gesehen hast, eine Immersion ist und keine echte Einbettung. Klebt man zwei Möbiusbänder entlang ihrer einzigen Kante zusammen, ist das Ergebnis genau eine Kleinsche Flasche.",
        },
        {
          pretitle: "Schritt vier · Wo sie leben",
          title: "Von Antriebsriemen zur Chemie",
          body: "Möbiusbänder tauchen als Förder- und Druckerbänder auf (der Verschleiß verteilt sich auf die gesamte Fläche und verdoppelt die Lebensdauer), als Max Bills Skulpturen ‚Unendliche Schleife', als Möbius-Widerstände, die ihre eigene Selbstinduktion auslöschen, als supraleitende Mikrowellen-Möbius-Wellenleiter — und seit 2003 als möbius-aromatische Moleküle, die Rainer Herges synthetisierte. Das vertraute Recycling-Dreieck ist streng genommen ein Möbiusband mit drei Halbdrehungen — immer noch einseitig, aber stärker verdreht als das klassische Ein-Halbdrehungs-Band. Vor allem aber sind das Möbiusband und die Kleinsche Flasche die Einstiegstore zur Klassifikation der Flächen — dem Theorem, dass jede geschlossene Fläche bis auf Homöomorphie durch Geschlecht, Orientierbarkeit und eine einzige ganze Zahl χ bestimmt ist.",
        },
      ],
    },
    eulerchar: {
      pretitle: "Thema · Geometrie",
      title: "Die Euler-Charakteristik",
      tagline: "V − E + F = 2, ganz gleich, welche Form.",
      intro:
        "Descartes schrieb sie 1639 auf, und Euler entdeckte sie ein Jahrhundert später wieder: zähle die Ecken, Kanten und Flächen eines beliebigen konvexen Polyeders, und V − E + F ergibt stets 2. Der Explorer geht durch die platonischen und archimedischen Körper und zählt V, E, F live mit — du siehst, wie die Formel über Würfel, Dodekaeder und Fußball hinweg standhält. Dann biege die Fläche um einen Donut und sieh zu, wie die Konstante sich ändert.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Zähle Ecken, Kanten, Flächen",
          title: "Die Konstante, die sich nicht bewegen lässt",
          body: "Nimm einen Würfel: 8 Ecken, 12 Kanten, 6 Flächen. Ziehe ab und addiere: 8 − 12 + 6 = 2. Probier ein Tetraeder: 4 − 6 + 4 = 2. Der Fußball — ein abgestumpftes Ikosaeder, zwölf Fünfecke und zwanzig Sechsecke entlang ihrer Kanten zusammengenäht — hat 60 Ecken, 90 Kanten, 32 Flächen, und 60 − 90 + 32 = 2, wieder einmal. Geh jeden platonischen und archimedischen Körper durch, den die Griechen je gezeichnet haben, und die Antwort ist dieselbe. Die Konstante ist kein Zufall.",
        },
        {
          pretitle: "Schritt zwei · Topologie, nicht Geometrie",
          title: "Drücke den Würfel in eine Kugel",
          body: "Blase den Würfel auf, bis er sich zu einer perfekten Kugel ausbeult. Die Ecken runden sich ab, die geraden Kanten krümmen sich, die flachen Flächen wölben sich nach außen — V − E + F ist immer noch 2. Dasselbe gilt, wenn du ihn zu einem Pfannkuchen plattdrückst, in ein Ei drehst oder in jede Form ziehst, die dir gefällt, solange du nicht zerreißt, klebst oder ein Loch hineinschlägst. Die Zahl hängt nur von der Topologie ab. χ = 2 für jede Form, die topologisch einer Kugel entspricht — für die Oberfläche jedes konvexen Polyeders, jedes glatten Ovoids, jeder Kartoffel.",
        },
        {
          pretitle: "Schritt drei · Löcher senken sie",
          title: "Jeder Henkel kostet dich zwei",
          body: "Wickle die Fläche jetzt um einen Donut. Triangulier den Torus, wie du willst — V − E + F fällt auf 0. Ein Doppeltorus, zwei Donuts Seite an Seite verklebt, liefert χ = −2. Die Regel ist χ = 2 − 2g, wobei g die Anzahl der Löcher ist (das Geschlecht). Jeder Henkel, den du annähst, kostet dich 2. Die Euler-Charakteristik misst Topologie in einer einzigen ganzen Zahl: sie verrät dir, wie viele Löcher eine geschlossene Fläche hat, ganz gleich, wie sie gezeichnet oder gedehnt ist.",
        },
        {
          pretitle: "Schritt vier · Warum das zählt",
          title: "Vom Fußball zur Fields-Medaille",
          body: "Die Chemie der Buckybälle wird durch χ erzwungen: jeder Fulleren-Käfig aus Fünfecken und Sechsecken muss genau 12 Fünfecke enthalten, weil die Euler-Charakteristik einer Kugel 2 ist. Buckminster Fullers geodätische Kuppeln folgen derselben Regel. 3D-Druck-Slicer nutzen V − E + F, um zu prüfen, ob ein Netz geschlossen und druckbar ist. Gauß-Bonnet verknüpft die Gesamtkrümmung einer glatten Fläche mit 2π·χ und bindet so Geometrie an Topologie in einer einzigen Gleichung. Der Atiyah-Singer-Indexsatz (Fields-Medaille 1966) ist der moderne Nachfahre derselben Idee — und Lakatos' ‚Beweise und Widerlegungen' zeichnet die zwei Jahrhunderte an Grenzfällen nach, die V − E + F = 2 fast gebrochen und dann gestärkt haben.",
        },
      ],
    },
    konigsberg: {
      pretitle: "Thema · Analysis",
      title: "Die Königsberger Brücken",
      tagline: "Sieben Brücken, ein unmöglicher Spaziergang.",
      intro:
        "Könntest du durch Königsberg laufen, jede Brücke genau einmal überqueren und wieder dort enden, wo du angefangen hast? Der Explorer lässt dich den Spaziergang selbst probieren, das Paritätsargument live mitlaufen sehen, während du Brücke für Brücke überquerst, und Brücken hinzufügen oder entfernen, um den Spaziergang möglich zu machen.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Das Rätsel",
          title: "Ein Spaziergang, den niemand fand",
          body: "Königsberg lag rittlings über dem Pregel mit zwei Inseln und zwei Flussufern — insgesamt vier Landstücke — verbunden durch sieben Brücken. Die Bürger:innen stellten eine Sonntagsspaziergang-Frage: könnte man durch die Stadt laufen, jede Brücke genau einmal überqueren und am Startpunkt enden? Alle versuchten es. Alle scheiterten. Niemand konnte beweisen, dass es unmöglich war.",
        },
        {
          pretitle: "Schritt zwei · Eulers Reduktion",
          title: "Aus Geometrie wird Topologie",
          body: "1736 tat Leonhard Euler etwas, das niemand zuvor getan hatte. Er ignorierte Entfernungen. Er ignorierte Winkel. Er ignorierte, welche Brücke flussaufwärts von welcher lag. Er zeichnete die vier Landstücke als vier Punkte und die sieben Brücken als sieben Kanten. Die Karte wurde zu einem Graphen. Das Problem der Lage — geometria situs — war geboren, und mit ihm zugleich Graphentheorie und Topologie.",
        },
        {
          pretitle: "Schritt drei · Das Paritätsargument",
          title: "Jedes Landstück braucht eine gerade Anzahl",
          body: "Jedes Mal, wenn du ein Landstück betrittst, nutzt du eine Brücke; wenn du es verlässt, eine andere. Also braucht jedes Landstück eine gerade Anzahl anliegender Brücken — außer vielleicht Anfang und Ende des Spaziergangs. Königsberg hatte vier Landstücke, alle mit einer ungeraden Anzahl Brücken. Vier Knoten ungeraden Grades sind zwei zu viel. Unmöglich.",
        },
        {
          pretitle: "Schritt vier · Die Geburt der Graphentheorie",
          title: "Vom Sonntagsspaziergang zur modernen Welt",
          body: "Dasselbe Paritätsargument treibt heute GPS-Routing an, das Chinese-Postman-Problem (eingesetzt zur Routenoptimierung für Schneepflüge, Müllwagen und Briefträger:innen) und die DNA-Assemblierung — jeder moderne Genom-Assembler läuft einen eulerschen Pfad durch einen de-Bruijn-Graphen. Der Zweite Weltkrieg zerstörte zwei von Königsbergs Brücken; nur fünf der ursprünglichen sieben sind übrig. Der heutige Graph hat genau zwei Knoten ungeraden Grades, also ist der Spaziergang heute endlich möglich — auch wenn Euler nicht mehr da ist, um ihn zu unternehmen.",
        },
      ],
    },
    fourcolor: {
      pretitle: "Thema · Analysis",
      title: "Der Vierfarbensatz",
      tagline: "Jede flache Karte braucht höchstens vier Farben.",
      intro:
        "Jede in der Ebene gezeichnete Karte lässt sich mit höchstens vier Farben so einfärben, dass zwei aneinandergrenzende Regionen nie dieselbe Farbe bekommen. Der Explorer lässt dich Karten bauen und einem Backtracking-Färbealgorithmus zuschauen, der Region für Region höchstens vier Farben verteilt — immer mit der kleinsten gültigen Wahl.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Die Vermutung",
          title: "Francis Guthrie, 1852",
          body: "Als der junge Francis Guthrie eine Karte der englischen Grafschaften einfärbte, bemerkte er, dass vier Farben immer auszureichen schienen. Er fragte seinen Bruder Frederick, der fragte ihren Lehrer Augustus De Morgan, der wiederum alle fragte. Die Vermutung sah harmlos aus — und brachte Mathematiker:innen 124 Jahre lang ins Stocken. Mehrere veröffentlichte Beweise (Kempe 1879, Tait 1880) entpuppten sich als Beweise mit feinen Lücken, die über ein Jahrzehnt lang niemand bemerkte.",
        },
        {
          pretitle: "Schritt zwei · Warum drei nicht reicht und fünf zu viel ist",
          title: "Vier ist die scharfe Schranke",
          body: "Drei Farben reichen nachweislich nicht — vier paarweise benachbarte Regionen lassen sich in der Ebene bereits zeichnen (denk an drei Länder, die an einer Ecke aufeinandertreffen, mit einem vierten ringsherum). Der Fünffarbensatz, von Heawood 1890 bewiesen, ist auf einer Seite mit Eulers Formel V − E + F = 2 und einem sorgfältigen Gradargument beweisbar. Die Lücke von fünf herunter auf vier zu schließen, brauchte weitere sechsundachtzig Jahre.",
        },
        {
          pretitle: "Schritt drei · Der Appel-Haken-Beweis, 1976",
          title: "Der erste vom Computer bewiesene Satz",
          body: "Kenneth Appel und Wolfgang Haken an der University of Illinois reduzierten das Problem auf eine endliche Liste von 1834 «unvermeidbaren Konfigurationen» — und zeigten dann, dass jede davon reduzibel ist. Ihr Beweis lief etwa 1200 Stunden auf einem IBM 370. Viele Mathematiker:innen weigerten sich, ihn zu akzeptieren: ein Beweis, den ein Mensch nicht zur Gänze lesen kann, argumentierten sie, sei kein Beweis. Die ausgehende Post der Mathematik-Abteilung der University of Illinois wurde jahrelang mit «Four Colors Suffice» freigestempelt.",
        },
        {
          pretitle: "Schritt vier · Wo es heute steht",
          title: "Robertson-Sanders-Seymour-Thomas, Gonthier und weiter",
          body: "1996 vereinfachten Robertson, Sanders, Seymour und Thomas den Beweis auf 633 Konfigurationen und ein saubereres Entladungsargument. 2005 mechanisierte Georges Gonthier den gesamten Beweis innerhalb des Beweisassistenten Coq — jeden logischen Schritt, einschließlich der Fallanalyse, maschinell verifiziert vom Anfang bis zum Ende. Der Satz treibt heute die Frequenzzuweisung in Mobilfunknetzen, die Registerzuteilung in Compilern und Stundenplan- sowie Routenplanungsprobleme überall dort, wo Konflikte einen planaren Graphen bilden.",
        },
      ],
    },
    smallworld: {
      pretitle: "Thema · Analysis",
      title: "Sechs Grade & kleine Welten",
      tagline: "Zwei beliebige Menschen, sechs Händedrücke voneinander entfernt.",
      intro:
        "Stanley Milgram schickte Briefe an Fremde und stellte fest, dass im Schnitt sechs Weiterleitungen sie quer durch Amerika brachten. Vierzig Jahre später zeigten Watts und Strogatz, warum: eine Prise zufälliger Abkürzungen in einem sonst regelmäßigen Netz lässt die mittlere Pfadlänge einbrechen, ohne das lokale Clustering anzurühren. Der Explorer lässt dich die Watts-Strogatz-Umverdrahtungswahrscheinlichkeit p einstellen und in Echtzeit zusehen, wie die mittlere Pfadlänge L kollabiert.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Das Brief-Experiment",
          title: "Milgram, 1967",
          body: "Stanley Milgram, damals in Harvard, schickte Briefe an zufällige Menschen in Omaha und Wichita und bat sie, den Brief von Hand zu Hand an einen Ziel-Börsenmakler in Boston weiterzuleiten — aber nur über jemanden, den sie persönlich beim Vornamen kannten. Die meisten Briefe kamen nie an. Die, die es schafften, brauchten im Schnitt etwa sechs Glieder vom Absender bis zum Ziel. Die popkulturelle Phrase «sechs Grade der Trennung» war geboren. Die Abkürzung: die Gesellschaft hat Knotenpunkte, und die Knotenpunkte erledigen den Großteil der Vermittlung.",
        },
        {
          pretitle: "Schritt zwei · Watts und Strogatz, 1998",
          title: "Umverdrahten mit Wahrscheinlichkeit p",
          body: "Starte mit einem Ringgitter: N Knoten auf einem Kreis, jeder mit seinen k nächsten Nachbarn auf jeder Seite verbunden. Der Graph hat einen hohen Cluster-Koeffizienten C — deine Freunde sind miteinander befreundet — aber eine lange mittlere Pfadlänge L in der Größenordnung von N/k. Verdrahte nun jede Kante mit Wahrscheinlichkeit p zu einem zufälligen Ziel um. Mit steigendem p von 0 fällt L logarithmisch, während C kaum von der Stelle rückt. Wenige zufällige Abkürzungen schrumpfen die Welt. Genau in diesem Zwischenbereich, um p ≈ 0,01 bis 0,1, liegt das Kleine-Welt-Regime: hohes C wie ein Gitter, niedriges L wie ein Zufallsgraph.",
        },
        {
          pretitle: "Schritt drei · Wo die Welt wirklich klein ist",
          title: "Filme, Gehirne, Netze, das Web",
          body: "Akademische Kollaborationsgraphen gaben uns die Erdős-Zahl; Hollywood gab uns die Bacon-Zahl (das Spiel «Six Degrees of Kevin Bacon»). Der Wurm C. elegans hat ein vollständig kartiertes 302-Neuronen-Gehirn mit Kleine-Welt-Konnektivität; menschliche Konnektome zeigen dieselbe Signatur auf weit größerer Skala. Stromnetze, das Internet, Zitationsnetzwerke, der Linkgraph der Wikipedia, Protein-Interaktionsnetzwerke — das Kleine-Welt-Regime taucht überall dort wieder auf, wo sich jemand die Mühe macht, L und C zu messen. Die Welt ist strukturell fast überall klein.",
        },
        {
          pretitle: "Schritt vier · Folgen",
          title: "Schnelle Ausbreitung, kluge Suche, kranke Gehirne",
          body: "In Kleine-Welt-Netzen erreichen Viren, Gerüchte und Ideen schnell alle — wunderbar für die Diffusion von Innovationen, schrecklich während einer Pandemie. Kleinberg (2000) bewies, dass dezentrale Greedy-Suche in kleinen Welten nur dann gelingt, wenn die Abkürzungsverteilung den richtigen Exponenten hat — was erklärt, warum Milgrams Brief-Weiterleiter:innen das Ziel überhaupt finden konnten. Und die klinische Neurowissenschaft nutzt heute Kleine-Welt-Koeffizienten (σ, ω) als Biomarker: Alzheimer und Schizophrenie zeigen beide messbare Abweichungen von der gesunden Kleine-Welt-Signatur.",
        },
      ],
    },
  },
  storyLabels: {
    nowTryIt: "Jetzt probier es.",
    readyToFly: "Bereit zu fliegen?",
    yourTurn: "Du bist dran.",
    stepIntoIt: "Tritt ein.",
    buildWithOne: "Mit einem Stein bauen.",
  },
};

// Other locales currently fall back to English content for these story pages;
// nav labels and topic taglines remain fully translated in the main atlas dict.
export const STORIES: Record<Locale, StoriesDict> = {
  en,
  de,
  es,
  fr,
  it,
  pt,
  sv,
  no,
};
