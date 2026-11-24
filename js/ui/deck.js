// Card Wars 3D Tabletop Card-Deck Engine (v8)
// Strictly ordered progression: Intro -> Arti Algoritma -> Cara Kerja & Implementasi -> Visualisasi & Bukti!
// Always opens on the full live 3D Tabletop with 9 large illustrated clickable 3D cards!

import { renderCardBackEmblem } from '../viz/svg-illustrator.js?v=10';

export const SLIDE_META = [
  {
    id: 'intuition', num: '01', roman: 'I', suit: 'concept', suitSym: '◆', suitLabel: '01 INTRO OPTIMASI',
    shortTitle: 'Intro & Arti',
    title: 'Intro: Apa Itu Optimasi, Fitness, Eksplorasi & Eksploitasi?',
    teaser: 'Mulai dari nol: pahami dulu tujuan optimasi dan 4 istilah kunci sebelum menguji grafik lembah bola.'
  },
  {
    id: 'taxonomy', num: '02', roman: 'II', suit: 'concept', suitSym: '◆', suitLabel: '02 POLA B VS C',
    shortTitle: 'Pola B vs C',
    title: 'Heuristik vs Metaheuristik: Pola B (Estafet) vs Pola C (Tim)',
    teaser: 'Pahami dulu Teorema No Free Lunch serta beda heuristik & metaheuristik sebelum melihat diagram perbandingan.'
  },
  {
    id: 'cover', num: '03', roman: 'III', suit: 'mct', suitSym: '■', suitLabel: '03 ARTI 4 ALGO',
    shortTitle: 'MCT/PSO/GOA/ALO',
    title: 'Mengenal Arti 4 Algoritma Inti: MCT, PSO, GOA, dan ALO',
    teaser: 'Bedah definisi, analogi, kelebihan, dan kelemahan MCT, PSO, GOA, serta ALO sebelum melihat animasinya.'
  },
  {
    id: 'mct-goa', num: '04', roman: 'IV', suit: 'mct', suitSym: '■', suitLabel: '04 POLA B: PSO/GOA',
    shortTitle: 'Cara Kerja Pola B',
    title: 'Cara Kerja & Implementasi Pola B: MCT-PSO [Paper] & MCT-GOA [Usulan]',
    teaser: 'Ikuti hitung manual 4 tugas pada 2 VM (MS = 3,5 dtk vs 10 dtk), encoding kontinu, lalu uji MCT-PSO vs MCT-GOA.'
  },
  {
    id: 'hybrid-goa-alo', num: '05', roman: 'V', suit: 'alo', suitSym: '▼', suitLabel: '05 POLA C [PAPER]',
    shortTitle: 'Cara Kerja Pola C',
    title: 'Cara Kerja & Implementasi Pola C: 6 Tahap, Pivot L/2 & Tangga w',
    teaser: 'Pahami urutan 6 langkah Hybrid GOA-ALO dan contoh angka L=200 sebelum membuka flowchart dan kurva.'
  },
  {
    id: 'single-anatomy', num: '06', roman: 'VI', suit: 'goa', suitSym: '●', suitLabel: '06 ANATOMI VISUAL',
    shortTitle: 'Anatomi GOA & ALO',
    title: 'Contoh Angka & Visualisasi Mendalam Gaya Sosial GOA & Corong ALO',
    teaser: 'Cek contoh angka kecil s(r) dan rasio I terlebih dulu, lalu putar animasi medan gaya & corong pasir.'
  },
  {
    id: 'lab-3d', num: '07', roman: 'VII', suit: 'goa', suitSym: '●', suitLabel: '07 LAB 3D/2D',
    shortTitle: 'Lab Simulasi 3D',
    title: 'Lab Simulasi 3D & 2D: Rastrigin Bandingkan Ketiganya',
    teaser: 'Pahami skenario uji Rastrigin (F13) & cara baca grafik konvergensi, lalu jalankan simulasi langsung!'
  },
  {
    id: 'benchmarks', num: '08', roman: 'VIII', suit: 'alo', suitSym: '▼', suitLabel: '08 BUKTI [PAPER]',
    shortTitle: 'Bukti & Kritis',
    title: 'Bukti Empiris Paper (Amaireh 2023 & Alsaidy 2020) & Catatan Kritis',
    teaser: 'Periksa angka terverifikasi 5 tab benchmark termasuk MCT-PSO (67 vs 87 dtk), CEC2015 (333 vs 402), & CPU 213 s.'
  },
  {
    id: 'synthesis', num: '09', roman: 'IX', suit: 'mct', suitSym: '■', suitLabel: '09 KESIMPULAN',
    shortTitle: 'Kesimpulan & Kuis',
    title: 'Kesimpulan, Rekomendasi Hybrid Terbaik, Kuis 8 Soal, & Rujukan',
    teaser: 'Simak kesimpulan akhir & rekomendasi hybrid terbaik, lalu uji pemahaman lewat 8 soal kuis & daftar pustaka.'
  }
];

