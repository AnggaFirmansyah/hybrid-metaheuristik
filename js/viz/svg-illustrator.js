// Accessible Shapes-Vocabulary Vector SVG Illustrator (v9: Reference Sir Pip Mascot)
// L1: Reusable Permanent Shapes Legend | L4: All SVG labels >= 12 | L5: Orange dashed Repulsion (#C2410C) vs Blue solid Attraction (#1D4ED8)
// L6: Non-color differentiators (filled square MCT, dotted circle GOA, hatched funnel ALO, purple hexagon Metaheuristic, gold diamond Decision/Elite)

import { socialForce, comfortZoneRadius } from '../algorithms/hybrid-goa-alo.js?v=10';
import { MCT_WALKTHROUGH_EXAMPLE } from '../algorithms/benchmarks.js?v=10';

export const BUTLER_MOODS = ['greet', 'deal', 'point', 'think', 'aha', 'proud'];

// ============================================================================
// L1: PERMANENT SHAPES VOCABULARY LEGEND STRIP (Shown on EVERY Card)
// ============================================================================
export function renderShapesLegend(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="shapes-legend-strip" role="region" aria-label="Legenda kosakata bentuk diagram">
      <span class="leg-item"><span class="leg-sq" aria-hidden="true">■</span> <strong>MCT</strong> (Heuristik)</span>
      <span class="leg-item"><span class="leg-ci" aria-hidden="true">◉</span> <strong>GOA</strong> (Agen)</span>
      <span class="leg-item"><span class="leg-tri" aria-hidden="true">▼</span> <strong>ALO</strong> (Jebakan)</span>
      <span class="leg-item"><span class="leg-hex" aria-hidden="true">⬡</span> <strong>Metaheuristik</strong></span>
      <span class="leg-item"><span class="leg-el" aria-hidden="true">◆</span> <strong>Elite</strong></span>
      <span class="leg-item"><span class="leg-att" aria-hidden="true">→</span> <strong>Tarik</strong></span>
      <span class="leg-item"><span class="leg-rep" aria-hidden="true">⇢</span> <strong>Tolak</strong></span>
    </div>
  `;
}

// ============================================================================
// 2D SVG MASCOT "SIR PIP" (Exact match to user reference: mint boxy console,
// pastel screen with blush & pink tongue, navy tux + white shirt + red bowtie
// with yellow knot, tilted wide-brim top hat, waving arm & 3 fanned orange/gold cards!)
// ============================================================================
export function renderButler2DSvg(container, { mood = 'greet', compact = false } = {}) {
  if (!container) return;
  const safeMood = BUTLER_MOODS.includes(mood) ? mood : 'greet';

  const eyesMap = {
    greet: `<path d="M 45 55 Q 50 48 55 55" fill="none" stroke="#1A1816" stroke-width="3.2" stroke-linecap="round"/><path d="M 65 55 Q 70 48 75 55" fill="none" stroke="#1A1816" stroke-width="3.2" stroke-linecap="round"/>`,
    deal: `<circle cx="50" cy="54" r="3.6" fill="#1A1816"/><circle cx="70" cy="54" r="3.6" fill="#1A1816"/><line x1="44" y1="47" x2="55" y2="50" stroke="#1A1816" stroke-width="2.5" stroke-linecap="round"/><line x1="76" y1="47" x2="65" y2="50" stroke="#1A1816" stroke-width="2.5" stroke-linecap="round"/>`,
    point: `<circle cx="51" cy="54" r="3.6" fill="#1A1816"/><circle cx="71" cy="54" r="3.6" fill="#1A1816"/><circle cx="52.3" cy="52.6" r="1.2" fill="#FFFFFF"/><circle cx="72.3" cy="52.6" r="1.2" fill="#FFFFFF"/>`,
    think: `<circle cx="50" cy="55" r="3.3" fill="#1A1816"/><circle cx="70" cy="53" r="3.3" fill="#1A1816"/><path d="M 44 48 Q 50 46 55 48" fill="none" stroke="#1A1816" stroke-width="2.4" stroke-linecap="round"/><path d="M 65 45 Q 70 41 76 46" fill="none" stroke="#1A1816" stroke-width="2.4" stroke-linecap="round"/>`,
    aha: `<circle cx="50" cy="53" r="4.4" fill="#1A1816"/><circle cx="70" cy="53" r="4.4" fill="#1A1816"/><circle cx="48.5" cy="51.5" r="1.6" fill="#FDE047"/><circle cx="68.5" cy="51.5" r="1.6" fill="#FDE047"/>`,
    proud: `<path d="M 44 55 Q 50 47 56 55" fill="none" stroke="#1A1816" stroke-width="3.2" stroke-linecap="round"/><path d="M 64 55 Q 70 47 76 55" fill="none" stroke="#1A1816" stroke-width="3.2" stroke-linecap="round"/>`
  };

  const mouthMap = {
    greet: `<path d="M 52 64 Q 60 73 68 64 Z" fill="#1A1816" stroke="#1A1816" stroke-width="1.6" stroke-linejoin="round"/><ellipse cx="60" cy="69" rx="4.2" ry="2.4" fill="#F4728A"/>`,
    deal: `<path d="M 52 66 Q 61 72 70 64" fill="none" stroke="#1A1816" stroke-width="2.8" stroke-linecap="round"/>`,
    point: `<ellipse cx="60" cy="66" rx="5.5" ry="4.4" fill="#1A1816"/><ellipse cx="60" cy="68" rx="3.2" ry="2" fill="#F4728A"/>`,
    think: `<path d="M 53 67 Q 57 63 61 67 T 68 65" fill="none" stroke="#1A1816" stroke-width="2.6" stroke-linecap="round"/>`,
    aha: `<path d="M 50 63 Q 60 76 70 63 Z" fill="#1A1816" stroke="#1A1816" stroke-width="1.8"/><ellipse cx="60" cy="69.5" rx="4.8" ry="2.6" fill="#F4728A"/>`,
    proud: `<path d="M 51 64 Q 60 73 69 64 Z" fill="#1A1816"/><ellipse cx="60" cy="68.5" rx="4" ry="2.2" fill="#F4728A"/>`
  };

  const sizeClass = compact ? 'w-[50px] h-[50px] block' : 'w-[100px] h-[104px] block';

  container.innerHTML = `
    <svg viewBox="0 0 120 124" class="${sizeClass}" role="img" aria-label="Maskot Butler Sir Pip ekspresi ${safeMood}">
      <!-- Coastal Sky + Cloud + Ocean + Sunny Deck Mini Backdrop -->
      <rect x="4" y="4" width="112" height="116" rx="16" fill="#4EB6F7" stroke="#1A1816" stroke-width="3"/>
      <path d="M 10 26 Q 22 14 38 20 Q 50 14 60 26 Z" fill="#FFFFFF" opacity="0.92"/>
      <rect x="6" y="34" width="108" height="44" fill="#1982B8"/>
      <rect x="6" y="76" width="108" height="4" fill="#FFFFFF"/>
      <path d="M 6 80 L 114 80 L 114 104 Q 114 118 100 118 L 20 118 Q 6 118 6 104 Z" fill="#F4CE52"/>
      <!-- 3 Fanned Orange & Yellow Mini-Cards (Left side) -->
      <g transform="translate(8,72)">
        <rect x="0" y="6" width="12" height="18" rx="1.5" transform="rotate(-22 6 15)" fill="#EA580C" stroke="#1A1816" stroke-width="2"/>
        <rect x="7" y="4" width="12" height="18" rx="1.5" transform="rotate(-6 13 13)" fill="#FACC15" stroke="#1A1816" stroke-width="2"/>
        <rect x="13" y="6" width="12" height="18" rx="1.5" transform="rotate(11 19 15)" fill="#EA580C" stroke="#1A1816" stroke-width="2"/>
      </g>
      <!-- Waving Navy Arm + Round Mint Hand Ball (Right side) -->
      <line x1="90" y1="84" x2="107" y2="66" stroke="#1A1816" stroke-width="11" stroke-linecap="round"/>
      <line x1="90" y1="84" x2="107" y2="66" stroke="#1D2939" stroke-width="6.5" stroke-linecap="round"/>
      <circle cx="108" cy="64" r="6.8" fill="#72D6B4" stroke="#1A1816" stroke-width="2.5"/>
      <!-- Boxy Mint-Teal Console Body -->
      <rect x="29" y="32" width="62" height="80" rx="4" fill="#72D6B4" stroke="#1A1816" stroke-width="3.2"/>
      <!-- Pastel-Mint Recessed Face Screen -->
      <rect x="37" y="41" width="46" height="36" rx="3" fill="#D9F7ED" stroke="#1A1816" stroke-width="2.8"/>
      <!-- Pink Blush Cheeks -->
      <ellipse cx="45" cy="63" rx="4.2" ry="2.4" fill="#F497A9"/>
      <ellipse cx="75" cy="63" rx="4.2" ry="2.4" fill="#F497A9"/>
      ${eyesMap[safeMood]}
      ${mouthMap[safeMood]}
      <!-- Navy Tuxedo Jacket + Wide White Shirt Panel -->
      <rect x="29" y="82" width="62" height="30" fill="#1D2939" stroke="#1A1816" stroke-width="3"/>
      <rect x="49" y="83" width="22" height="27" fill="#FFFFFF"/>
      <!-- Classic Red Bowtie + Bright Yellow Knot -->
      <polygon points="46,81 60,87.5 46,94" fill="#DC2626" stroke="#1A1816" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="74,81 60,87.5 74,94" fill="#DC2626" stroke="#1A1816" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="60" cy="87.5" r="3.6" fill="#FACC15" stroke="#1A1816" stroke-width="1.6"/>
      <!-- Tilted Wide-Brim Navy Top Hat + Gold Band -->
      <g transform="rotate(-10 59 24)">
        <rect x="39" y="10" width="40" height="20" rx="2" fill="#1D2939" stroke="#1A1816" stroke-width="2.8"/>
        <rect x="39" y="23" width="40" height="5.5" fill="#FACC15" stroke="#1A1816" stroke-width="1.4"/>
        <rect x="32" y="28" width="54" height="5.5" rx="2" fill="#1D2939" stroke="#1A1816" stroke-width="2.6"/>
      </g>
    </svg>
  `;
}

function sharedDefs(prefix) {
  return `
    <defs>
      <linearGradient id="${prefix}-goa-grad" x1="12%" y1="8%" x2="88%" y2="92%">
        <stop offset="0%" stop-color="#60A5FA"/>
        <stop offset="55%" stop-color="#1D4ED8"/>
        <stop offset="100%" stop-color="#1E3A8A"/>
      </linearGradient>
      <linearGradient id="${prefix}-goa-soft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#93C5FD"/>
        <stop offset="100%" stop-color="#2563EB"/>
      </linearGradient>
      <linearGradient id="${prefix}-mct-grad" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stop-color="#34D399"/>
        <stop offset="55%" stop-color="#0F766E"/>
        <stop offset="100%" stop-color="#0B4F4A"/>
      </linearGradient>
      <linearGradient id="${prefix}-alo-grad" x1="15%" y1="10%" x2="85%" y2="90%">
        <stop offset="0%" stop-color="#F87171"/>
        <stop offset="55%" stop-color="#B91C1C"/>
        <stop offset="100%" stop-color="#7F1D1D"/>
      </linearGradient>
      <linearGradient id="${prefix}-meta-grad" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stop-color="#A78BFA"/>
        <stop offset="55%" stop-color="#6D28D9"/>
        <stop offset="100%" stop-color="#4C1D95"/>
      </linearGradient>
      <linearGradient id="${prefix}-terrain-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#DBEAFE"/>
        <stop offset="58%" stop-color="#EFE9DC"/>
        <stop offset="100%" stop-color="#D6CEBC"/>
      </linearGradient>
      <linearGradient id="${prefix}-sand-slope" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stop-color="#FEE2E2"/>
        <stop offset="55%" stop-color="#FCA5A5"/>
        <stop offset="100%" stop-color="#B91C1C" stop-opacity="0.72"/>
      </linearGradient>
      <radialGradient id="${prefix}-eye-glint" cx="32%" cy="28%" r="65%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="30%" stop-color="#DC2626"/>
        <stop offset="100%" stop-color="#1A1816"/>
      </radialGradient>
      <radialGradient id="${prefix}-attraction-rad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1D4ED8" stop-opacity="0.02"/>
        <stop offset="58%" stop-color="#1D4ED8" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.0"/>
      </radialGradient>
      <pattern id="${prefix}-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
        <line x1="0" y1="0" x2="0" y2="7" stroke="#1A1816" stroke-width="0.9" stroke-opacity="0.18"/>
      </pattern>
      <pattern id="${prefix}-repel-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-42)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#C2410C" stroke-width="1.2" stroke-opacity="0.34"/>
      </pattern>
      <pattern id="${prefix}-stipple" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="2.5" cy="3" r="0.9" fill="#1A1816" fill-opacity="0.20"/>
        <circle cx="9.5" cy="6" r="0.8" fill="#B91C1C" fill-opacity="0.28"/>
        <circle cx="5" cy="11" r="0.85" fill="#1A1816" fill-opacity="0.16"/>
      </pattern>
      <marker id="${prefix}-arrow-ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 1 1.5 L 8.5 5 L 1 8.5 L 3 5 Z" fill="#1A1816"/>
      </marker>
      <marker id="${prefix}-arrow-goa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 1 1.5 L 8.5 5 L 1 8.5 L 3 5 Z" fill="#1D4ED8"/>
      </marker>
      <marker id="${prefix}-arrow-repel" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 1 1.5 L 8.5 5 L 1 8.5 L 3 5 Z" fill="#C2410C"/>
      </marker>
      <marker id="${prefix}-arrow-alo" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 1 1.5 L 8.5 5 L 1 8.5 L 3 5 Z" fill="#B91C1C"/>
      </marker>
      <marker id="${prefix}-arrow-mct" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 1 1.5 L 8.5 5 L 1 8.5 L 3 5 Z" fill="#0F766E"/>
      </marker>
      <filter id="${prefix}-lift" x="-8%" y="-8%" width="118%" height="122%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#1A1816" flood-opacity="0.14"/>
      </filter>
    </defs>
  `;
}

// ============================================================================
// UNIFIED 1-COLOR CARD WARS BACK EMBLEM SVG
// ============================================================================
export function renderCardBackEmblem(container, { suit = 'concept', roman = 'I' } = {}) {
  if (!container) return;
  const miniGlyph = suit === 'mct' ? '■' : suit === 'goa' ? '◉' : suit === 'alo' ? '▼' : '◆';
  container.innerHTML = `
    <svg viewBox="0 0 140 140" class="w-[96px] h-[96px] block" aria-hidden="true">
      <rect x="6" y="6" width="128" height="128" rx="18" fill="#6F2010" stroke="#FDE047" stroke-width="3.5"/>
      <rect x="15" y="15" width="110" height="110" rx="12" fill="none" stroke="rgba(253,224,71,0.45)" stroke-width="1.6" stroke-dasharray="5 4"/>
      <polygon points="70,24 112,70 70,116 28,70" fill="#8C2D19" stroke="#FDE047" stroke-width="3" stroke-linejoin="round"/>
      <text x="70" y="75" text-anchor="middle" font-family="Fredoka, Trebuchet MS, sans-serif" font-size="26" font-weight="700" fill="#FFFDF7">${roman}</text>
      <text x="70" y="104" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="14" font-weight="700" fill="#FDE047">${miniGlyph}</text>
    </svg>
  `;
}

// ============================================================================
// CARD I HERO: Animated 3-Suit Geometric Theater (L4 >= 12, L6 patterns + labels)
// ============================================================================
export function renderCoverStoryStage(container, { focus = 'all', phaseT = 0.65 } = {}) {
  if (!container) return;
  const p = 'covst';
  const opMct = focus === 'all' || focus === 'mct' ? 1 : 0.22;
  const opGoa = focus === 'all' || focus === 'goa' ? 1 : 0.22;
  const opAlo = focus === 'all' || focus === 'alo' ? 1 : 0.22;

  const slideX = phaseT * 86;
  const mctBlocks = [
    { x: 42 + slideX, y: 82, w: 62, h: 25, label: 'T1' },
    { x: 42 + slideX, y: 116, w: 80, h: 25, label: 'T2' },
    { x: 42 + slideX, y: 150, w: 52, h: 25, label: 'T3' },
    { x: 110 + slideX * 0.7, y: 82, w: 48, h: 25, label: 'T4' }
  ].map((b) => `
    <rect x="${b.x.toFixed(1)}" y="${b.y}" width="${b.w}" height="${b.h}" rx="5" fill="url(#${p}-mct-grad)" stroke="#1A1816" stroke-width="1.8"/>
    <text x="${(b.x + b.w / 2).toFixed(1)}" y="${b.y + 17}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#FFFFFF">${b.label}</text>
  `).join('');

  const gcx = 478;
  const gcy = 132;
  const goaCircles = [0, 52, 104, 156, 208, 260, 312].map((deg, idx) => {
    const rad = ((deg + phaseT * 28) * Math.PI) / 180;
    const baseR = idx % 2 === 0 ? 28 + phaseT * 30 : 82 - phaseT * 24;
    const x = gcx + Math.cos(rad) * baseR;
    const y = gcy + Math.sin(rad) * baseR * 0.72;
    return `
      <line x1="${gcx}" y1="${gcy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#1D4ED8" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.5"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9.5" fill="url(#${p}-goa-grad)" stroke="#1A1816" stroke-width="1.7"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#FFFFFF"/>
    `;
  }).join('');

  const acx = 795;
  const shrink = 1 - phaseT * 0.62;
  const fl = acx - 94 * shrink;
  const fr = acx + 94 * shrink;
  const preyX = acx + 68 * shrink * Math.cos(phaseT * Math.PI * 3);
  const preyY = 76 + phaseT * 92;

  container.innerHTML = `
    <svg viewBox="0 0 960 248" class="w-full h-auto block" role="img" aria-label="Panggung animasi 3 simbol: Kotak MCT, Lingkaran GOA, dan Corong ALO">
      ${sharedDefs(p)}

      <g opacity="${opMct}" style="transition: opacity 220ms ease;">
        <rect x="14" y="14" width="288" height="220" rx="12" fill="#E6F6F3" stroke="#0F766E" stroke-width="${focus === 'mct' ? '3' : '1.6'}"/>
        <text x="28" y="38" font-family="JetBrains Mono, monospace" font-size="12.5" font-weight="700" fill="#0F766E">■ KOTAK: MCT (START RAPI)</text>
        <text x="28" y="58" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" fill="#4B4742">Heuristik 1 jalan ke mesin tercepat</text>
        <line x1="28" y1="94" x2="286" y2="94" stroke="#0F766E" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="4 3"/>
        <line x1="28" y1="128" x2="286" y2="128" stroke="#0F766E" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="4 3"/>
        <line x1="28" y1="162" x2="286" y2="162" stroke="#0F766E" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="4 3"/>
        ${mctBlocks}
        <text x="28" y="216" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#0F766E">Deterministik -> Seed Awal</text>
      </g>

      <path d="M 306 124 L 332 124" stroke="#1A1816" stroke-width="2.4" marker-end="url(#${p}-arrow-ink)"/>

      <g opacity="${opGoa}" style="transition: opacity 220ms ease;">
        <rect x="338" y="14" width="282" height="220" rx="12" fill="#EAF1FF" stroke="#1D4ED8" stroke-width="${focus === 'goa' ? '3' : '1.6'}"/>
        <text x="352" y="38" font-family="JetBrains Mono, monospace" font-size="12.5" font-weight="700" fill="#1D4ED8">◉ LINGKARAN: GOA (JELAJAH)</text>
        <text x="352" y="58" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" fill="#4B4742">Kawanan saling tarik &amp; tolak</text>
        <circle cx="${gcx}" cy="${gcy}" r="54" fill="url(#${p}-attraction-rad)" stroke="#1D4ED8" stroke-width="1.8" stroke-dasharray="5 3"/>
        ${goaCircles}
        <circle cx="${gcx}" cy="${gcy}" r="11" fill="#FDE047" stroke="#1A1816" stroke-width="2"/>
        <text x="352" y="216" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#1D4ED8">Eksplorasi luas seluruh peta</text>
      </g>

      <path d="M 624 124 L 650 124" stroke="#1A1816" stroke-width="2.4" marker-end="url(#${p}-arrow-ink)"/>

      <g opacity="${opAlo}" style="transition: opacity 220ms ease;">
        <rect x="656" y="14" width="290" height="220" rx="12" fill="#FEECEC" stroke="#B91C1C" stroke-width="${focus === 'alo' ? '3' : '1.6'}"/>
        <text x="670" y="38" font-family="JetBrains Mono, monospace" font-size="12.5" font-weight="700" fill="#B91C1C">▼ CORONG: ALO (PRESISI)</text>
        <text x="670" y="58" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" fill="#4B4742">Jebakan pasir menyempit ke Elite</text>
        <polygon points="${fl.toFixed(1)},78 ${fr.toFixed(1)},78 ${acx},188" fill="url(#${p}-sand-slope)" fill-opacity="0.52"/>
        <polygon points="${fl.toFixed(1)},78 ${fr.toFixed(1)},78 ${acx},188" fill="url(#${p}-hatch)"/>
        <line x1="${fl.toFixed(1)}" y1="78" x2="${acx}" y2="188" stroke="#B91C1C" stroke-width="2.2"/>
        <line x1="${fr.toFixed(1)}" y1="78" x2="${acx}" y2="188" stroke="#B91C1C" stroke-width="2.2"/>
        <circle cx="${preyX.toFixed(1)}" cy="${preyY.toFixed(1)}" r="7.5" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="2"/>
        <polygon points="${acx},174 ${acx + 12},186 ${acx},198 ${acx - 12},186" fill="#FDE047" stroke="#B91C1C" stroke-width="2.4"/>
        <text x="670" y="216" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#B91C1C">Eksploitasi tajam -> ◆ Elite</text>
      </g>
    </svg>
  `;
}

// ============================================================================
// CARD II: BEGINNER INTUITION + M0 CLICK-TO-DROP-BALL FITNESS EXPLORER
// ============================================================================
export function intuitionTerrainY(x) {
  const u = (x - 30) / 500;
  const base = 115 + 32 * Math.sin(u * Math.PI * 2.1);
  const localTrap = 68 * Math.exp(-Math.pow((x - 150) / 58, 2));
  const globalValley = 118 * Math.exp(-Math.pow((x - 378) / 68, 2));
  return Math.min(242, Math.max(46, base + localTrap + globalValley - 26));
}

export function renderIntuitionTerrain(container, { stage = 'random', phaseT = 0, userBallX = null, onDropBall = null } = {}) {
  if (!container) return;
  const p = 'int';
  const yCurve = intuitionTerrainY;

  const curvePts = [];
  for (let x = 30; x <= 530; x += 6) curvePts.push(`${x},${yCurve(x).toFixed(1)}`);
  const terrainPath = `M 30 262 L ${curvePts.join(' L ')} L 530 262 Z`;
  const ridgePath = `M ${curvePts.join(' L ')}`;

  const startXs = [72, 118, 162, 224, 290, 446, 492];
  let agentsSvg = '';
  let overlaysSvg = '';

  if (stage === 'random') {
    const targetXs = [95, 138, 152, 166, 260, 432, 478];
    startXs.forEach((sx, i) => {
      const x = sx + (targetXs[i] - sx) * phaseT;
      const y = yCurve(x) - 10;
      const trapped = Math.abs(x - 150) < 35;
      agentsSvg += `
        <line x1="${x.toFixed(1)}" y1="46" x2="${x.toFixed(1)}" y2="${(y - 7).toFixed(1)}" stroke="#4B4742" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="${trapped ? '#64748B' : '#1D4ED8'}" stroke="#1A1816" stroke-width="1.8"/>
      `;
    });
    overlaysSvg = `
      <rect x="86" y="34" width="130" height="26" rx="6" fill="#FEECEC" stroke="#B91C1C" stroke-width="1.8"/>
      <text x="151" y="51" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#B91C1C">LUBANG LOKAL</text>
      <line x1="150" y1="60" x2="150" y2="150" stroke="#B91C1C" stroke-width="1.5" stroke-dasharray="4 3"/>
    `;
  } else if (stage === 'explore') {
    const spreadXs = [68, 134, 212, 296, 366, 434, 496];
    startXs.forEach((_sx, i) => {
      const wave = Math.sin(phaseT * Math.PI * 2 + i * 0.9) * 26;
      const x = Math.min(510, Math.max(50, spreadXs[i] + wave));
      const y = yCurve(x) - 14;
      agentsSvg += `
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16" fill="#1D4ED8" fill-opacity="0.12" stroke="#1D4ED8" stroke-width="1.2" stroke-dasharray="3 2"/>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="url(#${p}-goa-grad)" stroke="#1A1816" stroke-width="1.7"/>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#FFFFFF"/>
      `;
    });
    overlaysSvg = `
      <path d="M 155 154 Q 266 36, 366 136" fill="none" stroke="#1D4ED8" stroke-width="2.6" stroke-dasharray="6 3" marker-end="url(#${p}-arrow-goa)"/>
      <rect x="186" y="28" width="166" height="26" rx="6" fill="#EAF1FF" stroke="#1D4ED8" stroke-width="1.8"/>
      <text x="269" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#1D4ED8">EKSPLORASI (LUAS)</text>
    `;
  } else {
    const funnelHalf = 115 - phaseT * 78;
    const fxL = 378 - funnelHalf;
    const fxR = 378 + funnelHalf;
    overlaysSvg = `
      <polygon points="${fxL.toFixed(1)},56 ${fxR.toFixed(1)},56 378,224" fill="url(#${p}-sand-slope)" fill-opacity="0.42"/>
      <polygon points="${fxL.toFixed(1)},56 ${fxR.toFixed(1)},56 378,224" fill="url(#${p}-hatch)"/>
      <line x1="${fxL.toFixed(1)}" y1="56" x2="378" y2="224" stroke="#B91C1C" stroke-width="2" stroke-dasharray="4 3"/>
      <line x1="${fxR.toFixed(1)}" y1="56" x2="378" y2="224" stroke="#B91C1C" stroke-width="2" stroke-dasharray="4 3"/>
      <rect x="292" y="28" width="174" height="26" rx="6" fill="#FEECEC" stroke="#B91C1C" stroke-width="1.8"/>
      <text x="379" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#B91C1C">EKSPLOITASI (FOKUS)</text>
    `;
    const offsets = [-96, -64, -34, -12, 18, 52, 86];
    offsets.forEach((off, i) => {
      const shrink = 1 - phaseT * 0.84;
      const x = 378 + off * shrink;
      const y = yCurve(x) - 9;
      agentsSvg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.5" fill="${i === 3 ? '#FDE047' : '#1D4ED8'}" stroke="#1A1816" stroke-width="1.8"/>`;
    });
  }

  // M0 Interactive Dropped Test Ball!
  let userBallSvg = '';
  if (typeof userBallX === 'number' && Number.isFinite(userBallX)) {
    const bx = Math.max(36, Math.min(524, userBallX));
    const by = yCurve(bx) - 10;
    const fitness = ((245 - yCurve(bx)) / 10).toFixed(2); // lower valley = smaller fitness!
    userBallSvg = `
      <line x1="${bx.toFixed(1)}" y1="22" x2="${bx.toFixed(1)}" y2="${(by - 10).toFixed(1)}" stroke="#0F766E" stroke-width="1.8" stroke-dasharray="3 2"/>
      <circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="10" fill="#FDE047" stroke="#1A1816" stroke-width="2.4"/>
      <rect x="${Math.max(26, Math.min(395, bx - 68)).toFixed(1)}" y="18" width="136" height="24" rx="6" fill="#1A1816"/>
      <text x="${Math.max(94, Math.min(463, bx)).toFixed(1)}" y="34" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#FDE047">f(x) = ${fitness}</text>
    `;
  }

  const gy = yCurve(378);

  container.innerHTML = `
    <svg viewBox="0 0 560 284" class="w-full h-auto block cursor-crosshair" id="intuition-click-svg" role="img" aria-label="Lanskap optimasi interaktif: klik di mana saja untuk menjatuhkan bola uji fitness">
      ${sharedDefs(p)}
      <defs><clipPath id="${p}-terrain-clip"><path d="${terrainPath}"/></clipPath></defs>

      <rect x="20" y="14" width="520" height="252" rx="8" fill="#FFFFFF" stroke="#1A1816" stroke-width="1.6"/>
      <path d="${terrainPath}" fill="url(#${p}-terrain-grad)"/>
      <g clip-path="url(#${p}-terrain-clip)"><rect x="20" y="40" width="520" height="225" fill="url(#${p}-hatch)"/></g>
      <path d="${ridgePath}" fill="none" stroke="#1A1816" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>

      <polygon points="378,${(gy - 11).toFixed(1)} 389,${gy.toFixed(1)} 378,${(gy + 11).toFixed(1)} 367,${gy.toFixed(1)}"
               fill="#FDE047" stroke="#B91C1C" stroke-width="2.4"/>

      ${overlaysSvg}
      ${agentsSvg}
      ${userBallSvg}

      <g font-family="JetBrains Mono, monospace" font-size="12">
        <text x="150" y="256" text-anchor="middle" font-weight="700" fill="#4B4742">Optimum Lokal</text>
        <text x="378" y="256" text-anchor="middle" font-weight="700" fill="#B91C1C">◆ Optimum Global</text>
      </g>
    </svg>
  `;

  if (onDropBall) {
    const svgEl = container.querySelector('#intuition-click-svg');
    svgEl?.addEventListener('click', (e) => {
      const rect = svgEl.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 560;
      onDropBall(Math.max(36, Math.min(524, svgX)));
    });
  }
}

