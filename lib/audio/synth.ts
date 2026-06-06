// Minimal melodic synth for EML Resonance.
// Drives two slightly-detuned voices through a feedback delay.
// Frequency follows arg(w) quantized to a pentatonic; amplitude follows |w|.

const PENTATONIC = [0, 2, 4, 7, 9]; // semitones from root
const ROOTS = [110, 146.83, 164.81, 220]; // A2, D3, E3, A3 — picked to feel airy

function quantize(freq: number): number {
  // Snap a desired frequency to the nearest pentatonic note across all roots
  let best = freq;
  let bestErr = Infinity;
  for (const root of ROOTS) {
    for (let oct = 0; oct < 5; oct++) {
      for (const semi of PENTATONIC) {
        const f = root * Math.pow(2, oct + semi / 12);
        const err = Math.abs(Math.log(f) - Math.log(freq));
        if (err < bestErr) {
          bestErr = err;
          best = f;
        }
      }
    }
  }
  return best;
}

export class EmlSynth {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private voices: Array<{ osc: OscillatorNode; gain: GainNode; pan: StereoPannerNode }> = [];
  private delay: DelayNode | null = null;
  private feedback: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;

  started = false;

  async start() {
    if (this.started) return;
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    await ctx.resume();
    this.ctx = ctx;

    const out = ctx.createGain();
    out.gain.value = 0.0;
    out.connect(ctx.destination);
    this.out = out;

    // Shimmer delay
    const delay = ctx.createDelay(2.0);
    delay.delayTime.value = 0.34;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2400;

    delay.connect(feedback);
    feedback.connect(filter);
    filter.connect(delay);
    filter.connect(out);
    this.delay = delay;
    this.feedback = feedback;
    this.filter = filter;

    const detunes = [-7, 0, 7]; // cents
    const waves: OscillatorType[] = ["sine", "triangle", "sine"];
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      osc.type = waves[i];
      osc.frequency.value = ROOTS[0];
      osc.detune.value = detunes[i];
      const gain = ctx.createGain();
      gain.gain.value = 0.0;
      const pan = ctx.createStereoPanner();
      pan.pan.value = i === 0 ? -0.4 : i === 2 ? 0.4 : 0;
      osc.connect(gain).connect(pan).connect(out);
      pan.connect(delay);
      osc.start();
      this.voices.push({ osc, gain, pan });
    }

    // master fade in
    out.gain.setTargetAtTime(0.45, ctx.currentTime, 0.4);
    this.started = true;
  }

  stop() {
    if (!this.started || !this.ctx || !this.out) return;
    const ctx = this.ctx;
    this.out.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
    setTimeout(() => {
      this.voices.forEach((v) => v.osc.stop());
      ctx.close();
    }, 400);
    this.started = false;
  }

  // Drive the synth with a complex output w from EML evaluation.
  // mag is |w|, angle is arg(w) ∈ [-π, π].
  drive(mag: number, angle: number) {
    if (!this.ctx || !this.started) return;
    const t = this.ctx.currentTime;
    // Map magnitude → desired pitch (log scale), then quantize
    const logMag = Math.log10(Math.max(mag, 1e-9));
    const desired = Math.pow(2, (logMag + 2) / 2) * 220; // playful mapping
    const clamped = Math.min(Math.max(desired, 80), 1800);
    const freq = quantize(clamped);
    // Voice 1 plays root, voice 2 a fifth, voice 3 a tenth
    const ratios = [1, 1.5, 2.5];
    for (let i = 0; i < this.voices.length; i++) {
      const v = this.voices[i];
      v.osc.frequency.setTargetAtTime(freq * ratios[i], t, 0.05);
      v.pan.pan.setTargetAtTime(Math.sin(angle + i * 0.7) * 0.6, t, 0.08);
    }
    // Amplitude follows how "alive" the value is, with a graceful ceiling
    const amp = Math.tanh(0.35 * (logMag + 2.0));
    const target = Math.max(0.04, Math.min(0.22, 0.04 + 0.18 * Math.abs(amp)));
    for (const v of this.voices) {
      v.gain.gain.setTargetAtTime(target, t, 0.12);
    }
    if (this.filter) {
      this.filter.frequency.setTargetAtTime(800 + Math.abs(angle) * 1600, t, 0.08);
    }
  }

  silence() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    for (const v of this.voices) v.gain.gain.setTargetAtTime(0, t, 0.25);
  }
}
