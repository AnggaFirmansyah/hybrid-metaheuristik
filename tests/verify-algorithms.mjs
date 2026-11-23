// Mandatory self-check (PRD Section 8.2 + Card Wars 3D Tabletop, Butler 3D & Manual Shorts Beat Audit)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  computeStandardC,
  computeHybridC,
  computeW,
  computeI,
  MetaheuristicRunner
} from '../js/algorithms/hybrid-goa-alo.js';
import {
  generateWorkload,
  generateVmSpeeds,
  runMCT,
  evaluateContinuousPosition,
  runPatternBSimulation
} from '../js/algorithms/mct-goa.js';
import { createRng } from '../js/algorithms/benchmarks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// 1. Validate Modified Parameter c (Eq. 9 & 10) vs Standard GOA c (Eq. 8)
{
  const L = 1000;
  const cMax = 1.0;
  const cMin = 0.00001;
  const cStdHalf = computeStandardC(L / 2, L, cMax, cMin);
  const cHybHalf = computeHybridC(L / 2, L, cMax, cMin);
  assert.ok(Math.abs(cHybHalf - cMin) < 1e-12);
  assert.ok(cHybHalf < cStdHalf * 0.01);
  for (const l of [501, 600, 750, 999, 1000]) {
    const cVal = computeHybridC(l, L, cMax, cMin);
    assert.ok(Number.isFinite(cVal) && cVal >= 0 && cVal <= cMin);
  }
  console.log('[PASS] 1. Modified c (Eq. 9 & 10) reaches cMin at L/2 and stays finite through L=1000');
}

// 2. Validate Staircase Parameter w & I (Eq. 11-12)
{
  const T = 1000;
  assert.equal(computeW(50, T), 1);
  assert.equal(computeW(100, T), 1);
  assert.equal(computeW(101, T), 2);
  assert.equal(computeW(501, T), 3);
  assert.equal(computeW(751, T), 4);
  assert.equal(computeW(901, T), 5);
  assert.equal(computeW(951, T), 6);
  assert.ok(computeI(960, T) > computeI(100, T) * 1000);
  console.log('[PASS] 2. Staircase w in {1..6} and I = 10^w (t/T) match Eq. (11)-(12) thresholds');
}

// 3. Validate Real Convergence on F1 & F13
{
  const f1Runner = new MetaheuristicRunner({ mode: 'hybrid', funcId: 'F1', popSize: 30, maxIter: 100, seed: 42 });
  const f1Init = f1Runner.eliteFit;
  for (let i = 0; i < 100; i++) f1Runner.step();
  assert.ok(Number.isFinite(f1Runner.eliteFit) && f1Runner.eliteFit < f1Init * 0.05);

  const f13Runner = new MetaheuristicRunner({ mode: 'hybrid', funcId: 'F13', popSize: 30, maxIter: 100, seed: 42 });
  const f13Init = f13Runner.eliteFit;
  for (let i = 0; i < 100; i++) f13Runner.step();
  assert.ok(Number.isFinite(f13Runner.eliteFit) && f13Runner.eliteFit < f13Init);
  console.log(`[PASS] 3. Hybrid GOA-ALO converges cleanly: F1 ${f1Init.toFixed(1)} -> ${f1Runner.eliteFit.toExponential(2)}, F13 ${f13Init.toFixed(2)} -> ${f13Runner.eliteFit.toExponential(2)}`);
}

// 4. Validate MCT Seeding (Pattern B)
{
  const tasks = generateWorkload(12, 'skewed', 42);
  const vmSpeeds = generateVmSpeeds(4);
  const mct = runMCT(tasks, vmSpeeds);
  const rng = createRng(99);
  let randSum = 0;
  for (let t = 0; t < 40; t++) randSum += evaluateContinuousPosition(tasks.map(() => rng() * vmSpeeds.length), tasks, vmSpeeds).makespan;
  const randAvg = randSum / 40;
  assert.ok(mct.makespan <= randAvg);

  const sim = runPatternBSimulation({ tasks, vmSpeeds, popSize: 20, maxIter: 50, seedRatio: 0.3, seed: 42 });
  assert.ok(sim.mctGoa.bestMakespan <= mct.makespan + 1e-9);
  console.log(`[PASS] 4. MCT seeding (${mct.makespan.toFixed(2)}s) beats random avg (${randAvg.toFixed(2)}s), refined by GOA to ${sim.mctGoa.bestMakespan.toFixed(2)}s`);
}

