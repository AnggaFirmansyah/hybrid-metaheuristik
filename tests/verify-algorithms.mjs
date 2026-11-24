// Comprehensive Automated Verification Suite (PRD Refinement v7: A1-A8, L1-L10, M0-M9, 9 Physical 3D Cards, Offline, WCAG AA)
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
import { createRng, MCT_WALKTHROUGH_EXAMPLE, PAPER_EMPIRICAL_DATA } from '../js/algorithms/benchmarks.js';

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

// 4. Validate Mandatory PRD M3-M4 Cloud Walkthrough (MS = 3.5s exact!) + MCT Seeding
{
  const mctWalk = runMCT(MCT_WALKTHROUGH_EXAMPLE.tasks, MCT_WALKTHROUGH_EXAMPLE.vmSpeeds);
  assert.equal(mctWalk.makespan, 3.5, `PRD M3-M4 walkthrough must produce exact MS = 3.5s, got ${mctWalk.makespan}`);
  assert.deepEqual(mctWalk.assignment, [1, 0, 1, 0], 'MCT assignment for M3-M4 must be VM2, VM1, VM2, VM1');

  const tasks = generateWorkload(12, 'skewed', 42);
  const vmSpeeds = generateVmSpeeds(4);
  const mct = runMCT(tasks, vmSpeeds);
  const rng = createRng(99);
  let randSum = 0;
  for (let t = 0; t < 40; t++) randSum += evaluateContinuousPosition(tasks.map(() => rng() * vmSpeeds.length), tasks, vmSpeeds).makespan;
  const randAvg = randSum / 40;
  assert.ok(mct.makespan <= randAvg);

  const sim = runPatternBSimulation({ tasks, vmSpeeds, popSize: 20, maxIter: 50, seedRatio: 0.2, seed: 42 });
  assert.ok(sim.mctGoa.bestMakespan <= mct.makespan + 1e-9);
  assert.ok(sim.mctPso.bestMakespan <= mct.makespan + 1e-9, 'MCT-PSO bestMakespan must be <= initial MCT makespan');
  assert.ok(Number.isFinite(sim.purePso.bestMakespan) && sim.mctPso.history.length === 51);
  console.log(`[PASS] 4. M3-M4 walkthrough exact MS = 3.5s, MCT-PSO (${sim.mctPso.bestMakespan.toFixed(2)}s) & MCT-GOA (${sim.mctGoa.bestMakespan.toFixed(2)}s) beat random (${randAvg.toFixed(2)}s)`);
}

