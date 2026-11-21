// English search-facing copy for the story pages. The atlas taglines are
// written for the cards (short, playful) and make poor meta descriptions, so
// each topic gets a 140 to 160 character description that names the term
// people actually search for. A `title` here only overrides the <title>/OG
// title; the visible h1 keeps the atlas wording.
//
// Keep punctuation dash-free and keep every claim backed by the story page.

import type { TopicId } from "@/lib/topics";

export interface TopicSeoCopy {
  title?: string;
  description: string;
}

export const TOPIC_SEO: Record<TopicId, TopicSeoCopy> = {
  mandelbrot: {
    description:
      "The Mandelbrot set explained: iterate z² + c from zero and keep the points that stay bounded. Zoom into its endlessly detailed edge in an interactive explorer.",
  },
  life: {
    description:
      "Conway's Game of Life explained: four simple rules on a grid give rise to gliders, oscillators, glider guns and even a Turing machine. Run it in a live sandbox.",
  },
  nand: {
    title: "NAND and the Sheffer Stroke",
    description:
      "Why the NAND gate (the Sheffer stroke) is functionally complete: AND, OR, NOT and XOR can all be built from NAND alone. Wire your own circuits in the builder.",
  },
  sat: {
    title: "Boolean Satisfiability (SAT)",
    description:
      "Boolean satisfiability (SAT) explained: the first problem proved NP-complete, why every hard problem reduces to it, and how DPLL solvers search for an answer.",
  },
  iota: {
    description:
      "The Iota combinator explained: one symbol that rebuilds the S and K combinators and with them every computable function. A Turing-complete language in one sign.",
  },
  rule110: {
    title: "Rule 110 Cellular Automaton",
    description:
      "Rule 110 explained: an elementary cellular automaton with an eight-bit rule that Matthew Cook proved Turing-complete. Watch it compute in a live simulator.",
  },
  logistic: {
    description:
      "The logistic map explained: a population formula whose period doubling ends in chaos, governed by the Feigenbaum constant. Explore the bifurcation diagram.",
  },
  lorenz: {
    description:
      "The Lorenz attractor explained: three differential equations from a model of the atmosphere trace the butterfly of chaos theory. See the butterfly effect live.",
  },
  fourier: {
    description:
      "The Fourier transform explained: every signal is a sum of sine waves. Build waves from harmonics, read their spectrum and hear why MP3, JPEG and MRI rely on it.",
  },
  euler: {
    description:
      "Euler's identity, e^iπ + 1 = 0, explained: how e, i, π, 0 and 1 meet on the unit circle, built up from Taylor series. Explore the complex exponential yourself.",
  },
  banach: {
    title: "The Banach-Tarski Paradox",
    description:
      "The Banach-Tarski paradox explained: with the axiom of choice, a solid ball is cut into finitely many pieces and reassembled into two balls of the same size.",
  },
  lsystem: {
    title: "L-Systems (Lindenmayer Systems)",
    description:
      "L-systems (Lindenmayer systems) explained: simple letter rewriting rules plus turtle graphics grow fractal plants, ferns and trees. Write your own rules live.",
  },
  wang: {
    description:
      "Wang tiles explained: square tiles with coloured edges that can simulate any Turing machine and force tilings that never repeat. Try matching tiles yourself.",
  },
  collatz: {
    description:
      "The Collatz conjecture (the 3n + 1 problem): halve even numbers, triple odd ones and add one. Does every start reach 1? Plot trajectories and the reverse tree.",
  },
  doublependulum: {
    description:
      "The double pendulum explained: two linked pendulums, two angles, and complete chaos. Watch nearly identical starts drift apart in a live physics simulation.",
  },
  bzr: {
    title: "The Belousov-Zhabotinsky Reaction",
    description:
      "The Belousov-Zhabotinsky reaction explained: an oscillating chemical reaction that forms rotating spiral waves, modelled by reaction diffusion. Simulate it.",
  },
  turingpattern: {
    description:
      "Turing patterns explained: Alan Turing's 1952 reaction diffusion theory of how spots and stripes form on leopards and zebras. Grow them in a Gray-Scott model.",
  },
  sierpinski: {
    description:
      "The Sierpiński triangle explained: one fractal reached by three routes, recursive subdivision, the chaos game and Pascal's triangle mod 2. Draw it yourself.",
  },
  chaosgame: {
    description:
      "The chaos game explained: pick a random corner, jump halfway, repeat. Pure randomness draws a perfect Sierpiński triangle, and other rules draw Barnsley's fern.",
  },
  penrose: {
    description:
      "Penrose tilings explained: two tile shapes cover the plane with fivefold symmetry and never repeat, tied to the golden ratio and to quasicrystals. Explore them.",
  },
  apollonian: {
    title: "The Apollonian Gasket",
    description:
      "The Apollonian gasket explained: circles packed into the gaps between tangent circles forever, linked by Descartes' circle theorem and integer curvatures.",
  },
  phi: {
    title: "The Golden Ratio and Fibonacci",
    description:
      "The golden ratio φ and the Fibonacci sequence: why ratios of Fibonacci numbers approach 1.618 and how sunflower seed spirals use the same number. Explore it.",
  },
  buffon: {
    description:
      "Buffon's needle explained: drop needles on lined paper, count how many cross a line and estimate pi from probability. Watch the Monte Carlo estimate converge.",
  },
  hilberthotel: {
    title: "Hilbert's Hotel Paradox",
    description:
      "Hilbert's Hotel paradox explained: a full hotel with infinitely many rooms can still take in new guests, even infinitely many. A playful start to infinite sets.",
  },
  gabrielshorn: {
    description:
      "Gabriel's horn explained: rotate y = 1/x around the x axis and get a shape with finite volume π but infinite surface area, the painter's paradox. Explore it.",
  },
  cantor: {
    description:
      "Cantor's diagonal argument explained: why the real numbers are uncountable and infinity comes in different sizes, from the diagonal trick to the power set.",
  },
  boids: {
    title: "Boids: Flocking from Three Rules",
    description:
      "The Boids flocking algorithm explained: Craig Reynolds' three rules (separation, alignment, cohesion) make birds and fish swarm. Tune a live flock simulation.",
  },
  dla: {
    description:
      "Diffusion-limited aggregation (DLA) explained: random walkers stick to a growing cluster and form branching fractals like coral, lichen and lightning. Grow one.",
  },
  langton: {
    description:
      "Langton's ant explained: two rules on a grid give about ten thousand steps of chaos, then a repeating highway nobody has proven must appear. Run the ant.",
  },
  pascalmod: {
    description:
      "Pascal's triangle mod n: colour each binomial coefficient by its remainder and fractals such as the Sierpiński triangle appear, explained by Kummer's theorem.",
  },
  sternbrocot: {
    title: "The Stern-Brocot Tree",
    description:
      "The Stern-Brocot tree explained: insert mediants between neighbouring fractions and every positive rational appears exactly once, tied to continued fractions.",
  },
  ulam: {
    description:
      "The Ulam spiral explained: write the integers in a square spiral, mark the primes, and they line up along diagonals tied to quadratic polynomials. Explore it.",
  },
  aizawa: {
    description:
      "The Aizawa attractor explained: three coupled equations wind a single point into a torus pierced by a spike, a classic strange attractor. Rotate it in 3D.",
  },
  cardioid: {
    description:
      "The coffee cup cardioid explained: light reflected inside a cup draws a heart-shaped caustic, the same cardioid that forms the main bulb of the Mandelbrot set.",
  },
  galton: {
    description:
      "The Galton board explained: balls bouncing left or right through pegs always pile up into a bell curve, the central limit theorem and normal distribution.",
  },
  magpendulum: {
    title: "The Magnetic Pendulum Fractal",
    description:
      "The magnetic pendulum explained: an iron bob swinging over three magnets is deterministic but unpredictable. Colour each start by its magnet to see a fractal.",
  },
  godel: {
    title: "Gödel's Incompleteness Theorems",
    description:
      "Gödel's incompleteness theorems explained: every consistent system rich enough for arithmetic has true statements it cannot prove. See the self-reference trick.",
  },
  halting: {
    description:
      "The halting problem explained: Alan Turing's 1936 proof that no program can decide, for every program and input, whether it halts. See the diagonal trick.",
  },
  pvsnp: {
    title: "The P vs NP Problem",
    description:
      "P vs NP explained: if an answer is quick to check, is it also quick to find? The biggest open question in computer science and a Millennium Prize Problem.",
  },
  rsa: {
    title: "RSA Encryption and One-Way Functions",
    description:
      "RSA encryption explained: multiplying two primes is easy, factoring the product is hard. Encrypt and decrypt a message step by step to see public-key crypto.",
  },
  mobius: {
    title: "Möbius Strip and Klein Bottle",
    description:
      "The Möbius strip and Klein bottle explained: surfaces with only one side, where an ant reaches the other face without crossing an edge. Rotate them in 3D.",
  },
  eulerchar: {
    title: "The Euler Characteristic",
    description:
      "The Euler characteristic explained: vertices minus edges plus faces equals 2 for each polyhedron without holes, and every hole changes it. Topology in one line.",
  },
  konigsberg: {
    title: "The Seven Bridges of Königsberg",
    description:
      "The seven bridges of Königsberg explained: how Euler proved in 1736 that no walk crosses every bridge exactly once, and founded graph theory on the way. Try it.",
  },
  fourcolor: {
    description:
      "The four colour theorem explained: every flat map can be coloured with four colours so that neighbours differ, the first major proof that relied on a computer.",
  },
  smallworld: {
    title: "Six Degrees and Small-World Networks",
    description:
      "Six degrees of separation explained: Milgram's letter experiment and the Watts-Strogatz small-world network, where a few shortcuts bring everyone close.",
  },
  backprop: {
    description:
      "Backpropagation explained: how neural networks learn with the chain rule and gradient descent, step by step. Train a tiny network and watch its weights change.",
  },
  diffusion: {
    description:
      "Diffusion models explained: how image generators such as Stable Diffusion learn to reverse added noise step by step, turning static into pictures. See it live.",
  },
  riemann: {
    description:
      "The Riemann hypothesis explained: do all nontrivial zeros of the zeta function lie on the critical line? Why it governs the primes and carries a $1M prize.",
  },
};