// ============================================================================
// CARD IV MANDATORY VERIFIED M3-M4 WALKTHROUGH (4 Tugas, 2 VM -> MS = 3.5 detik!)
// ============================================================================
export function renderMctWalkthrough(container, { stepCount = 4 } = {}) {
  if (!container) return;
  const p = 'mctw';
  const shown = Math.max(0, Math.min(4, stepCount));
  const steps = MCT_WALKTHROUGH_EXAMPLE.steps.slice(0, shown);

  // Track cumulative VM1 & VM2 bars up to shown step
  const maxT = 10; // scale includes bad schedule comparison = 10s
  const gx = 90;
  const gw = 430;
  const px = (sec) => gx + (sec / maxT) * gw;

  let load1 = 0;
  let load2 = 0;
  let barsSvg = '';
  steps.forEach((s, idx) => {
    const isVm1 = s.chosenVm === 0;
    const dur = isVm1 ? s.ect1 : s.ect2;
    const start = isVm1 ? load1 : load2;
    const y = isVm1 ? 56 : 104;
    if (isVm1) load1 += dur; else load2 += dur;
    const isLatest = idx === shown - 1;
    barsSvg += `
      <rect x="${px(start).toFixed(1)}" y="${y}" width="${((dur / maxT) * gw - 2).toFixed(1)}" height="32" rx="5"
            fill="${isLatest ? '#FDE047' : 'url(#' + p + '-mct-grad)'}" stroke="#1A1816" stroke-width="${isLatest ? '2.4' : '1.6'}"/>
      <text x="${(px(start) + ((dur / maxT) * gw) / 2).toFixed(1)}" y="${y + 20}" text-anchor="middle"
            font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="${isLatest ? '#1A1816' : '#FFFFFF'}">T${idx + 1}(${dur}s)</text>
    `;
  });

  const curMs = Math.max(load1, load2);
  const msX = px(curMs);

  container.innerHTML = `
    <svg viewBox="0 0 560 176" class="w-full h-auto block" role="img" aria-label="Contoh hitung terverifikasi MCT: 4 tugas 2 VM menghasilkan makespan 3,5 detik vs jadwal buruk 10 detik">
      ${sharedDefs(p)}
      <rect x="8" y="8" width="544" height="160" rx="8" fill="#FFFFFF" stroke="#1A1816" stroke-width="1.6"/>
      <text x="20" y="30" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#0F766E">■ CONTOH HITUNG M3-M4 (T1..T4 = 4000, 2000, 3000, 1000 MI)</text>

      <!-- VM1 & VM2 Rows -->
      <rect x="20" y="56" width="64" height="32" rx="5" fill="#F6EFE0" stroke="#1A1816" stroke-width="1.5"/>
      <text x="52" y="76" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#1A1816">VM1</text>
      <line x1="${gx}" y1="72" x2="${gx + gw}" y2="72" stroke="rgba(26,24,22,0.16)" stroke-dasharray="4 3"/>

      <rect x="20" y="104" width="64" height="32" rx="5" fill="#F6EFE0" stroke="#1A1816" stroke-width="1.5"/>
      <text x="52" y="124" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#1A1816">VM2</text>
      <line x1="${gx}" y1="120" x2="${gx + gw}" y2="120" stroke="rgba(26,24,22,0.16)" stroke-dasharray="4 3"/>

      <!-- Bad Schedule Reference Marker (10.0s) -->
      <line x1="${px(10).toFixed(1)}" y1="46" x2="${px(10).toFixed(1)}" y2="144" stroke="#64748B" stroke-width="1.6" stroke-dasharray="4 3"/>
      <text x="${px(10) - 4}" y="158" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="12" fill="#4B4742">Jadwal Buruk: 10,0 dtk</text>

      ${barsSvg}

      ${shown > 0 ? `
        <line x1="${msX.toFixed(1)}" y1="46" x2="${msX.toFixed(1)}" y2="144" stroke="#B91C1C" stroke-width="2.4" stroke-dasharray="5 3"/>
        <text x="${(msX + 6).toFixed(1)}" y="158" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#B91C1C">MS MCT = ${curMs.toFixed(1)} dtk</text>
      ` : `<text x="295" y="100" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" fill="#4B4742">Klik "Langkah MCT +1" untuk memasukkan T1..T4</text>`}
    </svg>
  `;
}

// ============================================================================
// ASSET 1: Spesimen Belalang GOA
// ============================================================================
export function renderGrasshopperSpecimen(container, { prefix = 'gh', legAngle = 0, showAnnotations = true } = {}) {
  if (!container) return;
  container.innerHTML = `
    <svg viewBox="0 0 540 264" class="w-full h-auto block" role="img" aria-label="Ilustrasi spesimen geometris belalang GOA">
      ${sharedDefs(prefix)}
      <defs>
        <linearGradient id="${prefix}-wing-fade-grad" x1="0%" y1="0%" x2="100%" y2="25%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
          <stop offset="72%" stop-color="#CBD5E1" stop-opacity="0.58"/>
          <stop offset="100%" stop-color="#1E293B" stop-opacity="0.12"/>
        </linearGradient>
        <mask id="${prefix}-wing-fade"><rect x="0" y="0" width="540" height="264" fill="url(#${prefix}-wing-fade-grad)"/></mask>
        <clipPath id="${prefix}-wing-clip"><path d="M 205 114 C 282 74, 396 68, 472 100 C 446 128, 355 146, 224 144 Z"/></clipPath>
        <clipPath id="${prefix}-thorax-clip"><path d="M 142 122 C 154 92, 205 86, 232 110 C 242 126, 228 154, 198 160 C 166 164, 138 148, 142 122 Z"/></clipPath>
      </defs>
      <g filter="url(#${prefix}-lift)">
        <g stroke="#1A1816" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <path d="M 164 152 L 146 192 L 126 219 L 114 221"/>
          <path d="M 206 156 L 218 194 L 236 220 L 248 222"/>
        </g>
        <path d="M 222 128 C 282 124, 366 138, 434 162 C 414 180, 344 186, 236 168 Z" fill="url(#${prefix}-goa-soft)" stroke="#1A1816" stroke-width="2" stroke-linejoin="round"/>
        <path d="M 222 128 C 282 124, 366 138, 434 162 C 414 180, 344 186, 236 168 Z" fill="url(#${prefix}-hatch)"/>
        <g mask="url(#${prefix}-wing-fade)">
          <path d="M 205 114 C 282 74, 396 68, 472 100 C 446 128, 355 146, 224 144 Z" fill="url(#${prefix}-goa-soft)" fill-opacity="0.52" stroke="#1A1816" stroke-width="1.6"/>
          <g clip-path="url(#${prefix}-wing-clip)" stroke="#1A1816" stroke-width="0.7" fill="none" opacity="0.55">
            <path d="M 208 118 C 280 92, 372 86, 464 102"/>
            <path d="M 212 128 C 292 108, 380 108, 452 114"/>
          </g>
        </g>
        <path d="M 142 122 C 154 92, 205 86, 232 110 C 242 126, 228 154, 198 160 C 166 164, 138 148, 142 122 Z" fill="url(#${prefix}-goa-grad)" stroke="#1A1816" stroke-width="2"/>
        <g clip-path="url(#${prefix}-thorax-clip)"><rect x="138" y="88" width="106" height="78" fill="url(#${prefix}-hatch)"/></g>
        <path d="M 148 114 C 122 100, 96 112, 92 140 C 90 160, 108 174, 130 170 C 146 166, 154 148, 152 128 Z" fill="url(#${prefix}-goa-grad)" stroke="#1A1816" stroke-width="2"/>
        <ellipse cx="116" cy="130" rx="11" ry="15" transform="rotate(-14 116 130)" fill="url(#${prefix}-eye-glint)" stroke="#1A1816" stroke-width="1.5"/>
        <circle cx="112" cy="123" r="2.8" fill="#FFFFFF"/>
        <path d="M 103 112 C 84 78, 54 60, 24 54" fill="none" stroke="#1A1816" stroke-width="1.8" stroke-linecap="round"/>
        <g id="${prefix}-hind-leg" transform="rotate(${legAngle} 248 154)" style="transition: transform 280ms ease;">
          <path d="M 232 158 C 254 110, 306 68, 344 64 C 350 72, 336 102, 294 144 C 268 168, 244 172, 232 158 Z" fill="#EA580C" stroke="#1A1816" stroke-width="2"/>
          <path d="M 342 68 L 386 192 L 418 218 L 434 220" fill="none" stroke="#1A1816" stroke-width="2.4" stroke-linecap="round"/>
          <circle cx="343" cy="68" r="4.5" fill="#FDE047" stroke="#1A1816" stroke-width="1.6"/>
        </g>
      </g>
      ${showAnnotations ? `<text x="28" y="246" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#1D4ED8">◉ AGEN BELALANG GOA (LOMPATAN GAYA SOSIAL)</text>` : ''}
    </svg>
  `;
}

// ============================================================================
// ASSET 2: Penampang Corong Pasir ALO (L4 >= 12, L6 hatched funnel + label)
// ============================================================================
export function renderAntlionPitCutaway(container, { progress = 0.35, w = 2, I = 35 } = {}) {
  if (!container) return;
  const p = 'alo';
  const shrink = Math.max(0.14, 1 - progress * 0.82);
  const cx = 260;
  const leftBound = cx - 155 * shrink;
  const rightBound = cx + 155 * shrink;
  const preyX = cx + 128 * shrink * Math.cos(progress * Math.PI * 3.6);
  const preyY = 76 + (1 - shrink) * 112;

  const pts = [];
  for (let k = 0; k <= 10; k++) {
    const frac = k / 10;
    const x = (cx + 152) - frac * (cx + 152 - preyX) + Math.sin(k * 2.1) * (10 * (1 - frac * 0.6));
    const y = 68 + frac * (preyY - 68) + Math.cos(k * 2.6) * 5;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  container.innerHTML = `
    <svg viewBox="0 0 520 294" class="w-full h-auto block" role="img" aria-label="Penampang corong pasir ALO dengan mangsa tergelincir ke Elite">
      ${sharedDefs(p)}
      <defs>
        <clipPath id="${p}-soil-cross"><path d="M 32 74 L 100 74 L 260 208 L 420 74 L 488 74 L 488 264 L 32 264 Z"/></clipPath>
        <linearGradient id="${p}-pit-depth-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.92"/>
          <stop offset="100%" stop-color="#1E293B" stop-opacity="0.35"/>
        </linearGradient>
        <mask id="${p}-pit-depth-mask"><rect x="0" y="0" width="520" height="294" fill="url(#${p}-pit-depth-grad)"/></mask>
        <mask id="${p}-larva-mask"><rect x="215" y="192" width="90" height="62" fill="#FFFFFF"/></mask>
      </defs>

      <rect x="26" y="20" width="468" height="248" rx="8" fill="#FFFFFF" stroke="#1A1816" stroke-width="1.6"/>
      <rect x="${leftBound.toFixed(1)}" y="44" width="${(rightBound - leftBound).toFixed(1)}" height="168" fill="#B91C1C" fill-opacity="0.09"/>
      <line x1="${leftBound.toFixed(1)}" y1="44" x2="${leftBound.toFixed(1)}" y2="212" stroke="#B91C1C" stroke-width="1.8" stroke-dasharray="5 3"/>
      <line x1="${rightBound.toFixed(1)}" y1="44" x2="${rightBound.toFixed(1)}" y2="212" stroke="#B91C1C" stroke-width="1.8" stroke-dasharray="5 3"/>

      <polygon points="100,74 260,208 420,74" fill="url(#${p}-sand-slope)" mask="url(#${p}-pit-depth-mask)"/>
      <polygon points="100,74 260,208 420,74" fill="url(#${p}-hatch)"/>
      <polygon points="100,74 260,208 420,74" fill="url(#${p}-stipple)"/>

      <g clip-path="url(#${p}-soil-cross)">
        <rect x="32" y="74" width="456" height="190" fill="#F6EFE0"/>
        <rect x="32" y="150" width="456" height="114" fill="#E6DBC5"/>
        <rect x="32" y="74" width="456" height="190" fill="url(#${p}-hatch)"/>
      </g>

      <path d="M 32 74 L 100 74 L 260 208 L 420 74 L 488 74" fill="none" stroke="#1A1816" stroke-width="2.2"/>

      <g mask="url(#${p}-larva-mask)">
        <ellipse cx="260" cy="228" rx="22" ry="15" fill="url(#${p}-alo-grad)" stroke="#1A1816" stroke-width="1.8"/>
      </g>
      <polygon points="260,196 270,206 260,216 250,206" fill="#FDE047" stroke="#B91C1C" stroke-width="2"/>

      <polyline points="${pts.join(' ')}" fill="none" stroke="#1D4ED8" stroke-width="2.2" stroke-linecap="round" marker-end="url(#${p}-arrow-goa)"/>
      <circle cx="${preyX.toFixed(1)}" cy="${preyY.toFixed(1)}" r="7" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="2"/>

      <line x1="100" y1="54" x2="${leftBound.toFixed(1)}" y2="54" stroke="#B91C1C" stroke-width="1.8" marker-end="url(#${p}-arrow-alo)"/>
      <line x1="420" y1="54" x2="${rightBound.toFixed(1)}" y2="54" stroke="#B91C1C" stroke-width="1.8" marker-end="url(#${p}-arrow-alo)"/>

      <g font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">
        <text x="${Math.max(40, leftBound - 28).toFixed(1)}" y="38" fill="#B91C1C">c/I</text>
        <text x="${Math.min(444, rightBound - 14).toFixed(1)}" y="38" fill="#B91C1C">d/I</text>
        <text x="38" y="256" fill="#1A1816">▼ ALO (t/T=${(progress * 100).toFixed(0)}%, w=${w}, I=${I >= 1000 ? I.toExponential(1) : I.toFixed(1)})</text>
        <text x="292" y="226" fill="#B91C1C">◆ ELITE</text>
      </g>
    </svg>
  `;
}

// ============================================================================
// ASSET 3: Medan Gaya Sosial GOA (L5: Orange dashed Repel vs Blue solid Attract!)
// ============================================================================
export function renderSocialForceField(container, { f = 0.5, l = 1.5, animPhase = 0 } = {}) {
  if (!container) return;
  const p = 'sff';
  const r0 = comfortZoneRadius(f, l);
  const cx = 175;
  const cy = 136;
  const scale = 28;
  const rComfortPx = r0 ? Math.min(102, Math.max(24, r0 * scale)) : 56;
  const rAttractPx = 110;

  let vectorsSvg = '';
  let swarmCircles = '';
  [0, 45, 90, 135, 180, 225, 270, 315].forEach((deg, idx) => {
    const rad = (deg * Math.PI) / 180;
    const isInner = idx % 2 === 0;
    const rBase = isInner ? Math.max(0.55, (r0 || 2.08) * 0.50) : Math.min(3.65, (r0 || 2.08) + 0.95);
    const val = socialForce(rBase, f, l);
    const targetR = r0 || 2.08;
    const rCurrent = rBase + (targetR - rBase) * animPhase;
    const curPx = Math.min(106, Math.max(18, rCurrent * scale));
    const len = Math.min(26, Math.max(9, Math.abs(val) * 58)) * (1 - animPhase * 0.65);
    const dir = val < 0 ? 1 : -1;
    const x1 = cx + Math.cos(rad) * curPx;
    const y1 = cy + Math.sin(rad) * curPx;
    const x2 = cx + Math.cos(rad) * (curPx + dir * len);
    const y2 = cy + Math.sin(rad) * (curPx + dir * len);
    // L5: Orange dashed for Repulsion vs Blue solid for Attraction (NOT ALO crimson!)
    const stroke = val < 0 ? '#C2410C' : '#1D4ED8';
    const dash = val < 0 ? 'stroke-dasharray="4 2.5"' : '';
    const marker = val < 0 ? `url(#${p}-arrow-repel)` : `url(#${p}-arrow-goa)`;

    vectorsSvg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${stroke}" stroke-width="2" ${dash} stroke-linecap="round" marker-end="${marker}"/>`;
    swarmCircles += `<circle cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" r="5.5" fill="${val < 0 ? '#EA580C' : '#1D4ED8'}" stroke="#1A1816" stroke-width="1.4"/><circle cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" r="1.8" fill="#FFFFFF"/>`;
  });

  container.innerHTML = `
    <svg viewBox="0 0 350 282" class="w-full h-auto block" role="img" aria-label="Medan gaya sosial GOA: tolak oranye putus-putus dan tarik biru solid">
      ${sharedDefs(p)}
      <defs>
        <radialGradient id="${p}-ring-mask-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#000000"/>
        </radialGradient>
        <mask id="${p}-outer-fade"><circle cx="${cx}" cy="${cy}" r="${rAttractPx}" fill="url(#${p}-ring-mask-grad)"/></mask>
      </defs>

      <circle cx="${cx}" cy="${cy}" r="${rAttractPx}" fill="url(#${p}-attraction-rad)" mask="url(#${p}-outer-fade)"/>
      <circle cx="${cx}" cy="${cy}" r="${rAttractPx}" fill="none" stroke="#1D4ED8" stroke-width="1.2" stroke-dasharray="4 3"/>
      <circle cx="${cx}" cy="${cy}" r="${rComfortPx.toFixed(1)}" fill="url(#${p}-repel-hatch)"/>
      <circle cx="${cx}" cy="${cy}" r="${rComfortPx.toFixed(1)}" fill="none" stroke="#1A1816" stroke-width="2"/>

      ${vectorsSvg}
      ${swarmCircles}

      <circle cx="${cx}" cy="${cy}" r="9.5" fill="url(#${p}-goa-grad)" stroke="#1A1816" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="3" fill="#FFFFFF"/>

      <g font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">
        <text x="12" y="270" fill="#C2410C">⇢ Tolak</text>
        <text x="175" y="270" text-anchor="middle" fill="#1A1816">r0=${r0 ? r0.toFixed(2) : 'N/A'}</text>
        <text x="338" y="270" text-anchor="end" fill="#1D4ED8">→ Tarik</text>
      </g>
    </svg>
  `;
}

