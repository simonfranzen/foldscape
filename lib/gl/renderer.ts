import { VERTEX_SHADER } from "./shader";

export interface UniformState {
  center: [number, number];
  scale: number;
  param: [number, number];
  morph: number;
  contours: number;
  hueShift: number;
  palette: number;
  gridStrength: number;
  exposure: number;
  time: number;
}

export const defaultUniforms = (): UniformState => ({
  center: [0, 0],
  scale: 2.4,
  param: [0.5, 0.5],
  morph: 0,
  contours: 0.8,
  hueShift: 0,
  palette: 0,
  gridStrength: 0.6,
  exposure: 1.0,
  time: 0,
});

export class EmlRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private dpr: number;
  private raf = 0;
  private running = false;
  private fragSrc = "";
  private state: UniformState = defaultUniforms();
  public onError?: (msg: string) => void;
  public onFrame?: (t: number) => void;

  constructor(public canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      premultipliedAlpha: true,
      alpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error("WebGL2 not available");
    this.gl = gl;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.initQuad();
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

  setShader(fragSrc: string): boolean {
    if (fragSrc === this.fragSrc && this.program) return true;
    const gl = this.gl;
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) {
      this.onError?.("shader compile failed");
      return false;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(prog) || "link error";
      this.onError?.(log);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return false;
    }
    if (this.program) gl.deleteProgram(this.program);
    this.program = prog;
    this.fragSrc = fragSrc;
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    this.uniforms = {};
    for (const name of [
      "uResolution",
      "uCenter",
      "uScale",
      "uParam",
      "uTime",
      "uMorph",
      "uContours",
      "uHueShift",
      "uPalette",
      "uGridStrength",
      "uExposure",
    ]) {
      this.uniforms[name] = gl.getUniformLocation(prog, name);
    }
    return true;
  }

  setState(patch: Partial<UniformState>) {
    this.state = { ...this.state, ...patch };
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

  renderOnce() {
    if (!this.program) return;
    const gl = this.gl;
    this.resize();
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    const u = this.uniforms;
    gl.uniform2f(u.uResolution!, this.canvas.width, this.canvas.height);
    gl.uniform2f(u.uCenter!, this.state.center[0], this.state.center[1]);
    gl.uniform1f(u.uScale!, this.state.scale);
    gl.uniform2f(u.uParam!, this.state.param[0], this.state.param[1]);
    gl.uniform1f(u.uTime!, this.state.time);
    gl.uniform1f(u.uMorph!, this.state.morph);
    gl.uniform1f(u.uContours!, this.state.contours);
    gl.uniform1f(u.uHueShift!, this.state.hueShift);
    gl.uniform1i(u.uPalette!, Math.floor(this.state.palette));
    gl.uniform1f(u.uGridStrength!, this.state.gridStrength);
    gl.uniform1f(u.uExposure!, this.state.exposure);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  start() {
    if (this.running) return;
    this.running = true;
    const t0 = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      this.state.time = (now - t0) / 1000;
      this.renderOnce();
      this.onFrame?.(this.state.time);
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
    if (this.program) gl.deleteProgram(this.program);
    if (this.vao) gl.deleteVertexArray(this.vao);
  }
}

function compileShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh), "\n", src);
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}