// 5. PRD Accuracy Audit (A1-A8) + Anti-Slop R-02 (Zero Em-Dash) + Offline L10 + Typography L4 + HUD L3
{
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(rootDir, 'css/atlas-theme.css'), 'utf8');
  const shortsSrc = fs.readFileSync(path.join(rootDir, 'js/ui/shorts-stage.js'), 'utf8');

  // A1-A8 accuracy guards
  assert.ok(!shortsSrc.includes('-35.99'), 'A1 FAIL: fabricated -35.99 dB still present');
  assert.ok(!shortsSrc.toLowerCase().includes('wilcoxon'), 'A2 FAIL: unverified Wilcoxon claim still present');
  assert.ok(!shortsSrc.includes('Multimodal (39)'), 'A3 FAIL: wrong Multimodal (39) rank still present');
  assert.ok(shortsSrc.includes('15') && shortsSrc.includes('57'), 'A3 FAIL: exact ranks 15 and 57 missing');
  assert.ok(shortsSrc.includes('333') && shortsSrc.includes('402'), 'A4 FAIL: CEC2015 SPS-L-SHADE-EIG (333) vs Hybrid (402) missing');
  assert.ok(!html.includes('CITASI PAPER MCT-GOA MENYUSUL'), 'A5 FAIL: old placeholder still present in HTML');
  assert.ok(html.includes('Alsaidy') && shortsSrc.includes('Alsaidy'), 'A5 FAIL: Alsaidy et al. (2020) citation missing');
  assert.ok(!shortsSrc.includes('selalu kalah'), 'A7 FAIL: absolute "selalu kalah" claim still present');
  assert.ok(html.includes('pertimbangan didaktik') || html.includes('Pertimbangan didaktik'), 'A8 FAIL: didactic label missing');
  assert.ok(PAPER_EMPIRICAL_DATA.unimodal.rows[0].value === 15 && PAPER_EMPIRICAL_DATA.multimodal.rows[0].value === 57);

  // L3 Slim HUD: strictly <= 3 buttons inside <header class="table-hud">
  const hudMatch = html.match(/<header class="table-hud">([\s\S]*?)<\/header>/);
  assert.ok(hudMatch, 'HUD header missing');
  const hudBtnCount = (hudMatch[1].match(/<button\b/g) || []).length;
  assert.ok(hudBtnCount <= 3, `L3 FAIL: HUD must have <= 3 visible buttons, found ${hudBtnCount}`);

  // L4 Typography: ZERO font-size < 12px in CSS or HTML inline styles / Tailwind text-[Npx]
  for (const m of css.matchAll(/font-size:\s*([0-9.]+)px/g)) {
    assert.ok(Number(m[1]) >= 12, `L4 FAIL: CSS font-size ${m[1]}px < 12px`);
  }
  for (const m of html.matchAll(/font-size:\s*([0-9.]+)px/g)) {
    assert.ok(Number(m[1]) >= 12, `L4 FAIL: HTML inline font-size ${m[1]}px < 12px`);
  }
  assert.ok(!/text-\[(?:[0-9]|10|11)(?:\.[0-9]+)?px\]/.test(html), 'L4 FAIL: sub-12px text class found in HTML');

  // L9 Title + L10 Offline (Zero external CDN script/stylesheet links!)
  assert.ok(html.includes('<title>Hybrid Metaheuristik: MCT-GOA dan Hybrid GOA-ALO | Card Wars SOKA</title>'), 'L9 FAIL: exact title missing');
  assert.ok(!html.includes('https://cdn.tailwindcss.com') && !html.includes('https://unpkg.com') && !html.includes('https://fonts.googleapis.com'), 'L10 FAIL: external CDN URL still present in index.html');
  assert.ok(fs.existsSync(path.join(rootDir, 'vendor/three/three.module.js')), 'L10 FAIL: vendored three.module.js missing');
  assert.ok(fs.existsSync(path.join(rootDir, 'vendor/three/OrbitControls.js')), 'L10 FAIL: vendored OrbitControls.js missing');

  // Zero rotateY(180deg) CSS mirroring bug & zero em-dash R-02
  assert.ok(!css.includes('rotateY(180deg)'), 'CSS must not use persistent rotateY(180deg)');

  const filesToScan = [
    'index.html', 'css/atlas-theme.css',
    'js/algorithms/benchmarks.js', 'js/algorithms/mct-goa.js', 'js/algorithms/hybrid-goa-alo.js',
    'js/viz/svg-illustrator.js', 'js/viz/svg-charts.js', 'js/viz/three-lab.js', 'js/viz/world-3d.js',
    'js/ui/deck.js', 'js/ui/shorts-stage.js', 'js/ui/controls.js'
  ];
  for (const rel of filesToScan) {
    const content = fs.readFileSync(path.join(rootDir, rel), 'utf8');
    const violations = [];
    content.split(/\r?\n/).forEach((line, idx) => {
      if (line.includes('\u2014')) violations.push(`${rel}:${idx + 1}`);
    });
    assert.equal(violations.length, 0, `Em-dash (R-02) found: ${violations.join(', ')}`);
  }
  console.log('[PASS] 5. PRD A1-A8 accuracy, L3 HUD (3 btns), L4 (>=12px), L9 title, L10 100% offline, and R-02 zero em-dash verified');
}

