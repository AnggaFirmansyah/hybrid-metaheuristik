// Benchmark functions (Tables 4 & 5) and verified empirical data
// Sources:
//   [Makalah-ALO-GOA] Amaireh, Al-Zoubi, & Dib (2023), Evolutionary Intelligence 16:1383-1422
//   [Makalah-MCT-PSO] Alsaidy, Abbood, & Sahib (2020), J. King Saud Univ. - CIS

export function createRng(seed = 42) {
  let s = (Number(seed) >>> 0) || 1;
  return function nextRandom() {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const BENCHMARK_FUNCTIONS = {
  F1: {
    id: 'F1',
    name: 'F1 (Sphere, Unimodal)',
    category: 'Unimodal',
    formula: 'f(x) = x1^2 + x2^2',
    lb: -100,
    ub: 100,
    fMin: 0,
    opt: [0, 0],
    zScale: 1,
    evaluate(vec) {
      let sum = 0;
      for (let i = 0; i < vec.length; i++) sum += vec[i] * vec[i];
      return sum;
    }
  },
  F13: {
    id: 'F13',
    name: 'F13 (Rastrigin, Multimodal)',
    category: 'Multimodal',
    formula: 'f(x) = sum(x_i^2 - 10*cos(2*pi*x_i) + 10)',
    lb: -5.12,
    ub: 5.12,
    fMin: 0,
    opt: [0, 0],
    zScale: 1,
    evaluate(vec) {
      let sum = 0;
      for (let i = 0; i < vec.length; i++) {
        const x = vec[i];
        sum += x * x - 10 * Math.cos(2 * Math.PI * x) + 10;
      }
      return sum;
    }
  },
  F14: {
    id: 'F14',
    name: 'F14 (Ackley, Multimodal)',
    category: 'Multimodal',
    formula: 'f(x) = -20*exp(-0.2*sqrt(mean(x^2))) - exp(mean(cos(2*pi*x))) + 20 + e',
    lb: -32,
    ub: 32,
    fMin: 0,
    opt: [0, 0],
    zScale: 1,
    evaluate(vec) {
      const d = vec.length;
      let sumSq = 0;
      let sumCos = 0;
      for (let i = 0; i < d; i++) {
        sumSq += vec[i] * vec[i];
        sumCos += Math.cos(2 * Math.PI * vec[i]);
      }
      return -20 * Math.exp(-0.2 * Math.sqrt(sumSq / d)) - Math.exp(sumCos / d) + 20 + Math.E;
    }
  },
  F15: {
    id: 'F15',
    name: 'F15 (Griewank, Multimodal)',
    category: 'Multimodal',
    formula: 'f(x) = sum(x_i^2)/4000 - prod(cos(x_i/sqrt(i))) + 1',
    lb: -600,
    ub: 600,
    fMin: 0,
    opt: [0, 0],
    zScale: 1,
    evaluate(vec) {
      let sum = 0;
      let prod = 1;
      for (let i = 0; i < vec.length; i++) {
        sum += (vec[i] * vec[i]) / 4000;
        prod *= Math.cos(vec[i] / Math.sqrt(i + 1));
      }
      return sum - prod + 1;
    }
  },
  F31: {
    id: 'F31',
    name: 'F31 (Cosine Mixture, Multimodal)',
    category: 'Multimodal',
    formula: 'f(x) = x1^2 + x2^2 - cos(18*x1) - cos(18*x2)',
    lb: -1,
    ub: 1,
    fMin: -2,
    opt: [0, 0],
    zScale: 1,
    evaluate(vec) {
      let sum = 0;
      for (let i = 0; i < vec.length; i++) {
        const x = vec[i];
        sum += x * x - Math.cos(18 * x);
      }
      return sum;
    }
  }
};

// Verified M3-M4 Cloud Task Scheduling Walkthrough Example (PRD Section 6 M3 & M4)
export const MCT_WALKTHROUGH_EXAMPLE = {
  tasks: [4000, 2000, 3000, 1000], // MI
  vmSpeeds: [1000, 2000],          // MIPS
  badMakespan: 10.0,               // Semua ke VM1: 4+2+3+1 = 10 detik
  mctMakespan: 3.5,                // MCT: T1->VM2(2), T2->VM1(2), T3->VM2(3.5), T4->VM1(3) => max(3, 3.5) = 3.5 detik
  steps: [
    { task: 'T1 (4000 MI)', ect1: 4.0, ect2: 2.0, load1After: 0.0, load2After: 2.0, chosenVm: 1, reason: 'VM1 selesai 4,0 dtk vs VM2 selesai 2,0 dtk -> pilih VM2 (beban VM2 = 2,0 dtk).' },
    { task: 'T2 (2000 MI)', ect1: 2.0, ect2: 1.0, load1After: 2.0, load2After: 2.0, chosenVm: 0, reason: 'VM1 selesai 0+2 = 2,0 dtk vs VM2 selesai 2+1 = 3,0 dtk -> pilih VM1 (beban VM1 = 2,0 dtk).' },
    { task: 'T3 (3000 MI)', ect1: 3.0, ect2: 1.5, load1After: 2.0, load2After: 3.5, chosenVm: 1, reason: 'VM1 selesai 2+3 = 5,0 dtk vs VM2 selesai 2+1,5 = 3,5 dtk -> pilih VM2 (beban VM2 = 3,5 dtk).' },
    { task: 'T4 (1000 MI)', ect1: 1.0, ect2: 0.5, load1After: 3.0, load2After: 3.5, chosenVm: 0, reason: 'VM1 selesai 2+1 = 3,0 dtk vs VM2 selesai 3,5+0,5 = 4,0 dtk -> pilih VM1. Makespan = max(3,0; 3,5) = 3,5 detik!' }
  ]
};

// Verified literature evidence for seeding idea: [Makalah-MCT-PSO] Alsaidy, Abbood, & Sahib (2020)
export const MCT_PSO_PAPER_DATA = {
  citation: 'Alsaidy, Abbood, & Sahib (2020), J. King Saud Univ. - CIS [Paper: 1000 tugas, 20 VM]',
  note: 'Makalah ini memakai PSO (bukan GOA). MCT-seeded GOA di web ini adalah [Usulan] adaptasi dari ide seeding tersebut.',
  rows: [
    { algo: 'PSO Acak (Tanpa Seed)', makespan: 87, highlight: 'other' },
    { algo: 'SJFP-PSO', makespan: 81, highlight: 'other' },
    { algo: 'LJFP-PSO', makespan: 80, highlight: 'goa' },
    { algo: 'MCT-PSO', makespan: 67, highlight: 'mct' }
  ],
  criticalNotes: [
    'Pada beberapa ukuran beban (200 dan 400 tugas), nilai makespan MCT-PSO (2,2 dtk dan 4,2 dtk) identik dengan MCT murni, artinya kontribusi perbaikan PSO kecil di kasus tersebut.',
    'Pada Gambar 13 makalah, titik awal heuristik (114-124) tampak lebih buruk dari titik awal acak (100); perlu dibaca kritis dan tidak diterima mentah-mentah.',
    'Penulis makalah mengakui memulai seluruh partikel dari satu titik MCT dapat membatasi keragaman; karena itu usulan adaptasi MCT-GOA hanya mengisi sebagian populasi (mis. 10-30%).'
  ]
};

// Exact empirical results verified from Amaireh, Al-Zoubi, & Dib (2023) [Makalah-ALO-GOA]
export const PAPER_EMPIRICAL_DATA = {
  unimodal: {
    title: 'Benchmark Klasik Unimodal F1-F11 [Paper: Tabel 6]',
    subtitle: 'Total Rank lebih rendah = peringkat lebih unggul (40 agen, 30 run independen, 13 metode).',
    sourceBadge: '[Paper: Tabel 6]',
    metricLabel: 'Total Rank (Makin pendek makin baik)',
    lowerIsBetter: true,
    rows: [
      { algo: 'Hybrid GOA-ALO', value: 15, highlight: 'hybrid', note: '[Paper: Tabel 6] Total rank terbaik (15 dari 13 metode); F1 Mean 2.6959e-39; F11 = 0 pada 30 run.' },
      { algo: 'CS', value: 44, highlight: 'other', note: '[Paper: Tabel 6] Peringkat #2 pada kelompok unimodal F1-F11.' },
      { algo: 'ALO', value: 63, highlight: 'alo', note: '[Paper: Tabel 6] F1 Mean 1.8739e-06; eksploitasi tajam namun rentan konvergensi dini.' },
      { algo: 'GOA', value: 70, highlight: 'goa', note: '[Paper: Tabel 6] F1 Mean 1.0305; c linear standar menyisakan sedikit iterasi eksploitasi.' },
      { algo: 'BBO', value: 75, highlight: 'other', note: '[Paper: Tabel 6] Biogeography-Based Optimization.' },
      { algo: 'ABC', value: 82, highlight: 'other', note: '[Paper: Tabel 6] Artificial Bee Colony.' },
      { algo: 'PSO', value: 147, highlight: 'other', note: '[Paper: Tabel 6] Particle Swarm Optimization.' },
      { algo: 'BA', value: 171, highlight: 'other', note: '[Paper: Tabel 6] Bat Algorithm.' }
    ],
    keyMetrics: [
      { label: 'Total Rank Hybrid [Paper]', value: '15 (Terbaik)' },
      { label: 'Mean F1 Hybrid [Paper]', value: '2.6959e-39' },
      { label: 'Mean F1 ALO / GOA [Paper]', value: '1.87e-06 / 1.03' },
      { label: 'Hasil F11 30 Run [Paper]', value: '0 (eksak)' }
    ]
  },
  multimodal: {
    title: 'Benchmark Klasik Multimodal & Komposit F12-F32 [Paper: Tabel 7]',
    subtitle: 'Mengukur ketahanan terhadap jebakan optimum lokal (40 agen, 30 run independen).',
    sourceBadge: '[Paper: Tabel 7]',
    metricLabel: 'Total Rank (Makin pendek makin baik)',
    lowerIsBetter: true,
    rows: [
      { algo: 'Hybrid GOA-ALO', value: 57, highlight: 'hybrid', note: '[Paper: Tabel 7] Total rank terendah (57 dari 13 metode); F13 (Rastrigin) Mean = 0.' },
      { algo: 'ABC', value: 70, highlight: 'other', note: '[Paper: Tabel 7] Peringkat #2 pada kelompok multimodal F12-F32.' },
      { algo: 'CS', value: 73, highlight: 'other', note: '[Paper: Tabel 7] Cuckoo Search.' },
      { algo: 'BBO', value: 79, highlight: 'other', note: '[Paper: Tabel 7] Biogeography-Based Optimization.' },
      { algo: 'ALO', value: 111, highlight: 'alo', note: '[Paper: Tabel 7] F13 (Rastrigin) Mean 71.1726; kehilangan keragaman.' },
      { algo: 'GA', value: 129, highlight: 'other', note: '[Paper: Tabel 7] Genetic Algorithm.' },
      { algo: 'GOA', value: 140, highlight: 'goa', note: '[Paper: Tabel 7] F13 (Rastrigin) Mean 89.0238.' },
      { algo: 'PSO', value: 168, highlight: 'other', note: '[Paper: Tabel 7] Particle Swarm Optimization.' },
      { algo: 'BA', value: 201, highlight: 'other', note: '[Paper: Tabel 7] Bat Algorithm.' }
    ],
    keyMetrics: [
      { label: 'Total Rank Hybrid [Paper]', value: '57 (Terbaik)' },
      { label: 'Mean F13 Hybrid [Paper]', value: '0 (Global)' },
      { label: 'Mean F13 ALO [Paper]', value: '71.1726' },
      { label: 'Mean F13 GOA [Paper]', value: '89.0238' }
    ]
  },
  cec2015: {
    title: '13 Fungsi Uji Standar CEC2015 [Paper: Tabel 9]',
    subtitle: 'Catatan kritis: SPS-L-SHADE-EIG (333) lebih baik dari Hybrid GOA-ALO (402) pada total rank!',
    sourceBadge: '[Paper: Tabel 9]',
    metricLabel: 'Total Rank (Makin pendek makin baik)',
    lowerIsBetter: true,
    rows: [
      { algo: 'SPS-L-SHADE-EIG', value: 333, highlight: 'other', note: '[Paper: Tabel 9] Peringkat #1 keseluruhan (333), mengungguli Hybrid (402) di total rank.' },
      { algo: 'Hybrid GOA-ALO', value: 402, highlight: 'hybrid', note: '[Paper: Tabel 9] Peringkat #2 (402), tetap jauh lebih baik daripada GOA (513) & ALO (570).' },
      { algo: 'SSA', value: 511, highlight: 'other', note: '[Paper: Tabel 9] Salp Swarm Algorithm.' },
      { algo: 'GOA', value: 513, highlight: 'goa', note: '[Paper: Tabel 9] Grasshopper Optimization Algorithm tunggal.' },
      { algo: 'ALO', value: 570, highlight: 'alo', note: '[Paper: Tabel 9] Ant Lion Optimizer tunggal.' },
      { algo: 'GWO', value: 634, highlight: 'other', note: '[Paper: Tabel 9] Grey Wolf Optimizer.' },
      { algo: 'WOA', value: 833, highlight: 'other', note: '[Paper: Tabel 9] Whale Optimization Algorithm.' },
      { algo: 'SCA', value: 877, highlight: 'other', note: '[Paper: Tabel 9] Sine Cosine Algorithm.' }
    ],
    keyMetrics: [
      { label: 'Peringkat #1 [Paper]', value: 'SPS-L-SHADE-EIG (333)' },
      { label: 'Total Rank Hybrid [Paper]', value: '402 (#2 dari 8)' },
      { label: 'Hybrid vs GOA [Paper]', value: '111 poin lebih baik' },
      { label: 'Hybrid vs ALO [Paper]', value: '168 poin lebih baik' }
    ]
  },
  antenna: {
    title: 'Sintesis Antena LAA 32-Elemen & CCAA [Paper: Tabel 1, 2, & 3]',
    subtitle: 'Statistik 20 run LAA: mean fitness Hybrid -186.876 dB vs ALO -92.7235 dB & GOA -81.0769 dB.',
    sourceBadge: '[Paper: Tabel 1-3]',
    metricLabel: 'Kedalaman Null LAA (dB, makin negatif makin dalam)',
    lowerIsBetter: true,
    rows: [
      { algo: 'Hybrid GOA-ALO', value: -147.91, highlight: 'hybrid', note: '[Paper: Tabel 1-3] LAA Null -147.91 dB, Max SLL -14.73 dB; CCAA Max SLL -31.84 dB (terbaik).' },
      { algo: 'ALO', value: -142.81, highlight: 'alo', note: '[Paper: Tabel 1-3] LAA Null -142.81 dB, Max SLL -14.27 dB; CCAA Max SLL -30.37 dB.' },
      { algo: 'GOA', value: -138.75, highlight: 'goa', note: '[Paper: Tabel 1-2] LAA Null -138.75 dB, Max SLL -9.09 dB.' },
      { algo: 'BBO', value: -109.60, highlight: 'other', note: '[Paper: Tabel 2-3] LAA Null -109.60 dB; CCAA Max SLL -29.61 dB (EP -28.92 dB).' },
      { algo: 'Taguchi', value: -78.33, highlight: 'other', note: '[Paper: Tabel 2] Metode optimasi Taguchi.' }
    ],
    keyMetrics: [
      { label: 'LAA Null / SLL [Paper T1-2]', value: '-147.91 / -14.73 dB' },
      { label: 'LAA 20-Run Mean [Paper T1]', value: '-186.876 dB' },
      { label: 'CCAA Max SLL [Paper T3]', value: '-31.84 dB (terbaik)' },
      { label: 'Trade-off CPU [Paper 5.3]', value: '213 s vs ALO 67 s' }
    ]
  },
  mctpso: {
    title: 'Penjadwalan Cloud 1000 Tugas, 20 VM [Paper: Alsaidy dkk., 2020]',
    subtitle: 'Makespan (detik) lebih rendah = jadwal lebih cepat. Pembanding Pola B berbasis PSO asli dari makalah.',
    sourceBadge: '[Paper: Alsaidy 2020]',
    metricLabel: 'Makespan (detik, makin pendek makin baik)',
    lowerIsBetter: true,
    unit: ' dtk',
    rows: [
      { algo: 'MCT-PSO', value: 67, highlight: 'mct', note: '[Paper: Alsaidy 2020] Makespan tercepat (67 dtk), memangkas 20 dtk dibanding PSO acak (87 dtk).' },
      { algo: 'LJFP-PSO', value: 80, highlight: 'pso', note: '[Paper: Alsaidy 2020] Longest Job to Fastest Processor seeding + PSO (80 dtk).' },
      { algo: 'SJFP-PSO', value: 81, highlight: 'goa', note: '[Paper: Alsaidy 2020] Shortest Job to Fastest Processor seeding + PSO (81 dtk).' },
      { algo: 'PSO Acak', value: 87, highlight: 'other', note: '[Paper: Alsaidy 2020] PSO tanpa inisialisasi heuristik (87 dtk).' }
    ],
    keyMetrics: [
      { label: 'MCT-PSO [Paper]', value: '67 dtk (Terbaik)' },
      { label: 'PSO Acak [Paper]', value: '87 dtk (+20 dtk)' },
      { label: 'LJFP / SJFP-PSO [Paper]', value: '80 / 81 dtk' },
      { label: 'Catatan Kritis [Paper]', value: '200/400 tgs = MCT murni' }
    ]
  }
};
