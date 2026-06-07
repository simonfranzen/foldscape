// Shared placeholder topic copy. The 15 second-wave topics use these
// English-only descriptions across all locales; localised versions can be
// dropped in per-locale by spreading after this map.

export interface TopicMeta {
  title: string;
  tagline: string;
  body: string;
}

import type { TopicId } from "../topics";

type PlaceholderId = Exclude<
  TopicId,
  | "nand"
  | "iota"
  | "life"
  | "rule110"
  | "logistic"
  | "mandelbrot"
  | "lorenz"
  | "fourier"
  | "euler"
  | "banach"
>;

export const EN_PLACEHOLDERS: Record<PlaceholderId, TopicMeta> = {
  lsystem: {
    title: "L-Systems",
    tagline: "Letter-by-letter rewrites that grow into plants",
    body: "An L-system (Lindenmayer system) starts with a string of letters and a handful of rewrite rules. At each step every letter is replaced according to the rules, simultaneously. Interpret the resulting string as a turtle-drawing command set and you get fractal ferns, coral, tree branches — botany derived from a few characters.",
  },
  wang: {
    title: "Wang Tiles",
    tagline: "Square tiles with coloured edges, secretly a computer",
    body: "A Wang tile is a unit square whose four edges carry colours. Tiles must be placed so adjacent edges match; rotation is forbidden. With the right finite set of tiles you can simulate any Turing machine — and force the tiling pattern to never repeat. Computation and aperiodicity, hiding in colour matching.",
  },
  collatz: {
    title: "The Collatz Conjecture",
    tagline: "Halve it if even, triple-plus-one if odd",
    body: "Start with any positive integer. If it is even, halve it; if odd, multiply by three and add one. The conjecture: no matter what number you start with, the sequence eventually reaches 1. Verified by computer for every number up to 2⁶⁸, never proven. Mapped backwards from 1, the chain of all integers forms a coral-like tree.",
  },
  doublependulum: {
    title: "The Double Pendulum",
    tagline: "Two pendulums chained, total chaos",
    body: "Hang a second pendulum from the bob of a first. The system has only two angles and two velocities, yet its motion is famously chaotic: identical-looking starts diverge wildly within seconds. The phase-space orbits trace some of the most beautiful curves in dynamical systems.",
  },
  bzr: {
    title: "The Belousov–Zhabotinsky Reaction",
    tagline: "A chemical reaction that draws spirals",
    body: "Mix bromate, malonic acid and a catalyst in the right ratio and the solution does not settle — it pulses, changes colour, and spontaneously organises into rotating spiral waves. The chemistry is real; the mathematics is a reaction-diffusion system whose patterns can be re-derived in code.",
  },
  turingpattern: {
    title: "Turing Patterns",
    tagline: "Where leopard spots come from",
    body: "In 1952 Alan Turing showed that two interacting 'chemicals' diffusing at different rates can spontaneously break symmetry and form stable patterns — spots, stripes, branching networks. The same equations explain leopard fur, zebra stripes, angelfish skin and parts of embryonic development. A small reaction-diffusion system, an astonishing reach.",
  },
  sierpinski: {
    title: "The Sierpiński Triangle",
    tagline: "One fractal, three roads in",
    body: "The same triangular hole-in-a-hole fractal appears from three completely different recipes: a recursive subdivision of a triangle, the chaos game with three vertices, and the odd entries of Pascal's triangle. The pattern is the fixed point of three independent processes — convergent evidence that the structure was inevitable.",
  },
  chaosgame: {
    title: "The Chaos Game",
    tagline: "Roll a die, draw a fractal",
    body: "Place three dots in a triangle. Pick any starting point. Repeatedly: choose a vertex at random, then move halfway towards it and mark the spot. Within a few thousand draws, the noise condenses into a perfect Sierpiński triangle — order emerging from pure randomness, on no instructions but a halving step.",
  },
  penrose: {
    title: "Penrose Tilings",
    tagline: "Tiles that fill the plane and never repeat",
    body: "Roger Penrose's kite-and-dart tiling covers an infinite plane using only two tile shapes — but no finite section ever recurs exactly anywhere else. The pattern's symmetries are five-fold, forbidden by classical crystallography, and quietly governed by the golden ratio. Quasicrystals in nature copy the trick.",
  },
  apollonian: {
    title: "Apollonian Circle Packing",
    tagline: "Circles inside circles inside circles",
    body: "Start with three mutually tangent circles. Two more circles can be drawn tangent to all three; fill each gap with another such circle, recursively, forever. Descartes' theorem ties their curvatures together algebraically, and in some starting configurations every circle in the entire packing has an integer curvature. Geometry full of secret arithmetic.",
  },
  phi: {
    title: "Golden Ratio & Fibonacci",
    tagline: "1, 1, 2, 3, 5, 8 — and the ratio that hides everywhere",
    body: "Each term of the Fibonacci sequence is the sum of the two before it. The ratio of consecutive terms converges to φ = (1 + √5)/2 ≈ 1.618. The same φ shows up in sunflower seed spirals, pinecones, the proportions of architecture and, less reliably, in posters about it.",
  },
  buffon: {
    title: "Pi from Buffon's Needle",
    tagline: "Drop needles on lined paper, divide, get π",
    body: "Draw parallel lines, distance d apart. Drop a needle of length ℓ ≤ d at random. The probability the needle crosses a line is exactly 2ℓ/(πd). So if you drop a thousand needles and count crossings, you can estimate π — a constant from circles emerging from straight needles on straight paper.",
  },
  hilberthotel: {
    title: "Hilbert's Hotel",
    tagline: "Always one more room, even when full",
    body: "Imagine a hotel with infinitely many rooms, all occupied. A new guest arrives; ask everyone to move one room up, and room 1 is suddenly free. Infinitely many new guests arrive; move everyone to twice their room number, freeing every odd room. Infinity behaves like nothing finite, and Hilbert's hotel is the most cheerful introduction to that fact.",
  },
  gabrielshorn: {
    title: "Gabriel's Horn",
    tagline: "Finite volume, infinite surface",
    body: "Rotate the curve y = 1/x around the x-axis from x = 1 to infinity. The resulting horn has a finite volume — π cubic units — but an infinite surface area. You could pour π cubic units of paint into it; you could never paint its outside.",
  },
  cantor: {
    title: "Cantor's Diagonal Argument",
    tagline: "There are more reals than counting numbers",
    body: "Suppose the real numbers between 0 and 1 could be listed in a sequence. Cantor showed how to construct, from any such list, a real number missing from it: change the first digit of the first listed number, the second digit of the second, and so on along the diagonal. The new number cannot equal any in the list. The reals are uncountable — and infinity comes in sizes.",
  },
  boids: {
    title: "Boids — flocking from three rules",
    tagline: "Separation, alignment, cohesion. Out flies a flock.",
    body: "In 1986 Craig Reynolds gave each simulated bird three local instincts: steer away from neighbours that are too close (separation), steer toward the average heading of nearby flockmates (alignment), and steer toward their average position (cohesion). No leader, no plan, no global view. From those three tiny urges emerge tight flocks, splitting streams, swirling reunions — the same choreography that real starlings, fish schools and locust swarms perform.",
  },
  dla: {
    title: "Diffusion-Limited Aggregation",
    tagline: "Random walks that get stuck — and grow corals",
    body: "Plant a single seed pixel. Release particles one at a time, each performing a random walk; the moment a wandering particle touches the cluster, it freezes there. Repeat ten thousand times and a branching, dendritic structure grows out from the seed — the same fractal shape that copper takes when electroplated, that lichen takes on a wall, that lightning leaves on bare skin. Witten and Sander showed in 1981 that the result has fractal dimension ≈ 1.71 in two dimensions, no matter what you seed it with.",
  },
  langton: {
    title: "Langton's Ant",
    tagline: "Two rules, ten thousand steps, a highway",
    body: "An ant stands on a white square of an infinite grid. Rule: on white, flip the colour, turn right, step forward. On black, flip the colour, turn left, step forward. For about ten thousand steps the trail looks like chaos. Then — without warning — the ant starts laying down a perfectly periodic 104-step pattern that drifts off to infinity. Nobody has proven the highway always appears, only that it always has so far. Two rules, an unsolved emergent miracle.",
  },
  pascalmod: {
    title: "Pascal's Triangle (mod n)",
    tagline: "Colour by divisibility — a fractal falls out",
    body: "Write Pascal's triangle. Now colour every entry by its remainder modulo a prime p. For p = 2 (odd cells black, even cells white) the result is the Sierpiński triangle — exact, infinite, generated by counting. For p = 3, 5, 7 each you get a different self-similar gasket. The theorem behind it (Kummer, 1852) says C(n, k) is divisible by p exactly when the base-p addition k + (n − k) has at least one carry — so the fractal is, secretly, a picture of when carries happen.",
  },
  sternbrocot: {
    title: "The Stern–Brocot Tree",
    tagline: "Every fraction, once, built by adding badly",
    body: "Start with 0/1 and 1/0. Whenever two fractions sit side by side, insert the mediant (a + c)/(b + d) between them. Continue forever. In the infinite tree that grows out, every reduced fraction p/q with p, q > 0 lands at one and only one node — none missing, none doubled — and the left–right path to any fraction encodes that fraction's continued-fraction expansion. The same tree gives you the best rational approximations to irrationals: the road to π and φ runs through it.",
  },
  ulam: {
    title: "The Ulam Spiral",
    tagline: "Primes lining up on mysterious diagonals",
    body: "Stanisław Ulam, bored at a 1963 lecture, doodled the integers in a square spiral and circled the primes. The primes did not scatter; they crowded along visible diagonals. Many of those diagonals correspond to prime-rich quadratics like Euler's n² − n + 41, which is prime for every n from 0 to 39. Why primes prefer certain quadratic forms over others is part of the deepest unsolved area of number theory — Ulam saw it on a napkin.",
  },
  aizawa: {
    title: "The Aizawa Attractor",
    tagline: "Lorenz's stranger, weirder cousin",
    body: "Like Lorenz, Aizawa is three coupled differential equations dragging a single point through 3D space. Unlike Lorenz's butterfly, the trajectory here folds itself into a knotted, basket-handled torus with a vertical spike through the centre — a shape so distinctive it is one of the most photographed strange attractors in chaos theory. Tiny changes in the parameters reshape the whole geometry: a single dial turns the basket into a flower, then into a vase, then into chaos.",
  },
  cardioid: {
    title: "The Coffee-Cup Cardioid",
    tagline: "The light curve in your cup is Mandelbrot's heart",
    body: "Shine a parallel beam of sunlight on a cylindrical coffee cup. The reflections off the inside wall do not focus to a point — they envelope a glowing heart-shaped curve on the surface of the coffee. That curve is a cardioid: r = 2a(1 − cos θ) in polar coordinates. The very same equation describes the main bulb of the Mandelbrot set. Every morning, in every café, the most famous shape in dynamics is being drawn in light.",
  },
  galton: {
    title: "The Galton Board",
    tagline: "Bouncing balls always draw the same bell",
    body: "Francis Galton's quincunx is a triangle of pegs. Release a marble at the apex: at every peg it veers left or right on a fifty-fifty coin flip, until gravity drops it into one of the catch bins along the floor. Drop ten thousand marbles and the bins fill — always — into the shape of the normal distribution. The bell is not a coincidence; it is the Central Limit Theorem made tactile: any sum of many independent small random kicks converges to a Gaussian, no matter what the individual kicks look like.",
  },
  magpendulum: {
    title: "The Magnetic Pendulum",
    tagline: "Colour by winner, find a fractal",
    body: "Suspend an iron pendulum over three magnets arranged in a triangle. The motion is deterministic — Newton's laws plus magnetic attraction plus a touch of friction — and yet the question 'which magnet does it end up over?' has no smooth answer. Colour each starting position by its eventual winner and you uncover a basin-of-attraction fractal: red, green and blue regions interlocked at every scale, with every boundary point a frontier between all three magnets at once. Determinism without predictability.",
  },
  godel: {
    title: "Gödel's Incompleteness",
    tagline: "There are true statements no system can prove",
    body: "Kurt Gödel, 1931. In any consistent formal system rich enough to express arithmetic, there is a true statement the system itself cannot prove. The trick: build a sentence that says, in the system's own language, 'I am not provable.' If you could prove it, it would be false; if you can't, it is exactly what it claims. Mathematics will never be complete in the way Hilbert hoped.",
  },
  halting: {
    title: "The Halting Problem",
    tagline: "No program can predict every other program",
    body: "Alan Turing, 1936. Suppose a magic function halts(P, x) decides whether program P halts on input x. Build a new program H' that calls halts on itself, then does the opposite — halt if halts(H', H') says loop, loop if halts says halt. Feed H' to itself. Contradiction — therefore no such universal decider exists. The original limit on what computers can decide.",
  },
  pvsnp: {
    title: "P vs NP",
    tagline: "The biggest open question in computer science",
    body: "P is the class of problems a computer solves quickly. NP is the class where, given an answer, you can verify it quickly. Is every NP problem secretly in P? Decades of research, a $1 million Clay prize, no proof either way. If P = NP, every cryptographic system would crack and every shortest-route problem would melt. Most computer scientists bet P ≠ NP — but nobody knows.",
  },
  rsa: {
    title: "RSA & One-Way Functions",
    tagline: "Multiplying is easy; factoring is impossible",
    body: "Rivest, Shamir, Adleman, 1977. Pick two huge primes p and q. Multiply: n = p · q. Anyone can multiply, nobody can split n back without immense computation. From this asymmetry come public-key cryptography, digital signatures, secure banking and encrypted chat. The maths under every TLS handshake.",
  },
  mobius: {
    title: "Möbius Strip & Klein Bottle",
    tagline: "Surfaces with only one side",
    body: "Give a paper strip a half-twist and glue the ends. The result has one edge and one side — an ant walking the surface visits 'both sides' without ever crossing the edge. In four-dimensional space, the same trick on a tube produces the Klein bottle: a closed surface with no inside or outside. Toys, art, and the foundations of topology.",
  },
  eulerchar: {
    title: "Euler Characteristic",
    tagline: "V − E + F = 2 for every nice polyhedron",
    body: "Count vertices, subtract edges, add faces. For any polyhedron without holes the answer is always 2 — cube, dodecahedron, soccer ball, your house. The number is a topological invariant: stretch the shape any way you like, the answer is fixed. Add a hole and it drops to 0. Topology in one equation.",
  },
  konigsberg: {
    title: "The Königsberg Bridges",
    tagline: "Seven bridges, one impossible walk",
    body: "In 1736 Leonhard Euler proved that there is no way to cross all seven bridges of Königsberg exactly once. The proof: reduce the map to a graph; an Eulerian path exists only if at most two land masses have an odd number of bridges. Königsberg had four with odd degree. With that argument Euler invented graph theory.",
  },
  fourcolor: {
    title: "The Four Colour Theorem",
    tagline: "Every flat map needs at most four colours",
    body: "Stated 1852, proved 1976 by Kenneth Appel and Wolfgang Haken. Any subdivision of the plane into regions can be coloured with at most four colours so that no two neighbouring regions share a colour. The proof was the first major theorem verified by computer — it reduces the problem to 1834 unavoidable configurations and checks each. Mathematicians argued for years over whether the proof 'really counted'.",
  },
  smallworld: {
    title: "Six Degrees & Small Worlds",
    tagline: "Any two people, six handshakes apart",
    body: "Stanley Milgram's 1967 experiment sent letters across the United States via personal contacts. The average chain was about six links long. In 1998 Duncan Watts and Steven Strogatz showed that adding just a few random shortcuts to a regular network collapses the average path length to roughly log(N) while keeping local clustering high. Social networks, brains, power grids and the internet all live in this small-world regime.",
  },
  backprop: {
    title: "Backpropagation",
    tagline: "Gradient descent on a chain rule",
    body: "Backpropagation is the algorithm that lets a neural network learn from its mistakes. Run an input forward through the layers, compare the output to the target, then walk the chain rule backward to find — for every weight — how much it should change to make the answer closer next time. The whole modern AI boom rests on this idea: just multivariable calculus plus a lot of GPUs. Discovered independently many times; popularised by Rumelhart, Hinton and Williams in 1986.",
  },
  diffusion: {
    title: "Diffusion Models",
    tagline: "Noise dissolved into an image, step by step",
    body: "Take any picture and add a sprinkle of Gaussian noise. Repeat a thousand times and the image is pure static. Now learn the reverse: given pure noise, predict the slightly less noisy version. Stack a thousand such steps and you can generate brand-new images from nothing but random noise. That is the entire idea behind Stable Diffusion, Midjourney and DALL·E — a Markov chain trained to run time backwards through a heat equation.",
  },
  riemann: {
    title: "The Riemann Hypothesis",
    tagline: "Every non-trivial zero of ζ lies on the critical line",
    body: "The Riemann zeta function ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + … extends to the whole complex plane. The zeros that aren't at the negative even integers all seem to sit on a single vertical line: real part exactly 1/2. Bernhard Riemann conjectured this in 1859 and nobody has proved or disproved it since. A proof would lock down how prime numbers are distributed; one of the seven Millennium Prize Problems, $1M reward.",
  },
};