// 5. Static Anti-Slop Audit (R-02): Zero em-dash characters across HTML, CSS, JS, Spec & Plan
{
  const filesToScan = [
    'index.html', 'css/atlas-theme.css',
    'js/algorithms/benchmarks.js', 'js/algorithms/mct-goa.js', 'js/algorithms/hybrid-goa-alo.js',
    'js/viz/svg-illustrator.js', 'js/viz/svg-charts.js', 'js/viz/three-lab.js', 'js/viz/world-3d.js',
    'js/ui/deck.js', 'js/ui/shorts-stage.js', 'js/ui/controls.js',
    'docs/superpowers/specs/2026-11-23-card-wars-3d-butler-shorts-design.md',
    'docs/superpowers/plans/2026-11-23-card-wars-3d-butler-shorts.md'
  ];
  for (const rel of filesToScan) {
    const content = fs.readFileSync(path.join(rootDir, rel), 'utf8');
    const violations = [];
    content.split(/\r?\n/).forEach((line, idx) => {
      if (line.includes('\u2014')) violations.push(`${rel}:${idx + 1}`);
    });
    assert.equal(violations.length, 0, `Em-dash (R-02) found: ${violations.join(', ')}`);
  }
  console.log('[PASS] 5. Anti-Slop R-02 static audit: zero em-dash characters across all 14 project files');
}