// ============================================================================
// ASSET 4: Pipa Seeding MCT ke GOA (L4 >= 12, L6 Purple Hexagon GOA loop)
// ============================================================================
export function renderMctSeedingPipeline(container, { tasks, vmSpeeds, mctResult, mctGoa, visibleSteps = null } = {}) {
  if (!container || !mctResult) return;
  const p = 'mct';
  const M = tasks.length;
  const K = vmSpeeds.length;
  const shown = visibleSteps === null ? M : Math.max(0, Math.min(M, visibleSteps));
  const maxTime = Math.max(1, mctResult.makespan);

  const taskSpacing = Math.min(20, 166 / Math.max(1, M));
  const taskStartY = 52 + (166 - (M - 1) * taskSpacing) / 2;
  const vmSpacing = Math.min(34, 154 / Math.max(1, K));
  const vmStartY = 56 + (154 - (K - 1) * vmSpacing) / 2;

  let splines = '';
  let taskNodes = '';
  mctResult.schedule.forEach((item, idx) => {
    const ty = taskStartY + item.taskIdx * taskSpacing;
    const vy = vmStartY + item.vmIdx * vmSpacing;
    const isPlaced = idx < shown;
    const isLatest = idx === shown - 1 && shown < M;
    const sw = isLatest ? 2.8 : Math.min(2.4, Math.max(1.0, (item.duration / maxTime) * 4.2));
    if (isPlaced) {
      splines += `<path d="M 52 ${ty.toFixed(1)} C 96 ${ty.toFixed(1)}, 102 ${vy.toFixed(1)}, 134 ${vy.toFixed(1)}" fill="none" stroke="${isLatest ? '#C2410C' : '#0F766E'}" stroke-opacity="${isLatest ? '0.95' : '0.52'}" stroke-width="${sw.toFixed(2)}"/>`;
    }
    taskNodes += `<rect x="40" y="${(ty - 4.5).toFixed(1)}" width="10" height="10" rx="2" fill="${isLatest ? '#FDE047' : isPlaced ? '#0F766E' : '#CBD5E1'}" stroke="#1A1816" stroke-width="1.2"/>`;
  });

  const ganttX = 166;
  const ganttW = 258;
  const barH = Math.min(24, Math.max(14, vmSpacing - 8));
  let vmLabels = '';
  let ganttBars = '';

  for (let j = 0; j < K; j++) {
    const vy = vmStartY + j * vmSpacing;
    vmLabels += `
      <rect x="134" y="${(vy - barH / 2).toFixed(1)}" width="28" height="${barH.toFixed(1)}" rx="4" fill="#F6EFE0" stroke="#1A1816" stroke-width="1.3"/>
      <text x="148" y="${(vy + 4).toFixed(1)}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#1A1816">V${j + 1}</text>
      <line x1="${ganttX}" y1="${vy.toFixed(1)}" x2="${ganttX + ganttW}" y2="${vy.toFixed(1)}" stroke="rgba(26,24,22,0.12)" stroke-dasharray="3 2"/>
    `;
  }

  let currentMakespan = 0;
  mctResult.schedule.slice(0, shown).forEach((item, idx) => {
    if (item.end > currentMakespan) currentMakespan = item.end;
    const vy = vmStartY + item.vmIdx * vmSpacing;
    const bx = ganttX + (item.start / maxTime) * ganttW;
    const bw = Math.max(6, (item.duration / maxTime) * ganttW - 1.5);
    const isLatest = idx === shown - 1 && shown < M;
    const fill = isLatest ? '#FDE047' : item.taskIdx % 2 === 0 ? `url(#${p}-mct-grad)` : '#99F6E4';
    const textFill = isLatest || item.taskIdx % 2 !== 0 ? '#1A1816' : '#FFFFFF';
    ganttBars += `
      <g>
        <title>Tugas T${item.taskIdx + 1} (W=${item.weight}) -> VM V${item.vmIdx + 1}: ${item.start.toFixed(1)}s - ${item.end.toFixed(1)}s</title>
        <rect x="${bx.toFixed(1)}" y="${(vy - barH / 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${barH.toFixed(1)}" rx="3" fill="${fill}" stroke="#1A1816" stroke-width="${isLatest ? '2' : '1.2'}"/>
        ${bw > 26 ? `<text x="${(bx + bw / 2).toFixed(1)}" y="${(vy + 4).toFixed(1)}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11.5" font-weight="700" fill="${textFill}">T${item.taskIdx + 1}</text>` : ''}
      </g>
    `;
  });

  const boxX = 468;
  const boxY = 48;
  const boxW = 148;
  const boxH = 166;
  const initFits = mctGoa ? mctGoa.initialFitness : [];
  const pSeed = mctGoa ? mctGoa.pSeed : 1;
  const injectedReady = shown >= M;
  let swarmDots = '';

  initFits.forEach((_fit, idx) => {
    const isSeed = idx < pSeed;
    const angle = idx * 2.39996;
    const rad = isSeed ? 8 + (idx / Math.max(1, pSeed)) * 22 : 30 + ((idx * 17) % 42);
    const px = boxX + (isSeed ? 46 : 78) + Math.cos(angle) * rad * 0.85;
    const py = boxY + (isSeed ? 56 : 94) + Math.sin(angle) * rad * 0.72;
    const cx = Math.min(boxX + boxW - 10, Math.max(boxX + 10, px));
    const cy = Math.min(boxY + boxH - 12, Math.max(boxY + 12, py));
    if (idx === 0 && isSeed && injectedReady) {
      swarmDots += `<rect x="${(cx - 6).toFixed(1)}" y="${(cy - 6).toFixed(1)}" width="12" height="12" rx="2.5" fill="#FDE047" stroke="#0F766E" stroke-width="2"/>`;
    } else if (isSeed && injectedReady) {
      swarmDots += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4.2" fill="#1D4ED8" stroke="#1A1816" stroke-width="1.1"/>`;
    } else {
      swarmDots += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3.4" fill="#64748B" fill-opacity="0.78"/>`;
    }
  });

  const msLineX = ganttX + (currentMakespan / maxTime) * ganttW;

  container.innerHTML = `
    <svg viewBox="0 0 630 248" class="w-full h-auto block" role="img" aria-label="Pipa seeding MCT ke populasi GOA [Usulan]">
      ${sharedDefs(p)}

      <g font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#1A1816">
        <text x="12" y="24">1. TUGAS (${shown}/${M})</text>
        <text x="166" y="24">2. ■ MCT (K=${K} VM)</text>
        <text x="468" y="24" fill="#6D28D9">3. ⬡ GOA (p=${pSeed})</text>
      </g>

      ${splines}
      ${taskNodes}

      <rect x="${ganttX}" y="38" width="${ganttW}" height="176" rx="6" fill="#FFFFFF" stroke="#1A1816" stroke-width="1.5"/>
      ${vmLabels}
      ${ganttBars}
      ${shown > 0 ? `
        <line x1="${msLineX.toFixed(1)}" y1="34" x2="${msLineX.toFixed(1)}" y2="218" stroke="#B91C1C" stroke-width="2" stroke-dasharray="5 3"/>
        <text x="${ganttX + ganttW}" y="236" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#B91C1C">MS: ${currentMakespan.toFixed(1)}s [Simulasi]</text>
      ` : ''}

      <path d="M 430 126 L 462 126" stroke="${injectedReady ? '#0F766E' : '#94A3B8'}" stroke-width="2.6" marker-end="url(#${p}-arrow-mct)"/>

      <rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="8" fill="#FFFFFF" stroke="#6D28D9" stroke-width="2.2"/>
      <rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" fill="url(#${p}-hatch)" opacity="0.4"/>
      ${swarmDots}
      <text x="${boxX + boxW / 2}" y="236" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#4B4742">■Seed  ◉GOA  ●Acak</text>
    </svg>
  `;
}

