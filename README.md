# Hybrid Metaheuristik: MCT-PSO / MCT-GOA dan Hybrid GOA-ALO (Card Wars SOKA)

Media pembelajaran dan presentasi web interaktif bergaya **Tabletop Simulator: Card Wars 3D** untuk mata kuliah **SOKA (Sistem Optimasi dan Kecerdasan Artifisial)**. Dirancang agar pemula tanpa latar belakang optimasi atau kalkulus dapat memahami dua pola utama hibridisasi algoritma secara urut dari nol hingga bukti empiris makalah.

Web ini berjalan **100% offline tanpa CDN eksternal** (Three.js dan seluruh font sudah dibundel di folder `vendor/`), serta memiliki fallback otomatis ke mode 2D jika perangkat tidak mendukung WebGL.

---

## Fitur Utama

- **Meja 9 Kartu 3D Interaktif:** 9 kartu bergambar unik di atas meja pantai 3D (*Three.js*) bersama maskot **Butler Sir Pip**; arahkan kursor untuk mengangkat kartu dan klik untuk membukanya.
- **Alur Belajar Urut & Terstruktur:** setiap kartu mengikuti urutan **1. Intro -> 2. Arti Algoritma -> 3. Cara Kerja & Implementasi -> 4. Visualisasi & Simulasi**, dilengkapi legenda kosakata bentuk (*shapes*) permanen.
- **Kejujuran Ilmiah dengan Lencana Sumber:** setiap klaim angka dan visual ditandai jelas dengan lencana `[Paper]`, `[Simulasi]`, atau `[Usulan]`.
- **Simulator & Lab Real-Time di Browser:**
  - **Pola B (Cloud Task Scheduling):** walkthrough hitung manual 4 tugas pada 2 VM (`MS = 3,5 detik` vs jadwal buruk `10,0 detik`), serta simulator langsung perbandingan **MCT-PSO**, **MCT-GOA**, dan **start acak**.
  - **Pola C (Hybrid GOA-ALO):** visualisasi medan gaya sosial GOA (`s(r)` dengan panah tolak oranye putus vs tarik biru solid), corong pasir ALO, flowchart 6 tahap, kurva pivot `c` di `L/2`, tangga `w`, dan **Lab 3D/2D** pada fungsi uji `F1`, `F13 (Rastrigin)`, `F14`, `F15`, dan `F31`.
- **Siap Presentasi di Kelas:** Mode Presentasi proyektor (`P`), Catatan Dosen per ketukan (`S`), 3 jalur durasi (**Kilat 15m**, **Standar 30m**, **Lengkap 45m**), Glosarium 16 istilah, Tema Terang/Gelap, Kuis Akhir 8 soal berumpan balik, dan tata letak cetak cadangan PDF.

---

## Struktur 9 Kartu Materi

| Kartu | Topik | Fokus Utama |
| :---: | :--- | :--- |
| **I** | **Intro & Arti Optimasi** | Tujuan belajar, arti *optimasi*, *fitness*, optimum lokal vs global, eksplorasi vs eksploitasi, serta uji bola klik-bukit. |
| **II** | **Heuristik vs Metaheuristik & Pola B vs C** | Teorema *No Free Lunch* (1997), beda heuristik 1-jalan vs metaheuristik berulang, Pola B (Estafet) vs Pola C (Kerja Tim). |
| **III** | **Arti 4 Algoritma Inti** | Definisi, analogi, kelebihan, dan kelemahan **MCT**, **PSO**, **GOA**, dan **ALO** sebelum masuk implementasi. |
| **IV** | **Cara Kerja & Implementasi Pola B** | Studi kasus penjadwalan cloud (`ECT = T/V`, `MS`), hitung manual `3,5 dtk`, *encoding* `floor(x_i)`, dan simulator **MCT-PSO** `[Paper]` vs **MCT-GOA** `[Usulan]`. |
| **V** | **Cara Kerja & Implementasi Pola C** | 6 tahap implementasi **Hybrid GOA-ALO**, poros modifikasi `c` di `L/2`, tangga `w` (`1..6`), dan seleksi 3-sampel `[Paper]`. |
| **VI** | **Anatomi Visual GOA & ALO** | Contoh angka kecil `s(r)` & rasio `I` sebelum animasi interaktif medan gaya sosial dan penyempitan corong pasir. |
| **VII** | **Lab Simulasi 3D & 2D** | Adu langsung **Hybrid GOA-ALO vs GOA vs ALO** pada Rastrigin (`F13`) dengan Kontrol Dasar (`<= 5` tombol) dan Parameter Lanjutan terlipat. |
| **VIII** | **Bukti Empiris Paper & Catatan Kritis** | 5 tab data terverifikasi: Unimodal (T6: Rank `15`), Multimodal (T7: Rank `57`), CEC2015 (T9: `333` vs `402`), Antena LAA/CCAA (T1-3: `-147,91 dB` / `-31,84 dB`), dan MCT-PSO (`67 dtk` vs `87 dtk`), lengkap dengan catatan waktu CPU (`213 s vs 67 s`). |
| **IX** | **Kesimpulan, Rekomendasi & Kuis** | Kesimpulan akhir, rekomendasi hybrid terbaik berdasarkan kasus, *cheat sheet* & matriks pemilih pola, kuis akhir 8 soal, dan daftar pustaka lengkap. |

