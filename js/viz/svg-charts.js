// Crisp Accessible SVG Charts (v10: MCT-PSO + MCT-GOA Comparison & Paper Benchmarks)
// L4: All text >= 12px | L5: Repulsion Orange dashed (#C2410C) vs Attraction Blue solid (#1D4ED8)
// L6: Distinct patterns & short labels readable in grayscale

import { socialForce, comfortZoneRadius, computeStandardC, computeHybridC, computeW } from '../algorithms/hybrid-goa-alo.js?v=10';
import { PAPER_EMPIRICAL_DATA } from '../algorithms/benchmarks.js?v=10';

function formatSci(val) {
  if (!Number.isFinite(val)) return 'N/A';
  if (val === 0) return '0';
  const abs = Math.abs(val);
  if (abs < 0.001 || abs >= 10000) return val.toExponential(2);
  return val.toFixed(abs < 1 ? 4 : 2);
}

// L5: Separate Orange Dashed Repulsion (#C2410C) vs Blue Solid Attraction (#1D4ED8)
export function renderSocialCurveChart(container, { f = 0.5, l = 1.5 } = {}) {
  if (!container) return;
  const W = 480;
  const H = 205;
  const pad = { t: 22, r: 20, b: 34, l: 50 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;

  const rMin = 0;
  const rMax = 4.5;
  const yMin = -0.8;
  const yMax = 0.45;
  const xOf = (r) => pad.l + ((r - rMin) / (rMax - rMin)) * pw;
  const yOf = (y) => pad.t + ((yMax - Math.max(yMin, Math.min(yMax, y))) / (yMax - yMin)) * ph;

  const repelPts = [];
  const attractPts = [];
  for (let i = 0; i <= 90; i++) {
    const r = rMin + (i / 90) * (rMax - rMin);
    const val = socialForce(r, f, l);
    const pt = `${xOf(r).toFixed(1)},${yOf(val).toFixed(1)}`;
    if (val < 0) repelPts.push(pt);
    else attractPts.push(pt);
  }

  const yZero = yOf(0);
  const r0 = comfortZoneRadius(f, l);
  const r0Visible = r0 && r0 >= rMin && r0 <= rMax;

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block" role="img" aria-label="Kurva gaya sosial s(r): zona tolak oranye putus-putus dan zona tarik biru solid">
      <rect x="${pad.l}" y="${pad.t}" width="${pw}" height="${ph}" rx="6" fill="#FFFFFF" stroke="#1A1816" stroke-width="1.6"/>
      <rect x="${pad.l}" y="${pad.t}" width="${pw}" height="${(yZero - pad.t).toFixed(1)}" fill="#1D4ED8" fill-opacity="0.08"/>
      <rect x="${pad.l}" y="${yZero.toFixed(1)}" width="${pw}" height="${(pad.t + ph - yZero).toFixed(1)}" fill="#C2410C" fill-opacity="0.09"/>

      <line x1="${pad.l}" y1="${yZero.toFixed(1)}" x2="${pad.l + pw}" y2="${yZero.toFixed(1)}" stroke="#1A1816" stroke-width="1.3" stroke-dasharray="4 3"/>

      ${repelPts.length ? `<polyline points="${repelPts.join(' ')}" fill="none" stroke="#C2410C" stroke-width="3.2" stroke-dasharray="6 3" stroke-linecap="round"/>` : ''}
      ${attractPts.length ? `<polyline points="${attractPts.join(' ')}" fill="none" stroke="#1D4ED8" stroke-width="3.2" stroke-linecap="round"/>` : ''}

      ${r0Visible ? `
        <line x1="${xOf(r0).toFixed(1)}" y1="${pad.t}" x2="${xOf(r0).toFixed(1)}" y2="${pad.t + ph}" stroke="#1A1816" stroke-width="1.5" stroke-dasharray="3 3"/>
        <circle cx="${xOf(r0).toFixed(1)}" cy="${yZero.toFixed(1)}" r="5.5" fill="#FDE047" stroke="#1A1816" stroke-width="2"/>
        <text x="${Math.min(pad.l + pw - 118, xOf(r0) + 8).toFixed(1)}" y="${(pad.t + 16).toFixed(1)}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#1A1816">r0 = ${r0.toFixed(2)}</text>
      ` : ''}

      <g font-family="JetBrains Mono, monospace" font-size="12" fill="#4B4742">
        <text x="${pad.l - 6}" y="${pad.t + 8}" text-anchor="end">+0.45</text>
        <text x="${pad.l - 6}" y="${yZero + 4}" text-anchor="end">0.0</text>
        <text x="${pad.l - 6}" y="${pad.t + ph}" text-anchor="end">-0.80</text>
        <text x="${pad.l}" y="${H - 9}">0</text>
        <text x="${xOf(2.0).toFixed(1)}" y="${H - 9}" text-anchor="middle">Jarak r = 2.0</text>
        <text x="${pad.l + pw}" y="${H - 9}" text-anchor="end">r = 4.5</text>
        <text x="${pad.l + pw - 6}" y="${pad.t + 16}" text-anchor="end" font-weight="700" fill="#1D4ED8">TARIK s(r) &gt; 0 (solid)</text>
        <text x="${pad.l + pw - 6}" y="${pad.t + ph - 8}" text-anchor="end" font-weight="700" fill="#C2410C">TOLAK s(r) &lt; 0 (putus)</text>
      </g>
    </svg>
  `;
}

export function renderCDecayChart(container, { L = 200, cMax = 1.0, cMin = 0.00001 } = {}) {
  if (!container) return;
  const W = 490;
  const H = 224;
  const pad = { t: 28, r: 20, b: 36, l: 52 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;

  const xOf = (iter) => pad.l + (iter / L) * pw;
  const yOf = (val) => pad.t + ((cMax - Math.max(0, Math.min(cMax, val))) / Math.max(1e-6, cMax)) * ph;

  const stdPts = [];
  const hybPts = [];
  for (let i = 0; i <= 100; i++) {
    const iter = (i / 100) * L;
    stdPts.push(`${xOf(iter).toFixed(1)},${yOf(computeStandardC(iter, L, cMax, cMin)).toFixed(1)}`);
    hybPts.push(`${xOf(iter).toFixed(1)},${yOf(computeHybridC(iter, L, cMax, cMin)).toFixed(1)}`);
  }

  const xHalf = xOf(L / 2);

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block" role="img" aria-label="Perbandingan peluruhan parameter c GOA standar dan Hybrid GOA-ALO di pivot L/2">
      <rect x="${pad.l}" y="${pad.t}" width="${pw}" height="${ph}" rx="6" fill="#FFFFFF" stroke="#1A1816" stroke-width="1.6"/>
      <rect x="${pad.l}" y="${pad.t}" width="${(xHalf - pad.l).toFixed(1)}" height="${ph}" fill="#1D4ED8" fill-opacity="0.07"/>
      <rect x="${xHalf.toFixed(1)}" y="${pad.t}" width="${(pad.l + pw - xHalf).toFixed(1)}" height="${ph}" fill="#B91C1C" fill-opacity="0.07"/>

      <line x1="${xHalf.toFixed(1)}" y1="${pad.t}" x2="${xHalf.toFixed(1)}" y2="${pad.t + ph}" stroke="#B91C1C" stroke-width="1.8" stroke-dasharray="5 3"/>

      <polyline points="${stdPts.join(' ')}" fill="none" stroke="#4B4742" stroke-width="2.2" stroke-dasharray="6 4"/>
      <polyline points="${hybPts.join(' ')}" fill="none" stroke="#B91C1C" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${xHalf.toFixed(1)}" cy="${yOf(cMin).toFixed(1)}" r="5.5" fill="#FDE047" stroke="#B91C1C" stroke-width="2.2"/>

      <g font-family="JetBrains Mono, monospace" font-size="12" fill="#4B4742">
        <text x="${pad.l + 6}" y="${pad.t + 16}" fill="#1D4ED8" font-weight="700">PARUH 1: CARI LUAS</text>
        <text x="${xHalf + 6}" y="${pad.t + 16}" fill="#B91C1C" font-weight="700">PARUH 2: PRESISI</text>
        <text x="${pad.l - 6}" y="${pad.t + 6}" text-anchor="end">${cMax.toFixed(1)}</text>
        <text x="${pad.l - 6}" y="${pad.t + ph / 2 + 4}" text-anchor="end">${(cMax / 2).toFixed(1)}</text>
        <text x="${pad.l - 6}" y="${pad.t + ph}" text-anchor="end">0</text>
        <text x="${pad.l}" y="${H - 11}">l = 0</text>
        <text x="${xHalf.toFixed(1)}" y="${H - 11}" text-anchor="middle" fill="#B91C1C" font-weight="700">Pivot L/2 = ${Math.round(L / 2)}</text>
        <text x="${pad.l + pw}" y="${H - 11}" text-anchor="end">L = ${L}</text>
      </g>

      <g font-family="JetBrains Mono, monospace" font-size="12">
        <line x1="${pad.l}" y1="12" x2="${pad.l + 20}" y2="12" stroke="#B91C1C" stroke-width="3"/>
        <text x="${pad.l + 25}" y="16" fill="#1A1816" font-weight="700">Hybrid c (Eq.9-10)</text>
        <line x1="${pad.l + 215}" y1="12" x2="${pad.l + 235}" y2="12" stroke="#4B4742" stroke-width="2.2" stroke-dasharray="5 3"/>
        <text x="${pad.l + 240}" y="16" fill="#4B4742">GOA Asli (Eq.8)</text>
      </g>
    </svg>
  `;
}

// PRD M8: Visual staircase chart showing w stepping 1 -> 6 along t/T
export function renderWStaircaseChart(container) {
  if (!container) return;
  const W = 490;
  const H = 136;
  const pad = { t: 22, r: 18, b: 30, l: 42 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;

  const xOf = (frac) => pad.l + frac * pw;
  const yOf = (w) => pad.t + ((6.4 - w) / 5.8) * ph;

  const pts = [];
  for (let pct = 0; pct <= 100; pct++) {
    const w = computeW(pct, 100);
    pts.push(`${xOf(pct / 100).toFixed(1)},${yOf(w).toFixed(1)}`);
  }

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block" role="img" aria-label="Grafik tangga parameter penyempitan w pada ALO dan Hybrid GOA-ALO">
      <rect x="${pad.l}" y="${pad.t}" width="${pw}" height="${ph}" rx="5" fill="#FFFFFF" stroke="#1A1816" stroke-width="1.5"/>
      <polyline points="${pts.join(' ')}" fill="none" stroke="#B91C1C" stroke-width="3" stroke-linejoin="miter"/>
      <g font-family="JetBrains Mono, monospace" font-size="12" fill="#4B4742">
        <text x="${pad.l}" y="14" font-weight="700" fill="#1A1816">TANGGA w PADA I = 10^w (t/T) [Paper: Eq.11-12]</text>
        <text x="${pad.l - 6}" y="${yOf(6) + 4}" text-anchor="end">w=6</text>
        <text x="${pad.l - 6}" y="${yOf(1) + 4}" text-anchor="end">w=1</text>
        <text x="${xOf(0.1).toFixed(1)}" y="${H - 8}" text-anchor="middle">10%</text>
        <text x="${xOf(0.5).toFixed(1)}" y="${H - 8}" text-anchor="middle">50%</text>
        <text x="${xOf(0.75).toFixed(1)}" y="${H - 8}" text-anchor="middle">75%</text>
        <text x="${xOf(0.95).toFixed(1)}" y="${H - 8}" text-anchor="middle" fill="#B91C1C" font-weight="700">95%</text>
      </g>
    </svg>
  `;
}

export function renderMctConvergenceChart(container, { mctHistory = [], psoHistory = [], pureHistory = [], showPure = true } = {}) {
  if (!container || mctHistory.length === 0) return;
  const W = 630;
  const H = 172;
  const pad = { t: 28, r: 16, b: 30, l: 56 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;

  const allVals = [...mctHistory, ...psoHistory, ...(showPure ? pureHistory : [])];
  const yMax = Math.max(...allVals) * 1.04;
  const yMin = Math.min(...allVals) * 0.96;
  const ySpan = Math.max(1e-6, yMax - yMin);
  const maxL = Math.max(1, mctHistory.length - 1);

  const toPoly = (arr) => arr.map((v, idx) => {
    const x = pad.l + (idx / maxL) * pw;
    const y = pad.t + ((yMax - v) / ySpan) * ph;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const mctFinal = mctHistory[mctHistory.length - 1];
  const psoFinal = psoHistory.length ? psoHistory[psoHistory.length - 1] : null;
  const pureFinal = pureHistory.length ? pureHistory[pureHistory.length - 1] : null;

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block" role="img" aria-label="Kurva simulasi penurunan Makespan MCT-PSO, MCT-GOA, dan start acak">
      <rect x="${pad.l}" y="${pad.t}" width="${pw}" height="${ph}" rx="5" fill="#FFFFFF" stroke="#1A1816" stroke-width="1.5"/>
      <line x1="${pad.l}" y1="${pad.t + ph / 2}" x2="${pad.l + pw}" y2="${pad.t + ph / 2}" stroke="rgba(26,24,22,0.12)" stroke-dasharray="4 3"/>

      ${showPure && pureHistory.length ? `<polyline points="${toPoly(pureHistory)}" fill="none" stroke="#64748B" stroke-width="2.2" stroke-dasharray="6 4"/>` : ''}
      ${psoHistory.length ? `<polyline points="${toPoly(psoHistory)}" fill="none" stroke="#6D28D9" stroke-width="2.8" stroke-dasharray="9 3" stroke-linejoin="round"/>` : ''}
      <polyline points="${toPoly(mctHistory)}" fill="none" stroke="#0F766E" stroke-width="3.0" stroke-linejoin="round"/>
      <rect x="${(pad.l - 5).toFixed(1)}" y="${(pad.t + ((yMax - mctHistory[0]) / ySpan) * ph - 5).toFixed(1)}" width="10" height="10" rx="2" fill="#0F766E" stroke="#1A1816" stroke-width="1.4"/>

      <g font-family="JetBrains Mono, monospace" font-size="12" fill="#4B4742">
        <text x="${pad.l - 6}" y="${pad.t + 8}" text-anchor="end">${yMax.toFixed(1)}s</text>
        <text x="${pad.l - 6}" y="${pad.t + ph}" text-anchor="end">${yMin.toFixed(1)}s</text>
        <text x="${pad.l}" y="${H - 8}">Iter 0 (Start)</text>
        <text x="${pad.l + pw}" y="${H - 8}" text-anchor="end">Iter ${maxL} [Simulasi Web]</text>
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="12">
        ${psoFinal !== null ? `
          <line x1="${pad.l}" y1="14" x2="${pad.l + 18}" y2="14" stroke="#6D28D9" stroke-width="2.8" stroke-dasharray="6 2"/>
          <text x="${pad.l + 22}" y="18" fill="#6D28D9" font-weight="700">MCT+PSO: ${psoFinal.toFixed(2)}s</text>
        ` : ''}
        <line x1="${pad.l + 195}" y1="14" x2="${pad.l + 213}" y2="14" stroke="#0F766E" stroke-width="3"/>
        <text x="${pad.l + 217}" y="18" fill="#0F766E" font-weight="700">MCT+GOA: ${mctFinal.toFixed(2)}s</text>
        ${showPure && pureFinal !== null ? `
          <line x1="${pad.l + 392}" y1="14" x2="${pad.l + 410}" y2="14" stroke="#64748B" stroke-width="2.2" stroke-dasharray="5 3"/>
          <text x="${pad.l + 414}" y="18" fill="#4B4742">Acak: ${pureFinal.toFixed(2)}s</text>
        ` : ''}
      </g>
    </svg>
  `;
}

export function renderLabConvergenceChart(container, { series = [], maxIter = 150 } = {}) {
  if (!container) return;
  const W = 580;
  const H = 144;
  const pad = { t: 24, r: 16, b: 26, l: 64 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;

  const flat = series.flatMap((s) => s.values).filter(Number.isFinite);
  if (flat.length === 0) return;

  const rawMin = Math.min(...flat);
  const rawMax = Math.max(...flat);
  const useLog = rawMin >= 0 && rawMax > rawMin * 30 && rawMax > 1e-6;
  const mapYVal = (v) => (useLog ? Math.log10(Math.max(1e-12, v)) : v);

  const mapped = flat.map(mapYVal);
  const yMax = Math.max(...mapped);
  const yMin = Math.min(...mapped);
  const ySpan = Math.max(1e-6, yMax - yMin);

  const xOf = (idx) => pad.l + (idx / Math.max(1, maxIter)) * pw;
  const yOf = (v) => pad.t + ((yMax - mapYVal(v)) / ySpan) * ph;
  const xHalf = xOf(maxIter / 2);

  const linesSvg = series.map((s) => {
    const pts = s.values.map((v, i) => `${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');
    return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="${s.width || 2.4}" ${s.dash ? `stroke-dasharray="${s.dash}"` : ''} stroke-linejoin="round"/>`;
  }).join('');

  let legendX = pad.l;
  const legendSvg = series.map((s) => {
    const last = s.values[s.values.length - 1];
    const label = `${s.label}: ${formatSci(last)}`;
    const out = `
      <line x1="${legendX}" y1="12" x2="${legendX + 14}" y2="12" stroke="${s.color}" stroke-width="2.6" ${s.dash ? `stroke-dasharray="${s.dash}"` : ''}/>
      <text x="${legendX + 19}" y="16" font-family="JetBrains Mono, monospace" font-size="12" fill="#1A1816">${label}</text>
    `;
    legendX += Math.max(162, label.length * 7.6 + 26);
    return out;
  }).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block" role="img" aria-label="Kurva konvergensi fitness real-time laboratorium simulasi">
      <rect x="${pad.l}" y="${pad.t}" width="${pw}" height="${ph}" rx="5" fill="#FFFFFF" stroke="#1A1816" stroke-width="1.5"/>
      <line x1="${xHalf.toFixed(1)}" y1="${pad.t}" x2="${xHalf.toFixed(1)}" y2="${pad.t + ph}" stroke="#B91C1C" stroke-width="1.3" stroke-dasharray="4 3" opacity="0.8"/>
      ${linesSvg}
      ${legendSvg}
      <g font-family="JetBrains Mono, monospace" font-size="12" fill="#4B4742">
        <text x="${pad.l - 6}" y="${pad.t + 8}" text-anchor="end">${formatSci(rawMax)}</text>
        <text x="${pad.l - 6}" y="${pad.t + ph}" text-anchor="end">${formatSci(rawMin)}</text>
        <text x="${pad.l}" y="${H - 6}">0${useLog ? ' (log10)' : ''}</text>
        <text x="${xHalf.toFixed(1)}" y="${H - 6}" text-anchor="middle" fill="#B91C1C" font-weight="700">L/2</text>
        <text x="${pad.l + pw}" y="${H - 6}" text-anchor="end">L=${maxIter}</text>
      </g>
    </svg>
  `;
}

export function renderBenchmarkChart(container, { groupKey = 'unimodal', onFocusRow } = {}) {
  const group = PAPER_EMPIRICAL_DATA[groupKey] || PAPER_EMPIRICAL_DATA.unimodal;
  if (!container) return;
  const rows = group.rows;
  const W = 580;
  const rowH = 36;
  const pad = { t: 28, r: 92, b: 18, l: 152 };
  const H = pad.t + rows.length * rowH + pad.b;
  const pw = W - pad.l - pad.r;
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.value)));

  const colorMap = {
    hybrid: '#B91C1C',
    mct: '#0F766E',
    pso: '#6D28D9',
    goa: '#1D4ED8',
    alo: '#0F766E',
    other: '#64748B'
  };
  const suffix = group.unit || (groupKey === 'antenna' ? ' dB' : '');

  const barsSvg = rows.map((row, idx) => {
    const y = pad.t + idx * rowH;
    const bw = Math.max(10, (Math.abs(row.value) / maxAbs) * pw);
    const fill = colorMap[row.highlight] || '#64748B';
    const isTop = row.highlight === 'hybrid' || row.highlight === 'mct';
    return `
      <g class="bench-bar-row" data-row-idx="${idx}" tabindex="0" role="button" aria-label="${row.algo}: ${row.value}${suffix}. ${row.note}" style="cursor:pointer;">
        <rect x="4" y="${y + 1}" width="${W - 8}" height="${rowH - 4}" rx="5" fill="transparent"/>
        <text x="${pad.l - 10}" y="${y + 22}" text-anchor="end" font-family="Plus Jakarta Sans, Segoe UI, sans-serif" font-size="13" font-weight="${isTop ? '700' : '600'}" fill="${isTop ? '#1A1816' : '#4B4742'}">${row.algo}</text>
        <rect x="${pad.l}" y="${y + 7}" width="${bw.toFixed(1)}" height="20" rx="4" fill="${fill}" stroke="#1A1816" stroke-width="${isTop ? '2' : '1'}"/>
        <text x="${(pad.l + bw + 8).toFixed(1)}" y="${y + 22}" font-family="JetBrains Mono, monospace" font-size="12.5" font-weight="${isTop ? '700' : '600'}" fill="${isTop ? fill : '#1A1816'}">${row.value}${suffix}</text>
      </g>
    `;
  }).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block" role="img" aria-label="${group.title}">
      <text x="${pad.l}" y="17" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#4B4742">${group.metricLabel}</text>
      <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${H - pad.b}" stroke="#1A1816" stroke-width="1.8"/>
      ${barsSvg}
    </svg>
  `;

  container.querySelectorAll('.bench-bar-row').forEach((el) => {
    const idx = Number(el.dataset.rowIdx);
    const trigger = () => onFocusRow && onFocusRow(rows[idx]);
    el.addEventListener('mouseenter', trigger);
    el.addEventListener('focus', trigger);
    el.addEventListener('click', trigger);
  });
}
