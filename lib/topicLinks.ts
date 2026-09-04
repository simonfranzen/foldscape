// Further-reading links per topic. URLs are language-neutral (Wikipedia
// articles default to English, but readers can switch via the language
// selector on Wikipedia itself). When a paper is on arxiv we link the abstract.

import type { TopicId } from "./topics";

export type TopicLink = { label: string; href: string };

export const TOPIC_LINKS: Record<TopicId, TopicLink[]> = {
  mandelbrot: [
    { label: "Wikipedia — Mandelbrot set", href: "https://en.wikipedia.org/wiki/Mandelbrot_set" },
    {
      label: "Mandelbrot, B. — The Fractal Geometry of Nature (1982)",
      href: "https://en.wikipedia.org/wiki/The_Fractal_Geometry_of_Nature",
    },
    {
      label: "Tan Lei — Similarity between the Mandelbrot set and Julia sets",
      href: "https://link.springer.com/article/10.1007/BF02101186",
    },
  ],
  life: [
    {
      label: "Wikipedia — Conway's Game of Life",
      href: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life",
    },
    {
      label: "Martin Gardner — Scientific American (1970)",
      href: "https://www.ibiblio.org/lifepatterns/october1970.html",
    },
    { label: "LifeWiki — Pattern catalog", href: "https://conwaylife.com/wiki/" },
  ],
  nand: [
    { label: "Wikipedia — Sheffer stroke", href: "https://en.wikipedia.org/wiki/Sheffer_stroke" },
    {
      label: "Sheffer, H. M. (1913) — A set of five independent postulates",
      href: "https://www.jstor.org/stable/1988701",
    },
    { label: "nand2tetris — Build a computer from NAND", href: "https://www.nand2tetris.org/" },
  ],
  sat: [
    {
      label: "Wikipedia — Boolean satisfiability problem",
      href: "https://en.wikipedia.org/wiki/Boolean_satisfiability_problem",
    },
    {
      label: "Cook, S. (1971) — The complexity of theorem-proving procedures",
      href: "https://dl.acm.org/doi/10.1145/800157.805047",
    },
    { label: "Wikipedia — DPLL algorithm", href: "https://en.wikipedia.org/wiki/DPLL_algorithm" },
  ],
  iota: [
    { label: "Wikipedia — Iota and Jot", href: "https://en.wikipedia.org/wiki/Iota_and_Jot" },
    {
      label: "Wikipedia — Combinatory logic",
      href: "https://en.wikipedia.org/wiki/Combinatory_logic",
    },
    {
      label: "Chris Barker — Iota and Jot (2001)",
      href: "https://semarch.linguistics.fas.nyu.edu/barker/Iota/",
    },
  ],
  rule110: [
    { label: "Wikipedia — Rule 110", href: "https://en.wikipedia.org/wiki/Rule_110" },
    {
      label: "Cook, M. — Universality in elementary cellular automata (2004)",
      href: "https://www.complex-systems.com/abstracts/v15_i01_a01/",
    },
    { label: "Wolfram — A New Kind of Science", href: "https://www.wolframscience.com/nks/" },
  ],
  logistic: [
    { label: "Wikipedia — Logistic map", href: "https://en.wikipedia.org/wiki/Logistic_map" },
    {
      label: "May, R. — Simple mathematical models with very complicated dynamics (Nature 1976)",
      href: "https://www.nature.com/articles/261459a0",
    },
    {
      label: "Feigenbaum, M. — Quantitative universality (1978)",
      href: "https://link.springer.com/article/10.1007/BF01020332",
    },
  ],
  lorenz: [
    { label: "Wikipedia — Lorenz system", href: "https://en.wikipedia.org/wiki/Lorenz_system" },
    {
      label: "Lorenz, E. — Deterministic Nonperiodic Flow (1963)",
      href: "https://journals.ametsoc.org/view/journals/atsc/20/2/1520-0469_1963_020_0130_dnf_2_0_co_2.xml",
    },
    {
      label: "Tucker, W. — The Lorenz attractor exists (1999)",
      href: "https://www.sciencedirect.com/science/article/pii/S0764444299804391",
    },
  ],
  fourier: [
    {
      label: "Wikipedia — Fourier transform",
      href: "https://en.wikipedia.org/wiki/Fourier_transform",
    },
    {
      label: "Fourier, J. — Théorie analytique de la chaleur (1822)",
      href: "https://archive.org/details/thorieanalytiqu00fourgoog",
    },
    {
      label: "3Blue1Brown — But what is the Fourier transform? A visual introduction",
      href: "https://www.3blue1brown.com/lessons/fourier-transforms",
    },
  ],
  euler: [
    {
      label: "Wikipedia — Euler's identity",
      href: "https://en.wikipedia.org/wiki/Euler%27s_identity",
    },
    {
      label: "Wikipedia — Euler's formula",
      href: "https://en.wikipedia.org/wiki/Euler%27s_formula",
    },
    {
      label: "3Blue1Brown — Euler's formula intuition",
      href: "https://www.youtube.com/watch?v=v0YEaeIClKY",
    },
  ],
  banach: [
    {
      label: "Wikipedia — Banach–Tarski paradox",
      href: "https://en.wikipedia.org/wiki/Banach%E2%80%93Tarski_paradox",
    },
    {
      label: "Banach & Tarski (1924) — Sur la décomposition des ensembles de points",
      href: "https://eudml.org/doc/212681",
    },
    {
      label: "Vsauce — The Banach-Tarski paradox (video)",
      href: "https://www.youtube.com/watch?v=s86-Z-CbaHA",
    },
  ],
  lsystem: [
    { label: "Wikipedia — L-system", href: "https://en.wikipedia.org/wiki/L-system" },
    {
      label: "Prusinkiewicz & Lindenmayer — The Algorithmic Beauty of Plants (free PDF)",
      href: "http://algorithmicbotany.org/papers/abop/abop.pdf",
    },
    {
      label: "Algorithmic Botany — research from Lindenmayer's lab",
      href: "http://algorithmicbotany.org/",
    },
  ],
  wang: [
    { label: "Wikipedia — Wang tile", href: "https://en.wikipedia.org/wiki/Wang_tile" },
    {
      label: "Berger, R. — The Undecidability of the Domino Problem (1966)",
      href: "https://www.ams.org/books/memo/0066/",
    },
    {
      label: "Jeandel & Rao (2015) — An aperiodic set of 11 Wang tiles",
      href: "https://arxiv.org/abs/1506.06492",
    },
  ],
  collatz: [
    {
      label: "Wikipedia — Collatz conjecture",
      href: "https://en.wikipedia.org/wiki/Collatz_conjecture",
    },
    {
      label: "Tao, T. — Almost all orbits attain almost bounded values (2019)",
      href: "https://arxiv.org/abs/1909.03562",
    },
    {
      label: "Lagarias, J. — The 3x+1 problem: an annotated bibliography",
      href: "https://arxiv.org/abs/math/0309224",
    },
  ],
  doublependulum: [
    { label: "Wikipedia — Double pendulum", href: "https://en.wikipedia.org/wiki/Double_pendulum" },
    {
      label: "Diego Assencio — The double pendulum: Lagrangian formulation",
      href: "https://diego.assencio.com/?index=1500c66ae7ab27bb0106467c68feebc6",
    },
    {
      label: "Shinbrot et al. — Chaos in a double pendulum (1992)",
      href: "https://aapt.scitation.org/doi/10.1119/1.16860",
    },
  ],
  bzr: [
    {
      label: "Wikipedia — Belousov–Zhabotinsky reaction",
      href: "https://en.wikipedia.org/wiki/Belousov%E2%80%93Zhabotinsky_reaction",
    },
    {
      label: "Field, Körös, Noyes (1972) — Oregonator model",
      href: "https://pubs.acs.org/doi/abs/10.1021/ja00780a001",
    },
    {
      label: "Prigogine, I. — Nobel lecture 1977",
      href: "https://www.nobelprize.org/prizes/chemistry/1977/prigogine/lecture/",
    },
  ],
  turingpattern: [
    { label: "Wikipedia — Turing pattern", href: "https://en.wikipedia.org/wiki/Turing_pattern" },
    {
      label: "Turing, A. M. — The Chemical Basis of Morphogenesis (1952)",
      href: "https://royalsocietypublishing.org/doi/10.1098/rstb.1952.0012",
    },
    {
      label: "Pearson, J. — Complex patterns in a simple system (1993, Gray-Scott)",
      href: "https://www.science.org/doi/10.1126/science.261.5118.189",
    },
  ],
  sierpinski: [
    {
      label: "Wikipedia — Sierpiński triangle",
      href: "https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle",
    },
    {
      label: "Wikipedia — Iterated function system",
      href: "https://en.wikipedia.org/wiki/Iterated_function_system",
    },
    {
      label: "Sierpiński, W. (1915) — Sur une courbe dont tout point est un point de ramification",
      href: "https://eudml.org/doc/210820",
    },
  ],
  chaosgame: [
    { label: "Wikipedia — Chaos game", href: "https://en.wikipedia.org/wiki/Chaos_game" },
    {
      label: "Barnsley, M. — Fractals Everywhere (1988)",
      href: "https://www.elsevier.com/books/fractals-everywhere/barnsley/978-0-12-079061-6",
    },
    { label: "Wikipedia — Barnsley fern", href: "https://en.wikipedia.org/wiki/Barnsley_fern" },
  ],
  penrose: [
    { label: "Wikipedia — Penrose tiling", href: "https://en.wikipedia.org/wiki/Penrose_tiling" },
    {
      label:
        "Penrose, R. (1974) — The Role of Aesthetics in Pure and Applied Mathematical Research",
      href: "https://link.springer.com/article/10.1007/BF03024297",
    },
    {
      label: "Shechtman et al. (1984) — Metallic phase with long-range orientational order",
      href: "https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.53.1951",
    },
  ],
  apollonian: [
    {
      label: "Wikipedia — Apollonian gasket",
      href: "https://en.wikipedia.org/wiki/Apollonian_gasket",
    },
    {
      label: "Lagarias, Mallows, Wilks — Beyond the Descartes circle theorem (2002)",
      href: "https://arxiv.org/abs/math/0101066",
    },
    {
      label: "Wikipedia — Descartes' theorem",
      href: "https://en.wikipedia.org/wiki/Descartes%27_theorem",
    },
  ],
  phi: [
    { label: "Wikipedia — Golden ratio", href: "https://en.wikipedia.org/wiki/Golden_ratio" },
    {
      label: "Wikipedia — Fibonacci sequence",
      href: "https://en.wikipedia.org/wiki/Fibonacci_sequence",
    },
    {
      label: "Markowsky, G. — Misconceptions about the golden ratio (1992)",
      href: "https://www.maa.org/sites/default/files/pdf/upload_library/22/Polya/07468342.di020803.02p0276x.pdf",
    },
  ],
  buffon: [
    {
      label: "Wikipedia — Buffon's needle problem",
      href: "https://en.wikipedia.org/wiki/Buffon%27s_needle_problem",
    },
    {
      label: "Buffon, G.-L. L. (1777) — Essai d'arithmétique morale",
      href: "https://gallica.bnf.fr/ark:/12148/btv1b8602225f",
    },
    {
      label: "Wikipedia — Buffon's noodle",
      href: "https://en.wikipedia.org/wiki/Buffon%27s_noodle",
    },
  ],
  hilberthotel: [
    {
      label: "Wikipedia — Hilbert's paradox of the Grand Hotel",
      href: "https://en.wikipedia.org/wiki/Hilbert%27s_paradox_of_the_Grand_Hotel",
    },
    {
      label: "Gamow, G. — One, Two, Three… Infinity (1947)",
      href: "https://archive.org/details/onetwothreeinfin0000gamo",
    },
    {
      label: "TED-Ed — Hilbert's Infinite Hotel paradox",
      href: "https://www.ted.com/talks/jeff_dekofsky_the_infinite_hotel_paradox",
    },
  ],
  gabrielshorn: [
    { label: "Wikipedia — Gabriel's Horn", href: "https://en.wikipedia.org/wiki/Gabriel%27s_horn" },
    {
      label: "Torricelli, E. (1641) — De solido hyperbolico acuto",
      href: "https://en.wikipedia.org/wiki/De_solido_hyperbolico_acuto",
    },
    {
      label: "Wikipedia — Painter's paradox",
      href: "https://en.wikipedia.org/wiki/Gabriel%27s_horn#The_painter%27s_paradox",
    },
  ],
  cantor: [
    {
      label: "Wikipedia — Cantor's diagonal argument",
      href: "https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument",
    },
    {
      label: "Cantor, G. (1891) — Über eine elementare Frage der Mannigfaltigkeitslehre",
      href: "https://eudml.org/doc/144383",
    },
    {
      label: "Wikipedia — Continuum hypothesis",
      href: "https://en.wikipedia.org/wiki/Continuum_hypothesis",
    },
  ],
  boids: [
    { label: "Wikipedia — Boids", href: "https://en.wikipedia.org/wiki/Boids" },
    {
      label: "Reynolds, C. W. (1987) — Flocks, herds and schools: a distributed behavioral model",
      href: "https://www.red3d.com/cwr/papers/1987/boids.html",
    },
    { label: "Craig Reynolds — Boids (official site)", href: "https://www.red3d.com/cwr/boids/" },
  ],
  dla: [
    {
      label: "Wikipedia — Diffusion-limited aggregation",
      href: "https://en.wikipedia.org/wiki/Diffusion-limited_aggregation",
    },
    {
      label:
        "Witten & Sander (1981) — Diffusion-Limited Aggregation, a Kinetic Critical Phenomenon",
      href: "https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.47.1400",
    },
    {
      label: "Wikipedia — Fractal dimension",
      href: "https://en.wikipedia.org/wiki/Fractal_dimension",
    },
  ],
  langton: [
    { label: "Wikipedia — Langton's ant", href: "https://en.wikipedia.org/wiki/Langton%27s_ant" },
    {
      label: "Langton, C. G. (1986) — Studying artificial life with cellular automata",
      href: "https://www.sciencedirect.com/science/article/pii/0167278986902379",
    },
    {
      label:
        "Bunimovich & Troubetzkoy (1992) — Recurrence properties of Lorentz lattice gas cellular automata",
      href: "https://link.springer.com/article/10.1007/BF01010402",
    },
  ],
  pascalmod: [
    {
      label: "Wikipedia — Pascal's triangle",
      href: "https://en.wikipedia.org/wiki/Pascal%27s_triangle",
    },
    {
      label: "Wikipedia — Lucas's theorem",
      href: "https://en.wikipedia.org/wiki/Lucas%27s_theorem",
    },
    {
      label: "Wikipedia — Sierpinski triangle (Pascal mod 2 connection)",
      href: "https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle#Pascal's_triangle",
    },
  ],
  sternbrocot: [
    {
      label: "Wikipedia — Stern–Brocot tree",
      href: "https://en.wikipedia.org/wiki/Stern%E2%80%93Brocot_tree",
    },
    {
      label: "Wikipedia — Mediant (mathematics)",
      href: "https://en.wikipedia.org/wiki/Mediant_(mathematics)",
    },
    {
      label: "Graham, Knuth, Patashnik — Concrete Mathematics, §4.5",
      href: "https://en.wikipedia.org/wiki/Concrete_Mathematics",
    },
  ],
  ulam: [
    { label: "Wikipedia — Ulam spiral", href: "https://en.wikipedia.org/wiki/Ulam_spiral" },
    {
      label:
        "Stein, Ulam & Wells (1964) — A visual display of some properties of the distribution of primes",
      href: "https://www.maa.org/sites/default/files/pdf/upload_library/22/Polya/07468342.di020803.02p0276x.pdf",
    },
    { label: "Wikipedia — Prime gap", href: "https://en.wikipedia.org/wiki/Prime_gap" },
  ],
  aizawa: [
    {
      label: "Wikipedia — List of chaotic maps",
      href: "https://en.wikipedia.org/wiki/List_of_chaotic_maps",
    },
    {
      label: "Aizawa attractor — algosome.com",
      href: "https://www.algosome.com/articles/aizawa-attractor-chaos.html",
    },
    {
      label: "Wikipedia — Strange attractor",
      href: "https://en.wikipedia.org/wiki/Attractor#Strange_attractor",
    },
  ],
  cardioid: [
    { label: "Wikipedia — Cardioid", href: "https://en.wikipedia.org/wiki/Cardioid" },
    {
      label: "Wikipedia — Mandelbrot set (the main cardioid)",
      href: "https://en.wikipedia.org/wiki/Mandelbrot_set#Geometry",
    },
    { label: "Wikipedia — Epicycloid", href: "https://en.wikipedia.org/wiki/Epicycloid" },
  ],
  galton: [
    {
      label: "Wikipedia — Bean machine (Galton board)",
      href: "https://en.wikipedia.org/wiki/Bean_machine",
    },
    {
      label: "Wikipedia — Central limit theorem",
      href: "https://en.wikipedia.org/wiki/Central_limit_theorem",
    },
    {
      label: "Galton, F. — Natural Inheritance (1889)",
      href: "https://galton.org/books/natural-inheritance/",
    },
  ],
  magpendulum: [
    {
      label: "Wikipedia — Magnetic pendulum",
      href: "https://en.wikipedia.org/wiki/Pendulum_(mechanics)#Magnetic_pendulum",
    },
    {
      label: "Moon, F. C. — Chaotic vibrations of a forced magnetic pendulum (1980)",
      href: "https://www.sciencedirect.com/science/article/abs/pii/0167278980900133",
    },
    {
      label: "Wikipedia — Basin of attraction",
      href: "https://en.wikipedia.org/wiki/Attractor#Basins_of_attraction",
    },
  ],
  godel: [
    {
      label: "Wikipedia — Gödel's incompleteness theorems",
      href: "https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems",
    },
    {
      label: "Gödel, K. (1931) — Über formal unentscheidbare Sätze (PDF)",
      href: "https://monoskop.org/images/9/93/Kurt_G%C3%B6del_On_Formally_Undecidable_Propositions_of_Principia_Mathematica_and_Related_Systems.pdf",
    },
    {
      label: "Smullyan, R. — Gödel's Incompleteness Theorems (Oxford, 1992)",
      href: "https://global.oup.com/academic/product/godels-incompleteness-theorems-9780195046724",
    },
  ],
  halting: [
    { label: "Wikipedia — Halting problem", href: "https://en.wikipedia.org/wiki/Halting_problem" },
    {
      label: "Turing, A. M. (1936) — On Computable Numbers",
      href: "https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf",
    },
    {
      label: "Sipser — Introduction to the Theory of Computation",
      href: "https://math.mit.edu/~sipser/book.html",
    },
  ],
  pvsnp: [
    {
      label: "Wikipedia — P versus NP problem",
      href: "https://en.wikipedia.org/wiki/P_versus_NP_problem",
    },
    {
      label: "Clay Mathematics Institute — P vs NP",
      href: "https://www.claymath.org/millennium-problems/p-vs-np-problem/",
    },
    {
      label: "Cook, S. (1971) — The complexity of theorem-proving procedures",
      href: "https://dl.acm.org/doi/10.1145/800157.805047",
    },
  ],
  rsa: [
    {
      label: "Wikipedia — RSA (cryptosystem)",
      href: "https://en.wikipedia.org/wiki/RSA_(cryptosystem)",
    },
    {
      label:
        "Rivest, Shamir, Adleman (1978) — A Method for Obtaining Digital Signatures and Public-Key Cryptosystems",
      href: "https://people.csail.mit.edu/rivest/Rsapaper.pdf",
    },
    {
      label: "Wikipedia — Integer factorization",
      href: "https://en.wikipedia.org/wiki/Integer_factorization",
    },
  ],
  mobius: [
    { label: "Wikipedia — Möbius strip", href: "https://en.wikipedia.org/wiki/M%C3%B6bius_strip" },
    { label: "Wikipedia — Klein bottle", href: "https://en.wikipedia.org/wiki/Klein_bottle" },
    {
      label: "Listing, J. B. (1862) — original Möbius / Listing paper",
      href: "https://archive.org/details/dervorstudienzur00list",
    },
  ],
  eulerchar: [
    {
      label: "Wikipedia — Euler characteristic",
      href: "https://en.wikipedia.org/wiki/Euler_characteristic",
    },
    {
      label: "Wikipedia — Polyhedron formula (Euler)",
      href: "https://en.wikipedia.org/wiki/Polyhedron#Euler's_formula",
    },
    {
      label: "Lakatos, I. — Proofs and Refutations (1976)",
      href: "https://archive.org/details/proofsrefutation0000laka",
    },
  ],
  konigsberg: [
    {
      label: "Wikipedia — Seven Bridges of Königsberg",
      href: "https://en.wikipedia.org/wiki/Seven_Bridges_of_K%C3%B6nigsberg",
    },
    {
      label: "Euler, L. (1736) — Solutio problematis ad geometriam situs pertinentis",
      href: "https://www.maa.org/press/periodicals/convergence/leonard-eulers-solution-to-the-konigsberg-bridge-problem",
    },
    { label: "Wikipedia — Graph theory", href: "https://en.wikipedia.org/wiki/Graph_theory" },
  ],
  fourcolor: [
    {
      label: "Wikipedia — Four color theorem",
      href: "https://en.wikipedia.org/wiki/Four_color_theorem",
    },
    {
      label: "Appel & Haken (1977) — Every Planar Map is Four Colorable",
      href: "https://projecteuclid.org/journals/illinois-journal-of-mathematics/volume-21/issue-3/Every-planar-map-is-four-colorable-Part-I-Discharging/10.1215/ijm/1256049011.full",
    },
    {
      label: "Gonthier, G. (2008) — Formal proof of the four-color theorem (Coq)",
      href: "https://www.ams.org/notices/200811/tx081101382p.pdf",
    },
  ],
  smallworld: [
    {
      label: "Wikipedia — Small-world network",
      href: "https://en.wikipedia.org/wiki/Small-world_network",
    },
    {
      label: "Milgram, S. (1967) — The Small World Problem",
      href: "https://snap.stanford.edu/class/cs224w-readings/milgram67smallworld.pdf",
    },
    {
      label: "Watts & Strogatz (1998) — Collective dynamics of small-world networks",
      href: "https://www.nature.com/articles/30918",
    },
  ],
  backprop: [
    { label: "Wikipedia — Backpropagation", href: "https://en.wikipedia.org/wiki/Backpropagation" },
    {
      label:
        "Rumelhart, Hinton, Williams (1986) — Learning representations by back-propagating errors",
      href: "https://www.nature.com/articles/323533a0",
    },
    {
      label: "3Blue1Brown — Backpropagation, intuitively",
      href: "https://www.3blue1brown.com/lessons/backpropagation",
    },
    {
      label: "Goodfellow, Bengio, Courville — Deep Learning (Chapter 6)",
      href: "https://www.deeplearningbook.org/",
    },
  ],
  diffusion: [
    { label: "Wikipedia — Diffusion model", href: "https://en.wikipedia.org/wiki/Diffusion_model" },
    {
      label: "Ho, Jain, Abbeel (2020) — Denoising Diffusion Probabilistic Models",
      href: "https://arxiv.org/abs/2006.11239",
    },
    {
      label:
        "Sohl-Dickstein et al. (2015) — Deep Unsupervised Learning using Nonequilibrium Thermodynamics",
      href: "https://arxiv.org/abs/1503.03585",
    },
    {
      label:
        "Song & Ermon (2019) — Generative Modeling by Estimating Gradients of the Data Distribution",
      href: "https://arxiv.org/abs/1907.05600",
    },
  ],
  riemann: [
    {
      label: "Wikipedia — Riemann hypothesis",
      href: "https://en.wikipedia.org/wiki/Riemann_hypothesis",
    },
    {
      label: "Riemann, B. (1859) — Über die Anzahl der Primzahlen unter einer gegebenen Größe",
      href: "https://www.claymath.org/library/historical/riemann/Wirkungen.pdf",
    },
    {
      label: "Clay Mathematics Institute — Riemann Hypothesis Millennium Problem",
      href: "https://www.claymath.org/millennium/riemann-hypothesis/",
    },
    {
      label: "Edwards, H. M. — Riemann's Zeta Function (1974)",
      href: "https://store.doverpublications.com/0486417409.html",
    },
  ],
};