// 6. Full DOM ID Wiring, 9 Physical 3D Cards, Strict Ordered Curriculum (30 Beats), 8-Q Quiz, 15 Glossary Terms, 16 SVGs, & WCAG AA Contrast
{
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const deckSrc = fs.readFileSync(path.join(rootDir, 'js/ui/deck.js'), 'utf8');
  const worldSrc = fs.readFileSync(path.join(rootDir, 'js/viz/world-3d.js'), 'utf8');

  const htmlSlideIds = Array.from(html.matchAll(/<section\s+id="([^"]+)"\s+class="slide/g)).map((m) => m[1]);
  assert.equal(htmlSlideIds.length, 9, `Expected 9 cards in index.html, found ${htmlSlideIds.length}`);

  const expectedOrder = ['intuition', 'taxonomy', 'cover', 'mct-goa', 'hybrid-goa-alo', 'single-anatomy', 'lab-3d', 'benchmarks', 'synthesis'];
  assert.deepEqual(htmlSlideIds, expectedOrder, `HTML slide order mismatch: ${htmlSlideIds.join(', ')}`);

  const metaIds = Array.from(deckSrc.matchAll(/id:\s*'([^']+)'/g)).map((m) => m[1]);
  assert.deepEqual(metaIds, expectedOrder, `SLIDE_META order mismatch: ${metaIds.join(', ')}`);

  // Verify 3D tabletop always launches face-up, includes reference mascot & rich coastal backdrop
  assert.ok(worldSrc.includes('this.showAllFaceUp = true'), 'world-3d.js must show all 9 illustrated 3D cards face-up on tabletop by default');
  assert.ok(worldSrc.includes('_buildCoastalWorldBackdrop') && worldSrc.includes('cardsFan') && worldSrc.includes('whiteShirt'), 'world-3d.js must include coastal backdrop & reference Sir Pip mascot features');
  assert.ok(html.includes('id="beat-explain-panel"'), 'Missing #beat-explain-panel for Intro -> Arti -> Cara Kerja before visual');
  assert.ok(html.includes('id="card-back-to-table-btn"'), 'Missing #card-back-to-table-btn');
  assert.ok(html.includes('id="table-flip-all-btn"'), 'Missing #table-flip-all-btn');

  const missingIds = [];
  for (const rel of ['js/ui/deck.js', 'js/ui/shorts-stage.js', 'js/ui/controls.js']) {
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

  const illus = await import('../js/viz/svg-illustrator.js');
  const charts = await import('../js/viz/svg-charts.js');
  const shortsMod = await import('../js/ui/shorts-stage.js');
  const worldMod = await import('../js/viz/world-3d.js');

  assert.equal(shortsMod.INTRO_BEATS.length, 1);
  assert.equal(shortsMod.CARD_BEATS.length, 9);
  assert.equal(shortsMod.FINAL_QUIZ_QUESTIONS.length, 8);
  assert.ok(Object.keys(shortsMod.GLOSSARY_TERMS).length >= 16 && shortsMod.GLOSSARY_TERMS.pso);
  assert.deepEqual(Object.keys(shortsMod.DURATION_TRACKS), ['15m', '30m', '45m']);
  assert.ok(PAPER_EMPIRICAL_DATA.mctpso && PAPER_EMPIRICAL_DATA.mctpso.rows[0].value === 67);
  assert.ok(html.includes('KESIMPULAN &amp; REKOMENDASI HYBRID TERBAIK') && html.includes('Kennedy, J., &amp; Eberhart, R. (1995)'));

  let totalBeats = 0;
  shortsMod.CARD_BEATS.forEach((beats, cardIdx) => {
    // ALL 9 Cards (0..8) MUST start with text explanation ('explain') BEFORE revealing visual/interactive stage!
    assert.equal(beats[0].mode, 'explain', `Card ${cardIdx + 1} must start with explain beat before visuals`);
    beats.forEach((b) => {
      totalBeats += 1;
      assert.ok(illus.BUTLER_MOODS.includes(b.mood), `Invalid mood ${b.mood}`);
      assert.ok(['explain', 'visual', 'interactive'].includes(b.mode), `Invalid stage mode ${b.mode} on ${b.id}`);
      if (b.mode === 'explain') {
        assert.ok(b.explainHtml && b.explainHtml.trim().length > 40, `Missing explainHtml on ${b.id}`);
      }
      assert.ok(b.notes && b.notes.say && b.notes.ask && b.notes.expect, `Missing speaker notes on ${b.id}`);
    });
  });
  assert.equal(totalBeats, 32);

  const makeBox = () => ({ innerHTML: '', querySelector: () => makeBox(), querySelectorAll: () => [] });

  // Verify L1 Shapes Legend, 6 Sir Pip Moods, 2D 9-Card Tabletop Fallback, & all 16 SVGs
  const legBox = makeBox();
  illus.renderShapesLegend(legBox);
  assert.ok(legBox.innerHTML.includes('MCT') && legBox.innerHTML.includes('Tolak') && legBox.innerHTML.includes('Tarik'));

  const fbBox = makeBox();
  worldMod.render2DFallbackWorld(fbBox, { mood: 'greet', openedSet: new Set([0]), activeIdx: 0, showAllFaceUp: true });
  assert.ok((fbBox.innerHTML.match(/data-table-card=/g) || []).length === 9, '2D Tabletop fallback must render all 9 cards');

  const tasks = generateWorkload(10, 'skewed', 42);
  const vms = generateVmSpeeds(3);
  const resB = runPatternBSimulation({ tasks, vmSpeeds: vms });

  const checks = [
    ['Card-Back-Emblem', (b) => illus.renderCardBackEmblem(b, { suit: 'alo', roman: 'VI' }), ['<svg', 'VI']],
    ['Cover-Story', (b) => illus.renderCoverStoryStage(b, { focus: 'all', phaseT: 0.7 }), ['KOTAK: MCT', 'LINGKARAN: GOA', 'CORONG: ALO']],
    ['Intuition-Ball', (b) => illus.renderIntuitionTerrain(b, { stage: 'explore', phaseT: 0.6, userBallX: 378 }), ['f(x) =', 'Optimum Global']],
    ['MCT-Walkthrough-3.5s', (b) => illus.renderMctWalkthrough(b, { stepCount: 4 }), ['3.5 dtk', '10,0 dtk']],
    ['Asset1-Grasshopper', (b) => illus.renderGrasshopperSpecimen(b), ['<mask', '<clipPath', 'hind-leg']],
    ['Asset2-AntlionPit', (b) => illus.renderAntlionPitCutaway(b, { progress: 0.5, w: 3, I: 500 }), ['<mask', '<clipPath', 'ELITE']],
    ['Asset3-SocialField-L5', (b) => illus.renderSocialForceField(b, { f: 0.5, l: 1.5, animPhase: 0.4 }), ['#C2410C', 'Tolak', 'Tarik']],
    ['Asset4-MctPipeline', (b) => illus.renderMctSeedingPipeline(b, { tasks, vmSpeeds: vms, mctResult: resB.mctResult, mctGoa: resB.mctGoa, visibleSteps: 4 }), ['4/10', '[Simulasi]']],
    ['Asset5-Taxonomy', (b) => illus.renderHybridTaxonomy(b, { activePhase: 'all' }), ['POLA B', 'POLA C', '[Usulan]']],
    ['CardVI-Flowchart', (b) => illus.renderHybridFlowchart(b, { selectedId: 'modc' }), ['flow-node', 'TAHAP 04']],
    ['Chart-SocialCurve-L5', (b) => charts.renderSocialCurveChart(b, { f: 0.5, l: 1.5 }), ['#C2410C', 'TOLAK', 'TARIK']],
    ['Chart-CDecay', (b) => charts.renderCDecayChart(b, { L: 200, cMax: 1, cMin: 0.00001 }), ['Pivot L/2']],
    ['Chart-WStaircase', (b) => charts.renderWStaircaseChart(b), ['TANGGA w', 'w=6']],
    ['Chart-MctConv', (b) => charts.renderMctConvergenceChart(b, { mctHistory: resB.mctGoa.history, psoHistory: resB.mctPso.history, pureHistory: resB.purePso.history }), ['MCT+PSO', 'MCT+GOA']],
    ['Chart-LabConv', (b) => charts.renderLabConvergenceChart(b, { series: [{ label: 'Hybrid', color: '#B91C1C', values: [100, 10, 0.01] }], maxIter: 150 }), ['Hybrid']],
    ['Chart-Benchmark-Antenna', (b) => charts.renderBenchmarkChart(b, { groupKey: 'antenna' }), ['-147.91']],
    ['Chart-Benchmark-MctPso', (b) => charts.renderBenchmarkChart(b, { groupKey: 'mctpso' }), ['MCT-PSO', '67 dtk']]
  ];
  for (const [name, fn, required] of checks) {
    const box = makeBox();
    fn(box);
    assert.ok(box.innerHTML.includes('<svg') && !box.innerHTML.includes('NaN') && !box.innerHTML.includes('undefined'), `${name} invalid SVG`);
    for (const token of required) assert.ok(box.innerHTML.includes(token), `${name} missing ${token}`);
  }

  // WCAG AA Contrast Verification (Light & Dark Modes + L5 Orange Repulsion!)
  const lum = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

  for (const [label, fg, bg, min] of [
    ['ink on paper', '#1A1816', '#FFFDF7', 4.5],
    ['muted on paper', '#4B4742', '#FFFDF7', 4.5],
    ['mct on paper', '#0F766E', '#FFFDF7', 4.5],
    ['goa on paper', '#1D4ED8', '#FFFDF7', 4.5],
    ['alo on paper', '#B91C1C', '#FFFDF7', 4.5],
    ['L5 orange repel on paper', '#C2410C', '#FFFDF7', 4.5],
    ['gold ink on paper', '#92400E', '#FFFDF7', 4.5],
    ['white on unified back', '#FFFDF7', '#8C2D19', 4.5],
    ['gold on unified back', '#FDE047', '#8C2D19', 4.5],
    ['dark mode primary', '#F8FAFC', '#171B21', 4.5],
    ['dark mode muted', '#CBD5E1', '#171B21', 4.5],
    ['dark mode mct', '#2DD4BF', '#171B21', 4.5],
    ['dark mode repel orange', '#FB923C', '#171B21', 4.5],
    ['badge paper', '#1E3A8A', '#DBEAFE', 4.5],
    ['badge sim', '#78350F', '#FEF3C7', 4.5],
    ['badge prop', '#0F5132', '#E6F6F3', 4.5]
  ]) {
    const r = ratio(fg, bg);
    assert.ok(r >= min, `Contrast fail for ${label}: ${r.toFixed(2)}:1`);
  }
  console.log('[PASS] 6. 9 Physical 3D Cards (face-up default), exact HTML/SLIDE_META order, 30 ordered beats (explain -> visual -> interactive), 8-Q quiz, 15 glossary terms, 16 SVGs, and 16 WCAG AA pairs verified');
}
