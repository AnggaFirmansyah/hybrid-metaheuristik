# PRD: Web Presentasi Interaktif Klasifikasi Algoritma Hybrid Metaheuristik (MCT-seeded GOA & Hybrid GOA-ALO)

> **Dokumen Ini Adalah:** Product Requirements Document (PRD) komprehensif sekaligus *Design & Engineering Blueprint* bagi AI Coding Agent untuk membangun aplikasi presentasi web interaktif berbasis **HTML5, Tailwind CSS, Three.js, GSAP, dan Custom Vector SVG**.
>
> **Status Referensi Akademis:**
> - **Hybrid GOA-ALO (Pola C):** Sepenuhnya dilandaskan pada paper referensi di folder kerja: [(fix) s12065-022-00749-4.pdf](file:///D:/koleg-v2/Semester%205/SOKA/HTML-Pages-SOKA-Hybrid/(fix)%20s12065-022-00749-4.pdf) (Amaireh, Al-Zoubi, & Dib, 2023).
> - **MCT-seeded GOA (Pola B):** Belum terdapat file PDF khusus di folder kerja saat PRD ini disusun. Formulasi di dalam dokumen ini menggunakan definisi kanonik heuristik *Minimum Completion Time* (MCT) + metaheuristik *Grasshopper Optimization Algorithm* (Saremi et al., 2017, Ref. [37] pada paper utama) dengan penanda `[CITASI PAPER MCT-GOA MENYUSUL]` sesuai aturan kejujuran konten Anti-Slop (`R-38`).

---

## 1. Ringkasan Eksekutif & Tujuan Produk

### 1.1 Latar Belakang Masalah
Materi presentasi algoritma optimasi hybrid sering gagal dipahami audiens karena hanya menampilkan pseudo-code statis dan rumus matematika tanpa memperlihatkan **mengapa dua algoritma digabungkan**, **bagaimana mekanisme perpindahan fase eksplorasi ke eksploitasi terjadi**, dan **apa dampak pengubahan parameter terhadap konvergensi**.

### 1.2 Kriteria Keberhasilan Audiens (Wajib Terpenuhi)
Aplikasi web presentasi dinyatakan berhasil apabila audiens yang menonton atau berinteraksi dengannya mampu:
1. **Memahami makna kedua algoritma berdasarkan landasan ilmiah:** Membedakan *Pola B (Heuristik -> Metaheuristik)* pada **MCT-seeded GOA** dan *Pola C (Metaheuristik + Metaheuristik)* pada **Hybrid GOA-ALO**, termasuk kelemahan algoritma tunggal yang diatasi.
2. **Memahami cara kerja kedua algoritma secara mekanistik:** Memahami proses *deterministic greedy seeding* MCT ke populasi awal GOA, serta interaksi *social forces* ($s(r)$), *roulette wheel*, *elite antlion*, modifikasi parameter $c$, dan penyusutan radius *random walk* ($c^t, d^t, w, I$) pada Hybrid GOA-ALO.
3. **Melihat dan menguji visualisasi cara kerja secara langsung:** Mengamati simulasi 3D (Three.js) dan diagram vektor 2D (SVG) secara *real-time*, serta **mengkustomisasi banyak nilai parameter numerik** untuk melihat perubahan perilaku agen dan kurva konvergensi seketika.

### 1.3 Mode Operasional & Stack Teknologi
- **Format Produk:** *Hybrid Interactive Presentation Deck* (8 slide utama berukuran viewport penuh desktop `100vh`, navigasi keyboard `ArrowLeft` / `ArrowRight` / `1-8`, daftar isi lompat cepat, serta panel kendali numerik interaktif di dalam slide simulasi).
- **Bahasa UI Presentasi:** Bahasa Indonesia akademik yang lugas dan natural (istilah teknis baku seperti *exploration, exploitation, seeding, makespan, roulette wheel, elite* dipertahankan).
- **Stack Teknis:**
  - **Struktur:** `index.html` + modul ES6 murni (`js/algorithms/`, `js/viz/`, `js/ui/`). Tidak memerlukan build step kompleks; cukup dijalankan via local static server (`python -m http.server` atau `npx serve`) dan menyiapkan folder `vendor/` lokal opsional untuk presentasi luring (*offline*).
  - **Styling:** Tailwind CSS (konfigurasi token warna & tipografi kustom sesuai `DESIGN.md` di Bagian 4).
  - **3D Engine:** Three.js (`OrbitControls`, `InstancedMesh` / `BufferGeometry` untuk kawanan agen & lanskap permukaan fungsi uji).
  - **Animasi & Koreografi:** GSAP (`gsap.matchMedia()` untuk dukungan `prefers-reduced-motion`).
  - **Aset Visual:** 100% **Custom Multi-Layer SVG** yang digambar langsung oleh AI agent sebagai ilustrator vektor (dilarang memakai ikon/ilustrasi stok generik).

---

## 2. Landasan Akademis & Spesifikasi Matematis Algoritma

> **Aturan Keras Kejujuran Data (`antislop R-17 & R-38`):** AI agent DILARANG mengarang angka statistik, persentase peningkatan, atau skor benchmark fiktif. Semua angka benchmark statis harus dikutip persis dari paper Amaireh et al. (2023), sedangkan angka pada simulasi interaktif harus dihitung secara **nyata (real-time)** oleh engine JavaScript di browser.

### 2.1 Taksonomi Klasifikasi Pola Hybrid

| Aspek | Pola B: MCT-seeded GOA | Pola C: Hybrid GOA-ALO |
|---|---|---|
| **Klasifikasi** | **Heuristik -> Metaheuristik** (Sekuensial / *Seeding*) | **Metaheuristik + Metaheuristik** (Ko-evolusioner / *Coupling*) |
| **Komponen 1** | **MCT (*Minimum Completion Time*)**: Heuristik deterministik sekali jalan (*single-pass greedy*). | **GOA (*Grasshopper Optimization Algorithm*)**: Metaheuristik berbasis kawanan (*swarm-based*). |
| **Komponen 2** | **GOA**: Metaheuristik berbasis populasi yang melanjutkan optimasi dari solusi awal hasil MCT. | **ALO (*Ant Lion Optimizer*)**: Metaheuristik berbasis evolusi/perburuan (*population + local trap search*). |
| **Tujuan Hibridisasi** | Menghindari titik awal acak (*random initialization*) yang buruk dengan menyuntikkan solusi awal berkualitas tinggi sebelum pencarian global dimulai. | Menyeimbangkan **eksplorasi** global (gaya sosial repulsi-atraksi GOA) dan **eksploitasi** lokal (perangkap corong, *roulette wheel*, dan *elitism* ALO). |
| **Sumber Landasan** | Formulasi standar MCT + GOA (Saremi et al., 2017 [37]) `[CITASI PAPER MCT-GOA MENYUSUL]` | **Amaireh, Al-Zoubi, & Dib (2023)**, *Evolutionary Intelligence* 16:1383-1422, DOI: `10.1007/s12065-022-00749-4` |

### 2.2 Spesifikasi Algoritma 1: MCT-seeded GOA (Pola B)

#### A. Makna & Cara Kerja (2 Tahap Berurutan)
1. **Tahap 1, Seeding Deterministik dengan MCT:**
   - Diberikan $M$ tugas (*tasks*) dengan beban kerja $W_k$ dan $K$ mesin/VM (*virtual machines*) dengan kecepatan komputasi $S_j$ serta waktu kesiapan mesin $ready_j$.
   - Waktu eksekusi tugas $k$ pada mesin $j$ adalah $ET_{kj} = \frac{W_k}{S_j}$.
   - Perkiraan waktu selesai adalah:
     $$CT_{kj} = ready_j + ET_{kj}$$
   - Untuk setiap tugas $k$ secara berurutan, MCT secara deterministik memilih mesin $j^* = \arg\min_{j \in \{1..K\}} CT_{kj}$, menempatkan tugas $k$ ke mesin $j^*$, dan memperbarui $ready_{j^*} \leftarrow CT_{kj^*}$.
   - Hasil akhir adalah solusi awal $X_{\text{MCT}}$ dengan nilai objektif *Makespan*:
     $$\text{Makespan} = \max_{j=1..K} (ready_j)$$
2. **Tahap 2, Injeksi ke Populasi Awal & Optimasi GOA:**
   - Populasi GOA terdiri dari $N$ belalang. Agen pertama (atau sejumlah $p_{\text{seed}}$ agen terbaik) diinisialisasi langsung dengan $X_{\text{MCT}}$ (atau variasi lokal di sekitarnya), sedangkan sisa agen $N - p_{\text{seed}}$ diinisialisasi secara acak untuk menjaga keragaman.
   - Pada setiap iterasi $l = 1 \dots L$, posisi belalang diperbarui mengikuti gaya sosial GOA (Saremi et al., 2017):
     $$s(r) = f e^{-r/l_s} - e^{-r}$$
     $$X_i^d = c \left( \sum_{j=1, j \neq i}^{N} c \frac{ub_d - lb_d}{2} s(|X_j^d - X_i^d|) \frac{X_j - X_i}{d_{ij}} \right) + \hat{T}_d$$
     di mana $c = c_{\max} - l \frac{c_{\max} - c_{\min}}{L}$ menyusutkan zona nyaman (*comfort zone*) menuju solusi target $\hat{T}_d$.
   - *Catatan Implementasi Diskrit untuk Scheduling:* Karena posisi GOA kontinu dalam rentang $[0, K)$, saat mengevaluasi *Makespan* di simulasi, vektor kontinu dipetakan ke indeks mesin via pembulatan terbatas (`Math.min(K - 1, Math.max(0, Math.floor(x)))` atau *Smallest Position Value* / *Largest Order Value*).

### 2.3 Spesifikasi Algoritma 2: Hybrid GOA-ALO (Pola C, Amaireh et al., 2023)

#### A. Masalah pada Algoritma Tunggal (Mengapa Harus Digabung?)
Mengacu pada Bagian 4.1, 4.2, dan 4.8 paper Amaireh et al. (2023):
- **Kelemahan ALO (Mirjalili, 2015 [36]):** Sangat kuat dalam *exploitation* melalui corong pasir, namun terlalu bergantung pada metode *roulette wheel* untuk memilih posisi berikutnya. Hal ini memicu **konvergensi dini (*premature convergence*)**, **hilangnya keragaman populasi**, dan kurangnya tekanan seleksi saat agen memiliki fitness yang mirip.
- **Kelemahan GOA (Saremi et al., 2017 [37]):** Sangat kuat dalam *exploration* menyeluruh lewat gaya repulsi-atraksi antar belalang. Namun persamaan $c$ linear standar (Eq. 8) menghabiskan mayoritas iterasi di fase eksplorasi sehingga **jumlah iterasi untuk eksploitasi tidak mencukupi** untuk memurnikan solusi global.

#### B. Rumus Matematis Wajib dari Paper (Eq. 1 sampai Eq. 13)
AI agent wajib mengimplementasikan logika persis dari Bagian 4 paper:

1. **Random Walk & Normalisasi Batas (Eq. 1-3):**
   $$x(t) = [0, \text{cumsum}(2r(t_1)-1), \text{cumsum}(2r(t_2)-1), \dots, \text{cumsum}(2r(t_n)-1)]$$
   $$r(t) = \begin{cases} 1 & \text{jika } \text{rand} > 0.5 \\ 0 & \text{jika } \text{rand} \le 0.5 \end{cases}$$
   $$X_i^t = \frac{(X_i^t - a_i) \times (d_i - c_i^t)}{(d_i^t - a_i)} + c_i$$
   di mana $a_i, d_i$ adalah nilai minimum/maksimum *random walk* variabel ke-$i$, sedangkan $c_i^t, d_i^t$ adalah batas minimum/maksimum variabel pada iterasi ke-$t$.

2. **Pengaruh Perangkap Antlion terhadap Belalang (Eq. 4-5):**
   $$c_i^t = \text{Antlion}_j^t + c^t, \qquad d_i^t = \text{Antlion}_j^t + d^t$$
   membentuk hipersfer pergerakan acak belalang di sekitar antlion ke-$j$ yang dipilih via *Roulette Wheel*.

3. **Interaksi Gaya Sosial Belalang (Eq. 6-7):**
   $$s(r) = f e^{-r/l} - e^{-r}, \quad (\text{default paper: } f = 0.5,\; l = 1.5)$$
   $$X_i^d = c \left( \sum_{\substack{j=1 \\ j \neq i}}^{N} c \frac{ub_d - lb_d}{2} s(|X_j^d - X_i^d|) \frac{X_j - X_i}{d_{ij}} \right)$$
   - Bagian $s(r) > 0$ adalah **gaya atraksi** (mendorong *exploitation*).
   - Bagian $s(r) < 0$ adalah **gaya repulsi** (mendorong *exploration*).
   - Titik $s(r) = 0$ (sekitar $r \approx 2.079$ untuk $f=0.5, l=1.5$) adalah **Comfortable Zone**.

4. **Modifikasi Parameter $c$ untuk Keseimbangan Eksplorasi-Eksploitasi (Eq. 8-10):**
   - *GOA Standar (Eq. 8):* $c = c_{\max} - l \frac{c_{\max} - c_{\min}}{L}$ (dengan $c_{\max} = 1$, $c_{\min} = 0.00001$).
   - *Hybrid GOA-ALO (Eq. 9 & 10):* mempercepat penutupan fase eksplorasi menjadi separuh iterasi ($L/2$) agar separuh sisanya difokuskan pada eksploitasi presisi:
     - Jika $l \le L/2$ (Eq. 9):
       $$c = c_{\max} - l \frac{c_{\max} - c_{\min}}{L/2}$$
     - Jika $l > L/2$ (Eq. 10):
       $$c = (L - l + 1) \times \left(\frac{c_{\min}}{L \times 10^l}\right)$$
     - *Catatan Numerik JS:* Pada implementasi JavaScript, nilai $10^l$ untuk $l > 308$ akan melampaui `Number.MAX_VALUE` dan menghasilkan `0` pada pembagian, atau `0/Infinity`. Implementasikan `const denom = l <= 300 ? L * Math.pow(10, l) : Infinity; c = denom === Infinity ? 0 : (L - l + 1) * (cMin / denom);` sehingga $c$ meluruh mulus mendekati $0$ tanpa `NaN`.

5. **Belalang Tergelincir ke Dasar Corong Antlion (Eq. 11-12):**
   $$c^t = \frac{c^t}{I}, \qquad d^t = \frac{d^t}{I}, \qquad I = 10^w \frac{t}{T}$$
   dengan konstanta tangga $w$ (Fig. 3 paper):
   $$w = \begin{cases} 1 & t \le 0.1T \\ 2 & t > 0.1T \\ 3 & t > 0.5T \\ 4 & t > 0.75T \\ 5 & t > 0.9T \\ 6 & t > 0.95T \end{cases}$$

6. **Perburuan Mangsa, Rekonstruksi Perangkap, & Seleksi Matriks 3-Tingkat (Eq. 13 & Sect. 4.7):**
   - **Seleksi Matriks Posisi (Sect. 4.7):** Pengaruh *roulette wheel*, *elite antlion*, dan *social forces* digabungkan dan diurutkan berdasarkan fitness dalam satu matriks. Tiga sampel diambil dengan total ukuran tetap $N$: sampel fitness terbaik (*exploitation*), sampel fitness rata-rata, dan sampel fitness terburuk (*exploration diversity*).
   - **Penggantian Antlion (Eq. 13, untuk minimasi):** $\text{Antlion}_j^t = \text{Grasshopper}_i^t$ jika $f(\text{Grasshopper}_i^t) < f(\text{Antlion}_j^t)$, lalu perbarui **Elite** jika ada antlion yang mengalahkan *Elite* saat ini.

#### C. Data Empiris Nyata dari Paper (Untuk Slide 7)
Gunakan angka persis berikut dari Tabel 1, 2, 6, 7, dan 9 paper Amaireh et al. (2023):
- **32 Benchmark Klasik (40 agen, 30 kali run independen):**
  - *Unimodal (F1-F11, Tabel 6):* Total Rank **Hybrid = 15** (CS = 44, **ALO = 63**, **GOA = 70**, BBO = 75, ABC = 82, PSO = 147, BA = 171). Mean F1 = `2.6959e-39` (vs ALO `1.8739e-06`, GOA `1.0305`); F11 = `0` pada seluruh 30 run.
  - *Multimodal & Komposit (F12-F32, Tabel 7):* Total Rank **Hybrid = 57** (ABC = 70, CS = 73, BBO = 79, **ALO = 111**, GA = 129, **GOA = 140**, PSO = 168, BA = 201). Mean F13 (Rastrigin) = `0` (vs ALO `71.1726`, GOA `89.0238`).
- **13 Fungsi CEC2015 (30 run, Tabel 9):**
  - Total Rank: SPS-L-SHADE-EIG = 333, **Hybrid = 402**, SSA = 511, **GOA = 513**, **ALO = 570**, GWO = 634, WOA = 833, SCA = 877.
- **Aplikasi Sintesis Antena Dunia Nyata (Sect. 5.3):**
  - *32-Element Linear Antenna Array (LAA, null di $81^\circ$, 100 agen, 600 iterasi, Tabel 1 & 2):* Null **Hybrid = `-147.91 dB`** (ALO `-142.81 dB`, GOA `-138.75 dB`, BBO `-109.6 dB`, Taguchi `-78.33 dB`); Max SLL **Hybrid = `-14.73 dB`** (ALO `-14.27 dB`, GOA `-9.09 dB`). Mean 20 run = `-186.8760 dB`, Std = `2.8925`. *Trade-off CPU time jujur:* Hybrid `213 s` vs GOA `195 s` vs ALO `67 s`.
  - *Non-uniform CCAA ($N_1=8, N_2=10, N_3=12$ + elemen pusat, 100 agen, 500 iterasi, Tabel 3):* Max SLL **Hybrid = `-31.84 dB`** (ALO `-30.37 dB`, BBO `-29.61 dB`, EP `-28.92 dB`, Uniform `-10.77 dB`).

---

## 3. Arsitektur Presentasi Web & Fitur Kustomisasi Interaktif

### 3.1 Alur 8 Slide Presentasi
Antarmuka menggunakan struktur *deck* dengan tinggi penuh `100vh` (pada layar desktop $\ge 1024\text{px}$) dan *graceful vertical flow* pada layar mobile (`< 1024px` agar tidak terpotong). Navigasi selalu terlihat di tepi bawah berupa *Specimen Rail* (nomor slide `01` sampai `08`, tombol Sebelumnya/Berikutnya, indikator progress tipis `2px`, dan tombol buka Daftar Isi / *Keyboard Shortcuts*).

| No | ID Slide | Judul Slide | Tujuan & Konten Utama | Visualisasi & Kustomisasi Interaktif |
|---|---|---|---|---|
| **01** | `#cover` | **Taksonomi Hibridisasi: Pola B vs Pola C** | Memperkenalkan konteks masalah optimasi (No Free Lunch Theorem, Wolpert & Macready 1997) dan posisi dua paradigma hybrid. | **Three.js Ambient Landscape:** Permukaan kontur 3D fungsi multimodal berputar lambat dengan partikel belalang olive & titik jebakan ochre. Kontrol cepat: tombol `Mulai Presentasi` & lompat ke simulasi. |
| **02** | `#taxonomy` | **Pola B (Heuristik -> Metaheuristik) vs Pola C (Metaheuristik + Metaheuristik)** | Membandingkan makna filosofis, alur eksekusi, dan peran eksplorasi-eksploitasi antara kedua pola. | **Custom SVG Asset 5:** Diagram skematik perbandingan alur sekuensial (*seeding pipeline*) vs ko-evolusioner (*dual-population loop*), dengan tab interaktif *Highlight Fase* (Inisialisasi / Eksplorasi / Eksploitasi). |
| **03** | `#mct-goa` | **MCT-seeded GOA (Pola B): Cara Kerja & Simulator** | Menjelaskan bagaimana MCT membangun solusi awal deterministik yang jauh lebih baik daripada *random guess*, lalu GOA menyempurnakannya. | **Custom SVG Asset 4 + Interactive Simulator Pola B:** Audiens dapat mengkustomisasi:<br>- Jumlah Tugas $M$ (`4 - 16`)<br>- Jumlah Mesin/VM $K$ (`2 - 6`)<br>- Preset Beban Kerja (`Seragam / Berat-Acak / Skewed`) atau edit bobot tugas manual<br>- Rasio Seeding MCT (`10% - 100%` populasi awal) vs mode `Random Only (Tanpa MCT)`<br>- Parameter GOA: Populasi $N$ (`10 - 50`), Iterasi $L$ (`20 - 200`), $c_{\max}, c_{\min}$<br>Menampilkan **Gantt Chart SVG** hasil MCT secara langsung + kurva penurunan *Makespan* (`MCT+GOA` vs `Pure GOA`). |
| **04** | `#single-anatomy` | **Anatomi Tunggal: Mekanika GOA & ALO (Paper Sect. 2-3)** | Membekali audiens dengan pemahaman mekanisme biologis dan matematis masing-masing sebelum digabung, termasuk kelemahan masing-masing. | **Custom SVG Asset 1, 2, 3:** Sub-tab `A. Gaya Sosial GOA` & `B. Perangkap Pasir ALO`.<br>Kustomisasi langsung:<br>- Slider $f$ (`0.1 - 1.5`) dan $l$ (`0.5 - 3.0`) yang menggambar ulang kurva SVG $s(r) = f e^{-r/l} - e^{-r}$ dan zona atraksi/repulsi belalang seketika.<br>- Slider progres iterasi $t/T$ (`0% - 100%`) yang mengubah tangga $w$ (`1..6`), faktor $I$, dan radius corong pasir ALO pada SVG penampang tanah. |
| **05** | `#hybrid-goa-alo` | **Hybrid GOA-ALO (Pola C): Mekanisme & Modifikasi $c$** | Menjelaskan 5 konsep inti penggabungan (Sect. 4 paper), modifikasi persamaan $c$ di $L/2$ (Eq. 9-10), dan seleksi matriks 3-tingkat fitness (Sect. 4.7). | **Interactive Flowchart (Sect. 4.9.2) + Live $c$-Curve Plot:** Audiens mengklik node flowchart untuk melihat bedah rumus Eq. (1)-(13), serta mengubah slider $L$ (`50 - 1000`), $c_{\max}$ (`0.5 - 2.0`), $c_{\min}$ (`0.00001 - 0.01`) untuk membandingkan kurva peluruhan *Standard GOA $c$* vs *Modified Hybrid $c$* di $L/2$. |
| **06** | `#lab-3d` | **Laboratorium Simulasi 3D Hybrid GOA-ALO (Three.js)** | Panggung pembuktian visual cara kerja Hybrid GOA-ALO menjelajahi ruang pencarian 3D dan menumpuk agen di sekitar global optimum. | **Three.js Interactive 3D Search Landscape + Full Parameter Lab:** (Detail lengkap di Bagian 3.2 di bawah). |
| **07** | `#benchmarks` | **Bukti Empiris Paper (Amaireh et al., 2023)** | Menyajikan bukti kuantitatif dari 32 benchmark klasik, 13 CEC2015, dan sintesis antena LAA/CCAA. | **Interactive SVG Data Charts:** Filter grup uji (`Unimodal F1-F11` / `Multimodal F12-F32` / `CEC2015` / `Antena LAA & CCAA`). Tooltip interaktif menampilkan nilai `Best`, `Mean`, `Std`, `Total Rank`, dan catatan jujur *CPU Time trade-off* (`213s` vs `67s`). |
| **08** | `#synthesis` | **Matriks Keputusan & Kesimpulan** | Panduan praktis kapan memilih Pola B (MCT-seeded GOA) vs Pola C (Hybrid GOA-ALO), plus daftar pustaka lengkap. | **Interactive Decision Selector:** Audiens memilih karakteristik masalah (*Diskrit/Scheduling* vs *Kontinu/Multimodal*, *Anggaran Waktu Ketat* vs *Akurasi Global Maksimal*) dan matriks menyorot pola hybrid yang tepat beserta alasannya. |

### 3.2 Spesifikasi Kustomisasi Bilangan & Kontrol Interaktif (Slide 06 - Three.js Lab)
Memenuhi permintaan utama pengguna agar audiens dapat **mengkustomisasi banyak nilai bilangan** secara interaktif:

1. **Pemilih Fungsi Uji (Dari Tabel 4 & 5 Paper):**
   - `F1 (Sphere, Unimodal)`: $f(x) = x_1^2 + x_2^2$, rentang $[-100, 100]$, $f_{\min} = 0$.
   - `F13 (Rastrigin, Multimodal)`: $f(x) = \sum (x_i^2 - 10\cos(2\pi x_i) + 10)$, rentang $[-5.12, 5.12]$, $f_{\min} = 0$.
   - `F14 (Ackley, Multimodal)`: rentang $[-32, 32]$, $f_{\min} = 0$.
   - `F15 (Griewank, Multimodal)`: rentang $[-600, 600]$, $f_{\min} = 0$.
   - `F31 (Cosine Mixture, Multimodal)`: $f(x) = x_1^2 + x_2^2 - \cos(18 x_1) - \cos(18 x_2)$, rentang $[-1, 1]$, $f_{\min} = -2$.
2. **Panel Kustomisasi Parameter Numerik (Input Angka + Slider Sinkron):**
   - **Mode Algoritma:** Pilihan toggle `Hybrid GOA-ALO`, `GOA Murni`, `ALO Murni`, atau `Bandingkan Ketiganya` (menampilkan 3 kurva konvergensi serentak di grafik SVG + posisi agen di kanvas 3D).
   - **Jumlah Agen ($N$):** `10` hingga `80` (default paper `40`).
   - **Maksimum Iterasi ($L$):** `40` hingga `500` (default `150` untuk respons visual cepat, dengan tombol preset `1000` sesuai eksperimen paper).
   - **Parameter $c_{\max}$:** `0.50` hingga `2.00` (default `1.00`).
   - **Parameter $c_{\min}$:** `0.00001` hingga `0.05` (default `0.00001`).
   - **Intensitas Atraksi GOA ($f$):** `0.10` hingga `1.50` (default `0.50`).
   - **Skala Panjang Atraksi ($l$):** `0.50` hingga `3.00` (default `1.50`).
   - **Random Seed / Inisialisasi:** Input angka seed (`integer`) + tombol `Acak Ulang Populasi` agar demonstrasi dapat diulang (*reproducible*).
3. **Kontrol Eksekusi & Inspeksi:**
   - Tombol `Jalankan` / `Jeda` (`Space`), `Langkah +1 Iterasi`, `Reset`, dan slider `Kecepatan Simulasi (1x - 10x)`.
   - **Live Telemetry Readout (Tabular Mono):** Iterasi aktif ($l / L$), fase aktif (`Eksplorasi` jika $l \le L/2$, `Eksploitasi Intensif` jika $l > L/2$), nilai $c$ saat ini, tangga $w$ dan $I$, koordinat & nilai fitness **Elite Antlion**, serta rata-rata fitness populasi.
   - **Toggle Visualisasi Lapisan 3D:** Centang untuk menampilkan/menyembunyikan *Jejak Pencarian (Search History)*, *Vektor Gaya Sosial*, dan *Lingkaran Radius Perangkap Antlion ($c^t, d^t$)* di permukaan 3D.

---

## 4. Sistem Desain Oil UI & Anti-Slop Mode 1 (`DESIGN.md` Specification)

### 4.1 Design Read & Three Dials
> **Design Read:** *Reading this as: Interactive Academic Presentation Deck & Simulation Lab untuk audiens mahasiswa dan peneliti SOKA, dalam gaya **Entomological Field Atlas (Arah 1)**, dial **ENERGY 2 / RHYTHM 3 / MOTION 2**.*

- **5 Skala Oil UI:**
  - *Energi:* Sedikit di tengah tenang (`4/10`) - fokus keterbacaan ilmiah dengan satu aksen hangat.
  - *Penyelesaian:* Presisi tinggi (`8/10`) - tepi tajam, *hairline grid* hanya di area grafik/plotting, angka *tabular*.
  - *Kepadatan:* Berimbang (`5/10`) - slide konseptual lega dengan ruang putih struktural; slide laboratorium lebih padat untuk kontrol numerik.
  - *Bobot:* Ringan-Menengah (`4/10`) - dominasi kertas lapangan hangat dan garis tinta tipis.
  - *Keseriusan:* Akademis-Kuratif (`7/10`) - berwibawa secara ilmiah tanpa terasa kaku atau membosankan.
- **Identity Motif:** Garis penampang spesimen bernomor (`FIG. 01`, `EQ. 09`) dengan titik simpul bulat kecil berongga (*hollow node*) di ujung garis penunjuk (*callout leader line*) dan bingkai sudutan tipis ala pelat atlas entomologi abad ke-21.

### 4.2 Palet Warna Terkunci (`antislop R-25 & R-29`)
Mengikuti batas **maksimal 3 warna inti + 1 aksen** (ditambah netral):

| Token CSS / Tailwind | Hex | Peran & Alasan (`R-31`) | Verifikasi Kontras (`R-25`) |
|---|---|---|---|
| `--bg-parchment` | `#F6F3EC` | Latar kanvas utama; meredam silau proyektor dan merefleksikan buku atlas ilmiah/pasir alam. | Dasar teks gelap |
| `--bg-sand` | `#EDE7DA` | Permukaan panel kontrol, tabel benchmark, dan blok alternatif. | Dasar teks gelap |
| `--bg-elevated` | `#FFFDF9` | Permukaan fokus (input angka aktif, kartu info inspeksi agen). | Dasar teks gelap |
| `--ink-primary` | `#181A18` | Teks utama, judul, kontur ilustrasi vektor utama. | **15.1 : 1** di atas `#F6F3EC` (Lulus AAA) |
| `--ink-muted` | `#4E524B` | Label parameter, catatan kaki paper, sumbu grafik. | **7.1 : 1** di atas `#F6F3EC` (Lulus AAA) |
| `--brand-olive` | `#2D5A3D` | Identitas populasi **GOA / Belalang** & status eksplorasi; merujuk warna alami belalang dan daun. | **7.2 : 1** di atas `#F6F3EC` (Lulus AA/AAA) |
| `--accent-ochre` | `#C86D2D` | **Satu-satunya warna aksen sengaja**: menandai **ALO / Perangkap Pasir / Elite Global / CTA Utama**. | **3.6 : 1** teks besar/grafis di atas `#F6F3EC`; gunakan `#9E4F18` (**5.7 : 1**) jika dipakai untuk teks kecil di atas `#F6F3EC`, atau teks `#FFFDF9` di atas tombol `#B85D1F` (**4.7 : 1**). |
| `--border-hairline` | `rgba(24, 26, 24, 0.14)` | Garis pemisah tunggal (`1px`) tanpa penumpukan bayangan. | Struktural |

### 4.3 Tipografi (`antislop R-06`)
- **Display / Judul Slide:** `'Fraunces', Georgia, serif` (bobot `600`, `line-height: 1.15 - 1.25`). Alasan: memberi karakter monograf ilmiah yang membedakan presentasi dari template SaaS generik.
- **Body & Kontrol UI:** `'Plus Jakarta Sans', system-ui, sans-serif` (ukuran tubuh `15px - 17px`, `line-height: 1.6`). Alasan: artikulasi huruf jelas pada ukuran kontrol kompak dan teks Bahasa Indonesia.
- **Matematika, Kode & Telemetri:** `'JetBrains Mono', monospace` dengan `font-variant-numeric: tabular-nums`. Alasan: menjaga kolom angka iterasi, nilai $c$, dan hasil benchmark $10^{-39}$ tidak melompat secara horizontal saat simulasi berjalan.

### 4.4 Koreografi Gerak & Interaksi (`oil-ui motion.md`, `R-19`)
- **Metafora Fisik:** *"Krek-Meluncur"* (seperti laci spesimen entomologi yang meluncur halus lalu terkunci dengan klik lembut).
- **3 Gerak Dasar Wajib:**
  1. *Feedback Aksi Utama:* Tombol ditekan mengecil sesaat (`scale(0.97)`, `80ms`), kembali ke `1` dengan kurva *snappy*; angka telemetri berubah langsung tanpa lag.
  2. *Asal-Usul Transisi Status:* Indikator tab aktif dan indikator slide memakai satu elemen *sliding pill/underline* yang bergerak mulus (`250ms`), bukan berkedip nyala-mati.
  3. *Masuk Awal Slide:* Saat berpindah ke suatu slide pertama kali, judul dan ilustrasi vektor utama muncul berurutan (`stagger 50ms`, total $\le 450\text{ms}$); pengulangan ke slide yang sudah dikunjungi tidak memutar ulang animasi secara berlebihan (*once-per-visit*).
- **Larangan Keras:** Dilarang memberi animasi *infinite pulse/float/bounce* pada badge atau tombol (`antislop-ui Motion`). Animasi kontinu hanya boleh ada pada **simulasi aktif Three.js/SVG saat status Play menyala**.
- **Aksesibilitas `prefers-reduced-motion`:** Nonaktifkan translasi/skala transisi slide dan GSAP stagger; pertahankan kalkulasi simulasi dan perbarui posisi agen secara instan per langkah.

---

## 5. Instruksi Khusus Ilustrator Aset: Shapes, Masking, Vector Lines, Fills & Gradients

> **MANDAT UNTUK AI AGENT:** Saat membuat seluruh diagram dan karakter pada presentasi ini, **bertindaklah dan berpikirlah sebagai ilustrator vektor editorial**, bukan sebagai programmer yang menempel kotak dan ikon standar. Dilarang keras menyisipkan gambar eksternal generik, emoji dekoratif (`R-04`), atau pustaka ilustrasi Undraw/Storyset (`R-22`).

### 5.1 Aturan Konstruksi Ilustrasi 3-Lapis (Wajib Diterapkan di Semua Aset SVG)
Setiap ilustrasi SVG utama harus dibangun dengan anatomi `<defs>` dan tiga lapis terstruktur:
1. **Lapisan 1: *Base Shapes & Directional Gradient Fills***
   - Bentuk komposit disusun dari kurva Bézier kubik (`<path d="M... C...">`), `<ellipse>`, dan `<polygon>` yang proporsional.
   - Setiap bidang tertutup tidak boleh hanya memakai warna solid datar yang mati; isi dengan `<linearGradient>` atau `<radialGradient>` yang konsisten dengan **satu arah cahaya utama (kiri-atas $45^\circ$)** agar muncul kesan volume tiga dimensi di atas kertas.
2. **Lapisan 2: *Creative Masking & Textured Overlays***
   - Gunakan `<clipPath>` untuk memotong bayangan dalam (*inner shadow* / *cel-shading*) tepat di dalam batas siluet objek tanpa meluber.
   - Gunakan `<mask>` (gradien hitam-putih dalam mask) untuk menciptakan **transparansi sayap belalang yang memudar di ujungnya**, **potongan melintang (*cutaway*) gundukan pasir yang memperlihatkan ruang bawah tanah larva antlion**, atau **zona jarak kabur pada medan gaya sosial**.
   - Tambahkan `<pattern>` garis arsiran diagonal tipis (*botanical engraving hatch lines*, `stroke-opacity: 0.14`) dan *stippling* titik pasir halus di dalam area yang sudah di-mask.
3. **Lapisan 3: *Expressive Vector Lines & Effects***
   - Gunakan hierarki ketebalan garis: kontur luar utama `1.75px` (`#181A18`), garis lipatan anatomi internal `0.9px`, garis penunjuk konstruksi/sumbu putus-putus `0.75px` (`stroke-dasharray="3 3"`).
   - Semua ujung garis memakai `stroke-linecap="round"` dan `stroke-linejoin="round"`.
   - Tambahkan `<marker>` kepala panah geometris tajam buatan sendiri (bukan panah default tebal) untuk menunjukkan arah gaya atraksi/repulsi dan aliran *random walk*.
   - Gunakan `<filter>` SVG secara hemat (maksimal `feDropShadow` lembut ber-offset pendek untuk mengangkat elemen fokus dari latar, atau `feTurbulence` beramplitudo sangat rendah `0.02` pada tekstur pasir corong).

### 5.2 Spesifikasi 5 Aset Ilustrasi Vektor Kustom

#### Aset 1: Spesimen Belalang GOA (`svg-grasshopper-specimen`)
- **Fungsi:** Hero & representasi agen eksplorasi di Slide 01 dan Slide 04A.
- **Anatomi Shapes:**
  - Kepala kapsul oval miring + mata majemuk (*compound eye* dengan `<radialGradient>` highlight kecil di kuadran kiri-atas).
  - Antena ganda dari 2 kurva Bézier asimetris meruncing.
  - Pronotum & toraks tersegmentasi memakai gradien olive `#4D7C5D` -> `#2D5A3D` -> `#1C3A27`.
  - **Sayap Depan & Belakang (Memakai `<mask>`):** Sayap transparan dengan `<mask id="wing-fade">` (putih di pangkal, abu-abu gelap di ujung) dan pola urat sayap vektor tipis (`0.6px`) yang terpotong rapi di dalam `<clipPath id="wing-clip">`.
  - Kaki belakang pelompat (*femur* tebal bergradien + *tibia* ramping bergerigi halus) dalam grup `<g id="hind-leg">` terpisah sehingga bisa berotasi saat ilustrasi menandakan lompatan eksplorasi jauh vs pergeseran lokal pendek.

#### Aset 2: Penampang Corong Pasir & Larva Antlion (`svg-antlion-pit-cutaway`)
- **Fungsi:** Menjelaskan 5 perilaku berburu ALO (Sect. 2 paper) dan penyusutan radius `c^t, d^t` di Slide 04B.
- **Anatomi Shapes & Masking:**
  - Gunakan `<clipPath id="soil-cross-section">` berbentuk blok irisan tanah trapesium dengan lengkung kawah berbentuk `V` (*cone-shaped pit*).
  - Di dalam kawah, buat gradien pasir miring (`#E5D7BF` -> `#C86D2D`) yang dipadukan dengan `<mask id="pit-depth-mask">` untuk memberi kedalaman bayangan di dasar corong.
  - Larva antlion (*doodlebug*) digambar di dasar tersembunyi di bawah garis pasir menggunakan `<mask>` semi-terkubur, dengan sepasang rahang sabit (*mandible*) melengkung tajam menyembul di titik verteks bawah.
  - Garis vektor jalur *random walk* seekor mangsa/belalang di lereng corong digambar dengan kurva zigzag akumulatif (mengilustrasikan Eq. 1), ditambah garis batas penyusutan radius $c^t / I$ dan $d^t / I$ yang bergerak menyempit secara interaktif mengikuti slider $t/T$.

#### Aset 3: Medan Gaya Sosial GOA $s(r)$ (`svg-social-force-field`)
- **Fungsi:** Visualisasi langsung interaksi zona repulsi, zona nyaman, dan zona atraksi di Slide 04A.
- **Anatomi Shapes & Masking:**
  - Tiga zona konsentris di sekitar agen pusat: *Repulsion Zone* (arsiran silang ochre lembut via `<pattern>`), *Comfortable Zone* (cincin tipis tegas di $s(r)=0$), dan *Attraction Zone* (gradien radial olive memudar ke tepi lewat `<mask>` melingkar).
  - Vektor panah gaya radial yang panjang dan warnanya berubah dinamis berdasarkan hasil perhitungan fungsi $s(r) = f e^{-r/l} - e^{-r}$ dari slider audiens.

#### Aset 4: Pipa Seeding Deterministik MCT ke GOA (`svg-mct-seeding-pipeline`)
- **Fungsi:** Mengilustrasikan Pola B (*Heuristik -> Metaheuristik*) di Slide 03.
- **Anatomi Shapes:**
  - Kolom kiri: simpul vektor Tugas $T_1 \dots T_M$ terhubung via kurva Bézier (*cubic spline*) menuju blok Mesin $V_1 \dots V_K$ dengan tebal garis proporsional terhadap $ET_{kj}$.
  - Kolom tengah: *Gantt Chart* horizontal bersudut tajam (`rx="2"`) dengan fill gradien olive-sand yang memperlihatkan garis batas vertikal `Makespan` terpendek.
  - Kolom kanan: Panah injeksi menuju titik awal $X_{\text{MCT}}$ yang bersinar hangat (`#C86D2D`) di tengah titik-titik populasi acak (`#4E524B`) pada ruang vektor GOA.

#### Aset 5: Skema Perbandingan Pola B vs Pola C (`svg-hybrid-taxonomy`)
- **Fungsi:** Perbandingan struktural cepat di Slide 02.
- **Anatomi Shapes:**
  - *Pola B:* Blok deterministik bersudut kaku (`MCT`) disambung pipa sekuensial satu arah dengan panah vektor menuju loop oval populasi (`GOA`).
  - *Pola C:* Dua lingkaran orbit yang saling bertaut (*Venn/coupled loop* dengan `<clipPath>` area irisan) yang mempertemukan agen belalang (`GOA`) dengan corong elit (`ALO`), menyatu ke simpul matriks 3-sampel (Sect. 4.7).

---

## 6. Spesifikasi Teknis Three.js (Slide 01 & Slide 06)

1. **Geometri Lanskap Fungsi Uji (`LandscapeMesh`):**
   - `PlaneGeometry(size, size, 96, 96)` diputar horizontal ($XZ$ plane).
   - Tinggi $Y$ tiap vertex dihitung langsung dari fungsi benchmark aktif ($F_1, F_{13}, F_{14}, F_{15}, F_{31}$) dan dinormalisasi ke rentang tinggi yang proporsional agar lembah *global optimum* terlihat jelas.
   - Pewarnaan vertex (*vertex colors* / *custom shader*) menggunakan palet Atlas: puncak tinggi berwarna pasir terang `#EFE8D8`, lereng tengah olive-sage `#8BA88E`, dan lembah minimum berwarna gelap-tegas `#22432D` (menghindari pelangi neon).
   - Tambahkan garis kontur topografi tipis (*wireframe* sekunder dengan `opacity: 0.14`, warna `#181A18`) atau *grid floor* halus agar kedalaman lembah terbaca jelas oleh mata.
2. **Representasi Agen di Ruang 3D:**
   - **Belalang (GOA Agents):** `InstancedMesh` berbentuk oktahedron memanjang/tetrahedron terarah (`#2D5A3D`) yang melayang tepat di atas permukaan fungsi dengan garis vertikal (*drop-line*) tipis ke permukaan agar proyeksi $(x_1, x_2)$ terbaca akurat.
   - **Antlion Traps:** Cincin kerucut terbalik tipis (`ConeGeometry` wireframe/translucent `#C86D2D`) di posisi antlion.
   - **Elite Global:** Penanda *diamond/octahedron* ganda berwarna `#C86D2D` dengan tiang suar vertikal tipis ke titik minimum.
   - **Search History Trail:** `Points` atau `LineSegments` semi-transparan untuk mereplikasi Fig. 6 & Fig. 12 paper (menunjukkan penyebaran eksplorasi lalu pemusatan di sekitar titik optimum).
3. **Kinerja, Siklus Hidup & Fallback (`oil-ui media.md` & `antislop R-27`):**
   - Batasi `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.
   - Hentikan `requestAnimationFrame` secara otomatis saat slide selain `01` dan `06` sedang tidak aktif atau saat `document.hidden === true` untuk menghemat GPU laptop saat presentasi.
   - Sediakan **3 UI States (`R-27`)**:
     - *Loading State:* Indikator persiapan mesh topografi sebelum frame pertama dirender.
     - *Empty / Idle State:* Penjelasan singkat *"Simulasi siap dijalankan. Sesuaikan parameter di panel kanan lalu tekan Jalankan."* sebelum iterasi pertama dimulai.
     - *Error / WebGL Fallback State:* Jika `WebGLRenderingContext` gagal dibuat, tampilkan kanvas 2D *contour heatmap* fallback otomatis dengan pesan status jelas tanpa mematahkan simulasi angka!

---

## 7. Aturan Anti-Slop Mode 1 & Delivery Gate Wajib (QA Checklist AI Agent)

AI agent yang mengimplementasikan PRD ini **wajib** menjalankan filter berikut **selama proses penulisan kode** (Mode 1: DURING) dan melampirkan laporan PASS/FAIL sebelum menyerahkan HTML final.

### Block 1: Hard Gate (Wajib PASS 100%, Zero Exception)
- [ ] **R-02 (Copywriting):** Tidak ada karakter em dash (`—`) di seluruh teks antarmuka Bahasa Indonesia, label tombol, maupun tooltip. Gunakan koma, titik, titik dua, atau tanda kurung.
- [ ] **R-03 (Responsivitas):** Layout bebas *horizontal overflow* di desktop `1920x1080`, proyektor `1280x720`, tablet `768px`, dan mobile `375px`. Target sentuh tombol minimal `44x44px`.
- [ ] **R-17 & R-38 (Kejujuran Data):** Tidak ada angka statistik rekaan. Data paper dikutip persis dari Amaireh et al. (2023); sumber MCT-seeded GOA ditandai jujur apabila referensi paper belum disuplai; semua angka simulasi dihasilkan dari kalkulasi JS nyata.
- [ ] **R-24 & R-26 (Navigasi & Kontrol Hidup):** Seluruh tombol, tab, slider, input angka, dropdown fungsi, dan link daftar isi bekerja secara nyata. Tidak ada tombol hiasan atau tautan buntu.
- [ ] **R-25 (Kontras WCAG AA):** Semua teks normal $\ge 4.5:1$ dan teks besar/grafis $\ge 3:1$ (termasuk teks di atas gradasi atau label di dalam SVG).
- [ ] **R-27 (UI States):** State *loading*, *idle/empty*, dan *error/WebGL-fallback* terimplementasi nyata pada laboratorium simulasi.
- [ ] **R-32 (Aksesibilitas Keyboard):** Seluruh slide (`ArrowLeft`/`ArrowRight`), kontrol simulasi (`Space` Play/Pause), tab, dan input dapat diakses penuh via `Tab`, `Enter`, `Space`, `Escape` dengan indikator `:focus-visible` yang tegas.
- [ ] **R-35 (Verify Before Deliver):** Aplikasi telah dijalankan di browser, konsol bebas error JS, semua slide dan mode simulasi diuji.

### Block 2: Purpose-Gate & Liveliness Locks
- [ ] **R-01 & R-29 (Warna):** Palet terkunci pada `#F6F3EC`, `#EDE7DA`, `#181A18`, `#2D5A3D`, dan satu aksen `#C86D2D`. Tidak ada latar gelap ungu-biru neon.
- [ ] **R-04 & R-22 (Ikon & Ilustrasi):** Tidak ada emoji dekoratif di judul/tombol; tidak ada ilustrasi stok. Seluruh ilustrasi memakai *custom SVG shapes/masking/gradients* sesuai Bagian 5.
- [ ] **R-05 & R-14 (Ritme Tata Letak):** Tiap slide memiliki komposisi bervariasi (`RHYTHM 3`), tidak mengulang template "Hero + 3 kartu identik" di semua slide.
- [ ] **R-10, R-12, R-13 (Dose Cap Efek):** Glassmorphism maksimal 1 elemen (misalnya drawer daftar isi atau HUD tipis), bayangan hanya pada panel fokus/hover, nol glow dekoratif massal.
- [ ] **R-15 & R-16 (Bahasa CTA & Bebas Buzzword):** Tidak ada CTA generik ("Get Started", "Learn More") atau buzzword ("AI Powered", "Revolutionary", "Seamless"). Gunakan label aksi spesifik: *"Jalankan Simulasi"*, *"Bandingkan Pola B vs C"*, *"Reset Parameter Paper"*.
- [ ] **R-19 (Motion):** Sesuai `MOTION 2`, tanpa loop mengambang tak bertujuan.

---

## 8. Arsitektur File & Rencana Verifikasi untuk AI Agent

### 8.1 Struktur Direktori Proyek Target
```text
HTML-Pages-SOKA-Hybrid/
├── index.html                  # Shell presentasi 8 slide + Tailwind config + SVG <defs> global
├── PRD-Presentasi-Hybrid-SOKA.md
├── (fix) s12065-022-00749-4.pdf
├── css/
│   └── atlas-theme.css         # Custom properties DESIGN.md, tabular-nums, focus rings, reduced-motion
├── js/
│   ├── algorithms/
│   │   ├── benchmarks.js       # F1, F13, F14, F15, F31 + data tabel nyata paper (Tabel 1, 2, 6, 7, 9)
│   │   ├── mct-goa.js          # Engine nyata Pola B: MCT greedy seeding + GOA solver
│   │   └── hybrid-goa-alo.js   # Engine nyata Pola C: Eq. (1)-(13), modified c, w-staircase, 3-tier sampling
│   ├── viz/
│   │   ├── svg-illustrator.js  # Generator/controller dinamis 5 aset SVG (shapes, masks, gradients)
│   │   ├── svg-charts.js       # Plot s(r), kurva c, Gantt chart MCT, kurva konvergensi, chart benchmark
│   │   └── three-lab.js        # Scene Three.js Slide 01 & Slide 06 + 2D Canvas WebGL fallback
│   └── ui/
│       ├── deck.js             # Controller navigasi 8 slide, keyboard shortcuts, overview drawer
│       └── controls.js         # Binding bidirectional slider <-> input numerik + validasi batas aman
└── tests/
    └── verify-algorithms.mjs   # Runnable self-check (assert) tanpa framework eksternal
```

### 8.2 Spesifikasi Uji Mandiri Wajib (`tests/verify-algorithms.mjs`)
Sebelum menyatakan implementasi HTML selesai, AI agent wajib membuat dan menjalankan 1 skrip verifikasi `node tests/verify-algorithms.mjs` (dengan `assert` bawaan Node.js) yang memeriksa minimal:
1. **Validasi Penurunan Parameter $c$ Hybrid GOA-ALO (Eq. 9 & 10):**
   - Pada $l = L/2$, $c$ hasil Eq. (9) sudah mencapai $c_{\min}$ (separuh iterasi lebih cepat dibanding Eq. 8 standar).
   - Pada $l > L/2$, Eq. (10) menghasilkan nilai positif halus mendekati $0$ tanpa `NaN` atau `Infinity` bahkan untuk $L = 1000$.
2. **Validasi Tangga Parameter $w$ & $I$ (Eq. 11-12):**
   - Memastikan $w$ bernilai tepat $\{1, 2, 3, 4, 5, 6\}$ pada ambang $0.1T, 0.5T, 0.75T, 0.9T, 0.95T$.
3. **Validasi Konvergensi Nyata pada F1 (Sphere) & F13 (Rastrigin):**
   - Menjalankan `HybridGOAALO` selama $100$ iterasi pada F1 dengan $N=30$; memastikan fitness *Elite* akhir jauh lebih kecil dari fitness awal dan selalu valid (`Number.isFinite`).
4. **Validasi MCT Seeding (Pola B):**
   - Memastikan solusi awal $X_{\text{MCT}}$ menghasilkan *Makespan* yang terdefinisi valid dan lebih kecil atau sama dengan rata-rata inisialisasi acak murni pada kasus uji beban heterogen.
5. **Audit Statis Anti-Slop (`R-02`):**
   - Memastikan teks UI pada `index.html` dan label string JS bebas karakter em dash (`—`).
