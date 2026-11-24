// Structured Pedagogical Beat Engine (v8):
// STRICT ORDERED PROGRESSION PER CARD:
//   1. INTRO -> 2. ARTI ALGORITMA -> 3. CARA KERJA & IMPLEMENTASI -> 4. BARU VISUALISASI & INTERAKSI!
// Preserves all A1-A8 verified accuracy, [Paper]/[Simulasi]/[Usulan] badges, Speaker Notes (S),
// 3 Duration Tracks (15m/30m/45m), 15 Glossary Terms, and 8-Question Final Quiz.

import { BUTLER_MOODS, renderButler2DSvg } from '../viz/svg-illustrator.js?v=10';

export const MOOD_LABELS = {
  greet: '1. INTRO',
  think: '2. ARTI KONSEP',
  deal: '3. CARA KERJA',
  point: '3. IMPLEMENTASI',
  aha: '4. VISUALISASI',
  proud: 'RINGKASAN'
};

export const DURATION_TRACKS = {
  '15m': { label: 'Kilat (15 menit)', cards: [0, 1, 3, 4, 7], coreOnly: true },
  '30m': { label: 'Standar (30 menit)', cards: [0, 1, 2, 3, 4, 5, 6, 7, 8], coreOnly: true },
  '45m': { label: 'Lengkap (45 menit)', cards: [0, 1, 2, 3, 4, 5, 6, 7, 8], coreOnly: false }
};

export const INTRO_BEATS = [
  {
    pill: 'MEJA 9 KARTU 3D | SIR PIP',
    title: 'Klik Kartu 3D di Meja untuk Mulai Belajar Urut!',
    bodyHtml: 'Setiap kartu disusun urut: <strong>1. Intro -> 2. Arti Algoritma -> 3. Cara Kerja &amp; Implementasi -> 4. Baru Visualisasi</strong>. Arahkan kursor dan klik kartu 3D mana saja di atas meja!',
    mood: 'greet',
    cta: 'Buka Kartu I (Intro) ->'
  }
];

export const GLOSSARY_TERMS = {
  optimasi: { term: 'Optimasi', def: 'Proses mencari pilihan terbaik (misalnya waktu tersingkat atau nilai terkecil) di antara banyak kemungkinan solusi.' },
  fitness: { term: 'Fungsi Tujuan (Fitness)', def: 'Skor pengukur kualitas suatu solusi kandidat. Pada minimasi, angka fitness lebih kecil berarti lebih baik.' },
  lokal: { term: 'Optimum Lokal vs Global', def: 'Optimum lokal adalah lembah dangkal yang terbaik di sekitarnya saja; optimum global adalah lembah terdalam di seluruh peta.' },
  heuristik: { term: 'Heuristik', def: 'Aturan praktis cepat sekali jalan (seperti memilih kasir antrean terpendek). Deterministik dan cepat, tidak menjamin global eksak.' },
  metaheuristik: { term: 'Metaheuristik', def: 'Strategi pencarian berulang berbasis populasi tanpa turunan gradien. Cocok untuk peta rumit, tidak menjamin optimum global eksak.' },
  eksplorasi: { term: 'Eksplorasi', def: 'Fase menyebar luas menjelajahi seluruh ruang pencarian agar tidak melewatkan wilayah lembah terbaik.' },
  eksploitasi: { term: 'Eksploitasi', def: 'Fase mempersempit langkah di sekitar wilayah menjanjikan untuk memperhalus presisi solusi akhir.' },
  makespan: { term: 'Makespan (MS)', def: 'Waktu selesai mesin virtual (VM) yang paling lama bekerja. Tujuan penjadwalan cloud adalah membuat MS sekecil mungkin.' },
  ect: { term: 'ECT (Expected Completion Time)', def: 'Perkiraan waktu eksekusi satu tugas pada satu VM: ECT = Panjang Tugas (MI) dibagi Kecepatan VM (MIPS).' },
  seeding: { term: 'Seeding (Inisialisasi Heuristik)', def: 'Memasukkan solusi awal rapi hasil heuristik (seperti MCT) ke populasi awal metaheuristik agar tidak mulai dari tebakan acak total.' },
  pso: { term: 'PSO (Particle Swarm Optimization)', def: 'Metaheuristik kawanan burung/partikel (Kennedy & Eberhart, 1995): setiap partikel bergerak mengikuti posisi terbaik dirinya (pBest) dan terbaik kawanan (gBest).' },
  gayasosial: { term: 'Gaya Sosial s(r)', def: 'Aturan interaksi belalang GOA: jarak terlalu dekat saling tolak (oranye putus); jarak sedang saling tarik (biru solid) menuju jarak nyaman r0.' },
  roulette: { term: 'Roulette Wheel', def: 'Pemilihan acak berbobot di ALO: antlion dengan fitness lebih bagus mendapat peluang lebih besar untuk dipilih.' },
  elite: { term: 'Elite', def: 'Solusi terbaik sementara yang disimpan sepanjang iterasi dan memandu pergerakan seluruh agen.' },
  pivot: { term: 'Pivot c di L/2', def: 'Modifikasi kunci Amaireh dkk. (2023): menurunkan c ke c_min pada separuh iterasi (L/2) agar separuh sisa waktu penuh untuk eksploitasi.' },
  nfl: { term: 'No Free Lunch Theorem', def: 'Teorema Wolpert & Macready (1997): tidak ada satu algoritma optimasi yang selalu terbaik untuk semua jenis masalah.' }
};

