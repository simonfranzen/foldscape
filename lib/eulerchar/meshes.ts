// Meshes for the Euler-characteristic explorer, kept free of React and the DOM
// so the counts can be unit-tested. χ is deliberately not a field: callers
// compute V − E + F, and tests/utilities.test.ts checks that V, E and F match
// the mesh, so a displayed χ can never disagree with what is drawn.

export type Vec3 = readonly [number, number, number];

export interface Polyhedron {
  readonly id: string;
  readonly label: string;
  readonly V: number;
  readonly E: number;
  readonly F: number;
  readonly note: string;
  readonly vertices: ReadonlyArray<Vec3>;
  readonly edges: ReadonlyArray<readonly [number, number]>;
  readonly faces: ReadonlyArray<ReadonlyArray<number>>;
}

// ---- Polyhedron data ------------------------------------------------------

const PHI = (1 + Math.sqrt(5)) / 2; // golden ratio
const INV_PHI = 1 / PHI;

// Normalise a list of vertices so the model fits roughly in a unit sphere.
export function normaliseVerts(verts: ReadonlyArray<Vec3>): ReadonlyArray<Vec3> {
  let maxR = 0;
  for (const v of verts) {
    const r = Math.hypot(v[0], v[1], v[2]);
    if (r > maxR) maxR = r;
  }
  if (maxR === 0) return verts;
  return verts.map((v): Vec3 => [v[0] / maxR, v[1] / maxR, v[2] / maxR]);
}

// Wind every face of a convex solid centred on the origin so that its normal
// points outwards. The renderer culls faces whose normal points away from the
// camera, so a face listed in the wrong rotational sense would vanish exactly
// when it should be visible. Doing this in code beats hand-checking each list.
function orientOutward(
  verts: ReadonlyArray<Vec3>,
  faces: ReadonlyArray<ReadonlyArray<number>>,
): ReadonlyArray<ReadonlyArray<number>> {
  return faces.map((face) => {
    const [a, b, c] = [verts[face[0]], verts[face[1]], verts[face[2]]];
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    let dot = 0;
    for (const i of face) dot += n[0] * verts[i][0] + n[1] * verts[i][1] + n[2] * verts[i][2];
    return dot < 0 ? [...face].reverse() : face;
  });
}

// Derive an edge list from a face list: every adjacent pair of vertices in a
// face is an edge, deduplicated so that {a, b} == {b, a}.
export function edgesFromFaces(
  faces: ReadonlyArray<ReadonlyArray<number>>,
): ReadonlyArray<readonly [number, number]> {
  const seen = new Set<string>();
  const out: Array<readonly [number, number]> = [];
  for (const face of faces) {
    for (let i = 0; i < face.length; i++) {
      const a = face[i];
      const b = face[(i + 1) % face.length];
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(a < b ? [a, b] : [b, a]);
      }
    }
  }
  return out;
}

