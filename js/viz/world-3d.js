// Full-Viewport 3D Coastal Tabletop Simulator Card Wars World (v9)
// Features: Exact Reference Sir Pip Mascot (mint console, white tux shirt, red bowtie + gold knot,
// wide-brim tilted top hat, waving round mint hand & 3 fanned orange/gold cards),
// ALL 9 LARGE ILLUSTRATED 512x704 3D CARDS, plus rich coastal island background & tabletop props
// (sunny flower-wood table, blue ocean & animated foam, sky dome & drifting clouds, sailboat,
// coastal palms, distant Candy/Ooo spires, rainbow, bunting flags, stacked card piles, HP tokens,
// D6/D20/D8 dice, drawstring pouches, watchtower, crystal spire, GOA grasshopper & ALO hourglass!).

import { BUTLER_MOODS, renderButler2DSvg } from './svg-illustrator.js?v=11';

let cachedThree = null;

async function loadThree() {
  if (cachedThree) return cachedThree;
  try {
    cachedThree = await import('three');
    return cachedThree;
  } catch {
    return null;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

// 9 Large Physical 3D Cards laid cleanly in 2 tactile rows on the 3D Card Wars playmat
// Row 1 (Far, 4 cards: I-IV: Intro & Arti) | Row 2 (Near, 5 cards: V-IX: Implementasi, Visualisasi & Kuis)
const TABLE_CARD_SLOTS = [
  { x: -2.28, z: -0.92, rotY: -0.04 },
  { x: -0.76, z: -0.98, rotY: 0.02 },
  { x: 0.76, z: -0.98, rotY: -0.02 },
  { x: 2.28, z: -0.92, rotY: 0.04 },
  { x: -2.68, z: 1.02, rotY: -0.05 },
  { x: -1.34, z: 1.06, rotY: 0.02 },
  { x: 0.0, z: 1.08, rotY: 0.0 },
  { x: 1.34, z: 1.06, rotY: -0.02 },
  { x: 2.68, z: 1.02, rotY: 0.05 }
];

const CARD_THEME_STYLES = [
  { frame: '#2B6CB0', sky: '#DBEAFE', tag: '01 INTRO', art: 'valley' },
  { frame: '#6D28D9', sky: '#EDE9FE', tag: '02 POLA B/C', art: 'taxonomy' },
  { frame: '#0F766E', sky: '#CCFBF1', tag: '03 ARTI 3 ALGO', art: 'triad' },
  { frame: '#0F766E', sky: '#D1FAE5', tag: '04 POLA B', art: 'gantt' },
  { frame: '#B91C1C', sky: '#FEE2E2', tag: '05 POLA C', art: 'pivot' },
  { frame: '#1D4ED8', sky: '#DBEAFE', tag: '06 ANATOMI', art: 'forces' },
  { frame: '#047857', sky: '#D1FAE5', tag: '07 LAB 3D', art: 'mountain' },
  { frame: '#B45309', sky: '#FEF3C7', tag: '08 BUKTI', art: 'bars' },
  { frame: '#8C2D19', sky: '#FFEDD5', tag: '09 KUIS', art: 'shield' }
];

// ============================================================================
// AUTOMATIC 2D INTERACTIVE 9-CARD TABLETOP FALLBACK (ZERO WEBGL REQUIRED)
// ============================================================================
export function render2DFallbackWorld(
  container,
  { mood = 'greet', cards = [], openedSet = new Set(), activeIdx = 0, showAllFaceUp = false, onCardPick = null } = {}
) {
  if (!container) return;
  const safeMood = BUTLER_MOODS.includes(mood) ? mood : 'greet';
  const fallbackMeta = cards.length ? cards : Array.from({ length: 9 }, (_, i) => ({
    roman: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][i],
    shortTitle: `Kartu ${i + 1}`,
    suit: 'concept',
    suitSym: '◆'
  }));

  const cardButtons = fallbackMeta.map((m, idx) => {
    const isOpen = showAllFaceUp || openedSet.has(idx);
    const isAct = idx === activeIdx;
    return `
      <button type="button" class="table-2d-card ${isOpen ? 'is-opened' : 'is-closed'} ${isAct ? 'is-active' : ''}" data-table-card="${idx}">
        <span class="font-mono-num font-bold">${m.roman} ${m.suitSym}</span>
        <span class="font-display font-bold leading-tight">${m.shortTitle}</span>
        <span class="font-mono-num">${isOpen ? 'TERBUKA' : 'KLIK BUKA'}</span>
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <div class="world-2d-stage" data-mood="${safeMood}">
      <div class="world-2d-playmat">
        <div class="world-2d-header">
          <div id="world-2d-butler-mount"></div>
          <div class="world-2d-mat-title">MEJA 9 KARTU SOKA (MODE 2D) - KLIK KARTU MANA SAJA</div>
        </div>
        <div class="world-2d-grid">${cardButtons}</div>
      </div>
    </div>
  `;

  renderButler2DSvg(container.querySelector('#world-2d-butler-mount'), { mood: safeMood, compact: true });

  if (onCardPick) {
    container.querySelectorAll('[data-table-card]').forEach((btn) => {
      btn.addEventListener('click', () => onCardPick(Number(btn.dataset.tableCard)));
    });
  }
}

// ============================================================================
// THREE.JS HELPERS: TOON SHADING, OUTLINES, PLAYMAT & HIGH-RES 512x704 CARDS
// ============================================================================
function createToonGradientMap(THREE) {
  const data = new Uint8Array([155, 224, 255]);
  const tex = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

function addToonOutline(THREE, mesh, thickness = 1.05) {
  const mat = new THREE.MeshBasicMaterial({ color: 0x1A1816, side: THREE.BackSide });
  const outline = new THREE.Mesh(mesh.geometry, mat);
  outline.scale.setScalar(thickness);
  mesh.add(outline);
  return outline;
}

function createPlaymatTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 700;
  const ctx = c.getContext('2d');

  // Top Half: Adventure Time Card Wars Violet-Sunset Landscape Lane
  const topGrad = ctx.createLinearGradient(0, 0, 0, 345);
  topGrad.addColorStop(0, '#4C3B96');
  topGrad.addColorStop(0.55, '#866EC7');
  topGrad.addColorStop(1, '#F5B895');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 1024, 348);

  // Rolling cartoon violet hills & clouds
  ctx.fillStyle = 'rgba(255, 245, 230, 0.35)';
  ctx.beginPath(); ctx.arc(160, 80, 56, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(215, 72, 42, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(840, 86, 60, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(65, 45, 130, 0.36)';
  ctx.beginPath();
  ctx.moveTo(0, 348);
  ctx.quadraticCurveTo(260, 220, 520, 300);
  ctx.quadraticCurveTo(790, 210, 1024, 310);
  ctx.lineTo(1024, 348);
  ctx.closePath();
  ctx.fill();

  // Bottom Half: Bright Nicelands / Candy Kingdom Yellow-Sky Road Lane
  const botGrad = ctx.createLinearGradient(0, 352, 0, 700);
  botGrad.addColorStop(0, '#BAE6FD');
  botGrad.addColorStop(0.38, '#FEF9C3');
  botGrad.addColorStop(1, '#FDE68A');
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, 352, 1024, 348);

  // Cute pastel hills & winding golden-red road (inspired by reference screenshot!)
  ctx.fillStyle = '#FBCFE8';
  ctx.beginPath(); ctx.arc(180, 580, 150, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#BBF7D0';
  ctx.beginPath(); ctx.arc(840, 595, 165, Math.PI, 0); ctx.fill();

  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 34;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(30, 650);
  ctx.bezierCurveTo(290, 575, 470, 675, 720, 605);
  ctx.bezierCurveTo(860, 565, 940, 645, 995, 610);
  ctx.stroke();

  ctx.strokeStyle = '#FDE047';
  ctx.lineWidth = 22;
  ctx.stroke();

  // Lane divider ribbon
  ctx.fillStyle = '#1A1816';
  ctx.fillRect(0, 342, 1024, 16);
  ctx.fillStyle = '#FDE047';
  ctx.fillRect(0, 346, 1024, 8);

  // Subtle dashed slot frames for all 9 cards
  ctx.strokeStyle = 'rgba(26, 24, 22, 0.34)';
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 8]);
  [182, 404, 620, 842].forEach((sx) => ctx.strokeRect(sx - 68, 178 - 94, 136, 188));
  [128, 320, 512, 704, 896].forEach((sx) => ctx.strokeRect(sx - 68, 520 - 94, 136, 188));
  ctx.setLineDash([]);

  // Zone labels on mat edges
  ctx.fillStyle = '#FFFDF7';
  ctx.font = '700 18px Consolas, monospace';
  ctx.fillText('BARIS 1: INTRO & ARTI ALGORITMA (KARTU I - IV)', 24, 30);
  ctx.fillStyle = '#1A1816';
  ctx.fillText('BARIS 2: IMPLEMENTASI, VISUALISASI & KUIS (KARTU V - IX)', 24, 380);

  // Outer comic border
  ctx.strokeStyle = '#1A1816';
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, 1010, 686);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function drawDeckBoxTexture(THREE, hueBg) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = hueBg;
  ctx.fillRect(0, 0, 256, 256);

  const colors = ['#0F766E', '#1D4ED8', '#B91C1C', '#FDE047', '#6D28D9', '#EA580C'];
  colors.forEach((col, i) => {
    const a1 = (i / colors.length) * Math.PI * 2;
    const a2 = ((i + 1) / colors.length) * Math.PI * 2;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.arc(128, 128, 58, a1, a2);
    ctx.closePath();
    ctx.fill();
  });
  ctx.fillStyle = '#FFFDF7';
  ctx.beginPath(); ctx.arc(128, 128, 22, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1A1816';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 246, 246);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// High-Resolution 512x704 Card Wars Illustrated Card Faces (Unique art per card!)
function createCardFaceTexture(THREE, meta, idx, isBack = false) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 704;
  const ctx = c.getContext('2d');
  const style = CARD_THEME_STYLES[idx] || CARD_THEME_STYLES[0];
  const unifiedBack = '#8C2D19';
  const gold = '#FDE047';

  if (isBack) {
    // 1 Unified Card Wars Terracotta-Crimson Deck Back with Gold Crest & Clear Number
    ctx.fillStyle = unifiedBack;
    ctx.fillRect(0, 0, 512, 704);
    ctx.strokeStyle = '#1A1816';
    ctx.lineWidth = 24;
    ctx.strokeRect(12, 12, 488, 680);
    ctx.strokeStyle = gold;
    ctx.lineWidth = 10;
    ctx.strokeRect(36, 36, 440, 632);

    ctx.fillStyle = '#6F2010';
    ctx.beginPath();
    ctx.moveTo(256, 130);
    ctx.lineTo(396, 324);
    ctx.lineTo(256, 518);
    ctx.lineTo(116, 324);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = gold;
    ctx.lineWidth = 9;
    ctx.stroke();

    ctx.fillStyle = '#FFFDF7';
    ctx.font = '700 112px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(meta.roman, 256, 310);

    ctx.fillStyle = gold;
    ctx.font = '700 34px Trebuchet MS, sans-serif';
    ctx.fillText(meta.shortTitle, 256, 412);

    ctx.fillStyle = '#FFFDF7';
    ctx.font = '700 28px Consolas, monospace';
    ctx.fillText('KLIK UNTUK BALIK', 256, 610);
  } else {
    // Authentic Card Wars Playing Card Front Layout (matching user's Tabletop Simulator reference!)
    ctx.fillStyle = '#FFFDF7';
    ctx.fillRect(0, 0, 512, 704);

    // Outer colored card frame + thick comic black ink outline
    ctx.fillStyle = style.frame;
    ctx.fillRect(16, 16, 480, 672);
    ctx.fillStyle = '#FFFDF7';
    ctx.fillRect(32, 32, 448, 640);
    ctx.strokeStyle = '#1A1816';
    ctx.lineWidth = 18;
    ctx.strokeRect(9, 9, 494, 686);

    // Top Card Nameplate Banner + Cost/Order Medallion
    ctx.fillStyle = '#F6EFE0';
    ctx.fillRect(36, 36, 440, 82);
    ctx.strokeStyle = '#1A1816';
    ctx.lineWidth = 6;
    ctx.strokeRect(36, 36, 440, 82);

    // Corner Number Circle (just like Card Wars AP cost circle!)
    ctx.fillStyle = gold;
    ctx.beginPath(); ctx.arc(82, 77, 30, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = '#1A1816';
    ctx.font = '700 32px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(meta.roman, 82, 78);

    ctx.fillStyle = '#1A1816';
    ctx.font = '700 32px Trebuchet MS, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(meta.shortTitle, 124, 78, 340);

    // BIG Center Illustrated Art Window (matching Card Wars monster/landscape box!)
    ctx.fillStyle = style.sky;
    ctx.fillRect(42, 134, 428, 332);
    ctx.strokeStyle = '#1A1816';
    ctx.lineWidth = 8;
    ctx.strokeRect(42, 134, 428, 332);

    // Draw unique bold cartoon-geometric artwork per card
    ctx.save();
    ctx.beginPath();
    ctx.rect(46, 138, 420, 324);
    ctx.clip();
    drawCardArtWindow(ctx, style.art, style.frame);
    ctx.restore();

    // Subtype Ribbon Strip ("NiceLands" style bar!)
    ctx.fillStyle = style.frame;
    ctx.fillRect(42, 476, 428, 48);
    ctx.strokeStyle = '#1A1816';
    ctx.lineWidth = 6;
    ctx.strokeRect(42, 476, 428, 48);
    ctx.fillStyle = '#FFFDF7';
    ctx.font = '700 24px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(meta.suitLabel, 256, 502, 404);

    // Bottom Card Description Box (like Card Wars ability text box!)
    ctx.fillStyle = '#FAF5E8';
    ctx.fillRect(42, 534, 428, 126);
    ctx.strokeStyle = '#1A1816';
    ctx.lineWidth = 6;
    ctx.strokeRect(42, 534, 428, 126);

    ctx.fillStyle = '#1A1816';
    ctx.font = '600 22px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    const words = meta.title.split(' ');
    let line1 = '';
    let line2 = '';
    words.forEach((w) => {
      if ((line1 + ' ' + w).trim().length <= 30) line1 = (line1 + ' ' + w).trim();
      else line2 = (line2 + ' ' + w).trim();
    });
    ctx.fillText(line1, 256, 578, 404);
    if (line2) ctx.fillText(line2, 256, 614, 404);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function drawCardArtWindow(ctx, artType, accent) {
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#1A1816';

  if (artType === 'valley') {
    // Rolling hills + golden global valley + rolling test ball
    ctx.fillStyle = '#86EFAC';
    ctx.beginPath();
    ctx.moveTo(40, 470);
    ctx.bezierCurveTo(140, 220, 210, 360, 270, 290);
    ctx.bezierCurveTo(330, 220, 360, 440, 475, 240);
    ctx.lineTo(475, 470);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#FDE047';
    ctx.beginPath(); ctx.arc(368, 392, 26, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (artType === 'taxonomy') {
    // Green Square (MCT) + Purple Hexagons (GOA / ALO)
    ctx.fillStyle = '#0F766E';
    ctx.fillRect(88, 220, 120, 120); ctx.strokeRect(88, 220, 120, 120);
    ctx.fillStyle = '#6D28D9';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const px = 345 + Math.cos(a) * 76;
      const py = 285 + Math.sin(a) * 76;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (artType === 'triad') {
    // MCT Square, GOA Circle, ALO Funnel side-by-side
    ctx.fillStyle = '#0F766E';
    ctx.fillRect(74, 240, 88, 88); ctx.strokeRect(74, 240, 88, 88);
    ctx.fillStyle = '#1D4ED8';
    ctx.beginPath(); ctx.arc(256, 284, 52, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#B91C1C';
    ctx.beginPath(); ctx.moveTo(340, 232); ctx.lineTo(446, 232); ctx.lineTo(393, 344); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (artType === 'gantt') {
    // Cloud VM Gantt blocks
    ctx.fillStyle = '#0F766E';
    ctx.fillRect(78, 200, 145, 58); ctx.strokeRect(78, 200, 145, 58);
    ctx.fillStyle = '#5EEAD4';
    ctx.fillRect(235, 200, 96, 58); ctx.strokeRect(235, 200, 96, 58);
    ctx.fillStyle = '#FDE047';
    ctx.fillRect(78, 290, 210, 58); ctx.strokeRect(78, 290, 210, 58);
    ctx.fillStyle = '#0F766E';
    ctx.fillRect(300, 290, 118, 58); ctx.strokeRect(300, 290, 118, 58);
  } else if (artType === 'pivot') {
    // Dual c-decay pivot at L/2
    ctx.strokeStyle = '#1D4ED8'; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(76, 180); ctx.lineTo(256, 410); ctx.lineTo(436, 418); ctx.stroke();
    ctx.strokeStyle = '#B91C1C'; ctx.setLineDash([14, 10]); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(256, 155); ctx.lineTo(256, 445); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#FDE047'; ctx.strokeStyle = '#1A1816'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(256, 410, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (artType === 'forces') {
    // Social force rings (Orange dashed inner, Blue outer)
    ctx.strokeStyle = '#1D4ED8'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(256, 296, 118, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#C2410C'; ctx.setLineDash([12, 8]);
    ctx.beginPath(); ctx.arc(256, 296, 62, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#1D4ED8'; ctx.strokeStyle = '#1A1816'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(256, 296, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (artType === 'mountain') {
    // 3D Topographic Rastrigin peaks
    ctx.fillStyle = '#34D399';
    ctx.beginPath(); ctx.moveTo(60, 440); ctx.lineTo(175, 200); ctx.lineTo(285, 440); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#0F766E';
    ctx.beginPath(); ctx.moveTo(210, 440); ctx.lineTo(345, 175); ctx.lineTo(455, 440); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#FDE047';
    ctx.beginPath(); ctx.arc(256, 395, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (artType === 'bars') {
    // Empirical benchmark bars
    const bars = [
      { y: 185, w: 110, c: '#B91C1C' },
      { y: 260, w: 220, c: '#1D4ED8' },
      { y: 335, w: 310, c: '#0F766E' }
    ];
    bars.forEach((b) => { ctx.fillStyle = b.c; ctx.fillRect(86, b.y, b.w, 48); ctx.strokeRect(86, b.y, b.w, 48); });
  } else {
    // Cheat sheet & Quiz Shield
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(256, 170); ctx.lineTo(372, 215); ctx.lineTo(346, 355); ctx.lineTo(256, 430); ctx.lineTo(166, 355); ctx.lineTo(140, 215);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#FDE047';
    ctx.font = '700 100px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('?', 256, 304);
  }
}

function createWoodFlowerDeckTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');

  // Sunny warm yellow wooden planks inspired by user's screenshot!
  ctx.fillStyle = '#F5CF54';
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 64) {
    ctx.fillStyle = (y / 64) % 2 === 0 ? '#F7D665' : '#ECC346';
    ctx.fillRect(0, y, 512, 64);
    ctx.strokeStyle = 'rgba(146, 98, 18, 0.34)';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
  }

  // Painted subtle daisy flowers on planks (exact callback to user reference!)
  const drawFlower = (cx, cy, r) => {
    ctx.fillStyle = 'rgba(224, 166, 36, 0.42)';
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r * 0.56, r * 0.34, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255, 248, 200, 0.65)';
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2); ctx.fill();
  };
  drawFlower(128, 128, 38);
  drawFlower(384, 160, 34);
  drawFlower(256, 352, 42);
  drawFlower(92, 412, 30);
  drawFlower(420, 410, 36);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.2, 1.5);
  return tex;
}

function createSkyBackdropTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext('2d');

  // Crisp Adventure Time coastal sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#38A3F1');
  grad.addColorStop(0.55, '#64C5FA');
  grad.addColorStop(1, '#BAE6FD');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Soft pastel rainbow arc across far right sky
  const rCols = ['#FCA5A5', '#FDBA74', '#FDE047', '#86EFAC', '#93C5FD', '#C4B5FD'];
  rCols.forEach((col, i) => {
    ctx.strokeStyle = col;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(760, 500, 340 - i * 11, Math.PI * 1.06, Math.PI * 1.94);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;

  // Warm cartoon sun on upper left
  ctx.fillStyle = '#FEF08A';
  ctx.beginPath(); ctx.arc(170, 145, 56, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#FACC15';
  ctx.beginPath(); ctx.arc(170, 145, 40, 0, Math.PI * 2); ctx.fill();

  // Fluffy layered cartoon clouds painted on sky horizon
  const drawCloud = (x, y, s) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, 42 * s, 0, Math.PI * 2);
    ctx.arc(x + 42 * s, y - 14 * s, 50 * s, 0, Math.PI * 2);
    ctx.arc(x + 92 * s, y - 4 * s, 44 * s, 0, Math.PI * 2);
    ctx.arc(x + 130 * s, y + 8 * s, 32 * s, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCloud(70, 210, 1.05);
  drawCloud(365, 165, 1.15);
  drawCloud(740, 195, 1.0);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createDieFaceTexture(THREE, pips = 5) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#FEF08A';
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = '#1A1816';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 118, 118);

  const spots = {
    1: [[64, 64]],
    2: [[36, 36], [92, 92]],
    3: [[36, 36], [64, 64], [92, 92]],
    4: [[36, 36], [92, 36], [36, 92], [92, 92]],
    5: [[36, 36], [92, 36], [64, 64], [36, 92], [92, 92]],
    6: [[36, 32], [92, 32], [36, 64], [92, 64], [36, 96], [92, 96]]
  }[pips] || [[64, 64]];
  ctx.fillStyle = '#B91C1C';
  spots.forEach(([px, py]) => {
    ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.fill();
  });
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function drawButlerFaceCanvas(ctx, mood, blinking) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  ctx.clearRect(0, 0, W, H);
  // Pastel-mint screen with crisp thick dark ink border (exact match to user's reference!)
  ctx.fillStyle = '#D9F7ED';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#1A1816';
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, W - 14, H - 14);

  // Cute soft-pink oval blush cheeks
  ctx.fillStyle = '#F497A9';
  ctx.beginPath(); ctx.ellipse(54, 122, 19, 11, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(202, 122, 19, 11, 0, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = '#1A1816';
  ctx.fillStyle = '#1A1816';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (blinking) {
    ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(64, 84); ctx.lineTo(98, 84); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(158, 84); ctx.lineTo(192, 84); ctx.stroke();
  } else if (mood === 'greet' || mood === 'proud') {
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(82, 94, 18, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
    ctx.beginPath(); ctx.arc(174, 94, 18, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
  } else if (mood === 'aha') {
    ctx.beginPath(); ctx.arc(82, 84, 16, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(174, 84, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FDE047';
    ctx.beginPath(); ctx.arc(76, 77, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(168, 77, 6, 0, Math.PI * 2); ctx.fill();
  } else {
    const lookShift = mood === 'point' ? 7 : 0;
    ctx.beginPath(); ctx.arc(82 + lookShift, 86, 13, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(174 + lookShift, 86, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.arc(86 + lookShift, 81, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(178 + lookShift, 81, 4.5, 0, Math.PI * 2); ctx.fill();
  }

  // Happy mouth with bright pink tongue (matching user's mascot reference!)
  ctx.fillStyle = '#1A1816';
  ctx.strokeStyle = '#1A1816';
  ctx.lineWidth = 8;
  if (mood === 'greet' || mood === 'aha' || mood === 'proud') {
    ctx.beginPath();
    ctx.moveTo(92, 122);
    ctx.quadraticCurveTo(128, mood === 'aha' ? 168 : 158, 164, 122);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#F4728A';
    ctx.beginPath();
    ctx.ellipse(128, 145, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (mood === 'point') {
    ctx.beginPath(); ctx.ellipse(128, 134, 19, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F4728A';
    ctx.beginPath(); ctx.ellipse(128, 141, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
  } else if (mood === 'think') {
    ctx.beginPath(); ctx.moveTo(98, 136); ctx.quadraticCurveTo(114, 124, 128, 136); ctx.quadraticCurveTo(142, 148, 158, 132); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(94, 126); ctx.quadraticCurveTo(128, 154, 162, 126); ctx.stroke();
  }
}

// ============================================================================
// MAIN FULL-VIEWPORT 3D TABLETOP SIMULATOR CARD WARS WORLD
// ============================================================================
export class CardWarsWorld {
  constructor({ webglContainer, fallbackContainer, cards = [], onModeChange, onCardPick, onCardHover } = {}) {
    this.webglContainer = webglContainer;
    this.fallbackContainer = fallbackContainer;
    this.cardsMeta = cards;
    this.onModeChange = onModeChange;
    this.onCardPick = onCardPick;
    this.onCardHover = onCardHover;

    this.mode = 'loading';
    this.paused = false;
    this.interactiveTable = true;
    this.showAllFaceUp = true; // Show ALL 9 illustrated 3D cards face-up on the table by default like Tabletop Simulator!
    this.rafId = null;
    this.clockStart = performance.now();
    this.mood = 'greet';
    this.cameraMode = 'table';
    this.openedSet = new Set([0]);
    this.activeIdx = 0;
    this.hoveredIdx = -1;
    this.cardEntries = [];
    this.pickables = [];
    this.prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.mouseNdc = { x: 0, y: 0 };
    this.isBlinking = false;
    this.shakeAmp = 0;
    this.animatedProps = { clouds: [], boat: null, waves: [], steam: [], sparkle: [], cardsFan: null, crystal: null, palms: [] };

    // Angled Coastal Tabletop Simulator camera: frames ALL 9 big 3D cards + hero Sir Pip + ocean/sky horizon!
    this.camTargetPos = { x: 0.0, y: 3.72, z: 5.82 };
    this.camTargetLook = { x: 0.0, y: 0.52, z: -0.45 };
    this.camCurrentLook = { x: 0.0, y: 0.52, z: -0.45 };
  }

  async init(prefer2D = false) {
    const canWebGL = !prefer2D && hasWebGL();
    const THREE = canWebGL ? await loadThree() : null;

    if (!THREE || !this.webglContainer) {
      this._activate2DFallback();
      return;
    }

    try {
      this.THREE = THREE;
      this.raycaster = new THREE.Raycaster();
      this.pointerVec = new THREE.Vector2(-9, -9);

      this.webglContainer.innerHTML = '';
      if (this.fallbackContainer) this.fallbackContainer.classList.add('hidden');
      this.webglContainer.classList.remove('hidden');

      const w = Math.max(320, window.innerWidth);
      const h = Math.max(240, window.innerHeight);

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x4AB6F7);

      this.camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 120);
      this.camera.position.set(this.camTargetPos.x, this.camTargetPos.y, this.camTargetPos.z);
      this.camera.lookAt(this.camCurrentLook.x, this.camCurrentLook.y, this.camCurrentLook.z);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      this.renderer.setSize(w, h);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.webglContainer.appendChild(this.renderer.domElement);

      this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        this._activate2DFallback();
      });

      this.gradMap = createToonGradientMap(THREE);
      this._setupLights();
      this._buildCoastalWorldBackdrop();
      this._buildTabletopArena();
      this._buildTabletopProps();
      this._buildButlerSirPip();
      this._buildNineTableCards();

      this.mode = 'webgl';
      this.onModeChange && this.onModeChange('webgl');

      window.addEventListener('mousemove', this._onMouseMove, { passive: true });
      this.renderer.domElement.addEventListener('click', this._onCanvasClick);
      this._startLoop();
    } catch {
      this._activate2DFallback();
    }
  }

  _toonMat(hex) {
    return new this.THREE.MeshToonMaterial({ color: hex, gradientMap: this.gradMap });
  }

  _setupLights() {
    const THREE = this.THREE;
    this.scene.add(new THREE.AmbientLight(0xFFFDF5, 1.3));
    const sun = new THREE.DirectionalLight(0xFFF9E6, 1.45);
    sun.position.set(5, 12, 6);
    this.scene.add(sun);
    const fill = new THREE.DirectionalLight(0xBAE6FD, 0.45);
    fill.position.set(-7, 6, -5);
    this.scene.add(fill);
  }

  _buildCoastalWorldBackdrop() {
    const THREE = this.THREE;
    this.animatedProps = { clouds: [], boat: null, waves: [], steam: [], sparkle: [], cardsFan: null, crystal: null, palms: [] };

    // 1. Vivid Coastal Sky Backdrop Wall with sun, pastel rainbow & clouds
    const skyTex = createSkyBackdropTexture(THREE);
    const skyWall = new THREE.Mesh(
      new THREE.PlaneGeometry(54, 18),
      new THREE.MeshBasicMaterial({ map: skyTex })
    );
    skyWall.position.set(0, 5.2, -16.5);
    this.scene.add(skyWall);

    // 2. Sparkling Blue Cartoon Ocean + Crisp White Shoreline Foam
    const ocean = new THREE.Mesh(
      new THREE.PlaneGeometry(56, 20),
      new THREE.MeshBasicMaterial({ color: 0x1783B8 })
    );
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(0, -0.42, -11.5);
    this.scene.add(ocean);

    const foam = new THREE.Mesh(
      new THREE.PlaneGeometry(52, 0.55),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    foam.rotation.x = -Math.PI / 2;
    foam.position.set(0, -0.39, -5.2);
    this.scene.add(foam);
    this.animatedProps.waves.push(foam);

    // Extra drifting ocean wave crests
    [[-6.5, -7.8], [-1.8, -9.2], [4.6, -8.4], [8.8, -10.5], [-9.2, -11.0]].forEach(([wx, wz]) => {
      const crest = new THREE.Mesh(
        new THREE.PlaneGeometry(2.1, 0.18),
        new THREE.MeshBasicMaterial({ color: 0xE0F2FE, transparent: true, opacity: 0.85 })
      );
      crest.rotation.x = -Math.PI / 2;
      crest.position.set(wx, -0.38, wz);
      this.scene.add(crest);
      this.animatedProps.waves.push(crest);
    });

    // 3. Warm Coastal Sandy Beach surrounding the wooden tabletop pier
    const beach = new THREE.Mesh(
      new THREE.PlaneGeometry(52, 14),
      this._toonMat(0xF3DF9E)
    );
    beach.rotation.x = -Math.PI / 2;
    beach.position.set(0, -0.40, 1.8);
    this.scene.add(beach);

    // 4. Distant Green Adventure Time Islands + Candy Kingdom Castle Spires!
    const buildIsland = (x, z, r, h, hasSpire = false) => {
      const g = new THREE.Group();
      const hill = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), this._toonMat(0x4ADE80));
      hill.scale.set(1.35, h / r, 0.9);
      addToonOutline(THREE, hill, 1.03);
      g.add(hill);
      if (hasSpire) {
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 1.8, 10), this._toonMat(0xF9A8D4));
        tower.position.set(0, h + 0.6, 0);
        addToonOutline(THREE, tower, 1.07);
        g.add(tower);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.85, 10), this._toonMat(0xEC4899));
        roof.position.set(0, h + 1.85, 0);
        addToonOutline(THREE, roof, 1.07);
        g.add(roof);
        const sideT = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.15, 8), this._toonMat(0xFDE047));
        sideT.position.set(-0.55, h + 0.3, 0.15);
        addToonOutline(THREE, sideT, 1.08);
        g.add(sideT);
      }
      g.position.set(x, -0.44, z);
      this.scene.add(g);
    };
    buildIsland(-10.5, -12.6, 2.8, 1.7, true);
    buildIsland(10.8, -12.8, 3.1, 1.9, false);
    buildIsland(4.8, -13.8, 2.1, 1.25, true);

    // 5. Cute Cartoon Sailboat bobbing gently on the blue ocean!
    const boat = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.32, 0.48), this._toonMat(0xB45309));
    hull.position.y = 0.14;
    addToonOutline(THREE, hull, 1.08);
    boat.add(hull);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 1.25, 8), this._toonMat(0x78350F));
    mast.position.set(0, 0.78, 0);
    boat.add(mast);
    const sail = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.95, 3), this._toonMat(0xEF4444));
    sail.position.set(0.14, 0.84, 0);
    sail.rotation.y = Math.PI / 2;
    addToonOutline(THREE, sail, 1.06);
    boat.add(sail);
    boat.position.set(-4.8, -0.42, -9.2);
    this.scene.add(boat);
    this.animatedProps.boat = boat;

    // 6. Stylized Coastal Palm Trees flanking the background (Left & Right)
    const buildPalm = (x, z, tilt = 0.16, scale = 1.0) => {
      const palm = new THREE.Group();
      for (let seg = 0; seg < 4; seg++) {
        const piece = new THREE.Mesh(new THREE.CylinderGeometry(0.11 - seg * 0.015, 0.14 - seg * 0.015, 0.65, 8), this._toonMat(0xA16207));
        piece.position.set(seg * tilt * 0.32, 0.32 + seg * 0.56, 0);
        piece.rotation.z = -tilt * (seg + 0.5) * 0.55;
        addToonOutline(THREE, piece, 1.1);
        palm.add(piece);
      }
      const crown = new THREE.Group();
      crown.position.set(3.2 * tilt * 0.32, 2.52, 0);
      for (let f = 0; f < 5; f++) {
        const a = (f / 5) * Math.PI * 2;
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.15, 5), this._toonMat(0x16A34A));
        leaf.position.set(Math.cos(a) * 0.48, 0.05, Math.sin(a) * 0.48);
        leaf.rotation.z = -Math.PI / 2.5;
        leaf.rotation.y = -a;
        addToonOutline(THREE, leaf, 1.07);
        crown.add(leaf);
      }
      const coconut = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), this._toonMat(0x78350F));
      coconut.position.set(0, -0.1, 0.12);
      crown.add(coconut);
      palm.add(crown);
      palm.position.set(x, -0.40, z);
      palm.scale.setScalar(scale);
      this.scene.add(palm);
      this.animatedProps.palms.push({ group: palm, phase: x * 0.7 });
    };
    buildPalm(-7.8, -5.6, 0.24, 1.18);
    buildPalm(7.9, -5.8, -0.22, 1.15);
    buildPalm(-9.6, -8.4, 0.18, 0.92);
    buildPalm(9.5, -8.8, -0.16, 0.95);

    // 7. Fluffy 3D Floating Cartoon Clouds drifting slowly across the sky
    const buildCloud = (x, y, z, s = 1.0) => {
      const g = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      [[-0.55, 0, 0, 0.48], [0, 0.22, 0, 0.62], [0.6, 0.04, 0, 0.50], [1.05, -0.06, 0, 0.36]].forEach(([cx, cy, cz, r]) => {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat);
        puff.position.set(cx, cy, cz);
        g.add(puff);
      });
      g.position.set(x, y, z);
      g.scale.setScalar(s);
      this.scene.add(g);
      this.animatedProps.clouds.push({ group: g, baseX: x, speed: 0.14 + (Math.abs(x) % 3) * 0.04 });
    };
    buildCloud(-7.2, 2.3, -13.2, 1.15);
    buildCloud(0.6, 2.75, -14.2, 1.25);
    buildCloud(6.8, 2.2, -13.5, 1.1);

    // 8. Festive Overhead Bunting Pennant Flags strung behind the table!
    const postMat = this._toonMat(0x78350F);
    [-6.1, 6.1].forEach((px) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 2.85, 8), postMat);
      post.position.set(px, 1.05, -4.15);
      addToonOutline(THREE, post, 1.09);
      this.scene.add(post);
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), this._toonMat(0xFACC15));
      knob.position.set(px, 2.52, -4.15);
      addToonOutline(THREE, knob, 1.1);
      this.scene.add(knob);
    });
    const flagColors = [0xEF4444, 0xFACC15, 0x10B981, 0x3B82F6, 0xF97316, 0xA855F7];
    for (let i = 0; i < 13; i++) {
      const t = i / 12;
      const fx = -5.6 + t * 11.2;
      const sag = Math.sin(t * Math.PI) * 0.52;
      const flag = new THREE.Mesh(
        new THREE.ConeGeometry(0.24, 0.44, 3),
        this._toonMat(flagColors[i % flagColors.length])
      );
      flag.rotation.z = Math.PI;
      flag.position.set(fx, 2.38 - sag, -4.12);
      addToonOutline(THREE, flag, 1.08);
      this.scene.add(flag);
    }
  }

  _buildTabletopArena() {
    const THREE = this.THREE;
    // Sunny Yellow Flower-Wood Tabletop Island (exact reference feel!) with crisp comic black border
    const woodTex = createWoodFlowerDeckTexture(THREE);
    const tableSlab = new THREE.Mesh(
      new THREE.BoxGeometry(12.8, 0.42, 7.6),
      [
        this._toonMat(0x1A1816), this._toonMat(0x1A1816),
        new THREE.MeshBasicMaterial({ map: woodTex }),
        this._toonMat(0x1A1816), this._toonMat(0x1A1816), this._toonMat(0x1A1816)
      ]
    );
    tableSlab.position.set(0, -0.22, -0.15);
    this.scene.add(tableSlab);

    // Bold black outer rim trim along the tabletop
    const tableRim = new THREE.Mesh(
      new THREE.BoxGeometry(13.02, 0.36, 7.82),
      new THREE.MeshBasicMaterial({ color: 0x1A1816 })
    );
    tableRim.position.set(0, -0.24, -0.15);
    this.scene.add(tableRim);

    // Classic Card Wars green baize inner frame under the playmat
    const baize = new THREE.Mesh(
      new THREE.BoxGeometry(8.15, 0.036, 5.45),
      this._toonMat(0x5B8C61)
    );
    baize.position.set(0, -0.008, 0.02);
    addToonOutline(THREE, baize, 1.015);
    this.scene.add(baize);

    const matTex = createPlaymatTexture(THREE);
    const playmat = new THREE.Mesh(
      new THREE.BoxGeometry(7.6, 0.044, 4.95),
      [
        this._toonMat(0x1A1816), this._toonMat(0x1A1816),
        new THREE.MeshBasicMaterial({ map: matTex }),
        this._toonMat(0x1A1816), this._toonMat(0x1A1816), this._toonMat(0x1A1816)
      ]
    );
    playmat.position.set(0, 0.018, 0.02);
    this.scene.add(playmat);
  }

  _buildTabletopProps() {
    const THREE = this.THREE;
    const boxTexL = drawDeckBoxTexture(THREE, '#B6A6D8');
    const boxTexR = drawDeckBoxTexture(THREE, '#A5B4FC');

    // 1. Twin Card Wars Deck Boxes
    const boxLeft = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.88, 1.28), new THREE.MeshBasicMaterial({ map: boxTexL }));
    boxLeft.position.set(-5.05, 0.44, -2.05);
    boxLeft.rotation.y = 0.28;
    addToonOutline(THREE, boxLeft, 1.05);
    this.scene.add(boxLeft);

    const boxRight = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.88, 1.28), new THREE.MeshBasicMaterial({ map: boxTexR }));
    boxRight.position.set(5.15, 0.44, -1.75);
    boxRight.rotation.y = -0.34;
    addToonOutline(THREE, boxRight, 1.05);
    this.scene.add(boxRight);

    // 2. Draw Pile & Discard Pile (Thick 3D Stacked Card Wars Decks!)
    const buildDeckStack = (x, z, rotY, count = 10) => {
      const g = new THREE.Group();
      for (let i = 0; i < count; i++) {
        const c = new THREE.Mesh(
          new THREE.BoxGeometry(0.86, 0.032, 1.18),
          this._toonMat(i === count - 1 ? 0x8C2D19 : i % 2 === 0 ? 0xFFFDF7 : 0xEADBC4)
        );
        c.position.set((i % 3 - 1) * 0.012, 0.016 + i * 0.034, ((i * 7) % 3 - 1) * 0.012);
        c.rotation.y = (i === count - 1 ? 0.09 : 0);
        if (i === count - 1) addToonOutline(THREE, c, 1.05);
        g.add(c);
      }
      const crest = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.015, 0.38), this._toonMat(0xFACC15));
      crest.position.set(0, count * 0.034 + 0.01, 0);
      crest.rotation.y = Math.PI / 4 + 0.09;
      g.add(crest);
      g.position.set(x, 0.01, z);
      g.rotation.y = rotY;
      this.scene.add(g);
    };
    buildDeckStack(-4.85, 1.65, 0.14, 11);
    buildDeckStack(4.92, 1.55, -0.18, 8);

    // 3. Four Velvet Drawstring Token Pouches + Spilled Gold Coins
    const makePouch = (x, z, colorHex) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.36, 12, 10), this._toonMat(colorHex));
      body.scale.set(1, 0.88, 1);
      body.position.y = 0.29;
      addToonOutline(THREE, body, 1.08);
      g.add(body);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.13, 0.21, 10), this._toonMat(colorHex));
      neck.position.y = 0.55;
      addToonOutline(THREE, neck, 1.09);
      g.add(neck);
      const tie = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.035, 6, 12), this._toonMat(0xFACC15));
      tie.rotation.x = Math.PI / 2;
      tie.position.y = 0.48;
      g.add(tie);
      g.position.set(x, 0, z);
      this.scene.add(g);
    };
    makePouch(-4.72, -0.45, 0x9E3424);
    makePouch(-5.32, 0.35, 0x2C5AA0);
    makePouch(4.78, -0.35, 0x2C5AA0);
    makePouch(5.38, 0.42, 0x9E3424);

    // 4. Stacked Red & Gold HP / Victory Counter Tokens
    const buildTokenStack = (x, z, n, col) => {
      for (let i = 0; i < n; i++) {
        const chip = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.065, 14), this._toonMat(i % 2 === 0 ? col : 0xFACC15));
        chip.position.set(x + (i % 2) * 0.018, 0.035 + i * 0.068, z);
        addToonOutline(THREE, chip, 1.08);
        this.scene.add(chip);
      }
    };
    buildTokenStack(-4.45, 0.55, 5, 0xDC2626);
    buildTokenStack(-4.02, 0.72, 3, 0xFACC15);
    buildTokenStack(4.35, 0.52, 4, 0x0F766E);

    // 5. Polyhedral Dice Set: Spotted D6 + Crimson D20 + Emerald D8!
    const d6Mats = [1, 6, 5, 2, 3, 4].map((p) => new THREE.MeshBasicMaterial({ map: createDieFaceTexture(THREE, p) }));
    const die6 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.36), d6Mats);
    die6.position.set(-3.85, 0.18, -2.52);
    die6.rotation.y = 0.46;
    addToonOutline(THREE, die6, 1.08);
    this.scene.add(die6);

    const die20 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.24, 0), this._toonMat(0xDC2626));
    die20.position.set(-3.28, 0.22, -2.72);
    die20.rotation.set(0.4, 0.8, 0.2);
    addToonOutline(THREE, die20, 1.1);
    this.scene.add(die20);

    const die8 = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), this._toonMat(0x10B981));
    die8.position.set(3.55, 0.22, -2.62);
    die8.rotation.set(0.3, 0.5, 0.3);
    addToonOutline(THREE, die8, 1.1);
    this.scene.add(die8);

    // 6. Card Wars / Metaheuristic Thematic Miniatures on Table Corners!
    // Left-rear: Mini ALO Sand-Funnel Hourglass!
    const hourglass = new THREE.Group();
    const hgBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.30, 0.08, 12), this._toonMat(0x92400E));
    hgBase.position.y = 0.04;
    const hgTop = hgBase.clone();
    hgTop.position.y = 0.88;
    const coneBot = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.40, 12), this._toonMat(0xFDE68A));
    coneBot.position.y = 0.28;
    const coneTop = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.40, 12), this._toonMat(0xF59E0B));
    coneTop.rotation.z = Math.PI;
    coneTop.position.y = 0.64;
    [hgBase, hgTop, coneBot, coneTop].forEach((m) => { addToonOutline(THREE, m, 1.08); hourglass.add(m); });
    hourglass.position.set(-2.55, 0.0, -2.92);
    this.scene.add(hourglass);

    // Right-rear: Glowing Blue Crystal Spire (GOA / Blue Plains Land Mini!)
    const crystalGroup = new THREE.Group();
    const cPed = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.16, 8), this._toonMat(0x334155));
    cPed.position.y = 0.08;
    addToonOutline(THREE, cPed, 1.08);
    crystalGroup.add(cPed);
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), this._toonMat(0x38BDF8));
    crystal.scale.set(0.75, 1.55, 0.75);
    crystal.position.y = 0.66;
    addToonOutline(THREE, crystal, 1.09);
    crystalGroup.add(crystal);
    crystalGroup.position.set(2.68, 0.0, -2.95);
    this.scene.add(crystalGroup);
    this.animatedProps.crystal = crystal;

    // Right-mid: Cute Miniature Cornfield Watchtower + Warm Ceramic Coffee Mug!
    const tower = new THREE.Group();
    const tBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.30, 0.78, 8), this._toonMat(0xFBBF24));
    tBody.position.y = 0.39;
    addToonOutline(THREE, tBody, 1.07);
    tower.add(tBody);
    const tRoof = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.44, 8), this._toonMat(0xB91C1C));
    tRoof.position.y = 0.98;
    addToonOutline(THREE, tRoof, 1.07);
    tower.add(tRoof);
    tower.position.set(4.12, 0.0, -2.85);
    this.scene.add(tower);

    // Ceramic Coffee Mug on far right with floating cartoon steam puffs
    const mug = new THREE.Group();
    const mugCup = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.23, 0.48, 12), this._toonMat(0xFFFDF7));
    mugCup.position.y = 0.24;
    addToonOutline(THREE, mugCup, 1.08);
    mug.add(mugCup);
    const mugCoffee = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 12), new THREE.MeshBasicMaterial({ color: 0x5C3317 }));
    mugCoffee.position.y = 0.47;
    mug.add(mugCoffee);
    const mugHandle = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 6, 12, Math.PI), this._toonMat(0xFFFDF7));
    mugHandle.position.set(0.25, 0.25, 0);
    mugHandle.rotation.z = -Math.PI / 2;
    mug.add(mugHandle);
    mug.position.set(5.55, 0.0, -0.52);
    this.scene.add(mug);

    for (let s = 0; s < 3; s++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.08 + s * 0.02, 8, 8), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.65 }));
      puff.position.set(5.55, 0.62 + s * 0.26, -0.52);
      this.scene.add(puff);
      this.animatedProps.steam.push({ mesh: puff, offset: s * 0.33 });
    }

    // 7. Floating golden sparkle stars subtly drifting over the tabletop!
    for (let k = 0; k < 10; k++) {
      const star = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.065, 0),
        new THREE.MeshBasicMaterial({ color: k % 2 === 0 ? 0xFDE047 : 0xFFFFFF, transparent: true, opacity: 0.8 })
      );
      const sx = -4.8 + (k / 9) * 9.6;
      const sz = -2.6 + ((k * 37) % 10) * 0.42;
      star.position.set(sx, 0.6 + (k % 3) * 0.45, sz);
      this.scene.add(star);
      this.animatedProps.sparkle.push({ mesh: star, baseY: star.position.y, phase: k * 0.9 });
    }
  }

  _buildButlerSirPip() {
    const THREE = this.THREE;
    // Exact 3D Recreation of User's Uploaded Sir Pip Mascot!
    this.butlerRoot = new THREE.Group();
    this.butlerRoot.position.set(0.0, 0.04, -2.92);
    this.butlerRoot.scale.setScalar(1.22);

    this.butlerUpper = new THREE.Group();
    this.butlerRoot.add(this.butlerUpper);

    // 1. Boxy Mint-Teal Console Upper Body (#72D6B4) with bold comic ink outline
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.12, 1.36, 0.72), this._toonMat(0x72D6B4));
    body.position.set(0, 0.74, 0);
    addToonOutline(THREE, body, 1.06);
    this.butlerUpper.add(body);

    // 2. Recessed Pastel-Mint Face Screen with Blush, Happy Eyes & Pink Tongue!
    this.faceCanvas = document.createElement('canvas');
    this.faceCanvas.width = 256;
    this.faceCanvas.height = 192;
    this.faceCtx = this.faceCanvas.getContext('2d');
    drawButlerFaceCanvas(this.faceCtx, this.mood, false);
    this.faceTex = new THREE.CanvasTexture(this.faceCanvas);
    this.faceTex.colorSpace = THREE.SRGBColorSpace;

    const facePlate = new THREE.Mesh(new THREE.PlaneGeometry(0.90, 0.66), new THREE.MeshBasicMaterial({ map: this.faceTex }));
    facePlate.position.set(0, 0.96, 0.372);
    this.butlerUpper.add(facePlate);

    // 3. Navy-Charcoal Tuxedo Lower Jacket (#1D2939) + Crisp Rectangular White Tuxedo Shirt!
    const tux = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.56, 0.76), this._toonMat(0x1D2939));
    tux.position.set(0, 0.30, 0);
    addToonOutline(THREE, tux, 1.05);
    this.butlerUpper.add(tux);

    const whiteShirt = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.48),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    whiteShirt.position.set(0, 0.29, 0.392);
    this.butlerUpper.add(whiteShirt);

    // 4. Classic Red Bowtie (two crisp triangles) + Bright Yellow Circular Center Knot!
    const bowtieGroup = new THREE.Group();
    bowtieGroup.position.set(0, 0.51, 0.415);
    const wingGeo = new THREE.ConeGeometry(0.14, 0.26, 3);
    const bowLeft = new THREE.Mesh(wingGeo, this._toonMat(0xDC2626));
    bowLeft.rotation.z = -Math.PI / 2;
    bowLeft.position.x = -0.13;
    addToonOutline(THREE, bowLeft, 1.12);
    bowtieGroup.add(bowLeft);

    const bowRight = new THREE.Mesh(wingGeo, this._toonMat(0xDC2626));
    bowRight.rotation.z = Math.PI / 2;
    bowRight.position.x = 0.13;
    addToonOutline(THREE, bowRight, 1.12);
    bowtieGroup.add(bowRight);

    const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.068, 10, 8), this._toonMat(0xFACC15));
    bowKnot.position.z = 0.03;
    addToonOutline(THREE, bowKnot, 1.14);
    bowtieGroup.add(bowKnot);
    this.butlerUpper.add(bowtieGroup);

    // 5. Sleek Tilted Wide-Brim Navy Top Hat + Bright Yellow-Gold Band!
    this.butlerCap = new THREE.Group();
    const capBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.50, 0.52, 0.075, 16), this._toonMat(0x1D2939));
    capBrim.position.y = 0.04;
    addToonOutline(THREE, capBrim, 1.08);
    this.butlerCap.add(capBrim);

    const capCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.34, 0.36, 16), this._toonMat(0x1D2939));
    capCrown.position.y = 0.24;
    addToonOutline(THREE, capCrown, 1.08);
    this.butlerCap.add(capCrown);

    const capBand = new THREE.Mesh(new THREE.CylinderGeometry(0.355, 0.352, 0.085, 16), this._toonMat(0xFACC15));
    capBand.position.y = 0.11;
    this.butlerCap.add(capBand);

    this.butlerCap.position.set(-0.08, 1.41, 0.02);
    this.butlerCap.rotation.z = 0.17;
    this.butlerUpper.add(this.butlerCap);

    // 6. Raised Waving Navy Arm + Round Mint-Teal Hand Sphere (Viewer's Right, matching reference!)
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(0.56, 0.44, 0.06);
    const armSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.62, 10), this._toonMat(0x1D2939));
    armSleeve.position.set(0.24, 0.20, 0.06);
    armSleeve.rotation.z = -Math.PI / 3.8;
    addToonOutline(THREE, armSleeve, 1.12);
    this.leftArmPivot.add(armSleeve);

    const mintHand = new THREE.Mesh(new THREE.SphereGeometry(0.145, 12, 10), this._toonMat(0x72D6B4));
    mintHand.position.set(0.49, 0.43, 0.08);
    addToonOutline(THREE, mintHand, 1.12);
    this.leftArmPivot.add(mintHand);
    this.butlerUpper.add(this.leftArmPivot);

    // 7. Fanned Hand of 3 Bright Orange & Yellow Mini-Cards (Viewer's Left, exact match to reference!)
    const cardsFan = new THREE.Group();
    cardsFan.position.set(-0.84, 0.36, 0.16);
    [
      { x: -0.16, y: 0.0, z: -0.02, rz: 0.36, col: 0xEA580C },
      { x: -0.02, y: 0.04, z: 0.01, rz: 0.10, col: 0xFACC15 },
      { x: 0.12, y: 0.0, z: 0.04, rz: -0.16, col: 0xEA580C }
    ].forEach((cfg) => {
      const miniCard = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.40, 0.024), this._toonMat(cfg.col));
      miniCard.position.set(cfg.x, cfg.y, cfg.z);
      miniCard.rotation.z = cfg.rz;
      addToonOutline(THREE, miniCard, 1.09);
      cardsFan.add(miniCard);
    });
    this.butlerUpper.add(cardsFan);
    this.animatedProps.cardsFan = cardsFan;

    this.scene.add(this.butlerRoot);
  }

  _buildNineTableCards() {
    const THREE = this.THREE;
    this.cardEntries = [];
    this.pickables = [];

    const metas = this.cardsMeta.length === 9
      ? this.cardsMeta
      : Array.from({ length: 9 }, (_, i) => ({
          roman: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][i],
          shortTitle: `Kartu ${i + 1}`,
          title: `Kartu ${i + 1}`,
          suit: 'concept',
          suitLabel: 'SOKA'
        }));

    metas.forEach((meta, idx) => {
      const slot = TABLE_CARD_SLOTS[idx];

      // Real contact shadow on the playmat directly beneath each physical 3D card
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.24, 1.68),
        new THREE.MeshBasicMaterial({ color: 0x1A1816, transparent: true, opacity: 0.32 })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.rotation.z = slot.rotY;
      shadow.position.set(slot.x + 0.06, 0.046, slot.z + 0.07);
      this.scene.add(shadow);

      const group = new THREE.Group();
      group.position.set(slot.x, 0.09, slot.z);
      group.rotation.y = slot.rotY;

      // Thick 3D Card Body Slab
      const core = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.044, 1.60), this._toonMat(0x1A1816));
      core.userData.cardIdx = idx;
      group.add(core);
      this.pickables.push(core);

      // Front Plane (+Y): 512x704 Card Wars Illustrated Card Front (Zero mirroring)
      const frontTex = createCardFaceTexture(THREE, meta, idx, false);
      const frontPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.12, 1.56),
        new THREE.MeshBasicMaterial({ map: frontTex })
      );
      frontPlane.rotation.x = -Math.PI / 2;
      frontPlane.position.y = 0.024;
      frontPlane.userData.cardIdx = idx;
      group.add(frontPlane);
      this.pickables.push(frontPlane);

      // Back Plane (-Y): Rx(+pi/2)*Rz(pi) so flipping around Z=PI lands right-side-up (Zero mirroring)
      const backTex = createCardFaceTexture(THREE, meta, idx, true);
      const backPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.12, 1.56),
        new THREE.MeshBasicMaterial({ map: backTex })
      );
      backPlane.rotation.set(Math.PI / 2, 0, Math.PI);
      backPlane.position.y = -0.024;
      backPlane.userData.cardIdx = idx;
      group.add(backPlane);
      this.pickables.push(backPlane);

      // Bright golden rim highlight when hovered or active
      const glowRing = new THREE.Mesh(
        new THREE.PlaneGeometry(1.28, 1.72),
        new THREE.MeshBasicMaterial({ color: 0xFDE047, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
      );
      glowRing.rotation.x = -Math.PI / 2;
      glowRing.position.y = -0.028;
      group.add(glowRing);

      const faceUp = this.showAllFaceUp || this.openedSet.has(idx);
      group.rotation.z = faceUp ? 0 : Math.PI;

      this.scene.add(group);
      this.cardEntries.push({ idx, slot, group, shadow, glowRing });
    });
  }

  _raycastCard(clientX, clientY) {
    if (!this.interactiveTable || this.mode !== 'webgl' || !this.raycaster || !this.camera || !this.renderer?.domElement) {
      return -1;
    }
    const rect = this.renderer.domElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return -1;
    const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.pointerVec.set(nx, ny);
    this.raycaster.setFromCamera(this.pointerVec, this.camera);
    const hits = this.raycaster.intersectObjects(this.pickables, false);
    return hits.length > 0 ? hits[0].object.userData.cardIdx : -1;
  }

  _onMouseMove = (e) => {
    this.mouseNdc.x = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    this.mouseNdc.y = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;

    const hitIdx = this._raycastCard(e.clientX, e.clientY);
    if (hitIdx !== this.hoveredIdx) {
      this.hoveredIdx = hitIdx;
      if (this.renderer?.domElement) {
        this.renderer.domElement.style.cursor = hitIdx >= 0 ? 'pointer' : 'default';
      }
      this.onCardHover && this.onCardHover(hitIdx >= 0 ? hitIdx : null);
    }
  };

  _onCanvasClick = (e) => {
    if (!this.interactiveTable) return;
    const hitIdx = this._raycastCard(e.clientX, e.clientY);
    const picked = hitIdx >= 0 ? hitIdx : this.hoveredIdx;
    if (picked < 0) return;
    this.onCardPick && this.onCardPick(picked);
  };

  _activate2DFallback() {
    this._stopLoop();
    if (this.renderer) {
      this.renderer.domElement.removeEventListener('click', this._onCanvasClick);
      this.renderer.dispose();
      this.renderer = null;
    }
    if (this.webglContainer) {
      this.webglContainer.innerHTML = '';
      this.webglContainer.classList.add('hidden');
    }
    if (this.fallbackContainer) {
      this.fallbackContainer.classList.remove('hidden');
      this._sync2DFallback();
    }
    this.mode = '2d';
    this.onModeChange && this.onModeChange('2d');
  }

  _sync2DFallback() {
    if (!this.fallbackContainer) return;
    render2DFallbackWorld(this.fallbackContainer, {
      mood: this.mood,
      cards: this.cardsMeta,
      openedSet: this.openedSet,
      activeIdx: this.activeIdx,
      showAllFaceUp: this.showAllFaceUp,
      onCardPick: this.onCardPick
    });
  }

  setShowAllFaceUp(flag) {
    this.showAllFaceUp = !!flag;
    if (this.mode === '2d') this._sync2DFallback();
  }

  syncDeckState({ openedSet, activeIdx }) {
    if (openedSet) this.openedSet = new Set(openedSet);
    if (typeof activeIdx === 'number') this.activeIdx = activeIdx;
    if (this.mode === '2d') this._sync2DFallback();
  }

  setTableInteractive(flag) {
    this.interactiveTable = !!flag;
    if (!flag && this.hoveredIdx !== -1) {
      this.hoveredIdx = -1;
      if (this.renderer?.domElement) this.renderer.domElement.style.cursor = 'default';
      this.onCardHover && this.onCardHover(null);
    }
  }

  setButlerMood(mood) {
    const safeMood = BUTLER_MOODS.includes(mood) ? mood : 'greet';
    this.mood = safeMood;
    if (this.mode === 'webgl' && this.faceCtx) {
      drawButlerFaceCanvas(this.faceCtx, safeMood, this.isBlinking);
      this.faceTex.needsUpdate = true;
    } else if (this.mode === '2d') {
      this._sync2DFallback();
    }
  }

  setCameraMode(mode) {
    this.cameraMode = mode;
    if (mode === 'table' || mode === 'intro' || mode === 'overview' || mode === 'peek') {
      this.camTargetPos = { x: 0.0, y: 3.72, z: 5.82 };
      this.camTargetLook = { x: 0.0, y: 0.52, z: -0.45 };
    } else {
      this.camTargetPos = { x: 1.05, y: 4.15, z: 6.15 };
      this.camTargetLook = { x: 0.45, y: 0.45, z: -0.35 };
    }
  }

  triggerCardDeal({ activeIdx, openedSet } = {}) {
    if (openedSet) this.openedSet = new Set(openedSet);
    if (typeof activeIdx === 'number') this.activeIdx = activeIdx;
    if (!this.prefersReducedMotion) this.shakeAmp = 0.05;
    if (this.mode === '2d') this._sync2DFallback();
  }

  async set2DMode(use2D) {
    if (use2D) this._activate2DFallback();
    else await this.init(false);
  }

  pause() { this.paused = true; this._stopLoop(); }
  resume() { this.paused = false; if (this.mode === 'webgl') this._startLoop(); }

  resize() {
    if (!this.renderer || !this.camera) return;
    const w = Math.max(320, window.innerWidth);
    const h = Math.max(240, window.innerHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  _startLoop() {
    if (this.rafId || this.paused || this.mode !== 'webgl') return;
    const tick = (now) => {
      if (this.paused || this.mode !== 'webgl') { this.rafId = null; return; }
      this.rafId = requestAnimationFrame(tick);
      this._stepFrame((now - this.clockStart) / 1000);
      this.renderer.render(this.scene, this.camera);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  _stopLoop() {
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
  }

  _stepFrame(elapsed) {
    const blinkCycle = elapsed % 3.4;
    const wantBlink = !this.prefersReducedMotion && blinkCycle > 3.24;
    if (wantBlink !== this.isBlinking && this.faceCtx) {
      this.isBlinking = wantBlink;
      drawButlerFaceCanvas(this.faceCtx, this.mood, wantBlink);
      this.faceTex.needsUpdate = true;
    }

    if (this.butlerUpper) {
      const bob = this.prefersReducedMotion ? 0 : Math.sin(elapsed * 2.5) * 0.045;
      this.butlerUpper.position.y = bob;
      if (this.leftArmPivot) {
        const wave = !this.prefersReducedMotion ? Math.sin(elapsed * (this.mood === 'greet' ? 5.6 : 2.6)) * (this.mood === 'greet' ? 0.24 : 0.08) : 0;
        const baseZ = this.mood === 'greet' || this.mood === 'aha' ? 0.18 : -0.12;
        this.leftArmPivot.rotation.z += ((baseZ + wave) - this.leftArmPivot.rotation.z) * 0.14;
      }
      if (this.animatedProps.cardsFan && !this.prefersReducedMotion) {
        this.animatedProps.cardsFan.position.y = 0.36 + Math.sin(elapsed * 3.1) * 0.04;
        this.animatedProps.cardsFan.rotation.z = Math.sin(elapsed * 2.2) * 0.07;
      }
    }

    // Lively background motion: drifting clouds, bobbing sailboat, swaying palms, rotating crystal, coffee steam & sparkles!
    if (!this.prefersReducedMotion && this.animatedProps) {
      for (const c of this.animatedProps.clouds) {
        c.group.position.x = ((c.baseX + elapsed * c.speed + 14) % 28) - 14;
      }
      if (this.animatedProps.boat) {
        this.animatedProps.boat.position.y = -0.42 + Math.sin(elapsed * 2.1) * 0.05;
        this.animatedProps.boat.rotation.z = Math.sin(elapsed * 1.7) * 0.08;
        this.animatedProps.boat.position.x = -4.8 + Math.sin(elapsed * 0.22) * 1.4;
      }
      for (const p of this.animatedProps.palms) {
        p.group.rotation.z = Math.sin(elapsed * 1.3 + p.phase) * 0.035;
      }
      if (this.animatedProps.crystal) {
        this.animatedProps.crystal.rotation.y = elapsed * 0.9;
        this.animatedProps.crystal.position.y = 0.66 + Math.sin(elapsed * 2.6) * 0.06;
      }
      for (const s of this.animatedProps.steam) {
        const cyc = (elapsed * 0.45 + s.offset) % 1;
        s.mesh.position.y = 0.56 + cyc * 0.72;
        s.mesh.position.x = 5.55 + Math.sin(elapsed * 2.4 + s.offset * 6) * 0.07;
        s.mesh.material.opacity = (1 - cyc) * 0.6;
      }
      for (const sp of this.animatedProps.sparkle) {
        sp.mesh.position.y = sp.baseY + Math.sin(elapsed * 2.2 + sp.phase) * 0.14;
        sp.mesh.rotation.y = elapsed * 1.6 + sp.phase;
      }
    }

    for (const entry of this.cardEntries) {
      const isHovered = this.interactiveTable && entry.idx === this.hoveredIdx;
      const faceUp = this.showAllFaceUp || this.openedSet.has(entry.idx);
      const isActive = entry.idx === this.activeIdx;

      const targetFlipZ = faceUp ? 0 : Math.PI;
      const targetY = isHovered ? 0.54 : isActive ? 0.16 : 0.09;
      const targetRotX = isHovered ? 0.34 : 0.0;
      const targetScale = isHovered ? 1.12 : 1.0;

      entry.group.position.y += (targetY - entry.group.position.y) * 0.18;
      entry.group.rotation.z += (targetFlipZ - entry.group.rotation.z) * 0.14;
      entry.group.rotation.x += (targetRotX - entry.group.rotation.x) * 0.18;
      const s = entry.group.scale.x + (targetScale - entry.group.scale.x) * 0.18;
      entry.group.scale.setScalar(s);

      const wantGlow = isHovered ? 0.92 : isActive ? 0.52 : 0.0;
      entry.glowRing.material.opacity += (wantGlow - entry.glowRing.material.opacity) * 0.18;
      entry.shadow.material.opacity = isHovered ? 0.18 : 0.32;
    }

    const parallaxX = this.prefersReducedMotion ? 0 : this.mouseNdc.x * 0.24;
    const parallaxZ = this.prefersReducedMotion ? 0 : this.mouseNdc.y * 0.16;
    this.shakeAmp *= 0.86;
    const shakeY = this.shakeAmp > 0.002 ? Math.sin(elapsed * 55) * this.shakeAmp : 0;

    this.camera.position.x += (this.camTargetPos.x + parallaxX - this.camera.position.x) * 0.08;
    this.camera.position.y += (this.camTargetPos.y + shakeY - this.camera.position.y) * 0.08;
    this.camera.position.z += (this.camTargetPos.z + parallaxZ - this.camera.position.z) * 0.08;

    this.camCurrentLook.x += (this.camTargetLook.x - this.camCurrentLook.x) * 0.08;
    this.camCurrentLook.y += (this.camTargetLook.y - this.camCurrentLook.y) * 0.08;
    this.camCurrentLook.z += (this.camTargetLook.z - this.camCurrentLook.z) * 0.08;
    this.camera.lookAt(this.camCurrentLook.x, this.camCurrentLook.y, this.camCurrentLook.z);
  }

  dispose() {
    this._stopLoop();
    window.removeEventListener('mousemove', this._onMouseMove);
    if (this.renderer) {
      this.renderer.domElement.removeEventListener('click', this._onCanvasClick);
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