// 9 Cards Ordered Strictly: Intro -> Arti Algoritma -> Cara Kerja & Implementasi -> Baru Visualisasi!
export const CARD_BEATS = [
  // =========================================================================
  // KARTU I: INTRO OPTIMASI (1. Intro -> 2. Arti Istilah -> 3. Baru Visualisasi)
  // =========================================================================
  [
    {
      id: 'c1-intro',
      core: true,
      phase: 'TAHAP 1: INTRO',
      badge: '1. INTRO',
      hook: 'Mengapa Kita Mempelajari Hybrid Metaheuristik?',
      captionHtml: 'Setelah sesi ini kamu bisa menjelaskan dari nol apa itu optimasi, membedakan <span class="kw-mct">Pola B</span> &amp; <span class="kw-alo">Pola C</span>, dan membaca bukti makalah secara kritis.',
      mood: 'greet',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker">TUJUAN BELAJAR</div>
            <h3 class="explain-h">Dari Nol Tanpa Syarat Kalkulus atau Koding</h3>
            <p>Bayangkan kamu harus membagi 1.000 tugas komputasi ke 20 server, atau merancang posisi 32 elemen antena. Jumlah kombinasinya miliaran, sehingga mustahil dicoba satu per satu.</p>
          </div>
          <div class="explain-card">
            <div class="explain-kicker">ALUR BELAJAR DI SETIAP KARTU</div>
            <ol class="explain-list">
              <li><strong>Intro:</strong> Masalah nyata yang ingin dipecahkan.</li>
              <li><strong>Arti Algoritma:</strong> Definisi istilah dengan bahasa sehari-hari.</li>
              <li><strong>Cara Kerja &amp; Implementasi:</strong> Langkah urut + contoh angka kecil.</li>
              <li><strong>Visualisasi:</strong> Baru lihat animasi shapes &amp; uji langsung di simulator!</li>
            </ol>
          </div>
        </div>
      `,
      action: 'intuition:random',
      notes: {
        say: 'Buka kelas dengan analogi konkret sebelum menyebut nama algoritma apa pun.',
        ask: 'Jika ada 1.000 tugas dan 20 server, apakah kita bisa mengecek semua kemungkinan susunannya satu per satu?',
        expect: 'Tidak mungkin secara waktu komputasi, karena itu kita butuh algoritma optimasi.'
      }
    },
    {
      id: 'c1-arti',
      core: true,
      phase: 'TAHAP 2: ARTI KONSEP',
      badge: '2. ARTI OPTIMASI',
      hook: 'Arti Optimasi, Fitness, Eksplorasi & Eksploitasi',
      captionHtml: 'Ingat 4 istilah kunci ini: <strong>Optimasi</strong> = cari nilai terbaik; <strong>Fitness</strong> = skor kualitas; <span class="kw-goa">Eksplorasi</span> = cari luas; <span class="kw-alo">Eksploitasi</span> = kunci presisi.',
      mood: 'think',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker">ARTI OPTIMASI &amp; FITNESS</div>
            <p><strong>Optimasi</strong> ibarat mencari titik lembah terdalam di bukit berkabut. Ketinggian tanah di titik tempatmu berdiri disebut <strong>Fitness</strong> (makin rendah = makin bagus).</p>
            <p class="mt-2">Tebakan acak <strong>sering kalah</strong> karena berhenti di <strong>Optimum Lokal</strong> (lubang dangkal), padahal ada <strong>Optimum Global</strong> (lembah terdalam).</p>
          </div>
          <div class="explain-card">
            <div class="explain-kicker">EKSPLORASI VS EKSPLOITASI</div>
            <p><strong class="text-goa">Eksplorasi:</strong> Seperti mencari restoran di kota baru dengan berkeliling dulu memetakan seluruh wilayah.</p>
            <p class="mt-2"><strong class="text-alo">Eksploitasi:</strong> Setelah area terbaik ketemu, persempit langkah untuk menemukan titik terdalam secara tajam.</p>
          </div>
        </div>
      `,
      action: 'intuition:explore',
      notes: {
        say: 'Pastikan istilah Optimum Lokal vs Global dan Eksplorasi vs Eksploitasi dipahami sebelum menampilkan visual.',
        ask: 'Apa risikonya jika algoritma hanya melakukan eksploitasi tanpa eksplorasi?',
        expect: 'Cepat terjebak di lubang dangkal (optimum lokal).'
      }
    },
    {
      id: 'c1-viz',
      core: true,
      phase: 'TAHAP 4: VISUALISASI',
      badge: '4. VISUALISASI',
      hook: 'Sekarang Amati Visualnya & Klik Bukit untuk Uji Bola!',
      captionHtml: 'Setelah paham artinya, sekarang klik di mana saja pada bukit untuk menjatuhkan bola uji fitness <span class="src-badge src-sim">[Ilustrasi]</span>!',
      mood: 'aha',
      mode: 'visual',
      action: 'intuition:random',
      notes: {
        say: 'Klik di kiri (lembah dangkal) lalu di kanan (lembah dalam) untuk membandingkan skor f(x).',
        ask: 'Di area mana f(x) paling kecil?',
        expect: 'Di dasar lembah paling kanan (Optimum Global).'
      }
    },
    {
      id: 'c1-inter',
      core: false,
      phase: 'TAHAP 4: COBA SENDIRI',
      badge: '4. INTERAKTIF',
      hook: 'Bandingkan 3 Tahap: Acak -> Eksplorasi -> Eksploitasi!',
      captionHtml: 'Tekan tombol tahap di panel kanan untuk memutar transisi dari tebakan acak ke eksplorasi luas lalu corong eksploitasi.',
      mood: 'proud',
      mode: 'interactive',
      action: 'intuition:exploit',
      notes: {
        say: 'Ringkas: hibridisasi dibuat untuk menyeimbangkan dua fase ini.',
        ask: 'Sudah jelas beda Eksplorasi dan Eksploitasi?',
        expect: 'Siap masuk ke Kartu II (Heuristik vs Metaheuristik).'
      }
    }
  ],

  // =========================================================================
  // KARTU II: ARTI HEURISTIK VS METAHEURISTIK & POLA B VS POLA C
  // =========================================================================
  [
    {
      id: 'c2-intro',
      core: true,
      phase: 'TAHAP 1: INTRO',
      badge: '1. INTRO',
      hook: 'Kenapa Satu Algoritma Saja Tidak Cukup?',
      captionHtml: 'Menurut <em>No Free Lunch Theorem</em> (Wolpert &amp; Macready, 1997) <span class="src-badge src-paper">[Paper]</span>, tidak ada satu algoritma terbaik untuk semua masalah.',
      mood: 'greet',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker">TEOREMA NO FREE LUNCH (1997)</div>
            <h3 class="explain-h">Setiap Metode Punya Kelebihan &amp; Celah</h3>
            <p>Metode yang super cepat sering kurang akurat; metode yang menyisir luas sering lambat saat memperhalus hasil akhir. Itulah sebabnya peneliti menggabungkan dua algoritma menjadi <strong>Hybrid</strong>.</p>
          </div>
          <div class="explain-card">
            <div class="explain-kicker">DUA KELUARGA BESAR ALGORITMA</div>
            <ul class="explain-list">
              <li><strong class="text-mct">■ Heuristik:</strong> Aturan praktis cepat <strong>sekali jalan</strong>, deterministik (contoh: pilih kasir antrean terpendek).</li>
              <li><strong class="text-goa">⬡ Metaheuristik:</strong> Pencarian <strong>berulang berbasis populasi</strong> tanpa turunan gradien, mampu melompati jebakan lokal <span class="src-badge src-paper">[Paper: Bag.1]</span>.</li>
            </ul>
          </div>
        </div>
      `,
      action: 'taxonomy:all',
      notes: {
        say: 'Jelaskan beda heuristik vs metaheuristik terlebih dahulu sebelum membahas Pola B dan Pola C.',
        ask: 'Jika kamu memilih antrean kasir terpendek di supermarket, itu heuristik atau metaheuristik?',
        expect: 'Heuristik (aturan praktis cepat 1 jalan).'
      }
    },
    {
      id: 'c2-arti',
      core: true,
      phase: 'TAHAP 2: ARTI POLA B & C',
      badge: '2. ARTI POLA',
      hook: 'Arti Pola B (Estafet) vs Pola C (Kerja Tim)',
      captionHtml: '<span class="kw-mct">Pola B</span> = Heuristik 1x di awal lalu diserahkan ke Metaheuristik. <span class="kw-alo">Pola C</span> = Dua Metaheuristik berkolaborasi di setiap iterasi.',
      mood: 'think',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker text-mct">POLA B: MODEL ESTAFET (HEURISTIK -> METAHEURISTIK)</div>
            <p><strong>Contoh fokus kita:</strong> MCT-seeded GOA <span class="src-badge src-prop">[Usulan]</span> (adaptasi dari ide MCT-PSO di Alsaidy dkk., 2020 <span class="src-badge src-paper">[Paper]</span>).</p>
            <p class="mt-2"><strong>Cara gabung:</strong> Heuristik bekerja sekali di awal untuk memberi titik start rapi, lalu metaheuristik memolesnya.</p>
          </div>
          <div class="explain-card">
            <div class="explain-kicker text-alo">POLA C: MODEL KERJA TIM (METAHEURISTIK + METAHEURISTIK)</div>
            <p><strong>Contoh fokus kita:</strong> Hybrid GOA-ALO (Amaireh dkk., 2023 <span class="src-badge src-paper">[Paper]</span>).</p>
            <p class="mt-2"><strong>Cara gabung:</strong> GOA (kuat eksplorasi) dan ALO (kuat eksploitasi) bertukar kandidat di setiap putaran iterasi.</p>
          </div>
        </div>
      `,
      action: 'taxonomy:init',
      notes: {
        say: 'Sorot kata kunci perbedaan keduanya: 1x di awal (Estafet) vs berkolaborasi tiap iterasi (Kerja Tim).',
        ask: 'Mengapa Pola B disebut estafet?',
        expect: 'Karena heuristik hanya bekerja sekali di awal lalu menyerahkan tongkat start ke metaheuristik.'
      }
    },
    {
      id: 'c2-viz',
      core: true,
      phase: 'TAHAP 4: VISUALISASI',
      badge: '4. VISUALISASI',
      hook: 'Amati Diagram Shapes Pola B vs Pola C!',
      captionHtml: 'Perhatikan simbol standar: <span class="kw-mct">■ Kotak Hijau</span> = Heuristik 1x; <span class="kw-goa">⬡ Heksagon Ungu</span> = Metaheuristik berulang.',
      mood: 'aha',
      mode: 'visual',
      action: 'taxonomy:all',
      notes: {
        say: 'Arahkan pandangan kelas ke diagram shapes yang baru muncul setelah konsepnya jelas.',
        ask: 'Di diagram kanan, di mana GOA dan ALO bertemu?',
        expect: 'Di seleksi 3-sampel (belah ketupat) setiap iterasi.'
      }
    },
    {
      id: 'c2-inter',
      core: false,
      phase: 'TAHAP 4: TABEL RINGKAS',
      badge: '4. PERBANDINGAN',
      hook: 'Bandingkan 3 Baris Inti & Sorot Fase!',
      captionHtml: 'Gunakan tab fase di atas diagram dan lihat tabel perbandingan ringkas Pola B vs Pola C di bawah.',
      mood: 'proud',
      mode: 'interactive',
      action: 'taxonomy:all',
      notes: {
        say: 'Buka lipatan Selengkapnya jika mahasiswa ingin melihat catatan rujukan dua makalah.',
        ask: 'Ada yang ingin ditanyakan tentang beda Pola B dan Pola C sebelum kita bedah arti 3 algoritmanya?',
        expect: 'Lanjut ke Kartu III.'
      }
    }
  ],

  // =========================================================================
  // KARTU III: ARTI 3 ALGORITMA INTI (MCT, GOA, ALO) SEBELUM IMPLEMENTASI
  // =========================================================================
  [
    {
      id: 'c3-mct',
      core: true,
      phase: 'TAHAP 2: ARTI MCT',
      badge: '2. ARTI MCT',
      hook: 'Apa Itu MCT (Minimum Completion Time)?',
      captionHtml: '<span class="kw-mct">■ MCT</span> adalah aturan heuristik penjadwalan: setiap tugas dimasukkan ke mesin yang membuatnya <strong>selesai paling cepat</strong>.',
      mood: 'think',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker text-mct">ARTI MCT (MINIMUM COMPLETION TIME)</div>
            <h3 class="explain-h">Analogi: Memilih Kasir dengan Waktu Tunggu Terpendek</h3>
            <p>Untuk setiap tugas yang datang, MCT menghitung: <em>"Beban antrean VM saat ini + waktu pengerjaan tugas di VM itu"</em>. Tugas langsung masuk ke VM dengan total waktu selesai terkecil.</p>
          </div>
          <div class="explain-card">
            <div class="explain-kicker">SIFAT UTAMA MCT</div>
            <ul class="explain-list">
              <li><strong>Deterministik:</strong> input sama selalu menghasilkan jadwal yang persis sama.</li>
              <li><strong>Sangat cepat:</strong> hanya 1 kali lewat tanpa ratusan iterasi.</li>
              <li><strong>Keterbatasan:</strong> tidak menengok tugas-tugas berikutnya (greedy), jadi belum tentu optimum global.</li>
            </ul>
          </div>
        </div>
      `,
      action: 'cover:mct',
      notes: {
        say: 'Kenalkan keempat bahan utama (MCT, PSO, GOA, ALO) secara urut sebelum masuk ke simulator.',
        ask: 'Mengapa hasil MCT selalu sama setiap kali dijalankan pada daftar tugas yang sama?',
        expect: 'Karena MCT deterministik (tidak memakai angka acak).'
      }
    },
    {
      id: 'c3-pso',
      core: true,
      phase: 'TAHAP 2: ARTI PSO',
      badge: '2. ARTI PSO',
      hook: 'Apa Itu PSO (Particle Swarm Optimization)?',
      captionHtml: '<strong>⬡ PSO</strong> (Kennedy &amp; Eberhart, 1995) meniru kawanan burung mencari makan: tiap partikel belajar dari <strong>pBest</strong> (terbaik diri) &amp; <strong>gBest</strong> (terbaik kawanan) <span class="src-badge src-paper">[Paper: Alsaidy 2020]</span>.',
      mood: 'think',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker" style="color:var(--color-meta)">ARTI PSO (PARTICLE SWARM OPTIMIZATION)</div>
            <h3 class="explain-h">Analogi: Kawanan Burung Saling Berbagi Posisi Makanan</h3>
            <p>Tiap partikel memiliki <strong>posisi</strong> (solusi) dan <strong>kecepatan</strong> <code>v</code>. Di setiap iterasi, kecepatan diperbarui dari 3 dorongan: inersia (<code>w*v</code>), ingatan pribadi (<code>pBest</code>), dan petunjuk kawanan terbaik (<code>gBest</code>).</p>
          </div>
          <div class="explain-card">
            <div class="explain-kicker">PERAN PSO DI POLA B &amp; KETERBATASANNYA</div>
            <ul class="explain-list">
              <li><strong>Kelebihan:</strong> Rumus sederhana, ringan secara komputasi, cepat konvergen pada penjadwalan cloud (<strong>MCT-PSO: 67 dtk vs PSO acak 87 dtk</strong> <span class="src-badge src-paper">[Paper]</span>).</li>
              <li><strong>Keterbatasan:</strong> Bila seluruh partikel diinisialisasi di satu titik seed MCT, keragaman cepat turun &amp; mudah terjebak lokal.</li>
            </ul>
          </div>
        </div>
      `,
      action: 'cover:all',
      notes: {
        say: 'Jelaskan pBest dan gBest sebagai inti PSO, karena makalah Pola B (Alsaidy dkk., 2020) memakai MCT-PSO.',
        ask: 'Apa bedanya pBest dan gBest pada PSO?',
        expect: 'pBest adalah posisi terbaik milik partikel itu sendiri; gBest adalah posisi terbaik seluruh kawanan.'
      }
    },
    {
      id: 'c3-goa',
      core: true,
      phase: 'TAHAP 2: ARTI GOA',
      badge: '2. ARTI GOA',
      hook: 'Apa Itu GOA (Grasshopper Optimization Algorithm)?',
      captionHtml: '<span class="kw-goa">◉ GOA</span> meniru kawanan belalang (Saremi dkk., 2017): saling <span class="kw-repel">tolak</span> jika terlalu rapat &amp; saling <span class="kw-goa">tarik</span> jika terlalu jauh <span class="src-badge src-paper">[Paper: Bag.4.2]</span>.',
      mood: 'point',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker text-goa">ARTI GOA (KAWANAN BELALANG)</div>
            <h3 class="explain-h">Analogi: Kerumunan Menjaga Jarak Nyaman</h3>
            <p>Setiap belalang mewakili satu solusi kandidat. Bila tetangga terlalu dekat (<code>r &lt; r0</code>), muncul <strong>gaya tolak</strong> (oranye putus). Bila jarak sedang (<code>r &gt; r0</code>), muncul <strong>gaya tarik</strong> (biru solid).</p>
          </div>
          <div class="explain-card">
            <div class="explain-kicker">KELEBIHAN &amp; KRITIK PENULIS PAPER</div>
            <ul class="explain-list">
              <li><strong>Kelebihan:</strong> Kuat melakukan <em>eksplorasi global</em> melintasi seluruh peta.</li>
              <li><strong>Parameter c:</strong> Menyusut dari <code>1</code> ke <code>0,00001</code> agar kawanan pelan-pelan merapat.</li>
              <li><strong>Kritik penulis paper:</strong> c linear habis untuk eksplorasi sehingga eksploitasi akhir kurang tajam <span class="src-badge src-paper">[Paper]</span>.</li>
            </ul>
          </div>
        </div>
      `,
      action: 'cover:goa',
      notes: {
        say: 'Tekankan bahwa gaya tolak memakai warna oranye putus-putus (terpisah dari warna merah ALO).',
        ask: 'Apa fungsi gaya tolak dalam kawanan GOA?',
        expect: 'Menjaga agen tersebar dan tidak menumpuk terlalu cepat di satu titik.'
      }
    },
    {
      id: 'c3-alo',
      core: true,
      phase: 'TAHAP 2: ARTI ALO',
      badge: '2. ARTI ALO',
      hook: 'Apa Itu ALO (Ant Lion Optimizer)?',
      captionHtml: '<span class="kw-alo">▼ ALO</span> meniru larva undur-undur (Mirjalili, 2015) yang menggali corong pasir makin sempit agar mangsa tergelincir ke <span class="kw-gold">◆ Elite</span> <span class="src-badge src-paper">[Paper: Bag.2]</span>.',
      mood: 'point',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker text-alo">ARTI ALO (JEBAKAN PASIR UNDUR-UNDUR)</div>
            <h3 class="explain-h">Analogi: Semut Berjalan Acak di Lereng Corong</h3>
            <p>Semut (agen) melakukan jalan acak di sekitar antlion yang dipilih lewat <strong>Roulette Wheel</strong> dan di sekitar <strong>Elite</strong>. Makin tinggi iterasi, corong menyempit drastis oleh rasio <code>I</code>.</p>
          </div>
          <div class="explain-card">
            <div class="explain-kicker">KELEBIHAN &amp; KELEMAHAN ALO</div>
            <ul class="explain-list">
              <li><strong>Kelebihan:</strong> Sangat tajam dalam <em>eksploitasi lokal</em> memperhalus solusi.</li>
              <li><strong>Kelemahan (makalah):</strong> Roulette wheel bisa menghilangkan keragaman dan memicu konvergensi dini di lubang lokal <span class="src-badge src-paper">[Paper: Bag.2]</span>.</li>
            </ul>
          </div>
        </div>
      `,
      action: 'cover:alo',
      notes: {
        say: 'Sekarang audiens sudah paham arti ketiga algoritma (MCT, GOA, ALO) beserta kelebihan dan celahnya.',
        ask: 'Jika GOA jago eksplorasi dan ALO jago eksploitasi, apa yang terjadi kalau keduanya digabung?',
        expect: 'Keduanya saling menutup kelemahan (menjadi Pola C).'
      }
    },
    {
      id: 'c3-viz',
      core: true,
      phase: 'TAHAP 4: VISUALISASI 3 BENTUK',
      badge: '4. VISUALISASI',
      hook: 'Lihat Animasi 3 Bentuk (MCT, GOA, ALO) Bersamaan!',
      captionHtml: 'Sekarang seluruh arti tadi dihidupkan sebagai 3 animasi shapes berdampingan. Klik 4 tombol suit di bawah untuk menyorot masing-masing!',
      mood: 'aha',
      mode: 'interactive',
      action: 'cover:all',
      notes: {
        say: 'Tunjukkan keselarasan antara simbol di legenda atas dengan animasi 3 panel.',
        ask: 'Siap melihat cara kerja hitung manual & implementasi Pola B di Kartu IV?',
        expect: 'Lanjut ke Kartu IV.'
      }
    }
  ],

  // =========================================================================
  // KARTU IV: CARA KERJA & IMPLEMENTASI POLA B (MCT-GOA [USULAN] + PAPER MCT-PSO)
  // =========================================================================
  [
    {
      id: 'c4-arti',
      core: true,
      phase: 'TAHAP 1-2: INTRO & STATUS',
      badge: '1. INTRO POLA B',
      hook: 'Studi Kasus Cloud & Kejujuran Paper MCT-PSO vs Usulan MCT-GOA',
      captionHtml: 'Masalah: menjadwalkan <code>Nt</code> tugas (MI) ke <code>Nv</code> VM (MIPS) agar <strong>Makespan (MS)</strong> sekecil mungkin. Rujukan asli memakai <strong>PSO</strong> <span class="src-badge src-paper">[Paper]</span>; versi GOA adalah <span class="src-badge src-prop">[Usulan]</span>.',
      mood: 'greet',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker text-mct">STUDI KASUS CLOUD TASK SCHEDULING (M3)</div>
            <p>Waktu eksekusi 1 tugas di 1 VM: <code>ECT = Panjang Tugas (MI) / Kecepatan VM (MIPS)</code>. <strong>Makespan (MS)</strong> adalah waktu selesai VM yang paling lama bekerja.</p>
            <p class="mt-2"><strong>Contoh wajib (4 tugas, 2 VM):</strong> T1..T4 = <code>4000, 2000, 3000, 1000 MI</code>; VM1 = <code>1000 MIPS</code>, VM2 = <code>2000 MIPS</code>. Jika semua ke VM1 -> jadwal buruk <strong>MS = 10 detik</strong>.</p>
          </div>
          <div class="explain-card">
            <div class="explain-kicker">BUKTI LITERATUR [PAPER] VS ADAPTASI [USULAN]</div>
            <p><span class="src-badge src-paper">[Paper: Alsaidy dkk., 2020]</span> 1000 tugas, 20 VM (memakai <strong>PSO</strong>): PSO acak <strong>87 dtk</strong>, SJFP-PSO <strong>81 dtk</strong>, LJFP-PSO <strong>80 dtk</strong>, MCT-PSO <strong>67 dtk</strong>.</p>
            <p class="mt-2"><span class="src-badge src-prop">[Usulan]</span> Di web ini, ide seeding MCT tersebut diadaptasi ke GOA (MCT-seeded GOA) dan dilabeli jujur sebagai usulan desain.</p>
          </div>
        </div>
      `,
      action: 'mct:walk0',
      notes: {
        say: 'Jelaskan konsep ECT dan Makespan dengan angka konkret sebelum menunjukkan diagram Gantt.',
        ask: 'Jika tugas 4000 MI dijalankan di VM2 (2000 MIPS), berapa detik ECT-nya?',
        expect: '4000 / 2000 = 2,0 detik.'
      }
    },
    {
      id: 'c4-work',
      core: true,
      phase: 'TAHAP 3: CARA KERJA & IMPLEMENTASI',
      badge: '3. CARA KERJA',
      hook: 'Langkah Hitung MCT (3,5 dtk) & Cara Implementasi ke GOA',
      captionHtml: 'MCT menyusun T1->VM2(2s), T2->VM1(2s), T3->VM2(3,5s), T4->VM1(3s) => <strong>MS = 3,5 dtk</strong>! Lalu hasil ini di-encode ke populasi awal GOA <span class="src-badge src-prop">[Usulan]</span>.',
      mood: 'deal',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker text-mct">WALKTHROUGH HITUNG MANUAL MCT (M4)</div>
            <ol class="explain-list">
              <li><strong>T1 (4000 MI):</strong> VM1=4s vs VM2=2s -> pilih <strong>VM2</strong> (beban 2,0s).</li>
              <li><strong>T2 (2000 MI):</strong> VM1=2s vs VM2=2+1=3s -> pilih <strong>VM1</strong> (beban 2,0s).</li>
              <li><strong>T3 (3000 MI):</strong> VM1=2+3=5s vs VM2=2+1,5=3,5s -> pilih <strong>VM2</strong> (3,5s).</li>
              <li><strong>T4 (1000 MI):</strong> VM1=2+1=3s vs VM2=3,5+0,5=4s -> pilih <strong>VM1</strong> (3,0s).</li>
            </ol>
            <p class="mt-1"><strong>Hasil:</strong> MS = max(3,0; 3,5) = <strong>3,5 detik</strong> (turun dari 10 detik!).</p>
          </div>
          <div class="explain-card">
            <div class="explain-kicker">IMPLEMENTASI SEEDING KE PSO [PAPER] &amp; GOA [USULAN]</div>
            <ol class="explain-list">
              <li><strong>Encoding kontinu:</strong> tiap tugas <em>i</em> punya koordinat <code>x_i in [0, Nv)</code>; nomor VM = <code>floor(x_i)</code>.</li>
              <li><strong>Konversi seed MCT:</strong> <code>x_i = nomor_VM + 0,5</code> lalu disuntikkan ke partikel <strong>PSO</strong> (<code>v, pBest, gBest</code>) atau agen <strong>GOA</strong>.</li>
              <li><strong>Jaga keragaman:</strong> isi hanya <strong>10-30% populasi</strong> dari seed MCT; sisanya acak agar kawanan PSO/GOA tidak kaku di 1 titik.</li>
            </ol>
          </div>
        </div>
      `,
      action: 'mct:walk4',
      notes: {
        say: 'Jelaskan mengapa kita tidak mengisi 100% populasi dari 1 titik MCT (sesuai catatan keterbatasan penulis Alsaidy dkk. 2020).',
        ask: 'Bagaimana cara mengubah angka kontinu x_i = 1,7 menjadi pilihan VM?',
        expect: 'Diambil floor(1,7) = 1 (VM indeks 1 / VM2).'
      }
    },
    {
      id: 'c4-viz',
      core: true,
      phase: 'TAHAP 4: VISUALISASI WALKTHROUGH',
      badge: '4. VISUALISASI',
      hook: 'Lihat Visual Gantt MCT (3,5 dtk) Langkah demi Langkah!',
      captionHtml: 'Sekarang kamu bisa menekan <strong>Langkah MCT +1</strong> untuk melihat balok T1..T4 masuk ke VM1 &amp; VM2 satu per satu.',
      mood: 'aha',
      mode: 'visual',
      action: 'mct:walk4',
      notes: {
        say: 'Peragakan tombol Langkah MCT +1 dari 0 sampai 4 di depan kelas.',
        ask: 'Terlihat jelas bedanya garis merah 3,5 detik dengan garis abu-abu 10,0 detik?',
        expect: 'Sangat jelas secara visual.'
      }
    },
    {
      id: 'c4-sim',
      core: false,
      phase: 'TAHAP 4: SIMULATOR INTERAKTIF',
      badge: '4. SIMULATOR WEB',
      hook: 'Uji Langsung MCT-PSO vs MCT-GOA vs Acak di Browser!',
      captionHtml: '<span class="src-badge src-sim">[Simulasi]</span> Kurva ungu = <strong>MCT-PSO</strong>, hijau = <strong>MCT-GOA</strong>, abu putus = <strong>Acak</strong>. Pilih mesin di panel kanan &amp; geser porsi seeding!',
      mood: 'proud',
      mode: 'interactive',
      action: 'mct:full',
      notes: {
        say: 'Bandingkan langsung kurva MCT-PSO (ungu), MCT-GOA (hijau), dan acak (abu), serta ingatkan status [Simulasi].',
        ask: 'Mengapa MCT-PSO dan MCT-GOA sama-sama memulai iterasi 0 jauh lebih rendah daripada start acak?',
        expect: 'Karena keduanya sudah menerima solusi seed awal dari heuristik MCT.'
      }
    }
  ],

  // =========================================================================
  // KARTU V: CARA KERJA & IMPLEMENTASI POLA C (HYBRID GOA-ALO [PAPER])
  // =========================================================================
  [
    {
      id: 'c5-intro',
      core: true,
      phase: 'TAHAP 1-2: INTRO & ARTI',
      badge: '1. ARTI POLA C',
      hook: 'Apa Itu Hybrid GOA-ALO (Amaireh dkk., 2023)?',
      captionHtml: 'Ide inti <span class="src-badge src-paper">[Paper]</span>: belalang berjalan acak dan saling berinteraksi sosial (<span class="kw-goa">GOA</span>) di dalam lereng jebakan corong (<span class="kw-alo">ALO</span>).',
      mood: 'greet',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker text-alo">MENGAPA MENGGABUNGKAN GOA + ALO?</div>
            <p><strong class="text-goa">GOA tunggal:</strong> eksplorasi bagus, tetapi parameter <code>c</code> linear turun terlalu lambat sehingga kurang tajam di akhir.</p>
            <p class="mt-2"><strong class="text-alo">ALO tunggal:</strong> eksploitasi corong tajam, tetapi roulette wheel rawan membuat populasi terjebak dini di lubang lokal.</p>
          </div>
          <div class="explain-card">
            <div class="explain-kicker">SOLUSI HYBRID AMAIREH DKK. (2023)</div>
            <p>Keduanya digabung dalam <strong>satu loop iterasi</strong>: gaya sosial GOA menjaga keragaman peta, sementara corong ALO + percepatan pivot <code>c</code> di <code>L/2</code> mengunci solusi global dengan presisi tinggi.</p>
          </div>
        </div>
      `,
      action: 'hybrid:social',
      notes: {
        say: 'Hubungkan kembali ke celah GOA dan ALO yang baru dibahas di Kartu III.',
        ask: 'Masalah GOA mana yang diselesaikan oleh ALO, dan sebaliknya?',
        expect: 'ALO memperkuat eksploitasi GOA; gaya sosial GOA menjaga keragaman ALO.'
      }
    },
    {
      id: 'c5-work',
      core: true,
      phase: 'TAHAP 3: CARA KERJA & IMPLEMENTASI',
      badge: '3. CARA KERJA',
      hook: '6 Langkah Implementasi Hybrid GOA-ALO + Contoh Pivot L/2!',
      captionHtml: 'Contoh angka <span class="src-badge src-paper">[Paper: Eq.9-12]</span> pada <code>L = 200</code>: di iterasi 100 (<code>L/2</code>), GOA asli masih <code>c = 0,50</code>, Hybrid sudah <strong>c = 0,00001</strong>!',
      mood: 'deal',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker">URUTAN 6 LANGKAH IMPLEMENTASI (M8)</div>
            <ol class="explain-list">
              <li><strong>Random Walk &amp; Normalisasi</strong> ke batas <code>[lb, ub]</code> (Eq. 1-3).</li>
              <li><strong>Jebakan Antlion:</strong> geser batas <code>c, d</code> ke antlion Roulette &amp; Elite (Eq. 4-5).</li>
              <li><strong>Gaya Sosial GOA:</strong> tambah interaksi tolak-tarik <code>s(r)</code> (Eq. 6-7).</li>
              <li><strong>Modifikasi c di L/2 &amp; Tangga w:</strong> paruh 1 linear, paruh 2 tajam + <code>I = 10^w (t/T)</code> (Eq. 9-12).</li>
              <li><strong>Seleksi 3-Sampel:</strong> gabung kandidat -> ambil <strong>Terbaik + Menengah + sedikit Terburuk</strong>.</li>
              <li><strong>Penggantian Antlion:</strong> bila belalang lebih baik, antlion diganti &amp; Elite diperbarui (Eq. 13).</li>
            </ol>
          </div>
          <div class="explain-card">
            <div class="explain-kicker">KENAPA AMBIL SEDIKIT SAMPEL TERBURUK?</div>
            <p><strong>Sampel Terbaik</strong> memperdalam akurasi di lembah utama, sementara <strong>sedikit Sampel Terburuk</strong> berfungsi sebagai penjelajah cadangan agar kawanan tetap punya peluang menemukan lembah baru.</p>
            <p class="mt-2"><strong>Tangga w (Eq. 11-12):</strong> naik otomatis dari <code>w = 1</code> -> <code>2</code> (>10%), <code>3</code> (>50%), <code>4</code> (>75%), <code>5</code> (>90%), hingga <code>6</code> (>95% iterasi).</p>
          </div>
        </div>
      `,
      action: 'hybrid:modc',
      notes: {
        say: 'Jelaskan 6 langkah dan contoh angka L=200 dulu sebelum membuka flowchart dan grafik.',
        ask: 'Pada iterasi ke-100 dari total 200 iterasi, berapa nilai c pada GOA asli vs Hybrid?',
        expect: 'GOA asli sekitar 0,50; Hybrid sudah mencapai c_min = 0,00001.'
      }
    },
    {
      id: 'c5-viz',
      core: true,
      phase: 'TAHAP 4: VISUALISASI FLOWCHART & KURVA',
      badge: '4. VISUALISASI',
      hook: 'Lihat Flowchart 6 Tahap, Kurva Pivot L/2, & Tangga w!',
      captionHtml: 'Sekarang amati visualnya: garis merah Hybrid menukik tepat di poros <code>L/2</code>, diikuti grafik tangga <code>w</code> yang naik <code>1 -> 6</code>.',
      mood: 'aha',
      mode: 'visual',
      action: 'hybrid:modc',
      notes: {
        say: 'Tunjuk kedua grafik di sebelah kanan agar contoh angka 100/200 tadi langsung terlihat bentuknya.',
        ask: 'Apa yang terjadi di sebelah kanan garis putus-putus L/2?',
        expect: 'Parameter c meluruh mendekati 0 sehingga fase fokus penuh pada eksploitasi.'
      }
    },
    {
      id: 'c5-inter',
      core: false,
      phase: 'TAHAP 4: BEDAH RUMUS & SLIDER',
      badge: '4. INTERAKTIF',
      hook: 'Klik 6 Kotak Tahap, Geser L, & Buka Rumus Eq. (1)-(13)!',
      captionHtml: 'Klik kotak tahap mana saja di flowchart kiri untuk melihat arti bahasa biasa + lipatan <strong>Tampilkan Rumus Persamaan</strong>.',
      mood: 'proud',
      mode: 'interactive',
      action: 'hybrid:matrix',
      notes: {
        say: 'Buka kotak rumus hanya bila ada yang ingin mengecek notasi matematis lengkapnya.',
        ask: 'Siap menguji interaksi parameter GOA & ALO secara visual di Kartu VI?',
        expect: 'Lanjut ke Kartu VI.'
      }
    }
  ],

  // =========================================================================
  // KARTU VI: VISUALISASI ANATOMI PARAMETER GOA & ALO (CONTOH ANGKA -> VISUAL)
  // =========================================================================
  [
    {
      id: 'c6-num',
      core: true,
      phase: 'TAHAP 3: CONTOH ANGKA',
      badge: '3. CONTOH ANGKA',
      hook: 'Cek Contoh Angka Kecil Gaya Sosial s(r) & Corong I!',
      captionHtml: 'Sebelum menggeser slider, cek angka konkretnya: <code>r=1,0 -> tolak (-0,11)</code>, <code>r=2,08 -> nyaman (0)</code>, dan pada ALO <code>t/T=60% -> w=3 -> I=600</code> <span class="src-badge src-paper">[Paper]</span>.',
      mood: 'deal',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker text-goa">CONTOH ANGKA GOA (f = 0,5 ; l = 1,5)</div>
            <ul class="explain-list">
              <li>Jarak <code>r = 1,0</code> -> <code>s(1,0) = -0,11</code> (<strong class="text-repel">Tolak / Oranye Putus</strong>)</li>
              <li>Jarak <code>r = 2,08</code> -> <code>s(2,08) = 0,00</code> (<strong>Zona Nyaman r0</strong>)</li>
              <li>Jarak <code>r = 3,0</code> -> <code>s(3,0) = +0,02</code> (<strong class="text-goa">Tarik / Biru Solid</strong>)</li>
            </ul>
          </div>
          <div class="explain-card">
            <div class="explain-kicker text-alo">CONTOH ANGKA PENYEMPITAN ALO</div>
            <ul class="explain-list">
              <li>Saat <code>t/T = 35%</code> -> <code>w = 2</code> -> <code>I = 35</code> (lebar corong sisa <strong>2,86%</strong>)</li>
              <li>Saat <code>t/T = 60%</code> -> <code>w = 3</code> -> <code>I = 600</code> (lebar corong sisa <strong>0,17%</strong>)</li>
              <li>Saat <code>t/T = 96%</code> -> <code>w = 6</code> -> <code>I = 960.000</code> (terkunci ultra-tajam ke Elite!)</li>
            </ul>
          </div>
        </div>
      `,
      action: 'single:goa',
      notes: {
        say: 'Angka kecil ini membuktikan bahwa rumus s(r) dan I sebenarnya sangat mudah dihitung dan masuk akal.',
        ask: 'Jika dua agen berjarak r = 1,0, apakah mereka saling mendekat atau menjauh?',
        expect: 'Saling menjauh (tolak, oranye putus).'
      }
    },
    {
      id: 'c6-goa-viz',
      core: true,
      phase: 'TAHAP 4: VISUALISASI GOA',
      badge: '4. VISUAL GOA',
      hook: 'Visualisasi Medan Gaya Sosial GOA (Tolak vs Tarik)!',
      captionHtml: 'Perhatikan pembeda non-warna: panah <span class="kw-repel">Oranye Putus = Tolak</span>; panah <span class="kw-goa">Biru Solid = Tarik</span> menuju lingkaran nyaman <code>r0</code>.',
      mood: 'aha',
      mode: 'visual',
      action: 'single:goa',
      notes: {
        say: 'Biarkan animasi kawanan bergerak menuju radius r0 sambil menunjukkan kurva s(r) di bawahnya.',
        ask: 'Di mana letak titik r0 pada grafik s(r)?',
        expect: 'Di perpotongan kurva dengan garis horizontal nol.'
      }
    },
    {
      id: 'c6-alo-viz',
      core: true,
      phase: 'TAHAP 4: VISUALISASI ALO',
      badge: '4. VISUAL ALO',
      hook: 'Visualisasi Corong Pasir ALO Menyempit ke Elite!',
      captionHtml: 'Amati dinding corong <code>c/I</code> dan <code>d/I</code> yang merapat drastis seiring progres <code>t/T</code> naik menuju <strong>◆ Elite</strong>.',
      mood: 'aha',
      mode: 'visual',
      action: 'single:alo',
      notes: {
        say: 'Tunjukkan jalur zigzag biru (random walk semut) yang makin terkurung ke dasar corong.',
        ask: 'Apa yang terjadi saat lebar corong tinggal di bawah 1%?',
        expect: 'Langkah acak jadi sangat kecil sehingga solusi makin presisi.'
      }
    },
    {
      id: 'c6-inter',
      core: false,
      phase: 'TAHAP 4: UJI SLIDER & RUMUS',
      badge: '4. INTERAKTIF',
      hook: 'Geser f, l, t/T & Buka Lipatan Rumus Lengkap!',
      captionHtml: 'Pilih tab GOA atau ALO di atas, geser parameternya, dan buka tombol <strong>Tampilkan Rumus</strong> di panel kanan.',
      mood: 'proud',
      mode: 'interactive',
      action: 'single:goa',
      notes: {
        say: 'Ajak kelas mencoba menaikkan f atau menggeser t/T hingga 96%.',
        ask: 'Siap mengadu Hybrid vs GOA vs ALO langsung di Lab 3D Kartu VII?',
        expect: 'Lanjut ke Kartu VII.'
      }
    }
  ],

  // =========================================================================
  // KARTU VII: VISUALISASI LAB SIMULASI 3D & 2D (L8: DASAR <= 5 + LANJUTAN)
  // =========================================================================
  [
    {
      id: 'c7-intro',
      core: false,
      phase: 'TAHAP 1: PENGANTAR LAB',
      badge: '1. SKENARIO LAB',
      hook: 'Skenario Uji: Rastrigin (F13) Bandingkan Ketiganya!',
      captionHtml: '<span class="src-badge src-sim">[Simulasi]</span> Sebelum menekan Jalankan: pahami cara baca grafik bawah yaitu <strong>garis paling cepat turun mendekati 0 = pemenang</strong>.',
      mood: 'deal',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker">MENGAPA FUNGSI RASTRIGIN (F13)?</div>
            <p>Fungsi <strong>Rastrigin (F13)</strong> memiliki puluhan lembah jebakan lokal yang seragam dengan 1 optimum global tepat di <code>(0, 0)</code> bernilai <code>f = 0</code>.</p>
          </div>
          <div class="explain-card">
            <div class="explain-kicker">CARA MEMBACA SIMULASI [SIMULASI]</div>
            <ul class="explain-list">
              <li><strong>Kurva Merah:</strong> Hybrid GOA-ALO (lihat penurunan tajam tepat melewati poros <code>L/2</code>!).</li>
              <li><strong>Kurva Biru Putus:</strong> GOA Murni | <strong>Kurva Hijau:</strong> ALO Murni.</li>
              <li><em>Catatan jujur:</em> ini simulasi 2D browser untuk intuisi, bukan pengganti uji 30 run paper.</li>
            </ul>
          </div>
        </div>
      `,
      action: 'lab:compare',
      notes: {
        say: 'Jelaskan dulu apa yang harus diamati sebelum membuka kanvas 3D agar kelas tahu ke mana harus melihat.',
        ask: 'Apa tanda visual jika sebuah metode terjebak di optimum lokal pada grafik konvergensi?',
        expect: 'Garisnya mendatar tinggi di atas angka 0 dan tidak turun lagi.'
      }
    },
    {
      id: 'c7-live',
      core: false,
      phase: 'TAHAP 4: VISUALISASI LAB 3D/2D',
      badge: '4. LAB AKTIF',
      hook: 'Tekan Jalankan (Space) & Putar Medan 3D!',
      captionHtml: 'Kontrol Dasar hanya menampilkan 4 tombol penting (L8). Buka lipatan <strong>Parameter Lanjutan</strong> bila ingin mengubah N, L, f, l, atau Seed.',
      mood: 'aha',
      mode: 'interactive',
      action: 'lab:live',
      notes: {
        say: 'Tekan Space untuk menjalankan simulasi; bila komputer lambat, klik Ganti ke 2D Kontur.',
        ask: 'Perhatikan kurva merah tepat melewati garis L/2! Apa yang terjadi?',
        expect: 'Kurva Hybrid menukik lebih dalam menuju 0 dibanding GOA dan ALO tunggal.'
      }
    }
  ],

  // =========================================================================
  // KARTU VIII: BUKTI EMPIRIS PAPER & CATATAN KRITIS (A1-A4)
  // =========================================================================
  [
    {
      id: 'c8-intro',
      core: true,
      phase: 'TAHAP 1-2: CARA BACA TABEL',
      badge: '1. CARA BACA',
      hook: 'Mengapa Penelitian Metaheuristik Wajib 20-30 Run?',
      captionHtml: 'Karena metaheuristik memakai angka acak, 1 kali jalan bisa saja kebetulan beruntung. Paper menguji <strong>30 run independen</strong> lalu melaporkan <em>Mean, Std,</em> &amp; <em>Total Rank</em> <span class="src-badge src-paper">[Paper]</span>.',
      mood: 'greet',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker">HASIL UTAMA [PAPER: AMAIREH DKK., 2023]</div>
            <ul class="explain-list">
              <li><strong>Unimodal F1-F11 (Tabel 6):</strong> Total Rank Hybrid = <strong>15</strong> (terendah dari 13 metode).</li>
              <li><strong>Multimodal/Komposit F12-F32 (Tabel 7):</strong> Total Rank Hybrid = <strong>57</strong> (terendah dari 13 metode).</li>
              <li><strong>Antena LAA 32-elemen (Tabel 1-2):</strong> Max SLL <strong>-14,73 dB</strong> (ALO -14,27; GOA -9,09), Null <strong>-147,91 dB</strong>, 20-run mean <strong>-186,876 dB</strong> (vs ALO -92,72; GOA -81,08).</li>
              <li><strong>Antena CCAA (Tabel 3):</strong> Max SLL Hybrid <strong>-31,84 dB</strong> (ALO -30,37; BBO -29,61; EP -28,92).</li>
            </ul>
          </div>
          <div class="explain-card">
            <div class="explain-kicker text-alo">CATATAN KRITIS WAJIB (JUJUR &amp; ILMIAH)</div>
            <ul class="explain-list">
              <li><strong>CEC2015 (Tabel 9):</strong> <strong>SPS-L-SHADE-EIG (333)</strong> lebih baik dari Hybrid (<strong>402</strong>) pada total rank!</li>
              <li><strong>Waktu CPU LAA (Bag. 5.3):</strong> Hybrid <strong>213 s</strong> lebih lambat dari GOA (<strong>195 s</strong>) dan ALO (<strong>67 s</strong>).</li>
              <li><strong>MCT-PSO (Alsaidy 2020):</strong> beberapa sel 200/400 tugas (2,2 &amp; 4,2 dtk) identik dengan MCT murni, dan start heuristik Gambar 13 (114-124) tampak lebih tinggi dari acak (100).</li>
            </ul>
          </div>
        </div>
      `,
      action: 'bench:unimodal',
      notes: {
        say: 'Sampaikan kedua sisi secara berimbang: keunggulan di tabel klasik/antena DAN keterbatasan di CEC2015, waktu CPU, serta catatan kritis MCT-PSO.',
        ask: 'Mengapa Hybrid tetap butuh waktu CPU 3x lebih lama dari ALO pada antena LAA?',
        expect: 'Karena di setiap iterasi ia menghitung gaya sosial GOA sekaligus jalan acak corong ALO.'
      }
    },
    {
      id: 'c8-viz',
      core: true,
      phase: 'TAHAP 4: VISUALISASI GRAFIK PAPER',
      badge: '4. VISUAL DATA',
      hook: 'Lihat Grafik Total Rank & Uji Antena Nyata!',
      captionHtml: '<span class="src-badge src-paper">[Paper: Tabel 1-9]</span> Pada Total Rank, batang lebih pendek berarti peringkat lebih baik. Klik 4 tab untuk melihat Unimodal, Multimodal, CEC2015, &amp; Antena!',
      mood: 'aha',
      mode: 'interactive',
      action: 'bench:unimodal',
      notes: {
        say: 'Klik tab CEC2015 untuk menunjukkan secara jujur batang SPS-L-SHADE-EIG (333) lebih pendek dari Hybrid (402).',
        ask: 'Apakah hasil CEC2015 membuktikan Teorema No Free Lunch?',
        expect: 'Ya, tidak ada satu algoritma tunggal yang memuncaki semua jenis benchmark.'
      }
    }
  ],

  // =========================================================================
  // KARTU IX: KESIMPULAN, REKOMENDASI HYBRID TERBAIK, KUIS 8 SOAL & PUSTAKA
  // =========================================================================
  [
    {
      id: 'c9-conclude',
      core: true,
      phase: 'KESIMPULAN & REKOMENDASI HYBRID TERBAIK',
      badge: 'KESIMPULAN',
      hook: 'Kesimpulan Akhir: Hybrid Mana yang Terbaik & Kapan Dipakai?',
      captionHtml: 'Ingat <em>No Free Lunch (1997)</em>: tidak ada 1 pemenang untuk semua kasus. Namun untuk <strong>akurasi kontinu kompleks -> Hybrid GOA-ALO (Pola C)</strong>; untuk <strong>penjadwalan cloud &amp; CPU hemat -> MCT-PSO (Pola B)</strong>!',
      mood: 'proud',
      mode: 'explain',
      explainHtml: `
        <div class="explain-grid">
          <div class="explain-card">
            <div class="explain-kicker text-alo">KESIMPULAN UTAMA MATERI</div>
            <ul class="explain-list">
              <li><strong>Teorema No Free Lunch (1997):</strong> tiap algoritma punya titik kuat &amp; lemah; hibridisasi memadukan kelebihan keduanya <span class="src-badge src-paper">[Paper]</span>.</li>
              <li><strong>Pola B (MCT-PSO <span class="src-badge src-paper">[Paper]</span> / MCT-GOA <span class="src-badge src-prop">[Usulan]</span>):</strong> start cepat &amp; ringan CPU (<code>67 dtk vs 87 dtk</code> pada 1000 tugas), cocok bila ada heuristik awal cepat.</li>
              <li><strong>Pola C (Hybrid GOA-ALO <span class="src-badge src-paper">[Paper]</span>):</strong> unggul di 32 uji klasik (Rank <code>15</code> &amp; <code>57</code>) &amp; antena nyata (<code>-147,91 dB</code>, CCAA <code>-31,84 dB</code>), dengan biaya CPU lebih tinggi (<code>213 s vs 67 s</code>) &amp; CEC2015 #2 (<code>402 vs 333</code>).</li>
            </ul>
          </div>
          <div class="explain-card">
            <div class="explain-kicker text-mct">REKOMENDASI HYBRID TERBAIK (PERTIMBANGAN DIDAKTIK <span class="src-badge src-prop">[Usulan]</span>)</div>
            <ol class="explain-list">
              <li><strong>Terbaik Secara Umum (Akurasi Global &amp; Masalah Kontinu Multimodal):</strong> pilih <strong>Hybrid GOA-ALO (Pola C)</strong> karena bukti empiris paling komprehensif serta pivot <code>L/2</code> + 3-sampel sangat tangguh menghindari jebakan lokal.</li>
              <li><strong>Terbaik untuk Penjadwalan Cloud / Anggaran CPU Ketat:</strong> pilih <strong>MCT-PSO (Pola B)</strong> dengan <strong>seeding parsial 10-30%</strong> agar tetap hemat komputasi tanpa kehilangan keragaman partikel.</li>
              <li><strong>Arah Pengembangan Masa Depan:</strong> kombinasi <em>seeding parsial MCT + metaheuristik adaptif</em> menjanjikan untuk masalah diskrit skala besar (wajib diuji 30 run sebelum diklaim).</li>
            </ol>
          </div>
        </div>
      `,
      action: 'synth:rule',
      notes: {
        say: 'Tutup materi dengan kesimpulan jujur berimbang lalu beri rekomendasi tegas berdasarkan karakteristik masalah (Kontinu Akurasi -> Hybrid GOA-ALO; Penjadwalan Cloud Hemat CPU -> MCT-PSO seeding parsial).',
        ask: 'Jika kamu diminta menjadwalkan 1.000 tugas server secara cepat vs merancang antena 32 elemen berpresisi tinggi, hybrid mana yang kamu pilih untuk masing-masing?',
        expect: 'Penjadwalan cepat -> Pola B (MCT-PSO seeding parsial); desain antena presisi tinggi -> Pola C (Hybrid GOA-ALO).'
      }
    },
    {
      id: 'c9-summary',
      core: true,
      phase: 'RANGKUMAN CHEAT SHEET',
      badge: 'CHEAT SHEET',
      hook: 'Cheat Sheet 1 Halaman: MCT-PSO, MCT-GOA, & Hybrid GOA-ALO!',
      captionHtml: 'Rekomendasi pemilihan pola di bawah adalah <strong>pertimbangan didaktik</strong> <span class="src-badge src-prop">[Usulan]</span>. Lihat rangkuman keputusan &amp; matriks pemilih pola!',
      mood: 'point',
      mode: 'visual',
      action: 'synth:rule',
      notes: {
        say: 'Ringkas perbedaan Pola B (MCT-PSO / MCT-GOA) dan Pola C (Hybrid GOA-ALO) sebagai penguat ingatan sebelum kuis.',
        ask: 'Siapa yang bisa menyebutkan satu kelebihan dan satu keterbatasan dari Pola B dan Pola C?',
        expect: 'Pola B cepat tapi bergantung heuristik awal; Pola C akurat di peta rumit tapi waktu CPU lebih lama.'
      }
    },
    {
      id: 'c9-quiz',
      core: true,
      phase: 'CEK PEMAHAMAN & PUSTAKA',
      badge: 'KUIS 8 SOAL',
      hook: 'Uji Pemahaman: Kuis Akhir 8 Soal & Daftar Pustaka!',
      captionHtml: 'Jawab 8 soal singkat (termasuk klasifikasi Pola A/B/C) dengan umpan balik langsung. Target pemahaman: <strong>minimal 80% benar</strong>!',
      mood: 'aha',
      mode: 'interactive',
      action: 'synth:quiz',
      notes: {
        say: 'Bahas bersama 2-3 soal kunci dan pastikan sumber lengkap Amaireh (2023), Alsaidy (2020), & Kennedy-Eberhart (1995) tampil jelas.',
        ask: 'Ada pertanyaan penutup sebelum kita kembali ke meja 9 kartu 3D?',
        expect: 'Sesi tanya jawab selesai.'
      }
    }
  ]
];

// PRD M9: 8-Question Final Quiz (including Pattern A/B/C classification exercise)
export const FINAL_QUIZ_QUESTIONS = [
  {
    q: '1. Apa perbedaan utama Optimum Lokal dan Optimum Global?',
    opts: ['Lokal selalu lebih kecil dari Global', 'Lokal terbaik di sekitar kecil, Global terbaik di seluruh ruang pencarian', 'Keduanya selalu berada di posisi yang sama'],
    ans: 1,
    why: 'Optimum lokal hanya paling rendah di lembah sekitarnya; optimum global adalah lembah terdalam di seluruh peta.'
  },
  {
    q: '2. Mana pasangan yang benar: Heuristik vs Metaheuristik?',
    opts: ['MCT = Heuristik; GOA & ALO = Metaheuristik', 'GOA = Heuristik; MCT = Metaheuristik', 'Semua algoritma optimasi adalah heuristik deterministik'],
    ans: 0,
    why: 'MCT adalah aturan cepat deterministik satu jalan (heuristik); GOA dan ALO adalah pencarian berulang berbasis populasi (metaheuristik).'
  },
  {
    q: '3. Pada contoh M3-M4 (T1..T4 = 4000, 2000, 3000, 1000 MI; VM1=1000, VM2=2000 MIPS), berapa Makespan hasil MCT?',
    opts: ['10,0 detik', '5,0 detik', '3,5 detik'],
    ans: 2,
    why: 'T1->VM2(2s), T2->VM1(2s), T3->VM2(3,5s), T4->VM1(3s). Makespan = max(3,0; 3,5) = 3,5 detik.'
  },
  {
    q: '4. Bagaimana status ilmiah "MCT-seeded GOA" terhadap makalah Alsaidy dkk. (2020)?',
    opts: ['Hasil eksperimen langsung di makalah tersebut', 'Usulan adaptasi desain, karena makalah asli memakai PSO bukan GOA', 'Bagian dari makalah Amaireh dkk. (2023)'],
    ans: 1,
    why: 'Makalah Alsaidy dkk. (2020) menguji MCT-PSO (67 dtk vs 87 dtk PSO acak). Menerapkannya ke GOA adalah [Usulan] adaptasi.'
  },
  {
    q: '5. Pada fungsi gaya sosial GOA s(r), apa yang terjadi jika dua belalang terlalu dekat (r < r0)?',
    opts: ['Saling tolak (repulsi, panah oranye putus) agar tidak menumpuk', 'Saling tarik kuat ke satu titik', 'Algoritma langsung berhenti'],
    ans: 0,
    why: 'Saat r < r0, nilai s(r) negatif sehingga agen saling menolak untuk menjaga keragaman eksplorasi.'
  },
  {
    q: '6. Mengapa Hybrid GOA-ALO menurunkan parameter c hingga c_min tepat pada separuh iterasi (L/2)?',
    opts: ['Untuk menghemat 50% jumlah agen', 'Agar 50% iterasi kedua difokuskan penuh pada eksploitasi presisi', 'Supaya algoritma tidak perlu memakai ALO'],
    ans: 1,
    why: 'Menurut klaim penulis paper, GOA asli kehabisan iterasi untuk eksploitasi; pivot L/2 memberi separuh iterasi penuh untuk memperhalus solusi.'
  },
  {
    q: '7. Manakah catatan kritis yang BENAR tentang hasil empiris Amaireh dkk. (2023)?',
    opts: ['Hybrid menang mutlak di semua uji termasuk CEC2015 dan paling cepat', 'Di CEC2015 SPS-L-SHADE-EIG (333) lebih baik dari Hybrid (402), dan CPU Hybrid (213 s) lebih lambat dari ALO (67 s)', 'Hybrid tidak pernah diuji pada masalah antena nyata'],
    ans: 1,
    why: 'Tabel 9 menunjukkan SPS-L-SHADE-EIG (333) unggul atas Hybrid (402), dan Bagian 5.3 melaporkan CPU LAA 213 s vs ALO 67 s.'
  },
  {
    q: '8. [Latihan Klasifikasi Pola] Jika algoritma baru menggabungkan Genetic Algorithm (GA) + Simulated Annealing (SA) secara bergantian di setiap iterasi, termasuk pola apa?',
    opts: ['Pola A (algoritma tunggal tanpa hibridisasi)', 'Pola B (heuristik deterministik 1x di awal -> metaheuristik)', 'Pola C (metaheuristik + metaheuristik bekerja sama selama iterasi)'],
    ans: 2,
    why: 'GA dan SA sama-sama metaheuristik yang berkolaborasi selama loop pencarian, sehingga masuk Pola C.'
  }
];

export class ShortsStageController {
  constructor({ onBeatChange, onNextCard, onRevealCard } = {}) {
    this.onBeatChange = onBeatChange;
    this.onNextCard = onNextCard;
    this.onRevealCard = onRevealCard;
    this.cardIdx = 0;
    this.beatIdx = 0;
    this.trackKey = '45m';
    this.forceMode = null; // null | 'interactive'
    this.isCardFaceDown = false;

    this.cardFrontFace = document.getElementById('card-front-face');
    this.explainPanel = document.getElementById('beat-explain-panel');
    this.explainPhase = document.getElementById('beat-explain-phase');
    this.explainTitle = document.getElementById('beat-explain-title');
    this.explainBody = document.getElementById('beat-explain-body');

    this.progressBar = document.getElementById('shorts-progress-bar');
    this.beatCounter = document.getElementById('shorts-beat-counter');
    this.modeToggleBtn = document.getElementById('shorts-mode-toggle');
    this.butlerBadge = document.getElementById('butler-badge-svg');
    this.butlerMoodPill = document.getElementById('butler-mood-pill');
    this.hookEl = document.getElementById('butler-hook-text');
    this.captionEl = document.getElementById('butler-caption-text');
    this.captionInner = document.getElementById('butler-caption-inner');
    this.prevBtn = document.getElementById('beat-prev-btn');
    this.nextBtn = document.getElementById('beat-next-btn');

    this.notesSay = document.getElementById('notes-say');
    this.notesAsk = document.getElementById('notes-ask');
    this.notesExpect = document.getElementById('notes-expect');
    this.presProgress = document.getElementById('pres-progress-pill');

    this._bindEvents();
  }

  _bindEvents() {
    this.prevBtn?.addEventListener('click', () => { if (!this.isCardFaceDown) this.prevBeat(); });
    this.nextBtn?.addEventListener('click', () => {
      if (this.isCardFaceDown) this.onRevealCard && this.onRevealCard();
      else this.nextBeat();
    });
    this.modeToggleBtn?.addEventListener('click', () => this.toggleInteractiveMode());
  }

  setDurationTrack(trackKey) {
    if (!DURATION_TRACKS[trackKey]) return;
    this.trackKey = trackKey;
    const beats = this.getBeats();
    if (this.beatIdx >= beats.length) this.beatIdx = 0;
    this._render();
    if (!this.isCardFaceDown) this._emit();
  }

  getTrackCards() {
    return (DURATION_TRACKS[this.trackKey] || DURATION_TRACKS['45m']).cards;
  }

  getBeats(cardIdx = this.cardIdx) {
    const all = CARD_BEATS[cardIdx] || CARD_BEATS[0];
    const track = DURATION_TRACKS[this.trackKey] || DURATION_TRACKS['45m'];
    if (!track.coreOnly) return all;
    const filtered = all.filter((b) => b.core);
    return filtered.length ? filtered : all;
  }

  getCurrentBeat() {
    const beats = this.getBeats();
    const raw = beats[this.beatIdx] || beats[0];
    return {
      ...raw,
      effectiveMode: this.forceMode || raw.mode,
      cardIdx: this.cardIdx,
      beatIdx: this.beatIdx,
      totalBeats: beats.length
    };
  }

  showClosedCardDialogue(meta) {
    this.isCardFaceDown = true;
    renderButler2DSvg(this.butlerBadge, { mood: 'deal', compact: true });
    if (this.butlerMoodPill) this.butlerMoodPill.textContent = `KARTU ${meta.roman} TERTUTUP | SIR PIP`;
    if (this.hookEl) this.hookEl.textContent = `Kartu ${meta.roman} Siap Dibalik!`;
    if (this.captionEl) this.captionEl.innerHTML = `${meta.teaser} Klik kartunya atau tekan <strong>Balik Kartu</strong>!`;
    if (this.prevBtn) this.prevBtn.disabled = true;
    if (this.nextBtn) {
      this.nextBtn.disabled = false;
      this.nextBtn.textContent = `Balik Kartu ${meta.roman} ->`;
    }
  }

  loadCard(cardIdx, { beatIdx = 0 } = {}) {
    this.isCardFaceDown = false;
    this.cardIdx = Math.max(0, Math.min(CARD_BEATS.length - 1, cardIdx));
    const beats = this.getBeats();
    this.beatIdx = Math.max(0, Math.min(beats.length - 1, beatIdx));
    this.forceMode = null;
    this._render();
    this._emit();
  }

  goToBeat(beatIdx) {
    const beats = this.getBeats();
    this.beatIdx = Math.max(0, Math.min(beats.length - 1, beatIdx));
    this.forceMode = null;
    this._render();
    this._emit();
  }

  nextBeat() {
    const beats = this.getBeats();
    if (this.beatIdx < beats.length - 1) {
      this.goToBeat(this.beatIdx + 1);
    } else {
      const trackCards = this.getTrackCards();
      const pos = trackCards.indexOf(this.cardIdx);
      const nextCard = pos >= 0 && pos < trackCards.length - 1
        ? trackCards[pos + 1]
        : this.cardIdx < CARD_BEATS.length - 1 ? this.cardIdx + 1 : null;
      if (nextCard !== null && this.onNextCard) this.onNextCard(nextCard);
    }
  }

  prevBeat() {
    if (this.beatIdx > 0) this.goToBeat(this.beatIdx - 1);
  }

  toggleInteractiveMode() {
    const beat = this.getCurrentBeat();
    if (beat.effectiveMode === 'interactive') {
      this.forceMode = null;
      if (beat.mode === 'interactive' && this.beatIdx > 0) this.beatIdx = 0;
    } else {
      this.forceMode = 'interactive';
    }
    this._render();
    this._emit();
  }

  _render() {
    const beats = this.getBeats();
    const beat = this.getCurrentBeat();
    const safeMood = BUTLER_MOODS.includes(beat.mood) ? beat.mood : 'greet';

    // 3 Clean Modes: 'explain' (Intro/Arti/Cara Kerja BEFORE visual), 'visual' (Shapes Visual), 'interactive' (Simulator/Lab/Quiz)
    if (this.cardFrontFace) this.cardFrontFace.setAttribute('data-stage-mode', beat.effectiveMode);

    if (beat.effectiveMode === 'explain' && beat.explainHtml) {
      if (this.explainPhase) this.explainPhase.textContent = beat.phase || beat.badge;
      if (this.explainTitle) this.explainTitle.textContent = beat.hook;
      if (this.explainBody) this.explainBody.innerHTML = beat.explainHtml;
    }

    if (this.progressBar) {
      this.progressBar.innerHTML = beats.map((b, i) => {
        const stateCls = i < this.beatIdx ? 'is-done' : i === this.beatIdx ? 'is-current' : '';
        return `
          <button type="button" class="shorts-seg ${stateCls}" data-beat-idx="${i}"
                  aria-label="Tahap ${i + 1} dari ${beats.length}: ${b.badge}"
                  aria-current="${i === this.beatIdx ? 'step' : 'false'}">
            <span class="shorts-seg-fill"></span>
          </button>
        `;
      }).join('');
      this.progressBar.querySelectorAll('.shorts-seg').forEach((btn) => {
        btn.addEventListener('click', () => this.goToBeat(Number(btn.dataset.beatIdx)));
      });
    }

    const progLabel = `Kartu ${this.cardIdx + 1}/9 · ${beat.badge} (${this.beatIdx + 1}/${beats.length})`;
    if (this.beatCounter) this.beatCounter.textContent = progLabel;
    if (this.presProgress) this.presProgress.textContent = progLabel;

    if (this.modeToggleBtn) {
      const isInter = beat.effectiveMode === 'interactive';
      this.modeToggleBtn.textContent = isInter ? 'Kembali ke Urutan' : 'Langsung Visual / Lab';
      this.modeToggleBtn.classList.toggle('btn-goa', !isInter);
      this.modeToggleBtn.classList.toggle('btn-gold', isInter);
    }

    renderButler2DSvg(this.butlerBadge, { mood: safeMood, compact: true });
    if (this.butlerMoodPill) this.butlerMoodPill.textContent = `${beat.badge} | SIR PIP`;
    if (this.hookEl) this.hookEl.textContent = beat.hook;
    if (this.captionEl) this.captionEl.innerHTML = beat.captionHtml;

    if (this.captionInner) {
      this.captionInner.classList.remove('is-pop');
      void this.captionInner.offsetWidth;
      this.captionInner.classList.add('is-pop');
    }

    if (beat.notes) {
      if (this.notesSay) this.notesSay.textContent = beat.notes.say;
      if (this.notesAsk) this.notesAsk.textContent = beat.notes.ask;
      if (this.notesExpect) this.notesExpect.textContent = beat.notes.expect;
    }

    if (this.prevBtn) this.prevBtn.disabled = this.beatIdx === 0;
    if (this.nextBtn) {
      const trackCards = this.getTrackCards();
      const pos = trackCards.indexOf(this.cardIdx);
      const hasNextCard = pos >= 0 ? pos < trackCards.length - 1 : this.cardIdx < CARD_BEATS.length - 1;
      const isLastBeat = this.beatIdx === beats.length - 1;
      this.nextBtn.disabled = isLastBeat && !hasNextCard;
      this.nextBtn.textContent = isLastBeat && hasNextCard
        ? 'Kartu Berikutnya ->'
        : isLastBeat && !hasNextCard
          ? 'Selesai'
          : 'Lanjut ->';
    }
  }

  _emit() {
    this.onBeatChange && this.onBeatChange(this.getCurrentBeat());
  }
}
