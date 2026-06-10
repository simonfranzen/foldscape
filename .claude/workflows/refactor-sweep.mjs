export const meta = {
  name: 'foldscape-refactor-sweep',
  description: '48 topic-owned refactor agents + 2 shared-sweep agents in parallel worktrees.',
  phases: [{ title: 'Sweep' }],
};

const TOPICS = [
  ['aizawa', ['app/aizawa', 'components/AizawaInlineMini.tsx']],
  ['apollonian', ['app/apollonian', 'components/ApollonianDescartes.tsx', 'components/ApollonianGasket.tsx']],
  ['backprop', ['app/backprop', 'components/BackpropMiniNet.tsx', 'components/signature/BackpropSignatureHero.tsx']],
  ['banach', ['app/banach', 'components/BanachFreeGroup.tsx', 'components/BanachHilbertMini.tsx']],
  ['boids', ['app/boids', 'components/BoidsDemo.tsx']],
  ['buffon', ['app/buffon', 'components/BuffonConvergencePlot.tsx', 'components/BuffonNeedleSim.tsx']],
  ['bzr', ['app/bzr', 'components/BzrOregonator.tsx', 'components/BzrSpiralSim.tsx']],
  ['cantor', ['app/cantor', 'components/CantorDiagonalDemo.tsx', 'components/CantorPowerSetTower.tsx']],
  ['cardioid', ['app/cardioid', 'components/CardioidLightDemo.tsx', 'components/CardioidMandelbrotBridge.tsx']],
  ['chaosgame', ['app/chaosgame', 'components/ChaosGameBarnsleyFern.tsx', 'components/ChaosGameLive.tsx']],
  ['collatz', ['app/collatz', 'components/CollatzReverseTree.tsx', 'components/CollatzTrajectoryPlot.tsx']],
  ['diffusion', ['app/diffusion', 'components/signature/DiffusionSignatureHero.tsx']],
  ['dla', ['app/dla', 'components/DlaMiniSim.tsx']],
  ['doublependulum', ['app/doublependulum', 'components/DoublePendulumSim.tsx', 'components/DoublePendulumTwin.tsx']],
  ['euler', ['app/euler', 'components/EulerTaylorBuilder.tsx', 'components/EulerUnitCircle.tsx']],
  ['eulerchar', ['app/eulerchar']],
  ['fourcolor', ['app/fourcolor', 'components/signature/FourColorVoronoiHero.tsx']],
  ['fourier', ['app/fourier', 'components/FourierHarmonicBuilder.tsx', 'components/FourierSpectrumPlay.tsx']],
  ['gabrielshorn', ['app/gabrielshorn', 'components/GabrielsHornGrowGraph.tsx', 'components/GabrielsHornRenderer.tsx']],
  ['galton', ['app/galton', 'components/GaltonInlineSim.tsx', 'components/GaltonNormalOverlay.tsx']],
  ['godel', ['app/godel', 'components/signature/GodelLoopHero.tsx']],
  ['halting', ['app/halting', 'components/signature/HaltingTapeHero.tsx']],
  ['hilberthotel', ['app/hilberthotel', 'components/HilbertHotelCardinality.tsx', 'components/HilbertHotelInline.tsx']],
  ['iota', ['app/iota', 'components/IotaKSPlayground.tsx', 'components/IotaReducerMini.tsx', 'lib/iota/reduce.ts']],
  ['konigsberg', ['app/konigsberg']],
  ['langton', ['app/langton', 'components/LangtonMiniRunner.tsx']],
  ['life', ['app/life', 'components/LifeGliderDemo.tsx', 'components/LifeMiniSandbox.tsx', 'components/LifeRuleDemo.tsx', 'components/LifeRuleExplorer.tsx', 'lib/life/patterns.ts']],
  ['logistic', ['app/logistic', 'components/LogisticDivergeDemo.tsx', 'components/LogisticRTimeSeries.tsx']],
  ['lorenz', ['app/lorenz', 'components/LorenzInlineRho.tsx', 'components/LorenzTwoOrbits.tsx']],
  ['lsystem', ['app/lsystem', 'components/LsystemRewriteStepper.tsx', 'components/LsystemTurtleRenderer.tsx']],
  ['magpendulum', ['app/magpendulum', 'components/MagPendulumBasinMini.tsx']],
  ['mandelbrot', ['app/mandelbrot', 'components/MandelCDragger.tsx', 'components/MandelMini.tsx', 'components/MandelOrbitDemo.tsx', 'lib/gl/mandelbrot.ts']],
  ['mobius', ['app/mobius', 'components/signature/MobiusStripHero.tsx']],
  ['nand', ['app/nand', 'components/NandGateBuilder.tsx', 'components/NandTruthTable.tsx']],
  ['pascalmod', ['app/pascalmod', 'components/PascalmodCarryDemo.tsx', 'components/PascalmodViewer.tsx']],
  ['penrose', ['app/penrose', 'components/PenroseGoldenRatio.tsx', 'components/PenroseTiling.tsx']],
  ['phi', ['app/phi', 'components/PhiFibonacciConvergence.tsx', 'components/PhiSunflowerSim.tsx']],
  ['pvsnp', ['app/pvsnp']],
  ['riemann', ['app/riemann', 'components/RiemannZetaPath.tsx', 'components/signature/RiemannSignatureHero.tsx']],
  ['rsa', ['app/rsa']],
  ['rule110', ['app/rule110', 'components/Rule110Demo.tsx', 'components/Rule110LookupTable.tsx', 'components/Rule110MiniSimulator.tsx']],
  ['sat', ['app/sat', 'components/SatClauseToggle.tsx', 'components/signature/SatClauseHero.tsx']],
  ['sierpinski', ['app/sierpinski', 'components/SierpinskiSubdivision.tsx', 'components/SierpinskiThreeRoutes.tsx']],
  ['smallworld', ['app/smallworld']],
  ['sternbrocot', ['app/sternbrocot', 'components/SternBrocotTree.tsx', 'components/SternBrocotWalk.tsx']],
  ['turingpattern', ['app/turingpattern', 'components/TuringGallery.tsx', 'components/TuringGrayScott.tsx']],
  ['ulam', ['app/ulam', 'components/UlamQuadraticTester.tsx', 'components/UlamSpiralMini.tsx']],
  ['wang', ['app/wang', 'components/WangAperiodicTiler.tsx', 'components/WangTileGrid.tsx']],
];

