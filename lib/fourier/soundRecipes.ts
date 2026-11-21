// Amplitude recipes for the Fourier sound lab, kept free of WebAudio and the
// DOM so the audio graph, the spectrum bars, the static waveform and the unit
// tests all read the same numbers.

export type WaveType = "square" | "sawtooth" | "triangle" | "pulse";

export const MAX_HARMONICS = 32;
export const CUSTOM_BANK_SIZE = 8;
// Fraction of each period the pulse wave spends on its high level.
export const PULSE_DUTY = 0.25;

// Square, sawtooth and triangle are odd functions, so their series contain
// sines only. A pulse with a duty cycle other than 1/2 has no point of odd
// symmetry; centred on t = 0 it is even, so its series contains cosines only.
// Feeding its amplitudes to sine partials would not give a pulse at all.
export function usesCosine(wave: WaveType): boolean {
  return wave === "pulse";
}

// Signed amplitude of harmonic k (1-based) for a wave that swings between −1
// and +1. For the pulse the constant term 2d − 1 is left out: it is inaudible
// and an oscillator bank cannot produce it.
export function canonicalCoefficient(wave: WaveType, k: number): number {
  if (wave === "square") {
    return k % 2 === 1 ? 4 / (Math.PI * k) : 0;
  }
  if (wave === "sawtooth") {
    return ((2 / Math.PI) * (k % 2 === 0 ? -1 : 1)) / k;
  }
  if (wave === "triangle") {
    if (k % 2 === 0) return 0;
    return (8 / (Math.PI * Math.PI) / (k * k)) * Math.sin((k * Math.PI) / 2);
  }
  const s = Math.sin(Math.PI * k * PULSE_DUTY);
  // sin(π·k·d) is an exact zero whenever k·d is an integer; rounding noise
  // there would show up as "-0.00" on the sliders.
  return Math.abs(s) < 1e-12 ? 0 : (4 / (Math.PI * k)) * s;
}

// Amplitude actually played for harmonic k. In custom mode only the slider
// bank sounds: partials above it are silent rather than quietly following the
// target, so what you hear is exactly what the sliders show.
export function partialAmplitude(
  wave: WaveType,
  k: number,
  custom: boolean,
  customs: ReadonlyArray<number>,
): number {
  if (custom) return k <= customs.length ? customs[k - 1] : 0;
  return canonicalCoefficient(wave, k);
}

// Value of the partial sum at phase x (radians, one period = 2π).
export function partialSum(
  wave: WaveType,
  harmonics: number,
  custom: boolean,
  customs: ReadonlyArray<number>,
  x: number,
): number {
  const cosine = usesCosine(wave);
  let y = 0;
  for (let k = 1; k <= harmonics; k++) {
    const a = partialAmplitude(wave, k, custom, customs);
    if (a !== 0) y += a * (cosine ? Math.cos(k * x) : Math.sin(k * x));
  }
  return y;
}

// Gain of every oscillator (index k − 1) before the master fader. The partials
// are phase-locked, so they can all peak at the same instant: cosines do at
// t = 0. Dividing by the sum of the absolute amplitudes is the only scaling
// that keeps the summed signal within ±1 for every recipe and slider setting;
// a 1/√N rule assumes random phases and lets eight equal cosines reach 2.8.
export function partialGains(
  wave: WaveType,
  harmonics: number,
  custom: boolean,
  customs: ReadonlyArray<number>,
): number[] {
  const amps: number[] = [];
  let total = 0;
  for (let k = 1; k <= MAX_HARMONICS; k++) {
    const a = k <= harmonics ? partialAmplitude(wave, k, custom, customs) : 0;
    amps.push(a);
    total += Math.abs(a);
  }
  return total > 0 ? amps.map((a) => a / total) : amps;
}
