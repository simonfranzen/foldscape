// Where each curiosity actually lives in the world: industry uses, natural
// phenomena, everyday-life appearances, current research. Three to five
// concrete entries per topic — accurate, no marketing claims.

import type { TopicId } from "./topics";
import type { Locale } from "./i18n/types";

export interface Application {
  domain: string; // short tag, e.g. "Audio compression"
  description: string; // one or two sentences with concrete reference
}

const en: Partial<Record<TopicId, Application[]>> = {
  eml: [
    {
      domain: "Symbolic regression",
      description:
        "Computer-algebra systems that try to rediscover physical laws from data sometimes use compact operator alphabets like EML to constrain the search space.",
    },
    {
      domain: "Theoretical computer science",
      description:
        "EML is a cousin of universal sets like NAND in logic and Iota in combinators — interesting for what it says about how small a primitive can be.",
    },
  ],
  mandelbrot: [
    {
      domain: "Generative art & motion graphics",
      description:
        "Filmmakers and digital artists zoom into the Mandelbrot set to produce backgrounds for everything from music videos to Apple keynote opening sequences.",
    },
    {
      domain: "Fractal antennas",
      description:
        "Hand-shaped Mandelbrot/Julia-style boundaries are used in some compact multi-band antennas (e.g. in early Bluetooth modules) because the self-similar shape resonates across many frequencies.",
    },
    {
      domain: "Education",
      description:
        "Standard university teaching example for complex dynamics, deterministic chaos, and the boundary between order and chaos.",
    },
    {
      domain: "Natural analogues",
      description:
        "Coastlines, mountain ridges, fern leaves and broccoli florets exhibit the same self-similar boundary structure — fractal geometry was Mandelbrot's whole point.",
    },
  ],
  life: [
    {
      domain: "Computer science education",
      description:
        "Every CS curriculum from MIT 6.001 to high-school clubs uses Conway's Life to teach emergence, cellular automata, and Turing completeness in a single afternoon.",
    },
    {
      domain: "Generative art",
      description:
        "Designers use Life and its variants (HighLife, Day & Night, …) to generate ever-changing visuals for music videos, installations and screensavers.",
    },
    {
      domain: "Modelling discrete biology",
      description:
        "Demography, prey-predator and epidemic spread are sometimes prototyped on Life-like grids before moving to richer agent-based models.",
    },
    {
      domain: "Hardware tinkering",
      description:
        "FPGA and microcontroller projects often render Life on LED matrices as a 'hello world' for parallel cellular hardware.",
    },
  ],
  nand: [
    {
      domain: "Inside every chip",
      description:
        "From the M-series Apple silicon to industrial microcontrollers, billions of NAND gates are etched into silicon every minute. Many digital ASICs are synthesised in nothing but NAND.",
    },
    {
      domain: "Flash memory",
      description:
        "NAND flash storage (USB sticks, SSDs, smartphones) gets its name and its architecture from NAND gates arranged into floating-gate transistor arrays.",
    },
    {
      domain: "Hardware courses",
      description:
        "The nand2tetris course builds a complete computer starting from a single NAND chip — used at >100 universities.",
    },
    {
      domain: "Embedded logic",
      description:
        "Single discrete 74HC00 NAND quad ICs still ship today for simple glue logic, level shifters and oscillators on hobby PCBs.",
    },
  ],
  iota: [
    {
      domain: "Combinator interpreters",
      description:
        "Functional-programming compilers (e.g. Lazy K) compile lambda-calculus programs into pure combinator expressions — Iota-style — as part of code generation.",
    },
    {
      domain: "Esoteric languages",
      description:
        "Iota and its sibling Jot are minimalist programming languages used to study the smallest possible Turing-complete syntax.",
    },
    {
      domain: "Lambda calculus teaching",
      description:
        "Universities use Iota to demonstrate that a single combinator suffices, separating syntax from computational power.",
    },
  ],
  rule110: [
    {
      domain: "Wolfram Physics Project",
      description:
        "Stephen Wolfram's program of finding the universe's underlying rule explicitly cites Rule 110 as proof that very small rules can be universally computational.",
    },
    {
      domain: "Education in formal computing",
      description:
        "Cited in every modern intro to cellular automata as the simplest known universal system — a tweet-sized Turing machine.",
    },
    {
      domain: "Procedural texture noise",
      description:
        "Some shader libraries use Rule 110 (and 30) as a cheap source of complex 1-D noise for stylised generative graphics.",
    },
  ],
  logistic: [
    {
      domain: "Population biology",
      description:
        "The continuous logistic equation models tightly-bounded populations of bacteria, yeast and even some mammals; the discrete map is taught in every quantitative ecology course.",
    },
    {
      domain: "Epidemiology",
      description:
        "Bounded epidemic growth (with carrying capacity = susceptible pool) follows logistic curves — the COVID-19 cumulative-case curves were a textbook example.",
    },
    {
      domain: "Machine learning",
      description:
        "Learning-rate schedules in deep learning sometimes hit the same period-doubling chaos when the rate is too large; the logistic map gives intuition.",
    },
    {
      domain: "Neuroscience",
      description:
        "Models of neuron firing rates at high input currents bifurcate just like the logistic map, predicting onset of irregular spiking.",
    },
    {
      domain: "Climate & weather",
      description:
        "Feigenbaum-style period doubling was reproduced experimentally in fluid convection cells, showing the same universal route to turbulence.",
    },
  ],
  lorenz: [
    {
      domain: "Weather forecasting",
      description:
        "Operational forecasters use ensemble methods because the atmosphere shares Lorenz's sensitivity to initial conditions — predictability collapses after about 14 days.",
    },
    {
      domain: "Climate modelling",
      description:
        "Lorenz's 1963 paper birthed modern chaos theory and shaped how we read the predictability limits of long-term climate simulations.",
    },
    {
      domain: "Education",
      description:
        "Every undergraduate dynamical-systems course visualises the Lorenz attractor as the canonical strange attractor.",
    },
    {
      domain: "Secure communication",
      description:
        "Chaos-based encryption schemes have used Lorenz-style synchronisation to hide signals — niche but real (Cuomo & Oppenheim, 1993).",
    },
  ],
  fourier: [
    {
      domain: "MP3, AAC, Opus",
      description:
        "All modern lossy audio codecs work by transforming small windows of sound into the frequency domain, dropping inaudible components, and inverse-transforming back.",
    },
    {
      domain: "JPEG and HEIC",
      description:
        "Each 8×8 pixel block of every JPEG image is stored as discrete cosine transform coefficients — that's why JPEG ringing has horizontal/vertical patterns.",
    },
    {
      domain: "MRI scanners",
      description:
        "An MRI machine literally measures Fourier coefficients (k-space) of your tissue and inverse-transforms them into the image you see at the doctor.",
    },
    {
      domain: "Wi-Fi, 5G, DSL",
      description:
        "Modern wireless and wired transmission uses OFDM, which packs data onto thousands of carefully spaced sine carriers — pure Fourier engineering.",
    },
    {
      domain: "Speech & ML",
      description:
        "Mel-spectrogram features (Fourier-transformed audio) are the input to almost every speech-recognition and voice-assistant model.",
    },
  ],
  euler: [
    {
      domain: "Signal processing",
      description:
        "Every DSP textbook uses e^{iωt} as the canonical complex sinusoid; the FFT, Z-transform, and filter design all live on Euler's formula.",
    },
    {
      domain: "Quantum mechanics",
      description:
        "Wavefunctions are complex exponentials; phase factors e^{iθ} carry the interference patterns that make quantum mechanics quantum.",
    },
    {
      domain: "AC circuit analysis",
      description:
        "Electrical engineers model AC voltages/currents as complex exponentials — impedance arithmetic via phasors is direct application of Euler's formula.",
    },
    {
      domain: "Control theory",
      description:
        "Stability of feedback systems is read from the location of poles in the complex plane — Euler's formula is the bridge between time and frequency.",
    },
  ],
  banach: [
    {
      domain: "Set theory teaching",
      description:
        "Banach–Tarski is the textbook example of why the Axiom of Choice is controversial — used in every graduate-level real analysis course.",
    },
    {
      domain: "Foundations of mathematics",
      description:
        "It motivated 20th-century work on alternative set-theoretic foundations (constructivism, intuitionism) and influenced computer-verified proofs.",
    },
    {
      domain: "Philosophy of mathematics",
      description:
        "Frequently invoked in discussions of mathematical realism, the meaning of 'infinity', and the limits of intuition.",
    },
  ],
  lsystem: [
    {
      domain: "Procedural plants in games & film",
      description:
        "Trees, ferns and grass in titles like The Lion King (1994), Avatar (2009) and countless modern games are generated from L-systems via SpeedTree and similar middleware.",
    },
    {
      domain: "Architecture & CAD",
      description:
        "Generative architecture tools (Grasshopper for Rhino) use L-systems to grow branching structures, façades and street networks.",
    },
    {
      domain: "Plant biology research",
      description:
        "Plant biologists fit L-systems to real species (e.g. apple tree topology) to study growth dynamics, light competition and yield optimisation.",
    },
    {
      domain: "Music composition",
      description:
        "Composers map L-system strings to MIDI events to algorithmically grow themes that develop fractal self-similarity over time.",
    },
  ],
  wang: [
    {
      domain: "Real-time graphics",
      description:
        "Wang tilesets are used to pack non-repeating textures (grass, brick, sand) into tiny texture atlases — important on memory-constrained devices like mobile GPUs.",
    },
    {
      domain: "Procedural level design",
      description:
        "Game engines (Houdini, custom roguelike engines) use Wang tiles to assemble large dungeon/world maps from small modular building blocks without visible seams.",
    },
    {
      domain: "Materials & quasicrystals",
      description:
        "Wang tile theory partially overlaps with quasicrystal mathematics — both produce aperiodic infinite arrangements.",
    },
  ],
  collatz: [
    {
      domain: "Pure mathematics open problem",
      description:
        "Listed as one of the most famous open problems in elementary number theory; verified by computer to 2.95×10²⁰ as of 2024.",
    },
    {
      domain: "Distributed computing",
      description:
        "The BOINC / collatzconjecture.org project crowdsources the search for a counterexample using volunteer GPU time.",
    },
    {
      domain: "Pedagogy",
      description:
        "Used in middle-school 'number tricks' demonstrations and in undergraduate research projects on integer sequences.",
    },
  ],
  doublependulum: [
    {
      domain: "Robotics",
      description:
        "Two-link robot arms are mathematical double pendulums; understanding their nonlinear coupling is essential for stable control of industrial manipulators.",
    },
    {
      domain: "Biomechanics",
      description:
        "Human limbs during walking, throwing and gymnastic moves are modelled as multi-pendulum systems for rehabilitation and prosthetics research.",
    },
    {
      domain: "Science museums",
      description:
        "Double-pendulum displays in museums (e.g. Exploratorium, Deutsches Museum) physically demonstrate the butterfly effect to visitors.",
    },
    {
      domain: "Acrobatics & rigging",
      description:
        "Cirque du Soleil and theatrical riggers must understand pendulum-of-pendulum dynamics for safe trapeze and aerial silk choreography.",
    },
  ],
  bzr: [
    {
      domain: "Cardiac arrhythmias",
      description:
        "Spiral wave patterns very similar to BZR spirals are observed on the heart's surface during fibrillation — central to defibrillator design and research.",
    },
    {
      domain: "Neuroscience",
      description:
        "Cortical spreading depression (a wave of neural depolarisation linked to migraines) is modelled as a BZR-like excitable medium.",
    },
    {
      domain: "Chemistry education",
      description:
        "BZR is the most striking 'living chemistry' demo a high-school chemistry teacher can show — visible oscillation in a flask.",
    },
    {
      domain: "Nobel-winning theory",
      description:
        "Ilya Prigogine won the 1977 Nobel Prize for the theory of dissipative structures grounded in systems like BZR.",
    },
  ],
  turingpattern: [
    {
      domain: "Developmental biology",
      description:
        "Stripes on zebrafish, spacing of hair follicles in mice, fingerprint formation, and digit patterning in vertebrate embryos have all been measured to follow Turing dynamics.",
    },
    {
      domain: "Plant phyllotaxis",
      description:
        "Spiral arrangements of sunflower seeds, pinecones and pineapple scales emerge from reaction-diffusion + golden-angle phyllotaxis — Turing chemistry on a growing surface.",
    },
    {
      domain: "Generative art & graphics",
      description:
        "Reaction-diffusion patterns are widely used as procedural texture noise (skin, bark, coral) in 3D modelling tools like Substance Designer and Houdini.",
    },
    {
      domain: "Drug delivery & materials",
      description:
        "Self-organising microstructures in polymer membranes and drug-release coatings are engineered using Turing-type instabilities.",
    },
  ],
  sierpinski: [
    {
      domain: "Fractal antennas",
      description:
        "Sierpiński gasket antennas are commercial products — cell phones, Wi-Fi routers and GPS devices use multi-band fractal patches that resonate at many frequencies in a small footprint.",
    },
    {
      domain: "Heat exchangers",
      description:
        "Sierpiński-style branching channels appear in printed cooling plates used for high-power LEDs and chip cooling, maximising surface area.",
    },
    {
      domain: "Compression & graphics",
      description:
        "Iterated Function Systems (Sierpiński-style IFS) underlie fractal image compression algorithms — still used in niche aerial-imagery encoders.",
    },
    {
      domain: "Networking",
      description:
        "Hierarchical IP routing and tree topologies inherit Sierpiński-style fractal scaling properties for load balancing.",
    },
  ],
  chaosgame: [
    {
      domain: "Bioinformatics",
      description:
        "Chaos Game Representation (CGR) is a standard way to visualise DNA sequences — each nucleotide steers a point toward one of four corners of a square; species cluster into recognisable fractal signatures.",
    },
    {
      domain: "Fractal compression",
      description:
        "Barnsley's fractal image compression encodes images as a small set of contractive maps recovered via the chaos game.",
    },
    {
      domain: "Procedural texturing",
      description:
        "Chaos game outputs (Barnsley fern variants) are widely used for procedural foliage and stylised brush strokes.",
    },
  ],
  penrose: [
    {
      domain: "Quasicrystals",
      description:
        "Dan Shechtman's 1982 discovery of metallic quasicrystals (Nobel 2011) was understood through Penrose tilings — the same five-fold mathematics governs both.",
    },
    {
      domain: "Architecture",
      description:
        "The Storey Hall facade in Melbourne and several Islamic-mathematical patterns at Topkapı Palace use Penrose-style aperiodic geometry.",
    },
    {
      domain: "Materials science",
      description:
        "Quasicrystalline coatings (e.g. on Sjöbo non-stick pans) are commercial today, exploiting Penrose-tiling-style atomic arrangements.",
    },
    {
      domain: "Cryptography",
      description:
        "Recently proposed pseudorandom-number generators use aperiodic tiling sequences for low-discrepancy sampling.",
    },
  ],
  apollonian: [
    {
      domain: "Granular packing",
      description:
        "How sand, gravel and pharmaceutical powders fill containers is modelled with Apollonian-style sphere packings — important in concrete, drug tablets and powder metallurgy.",
    },
    {
      domain: "Number theory",
      description:
        "Integer Apollonian packings are studied by analytic number theorists — papers by Sarnak, Bourgain & Kontorovich produced new results on prime curvatures.",
    },
    {
      domain: "Foam & emulsion physics",
      description:
        "Foam structures (beer head, food emulsions, lung alveoli) inherit Apollonian-style packing constraints during their formation.",
    },
    {
      domain: "Graphic design",
      description:
        "Logo, poster and tattoo design uses Apollonian gaskets for striking radial geometry.",
    },
  ],
  phi: [
    {
      domain: "Plant phyllotaxis",
      description:
        "Sunflower seed spirals, pinecone scales and the leaf arrangements of most plants converge to the golden angle — verified across thousands of species.",
    },
    {
      domain: "Continued fractions",
      description:
        "φ has the simplest continued fraction expansion [1;1,1,…], making it the 'most irrational' number — a key concept for KAM theory in classical mechanics.",
    },
    {
      domain: "Quasicrystals & Penrose",
      description:
        "Side-length ratios in Penrose tilings (and the inflation factor) are exactly φ; the same ratio appears in real quasicrystals discovered in nature in 2009.",
    },
    {
      domain: "Number theory",
      description:
        "Fibonacci numbers underlie Zeckendorf's theorem and efficient integer representations used in some compression and data-structure algorithms.",
    },
    {
      domain: "Honest skepticism",
      description:
        "Claims that φ appears in the Parthenon, Mona Lisa, the nautilus shell or human body proportions are largely myths — debunked by George Markowsky (1992) and others.",
    },
  ],
  buffon: [
    {
      domain: "Monte Carlo integration",
      description:
        "Buffon's needle is the historical seed of Monte Carlo methods — now used everywhere from financial pricing (Black–Scholes) to particle-physics simulation (Geant4) and rendering (path tracing).",
    },
    {
      domain: "Physics simulation",
      description:
        "Random sampling of high-dimensional integrals in lattice QCD, nuclear engineering and reactor design extends Buffon's logic to millions of dimensions.",
    },
    {
      domain: "Computer graphics",
      description:
        "Stratified sampling of light rays in modern path tracers (Pixar, Cycles, Unreal Lumen) carefully descends from Buffon's needle.",
    },
    {
      domain: "Statistics teaching",
      description:
        "Standard introductory probability demonstration; still performed in undergraduate stats labs around the world.",
    },
  ],
  hilberthotel: [
    {
      domain: "Set theory & teaching",
      description:
        "The canonical analogy for understanding cardinal arithmetic and the differences between countable and uncountable infinities.",
    },
    {
      domain: "Programming infinite structures",
      description:
        "Lazy infinite lists in Haskell, generators in Python and streams in Scala echo Hilbert-hotel-style reshufflings of countable infinity.",
    },
    {
      domain: "Popular science communication",
      description:
        "TED-Ed video, Vsauce, PBS Infinite Series — the most widely shared modern explanation of infinity.",
    },
  ],
  gabrielshorn: [
    {
      domain: "Calculus teaching",
      description:
        "The standard early-calculus example of a counter-intuitive improper integral, used in every second-year calculus textbook.",
    },
    {
      domain: "Philosophy of mathematics",
      description:
        "Cited in debates over the meaning of geometric paradoxes and the limits of physical intuition — a foundational thought experiment.",
    },
    {
      domain: "Microfluidics",
      description:
        "Real-world analogues with capillary-driven flow into ever-narrowing channels (microfluidic devices) face the limit cases Gabriel's Horn formalises.",
    },
  ],
  cantor: [
    {
      domain: "Computability theory",
      description:
        "Cantor's diagonal directly produces Turing's halting-problem proof and Gödel's incompleteness theorems — the cornerstones of theoretical computer science.",
    },
    {
      domain: "Programming language theory",
      description:
        "Used to prove there is no 'universal' type system that decides type-checking for all programs (Rice's theorem).",
    },
    {
      domain: "Cryptography & complexity",
      description:
        "Diagonalisation arguments underlie modern complexity-theory results — separations between P, NP, EXP.",
    },
    {
      domain: "Philosophy of mathematics",
      description:
        "Cantor's argument upended Aristotelian and Kantian views of infinity, shaping 20th-century logic and analytic philosophy.",
    },
  ],
  boids: [
    {
      domain: "Visual effects in films",
      description:
        "Batman Returns (1992 bat swarm), The Lion King (1994 wildebeest stampede), and countless modern films use Boids — usually via Massive or Houdini.",
    },
    {
      domain: "Drone swarms",
      description:
        "Intel's record-setting drone light shows (2018 PyeongChang Olympics, 2024 Paris Olympics) use Boids-derived rules at huge scale.",
    },
    {
      domain: "Crowd simulation",
      description:
        "Architecture firms simulate stadium evacuations and shopping-mall flow with Boids-style agents — used in stadium planning since the 2000s.",
    },
    {
      domain: "Robotics swarms",
      description:
        "Research labs use Boids-style rules for autonomous robot swarms in search-and-rescue and agricultural monitoring.",
    },
    {
      domain: "Real nature",
      description:
        "Empirical studies of starling murmurations (Cavagna et al., 2010), schooling fish and herding mammals confirm rules very close to the original Boids.",
    },
  ],
  aizawa: [
    {
      domain: "Dynamical systems research",
      description:
        "Aizawa is one of a family of 3-D strange attractors used to test numerical integrators, visualisation algorithms, and chaos detection methods.",
    },
    {
      domain: "Math art",
      description:
        "Generative artists render Aizawa, Thomas and Halvorsen attractors as plots, prints, and animations sold on Etsy and at art fairs.",
    },
    {
      domain: "Education",
      description:
        "Increasingly used alongside Lorenz in graduate dynamical-systems courses to show a wider zoo of chaotic shapes.",
    },
  ],
  dla: [
    {
      domain: "Electrochemistry",
      description:
        "Zinc, copper and other metal deposits grown in electrolytic cells form DLA-type dendrites — directly relevant to plating, battery design (lithium dendrite formation) and corrosion.",
    },
    {
      domain: "Crystal growth",
      description:
        "Snowflake formation, frost on windows, mineral dendrites in rock — all exhibit DLA scaling laws.",
    },
    {
      domain: "Biology",
      description:
        "Bacterial colony fronts on agar plates, neural growth cones and the boundary of some tumours follow DLA-like rules.",
    },
    {
      domain: "Lightning physics",
      description:
        "The branching of lightning bolts and dielectric breakdown patterns are well modelled by DLA.",
    },
  ],
  langton: [
    {
      domain: "Artificial life",
      description:
        "Langton's Ant is a foundational example for the artificial-life field he helped found at Santa Fe Institute.",
    },
    {
      domain: "Theoretical CS",
      description:
        "Used as a minimal example of universal computation in 2-D Turing machines; still cited in foundational complexity papers.",
    },
    {
      domain: "Education",
      description:
        "A favourite introductory example for cellular automata courses — the 'highway' phase is the most accessible emergent phenomenon in computer science.",
    },
  ],
  pascalmod: [
    {
      domain: "Number theory",
      description:
        "Lucas's theorem (1878) directly powers efficient algorithms for binomial coefficients modulo prime — used in cryptography, combinatorics on words, and competitive programming.",
    },
    {
      domain: "Coding theory",
      description:
        "Reed–Muller and BCH error-correcting codes rely on binomial-coefficient-mod-p machinery — they're in QR codes, deep-space probes (Mariner 9, Voyager) and DVB-T digital TV.",
    },
    {
      domain: "Visual art",
      description:
        "Pascal mod 2 is the algebraic origin of the Sierpiński triangle — sold as posters, woven into rugs, used as gallery installations.",
    },
  ],
  sternbrocot: [
    {
      domain: "Computer music & tuning",
      description:
        "Microtonal composers use Stern–Brocot to find equal-tempered approximations to just-intonation ratios — central to xenharmonic music.",
    },
    {
      domain: "Robotics gear design",
      description:
        "Best-rational-approximation searches for gear ratios traverse the Stern–Brocot tree to find efficient mechanical reductions.",
    },
    {
      domain: "Calendar systems",
      description:
        "Continued-fraction-based leap-year rules (Persian calendar, proposed Gregorian fixes) are derived from Stern–Brocot mediants.",
    },
    {
      domain: "Image rendering",
      description:
        "Sub-pixel sampling and modern font rasterisation use Stern–Brocot-style mediants to choose pixel coverage ratios.",
    },
  ],
  ulam: [
    {
      domain: "Pure number theory",
      description:
        "Visualising primes via Ulam-style spirals continues to inspire new conjectures about polynomial prime densities (Hardy–Littlewood, Sato–Tate).",
    },
    {
      domain: "Education",
      description:
        "Standard exhibit in math museums and an introductory exploration in number-theory courses.",
    },
    {
      domain: "Generative art",
      description:
        "Ulam-spiral derived works appear in artists' shows (Roman Verostko, Tristan Perich).",
    },
  ],
  cardioid: [
    {
      domain: "Audio engineering",
      description:
        "Cardioid microphones (the kind every podcaster and broadcaster uses) get their name from the cardioid pickup pattern — they're sensitive in front and dead behind.",
    },
    {
      domain: "Antenna design",
      description:
        "Some antenna directivity patterns are cardioid; common in marine VHF and direction-finding equipment.",
    },
    {
      domain: "Architecture & lighting",
      description:
        "Cardioid reflectors are used in classical theatre lighting (PAR cans) to project asymmetric beams.",
    },
    {
      domain: "Mandelbrot connection",
      description:
        "The main bulb of the Mandelbrot set is exactly a cardioid; understanding the shape illuminates the Mandelbrot bifurcation diagram.",
    },
  ],
  galton: [
    {
      domain: "Statistics teaching",
      description:
        "The Galton board is the canonical demonstration of the central limit theorem — present in nearly every science museum (Deutsches Museum, Boston Museum of Science, MOSS Toronto).",
    },
    {
      domain: "Quincunx in genetics",
      description:
        "Galton built the original board to make hereditary statistics visible to Victorian audiences; it laid groundwork for biometrics and statistical genetics.",
    },
    {
      domain: "Plinko / game design",
      description:
        "Galton boards inspired the Plinko TV game and modern mobile pachinko/slot games; physical and digital alike.",
    },
    {
      domain: "Manufacturing tolerance analysis",
      description:
        "Statistical tolerance stack-up calculations in mechanical engineering directly invoke central-limit logic visualised by Galton's board.",
    },
  ],
  magpendulum: [
    {
      domain: "Chaos demonstrations",
      description:
        "The 'three magnet pendulum' desk toy is the most popular physical demonstration of fractal basin boundaries — sold by ThinkGeek, Nikola Labs and many science gift shops.",
    },
    {
      domain: "Magnetic levitation research",
      description:
        "The dynamics of permanent-magnet pendulums underpin maglev trains, magnetic bearings, and magnetorheological dampers.",
    },
    {
      domain: "Education",
      description:
        "Standard nonlinear-dynamics demo in undergraduate physics; used to teach phase space, dissipation, and final-state sensitivity.",
    },
  ],
  godel: [
    {
      domain: "Foundations of mathematics",
      description:
        "Gödel ended Hilbert's programme of mechanising mathematics; it reshaped what mathematicians believe is provable in principle.",
    },
    {
      domain: "Computer science",
      description:
        "Tarski's undefinability of truth, Turing's halting problem and Rice's theorem are all direct descendants — used in every undergraduate logic and computability course.",
    },
    {
      domain: "Philosophy of mind",
      description:
        "Penrose's argument that human minds are not purely algorithmic (The Emperor's New Mind, 1989) leans heavily on Gödel — controversial but influential.",
    },
    {
      domain: "Verified software",
      description:
        "Modern proof assistants (Coq, Lean, Isabelle) confront Gödel's limits every day; their entire usefulness lies in formalising what is provable inside an explicit system.",
    },
  ],
  halting: [
    {
      domain: "Compilers & static analysis",
      description:
        "Modern static analysers (Coverity, Infer, Rust's borrow checker) have to give up perfect precision because non-trivial program properties are undecidable — direct halting-problem consequence (Rice's theorem).",
    },
    {
      domain: "Antivirus",
      description:
        "Why no antivirus catches every malware: perfectly detecting hostile programs would solve a variant of the halting problem.",
    },
    {
      domain: "Compute clouds",
      description:
        "Cloud autoscalers can never guarantee 'this user job will halt' — they enforce timeouts because deciding halting is impossible.",
    },
    {
      domain: "Education",
      description:
        "The canonical introduction to undecidability in every theory-of-computation course on Earth.",
    },
  ],
  pvsnp: [
    {
      domain: "Cryptography",
      description:
        "If P = NP, RSA, AES, all blockchain and TLS-protected traffic would be broken overnight — every modern digital secret depends on P ≠ NP being effectively true.",
    },
    {
      domain: "Optimisation",
      description:
        "Logistics (UPS routing), chip design (place-and-route), and machine learning hyperparameter search rely on NP-hard problems being attacked heuristically because exact solutions are intractable.",
    },
    {
      domain: "AI / SAT solvers",
      description:
        "Modern SAT/SMT solvers (Z3, MiniSat) routinely solve million-variable NP-hard instances thanks to clever heuristics, even though worst-case complexity is exponential.",
    },
    {
      domain: "Bioinformatics",
      description:
        "Protein folding, genome assembly and phylogenetic tree reconstruction are all NP-hard — driving the field to invent approximation algorithms and AI methods (AlphaFold).",
    },
    {
      domain: "Open prize",
      description:
        "One of seven Clay Millennium problems with a $1,000,000 prize for proof or disproof.",
    },
  ],
  rsa: [
    {
      domain: "TLS / HTTPS",
      description:
        "Every padlock icon in your browser involves either RSA or its elliptic-curve cousin (ECDSA) for the initial handshake — billions of times every second.",
    },
    {
      domain: "Digital signatures",
      description:
        "Apple's App Store, Google Play and Microsoft Update sign every release with RSA-style public-key cryptography; if forged, malware would spread freely.",
    },
    {
      domain: "Banking & blockchain",
      description:
        "SWIFT messages, debit-card chip transactions and most blockchain wallets rely on hard-factoring or hard-discrete-log assumptions equivalent to RSA.",
    },
    {
      domain: "Identity documents",
      description:
        "Modern passports (ICAO 9303) contain RSA-signed biometric data; border control verifies the signature against national CAs.",
    },
    {
      domain: "Post-quantum panic",
      description:
        "Shor's algorithm breaks RSA on a sufficiently large quantum computer; NIST is in the middle of standardising post-quantum replacements (Kyber, Dilithium).",
    },
  ],
  mobius: [
    {
      domain: "Industrial conveyor belts",
      description:
        "Möbius-strip drive belts wear evenly on both 'sides' (there is only one!) — used in old printing presses, modern recording tape and some VHS tape systems.",
    },
    {
      domain: "Mechanical engineering",
      description:
        "Möbius gears and Möbius-shaped resistors have been patented to halve wear and inductance respectively.",
    },
    {
      domain: "Topology research",
      description:
        "The Möbius strip is the simplest non-orientable surface — entry point to a vast field that classifies all surfaces, used in cosmology and string theory.",
    },
    {
      domain: "Art & architecture",
      description:
        "Max Bill's Endless Ribbon, the recycling-symbol triangle, and architects from Mexico to Astana use Möbius topology for striking installations.",
    },
    {
      domain: "Chemistry",
      description:
        "Möbius aromatic molecules (Heilbronner 1964; first synthesised 2003) have a half-twist of π-electrons; they exhibit electronic properties no flat ring can.",
    },
  ],
  eulerchar: [
    {
      domain: "Computer graphics",
      description:
        "Mesh validation (Blender, Maya) checks V−E+F against expected χ to detect holes or duplicated geometry before 3D printing.",
    },
    {
      domain: "Topology of data",
      description:
        "Persistent homology pipelines use Euler characteristics to summarise the shape of high-dimensional point clouds — applied to genomics, sensor networks and cosmology.",
    },
    {
      domain: "Architecture",
      description:
        "Buckminster Fuller's geodesic domes (Epcot's Spaceship Earth, Montreal Biosphère) are designed so that V−E+F=2 forces exactly 12 pentagons among the hexagons.",
    },
    {
      domain: "Football design",
      description:
        "The classical truncated-icosahedron football has 12 pentagons + 20 hexagons; Euler's formula explains why exactly 12, no fewer.",
    },
    {
      domain: "Particle physics",
      description:
        "The Atiyah-Singer index theorem, foundational to modern gauge theory, generalises Euler's formula and connects topology to differential equations.",
    },
  ],
  konigsberg: [
    {
      domain: "Birth of graph theory",
      description:
        "Königsberg launched the entire field — graph theory now underlies Google's PageRank, social-network analysis, chip layout and route planning.",
    },
    {
      domain: "DNA sequencing",
      description:
        "Eulerian-path algorithms inspired by Königsberg are the workhorses behind modern genome assembly (Pevzner & Tang, 2001; used in spades, velvet, megahit).",
    },
    {
      domain: "Route optimisation",
      description:
        "Postal workers, garbage trucks and snowploughs solve the Chinese Postman Problem — a direct descendant of the Königsberg bridges.",
    },
    {
      domain: "Tourism",
      description:
        "Kaliningrad (modern Königsberg) markets the bridges; tourists try the walk even though only five of the original seven survived WWII.",
    },
  ],
  fourcolor: [
    {
      domain: "Map design",
      description:
        "Cartographers and GIS engineers actually use four-colouring algorithms for political maps, country atlases and weather visualisation.",
    },
    {
      domain: "Mobile networks",
      description:
        "Frequency allocation between cell towers maps to graph colouring — the four-colour theorem is the limit case for some planar layouts.",
    },
    {
      domain: "Scheduling",
      description:
        "University exam scheduling, conference rooms and sport-league fixtures are all graph-colouring problems; planar variants inherit the four-colour bound.",
    },
    {
      domain: "Computer-verified mathematics",
      description:
        "Together with the Kepler conjecture, the four-colour theorem was a milestone in computer-assisted proof — proof-assistant culture (Coq, Lean) trace their legitimacy back to it.",
    },
  ],
  smallworld: [
    {
      domain: "Social networks",
      description:
        "LinkedIn's '2nd-degree' connection feature, Twitter retweet cascades and Facebook's 'people you may know' all exploit small-world structure for relevance.",
    },
    {
      domain: "Epidemic models",
      description:
        "COVID-19 spread modelling, contact-tracing apps and vaccination strategy use small-world network models to predict outbreak dynamics.",
    },
    {
      domain: "Brain research",
      description:
        "fMRI studies show that the human connectome is a small-world network — small-world coefficient is now a standard biomarker in Alzheimer's and schizophrenia research.",
    },
    {
      domain: "Internet routing",
      description:
        "The Internet's autonomous-system graph has small-world properties; BGP and modern CDNs (Cloudflare, Fastly) exploit short hop distances.",
    },
    {
      domain: "Six Degrees of Kevin Bacon",
      description:
        "The 1994 movie game and the Bacon Number website are popular-culture artefacts of small-world theory; mathematicians compete for low Erdős numbers.",
    },
  ],
  quine: [
    {
      domain: "Programming language theory",
      description:
        "Quines are the standard sanity-check that a language is expressive enough for self-reference; courses on theory of computation use them to teach Kleene's recursion theorem in concrete form.",
    },
    {
      domain: "Computer viruses & self-replicators",
      description:
        "Every classical virus, worm and metamorphic engine is a quine variant: code that copies itself before doing anything else. Modern self-replicating malware is studied as applied quine engineering.",
    },
    {
      domain: "Genetics & molecular biology",
      description:
        "DNA replication is biology's quine: a sequence whose only job is to copy itself, including the copying machinery. Hofstadter draws the analogy explicitly in Gödel, Escher, Bach.",
    },
    {
      domain: "Compiler bootstrapping",
      description:
        "Trusting Trust (Ken Thompson, 1984) showed that a compiler's compiler can be a quine inserting a backdoor at every build — the foundation of supply-chain security and reproducible-build research.",
    },
    {
      domain: "Demoscene & code art",
      description:
        "Polyglot quines — programs that print themselves and are valid in multiple languages — are a beloved code-art genre; the IOCCC has a dedicated quine category.",
    },
  ],
  backprop: [
    {
      domain: "Deep learning",
      description:
        "Every modern neural network — image classifier, language model, recommender — is trained by backpropagation. PyTorch and JAX implement it as their differentiation core (autograd).",
    },
    {
      domain: "Computer vision",
      description:
        "Convolutional networks for medical imaging, autonomous driving and biometric ID all use backprop to learn filter kernels directly from labelled data; gradients flow back through convolutions and pooling layers.",
    },
    {
      domain: "Language models",
      description:
        "GPT, Claude, Llama and every transformer are trained by backpropagating cross-entropy loss through trillions of parameters. The single algorithm that scales from one neuron to one trillion.",
    },
    {
      domain: "Robotics & control",
      description:
        "Policy-gradient methods in reinforcement learning use backprop to update neural controllers from reward signals; modern bipedal-walking and dexterous-manipulation robots all use it.",
    },
    {
      domain: "Inverse problems in science",
      description:
        "Physicists invert experiments by setting up the forward model in PyTorch/JAX and backpropagating through it — used in protein design (AlphaFold), differentiable rendering, and gradient-based experimental design.",
    },
  ],
  diffusion: [
    {
      domain: "Image generation",
      description:
        "Stable Diffusion, Midjourney, DALL·E 3 and Imagen are all latent-diffusion models. Type a prompt, the model walks Gaussian noise back to an image consistent with the text.",
    },
    {
      domain: "Video generation",
      description:
        "Sora, Veo and Runway extend the same diffusion math to three dimensions (height × width × time) so the denoiser learns space-time consistency along with appearance.",
    },
    {
      domain: "Drug & protein design",
      description:
        "RFdiffusion (Baker lab) and Chroma generate novel protein backbones by denoising 3D coordinates instead of pixels — published candidates have been synthesised and shown to fold.",
    },
    {
      domain: "Audio & speech",
      description:
        "AudioLDM, Riffusion and the speech-synthesis line ElevenLabs/Vall-E use 1D diffusion over waveforms or spectrograms to generate music and natural-sounding voices from text.",
    },
    {
      domain: "Physics & thermodynamics",
      description:
        "The forward process is literally Langevin dynamics — the noise schedule mirrors a system relaxing toward thermal equilibrium. Sohl-Dickstein's original 2015 paper was framed as non-equilibrium thermodynamics.",
    },
  ],
  riemann: [
    {
      domain: "Prime number theorem",
      description:
        "The error term in the count of primes below N is controlled by the zeros of ζ; the Riemann hypothesis is equivalent to the sharpest possible bound on how irregularly the primes are spaced.",
    },
    {
      domain: "Cryptography",
      description:
        "RSA, elliptic-curve crypto and integer-factorisation hardness all depend on assumptions about prime distribution; RH-equivalent statements feed into best-known bounds on cryptographic security.",
    },
    {
      domain: "Quantum chaos",
      description:
        "The statistics of zeta-zero spacings match the eigenvalue statistics of random Hermitian matrices — the same matrices that model heavy-nucleus energy levels. The Montgomery-Dyson conjecture (1972) is one of the most surprising links in mathematics.",
    },
    {
      domain: "Computer-verified numerics",
      description:
        "The first 10^13 non-trivial zeros have been computed to lie on the critical line (Xavier Gourdon, 2004 and later). No counterexample to RH has ever been found in any verification campaign.",
    },
    {
      domain: "Pop science & open-problem prestige",
      description:
        "Riemann is the most famous unsolved problem outside Fermat — a Clay Millennium Prize ($1M), recurring fictional appearances (A Beautiful Mind, The Music of the Primes), and a steady stream of disproofs that don't survive peer review.",
    },
  ],
};

const de: Partial<Record<TopicId, Application[]>> = {
  eml: [
    {
      domain: "Symbolische Regression",
      description:
        "Computeralgebra-Systeme, die physikalische Gesetze aus Daten wiederentdecken wollen, nutzen manchmal kompakte Operator-Alphabete wie EML, um den Suchraum einzugrenzen.",
    },
    {
      domain: "Theoretische Informatik",
      description:
        "EML ist verwandt mit universellen Mengen wie NAND in der Logik und Iota in der Kombinatorik — spannend dafür, wie klein ein Primitiv überhaupt sein kann.",
    },
  ],
  mandelbrot: [
    {
      domain: "Generative Kunst & Motion Graphics",
      description:
        "Filmschaffende und digitale Künstler:innen zoomen in die Mandelbrot-Menge, um Hintergründe für Musikvideos bis hin zu Eröffnungssequenzen von Apple-Keynotes zu erzeugen.",
    },
    {
      domain: "Fraktale Antennen",
      description:
        "Mandelbrot-/Julia-artige Ränder werden in kompakten Multiband-Antennen verwendet (z.B. in frühen Bluetooth-Modulen), weil die selbstähnliche Form über viele Frequenzen hinweg resoniert.",
    },
    {
      domain: "Lehre",
      description:
        "Standardbeispiel an Universitäten für komplexe Dynamik, deterministisches Chaos und die Grenze zwischen Ordnung und Chaos.",
    },
    {
      domain: "Vorbilder in der Natur",
      description:
        "Küstenlinien, Bergkämme, Farnblätter und Brokkoli-Röschen zeigen dieselbe selbstähnliche Randstruktur — genau darum ging es Mandelbrot bei der fraktalen Geometrie.",
    },
  ],
  life: [
    {
      domain: "Informatik-Lehre",
      description:
        "Jedes Informatik-Curriculum von MIT 6.001 bis zur Schul-AG nutzt Conways Life, um Emergenz, zelluläre Automaten und Turing-Vollständigkeit an einem Nachmittag zu vermitteln.",
    },
    {
      domain: "Generative Kunst",
      description:
        "Designer:innen nutzen Life und seine Varianten (HighLife, Day & Night, …), um sich ständig wandelnde Visuals für Musikvideos, Installationen und Bildschirmschoner zu erzeugen.",
    },
    {
      domain: "Diskrete Biologie modellieren",
      description:
        "Demografie, Räuber-Beute-Dynamik und Epidemieausbreitung werden manchmal auf Life-artigen Gittern prototypisiert, bevor man auf reichere agentenbasierte Modelle umsteigt.",
    },
    {
      domain: "Hardware-Basteln",
      description:
        'FPGA- und Mikrocontroller-Projekte rendern Life oft auf LED-Matrizen als „Hello World" für parallele zelluläre Hardware.',
    },
  ],
  nand: [
    {
      domain: "In jedem Chip",
      description:
        "Vom Apple-Silicon der M-Serie bis zu industriellen Mikrocontrollern werden jede Minute Milliarden NAND-Gatter in Silizium geätzt. Viele digitale ASICs werden ausschließlich aus NAND synthetisiert.",
    },
    {
      domain: "Flash-Speicher",
      description:
        "NAND-Flash-Speicher (USB-Sticks, SSDs, Smartphones) verdankt Name und Architektur den NAND-Gattern, die in Floating-Gate-Transistor-Arrays angeordnet sind.",
    },
    {
      domain: "Hardware-Kurse",
      description:
        "Der Kurs nand2tetris baut einen kompletten Computer ausgehend von einem einzigen NAND-Chip — eingesetzt an über 100 Universitäten.",
    },
    {
      domain: "Embedded-Logik",
      description:
        "Einzelne diskrete 74HC00-NAND-Quad-ICs werden bis heute für einfache Glue Logic, Pegelwandler und Oszillatoren auf Hobby-Platinen verbaut.",
    },
  ],
  iota: [
    {
      domain: "Kombinator-Interpreter",
      description:
        "Compiler funktionaler Programmiersprachen (z.B. Lazy K) übersetzen Lambda-Kalkül-Programme bei der Codegenerierung in reine Kombinator-Ausdrücke — im Iota-Stil.",
    },
    {
      domain: "Esoterische Sprachen",
      description:
        "Iota und sein Geschwister Jot sind minimalistische Programmiersprachen, um die kleinstmögliche Turing-vollständige Syntax zu untersuchen.",
    },
    {
      domain: "Lambda-Kalkül-Lehre",
      description:
        "Universitäten nutzen Iota, um zu zeigen, dass ein einziger Kombinator genügt — und trennen so Syntax von Berechnungsmächtigkeit.",
    },
  ],
  rule110: [
    {
      domain: "Wolfram Physics Project",
      description:
        "Stephen Wolframs Programm, die zugrundeliegende Regel des Universums zu finden, beruft sich ausdrücklich auf Regel 110 als Beweis, dass winzige Regeln universell berechnen können.",
    },
    {
      domain: "Lehre der formalen Berechenbarkeit",
      description:
        "In jeder modernen Einführung zu zellulären Automaten als einfachstes bekanntes universelles System zitiert — eine Turing-Maschine in Tweet-Länge.",
    },
    {
      domain: "Prozedurales Texturrauschen",
      description:
        "Einige Shader-Bibliotheken nutzen Regel 110 (und 30) als günstige Quelle für komplexes 1D-Rauschen in stilisierter generativer Grafik.",
    },
  ],
  logistic: [
    {
      domain: "Populationsbiologie",
      description:
        "Die kontinuierliche logistische Gleichung modelliert eng begrenzte Populationen von Bakterien, Hefe und sogar einigen Säugetieren; die diskrete Abbildung wird in jeder quantitativen Ökologie-Vorlesung gelehrt.",
    },
    {
      domain: "Epidemiologie",
      description:
        "Begrenztes epidemisches Wachstum (mit Kapazitätsgrenze = anfälliger Bevölkerungspool) folgt logistischen Kurven — die kumulierten COVID-19-Fallzahlen waren ein Lehrbuchbeispiel.",
    },
    {
      domain: "Maschinelles Lernen",
      description:
        "Lernraten-Schedules im Deep Learning geraten manchmal in dasselbe Periodenverdopplungs-Chaos, wenn die Rate zu groß wird; die logistische Abbildung liefert die Intuition.",
    },
    {
      domain: "Neurowissenschaft",
      description:
        "Modelle für Feuerraten von Neuronen bei hohen Eingangsströmen bifurkieren genau wie die logistische Abbildung und sagen das Einsetzen unregelmäßiger Spike-Muster voraus.",
    },
    {
      domain: "Klima & Wetter",
      description:
        "Periodenverdopplung im Feigenbaum-Stil wurde experimentell in Konvektionszellen reproduziert und zeigt denselben universellen Weg in die Turbulenz.",
    },
  ],
  lorenz: [
    {
      domain: "Wettervorhersage",
      description:
        "Operative Vorhersagedienste nutzen Ensemble-Methoden, weil die Atmosphäre Lorenz' Empfindlichkeit gegenüber Anfangsbedingungen teilt — nach etwa 14 Tagen bricht die Vorhersagbarkeit zusammen.",
    },
    {
      domain: "Klimamodellierung",
      description:
        "Lorenz' Arbeit von 1963 begründete die moderne Chaostheorie und prägt unser Verständnis der Vorhersagegrenzen langfristiger Klimasimulationen.",
    },
    {
      domain: "Lehre",
      description:
        "Jede Grundvorlesung über dynamische Systeme visualisiert den Lorenz-Attraktor als kanonischen seltsamen Attraktor.",
    },
    {
      domain: "Sichere Kommunikation",
      description:
        "Chaosbasierte Verschlüsselungsverfahren haben Lorenz-artige Synchronisation genutzt, um Signale zu verbergen — Nische, aber real (Cuomo & Oppenheim, 1993).",
    },
  ],
  fourier: [
    {
      domain: "MP3, AAC, Opus",
      description:
        "Alle modernen verlustbehafteten Audio-Codecs transformieren kurze Klangfenster in den Frequenzbereich, verwerfen unhörbare Anteile und transformieren zurück.",
    },
    {
      domain: "JPEG und HEIC",
      description:
        "Jeder 8×8-Pixelblock eines JPEG wird als Koeffizienten der diskreten Kosinustransformation gespeichert — daher die typischen horizontalen/vertikalen Ringing-Artefakte.",
    },
    {
      domain: "MRT-Scanner",
      description:
        "Ein MRT-Gerät misst buchstäblich Fourier-Koeffizienten (k-Raum) Ihres Gewebes und transformiert sie zurück in das Bild, das Sie bei der Ärztin sehen.",
    },
    {
      domain: "WLAN, 5G, DSL",
      description:
        "Moderne drahtlose und drahtgebundene Übertragung nutzt OFDM, das Daten auf tausende sorgfältig beabstandete Sinus-Träger verteilt — reines Fourier-Engineering.",
    },
    {
      domain: "Sprache & ML",
      description:
        "Mel-Spektrogramm-Features (Fourier-transformiertes Audio) sind der Input fast jedes Spracherkennungs- und Sprachassistenz-Modells.",
    },
  ],
  euler: [
    {
      domain: "Signalverarbeitung",
      description:
        "Jedes DSP-Lehrbuch nutzt e^{iωt} als kanonische komplexe Sinuswelle; FFT, Z-Transformation und Filterentwurf leben auf Eulers Formel.",
    },
    {
      domain: "Quantenmechanik",
      description:
        "Wellenfunktionen sind komplexe Exponentialfunktionen; Phasenfaktoren e^{iθ} tragen die Interferenzmuster, die Quantenmechanik überhaupt quantenmechanisch machen.",
    },
    {
      domain: "Wechselstromanalyse",
      description:
        "Elektrotechniker:innen modellieren Wechselspannungen und -ströme als komplexe Exponentialfunktionen — Impedanzrechnung mit Zeigern ist direkte Anwendung von Eulers Formel.",
    },
    {
      domain: "Regelungstechnik",
      description:
        "Die Stabilität von Regelkreisen liest man an der Lage der Pole in der komplexen Ebene ab — Eulers Formel ist die Brücke zwischen Zeit- und Frequenzbereich.",
    },
  ],
  banach: [
    {
      domain: "Mengenlehre-Lehre",
      description:
        "Banach–Tarski ist das Lehrbuchbeispiel, warum das Auswahlaxiom umstritten ist — eingesetzt in jeder fortgeschrittenen Vorlesung über reelle Analysis.",
    },
    {
      domain: "Grundlagen der Mathematik",
      description:
        "Es motivierte im 20. Jahrhundert die Suche nach alternativen mengentheoretischen Fundamenten (Konstruktivismus, Intuitionismus) und beeinflusste computerverifizierte Beweise.",
    },
    {
      domain: "Philosophie der Mathematik",
      description:
        'Häufig zitiert in Diskussionen über mathematischen Realismus, die Bedeutung von „Unendlichkeit" und die Grenzen der Intuition.',
    },
  ],
  lsystem: [
    {
      domain: "Prozedurale Pflanzen in Spielen & Film",
      description:
        "Bäume, Farne und Gras in Titeln wie Der König der Löwen (1994), Avatar (2009) und zahllosen modernen Spielen werden per L-System mit SpeedTree und ähnlicher Middleware erzeugt.",
    },
    {
      domain: "Architektur & CAD",
      description:
        "Generative Architektur-Tools (Grasshopper für Rhino) nutzen L-Systeme, um verzweigte Strukturen, Fassaden und Straßennetze wachsen zu lassen.",
    },
    {
      domain: "Pflanzenbiologie-Forschung",
      description:
        "Pflanzenbiolog:innen passen L-Systeme an reale Arten an (z.B. Apfelbaum-Topologie), um Wachstumsdynamik, Lichtkonkurrenz und Ertragsoptimierung zu untersuchen.",
    },
    {
      domain: "Musikkomposition",
      description:
        "Komponist:innen bilden L-System-Strings auf MIDI-Events ab und lassen so Themen algorithmisch wachsen, die über die Zeit fraktale Selbstähnlichkeit entwickeln.",
    },
  ],
  wang: [
    {
      domain: "Echtzeit-Grafik",
      description:
        "Wang-Tilesets verpacken sich nicht wiederholende Texturen (Gras, Ziegel, Sand) in winzige Texturatlanten — wichtig auf speicherbeschränkten Geräten wie mobilen GPUs.",
    },
    {
      domain: "Prozedurales Leveldesign",
      description:
        "Game Engines (Houdini, eigenentwickelte Roguelike-Engines) setzen Wang-Kacheln ein, um große Dungeon- und Weltkarten aus kleinen modularen Bausteinen nahtlos zusammenzusetzen.",
    },
    {
      domain: "Materialien & Quasikristalle",
      description:
        "Die Theorie der Wang-Kacheln überschneidet sich teilweise mit der Quasikristall-Mathematik — beide erzeugen aperiodische unendliche Anordnungen.",
    },
  ],
  collatz: [
    {
      domain: "Offenes Problem der reinen Mathematik",
      description:
        "Gilt als eines der berühmtesten offenen Probleme der elementaren Zahlentheorie; per Computer bis 2,95×10²⁰ verifiziert (Stand 2024).",
    },
    {
      domain: "Verteiltes Rechnen",
      description:
        "Das Projekt BOINC / collatzconjecture.org crowdsourct die Suche nach einem Gegenbeispiel mithilfe freiwillig gespendeter GPU-Zeit.",
    },
    {
      domain: "Didaktik",
      description:
        "Eingesetzt in Schul-Demos zu Zahlentricks und in Bachelorarbeiten über ganzzahlige Folgen.",
    },
  ],
  doublependulum: [
    {
      domain: "Robotik",
      description:
        "Zweigliedrige Roboterarme sind mathematisch Doppelpendel; das Verständnis ihrer nichtlinearen Kopplung ist essenziell für die stabile Regelung industrieller Manipulatoren.",
    },
    {
      domain: "Biomechanik",
      description:
        "Menschliche Gliedmaßen werden beim Gehen, Werfen und in turnerischen Bewegungen als Mehrfachpendel-Systeme modelliert — wichtig für Rehabilitations- und Prothesenforschung.",
    },
    {
      domain: "Wissenschaftsmuseen",
      description:
        "Doppelpendel-Exponate in Museen (z.B. Exploratorium, Deutsches Museum) demonstrieren Besucher:innen den Schmetterlingseffekt anschaulich.",
    },
    {
      domain: "Akrobatik & Rigging",
      description:
        "Cirque du Soleil und Theater-Riggings müssen die Dynamik von Pendeln am Pendel verstehen, um Trapez- und Vertikaltuch-Choreografien sicher umzusetzen.",
    },
  ],
  bzr: [
    {
      domain: "Herzrhythmusstörungen",
      description:
        "Spiralwellenmuster, die BZR-Spiralen sehr ähnlich sind, treten auf der Herzoberfläche während Kammerflimmern auf — zentral für Defibrillator-Entwicklung und -Forschung.",
    },
    {
      domain: "Neurowissenschaft",
      description:
        "Die kortikale Streudepolarisation (eine mit Migräne verbundene Welle neuronaler Depolarisation) wird als BZR-artiges erregbares Medium modelliert.",
    },
    {
      domain: "Chemielehre",
      description:
        'BZR ist die eindrucksvollste „lebendige Chemie"-Demo, die Lehrer:innen im Schulunterricht zeigen können — sichtbare Oszillation im Kolben.',
    },
    {
      domain: "Nobelpreis-würdige Theorie",
      description:
        "Ilja Prigogine erhielt 1977 den Nobelpreis für die Theorie dissipativer Strukturen, die auf Systemen wie BZR fußt.",
    },
  ],
  turingpattern: [
    {
      domain: "Entwicklungsbiologie",
      description:
        "Streifen von Zebrafischen, der Abstand von Haarfollikeln bei Mäusen, die Bildung von Fingerabdrücken und das Fingermuster in Wirbeltier-Embryonen folgen messbar Turing-Dynamiken.",
    },
    {
      domain: "Pflanzliche Phyllotaxis",
      description:
        "Die spiraligen Anordnungen von Sonnenblumenkernen, Zapfenschuppen und Ananasschalen entstehen aus Reaktions-Diffusions-Dynamik plus Goldwinkel — Turing-Chemie auf wachsender Oberfläche.",
    },
    {
      domain: "Generative Kunst & Grafik",
      description:
        "Reaktions-Diffusions-Muster werden breit als prozedurales Texturrauschen (Haut, Rinde, Koralle) in 3D-Tools wie Substance Designer und Houdini genutzt.",
    },
    {
      domain: "Wirkstoff-Freisetzung & Materialien",
      description:
        "Selbstorganisierende Mikrostrukturen in Polymermembranen und Wirkstoff-Beschichtungen werden mit Instabilitäten vom Turing-Typ entworfen.",
    },
  ],
  sierpinski: [
    {
      domain: "Fraktale Antennen",
      description:
        "Sierpiński-Antennen sind kommerzielle Produkte — Mobiltelefone, WLAN-Router und GPS-Geräte nutzen Multiband-Fraktal-Patches, die auf engem Raum bei vielen Frequenzen resonieren.",
    },
    {
      domain: "Wärmetauscher",
      description:
        "Verzweigte Kanäle im Sierpiński-Stil finden sich in gedruckten Kühlplatten für Hochleistungs-LEDs und Chip-Kühlung — sie maximieren die Oberfläche.",
    },
    {
      domain: "Kompression & Grafik",
      description:
        "Iterierte Funktionensysteme (Sierpiński-artige IFS) bilden die Basis fraktaler Bildkompressionsalgorithmen — bis heute in Nischen-Encodern für Luftbildaufnahmen.",
    },
    {
      domain: "Netzwerke",
      description:
        "Hierarchisches IP-Routing und Baum-Topologien erben Sierpiński-artige fraktale Skalierungseigenschaften für die Lastverteilung.",
    },
  ],
  chaosgame: [
    {
      domain: "Bioinformatik",
      description:
        "Chaos Game Representation (CGR) ist ein Standardverfahren zur Visualisierung von DNA-Sequenzen — jedes Nukleotid lenkt einen Punkt zu einer von vier Ecken eines Quadrats; Arten bilden charakteristische fraktale Signaturen.",
    },
    {
      domain: "Fraktale Kompression",
      description:
        "Barnsleys fraktale Bildkompression kodiert Bilder als kleinen Satz kontrahierender Abbildungen, der über das Chaos-Spiel rekonstruiert wird.",
    },
    {
      domain: "Prozedurale Texturen",
      description:
        "Ausgaben des Chaos-Spiels (Varianten des Barnsley-Farns) werden breit für prozedurale Vegetation und stilisierte Pinselstriche genutzt.",
    },
  ],
  penrose: [
    {
      domain: "Quasikristalle",
      description:
        "Dan Shechtmans Entdeckung metallischer Quasikristalle 1982 (Nobelpreis 2011) wurde über Penrose-Parkettierungen verstanden — beide werden von derselben fünfzähligen Mathematik regiert.",
    },
    {
      domain: "Architektur",
      description:
        "Die Fassade der Storey Hall in Melbourne und mehrere islamisch-mathematische Muster im Topkapı-Palast nutzen Penrose-artige aperiodische Geometrie.",
    },
    {
      domain: "Materialwissenschaft",
      description:
        "Quasikristalline Beschichtungen (z.B. auf Sjöbo-Antihaftpfannen) sind heute kommerziell erhältlich und nutzen Atomanordnungen im Stil der Penrose-Parkettierungen.",
    },
    {
      domain: "Kryptografie",
      description:
        "Kürzlich vorgeschlagene Pseudozufallsgeneratoren nutzen aperiodische Parkettierungs-Sequenzen für Sampling niedriger Diskrepanz.",
    },
  ],
  apollonian: [
    {
      domain: "Granulare Packung",
      description:
        "Wie Sand, Kies und pharmazeutische Pulver Behälter füllen, wird mit apollonischen Kugelpackungen modelliert — wichtig für Beton, Tabletten und Pulvermetallurgie.",
    },
    {
      domain: "Zahlentheorie",
      description:
        "Ganzzahlige apollonische Packungen werden von analytischen Zahlentheoretiker:innen untersucht — Arbeiten von Sarnak, Bourgain und Kontorovich lieferten neue Resultate zu Primzahl-Krümmungen.",
    },
    {
      domain: "Schaum- & Emulsionsphysik",
      description:
        "Schaumstrukturen (Bierschaum, Lebensmittel-Emulsionen, Lungenalveolen) erben bei ihrer Entstehung apollonische Packungs-Randbedingungen.",
    },
    {
      domain: "Grafikdesign",
      description:
        "Logo-, Poster- und Tattoo-Design nutzen apollonische Dichtungen für markante radiale Geometrie.",
    },
  ],
  phi: [
    {
      domain: "Pflanzliche Phyllotaxis",
      description:
        "Sonnenblumen-Samenspiralen, Zapfenschuppen und Blattstellungen der meisten Pflanzen konvergieren zum Goldenen Winkel — bei tausenden Arten verifiziert.",
    },
    {
      domain: "Kettenbrüche",
      description:
        'φ hat die einfachste Kettenbruchentwicklung [1;1,1,…] und ist damit die „irrationalste" Zahl — ein Schlüsselkonzept der KAM-Theorie in der klassischen Mechanik.',
    },
    {
      domain: "Quasikristalle & Penrose",
      description:
        "Die Seitenverhältnisse in Penrose-Parkettierungen (und der Inflationsfaktor) sind exakt φ; dasselbe Verhältnis tritt in echten Quasikristallen auf, die 2009 in der Natur entdeckt wurden.",
    },
    {
      domain: "Zahlentheorie",
      description:
        "Fibonacci-Zahlen liegen dem Zeckendorf-Satz und effizienten Ganzzahl-Darstellungen zugrunde, die in einigen Kompressions- und Datenstruktur-Algorithmen genutzt werden.",
    },
    {
      domain: "Ehrliche Skepsis",
      description:
        "Behauptungen, φ trete im Parthenon, der Mona Lisa, der Nautilusmuschel oder in menschlichen Körperproportionen auf, sind weitgehend Mythen — entkräftet u.a. von George Markowsky (1992).",
    },
  ],
  buffon: [
    {
      domain: "Monte-Carlo-Integration",
      description:
        "Buffons Nadel ist die historische Keimzelle der Monte-Carlo-Methoden — heute überall im Einsatz, von Finanzbewertung (Black–Scholes) über Teilchenphysik-Simulation (Geant4) bis zum Rendering (Path Tracing).",
    },
    {
      domain: "Physiksimulation",
      description:
        "Stichprobenartiges Auswerten hochdimensionaler Integrale in der Gitter-QCD, Kerntechnik und Reaktorauslegung erweitert Buffons Logik auf Millionen Dimensionen.",
    },
    {
      domain: "Computergrafik",
      description:
        "Geschichtetes Sampling von Lichtstrahlen in modernen Path Tracern (Pixar, Cycles, Unreal Lumen) stammt in direkter Linie von Buffons Nadel ab.",
    },
    {
      domain: "Statistik-Lehre",
      description:
        "Standard-Demo der einführenden Wahrscheinlichkeitsrechnung; wird bis heute in Statistik-Praktika weltweit durchgeführt.",
    },
  ],
  hilberthotel: [
    {
      domain: "Mengenlehre & Lehre",
      description:
        "Die kanonische Analogie, um Kardinalzahlen-Arithmetik und den Unterschied zwischen abzählbar und überabzählbar unendlich zu verstehen.",
    },
    {
      domain: "Programmieren mit unendlichen Strukturen",
      description:
        "Lazy Infinite Lists in Haskell, Generatoren in Python und Streams in Scala spiegeln Umordnungen im Hilbert-Hotel-Stil der abzählbaren Unendlichkeit wider.",
    },
    {
      domain: "Wissenschaftskommunikation",
      description:
        "TED-Ed-Video, Vsauce, PBS Infinite Series — die am weitesten verbreitete moderne Erklärung der Unendlichkeit.",
    },
  ],
  gabrielshorn: [
    {
      domain: "Analysis-Lehre",
      description:
        "Das Standardbeispiel der frühen Analysis für ein kontraintuitives uneigentliches Integral, in jedem Analysis-II-Lehrbuch zu finden.",
    },
    {
      domain: "Philosophie der Mathematik",
      description:
        "Zitiert in Debatten über geometrische Paradoxien und die Grenzen physikalischer Intuition — ein grundlegendes Gedankenexperiment.",
    },
    {
      domain: "Mikrofluidik",
      description:
        "Reale Analoga mit kapillargetriebener Strömung in immer enger werdende Kanäle (mikrofluidische Geräte) stoßen genau auf jene Grenzfälle, die Gabriels Horn formalisiert.",
    },
  ],
  cantor: [
    {
      domain: "Berechenbarkeitstheorie",
      description:
        "Cantors Diagonalargument liefert direkt Turings Halteproblem-Beweis und Gödels Unvollständigkeitssätze — die Eckpfeiler der theoretischen Informatik.",
    },
    {
      domain: "Programmiersprachen-Theorie",
      description:
        'Wird genutzt, um zu zeigen, dass es kein „universelles" Typsystem gibt, das Typprüfung für alle Programme entscheidet (Satz von Rice).',
    },
    {
      domain: "Kryptografie & Komplexität",
      description:
        "Diagonalisierungs-Argumente liegen modernen Resultaten der Komplexitätstheorie zugrunde — Trennungen zwischen P, NP, EXP.",
    },
    {
      domain: "Philosophie der Mathematik",
      description:
        "Cantors Argument hat aristotelische und kantianische Auffassungen von Unendlichkeit umgestoßen und die Logik und analytische Philosophie des 20. Jahrhunderts geprägt.",
    },
  ],
  boids: [
    {
      domain: "Visuelle Effekte im Film",
      description:
        "Batmans Rückkehr (Fledermausschwarm 1992), Der König der Löwen (Gnu-Stampede 1994) und unzählige moderne Filme nutzen Boids — meist über Massive oder Houdini.",
    },
    {
      domain: "Drohnenschwärme",
      description:
        "Intels rekordverdächtige Drohnen-Lightshows (Olympia Pyeongchang 2018, Olympia Paris 2024) nutzen Boids-abgeleitete Regeln in riesigem Maßstab.",
    },
    {
      domain: "Crowd-Simulation",
      description:
        "Architekturbüros simulieren Stadionräumungen und Einkaufszentrum-Ströme mit Boids-artigen Agenten — seit den 2000er Jahren in der Stadionplanung im Einsatz.",
    },
    {
      domain: "Roboterschwärme",
      description:
        "Forschungslabore nutzen Boids-artige Regeln für autonome Roboterschwärme bei Such- und Rettungseinsätzen sowie in der landwirtschaftlichen Überwachung.",
    },
    {
      domain: "Echte Natur",
      description:
        "Empirische Studien an Starenschwärmen (Cavagna et al., 2010), Fischschwärmen und Herdentieren bestätigen Regeln, die den ursprünglichen Boids sehr nahekommen.",
    },
  ],
  aizawa: [
    {
      domain: "Forschung zu dynamischen Systemen",
      description:
        "Aizawa gehört zu einer Familie dreidimensionaler seltsamer Attraktoren, die zum Testen numerischer Integratoren, Visualisierungsalgorithmen und Chaos-Detektionsmethoden dienen.",
    },
    {
      domain: "Mathematische Kunst",
      description:
        "Generative Künstler:innen rendern Aizawa-, Thomas- und Halvorsen-Attraktoren als Plots, Drucke und Animationen — verkauft auf Etsy und Kunstmessen.",
    },
    {
      domain: "Lehre",
      description:
        "Wird zunehmend neben Lorenz in Master-Vorlesungen über dynamische Systeme gezeigt, um die Vielfalt chaotischer Formen zu illustrieren.",
    },
  ],
  dla: [
    {
      domain: "Elektrochemie",
      description:
        "In Elektrolysezellen abgeschiedene Metalle wie Zink und Kupfer bilden DLA-artige Dendriten — direkt relevant für Galvanik, Batteriedesign (Lithium-Dendriten) und Korrosion.",
    },
    {
      domain: "Kristallwachstum",
      description:
        "Schneeflocken-Bildung, Frost an Fensterscheiben, mineralische Dendriten in Gestein — sie alle gehorchen DLA-Skalengesetzen.",
    },
    {
      domain: "Biologie",
      description:
        "Bakterienkolonie-Fronten auf Agarplatten, neuronale Wachstumskegel und die Grenze mancher Tumore folgen DLA-artigen Regeln.",
    },
    {
      domain: "Blitzphysik",
      description:
        "Die Verzweigung von Blitzen und Mustern dielektrischer Durchschläge wird gut durch DLA beschrieben.",
    },
  ],
  langton: [
    {
      domain: "Künstliches Leben",
      description:
        "Langtons Ameise ist ein Grundbeispiel des Felds Artificial Life, das er am Santa Fe Institute mitbegründete.",
    },
    {
      domain: "Theoretische Informatik",
      description:
        "Dient als minimales Beispiel universeller Berechnung in 2D-Turing-Maschinen; bis heute in Grundlagenarbeiten zur Komplexität zitiert.",
    },
    {
      domain: "Lehre",
      description:
        'Ein Lieblingsbeispiel in Vorlesungen zu zellulären Automaten — die „Autobahn"-Phase ist eines der zugänglichsten emergenten Phänomene der Informatik.',
    },
  ],
  pascalmod: [
    {
      domain: "Zahlentheorie",
      description:
        "Der Satz von Lucas (1878) treibt effiziente Algorithmen für Binomialkoeffizienten modulo Primzahl an — eingesetzt in Kryptografie, Wortkombinatorik und im Wettbewerbsprogrammieren.",
    },
    {
      domain: "Kodierungstheorie",
      description:
        "Reed–Muller- und BCH-Fehlerkorrekturcodes beruhen auf Binomialkoeffizienten-mod-p-Mechanik — sie stecken in QR-Codes, Tiefraumsonden (Mariner 9, Voyager) und im DVB-T-Digitalfernsehen.",
    },
    {
      domain: "Bildende Kunst",
      description:
        "Pascal mod 2 ist der algebraische Ursprung des Sierpiński-Dreiecks — als Poster verkauft, in Teppiche gewoben, als Galerie-Installation gezeigt.",
    },
  ],
  sternbrocot: [
    {
      domain: "Computermusik & Stimmung",
      description:
        "Mikrotonale Komponist:innen nutzen Stern–Brocot, um gleichstufige Näherungen reiner Intervalle zu finden — zentral für xenharmonische Musik.",
    },
    {
      domain: "Robotik & Getriebedesign",
      description:
        "Die Suche nach besten rationalen Näherungen für Übersetzungsverhältnisse durchläuft den Stern–Brocot-Baum, um effiziente mechanische Übersetzungen zu finden.",
    },
    {
      domain: "Kalendersysteme",
      description:
        "Schaltjahr-Regeln auf Kettenbruchbasis (persischer Kalender, vorgeschlagene gregorianische Korrekturen) leiten sich aus Stern–Brocot-Medianten ab.",
    },
    {
      domain: "Bilddarstellung",
      description:
        "Subpixel-Sampling und moderne Schriften-Rasterisierung nutzen Stern–Brocot-artige Medianten, um Pixel-Abdeckungsverhältnisse zu wählen.",
    },
  ],
  ulam: [
    {
      domain: "Reine Zahlentheorie",
      description:
        "Die Visualisierung von Primzahlen über Ulam-Spiralen inspiriert bis heute neue Vermutungen zu polynomialen Primzahldichten (Hardy–Littlewood, Sato–Tate).",
    },
    {
      domain: "Lehre",
      description:
        "Standardexponat in Mathematikmuseen und eine einführende Erkundung in Zahlentheorie-Kursen.",
    },
    {
      domain: "Generative Kunst",
      description:
        "Von Ulam-Spiralen abgeleitete Werke erscheinen in Ausstellungen (Roman Verostko, Tristan Perich).",
    },
  ],
  cardioid: [
    {
      domain: "Tontechnik",
      description:
        "Niermikrofone (die jede:r Podcaster:in und Rundfunktechniker:in nutzt) verdanken ihren Namen der kardioidischen Aufnahmecharakteristik — sie nehmen vorne empfindlich auf und hinten gar nicht.",
    },
    {
      domain: "Antennenentwurf",
      description:
        "Einige Antennenrichtcharakteristiken sind kardioidisch; verbreitet bei Marine-VHF und Peilanlagen.",
    },
    {
      domain: "Architektur & Beleuchtung",
      description:
        "Kardioidische Reflektoren werden in klassischer Bühnenbeleuchtung (PAR-Scheinwerfer) verwendet, um asymmetrische Lichtkegel zu erzeugen.",
    },
    {
      domain: "Mandelbrot-Verbindung",
      description:
        "Der Hauptkörper der Mandelbrot-Menge ist exakt eine Kardioide; die Form zu verstehen, beleuchtet das Bifurkationsdiagramm der Mandelbrot-Menge.",
    },
  ],
  galton: [
    {
      domain: "Statistik-Lehre",
      description:
        "Das Galton-Brett ist die kanonische Demonstration des zentralen Grenzwertsatzes — in fast jedem Wissenschaftsmuseum vorhanden (Deutsches Museum, Boston Museum of Science, MOSS Toronto).",
    },
    {
      domain: "Quincunx in der Genetik",
      description:
        "Galton baute das ursprüngliche Brett, um Vererbungsstatistik für viktorianisches Publikum sichtbar zu machen; es legte das Fundament für Biometrie und statistische Genetik.",
    },
    {
      domain: "Plinko / Spieldesign",
      description:
        "Galton-Bretter inspirierten das Plinko-TV-Spiel und moderne mobile Pachinko-/Slot-Spiele — physisch wie digital.",
    },
    {
      domain: "Toleranzanalyse in der Fertigung",
      description:
        "Statistische Toleranzkettenrechnungen im Maschinenbau berufen sich direkt auf die Logik des zentralen Grenzwertsatzes, die Galtons Brett visualisiert.",
    },
  ],
  magpendulum: [
    {
      domain: "Chaos-Demonstrationen",
      description:
        'Das Schreibtisch-Spielzeug „Drei-Magnet-Pendel" ist die populärste physische Demonstration fraktaler Einzugsgebiete — verkauft u.a. von ThinkGeek, Nikola Labs und vielen Science-Geschenkläden.',
    },
    {
      domain: "Forschung zur Magnetschwebetechnik",
      description:
        "Die Dynamik von Permanentmagnet-Pendeln liegt Maglev-Zügen, Magnetlagern und magnetorheologischen Dämpfern zugrunde.",
    },
    {
      domain: "Lehre",
      description:
        "Standard-Demo der nichtlinearen Dynamik in der Physik-Bachelorvorlesung; vermittelt Phasenraum, Dissipation und Empfindlichkeit gegenüber Endzuständen.",
    },
  ],
  godel: [
    {
      domain: "Grundlagen der Mathematik",
      description:
        "Gödel beendete Hilberts Programm der Mechanisierung der Mathematik und veränderte, was Mathematiker:innen prinzipiell für beweisbar halten.",
    },
    {
      domain: "Informatik",
      description:
        "Tarskis Undefinierbarkeit der Wahrheit, Turings Halteproblem und der Satz von Rice sind direkte Nachfahren — in jeder Bachelor-Vorlesung zu Logik und Berechenbarkeit präsent.",
    },
    {
      domain: "Philosophie des Geistes",
      description:
        "Penroses Argument, menschliches Denken sei nicht rein algorithmisch (Computerdenken, 1989), stützt sich stark auf Gödel — umstritten, aber einflussreich.",
    },
    {
      domain: "Verifizierte Software",
      description:
        "Moderne Beweisassistenten (Coq, Lean, Isabelle) stoßen täglich an Gödels Grenzen; ihr ganzer Nutzen liegt darin, das innerhalb eines expliziten Systems Beweisbare zu formalisieren.",
    },
  ],
  halting: [
    {
      domain: "Compiler & statische Analyse",
      description:
        "Moderne statische Analysewerkzeuge (Coverity, Infer, Rusts Borrow Checker) müssen auf perfekte Präzision verzichten, weil nichttriviale Programmeigenschaften unentscheidbar sind — direkte Folge des Halteproblems (Satz von Rice).",
    },
    {
      domain: "Antivirensoftware",
      description:
        "Warum kein Virenscanner jede Schadsoftware erkennt: feindliche Programme perfekt zu erkennen, würde eine Variante des Halteproblems lösen.",
    },
    {
      domain: "Compute-Clouds",
      description:
        'Cloud-Autoscaler können nie garantieren, „dieser Nutzerjob hält an" — sie erzwingen Timeouts, weil das Entscheiden des Haltens unmöglich ist.',
    },
    {
      domain: "Lehre",
      description:
        "Die kanonische Einführung zur Unentscheidbarkeit in jeder Vorlesung über Berechenbarkeitstheorie auf diesem Planeten.",
    },
  ],
  pvsnp: [
    {
      domain: "Kryptografie",
      description:
        "Wäre P = NP, wären RSA, AES, jeder Blockchain- und TLS-geschützte Verkehr über Nacht gebrochen — jedes moderne digitale Geheimnis hängt daran, dass P ≠ NP effektiv gilt.",
    },
    {
      domain: "Optimierung",
      description:
        "Logistik (UPS-Routenplanung), Chipdesign (Place-and-Route) und Hyperparameter-Suche im maschinellen Lernen greifen NP-schwere Probleme heuristisch an, weil exakte Lösungen unerschwinglich sind.",
    },
    {
      domain: "KI / SAT-Solver",
      description:
        "Moderne SAT/SMT-Solver (Z3, MiniSat) lösen routinemäßig NP-schwere Instanzen mit Millionen Variablen dank cleverer Heuristiken — auch wenn die Worst-Case-Komplexität exponentiell ist.",
    },
    {
      domain: "Bioinformatik",
      description:
        "Proteinfaltung, Genom-Assemblierung und Rekonstruktion phylogenetischer Bäume sind NP-schwer — das treibt das Feld zu Näherungsalgorithmen und KI-Methoden (AlphaFold).",
    },
    {
      domain: "Offenes Preisgeld",
      description:
        "Eines von sieben Clay-Millennium-Problemen mit einem Preisgeld von 1.000.000 US-Dollar für Beweis oder Widerlegung.",
    },
  ],
  rsa: [
    {
      domain: "TLS / HTTPS",
      description:
        "Jedes Schloss-Symbol im Browser nutzt für den initialen Handshake entweder RSA oder seinen Verwandten auf elliptischen Kurven (ECDSA) — milliardenfach pro Sekunde.",
    },
    {
      domain: "Digitale Signaturen",
      description:
        "Apples App Store, Google Play und Microsoft Update signieren jedes Release mit Public-Key-Kryptografie im RSA-Stil; ließe sich das fälschen, würde sich Schadsoftware ungehindert verbreiten.",
    },
    {
      domain: "Bankwesen & Blockchain",
      description:
        "SWIFT-Nachrichten, Chip-Karten-Transaktionen und die meisten Blockchain-Wallets beruhen auf Annahmen zur Faktorisierungs- bzw. Diskreten-Logarithmus-Härte, die zu RSA äquivalent sind.",
    },
    {
      domain: "Ausweisdokumente",
      description:
        "Moderne Reisepässe (ICAO 9303) enthalten RSA-signierte biometrische Daten; die Grenzkontrolle verifiziert die Signatur gegen nationale CAs.",
    },
    {
      domain: "Post-Quantum-Panik",
      description:
        "Shors Algorithmus bricht RSA auf einem hinreichend großen Quantencomputer; NIST standardisiert gerade Post-Quantum-Nachfolger (Kyber, Dilithium).",
    },
  ],
  mobius: [
    {
      domain: "Industrielle Förderbänder",
      description:
        'Antriebsbänder als Möbiusband nutzen sich auf beiden „Seiten" (es gibt nur eine!) gleichmäßig ab — eingesetzt in alten Druckpressen, modernen Tonbändern und einigen VHS-Bandsystemen.',
    },
    {
      domain: "Maschinenbau",
      description:
        "Möbius-Zahnräder und Möbius-förmige Widerstände wurden patentiert, um Verschleiß bzw. Induktivität zu halbieren.",
    },
    {
      domain: "Topologieforschung",
      description:
        "Das Möbiusband ist die einfachste nicht orientierbare Fläche — Einstiegspunkt in ein weites Feld, das alle Flächen klassifiziert und in Kosmologie und Stringtheorie genutzt wird.",
    },
    {
      domain: "Kunst & Architektur",
      description:
        "Max Bills Endlose Schleife, das Recycling-Symbol-Dreieck und Architekt:innen von Mexiko bis Astana nutzen Möbius-Topologie für markante Installationen.",
    },
    {
      domain: "Chemie",
      description:
        "Möbius-aromatische Moleküle (Heilbronner 1964; erstmals 2003 synthetisiert) tragen eine π-Elektronen-Halbverdrehung und zeigen elektronische Eigenschaften, die kein flacher Ring besitzt.",
    },
  ],
  eulerchar: [
    {
      domain: "Computergrafik",
      description:
        "Mesh-Validierung (Blender, Maya) prüft V−E+F gegen das erwartete χ, um Löcher oder doppelte Geometrie vor dem 3D-Druck aufzuspüren.",
    },
    {
      domain: "Topologie von Daten",
      description:
        "Pipelines der persistenten Homologie fassen die Form hochdimensionaler Punktwolken mit Euler-Charakteristiken zusammen — angewendet in Genomik, Sensornetzen und Kosmologie.",
    },
    {
      domain: "Architektur",
      description:
        "Buckminster Fullers geodätische Kuppeln (Epcots Spaceship Earth, Biosphère Montreal) sind so konstruiert, dass V−E+F=2 unter den Sechsecken genau 12 Fünfecke erzwingt.",
    },
    {
      domain: "Fußball-Design",
      description:
        "Der klassische Fußball als abgestumpftes Ikosaeder hat 12 Fünfecke und 20 Sechsecke; Eulers Formel erklärt, warum es exakt 12 sind und nicht weniger.",
    },
    {
      domain: "Teilchenphysik",
      description:
        "Der Atiyah-Singer-Indexsatz, fundamental für die moderne Eichtheorie, verallgemeinert Eulers Formel und verknüpft Topologie mit Differentialgleichungen.",
    },
  ],
  konigsberg: [
    {
      domain: "Geburt der Graphentheorie",
      description:
        "Königsberg begründete das ganze Feld — die Graphentheorie liegt heute Googles PageRank, Analysen sozialer Netze, Chip-Layout und Routenplanung zugrunde.",
    },
    {
      domain: "DNA-Sequenzierung",
      description:
        "Von Königsberg inspirierte Eulerweg-Algorithmen sind das Arbeitstier moderner Genom-Assemblierung (Pevzner & Tang, 2001; eingesetzt in SPAdes, Velvet, megahit).",
    },
    {
      domain: "Routenoptimierung",
      description:
        "Postzusteller:innen, Müllabfuhren und Schneepflüge lösen das Briefträgerproblem — ein direkter Nachkomme der Königsberger Brücken.",
    },
    {
      domain: "Tourismus",
      description:
        "Kaliningrad (das moderne Königsberg) vermarktet die Brücken; Tourist:innen versuchen den Spaziergang, obwohl nur fünf der ursprünglichen sieben den Zweiten Weltkrieg überdauert haben.",
    },
  ],
  fourcolor: [
    {
      domain: "Kartografie",
      description:
        "Kartograf:innen und GIS-Fachleute setzen Vierfärbungs-Algorithmen tatsächlich für politische Karten, Länderatlanten und Wetterdarstellungen ein.",
    },
    {
      domain: "Mobilfunknetze",
      description:
        "Frequenzzuteilung zwischen Mobilfunkmasten lässt sich als Graphenfärbung formulieren — der Vierfarbensatz markiert die Grenze für manche planaren Layouts.",
    },
    {
      domain: "Stundenplanung",
      description:
        "Universitäts-Klausurpläne, Konferenzraum-Belegung und Spielpläne im Sport sind allesamt Graphenfärbungsprobleme; planare Varianten erben die Vier-Farben-Schranke.",
    },
    {
      domain: "Computerverifizierte Mathematik",
      description:
        "Zusammen mit der Kepler-Vermutung war der Vierfarbensatz ein Meilenstein computergestützten Beweisens — die Kultur der Beweisassistenten (Coq, Lean) führt ihre Legitimität darauf zurück.",
    },
  ],
  smallworld: [
    {
      domain: "Soziale Netzwerke",
      description:
        'LinkedIns „2.-Grad"-Verbindungen, Twitters Retweet-Kaskaden und Facebooks „Personen, die du kennen könntest" nutzen Small-World-Struktur, um Relevanz zu erzeugen.',
    },
    {
      domain: "Epidemie-Modelle",
      description:
        "Modellierung der COVID-19-Ausbreitung, Kontaktnachverfolgungs-Apps und Impfstrategien arbeiten mit Small-World-Netzwerkmodellen, um Ausbruchsdynamiken vorherzusagen.",
    },
    {
      domain: "Hirnforschung",
      description:
        "fMRT-Studien zeigen, dass das menschliche Konnektom ein Small-World-Netzwerk ist — der Small-World-Koeffizient ist heute ein etablierter Biomarker in der Alzheimer- und Schizophrenie-Forschung.",
    },
    {
      domain: "Internet-Routing",
      description:
        "Der Graph der autonomen Systeme im Internet weist Small-World-Eigenschaften auf; BGP und moderne CDNs (Cloudflare, Fastly) nutzen die kurzen Hop-Distanzen.",
    },
    {
      domain: "Six Degrees of Kevin Bacon",
      description:
        "Das Filmspiel von 1994 und die Bacon-Number-Website sind popkulturelle Artefakte der Small-World-Theorie; Mathematiker:innen wetteifern um niedrige Erdős-Zahlen.",
    },
  ],
  diffusion: [
    {
      domain: "Bildgenerierung",
      description:
        "Stable Diffusion, Midjourney, DALL·E 3 und Imagen sind allesamt Latent-Diffusionsmodelle. Gib einen Prompt ein, und das Modell läuft Gauß-Rauschen zurück in ein zum Text passendes Bild.",
    },
    {
      domain: "Videogenerierung",
      description:
        "Sora, Veo und Runway erweitern dieselbe Diffusionsmathematik auf drei Dimensionen (Höhe × Breite × Zeit), sodass der Entrauscher räumlich-zeitliche Kohärenz neben dem Aussehen lernt.",
    },
    {
      domain: "Wirkstoff- & Proteindesign",
      description:
        "RFdiffusion (Baker-Labor) und Chroma erzeugen neue Protein-Backbones, indem sie 3D-Koordinaten statt Pixel entrauschen — veröffentlichte Kandidaten wurden synthetisiert und falten sich korrekt.",
    },
    {
      domain: "Audio & Sprache",
      description:
        "AudioLDM, Riffusion und die Sprachsynthese-Linie ElevenLabs/Vall-E nutzen 1D-Diffusion über Wellenformen oder Spektrogramme, um Musik und natürlich klingende Stimmen aus Text zu erzeugen.",
    },
    {
      domain: "Physik & Thermodynamik",
      description:
        "Der Vorwärtsprozess ist buchstäblich Langevin-Dynamik — der Rauschplan spiegelt ein System wider, das ins thermische Gleichgewicht relaxiert. Sohl-Dicksteins Originalarbeit von 2015 war als Nichtgleichgewichts-Thermodynamik formuliert.",
    },
  ],
  quine: [
    {
      domain: "Programmiersprachen-Theorie",
      description:
        "Quines sind der Standard-Sanity-Check, ob eine Sprache ausdrucksstark genug für Selbstreferenz ist; Vorlesungen zur Berechenbarkeitstheorie nutzen sie, um Kleenes Rekursionssatz greifbar zu machen.",
    },
    {
      domain: "Computerviren & Selbstreplikatoren",
      description:
        "Jeder klassische Virus, Wurm und jede metamorphe Engine ist eine Quine-Variante: Code, der sich zuerst kopiert, bevor er irgendetwas anderes tut. Moderne sich selbst replizierende Malware wird als angewandte Quine-Technik untersucht.",
    },
    {
      domain: "Genetik & Molekularbiologie",
      description:
        "Die DNA-Replikation ist die Quine der Biologie: eine Sequenz, deren einzige Aufgabe darin besteht, sich selbst samt ihrer Kopiermaschinerie zu kopieren. Hofstadter zieht die Analogie in Gödel, Escher, Bach ausdrücklich.",
    },
    {
      domain: "Compiler-Bootstrapping",
      description:
        "Trusting Trust (Ken Thompson, 1984) zeigte, dass der Compiler eines Compilers eine Quine sein kann, die bei jedem Build eine Hintertür einfügt — das Fundament der Lieferkettensicherheit und der Forschung zu reproduzierbaren Builds.",
    },
    {
      domain: "Demoszene & Code-Kunst",
      description:
        "Polyglotte Quines — Programme, die sich selbst drucken und in mehreren Sprachen gleichzeitig gültig sind — sind ein geliebtes Code-Art-Genre; der IOCCC hat eine eigene Quine-Kategorie.",
    },
  ],
  riemann: [
    {
      domain: "Primzahlsatz",
      description:
        "Der Fehlerterm in der Anzahl der Primzahlen unter N wird von den Nullstellen von ζ kontrolliert; die Riemann-Hypothese ist äquivalent zur schärfstmöglichen Schranke dafür, wie unregelmäßig die Primzahlen verteilt sind.",
    },
    {
      domain: "Kryptographie",
      description:
        "RSA, elliptische-Kurven-Kryptographie und die Härte der Faktorisierung beruhen auf Annahmen über die Primzahlverteilung; RH-äquivalente Aussagen liefern die besten bekannten Schranken für die kryptographische Sicherheit.",
    },
    {
      domain: "Quantenchaos",
      description:
        "Die Statistik der Abstände zwischen Zeta-Nullstellen stimmt mit den Eigenwertstatistiken zufälliger hermitescher Matrizen überein — derselben, die schwere Atomkern-Energieniveaus modellieren. Die Montgomery-Dyson-Vermutung (1972) ist eine der überraschendsten Brücken der Mathematik.",
    },
    {
      domain: "Computerverifizierte Numerik",
      description:
        "Die ersten 10^13 nichttrivialen Nullstellen wurden auf die kritische Linie gerechnet (Xavier Gourdon, 2004 und später). Keine Verifikationskampagne hat je ein Gegenbeispiel zu RH gefunden.",
    },
    {
      domain: "Popkultur & Prestige offener Probleme",
      description:
        "Riemann ist außerhalb von Fermat das berühmteste ungelöste Problem — ein Clay Millennium Prize (1 Mio. $), wiederkehrende Auftritte in Fiktion (A Beautiful Mind, The Music of the Primes) und ein steter Strom von «Beweisen», die das Peer-Review nicht überleben.",
    },
  ],
  backprop: [
    {
      domain: "Deep Learning",
      description:
        "Jedes moderne neuronale Netz — Bildklassifikator, Sprachmodell, Empfehler — wird durch Backpropagation trainiert. PyTorch und JAX implementieren sie als ihren Differentiationskern (Autograd).",
    },
    {
      domain: "Computer Vision",
      description:
        "Faltungsnetze für medizinische Bildgebung, autonomes Fahren und biometrische Identifikation lernen ihre Filterkerne direkt aus gelabelten Daten via Backprop; Gradienten fließen rückwärts durch Faltungs- und Pooling-Schichten.",
    },
    {
      domain: "Sprachmodelle",
      description:
        "GPT, Claude, Llama und jeder Transformer werden trainiert, indem Cross-Entropy-Verluste durch Billionen Parameter zurückpropagiert werden. Der eine Algorithmus, der von einem Neuron bis zu einer Billion skaliert.",
    },
    {
      domain: "Robotik & Regelung",
      description:
        "Policy-Gradient-Methoden im Reinforcement Learning nutzen Backprop, um neuronale Regler aus Belohnungssignalen zu lernen; moderne zweibeinige Lauf- und Geschicklichkeits-Manipulationsroboter setzen alle darauf.",
    },
    {
      domain: "Inverse Probleme in der Wissenschaft",
      description:
        "Physiker:innen invertieren Experimente, indem sie das Vorwärtsmodell in PyTorch/JAX aufbauen und durch es hindurch zurückpropagieren — eingesetzt im Protein-Design (AlphaFold), in differenzierbarem Rendering und im gradientbasierten Experimententwurf.",
    },
  ],
};

export const TOPIC_APPLICATIONS: Record<Locale, Partial<Record<TopicId, Application[]>>> = {
  en,
  de,
  es: {
    eml: [
      {
        domain: "Regresión simbólica",
        description:
          "Los sistemas de álgebra computacional que intentan redescubrir leyes físicas a partir de datos emplean a veces alfabetos compactos de operadores como EML para restringir el espacio de búsqueda.",
      },
      {
        domain: "Informática teórica",
        description:
          "EML es prima de conjuntos universales como NAND en lógica e Iota en combinadores: interesante por lo que dice sobre cuán pequeño puede ser un primitivo.",
      },
    ],
    mandelbrot: [
      {
        domain: "Arte generativo y motion graphics",
        description:
          "Cineastas y artistas digitales hacen zoom dentro del conjunto de Mandelbrot para crear fondos de todo tipo, desde videoclips hasta secuencias de apertura de las keynotes de Apple.",
      },
      {
        domain: "Antenas fractales",
        description:
          "Bordes de tipo Mandelbrot/Julia se usan en algunas antenas multibanda compactas (por ejemplo en los primeros módulos Bluetooth) porque la forma autosemejante resuena en muchas frecuencias.",
      },
      {
        domain: "Educación",
        description:
          "Ejemplo universitario clásico de dinámica compleja, caos determinista y la frontera entre orden y caos.",
      },
      {
        domain: "Analogías naturales",
        description:
          "Costas, crestas montañosas, hojas de helecho y floretes de brócoli muestran la misma estructura de frontera autosemejante: ese era precisamente el mensaje de Mandelbrot sobre la geometría fractal.",
      },
    ],
    life: [
      {
        domain: "Docencia en informática",
        description:
          "Todo plan de estudios, desde el MIT 6.001 hasta los clubes de instituto, usa el Life de Conway para enseñar emergencia, autómatas celulares y completitud de Turing en una sola tarde.",
      },
      {
        domain: "Arte generativo",
        description:
          "Las personas que diseñan visuales usan Life y sus variantes (HighLife, Day & Night…) para generar imágenes en constante cambio en videoclips, instalaciones y salvapantallas.",
      },
      {
        domain: "Modelado de biología discreta",
        description:
          "Demografía, dinámica depredador-presa y propagación de epidemias se prototipan a veces sobre rejillas tipo Life antes de pasar a modelos más ricos basados en agentes.",
      },
      {
        domain: "Cacharreo electrónico",
        description:
          "Proyectos con FPGA y microcontroladores renderizan Life sobre matrices LED como «hola mundo» del hardware celular paralelo.",
      },
    ],
    nand: [
      {
        domain: "Dentro de cada chip",
        description:
          "Desde el silicio de la serie M de Apple hasta los microcontroladores industriales, cada minuto se graban miles de millones de puertas NAND en silicio. Muchos ASIC digitales se sintetizan exclusivamente a partir de NAND.",
      },
      {
        domain: "Memoria flash",
        description:
          "La memoria flash NAND (lápices USB, SSD, móviles) debe su nombre y su arquitectura a las puertas NAND dispuestas en matrices de transistores de puerta flotante.",
      },
      {
        domain: "Cursos de hardware",
        description:
          "El curso nand2tetris construye un ordenador completo partiendo de un único chip NAND, y se imparte en más de 100 universidades.",
      },
      {
        domain: "Lógica embebida",
        description:
          "Circuitos integrados 74HC00 con cuatro puertas NAND discretas se siguen vendiendo hoy para lógica auxiliar simple, adaptadores de nivel y osciladores en placas caseras.",
      },
    ],
    iota: [
      {
        domain: "Intérpretes de combinadores",
        description:
          "Compiladores de lenguajes funcionales (por ejemplo Lazy K) traducen programas en cálculo lambda a expresiones puras de combinadores, al estilo Iota, durante la generación de código.",
      },
      {
        domain: "Lenguajes esotéricos",
        description:
          "Iota y su hermano Jot son lenguajes de programación minimalistas usados para estudiar la sintaxis Turing-completa más pequeña posible.",
      },
      {
        domain: "Enseñanza del cálculo lambda",
        description:
          "Las universidades usan Iota para demostrar que basta con un único combinador, separando así sintaxis y poder computacional.",
      },
    ],
    rule110: [
      {
        domain: "Wolfram Physics Project",
        description:
          "El programa de Stephen Wolfram para encontrar la regla subyacente del universo cita expresamente la Regla 110 como prueba de que reglas diminutas pueden ser computacionalmente universales.",
      },
      {
        domain: "Docencia en computación formal",
        description:
          "Se cita en toda introducción moderna a los autómatas celulares como el sistema universal más simple conocido: una máquina de Turing del tamaño de un tuit.",
      },
      {
        domain: "Ruido procedural de texturas",
        description:
          "Algunas bibliotecas de shaders usan la Regla 110 (y la 30) como fuente barata de ruido 1D complejo para gráficos generativos con estilo.",
      },
    ],
    logistic: [
      {
        domain: "Biología de poblaciones",
        description:
          "La ecuación logística continua modela poblaciones acotadas de bacterias, levaduras e incluso algunos mamíferos; el mapa discreto se enseña en todo curso de ecología cuantitativa.",
      },
      {
        domain: "Epidemiología",
        description:
          "El crecimiento epidémico acotado (con capacidad de carga = bolsa de susceptibles) sigue curvas logísticas: las curvas acumuladas de casos de COVID-19 fueron un ejemplo de manual.",
      },
      {
        domain: "Aprendizaje automático",
        description:
          "Los planificadores de tasa de aprendizaje en deep learning caen a veces en el mismo caos por duplicación de período cuando la tasa es demasiado grande; el mapa logístico da la intuición.",
      },
      {
        domain: "Neurociencia",
        description:
          "Los modelos de tasa de disparo neuronal a corrientes de entrada altas bifurcan igual que el mapa logístico y predicen la aparición de disparos irregulares.",
      },
      {
        domain: "Clima y meteorología",
        description:
          "La duplicación de período al estilo Feigenbaum se reprodujo experimentalmente en celdas de convección de fluidos, mostrando la misma ruta universal hacia la turbulencia.",
      },
    ],
    lorenz: [
      {
        domain: "Predicción meteorológica",
        description:
          "Los servicios operativos de predicción usan métodos de ensemble porque la atmósfera comparte la sensibilidad de Lorenz a las condiciones iniciales: la predictibilidad se colapsa al cabo de unos 14 días.",
      },
      {
        domain: "Modelización climática",
        description:
          "El artículo de Lorenz de 1963 dio origen a la teoría moderna del caos y moldea cómo leemos los límites de predictibilidad de las simulaciones climáticas a largo plazo.",
      },
      {
        domain: "Docencia",
        description:
          "Cualquier curso de pregrado de sistemas dinámicos visualiza el atractor de Lorenz como el atractor extraño canónico.",
      },
      {
        domain: "Comunicación segura",
        description:
          "Algunos esquemas de cifrado basados en caos han usado sincronización tipo Lorenz para ocultar señales: un nicho, pero real (Cuomo y Oppenheim, 1993).",
      },
    ],
    fourier: [
      {
        domain: "MP3, AAC, Opus",
        description:
          "Todos los códecs de audio con pérdida modernos transforman ventanas cortas de sonido al dominio de la frecuencia, descartan las componentes inaudibles y transforman de vuelta.",
      },
      {
        domain: "JPEG y HEIC",
        description:
          "Cada bloque de 8×8 píxeles de un JPEG se almacena como coeficientes de la transformada discreta del coseno: por eso el ringing de JPEG tiene patrones horizontales y verticales.",
      },
      {
        domain: "Resonancia magnética",
        description:
          "Una máquina de resonancia magnética mide literalmente coeficientes de Fourier (el espacio k) de tus tejidos y los transforma de vuelta en la imagen que ves en la consulta.",
      },
      {
        domain: "Wi-Fi, 5G, DSL",
        description:
          "La transmisión inalámbrica y por cable modernas usan OFDM, que reparte los datos sobre miles de portadoras sinusoidales cuidadosamente espaciadas: pura ingeniería de Fourier.",
      },
      {
        domain: "Voz y aprendizaje automático",
        description:
          "Los rasgos mel-espectrograma (audio transformado por Fourier) son la entrada de casi todos los modelos de reconocimiento de voz y asistentes vocales.",
      },
    ],
    euler: [
      {
        domain: "Procesado de señales",
        description:
          "Todo libro de DSP usa e^{iωt} como sinusoide compleja canónica; la FFT, la transformada Z y el diseño de filtros viven sobre la fórmula de Euler.",
      },
      {
        domain: "Mecánica cuántica",
        description:
          "Las funciones de onda son exponenciales complejas; los factores de fase e^{iθ} transportan los patrones de interferencia que hacen cuántica a la mecánica cuántica.",
      },
      {
        domain: "Análisis de circuitos de corriente alterna",
        description:
          "Las ingenierías eléctricas modelan tensiones y corrientes alternas como exponenciales complejas: la aritmética de impedancias mediante fasores es aplicación directa de la fórmula de Euler.",
      },
      {
        domain: "Teoría de control",
        description:
          "La estabilidad de los sistemas realimentados se lee en la posición de los polos en el plano complejo: la fórmula de Euler es el puente entre tiempo y frecuencia.",
      },
    ],
    banach: [
      {
        domain: "Docencia en teoría de conjuntos",
        description:
          "Banach–Tarski es el ejemplo de manual de por qué el Axioma de Elección resulta controvertido: aparece en todo curso de posgrado en análisis real.",
      },
      {
        domain: "Fundamentos de la matemática",
        description:
          "Motivó el trabajo del siglo XX sobre fundamentos alternativos de la teoría de conjuntos (constructivismo, intuicionismo) e influyó en las demostraciones verificadas por ordenador.",
      },
      {
        domain: "Filosofía de la matemática",
        description:
          "Se invoca con frecuencia en debates sobre realismo matemático, el significado de «infinito» y los límites de la intuición.",
      },
    ],
    lsystem: [
      {
        domain: "Plantas procedurales en cine y videojuegos",
        description:
          "Árboles, helechos y hierba en títulos como El Rey León (1994), Avatar (2009) y multitud de juegos modernos se generan con sistemas L mediante SpeedTree y middleware similar.",
      },
      {
        domain: "Arquitectura y CAD",
        description:
          "Las herramientas de arquitectura generativa (Grasshopper para Rhino) emplean sistemas L para hacer crecer estructuras ramificadas, fachadas y redes viarias.",
      },
      {
        domain: "Investigación en biología vegetal",
        description:
          "Quienes investigan en biología vegetal ajustan sistemas L a especies reales (por ejemplo la topología del manzano) para estudiar dinámica de crecimiento, competencia por la luz y optimización de cosecha.",
      },
      {
        domain: "Composición musical",
        description:
          "Quienes componen mapean cadenas de un sistema L a eventos MIDI para hacer crecer algorítmicamente temas que desarrollan autosemejanza fractal con el tiempo.",
      },
    ],
    wang: [
      {
        domain: "Gráficos en tiempo real",
        description:
          "Los conjuntos de teselas de Wang permiten empaquetar texturas no repetitivas (hierba, ladrillo, arena) en atlas muy pequeños: importante en dispositivos con memoria limitada como las GPU móviles.",
      },
      {
        domain: "Diseño procedural de niveles",
        description:
          "Motores de juego (Houdini, motores roguelike a medida) usan teselas de Wang para ensamblar grandes mapas de mazmorras y mundos a partir de piezas modulares pequeñas sin costuras visibles.",
      },
      {
        domain: "Materiales y cuasicristales",
        description:
          "La teoría de teselas de Wang se solapa parcialmente con la matemática de los cuasicristales: ambas producen arreglos infinitos aperiódicos.",
      },
    ],
    collatz: [
      {
        domain: "Problema abierto de matemática pura",
        description:
          "Figura entre los problemas abiertos más famosos de la teoría elemental de números; verificado por ordenador hasta 2,95×10²⁰ en 2024.",
      },
      {
        domain: "Computación distribuida",
        description:
          "El proyecto BOINC / collatzconjecture.org busca un contraejemplo de forma colaborativa aprovechando tiempo de GPU donado por voluntarios.",
      },
      {
        domain: "Pedagogía",
        description:
          "Se usa en demostraciones de «trucos numéricos» en secundaria y en trabajos de investigación de grado sobre sucesiones enteras.",
      },
    ],
    doublependulum: [
      {
        domain: "Robótica",
        description:
          "Los brazos robóticos de dos eslabones son matemáticamente péndulos dobles; comprender su acoplamiento no lineal es esencial para un control estable de los manipuladores industriales.",
      },
      {
        domain: "Biomecánica",
        description:
          "Las extremidades humanas durante la marcha, los lanzamientos y los gestos gimnásticos se modelan como sistemas multi-péndulo para la investigación en rehabilitación y prótesis.",
      },
      {
        domain: "Museos de ciencia",
        description:
          "Las exposiciones de péndulo doble en museos (por ejemplo Exploratorium, Deutsches Museum) muestran físicamente el efecto mariposa al público.",
      },
      {
        domain: "Acrobacia y rigging",
        description:
          "Cirque du Soleil y quienes hacen rigging teatral deben entender la dinámica de péndulo sobre péndulo para coreografías seguras de trapecio y telas aéreas.",
      },
    ],
    bzr: [
      {
        domain: "Arritmias cardíacas",
        description:
          "Patrones de onda espiral muy parecidos a las espirales BZR se observan en la superficie del corazón durante la fibrilación: clave para el diseño y la investigación de desfibriladores.",
      },
      {
        domain: "Neurociencia",
        description:
          "La depresión cortical propagada (una onda de despolarización neural ligada a las migrañas) se modela como medio excitable de tipo BZR.",
      },
      {
        domain: "Enseñanza de química",
        description:
          "BZR es la demostración más vistosa de «química viva» que puede mostrar el profesorado de química en bachillerato: oscilación visible en un matraz.",
      },
      {
        domain: "Teoría con Nobel",
        description:
          "Ilya Prigogine ganó el Premio Nobel de 1977 por la teoría de las estructuras disipativas, fundamentada en sistemas como BZR.",
      },
    ],
    turingpattern: [
      {
        domain: "Biología del desarrollo",
        description:
          "Las rayas del pez cebra, el espaciado de los folículos pilosos en ratón, la formación de huellas dactilares y el patrón de los dedos en embriones de vertebrados siguen, según las mediciones, dinámicas de Turing.",
      },
      {
        domain: "Filotaxis vegetal",
        description:
          "Los arreglos espirales de las semillas del girasol, las escamas de las piñas y las brácteas del ananá emergen de reacción-difusión más ángulo áureo: química de Turing sobre una superficie en crecimiento.",
      },
      {
        domain: "Arte generativo y gráficos",
        description:
          "Los patrones de reacción-difusión se usan mucho como ruido procedural de textura (piel, corteza, coral) en herramientas 3D como Substance Designer y Houdini.",
      },
      {
        domain: "Liberación de fármacos y materiales",
        description:
          "Las microestructuras autoorganizadas en membranas poliméricas y recubrimientos de liberación de fármacos se diseñan aprovechando inestabilidades de tipo Turing.",
      },
    ],
    sierpinski: [
      {
        domain: "Antenas fractales",
        description:
          "Las antenas con triángulo de Sierpiński son productos comerciales: móviles, routers Wi-Fi y receptores GPS usan parches fractales multibanda que resuenan en muchas frecuencias en muy poco espacio.",
      },
      {
        domain: "Intercambiadores de calor",
        description:
          "Canales ramificados al estilo Sierpiński aparecen en placas de refrigeración impresas para LED de alta potencia y refrigeración de chips, maximizando la superficie.",
      },
      {
        domain: "Compresión y gráficos",
        description:
          "Los sistemas de funciones iteradas (IFS al estilo Sierpiński) están detrás de los algoritmos de compresión fractal de imágenes, aún usados en codificadores de nicho para imágenes aéreas.",
      },
      {
        domain: "Redes",
        description:
          "El enrutamiento IP jerárquico y las topologías en árbol heredan propiedades fractales de escalado al estilo Sierpiński para el balanceo de carga.",
      },
    ],
    chaosgame: [
      {
        domain: "Bioinformática",
        description:
          "La Chaos Game Representation (CGR) es una forma estándar de visualizar secuencias de ADN: cada nucleótido dirige un punto hacia una de las cuatro esquinas de un cuadrado, y las especies se agrupan en firmas fractales reconocibles.",
      },
      {
        domain: "Compresión fractal",
        description:
          "La compresión fractal de imágenes de Barnsley codifica imágenes como un conjunto pequeño de aplicaciones contractivas que se recuperan mediante el juego del caos.",
      },
      {
        domain: "Texturizado procedural",
        description:
          "Las salidas del juego del caos (variantes del helecho de Barnsley) se usan mucho para follaje procedural y pinceladas estilizadas.",
      },
    ],
    penrose: [
      {
        domain: "Cuasicristales",
        description:
          "El descubrimiento por Dan Shechtman en 1982 de cuasicristales metálicos (Nobel 2011) se entendió gracias a los mosaicos de Penrose: la misma matemática de simetría quíntuple gobierna ambos.",
      },
      {
        domain: "Arquitectura",
        description:
          "La fachada de la Storey Hall en Melbourne y varios patrones matemático-islámicos en el Palacio de Topkapı usan geometría aperiódica al estilo Penrose.",
      },
      {
        domain: "Ciencia de materiales",
        description:
          "Hoy existen recubrimientos cuasicristalinos comerciales (por ejemplo en sartenes antiadherentes Sjöbo) que aprovechan arreglos atómicos al estilo de los mosaicos de Penrose.",
      },
      {
        domain: "Criptografía",
        description:
          "Se han propuesto recientemente generadores pseudoaleatorios que usan secuencias de mosaicos aperiódicos para muestreo de baja discrepancia.",
      },
    ],
    apollonian: [
      {
        domain: "Empaquetamiento granular",
        description:
          "Cómo llenan los contenedores la arena, la grava y los polvos farmacéuticos se modela con empaquetamientos esféricos al estilo apoloniano: clave en hormigón, comprimidos y metalurgia de polvos.",
      },
      {
        domain: "Teoría de números",
        description:
          "Los empaquetamientos apolonianos enteros son estudiados por la teoría analítica de números: trabajos de Sarnak, Bourgain y Kontorovich han dado nuevos resultados sobre curvaturas primas.",
      },
      {
        domain: "Física de espumas y emulsiones",
        description:
          "Las estructuras de espuma (espuma de cerveza, emulsiones alimentarias, alvéolos pulmonares) heredan, al formarse, restricciones de empaquetamiento al estilo apoloniano.",
      },
      {
        domain: "Diseño gráfico",
        description:
          "Logos, carteles y diseños de tatuajes usan empaquetamientos apolonianos para crear una geometría radial muy llamativa.",
      },
    ],
    phi: [
      {
        domain: "Filotaxis vegetal",
        description:
          "Las espirales de semillas del girasol, las escamas de las piñas y la disposición de las hojas en la mayoría de las plantas convergen al ángulo áureo: verificado en miles de especies.",
      },
      {
        domain: "Fracciones continuas",
        description:
          "φ tiene el desarrollo en fracción continua más simple, [1;1,1,…], lo que lo convierte en el número «más irracional»: concepto clave para la teoría KAM en mecánica clásica.",
      },
      {
        domain: "Cuasicristales y Penrose",
        description:
          "Las razones de las longitudes de lado en los mosaicos de Penrose (y el factor de inflación) son exactamente φ; la misma razón aparece en cuasicristales reales descubiertos en la naturaleza en 2009.",
      },
      {
        domain: "Teoría de números",
        description:
          "Los números de Fibonacci subyacen al teorema de Zeckendorf y a representaciones enteras eficientes usadas en algunos algoritmos de compresión y estructuras de datos.",
      },
      {
        domain: "Escepticismo honesto",
        description:
          "Las afirmaciones de que φ aparece en el Partenón, la Mona Lisa, la concha de nautilo o las proporciones del cuerpo humano son en su mayoría mitos: George Markowsky (1992) y otros los han desmontado.",
      },
    ],
    buffon: [
      {
        domain: "Integración de Monte Carlo",
        description:
          "La aguja de Buffon es la semilla histórica de los métodos de Monte Carlo: hoy se usan por todas partes, desde la valoración financiera (Black–Scholes) hasta la simulación de física de partículas (Geant4) y el rendering (path tracing).",
      },
      {
        domain: "Simulación física",
        description:
          "El muestreo aleatorio de integrales de alta dimensión en QCD reticular, ingeniería nuclear y diseño de reactores extiende la lógica de Buffon a millones de dimensiones.",
      },
      {
        domain: "Gráficos por ordenador",
        description:
          "El muestreo estratificado de rayos de luz en los modernos path tracers (Pixar, Cycles, Unreal Lumen) desciende cuidadosamente de la aguja de Buffon.",
      },
      {
        domain: "Docencia de estadística",
        description:
          "Demostración introductoria estándar de probabilidad; aún se hace en prácticas de estadística de grado por todo el mundo.",
      },
    ],
    hilberthotel: [
      {
        domain: "Teoría de conjuntos y docencia",
        description:
          "Es la analogía canónica para entender la aritmética cardinal y la diferencia entre infinitos numerables y no numerables.",
      },
      {
        domain: "Programación con estructuras infinitas",
        description:
          "Las listas perezosas infinitas en Haskell, los generadores en Python y los streams en Scala recuerdan las reordenaciones del hotel de Hilbert sobre el infinito numerable.",
      },
      {
        domain: "Divulgación científica",
        description:
          "Vídeo de TED-Ed, Vsauce, PBS Infinite Series: la explicación moderna del infinito más compartida.",
      },
    ],
    gabrielshorn: [
      {
        domain: "Docencia de cálculo",
        description:
          "Ejemplo estándar del primer cálculo de una integral impropia contraintuitiva; aparece en cualquier libro de cálculo de segundo.",
      },
      {
        domain: "Filosofía de la matemática",
        description:
          "Se cita en debates sobre el sentido de las paradojas geométricas y los límites de la intuición física: un experimento mental fundacional.",
      },
      {
        domain: "Microfluídica",
        description:
          "Análogos reales con flujo capilar hacia canales cada vez más estrechos (dispositivos microfluídicos) se enfrentan a los casos límite que el cuerno de Gabriel formaliza.",
      },
    ],
    cantor: [
      {
        domain: "Teoría de la computabilidad",
        description:
          "La diagonal de Cantor da directamente la prueba del problema de la parada de Turing y los teoremas de incompletitud de Gödel: las piedras angulares de la informática teórica.",
      },
      {
        domain: "Teoría de lenguajes de programación",
        description:
          "Se usa para demostrar que no existe un sistema de tipos «universal» que decida la verificación de tipos para todos los programas (teorema de Rice).",
      },
      {
        domain: "Criptografía y complejidad",
        description:
          "Los argumentos de diagonalización están en la base de los resultados modernos de teoría de la complejidad: separaciones entre P, NP, EXP.",
      },
      {
        domain: "Filosofía de la matemática",
        description:
          "El argumento de Cantor dio la vuelta a las visiones aristotélica y kantiana del infinito, moldeando la lógica y la filosofía analítica del siglo XX.",
      },
    ],
    boids: [
      {
        domain: "Efectos visuales en cine",
        description:
          "Batman Returns (enjambre de murciélagos de 1992), El Rey León (estampida de ñus de 1994) y un sinfín de películas modernas usan Boids, normalmente vía Massive o Houdini.",
      },
      {
        domain: "Enjambres de drones",
        description:
          "Los shows de drones que baten récords de Intel (Olimpiadas de PyeongChang 2018, Olimpiadas de París 2024) usan reglas derivadas de Boids a gran escala.",
      },
      {
        domain: "Simulación de multitudes",
        description:
          "Los estudios de arquitectura simulan evacuaciones de estadios y flujos en centros comerciales con agentes al estilo Boids: en uso para planificación de estadios desde la década de 2000.",
      },
      {
        domain: "Enjambres robóticos",
        description:
          "Los laboratorios de investigación usan reglas tipo Boids para enjambres robóticos autónomos en búsqueda y rescate y en monitorización agrícola.",
      },
      {
        domain: "Naturaleza real",
        description:
          "Los estudios empíricos de bandadas de estorninos (Cavagna et al., 2010), bancos de peces y rebaños de mamíferos confirman reglas muy próximas a los Boids originales.",
      },
    ],
    aizawa: [
      {
        domain: "Investigación en sistemas dinámicos",
        description:
          "Aizawa es uno de una familia de atractores extraños 3D usados para probar integradores numéricos, algoritmos de visualización y métodos de detección de caos.",
      },
      {
        domain: "Arte matemático",
        description:
          "El arte generativo renderiza los atractores de Aizawa, Thomas y Halvorsen como gráficos, impresiones y animaciones, que se venden en Etsy y en ferias de arte.",
      },
      {
        domain: "Docencia",
        description:
          "Cada vez más usado junto con Lorenz en los cursos de posgrado de sistemas dinámicos para mostrar un zoológico más amplio de formas caóticas.",
      },
    ],
    dla: [
      {
        domain: "Electroquímica",
        description:
          "Los depósitos de zinc, cobre y otros metales obtenidos en celdas electrolíticas forman dendritas tipo DLA: directamente relevante para electrodeposición, diseño de baterías (dendritas de litio) y corrosión.",
      },
      {
        domain: "Crecimiento de cristales",
        description:
          "La formación de copos de nieve, la escarcha en las ventanas y las dendritas minerales en las rocas exhiben todas leyes de escalado de DLA.",
      },
      {
        domain: "Biología",
        description:
          "Los frentes de colonias bacterianas en placas de agar, los conos de crecimiento neuronal y la frontera de algunos tumores siguen reglas tipo DLA.",
      },
      {
        domain: "Física de los rayos",
        description:
          "La ramificación de los rayos y los patrones de ruptura dieléctrica se modelan bien con DLA.",
      },
    ],
    langton: [
      {
        domain: "Vida artificial",
        description:
          "La hormiga de Langton es un ejemplo fundacional del campo de la vida artificial que él ayudó a fundar en el Santa Fe Institute.",
      },
      {
        domain: "Informática teórica",
        description:
          "Se usa como ejemplo mínimo de computación universal en máquinas de Turing 2D; aún se cita en artículos fundacionales de complejidad.",
      },
      {
        domain: "Docencia",
        description:
          "Ejemplo introductorio favorito en cursos de autómatas celulares: la fase «autopista» es uno de los fenómenos emergentes más accesibles de la informática.",
      },
    ],
    pascalmod: [
      {
        domain: "Teoría de números",
        description:
          "El teorema de Lucas (1878) da pie directamente a algoritmos eficientes para coeficientes binomiales módulo primo: en criptografía, combinatoria sobre palabras y programación competitiva.",
      },
      {
        domain: "Teoría de códigos",
        description:
          "Los códigos correctores Reed–Muller y BCH se apoyan en la maquinaria de coeficientes binomiales módulo p: están en los códigos QR, en sondas al espacio profundo (Mariner 9, Voyager) y en la TV digital DVB-T.",
      },
      {
        domain: "Arte visual",
        description:
          "Pascal mod 2 es el origen algebraico del triángulo de Sierpiński: se vende como póster, se teje en alfombras y se usa en instalaciones de galería.",
      },
    ],
    sternbrocot: [
      {
        domain: "Música por ordenador y afinación",
        description:
          "Quienes componen música microtonal usan Stern–Brocot para hallar aproximaciones temperadas a razones de entonación justa: clave para la música xenarmónica.",
      },
      {
        domain: "Diseño de engranajes en robótica",
        description:
          "Las búsquedas de la mejor aproximación racional para relaciones de transmisión recorren el árbol de Stern–Brocot para encontrar reducciones mecánicas eficientes.",
      },
      {
        domain: "Sistemas de calendario",
        description:
          "Las reglas de año bisiesto basadas en fracciones continuas (calendario persa, correcciones gregorianas propuestas) se derivan de las medianas de Stern–Brocot.",
      },
      {
        domain: "Renderizado de imagen",
        description:
          "El muestreo subpíxel y la rasterización moderna de fuentes usan medianas al estilo Stern–Brocot para elegir razones de cobertura de píxel.",
      },
    ],
    ulam: [
      {
        domain: "Teoría pura de números",
        description:
          "Visualizar los primos mediante espirales al estilo de Ulam sigue inspirando nuevas conjeturas sobre densidades de primos polinómicos (Hardy–Littlewood, Sato–Tate).",
      },
      {
        domain: "Docencia",
        description:
          "Exposición habitual en museos de matemáticas y exploración introductoria en cursos de teoría de números.",
      },
      {
        domain: "Arte generativo",
        description:
          "Obras derivadas de la espiral de Ulam aparecen en exposiciones (Roman Verostko, Tristan Perich).",
      },
    ],
    cardioid: [
      {
        domain: "Ingeniería de audio",
        description:
          "Los micrófonos cardioides (los que usa cualquier podcaster o profesional de radiodifusión) deben su nombre al patrón de captación cardioide: son sensibles delante y sordos detrás.",
      },
      {
        domain: "Diseño de antenas",
        description:
          "Algunos patrones de directividad de antenas son cardioides; comunes en VHF marino y equipos de radiogoniometría.",
      },
      {
        domain: "Arquitectura e iluminación",
        description:
          "Los reflectores cardioides se usan en iluminación teatral clásica (PAR cans) para proyectar haces asimétricos.",
      },
      {
        domain: "Conexión con Mandelbrot",
        description:
          "El bulbo principal del conjunto de Mandelbrot es exactamente una cardioide; entender la forma ilumina el diagrama de bifurcación de Mandelbrot.",
      },
    ],
    galton: [
      {
        domain: "Docencia de estadística",
        description:
          "El tablero de Galton es la demostración canónica del teorema central del límite: presente en casi todos los museos de ciencia (Deutsches Museum, Boston Museum of Science, MOSS Toronto).",
      },
      {
        domain: "Quincunce en genética",
        description:
          "Galton construyó el tablero original para hacer visible la estadística hereditaria a un público victoriano; sentó las bases de la biometría y la genética estadística.",
      },
      {
        domain: "Plinko y diseño de juegos",
        description:
          "Los tableros de Galton inspiraron el juego televisivo Plinko y los modernos juegos móviles de pachinko y tragaperras, tanto físicos como digitales.",
      },
      {
        domain: "Análisis de tolerancias industriales",
        description:
          "Los cálculos estadísticos de cadenas de tolerancia en ingeniería mecánica recurren directamente a la lógica del teorema central del límite que el tablero de Galton visualiza.",
      },
    ],
    magpendulum: [
      {
        domain: "Demostraciones de caos",
        description:
          "El juguete de escritorio «péndulo de tres imanes» es la demostración física más popular de las cuencas de atracción fractales: lo venden ThinkGeek, Nikola Labs y multitud de tiendas de regalos científicos.",
      },
      {
        domain: "Investigación en levitación magnética",
        description:
          "La dinámica de los péndulos de imán permanente está detrás de los trenes maglev, los rodamientos magnéticos y los amortiguadores magnetorreológicos.",
      },
      {
        domain: "Docencia",
        description:
          "Demostración estándar de dinámica no lineal en física de grado; sirve para enseñar espacio de fases, disipación y sensibilidad al estado final.",
      },
    ],
    godel: [
      {
        domain: "Fundamentos de la matemática",
        description:
          "Gödel puso fin al programa de Hilbert de mecanizar las matemáticas y transformó lo que el gremio matemático cree demostrable en principio.",
      },
      {
        domain: "Informática",
        description:
          "La indefinibilidad de la verdad de Tarski, el problema de la parada de Turing y el teorema de Rice son descendientes directos: presentes en todo curso de grado de lógica y computabilidad.",
      },
      {
        domain: "Filosofía de la mente",
        description:
          "El argumento de Penrose de que la mente humana no es puramente algorítmica (La nueva mente del emperador, 1989) se apoya mucho en Gödel: polémico, pero influyente.",
      },
      {
        domain: "Software verificado",
        description:
          "Los asistentes modernos de demostración (Coq, Lean, Isabelle) se topan a diario con los límites de Gödel; toda su utilidad reside en formalizar lo demostrable dentro de un sistema explícito.",
      },
    ],
    halting: [
      {
        domain: "Compiladores y análisis estático",
        description:
          "Los analizadores estáticos modernos (Coverity, Infer, el borrow checker de Rust) tienen que renunciar a la precisión perfecta porque las propiedades no triviales de los programas son indecidibles: consecuencia directa del problema de la parada (teorema de Rice).",
      },
      {
        domain: "Antivirus",
        description:
          "Por qué ningún antivirus atrapa todo el malware: detectar perfectamente los programas hostiles resolvería una variante del problema de la parada.",
      },
      {
        domain: "Nubes de cómputo",
        description:
          "Los autoescaladores en la nube nunca pueden garantizar que «este trabajo del usuario terminará»: imponen tiempos límite porque decidir la parada es imposible.",
      },
      {
        domain: "Docencia",
        description:
          "La introducción canónica a la indecidibilidad en todo curso de teoría de la computación del planeta.",
      },
    ],
    pvsnp: [
      {
        domain: "Criptografía",
        description:
          "Si P = NP, RSA, AES, todo el tráfico de blockchain y de TLS quedaría roto de la noche a la mañana: todo secreto digital moderno depende de que P ≠ NP sea efectivamente cierto.",
      },
      {
        domain: "Optimización",
        description:
          "La logística (rutas de UPS), el diseño de chips (place-and-route) y la búsqueda de hiperparámetros en aprendizaje automático abordan problemas NP-difíciles con heurísticas porque las soluciones exactas son intratables.",
      },
      {
        domain: "IA y solvers SAT",
        description:
          "Los solvers SAT/SMT modernos (Z3, MiniSat) resuelven habitualmente instancias NP-difíciles con millones de variables gracias a heurísticas ingeniosas, aunque la complejidad en el peor caso sea exponencial.",
      },
      {
        domain: "Bioinformática",
        description:
          "El plegamiento de proteínas, el ensamblaje de genomas y la reconstrucción de árboles filogenéticos son todos NP-difíciles: empujan al campo a inventar algoritmos de aproximación y métodos de IA (AlphaFold).",
      },
      {
        domain: "Premio abierto",
        description:
          "Uno de los siete problemas del milenio del Clay, con un premio de 1.000.000 de dólares por demostración o refutación.",
      },
    ],
    rsa: [
      {
        domain: "TLS / HTTPS",
        description:
          "Cada candado de tu navegador implica RSA o su primo en curva elíptica (ECDSA) en el apretón de manos inicial: miles de millones de veces por segundo.",
      },
      {
        domain: "Firmas digitales",
        description:
          "La App Store de Apple, Google Play y Microsoft Update firman cada lanzamiento con criptografía de clave pública al estilo RSA; si se falsificara, el malware se propagaría sin freno.",
      },
      {
        domain: "Banca y blockchain",
        description:
          "Los mensajes SWIFT, las transacciones con chip y la mayoría de las carteras blockchain dependen de hipótesis de dureza de factorización o de logaritmo discreto, equivalentes a RSA.",
      },
      {
        domain: "Documentos de identidad",
        description:
          "Los pasaportes modernos (ICAO 9303) contienen datos biométricos firmados con RSA; el control de fronteras verifica la firma contra las CA nacionales.",
      },
      {
        domain: "Pánico postcuántico",
        description:
          "El algoritmo de Shor rompe RSA en un ordenador cuántico suficientemente grande; el NIST está estandarizando sustitutos postcuánticos (Kyber, Dilithium).",
      },
    ],
    mobius: [
      {
        domain: "Cintas transportadoras industriales",
        description:
          "Las correas de transmisión en forma de banda de Möbius se desgastan de modo uniforme por ambas «caras» (¡solo hay una!): usadas en viejas imprentas, cintas modernas de grabación y algunos sistemas de cinta VHS.",
      },
      {
        domain: "Ingeniería mecánica",
        description:
          "Se han patentado engranajes de Möbius y resistencias con forma de Möbius para reducir a la mitad el desgaste y la inductancia, respectivamente.",
      },
      {
        domain: "Investigación en topología",
        description:
          "La banda de Möbius es la superficie no orientable más simple: puerta de entrada a un vasto campo que clasifica todas las superficies, usado en cosmología y teoría de cuerdas.",
      },
      {
        domain: "Arte y arquitectura",
        description:
          "La Cinta sin fin de Max Bill, el triángulo del símbolo de reciclaje y arquitectos desde México hasta Astaná usan la topología de Möbius en instalaciones llamativas.",
      },
      {
        domain: "Química",
        description:
          "Las moléculas aromáticas de Möbius (Heilbronner 1964; sintetizadas por primera vez en 2003) tienen un semitwist de π en sus electrones y muestran propiedades electrónicas que ningún anillo plano puede tener.",
      },
    ],
    eulerchar: [
      {
        domain: "Gráficos por ordenador",
        description:
          "La validación de mallas (Blender, Maya) comprueba V−A+C frente al χ esperado para detectar agujeros o geometría duplicada antes de la impresión 3D.",
      },
      {
        domain: "Topología de datos",
        description:
          "Los pipelines de homología persistente usan características de Euler para resumir la forma de nubes de puntos de alta dimensión: se aplican en genómica, redes de sensores y cosmología.",
      },
      {
        domain: "Arquitectura",
        description:
          "Las cúpulas geodésicas de Buckminster Fuller (Spaceship Earth de Epcot, Biosphère de Montreal) se diseñan de modo que V−A+C=2 fuerza exactamente 12 pentágonos entre los hexágonos.",
      },
      {
        domain: "Diseño del balón de fútbol",
        description:
          "El clásico balón con forma de icosaedro truncado tiene 12 pentágonos y 20 hexágonos; la fórmula de Euler explica por qué son exactamente 12, ni uno menos.",
      },
      {
        domain: "Física de partículas",
        description:
          "El teorema del índice de Atiyah-Singer, fundamental en la teoría gauge moderna, generaliza la fórmula de Euler y conecta la topología con las ecuaciones diferenciales.",
      },
    ],
    konigsberg: [
      {
        domain: "Nacimiento de la teoría de grafos",
        description:
          "Königsberg lanzó todo el campo: hoy la teoría de grafos subyace al PageRank de Google, al análisis de redes sociales, al trazado de chips y a la planificación de rutas.",
      },
      {
        domain: "Secuenciación de ADN",
        description:
          "Los algoritmos de camino euleriano inspirados en Königsberg son los caballos de tiro del ensamblaje moderno de genomas (Pevzner y Tang, 2001; usados en SPAdes, Velvet, megahit).",
      },
      {
        domain: "Optimización de rutas",
        description:
          "Cartería, camiones de basura y quitanieves resuelven el problema del cartero chino: descendiente directo de los puentes de Königsberg.",
      },
      {
        domain: "Turismo",
        description:
          "Kaliningrado (la actual Königsberg) explota turísticamente los puentes; el público intenta el paseo aunque solo cinco de los siete originales sobrevivieron a la Segunda Guerra Mundial.",
      },
    ],
    fourcolor: [
      {
        domain: "Diseño de mapas",
        description:
          "Cartografía y SIG aplican de hecho algoritmos de coloreado a cuatro colores en mapas políticos, atlas por países y visualización del tiempo.",
      },
      {
        domain: "Redes móviles",
        description:
          "La asignación de frecuencias entre torres de telefonía móvil se reduce a coloreado de grafos: el teorema de los cuatro colores marca el caso límite para ciertas disposiciones planas.",
      },
      {
        domain: "Planificación de horarios",
        description:
          "Los calendarios de exámenes universitarios, la asignación de salas de congresos y los calendarios deportivos son todos problemas de coloreado de grafos; las variantes planas heredan la cota de los cuatro colores.",
      },
      {
        domain: "Matemática verificada por ordenador",
        description:
          "Junto con la conjetura de Kepler, el teorema de los cuatro colores fue un hito de la demostración asistida por ordenador: la cultura de los asistentes de prueba (Coq, Lean) reclama su legitimidad de aquí.",
      },
    ],
    smallworld: [
      {
        domain: "Redes sociales",
        description:
          "La función de «contactos de segundo grado» de LinkedIn, las cascadas de retuits de Twitter y la sugerencia de «personas que quizá conozcas» de Facebook explotan la estructura de mundo pequeño para encontrar relevancia.",
      },
      {
        domain: "Modelos epidémicos",
        description:
          "La modelización de la propagación de COVID-19, las apps de rastreo de contactos y las estrategias de vacunación usan modelos de red de mundo pequeño para predecir la dinámica de brotes.",
      },
      {
        domain: "Investigación cerebral",
        description:
          "Los estudios de resonancia magnética funcional muestran que el conectoma humano es una red de mundo pequeño: el coeficiente de mundo pequeño es hoy un biomarcador estándar en la investigación sobre Alzheimer y esquizofrenia.",
      },
      {
        domain: "Enrutamiento en Internet",
        description:
          "El grafo de sistemas autónomos de Internet tiene propiedades de mundo pequeño; BGP y los CDN modernos (Cloudflare, Fastly) aprovechan las distancias cortas en saltos.",
      },
      {
        domain: "Six Degrees of Kevin Bacon",
        description:
          "El juego cinematográfico de 1994 y la web del número de Bacon son artefactos populares de la teoría del mundo pequeño; quienes hacen matemáticas compiten por números de Erdős bajos.",
      },
    ],
    diffusion: [
      {
        domain: "Generación de imágenes",
        description:
          "Stable Diffusion, Midjourney, DALL·E 3 e Imagen son modelos de difusión latente. Escribe un prompt y el modelo recorre ruido gaussiano hasta una imagen coherente con el texto.",
      },
      {
        domain: "Generación de vídeo",
        description:
          "Sora, Veo y Runway llevan la misma matemática de difusión a tres dimensiones (alto × ancho × tiempo) para que el denoiser aprenda coherencia espacio-temporal junto con el aspecto.",
      },
      {
        domain: "Diseño de fármacos y proteínas",
        description:
          "RFdiffusion (laboratorio Baker) y Chroma generan nuevos esqueletos proteicos eliminando ruido sobre coordenadas 3D en vez de píxeles — candidatos publicados han sido sintetizados y se pliegan correctamente.",
      },
      {
        domain: "Audio y habla",
        description:
          "AudioLDM, Riffusion y la línea de síntesis vocal ElevenLabs/Vall-E usan difusión 1D sobre formas de onda o espectrogramas para generar música y voces naturales a partir de texto.",
      },
      {
        domain: "Física y termodinámica",
        description:
          "El proceso directo es literalmente dinámica de Langevin — el calendario de ruido refleja un sistema relajándose hacia el equilibrio térmico. El artículo original de Sohl-Dickstein (2015) se planteó como termodinámica de no equilibrio.",
      },
    ],
    quine: [
      {
        domain: "Teoría de lenguajes de programación",
        description:
          "Las quines son la prueba de cordura estándar de que un lenguaje es lo bastante expresivo para la autorreferencia; los cursos de teoría de la computación las usan para enseñar el teorema de recursión de Kleene en forma concreta.",
      },
      {
        domain: "Virus informáticos y autorreplicadores",
        description:
          "Cada virus, gusano y motor metamórfico clásico es una variante de quine: código que se copia antes de hacer cualquier otra cosa. El malware autorreplicante moderno se estudia como ingeniería de quines aplicada.",
      },
      {
        domain: "Genética y biología molecular",
        description:
          "La replicación del ADN es la quine de la biología: una secuencia cuya única tarea es copiarse a sí misma, incluida la maquinaria que copia. Hofstadter traza la analogía explícitamente en Gödel, Escher, Bach.",
      },
      {
        domain: "Bootstrapping de compiladores",
        description:
          "Trusting Trust (Ken Thompson, 1984) demostró que el compilador de un compilador puede ser una quine que inserta una puerta trasera en cada compilación — base de la seguridad de la cadena de suministro y de la investigación en builds reproducibles.",
      },
      {
        domain: "Demoscene y arte de código",
        description:
          "Las quines polígrafas — programas que se imprimen a sí mismos y son válidos en varios lenguajes a la vez — son un género adorado del arte de código; el IOCCC tiene una categoría dedicada a las quines.",
      },
    ],
    riemann: [
      {
        domain: "Teorema de los números primos",
        description:
          "El término de error en el recuento de primos por debajo de N está controlado por los ceros de ζ; la hipótesis de Riemann equivale a la cota más fina posible sobre cuán irregularmente se distribuyen los primos.",
      },
      {
        domain: "Criptografía",
        description:
          "RSA, la criptografía de curva elíptica y la dureza de la factorización dependen de hipótesis sobre la distribución de los primos; enunciados RH-equivalentes alimentan las mejores cotas conocidas sobre la seguridad criptográfica.",
      },
      {
        domain: "Caos cuántico",
        description:
          "La estadística de los espaciados entre ceros de zeta coincide con la estadística de los autovalores de matrices hermíticas aleatorias — las mismas con que se modelan los niveles de energía de núcleos pesados. La conjetura de Montgomery-Dyson (1972) es una de las pasarelas más sorprendentes de la matemática.",
      },
      {
        domain: "Numéricos verificados por ordenador",
        description:
          "Se ha comprobado que los primeros 10^13 ceros no triviales están sobre la línea crítica (Xavier Gourdon, 2004 y posteriores). Ninguna campaña de verificación ha encontrado un contraejemplo a RH.",
      },
      {
        domain: "Divulgación y prestigio de problemas abiertos",
        description:
          "Riemann es el problema sin resolver más famoso fuera de Fermat — un Premio Clay del Milenio (1 M$), apariciones recurrentes en la ficción (A Beautiful Mind, La música de los primos) y un goteo constante de «pruebas» que no sobreviven al peer review.",
      },
    ],
    backprop: [
      {
        domain: "Aprendizaje profundo",
        description:
          "Toda red neuronal moderna —clasificadores de imágenes, modelos de lenguaje, recomendadores— se entrena por retropropagación. PyTorch y JAX la implementan como su núcleo de diferenciación (autograd).",
      },
      {
        domain: "Visión por computador",
        description:
          "Las redes convolucionales para imagen médica, conducción autónoma e identificación biométrica aprenden sus núcleos de filtro directamente de datos etiquetados con backprop; los gradientes fluyen hacia atrás por convoluciones y pooling.",
      },
      {
        domain: "Modelos de lenguaje",
        description:
          "GPT, Claude, Llama y cualquier transformer se entrenan retropropagando la entropía cruzada a través de billones de parámetros. El único algoritmo que escala de una neurona a un billón.",
      },
      {
        domain: "Robótica y control",
        description:
          "Los métodos de gradiente de política en aprendizaje por refuerzo usan backprop para actualizar controladores neuronales a partir de señales de recompensa; los robots modernos de marcha bípeda y manipulación diestra lo usan.",
      },
      {
        domain: "Problemas inversos en ciencia",
        description:
          "Los físicos invierten experimentos montando el modelo directo en PyTorch/JAX y retropropagando a través de él — empleado en diseño de proteínas (AlphaFold), renderizado diferenciable y diseño experimental basado en gradientes.",
      },
    ],
  },
  fr: {
    eml: [
      {
        domain: "Régression symbolique",
        description:
          "Les systèmes de calcul formel qui cherchent à redécouvrir des lois physiques à partir de données utilisent parfois des alphabets d'opérateurs compacts comme EML afin de restreindre l'espace de recherche.",
      },
      {
        domain: "Informatique théorique",
        description:
          "EML est cousine d'ensembles universels comme NAND en logique et Iota en combinateurs — intéressante pour ce qu'elle dit de la taille minimale d'une primitive.",
      },
    ],
    mandelbrot: [
      {
        domain: "Art génératif et motion design",
        description:
          "Cinéastes et artistes numériques zooment dans l'ensemble de Mandelbrot pour produire des arrière-plans pour tout, des clips musicaux aux séquences d'ouverture des keynotes Apple.",
      },
      {
        domain: "Antennes fractales",
        description:
          "Des contours façonnés à la Mandelbrot/Julia sont utilisés dans certaines antennes multibandes compactes (par exemple les premiers modules Bluetooth), car la forme autosimilaire résonne sur de nombreuses fréquences.",
      },
      {
        domain: "Enseignement",
        description:
          "Exemple universitaire standard pour la dynamique complexe, le chaos déterministe et la frontière entre ordre et chaos.",
      },
      {
        domain: "Analogues naturels",
        description:
          "Côtes, crêtes montagneuses, frondes de fougère et fleurettes de brocoli présentent la même structure de bord autosimilaire — c'était précisément le propos de Mandelbrot sur la géométrie fractale.",
      },
    ],
    life: [
      {
        domain: "Enseignement de l'informatique",
        description:
          "Tout cursus d'informatique, du MIT 6.001 aux clubs lycéens, utilise le Life de Conway pour enseigner l'émergence, les automates cellulaires et la Turing-complétude en un après-midi.",
      },
      {
        domain: "Art génératif",
        description:
          "Les designers utilisent Life et ses variantes (HighLife, Day & Night…) pour générer des visuels en perpétuelle évolution pour clips, installations et économiseurs d'écran.",
      },
      {
        domain: "Modélisation biologique discrète",
        description:
          "Démographie, dynamique proie-prédateur et propagation épidémique sont parfois prototypées sur des grilles façon Life avant de passer à des modèles à base d'agents plus riches.",
      },
      {
        domain: "Bricolage matériel",
        description:
          "Les projets FPGA et microcontrôleurs affichent souvent Life sur des matrices LED comme «hello world» du matériel cellulaire parallèle.",
      },
    ],
    nand: [
      {
        domain: "Au cœur de chaque puce",
        description:
          "Du silicium série M d'Apple aux microcontrôleurs industriels, des milliards de portes NAND sont gravées dans le silicium chaque minute. De nombreux ASIC numériques sont synthétisés uniquement à partir de NAND.",
      },
      {
        domain: "Mémoire flash",
        description:
          "La mémoire flash NAND (clés USB, SSD, smartphones) doit son nom et son architecture aux portes NAND organisées en réseaux de transistors à grille flottante.",
      },
      {
        domain: "Cours de matériel",
        description:
          "Le cours nand2tetris construit un ordinateur complet en partant d'une seule puce NAND — utilisé dans plus de 100 universités.",
      },
      {
        domain: "Logique embarquée",
        description:
          "Des circuits discrets 74HC00 contenant quatre portes NAND continuent d'être produits aujourd'hui pour la logique de glue, le décalage de niveau et les oscillateurs sur les PCB amateurs.",
      },
    ],
    iota: [
      {
        domain: "Interpréteurs de combinateurs",
        description:
          "Les compilateurs de langages fonctionnels (par exemple Lazy K) traduisent les programmes du lambda-calcul en expressions pures de combinateurs — façon Iota — lors de la génération de code.",
      },
      {
        domain: "Langages ésotériques",
        description:
          "Iota et son frère Jot sont des langages de programmation minimalistes utilisés pour étudier la plus petite syntaxe Turing-complète possible.",
      },
      {
        domain: "Enseignement du lambda-calcul",
        description:
          "Les universités utilisent Iota pour montrer qu'un unique combinateur suffit, séparant ainsi syntaxe et puissance de calcul.",
      },
    ],
    rule110: [
      {
        domain: "Wolfram Physics Project",
        description:
          "Le programme de Stephen Wolfram, visant à trouver la règle sous-jacente de l'univers, cite explicitement la règle 110 comme preuve que de très petites règles peuvent être universellement calculatoires.",
      },
      {
        domain: "Enseignement du calcul formel",
        description:
          "Citée dans toute introduction moderne aux automates cellulaires comme le plus simple système universel connu — une machine de Turing en un tweet.",
      },
      {
        domain: "Bruit procédural de texture",
        description:
          "Certaines bibliothèques de shaders utilisent la règle 110 (et la 30) comme source bon marché de bruit 1D complexe pour des graphismes génératifs stylisés.",
      },
    ],
    logistic: [
      {
        domain: "Biologie des populations",
        description:
          "L'équation logistique continue modélise des populations strictement bornées de bactéries, de levures et même de certains mammifères ; l'itération discrète est enseignée dans tout cours d'écologie quantitative.",
      },
      {
        domain: "Épidémiologie",
        description:
          "La croissance épidémique bornée (avec capacité de charge = pool des susceptibles) suit des courbes logistiques — les courbes cumulées de cas de COVID-19 en sont un exemple manuel.",
      },
      {
        domain: "Apprentissage automatique",
        description:
          "Les calendriers de taux d'apprentissage en deep learning tombent parfois dans le même chaos par doublement de période quand le taux est trop grand ; l'itération logistique en donne l'intuition.",
      },
      {
        domain: "Neurosciences",
        description:
          "Les modèles de taux de décharge neuronale à fort courant d'entrée bifurquent exactement comme l'itération logistique, prédisant l'apparition de décharges irrégulières.",
      },
      {
        domain: "Climat et météo",
        description:
          "Le doublement de période à la Feigenbaum a été reproduit expérimentalement dans des cellules de convection, montrant la même route universelle vers la turbulence.",
      },
    ],
    lorenz: [
      {
        domain: "Prévision météorologique",
        description:
          "Les services opérationnels recourent aux méthodes d'ensemble parce que l'atmosphère partage la sensibilité de Lorenz aux conditions initiales — la prévisibilité s'effondre au bout d'environ 14 jours.",
      },
      {
        domain: "Modélisation climatique",
        description:
          "L'article de Lorenz de 1963 a fait naître la théorie moderne du chaos et façonne notre lecture des limites de prévisibilité des simulations climatiques à long terme.",
      },
      {
        domain: "Enseignement",
        description:
          "Tout cours de licence en systèmes dynamiques visualise l'attracteur de Lorenz comme l'attracteur étrange canonique.",
      },
      {
        domain: "Communication sécurisée",
        description:
          "Des schémas de chiffrement chaotique ont utilisé la synchronisation à la Lorenz pour masquer des signaux — niche, mais réel (Cuomo et Oppenheim, 1993).",
      },
    ],
    fourier: [
      {
        domain: "MP3, AAC, Opus",
        description:
          "Tous les codecs audio modernes avec perte transforment de courtes fenêtres de son dans le domaine fréquentiel, jettent les composantes inaudibles puis transforment en sens inverse.",
      },
      {
        domain: "JPEG et HEIC",
        description:
          "Chaque bloc de 8×8 pixels d'une image JPEG est stocké sous forme de coefficients de la transformée en cosinus discrète — d'où les motifs horizontaux/verticaux du ringing JPEG.",
      },
      {
        domain: "IRM",
        description:
          "Une machine IRM mesure littéralement des coefficients de Fourier (l'espace k) de vos tissus et les transforme en sens inverse pour produire l'image vue chez le médecin.",
      },
      {
        domain: "Wi-Fi, 5G, ADSL",
        description:
          "Les transmissions sans fil et filaires modernes utilisent l'OFDM, qui répartit les données sur des milliers de porteuses sinusoïdales soigneusement espacées — de l'ingénierie de Fourier pure.",
      },
      {
        domain: "Parole et ML",
        description:
          "Les caractéristiques mel-spectrogrammes (audio transformé par Fourier) constituent l'entrée de presque tous les modèles de reconnaissance vocale et d'assistants vocaux.",
      },
    ],
    euler: [
      {
        domain: "Traitement du signal",
        description:
          "Tout manuel de DSP utilise e^{iωt} comme sinusoïde complexe canonique ; FFT, transformée en Z et conception de filtres vivent sur la formule d'Euler.",
      },
      {
        domain: "Mécanique quantique",
        description:
          "Les fonctions d'onde sont des exponentielles complexes ; les facteurs de phase e^{iθ} portent les motifs d'interférence qui rendent la mécanique quantique quantique.",
      },
      {
        domain: "Analyse des circuits en courant alternatif",
        description:
          "Les ingénieurs en électricité modélisent tensions et courants alternatifs comme des exponentielles complexes — l'arithmétique d'impédance via phaseurs est une application directe de la formule d'Euler.",
      },
      {
        domain: "Théorie du contrôle",
        description:
          "La stabilité des systèmes asservis se lit à la position des pôles dans le plan complexe — la formule d'Euler est le pont entre temps et fréquence.",
      },
    ],
    banach: [
      {
        domain: "Enseignement de la théorie des ensembles",
        description:
          "Banach–Tarski est l'exemple manuel de pourquoi l'axiome du choix prête à controverse — utilisé dans tout cours de master en analyse réelle.",
      },
      {
        domain: "Fondements des mathématiques",
        description:
          "Il a motivé au XXᵉ siècle les travaux sur des fondements ensemblistes alternatifs (constructivisme, intuitionnisme) et influencé les preuves vérifiées par ordinateur.",
      },
      {
        domain: "Philosophie des mathématiques",
        description:
          "Fréquemment invoqué dans les discussions sur le réalisme mathématique, le sens de l'«infini» et les limites de l'intuition.",
      },
    ],
    lsystem: [
      {
        domain: "Plantes procédurales au cinéma et dans les jeux",
        description:
          "Arbres, fougères et herbes dans des titres comme Le Roi Lion (1994), Avatar (2009) et d'innombrables jeux modernes sont générés à partir de L-systèmes via SpeedTree et des middlewares similaires.",
      },
      {
        domain: "Architecture et CAO",
        description:
          "Les outils d'architecture générative (Grasshopper pour Rhino) utilisent les L-systèmes pour faire croître des structures ramifiées, des façades et des réseaux de rues.",
      },
      {
        domain: "Recherche en biologie végétale",
        description:
          "Les biologistes ajustent des L-systèmes à des espèces réelles (par exemple la topologie du pommier) pour étudier dynamique de croissance, compétition pour la lumière et optimisation du rendement.",
      },
      {
        domain: "Composition musicale",
        description:
          "Les compositeurs et compositrices mappent les chaînes de L-systèmes sur des événements MIDI pour faire pousser algorithmiquement des thèmes qui développent une autosimilarité fractale dans le temps.",
      },
    ],
    wang: [
      {
        domain: "Graphisme temps réel",
        description:
          "Les jeux de tuiles de Wang servent à empaqueter des textures non répétitives (herbe, brique, sable) dans de minuscules atlas — important sur les appareils à mémoire limitée comme les GPU mobiles.",
      },
      {
        domain: "Conception procédurale de niveaux",
        description:
          "Les moteurs de jeu (Houdini, moteurs roguelike maison) utilisent les tuiles de Wang pour assembler de grandes cartes de donjons ou de mondes à partir de petites briques modulaires, sans coutures visibles.",
      },
      {
        domain: "Matériaux et quasi-cristaux",
        description:
          "La théorie des tuiles de Wang recoupe en partie les mathématiques des quasi-cristaux — toutes deux produisent des arrangements infinis apériodiques.",
      },
    ],
    collatz: [
      {
        domain: "Problème ouvert de mathématiques pures",
        description:
          "Listé parmi les problèmes ouverts les plus célèbres de la théorie élémentaire des nombres ; vérifié par ordinateur jusqu'à 2,95×10²⁰ en 2024.",
      },
      {
        domain: "Calcul distribué",
        description:
          "Le projet BOINC / collatzconjecture.org externalise la recherche d'un contre-exemple en utilisant du temps GPU bénévole.",
      },
      {
        domain: "Pédagogie",
        description:
          "Utilisé dans les démonstrations de «tours de nombres» au collège et dans les projets de recherche de licence sur les suites entières.",
      },
    ],
    doublependulum: [
      {
        domain: "Robotique",
        description:
          "Les bras robotisés à deux maillons sont mathématiquement des doubles pendules ; comprendre leur couplage non linéaire est essentiel pour le contrôle stable des manipulateurs industriels.",
      },
      {
        domain: "Biomécanique",
        description:
          "Les membres humains lors de la marche, du lancer et des mouvements gymniques sont modélisés comme des systèmes multi-pendules pour la recherche en rééducation et en prothèses.",
      },
      {
        domain: "Musées de sciences",
        description:
          "Les expositions de doubles pendules dans les musées (par exemple Exploratorium, Deutsches Museum) démontrent physiquement l'effet papillon au public.",
      },
      {
        domain: "Acrobatie et gréage",
        description:
          "Le Cirque du Soleil et les gréeurs de spectacle doivent comprendre la dynamique pendule-de-pendule pour des chorégraphies sûres au trapèze et aux tissus aériens.",
      },
    ],
    bzr: [
      {
        domain: "Arythmies cardiaques",
        description:
          "Des motifs d'ondes spirales très semblables aux spirales BZR sont observés à la surface du cœur lors de la fibrillation — centraux pour la conception et la recherche sur les défibrillateurs.",
      },
      {
        domain: "Neurosciences",
        description:
          "La dépression corticale envahissante (une onde de dépolarisation neuronale liée aux migraines) est modélisée comme un milieu excitable façon BZR.",
      },
      {
        domain: "Enseignement de la chimie",
        description:
          "BZR est la plus spectaculaire démo de «chimie vivante» qu'un enseignant de lycée puisse montrer — oscillation visible dans un ballon.",
      },
      {
        domain: "Théorie primée par le Nobel",
        description:
          "Ilya Prigogine a reçu le prix Nobel 1977 pour la théorie des structures dissipatives, fondée sur des systèmes comme BZR.",
      },
    ],
    turingpattern: [
      {
        domain: "Biologie du développement",
        description:
          "Les rayures du poisson-zèbre, l'espacement des follicules pileux chez la souris, la formation des empreintes digitales et le patterning des doigts chez les embryons de vertébrés suivent, d'après les mesures, des dynamiques de Turing.",
      },
      {
        domain: "Phyllotaxie",
        description:
          "Les spirales de graines de tournesol, les écailles de pomme de pin et les écailles d'ananas émergent de réaction-diffusion plus angle d'or — chimie de Turing sur surface en croissance.",
      },
      {
        domain: "Art génératif et graphisme",
        description:
          "Les motifs de réaction-diffusion sont largement utilisés comme bruit procédural de texture (peau, écorce, corail) dans des outils 3D comme Substance Designer et Houdini.",
      },
      {
        domain: "Libération de médicaments et matériaux",
        description:
          "Des microstructures auto-organisées dans les membranes polymères et les revêtements à libération de médicaments sont conçues à partir d'instabilités de type Turing.",
      },
    ],
    sierpinski: [
      {
        domain: "Antennes fractales",
        description:
          "Les antennes en triangle de Sierpiński sont des produits commerciaux — téléphones, routeurs Wi-Fi et récepteurs GPS utilisent des patchs fractals multibandes qui résonnent à de nombreuses fréquences dans un faible encombrement.",
      },
      {
        domain: "Échangeurs de chaleur",
        description:
          "Des canaux ramifiés façon Sierpiński apparaissent dans des plaques de refroidissement imprimées pour LED de puissance et refroidissement de puces, maximisant la surface d'échange.",
      },
      {
        domain: "Compression et graphisme",
        description:
          "Les systèmes de fonctions itérées (IFS façon Sierpiński) fondent les algorithmes de compression fractale d'images — encore utilisés dans des encodeurs de niche pour l'imagerie aérienne.",
      },
      {
        domain: "Réseaux",
        description:
          "Le routage IP hiérarchique et les topologies en arbre héritent de propriétés de mise à l'échelle fractale façon Sierpiński pour la répartition de charge.",
      },
    ],
    chaosgame: [
      {
        domain: "Bio-informatique",
        description:
          "La Chaos Game Representation (CGR) est un mode standard de visualisation des séquences d'ADN — chaque nucléotide pousse un point vers l'un des quatre coins d'un carré ; les espèces se regroupent en signatures fractales reconnaissables.",
      },
      {
        domain: "Compression fractale",
        description:
          "La compression fractale d'images de Barnsley encode les images en un petit ensemble d'applications contractantes que l'on récupère via le jeu du chaos.",
      },
      {
        domain: "Texturage procédural",
        description:
          "Les sorties du jeu du chaos (variantes de la fougère de Barnsley) sont largement employées pour le feuillage procédural et les coups de pinceau stylisés.",
      },
    ],
    penrose: [
      {
        domain: "Quasi-cristaux",
        description:
          "La découverte par Dan Shechtman en 1982 des quasi-cristaux métalliques (Nobel 2011) a été comprise grâce aux pavages de Penrose — la même mathématique de symétrie d'ordre cinq gouverne les deux.",
      },
      {
        domain: "Architecture",
        description:
          "La façade de la Storey Hall à Melbourne et plusieurs motifs mathématico-islamiques du palais de Topkapı utilisent une géométrie apériodique façon Penrose.",
      },
      {
        domain: "Science des matériaux",
        description:
          "Des revêtements quasi-cristallins (par exemple sur les poêles antiadhésives Sjöbo) sont commercialisés aujourd'hui, exploitant des arrangements atomiques façon pavage de Penrose.",
      },
      {
        domain: "Cryptographie",
        description:
          "Des générateurs pseudo-aléatoires récemment proposés utilisent des séquences de pavages apériodiques pour un échantillonnage à faible discrépance.",
      },
    ],
    apollonian: [
      {
        domain: "Empilement granulaire",
        description:
          "La manière dont sable, graviers et poudres pharmaceutiques remplissent les contenants se modélise par des empilements de sphères apolloniens — important pour le béton, les comprimés et la métallurgie des poudres.",
      },
      {
        domain: "Théorie des nombres",
        description:
          "Les empilements apolloniens entiers sont étudiés par les théoriciens analytiques des nombres — des travaux de Sarnak, Bourgain et Kontorovich ont fourni de nouveaux résultats sur les courbures premières.",
      },
      {
        domain: "Physique des mousses et des émulsions",
        description:
          "Les structures de mousse (mousse de bière, émulsions alimentaires, alvéoles pulmonaires) héritent, à leur formation, des contraintes d'empilement façon Apollonius.",
      },
      {
        domain: "Design graphique",
        description:
          "Logos, affiches et tatouages utilisent les filets d'Apollonius pour une géométrie radiale frappante.",
      },
    ],
    phi: [
      {
        domain: "Phyllotaxie végétale",
        description:
          "Les spirales de graines de tournesol, les écailles de pommes de pin et les arrangements foliaires de la plupart des plantes convergent vers l'angle d'or — vérifié sur des milliers d'espèces.",
      },
      {
        domain: "Fractions continues",
        description:
          "φ possède le développement en fraction continue le plus simple [1;1,1,…], ce qui en fait le nombre «le plus irrationnel» — concept clé de la théorie KAM en mécanique classique.",
      },
      {
        domain: "Quasi-cristaux et Penrose",
        description:
          "Les rapports de longueurs dans les pavages de Penrose (et le facteur d'inflation) valent exactement φ ; le même rapport apparaît dans des quasi-cristaux réels découverts dans la nature en 2009.",
      },
      {
        domain: "Théorie des nombres",
        description:
          "Les nombres de Fibonacci fondent le théorème de Zeckendorf et des représentations entières efficaces utilisées dans certains algorithmes de compression et structures de données.",
      },
      {
        domain: "Scepticisme honnête",
        description:
          "Les affirmations selon lesquelles φ apparaîtrait dans le Parthénon, La Joconde, la coquille de nautile ou les proportions humaines sont en grande partie des mythes — démystifiés notamment par George Markowsky (1992).",
      },
    ],
    buffon: [
      {
        domain: "Intégration de Monte-Carlo",
        description:
          "L'aiguille de Buffon est la graine historique des méthodes de Monte-Carlo — aujourd'hui utilisées partout, de la valorisation financière (Black–Scholes) à la simulation de physique des particules (Geant4) et au rendu (path tracing).",
      },
      {
        domain: "Simulation physique",
        description:
          "L'échantillonnage aléatoire d'intégrales en grande dimension en QCD sur réseau, ingénierie nucléaire et conception de réacteurs étend la logique de Buffon à des millions de dimensions.",
      },
      {
        domain: "Infographie",
        description:
          "L'échantillonnage stratifié des rayons lumineux dans les path tracers modernes (Pixar, Cycles, Unreal Lumen) descend en ligne directe de l'aiguille de Buffon.",
      },
      {
        domain: "Enseignement des statistiques",
        description:
          "Démonstration introductive standard de probabilités ; encore réalisée dans les TP de statistique de licence partout dans le monde.",
      },
    ],
    hilberthotel: [
      {
        domain: "Théorie des ensembles et enseignement",
        description:
          "Analogie canonique pour comprendre l'arithmétique cardinale et la différence entre infinis dénombrables et non dénombrables.",
      },
      {
        domain: "Programmation avec structures infinies",
        description:
          "Les listes paresseuses infinies en Haskell, les générateurs en Python et les streams en Scala font écho aux remaniements façon hôtel de Hilbert de l'infini dénombrable.",
      },
      {
        domain: "Vulgarisation scientifique",
        description:
          "Vidéo TED-Ed, Vsauce, PBS Infinite Series — l'explication moderne de l'infini la plus partagée.",
      },
    ],
    gabrielshorn: [
      {
        domain: "Enseignement du calcul",
        description:
          "Exemple standard de début de calcul intégral d'une intégrale impropre contre-intuitive, présent dans tout manuel de deuxième année.",
      },
      {
        domain: "Philosophie des mathématiques",
        description:
          "Cité dans les débats sur le sens des paradoxes géométriques et les limites de l'intuition physique — expérience de pensée fondatrice.",
      },
      {
        domain: "Microfluidique",
        description:
          "Des analogues réels avec écoulement capillaire dans des canaux toujours plus étroits (dispositifs microfluidiques) rencontrent les cas limites que la corne de Gabriel formalise.",
      },
    ],
    cantor: [
      {
        domain: "Théorie de la calculabilité",
        description:
          "La diagonale de Cantor produit directement la preuve du problème de l'arrêt de Turing et les théorèmes d'incomplétude de Gödel — pierres angulaires de l'informatique théorique.",
      },
      {
        domain: "Théorie des langages de programmation",
        description:
          "Utilisée pour prouver qu'il n'existe aucun système de types «universel» qui décide le typage pour tous les programmes (théorème de Rice).",
      },
      {
        domain: "Cryptographie et complexité",
        description:
          "Les arguments de diagonalisation sous-tendent les résultats modernes de théorie de la complexité — séparations entre P, NP, EXP.",
      },
      {
        domain: "Philosophie des mathématiques",
        description:
          "L'argument de Cantor a renversé les visions aristotéliciennes et kantiennes de l'infini, façonnant la logique et la philosophie analytique du XXᵉ siècle.",
      },
    ],
    boids: [
      {
        domain: "Effets visuels au cinéma",
        description:
          "Batman, le défi (essaim de chauves-souris de 1992), Le Roi Lion (ruée de gnous de 1994) et d'innombrables films modernes utilisent les Boids — généralement via Massive ou Houdini.",
      },
      {
        domain: "Essaims de drones",
        description:
          "Les spectacles de drones records d'Intel (JO de PyeongChang 2018, JO de Paris 2024) utilisent des règles dérivées des Boids à très grande échelle.",
      },
      {
        domain: "Simulation de foules",
        description:
          "Les agences d'architecture simulent l'évacuation de stades et les flux en centres commerciaux avec des agents façon Boids — employés en planification de stades depuis les années 2000.",
      },
      {
        domain: "Essaims de robots",
        description:
          "Les laboratoires de recherche emploient des règles façon Boids pour des essaims robotiques autonomes en recherche et sauvetage et en surveillance agricole.",
      },
      {
        domain: "Vraie nature",
        description:
          "Les études empiriques sur les murmurations d'étourneaux (Cavagna et al., 2010), les bancs de poissons et les troupeaux confirment des règles très proches des Boids d'origine.",
      },
    ],
    aizawa: [
      {
        domain: "Recherche en systèmes dynamiques",
        description:
          "Aizawa fait partie d'une famille d'attracteurs étranges 3D utilisés pour tester intégrateurs numériques, algorithmes de visualisation et méthodes de détection du chaos.",
      },
      {
        domain: "Art mathématique",
        description:
          "Les artistes génératifs rendent les attracteurs d'Aizawa, Thomas et Halvorsen sous forme de tracés, de tirages et d'animations vendus sur Etsy et dans les foires d'art.",
      },
      {
        domain: "Enseignement",
        description:
          "De plus en plus utilisé aux côtés de Lorenz dans les cours de master de systèmes dynamiques pour montrer un éventail plus large de formes chaotiques.",
      },
    ],
    dla: [
      {
        domain: "Électrochimie",
        description:
          "Les dépôts de zinc, de cuivre et d'autres métaux obtenus en cellule électrolytique forment des dendrites de type DLA — directement pertinents pour la galvanoplastie, la conception de batteries (dendrites de lithium) et la corrosion.",
      },
      {
        domain: "Croissance cristalline",
        description:
          "La formation des flocons de neige, le givre sur les fenêtres, les dendrites minérales dans la roche — tous présentent des lois d'échelle DLA.",
      },
      {
        domain: "Biologie",
        description:
          "Les fronts de colonies bactériennes sur boîtes de Petri, les cônes de croissance neuronaux et la frontière de certaines tumeurs suivent des règles façon DLA.",
      },
      {
        domain: "Physique de la foudre",
        description:
          "La ramification des éclairs et les motifs de claquage diélectrique sont bien modélisés par la DLA.",
      },
    ],
    langton: [
      {
        domain: "Vie artificielle",
        description:
          "La fourmi de Langton est un exemple fondateur du champ de la vie artificielle qu'il a contribué à fonder au Santa Fe Institute.",
      },
      {
        domain: "Informatique théorique",
        description:
          "Utilisée comme exemple minimal de calcul universel pour les machines de Turing 2D ; encore citée dans des articles fondateurs de complexité.",
      },
      {
        domain: "Enseignement",
        description:
          "Exemple introductif favori des cours sur les automates cellulaires — la phase «autoroute» est l'un des phénomènes émergents les plus accessibles de l'informatique.",
      },
    ],
    pascalmod: [
      {
        domain: "Théorie des nombres",
        description:
          "Le théorème de Lucas (1878) anime directement des algorithmes efficaces pour les coefficients binomiaux modulo un nombre premier — utilisés en cryptographie, combinatoire des mots et programmation compétitive.",
      },
      {
        domain: "Théorie des codes",
        description:
          "Les codes correcteurs de Reed–Muller et BCH s'appuient sur la machinerie des coefficients binomiaux modulo p — ils sont dans les codes QR, les sondes spatiales lointaines (Mariner 9, Voyager) et la TNT DVB-T.",
      },
      {
        domain: "Arts visuels",
        description:
          "Pascal mod 2 est l'origine algébrique du triangle de Sierpiński — vendu en poster, tissé dans des tapis, utilisé dans des installations de galerie.",
      },
    ],
    sternbrocot: [
      {
        domain: "Musique par ordinateur et accord",
        description:
          "Les compositeurs de musique microtonale utilisent Stern–Brocot pour trouver des approximations tempérées des rapports d'intonation juste — central pour la musique xénharmonique.",
      },
      {
        domain: "Conception d'engrenages en robotique",
        description:
          "La recherche des meilleures approximations rationnelles de rapports d'engrenages parcourt l'arbre de Stern–Brocot pour trouver des réductions mécaniques efficaces.",
      },
      {
        domain: "Calendriers",
        description:
          "Les règles d'année bissextile fondées sur des fractions continues (calendrier persan, corrections grégoriennes proposées) se déduisent des médiantes de Stern–Brocot.",
      },
      {
        domain: "Rendu d'image",
        description:
          "L'échantillonnage sous-pixel et la rastérisation moderne des polices utilisent des médiantes façon Stern–Brocot pour choisir les rapports de couverture de pixel.",
      },
    ],
    ulam: [
      {
        domain: "Théorie des nombres pure",
        description:
          "Visualiser les nombres premiers via les spirales façon Ulam continue d'inspirer de nouvelles conjectures sur les densités de premiers polynomiaux (Hardy–Littlewood, Sato–Tate).",
      },
      {
        domain: "Enseignement",
        description:
          "Présentation standard dans les musées de mathématiques et exploration introductive dans les cours de théorie des nombres.",
      },
      {
        domain: "Art génératif",
        description:
          "Des œuvres dérivées de la spirale d'Ulam apparaissent dans les expositions d'artistes (Roman Verostko, Tristan Perich).",
      },
    ],
    cardioid: [
      {
        domain: "Ingénierie audio",
        description:
          "Les microphones cardioïdes (utilisés par tout podcasteur et professionnel du broadcast) doivent leur nom au diagramme de captation cardioïde — sensibles à l'avant et sourds à l'arrière.",
      },
      {
        domain: "Conception d'antennes",
        description:
          "Certains diagrammes de directivité d'antennes sont cardioïdes ; courants en VHF marine et en équipement de radiogoniométrie.",
      },
      {
        domain: "Architecture et éclairage",
        description:
          "Des réflecteurs cardioïdes sont utilisés dans l'éclairage de théâtre classique (PAR cans) pour projeter des faisceaux asymétriques.",
      },
      {
        domain: "Lien avec Mandelbrot",
        description:
          "Le bulbe principal de l'ensemble de Mandelbrot est exactement une cardioïde ; comprendre cette forme éclaire le diagramme de bifurcation de Mandelbrot.",
      },
    ],
    galton: [
      {
        domain: "Enseignement des statistiques",
        description:
          "La planche de Galton est la démonstration canonique du théorème central limite — présente dans presque tous les musées de sciences (Deutsches Museum, Boston Museum of Science, MOSS Toronto).",
      },
      {
        domain: "Quinconce en génétique",
        description:
          "Galton a construit la planche d'origine pour rendre visibles les statistiques héréditaires au public victorien ; elle a posé les bases de la biométrie et de la génétique statistique.",
      },
      {
        domain: "Plinko et conception de jeu",
        description:
          "Les planches de Galton ont inspiré le jeu télévisé Plinko et les jeux mobiles modernes de pachinko et de machines à sous, physiques comme numériques.",
      },
      {
        domain: "Analyse de tolérances en fabrication",
        description:
          "Les calculs statistiques de cumul de tolérances en mécanique invoquent directement la logique du théorème central limite que la planche de Galton visualise.",
      },
    ],
    magpendulum: [
      {
        domain: "Démonstrations de chaos",
        description:
          "Le jouet de bureau «pendule à trois aimants» est la démonstration physique la plus populaire des bassins d'attraction fractals — vendu par ThinkGeek, Nikola Labs et de nombreuses boutiques de cadeaux scientifiques.",
      },
      {
        domain: "Recherche en lévitation magnétique",
        description:
          "La dynamique des pendules à aimants permanents sous-tend les trains maglev, les paliers magnétiques et les amortisseurs magnétorhéologiques.",
      },
      {
        domain: "Enseignement",
        description:
          "Démonstration standard de dynamique non linéaire en licence de physique ; sert à enseigner l'espace des phases, la dissipation et la sensibilité à l'état final.",
      },
    ],
    godel: [
      {
        domain: "Fondements des mathématiques",
        description:
          "Gödel a mis fin au programme hilbertien de mécanisation des mathématiques ; il a refaçonné ce que les mathématiciens et mathématiciennes croient démontrable en principe.",
      },
      {
        domain: "Informatique",
        description:
          "L'indéfinissabilité de la vérité de Tarski, le problème de l'arrêt de Turing et le théorème de Rice en sont des descendants directs — présents dans tout cours de licence de logique et calculabilité.",
      },
      {
        domain: "Philosophie de l'esprit",
        description:
          "L'argument de Penrose selon lequel l'esprit humain n'est pas purement algorithmique (L'esprit, l'ordinateur et les lois de la physique, 1989) s'appuie fortement sur Gödel — controversé mais influent.",
      },
      {
        domain: "Logiciel vérifié",
        description:
          "Les assistants de preuve modernes (Coq, Lean, Isabelle) se heurtent quotidiennement aux limites de Gödel ; toute leur utilité tient à formaliser ce qui est démontrable dans un système explicite.",
      },
    ],
    halting: [
      {
        domain: "Compilateurs et analyse statique",
        description:
          "Les analyseurs statiques modernes (Coverity, Infer, le borrow checker de Rust) doivent renoncer à une précision parfaite parce que les propriétés non triviales de programmes sont indécidables — conséquence directe du problème de l'arrêt (théorème de Rice).",
      },
      {
        domain: "Antivirus",
        description:
          "Pourquoi aucun antivirus n'attrape tous les logiciels malveillants : détecter parfaitement les programmes hostiles reviendrait à résoudre une variante du problème de l'arrêt.",
      },
      {
        domain: "Nuages de calcul",
        description:
          "Les autoscalers cloud ne peuvent jamais garantir que «cette tâche utilisateur se terminera» — ils imposent des délais parce que décider de l'arrêt est impossible.",
      },
      {
        domain: "Enseignement",
        description:
          "Introduction canonique à l'indécidabilité dans tous les cours de théorie de la calculabilité du monde.",
      },
    ],
    pvsnp: [
      {
        domain: "Cryptographie",
        description:
          "Si P = NP, RSA, AES, toute la blockchain et le trafic protégé par TLS seraient cassés du jour au lendemain — tout secret numérique moderne dépend du fait que P ≠ NP en pratique.",
      },
      {
        domain: "Optimisation",
        description:
          "Logistique (routage UPS), conception de puces (placement-routage) et recherche d'hyperparamètres en apprentissage automatique attaquent des problèmes NP-difficiles par heuristique parce que les solutions exactes sont hors de portée.",
      },
      {
        domain: "IA et solveurs SAT",
        description:
          "Les solveurs SAT/SMT modernes (Z3, MiniSat) résolvent couramment des instances NP-difficiles à des millions de variables grâce à des heuristiques astucieuses, alors même que la complexité au pire cas est exponentielle.",
      },
      {
        domain: "Bio-informatique",
        description:
          "Le repliement des protéines, l'assemblage de génomes et la reconstruction d'arbres phylogénétiques sont tous NP-difficiles — ce qui pousse le domaine à inventer des algorithmes d'approximation et des méthodes d'IA (AlphaFold).",
      },
      {
        domain: "Prix ouvert",
        description:
          "L'un des sept problèmes du millénaire de Clay, doté d'un prix d'un million de dollars pour une preuve ou une réfutation.",
      },
    ],
    rsa: [
      {
        domain: "TLS / HTTPS",
        description:
          "Chaque cadenas dans votre navigateur fait intervenir, lors du handshake initial, RSA ou son cousin sur courbes elliptiques (ECDSA) — des milliards de fois par seconde.",
      },
      {
        domain: "Signatures numériques",
        description:
          "L'App Store d'Apple, Google Play et Microsoft Update signent chaque version avec de la cryptographie à clé publique façon RSA ; en cas de falsification, les logiciels malveillants se répandraient librement.",
      },
      {
        domain: "Banque et blockchain",
        description:
          "Les messages SWIFT, les transactions par carte à puce et la plupart des portefeuilles blockchain reposent sur des hypothèses de dureté de la factorisation ou du logarithme discret équivalentes à RSA.",
      },
      {
        domain: "Documents d'identité",
        description:
          "Les passeports modernes (ICAO 9303) contiennent des données biométriques signées par RSA ; les postes-frontières vérifient la signature face aux CA nationales.",
      },
      {
        domain: "Panique post-quantique",
        description:
          "L'algorithme de Shor casse RSA sur un ordinateur quantique suffisamment grand ; le NIST est en train de standardiser des successeurs post-quantiques (Kyber, Dilithium).",
      },
    ],
    mobius: [
      {
        domain: "Bandes transporteuses industrielles",
        description:
          "Les courroies d'entraînement en bande de Möbius s'usent uniformément sur les deux «côtés» (il n'y en a qu'un !) — utilisées dans les vieilles presses d'imprimerie, les bandes modernes d'enregistrement et certains systèmes VHS.",
      },
      {
        domain: "Génie mécanique",
        description:
          "Des engrenages de Möbius et des résistances en forme de Möbius ont été brevetés pour réduire de moitié respectivement l'usure et l'inductance.",
      },
      {
        domain: "Recherche en topologie",
        description:
          "La bande de Möbius est la surface non orientable la plus simple — porte d'entrée vers un vaste domaine qui classifie toutes les surfaces, utilisé en cosmologie et en théorie des cordes.",
      },
      {
        domain: "Art et architecture",
        description:
          "Le Ruban sans fin de Max Bill, le triangle du symbole de recyclage et des architectes du Mexique à Astana utilisent la topologie de Möbius pour des installations frappantes.",
      },
      {
        domain: "Chimie",
        description:
          "Les molécules aromatiques de Möbius (Heilbronner 1964 ; première synthèse en 2003) portent une demi-torsion des électrons π ; elles affichent des propriétés électroniques qu'aucun cycle plan ne peut avoir.",
      },
    ],
    eulerchar: [
      {
        domain: "Infographie",
        description:
          "La validation de maillages (Blender, Maya) vérifie V−A+F face au χ attendu pour détecter trous ou géométrie dupliquée avant impression 3D.",
      },
      {
        domain: "Topologie des données",
        description:
          "Les pipelines d'homologie persistante utilisent des caractéristiques d'Euler pour résumer la forme de nuages de points en grande dimension — appliqué en génomique, réseaux de capteurs et cosmologie.",
      },
      {
        domain: "Architecture",
        description:
          "Les dômes géodésiques de Buckminster Fuller (Spaceship Earth d'Epcot, Biosphère de Montréal) sont conçus pour que V−A+F=2 force exactement 12 pentagones parmi les hexagones.",
      },
      {
        domain: "Conception du ballon de football",
        description:
          "Le ballon classique en icosaèdre tronqué porte 12 pentagones et 20 hexagones ; la formule d'Euler explique pourquoi il y en a exactement 12, pas un de moins.",
      },
      {
        domain: "Physique des particules",
        description:
          "Le théorème d'indice d'Atiyah-Singer, fondamental pour la théorie de jauge moderne, généralise la formule d'Euler et relie topologie et équations différentielles.",
      },
    ],
    konigsberg: [
      {
        domain: "Naissance de la théorie des graphes",
        description:
          "Königsberg a lancé tout le champ — la théorie des graphes sous-tend aujourd'hui le PageRank de Google, l'analyse des réseaux sociaux, le placement de puces et la planification d'itinéraires.",
      },
      {
        domain: "Séquençage de l'ADN",
        description:
          "Les algorithmes de chemin eulérien inspirés de Königsberg sont les chevaux de trait de l'assemblage moderne de génomes (Pevzner et Tang, 2001 ; utilisés dans SPAdes, Velvet, megahit).",
      },
      {
        domain: "Optimisation d'itinéraires",
        description:
          "Postiers, bennes à ordures et chasse-neige résolvent le problème du postier chinois — descendant direct des ponts de Königsberg.",
      },
      {
        domain: "Tourisme",
        description:
          "Kaliningrad (la Königsberg moderne) capitalise sur les ponts ; les touristes tentent la promenade même si seuls cinq des sept ponts d'origine ont survécu à la Seconde Guerre mondiale.",
      },
    ],
    fourcolor: [
      {
        domain: "Conception cartographique",
        description:
          "Les cartographes et ingénieurs SIG utilisent réellement des algorithmes de coloration à quatre couleurs pour les cartes politiques, les atlas par pays et la visualisation météo.",
      },
      {
        domain: "Réseaux mobiles",
        description:
          "L'allocation de fréquences entre antennes-relais se ramène à une coloration de graphes — le théorème des quatre couleurs est le cas limite pour certains agencements planaires.",
      },
      {
        domain: "Ordonnancement",
        description:
          "Les calendriers d'examens universitaires, l'attribution de salles de conférence et les calendriers sportifs sont tous des problèmes de coloration de graphes ; les variantes planaires héritent de la borne des quatre couleurs.",
      },
      {
        domain: "Mathématiques vérifiées par ordinateur",
        description:
          "Avec la conjecture de Kepler, le théorème des quatre couleurs a été un jalon de la preuve assistée par ordinateur — la culture des assistants de preuve (Coq, Lean) en tire sa légitimité.",
      },
    ],
    smallworld: [
      {
        domain: "Réseaux sociaux",
        description:
          "La fonctionnalité «contacts du 2ᵉ degré» de LinkedIn, les cascades de retweets de Twitter et le «vous connaissez peut-être» de Facebook exploitent la structure en petit monde pour la pertinence.",
      },
      {
        domain: "Modèles épidémiques",
        description:
          "La modélisation de la propagation du COVID-19, les applications de traçage de contacts et les stratégies vaccinales utilisent des modèles de réseaux en petit monde pour prédire la dynamique des flambées.",
      },
      {
        domain: "Recherche cérébrale",
        description:
          "Les études d'IRMf montrent que le connectome humain est un réseau en petit monde — le coefficient de petit monde est désormais un biomarqueur standard dans la recherche sur la maladie d'Alzheimer et la schizophrénie.",
      },
      {
        domain: "Routage Internet",
        description:
          "Le graphe des systèmes autonomes d'Internet présente des propriétés de petit monde ; BGP et les CDN modernes (Cloudflare, Fastly) exploitent les courtes distances en sauts.",
      },
      {
        domain: "Six Degrees of Kevin Bacon",
        description:
          "Le jeu cinéphile de 1994 et le site du Bacon Number sont des artefacts pop de la théorie du petit monde ; les mathématiciens et mathématiciennes se disputent les faibles numéros d'Erdős.",
      },
    ],
    diffusion: [
      {
        domain: "Génération d'images",
        description:
          "Stable Diffusion, Midjourney, DALL·E 3 et Imagen sont tous des modèles de diffusion latente. Tape un prompt et le modèle ramène du bruit gaussien vers une image cohérente avec le texte.",
      },
      {
        domain: "Génération vidéo",
        description:
          "Sora, Veo et Runway étendent la même mathématique de diffusion à trois dimensions (hauteur × largeur × temps), si bien que le débruiteur apprend la cohérence spatio-temporelle en plus de l'apparence.",
      },
      {
        domain: "Conception de médicaments et de protéines",
        description:
          "RFdiffusion (laboratoire Baker) et Chroma génèrent de nouveaux squelettes protéiques en débruitant des coordonnées 3D plutôt que des pixels — des candidats publiés ont été synthétisés et se replient correctement.",
      },
      {
        domain: "Audio et voix",
        description:
          "AudioLDM, Riffusion et la lignée de synthèse vocale ElevenLabs/Vall-E utilisent de la diffusion 1D sur des formes d'onde ou des spectrogrammes pour générer musique et voix naturelles à partir de texte.",
      },
      {
        domain: "Physique et thermodynamique",
        description:
          "Le processus direct est littéralement de la dynamique de Langevin — le calendrier de bruit reflète un système qui se relaxe vers l'équilibre thermique. L'article original de Sohl-Dickstein (2015) était formulé comme de la thermodynamique hors équilibre.",
      },
    ],
    quine: [
      {
        domain: "Théorie des langages de programmation",
        description:
          "Les quines sont le test de bon sens standard pour vérifier qu'un langage est assez expressif pour l'autoréférence ; les cours de théorie de la calculabilité les utilisent pour enseigner le théorème de récursion de Kleene sous forme concrète.",
      },
      {
        domain: "Virus informatiques & autoréplicateurs",
        description:
          "Chaque virus, ver et moteur métamorphique classique est une variante de quine : du code qui se copie avant de faire quoi que ce soit d'autre. Les logiciels malveillants autoréplicants modernes sont étudiés comme de l'ingénierie de quines appliquée.",
      },
      {
        domain: "Génétique & biologie moléculaire",
        description:
          "La réplication de l'ADN est la quine de la biologie : une séquence dont la seule tâche est de se copier elle-même, machinerie de copie comprise. Hofstadter trace l'analogie de manière explicite dans Gödel, Escher, Bach.",
      },
      {
        domain: "Bootstrap de compilateurs",
        description:
          "Trusting Trust (Ken Thompson, 1984) a montré que le compilateur d'un compilateur peut être une quine qui insère une porte dérobée à chaque build — fondement de la sécurité de la chaîne d'approvisionnement et de la recherche sur les builds reproductibles.",
      },
      {
        domain: "Démoscène & art du code",
        description:
          "Les quines polyglottes — des programmes qui s'impriment eux-mêmes et sont valides dans plusieurs langages à la fois — sont un genre adoré de l'art du code ; l'IOCCC a une catégorie dédiée aux quines.",
      },
    ],
    riemann: [
      {
        domain: "Théorème des nombres premiers",
        description:
          "Le terme d'erreur dans le comptage des premiers inférieurs à N est contrôlé par les zéros de ζ ; l'hypothèse de Riemann équivaut à la borne la plus fine possible sur l'irrégularité de la distribution des premiers.",
      },
      {
        domain: "Cryptographie",
        description:
          "RSA, la cryptographie sur courbes elliptiques et la dureté de la factorisation reposent sur des hypothèses concernant la distribution des premiers ; des énoncés RH-équivalents nourrissent les meilleures bornes connues sur la sécurité cryptographique.",
      },
      {
        domain: "Chaos quantique",
        description:
          "La statistique des écarts entre zéros de zêta coïncide avec la statistique des valeurs propres de matrices hermitiennes aléatoires — les mêmes qui modélisent les niveaux d'énergie des noyaux lourds. La conjecture de Montgomery-Dyson (1972) est l'un des ponts les plus surprenants de la mathématique.",
      },
      {
        domain: "Vérifications numériques par ordinateur",
        description:
          "Les 10^13 premiers zéros non triviaux ont été calculés sur la droite critique (Xavier Gourdon, 2004 et successeurs). Aucune campagne de vérification n'a jamais trouvé de contre-exemple à RH.",
      },
      {
        domain: "Vulgarisation et prestige des problèmes ouverts",
        description:
          "Riemann est le problème ouvert le plus célèbre en dehors de Fermat — un prix du millénaire de Clay (1 M$), des apparitions récurrentes dans la fiction (Un homme d'exception, La musique des nombres premiers) et un flot continu de « preuves » qui ne survivent pas à la relecture par les pairs.",
      },
    ],
    backprop: [
      {
        domain: "Apprentissage profond",
        description:
          "Tout réseau de neurones moderne — classifieur d'images, modèle de langage, recommandeur — est entraîné par rétropropagation. PyTorch et JAX l'implémentent comme cœur de différentiation (autograd).",
      },
      {
        domain: "Vision par ordinateur",
        description:
          "Les réseaux convolutionnels pour l'imagerie médicale, la conduite autonome et l'identification biométrique apprennent leurs noyaux de filtres directement à partir de données étiquetées via backprop ; les gradients remontent à travers les convolutions et le pooling.",
      },
      {
        domain: "Modèles de langage",
        description:
          "GPT, Claude, Llama et chaque transformer s'entraînent en rétropropageant la perte d'entropie croisée à travers des milliers de milliards de paramètres. Le seul algorithme qui passe d'un neurone à mille milliards.",
      },
      {
        domain: "Robotique & contrôle",
        description:
          "Les méthodes de gradient de politique en apprentissage par renforcement utilisent backprop pour mettre à jour des contrôleurs neuronaux à partir des signaux de récompense ; les robots bipèdes et de manipulation dextre modernes en dépendent tous.",
      },
      {
        domain: "Problèmes inverses en science",
        description:
          "Les physiciens inversent des expériences en montant le modèle direct dans PyTorch/JAX puis en rétropropageant à travers — utilisé en conception de protéines (AlphaFold), rendu différentiable et conception expérimentale par gradient.",
      },
    ],
  },
  it: {
    eml: [
      {
        domain: "Regressione simbolica",
        description:
          "I sistemi di algebra computazionale che provano a riscoprire leggi fisiche dai dati usano talvolta alfabeti di operatori compatti come EML per restringere lo spazio di ricerca.",
      },
      {
        domain: "Informatica teorica",
        description:
          "EML è cugina di insiemi universali come NAND in logica e Iota nei combinatori — interessante per ciò che dice su quanto piccola possa essere una primitiva.",
      },
    ],
    mandelbrot: [
      {
        domain: "Arte generativa e motion graphics",
        description:
          "Registi e artisti digitali fanno zoom nell'insieme di Mandelbrot per produrre sfondi che vanno dai videoclip alle sequenze d'apertura delle keynote Apple.",
      },
      {
        domain: "Antenne frattali",
        description:
          "Bordi modellati alla Mandelbrot/Julia sono usati in alcune antenne multibanda compatte (per esempio nei primi moduli Bluetooth), perché la forma autosimile risuona su molte frequenze.",
      },
      {
        domain: "Didattica",
        description:
          "Esempio universitario standard per dinamica complessa, caos deterministico e confine fra ordine e caos.",
      },
      {
        domain: "Analoghi naturali",
        description:
          "Coste, creste montuose, fronde di felce e cimette di broccolo mostrano la stessa struttura di bordo autosimile — era esattamente il punto di Mandelbrot sulla geometria frattale.",
      },
    ],
    life: [
      {
        domain: "Didattica dell'informatica",
        description:
          "Ogni curriculum di informatica, dal MIT 6.001 ai club liceali, usa Life di Conway per insegnare emergenza, automi cellulari e Turing-completezza in un pomeriggio.",
      },
      {
        domain: "Arte generativa",
        description:
          "I designer usano Life e le sue varianti (HighLife, Day & Night…) per generare visual in continuo cambiamento per videoclip, installazioni e screensaver.",
      },
      {
        domain: "Modellare biologia discreta",
        description:
          "Demografia, dinamiche preda-predatore e diffusione epidemica vengono talvolta prototipate su griglie tipo Life prima di passare a modelli ad agenti più ricchi.",
      },
      {
        domain: "Smanettamento hardware",
        description:
          "I progetti FPGA e su microcontrollore renderizzano spesso Life su matrici LED come «hello world» dell'hardware cellulare parallelo.",
      },
    ],
    nand: [
      {
        domain: "Dentro ogni chip",
        description:
          "Dal silicio Apple della serie M ai microcontrollori industriali, ogni minuto vengono incise nel silicio miliardi di porte NAND. Molti ASIC digitali sono sintetizzati esclusivamente in NAND.",
      },
      {
        domain: "Memoria flash",
        description:
          "La memoria flash NAND (chiavette USB, SSD, smartphone) deve nome e architettura alle porte NAND disposte in array di transistor a gate flottante.",
      },
      {
        domain: "Corsi di hardware",
        description:
          "Il corso nand2tetris costruisce un computer completo partendo da un singolo chip NAND — usato in oltre 100 università.",
      },
      {
        domain: "Logica embedded",
        description:
          "Singoli circuiti integrati 74HC00 con quattro porte NAND discrete sono ancora oggi prodotti per glue logic semplice, traslatori di livello e oscillatori su PCB hobbistici.",
      },
    ],
    iota: [
      {
        domain: "Interpreti di combinatori",
        description:
          "I compilatori di linguaggi funzionali (per esempio Lazy K) traducono programmi in lambda-calcolo in espressioni di soli combinatori — in stile Iota — durante la generazione di codice.",
      },
      {
        domain: "Linguaggi esoterici",
        description:
          "Iota e il suo gemello Jot sono linguaggi di programmazione minimalisti, usati per studiare la più piccola sintassi Turing-completa possibile.",
      },
      {
        domain: "Didattica del lambda-calcolo",
        description:
          "Le università usano Iota per dimostrare che un singolo combinatore basta, separando così sintassi e potenza computazionale.",
      },
    ],
    rule110: [
      {
        domain: "Wolfram Physics Project",
        description:
          "Il programma di Stephen Wolfram, che cerca la regola fondante dell'universo, cita esplicitamente la Regola 110 come prova che regole minuscole possono essere universalmente computazionali.",
      },
      {
        domain: "Didattica del calcolo formale",
        description:
          "Citata in ogni introduzione moderna agli automi cellulari come il più semplice sistema universale noto — una macchina di Turing in formato tweet.",
      },
      {
        domain: "Rumore procedurale per texture",
        description:
          "Alcune librerie di shader usano la Regola 110 (e la 30) come fonte economica di rumore 1D complesso per grafica generativa stilizzata.",
      },
    ],
    logistic: [
      {
        domain: "Biologia delle popolazioni",
        description:
          "L'equazione logistica continua modella popolazioni strettamente limitate di batteri, lieviti e perfino alcuni mammiferi; la mappa discreta è insegnata in ogni corso di ecologia quantitativa.",
      },
      {
        domain: "Epidemiologia",
        description:
          "La crescita epidemica limitata (con capacità portante = pool dei suscettibili) segue curve logistiche — le curve cumulate dei casi di COVID-19 ne sono un esempio da manuale.",
      },
      {
        domain: "Apprendimento automatico",
        description:
          "I planner del learning rate nel deep learning finiscono talvolta nello stesso caos da raddoppiamento di periodo quando il rate è troppo grande; la mappa logistica ne dà l'intuizione.",
      },
      {
        domain: "Neuroscienze",
        description:
          "I modelli del tasso di scarica neuronale a correnti d'ingresso alte biforcano esattamente come la mappa logistica, prevedendo l'insorgere di scariche irregolari.",
      },
      {
        domain: "Clima e meteo",
        description:
          "Il raddoppiamento di periodo alla Feigenbaum è stato riprodotto sperimentalmente in celle di convezione, mostrando la stessa via universale verso la turbolenza.",
      },
    ],
    lorenz: [
      {
        domain: "Previsioni meteorologiche",
        description:
          "I servizi operativi di previsione usano metodi d'ensemble perché l'atmosfera condivide la sensibilità di Lorenz alle condizioni iniziali — la prevedibilità crolla dopo circa 14 giorni.",
      },
      {
        domain: "Modellistica climatica",
        description:
          "L'articolo di Lorenz del 1963 ha dato vita alla teoria moderna del caos e plasma il modo in cui leggiamo i limiti di prevedibilità delle simulazioni climatiche di lungo periodo.",
      },
      {
        domain: "Didattica",
        description:
          "Ogni corso universitario di sistemi dinamici visualizza l'attrattore di Lorenz come l'attrattore strano per antonomasia.",
      },
      {
        domain: "Comunicazione sicura",
        description:
          "Alcuni schemi di cifratura basati sul caos hanno usato la sincronizzazione alla Lorenz per mascherare segnali — nicchia, ma reale (Cuomo e Oppenheim, 1993).",
      },
    ],
    fourier: [
      {
        domain: "MP3, AAC, Opus",
        description:
          "Tutti i moderni codec audio con perdita trasformano brevi finestre di suono nel dominio della frequenza, scartano le componenti inudibili e trasformano all'indietro.",
      },
      {
        domain: "JPEG e HEIC",
        description:
          "Ogni blocco 8×8 pixel di un JPEG è memorizzato come coefficienti della trasformata discreta del coseno — per questo il ringing JPEG mostra pattern orizzontali e verticali.",
      },
      {
        domain: "Risonanza magnetica",
        description:
          "Una macchina di risonanza magnetica misura letteralmente coefficienti di Fourier (lo spazio k) dei tuoi tessuti e li trasforma all'indietro nell'immagine che vedi dal medico.",
      },
      {
        domain: "Wi-Fi, 5G, DSL",
        description:
          "Le moderne trasmissioni senza filo e via cavo usano OFDM, che dispone i dati su migliaia di portanti sinusoidali accuratamente spaziate — ingegneria di Fourier allo stato puro.",
      },
      {
        domain: "Parlato e ML",
        description:
          "Le feature mel-spettrogramma (audio trasformato secondo Fourier) sono l'input di quasi ogni modello di riconoscimento vocale e di assistente vocale.",
      },
    ],
    euler: [
      {
        domain: "Elaborazione dei segnali",
        description:
          "Ogni libro di DSP usa e^{iωt} come sinusoide complessa canonica; FFT, trasformata Z e progetto di filtri vivono sulla formula di Eulero.",
      },
      {
        domain: "Meccanica quantistica",
        description:
          "Le funzioni d'onda sono esponenziali complesse; i fattori di fase e^{iθ} portano i pattern di interferenza che rendono quantistica la meccanica quantistica.",
      },
      {
        domain: "Analisi dei circuiti in corrente alternata",
        description:
          "Le ingegnerie elettriche modellano tensioni e correnti alternate come esponenziali complesse — l'aritmetica delle impedenze tramite fasori è applicazione diretta della formula di Eulero.",
      },
      {
        domain: "Teoria del controllo",
        description:
          "La stabilità dei sistemi a controreazione si legge dalla posizione dei poli nel piano complesso — la formula di Eulero è il ponte fra tempo e frequenza.",
      },
    ],
    banach: [
      {
        domain: "Didattica della teoria degli insiemi",
        description:
          "Banach–Tarski è l'esempio da manuale del perché l'Assioma della Scelta sia controverso — presente in ogni corso di analisi reale di livello magistrale.",
      },
      {
        domain: "Fondamenti della matematica",
        description:
          "Ha motivato nel Novecento il lavoro su fondamenti insiemistici alternativi (costruttivismo, intuizionismo) e ha influenzato le dimostrazioni verificate al calcolatore.",
      },
      {
        domain: "Filosofia della matematica",
        description:
          "Spesso invocato nei dibattiti su realismo matematico, sul significato di «infinito» e sui limiti dell'intuizione.",
      },
    ],
    lsystem: [
      {
        domain: "Piante procedurali in giochi e film",
        description:
          "Alberi, felci ed erba in titoli come Il Re Leone (1994), Avatar (2009) e innumerevoli giochi moderni sono generati da L-system tramite SpeedTree e middleware simili.",
      },
      {
        domain: "Architettura e CAD",
        description:
          "Gli strumenti di architettura generativa (Grasshopper per Rhino) usano gli L-system per far crescere strutture ramificate, facciate e reti stradali.",
      },
      {
        domain: "Ricerca in biologia vegetale",
        description:
          "Chi studia biologia vegetale adatta gli L-system a specie reali (per esempio la topologia del melo) per analizzare dinamiche di crescita, competizione per la luce e ottimizzazione della resa.",
      },
      {
        domain: "Composizione musicale",
        description:
          "Chi compone mappa stringhe di L-system su eventi MIDI per far crescere algoritmicamente temi che sviluppano autosimilarità frattale nel tempo.",
      },
    ],
    wang: [
      {
        domain: "Grafica in tempo reale",
        description:
          "I tileset di Wang permettono di impacchettare texture non ripetitive (erba, mattoni, sabbia) in atlanti molto piccoli — importante su dispositivi a memoria limitata come le GPU mobili.",
      },
      {
        domain: "Level design procedurale",
        description:
          "I motori di gioco (Houdini, motori roguelike su misura) usano le tessere di Wang per assemblare grandi mappe di dungeon e di mondo a partire da piccoli blocchi modulari, senza giunzioni visibili.",
      },
      {
        domain: "Materiali e quasicristalli",
        description:
          "La teoria delle tessere di Wang si sovrappone in parte alla matematica dei quasicristalli — entrambe producono disposizioni infinite aperiodiche.",
      },
    ],
    collatz: [
      {
        domain: "Problema aperto di matematica pura",
        description:
          "È annoverato fra i problemi aperti più celebri della teoria elementare dei numeri; verificato al calcolatore fino a 2,95×10²⁰ al 2024.",
      },
      {
        domain: "Calcolo distribuito",
        description:
          "Il progetto BOINC / collatzconjecture.org effettua in crowdsourcing la ricerca di un controesempio sfruttando tempo GPU di volontari.",
      },
      {
        domain: "Pedagogia",
        description:
          "Usato nelle dimostrazioni di «trucchi con i numeri» alle scuole medie e in progetti di ricerca della laurea triennale sulle successioni intere.",
      },
    ],
    doublependulum: [
      {
        domain: "Robotica",
        description:
          "I bracci robotici a due maglie sono matematicamente dei pendoli doppi; capire il loro accoppiamento non lineare è essenziale per il controllo stabile dei manipolatori industriali.",
      },
      {
        domain: "Biomeccanica",
        description:
          "Gli arti umani durante camminata, lancio e movimenti ginnici sono modellati come sistemi a pendolo multiplo per la ricerca su riabilitazione e protesi.",
      },
      {
        domain: "Musei della scienza",
        description:
          "Le esposizioni di pendolo doppio nei musei (per esempio Exploratorium, Deutsches Museum) mostrano fisicamente al pubblico l'effetto farfalla.",
      },
      {
        domain: "Acrobazia e rigging",
        description:
          "Il Cirque du Soleil e i rigger teatrali devono comprendere la dinamica pendolo-su-pendolo per coreografie sicure di trapezio e tessuti aerei.",
      },
    ],
    bzr: [
      {
        domain: "Aritmie cardiache",
        description:
          "Pattern di onde a spirale molto simili alle spirali BZR sono osservati sulla superficie del cuore durante la fibrillazione — centrali per la progettazione e la ricerca sui defibrillatori.",
      },
      {
        domain: "Neuroscienze",
        description:
          "La depressione corticale propagata (un'onda di depolarizzazione neurale legata all'emicrania) è modellata come un mezzo eccitabile in stile BZR.",
      },
      {
        domain: "Didattica della chimica",
        description:
          "BZR è la più suggestiva dimostrazione di «chimica viva» che un insegnante di chimica del liceo possa mostrare — oscillazione visibile in una beuta.",
      },
      {
        domain: "Teoria da Nobel",
        description:
          "Ilya Prigogine ha vinto il Nobel del 1977 per la teoria delle strutture dissipative, fondata su sistemi come BZR.",
      },
    ],
    turingpattern: [
      {
        domain: "Biologia dello sviluppo",
        description:
          "Strisce dei pesci zebra, spaziatura dei follicoli piliferi nei topi, formazione delle impronte digitali e pattern delle dita negli embrioni di vertebrati sono stati misurati seguire dinamiche di Turing.",
      },
      {
        domain: "Fillotassi vegetale",
        description:
          "Le disposizioni a spirale dei semi di girasole, delle squame delle pigne e degli ananas emergono da reazione-diffusione più angolo aureo — chimica di Turing su una superficie in crescita.",
      },
      {
        domain: "Arte generativa e grafica",
        description:
          "I pattern di reazione-diffusione sono molto usati come rumore procedurale per texture (pelle, corteccia, corallo) in strumenti 3D come Substance Designer e Houdini.",
      },
      {
        domain: "Rilascio di farmaci e materiali",
        description:
          "Microstrutture auto-organizzate in membrane polimeriche e rivestimenti a rilascio di farmaci sono progettate sfruttando instabilità di tipo Turing.",
      },
    ],
    sierpinski: [
      {
        domain: "Antenne frattali",
        description:
          "Le antenne con triangolo di Sierpiński sono prodotti commerciali — cellulari, router Wi-Fi e dispositivi GPS usano patch frattali multibanda che risuonano a molte frequenze su un'area ridotta.",
      },
      {
        domain: "Scambiatori di calore",
        description:
          "Canali ramificati in stile Sierpiński compaiono in piastre di raffreddamento stampate per LED ad alta potenza e per il raffreddamento dei chip, massimizzando la superficie.",
      },
      {
        domain: "Compressione e grafica",
        description:
          "I sistemi di funzioni iterate (IFS in stile Sierpiński) sono alla base degli algoritmi di compressione frattale delle immagini — ancora usati in codificatori di nicchia per immagini aeree.",
      },
      {
        domain: "Reti",
        description:
          "L'instradamento IP gerarchico e le topologie ad albero ereditano proprietà di scaling frattale alla Sierpiński utili al bilanciamento del carico.",
      },
    ],
    chaosgame: [
      {
        domain: "Bioinformatica",
        description:
          "La Chaos Game Representation (CGR) è un modo standard di visualizzare sequenze di DNA — ogni nucleotide spinge un punto verso uno dei quattro angoli di un quadrato; le specie si raggruppano in firme frattali riconoscibili.",
      },
      {
        domain: "Compressione frattale",
        description:
          "La compressione frattale delle immagini di Barnsley codifica le immagini come un piccolo insieme di mappe contrattive recuperate tramite il gioco del caos.",
      },
      {
        domain: "Texturizzazione procedurale",
        description:
          "Le uscite del gioco del caos (varianti della felce di Barnsley) sono ampiamente usate per fogliame procedurale e pennellate stilizzate.",
      },
    ],
    penrose: [
      {
        domain: "Quasicristalli",
        description:
          "La scoperta di Dan Shechtman nel 1982 dei quasicristalli metallici (Nobel 2011) è stata compresa grazie alle tassellature di Penrose — la stessa matematica a simmetria quintupla governa entrambi.",
      },
      {
        domain: "Architettura",
        description:
          "La facciata della Storey Hall a Melbourne e diversi pattern matematico-islamici del palazzo Topkapı usano geometria aperiodica in stile Penrose.",
      },
      {
        domain: "Scienza dei materiali",
        description:
          "Esistono oggi rivestimenti quasicristallini commerciali (per esempio sulle padelle antiaderenti Sjöbo), che sfruttano disposizioni atomiche in stile Penrose.",
      },
      {
        domain: "Crittografia",
        description:
          "Sono stati proposti di recente generatori pseudocasuali che usano sequenze di tassellature aperiodiche per campionamento a bassa discrepanza.",
      },
    ],
    apollonian: [
      {
        domain: "Impacchettamento granulare",
        description:
          "Il modo in cui sabbia, ghiaia e polveri farmaceutiche riempiono i contenitori è modellato con impacchettamenti di sfere in stile apolloniano — importante per calcestruzzo, compresse e metallurgia delle polveri.",
      },
      {
        domain: "Teoria dei numeri",
        description:
          "Gli impacchettamenti apolloniani interi sono studiati dalla teoria analitica dei numeri — lavori di Sarnak, Bourgain e Kontorovich hanno fornito nuovi risultati sulle curvature prime.",
      },
      {
        domain: "Fisica di schiume ed emulsioni",
        description:
          "Le strutture di schiuma (schiuma di birra, emulsioni alimentari, alveoli polmonari) ereditano nella loro formazione vincoli di impacchettamento alla apolloniana.",
      },
      {
        domain: "Design grafico",
        description:
          "Loghi, manifesti e disegni per tatuaggi usano i ricoprimenti apolloniani per una geometria radiale d'impatto.",
      },
    ],
    phi: [
      {
        domain: "Fillotassi vegetale",
        description:
          "Le spirali dei semi di girasole, le squame delle pigne e la disposizione delle foglie nella maggior parte delle piante convergono all'angolo aureo — verificato su migliaia di specie.",
      },
      {
        domain: "Frazioni continue",
        description:
          "φ ha lo sviluppo in frazione continua più semplice [1;1,1,…], il che lo rende il numero «più irrazionale» — concetto chiave per la teoria KAM in meccanica classica.",
      },
      {
        domain: "Quasicristalli e Penrose",
        description:
          "I rapporti fra lati nelle tassellature di Penrose (e il fattore di inflazione) valgono esattamente φ; lo stesso rapporto compare in quasicristalli reali scoperti in natura nel 2009.",
      },
      {
        domain: "Teoria dei numeri",
        description:
          "I numeri di Fibonacci sono alla base del teorema di Zeckendorf e di rappresentazioni intere efficienti usate in alcuni algoritmi di compressione e strutture dati.",
      },
      {
        domain: "Scetticismo onesto",
        description:
          "Le affermazioni che φ comparirebbe nel Partenone, nella Gioconda, nella conchiglia del nautilus o nelle proporzioni del corpo umano sono in larga parte miti — smentiti fra gli altri da George Markowsky (1992).",
      },
    ],
    buffon: [
      {
        domain: "Integrazione Monte Carlo",
        description:
          "L'ago di Buffon è il seme storico dei metodi Monte Carlo — oggi usati ovunque, dalla valutazione finanziaria (Black–Scholes) alla simulazione di fisica delle particelle (Geant4), fino al rendering (path tracing).",
      },
      {
        domain: "Simulazione fisica",
        description:
          "Il campionamento casuale di integrali ad alta dimensionalità in QCD reticolare, ingegneria nucleare e progettazione di reattori estende la logica di Buffon a milioni di dimensioni.",
      },
      {
        domain: "Grafica computerizzata",
        description:
          "Il campionamento stratificato dei raggi luminosi nei moderni path tracer (Pixar, Cycles, Unreal Lumen) discende in linea diretta dall'ago di Buffon.",
      },
      {
        domain: "Didattica della statistica",
        description:
          "Dimostrazione introduttiva standard di probabilità; ancora oggi proposta nei laboratori di statistica di base in tutto il mondo.",
      },
    ],
    hilberthotel: [
      {
        domain: "Teoria degli insiemi e didattica",
        description:
          "Analogia canonica per capire l'aritmetica cardinale e la differenza fra infiniti numerabili e non numerabili.",
      },
      {
        domain: "Programmare strutture infinite",
        description:
          "Le liste pigre infinite in Haskell, i generatori in Python e gli stream in Scala fanno eco ai rimescolamenti in stile hotel di Hilbert dell'infinito numerabile.",
      },
      {
        domain: "Divulgazione scientifica",
        description:
          "Video di TED-Ed, Vsauce, PBS Infinite Series — la spiegazione moderna dell'infinito più condivisa.",
      },
    ],
    gabrielshorn: [
      {
        domain: "Didattica dell'analisi",
        description:
          "Esempio standard di inizio analisi di un integrale improprio controintuitivo, presente in ogni libro di analisi del secondo anno.",
      },
      {
        domain: "Filosofia della matematica",
        description:
          "Citato nei dibattiti sul significato dei paradossi geometrici e sui limiti dell'intuizione fisica — esperimento mentale fondante.",
      },
      {
        domain: "Microfluidica",
        description:
          "Analoghi reali con flusso capillare in canali sempre più stretti (dispositivi microfluidici) si scontrano con i casi limite formalizzati dal corno di Gabriele.",
      },
    ],
    cantor: [
      {
        domain: "Teoria della calcolabilità",
        description:
          "La diagonale di Cantor produce direttamente la prova del problema della fermata di Turing e i teoremi di incompletezza di Gödel — pietre angolari dell'informatica teorica.",
      },
      {
        domain: "Teoria dei linguaggi di programmazione",
        description:
          "Usata per dimostrare che non esiste un sistema di tipi «universale» che decida il type-checking per tutti i programmi (teorema di Rice).",
      },
      {
        domain: "Crittografia e complessità",
        description:
          "Gli argomenti di diagonalizzazione sono alla base dei risultati moderni di teoria della complessità — separazioni fra P, NP, EXP.",
      },
      {
        domain: "Filosofia della matematica",
        description:
          "L'argomento di Cantor ha rovesciato le visioni aristoteliche e kantiane dell'infinito, plasmando la logica e la filosofia analitica del Novecento.",
      },
    ],
    boids: [
      {
        domain: "Effetti visivi al cinema",
        description:
          "Batman - Il ritorno (sciame di pipistrelli del 1992), Il Re Leone (stampede di gnu del 1994) e innumerevoli film moderni usano i Boids — di solito tramite Massive o Houdini.",
      },
      {
        domain: "Sciami di droni",
        description:
          "Gli show di droni da record di Intel (Olimpiadi di PyeongChang 2018, Olimpiadi di Parigi 2024) usano regole derivate dai Boids su grande scala.",
      },
      {
        domain: "Simulazione di folle",
        description:
          "Gli studi di architettura simulano evacuazioni di stadi e flussi nei centri commerciali con agenti in stile Boids — usati nella progettazione degli stadi dagli anni 2000.",
      },
      {
        domain: "Sciami robotici",
        description:
          "I laboratori di ricerca usano regole in stile Boids per sciami robotici autonomi nella ricerca e soccorso e nel monitoraggio agricolo.",
      },
      {
        domain: "Natura reale",
        description:
          "Studi empirici sulle mormorazioni degli storni (Cavagna et al., 2010), sui banchi di pesci e sui branchi di mammiferi confermano regole molto vicine ai Boids originali.",
      },
    ],
    aizawa: [
      {
        domain: "Ricerca sui sistemi dinamici",
        description:
          "Aizawa appartiene a una famiglia di attrattori strani 3D usati per testare integratori numerici, algoritmi di visualizzazione e metodi di rilevamento del caos.",
      },
      {
        domain: "Arte matematica",
        description:
          "Gli artisti generativi rendono gli attrattori di Aizawa, Thomas e Halvorsen come plot, stampe e animazioni venduti su Etsy e nelle fiere d'arte.",
      },
      {
        domain: "Didattica",
        description:
          "Sempre più usato accanto a Lorenz nei corsi di sistemi dinamici della laurea magistrale per mostrare un repertorio più ampio di forme caotiche.",
      },
    ],
    dla: [
      {
        domain: "Elettrochimica",
        description:
          "Depositi di zinco, rame e altri metalli ottenuti in celle elettrolitiche formano dendriti di tipo DLA — direttamente rilevanti per galvanica, progettazione delle batterie (dendriti di litio) e corrosione.",
      },
      {
        domain: "Crescita dei cristalli",
        description:
          "La formazione dei fiocchi di neve, la brina sulle finestre, le dendriti minerali nelle rocce — tutte esibiscono leggi di scaling DLA.",
      },
      {
        domain: "Biologia",
        description:
          "I fronti di colonie batteriche su piastre di agar, i coni di crescita neuronali e il bordo di alcuni tumori seguono regole in stile DLA.",
      },
      {
        domain: "Fisica dei fulmini",
        description:
          "La ramificazione dei fulmini e i pattern di rottura dielettrica sono ben modellati dalla DLA.",
      },
    ],
    langton: [
      {
        domain: "Vita artificiale",
        description:
          "La formica di Langton è un esempio fondante del campo della vita artificiale che lui contribuì a fondare al Santa Fe Institute.",
      },
      {
        domain: "Informatica teorica",
        description:
          "Usata come esempio minimo di calcolo universale per macchine di Turing 2D; ancora citata negli articoli fondativi di complessità.",
      },
      {
        domain: "Didattica",
        description:
          "Esempio introduttivo prediletto nei corsi sugli automi cellulari — la fase «autostrada» è uno dei fenomeni emergenti più accessibili dell'informatica.",
      },
    ],
    pascalmod: [
      {
        domain: "Teoria dei numeri",
        description:
          "Il teorema di Lucas (1878) alimenta direttamente algoritmi efficienti per coefficienti binomiali modulo primo — usati in crittografia, combinatoria sulle parole e programmazione competitiva.",
      },
      {
        domain: "Teoria dei codici",
        description:
          "I codici a correzione di errore Reed–Muller e BCH si basano sulla macchineria dei coefficienti binomiali modulo p — sono nei codici QR, nelle sonde di spazio profondo (Mariner 9, Voyager) e nella TV digitale DVB-T.",
      },
      {
        domain: "Arti visive",
        description:
          "Pascal mod 2 è l'origine algebrica del triangolo di Sierpiński — venduto come poster, tessuto in tappeti, usato in installazioni in galleria.",
      },
    ],
    sternbrocot: [
      {
        domain: "Musica al computer e accordature",
        description:
          "I compositori microtonali usano Stern–Brocot per trovare approssimazioni temperate ai rapporti dell'intonazione naturale — centrale per la musica xenarmonica.",
      },
      {
        domain: "Progettazione di ingranaggi in robotica",
        description:
          "Le ricerche della migliore approssimazione razionale per rapporti di trasmissione attraversano l'albero di Stern–Brocot per trovare riduzioni meccaniche efficienti.",
      },
      {
        domain: "Calendari",
        description:
          "Le regole degli anni bisestili basate su frazioni continue (calendario persiano, correzioni gregoriane proposte) derivano dalle mediane di Stern–Brocot.",
      },
      {
        domain: "Rendering di immagini",
        description:
          "Il campionamento subpixel e la moderna rasterizzazione dei caratteri usano mediane in stile Stern–Brocot per scegliere i rapporti di copertura del pixel.",
      },
    ],
    ulam: [
      {
        domain: "Teoria dei numeri pura",
        description:
          "Visualizzare i numeri primi tramite spirali in stile Ulam continua a ispirare nuove congetture sulle densità di primi polinomiali (Hardy–Littlewood, Sato–Tate).",
      },
      {
        domain: "Didattica",
        description:
          "Esposizione standard nei musei di matematica ed esplorazione introduttiva nei corsi di teoria dei numeri.",
      },
      {
        domain: "Arte generativa",
        description:
          "Opere derivate dalla spirale di Ulam compaiono nelle mostre di artisti (Roman Verostko, Tristan Perich).",
      },
    ],
    cardioid: [
      {
        domain: "Ingegneria audio",
        description:
          "I microfoni cardioidi (quelli usati da ogni podcaster e da chi lavora nel broadcasting) devono il nome al diagramma di ripresa cardioide — sensibili davanti e sordi dietro.",
      },
      {
        domain: "Progettazione di antenne",
        description:
          "Alcuni diagrammi di direttività di antenne sono cardioidi; comuni in VHF marino e negli apparati di radiogoniometria.",
      },
      {
        domain: "Architettura e illuminotecnica",
        description:
          "I riflettori cardioidi sono usati nell'illuminazione teatrale classica (PAR cans) per proiettare fasci asimmetrici.",
      },
      {
        domain: "Collegamento con Mandelbrot",
        description:
          "Il bulbo principale dell'insieme di Mandelbrot è esattamente una cardioide; comprenderne la forma illumina il diagramma di biforcazione di Mandelbrot.",
      },
    ],
    galton: [
      {
        domain: "Didattica della statistica",
        description:
          "La macchina di Galton è la dimostrazione canonica del teorema del limite centrale — presente in quasi ogni museo della scienza (Deutsches Museum, Boston Museum of Science, MOSS Toronto).",
      },
      {
        domain: "Quinconce in genetica",
        description:
          "Galton costruì la macchina originale per rendere visibile la statistica ereditaria al pubblico vittoriano; pose le basi della biometria e della genetica statistica.",
      },
      {
        domain: "Plinko e game design",
        description:
          "Le macchine di Galton hanno ispirato il gioco TV Plinko e i moderni giochi mobili di pachinko e slot, sia fisici sia digitali.",
      },
      {
        domain: "Analisi delle tolleranze produttive",
        description:
          "I calcoli statistici di catene di tolleranze in ingegneria meccanica richiamano direttamente la logica del teorema del limite centrale visualizzata dalla macchina di Galton.",
      },
    ],
    magpendulum: [
      {
        domain: "Dimostrazioni di caos",
        description:
          "Il gioco da scrivania «pendolo a tre magneti» è la più popolare dimostrazione fisica dei bacini d'attrazione frattali — venduto da ThinkGeek, Nikola Labs e da molti negozi di regali scientifici.",
      },
      {
        domain: "Ricerca sulla levitazione magnetica",
        description:
          "Le dinamiche dei pendoli a magnete permanente sono alla base dei treni maglev, dei cuscinetti magnetici e degli ammortizzatori magnetoreologici.",
      },
      {
        domain: "Didattica",
        description:
          "Dimostrazione standard di dinamica non lineare nella laurea triennale in fisica; serve a insegnare spazio delle fasi, dissipazione e sensibilità allo stato finale.",
      },
    ],
    godel: [
      {
        domain: "Fondamenti della matematica",
        description:
          "Gödel ha chiuso il programma di Hilbert di meccanizzazione della matematica; ha rimodellato ciò che il mondo matematico crede dimostrabile in linea di principio.",
      },
      {
        domain: "Informatica",
        description:
          "L'indefinibilità della verità di Tarski, il problema della fermata di Turing e il teorema di Rice ne sono discendenti diretti — presenti in ogni corso di logica e calcolabilità della laurea triennale.",
      },
      {
        domain: "Filosofia della mente",
        description:
          "L'argomento di Penrose secondo cui la mente umana non è puramente algoritmica (La mente nuova dell'imperatore, 1989) si appoggia molto a Gödel — controverso ma influente.",
      },
      {
        domain: "Software verificato",
        description:
          "I moderni assistenti di prova (Coq, Lean, Isabelle) si scontrano ogni giorno con i limiti di Gödel; tutta la loro utilità sta nel formalizzare ciò che è dimostrabile dentro un sistema esplicito.",
      },
    ],
    halting: [
      {
        domain: "Compilatori e analisi statica",
        description:
          "I moderni analizzatori statici (Coverity, Infer, il borrow checker di Rust) devono rinunciare a una precisione perfetta perché le proprietà non triviali dei programmi sono indecidibili — conseguenza diretta del problema della fermata (teorema di Rice).",
      },
      {
        domain: "Antivirus",
        description:
          "Perché nessun antivirus prende tutti i malware: rilevare perfettamente i programmi ostili equivarrebbe a risolvere una variante del problema della fermata.",
      },
      {
        domain: "Cloud di calcolo",
        description:
          "Gli autoscaler in cloud non possono mai garantire che «questo job utente terminerà» — impongono timeout perché decidere la fermata è impossibile.",
      },
      {
        domain: "Didattica",
        description:
          "Introduzione canonica all'indecidibilità in ogni corso di teoria della calcolabilità del pianeta.",
      },
    ],
    pvsnp: [
      {
        domain: "Crittografia",
        description:
          "Se P = NP, RSA, AES, ogni blockchain e tutto il traffico protetto da TLS sarebbero rotti dall'oggi al domani — ogni segreto digitale moderno dipende dal fatto che P ≠ NP valga effettivamente.",
      },
      {
        domain: "Ottimizzazione",
        description:
          "Logistica (instradamento UPS), progettazione dei chip (place-and-route) e ricerca degli iperparametri nel machine learning affrontano problemi NP-difficili con euristiche perché le soluzioni esatte sono intrattabili.",
      },
      {
        domain: "IA e solver SAT",
        description:
          "I moderni solver SAT/SMT (Z3, MiniSat) risolvono di routine istanze NP-difficili con milioni di variabili grazie a euristiche ingegnose, anche se la complessità nel caso pessimo è esponenziale.",
      },
      {
        domain: "Bioinformatica",
        description:
          "Folding proteico, assemblaggio di genomi e ricostruzione di alberi filogenetici sono tutti NP-difficili — questo spinge il campo a inventare algoritmi di approssimazione e metodi di IA (AlphaFold).",
      },
      {
        domain: "Premio aperto",
        description:
          "Uno dei sette problemi del millennio del Clay, con un premio da 1.000.000 di dollari per una dimostrazione o una confutazione.",
      },
    ],
    rsa: [
      {
        domain: "TLS / HTTPS",
        description:
          "Ogni icona a lucchetto nel browser coinvolge, nell'handshake iniziale, RSA o il suo cugino su curve ellittiche (ECDSA) — miliardi di volte al secondo.",
      },
      {
        domain: "Firme digitali",
        description:
          "L'App Store di Apple, Google Play e Microsoft Update firmano ogni release con crittografia a chiave pubblica in stile RSA; se falsificabile, il malware si diffonderebbe senza ostacoli.",
      },
      {
        domain: "Banche e blockchain",
        description:
          "I messaggi SWIFT, le transazioni con chip e la maggior parte dei wallet blockchain si basano su ipotesi di difficoltà della fattorizzazione o del logaritmo discreto equivalenti a RSA.",
      },
      {
        domain: "Documenti d'identità",
        description:
          "I passaporti moderni (ICAO 9303) contengono dati biometrici firmati con RSA; il controllo di frontiera verifica la firma contro le CA nazionali.",
      },
      {
        domain: "Panico post-quantistico",
        description:
          "L'algoritmo di Shor rompe RSA su un computer quantistico sufficientemente grande; il NIST sta standardizzando i successori post-quantistici (Kyber, Dilithium).",
      },
    ],
    mobius: [
      {
        domain: "Nastri trasportatori industriali",
        description:
          "Le cinghie di trasmissione a nastro di Möbius si usurano in modo uniforme su entrambi i «lati» (ce n'è uno solo!) — usate nelle vecchie macchine da stampa, nei moderni nastri di registrazione e in alcuni sistemi di nastri VHS.",
      },
      {
        domain: "Ingegneria meccanica",
        description:
          "Ingranaggi di Möbius e resistori a forma di Möbius sono stati brevettati per dimezzare rispettivamente usura e induttanza.",
      },
      {
        domain: "Ricerca topologica",
        description:
          "Il nastro di Möbius è la più semplice superficie non orientabile — porta d'ingresso a un vasto campo che classifica tutte le superfici, usato in cosmologia e teoria delle stringhe.",
      },
      {
        domain: "Arte e architettura",
        description:
          "Il Nastro infinito di Max Bill, il triangolo del simbolo del riciclo e architetti dal Messico ad Astana usano la topologia di Möbius per installazioni d'effetto.",
      },
      {
        domain: "Chimica",
        description:
          "Le molecole aromatiche di Möbius (Heilbronner 1964; prima sintesi nel 2003) portano un semi-twist degli elettroni π e mostrano proprietà elettroniche che nessun anello piatto può avere.",
      },
    ],
    eulerchar: [
      {
        domain: "Grafica computerizzata",
        description:
          "La validazione delle mesh (Blender, Maya) controlla V−S+F rispetto al χ atteso per rilevare buchi o geometria duplicata prima della stampa 3D.",
      },
      {
        domain: "Topologia dei dati",
        description:
          "Le pipeline di omologia persistente usano le caratteristiche di Eulero per sintetizzare la forma di nuvole di punti ad alta dimensionalità — applicata in genomica, reti di sensori e cosmologia.",
      },
      {
        domain: "Architettura",
        description:
          "Le cupole geodetiche di Buckminster Fuller (Spaceship Earth a Epcot, Biosphère di Montréal) sono progettate in modo che V−S+F=2 forzi esattamente 12 pentagoni fra gli esagoni.",
      },
      {
        domain: "Progettazione del pallone da calcio",
        description:
          "Il classico pallone a icosaedro troncato ha 12 pentagoni e 20 esagoni; la formula di Eulero spiega perché siano esattamente 12, non uno di meno.",
      },
      {
        domain: "Fisica delle particelle",
        description:
          "Il teorema dell'indice di Atiyah-Singer, fondamentale per la teoria di gauge moderna, generalizza la formula di Eulero e collega topologia ed equazioni differenziali.",
      },
    ],
    konigsberg: [
      {
        domain: "Nascita della teoria dei grafi",
        description:
          "Königsberg ha dato il via all'intero campo — oggi la teoria dei grafi è alla base del PageRank di Google, dell'analisi delle reti sociali, del layout dei chip e della pianificazione delle rotte.",
      },
      {
        domain: "Sequenziamento del DNA",
        description:
          "Gli algoritmi di cammino euleriano ispirati a Königsberg sono il cavallo da tiro dell'assemblaggio moderno dei genomi (Pevzner e Tang, 2001; usati in SPAdes, Velvet, megahit).",
      },
      {
        domain: "Ottimizzazione di percorsi",
        description:
          "Postini, camion della spazzatura e spazzaneve risolvono il problema del postino cinese — discendente diretto dei ponti di Königsberg.",
      },
      {
        domain: "Turismo",
        description:
          "Kaliningrad (la Königsberg moderna) sfrutta i ponti turisticamente; i visitatori tentano la passeggiata anche se solo cinque dei sette originari sono sopravvissuti alla Seconda guerra mondiale.",
      },
    ],
    fourcolor: [
      {
        domain: "Cartografia",
        description:
          "Cartografi e ingegneri GIS usano effettivamente algoritmi di colorazione a quattro colori per mappe politiche, atlanti per paese e visualizzazioni meteo.",
      },
      {
        domain: "Reti mobili",
        description:
          "L'assegnazione di frequenze fra antenne cellulari si riconduce a una colorazione di grafi — il teorema dei quattro colori è il caso limite per alcuni layout planari.",
      },
      {
        domain: "Pianificazione",
        description:
          "Calendari di esami universitari, sale conferenze e calendari sportivi sono tutti problemi di colorazione di grafi; le varianti planari ereditano il limite dei quattro colori.",
      },
      {
        domain: "Matematica verificata al computer",
        description:
          "Insieme alla congettura di Keplero, il teorema dei quattro colori è stato una pietra miliare della dimostrazione assistita al computer — la cultura degli assistenti di prova (Coq, Lean) trae da qui la propria legittimità.",
      },
    ],
    smallworld: [
      {
        domain: "Reti sociali",
        description:
          "La funzionalità «contatti di 2º grado» di LinkedIn, le cascate di retweet di Twitter e i «persone che potresti conoscere» di Facebook sfruttano la struttura a piccolo mondo per la rilevanza.",
      },
      {
        domain: "Modelli epidemici",
        description:
          "La modellistica della diffusione di COVID-19, le app di contact tracing e le strategie vaccinali usano modelli di rete a piccolo mondo per prevedere la dinamica dei focolai.",
      },
      {
        domain: "Ricerca sul cervello",
        description:
          "Studi di risonanza magnetica funzionale mostrano che il connettoma umano è una rete a piccolo mondo — il coefficiente di piccolo mondo è oggi un biomarcatore standard nella ricerca su Alzheimer e schizofrenia.",
      },
      {
        domain: "Routing su Internet",
        description:
          "Il grafo dei sistemi autonomi di Internet ha proprietà di piccolo mondo; BGP e i CDN moderni (Cloudflare, Fastly) sfruttano le brevi distanze in hop.",
      },
      {
        domain: "Six Degrees of Kevin Bacon",
        description:
          "Il gioco cinefilo del 1994 e il sito Bacon Number sono artefatti pop della teoria del piccolo mondo; il mondo matematico si contende numeri di Erdős bassi.",
      },
    ],
    diffusion: [
      {
        domain: "Generazione di immagini",
        description:
          "Stable Diffusion, Midjourney, DALL·E 3 e Imagen sono tutti modelli di diffusione latente. Digiti un prompt e il modello riporta rumore gaussiano a un'immagine coerente con il testo.",
      },
      {
        domain: "Generazione video",
        description:
          "Sora, Veo e Runway estendono la stessa matematica della diffusione a tre dimensioni (altezza × larghezza × tempo), così il denoiser impara coerenza spazio-temporale oltre all'aspetto.",
      },
      {
        domain: "Progettazione di farmaci e proteine",
        description:
          "RFdiffusion (laboratorio Baker) e Chroma generano nuovi scheletri proteici denoising di coordinate 3D al posto dei pixel — candidati pubblicati sono stati sintetizzati e si ripiegano correttamente.",
      },
      {
        domain: "Audio e parlato",
        description:
          "AudioLDM, Riffusion e la linea di sintesi vocale ElevenLabs/Vall-E usano diffusione 1D su forme d'onda o spettrogrammi per generare musica e voci naturali a partire da testo.",
      },
      {
        domain: "Fisica e termodinamica",
        description:
          "Il processo diretto è letteralmente dinamica di Langevin — il calendario di rumore rispecchia un sistema che rilassa verso l'equilibrio termico. L'articolo originale di Sohl-Dickstein (2015) era formulato come termodinamica fuori equilibrio.",
      },
    ],
    quine: [
      {
        domain: "Teoria dei linguaggi di programmazione",
        description:
          "Le quine sono il sanity check standard per verificare che un linguaggio sia abbastanza espressivo per l'autoreferenza; i corsi di teoria della calcolabilità le usano per insegnare il teorema di ricorsione di Kleene in forma concreta.",
      },
      {
        domain: "Virus informatici & autoreplicatori",
        description:
          "Ogni virus, worm e motore metamorfico classico è una variante di quine: codice che si copia prima di fare qualsiasi altra cosa. Il malware autoreplicante moderno è studiato come ingegneria di quine applicata.",
      },
      {
        domain: "Genetica & biologia molecolare",
        description:
          "La replicazione del DNA è la quine della biologia: una sequenza il cui unico compito è copiare sé stessa, macchinario di copia incluso. Hofstadter traccia l'analogia in modo esplicito in Gödel, Escher, Bach.",
      },
      {
        domain: "Bootstrap di compilatori",
        description:
          "Trusting Trust (Ken Thompson, 1984) mostrò che il compilatore di un compilatore può essere una quine che inserisce una backdoor a ogni build — fondamento della sicurezza della catena di fornitura e della ricerca sui build riproducibili.",
      },
      {
        domain: "Demoscene & arte del codice",
        description:
          "Le quine poliglotte — programmi che stampano sé stessi e sono validi in più linguaggi insieme — sono un genere amato dell'arte del codice; l'IOCCC ha una categoria dedicata alle quine.",
      },
    ],
    riemann: [
      {
        domain: "Teorema dei numeri primi",
        description:
          "Il termine d'errore nel conteggio dei primi sotto N è controllato dagli zeri di ζ; l'ipotesi di Riemann equivale al limite più stretto possibile su quanto irregolarmente i primi siano distribuiti.",
      },
      {
        domain: "Crittografia",
        description:
          "RSA, la crittografia ellittica e la durezza della fattorizzazione dipendono da ipotesi sulla distribuzione dei primi; enunciati RH-equivalenti alimentano i migliori limiti noti sulla sicurezza crittografica.",
      },
      {
        domain: "Caos quantistico",
        description:
          "La statistica delle distanze tra zeri di zeta coincide con quella degli autovalori di grandi matrici hermitiane casuali — le stesse usate per modellare i livelli di energia dei nuclei pesanti. La congettura di Montgomery-Dyson (1972) è uno dei ponti più sorprendenti della matematica.",
      },
      {
        domain: "Numerica verificata al computer",
        description:
          "I primi 10^13 zeri non banali sono stati calcolati sulla retta critica (Xavier Gourdon, 2004 e successori). Nessuna campagna di verifica ha mai trovato un controesempio a RH.",
      },
      {
        domain: "Divulgazione e prestigio dei problemi aperti",
        description:
          "Riemann è il problema irrisolto più famoso al di fuori di Fermat — un Clay Millennium Prize (1 M$), apparizioni ricorrenti nella narrativa (A Beautiful Mind, La musica dei numeri primi) e un flusso costante di «dimostrazioni» che non sopravvivono al peer review.",
      },
    ],
    backprop: [
      {
        domain: "Deep learning",
        description:
          "Ogni rete neurale moderna — classificatori di immagini, modelli di linguaggio, raccomandatori — è allenata con la retropropagazione. PyTorch e JAX la implementano come nucleo di differenziazione (autograd).",
      },
      {
        domain: "Visione artificiale",
        description:
          "Le reti convoluzionali per imaging medico, guida autonoma e identificazione biometrica apprendono i kernel di filtro direttamente da dati etichettati con backprop; i gradienti scorrono indietro attraverso convoluzioni e pooling.",
      },
      {
        domain: "Modelli linguistici",
        description:
          "GPT, Claude, Llama e ogni transformer si allenano retropropagando la cross-entropy attraverso migliaia di miliardi di parametri. L'unico algoritmo che scala da un neurone a mille miliardi.",
      },
      {
        domain: "Robotica e controllo",
        description:
          "I metodi policy-gradient nell'apprendimento per rinforzo usano backprop per aggiornare controllori neurali a partire da segnali di ricompensa; i moderni robot bipedi e di manipolazione destra lo usano tutti.",
      },
      {
        domain: "Problemi inversi nelle scienze",
        description:
          "I fisici invertono esperimenti costruendo il modello in avanti in PyTorch/JAX e retropropagando attraverso di esso — usato nel design di proteine (AlphaFold), nel rendering differenziabile e nel design sperimentale gradient-based.",
      },
    ],
  },
  pt: {
    eml: [
      {
        domain: "Regressão simbólica",
        description:
          "Os sistemas de álgebra computacional que tentam redescobrir leis físicas a partir de dados usam por vezes alfabetos de operadores compactos como o EML para restringir o espaço de procura.",
      },
      {
        domain: "Informática teórica",
        description:
          "O EML é primo de conjuntos universais como o NAND em lógica e o Iota em combinadores — interessante pelo que diz sobre quão pequena pode ser uma primitiva.",
      },
    ],
    mandelbrot: [
      {
        domain: "Arte generativa e motion graphics",
        description:
          "Cineastas e artistas digitais fazem zoom dentro do conjunto de Mandelbrot para produzir fundos para tudo, desde videoclipes até sequências de abertura das keynotes da Apple.",
      },
      {
        domain: "Antenas fractais",
        description:
          "Bordos do tipo Mandelbrot/Julia são usados em algumas antenas multibanda compactas (por exemplo nos primeiros módulos Bluetooth), porque a forma autossemelhante ressoa em muitas frequências.",
      },
      {
        domain: "Ensino",
        description:
          "Exemplo universitário padrão para dinâmica complexa, caos determinístico e a fronteira entre ordem e caos.",
      },
      {
        domain: "Análogos naturais",
        description:
          "Linhas de costa, cumeadas montanhosas, folhas de feto e floretes de brócolos mostram a mesma estrutura de bordo autossemelhante — era exactamente o ponto de Mandelbrot acerca da geometria fractal.",
      },
    ],
    life: [
      {
        domain: "Ensino de informática",
        description:
          "Qualquer currículo de informática, do MIT 6.001 aos clubes do secundário, usa o Life de Conway para ensinar emergência, autómatos celulares e completude de Turing numa única tarde.",
      },
      {
        domain: "Arte generativa",
        description:
          "Designers usam o Life e as suas variantes (HighLife, Day & Night…) para gerar visuais em permanente mudança para videoclipes, instalações e protectores de ecrã.",
      },
      {
        domain: "Modelação de biologia discreta",
        description:
          "Demografia, dinâmica presa-predador e propagação epidémica são por vezes prototipadas em grelhas tipo Life antes de passar a modelos baseados em agentes mais ricos.",
      },
      {
        domain: "Bricolagem de hardware",
        description:
          "Projectos em FPGA e microcontrolador renderizam frequentemente o Life em matrizes LED como «olá mundo» do hardware celular paralelo.",
      },
    ],
    nand: [
      {
        domain: "Dentro de cada chip",
        description:
          "Desde o silício Apple série M até aos microcontroladores industriais, todos os minutos são gravados no silício milhares de milhões de portas NAND. Muitos ASIC digitais são sintetizados apenas em NAND.",
      },
      {
        domain: "Memória flash",
        description:
          "A memória flash NAND (pens USB, SSD, smartphones) deve o nome e a arquitectura às portas NAND organizadas em matrizes de transístores de porta flutuante.",
      },
      {
        domain: "Cursos de hardware",
        description:
          "O curso nand2tetris constrói um computador completo a partir de um único chip NAND — utilizado em mais de 100 universidades.",
      },
      {
        domain: "Lógica embebida",
        description:
          "Os circuitos integrados 74HC00 com quatro portas NAND discretas ainda hoje são produzidos para glue logic simples, deslocadores de nível e osciladores em PCB amadoras.",
      },
    ],
    iota: [
      {
        domain: "Interpretadores de combinadores",
        description:
          "Os compiladores de linguagens funcionais (por exemplo o Lazy K) compilam programas em cálculo lambda para expressões puras de combinadores — ao estilo Iota — durante a geração de código.",
      },
      {
        domain: "Linguagens esotéricas",
        description:
          "O Iota e o seu irmão Jot são linguagens de programação minimalistas usadas para estudar a menor sintaxe Turing-completa possível.",
      },
      {
        domain: "Ensino do cálculo lambda",
        description:
          "As universidades usam o Iota para mostrar que basta um único combinador, separando assim sintaxe e poder computacional.",
      },
    ],
    rule110: [
      {
        domain: "Wolfram Physics Project",
        description:
          "O programa de Stephen Wolfram para encontrar a regra subjacente do universo cita explicitamente a Regra 110 como prova de que regras minúsculas podem ser universalmente computacionais.",
      },
      {
        domain: "Ensino da computação formal",
        description:
          "Citada em qualquer introdução moderna aos autómatos celulares como o mais simples sistema universal conhecido — uma máquina de Turing em formato de tweet.",
      },
      {
        domain: "Ruído procedural de texturas",
        description:
          "Algumas bibliotecas de shaders usam a Regra 110 (e a 30) como fonte barata de ruído 1D complexo para gráficos generativos estilizados.",
      },
    ],
    logistic: [
      {
        domain: "Biologia das populações",
        description:
          "A equação logística contínua modela populações estreitamente limitadas de bactérias, leveduras e até alguns mamíferos; o mapa discreto é ensinado em todos os cursos de ecologia quantitativa.",
      },
      {
        domain: "Epidemiologia",
        description:
          "O crescimento epidémico limitado (com capacidade de suporte = pool de susceptíveis) segue curvas logísticas — as curvas acumuladas de casos de COVID-19 foram um exemplo de manual.",
      },
      {
        domain: "Aprendizagem automática",
        description:
          "Os escalonadores de taxa de aprendizagem em deep learning caem por vezes no mesmo caos por duplicação de período quando a taxa é demasiado grande; o mapa logístico dá a intuição.",
      },
      {
        domain: "Neurociência",
        description:
          "Os modelos de taxa de disparo neuronal com correntes de entrada elevadas bifurcam exactamente como o mapa logístico, prevendo o aparecimento de disparos irregulares.",
      },
      {
        domain: "Clima e meteorologia",
        description:
          "A duplicação de período ao estilo Feigenbaum foi reproduzida experimentalmente em células de convecção, mostrando o mesmo caminho universal para a turbulência.",
      },
    ],
    lorenz: [
      {
        domain: "Previsão meteorológica",
        description:
          "Os serviços operacionais de previsão recorrem a métodos de ensemble porque a atmosfera partilha a sensibilidade de Lorenz às condições iniciais — a previsibilidade colapsa ao fim de cerca de 14 dias.",
      },
      {
        domain: "Modelação climática",
        description:
          "O artigo de Lorenz de 1963 deu origem à teoria moderna do caos e molda a forma como lemos os limites de previsibilidade das simulações climáticas de longo prazo.",
      },
      {
        domain: "Ensino",
        description:
          "Qualquer cadeira de licenciatura em sistemas dinâmicos visualiza o atractor de Lorenz como o atractor estranho canónico.",
      },
      {
        domain: "Comunicação segura",
        description:
          "Esquemas de cifragem baseados em caos usaram sincronização ao estilo Lorenz para ocultar sinais — nicho, mas real (Cuomo e Oppenheim, 1993).",
      },
    ],
    fourier: [
      {
        domain: "MP3, AAC, Opus",
        description:
          "Todos os codecs modernos de áudio com perdas transformam janelas curtas de som para o domínio da frequência, descartam as componentes inaudíveis e transformam de novo.",
      },
      {
        domain: "JPEG e HEIC",
        description:
          "Cada bloco de 8×8 pixels de um JPEG é guardado como coeficientes da transformada discreta do cosseno — daí os padrões horizontais e verticais do ringing JPEG.",
      },
      {
        domain: "Ressonância magnética",
        description:
          "Uma máquina de ressonância magnética mede literalmente coeficientes de Fourier (o espaço k) dos teus tecidos e transforma-os de volta na imagem que vês na consulta.",
      },
      {
        domain: "Wi-Fi, 5G, DSL",
        description:
          "As transmissões sem fios e por cabo modernas usam OFDM, que distribui os dados por milhares de portadoras sinusoidais cuidadosamente espaçadas — engenharia de Fourier no estado puro.",
      },
      {
        domain: "Voz e ML",
        description:
          "As features mel-espectrograma (áudio transformado por Fourier) são a entrada de quase todos os modelos de reconhecimento de voz e de assistentes vocais.",
      },
    ],
    euler: [
      {
        domain: "Processamento de sinal",
        description:
          "Qualquer manual de DSP usa e^{iωt} como sinusoide complexa canónica; a FFT, a transformada Z e o projecto de filtros vivem todos sobre a fórmula de Euler.",
      },
      {
        domain: "Mecânica quântica",
        description:
          "As funções de onda são exponenciais complexas; os factores de fase e^{iθ} transportam os padrões de interferência que tornam quântica a mecânica quântica.",
      },
      {
        domain: "Análise de circuitos em corrente alternada",
        description:
          "As engenharias eléctricas modelam tensões e correntes alternadas como exponenciais complexas — a aritmética de impedâncias com fasores é aplicação directa da fórmula de Euler.",
      },
      {
        domain: "Teoria do controlo",
        description:
          "A estabilidade dos sistemas com realimentação lê-se na posição dos pólos no plano complexo — a fórmula de Euler é a ponte entre tempo e frequência.",
      },
    ],
    banach: [
      {
        domain: "Ensino da teoria de conjuntos",
        description:
          "Banach–Tarski é o exemplo de manual de por que o Axioma da Escolha é controverso — usado em todos os cursos de mestrado em análise real.",
      },
      {
        domain: "Fundamentos da matemática",
        description:
          "Motivou no século XX o trabalho sobre fundamentos alternativos da teoria de conjuntos (construtivismo, intuicionismo) e influenciou as demonstrações verificadas por computador.",
      },
      {
        domain: "Filosofia da matemática",
        description:
          "Invocado com frequência em debates sobre o realismo matemático, o significado de «infinito» e os limites da intuição.",
      },
    ],
    lsystem: [
      {
        domain: "Plantas procedurais em jogos e cinema",
        description:
          "Árvores, fetos e relva em títulos como O Rei Leão (1994), Avatar (2009) e inúmeros jogos modernos são gerados a partir de L-systems através do SpeedTree e middleware semelhante.",
      },
      {
        domain: "Arquitectura e CAD",
        description:
          "As ferramentas de arquitectura generativa (Grasshopper para Rhino) usam L-systems para fazer crescer estruturas ramificadas, fachadas e redes de ruas.",
      },
      {
        domain: "Investigação em biologia vegetal",
        description:
          "Quem investiga biologia vegetal ajusta L-systems a espécies reais (por exemplo a topologia da macieira) para estudar dinâmica de crescimento, competição pela luz e optimização de rendimento.",
      },
      {
        domain: "Composição musical",
        description:
          "Quem compõe mapeia cadeias de um L-system para eventos MIDI, fazendo crescer algoritmicamente temas que desenvolvem autossemelhança fractal ao longo do tempo.",
      },
    ],
    wang: [
      {
        domain: "Gráficos em tempo real",
        description:
          "Os conjuntos de mosaicos de Wang permitem empacotar texturas não repetitivas (relva, tijolo, areia) em atlas muito pequenos — importante em dispositivos com pouca memória, como GPU móveis.",
      },
      {
        domain: "Design procedural de níveis",
        description:
          "Os motores de jogo (Houdini, motores roguelike feitos por medida) usam mosaicos de Wang para montar grandes mapas de masmorras e mundos a partir de pequenas peças modulares, sem costuras visíveis.",
      },
      {
        domain: "Materiais e quasicristais",
        description:
          "A teoria dos mosaicos de Wang sobrepõe-se em parte à matemática dos quasicristais — ambas produzem arranjos infinitos aperiódicos.",
      },
    ],
    collatz: [
      {
        domain: "Problema em aberto da matemática pura",
        description:
          "Figura entre os problemas em aberto mais famosos da teoria elementar dos números; verificado por computador até 2,95×10²⁰ em 2024.",
      },
      {
        domain: "Computação distribuída",
        description:
          "O projecto BOINC / collatzconjecture.org procura um contraexemplo em crowdsourcing usando tempo de GPU doado por voluntários.",
      },
      {
        domain: "Pedagogia",
        description:
          "Usado em demonstrações de «truques numéricos» no ensino básico e em projectos de investigação de licenciatura sobre sucessões inteiras.",
      },
    ],
    doublependulum: [
      {
        domain: "Robótica",
        description:
          "Os braços robóticos de dois elos são matematicamente pêndulos duplos; compreender o seu acoplamento não linear é essencial para o controlo estável dos manipuladores industriais.",
      },
      {
        domain: "Biomecânica",
        description:
          "Os membros humanos durante a marcha, o lançamento e os gestos ginásticos são modelados como sistemas multi-pêndulo para investigação em reabilitação e próteses.",
      },
      {
        domain: "Museus de ciência",
        description:
          "As exposições de pêndulo duplo nos museus (por exemplo Exploratorium, Deutsches Museum) mostram fisicamente o efeito borboleta ao público.",
      },
      {
        domain: "Acrobacia e rigging",
        description:
          "O Cirque du Soleil e quem faz rigging teatral precisa de entender a dinâmica de pêndulo-sobre-pêndulo para coreografias seguras de trapézio e tecidos aéreos.",
      },
    ],
    bzr: [
      {
        domain: "Arritmias cardíacas",
        description:
          "Padrões de ondas em espiral muito semelhantes às espirais BZR observam-se à superfície do coração durante a fibrilhação — centrais para a investigação e o projecto de desfibrilhadores.",
      },
      {
        domain: "Neurociência",
        description:
          "A depressão alastrante cortical (uma onda de despolarização neural ligada à enxaqueca) é modelada como meio excitável do tipo BZR.",
      },
      {
        domain: "Ensino da química",
        description:
          "A BZR é a mais impressionante demonstração de «química viva» que um professor de química do secundário pode mostrar — oscilação visível dentro de um balão.",
      },
      {
        domain: "Teoria com Nobel",
        description:
          "Ilya Prigogine ganhou o Nobel de 1977 pela teoria das estruturas dissipativas, alicerçada em sistemas como a BZR.",
      },
    ],
    turingpattern: [
      {
        domain: "Biologia do desenvolvimento",
        description:
          "As riscas do peixe-zebra, o espaçamento dos folículos pilosos no ratinho, a formação das impressões digitais e o padrão dos dedos em embriões de vertebrados foram medidos e seguem dinâmicas de Turing.",
      },
      {
        domain: "Filotaxia vegetal",
        description:
          "As disposições em espiral das sementes do girassol, das escamas das pinhas e dos ananases emergem de reacção-difusão mais ângulo dourado — química de Turing numa superfície em crescimento.",
      },
      {
        domain: "Arte generativa e gráficos",
        description:
          "Os padrões de reacção-difusão são amplamente usados como ruído procedural de textura (pele, casca, coral) em ferramentas 3D como o Substance Designer e o Houdini.",
      },
      {
        domain: "Libertação de fármacos e materiais",
        description:
          "Microestruturas auto-organizadas em membranas poliméricas e revestimentos de libertação de fármacos são desenhadas a partir de instabilidades do tipo Turing.",
      },
    ],
    sierpinski: [
      {
        domain: "Antenas fractais",
        description:
          "As antenas com triângulo de Sierpiński são produtos comerciais — telemóveis, routers Wi-Fi e receptores GPS usam patches fractais multibanda que ressoam em muitas frequências num espaço reduzido.",
      },
      {
        domain: "Permutadores de calor",
        description:
          "Canais ramificados ao estilo Sierpiński aparecem em placas de arrefecimento impressas para LED de alta potência e arrefecimento de chips, maximizando a área de superfície.",
      },
      {
        domain: "Compressão e gráficos",
        description:
          "Os sistemas de funções iteradas (IFS ao estilo Sierpiński) estão na base dos algoritmos de compressão fractal de imagem — ainda em uso em codificadores de nicho para imagens aéreas.",
      },
      {
        domain: "Redes",
        description:
          "O encaminhamento IP hierárquico e as topologias em árvore herdam propriedades fractais de escala ao estilo Sierpiński para balanceamento de carga.",
      },
    ],
    chaosgame: [
      {
        domain: "Bioinformática",
        description:
          "A Chaos Game Representation (CGR) é uma forma padrão de visualizar sequências de ADN — cada nucleótido empurra um ponto para um dos quatro cantos de um quadrado; as espécies agrupam-se em assinaturas fractais reconhecíveis.",
      },
      {
        domain: "Compressão fractal",
        description:
          "A compressão fractal de imagem de Barnsley codifica as imagens como um pequeno conjunto de aplicações contractivas recuperadas através do jogo do caos.",
      },
      {
        domain: "Texturização procedural",
        description:
          "As saídas do jogo do caos (variantes do feto de Barnsley) são muito usadas para folhagem procedural e pinceladas estilizadas.",
      },
    ],
    penrose: [
      {
        domain: "Quasicristais",
        description:
          "A descoberta por Dan Shechtman em 1982 dos quasicristais metálicos (Nobel 2011) foi compreendida graças aos pavimentos de Penrose — a mesma matemática de simetria quíntupla governa ambos.",
      },
      {
        domain: "Arquitectura",
        description:
          "A fachada da Storey Hall em Melbourne e vários padrões matemático-islâmicos do Palácio de Topkapı usam geometria aperiódica ao estilo Penrose.",
      },
      {
        domain: "Ciência dos materiais",
        description:
          "Existem hoje revestimentos quasicristalinos comerciais (por exemplo em frigideiras antiaderentes Sjöbo) que tiram partido de arranjos atómicos ao estilo dos pavimentos de Penrose.",
      },
      {
        domain: "Criptografia",
        description:
          "Foram recentemente propostos geradores pseudoaleatórios que usam sequências de pavimentos aperiódicos para amostragem de baixa discrepância.",
      },
    ],
    apollonian: [
      {
        domain: "Empacotamento granular",
        description:
          "A forma como areia, gravilha e pós farmacêuticos enchem os recipientes é modelada com empacotamentos esféricos ao estilo apoloniano — chave em betão, comprimidos e metalurgia dos pós.",
      },
      {
        domain: "Teoria dos números",
        description:
          "Os empacotamentos apolonianos inteiros são estudados pela teoria analítica dos números — trabalhos de Sarnak, Bourgain e Kontorovich produziram novos resultados sobre curvaturas primas.",
      },
      {
        domain: "Física de espumas e emulsões",
        description:
          "As estruturas de espuma (espuma de cerveja, emulsões alimentares, alvéolos pulmonares) herdam, na sua formação, restrições de empacotamento ao estilo apoloniano.",
      },
      {
        domain: "Design gráfico",
        description:
          "Logótipos, cartazes e desenhos para tatuagens usam os crivos apolonianos para uma geometria radial marcante.",
      },
    ],
    phi: [
      {
        domain: "Filotaxia vegetal",
        description:
          "As espirais das sementes do girassol, as escamas das pinhas e a disposição das folhas na maioria das plantas convergem para o ângulo dourado — verificado em milhares de espécies.",
      },
      {
        domain: "Fracções contínuas",
        description:
          "φ tem o desenvolvimento em fracção contínua mais simples [1;1,1,…], o que o torna o número «mais irracional» — conceito-chave para a teoria KAM em mecânica clássica.",
      },
      {
        domain: "Quasicristais e Penrose",
        description:
          "As razões entre lados nos pavimentos de Penrose (e o factor de inflação) são exactamente φ; a mesma razão aparece em quasicristais reais descobertos na natureza em 2009.",
      },
      {
        domain: "Teoria dos números",
        description:
          "Os números de Fibonacci estão na base do teorema de Zeckendorf e de representações inteiras eficientes usadas em alguns algoritmos de compressão e estruturas de dados.",
      },
      {
        domain: "Cepticismo honesto",
        description:
          "As afirmações de que φ aparece no Parténon, na Mona Lisa, na concha do náutilo ou nas proporções do corpo humano são em grande parte mitos — desmontados, entre outros, por George Markowsky (1992).",
      },
    ],
    buffon: [
      {
        domain: "Integração Monte Carlo",
        description:
          "A agulha de Buffon é a semente histórica dos métodos de Monte Carlo — hoje usados em todo o lado, desde a avaliação financeira (Black–Scholes) até à simulação em física de partículas (Geant4) e ao rendering (path tracing).",
      },
      {
        domain: "Simulação física",
        description:
          "A amostragem aleatória de integrais em dimensão elevada em QCD na rede, engenharia nuclear e projecto de reactores estende a lógica de Buffon a milhões de dimensões.",
      },
      {
        domain: "Computação gráfica",
        description:
          "A amostragem estratificada de raios de luz nos modernos path tracers (Pixar, Cycles, Unreal Lumen) descende em linha directa da agulha de Buffon.",
      },
      {
        domain: "Ensino da estatística",
        description:
          "Demonstração introdutória padrão de probabilidades; ainda hoje realizada em aulas práticas de estatística de licenciatura em todo o mundo.",
      },
    ],
    hilberthotel: [
      {
        domain: "Teoria de conjuntos e ensino",
        description:
          "Analogia canónica para compreender a aritmética cardinal e a diferença entre infinitos numeráveis e não numeráveis.",
      },
      {
        domain: "Programar estruturas infinitas",
        description:
          "As listas preguiçosas infinitas em Haskell, os geradores em Python e os streams em Scala ecoam os rearranjos ao estilo hotel de Hilbert do infinito numerável.",
      },
      {
        domain: "Divulgação científica",
        description:
          "Vídeo da TED-Ed, Vsauce, PBS Infinite Series — a explicação moderna do infinito mais partilhada.",
      },
    ],
    gabrielshorn: [
      {
        domain: "Ensino do cálculo",
        description:
          "Exemplo padrão do início do cálculo de um integral impróprio contraintuitivo, presente em qualquer manual de cálculo do segundo ano.",
      },
      {
        domain: "Filosofia da matemática",
        description:
          "Citado em debates sobre o significado dos paradoxos geométricos e os limites da intuição física — experiência mental fundadora.",
      },
      {
        domain: "Microfluídica",
        description:
          "Análogos reais com fluxo capilar para canais cada vez mais estreitos (dispositivos microfluídicos) defrontam-se com os casos limite que o corno de Gabriel formaliza.",
      },
    ],
    cantor: [
      {
        domain: "Teoria da computabilidade",
        description:
          "A diagonal de Cantor produz directamente a prova do problema da paragem de Turing e os teoremas de incompletude de Gödel — pedras angulares da informática teórica.",
      },
      {
        domain: "Teoria das linguagens de programação",
        description:
          "Usada para mostrar que não existe um sistema de tipos «universal» que decida a verificação de tipos para todos os programas (teorema de Rice).",
      },
      {
        domain: "Criptografia e complexidade",
        description:
          "Os argumentos de diagonalização estão na base dos resultados modernos da teoria da complexidade — separações entre P, NP, EXP.",
      },
      {
        domain: "Filosofia da matemática",
        description:
          "O argumento de Cantor virou do avesso as visões aristotélica e kantiana do infinito, moldando a lógica e a filosofia analítica do século XX.",
      },
    ],
    boids: [
      {
        domain: "Efeitos visuais no cinema",
        description:
          "Batman Returns (enxame de morcegos de 1992), O Rei Leão (debandada de gnus de 1994) e inúmeros filmes modernos usam Boids — normalmente via Massive ou Houdini.",
      },
      {
        domain: "Enxames de drones",
        description:
          "Os shows de drones recordistas da Intel (Olimpíadas de PyeongChang 2018, Olimpíadas de Paris 2024) usam regras derivadas dos Boids em grande escala.",
      },
      {
        domain: "Simulação de multidões",
        description:
          "Os ateliers de arquitectura simulam evacuações de estádios e fluxos em centros comerciais com agentes ao estilo Boids — em uso no planeamento de estádios desde os anos 2000.",
      },
      {
        domain: "Enxames robóticos",
        description:
          "Os laboratórios de investigação usam regras ao estilo Boids para enxames robóticos autónomos em busca e salvamento e em monitorização agrícola.",
      },
      {
        domain: "Natureza real",
        description:
          "Estudos empíricos sobre murmurações de estorninhos (Cavagna et al., 2010), cardumes e manadas confirmam regras muito próximas dos Boids originais.",
      },
    ],
    aizawa: [
      {
        domain: "Investigação em sistemas dinâmicos",
        description:
          "O Aizawa pertence a uma família de atractores estranhos 3D usados para testar integradores numéricos, algoritmos de visualização e métodos de detecção de caos.",
      },
      {
        domain: "Arte matemática",
        description:
          "Os artistas generativos renderizam os atractores de Aizawa, Thomas e Halvorsen como plots, gravuras e animações vendidos na Etsy e em feiras de arte.",
      },
      {
        domain: "Ensino",
        description:
          "Cada vez mais usado a par do Lorenz nos cursos de mestrado em sistemas dinâmicos para mostrar uma fauna mais ampla de formas caóticas.",
      },
    ],
    dla: [
      {
        domain: "Electroquímica",
        description:
          "Os depósitos de zinco, cobre e outros metais obtidos em células electrolíticas formam dendrites do tipo DLA — directamente relevantes para galvanização, projecto de baterias (dendrites de lítio) e corrosão.",
      },
      {
        domain: "Crescimento cristalino",
        description:
          "A formação de flocos de neve, o gelo nas janelas e as dendrites minerais nas rochas — todas exibem leis de escala DLA.",
      },
      {
        domain: "Biologia",
        description:
          "As frentes de colónias bacterianas em placas de ágar, os cones de crescimento neuronal e a fronteira de alguns tumores seguem regras do tipo DLA.",
      },
      {
        domain: "Física dos relâmpagos",
        description:
          "A ramificação dos relâmpagos e os padrões de ruptura dieléctrica são bem modelados pela DLA.",
      },
    ],
    langton: [
      {
        domain: "Vida artificial",
        description:
          "A formiga de Langton é um exemplo fundador do campo da vida artificial que ele ajudou a fundar no Santa Fe Institute.",
      },
      {
        domain: "Informática teórica",
        description:
          "Usada como exemplo mínimo de computação universal em máquinas de Turing 2D; ainda hoje citada em artigos fundadores de complexidade.",
      },
      {
        domain: "Ensino",
        description:
          "Exemplo introdutório favorito nos cursos de autómatos celulares — a fase «auto-estrada» é um dos fenómenos emergentes mais acessíveis da informática.",
      },
    ],
    pascalmod: [
      {
        domain: "Teoria dos números",
        description:
          "O teorema de Lucas (1878) alimenta directamente algoritmos eficientes para coeficientes binomiais módulo primo — usados em criptografia, combinatória de palavras e programação competitiva.",
      },
      {
        domain: "Teoria de códigos",
        description:
          "Os códigos correctores Reed–Muller e BCH apoiam-se na maquinaria dos coeficientes binomiais módulo p — estão nos códigos QR, nas sondas de espaço profundo (Mariner 9, Voyager) e na TV digital DVB-T.",
      },
      {
        domain: "Artes visuais",
        description:
          "Pascal mod 2 é a origem algébrica do triângulo de Sierpiński — vendido em poster, tecido em tapetes e usado em instalações de galeria.",
      },
    ],
    sternbrocot: [
      {
        domain: "Música por computador e afinação",
        description:
          "Quem compõe música microtonal usa Stern–Brocot para encontrar aproximações temperadas das razões da entoação justa — central para a música xenarmónica.",
      },
      {
        domain: "Projecto de engrenagens em robótica",
        description:
          "A procura das melhores aproximações racionais para razões de transmissão percorre a árvore de Stern–Brocot para encontrar reduções mecânicas eficientes.",
      },
      {
        domain: "Sistemas de calendário",
        description:
          "As regras de ano bissexto baseadas em fracções contínuas (calendário persa, correcções gregorianas propostas) derivam das medianas de Stern–Brocot.",
      },
      {
        domain: "Renderização de imagem",
        description:
          "A amostragem subpixel e a moderna rasterização de tipos de letra usam medianas ao estilo Stern–Brocot para escolher as razões de cobertura de pixel.",
      },
    ],
    ulam: [
      {
        domain: "Teoria dos números pura",
        description:
          "Visualizar os primos através de espirais ao estilo de Ulam continua a inspirar novas conjecturas sobre densidades de primos polinomiais (Hardy–Littlewood, Sato–Tate).",
      },
      {
        domain: "Ensino",
        description:
          "Exposição habitual em museus de matemática e exploração introdutória em cursos de teoria dos números.",
      },
      {
        domain: "Arte generativa",
        description:
          "Obras derivadas da espiral de Ulam aparecem em exposições de artistas (Roman Verostko, Tristan Perich).",
      },
    ],
    cardioid: [
      {
        domain: "Engenharia de áudio",
        description:
          "Os microfones cardióides (os usados por qualquer podcaster ou profissional de broadcasting) devem o nome ao padrão de captação cardióide — sensíveis à frente e surdos atrás.",
      },
      {
        domain: "Projecto de antenas",
        description:
          "Alguns padrões de directividade de antenas são cardióides; comuns em VHF marítimo e equipamento de radiogoniometria.",
      },
      {
        domain: "Arquitectura e iluminação",
        description:
          "Os reflectores cardióides são usados na iluminação clássica de teatro (PAR cans) para projectar feixes assimétricos.",
      },
      {
        domain: "Ligação com Mandelbrot",
        description:
          "O bolbo principal do conjunto de Mandelbrot é exactamente uma cardióide; compreender a forma ilumina o diagrama de bifurcação de Mandelbrot.",
      },
    ],
    galton: [
      {
        domain: "Ensino da estatística",
        description:
          "A tábua de Galton é a demonstração canónica do teorema do limite central — presente em quase todos os museus de ciência (Deutsches Museum, Boston Museum of Science, MOSS Toronto).",
      },
      {
        domain: "Quincunce em genética",
        description:
          "Galton construiu a tábua original para tornar visível a estatística hereditária ao público vitoriano; lançou as bases da biometria e da genética estatística.",
      },
      {
        domain: "Plinko e game design",
        description:
          "As tábuas de Galton inspiraram o jogo televisivo Plinko e os modernos jogos móveis de pachinko e de slot, tanto físicos como digitais.",
      },
      {
        domain: "Análise de tolerâncias na indústria",
        description:
          "Os cálculos estatísticos de cadeias de tolerâncias em engenharia mecânica invocam directamente a lógica do teorema do limite central visualizada pela tábua de Galton.",
      },
    ],
    magpendulum: [
      {
        domain: "Demonstrações de caos",
        description:
          "O brinquedo de secretária «pêndulo de três ímanes» é a mais popular demonstração física das bacias de atracção fractais — vendido pela ThinkGeek, Nikola Labs e por muitas lojas de presentes científicos.",
      },
      {
        domain: "Investigação em levitação magnética",
        description:
          "A dinâmica dos pêndulos com íman permanente está na base dos comboios maglev, dos rolamentos magnéticos e dos amortecedores magneto-reológicos.",
      },
      {
        domain: "Ensino",
        description:
          "Demonstração padrão de dinâmica não linear na licenciatura em física; serve para ensinar espaço de fases, dissipação e sensibilidade ao estado final.",
      },
    ],
    godel: [
      {
        domain: "Fundamentos da matemática",
        description:
          "Gödel pôs fim ao programa de Hilbert de mecanização da matemática; remodelou o que o mundo matemático acredita ser demonstrável em princípio.",
      },
      {
        domain: "Informática",
        description:
          "A indefinibilidade da verdade de Tarski, o problema da paragem de Turing e o teorema de Rice são descendentes directos — presentes em qualquer cadeira de licenciatura em lógica e computabilidade.",
      },
      {
        domain: "Filosofia da mente",
        description:
          "O argumento de Penrose de que a mente humana não é puramente algorítmica (A Nova Mente do Imperador, 1989) apoia-se fortemente em Gödel — controverso mas influente.",
      },
      {
        domain: "Software verificado",
        description:
          "Os assistentes de prova modernos (Coq, Lean, Isabelle) defrontam-se diariamente com os limites de Gödel; toda a sua utilidade reside em formalizar o que é demonstrável dentro de um sistema explícito.",
      },
    ],
    halting: [
      {
        domain: "Compiladores e análise estática",
        description:
          "Os analisadores estáticos modernos (Coverity, Infer, o borrow checker do Rust) têm de renunciar a uma precisão perfeita porque as propriedades não triviais dos programas são indecidíveis — consequência directa do problema da paragem (teorema de Rice).",
      },
      {
        domain: "Antivírus",
        description:
          "Porque é que nenhum antivírus apanha todo o malware: detectar perfeitamente os programas hostis resolveria uma variante do problema da paragem.",
      },
      {
        domain: "Nuvens de computação",
        description:
          "Os autoscalers de nuvem nunca podem garantir que «este trabalho do utilizador termina» — impõem timeouts porque decidir a paragem é impossível.",
      },
      {
        domain: "Ensino",
        description:
          "A introdução canónica à indecidibilidade em todos os cursos de teoria da computação do planeta.",
      },
    ],
    pvsnp: [
      {
        domain: "Criptografia",
        description:
          "Se P = NP, o RSA, o AES, toda a blockchain e o tráfego protegido por TLS seriam quebrados de um dia para o outro — qualquer segredo digital moderno depende de P ≠ NP ser efectivamente verdade.",
      },
      {
        domain: "Optimização",
        description:
          "A logística (encaminhamento da UPS), o projecto de chips (place-and-route) e a procura de hiperparâmetros em aprendizagem automática atacam problemas NP-difíceis com heurísticas porque as soluções exactas são intratáveis.",
      },
      {
        domain: "IA e solvers SAT",
        description:
          "Os modernos solvers SAT/SMT (Z3, MiniSat) resolvem por rotina instâncias NP-difíceis com milhões de variáveis graças a heurísticas engenhosas, mesmo com complexidade exponencial no pior caso.",
      },
      {
        domain: "Bioinformática",
        description:
          "Enovelamento de proteínas, montagem de genomas e reconstrução de árvores filogenéticas são todos NP-difíceis — o que empurra o campo a inventar algoritmos de aproximação e métodos de IA (AlphaFold).",
      },
      {
        domain: "Prémio em aberto",
        description:
          "Um dos sete Problemas do Milénio do Clay, com um prémio de 1.000.000 de dólares para uma prova ou refutação.",
      },
    ],
    rsa: [
      {
        domain: "TLS / HTTPS",
        description:
          "Cada ícone de cadeado no browser envolve, no handshake inicial, RSA ou o seu primo em curvas elípticas (ECDSA) — milhares de milhões de vezes por segundo.",
      },
      {
        domain: "Assinaturas digitais",
        description:
          "A App Store da Apple, o Google Play e o Microsoft Update assinam cada lançamento com criptografia de chave pública ao estilo RSA; se fosse falsificável, o malware espalhar-se-ia livremente.",
      },
      {
        domain: "Banca e blockchain",
        description:
          "As mensagens SWIFT, as transacções com chip dos cartões e a maioria das carteiras blockchain assentam em hipóteses de dureza da factorização ou do logaritmo discreto equivalentes ao RSA.",
      },
      {
        domain: "Documentos de identificação",
        description:
          "Os passaportes modernos (ICAO 9303) contêm dados biométricos assinados com RSA; o controlo de fronteiras verifica a assinatura contra as CA nacionais.",
      },
      {
        domain: "Pânico pós-quântico",
        description:
          "O algoritmo de Shor quebra o RSA num computador quântico suficientemente grande; o NIST está em vias de padronizar sucessores pós-quânticos (Kyber, Dilithium).",
      },
    ],
    mobius: [
      {
        domain: "Tapetes industriais",
        description:
          "As correias de transmissão em fita de Möbius desgastam-se uniformemente em ambos os «lados» (só há um!) — usadas em velhas tipografias, em fitas modernas de gravação e em alguns sistemas VHS.",
      },
      {
        domain: "Engenharia mecânica",
        description:
          "Foram patenteadas engrenagens de Möbius e resistências em forma de Möbius para reduzir para metade, respectivamente, o desgaste e a indutância.",
      },
      {
        domain: "Investigação em topologia",
        description:
          "A fita de Möbius é a mais simples superfície não orientável — porta de entrada para um vasto campo que classifica todas as superfícies, usado em cosmologia e teoria de cordas.",
      },
      {
        domain: "Arte e arquitectura",
        description:
          "A Fita sem fim de Max Bill, o triângulo do símbolo da reciclagem e arquitectos do México a Astana usam a topologia de Möbius para instalações marcantes.",
      },
      {
        domain: "Química",
        description:
          "As moléculas aromáticas de Möbius (Heilbronner 1964; primeira síntese em 2003) trazem uma meia-torção de π nos seus electrões e mostram propriedades electrónicas que nenhum anel plano consegue ter.",
      },
    ],
    eulerchar: [
      {
        domain: "Computação gráfica",
        description:
          "A validação de malhas (Blender, Maya) compara V−A+F com o χ esperado para detectar buracos ou geometria duplicada antes da impressão 3D.",
      },
      {
        domain: "Topologia dos dados",
        description:
          "As pipelines de homologia persistente usam características de Euler para sintetizar a forma de nuvens de pontos em alta dimensão — aplicado em genómica, redes de sensores e cosmologia.",
      },
      {
        domain: "Arquitectura",
        description:
          "As cúpulas geodésicas de Buckminster Fuller (Spaceship Earth em Epcot, Biosphère de Montreal) são desenhadas para que V−A+F=2 force exactamente 12 pentágonos entre os hexágonos.",
      },
      {
        domain: "Design da bola de futebol",
        description:
          "A clássica bola em icosaedro truncado tem 12 pentágonos e 20 hexágonos; a fórmula de Euler explica por que são exactamente 12, nem um a menos.",
      },
      {
        domain: "Física de partículas",
        description:
          "O teorema do índice de Atiyah-Singer, fundamental para a teoria de gauge moderna, generaliza a fórmula de Euler e liga topologia e equações diferenciais.",
      },
    ],
    konigsberg: [
      {
        domain: "Nascimento da teoria de grafos",
        description:
          "Königsberg deu o pontapé de saída a todo o campo — a teoria de grafos está hoje na base do PageRank do Google, da análise de redes sociais, do layout de chips e do planeamento de rotas.",
      },
      {
        domain: "Sequenciação de ADN",
        description:
          "Os algoritmos de caminho euleriano inspirados em Königsberg são o cavalo de tracção da montagem moderna de genomas (Pevzner e Tang, 2001; usados no SPAdes, Velvet, megahit).",
      },
      {
        domain: "Optimização de rotas",
        description:
          "Carteiros, camiões do lixo e limpa-neves resolvem o problema do carteiro chinês — descendente directo das pontes de Königsberg.",
      },
      {
        domain: "Turismo",
        description:
          "Caliningrado (a actual Königsberg) explora turisticamente as pontes; quem visita tenta o passeio, ainda que só cinco das sete originais tenham sobrevivido à Segunda Guerra Mundial.",
      },
    ],
    fourcolor: [
      {
        domain: "Desenho de mapas",
        description:
          "Cartógrafos e engenheiros SIG usam realmente algoritmos de coloração a quatro cores em mapas políticos, atlas por país e visualização meteorológica.",
      },
      {
        domain: "Redes móveis",
        description:
          "A atribuição de frequências entre torres de telemóvel reduz-se a uma coloração de grafos — o teorema das quatro cores marca o caso limite para certos arranjos planares.",
      },
      {
        domain: "Escalonamento",
        description:
          "Os calendários de exames universitários, a atribuição de salas de conferência e os calendários desportivos são todos problemas de coloração de grafos; as variantes planares herdam o limite das quatro cores.",
      },
      {
        domain: "Matemática verificada por computador",
        description:
          "Em conjunto com a conjectura de Kepler, o teorema das quatro cores foi um marco da prova assistida por computador — a cultura dos assistentes de prova (Coq, Lean) busca aqui a sua legitimidade.",
      },
    ],
    smallworld: [
      {
        domain: "Redes sociais",
        description:
          "A funcionalidade «contactos de 2.º grau» do LinkedIn, as cascatas de retweets do Twitter e os «pessoas que talvez conheças» do Facebook tiram partido da estrutura de mundo pequeno para encontrar relevância.",
      },
      {
        domain: "Modelos epidémicos",
        description:
          "A modelação da propagação da COVID-19, as apps de rastreio de contactos e as estratégias de vacinação usam modelos de rede de mundo pequeno para prever a dinâmica de surtos.",
      },
      {
        domain: "Investigação cerebral",
        description:
          "Estudos de ressonância magnética funcional mostram que o conectoma humano é uma rede de mundo pequeno — o coeficiente de mundo pequeno é hoje um biomarcador padrão na investigação sobre Alzheimer e esquizofrenia.",
      },
      {
        domain: "Encaminhamento da Internet",
        description:
          "O grafo dos sistemas autónomos da Internet tem propriedades de mundo pequeno; o BGP e os CDN modernos (Cloudflare, Fastly) tiram partido das curtas distâncias em saltos.",
      },
      {
        domain: "Six Degrees of Kevin Bacon",
        description:
          "O jogo cinéfilo de 1994 e o site do Bacon Number são artefactos pop da teoria do mundo pequeno; quem faz matemática disputa números de Erdős baixos.",
      },
    ],
    diffusion: [
      {
        domain: "Geração de imagens",
        description:
          "Stable Diffusion, Midjourney, DALL·E 3 e Imagen são todos modelos de difusão latente. Escreves um prompt e o modelo percorre ruído gaussiano até uma imagem consistente com o texto.",
      },
      {
        domain: "Geração de vídeo",
        description:
          "Sora, Veo e Runway estendem a mesma matemática de difusão a três dimensões (altura × largura × tempo), para que o denoiser aprenda coerência espácio-temporal além da aparência.",
      },
      {
        domain: "Conceção de fármacos e proteínas",
        description:
          "O RFdiffusion (laboratório Baker) e o Chroma geram novos esqueletos proteicos a remover ruído sobre coordenadas 3D em vez de píxeis — candidatos publicados foram sintetizados e dobram corretamente.",
      },
      {
        domain: "Áudio e voz",
        description:
          "AudioLDM, Riffusion e a linha de síntese vocal ElevenLabs/Vall-E usam difusão 1D sobre formas de onda ou espectrogramas para gerar música e vozes naturais a partir de texto.",
      },
      {
        domain: "Física e termodinâmica",
        description:
          "O processo direto é literalmente dinâmica de Langevin — o calendário de ruído reflete um sistema a relaxar para o equilíbrio térmico. O artigo original de Sohl-Dickstein (2015) foi formulado como termodinâmica fora do equilíbrio.",
      },
    ],
    quine: [
      {
        domain: "Teoria das linguagens de programação",
        description:
          "As quines são o teste de sanidade padrão para verificar se uma linguagem é suficientemente expressiva para a autorreferência; os cursos de teoria da computação usam-nas para ensinar o teorema da recursão de Kleene de forma concreta.",
      },
      {
        domain: "Vírus informáticos e autorreplicadores",
        description:
          "Cada vírus, worm e motor metamórfico clássico é uma variante de quine: código que se copia antes de fazer qualquer outra coisa. O malware autorreplicante moderno é estudado como engenharia de quines aplicada.",
      },
      {
        domain: "Genética e biologia molecular",
        description:
          "A replicação do ADN é a quine da biologia: uma sequência cuja única tarefa é copiar-se a si própria, incluindo a maquinaria de cópia. Hofstadter traça a analogia explicitamente em Gödel, Escher, Bach.",
      },
      {
        domain: "Bootstrapping de compiladores",
        description:
          "Trusting Trust (Ken Thompson, 1984) mostrou que o compilador de um compilador pode ser uma quine que insere uma backdoor em cada build — fundamento da segurança da cadeia de fornecimento e da investigação em builds reproduzíveis.",
      },
      {
        domain: "Demoscene e arte de código",
        description:
          "As quines poliglotas — programas que se imprimem a si próprios e são válidos em várias linguagens em simultâneo — são um género adorado da arte de código; o IOCCC tem uma categoria dedicada às quines.",
      },
    ],
    riemann: [
      {
        domain: "Teorema dos números primos",
        description:
          "O termo de erro na contagem de primos abaixo de N é controlado pelos zeros de ζ; a hipótese de Riemann equivale ao limite mais apertado possível sobre quão irregularmente os primos estão distribuídos.",
      },
      {
        domain: "Criptografia",
        description:
          "RSA, a criptografia de curvas elípticas e a dureza da factorização dependem de hipóteses sobre a distribuição dos primos; enunciados RH-equivalentes alimentam os melhores limites conhecidos sobre a segurança criptográfica.",
      },
      {
        domain: "Caos quântico",
        description:
          "A estatística dos espaçamentos entre zeros de zeta coincide com a dos valores próprios de grandes matrizes hermíticas aleatórias — as mesmas usadas para modelar os níveis de energia de núcleos pesados. A conjectura de Montgomery-Dyson (1972) é uma das pontes mais surpreendentes da matemática.",
      },
      {
        domain: "Numérica verificada por computador",
        description:
          "Os primeiros 10^13 zeros não triviais foram calculados sobre a recta crítica (Xavier Gourdon, 2004 e sucessores). Nenhuma campanha de verificação alguma vez encontrou contraexemplo a RH.",
      },
      {
        domain: "Divulgação e prestígio dos problemas em aberto",
        description:
          "Riemann é o problema em aberto mais famoso fora de Fermat — um Clay Millennium Prize (1 M$), aparições recorrentes na ficção (Uma Mente Brilhante, A música dos primos) e um fluxo constante de «provas» que não sobrevivem à revisão por pares.",
      },
    ],
    backprop: [
      {
        domain: "Aprendizagem profunda",
        description:
          "Toda rede neuronal moderna — classificadores de imagens, modelos de linguagem, recomendadores — é treinada por retropropagação. PyTorch e JAX implementam-na como o núcleo de diferenciação (autograd).",
      },
      {
        domain: "Visão computacional",
        description:
          "As redes convolucionais para imagem médica, condução autónoma e identificação biométrica aprendem os seus kernels de filtro directamente a partir de dados rotulados com backprop; os gradientes correm para trás através das convoluções e do pooling.",
      },
      {
        domain: "Modelos de linguagem",
        description:
          "GPT, Claude, Llama e cada transformer treinam retropropagando a entropia cruzada por biliões de parâmetros. O único algoritmo que escala de um neurónio a um bilião.",
      },
      {
        domain: "Robótica e controlo",
        description:
          "Os métodos policy-gradient em aprendizagem por reforço usam backprop para actualizar controladores neuronais a partir de sinais de recompensa; os modernos robots bípedes e de manipulação destra usam-no todos.",
      },
      {
        domain: "Problemas inversos na ciência",
        description:
          "Os físicos invertem experiências montando o modelo directo em PyTorch/JAX e retropropagando através dele — usado em design de proteínas (AlphaFold), renderização diferenciável e design experimental baseado em gradientes.",
      },
    ],
  },
  sv: {
    eml: [
      {
        domain: "Symbolisk regression",
        description:
          "Datoralgebra-system som försöker återupptäcka fysikaliska lagar ur data använder ibland kompakta operatoralfabet som EML för att begränsa sökrymden.",
      },
      {
        domain: "Teoretisk datavetenskap",
        description:
          "EML är släkt med universella mängder som NAND i logik och Iota bland kombinatorer – intressant för vad den säger om hur liten en primitiv kan vara.",
      },
    ],
    mandelbrot: [
      {
        domain: "Generativ konst och motion graphics",
        description:
          "Filmskapare och digitala konstnärer zoomar in i Mandelbrotmängden för att skapa bakgrunder till allt från musikvideor till öppningssekvenser i Apples keynotes.",
      },
      {
        domain: "Fraktala antenner",
        description:
          "Mandelbrot-/Julia-formade gränser används i vissa kompakta multibandsantenner (till exempel i tidiga Bluetooth-moduler) eftersom den självlika formen resonerar över många frekvenser.",
      },
      {
        domain: "Undervisning",
        description:
          "Standardexempel i universitetsundervisning om komplex dynamik, deterministiskt kaos och gränsen mellan ordning och kaos.",
      },
      {
        domain: "Naturanaloger",
        description:
          "Kustlinjer, bergskammar, ormbunksblad och broccolibuketter uppvisar samma självlika gränsstruktur – det var precis Mandelbrots poäng med den fraktala geometrin.",
      },
    ],
    life: [
      {
        domain: "Datavetenskaplig undervisning",
        description:
          "Varje datavetenskapligt program, från MIT 6.001 till gymnasieklubbar, använder Conways Life för att lära ut emergens, cellulära automater och Turing-fullständighet på en eftermiddag.",
      },
      {
        domain: "Generativ konst",
        description:
          "Designers använder Life och dess varianter (HighLife, Day & Night …) för att skapa ständigt föränderlig grafik till musikvideor, installationer och skärmsläckare.",
      },
      {
        domain: "Modellering av diskret biologi",
        description:
          "Demografi, byte-rovdjursdynamik och epidemispridning prototypas ibland på Life-liknande rutnät innan man går vidare till rikare agentbaserade modeller.",
      },
      {
        domain: "Hårdvarumeck",
        description:
          "FPGA- och mikrokontrollerprojekt visar ofta Life på LED-matriser som «hello world» för parallell cellulär hårdvara.",
      },
    ],
    nand: [
      {
        domain: "I varje chip",
        description:
          "Från Apples M-serie till industriella mikrokontroller etsas miljarder NAND-grindar in i kisel varje minut. Många digitala ASIC syntetiseras enbart med NAND.",
      },
      {
        domain: "Flashminne",
        description:
          "NAND-flashminne (USB-minnen, SSD, smarttelefoner) har fått namn och arkitektur från NAND-grindar arrangerade i matriser av floating-gate-transistorer.",
      },
      {
        domain: "Hårdvarukurser",
        description:
          "Kursen nand2tetris bygger en komplett dator utgående från ett enda NAND-chip – används vid över 100 universitet.",
      },
      {
        domain: "Inbäddad logik",
        description:
          "Diskreta 74HC00-kretsar med fyra NAND-grindar tillverkas än idag för enkel glue logic, nivåomvandlare och oscillatorer på hobby-PCB.",
      },
    ],
    iota: [
      {
        domain: "Kombinator-tolkar",
        description:
          "Kompilatorer för funktionella språk (till exempel Lazy K) översätter lambdakalkylprogram till rena kombinatoruttryck – i Iota-stil – som en del av kodgenereringen.",
      },
      {
        domain: "Esoteriska språk",
        description:
          "Iota och dess syskon Jot är minimalistiska programmeringsspråk som används för att studera den minsta möjliga Turing-fullständiga syntaxen.",
      },
      {
        domain: "Undervisning i lambdakalkyl",
        description:
          "Universitet använder Iota för att visa att en enda kombinator räcker, och därigenom skilja syntax från beräkningskraft.",
      },
    ],
    rule110: [
      {
        domain: "Wolfram Physics Project",
        description:
          "Stephen Wolframs program för att finna universums underliggande regel åberopar uttryckligen Regel 110 som bevis på att mycket små regler kan vara universellt beräknande.",
      },
      {
        domain: "Undervisning i formell beräkning",
        description:
          "Citeras i varje modern introduktion till cellulära automater som det enklaste kända universella systemet – en Turing-maskin i tweet-format.",
      },
      {
        domain: "Procedurellt texturbrus",
        description:
          "Vissa shader-bibliotek använder Regel 110 (och 30) som billig källa till komplext 1D-brus för stiliserad generativ grafik.",
      },
    ],
    logistic: [
      {
        domain: "Populationsbiologi",
        description:
          "Den kontinuerliga logistiska ekvationen modellerar strikt begränsade populationer av bakterier, jäst och även vissa däggdjur; den diskreta avbildningen lärs ut i varje kurs i kvantitativ ekologi.",
      },
      {
        domain: "Epidemiologi",
        description:
          "Begränsad epidemisk tillväxt (med bärförmåga = mottaglig population) följer logistiska kurvor – de kumulativa COVID-19-kurvorna var ett läroboksexempel.",
      },
      {
        domain: "Maskininlärning",
        description:
          "Inlärningsfrekvensens scheman i djupinlärning hamnar ibland i samma kaos via period­dubbling när hastigheten blir för stor; den logistiska avbildningen ger intuitionen.",
      },
      {
        domain: "Neurovetenskap",
        description:
          "Modeller för neuroners fyrfrekvens vid höga ingångsströmmar bifurkerar precis som den logistiska avbildningen och förutsäger uppkomsten av oregelbundna spikar.",
      },
      {
        domain: "Klimat och väder",
        description:
          "Period­dubbling i Feigenbaum-stil har återskapats experimentellt i konvektionsceller och visar samma universella väg till turbulens.",
      },
    ],
    lorenz: [
      {
        domain: "Väderprognos",
        description:
          "Operativa prognosmakare använder ensemble-metoder eftersom atmosfären delar Lorenz känslighet för begynnelsevillkor – förutsägbarheten kollapsar efter ungefär 14 dagar.",
      },
      {
        domain: "Klimatmodellering",
        description:
          "Lorenz artikel från 1963 grundlade den moderna kaosteorin och formar hur vi läser förutsägbarhetsgränser för långsiktiga klimatsimuleringar.",
      },
      {
        domain: "Undervisning",
        description:
          "Varje grundkurs i dynamiska system visualiserar Lorenz-attraktorn som den kanoniska konstiga attraktorn.",
      },
      {
        domain: "Säker kommunikation",
        description:
          "Kaosbaserade krypteringsmetoder har använt synkronisering i Lorenz-stil för att dölja signaler – nisch men verklig (Cuomo och Oppenheim, 1993).",
      },
    ],
    fourier: [
      {
        domain: "MP3, AAC, Opus",
        description:
          "Alla moderna förlustbenägna ljudkodek transformerar korta ljudfönster till frekvensdomänen, kastar ohörbara komponenter och transformerar tillbaka.",
      },
      {
        domain: "JPEG och HEIC",
        description:
          "Varje 8×8 pixlars block i en JPEG lagras som koefficienter för den diskreta cosinustransformen – därför har JPEG-ringning horisontella och vertikala mönster.",
      },
      {
        domain: "MRI-skannrar",
        description:
          "En MRI-maskin mäter bokstavligen Fourier-koefficienter (k-rummet) av dina vävnader och transformerar tillbaka dem till bilden du ser hos läkaren.",
      },
      {
        domain: "Wi-Fi, 5G, DSL",
        description:
          "Modern trådlös och trådbunden överföring använder OFDM, som lägger data på tusentals noggrant placerade sinusbärare – ren Fourier-ingenjörskonst.",
      },
      {
        domain: "Tal och ML",
        description:
          "Mel-spektrogram-features (Fourier-transformerat ljud) är indata till nästan varje modell för taligenkänning och röstassistent.",
      },
    ],
    euler: [
      {
        domain: "Signalbehandling",
        description:
          "Varje DSP-lärobok använder e^{iωt} som kanonisk komplex sinusvåg; FFT, Z-transform och filterdesign lever på Eulers formel.",
      },
      {
        domain: "Kvantmekanik",
        description:
          "Vågfunktioner är komplexa exponentialfunktioner; fasfaktorerna e^{iθ} bär de interferensmönster som gör kvantmekaniken kvantmekanisk.",
      },
      {
        domain: "Växelströmsanalys",
        description:
          "Elektroingenjörer modellerar växelspänningar och -strömmar som komplexa exponentialfunktioner – impedansräkning med fasorer är en direkt tillämpning av Eulers formel.",
      },
      {
        domain: "Reglerteknik",
        description:
          "Stabiliteten hos återkopplade system avläses i polernas läge i det komplexa planet – Eulers formel är bron mellan tid och frekvens.",
      },
    ],
    banach: [
      {
        domain: "Mängdteoretisk undervisning",
        description:
          "Banach–Tarski är läroboksexemplet på varför urvalsaxiomet är kontroversiellt – det dyker upp i varje fördjupningskurs i reell analys.",
      },
      {
        domain: "Matematikens grundvalar",
        description:
          "Det motiverade 1900-talets arbete med alternativa mängdteoretiska grundvalar (konstruktivism, intuitionism) och påverkade datorverifierade bevis.",
      },
      {
        domain: "Matematikens filosofi",
        description:
          "Åberopas ofta i diskussioner om matematisk realism, betydelsen av «oändlighet» och intuitionens gränser.",
      },
    ],
    lsystem: [
      {
        domain: "Procedurella växter i spel och film",
        description:
          "Träd, ormbunkar och gräs i titlar som Lejonkungen (1994), Avatar (2009) och otaliga moderna spel genereras med L-system via SpeedTree och liknande mellanvara.",
      },
      {
        domain: "Arkitektur och CAD",
        description:
          "Generativa arkitekturverktyg (Grasshopper för Rhino) använder L-system för att låta förgrenade strukturer, fasader och gatunät växa fram.",
      },
      {
        domain: "Växtbiologisk forskning",
        description:
          "Växtbiologer anpassar L-system till verkliga arter (till exempel äppelträdets topologi) för att studera tillväxtdynamik, ljuskonkurrens och avkastningsoptimering.",
      },
      {
        domain: "Musikkomposition",
        description:
          "Kompositörer mappar L-system-strängar till MIDI-händelser för att algoritmiskt odla teman som utvecklar fraktal självlikhet över tid.",
      },
    ],
    wang: [
      {
        domain: "Realtidsgrafik",
        description:
          "Wang-tile-uppsättningar används för att packa icke-repeterande texturer (gräs, tegel, sand) i mycket små texturatlas – viktigt på minnesbegränsade enheter som mobil-GPU:er.",
      },
      {
        domain: "Procedurell leveldesign",
        description:
          "Spelmotorer (Houdini, egenbyggda roguelike-motorer) använder Wang-plattor för att sätta ihop stora dungeon- och världskartor från små modulära byggstenar utan synliga skarvar.",
      },
      {
        domain: "Material och kvasikristaller",
        description:
          "Teorin om Wang-plattor överlappar delvis med kvasikristallernas matematik – båda producerar aperiodiska oändliga arrangemang.",
      },
    ],
    collatz: [
      {
        domain: "Öppet problem inom ren matematik",
        description:
          "Räknas till de mest berömda öppna problemen inom elementär talteori; verifierat med dator upp till 2,95×10²⁰ per 2024.",
      },
      {
        domain: "Distribuerad beräkning",
        description:
          "Projektet BOINC / collatzconjecture.org crowdsourcar sökandet efter ett motexempel med hjälp av frivilligt skänkt GPU-tid.",
      },
      {
        domain: "Pedagogik",
        description:
          "Används i högstadiedemonstrationer av «taltrick» och i kandidatprojekt om heltalsföljder.",
      },
    ],
    doublependulum: [
      {
        domain: "Robotik",
        description:
          "Robotarmar med två länkar är matematiskt dubbelpendlar; att förstå deras icke-linjära koppling är avgörande för stabil styrning av industrirobotar.",
      },
      {
        domain: "Biomekanik",
        description:
          "Människans lemmar under gång, kast och gymnastiska rörelser modelleras som multipendel-system inom forskning kring rehabilitering och proteser.",
      },
      {
        domain: "Vetenskapsmuseer",
        description:
          "Dubbelpendel-utställningar på museer (till exempel Exploratorium, Deutsches Museum) demonstrerar fysiskt fjärilseffekten för besökare.",
      },
      {
        domain: "Akrobatik och rigging",
        description:
          "Cirque du Soleil och scenens riggare måste förstå pendel-på-pendel-dynamik för säkra koreografier i trapets och luftakrobatik.",
      },
    ],
    bzr: [
      {
        domain: "Hjärtrytmrubbningar",
        description:
          "Spiralvågmönster mycket lika BZR-spiralerna observeras på hjärtats yta vid flimmer – centralt för forskning kring och design av defibrillatorer.",
      },
      {
        domain: "Neurovetenskap",
        description:
          "Kortikal spridande depolarisering (en våg av neuronal depolarisering kopplad till migrän) modelleras som ett BZR-liknande exciterbart medium.",
      },
      {
        domain: "Kemiundervisning",
        description:
          "BZR är den mest slående demonstrationen av «levande kemi» en kemilärare på gymnasiet kan visa – synlig oscillation i en kolv.",
      },
      {
        domain: "Nobelprisbelönt teori",
        description:
          "Ilya Prigogine fick Nobelpriset 1977 för teorin om dissipativa strukturer, grundad i system som BZR.",
      },
    ],
    turingpattern: [
      {
        domain: "Utvecklingsbiologi",
        description:
          "Ränder på zebrafiskar, mellanrum mellan hårfolliklar hos möss, bildning av fingeravtryck och fingermönster hos ryggradsdjursembryon har alla uppmätts följa Turing-dynamik.",
      },
      {
        domain: "Växtfyllotaxi",
        description:
          "Spiralarrangemangen av solrosfrön, kottefjäll och ananasfjäll uppstår ur reaktion-diffusion plus den gyllene vinkeln – Turing-kemi på en växande yta.",
      },
      {
        domain: "Generativ konst och grafik",
        description:
          "Reaktion-diffusion-mönster används brett som procedurellt texturbrus (hud, bark, korall) i 3D-verktyg som Substance Designer och Houdini.",
      },
      {
        domain: "Läkemedelsfrisättning och material",
        description:
          "Självorganiserande mikrostrukturer i polymermembran och läkemedelsfrisättande beläggningar designas utifrån instabiliteter av Turing-typ.",
      },
    ],
    sierpinski: [
      {
        domain: "Fraktala antenner",
        description:
          "Sierpiński-triangelantenner är kommersiella produkter – mobiltelefoner, Wi-Fi-routrar och GPS-enheter använder multibands fraktal-patchar som resonerar vid många frekvenser på liten yta.",
      },
      {
        domain: "Värmeväxlare",
        description:
          "Förgrenade kanaler i Sierpiński-stil förekommer i tryckta kylplattor för högeffekts-LED och chip-kylning, där de maximerar ytan.",
      },
      {
        domain: "Kompression och grafik",
        description:
          "Iterated Function Systems (IFS i Sierpiński-stil) ligger bakom fraktal bildkompressionsalgoritmer – fortfarande i bruk i nischade kodare för flygbilder.",
      },
      {
        domain: "Nätverk",
        description:
          "Hierarkisk IP-routning och trädtopologier ärver fraktala skalningsegenskaper i Sierpiński-stil för lastbalansering.",
      },
    ],
    chaosgame: [
      {
        domain: "Bioinformatik",
        description:
          "Chaos Game Representation (CGR) är ett standardsätt att visualisera DNA-sekvenser – varje nukleotid styr en punkt mot ett av fyra hörn i en kvadrat, och arter klustrar i igenkännbara fraktala signaturer.",
      },
      {
        domain: "Fraktal kompression",
        description:
          "Barnsleys fraktala bildkompression kodar bilder som en liten uppsättning kontraherande avbildningar som återskapas via kaosspelet.",
      },
      {
        domain: "Procedurell texturering",
        description:
          "Utdata från kaosspelet (varianter av Barnsleys ormbunke) används brett för procedurellt lövverk och stiliserade penseldrag.",
      },
    ],
    penrose: [
      {
        domain: "Kvasikristaller",
        description:
          "Dan Shechtmans upptäckt 1982 av metalliska kvasikristaller (Nobelpriset 2011) förstods via Penrose-mosaiker – samma femfaldiga matematik styr båda.",
      },
      {
        domain: "Arkitektur",
        description:
          "Fasaden på Storey Hall i Melbourne och flera matematisk-islamiska mönster i Topkapı-palatset använder aperiodisk geometri i Penrose-stil.",
      },
      {
        domain: "Materialvetenskap",
        description:
          "Kvasikristallina beläggningar (till exempel på Sjöbos nonstick-pannor) är kommersiella idag och utnyttjar atomarrangemang i Penrose-mosaikens stil.",
      },
      {
        domain: "Kryptografi",
        description:
          "Nyligen föreslagna pseudoslumptalsgeneratorer använder sekvenser från aperiodiska mosaiker för lågdiskrepant sampling.",
      },
    ],
    apollonian: [
      {
        domain: "Granulär packning",
        description:
          "Hur sand, grus och farmaceutiska pulver fyller kärl modelleras med apolloniska sfärpackningar – viktigt för betong, tabletter och pulvermetallurgi.",
      },
      {
        domain: "Talteori",
        description:
          "Heltalsmässiga apolloniska packningar studeras av analytisk talteori – arbeten av Sarnak, Bourgain och Kontorovich gav nya resultat om primtalskrökningar.",
      },
      {
        domain: "Skum- och emulsionsfysik",
        description:
          "Skumstrukturer (ölskum, livsmedelsemulsioner, lungalveoler) ärver vid sin bildning packningsvillkor i apolloniansk stil.",
      },
      {
        domain: "Grafisk design",
        description:
          "Logotyper, affischer och tatueringsdesign använder apolloniska gasketter för slagkraftig radiell geometri.",
      },
    ],
    phi: [
      {
        domain: "Växtfyllotaxi",
        description:
          "Solrosens frönspiraler, kottefjäll och bladplaceringen hos de flesta växter konvergerar mot den gyllene vinkeln – verifierat hos tusentals arter.",
      },
      {
        domain: "Kedjebråk",
        description:
          "φ har den enklaste kedjebråksutvecklingen [1;1,1,…], vilket gör den till det «mest irrationella» talet – ett nyckelbegrepp för KAM-teorin i klassisk mekanik.",
      },
      {
        domain: "Kvasikristaller och Penrose",
        description:
          "Sidlängdsförhållandena i Penrose-mosaiker (och inflationsfaktorn) är exakt φ; samma förhållande dyker upp i verkliga kvasikristaller som upptäcktes i naturen 2009.",
      },
      {
        domain: "Talteori",
        description:
          "Fibonacci-talen ligger bakom Zeckendorfs sats och effektiva heltalsrepresentationer som används i vissa kompressions- och datastruktur-algoritmer.",
      },
      {
        domain: "Ärlig skepsis",
        description:
          "Påståenden om att φ skulle finnas i Parthenon, Mona Lisa, nautilusskalet eller människans kroppsproportioner är till stor del myter – avlivade bland annat av George Markowsky (1992).",
      },
    ],
    buffon: [
      {
        domain: "Monte Carlo-integration",
        description:
          "Buffons nål är det historiska fröet till Monte Carlo-metoderna – idag i bruk överallt, från finansiell prissättning (Black–Scholes) till partikelfysiksimulering (Geant4) och rendering (path tracing).",
      },
      {
        domain: "Fysiksimulering",
        description:
          "Slumpmässig sampling av högdimensionella integraler i gitter-QCD, kärnteknik och reaktordesign utökar Buffons logik till miljontals dimensioner.",
      },
      {
        domain: "Datorgrafik",
        description:
          "Stratifierad sampling av ljusstrålar i moderna path tracers (Pixar, Cycles, Unreal Lumen) härstammar i rakt nedstigande led från Buffons nål.",
      },
      {
        domain: "Statistikundervisning",
        description:
          "Standard-introduktion till sannolikhetslära; utförs fortfarande i grundlabb i statistik världen över.",
      },
    ],
    hilberthotel: [
      {
        domain: "Mängdteori och undervisning",
        description:
          "Den kanoniska analogin för att förstå kardinalaritmetik och skillnaden mellan uppräkneliga och icke-uppräkneliga oändligheter.",
      },
      {
        domain: "Programmering av oändliga strukturer",
        description:
          "Lata oändliga listor i Haskell, generatorer i Python och strömmar i Scala ekar Hilberts hotellets omdisponeringar av den uppräkneliga oändligheten.",
      },
      {
        domain: "Populärvetenskaplig kommunikation",
        description:
          "TED-Ed-video, Vsauce, PBS Infinite Series – den modernaste och mest spridda förklaringen av oändlighet.",
      },
    ],
    gabrielshorn: [
      {
        domain: "Analysundervisning",
        description:
          "Standardexemplet i tidig analys på en kontraintuitiv generaliserad integral, i varje lärobok i andra årets analys.",
      },
      {
        domain: "Matematikens filosofi",
        description:
          "Citeras i debatter om innebörden av geometriska paradoxer och fysisk intuitions gränser – ett grundläggande tankeexperiment.",
      },
      {
        domain: "Mikrofluidik",
        description:
          "Verkliga analoger med kapillärdrivet flöde i allt smalare kanaler (mikrofluidiska enheter) ställs inför de gränsfall som Gabriels horn formaliserar.",
      },
    ],
    cantor: [
      {
        domain: "Beräkningsbarhetsteori",
        description:
          "Cantors diagonal ger direkt Turings bevis för stopproblemet och Gödels ofullständighetssatser – grundpelarna i teoretisk datavetenskap.",
      },
      {
        domain: "Programspråksteori",
        description:
          "Används för att visa att det inte finns något «universellt» typsystem som avgör typkontroll för alla program (Rices sats).",
      },
      {
        domain: "Kryptografi och komplexitet",
        description:
          "Diagonaliseringsargument ligger bakom moderna resultat i komplexitetsteori – separationer mellan P, NP, EXP.",
      },
      {
        domain: "Matematikens filosofi",
        description:
          "Cantors argument vände upp och ner på aristoteliska och kantianska syner på oändligheten och formade 1900-talets logik och analytiska filosofi.",
      },
    ],
    boids: [
      {
        domain: "Visuella effekter på film",
        description:
          "Batman – återkomsten (fladdermussvärmen 1992), Lejonkungen (gnu-stampedjen 1994) och otaliga moderna filmer använder Boids – oftast via Massive eller Houdini.",
      },
      {
        domain: "Drönarsvärmar",
        description:
          "Intels rekordsättande drönarshow-er (OS i Pyeongchang 2018, OS i Paris 2024) använder regler härledda från Boids i mycket stor skala.",
      },
      {
        domain: "Folkmassesimulering",
        description:
          "Arkitektkontor simulerar arenautrymningar och flöden i köpcentrum med Boids-liknande agenter – i bruk i arenaplanering sedan 2000-talet.",
      },
      {
        domain: "Robotsvärmar",
        description:
          "Forskningslabb använder Boids-liknande regler för autonoma robotsvärmar inom sök-och-räddning och jordbruksövervakning.",
      },
      {
        domain: "Verklig natur",
        description:
          "Empiriska studier av starmurmurationer (Cavagna m.fl., 2010), fiskstim och flockande däggdjur bekräftar regler som ligger mycket nära de ursprungliga Boids.",
      },
    ],
    aizawa: [
      {
        domain: "Forskning om dynamiska system",
        description:
          "Aizawa tillhör en familj av tredimensionella konstiga attraktorer som används för att testa numeriska integratorer, visualiseringsalgoritmer och kaosdetektionsmetoder.",
      },
      {
        domain: "Matematisk konst",
        description:
          "Generativa konstnärer renderar Aizawa-, Thomas- och Halvorsen-attraktorer som plottar, tryck och animationer som säljs på Etsy och konstmässor.",
      },
      {
        domain: "Undervisning",
        description:
          "Används allt oftare jämsides med Lorenz i forskarutbildningskurser i dynamiska system för att visa en bredare flora av kaotiska former.",
      },
    ],
    dla: [
      {
        domain: "Elektrokemi",
        description:
          "Zink-, koppar- och andra metallavlagringar i elektrolysceller bildar DLA-typ-dendriter – direkt relevant för plätering, batteridesign (litiumdendriter) och korrosion.",
      },
      {
        domain: "Kristalltillväxt",
        description:
          "Snöflingebildning, frost på fönster, mineraliska dendriter i berg – alla uppvisar DLA-skalningslagar.",
      },
      {
        domain: "Biologi",
        description:
          "Bakteriekolonier på agarplattor, neurala tillväxtkonor och kanten av vissa tumörer följer DLA-liknande regler.",
      },
      {
        domain: "Blixtfysik",
        description:
          "Förgreningen av blixtar och dielektriska genomslagsmönster beskrivs väl av DLA.",
      },
    ],
    langton: [
      {
        domain: "Artificiellt liv",
        description:
          "Langtons myra är ett grundexempel inom det fält artificiellt liv som han var med och grundade vid Santa Fe Institute.",
      },
      {
        domain: "Teoretisk datavetenskap",
        description:
          "Används som minimalt exempel på universell beräkning i tvådimensionella Turing-maskiner; citeras än idag i grundläggande komplexitetsartiklar.",
      },
      {
        domain: "Undervisning",
        description:
          "Favoritintroduktion i kurser om cellulära automater – «motorvägs»-fasen är ett av de mest tillgängliga emergenta fenomenen i datavetenskapen.",
      },
    ],
    pascalmod: [
      {
        domain: "Talteori",
        description:
          "Lucas sats (1878) driver direkt effektiva algoritmer för binomialkoefficienter modulo primtal – används i kryptografi, ordkombinatorik och tävlingsprogrammering.",
      },
      {
        domain: "Kodteori",
        description:
          "Reed–Muller- och BCH-felrättande koder bygger på maskineri kring binomialkoefficienter modulo p – de sitter i QR-koder, djupgrymdsondsändningar (Mariner 9, Voyager) och DVB-T digital-tv.",
      },
      {
        domain: "Bildkonst",
        description:
          "Pascal mod 2 är den algebraiska källan till Sierpiński-triangeln – säljs som affisch, vävs in i mattor och visas i galleriinstallationer.",
      },
    ],
    sternbrocot: [
      {
        domain: "Datormusik och stämning",
        description:
          "Mikrotonala kompositörer använder Stern–Brocot för att hitta liksvävande approximationer till rena intervall – centralt för xenharmonisk musik.",
      },
      {
        domain: "Robotik och kugghjulsdesign",
        description:
          "Sökandet efter bästa rationella approximationer för utväxlingsförhållanden vandrar genom Stern–Brocot-trädet för att hitta effektiva mekaniska reduktioner.",
      },
      {
        domain: "Kalendersystem",
        description:
          "Skottårsregler baserade på kedjebråk (persisk kalender, föreslagna gregorianska justeringar) härleds från Stern–Brocot-medianter.",
      },
      {
        domain: "Bildrendering",
        description:
          "Subpixelsampling och modern typsnittsrastrering använder medianter i Stern–Brocot-stil för att välja täckningsförhållanden per pixel.",
      },
    ],
    ulam: [
      {
        domain: "Ren talteori",
        description:
          "Att visualisera primtal via spiraler i Ulam-stil fortsätter att inspirera nya förmodanden om polynomiala primtalstätheter (Hardy–Littlewood, Sato–Tate).",
      },
      {
        domain: "Undervisning",
        description:
          "Standardutställning på matematikmuseer och introducerande utforskning i talteorikurser.",
      },
      {
        domain: "Generativ konst",
        description:
          "Verk härledda från Ulam-spiralen dyker upp i konstnärsutställningar (Roman Verostko, Tristan Perich).",
      },
    ],
    cardioid: [
      {
        domain: "Ljudteknik",
        description:
          "Njurmikrofoner (de som varje podcastare och radioarbetare använder) har fått sitt namn från det njurformade upptagningsmönstret – känsliga framåt, döva bakåt.",
      },
      {
        domain: "Antenndesign",
        description:
          "Vissa antenners riktverkan är njurformad; vanligt i marin VHF och radiogoniometri.",
      },
      {
        domain: "Arkitektur och belysning",
        description:
          "Njurformade reflektorer används i klassisk teaterbelysning (PAR-strålkastare) för att projicera asymmetriska ljuskäglor.",
      },
      {
        domain: "Mandelbrot-koppling",
        description:
          "Mandelbrotmängdens huvudlob är exakt en kardioid; att förstå formen belyser Mandelbrots bifurkationsdiagram.",
      },
    ],
    galton: [
      {
        domain: "Statistikundervisning",
        description:
          "Galtonbrädan är den kanoniska demonstrationen av centrala gränsvärdessatsen – närvarande på nästan alla vetenskapsmuseer (Deutsches Museum, Boston Museum of Science, MOSS Toronto).",
      },
      {
        domain: "Quincunx inom genetik",
        description:
          "Galton byggde den ursprungliga brädan för att göra ärftlighetsstatistik synlig för viktoriansk publik; den la grunden för biometri och statistisk genetik.",
      },
      {
        domain: "Plinko och speldesign",
        description:
          "Galtonbrädor inspirerade tv-spelet Plinko och moderna mobilspel inom pachinko och slots, både fysiska och digitala.",
      },
      {
        domain: "Toleransanalys i tillverkning",
        description:
          "Statistiska toleransstackberäkningar inom maskinteknik åberopar direkt centrala gränsvärdessatsens logik, visualiserad av Galtons bräda.",
      },
    ],
    magpendulum: [
      {
        domain: "Kaosdemonstrationer",
        description:
          "Skrivbordsleksaken «trekassemagnetpendeln» är den populäraste fysiska demonstrationen av fraktala attraktionsbassänger – säljs av ThinkGeek, Nikola Labs och många science-gift-shoppar.",
      },
      {
        domain: "Forskning om magnetisk levitation",
        description:
          "Dynamiken hos permanentmagnetpendlar ligger bakom maglevtåg, magnetlager och magnetoreologiska dämpare.",
      },
      {
        domain: "Undervisning",
        description:
          "Standarddemo i icke-linjär dynamik på grundutbildning i fysik; används för att lära ut fasrum, dissipation och känslighet mot sluttillstånd.",
      },
    ],
    godel: [
      {
        domain: "Matematikens grundvalar",
        description:
          "Gödel satte stopp för Hilberts program att mekanisera matematiken; det omformade vad matematiker tror är bevisbart i princip.",
      },
      {
        domain: "Datavetenskap",
        description:
          "Tarskis odefinierbarhet av sanning, Turings stopproblem och Rices sats är direkta avkomlingar – närvarande i varje grundkurs i logik och beräkningsbarhet.",
      },
      {
        domain: "Sinnesfilosofi",
        description:
          "Penroses argument att människans sinne inte är rent algoritmiskt (The Emperor's New Mind, 1989) lutar sig tungt mot Gödel – kontroversiellt men inflytelserikt.",
      },
      {
        domain: "Verifierad mjukvara",
        description:
          "Moderna bevisassistenter (Coq, Lean, Isabelle) brottas dagligen med Gödels gränser; hela deras nytta ligger i att formalisera det som är bevisbart inom ett explicit system.",
      },
    ],
    halting: [
      {
        domain: "Kompilatorer och statisk analys",
        description:
          "Moderna statiska analysverktyg (Coverity, Infer, Rusts borrow checker) måste avstå från perfekt precision eftersom icke-triviala programegenskaper är oavgörbara – en direkt följd av stopproblemet (Rices sats).",
      },
      {
        domain: "Antivirus",
        description:
          "Varför inget antivirus fångar allt skadlig kod: att perfekt upptäcka fientliga program skulle lösa en variant av stopproblemet.",
      },
      {
        domain: "Datormoln",
        description:
          "Molnens autoskalrar kan aldrig garantera att «det här användarjobbet kommer att stoppa» – de tvingar fram timeouts eftersom att avgöra stopp är omöjligt.",
      },
      {
        domain: "Undervisning",
        description:
          "Den kanoniska introduktionen till oavgörbarhet i varje kurs i beräkningsteori på jorden.",
      },
    ],
    pvsnp: [
      {
        domain: "Kryptografi",
        description:
          "Om P = NP skulle RSA, AES, all blockkedje- och TLS-skyddad trafik vara knäckta över en natt – varje modern digital hemlighet hänger på att P ≠ NP gäller i praktiken.",
      },
      {
        domain: "Optimering",
        description:
          "Logistik (UPS-routning), chipdesign (place-and-route) och hyperparametersökning i maskininlärning förlitar sig på heuristiker mot NP-svåra problem eftersom exakta lösningar är ohanterliga.",
      },
      {
        domain: "AI och SAT-lösare",
        description:
          "Moderna SAT/SMT-lösare (Z3, MiniSat) löser rutinmässigt NP-svåra instanser med miljontals variabler tack vare smarta heuristiker, även om värstafallskomplexiteten är exponentiell.",
      },
      {
        domain: "Bioinformatik",
        description:
          "Proteinveckning, genommontering och fylogenetisk träduppbyggnad är alla NP-svåra – vilket driver fältet att uppfinna approximationsalgoritmer och AI-metoder (AlphaFold).",
      },
      {
        domain: "Öppet pris",
        description:
          "Ett av sju Clay Millennium-problem med ett pris på 1 000 000 dollar för bevis eller motbevis.",
      },
    ],
    rsa: [
      {
        domain: "TLS / HTTPS",
        description:
          "Varje hänglåsikon i webbläsaren använder i den inledande handskakningen antingen RSA eller dess släkting på elliptiska kurvor (ECDSA) – miljarder gånger per sekund.",
      },
      {
        domain: "Digitala signaturer",
        description:
          "Apples App Store, Google Play och Microsoft Update signerar varje release med RSA-baserad offentlig nyckel-kryptografi; om det gick att förfalska skulle skadlig kod spridas fritt.",
      },
      {
        domain: "Bank och blockkedja",
        description:
          "SWIFT-meddelanden, chipkortstransaktioner och de flesta blockkedjeplånböcker bygger på antaganden om svårighet av faktorisering eller diskret logaritm som är ekvivalenta med RSA.",
      },
      {
        domain: "Id-handlingar",
        description:
          "Moderna pass (ICAO 9303) innehåller RSA-signerade biometriska data; gränskontrollen verifierar signaturen mot nationella CA.",
      },
      {
        domain: "Postkvantpanik",
        description:
          "Shors algoritm knäcker RSA på en tillräckligt stor kvantdator; NIST håller på att standardisera postkvant-efterträdare (Kyber, Dilithium).",
      },
    ],
    mobius: [
      {
        domain: "Industriella transportband",
        description:
          "Drivremmar i form av en Möbius-band slits jämnt på båda «sidorna» (det finns ju bara en!) – används i gamla tryckpressar, moderna inspelningsband och vissa VHS-bandsystem.",
      },
      {
        domain: "Maskinteknik",
        description:
          "Möbius-kugghjul och Möbius-formade motstånd har patenterats för att halvera slitage respektive induktans.",
      },
      {
        domain: "Topologiforskning",
        description:
          "Möbius-bandet är den enklaste icke-orienterbara ytan – ingången till ett vidsträckt fält som klassificerar alla ytor och som används inom kosmologi och strängteori.",
      },
      {
        domain: "Konst och arkitektur",
        description:
          "Max Bills Oändlig slinga, återvinningssymbolens triangel och arkitekter från Mexiko till Astana använder Möbius-topologi för slagkraftiga installationer.",
      },
      {
        domain: "Kemi",
        description:
          "Möbius-aromatiska molekyler (Heilbronner 1964; först syntetiserade 2003) har en halvvridning av π-elektronerna och uppvisar elektroniska egenskaper som ingen platt ring kan ha.",
      },
    ],
    eulerchar: [
      {
        domain: "Datorgrafik",
        description:
          "Meshvalidering (Blender, Maya) kontrollerar V−E+F mot förväntad χ för att upptäcka hål eller dubblerad geometri före 3D-utskrift.",
      },
      {
        domain: "Datatopologi",
        description:
          "Pipelines för persistent homologi använder Euler-karakteristik för att sammanfatta formen hos högdimensionella punktmoln – tillämpat inom genomik, sensornätverk och kosmologi.",
      },
      {
        domain: "Arkitektur",
        description:
          "Buckminster Fullers geodetiska kupoler (Spaceship Earth på Epcot, Biosphère i Montreal) är konstruerade så att V−E+F=2 tvingar fram exakt 12 femhörningar bland sexhörningarna.",
      },
      {
        domain: "Fotbollsdesign",
        description:
          "Den klassiska trunkerade ikosaederfotbollen har 12 femhörningar och 20 sexhörningar; Eulers formel förklarar varför det är exakt 12, inte färre.",
      },
      {
        domain: "Partikelfysik",
        description:
          "Atiyah–Singers indexsats, grundläggande för modern gaugeteori, generaliserar Eulers formel och knyter samman topologi och differentialekvationer.",
      },
    ],
    konigsberg: [
      {
        domain: "Grafteorins födelse",
        description:
          "Königsberg startade hela fältet – grafteori ligger idag bakom Googles PageRank, sociala nätverksanalys, chip-layout och ruttplanering.",
      },
      {
        domain: "DNA-sekvensering",
        description:
          "Eulervägsalgoritmer inspirerade av Königsberg är dragdjuren bakom modern genommontering (Pevzner och Tang, 2001; används i SPAdes, Velvet, megahit).",
      },
      {
        domain: "Ruttoptimering",
        description:
          "Brevbärare, sopbilar och snöplogar löser det kinesiska brevbärarproblemet – en direkt ättling till Königsbergs broar.",
      },
      {
        domain: "Turism",
        description:
          "Kaliningrad (dagens Königsberg) marknadsför broarna; turister försöker promenaden, även om bara fem av de ursprungliga sju överlevde andra världskriget.",
      },
    ],
    fourcolor: [
      {
        domain: "Kartdesign",
        description:
          "Kartografer och GIS-ingenjörer använder faktiskt fyrfärgningsalgoritmer för politiska kartor, landatlaser och vädervisualisering.",
      },
      {
        domain: "Mobilnät",
        description:
          "Frekvenstilldelning mellan mobilmaster avbildas på grafkoloering – fyrfärgsatsen är gränsfallet för vissa plana layouter.",
      },
      {
        domain: "Schemaläggning",
        description:
          "Universitetstentamensscheman, konferensrumsbokning och idrottsligor är alla grafkoloeringsproblem; plana varianter ärver fyrfärgsgränsen.",
      },
      {
        domain: "Datorverifierad matematik",
        description:
          "Tillsammans med Keplerförmodan var fyrfärgsatsen en milstolpe inom datorassisterad bevisföring – bevisassistentkulturen (Coq, Lean) spårar sin legitimitet hit.",
      },
    ],
    smallworld: [
      {
        domain: "Sociala nätverk",
        description:
          "LinkedIns funktion för «andragradskontakter», Twitters retweet-kaskader och Facebooks «personer du kanske känner» utnyttjar alla small-world-struktur för relevans.",
      },
      {
        domain: "Epidemimodeller",
        description:
          "Modellering av COVID-19-spridning, smittspårningsappar och vaccinationsstrategier använder small-world-nätverksmodeller för att förutsäga utbrottsdynamik.",
      },
      {
        domain: "Hjärnforskning",
        description:
          "fMRI-studier visar att människans konnektom är ett small-world-nätverk – small-world-koefficienten är idag en standardbiomarkör i forskning om Alzheimers och schizofreni.",
      },
      {
        domain: "Internetdirigering",
        description:
          "Internets graf över autonoma system har small-world-egenskaper; BGP och moderna CDN (Cloudflare, Fastly) utnyttjar de korta hop-avstånden.",
      },
      {
        domain: "Six Degrees of Kevin Bacon",
        description:
          "Filmleken från 1994 och webbplatsen för Bacon-talet är populärkulturella artefakter av small-world-teorin; matematiker tävlar om låga Erdős-tal.",
      },
    ],
    diffusion: [
      {
        domain: "Bildgenerering",
        description:
          "Stable Diffusion, Midjourney, DALL·E 3 och Imagen är alla latenta diffusionsmodeller. Skriv en prompt och modellen vandrar gaussiskt brus tillbaka till en bild som matchar texten.",
      },
      {
        domain: "Videogenerering",
        description:
          "Sora, Veo och Runway utvidgar samma diffusionsmatematik till tre dimensioner (höjd × bredd × tid) så att brusborttagaren lär sig rum-tid-konsistens utöver utseendet.",
      },
      {
        domain: "Läkemedels- och proteindesign",
        description:
          "RFdiffusion (Baker-laboratoriet) och Chroma genererar nya proteinryggar genom att brusrensa 3D-koordinater i stället för pixlar — publicerade kandidater har syntetiserats och visat sig vecka sig korrekt.",
      },
      {
        domain: "Ljud och tal",
        description:
          "AudioLDM, Riffusion och röstsyntes-linjen ElevenLabs/Vall-E använder 1D-diffusion över vågformer eller spektrogram för att generera musik och naturligt klingande röster ur text.",
      },
      {
        domain: "Fysik och termodynamik",
        description:
          "Framåtprocessen är bokstavligen Langevin-dynamik — brusschemat speglar ett system som relaxerar mot termisk jämvikt. Sohl-Dicksteins originalartikel från 2015 formulerades som icke-jämviktstermodynamik.",
      },
    ],
    quine: [
      {
        domain: "Programspråksteori",
        description:
          "Quiner är det standardmässiga sanity-testet på att ett språk är uttrycksfullt nog för självreferens; kurser i beräkningsbarhetsteori använder dem för att undervisa Kleenes rekursionssats i konkret form.",
      },
      {
        domain: "Datorvirus & självreplikatorer",
        description:
          "Varje klassiskt virus, mask och metamorfisk motor är en quine-variant: kod som kopierar sig själv innan den gör något annat. Modern självreplikerande skadlig kod studeras som tillämpad quine-ingenjörskonst.",
      },
      {
        domain: "Genetik & molekylärbiologi",
        description:
          "DNA-replikation är biologins quine: en sekvens vars enda uppgift är att kopiera sig själv, inklusive kopieringsmaskineriet. Hofstadter drar analogin explicit i Gödel, Escher, Bach.",
      },
      {
        domain: "Kompilator-bootstrapping",
        description:
          "Trusting Trust (Ken Thompson, 1984) visade att en kompilators kompilator kan vara en quine som lägger in en bakdörr vid varje build — grunden för leveranskedjesäkerhet och forskning om reproducerbara builds.",
      },
      {
        domain: "Demoscene & kodkonst",
        description:
          "Polyglotta quiner — program som skriver ut sig själva och är giltiga i flera språk samtidigt — är en älskad kodkonst-genre; IOCCC har en egen quine-kategori.",
      },
    ],
    riemann: [
      {
        domain: "Primtalssatsen",
        description:
          "Felledet i räkningen av primtal under N styrs av nollställena till ζ; Riemannhypotesen är ekvivalent med den skarpast möjliga skrankan på hur oregelbundet primtalen är fördelade.",
      },
      {
        domain: "Kryptografi",
        description:
          "RSA, elliptisk-kurva-kryptografi och hårdheten i faktorisering vilar på antaganden om primtalsfördelning; RH-ekvivalenta påståenden ger de bästa kända skrankorna för kryptografisk säkerhet.",
      },
      {
        domain: "Kvantkaos",
        description:
          "Statistiken över avstånden mellan zeta-nollställen sammanfaller med egenvärdesstatistiken hos stora slumpmässiga hermitiska matriser — samma matriser som modellerar energinivåer i tunga atomkärnor. Montgomery–Dyson-förmodan (1972) är en av matematikens mest överraskande broar.",
      },
      {
        domain: "Datorverifierad numerik",
        description:
          "De första 10^13 icke-triviala nollställena har beräknats ligga på den kritiska linjen (Xavier Gourdon, 2004 och senare). Inget motexempel till RH har någonsin hittats i någon verifikationskampanj.",
      },
      {
        domain: "Populärvetenskap och öppen-problem-prestige",
        description:
          "Riemann är det mest kända olösta problemet utanför Fermat — ett Clay Millennium-pris (1 M$), återkommande gestaltningar i fiktion (A Beautiful Mind, The Music of the Primes) och en stadig ström av «bevis» som inte överlever peer review.",
      },
    ],
    backprop: [
      {
        domain: "Djupinlärning",
        description:
          "Varje modernt neuralt nätverk — bildklassificerare, språkmodell, rekommenderare — tränas med backpropagation. PyTorch och JAX implementerar den som sin differentieringskärna (autograd).",
      },
      {
        domain: "Datorseende",
        description:
          "Faltningsnätverk för medicinsk bildbehandling, självkörande fordon och biometrisk identifiering lär sig sina filterkärnor direkt från märkt data med backprop; gradienter flödar baklänges genom faltningar och pooling.",
      },
      {
        domain: "Språkmodeller",
        description:
          "GPT, Claude, Llama och varje transformer tränas genom att backpropagera korsentropiförlust genom biljoner parametrar. Den enda algoritmen som skalar från en neuron till en biljon.",
      },
      {
        domain: "Robotik & reglering",
        description:
          "Policy-gradient-metoder i förstärkningsinlärning använder backprop för att uppdatera neurala styrenheter från belöningssignaler; moderna tvåbenta gående och fingerfärdiga manipulationsrobotar använder den.",
      },
      {
        domain: "Inversa problem i naturvetenskap",
        description:
          "Fysiker inverterar experiment genom att bygga den framåtriktade modellen i PyTorch/JAX och backpropagera igenom — används i proteindesign (AlphaFold), differentierbar rendering och gradientbaserad experimentdesign.",
      },
    ],
  },
  no: {
    eml: [
      {
        domain: "Symbolsk regresjon",
        description:
          "Datamaskinalgebrasystemer som forsøker å gjenoppdage fysiske lover ut fra data, bruker av og til kompakte operatoralfabet som EML for å begrense søkerommet.",
      },
      {
        domain: "Teoretisk informatikk",
        description:
          "EML er i slekt med universelle mengder som NAND i logikk og Iota blant kombinatorer – interessant for hva den sier om hvor liten en primitiv kan være.",
      },
    ],
    mandelbrot: [
      {
        domain: "Generativ kunst og motion graphics",
        description:
          "Filmskapere og digitale kunstnere zoomer inn i Mandelbrotmengden for å lage bakgrunner til alt fra musikkvideoer til åpningssekvenser i Apples keynotes.",
      },
      {
        domain: "Fraktalantenner",
        description:
          "Mandelbrot-/Julia-formede kanter brukes i enkelte kompakte multibåndsantenner (for eksempel i tidlige Bluetooth-moduler) fordi den selvlike formen resonnerer over mange frekvenser.",
      },
      {
        domain: "Undervisning",
        description:
          "Standardeksempel i universitetsundervisning om kompleks dynamikk, deterministisk kaos og grensen mellom orden og kaos.",
      },
      {
        domain: "Analoger i naturen",
        description:
          "Kystlinjer, fjellrygger, bregneblad og brokkolibuketter viser den samme selvlike kantstrukturen – det var akkurat Mandelbrots poeng med fraktal geometri.",
      },
    ],
    life: [
      {
        domain: "Informatikkundervisning",
        description:
          "Ethvert informatikkstudium, fra MIT 6.001 til gymnasklubber, bruker Conways Life for å lære bort emergens, cellulære automater og Turing-fullstendighet på en ettermiddag.",
      },
      {
        domain: "Generativ kunst",
        description:
          "Designere bruker Life og variantene (HighLife, Day & Night …) for å lage stadig skiftende visuelle uttrykk til musikkvideoer, installasjoner og skjermsparere.",
      },
      {
        domain: "Diskret biologisk modellering",
        description:
          "Demografi, byttedyr–rovdyrdynamikk og epidemispredning prototypes av og til på Life-lignende rutenett før man går videre til rikere agentbaserte modeller.",
      },
      {
        domain: "Maskinvarefikling",
        description:
          "FPGA- og mikrokontrollerprosjekter viser ofte Life på LED-matriser som «hello world» for parallell cellulær maskinvare.",
      },
    ],
    nand: [
      {
        domain: "Inni hver brikke",
        description:
          "Fra Apples M-serie til industrielle mikrokontrollere ætses det hvert minutt inn milliarder av NAND-porter i silisium. Mange digitale ASIC-er syntetiseres utelukkende med NAND.",
      },
      {
        domain: "Flashminne",
        description:
          "NAND-flashminne (USB-pinner, SSD-er, smarttelefoner) har fått navn og arkitektur fra NAND-porter ordnet i matriser av floating-gate-transistorer.",
      },
      {
        domain: "Maskinvarekurs",
        description:
          "Kurset nand2tetris bygger en komplett datamaskin med utgangspunkt i én eneste NAND-brikke – brukes ved over 100 universiteter.",
      },
      {
        domain: "Innebygd logikk",
        description:
          "Diskrete 74HC00-kretser med fire NAND-porter produseres fortsatt i dag for enkel glue logic, nivåtilpassere og oscillatorer på hobby-PCB-er.",
      },
    ],
    iota: [
      {
        domain: "Kombinatortolker",
        description:
          "Kompilatorer for funksjonelle språk (for eksempel Lazy K) oversetter lambdakalkylprogrammer til rene kombinatoruttrykk – i Iota-stil – under kodegenereringen.",
      },
      {
        domain: "Esoteriske språk",
        description:
          "Iota og søskenet Jot er minimalistiske programmeringsspråk som brukes til å studere den minst mulige Turing-fullstendige syntaksen.",
      },
      {
        domain: "Undervisning i lambdakalkyl",
        description:
          "Universiteter bruker Iota til å vise at én enkelt kombinator er nok, og dermed skille syntaks fra beregningskraft.",
      },
    ],
    rule110: [
      {
        domain: "Wolfram Physics Project",
        description:
          "Stephen Wolframs program for å finne universets underliggende regel henviser eksplisitt til Regel 110 som bevis på at svært små regler kan være universelt beregnende.",
      },
      {
        domain: "Undervisning i formell beregning",
        description:
          "Sitert i enhver moderne innføring i cellulære automater som det enkleste kjente universelle systemet – en Turing-maskin i tweet-format.",
      },
      {
        domain: "Prosedural teksturstøy",
        description:
          "Enkelte shader-biblioteker bruker Regel 110 (og 30) som en billig kilde til kompleks 1D-støy for stilisert generativ grafikk.",
      },
    ],
    logistic: [
      {
        domain: "Populasjonsbiologi",
        description:
          "Den kontinuerlige logistiske likningen modellerer strengt begrensede populasjoner av bakterier, gjær og til og med enkelte pattedyr; den diskrete avbildningen læres bort i ethvert kurs i kvantitativ økologi.",
      },
      {
        domain: "Epidemiologi",
        description:
          "Begrenset epidemivekst (med bæreevne = pool av mottakelige) følger logistiske kurver – de kumulative COVID-19-kurvene var et lærebokeksempel.",
      },
      {
        domain: "Maskinlæring",
        description:
          "Læringsratens skjemaer i dyp læring havner av og til i samme kaos via periodedobling når raten blir for stor; den logistiske avbildningen gir intuisjonen.",
      },
      {
        domain: "Nevrovitenskap",
        description:
          "Modeller for nevroners fyringsrate ved høye inngangsstrømmer bifurkerer akkurat som den logistiske avbildningen og forutsier oppstart av uregelmessig fyring.",
      },
      {
        domain: "Klima og vær",
        description:
          "Periodedobling i Feigenbaum-stil er reprodusert eksperimentelt i konveksjonsceller og viser den samme universelle veien til turbulens.",
      },
    ],
    lorenz: [
      {
        domain: "Værvarsling",
        description:
          "Operative værmeldere bruker ensemble-metoder fordi atmosfæren deler Lorenz' sensitivitet for startbetingelser – forutsigbarheten kollapser etter omtrent 14 dager.",
      },
      {
        domain: "Klimamodellering",
        description:
          "Lorenz' artikkel fra 1963 grunnla moderne kaosteori og former hvordan vi leser grensene for forutsigbarhet i langsiktige klimasimuleringer.",
      },
      {
        domain: "Undervisning",
        description:
          "Ethvert bachelorkurs i dynamiske systemer visualiserer Lorenz-attraktoren som den kanoniske merkelige attraktoren.",
      },
      {
        domain: "Sikker kommunikasjon",
        description:
          "Kaosbaserte krypteringsmetoder har brukt synkronisering i Lorenz-stil for å skjule signaler – nisje, men reell (Cuomo og Oppenheim, 1993).",
      },
    ],
    fourier: [
      {
        domain: "MP3, AAC, Opus",
        description:
          "Alle moderne lydkodeker med tap transformerer korte lydvinduer til frekvensdomenet, kaster uhørbare komponenter og transformerer tilbake.",
      },
      {
        domain: "JPEG og HEIC",
        description:
          "Hver 8×8-piksels blokk i et JPEG-bilde lagres som koeffisienter til den diskrete cosinustransformen – derfor har JPEG-ringing horisontale og vertikale mønstre.",
      },
      {
        domain: "MR-skannere",
        description:
          "En MR-maskin måler bokstavelig talt Fourier-koeffisienter (k-rommet) av vevet ditt og transformerer dem tilbake til bildet du ser hos legen.",
      },
      {
        domain: "Wi-Fi, 5G, DSL",
        description:
          "Moderne trådløs og kabelbasert overføring bruker OFDM, som legger data på tusenvis av nøye plasserte sinusbærere – ren Fourier-ingeniørkunst.",
      },
      {
        domain: "Tale og ML",
        description:
          "Mel-spektrogram-egenskaper (Fourier-transformert lyd) er inngangen til nesten alle modeller for talegjenkjenning og taleassistenter.",
      },
    ],
    euler: [
      {
        domain: "Signalbehandling",
        description:
          "Enhver DSP-lærebok bruker e^{iωt} som kanonisk kompleks sinusbølge; FFT, Z-transform og filterdesign hviler alle på Eulers formel.",
      },
      {
        domain: "Kvantemekanikk",
        description:
          "Bølgefunksjoner er komplekse eksponensialer; fasefaktorene e^{iθ} bærer interferensmønstrene som gjør kvantemekanikken kvantemekanisk.",
      },
      {
        domain: "Vekselstrømsanalyse",
        description:
          "Elektroingeniører modellerer vekselspenninger og -strømmer som komplekse eksponensialer – impedansregning med fasorer er direkte anvendelse av Eulers formel.",
      },
      {
        domain: "Reguleringsteknikk",
        description:
          "Stabiliteten til tilbakekoblede systemer leses ut fra polenes plassering i det komplekse planet – Eulers formel er broen mellom tid og frekvens.",
      },
    ],
    banach: [
      {
        domain: "Undervisning i mengdeteori",
        description:
          "Banach–Tarski er lærebokeksemplet på hvorfor utvalgsaksiomet er kontroversielt – brukt i ethvert masterkurs i reell analyse.",
      },
      {
        domain: "Matematikkens grunnlag",
        description:
          "Det motiverte 1900-tallets arbeid med alternative mengdeteoretiske grunnlag (konstruktivisme, intuisjonisme) og påvirket datamaskinverifiserte bevis.",
      },
      {
        domain: "Matematikkens filosofi",
        description:
          "Hyppig påberopt i diskusjoner om matematisk realisme, betydningen av «uendelighet» og intuisjonens grenser.",
      },
    ],
    lsystem: [
      {
        domain: "Prosedurelle planter i spill og film",
        description:
          "Trær, bregner og gress i titler som Løvenes konge (1994), Avatar (2009) og utallige moderne spill genereres med L-systemer via SpeedTree og lignende mellomvare.",
      },
      {
        domain: "Arkitektur og CAD",
        description:
          "Generative arkitekturverktøy (Grasshopper for Rhino) bruker L-systemer for å la forgrenede strukturer, fasader og gatenett vokse fram.",
      },
      {
        domain: "Plantebiologisk forskning",
        description:
          "Plantebiologer tilpasser L-systemer til virkelige arter (for eksempel epletreets topologi) for å studere vekstdynamikk, lyskonkurranse og avlingsoptimering.",
      },
      {
        domain: "Musikkomposisjon",
        description:
          "Komponister kobler L-systemstrenger til MIDI-hendelser og lar temaer vokse algoritmisk, slik at de utvikler fraktal selvlikhet over tid.",
      },
    ],
    wang: [
      {
        domain: "Sanntidsgrafikk",
        description:
          "Wang-tile-sett brukes til å pakke ikke-repeterende teksturer (gress, murstein, sand) i svært små teksturatlas – viktig på enheter med begrenset minne, som mobil-GPU-er.",
      },
      {
        domain: "Prosedural leveldesign",
        description:
          "Spillmotorer (Houdini, egenutviklede roguelike-motorer) bruker Wang-fliser for å sette sammen store dungeon- og verdenskart fra små modulære byggeklosser uten synlige skjøter.",
      },
      {
        domain: "Materialer og kvasikrystaller",
        description:
          "Teorien om Wang-fliser overlapper delvis med kvasikrystallenes matematikk – begge produserer aperiodiske, uendelige arrangementer.",
      },
    ],
    collatz: [
      {
        domain: "Åpent problem i ren matematikk",
        description:
          "Regnes blant de mest berømte åpne problemene i elementær tallteori; verifisert med datamaskin opp til 2,95×10²⁰ per 2024.",
      },
      {
        domain: "Distribuert databehandling",
        description:
          "Prosjektet BOINC / collatzconjecture.org crowdsourcer letingen etter et moteksempel ved hjelp av frivillig donert GPU-tid.",
      },
      {
        domain: "Pedagogikk",
        description:
          "Brukt i ungdomsskoledemonstrasjoner av «tall-triks» og i bachelor-forskningsprosjekter om heltallsfølger.",
      },
    ],
    doublependulum: [
      {
        domain: "Robotikk",
        description:
          "Robotarmer med to ledd er matematisk dobbeltpendler; å forstå deres ikke-lineære kobling er avgjørende for stabil styring av industrirobotter.",
      },
      {
        domain: "Biomekanikk",
        description:
          "Menneskets lemmer under gange, kast og gymnastiske bevegelser modelleres som multipendel-systemer i forskning på rehabilitering og proteser.",
      },
      {
        domain: "Vitenskapsmuseer",
        description:
          "Dobbeltpendel-installasjoner på museer (for eksempel Exploratorium, Deutsches Museum) viser sommerfugleffekten fysisk for publikum.",
      },
      {
        domain: "Akrobatikk og rigging",
        description:
          "Cirque du Soleil og teaterriggere må forstå pendel-på-pendel-dynamikk for trygge koreografier i trapes og luftakrobatikk.",
      },
    ],
    bzr: [
      {
        domain: "Hjerterytmeforstyrrelser",
        description:
          "Spiralbølgemønstre svært like BZR-spiralene observeres på hjertets overflate ved flimmer – sentralt for forskning på og design av defibrillatorer.",
      },
      {
        domain: "Nevrovitenskap",
        description:
          "Kortikal spredende depolarisering (en bølge av nevral depolarisering knyttet til migrene) modelleres som et BZR-lignende eksiterbart medium.",
      },
      {
        domain: "Kjemiundervisning",
        description:
          "BZR er den mest slående demonstrasjonen av «levende kjemi» en kjemilærer på videregående kan vise – synlig oscillasjon i en kolbe.",
      },
      {
        domain: "Nobelprisbelønt teori",
        description:
          "Ilya Prigogine fikk Nobelprisen i 1977 for teorien om dissipative strukturer, forankret i systemer som BZR.",
      },
    ],
    turingpattern: [
      {
        domain: "Utviklingsbiologi",
        description:
          "Striper hos sebrafisk, avstand mellom hårfollikler hos mus, dannelse av fingeravtrykk og fingermønster i virveldyrembryoer er alle målt til å følge Turing-dynamikk.",
      },
      {
        domain: "Plantefyllotaksi",
        description:
          "Spiralarrangementene i solsikkefrø, kongleskjell og ananasskjell oppstår fra reaksjon-diffusjon pluss den gylne vinkel – Turing-kjemi på en voksende flate.",
      },
      {
        domain: "Generativ kunst og grafikk",
        description:
          "Reaksjon-diffusjonsmønstre brukes bredt som prosedural teksturstøy (hud, bark, korall) i 3D-verktøy som Substance Designer og Houdini.",
      },
      {
        domain: "Legemiddelfrigjøring og materialer",
        description:
          "Selvorganiserende mikrostrukturer i polymermembraner og legemiddelfrigjørende belegg konstrueres ut fra instabiliteter av Turing-typen.",
      },
    ],
    sierpinski: [
      {
        domain: "Fraktalantenner",
        description:
          "Antenner med Sierpiński-trekant er kommersielle produkter – mobiltelefoner, Wi-Fi-rutere og GPS-enheter bruker multibånds fraktal-patcher som resonnerer på mange frekvenser på liten plass.",
      },
      {
        domain: "Varmevekslere",
        description:
          "Forgrenede kanaler i Sierpiński-stil dukker opp i printede kjøleplater for høyeffekts-LED-er og brikkekjøling, der de maksimerer overflaten.",
      },
      {
        domain: "Kompresjon og grafikk",
        description:
          "Iterated Function Systems (IFS i Sierpiński-stil) ligger bak fraktal bildekompresjonsalgoritmer – fremdeles i bruk i nisjekodere for luftbilder.",
      },
      {
        domain: "Nettverk",
        description:
          "Hierarkisk IP-ruting og tre-topologier arver fraktale skaleringsegenskaper i Sierpiński-stil for lastbalansering.",
      },
    ],
    chaosgame: [
      {
        domain: "Bioinformatikk",
        description:
          "Chaos Game Representation (CGR) er en standardmåte å visualisere DNA-sekvenser på – hvert nukleotid styrer et punkt mot ett av fire hjørner i et kvadrat, og artene klumper seg i gjenkjennelige fraktale signaturer.",
      },
      {
        domain: "Fraktal kompresjon",
        description:
          "Barnsleys fraktale bildekompresjon koder bilder som et lite sett av kontraherende avbildninger som gjenskapes via kaosspillet.",
      },
      {
        domain: "Prosedural teksturering",
        description:
          "Utdata fra kaosspillet (varianter av Barnsleys bregne) brukes bredt til prosedural vegetasjon og stiliserte penselstrøk.",
      },
    ],
    penrose: [
      {
        domain: "Kvasikrystaller",
        description:
          "Dan Shechtmans oppdagelse av metalliske kvasikrystaller i 1982 (Nobelpris 2011) ble forstått gjennom Penrose-mosaikker – den samme femfoldige matematikken styrer begge.",
      },
      {
        domain: "Arkitektur",
        description:
          "Fasaden til Storey Hall i Melbourne og flere matematisk-islamske mønstre i Topkapı-palasset bruker aperiodisk geometri i Penrose-stil.",
      },
      {
        domain: "Materialvitenskap",
        description:
          "Kvasikrystallinske belegg (for eksempel på Sjøbo nonstick-panner) er kommersielle i dag og utnytter atomarrangementer i Penrose-mosaikkens stil.",
      },
      {
        domain: "Kryptografi",
        description:
          "Nylig foreslåtte pseudotilfeldige tallgeneratorer bruker sekvenser fra aperiodiske mosaikker for lavdiskrepant sampling.",
      },
    ],
    apollonian: [
      {
        domain: "Granulær pakking",
        description:
          "Hvordan sand, grus og farmasøytiske pulvere fyller beholdere modelleres med apolloniske kulepakninger – viktig for betong, tabletter og pulvermetallurgi.",
      },
      {
        domain: "Tallteori",
        description:
          "Heltallige apolloniske pakninger studeres av analytisk tallteori – arbeider av Sarnak, Bourgain og Kontorovich har gitt nye resultater om primtallskrumninger.",
      },
      {
        domain: "Skum- og emulsjonsfysikk",
        description:
          "Skumstrukturer (ølskum, matemulsjoner, lungealveoler) arver under dannelsen pakningsvilkår i apolloniansk stil.",
      },
      {
        domain: "Grafisk design",
        description:
          "Logoer, plakater og tatoveringsdesign bruker apolloniske gaskets for slagkraftig radiell geometri.",
      },
    ],
    phi: [
      {
        domain: "Plantefyllotaksi",
        description:
          "Solsikkens frøspiraler, kongleskjell og bladplasseringen hos de fleste planter konvergerer mot den gylne vinkel – verifisert hos tusenvis av arter.",
      },
      {
        domain: "Kjedebrøker",
        description:
          "φ har den enkleste kjedebrøksutviklingen [1;1,1,…], noe som gjør det til det «mest irrasjonale» tallet – et nøkkelbegrep for KAM-teorien i klassisk mekanikk.",
      },
      {
        domain: "Kvasikrystaller og Penrose",
        description:
          "Forholdet mellom sidelengder i Penrose-mosaikker (og inflasjonsfaktoren) er nøyaktig φ; det samme forholdet dukker opp i virkelige kvasikrystaller oppdaget i naturen i 2009.",
      },
      {
        domain: "Tallteori",
        description:
          "Fibonacci-tallene ligger til grunn for Zeckendorfs teorem og effektive heltallsrepresentasjoner brukt i enkelte kompresjons- og datastrukturalgoritmer.",
      },
      {
        domain: "Ærlig skepsis",
        description:
          "Påstander om at φ skulle finnes i Parthenon, Mona Lisa, nautilusskallet eller menneskekroppens proporsjoner er stort sett myter – avlivet blant andre av George Markowsky (1992).",
      },
    ],
    buffon: [
      {
        domain: "Monte Carlo-integrasjon",
        description:
          "Buffons nål er det historiske frøet til Monte Carlo-metodene – i dag i bruk overalt, fra finansiell prising (Black–Scholes) til partikkelfysisksimulering (Geant4) og rendering (path tracing).",
      },
      {
        domain: "Fysikksimulering",
        description:
          "Tilfeldig sampling av høydimensjonale integraler i gitter-QCD, kjerneteknikk og reaktordesign utvider Buffons logikk til millioner av dimensjoner.",
      },
      {
        domain: "Datagrafikk",
        description:
          "Stratifisert sampling av lysstråler i moderne path tracere (Pixar, Cycles, Unreal Lumen) stammer i rett linje fra Buffons nål.",
      },
      {
        domain: "Statistikkundervisning",
        description:
          "Standard innledende demonstrasjon i sannsynlighet; fortsatt utført på bachelorlaboratorier i statistikk verden over.",
      },
    ],
    hilberthotel: [
      {
        domain: "Mengdeteori og undervisning",
        description:
          "Den kanoniske analogien for å forstå kardinalaritmetikk og forskjellen mellom tellbare og overtellbare uendeligheter.",
      },
      {
        domain: "Programmering med uendelige strukturer",
        description:
          "Late uendelige lister i Haskell, generatorer i Python og strømmer i Scala speiler omdisponeringene i Hilberts hotell på den tellbare uendeligheten.",
      },
      {
        domain: "Populærvitenskapelig formidling",
        description:
          "TED-Ed-video, Vsauce, PBS Infinite Series – den mest delte moderne forklaringen på uendelighet.",
      },
    ],
    gabrielshorn: [
      {
        domain: "Kalkulusundervisning",
        description:
          "Standardeksempelet i tidlig kalkulus på et kontraintuitivt uegentlig integral, til stede i enhver lærebok i kalkulus på andre året.",
      },
      {
        domain: "Matematikkens filosofi",
        description:
          "Sitert i debatter om betydningen av geometriske paradokser og fysisk intuisjons grenser – et grunnleggende tankeeksperiment.",
      },
      {
        domain: "Mikrofluidikk",
        description:
          "Virkelige analoger med kapillærdrevet strømning i stadig smalere kanaler (mikrofluidiske enheter) møter de grensetilfellene Gabriels horn formaliserer.",
      },
    ],
    cantor: [
      {
        domain: "Beregnbarhetsteori",
        description:
          "Cantors diagonal gir direkte Turings bevis for stoppeproblemet og Gödels ufullstendighetsteoremer – bærebjelker i teoretisk informatikk.",
      },
      {
        domain: "Teori for programmeringsspråk",
        description:
          "Brukes til å vise at det ikke finnes noe «universelt» typesystem som avgjør typesjekking for alle programmer (Rices teorem).",
      },
      {
        domain: "Kryptografi og kompleksitet",
        description:
          "Diagonaliseringsargumenter ligger bak moderne resultater i kompleksitetsteori – separasjoner mellom P, NP, EXP.",
      },
      {
        domain: "Matematikkens filosofi",
        description:
          "Cantors argument snudde aristoteliske og kantianske oppfatninger av uendelighet på hodet og formet 1900-tallets logikk og analytiske filosofi.",
      },
    ],
    boids: [
      {
        domain: "Visuelle effekter på film",
        description:
          "Batmans Tilbakekomst (flaggermussvermen i 1992), Løvenes konge (gnu-stampeden i 1994) og utallige moderne filmer bruker Boids – som regel via Massive eller Houdini.",
      },
      {
        domain: "Dronesvermer",
        description:
          "Intels rekordsettende droneshows (OL i Pyeongchang 2018, OL i Paris 2024) bruker regler avledet fra Boids i svært stor skala.",
      },
      {
        domain: "Folkemengdesimulering",
        description:
          "Arkitektkontorer simulerer arena-evakueringer og kjøpesenter-strømninger med Boids-lignende agenter – i bruk i arenaplanlegging siden 2000-tallet.",
      },
      {
        domain: "Robotsvermer",
        description:
          "Forskningslaboratorier bruker Boids-lignende regler for autonome robotsvermer i søk-og-redning og landbruksovervåking.",
      },
      {
        domain: "Virkelig natur",
        description:
          "Empiriske studier av stærsvermer (Cavagna m.fl., 2010), fiskestimer og pattedyrflokker bekrefter regler svært nær de opprinnelige Boids.",
      },
    ],
    aizawa: [
      {
        domain: "Forskning på dynamiske systemer",
        description:
          "Aizawa tilhører en familie av tredimensjonale merkelige attraktorer som brukes til å teste numeriske integratorer, visualiseringsalgoritmer og kaosdeteksjonsmetoder.",
      },
      {
        domain: "Matematisk kunst",
        description:
          "Generative kunstnere rendrer Aizawa-, Thomas- og Halvorsen-attraktorer som plottinger, trykk og animasjoner som selges på Etsy og kunstmesser.",
      },
      {
        domain: "Undervisning",
        description:
          "Brukes stadig oftere ved siden av Lorenz i mastergradskurs i dynamiske systemer for å vise et bredere mangfold av kaotiske former.",
      },
    ],
    dla: [
      {
        domain: "Elektrokjemi",
        description:
          "Avsetninger av sink, kobber og andre metaller dyrket i elektrolyseceller danner dendritter av DLA-typen – direkte relevant for galvanisering, batteridesign (litiumdendritter) og korrosjon.",
      },
      {
        domain: "Krystallvekst",
        description:
          "Dannelsen av snøfnugg, frost på vinduer og mineraldendritter i fjell – alle viser DLA-skaleringslover.",
      },
      {
        domain: "Biologi",
        description:
          "Frontene til bakteriekolonier på agarskåler, nevrale vekstkjegler og kanten på enkelte svulster følger DLA-lignende regler.",
      },
      {
        domain: "Lynfysikk",
        description:
          "Forgreningen av lyn og mønstre for dielektrisk gjennomslag modelleres godt av DLA.",
      },
    ],
    langton: [
      {
        domain: "Kunstig liv",
        description:
          "Langtons maur er et grunnleggende eksempel innen feltet kunstig liv som han var med på å grunnlegge ved Santa Fe Institute.",
      },
      {
        domain: "Teoretisk informatikk",
        description:
          "Brukes som et minimalt eksempel på universell beregning i todimensjonale Turing-maskiner; siteres fortsatt i grunnleggende artikler om kompleksitet.",
      },
      {
        domain: "Undervisning",
        description:
          "Et yndet introduksjonseksempel i kurs om cellulære automater – «motorvei»-fasen er et av de mest tilgjengelige emergente fenomenene i informatikken.",
      },
    ],
    pascalmod: [
      {
        domain: "Tallteori",
        description:
          "Lucas' teorem (1878) driver direkte effektive algoritmer for binomialkoeffisienter modulo primtall – brukt i kryptografi, ordkombinatorikk og konkurranseprogrammering.",
      },
      {
        domain: "Kodingsteori",
        description:
          "Reed–Muller- og BCH-feilrettende koder hviler på maskineriet rundt binomialkoeffisienter modulo p – de finnes i QR-koder, dypromsondesendinger (Mariner 9, Voyager) og digital-TV DVB-T.",
      },
      {
        domain: "Billedkunst",
        description:
          "Pascal mod 2 er den algebraiske kilden til Sierpiński-trekanten – selges som plakat, veves inn i tepper og vises i galleriinstallasjoner.",
      },
    ],
    sternbrocot: [
      {
        domain: "Datamusikk og stemming",
        description:
          "Mikrotonale komponister bruker Stern–Brocot for å finne liksvevende tilnærminger til rene intervaller – sentralt for xenharmonisk musikk.",
      },
      {
        domain: "Tannhjulsdesign i robotikk",
        description:
          "Søk etter beste rasjonale tilnærminger for utvekslingsforhold vandrer gjennom Stern–Brocot-treet for å finne effektive mekaniske reduksjoner.",
      },
      {
        domain: "Kalendersystemer",
        description:
          "Skuddårsregler basert på kjedebrøker (persisk kalender, foreslåtte gregorianske justeringer) utledes fra Stern–Brocot-medianer.",
      },
      {
        domain: "Bilderendering",
        description:
          "Subpiksel-sampling og moderne fontrasterisering bruker medianer i Stern–Brocot-stil for å velge pikseldekningsforhold.",
      },
    ],
    ulam: [
      {
        domain: "Ren tallteori",
        description:
          "Å visualisere primtall via spiraler i Ulam-stil fortsetter å inspirere nye formodninger om polynomiske primtallstettheter (Hardy–Littlewood, Sato–Tate).",
      },
      {
        domain: "Undervisning",
        description:
          "Standardutstilling på matematikkmuseer og en innledende utforskning i tallteorikurs.",
      },
      {
        domain: "Generativ kunst",
        description:
          "Verk avledet av Ulam-spiralen dukker opp i kunstnerutstillinger (Roman Verostko, Tristan Perich).",
      },
    ],
    cardioid: [
      {
        domain: "Lydteknikk",
        description:
          "Nyremikrofoner (de som enhver podkaster og kringkaster bruker) har fått navnet sitt fra det nyreformede opptaksmønsteret – følsomme foran og døve bak.",
      },
      {
        domain: "Antennedesign",
        description:
          "Enkelte antenners direktivitetsmønstre er nyreformede; vanlige i marine VHF og radiogoniometriutstyr.",
      },
      {
        domain: "Arkitektur og belysning",
        description:
          "Nyreformede reflektorer brukes i klassisk teaterbelysning (PAR-kannene) for å projisere asymmetriske lyskjegler.",
      },
      {
        domain: "Kobling til Mandelbrot",
        description:
          "Hovedløkken i Mandelbrotmengden er nøyaktig en kardioide; å forstå formen belyser Mandelbrots bifurkasjonsdiagram.",
      },
    ],
    galton: [
      {
        domain: "Statistikkundervisning",
        description:
          "Galton-brettet er den kanoniske demonstrasjonen av den sentrale grensesetningen – til stede på nesten alle vitenskapsmuseer (Deutsches Museum, Boston Museum of Science, MOSS Toronto).",
      },
      {
        domain: "Quincunx i genetikk",
        description:
          "Galton bygde det opprinnelige brettet for å gjøre arvelighetsstatistikk synlig for viktoriansk publikum; det la grunnlaget for biometri og statistisk genetikk.",
      },
      {
        domain: "Plinko og spilldesign",
        description:
          "Galton-brettene inspirerte TV-spillet Plinko og moderne mobile pachinko- og spilleautomatspill, både fysisk og digitalt.",
      },
      {
        domain: "Toleranseanalyse i produksjon",
        description:
          "Statistiske toleransekjedeberegninger i maskinteknikk påberoper seg direkte logikken til den sentrale grensesetningen som Galton-brettet visualiserer.",
      },
    ],
    magpendulum: [
      {
        domain: "Kaosdemonstrasjoner",
        description:
          "Skrivebordsleken «tremagnetpendel» er den mest populære fysiske demonstrasjonen av fraktale tiltrekningsbasseng – selges av ThinkGeek, Nikola Labs og en mengde gavebutikker for vitenskap.",
      },
      {
        domain: "Forskning på magnetisk levitasjon",
        description:
          "Dynamikken til permanentmagnetpendler ligger bak maglev-tog, magnetlagre og magnetoreologiske dempere.",
      },
      {
        domain: "Undervisning",
        description:
          "Standarddemo i ikke-lineær dynamikk på bachelor i fysikk; brukes for å undervise i faserom, dissipasjon og følsomhet for slutt-tilstand.",
      },
    ],
    godel: [
      {
        domain: "Matematikkens grunnlag",
        description:
          "Gödel avsluttet Hilberts program for å mekanisere matematikken; han endret hva matematikkmiljøet anser som prinsipielt bevisbart.",
      },
      {
        domain: "Informatikk",
        description:
          "Tarskis udefinerbarhet av sannhet, Turings stoppeproblem og Rices teorem er direkte etterkommere – til stede i ethvert bachelorkurs i logikk og beregnbarhet.",
      },
      {
        domain: "Bevissthetsfilosofi",
        description:
          "Penroses argument om at menneskesinnet ikke er rent algoritmisk (The Emperor's New Mind, 1989) hviler sterkt på Gödel – kontroversielt, men innflytelsesrikt.",
      },
      {
        domain: "Verifisert programvare",
        description:
          "Moderne bevisassistenter (Coq, Lean, Isabelle) møter Gödels grenser daglig; hele nytten deres ligger i å formalisere det som er bevisbart innenfor et eksplisitt system.",
      },
    ],
    halting: [
      {
        domain: "Kompilatorer og statisk analyse",
        description:
          "Moderne statiske analyseverktøy (Coverity, Infer, Rusts borrow checker) må gi avkall på perfekt presisjon fordi ikke-trivielle programegenskaper er uavgjørbare – en direkte følge av stoppeproblemet (Rices teorem).",
      },
      {
        domain: "Antivirus",
        description:
          "Hvorfor ingen antivirus fanger all skadelig kode: å oppdage fiendtlige programmer perfekt ville løse en variant av stoppeproblemet.",
      },
      {
        domain: "Skytjenester for beregning",
        description:
          "Skyens autoskalerere kan aldri garantere at «denne brukerjobben stopper» – de tvinger gjennom tidsavbrudd fordi det å avgjøre stopp er umulig.",
      },
      {
        domain: "Undervisning",
        description:
          "Den kanoniske introduksjonen til uavgjørbarhet i ethvert kurs i beregningsteori på kloden.",
      },
    ],
    pvsnp: [
      {
        domain: "Kryptografi",
        description:
          "Hvis P = NP, ville RSA, AES, all blokkjede- og TLS-beskyttet trafikk være knekt over natten – enhver moderne digital hemmelighet hviler på at P ≠ NP i praksis.",
      },
      {
        domain: "Optimering",
        description:
          "Logistikk (UPS-ruting), brikkedesign (place-and-route) og hyperparametersøk i maskinlæring angriper NP-vanskelige problemer heuristisk fordi eksakte løsninger er uoverkommelige.",
      },
      {
        domain: "KI og SAT-løsere",
        description:
          "Moderne SAT/SMT-løsere (Z3, MiniSat) løser rutinemessig NP-vanskelige instanser med millioner av variabler takket være smarte heuristikker, selv om verstefallskompleksiteten er eksponentiell.",
      },
      {
        domain: "Bioinformatikk",
        description:
          "Proteinfolding, genommontering og rekonstruksjon av fylogenetiske trær er alle NP-vanskelige – noe som driver feltet til å oppfinne approksimasjonsalgoritmer og KI-metoder (AlphaFold).",
      },
      {
        domain: "Åpen premie",
        description:
          "Ett av sju Clay Millennium-problemer, med en premie på 1 000 000 dollar for bevis eller motbevis.",
      },
    ],
    rsa: [
      {
        domain: "TLS / HTTPS",
        description:
          "Hvert hengelåsikon i nettleseren bruker i den innledende håndtrykksfasen enten RSA eller dens fetter på elliptiske kurver (ECDSA) – milliarder av ganger per sekund.",
      },
      {
        domain: "Digitale signaturer",
        description:
          "Apples App Store, Google Play og Microsoft Update signerer hver utgivelse med offentlig nøkkel-kryptografi i RSA-stil; om dette lot seg forfalske, ville skadelig kode spre seg uhindret.",
      },
      {
        domain: "Bank og blokkjede",
        description:
          "SWIFT-meldinger, chipkort-transaksjoner og de fleste blokkjedelommebøker hviler på antakelser om vanskelighet av faktorisering eller diskret logaritme, ekvivalente med RSA.",
      },
      {
        domain: "ID-dokumenter",
        description:
          "Moderne pass (ICAO 9303) inneholder RSA-signerte biometriske data; grensekontrollen verifiserer signaturen mot nasjonale CA-er.",
      },
      {
        domain: "Postkvantepanikk",
        description:
          "Shors algoritme knekker RSA på en tilstrekkelig stor kvantedatamaskin; NIST er i ferd med å standardisere postkvante-etterfølgere (Kyber, Dilithium).",
      },
    ],
    mobius: [
      {
        domain: "Industrielle transportbånd",
        description:
          "Drivremmer formet som et Möbius-bånd slites jevnt på begge «sidene» (det er bare én!) – brukt i gamle trykkpresser, moderne opptaksbånd og enkelte VHS-bånsystemer.",
      },
      {
        domain: "Maskinteknikk",
        description:
          "Möbius-tannhjul og Möbius-formede motstander er patentert for å halvere henholdsvis slitasje og induktans.",
      },
      {
        domain: "Topologiforskning",
        description:
          "Möbius-båndet er den enkleste ikke-orienterbare flaten – inngangen til et vidstrakt felt som klassifiserer alle flater og som brukes i kosmologi og strengteori.",
      },
      {
        domain: "Kunst og arkitektur",
        description:
          "Max Bills Endeløse bånd, trekanten i resirkuleringssymbolet og arkitekter fra Mexico til Astana bruker Möbius-topologi til slagkraftige installasjoner.",
      },
      {
        domain: "Kjemi",
        description:
          "Möbius-aromatiske molekyler (Heilbronner 1964; først syntetisert i 2003) har en halv vridning av π-elektronene og viser elektroniske egenskaper ingen plan ring kan ha.",
      },
    ],
    eulerchar: [
      {
        domain: "Datagrafikk",
        description:
          "Mesh-validering (Blender, Maya) sjekker V−E+F mot forventet χ for å oppdage hull eller duplisert geometri før 3D-utskrift.",
      },
      {
        domain: "Datatopologi",
        description:
          "Pipelinene for persistent homologi bruker Euler-karakteristikker for å oppsummere formen til høydimensjonale punktskyer – brukt i genomikk, sensornettverk og kosmologi.",
      },
      {
        domain: "Arkitektur",
        description:
          "Buckminster Fullers geodetiske kupler (Spaceship Earth på Epcot, Biosphère i Montreal) er konstruert slik at V−E+F=2 tvinger fram nøyaktig 12 femkanter blant sekskantene.",
      },
      {
        domain: "Fotballdesign",
        description:
          "Den klassiske trunkerte ikosaeder-fotballen har 12 femkanter og 20 sekskanter; Eulers formel forklarer hvorfor det er nøyaktig 12, ikke færre.",
      },
      {
        domain: "Partikkelfysikk",
        description:
          "Atiyah–Singers indeksteorem, grunnleggende for moderne gaugeteori, generaliserer Eulers formel og knytter topologi til differensiallikninger.",
      },
    ],
    konigsberg: [
      {
        domain: "Grafteoriens fødsel",
        description:
          "Königsberg satte hele feltet i gang – grafteori ligger i dag bak Googles PageRank, sosial nettverksanalyse, brikkelayout og ruteplanlegging.",
      },
      {
        domain: "DNA-sekvensering",
        description:
          "Eulervei-algoritmer inspirert av Königsberg er trekkdyrene bak moderne genommontering (Pevzner og Tang, 2001; brukt i SPAdes, Velvet, megahit).",
      },
      {
        domain: "Ruteoptimering",
        description:
          "Postbud, søppelbiler og brøytebiler løser det kinesiske postbudproblemet – en direkte etterkommer av broene i Königsberg.",
      },
      {
        domain: "Turisme",
        description:
          "Kaliningrad (dagens Königsberg) markedsfører broene; turister forsøker spaserturen selv om bare fem av de opprinnelige sju overlevde andre verdenskrig.",
      },
    ],
    fourcolor: [
      {
        domain: "Kartdesign",
        description:
          "Kartografer og GIS-ingeniører bruker faktisk firefargingsalgoritmer på politiske kart, atlas over land og værvisualisering.",
      },
      {
        domain: "Mobilnett",
        description:
          "Frekvenstildeling mellom mobilmaster reduseres til grafkoloring – firefarge-teoremet er grensetilfellet for visse plane oppsett.",
      },
      {
        domain: "Planlegging",
        description:
          "Universitetenes eksamensplaner, konferanseromsbestilling og idrettsligaer er alle grafkoloringsproblemer; plane varianter arver firefargegrensen.",
      },
      {
        domain: "Datamaskinverifisert matematikk",
        description:
          "Sammen med Keplers formodning var firefarge-teoremet en milepæl innen datamaskinassistert bevisførsel – bevisassistentmiljøet (Coq, Lean) sporer sin legitimitet hit.",
      },
    ],
    smallworld: [
      {
        domain: "Sosiale nettverk",
        description:
          "LinkedIns funksjon for «annengradskontakter», Twitters retweet-kaskader og Facebooks «folk du kanskje kjenner» utnytter alle small-world-struktur for relevans.",
      },
      {
        domain: "Epidemimodeller",
        description:
          "Modellering av COVID-19-spredning, smittesporingsapper og vaksinasjonsstrategier bruker small-world-nettverksmodeller for å forutsi utbruddsdynamikk.",
      },
      {
        domain: "Hjerneforskning",
        description:
          "fMRI-studier viser at det menneskelige konnektomet er et small-world-nettverk – small-world-koeffisienten er i dag en standard biomarkør i forskning på Alzheimers og schizofreni.",
      },
      {
        domain: "Internett-ruting",
        description:
          "Internetts graf over autonome systemer har small-world-egenskaper; BGP og moderne CDN-er (Cloudflare, Fastly) utnytter de korte hop-avstandene.",
      },
      {
        domain: "Six Degrees of Kevin Bacon",
        description:
          "Filmleken fra 1994 og nettstedet for Bacon-tall er populærkulturelle avtrykk av small-world-teorien; matematikere konkurrerer om lave Erdős-tall.",
      },
    ],
    diffusion: [
      {
        domain: "Bildegenerering",
        description:
          "Stable Diffusion, Midjourney, DALL·E 3 og Imagen er alle latente diffusjonsmodeller. Skriv en prompt og modellen vandrer gaussisk støy tilbake til et bilde som passer teksten.",
      },
      {
        domain: "Videogenerering",
        description:
          "Sora, Veo og Runway utvider den samme diffusjonsmatematikken til tre dimensjoner (høyde × bredde × tid) slik at støyfjerneren lærer rom-tid-konsistens i tillegg til utseende.",
      },
      {
        domain: "Legemiddel- og proteindesign",
        description:
          "RFdiffusion (Baker-laboratoriet) og Chroma genererer nye proteinrygger ved å støyfjerne 3D-koordinater i stedet for piksler — publiserte kandidater har blitt syntetisert og folder seg korrekt.",
      },
      {
        domain: "Lyd og tale",
        description:
          "AudioLDM, Riffusion og talesyntese-linjen ElevenLabs/Vall-E bruker 1D-diffusjon over bølgeformer eller spektrogrammer for å generere musikk og naturlig klingende stemmer ut fra tekst.",
      },
      {
        domain: "Fysikk og termodynamikk",
        description:
          "Fremoverprosessen er bokstavelig talt Langevin-dynamikk — støyplanen speiler et system som relakserer mot termisk likevekt. Sohl-Dicksteins originalartikkel fra 2015 var formulert som ikke-likevektstermodynamikk.",
      },
    ],
    quine: [
      {
        domain: "Programspråkteori",
        description:
          "Quiner er den standard sanity-testen på at et språk er uttrykksfullt nok for selvreferanse; kurs i beregnbarhetsteori bruker dem til å undervise Kleenes rekursjonssetning i konkret form.",
      },
      {
        domain: "Datavirus & selvreplikatorer",
        description:
          "Hvert klassisk virus, orm og metamorfisk motor er en quine-variant: kode som kopierer seg selv før den gjør noe annet. Moderne selvreplikerende skadevare studeres som anvendt quine-ingeniørkunst.",
      },
      {
        domain: "Genetikk & molekylærbiologi",
        description:
          "DNA-replikering er biologiens quine: en sekvens hvis eneste oppgave er å kopiere seg selv, inkludert kopieringsmaskineriet. Hofstadter trekker analogien eksplisitt i Gödel, Escher, Bach.",
      },
      {
        domain: "Kompilator-bootstrapping",
        description:
          "Trusting Trust (Ken Thompson, 1984) viste at en kompilators kompilator kan være en quine som setter inn en bakdør ved hver build — grunnlaget for forsyningskjedesikkerhet og forskning på reproduserbare builds.",
      },
      {
        domain: "Demoscene & kodekunst",
        description:
          "Polyglotte quiner — programmer som skriver seg selv ut og er gyldige i flere språk samtidig — er en elsket kodekunst-sjanger; IOCCC har en egen quine-kategori.",
      },
    ],
    riemann: [
      {
        domain: "Primtallssetningen",
        description:
          "Feilledd i tellingen av primtall under N styres av nullpunktene til ζ; Riemannhypotesen er ekvivalent med den skarpest mulige skranken på hvor uregelmessig primtallene er fordelt.",
      },
      {
        domain: "Kryptografi",
        description:
          "RSA, elliptisk-kurve-kryptografi og hardheten i faktorisering hviler på antakelser om primtallenes fordeling; RH-ekvivalente utsagn gir de beste kjente skrankene for kryptografisk sikkerhet.",
      },
      {
        domain: "Kvantekaos",
        description:
          "Statistikken over avstandene mellom zeta-nullpunkter faller sammen med egenverdistatistikken til store tilfeldige hermitiske matriser — de samme matrisene som modellerer energinivåer i tunge atomkjerner. Montgomery–Dyson-formodningen (1972) er en av matematikkens mest overraskende broer.",
      },
      {
        domain: "Datamaskinverifisert numerikk",
        description:
          "De første 10^13 ikke-trivielle nullpunktene er beregnet å ligge på den kritiske linjen (Xavier Gourdon, 2004 og senere). Ingen verifikasjonskampanje har noensinne funnet et moteksempel til RH.",
      },
      {
        domain: "Populærvitenskap og åpen-problem-prestisje",
        description:
          "Riemann er det mest kjente uløste problemet utenfor Fermat — en Clay Millennium-pris (1 M$), gjentatte opptredener i fiksjon (A Beautiful Mind, The Music of the Primes) og en jevn strøm av «bevis» som ikke overlever fagfellevurdering.",
      },
    ],
    backprop: [
      {
        domain: "Dyp læring",
        description:
          "Hvert moderne nevrale nettverk — bildeklassifikator, språkmodell, anbefaler — trenes med backpropagation. PyTorch og JAX implementerer den som sin differensieringskjerne (autograd).",
      },
      {
        domain: "Datamaskinsyn",
        description:
          "Konvolusjonsnett for medisinsk bildebehandling, autonom kjøring og biometrisk identifikasjon lærer filterkjerner direkte fra merket data med backprop; gradienter strømmer bakover gjennom konvolusjoner og pooling.",
      },
      {
        domain: "Språkmodeller",
        description:
          "GPT, Claude, Llama og hver transformer trenes ved å backpropagere kryssentropi gjennom billioner av parametre. Den ene algoritmen som skalerer fra ett nevron til én billion.",
      },
      {
        domain: "Robotikk og kontroll",
        description:
          "Policy-gradient-metoder i forsterkningslæring bruker backprop til å oppdatere nevrale kontrollere fra belønningssignaler; moderne tobeinte gå- og fingerferdige manipulasjonsroboter bruker den.",
      },
      {
        domain: "Inverse problemer i vitenskap",
        description:
          "Fysikere inverterer eksperimenter ved å bygge foroverbevegelses-modellen i PyTorch/JAX og backpropagere gjennom — brukt i proteindesign (AlphaFold), differensierbar rendering og gradientbasert eksperimentdesign.",
      },
    ],
  },
};