const SHARED = [
  ['i18n-and-topic-meta', [
    'lib/i18n/atlas.ts',
    'lib/i18n/bodies.ts',
    'lib/i18n/context.tsx',
    'lib/i18n/cosmos.ts',
    'lib/i18n/messages.ts',
    'lib/i18n/placeholders.ts',
    'lib/i18n/stories.ts',
    'lib/i18n/stories.es.ts',
    'lib/i18n/stories.fr.ts',
    'lib/i18n/stories.it.ts',
    'lib/i18n/stories.no.ts',
    'lib/i18n/stories.pt.ts',
    'lib/i18n/stories.sv.ts',
    'lib/i18n/types.ts',
    'lib/i18n/ui.ts',
    'lib/topics.ts',
    'lib/topicApplications.ts',
    'lib/topicCategoryStyles.ts',
    'lib/topicEdges.ts',
    'lib/topicHubs.ts',
    'lib/topicLinks.ts',
  ]],
  ['shared-components-engine-tests-root-config', [
    'components/Footer.tsx',
    'components/Formula.tsx',
    'components/Info.tsx',
    'components/LocaleSwitcher.tsx',
    'components/Nav.tsx',
    'components/NoiseLadder.tsx',
    'components/RelatedTopics.tsx',
    'components/Reveal.tsx',
    'components/StoryPageShell.tsx',
    'components/TopicApplications.tsx',
    'components/TopicConstellation.tsx',
    'components/TopicStub.tsx',
    'components/cosmos',
    'lib/cosmos',
    'lib/og',
    'tests',
    'app/page.tsx',
    'app/layout.tsx',
    'app/globals.css',
    'app/opengraph-image.tsx',
    'app/about',
    'app/impressum',
    'next.config.mjs',
    'eslint.config.mjs',
    'tsconfig.json',
    'tailwind.config.ts',
    'vitest.config.ts',
    'vitest.setup.ts',
    'postcss.config.mjs',
  ]],
];

const HEX_TABLE = `
"#06070d" -> palette.canvas.bg
"#0b0d18" -> palette.canvas.bgAlt
"#8a90a4" -> palette.canvas.muted
"#fff5d6" -> palette.canvas.ivory
"#05060a" -> palette.ink[950]
"#0a0c12" -> palette.ink[900]
"#11141d" -> palette.ink[800]
"#1a1e2a" -> palette.ink[700]
"#2a2f3f" -> palette.ink[600]
"#6d7388" -> palette.ink[500]
"#828aa1" -> palette.ink[400]
"#a4abbf" -> palette.ink[300]
"#c8cdde" -> palette.ink[200]
"#eaecf3" -> palette.ink[100]
"#b388ff" -> palette.signal.violet
"#7df3ff" -> palette.signal.cyan
"#ffd166" -> palette.signal.amber
"#ff7ab6" -> palette.signal.rose
"#ff8a5c" -> palette.signal.coral
"#7be0c0" -> palette.signal.teal
`;