// Tetrahedron: 4 vertices, 6 edges, 4 faces.
export function buildTetrahedron(): Polyhedron {
  const verts: ReadonlyArray<Vec3> = normaliseVerts([
    [1, 1, 1],
    [1, -1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
  ]);
  const faces = orientOutward(verts, [
    [0, 2, 1],
    [0, 1, 3],
    [0, 3, 2],
    [1, 2, 3],
  ]);

  return {
    id: "tetrahedron",
    label: "Tetrahedron",
    V: 4,
    E: 6,
    F: 4,
    note: "4 triangles · χ = 2",
    vertices: verts,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Cube: 8 vertices, 12 edges, 6 faces.
export function buildCube(): Polyhedron {
  const verts: ReadonlyArray<Vec3> = normaliseVerts([
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ]);
  const faces: ReadonlyArray<ReadonlyArray<number>> = [
    [0, 3, 2, 1], // back
    [4, 5, 6, 7], // front
    [0, 1, 5, 4], // bottom
    [2, 3, 7, 6], // top
    [1, 2, 6, 5], // right
    [0, 4, 7, 3], // left
  ];
  return {
    id: "cube",
    label: "Cube",
    V: 8,
    E: 12,
    F: 6,
    note: "6 squares · χ = 2",
    vertices: verts,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Octahedron: 6 vertices, 12 edges, 8 faces.
export function buildOctahedron(): Polyhedron {
  const verts: ReadonlyArray<Vec3> = normaliseVerts([
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ]);
  const faces: ReadonlyArray<ReadonlyArray<number>> = [
    [0, 2, 4],
    [2, 1, 4],
    [1, 3, 4],
    [3, 0, 4],
    [2, 0, 5],
    [1, 2, 5],
    [3, 1, 5],
    [0, 3, 5],
  ];
  return {
    id: "octahedron",
    label: "Octahedron",
    V: 6,
    E: 12,
    F: 8,
    note: "8 triangles · χ = 2",
    vertices: verts,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Icosahedron: 12 vertices, 30 edges, 20 faces.
export function buildIcosahedron(): Polyhedron {
  // Vertices on three mutually perpendicular golden rectangles.
  const a = 1;
  const b = PHI;
  const v: ReadonlyArray<Vec3> = normaliseVerts([
    [-a, b, 0],
    [a, b, 0],
    [-a, -b, 0],
    [a, -b, 0],
    [0, -a, b],
    [0, a, b],
    [0, -a, -b],
    [0, a, -b],
    [b, 0, -a],
    [b, 0, a],
    [-b, 0, -a],
    [-b, 0, a],
  ]);
  const faces: ReadonlyArray<ReadonlyArray<number>> = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ];
  return {
    id: "icosahedron",
    label: "Icosahedron",
    V: 12,
    E: 30,
    F: 20,
    note: "20 triangles · χ = 2",
    vertices: v,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Dodecahedron: 20 vertices, 30 edges, 12 faces. Built as the dual of the
// icosahedron (face-centres of the icosahedron, in pentagonal cycles).
export function buildDodecahedron(): Polyhedron {
  const p = PHI;
  const q = INV_PHI;
  const v: ReadonlyArray<Vec3> = normaliseVerts([
    [1, 1, 1], // 0
    [1, 1, -1], // 1
    [1, -1, 1], // 2
    [1, -1, -1], // 3
    [-1, 1, 1], // 4
    [-1, 1, -1], // 5
    [-1, -1, 1], // 6
    [-1, -1, -1], // 7
    [0, q, p], // 8
    [0, q, -p], // 9
    [0, -q, p], // 10
    [0, -q, -p], // 11
    [q, p, 0], // 12
    [q, -p, 0], // 13
    [-q, p, 0], // 14
    [-q, -p, 0], // 15
    [p, 0, q], // 16
    [p, 0, -q], // 17
    [-p, 0, q], // 18
    [-p, 0, -q], // 19
  ]);
  // 12 pentagonal faces, vertex order chosen so the cross product of two
  // adjacent edges points outwards (used for back-face culling / shading).
  const faces = orientOutward(v, [
    [0, 8, 4, 14, 12],
    [0, 12, 1, 17, 16],
    [0, 16, 2, 10, 8],
    [1, 9, 5, 14, 12],
    [1, 17, 3, 11, 9],
    [2, 16, 17, 3, 13],
    [2, 13, 15, 6, 10],
    [3, 11, 7, 15, 13],
    [4, 8, 10, 6, 18],
    [4, 18, 19, 5, 14],
    [5, 19, 7, 11, 9],
    [6, 15, 7, 19, 18],
  ]);

  return {
    id: "dodecahedron",
    label: "Dodecahedron",
    V: 20,
    E: 30,
    F: 12,
    note: "12 pentagons · χ = 2",
    vertices: v,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Truncated tetrahedron: chop each vertex of the tetrahedron at 1/3.
// 12 vertices, 18 edges, 8 faces (4 hexagons + 4 triangles).
export function buildTruncatedTetrahedron(): Polyhedron {
  // Standard coordinates: all permutations of (0, ±1, ±3) with an even number
  // of minus signs (12 points).
  const raw: Vec3[] = [];
  const signs = [
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ];
  // Even sign count for (0, ±1, ±3) means signs match the pattern... we
  // instead enumerate explicitly to avoid mistakes: standard truncated-tetra
  // vertices (Wikipedia): (+3,+1,+1),(+1,+3,+1),(+1,+1,+3) and even perms +
  // sign flips that give an even parity.
  const base: Vec3[] = [
    [3, 1, 1],
    [1, 3, 1],
    [1, 1, 3],
    [-3, -1, 1],
    [-1, -3, 1],
    [-1, -1, 3],
    [-3, 1, -1],
    [-1, 3, -1],
    [-1, 1, -3],
    [3, -1, -1],
    [1, -3, -1],
    [1, -1, -3],
  ];
  for (const b of base) raw.push(b);
  // (signs is unused, kept above only as a parity reference)
  void signs;
  const v = normaliseVerts(raw);
  // Faces (4 triangles + 4 hexagons), each indexed into the `base` array
  // above, ordered so the outward normal is consistent.
  const faces = orientOutward(v, [
    // 4 triangles: one per original tetra vertex (the truncation cap)
    [0, 1, 2], // near +x+y+z corner
    [3, 5, 4], // near -x-y+z corner
    [6, 7, 8], // near -x+y-z corner
    [9, 11, 10], // near +x-y-z corner
    // 4 hexagons: one per original tetra face
    [0, 2, 5, 4, 10, 9], // bottom (y minimal side mixed)
    [0, 9, 11, 8, 7, 1], // back
    [1, 7, 6, 3, 5, 2], // left/top
    [3, 6, 8, 11, 10, 4], // bottom-back
  ]);

  return {
    id: "trunctetra",
    label: "Truncated tetrahedron",
    V: 12,
    E: 18,
    F: 8,
    note: "4 hex + 4 tri · χ = 2",
    vertices: v,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Cuboctahedron: 12 vertices, 24 edges, 14 faces (8 triangles + 6 squares).
// Vertices: all permutations of (±1, ±1, 0).
export function buildCuboctahedron(): Polyhedron {
  const v: ReadonlyArray<Vec3> = normaliseVerts([
    [1, 1, 0], // 0
    [1, -1, 0], // 1
    [-1, 1, 0], // 2
    [-1, -1, 0], // 3
    [1, 0, 1], // 4
    [1, 0, -1], // 5
    [-1, 0, 1], // 6
    [-1, 0, -1], // 7
    [0, 1, 1], // 8
    [0, 1, -1], // 9
    [0, -1, 1], // 10
    [0, -1, -1], // 11
  ]);
  // 8 triangular faces (one per cube corner direction) + 6 square faces
  // (one per cube face direction).
  const faces: ReadonlyArray<ReadonlyArray<number>> = [
    // Triangles, oriented outward
    [0, 8, 4], // +x +y +z
    [0, 5, 9], // +x +y -z
    [1, 4, 10], // +x -y +z
    [1, 11, 5], // +x -y -z
    [2, 6, 8], // -x +y +z
    [2, 9, 7], // -x +y -z
    [3, 10, 6], // -x -y +z
    [3, 7, 11], // -x -y -z
    // Squares (one per cube face)
    [0, 4, 1, 5], // +x
    [2, 7, 3, 6], // -x
    [0, 9, 2, 8], // +y
    [1, 10, 3, 11], // -y
    [4, 8, 6, 10], // +z
    [5, 11, 7, 9], // -z
  ];
  return {
    id: "cuboctahedron",
    label: "Cuboctahedron",
    V: 12,
    E: 24,
    F: 14,
    note: "8 tri + 6 sq · χ = 2",
    vertices: v,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Truncated icosahedron: the soccer ball. 60 vertices, 90 edges, 32 faces
// (12 pentagons + 20 hexagons). Built by truncating each vertex of an
// icosahedron at 1/3 of the way along each incident edge.
export function buildTruncatedIcosahedron(): Polyhedron {
  const ico = buildIcosahedron();
  // For each original edge (a, b) of the icosahedron, place two new vertices,
  // one at 1/3 from a to b and one at 1/3 from b to a. Each original vertex
  // is replaced by a pentagon of these new points; each original face becomes
  // a hexagon.
  const newVerts: Vec3[] = [];
  // Index: for an edge (a, b) with a < b, store the index of the truncation
  // point closer to a in cutAt[a][b], and the one closer to b in cutAt[b][a].
  const cutAt: Map<number, Map<number, number>> = new Map();
  const getCut = (from: number, to: number): number => {
    const inner = cutAt.get(from);
    if (!inner) return -1;
    return inner.get(to) ?? -1;
  };
  const addCut = (from: number, to: number, idx: number): void => {
    let inner = cutAt.get(from);
    if (!inner) {
      inner = new Map();
      cutAt.set(from, inner);
    }
    inner.set(to, idx);
  };

  for (const [a, b] of ico.edges) {
    const va = ico.vertices[a];
    const vb = ico.vertices[b];
    const pA: Vec3 = [
      va[0] + (vb[0] - va[0]) / 3,
      va[1] + (vb[1] - va[1]) / 3,
      va[2] + (vb[2] - va[2]) / 3,
    ];
    const pB: Vec3 = [
      vb[0] + (va[0] - vb[0]) / 3,
      vb[1] + (va[1] - vb[1]) / 3,
      vb[2] + (va[2] - vb[2]) / 3,
    ];
    addCut(a, b, newVerts.length);
    newVerts.push(pA);
    addCut(b, a, newVerts.length);
    newVerts.push(pB);
  }

  // Hexagonal faces: each icosahedron triangle [a, b, c] becomes a hexagon
  // [cut(a→b), cut(b→a), cut(b→c), cut(c→b), cut(c→a), cut(a→c)].
  const hexFaces: number[][] = [];
  for (const face of ico.faces) {
    const [a, b, c] = face;
    hexFaces.push([
      getCut(a, b),
      getCut(b, a),
      getCut(b, c),
      getCut(c, b),
      getCut(c, a),
      getCut(a, c),
    ]);
  }

  // Pentagonal faces: each icosahedron vertex contributes one pentagon made
  // of the five truncation points closest to that vertex. We collect, then
  // sort them by their angular position around the vertex normal.
  const pentFaces: number[][] = [];
  for (let vIdx = 0; vIdx < ico.vertices.length; vIdx++) {
    const cuts: number[] = [];
    const inner = cutAt.get(vIdx);
    if (inner) {
      for (const [, cutIndex] of inner) cuts.push(cutIndex);
    }
    if (cuts.length === 0) continue;
    const centre = ico.vertices[vIdx];
    // Build a local 2D frame in the plane perpendicular to `centre`.
    const ref: Vec3 = Math.abs(centre[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const u: Vec3 = [
      centre[1] * ref[2] - centre[2] * ref[1],
      centre[2] * ref[0] - centre[0] * ref[2],
      centre[0] * ref[1] - centre[1] * ref[0],
    ];
    const uLen = Math.hypot(u[0], u[1], u[2]);
    const ux: Vec3 = [u[0] / uLen, u[1] / uLen, u[2] / uLen];
    const wx: Vec3 = [
      centre[1] * ux[2] - centre[2] * ux[1],
      centre[2] * ux[0] - centre[0] * ux[2],
      centre[0] * ux[1] - centre[1] * ux[0],
    ];
    cuts.sort((i, j) => {
      const pi = newVerts[i];
      const pj = newVerts[j];
      const ai = Math.atan2(
        pi[0] * wx[0] + pi[1] * wx[1] + pi[2] * wx[2],
        pi[0] * ux[0] + pi[1] * ux[1] + pi[2] * ux[2],
      );
      const aj = Math.atan2(
        pj[0] * wx[0] + pj[1] * wx[1] + pj[2] * wx[2],
        pj[0] * ux[0] + pj[1] * ux[1] + pj[2] * ux[2],
      );
      return ai - aj;
    });
    pentFaces.push(cuts);
  }

  const allFaces: ReadonlyArray<ReadonlyArray<number>> = [...pentFaces, ...hexFaces];
  return {
    id: "truncico",
    label: "Truncated icosahedron",
    V: 60,
    E: 90,
    F: 32,
    note: "12 pent + 20 hex · χ = 2 · the soccer ball",
    vertices: normaliseVerts(newVerts),
    edges: edgesFromFaces(allFaces),
    faces: allFaces,
  };
}

// Subdivided icosphere (a sphere approximation): used to illustrate that no
// matter how fine the triangulation, χ stays 2.
export function buildIcosphere(subdivisions: number): Polyhedron {
  let verts: Vec3[] = buildIcosahedron().vertices.map((v) => [v[0], v[1], v[2]]);
  let faces: number[][] = buildIcosahedron().faces.map((f) => [...f]);
  for (let s = 0; s < subdivisions; s++) {
    const midCache = new Map<string, number>();
    const midpoint = (i: number, j: number): number => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      const existing = midCache.get(key);
      if (existing !== undefined) return existing;
      const a = verts[i];
      const b = verts[j];
      const m: Vec3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
      const len = Math.hypot(m[0], m[1], m[2]);
      const mNorm: Vec3 = [m[0] / len, m[1] / len, m[2] / len];
      const idx = verts.length;
      verts.push(mNorm);
      midCache.set(key, idx);
      return idx;
    };
    const newFaces: number[][] = [];
    for (const [a, b, c] of faces) {
      const ab = midpoint(a, b);
      const bc = midpoint(b, c);
      const ca = midpoint(c, a);
      newFaces.push([a, ab, ca]);
      newFaces.push([b, bc, ab]);
      newFaces.push([c, ca, bc]);
      newFaces.push([ab, bc, ca]);
    }
    faces = newFaces;
  }
  // Normalise to unit sphere
  verts = verts.map((v) => {
    const r = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / r, v[1] / r, v[2] / r];
  });
  const facesRO: ReadonlyArray<ReadonlyArray<number>> = faces;
  const edges = edgesFromFaces(facesRO);
  const V = verts.length;
  const E = edges.length;
  const F = facesRO.length;
  return {
    id: `icosphere-${subdivisions}`,
    label: `Icosphere (${subdivisions}×)`,
    V,
    E,
    F,
    note: `${V} − ${E} + ${F} = ${V - E + F} · χ stays 2`,
    vertices: verts,
    edges,
    faces: facesRO,
  };
}

// Torus: V − E + F = 0. Built as a U × V grid (M longitudes × N latitudes)
// of quads. With M·N vertices, 2·M·N edges and M·N quad faces, the rule
// V − E + F = M·N − 2·M·N + M·N = 0 holds exactly.
export function buildTorus(M: number, N: number, R: number, r: number): Polyhedron {
  const verts: Vec3[] = [];
  for (let i = 0; i < M; i++) {
    const u = (i / M) * Math.PI * 2;
    for (let j = 0; j < N; j++) {
      const v = (j / N) * Math.PI * 2;
      const cx = (R + r * Math.cos(v)) * Math.cos(u);
      const cy = (R + r * Math.cos(v)) * Math.sin(u);
      const cz = r * Math.sin(v);
      verts.push([cx, cy, cz]);
    }
  }
  const idx = (i: number, j: number) => (((i % M) + M) % M) * N + (((j % N) + N) % N);
  const faces: number[][] = [];
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      faces.push([idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)]);
    }
  }
  const facesRO: ReadonlyArray<ReadonlyArray<number>> = faces;
  const edges = edgesFromFaces(facesRO);
  const V = verts.length;
  const E = edges.length;
  const F = facesRO.length;
  return {
    id: `torus-${M}x${N}`,
    label: "Torus",
    V,
    E,
    F,
    note: `${V} − ${E} + ${F} = ${V - E + F} · χ = 0 (one hole)`,
    vertices: normaliseVerts(verts),
    edges,
    faces: facesRO,
  };
}

// Double torus: a genuine genus-2 surface, built as a connected sum. Each
// torus loses one quad face (χ drops from 0 to −1), and the two boundary
// 4-cycles are identified vertex by vertex. A circle has χ = 0, so the glued
// surface has χ = −1 + −1 − 0 = −2, and the mesh counts confirm it:
// V = 2MN − 4, E = 4MN − 4, F = 2MN − 2.
//
// The grid is shifted by half a cell so that one quad is centred on the
// outermost point of the tube. The second torus is the mirror image of the
// first in the plane x = 0, and the first is placed so that this quad lies
// exactly in that plane. Its four corners are then their own mirror images,
// which is what lets the two holes share vertices without any extra neck.
export function buildDoubleTorus(M: number, N: number, R: number, r: number): Polyhedron {
  const point = (i: number, j: number): Vec3 => {
    const u = ((i - 0.5) / M) * Math.PI * 2;
    const v = ((j - 0.5) / N) * Math.PI * 2;
    return [
      (R + r * Math.cos(v)) * Math.cos(u),
      (R + r * Math.cos(v)) * Math.sin(u),
      r * Math.sin(v),
    ];
  };
  const shift = point(1, 1)[0];
  const wrap = (i: number, j: number) => (((i % M) + M) % M) * N + (((j % N) + N) % N);
  // Corners of the removed quad (cell 0, 0); they exist once and are shared.
  const seam = new Set([wrap(0, 0), wrap(1, 0), wrap(1, 1), wrap(0, 1)]);

  const verts: Vec3[] = [];
  const left: number[] = [];
  const right: number[] = [];
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      const p = point(i, j);
      left.push(verts.length);
      // Seam corners are pinned to x = 0 so rounding cannot open the seam.
      verts.push([seam.has(wrap(i, j)) ? 0 : p[0] - shift, p[1], p[2]]);
    }
  }
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      const k = wrap(i, j);
      if (seam.has(k)) {
        right.push(left[k]);
      } else {
        const p = verts[left[k]];
        right.push(verts.length);
        verts.push([-p[0], p[1], p[2]]);
      }
    }
  }

  const faces: number[][] = [];
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      if (i === 0 && j === 0) continue;
      const cell = [wrap(i, j), wrap(i + 1, j), wrap(i + 1, j + 1), wrap(i, j + 1)];
      faces.push(cell.map((k) => left[k]));
      // Mirroring flips orientation, so the copy is wound the other way round
      // to keep every normal pointing outwards (the renderer culls back faces).
      faces.push(cell.map((k) => right[k]).reverse());
    }
  }
  const facesRO: ReadonlyArray<ReadonlyArray<number>> = faces;
  const edges = edgesFromFaces(facesRO);
  return {
    id: `double-torus-${M}x${N}`,
    label: "Double torus",
    V: verts.length,
    E: edges.length,
    F: facesRO.length,
    note: "two handles · χ = −2 (genus 2)",
    vertices: normaliseVerts(verts),
    edges,
    faces: facesRO,
  };
}

// ---- Preset list ----------------------------------------------------------

export const PRESETS: ReadonlyArray<Polyhedron> = [
  buildTetrahedron(),
  buildCube(),
  buildOctahedron(),
  buildDodecahedron(),
  buildIcosahedron(),
  buildTruncatedTetrahedron(),
  buildCuboctahedron(),
  buildTruncatedIcosahedron(),
  buildIcosphere(2),
  buildTorus(18, 10, 1.0, 0.4),
  buildDoubleTorus(14, 8, 0.9, 0.34),
];
