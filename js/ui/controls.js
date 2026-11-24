// Master Interactive Controller (PRD Refinement v8)
// Connects: 9 Large Illustrated Physical 3D Cards on Tabletop, Strict Ordered Curriculum
// (Intro -> Arti Algoritma -> Cara Kerja & Implementasi -> Visualisasi), Butler Sir Pip,
// Permanent Shapes Legend (L1), Mode Fokus (L2), Mode Presentasi (P), Speaker Notes (S),
// 3 Duration Tracks, Interactive Glossary (F2), M0 Click-to-Drop-Ball, M3-M4 3.5s Walkthrough,
// Lab Two-Tier Controls (L8), and 8-Question Final Quiz (M9).

import {
  BENCHMARK_FUNCTIONS,
  PAPER_EMPIRICAL_DATA,
  MCT_WALKTHROUGH_EXAMPLE
} from '../algorithms/benchmarks.js?v=10';
import { generateWorkload, generateVmSpeeds, runPatternBSimulation } from '../algorithms/mct-goa.js?v=10';
import {
  MetaheuristicRunner,
  comfortZoneRadius,
  computeStandardC,
  computeHybridC,
  computeW,
  computeI
} from '../algorithms/hybrid-goa-alo.js?v=10';
import {
  renderShapesLegend,
  renderButler2DSvg,
  renderCoverStoryStage,
  renderIntuitionTerrain,
  intuitionTerrainY,
  renderMctWalkthrough,
  renderGrasshopperSpecimen,
  renderAntlionPitCutaway,
  renderSocialForceField,
  renderMctSeedingPipeline,
  renderHybridTaxonomy,
  renderHybridFlowchart,
  FLOWCHART_NODES
} from '../viz/svg-illustrator.js?v=10';
import {
  renderSocialCurveChart,
  renderCDecayChart,
  renderWStaircaseChart,
  renderMctConvergenceChart,
  renderLabConvergenceChart,
  renderBenchmarkChart
} from '../viz/svg-charts.js?v=10';
import { ThreeLabController } from '../viz/three-lab.js?v=10';
import { CardWarsWorld } from '../viz/world-3d.js?v=10';
import {
  ShortsStageController,
  INTRO_BEATS,
  GLOSSARY_TERMS,
  FINAL_QUIZ_QUESTIONS
} from './shorts-stage.js?v=10';
import { DeckController, SLIDE_META, positionSlidingIndicator } from './deck.js?v=10';

function bindRangePair(baseId, { min, max, onChange }) {
  const rangeEl = document.getElementById(`${baseId}-range`);
  const numEl = document.getElementById(`${baseId}-num`);
  if (!rangeEl || !numEl) return { get: () => min, set: () => {} };

  const clamp = (raw) => {
    const v = Number(raw);
    if (!Number.isFinite(v)) return Number(rangeEl.value);
    return Math.min(max, Math.max(min, v));
  };

  rangeEl.addEventListener('input', () => {
    const v = clamp(rangeEl.value);
    numEl.value = String(v);
    onChange && onChange(v);
  });

  numEl.addEventListener('change', () => {
    const v = clamp(numEl.value);
    numEl.value = String(v);
    rangeEl.value = String(Math.min(Number(rangeEl.max), Math.max(Number(rangeEl.min), v)));
    onChange && onChange(v);
  });

  return {
    get: () => clamp(numEl.value),
    set: (v) => {
      const clamped = clamp(v);
      numEl.value = String(clamped);
      rangeEl.value = String(Math.min(Number(rangeEl.max), Math.max(Number(rangeEl.min), clamped)));
    }
  };
}

function bindSegmentedTabs(containerId, onSelect) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return () => {};
  const indicator = wrap.querySelector('.seg-indicator');
  const tabs = Array.from(wrap.querySelectorAll('.seg-tab'));

  const activate = (val, silent = false) => {
    const activeBtn = tabs.find((b) => b.dataset.value === val) || tabs[0];
    tabs.forEach((b) => {
      const isSel = b === activeBtn;
      b.setAttribute('aria-selected', String(isSel));
      b.classList.toggle('is-selected', isSel);
    });
    requestAnimationFrame(() => positionSlidingIndicator(wrap, activeBtn, indicator));
    if (!silent && onSelect) onSelect(activeBtn.dataset.value);
  };

  tabs.forEach((btn) => btn.addEventListener('click', () => activate(btn.dataset.value)));
  window.addEventListener('resize', () => {
    const activeBtn = tabs.find((b) => b.classList.contains('is-selected')) || tabs[0];
    positionSlidingIndicator(wrap, activeBtn, indicator);
  });

  activate(tabs[0]?.dataset.value, true);
  return activate;
}

function formatNum(val) {
  if (!Number.isFinite(val)) return 'N/A';
  if (val === 0) return '0';
  const abs = Math.abs(val);
  if (abs < 0.0001 || abs >= 10000) return val.toExponential(3);
  return val.toFixed(abs < 1 ? 5 : 2);
}