const STORAGE_KEY = 'soka_card_wars_opened_v8';

export function positionSlidingIndicator(container, activeBtn, indicator) {
  if (!container || !activeBtn || !indicator) return;
  const cRect = container.getBoundingClientRect();
  const bRect = activeBtn.getBoundingClientRect();
  indicator.style.width = `${bRect.width}px`;
  indicator.style.transform = `translateX(${bRect.left - cRect.left}px)`;
}

export class DeckController {
  constructor({ onSlideChange, onSpaceKey, onBeatNav, onPeekChange, onIntroChange, onTrackChange } = {}) {
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.onSlideChange = onSlideChange;
    this.onSpaceKey = onSpaceKey;
    this.onBeatNav = onBeatNav;
    this.onPeekChange = onPeekChange;
    this.onIntroChange = onIntroChange;
    this.onTrackChange = onTrackChange;

    this.current = 0;
    this.isFaceDown = true;
    this.isIntro = true;
    this.peekMode = false;
    this.presMode = false;
    this.notesOpen = false;
    this.cardsPopoverOpen = false;
    this.helpPopoverOpen = false;
    this.darkTheme = false;
    this._flipTimer = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.openedCards = this._loadOpened();

    this._initUI();
    this._bindEvents();
    this._readInitialState();
  }