// ============================================================================
// ASSET 5: Skema Perbandingan Pola B (Estafet) vs Pola C (Kerja Tim)
// Uses PRD Section 5 Purple Hexagons for Metaheuristics & Green Square for MCT!
// ============================================================================
export function renderHybridTaxonomy(container, { activePhase = 'all' } = {}) {
  if (!container) return;
  const p = 'tax';
  const opInit = activePhase === 'all' || activePhase === 'init' ? 1 : 0.22;
  const opExp = activePhase === 'all' || activePhase === 'explore' ? 1 : 0.22;
  const opExplt = activePhase === 'all' || activePhase === 'exploit' ? 1 : 0.22;

  container.innerHTML = `
    <svg viewBox="0 0 880 252" class="w-full h-auto block" role="img" aria-label="Skema kosakata bentuk: Pola B Estafet dan Pola C Kerja Tim">
      ${sharedDefs(p)}

      <line x1="436" y1="14" x2="436" y2="238" stroke="#1A1816" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.35"/>

      <!-- POLA B: Green Square (MCT) -> Purple Hexagon (GOA) -->
      <g>
        <text x="18" y="28" font-family="JetBrains Mono, monospace" font-size="12.5" font-weight="700" fill="#0F766E">POLA B: ESTAFET (HEURISTIK -> METAHEURISTIK)</text>
        <g opacity="${opInit}" style="transition: opacity 220ms ease;">
          <rect x="22" y="72" width="142" height="108" rx="10" fill="url(#${p}-mct-grad)" stroke="#1A1816" stroke-width="2.2"/>
          <rect x="22" y="72" width="142" height="108" rx="10" fill="url(#${p}-hatch)"/>
          <text x="93" y="114" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="17" font-weight="700" fill="#FFFFFF">■ MCT</text>
          <text x="93" y="138" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="#E6F6F3">1x Start Rapi</text>
          <text x="93" y="160" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#FDE047">[Usulan]</text>
        </g>

        <g opacity="${Math.max(opInit, opExp)}">
          <path d="M 170 126 L 236 126" stroke="#1A1816" stroke-width="2.8" marker-end="url(#${p}-arrow-ink)"/>
          <text x="202" y="114" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#0F766E">Seed</text>
        </g>

        <g opacity="${Math.max(opExp, opExplt)}" style="transition: opacity 220ms ease;">
          <polygon points="274,72 374,72 414,126 374,180 274,180 242,126" fill="url(#${p}-meta-grad)" stroke="#1A1816" stroke-width="2.2"/>
          <text x="326" y="118" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="17" font-weight="700" fill="#FFFFFF">⬡ GOA</text>
          <text x="326" y="142" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="#EDE9FE">Poles Populasi</text>
        </g>
        <text x="22" y="226" font-family="JetBrains Mono, monospace" font-size="12" fill="#4B4742">■ Heuristik 1x di awal -> ⬡ Metaheuristik lanjutkan</text>
      </g>

      <!-- POLA C: Purple Hexagon GOA + Purple Hexagon ALO Merging -> Elite -->
      <g>
        <text x="458" y="28" font-family="JetBrains Mono, monospace" font-size="12.5" font-weight="700" fill="#B91C1C">POLA C: KERJA TIM (METAHEURISTIK + METAHEURISTIK)</text>

        <g opacity="${opExp}" style="transition: opacity 220ms ease;">
          <polygon points="486,70 572,70 606,126 572,182 486,182 456,126" fill="#EAF1FF" stroke="#1D4ED8" stroke-width="2.6"/>
          <text x="530" y="118" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="16" font-weight="700" fill="#1D4ED8">⬡ GOA</text>
          <text x="530" y="140" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="#1A1816">Eksplorasi</text>
        </g>

        <g opacity="${opExplt}" style="transition: opacity 220ms ease;">
          <polygon points="622,70 708,70 742,126 708,182 622,182 592,126" fill="#FEECEC" stroke="#B91C1C" stroke-width="2.6"/>
          <text x="668" y="118" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="16" font-weight="700" fill="#B91C1C">⬡ ALO</text>
          <text x="668" y="140" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="#1A1816">Eksploitasi</text>
        </g>

        <g opacity="${Math.max(opInit, Math.max(opExp, opExplt))}">
          <polygon points="598,104 624,126 598,148 572,126" fill="#FDE047" stroke="#1A1816" stroke-width="2"/>
          <text x="598" y="130" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#1A1816">3x</text>

          <path d="M 746 126 L 788 126" stroke="#1A1816" stroke-width="2.4" marker-end="url(#${p}-arrow-ink)"/>
          <polygon points="824,98 854,126 824,154 794,126" fill="#FDE047" stroke="#B91C1C" stroke-width="2.6"/>
          <text x="824" y="130" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#1A1816">ELITE</text>
        </g>
        <text x="458" y="226" font-family="JetBrains Mono, monospace" font-size="12" fill="#4B4742">⬡ GOA + ⬡ ALO bertukar kandidat tiap iterasi [Paper]</text>
      </g>
    </svg>
  `;
}

