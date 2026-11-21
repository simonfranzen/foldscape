// Registry of every sub-room guide, keyed by "<topic>/<sub>". The sitemap
// reads it to know which language variants of a room exist; add an entry
// when a room gains a guide.
import type { ExplorerGuide } from "./types";
import { AIZAWA_GUIDE } from "./aizawa";
import { APOLLONIAN_GUIDE } from "./apollonian";
import { BACKPROP_GUIDE } from "./backprop";
import { BANACH_GUIDE } from "./banach";
import { BOIDS_GUIDE } from "./boids";
import { BUFFON_GUIDE } from "./buffon";
import { BZR_GUIDE } from "./bzr";
import { CANTOR_GUIDE } from "./cantor";
import { CARDIOID_GUIDE } from "./cardioid";
import { CHAOSGAME_GUIDE } from "./chaosgame";
import { COLLATZ_GUIDE } from "./collatz";
import { DIFFUSION_GUIDE } from "./diffusion";
import { DLA_GUIDE } from "./dla";
import { DOUBLE_PENDULUM_GUIDE } from "./doublependulum";
import { EULER_GUIDE } from "./euler";
import { EULERCHAR_GUIDE } from "./eulerchar";
import { FOURCOLOR_GUIDE } from "./fourcolor";
import { FOURIER_GUIDE } from "./fourier";
import { FOURIER_SOUND_GUIDE } from "./fourier-sound";
import { GABRIELS_HORN_GUIDE } from "./gabrielshorn";
import { GALTON_GUIDE } from "./galton";
import { GODEL_GUIDE } from "./godel";
import { HALTING_GUIDE } from "./halting";
import { HILBERTHOTEL_GUIDE } from "./hilberthotel";
import { IOTA_REDUCER_GUIDE } from "./iota-reducer";
import { KONIGSBERG_GUIDE } from "./konigsberg";
import { LANGTON_GUIDE } from "./langton";
import { LIFE_SANDBOX_GUIDE } from "./life-sandbox";
import { LOGISTIC_GUIDE } from "./logistic";
import { LOGISTIC_SOUND_GUIDE } from "./logistic-sound";
import { LORENZ_GUIDE } from "./lorenz";
import { LSYSTEM_GUIDE } from "./lsystem";
import { MAGPENDULUM_GUIDE } from "./magpendulum";
import { MANDELBROT_GUIDE } from "./mandelbrot";
import { MOBIUS_GUIDE } from "./mobius";
import { NAND_BUILDER_GUIDE } from "./nand-builder";
import { PASCALMOD_GUIDE } from "./pascalmod";
import { PENROSE_GUIDE } from "./penrose";
import { PHI_GUIDE } from "./phi";
import { PVSNP_GUIDE } from "./pvsnp";
import { RIEMANN_GUIDE } from "./riemann";
import { RSA_GUIDE } from "./rsa";
import { RULE110_SIMULATOR_GUIDE } from "./rule110-simulator";
import { SAT_GUIDE } from "./sat";
import { SIERPINSKI_GUIDE } from "./sierpinski";
import { SMALLWORLD_GUIDE } from "./smallworld";
import { STERNBROCOT_GUIDE } from "./sternbrocot";
import { TURINGPATTERN_GUIDE } from "./turingpattern";
import { ULAM_GUIDE } from "./ulam";
import { WANG_GUIDE } from "./wang";

export const EXPLORER_GUIDES: Record<string, ExplorerGuide> = {
  "aizawa/explorer": AIZAWA_GUIDE,
  "apollonian/explorer": APOLLONIAN_GUIDE,
  "backprop/explorer": BACKPROP_GUIDE,
  "banach/explorer": BANACH_GUIDE,
  "boids/explorer": BOIDS_GUIDE,
  "buffon/explorer": BUFFON_GUIDE,
  "bzr/explorer": BZR_GUIDE,
  "cantor/explorer": CANTOR_GUIDE,
  "cardioid/explorer": CARDIOID_GUIDE,
  "chaosgame/explorer": CHAOSGAME_GUIDE,
  "collatz/explorer": COLLATZ_GUIDE,
  "diffusion/explorer": DIFFUSION_GUIDE,
  "dla/explorer": DLA_GUIDE,
  "doublependulum/explorer": DOUBLE_PENDULUM_GUIDE,
  "euler/explorer": EULER_GUIDE,
  "eulerchar/explorer": EULERCHAR_GUIDE,
  "fourcolor/explorer": FOURCOLOR_GUIDE,
  "fourier/explorer": FOURIER_GUIDE,
  "fourier/sound": FOURIER_SOUND_GUIDE,
  "gabrielshorn/explorer": GABRIELS_HORN_GUIDE,
  "galton/explorer": GALTON_GUIDE,
  "godel/explorer": GODEL_GUIDE,
  "halting/explorer": HALTING_GUIDE,
  "hilberthotel/explorer": HILBERTHOTEL_GUIDE,
  "iota/reducer": IOTA_REDUCER_GUIDE,
  "konigsberg/explorer": KONIGSBERG_GUIDE,
  "langton/explorer": LANGTON_GUIDE,
  "life/sandbox": LIFE_SANDBOX_GUIDE,
  "logistic/explorer": LOGISTIC_GUIDE,
  "logistic/sound": LOGISTIC_SOUND_GUIDE,
  "lorenz/explorer": LORENZ_GUIDE,
  "lsystem/explorer": LSYSTEM_GUIDE,
  "magpendulum/explorer": MAGPENDULUM_GUIDE,
  "mandelbrot/explorer": MANDELBROT_GUIDE,
  "mobius/explorer": MOBIUS_GUIDE,
  "nand/builder": NAND_BUILDER_GUIDE,
  "pascalmod/explorer": PASCALMOD_GUIDE,
  "penrose/explorer": PENROSE_GUIDE,
  "phi/explorer": PHI_GUIDE,
  "pvsnp/explorer": PVSNP_GUIDE,
  "riemann/explorer": RIEMANN_GUIDE,
  "rsa/explorer": RSA_GUIDE,
  "rule110/simulator": RULE110_SIMULATOR_GUIDE,
  "sat/explorer": SAT_GUIDE,
  "sierpinski/explorer": SIERPINSKI_GUIDE,
  "smallworld/explorer": SMALLWORLD_GUIDE,
  "sternbrocot/explorer": STERNBROCOT_GUIDE,
  "turingpattern/explorer": TURINGPATTERN_GUIDE,
  "ulam/explorer": ULAM_GUIDE,
  "wang/explorer": WANG_GUIDE,
};