// 6. 9-Card DOM Wiring, 34 Shorts Beats, 6 Sir Pip Moods, 2D Fallback World, 16+ SVGs & WCAG AA Audit
{
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const slideCount = (html.match(/<section\s+id="[^"]+"\s+class="slide/g) || []).length;
  assert.equal(slideCount, 9, `Expected 9 cards in index.html, found ${slideCount}`);

  const missingIds = [];
  for (const rel of ['js/ui/deck.js', 'js/ui/shorts-stage.js', 'js/ui/controls.js', 'js/viz/world-3d.js']) {
    const src = fs.readFileSync(path.join(rootDir, rel), 'utf8');
    for (const m of src.matchAll(/getElementById\(['"]([a-zA-Z0-9_-]+)['"]\)/g)) {
      if (!html.includes(`id="${m[1]}"`)) missingIds.push(`${rel}:${m[1]}`);
    }
    for (const m of src.matchAll(/bindRangePair\(['"]([a-zA-Z0-9_-]+)['"]/g)) {
      if (!html.includes(`id="${m[1]}-range"`)) missingIds.push(`${rel}:${m[1]}-range`);
      if (!html.includes(`id="${m[1]}-num"`)) missingIds.push(`${rel}:${m[1]}-num`);
    }
    for (const m of src.matchAll(/bindSegmentedTabs\(['"]([a-zA-Z0-9_-]+)['"]/g)) {
      if (!html.includes(`id="${m[1]}"`)) missingIds.push(`${rel}:${m[1]}`);
    }
  }
  assert.equal(missingIds.length, 0, `Missing HTML IDs referenced by JS: ${missingIds.join(', ')}`);

  // Verify Shorts 34-beat storyboard integrity
  const illus = await import('../js/viz/svg-illustrator.js');
  const charts = await import('../js/viz/svg-charts.js');
  const shortsMod = await import('../js/ui/shorts-stage.js');
  const worldMod = await import('../js/viz/world-3d.js');

  assert.equal(shortsMod.INTRO_BEATS.length, 2, 'INTRO_BEATS must have 2 intro dialogue beats');
  assert.equal(shortsMod.CARD_BEATS.length, 9, 'CARD_BEATS must have exactly 9 cards');
  assert.ok(html.includes('id="intro-stage"') && html.includes('id="butler-dialogue-box"'), 'Intro stage & floating Butler dialogue box missing in HTML');

  // Verify CSS never uses persistent rotateY(180deg) that causes mirrored backface bleed
  const cssSrc = fs.readFileSync(path.join(rootDir, 'css/atlas-theme.css'), 'utf8');
  assert.ok(!cssSrc.includes('rotateY(180deg)'), 'CSS must not use rotateY(180deg) persistent backface flip');
  let totalBeats = 0;
  shortsMod.CARD_BEATS.forEach((beats, cardIdx) => {
    assert.ok(beats.length >= 3 && beats.length <= 4, `Card ${cardIdx + 1} must have 3-4 beats`);
    beats.forEach((b) => {
      totalBeats += 1;
      assert.ok(illus.BUTLER_MOODS.includes(b.mood), `Invalid Butler mood ${b.mood} in ${b.id}`);
      assert.ok(b.mode === 'diorama' || b.mode === 'interactive', `Invalid beat mode ${b.mode} in ${b.id}`);
      assert.ok(b.hook && b.captionHtml && b.action, `Incomplete beat fields in ${b.id}`);
    });
  });
  assert.equal(totalBeats, 34, `Expected 34 total beats, got ${totalBeats}`);

  const makeBox = () => ({ innerHTML: '', querySelector: () => makeBox(), querySelectorAll: () => [] });

  // Verify Sir Pip 2D SVG across all 6 moods (distinct & valid)
  const moodSvgs = new Set();
  for (const mood of illus.BUTLER_MOODS) {
    const b = makeBox();
    illus.renderButler2DSvg(b, { mood });
    assert.ok(b.innerHTML.includes('<svg') && !b.innerHTML.includes('undefined'), `Butler mood ${mood} invalid SVG`);
    moodSvgs.add(b.innerHTML);
  }
  assert.equal(moodSvgs.size, 6, 'All 6 Butler moods must render distinct SVGs');

  // Verify 2D Card Wars Fallback World renderer
  const fbBox = makeBox();
  worldMod.render2DFallbackWorld(fbBox, { mood: 'aha', suit: 'alo', roman: 'VI', faceDown: false });
  assert.ok(fbBox.innerHTML.includes('world-2d-stage') && fbBox.innerHTML.includes('VI'), '2D Fallback World failed');
  assert.equal(typeof worldMod.CardWarsWorld, 'function', 'CardWarsWorld class must be exported');

  // Verify all 16 core SVGs & Charts
  const tasks = generateWorkload(10, 'skewed', 42);
  const vms = generateVmSpeeds(3);
  const resB = runPatternBSimulation({ tasks, vmSpeeds: vms });

  const checks = [
    ['Card-Back-Emblem', (b) => illus.renderCardBackEmblem(b, { suit: 'alo', roman: 'VI' }), ['<svg', 'VI']],
    ['Cover-Story-Theater', (b) => illus.renderCoverStoryStage(b, { focus: 'all', phaseT: 0.7 }), ['SUIT KOTAK', 'SUIT LINGKARAN', 'SUIT CORONG']],
    ['Beginner-Intuition-Random', (b) => illus.renderIntuitionTerrain(b, { stage: 'random', phaseT: 1 }), ['<clipPath', '<linearGradient', 'Optimum Global']],
    ['Beginner-Intuition-Explore', (b) => illus.renderIntuitionTerrain(b, { stage: 'explore', phaseT: 0.6 }), ['LOMPATAN EKSPLORASI', 'marker-end']],
    ['Beginner-Intuition-Exploit', (b) => illus.renderIntuitionTerrain(b, { stage: 'exploit', phaseT: 0.8 }), ['CORONG EKSPLOITASI']],
    ['Asset1-Grasshopper', (b) => illus.renderGrasshopperSpecimen(b), ['<mask', '<clipPath', '<linearGradient', '<pattern', 'hind-leg']],
    ['Asset2-AntlionPit', (b) => illus.renderAntlionPitCutaway(b, { progress: 0.5, w: 3, I: 500 }), ['<mask', '<clipPath', '<linearGradient', '<pattern', 'marker-end']],
    ['Asset3-SocialField', (b) => illus.renderSocialForceField(b, { f: 0.5, l: 1.5, animPhase: 0.4 }), ['<mask', '<radialGradient', '<pattern', 'marker-end']],
    ['Asset4-MctPipeline-Step', (b) => illus.renderMctSeedingPipeline(b, { tasks, vmSpeeds: vms, mctResult: resB.mctResult, mctGoa: resB.mctGoa, visibleSteps: 4 }), ['<linearGradient', '<pattern', '4/10']],
    ['Asset5-Taxonomy', (b) => illus.renderHybridTaxonomy(b, { activePhase: 'explore' }), ['<clipPath', '<linearGradient', '<pattern', 'MODEL ESTAFET']],
    ['CardVI-Flowchart', (b) => illus.renderHybridFlowchart(b, { selectedId: 'modc' }), ['flow-node', 'TAHAP 04']],
    ['Chart-SocialCurve', (b) => charts.renderSocialCurveChart(b, { f: 0.5, l: 1.5 }), ['<svg', 'polyline']],
    ['Chart-CDecay', (b) => charts.renderCDecayChart(b, { L: 200, cMax: 1, cMin: 0.00001 }), ['<svg', 'Pivot L/2']],
    ['Chart-MctConv', (b) => charts.renderMctConvergenceChart(b, { mctHistory: resB.mctGoa.history, pureHistory: resB.pureGoa.history }), ['<svg', 'MCT+GOA']],
    ['Chart-LabConv', (b) => charts.renderLabConvergenceChart(b, { series: [{ label: 'Hybrid', color: '#B91C1C', values: [100, 10, 0.01] }], maxIter: 150 }), ['<svg', 'Hybrid']],
    ['Chart-Benchmark', (b) => charts.renderBenchmarkChart(b, { groupKey: 'antenna' }), ['<svg', '-147.91']]
  ];

  for (const [name, fn, required] of checks) {
    const box = makeBox();
    fn(box);
    assert.ok(box.innerHTML.includes('<svg') && !box.innerHTML.includes('NaN') && !box.innerHTML.includes('undefined'), `${name} produced invalid SVG`);
    for (const token of required) assert.ok(box.innerHTML.includes(token), `${name} missing ${token}`);
  }

  // Card Wars v5 WCAG AA Contrast Verification
  const lum = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

  for (const [label, fg, bg, min] of [
    ['ink on card paper', '#1A1816', '#FFFDF7', 4.5],
    ['muted on card paper', '#4B4742', '#FFFDF7', 4.5],
    ['muted on inset panel', '#4B4742', '#F6EFE0', 4.5],
    ['mct emerald on paper/bubble', '#0F766E', '#FFFDF7', 4.5],
    ['goa cobalt on paper/bubble', '#1D4ED8', '#FFFDF7', 4.5],
    ['alo crimson on paper/bubble', '#B91C1C', '#FFFDF7', 4.5],
    ['gold-amber keyword on bubble', '#92400E', '#FFFDF7', 4.5],
    ['white on unified deck back', '#FFFDF7', '#8C2D19', 4.5],
    ['gold crest on unified deck back', '#FDE047', '#8C2D19', 4.5],
    ['white on deep deck back', '#FFFDF7', '#6F2010', 4.5],
    ['gold on deep deck back', '#FDE047', '#6F2010', 4.5],
    ['white on goa btn', '#FFFFFF', '#1D4ED8', 4.5],
    ['white on mct btn', '#FFFFFF', '#0F766E', 4.5],
    ['ink on gold btn', '#1A1816', '#FDE047', 4.5]
  ]) {
    const r = ratio(fg, bg);
    assert.ok(r >= min, `Contrast fail for ${label}: ${r.toFixed(2)}:1`);
  }
  console.log('[PASS] 6. Non-mirrored 2-phase flip, 1-color deck, 2 Intro beats + 34 Shorts beats, floating Butler dialogue, 16 SVGs, and 14 WCAG AA pairs verified');
}