const INTUITION_COPY = {
  random: {
    heading: 'Tahap 1: Tebakan Acak Sering Terjebak Lokal',
    body: 'Jika titik uji dijatuhkan acak tanpa koordinasi, bola sering berhenti di lubang dangkal pertama (Optimum Lokal) tanpa menyadari ada lembah jauh lebih dalam di kanan.'
  },
  explore: {
    heading: 'Tahap 2: Eksplorasi (Menyebar Luas)',
    body: 'Seperti mencari restoran di kota baru dengan berkeliling dulu, agen lingkaran biru menyebar melampaui bukit hingga area lembah terdalam (Optimum Global) terdeteksi.'
  },
  exploit: {
    heading: 'Tahap 3: Eksploitasi (Mengerucut Presisi)',
    body: 'Begitu lembah terdalam terlihat, corong merah mempersempit ruang pencarian agar seluruh titik fokus menukik halus ke dasar terbaik.'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- L1: PERMANENT SHAPES LEGEND STRIP ---
  renderShapesLegend(document.getElementById('permanent-shapes-legend'));

  // --- F2: INTERACTIVE GLOSSARY TOOLTIPS & FULL LIST ---
  const glossToast = document.getElementById('glossary-toast');
  const glossTitle = document.getElementById('gloss-title');
  const glossBody = document.getElementById('gloss-body');

  function showGlossaryTerm(key) {
    const entry = GLOSSARY_TERMS[key];
    if (!entry || !glossToast) return;
    if (glossTitle) glossTitle.textContent = `Glosarium: ${entry.term}`;
    if (glossBody) glossBody.textContent = entry.def;
    glossToast.classList.add('is-open');
  }

  function showAllGlossary() {
    if (!glossToast) return;
    if (glossTitle) glossTitle.textContent = 'Glosarium Istilah Utama';
    if (glossBody) {
      glossBody.innerHTML = `<div style="max-height:240px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">${
        Object.values(GLOSSARY_TERMS).map((g) => `<div><strong style="color:#FDE047">${g.term}:</strong> ${g.def}</div>`).join('')
      }</div>`;
    }
    glossToast.classList.add('is-open');
  }

  document.querySelectorAll('.gloss-term').forEach((btn) => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); showGlossaryTerm(btn.dataset.term); });
  });
  document.getElementById('gloss-close-btn')?.addEventListener('click', () => glossToast?.classList.remove('is-open'));
  document.getElementById('hud-glossary-btn')?.addEventListener('click', () => showAllGlossary());

  // --- FULL-VIEWPORT 3D TABLETOP WITH 9 PHYSICAL CLICKABLE 3D CARDS ---
  let deck = null;
  let shorts = null;
  const hudRenderToggle = document.getElementById('hud-render-toggle');
  const hoverHint = document.getElementById('table-hover-hint');

  const world = new CardWarsWorld({
    webglContainer: document.getElementById('world-webgl-mount'),
    fallbackContainer: document.getElementById('world-2d-fallback'),
    cards: SLIDE_META,
    onModeChange(mode) {
      if (hudRenderToggle) hudRenderToggle.textContent = mode === 'webgl' ? 'Render: 3D' : 'Render: 2D';
    },
    onCardHover(idx) {
      if (!hoverHint) return;
      if (idx === null || idx < 0 || idx >= SLIDE_META.length) {
        hoverHint.classList.remove('is-visible');
      } else {
        const m = SLIDE_META[idx];
        hoverHint.textContent = `Kartu ${m.roman} (${m.suitLabel}): ${m.shortTitle} - Klik untuk mengangkat & membuka`;
        hoverHint.classList.add('is-visible');
      }
    },
    onCardPick(idx) {
      if (!deck) return;
      if (deck.isIntro) deck.setIntro(false, { silent: true });
      if (deck.peekMode) deck.togglePeek(false);
      // Clicking a physical 3D card on the tabletop lifts & opens it directly!
      deck.goTo(idx);
    }
  });
  world.init(false).then(() => syncWorldGpuState());

  hudRenderToggle?.addEventListener('click', () => {
    world.set2DMode(world.mode === 'webgl');
  });

  // --- LIVE LOOPING BEAT ANIMATION REGISTRY ---
  let beatLoopRaf = null;
  let beatLoopTimer = null;

  function stopBeatLoop() {
    if (beatLoopRaf) { cancelAnimationFrame(beatLoopRaf); beatLoopRaf = null; }
    if (beatLoopTimer) { clearInterval(beatLoopTimer); beatLoopTimer = null; }
  }

  function startRafLoop(renderFn, periodMs = 2800) {
    stopBeatLoop();
    if (prefersReducedMotion) { renderFn(0.75); return; }
    const start = performance.now();
    const tick = (now) => {
      const cyc = ((now - start) % periodMs) / periodMs;
      const smooth = 0.5 - 0.5 * Math.cos(cyc * Math.PI * 2);
      renderFn(0.12 + smooth * 0.84);
      beatLoopRaf = requestAnimationFrame(tick);
    };
    beatLoopRaf = requestAnimationFrame(tick);
  }

  // --- CARD I: COVER 3-SUIT SHAPE THEATER ---
  let coverFocus = 'all';
  function setCoverFocus(focus = 'all', loop = true) {
    coverFocus = focus;
    document.querySelectorAll('.cover-chapter-btn').forEach((btn) => {
      const active = btn.dataset.focus === focus;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    const el = document.getElementById('cover-story-svg');
    if (loop) startRafLoop((phaseT) => renderCoverStoryStage(el, { focus, phaseT }), 3200);
    else renderCoverStoryStage(el, { focus, phaseT: 0.72 });
  }
  document.querySelectorAll('.cover-chapter-btn').forEach((btn) => {
    btn.addEventListener('click', () => setCoverFocus(btn.dataset.focus, true));
  });
  document.getElementById('cover-replay-btn')?.addEventListener('click', () => setCoverFocus(coverFocus, true));

  // --- CARD II: M0 CLICK-TO-DROP-BALL + M2 INTUITION ---
  let intuitionStage = 'random';
  let intuitionUserBallX = null;
  let intuitionSeqTimer = null;

  function stopIntuitionSeq() {
    if (intuitionSeqTimer) { clearTimeout(intuitionSeqTimer); intuitionSeqTimer = null; }
  }

  function handleDropBall(svgX) {
    intuitionUserBallX = svgX;
    const fitVal = ((245 - intuitionTerrainY(svgX)) / 10).toFixed(2);
    const zone = Math.abs(svgX - 378) < 42
      ? 'Dekat Optimum Global!'
      : Math.abs(svgX - 150) < 42
        ? 'Terjebak di Optimum Lokal!'
        : 'Di lereng bukit.';
    const readout = document.getElementById('intuition-ball-readout');
    if (readout) readout.textContent = `Bola uji f(x) = ${fitVal} (${zone}) [Ilustrasi]`;
    renderIntuitionTerrain(document.getElementById('intuition-terrain-svg'), {
      stage: intuitionStage, phaseT: 0.85, userBallX: intuitionUserBallX, onDropBall: handleDropBall
    });
  }

  function setIntuitionStage(stage, loop = true) {
    stopIntuitionSeq();
    intuitionStage = stage;
    document.querySelectorAll('.stage-step-btn').forEach((btn) => {
      const active = btn.dataset.stage === stage;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    const copy = INTUITION_COPY[stage] || INTUITION_COPY.random;
    document.getElementById('intuition-explain-title').textContent = copy.heading;
    document.getElementById('intuition-explain-body').textContent = copy.body;

    const targetEl = document.getElementById('intuition-terrain-svg');
    if (loop) {
      startRafLoop((phaseT) => renderIntuitionTerrain(targetEl, { stage, phaseT, userBallX: intuitionUserBallX, onDropBall: handleDropBall }), 2800);
    } else {
      renderIntuitionTerrain(targetEl, { stage, phaseT: 1, userBallX: intuitionUserBallX, onDropBall: handleDropBall });
    }
  }

  document.querySelectorAll('.stage-step-btn').forEach((btn) => {
    btn.addEventListener('click', () => setIntuitionStage(btn.dataset.stage, true));
  });
  document.getElementById('intuition-replay-btn')?.addEventListener('click', () => {
    setIntuitionStage('random', true);
    intuitionSeqTimer = setTimeout(() => {
      setIntuitionStage('explore', true);
      intuitionSeqTimer = setTimeout(() => setIntuitionStage('exploit', true), 2000);
    }, 2000);
  });
  renderIntuitionTerrain(document.getElementById('intuition-terrain-svg'), { stage: 'random', phaseT: 0.8, onDropBall: handleDropBall });

  // --- CARD III: TAXONOMY ---
  const taxSvg = document.getElementById('tax-svg');
  renderHybridTaxonomy(taxSvg, { activePhase: 'all' });
  const syncTaxTabs = bindSegmentedTabs('tax-tabs', (phase) => renderHybridTaxonomy(taxSvg, { activePhase: phase }));

  // --- CARD IV: M3-M4 VERIFIED 3.5s WALKTHROUGH + POLA B SIMULATOR ---
  let mctWalkStep = 4;
  function updateMctWalkthrough(step) {
    mctWalkStep = Math.max(0, Math.min(4, step));
    renderMctWalkthrough(document.getElementById('mct-walkthrough-svg'), { stepCount: mctWalkStep });
    const cap = document.getElementById('mct-walk-caption');
    if (cap) {
      if (mctWalkStep === 0) {
        cap.innerHTML = 'Klik <strong>Langkah MCT +1</strong> untuk memasukkan T1..T4 satu per satu (bandingkan dengan jadwal buruk semua di VM1 = <strong>10,0 detik</strong>).';
      } else {
        const info = MCT_WALKTHROUGH_EXAMPLE.steps[mctWalkStep - 1];
        cap.innerHTML = `<strong>Langkah ${mctWalkStep}/4 (${info.task}):</strong> ${info.reason}`;
      }
    }
  }
  document.getElementById('mct-walk-step-btn')?.addEventListener('click', () => {
    updateMctWalkthrough(mctWalkStep >= 4 ? 1 : mctWalkStep + 1);
  });
  document.getElementById('mct-walk-reset-btn')?.addEventListener('click', () => updateMctWalkthrough(0));
  updateMctWalkthrough(4);

  const mctWeightsInput = document.getElementById('mct-weights');
  const mctPresetSelect = document.getElementById('mct-preset');
  const mctAlgoSelect = document.getElementById('mct-algo-select');
  const mctComparePure = document.getElementById('mct-compare-pure');
  let latestMctContext = null;
  let mctShownSteps = null;

  function stopMctStepAnim() {
    stopBeatLoop();
    const playBtn = document.getElementById('mct-anim-play');
    if (playBtn) playBtn.textContent = 'Putar Animasi';
  }

  const mctM = bindRangePair('mct-M', { min: 4, max: 16, onChange: () => { syncWorkloadInput(); runCardIV(); } });
  const mctK = bindRangePair('mct-K', { min: 2, max: 6, onChange: () => runCardIV() });
  const mctSeedRatio = bindRangePair('mct-seed-ratio', { min: 10, max: 100, onChange: () => runCardIV() });
  const mctN = bindRangePair('mct-N', { min: 10, max: 50, onChange: () => runCardIV() });
  const mctL = bindRangePair('mct-L', { min: 20, max: 200, onChange: () => runCardIV() });
  const mctCmax = bindRangePair('mct-cmax', { min: 0.5, max: 2.0, onChange: () => runCardIV() });
  const mctCmin = bindRangePair('mct-cmin', { min: 0.00001, max: 0.05, onChange: () => runCardIV() });

  function syncWorkloadInput() {
    mctWeightsInput.value = generateWorkload(mctM.get(), mctPresetSelect.value, 42).join(', ');
  }
  function parseWeights() {
    const raw = mctWeightsInput.value.split(',').map((s) => Number(s.trim())).filter((v) => Number.isFinite(v) && v > 0);
    return raw.length >= 2 ? raw.slice(0, 16) : generateWorkload(mctM.get(), mctPresetSelect.value, 42);
  }
  function redrawMctPipeline() {
    if (!latestMctContext) return;
    renderMctSeedingPipeline(document.getElementById('mct-pipeline-svg'), { ...latestMctContext, visibleSteps: mctShownSteps });
  }
  function startMctLoopAnim(loopForever = true) {
    if (!latestMctContext) return;
    stopBeatLoop();
    const total = latestMctContext.tasks.length;
    if (prefersReducedMotion) { mctShownSteps = total; redrawMctPipeline(); return; }
    mctShownSteps = 0;
    redrawMctPipeline();
    const playBtn = document.getElementById('mct-anim-play');
    if (playBtn) playBtn.textContent = 'Jeda Animasi';
    let pauseTicks = 0;
    beatLoopTimer = setInterval(() => {
      if (mctShownSteps < total) {
        mctShownSteps += 1;
        redrawMctPipeline();
      } else if (loopForever) {
        pauseTicks += 1;
        if (pauseTicks >= 4) { pauseTicks = 0; mctShownSteps = 0; redrawMctPipeline(); }
      } else {
        stopMctStepAnim();
      }
    }, 380);
  }

  function runCardIV() {
    stopMctStepAnim();
    const tasks = parseWeights();
    const vmSpeeds = generateVmSpeeds(mctK.get());
    const result = runPatternBSimulation({
      tasks, vmSpeeds,
      popSize: mctN.get(), maxIter: mctL.get(),
      cMax: mctCmax.get(), cMin: mctCmin.get(),
      seedRatio: mctSeedRatio.get() / 100, seed: 42
    });
    const activeAlgo = mctAlgoSelect?.value || 'pso';
    const shownResult = activeAlgo === 'pso' ? result.mctPso : result.mctGoa;
    const pureBaseline = activeAlgo === 'pso' ? result.purePso : result.pureGoa;
    latestMctContext = { tasks, vmSpeeds, mctResult: result.mctResult, mctGoa: shownResult };
    mctShownSteps = tasks.length;
    redrawMctPipeline();
    renderMctConvergenceChart(document.getElementById('mct-conv-svg'), {
      mctHistory: result.mctGoa.history,
      psoHistory: result.mctPso.history,
      pureHistory: pureBaseline.history,
      showPure: mctComparePure.checked
    });
    document.getElementById('mct-metric-init').textContent = `${result.mctResult.makespan.toFixed(2)} s`;
    document.getElementById('mct-metric-pso').textContent = `${result.mctPso.bestMakespan.toFixed(2)} s`;
    document.getElementById('mct-metric-best').textContent = `${result.mctGoa.bestMakespan.toFixed(2)} s`;
    document.getElementById('mct-metric-pure').textContent = `${pureBaseline.bestMakespan.toFixed(2)} s`;
  }

  document.getElementById('mct-anim-play')?.addEventListener('click', () => {
    if (beatLoopTimer) stopMctStepAnim();
    else startMctLoopAnim(false);
  });
  document.getElementById('mct-anim-step')?.addEventListener('click', () => {
    if (!latestMctContext) return;
    stopMctStepAnim();
    const total = latestMctContext.tasks.length;
    mctShownSteps = mctShownSteps >= total ? 1 : mctShownSteps + 1;
    redrawMctPipeline();
  });
  mctAlgoSelect?.addEventListener('change', () => runCardIV());
  mctPresetSelect?.addEventListener('change', () => { syncWorkloadInput(); runCardIV(); });
  mctWeightsInput?.addEventListener('change', () => runCardIV());
  mctComparePure?.addEventListener('change', () => runCardIV());
  document.getElementById('mct-run-btn')?.addEventListener('click', () => runCardIV());
  document.getElementById('mct-reset-btn')?.addEventListener('click', () => {
    mctM.set(10); mctK.set(3); mctSeedRatio.set(20); mctN.set(24); mctL.set(80); mctCmax.set(1.0); mctCmin.set(0.00001);
    if (mctAlgoSelect) mctAlgoSelect.value = 'pso';
    mctPresetSelect.value = 'skewed';
    mctComparePure.checked = true;
    syncWorkloadInput();
    runCardIV();
  });
  syncWorkloadInput();
  runCardIV();

  // --- CARD V: GOA & ALO SINGLE ANATOMY ---
  const anatGoaPanel = document.getElementById('anat-panel-goa');
  const anatAloPanel = document.getElementById('anat-panel-alo');
  function setAnatTabVisual(tab) {
    const isGoa = tab === 'goa';
    anatGoaPanel?.classList.toggle('hidden', !isGoa);
    anatAloPanel?.classList.toggle('hidden', isGoa);
  }
  const syncAnatTabs = bindSegmentedTabs('anat-tabs', (tab) => {
    stopBeatLoop();
    setAnatTabVisual(tab);
    if (tab === 'goa') startRafLoop((p) => updateCardVA(p), 2600);
    else startAloLoop(true);
  });

  const anatF = bindRangePair('anat-f', { min: 0.1, max: 1.5, onChange: () => { stopBeatLoop(); updateCardVA(0); } });
  const anatL = bindRangePair('anat-l', { min: 0.5, max: 3.0, onChange: () => { stopBeatLoop(); updateCardVA(0); } });

  function updateCardVA(animPhase = 0) {
    const f = anatF.get();
    const l = anatL.get();
    const r0 = comfortZoneRadius(f, l);
    const legAngle = Math.round((f - 0.5) * -18 + (l - 1.5) * 6 - animPhase * 12);
    renderGrasshopperSpecimen(document.getElementById('anat-grasshopper-svg'), { prefix: 'a5g', legAngle, showAnnotations: false });
    renderSocialForceField(document.getElementById('anat-social-field-svg'), { f, l, animPhase });
    renderSocialCurveChart(document.getElementById('anat-social-curve-svg'), { f, l });
    document.getElementById('anat-r0-readout').textContent = r0 ? `r0 = ${r0.toFixed(3)}` : 'Tidak ada akar';
  }
  updateCardVA(0);
  document.getElementById('anat-goa-play')?.addEventListener('click', () => startRafLoop((p) => updateCardVA(p), 2200));

  const anatProg = bindRangePair('anat-progress', { min: 0, max: 100, onChange: () => { stopBeatLoop(); updateCardVB(); } });
  function updateCardVB() {
    const pct = anatProg.get();
    const progress = pct / 100;
    const T = 100;
    const t = Math.max(0, Math.round(progress * T));
    const w = computeW(t, T);
    const I = computeI(t, T);
    renderAntlionPitCutaway(document.getElementById('anat-pit-svg'), { progress, w, I });
    document.getElementById('anat-w-readout').textContent = `w = ${w}`;
    document.getElementById('anat-i-readout').textContent = I >= 1000 ? I.toExponential(2) : I.toFixed(2);
    document.getElementById('anat-shrink-readout').textContent = `${(100 / Math.max(1, I)).toFixed(I > 100 ? 4 : 2)}%`;
  }
  updateCardVB();

  function startAloLoop(loopForever = true) {
    stopBeatLoop();
    if (prefersReducedMotion) { anatProg.set(60); updateCardVB(); return; }
    const btn = document.getElementById('anat-alo-play');
    if (btn) btn.textContent = 'Jeda Corong';
    beatLoopTimer = setInterval(() => {
      const cur = anatProg.get();
      const next = cur >= 96 ? (loopForever ? 8 : 96) : cur + 2;
      anatProg.set(next);
      updateCardVB();
      if (!loopForever && next >= 96) {
        stopBeatLoop();
        if (btn) btn.textContent = 'Putar Corong';
      }
    }, 75);
  }
  document.getElementById('anat-alo-play')?.addEventListener('click', () => {
    if (beatLoopTimer) { stopBeatLoop(); document.getElementById('anat-alo-play').textContent = 'Putar Corong'; }
    else startAloLoop(false);
  });

  // --- CARD VI: HYBRID FLOWCHART, MODIFIED c, & W STAIRCASE ---
  function updateFlowchart(nodeId) {
    renderHybridFlowchart(document.getElementById('flow-svg'), { selectedId: nodeId, onSelect: updateFlowchart });
    const info = FLOWCHART_NODES.find((n) => n.id === nodeId) || FLOWCHART_NODES[0];
    document.getElementById('flow-detail-step').textContent = `TAHAP ${info.step}`;
    document.getElementById('flow-detail-title').textContent = info.title;
    document.getElementById('flow-detail-plain').textContent = info.plain;
    document.getElementById('flow-detail-eq').textContent = info.eq;
    document.getElementById('flow-detail-why').textContent = info.why;
  }
  updateFlowchart('modc');
  renderWStaircaseChart(document.getElementById('w-staircase-svg'));

  const cL = bindRangePair('c-L', { min: 50, max: 1000, onChange: () => updateCardVICurve() });
  const cMax = bindRangePair('c-max', { min: 0.5, max: 2.0, onChange: () => updateCardVICurve() });
  const cMin = bindRangePair('c-min', { min: 0.00001, max: 0.01, onChange: () => updateCardVICurve() });

  function updateCardVICurve() {
    const L = cL.get();
    const cmx = cMax.get();
    const cmn = cMin.get();
    renderCDecayChart(document.getElementById('c-decay-svg'), { L, cMax: cmx, cMin: cmn });
    const half = Math.round(L / 2);
    document.getElementById('c-half-std').textContent = formatNum(computeStandardC(half, L, cmx, cmn));
    document.getElementById('c-half-hyb').textContent = formatNum(computeHybridC(half, L, cmx, cmn));
  }
  updateCardVICurve();

  // --- CARD VII: LAB 3D & 2D (Default Preset: F13 Rastrigin Compare All Three!) ---
  let labMode = 'compare';
  let labPlaying = false;
  let labTimer = null;
  let prefer2D = false;
  let labRunners = [];

  const labBanner = document.getElementById('lab-state-banner');
  const labBannerText = document.getElementById('lab-state-text');
  const labPlayBtn = document.getElementById('lab-play-btn');
  const labToggleRenderBtn = document.getElementById('lab-toggle-render');
  const labFuncSelect = document.getElementById('lab-func');
  const labSeedInput = document.getElementById('lab-seed');
  const layerTrail = document.getElementById('lab-layer-trail');
  const layerVectors = document.getElementById('lab-layer-vectors');
  const layerTraps = document.getElementById('lab-layer-traps');

  const labN = bindRangePair('lab-N', { min: 10, max: 80, onChange: () => resetLab() });
  const labL = bindRangePair('lab-L', { min: 40, max: 1000, onChange: () => resetLab() });
  const labCmax = bindRangePair('lab-cmax', { min: 0.5, max: 2.0, onChange: () => resetLab() });
  const labCmin = bindRangePair('lab-cmin', { min: 0.00001, max: 0.05, onChange: () => resetLab() });
  const labF = bindRangePair('lab-f', { min: 0.1, max: 1.5, onChange: () => resetLab() });
  const labLParam = bindRangePair('lab-l', { min: 0.5, max: 3.0, onChange: () => resetLab() });
  const labSpeed = bindRangePair('lab-speed', { min: 1, max: 10, onChange: () => {} });

  const labController = new ThreeLabController(document.getElementById('lab-canvas-mount'), {
    onStateChange({ mode, message }) {
      if (labBannerText) labBannerText.textContent = message;
      if (labBanner) labBanner.classList.remove('is-hidden');
      if (labToggleRenderBtn) labToggleRenderBtn.textContent = mode === 'webgl' ? 'Ganti ke 2D Kontur' : 'Coba 3D WebGL';
      syncWorldGpuState();
    }
  });

  function getLayers() {
    return { trail: !!layerTrail?.checked, vectors: !!layerVectors?.checked, traps: !!layerTraps?.checked };
  }
  function buildLabConfig(mode) {
    return {
      mode, funcId: labFuncSelect?.value || 'F13',
      popSize: labN.get(), maxIter: labL.get(),
      cMax: labCmax.get(), cMin: labCmin.get(),
      fParam: labF.get(), lParam: labLParam.get(),
      seed: Number(labSeedInput?.value) || 42
    };
  }
  function updateLabReadouts() {
    const primary = labRunners[0];
    if (!primary) return;
    const tel = primary.getTelemetry();
    document.getElementById('tel-iter').textContent = `${tel.iter} / ${tel.maxIter}`;
    document.getElementById('tel-phase').textContent = tel.phase;
    document.getElementById('tel-c').textContent = formatNum(tel.c);
    document.getElementById('tel-wi').textContent = `w=${tel.w} | I=${tel.I >= 1000 ? tel.I.toExponential(1) : tel.I.toFixed(1)}`;
    document.getElementById('tel-elite-pos').textContent = `(${tel.elitePos[0].toFixed(2)}, ${(tel.elitePos[1] ?? 0).toFixed(2)})`;
    document.getElementById('tel-elite-fit').textContent = formatNum(tel.eliteFit);
    document.getElementById('tel-mean-fit').textContent = formatNum(tel.meanFit);

    const seriesMeta = {
      hybrid: { label: 'Hybrid', color: '#B91C1C', width: 2.8 },
      goa: { label: 'GOA', color: '#1D4ED8', width: 2.2, dash: '5 3' },
      alo: { label: 'ALO', color: '#0F766E', width: 2.2, dash: '2 2' }
    };
    renderLabConvergenceChart(document.getElementById('lab-conv-svg'), {
      series: labRunners.map((r) => ({ ...seriesMeta[r.mode], values: r.convergence })),
      maxIter: tel.maxIter
    });
  }
  function resetLab() {
    stopLab();
    const fn = BENCHMARK_FUNCTIONS[labFuncSelect?.value || 'F13'] || BENCHMARK_FUNCTIONS.F13;
    const modes = labMode === 'compare' ? ['hybrid', 'goa', 'alo'] : [labMode];
    labRunners = modes.map((m) => new MetaheuristicRunner(buildLabConfig(m)));
    labController.setFunction(fn);
    labController.updateAgents(labRunners, getLayers());
    updateLabReadouts();
    if (labBanner && labBannerText) {
      labBannerText.textContent = 'Skenario Rastrigin: Bandingkan Ketiganya siap. Tekan Jalankan (Space).';
      labBanner.classList.remove('is-hidden');
    }
  }
  function stepLab(steps = 1) {
    if (!labRunners.length) return;
    if (labBanner) labBanner.classList.add('is-hidden');
    for (let s = 0; s < steps; s++) labRunners.forEach((r) => { if (r.iter < r.maxIter) r.step(); });
    labController.updateAgents(labRunners, getLayers());
    updateLabReadouts();
    if (labRunners.every((r) => r.iter >= r.maxIter)) stopLab();
  }
  function startLab() {
    if (labRunners.every((r) => r.iter >= r.maxIter)) resetLab();
    labPlaying = true;
    if (labPlayBtn) labPlayBtn.textContent = 'Jeda Simulasi (Space)';
    const loopTick = () => {
      if (!labPlaying) return;
      const spd = labSpeed.get();
      stepLab(spd >= 8 ? 3 : spd >= 5 ? 2 : 1);
      labTimer = setTimeout(loopTick, Math.max(24, Math.round(220 / spd)));
    };
    loopTick();
  }
  function stopLab() {
    labPlaying = false;
    if (labTimer) { clearTimeout(labTimer); labTimer = null; }
    if (labPlayBtn) labPlayBtn.textContent = '2. Jalankan Simulasi (Space)';
  }
  function toggleLabPlay() {
    if (labPlaying) stopLab(); else startLab();
  }

  const syncLabModeTabs = bindSegmentedTabs('lab-mode-tabs', (val) => { labMode = val; resetLab(); });
  labFuncSelect?.addEventListener('change', () => resetLab());
  labSeedInput?.addEventListener('change', () => resetLab());
  [layerTrail, layerVectors, layerTraps].forEach((cb) => cb?.addEventListener('change', () => labController.updateAgents(labRunners, getLayers())));
  labPlayBtn?.addEventListener('click', () => toggleLabPlay());
  document.getElementById('lab-step-btn')?.addEventListener('click', () => { stopLab(); stepLab(1); });
  document.getElementById('lab-reset-btn')?.addEventListener('click', () => resetLab());
  document.getElementById('lab-preset-paper-btn')?.addEventListener('click', () => {
    labN.set(40); labL.set(1000); labCmax.set(1.0); labCmin.set(0.00001); labF.set(0.5); labLParam.set(1.5);
    resetLab();
  });
  document.getElementById('lab-reseed-btn')?.addEventListener('click', () => {
    if (labSeedInput) labSeedInput.value = String(Math.floor(1 + Math.random() * 9999));
    resetLab();
  });
  labToggleRenderBtn?.addEventListener('click', async () => {
    prefer2D = labController.mode === 'webgl';
    await labController.init(prefer2D);
    labController.setFunction(BENCHMARK_FUNCTIONS[labFuncSelect?.value || 'F13']);
    labController.updateAgents(labRunners, getLayers());
    syncWorldGpuState();
  });
  labController.init(false).then(() => resetLab());

  // --- CARD VIII: EMPIRICAL BENCHMARKS ---
  function renderCardVIII(groupKey) {
    const group = PAPER_EMPIRICAL_DATA[groupKey] || PAPER_EMPIRICAL_DATA.unimodal;
    document.getElementById('bench-title').textContent = group.title;
    document.getElementById('bench-subtitle').textContent = group.subtitle;
    const suffix = group.unit || (groupKey === 'antenna' ? ' dB' : '');
    const showRow = (row) => {
      document.getElementById('bench-tooltip-algo').textContent = row.algo;
      document.getElementById('bench-tooltip-val').textContent = `${row.value}${suffix}`;
      document.getElementById('bench-tooltip-note').textContent = row.note;
    };
    renderBenchmarkChart(document.getElementById('bench-chart-svg'), { groupKey, onFocusRow: showRow });
    showRow(group.rows[0]);

    const metricsWrap = document.getElementById('bench-key-metrics');
    if (metricsWrap) {
      metricsWrap.innerHTML = group.keyMetrics.map((m) => `
        <div class="telemetry-cell">
          <span class="telemetry-k">${m.label}</span>
          <span class="telemetry-v">${m.value}</span>
        </div>
      `).join('');
    }
  }
  const syncBenchTabs = bindSegmentedTabs('bench-tabs', (key) => renderCardVIII(key));
  renderCardVIII('unimodal');

  // --- CARD IX: DECISION MATRIX + M9 INTERACTIVE 8-QUESTION FINAL QUIZ ---
  const decisionState = { domain: 'discrete', budget: 'tight', prior: 'heuristic' };
  function updateDecisionMatrix() {
    let scoreB = 0;
    let scoreC = 0;
    if (decisionState.domain === 'discrete') scoreB += 2; else scoreC += 2;
    if (decisionState.budget === 'tight') scoreB += 1; else scoreC += 1;
    if (decisionState.prior === 'heuristic') scoreB += 1; else scoreC += 1;

    document.getElementById('dec-card-b')?.classList.toggle('is-recommended-mct', scoreB >= scoreC);
    document.getElementById('dec-card-c')?.classList.toggle('is-recommended-alo', scoreC >= scoreB);

    const sumEl = document.getElementById('dec-summary');
    if (sumEl) {
      if (scoreB > scoreC) {
        sumEl.textContent = '[Pertimbangan Didaktik] Rekomendasi Pola B (MCT-PSO seeding parsial 10-30% [Paper/Usulan] atau MCT-GOA): terbaik jika heuristik awal cepat tersedia dan anggaran CPU ketat.';
      } else if (scoreC > scoreB) {
        sumEl.textContent = '[Pertimbangan Didaktik] Rekomendasi Pola C (Hybrid GOA-ALO [Paper]): terbaik untuk lanskap kontinu multimodal dengan anggaran CPU memadai (213 s vs 67 s pada LAA).';
      } else {
        sumEl.textContent = '[Pertimbangan Didaktik] Profil seimbang: pilih MCT-PSO (Pola B) untuk kecepatan CPU, atau Hybrid GOA-ALO (Pola C) untuk akurasi global kontinu multimodal.';
      }
    }
  }
  document.querySelectorAll('.decision-opt').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      decisionState[group] = btn.dataset.value;
      document.querySelectorAll(`.decision-opt[data-group="${group}"]`).forEach((b) => {
        const active = b === btn;
        b.setAttribute('aria-pressed', String(active));
        b.classList.toggle('btn-goa', active);
      });
      updateDecisionMatrix();
    });
  });
  updateDecisionMatrix();

  // Render 8-Question Final Quiz with instant explanatory feedback
  const quizAnswers = new Map();
  const quizList = document.getElementById('final-quiz-list');
  const quizScoreBadge = document.getElementById('quiz-score-badge');

  function renderFinalQuiz() {
    if (!quizList) return;
    quizList.innerHTML = FINAL_QUIZ_QUESTIONS.map((item, qIdx) => {
      const picked = quizAnswers.get(qIdx);
      const answered = typeof picked === 'number';
      const isRight = picked === item.ans;
      return `
        <div class="quiz-item">
          <div class="font-bold" style="font-size:13.5px">${item.q}</div>
          <div>
            ${item.opts.map((opt, oIdx) => {
              const cls = answered
                ? (oIdx === item.ans ? 'is-correct' : oIdx === picked ? 'is-wrong' : '')
                : '';
              return `<button type="button" class="quiz-opt ${cls}" data-q="${qIdx}" data-o="${oIdx}">${opt}</button>`;
            }).join('')}
          </div>
          ${answered ? `<div class="quiz-feedback"><strong>${isRight ? 'Benar!' : 'Kurang tepat.'}</strong> ${item.why}</div>` : ''}
        </div>
      `;
    }).join('');

    let correctCount = 0;
    FINAL_QUIZ_QUESTIONS.forEach((item, idx) => {
      if (quizAnswers.get(idx) === item.ans) correctCount += 1;
    });
    if (quizScoreBadge) {
      const pct = Math.round((correctCount / FINAL_QUIZ_QUESTIONS.length) * 100);
      quizScoreBadge.textContent = `Skor: ${correctCount}/${FINAL_QUIZ_QUESTIONS.length} (${pct}%)`;
      quizScoreBadge.className = `src-badge ${pct >= 80 ? 'src-prop' : 'src-sim'}`;
    }

    quizList.querySelectorAll('.quiz-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        quizAnswers.set(Number(btn.dataset.q), Number(btn.dataset.o));
        renderFinalQuiz();
      });
    });
  }
  renderFinalQuiz();

  // --- SCENE 0: INTRO CONTROLLER OVER 3D 9-CARD TABLETOP ---
  let introStep = 0;
  const introBadge = document.getElementById('intro-butler-badge');
  const introMoodPill = document.getElementById('intro-mood-pill');
  const introTitle = document.getElementById('intro-title');
  const introBody = document.getElementById('intro-body');
  const introNextBtn = document.getElementById('intro-next-btn');
  const tableFlipAllBtn = document.getElementById('table-flip-all-btn');

  function renderIntroStep(stepIdx = 0) {
    introStep = Math.max(0, Math.min(INTRO_BEATS.length - 1, stepIdx));
    const item = INTRO_BEATS[introStep];
    renderButler2DSvg(introBadge, { mood: item.mood, compact: true });
    if (introMoodPill) introMoodPill.textContent = item.pill;
    if (introTitle) introTitle.textContent = item.title;
    if (introBody) introBody.innerHTML = item.bodyHtml;
    if (introNextBtn) introNextBtn.textContent = item.cta;
    world.setCameraMode('table');
    world.setTableInteractive(true);
    world.setButlerMood(item.mood);
  }

  function advanceIntro() {
    if (introStep < INTRO_BEATS.length - 1) {
      renderIntroStep(introStep + 1);
    } else {
      deck.setIntro(false, { silent: true });
      deck.goTo(0);
    }
  }
  introNextBtn?.addEventListener('click', () => advanceIntro());
  tableFlipAllBtn?.addEventListener('click', () => {
    const nextFaceUp = !world.showAllFaceUp;
    world.setShowAllFaceUp(nextFaceUp);
    tableFlipAllBtn.textContent = nextFaceUp ? 'Tutup 9 Kartu' : 'Buka 9 Kartu';
  });

  // --- GPU HANDOFF ORCHESTRATOR (L2: Pause 3D World during Mode Fokus / Presentation / Card VII Lab!) ---
  function syncWorldGpuState() {
    if (!deck || !shorts) return;
    const labBeatMode = shorts.getCurrentBeat()?.effectiveMode;
    const onCardVIIOpen = !deck.isIntro && deck.current === 6 && !deck.isFaceDown && !deck.peekMode && labBeatMode !== 'explain';
    const on3DTable = deck.isIntro || deck.peekMode;

    world.setTableInteractive(on3DTable);
    world.syncDeckState({ openedSet: deck.openedCards, activeIdx: deck.current });

    labController.setActive(!document.hidden && onCardVIIOpen);
    if (!onCardVIIOpen && labPlaying) stopLab();

    // L2: 3D table animates vividly during Intro & Peek Table; pauses to save GPU in Presentation or Card VII WebGL Lab
    if (document.hidden || deck.presMode || (onCardVIIOpen && labController.mode === 'webgl')) {
      world.pause();
    } else {
      world.resume();
    }
  }

  // --- MANUAL STEP-BY-STEP SHORTS STAGE CONTROLLER ---
  shorts = new ShortsStageController({
    onBeatChange(beat) {
      stopBeatLoop();
      stopIntuitionSeq();
      world.setButlerMood(beat.mood);

      const [domain, sub] = (beat.action || '').split(':');

      if (domain === 'cover') {
        setCoverFocus(sub || 'all', true);
      } else if (domain === 'intuition') {
        setIntuitionStage(sub || 'random', true);
      } else if (domain === 'taxonomy') {
        const phase = sub || 'all';
        renderHybridTaxonomy(taxSvg, { activePhase: phase });
        requestAnimationFrame(() => syncTaxTabs(phase, true));
      } else if (domain === 'mct') {
        if (sub === 'walk0') updateMctWalkthrough(0);
        else if (sub === 'walk4') updateMctWalkthrough(4);
        else if (sub === 'animate') { updateMctWalkthrough(4); startMctLoopAnim(true); }
        else { updateMctWalkthrough(4); mctShownSteps = latestMctContext ? latestMctContext.tasks.length : 10; redrawMctPipeline(); }
      } else if (domain === 'single') {
        const tab = sub === 'alo' ? 'alo' : 'goa';
        setAnatTabVisual(tab);
        requestAnimationFrame(() => syncAnatTabs(tab, true));
        if (tab === 'goa') startRafLoop((p) => updateCardVA(p), 2600);
        else startAloLoop(true);
      } else if (domain === 'hybrid') {
        updateFlowchart(sub || 'modc');
        updateCardVICurve();
      } else if (domain === 'lab') {
        if (sub === 'compare') { labMode = 'compare'; resetLab(); }
        requestAnimationFrame(() => { syncLabModeTabs(labMode, true); labController.resize(); });
      } else if (domain === 'bench') {
        const group = sub || 'unimodal';
        renderCardVIII(group);
        requestAnimationFrame(() => syncBenchTabs(group, true));
      } else if (domain === 'synth') {
        updateDecisionMatrix();
      }

      syncWorldGpuState();
    },
    onNextCard(nextIdx) { deck?.selectCard(nextIdx); },
    onRevealCard() { deck?.revealCurrent(); }
  });

  // --- DECK CONTROLLER ---
  deck = new DeckController({
    onIntroChange(active) {
      if (active) {
        stopBeatLoop();
        stopIntuitionSeq();
        renderIntroStep(0);
        syncWorldGpuState();
      }
    },
    onTrackChange(trackKey) {
      shorts.setDurationTrack(trackKey);
    },
    onSlideChange(idx, meta, isFaceDown, isDeal) {
      stopBeatLoop();
      stopIntuitionSeq();

      if (isDeal) world.triggerCardDeal({ activeIdx: idx, openedSet: deck.openedCards });
      else world.syncDeckState({ activeIdx: idx, openedSet: deck.openedCards });

      world.setCameraMode('focus');

      if (isFaceDown) {
        world.setButlerMood('deal');
        shorts.showClosedCardDialogue(meta);
        syncWorldGpuState();
      } else {
        shorts.loadCard(idx, { beatIdx: 0 });
      }
    },
    onSpaceKey() {
      if (deck.isIntro) { advanceIntro(); return; }
      const beat = shorts.getCurrentBeat();
      if (deck.current === 6 && beat.effectiveMode === 'interactive') toggleLabPlay();
      else shorts.nextBeat();
    },
    onBeatNav(dir) {
      if (dir > 0) shorts.nextBeat();
      else shorts.prevBeat();
    },
    onPeekChange(peeking) {
      if (peeking) {
        stopBeatLoop();
        world.setCameraMode('table');
        world.setButlerMood('greet');
      } else if (deck.isIntro) {
        renderIntroStep(introStep);
      } else {
        world.setCameraMode('focus');
        if (deck.isFaceDown) world.setButlerMood('deal');
        else {
          const curBeat = shorts.getCurrentBeat();
          world.setButlerMood(curBeat.mood);
          shorts.goToBeat(curBeat.beatIdx);
        }
      }
      syncWorldGpuState();
    }
  });

  document.getElementById('btn-start-deck')?.addEventListener('click', () => deck.goTo(3));
  document.getElementById('btn-jump-lab')?.addEventListener('click', () => {
    deck.goTo(6);
    shorts.goToBeat(1);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stopBeatLoop(); stopIntuitionSeq(); if (labPlaying) stopLab(); }
    syncWorldGpuState();
  });

  window.addEventListener('resize', () => {
    world.resize();
    labController.resize();
  });

  if (deck.isIntro) renderIntroStep(0);
  syncWorldGpuState();
});
