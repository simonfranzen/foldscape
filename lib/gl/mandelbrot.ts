// Mandelbrot fragment shader + thin renderer. The math is the whole point:
// for each pixel c, iterate z = z² + c starting from 0, count how many steps
// it takes to escape |z| > 2. Map the (possibly smoothed) escape count to a
// colour palette.

export interface MandelState {
  center: [number, number];
  scale: number;        // half-height of view in complex units
  maxIter: number;      // up to ~1500 for deep zooms
  palette: number;      // 0..4
  hueShift: number;     // 0..1
  exposure: number;     // 0.5..2
  time: number;         // for subtle animation
}

export const defaultMandel = (): MandelState => ({
  center: [-0.6, 0],
  scale: 1.4,
  maxIter: 400,
  palette: 0,
  hueShift: 0,
  exposure: 1.0,
  time: 0,
});

const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uResolution;
uniform vec2 uCenter;
uniform float uScale;
uniform int   uMaxIter;
uniform int   uPalette;
uniform float uHueShift;
uniform float uExposure;
uniform float uTime;

const float PI = 3.14159265358979;
const float TAU = 6.28318530717958;

vec3 iqPal(float t, vec3 a, vec3 b, vec3 c, vec3 d){
  return a + b * cos(TAU * (c * t + d));
}
vec3 palette(float t){
  if (uPalette == 0) return iqPal(t, vec3(0.42,0.40,0.55), vec3(0.55,0.50,0.55), vec3(1.0,0.85,0.55), vec3(0.65,0.85,0.20));
  if (uPalette == 1) return iqPal(t, vec3(0.50,0.40,0.55), vec3(0.55,0.50,0.45), vec3(1.0,1.0,0.6), vec3(0.92,0.55,0.18));
  if (uPalette == 2) return iqPal(t, vec3(0.42,0.32,0.30), vec3(0.50,0.45,0.40), vec3(1.10,0.65,0.30), vec3(0.05,0.18,0.50));
  if (uPalette == 3) return iqPal(t, vec3(0.55,0.55,0.40), vec3(0.40,0.45,0.35), vec3(0.85,0.90,0.65), vec3(0.20,0.50,0.85));
  // mono violet
  vec3 base = iqPal(t, vec3(0.36,0.30,0.48), vec3(0.30,0.25,0.40), vec3(1.0,1.0,1.0), vec3(0.0,0.10,0.20));
  float gray = dot(base, vec3(0.299,0.587,0.114));
  return mix(vec3(gray), base * vec3(0.85,0.70,1.20), 0.55);
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec2 c = uCenter + uv * uScale;

  vec2 z = vec2(0.0);
  int iter = uMaxIter;
  float smooth_iter = 0.0;
  for (int i = 0; i < 3200; i++) {
    if (i >= uMaxIter) { iter = uMaxIter; break; }
    z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
    float r2 = dot(z, z);
    if (r2 > 256.0) {
      // smooth (continuous) iteration count
      float log_zn = 0.5 * log(r2);
      float nu = log(log_zn / log(2.0)) / log(2.0);
      smooth_iter = float(i) + 1.0 - nu;
      iter = i;
      break;
    }
  }

  vec3 col;
  if (iter >= uMaxIter) {
    // inside the set — deep ink with a faint internal glow keyed to position
    float interior = 0.05 + 0.05 * cos(c.x * 6.0 + c.y * 4.0 + uTime * 0.4);
    col = vec3(0.02, 0.02, 0.05) + vec3(0.06, 0.04, 0.10) * interior;
  } else {
    float t = fract(smooth_iter * 0.012 + uHueShift);
    col = palette(t);
    // edge bloom
    float edge = smoothstep(0.0, 6.0, smooth_iter - float(uMaxIter) + 12.0);
    col = mix(col, col * 1.4, edge);
    col *= uExposure;
  }
  // gentle vignette
  float r = length((gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y);
  col *= smoothstep(1.7, 0.15, r);
  outColor = vec4(col, 1.0);
}
`;

export class MandelRenderer {
  private gl: WebGL2RenderingContext;
  private prog: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private uni: Record<string, WebGLUniformLocation | null> = {};
  private state: MandelState = defaultMandel();
  private dpr: number;
  private raf = 0;
  private running = false;

  constructor(public canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) throw new Error("WebGL2 not available");
    this.gl = gl;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.initQuad();
    this.initProgram();
  }

  private initQuad() {
    const gl = this.gl;
    const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }

  private initProgram() {
    const gl = this.gl;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    this.prog = prog;
    for (const name of ["uResolution", "uCenter", "uScale", "uMaxIter", "uPalette", "uHueShift", "uExposure", "uTime"]) {
      this.uni[name] = gl.getUniformLocation(prog, name);
    }
  }

  setState(patch: Partial<MandelState>) {
    this.state = { ...this.state, ...patch };
  }

  getState() {
    return { ...this.state };
  }

  resize() {
    const c = this.canvas;
    const w = Math.max(2, Math.floor(c.clientWidth * this.dpr));
    const h = Math.max(2, Math.floor(c.clientHeight * this.dpr));
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
  }

  render() {
    if (!this.prog) return;
    const gl = this.gl;
    this.resize();
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.prog);
    gl.bindVertexArray(this.vao);
    gl.uniform2f(this.uni.uResolution!, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.uni.uCenter!, this.state.center[0], this.state.center[1]);
    gl.uniform1f(this.uni.uScale!, this.state.scale);
    gl.uniform1i(this.uni.uMaxIter!, Math.floor(this.state.maxIter));
    gl.uniform1i(this.uni.uPalette!, Math.floor(this.state.palette));
    gl.uniform1f(this.uni.uHueShift!, this.state.hueShift);
    gl.uniform1f(this.uni.uExposure!, this.state.exposure);
    gl.uniform1f(this.uni.uTime!, this.state.time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  start() {
    if (this.running) return;
    this.running = true;
    const t0 = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      this.state.time = (now - t0) / 1000;
      this.render();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  dispose() {
    this.stop();
    const gl = this.gl;
    if (this.prog) gl.deleteProgram(this.prog);
    if (this.vao) gl.deleteVertexArray(this.vao);
  }
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

// Bookmarks reach progressively deeper into the boundary. Each one knows how
// many iterations it needs; the explorer also auto-bumps iterations with
// continuous zoom.
export const BOOKMARKS = [
  { id: "overview", labelKey: "bookmarkOverview", center: [-0.6, 0] as [number, number], scale: 1.4, maxIter: 300 },
  { id: "seahorse", labelKey: "bookmarkSeahorse", center: [-0.75, 0.1] as [number, number], scale: 0.15, maxIter: 600 },
  { id: "elephant", labelKey: "bookmarkElephant", center: [0.275, 0] as [number, number], scale: 0.07, maxIter: 600 },
  { id: "mini", labelKey: "bookmarkMini", center: [-1.7686, 0] as [number, number], scale: 0.01, maxIter: 900 },
  { id: "spiral", labelKey: "bookmarkSpiral", center: [-0.7756837, 0.1364674] as [number, number], scale: 0.0025, maxIter: 1400 },
  { id: "misiurewicz", labelKey: "bookmarkMisiurewicz", center: [-1.94, 0] as [number, number], scale: 0.003, maxIter: 1200 },
  { id: "lightning", labelKey: "bookmarkLightning", center: [-1.7497219, 0] as [number, number], scale: 0.00012, maxIter: 2000 },
  { id: "selfsim", labelKey: "bookmarkSelfSim", center: [-0.74364085, 0.13182733] as [number, number], scale: 0.0007, maxIter: 1800 },
  { id: "antenna", labelKey: "bookmarkAntenna", center: [-1.99996, 0] as [number, number], scale: 0.00006, maxIter: 2500 },
];

// Helpful: given a continuous zoom factor, suggest a sensible iteration count.
export function suggestedIter(scale: number): number {
  // baseline 200, +60 per decade of zoom past 1
  const zoom = Math.max(0, Math.log10(2.8 / Math.max(scale, 1e-15)));
  return Math.min(3000, Math.max(200, Math.round(200 + zoom * 80)));
}