// ============================================================================
// CARD VI INTERACTIVE FLOWCHART (PRD M8 Ordered Components + Standard Shapes)
// ============================================================================
export const FLOWCHART_NODES = [
  {
    id: 'init',
    step: '01',
    title: 'Random Walk & Batas [Eq. 1-3]',
    plain: 'Semut/belalang berjalan acak lalu dinormalisasi agar tidak keluar batas peta [lb, ub]. Analogi: melangkah di dalam pagar kebun.',
    eq: 'Eq. (1)-(3): Normalisasi jalan acak ke rentang [c_i, d_i]',
    why: 'Menjaga semua solusi kandidat tetap valid di dalam ruang pencarian.'
  },
  {
    id: 'walk',
    step: '02',
    title: 'Jebakan Antlion [Eq. 4-5]',
    plain: 'Batas jalan acak digeser mengelilingi antlion terpilih (Roulette Wheel) dan antlion Elite. Analogi: berjalan di lereng corong pasir.',
    eq: 'Eq. (4)-(5): c^t = Antlion_j + c^t ;  d^t = Antlion_j + d^t',
    why: 'Mengarahkan pencarian ke wilayah yang sudah terbukti menjanjikan.'
  },
  {
    id: 'social',
    step: '03',
    title: 'Gaya Sosial GOA [Eq. 6-7]',
    plain: 'Agen yang terlalu dekat saling tolak (oranye putus), yang jauh saling tarik (biru solid) agar kawanan tidak menumpuk di satu lubang.',
    eq: 'Eq. (6)-(7): s(r) = f*exp(-r/l) - exp(-r),  f = 0.5, l = 1.5',
    why: 'Mencegah kelemahan utama ALO yaitu hilangnya keragaman populasi.'
  },
  {
    id: 'modc',
    step: '04',
    title: 'Modifikasi c di L/2 & Tangga w [Eq. 9-12]',
    plain: 'Iterasi dibagi dua: paruh 1 (l <= L/2) turun linear untuk cari luas; paruh 2 (l > L/2) mengecil tajam + tangga w (I = 10^w * t/T) mempersempit corong.',
    eq: 'Eq. (9)-(10) pivot c di L/2  |  Eq. (11)-(12) I = 10^w (t/T), w in {1..6}',
    why: 'Memberi porsi iterasi eksploitasi jauh lebih besar daripada GOA asli.'
  },
  {
    id: 'matrix',
    step: '05',
    title: 'Seleksi Matriks 3-Sampel (Best/Mid/Worst)',
    plain: 'Kandidat dari Roulette + Elite + Sosial digabung dan diurutkan, lalu diambil 3 kelompok: Terbaik (tajam), Menengah, dan sedikit Terburuk (jaga jelajah).',
    eq: 'Urutkan kandidat gabungan -> Ambil Sampel Terbaik + Menengah + Terburuk = N',
    why: 'Sampel terburuk menjaga eksplorasi; sampel terbaik memperkuat eksploitasi.'
  },
  {
    id: 'catch',
    step: '06',
    title: 'Penggantian Antlion & Elite [Eq. 13]',
    plain: 'Jika belalang menemukan lembah lebih dalam dari antlion, posisi antlion langsung diganti oleh belalang itu, dan Elite diperbarui.',
    eq: 'Eq. (13): Antlion_j = Grasshopper_i  jika  f(G_i) < f(A_j)',
    why: 'Menjamin solusi terbaik (Elite) tidak pernah hilang sepanjang iterasi.'
  }
];