---

## Cara Menjalankan Secara Lokal

Karena aplikasi memakai ES Modules (`type="module"`), jalankan melalui server HTTP lokal (bukan klik ganda `file://`):

```bash
# Menggunakan Python 3
python -m http.server 8765
```

Lalu buka browser dan akses:

```text
http://localhost:8765
```

*(Alternatif lain: gunakan ekstensi **Live Server** di VS Code atau `npx serve .`.)*

---

## Pintasan Keyboard

| Tombol | Fungsi |
| :---: | :--- |
| `Space` / `N` | Lanjut ketukan (*beat*) berikutnya (atau jalankan/jeda simulasi di Lab) |
| `B` | Mundur ke ketukan sebelumnya |
| `1` - `9` | Lompat langsung ke Kartu I sampai IX |
| `<-` / `->` | Pindah ke kartu sebelumnya / berikutnya |
| `T` | Kembali ke tampilan penuh Meja 9 Kartu 3D |
| `F` | Balik sisi depan / belakang kartu |
| `P` | Aktifkan / keluar dari Mode Presentasi proyektor |
| `S` | Buka / tutup panel Catatan Dosen (*speaker notes*) |
| `Esc` | Tutup popover, catatan dosen, atau keluar dari mode aktif |

---

## Struktur Direktori

```text
.
├── index.html                  # Halaman utama 9 kartu, HUD, & panel kontrol
├── css/
│   └── atlas-theme.css         # Desain Card Wars, tema terang/gelap, Mode Fokus & Presentasi
├── js/
│   ├── algorithms/
│   │   ├── benchmarks.js       # Fungsi uji (F1, F13, F14, F15, F31) & data empiris paper
│   │   ├── mct-goa.js          # Mesin MCT, Canonical PSO (MCT-PSO), & MCT-GOA
│   │   └── hybrid-goa-alo.js   # Mesin Hybrid GOA-ALO (Eq. 1-13, pivot L/2, tangga w)
│   ├── ui/
│   │   ├── controls.js         # Pengendali utama interaksi, simulator, & GPU handoff
│   │   ├── deck.js             # Pengelola 9 kartu, flip 2-fase, HUD, & pintasan keyboard
│   │   └── shorts-stage.js     # Mesin 32 ketukan terurut, glosarium, speaker notes, & kuis
│   └── viz/
│       ├── world-3d.js         # Dunia meja 3D Card Wars, 9 kartu 3D, Sir Pip, & fallback 2D
│       ├── three-lab.js        # Lab lanskap topografi 3D WebGL & kontur 2D
│       ├── svg-illustrator.js  # Ilustrasi vektor shapes, legenda permanen, & Sir Pip 2D
│       └── svg-charts.js       # Grafik kurva s(r), decay c, tangga w, konvergensi, & benchmark
├── vendor/
│   ├── three/                  # Three.js & OrbitControls lokal (offline)
│   └── fonts/                  # Fredoka, Plus Jakarta Sans, & JetBrains Mono (.woff2 lokal)
└── Paper-goa-alo.pdf           # Makalah rujukan utama Pola C
```

---

## Rujukan Ilmiah

1. **Amaireh, A. A., Al-Zoubi, A. S., & Dib, N. I. (2023).** *A new hybrid optimization technique based on antlion and grasshopper optimization algorithms.* Evolutionary Intelligence, 16, 1383-1422. DOI: `10.1007/s12065-022-00749-4`.
2. **Alsaidy, S. A., Abbood, A. D., & Sahib, M. A. (2020).** *Heuristic initialization of PSO task scheduling algorithm in cloud computing.* Journal of King Saud University - Computer and Information Sciences. *(Rujukan empiris ide seeding MCT-PSO; adaptasi MCT-GOA pada web ini dilabeli `[Usulan]`.)*
3. **Kennedy, J., & Eberhart, R. (1995).** *Particle swarm optimization.* Proceedings of ICNN'95 - IEEE International Conference on Neural Networks, Vol. 4, 1942-1948.
4. **Saremi, S., Mirjalili, S., & Lewis, A. (2017).** *Grasshopper Optimisation Algorithm: Theory and application.* Advances in Engineering Software, 105, 30-47.
5. **Mirjalili, S. (2015).** *The Ant Lion Optimizer.* Advances in Engineering Software, 83, 80-98.
6. **Wolpert, D. H., & Macready, W. G. (1997).** *No Free Lunch Theorems for Optimization.* IEEE Transactions on Evolutionary Computation, 1(1), 67-82.