function buildPrompt(scope, files) {
  return `You are refactor agent **${scope}** in the foldscape monorepo (Next.js 15, TypeScript strict, React 19).

Your working directory IS a fresh git worktree of the repo, branched off \`refactor/sweep-base\` (which already contains \`lib/hooks/useDpr.ts\` and \`lib/visual/palette.ts\`). All paths below are RELATIVE to your worktree root. Use \`pwd\` to confirm your CWD if unsure.

# Your file set (touch ONLY these paths)

${files.map(f => `- ${f}`).join('\n')}

When a path is a directory, you own every .ts/.tsx/.css file recursively inside it. Otherwise, only the listed file.

DO NOT touch anything outside this set. DO NOT touch \`lib/hooks/useDpr.ts\` or \`lib/visual/palette.ts\` (read-only references).

# Refactor checklist (apply across your file set)

1. **DPR clamp -> hook.** Replace inline \`Math.min(window.devicePixelRatio || 1, N)\` with the \`useDpr\` hook from \`@/lib/hooks/useDpr\`. Import: \`import { useDpr } from "@/lib/hooks/useDpr";\`. Default cap is 2; if the existing cap is not 2, pass it: \`const dpr = useDpr(3);\`. The hook is "use client" — only use it inside client components (files with "use client" at top). For non-React contexts (raw fns, server code), use the helper \`getDpr()\` from the same module instead.

2. **Hex colors -> palette tokens.** Where an EXACT string match below appears in TS/TSX (NOT in .css files), replace it with the token. Import: \`import { palette } from "@/lib/visual/palette";\`. Map (case-insensitive match, but write the canonical token):

${HEX_TABLE}

   Don't touch hex codes that don't appear in this map. Don't touch hex codes inside \`globals.css\` or \`tailwind.config.ts\` (these stay literal).

3. **Type safety.** Replace \` any\` annotations with concrete types where the right one is obvious from context — DOM elements (\`HTMLCanvasElement\`, \`HTMLDivElement\`), events (\`React.PointerEvent<HTMLCanvasElement>\`, \`React.WheelEvent\`), common Web APIs. If unsure, LEAVE \`any\` alone.

4. **Casts.** Replace \`as X\` non-const casts with proper type annotations or type guards where SAFE and obvious. Skip if load-bearing or unclear. Don't touch \`as const\`.

5. **Non-null assertions.** Replace \`x!\` with a guard or default if risk-free. Skip otherwise.

6. **Unused imports & locals.** Remove. ESLint \`no-unused-vars\` is the leitfaden.

7. **Comment cleanup.** Remove \`// removed ...\` markers, commented-out code blocks, what-comments (just describing what the line does). KEEP why-comments (constraints, invariants, surprising choices, references to bugs/incidents).

8. **Magic numbers -> named consts** when they have configuration character (limits, thresholds, durations). Hoist to top of file as \`const FOO = 42;\`.

# HARD CONSTRAINTS

- **No behavior change.** Animations, demos, i18n strings, route paths — fachlich unverändert.
- **No new dependencies** in package.json.
- **No new abstractions** beyond using \`useDpr\` / \`palette\`. Don't extract new hooks or utilities.
- **No prose edits.** Stories, atlas card text, captions — leave content untouched even if you reformat surrounding code.
- **No file renames / moves / deletions** unless the file is provably dead (no imports anywhere) — and even then, only delete files inside your own set.

# Workflow

1. \`pwd\` to confirm worktree path. Use Bash to inspect files first if needed (\`wc -l\`, \`grep\`).
2. Apply the checklist file by file. Use Edit for surgical changes, Read first if a file is large.
3. After all edits: \`npm run typecheck 2>&1 | tail -10\`
4. If typecheck fails: undo the edit that broke it. If you cannot get to green, \`git checkout -- .\` to revert ALL your changes, then output \`NOCHANGES\` and exit.
5. If typecheck is green: \`npm run lint -- <your-file-paths> 2>&1 | tail -10\` (errors only — warnings okay).
6. If lint is also green: stage and commit:
   \`\`\`
   git add -A
   git commit -m "refactor(${scope}): <one-line summary of what changed>"
   \`\`\`
   The commit message must have NO trailers. NO "Co-Authored-By", NO AI attribution, NO "Generated with ...".
7. Output: \`git rev-parse HEAD\` and print that SHA.

# Your output

Return ONLY one of:
- A 40-character commit SHA (lowercase hex) on a single line.
- The literal string \`NOCHANGES\` if you committed nothing (no improvements found OR you reverted).

Do not include any other text.`;
}

phase('Sweep');

const tasks = [...TOPICS, ...SHARED].map(([scope, files]) => ({ scope, files }));

log(`Launching ${tasks.length} refactor agents in worktrees (48 topics + 2 shared)`);

const results = await parallel(tasks.map((t) => () =>
  agent(buildPrompt(t.scope, t.files), {
    label: `refactor:${t.scope}`,
    isolation: 'worktree',
    model: 'sonnet',
  }).then((output) => ({
    scope: t.scope,
    output: (output ?? '').trim(),
  }))
));

const settled = results.filter(Boolean);
const committed = settled.filter((r) => /^[0-9a-f]{40}$/i.test(r.output));
const noChanges = settled.filter((r) => r.output === 'NOCHANGES');
const failed = settled.filter((r) => !committed.includes(r) && !noChanges.includes(r));

log(`Result: ${committed.length} committed, ${noChanges.length} no-changes, ${failed.length} unparsed`);

return {
  committed: committed.map((r) => ({ scope: r.scope, sha: r.output })),
  noChanges: noChanges.map((r) => r.scope),
  failed: failed.map((r) => ({ scope: r.scope, output: r.output.slice(0, 200) })),
};