export function renderHybridFlowchart(container, { selectedId = 'modc', onSelect } = {}) {
  if (!container) return;
  const p = 'flw';
  const coords = [
    { id: 'init', x: 14, y: 12, w: 214, h: 52, kind: 'hex' },
    { id: 'walk', x: 14, y: 84, w: 214, h: 52, kind: 'alo' },
    { id: 'social', x: 254, y: 12, w: 214, h: 52, kind: 'goa' },
    { id: 'modc', x: 254, y: 84, w: 214, h: 52, kind: 'dec' },
    { id: 'matrix', x: 96, y: 162, w: 290, h: 54, kind: 'hex' },
    { id: 'catch', x: 96, y: 238, w: 290, h: 52, kind: 'elite' }
  ];

  const nodesSvg = coords.map((box) => {
    const info = FLOWCHART_NODES.find((n) => n.id === box.id);
    const active = box.id === selectedId;
    const fill = active ? '#FEF3C7' : box.kind === 'hex' ? '#F5F3FF' : box.kind === 'goa' ? '#EAF1FF' : box.kind === 'alo' ? '#FEECEC' : '#FFFFFF';
    const stroke = active ? '#B91C1C' : box.kind === 'hex' ? '#6D28D9' : '#1A1816';
    const sw = active ? '2.8' : '1.6';
    const glyph = box.kind === 'goa' ? '◉' : box.kind === 'alo' ? '▼' : box.kind === 'dec' ? '◇' : box.kind === 'elite' ? '◆' : '⬡';
    return `
      <g class="flow-node" data-node-id="${box.id}" tabindex="0" role="button" aria-pressed="${active}">
        <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="9" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
        <text x="${box.x + 12}" y="${box.y + 20}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="${active ? '#B91C1C' : '#4B4742'}">${glyph} TAHAP ${info.step}</text>
        <text x="${box.x + 12}" y="${box.y + 40}" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" font-weight="700" fill="#1A1816">${info.title.split(' [')[0]}</text>
      </g>
    `;
  }).join('');

  container.innerHTML = `
    <svg viewBox="0 0 492 304" class="w-full h-auto block" role="group" aria-label="Flowchart interaktif 6 tahap Hybrid GOA-ALO dengan bentuk standar">
      ${sharedDefs(p)}
      <g stroke="#1A1816" stroke-width="2" fill="none">
        <path d="M 121 64 L 121 80" marker-end="url(#${p}-arrow-ink)"/>
        <path d="M 228 38 L 250 38" marker-end="url(#${p}-arrow-ink)"/>
        <path d="M 361 64 L 361 80" stroke="#1D4ED8" marker-end="url(#${p}-arrow-goa)"/>
        <path d="M 121 136 L 121 148 L 195 148 L 195 158" stroke="#B91C1C" marker-end="url(#${p}-arrow-alo)"/>
        <path d="M 361 136 L 361 148 L 285 148 L 285 158" stroke="#6D28D9" marker-end="url(#${p}-arrow-ink)"/>
        <path d="M 241 216 L 241 234" marker-end="url(#${p}-arrow-ink)"/>
        <path d="M 386 264 L 480 264 L 480 38 L 472 38" stroke="#4B4742" stroke-dasharray="4 3" marker-end="url(#${p}-arrow-ink)"/>
      </g>
      ${nodesSvg}
    </svg>
  `;

  container.querySelectorAll('.flow-node').forEach((el) => {
    const pick = () => onSelect && onSelect(el.dataset.nodeId);
    el.addEventListener('click', pick);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
    });
  });
}