  _loadOpened() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return new Set(saved);
    } catch {}
    return new Set();
  }

  _saveOpened() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(this.openedCards)));
    } catch {}
  }

  _initUI() {
    this.flipper = document.getElementById('card-flipper');
    this.cardBodyScroll = document.getElementById('card-body-scroll');
    this.frontPipSuit = document.getElementById('card-front-suit');
    this.frontPipNum = document.getElementById('card-front-num');
    this.frontPipRole = document.getElementById('card-front-role');
    this.backToTableBtn = document.getElementById('card-back-to-table-btn');
    this.flipToggleBtn = document.getElementById('card-flip-toggle');

    this.backEmblem = document.getElementById('card-back-emblem');
    this.backRole = document.getElementById('card-back-role');
    this.backTitle = document.getElementById('card-back-title');
    this.backTeaser = document.getElementById('card-back-teaser');
    this.backRevealBtn = document.getElementById('card-reveal-btn');

    this.hudCounter = document.getElementById('hud-opened-count');
    this.hudCardsBtn = document.getElementById('hud-cards-btn');
    this.hudPresBtn = document.getElementById('hud-pres-btn');
    this.hudHelpBtn = document.getElementById('hud-help-btn');
    this.cardsPopover = document.getElementById('cards-popover');
    this.helpPopover = document.getElementById('help-popover');

    this.hudIntroBtn = document.getElementById('hud-intro-btn');
    this.hudPeekBtn = document.getElementById('hud-peek-btn');
    this.peekReturnBtn = document.getElementById('peek-return-btn');
    this.hudNotesBtn = document.getElementById('hud-notes-btn');
    this.hudThemeBtn = document.getElementById('hud-theme-btn');
    this.hudResetDeckBtn = document.getElementById('hud-reset-deck');
    this.hudRevealAllBtn = document.getElementById('hud-reveal-all');
    this.hudPrintBtn = document.getElementById('hud-print-btn');

    this.presExitBtn = document.getElementById('pres-exit-btn');
    this.presNotesBtn = document.getElementById('pres-notes-btn');
    this.notesDrawer = document.getElementById('speaker-notes-drawer');
    this.notesCloseBtn = document.getElementById('notes-close-btn');

    this.prevBtn = document.getElementById('hand-prev');
    this.nextBtn = document.getElementById('hand-next');
    this.handFan = document.getElementById('hand-fan');
    this.spreadGrid = document.getElementById('spread-grid');

    this._renderHand();
    this._renderSpread();
  }

  _closePopovers() {
    this.cardsPopoverOpen = false;
    this.helpPopoverOpen = false;
    this.cardsPopover?.classList.remove('is-open');
    this.helpPopover?.classList.remove('is-open');
    this.hudCardsBtn?.setAttribute('aria-expanded', 'false');
    this.hudHelpBtn?.setAttribute('aria-expanded', 'false');
  }

  _syncFocusClass() {
    // L2 Mode Fokus: dim 3D tabletop background when user is actively reading/interacting with a card
    const inFocus = !this.isIntro && !this.peekMode && !this.presMode;
    document.body.classList.toggle('is-focus-mode', inFocus);
  }

  _renderHand() {
    if (!this.handFan) return;
    const total = SLIDE_META.length;
    const mid = (total - 1) / 2;
    this.handFan.innerHTML = SLIDE_META.map((meta, idx) => {
      const opened = this.openedCards.has(idx);
      const rot = ((idx - mid) * 1.3).toFixed(1);
      const pipColor = opened ? '#8C2D19' : '#FDE047';
      return `
        <button type="button" class="hand-card ${opened ? 'is-opened' : ''}" data-card-idx="${idx}"
                style="--fan-rot: ${rot}deg"
                aria-label="Kartu ${meta.roman}: ${meta.shortTitle} (${opened ? 'Terbuka' : 'Tertutup'})">
          <div class="hand-card-top">
            <span>${meta.roman}</span>
            <span style="color:${pipColor}">${meta.suitSym}</span>
          </div>
          <div class="hand-card-title">${meta.shortTitle}</div>
          <div class="hand-card-status">${opened ? 'BUKA' : 'TUTUP'}</div>
        </button>
      `;
    }).join('');

    this.handButtons = Array.from(this.handFan.querySelectorAll('.hand-card'));
    this.handButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.cardIdx);
        if (this.isIntro) this.setIntro(false, { silent: true });
        if (idx === this.current && this.isFaceDown) this.revealCurrent();
        else this.selectCard(idx);
      });
    });
  }

  _renderSpread() {
    if (!this.spreadGrid) return;
    this.spreadGrid.innerHTML = SLIDE_META.map((meta, idx) => {
      const opened = this.openedCards.has(idx);
      const isCur = !this.isIntro && idx === this.current;
      return `
        <button type="button" class="btn btn-compact w-full justify-between ${isCur ? 'btn-gold' : ''}" data-spread-idx="${idx}">
          <span><strong>${meta.roman}.</strong> ${meta.shortTitle}</span>
          <span class="font-mono-num" style="font-size:12px">${opened ? 'Terbuka' : 'Tertutup'}</span>
        </button>
      `;
    }).join('');

    this.spreadGrid.querySelectorAll('[data-spread-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.spreadIdx);
        this._closePopovers();
        if (this.isIntro) this.setIntro(false, { silent: true });
        this.selectCard(idx, { forceFaceDownFirst: !this.openedCards.has(idx) });
      });
    });
  }

  _syncHudAndHand() {
    if (this.hudCounter) this.hudCounter.textContent = `${this.openedCards.size} / ${SLIDE_META.length}`;
    this._renderHand();
    this._renderSpread();
    this.handButtons?.forEach((btn, i) => {
      if (!this.isIntro && i === this.current) btn.setAttribute('aria-current', 'step');
      else btn.removeAttribute('aria-current');
    });
    if (this.prevBtn) this.prevBtn.disabled = !this.isIntro && this.current === 0;
    if (this.nextBtn) this.nextBtn.disabled = !this.isIntro && this.current === SLIDE_META.length - 1;
    this._syncFocusClass();
  }

  setIntro(active, { silent = false } = {}) {
    this.isIntro = !!active;
    document.body.classList.toggle('is-intro', this.isIntro);
    if (this.isIntro && window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    this._syncHudAndHand();
    if (!silent) this.onIntroChange && this.onIntroChange(this.isIntro);
  }

  togglePeek(force = null) {
    this._closePopovers();
    const next = force !== null ? !!force : !this.peekMode;
    this.peekMode = next;
    document.body.classList.toggle('is-peeking-table', next);
    if (this.hudPeekBtn) this.hudPeekBtn.textContent = next ? 'Kembali (T)' : 'Meja 3D (T)';
    this._syncFocusClass();
    this.onPeekChange && this.onPeekChange(next);
  }

  togglePresentation(force = null) {
    this._closePopovers();
    const next = force !== null ? !!force : !this.presMode;
    this.presMode = next;
    if (next) {
      if (this.peekMode) this.togglePeek(false);
      if (this.isIntro) {
        this.setIntro(false, { silent: true });
        this.selectCard(this.current, { forceFaceDownFirst: false, animateDeal: false });
      } else if (this.isFaceDown) {
        this.revealCurrent();
      }
    }
    document.body.classList.toggle('is-presentation', next);
    this._syncFocusClass();
    this.onPeekChange && this.onPeekChange(this.peekMode);
  }

  toggleNotes(force = null) {
    this._closePopovers();
    this.notesOpen = force !== null ? !!force : !this.notesOpen;
    this.notesDrawer?.classList.toggle('is-open', this.notesOpen);
  }

  toggleTheme() {
    this.darkTheme = !this.darkTheme;
    document.documentElement.setAttribute('data-theme', this.darkTheme ? 'dark' : 'light');
    if (this.hudThemeBtn) this.hudThemeBtn.textContent = this.darkTheme ? 'Tema: Gelap' : 'Tema: Terang';
  }

  _bindEvents() {
    this.hudCardsBtn?.addEventListener('click', () => {
      const next = !this.cardsPopoverOpen;
      this._closePopovers();
      this.cardsPopoverOpen = next;
      this.cardsPopover?.classList.toggle('is-open', next);
      this.hudCardsBtn?.setAttribute('aria-expanded', String(next));
      if (next) this._renderSpread();
    });
    document.getElementById('cards-popover-close')?.addEventListener('click', () => this._closePopovers());

    this.hudHelpBtn?.addEventListener('click', () => {
      const next = !this.helpPopoverOpen;
      this._closePopovers();
      this.helpPopoverOpen = next;
      this.helpPopover?.classList.toggle('is-open', next);
      this.hudHelpBtn?.setAttribute('aria-expanded', String(next));
    });
    document.getElementById('help-popover-close')?.addEventListener('click', () => this._closePopovers());

    document.querySelectorAll('.track-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.track-opt').forEach((b) => b.classList.remove('btn-gold'));
        btn.classList.add('btn-gold');
        this.onTrackChange && this.onTrackChange(btn.dataset.track);
      });
    });

    this.hudPresBtn?.addEventListener('click', () => this.togglePresentation());
    this.presExitBtn?.addEventListener('click', () => this.togglePresentation(false));
    this.presNotesBtn?.addEventListener('click', () => this.toggleNotes());
    this.hudNotesBtn?.addEventListener('click', () => this.toggleNotes());
    this.notesCloseBtn?.addEventListener('click', () => this.toggleNotes(false));
    this.hudThemeBtn?.addEventListener('click', () => this.toggleTheme());
    this.hudPrintBtn?.addEventListener('click', () => { this._closePopovers(); window.print(); });

    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());
    this.backRevealBtn?.addEventListener('click', () => this.revealCurrent());
    this.backToTableBtn?.addEventListener('click', () => {
      if (this.presMode) this.togglePresentation(false);
      this.togglePeek(true);
    });
    this.flipToggleBtn?.addEventListener('click', () => {
      const nextFaceDown = !this.isFaceDown;
      this.setFaceDown(nextFaceDown, { animate: true });
      this.onSlideChange && this.onSlideChange(this.current, SLIDE_META[this.current], nextFaceDown, false);
    });

    document.getElementById('card-back-face')?.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      this.revealCurrent();
    });

    this.hudIntroBtn?.addEventListener('click', () => {
      this._closePopovers();
      if (this.peekMode) this.togglePeek(false);
      if (this.presMode) this.togglePresentation(false);
      this.setIntro(true);
    });

    this.hudPeekBtn?.addEventListener('click', () => this.togglePeek());
    this.peekReturnBtn?.addEventListener('click', () => this.togglePeek(false));

    this.hudResetDeckBtn?.addEventListener('click', () => {
      this._closePopovers();
      if (this.peekMode) this.togglePeek(false);
      this.openedCards = new Set();
      this._saveOpened();
      this.setFaceDown(true, { animate: false });
      this.setIntro(true);
    });

    this.hudRevealAllBtn?.addEventListener('click', () => {
      this._closePopovers();
      if (this.peekMode) this.togglePeek(false);
      if (this.isIntro) this.setIntro(false, { silent: true });
      SLIDE_META.forEach((_m, i) => this.openedCards.add(i));
      this._saveOpened();
      this.setFaceDown(false, { animate: true });
      this._syncHudAndHand();
      this.onSlideChange && this.onSlideChange(this.current, SLIDE_META[this.current], false, false);
    });

    document.addEventListener('keydown', (e) => {
      const tag = document.activeElement?.tagName;
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if (e.key === 'Escape') {
        if (this.cardsPopoverOpen || this.helpPopoverOpen) { e.preventDefault(); this._closePopovers(); return; }
        if (this.notesOpen) { e.preventDefault(); this.toggleNotes(false); return; }
        if (this.presMode) { e.preventDefault(); this.togglePresentation(false); return; }
        if (this.peekMode) { e.preventDefault(); this.togglePeek(false); return; }
      }
      if (isEditing) return;

      if ((e.key === 'p' || e.key === 'P') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        this.togglePresentation();
      } else if ((e.key === 's' || e.key === 'S') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        this.toggleNotes();
      } else if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey && !this.presMode) {
        e.preventDefault();
        this.togglePeek();
      } else if (this.isIntro && !this.peekMode && (e.key === 'Enter' || e.key === ' ')) {
        if (document.activeElement?.tagName !== 'BUTTON') {
          e.preventDefault();
          this.onSpaceKey && this.onSpaceKey();
        }
      } else if (e.key === 'Enter' && this.isFaceDown && !this.peekMode && !this.isIntro) {
        e.preventDefault();
        this.revealCurrent();
      } else if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !this.isIntro && !this.presMode) {
        e.preventDefault();
        if (this.peekMode) this.togglePeek(false);
        if (this.isFaceDown) this.revealCurrent();
        else {
          this.setFaceDown(true, { animate: true });
          this.onSlideChange && this.onSlideChange(this.current, SLIDE_META[this.current], true, false);
        }
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        this.next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.prev();
      } else if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (this.isIntro) this.setIntro(false, { silent: true });
        this.selectCard(Number(e.key) - 1);
      } else if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey && !this.peekMode && !this.isIntro && !this.isFaceDown) {
        e.preventDefault();
        this.onBeatNav && this.onBeatNav(1);
      } else if ((e.key === 'b' || e.key === 'B') && !e.ctrlKey && !e.metaKey && !this.peekMode && !this.isIntro && !this.isFaceDown) {
        e.preventDefault();
        this.onBeatNav && this.onBeatNav(-1);
      } else if (e.key === ' ' && !this.peekMode && !this.isIntro && document.activeElement?.tagName !== 'BUTTON') {
        e.preventDefault();
        if (this.isFaceDown) this.revealCurrent();
        else this.onSpaceKey && this.onSpaceKey();
      }
    });
  }

  _readInitialState() {
    // Always launch on the live 3D Tabletop with all 9 physical illustrated 3D cards visible!
    // Clear any stale #hash left over from previous browsing so Ctrl+Shift+R never hides the 3D table.
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    this.current = 0;
    this._prepareCardDOM(0);
    this.setFaceDown(true, { animate: false });
    this.setIntro(true);
  }

  _prepareCardDOM(target) {
    const meta = SLIDE_META[target];
    this.slides.forEach((slide, i) => {
      const active = i === target;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    if (this.cardBodyScroll) this.cardBodyScroll.scrollTop = 0;

    if (this.frontPipSuit) this.frontPipSuit.textContent = meta.suitSym;
    if (this.frontPipNum) this.frontPipNum.textContent = `KARTU ${meta.roman} / IX`;
    if (this.frontPipRole) this.frontPipRole.textContent = meta.suitLabel;

    renderCardBackEmblem(this.backEmblem, { suit: meta.suit, roman: meta.roman });
    if (this.backRole) this.backRole.textContent = `KARTU ${meta.roman} / ${meta.suitLabel}`;
    if (this.backTitle) this.backTitle.textContent = meta.title;
    if (this.backTeaser) this.backTeaser.textContent = meta.teaser;
  }

  setFaceDown(faceDown, { animate = false } = {}) {
    const changed = faceDown !== this.isFaceDown;
    this.isFaceDown = faceDown;
    if (this.flipToggleBtn) this.flipToggleBtn.textContent = faceDown ? 'Buka (F)' : 'Balik (F)';

    if (this._flipTimer) { clearTimeout(this._flipTimer); this._flipTimer = null; }
    if (!this.flipper) return;
    this.flipper.classList.remove('is-flipping-out', 'is-flipping-in');

    if (animate && changed && !this.prefersReducedMotion) {
      this.flipper.classList.add('is-flipping-out');
      this._flipTimer = setTimeout(() => {
        this._flipTimer = null;
        this.flipper.classList.remove('is-flipping-out');
        this.flipper.classList.toggle('is-facedown', faceDown);
        void this.flipper.offsetWidth;
        this.flipper.classList.add('is-flipping-in');
      }, 135);
    } else {
      this.flipper.classList.toggle('is-facedown', faceDown);
    }
  }

  revealCurrent() {
    if (this.peekMode) this.togglePeek(false);
    if (this.isIntro) this.setIntro(false, { silent: true });
    this.openedCards.add(this.current);
    this._saveOpened();
    this.setFaceDown(false, { animate: true });
    this._syncHudAndHand();
    this.onSlideChange && this.onSlideChange(this.current, SLIDE_META[this.current], false, false);
  }

  prev() {
    if (this.isIntro) {
      this.setIntro(false, { silent: true });
      this.selectCard(0, { forceFaceDownFirst: false });
      return;
    }
    if (this.current > 0) this.selectCard(this.current - 1);
  }

  next() {
    if (this.isIntro) {
      this.setIntro(false, { silent: true });
      this.selectCard(0, { forceFaceDownFirst: false });
      return;
    }
    if (this.current < SLIDE_META.length - 1) this.selectCard(this.current + 1);
  }

  goTo(index) {
    if (this.isIntro) this.setIntro(false, { silent: true });
    this.openedCards.add(index);
    this._saveOpened();
    this.selectCard(index, { forceFaceDownFirst: false, animateDeal: true });
  }

  selectCard(index, { updateHash = true, forceFaceDownFirst = null, animateDeal = true } = {}) {
    if (this.peekMode) this.togglePeek(false);
    if (this.isIntro) this.setIntro(false, { silent: true });
    const target = Math.max(0, Math.min(SLIDE_META.length - 1, index));
    const alreadyOpened = this.openedCards.has(target);
    const showBackFirst = forceFaceDownFirst !== null ? forceFaceDownFirst : !alreadyOpened;

    this.current = target;
    const meta = SLIDE_META[target];
    this._prepareCardDOM(target);
    this.setFaceDown(showBackFirst, { animate: false });

    if (animateDeal && !this.prefersReducedMotion && this.flipper) {
      this.flipper.classList.remove('is-dealing', 'is-flipping-in');
      void this.flipper.offsetWidth;
      this.flipper.classList.add('is-dealing');
    }

    if (updateHash && window.location.hash !== `#${meta.id}`) {
      history.replaceState(null, '', `#${meta.id}`);
    }

    this._syncHudAndHand();
    this.onSlideChange && this.onSlideChange(target, meta, showBackFirst, animateDeal);
  }
}
