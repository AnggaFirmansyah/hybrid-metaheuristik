# PRD Refinement Materi Web: Hybrid Metaheuristik (Pola B dan Pola C)

Untuk: Agent pengembang web | Repo: github.com/AnggaFirmansyah/hybrid-metaheuristik | Bahasa konten: Indonesia

## 1. Ringkasan dan Tujuan

Web yang sudah ada akan direfine **dari sisi materi (konten)**, bukan dari sisi teknologi. Tujuannya: orang yang **sama sekali belum paham** optimasi dapat belajar langkah demi langkah dari nol sampai bisa menjelaskan dua pola hibridisasi:

- **Pola B (heuristik → metaheuristik):** MCT-seeded GOA. MCT (Minimum Completion Time) adalah heuristik deterministik yang menghasilkan solusi awal; GOA (Grasshopper Optimization Algorithm) adalah metaheuristik berbasis populasi yang memperbaikinya.
- **Pola C (metaheuristik + metaheuristik):** Hybrid GOA-ALO. Dua metaheuristik berbasis populasi digabung untuk menyeimbangkan eksplorasi dan eksploitasi.

Sumber rujukan utama (dua makalah yang diunggah):

1. Amaireh, Al-Zoubi, Dib (2023). *A new hybrid optimization technique based on antlion and grasshopper optimization algorithms.* Evolutionary Intelligence 16:1383–1422. Disebut **\[Makalah-ALO-GOA\]**.
2. Alsaidy, Abbood, Sahib (2020). *Heuristic initialization of PSO task scheduling algorithm in cloud computing.* J. King Saud Univ. – CIS. Disebut **\[Makalah-MCT-PSO\]**.

**Catatan jujur:** makalah kedua memakai **PSO**, bukan GOA. Jadi "MCT-seeded GOA" adalah **ekstensi/analogi** dari ide makalah tersebut. Web harus melabelinya jelas sebagai *usulan desain*, bukan hasil makalah.

## 2. Status Awal dan Tugas Nol (Audit)

PRD ini ditulis tanpa sempat membaca isi repo (akses GitHub saat penyusunan dibatasi). Maka **Tugas 0** untuk agent:

- Baca seluruh repo; buat daftar halaman/komponen/materi yang sudah ada.
- Petakan konten yang ada ke modul M0–M9 di bawah (ada / sebagian / belum ada).
- Jangan hapus konten yang sudah benar; refine, urutkan ulang, dan lengkapi.
- Laporkan hasil audit dalam satu tabel sebelum mulai mengubah.

## 3. Audiens dan Prasyarat

- **Persona utama:** mahasiswa/pemula tanpa latar optimasi; hanya paham aljabar SMA dan konsep "fungsi".
- **Prasyarat nol:** tidak perlu tahu pemrograman, kalkulus, atau algoritma evolusioner.
- **Aturan istilah:** setiap istilah teknis baru **wajib** didefinisikan pada kemunculan pertama dengan bahasa awam + analogi, lalu masuk ke Glosarium (hover tooltip).
- **Aturan rumus:** rumus muncul **setelah** intuisi dan visual, selalu disertai "artinya dalam bahasa biasa" dan contoh angka.

## 4. Prinsip Pedagogis (Gaya Dosen)

1. **Dari konkret ke abstrak:** contoh/analogi dulu → visual → istilah → rumus.
2. **Satu ide per layar.** Maksimal satu konsep baru per bagian.
3. **Pertanyaan pemantik** di awal tiap modul ("Bagaimana kamu memilih kasir dengan antrean tercepat?").
4. **Cek pemahaman** di akhir tiap modul: 2–3 kuis singkat dengan umpan balik.
5. **Pengulangan berjarak:** ringkasan "Kamu sudah tahu" di awal modul berikutnya.
6. **Interaktif:** pembaca menggeser slider/menekan "langkah berikutnya" untuk melihat perubahan.

## 5. Sistem Visual: Kosakata Shapes

Semua diagram memakai kosakata bentuk yang **konsisten** di seluruh web. Wajib ada legenda di tiap diagram.

| Bentuk | Makna | Warna usulan |
| --- | --- | --- |
| Lingkaran | Satu agen/solusi kandidat (belalang, semut, partikel) | Biru |
| Lingkaran bertepi emas/bintang | Solusi terbaik (elite / best) | Emas |
| Lingkaran abu-abu | Solusi acak (tanpa seeding) | Abu-abu |
| Persegi | Langkah heuristik deterministik (MCT) | Hijau |
| Heksagon | Blok metaheuristik (GOA, ALO) | Ungu |
| Belah ketupat | Keputusan/kondisi ("lebih baik?", "iterasi selesai?") | Kuning |
| Segitiga terbalik (kerucut) | Jebakan antlion | Cokelat |
| Panah tebal | Aliran data/proses | Hitam |
| Panah tarik / panah tolak | Gaya tarik / tolak sosial belalang | Biru / Merah |
| Bidang kontur 2D | Lanskap pencarian (search space), lembah = solusi bagus | Gradasi |

Persyaratan visual: SVG/Canvas responsif; mode terang & gelap; tidak bergantung warna saja (tambahkan pola/label untuk aksesibilitas); animasi dapat dijeda; kontrol "langkah demi langkah".

## 6. Kurikulum Step-by-Step (Modul M0–M9)

Setiap modul memuat: **Tujuan belajar**, **Penjelasan**, **Visual**, **Interaksi**, **Kuis**.

### M0. Apa itu Optimasi? (dari nol)

- **Tujuan:** pembaca paham "mencari nilai terbaik di antara banyak pilihan".
- **Penjelasan:** analogi bola menggelinding mencari titik terendah lembah. Definisikan: solusi, fungsi tujuan (fitness), ruang pencarian, minimum global vs lokal.
- **Visual:** lanskap kontur 2D dengan beberapa lembah; satu lembah paling dalam ditandai (global), lainnya lokal.
- **Interaksi:** klik di lanskap untuk menaruh "bola" dan melihat nilai fitness-nya.
- **Kuis:** membedakan optimum lokal dan global.

### M1. Heuristik vs Metaheuristik

- **Penjelasan:** heuristik = aturan praktis sederhana, sekali jalan, cepat, tidak menjamin optimal (contoh: pilih kasir dengan antrean terpendek). Metaheuristik = strategi pencarian berulang, umumnya acak dan berbasis populasi, tidak memakai gradien, tidak menjamin optimum global (sesuai \[Makalah-ALO-GOA\], Bagian 1).
- **Visual:** persegi hijau (satu langkah jelas) vs sekumpulan lingkaran biru yang bergerak di lanskap selama banyak iterasi.
- **Kuis:** klasifikasikan MCT, LJFP, PSO, GOA, ALO.

### M2. Eksplorasi vs Eksploitasi

- **Penjelasan:** eksplorasi = menjelajah seluruh wilayah; eksploitasi = menyempurnakan di wilayah menjanjikan. Analogi: mencari restoran di kota baru (keliling dulu, lalu fokus ke satu area).
- **Visual:** dua animasi berdampingan: agen menyebar (eksplorasi) vs agen merapat (eksploitasi); slider "kecenderungan".
- **Pesan kunci:** hibridisasi bertujuan menggabungkan kelebihan dua metode untuk keseimbangan keduanya.

### M3. Studi Kasus: Penjadwalan Tugas di Cloud

- **Penjelasan:** ada Nt tugas (panjang dalam MI) dan Nv mesin virtual/VM (kecepatan dalam MIPS). Tugas: tentukan tugas mana ke VM mana. Waktu eksekusi satu tugas di satu VM: ECT = T / V. **Makespan (MS)** = waktu VM yang paling lama selesai. Tujuan: MS sekecil mungkin.
- **Metrik lain dari \[Makalah-MCT-PSO\]:** total execution time (TET), degree of imbalance (DI), total energy consumption (TEC). Cukup dikenalkan; fokus utama web pada MS.
- **Contoh hitung wajib (angka sudah diverifikasi):** tugas T1..T4 = 4000, 2000, 3000, 1000 MI; VM1 = 1000 MIPS, VM2 = 2000 MIPS.
  - ECT VM1: 4, 2, 3, 1 detik; ECT VM2: 2, 1, 1,5, 0,5 detik.
  - Jadwal buruk (semua ke VM1): MS = 10 detik.
  - Jadwal MCT (lihat M4): MS = 3,5 detik.
- **Visual:** dua "jalur" VM berupa batang waktu; tugas sebagai balok berukuran sesuai ECT; tampak mana yang paling panjang (MS). Pembaca dapat menyeret tugas antar VM.
- **Encoding (konsep penting):** solusi = daftar panjang Nt berisi nomor VM per tugas. Ini jembatan ke GOA (M5).

### M4. MCT: Heuristik Penghasil Solusi Awal

- **Penjelasan:** untuk tiap tugas secara berurutan, pilih VM yang membuat tugas itu **selesai paling cepat** (memperhitungkan beban VM saat ini), lalu perbarui beban VM. Deterministik: hasil selalu sama.
- **Walkthrough pada contoh M3:**
  - T1: selesai di VM1=4, VM2=2 → VM2 (beban VM2=2).
  - T2: VM1=2, VM2=2+1=3 → VM1 (beban VM1=2).
  - T3: VM1=2+3=5, VM2=2+1,5=3,5 → VM2 (beban VM2=3,5).
  - T4: VM1=2+1=3, VM2=3,5+0,5=4 → VM1 (beban VM1=3).
  - Hasil MS = max(3; 3,5) = **3,5 detik**.
- **Visual:** animasi langkah demi langkah dengan persegi hijau; tombol "Next".
- **Kuis:** hitung MCT untuk 3 tugas lain.
- **Variasi singkat (opsional):** LJFP = urutkan tugas dari terpanjang, VM dari tercepat, lalu bagikan siklik.

### M5. GOA Dasar (Grasshopper Optimization Algorithm)

- **Analogi:** kawanan belalang yang saling tarik dan tolak sampai menemukan "zona nyaman".
- **Konsep:** posisi tiap belalang dipengaruhi gaya sosial dari belalang lain; gaya bergantung jarak. Fungsi gaya: s(r) = f·e^(−r/l) − e^(−r), dengan f = 0,5 dan l = 1,5 (nilai di \[Makalah-ALO-GOA\], Bag. 4.2). Jarak dekat → tolak; jarak menengah → tarik; jauh → melemah.
- **Parameter c:** menyusut dari cmax = 1 ke cmin = 0,00001 seiring iterasi, sehingga wilayah tarik/tolak/nyaman mengecil: awal iterasi cenderung menjelajah, akhir cenderung memfokus.
- **Visual:** (a) grafik s(r) dengan zona tolak/tarik berwarna; (b) kawanan lingkaran biru dengan panah tarik/tolak; (c) slider iterasi memperlihatkan c mengecil dan kawanan merapat.
- **Kritik dari makalah:** pada GOA asli, sebagian besar iterasi dihabiskan untuk eksplorasi sehingga eksploitasi kurang (diklaim penulis; tandai sebagai klaim penulis).

### M6. Pola B: MCT-Seeded GOA (Heuristik → Metaheuristik)

- **Ide:** jangan mulai pencarian dari titik acak; mulai dari solusi MCT yang sudah cukup bagus, lalu biarkan GOA memperbaikinya.
- **Bukti dari literatur (PSO, bukan GOA):** \[Makalah-MCT-PSO\] menunjukkan pada 1000 tugas dan 20 VM, MS konvergen ke 87 (PSO acak), 81 (SJFP-PSO), 80 (LJFP-PSO), dan 67 detik (MCT-PSO).
- **Usulan desain (BUKAN dari makalah; beri label "Usulan"):**
  - Encoding kontinu untuk GOA: tiap tugas i punya satu dimensi x\_i dalam \[0, Nv); VM = floor(x\_i). Seed MCT diterjemahkan ke x\_i = (nomor VM) + 0,5.
  - Seed hanya sebagian populasi (mis. 10–20%); sisanya acak, untuk menjaga keragaman. Alasannya: penulis \[Makalah-MCT-PSO\] sendiri mengakui bahwa seluruh partikel mulai dari satu titik awal adalah keterbatasan.
  - Fungsi fitness = makespan; GOA tetap meminimalkan.
- **Visual:** diagram alur: persegi hijau (MCT) → lingkaran emas (seed) bersama lingkaran abu-abu (acak) → heksagon ungu (loop GOA) → lingkaran emas akhir (elite). Pembanding: toggle "dengan seed / tanpa seed" pada lanskap yang sama.
- **Peringatan yang harus ditampilkan:** kurva "dengan vs tanpa seed" di simulasi web adalah **ilustrasi**, kecuali bila agen benar-benar menjalankan algoritma; jangan menyajikan angka ilustrasi sebagai data makalah.

### M7. ALO (Ant Lion Optimizer)

- **Analogi:** larva antlion menggali jebakan kerucut di pasir; semut yang jatuh sulit keluar.
- **Konsep (dari \[Makalah-ALO-GOA\], Bag. 2):** semut melakukan jalan acak (random walk); antlion dipilih lewat roulette wheel (antlion lebih bagus lebih sering dipilih); ada antlion elite terbaik; jalan acak dibatasi di sekitar antlion terpilih dan ruangnya menyempit seiring iterasi; bila semut lebih baik dari antlion, antlion digantikan posisi semut itu.
- **Visual:** segitiga terbalik cokelat sebagai jebakan, lingkaran biru sebagai semut, area jalan acak mengecil; slider iterasi.
- **Kelemahan ALO yang disebut makalah:** roulette wheel dapat menyebabkan hilangnya keragaman dan konvergensi dini.

### M8. Pola C: Hybrid GOA-ALO (Metaheuristik + Metaheuristik)

- **Ide inti:** belalang berjalan acak dan saling berinteraksi sosial sampai jatuh ke jebakan antlion. ALO kuat di eksploitasi; gaya sosial GOA kuat di eksplorasi.
- **Komponen yang harus dijelaskan satu per satu (urut):**
  1. Random walk dan normalisasi ke batas (persamaan 1–3 makalah).
  2. Jebakan memengaruhi jalan acak: batas c dan d digeser ke posisi antlion terpilih (persamaan 4–5).
  3. Gaya sosial GOA (persamaan 6–7).
  4. **Parameter c yang dimodifikasi:** iterasi dibagi dua; paruh pertama menurun linear, paruh kedua menurun lebih tajam, supaya eksploitasi mendapat porsi iterasi lebih besar (persamaan 9–10).
  5. **Penyempitan oleh parameter w:** I = 10^(w·t/T); w = 2 saat t > 0,1T, 3 saat t > 0,5T, 4 saat t > 0,75T, 5 saat t > 0,9T, 6 saat t > 0,95T. Batas c dan d dibagi I sehingga ruang jalan semakin sempit (persamaan 11–12).
  6. Posisi baru = gabungan pengaruh roulette wheel + elite + gaya sosial; hasil diurutkan menurut fitness, lalu diambil **tiga sampel** (terbaik, menengah, terburuk) agar total sama dengan jumlah agen. Sampel buruk menjaga eksplorasi; sampel baik memperkuat eksploitasi.
  7. Penggantian antlion bila belalang lebih baik (persamaan 13) dan pembaruan elite.
- **Visual:** flowchart dengan bentuk standar (heksagon GOA + heksagon ALO yang bergabung menjadi satu blok hybrid); animasi tiga sampel terbaik/menengah/terburuk; grafik langkah w naik pada sumbu iterasi.
- **Perbandingan pola:** tabel Pola B vs Pola C (apa yang digabung, apa yang dikorbankan, kapan dipakai).

### M9. Membaca Hasil Secara Kritis dan Rangkuman

- Ajarkan cara membaca tabel hasil (best/worst/mean/std, rank) dan mengapa 30 kali run diperlukan.
- **Catatan kritis wajib (diverifikasi dari makalah):**
  - &#91;Makalah-ALO-GOA\] mengklaim unggul pada mayoritas uji, tetapi pada CEC2015 (Tabel 9) total rank SPS-L-SHADE-EIG = 333 lebih baik dari hybrid = 402. Teks menyebut hybrid "slightly outdoes" metode itu pada sebagian kriteria; tampilkan keduanya apa adanya.
  - Waktu CPU hybrid pada masalah antena (213 s) lebih besar dari ALO (67 s) dan GOA (195 s): kualitas lebih baik, biaya komputasi lebih besar.
  - Pada \[Makalah-MCT-PSO\], banyak sel hasil MCT-PSO sama persis dengan MCT murni (mis. MS 2,2 dan 4,2 untuk 200 dan 400 tugas), artinya kontribusi PSO pada kasus itu kecil. Selain itu, titik awal heuristik pada Gambar 13 (114–124) tampak lebih buruk daripada titik awal acak (100); pembaca perlu diajak mempertanyakan konsistensinya.
  - Hasil bersifat spesifik masalah (No Free Lunch): tidak ada algoritma terbaik untuk semua masalah.
- **Rangkuman:** satu halaman "cheat sheet" Pola B dan Pola C dengan diagram shapes.
- **Kuis akhir:** 8–10 soal campuran, plus 1 latihan klasifikasi pola (A/B/C) untuk algoritma lain.

## 7. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| F1 | Navigasi linear M0 → M9 dengan progres belajar dan tombol Lanjut/Kembali | Wajib |
| F2 | Glosarium dengan tooltip untuk semua istilah teknis | Wajib |
| F3 | Diagram shapes sesuai Bagian 5 pada setiap modul, dengan legenda | Wajib |
| F4 | Visualisasi interaktif: lanskap + kawanan (M0–M2), walkthrough MCT (M4), slider c dan iterasi (M5, M8) | Wajib |
| F5 | Kuis per modul dengan umpan balik penjelas | Wajib |
| F6 | Label tegas "Dari makalah" vs "Usulan desain" vs "Ilustrasi" pada setiap klaim/visual | Wajib |
| F7 | Daftar rujukan dan tautan ke dua makalah | Wajib |
| F8 | Mode terang/gelap, responsif mobile, aksesibel (kontras, alt text, keyboard) | Wajib |
| F9 | Simulator mini MCT-seeded GOA vs GOA acak pada fungsi sederhana | Opsional |

## 8. Kebutuhan Non-Fungsional

- Bahasa Indonesia baku-santai, kalimat pendek; istilah Inggris dicetak miring pada kemunculan pertama.
- Akurasi: setiap rumus/angka dari makalah harus identik dengan sumber; bila ragu, tulis "lihat makalah, persamaan N".
- Hak cipta: jangan menyalin paragraf makalah; parafrase dengan kata sendiri, kutipan maksimal sangat singkat dan disertai rujukan.
- Performa: halaman termuat cepat; animasi tidak membebani perangkat rendah.

## 9. Kriteria Penerimaan

1. Pembaca tanpa latar belakang dapat menjawab benar minimal 80% kuis akhir setelah menyelesaikan modul secara berurutan.
2. Tiap istilah teknis punya definisi di glosarium.
3. Contoh hitung M3–M4 menghasilkan MS = 3,5 detik persis seperti pada PRD ini.
4. Pola B dan Pola C masing-masing memiliki satu diagram shapes lengkap + satu penjelasan "kapan dipakai".
5. Tidak ada klaim "usulan desain" yang tampil seolah hasil makalah.
6. Audit Tugas 0 terdokumentasi sebelum perubahan.

## 10. Urutan Pengerjaan untuk Agent

1. Tugas 0: audit repo dan petakan ke M0–M9.
2. Bangun sistem visual (Bagian 5) sebagai komponen reusable.
3. Tulis ulang materi M0–M4 (fondasi + MCT).
4. Tulis M5–M6 (GOA dan Pola B).
5. Tulis M7–M8 (ALO dan Pola C).
6. Tulis M9, glosarium, kuis, rujukan.
7. Review akurasi terhadap dua makalah; laporkan ketidaksesuaian.

## 11. Di Luar Lingkup

- Perubahan stack/teknologi, hosting, atau autentikasi.
- Implementasi lengkap benchmark CEC2015 atau simulasi antena.
- Klaim performa baru tanpa eksperimen yang benar-benar dijalankan.

## 12. Pertanyaan Terbuka untuk Pemilik Produk

- Apa definisi "Pola A" pada kerangka pola kamu? Agar bisa ditambahkan sebagai pembanding di M9.
- Apakah ingin simulator F9 dijalankan di browser (JavaScript) atau hanya animasi ilustrasi?
- Apakah materi perlu versi Inggris?

## 13. Hasil Audit Repo (Tugas 0 Selesai) dan Revisi Wajib

Bagian 2 menyebut repo belum terbaca. **Sekarang sudah diaudit** (index.html, css/atlas-theme.css, js/ui/*, js/viz/*, js/algorithms/\*). Konsep web saat ini: meja "Card Wars SOKA" dengan Butler Sir Pip, 9 kartu, 34 ketukan manual, simulator, dan lab 3D/2D. Fondasi sangat baik; yang perlu direvisi adalah **akurasi materi, kepadatan visual, keterbacaan, dan kesiapan presentasi**. Penilaian audit ini berasal dari pembacaan kode dan CSS, bukan dari tampilan yang dirender.

### 13.1 Skor Audit dan Target

| Aspek | Skor sekarang | Target setelah revisi |
| --- | --- | --- |
| Konsep desain dan identitas | 8 | 8,5 |
| Struktur pedagogis | 8,5 | 9 |
| Kemudahan visualisasi untuk pemula | 7 | 8,5 |
| Konsistensi sistem shapes | 8 | 9 |
| Keterbacaan dan aksesibilitas | 6 | 8 |
| Akurasi materi | 5,5 | 9 |
| Kesiapan presentasi di kelas | belum diukur (lihat 13.6) | 8,5 |
| **Keseluruhan** | **7** | **≥ 8,5, tiap aspek ≥ 8** |

### 13.2 Revisi Akurasi Materi (Prioritas 1, Wajib)

| ID | Lokasi | Masalah | Revisi yang diminta |
| --- | --- | --- | --- |
| A1 | js/ui/shorts-stage.js baris \~321 (ketukan c8-cec) | Angka "-35.99 dB" tidak ada di paper | Ganti dengan angka dari paper: Max SLL hybrid pada LAA 32-elemen = −14,73 dB (ALO −14,27; GOA −9,09), null −147,91 dB. Untuk CCAA: hybrid −31,84 dB (ALO −30,37; BBO −29,61; EP −28,92). |
| A2 | shorts-stage.js baris \~321 | "konsisten menang uji Wilcoxon" tidak ada di paper | Hapus. Ganti dengan fakta yang ada: statistik 20 run (mean −186,876 dB vs ALO −92,7235 dan GOA −81,0769 pada fungsi fitness LAA). |
| A3 | shorts-stage.js baris \~312 (ketukan c8-classical) | "Multimodal (39)" salah; 39 adalah jumlah kolom Best CEC2015 | Pakai total rank paper: unimodal = 15, multimodal/komposit = 57 (terendah di antara 13 metode). |
| A4 | index.html (kotak Pola C) | "Rank #1 pada 32 benchmark klasik" berlebihan | Tulis "total rank terbaik pada uji klasik yang dilaporkan paper". Tambahkan catatan: pada CEC2015, SPS-L-SHADE-EIG (333) lebih baik dari hybrid (402). |
| A5 | index.html baris \~306, \~318, \~756 | Placeholder "\[CITASI PAPER MCT-GOA MENYUSUL\]" tampil 3 kali | Ganti dengan: "Rujukan empiris ide seeding: Alsaidy dkk. (2020), memakai PSO, bukan GOA. MCT-seeded GOA adalah usulan adaptasi." Tambahkan sitasi lengkap Alsaidy dkk. di Daftar Pustaka. |
| A6 | Kartu IV (ketukan c4-inject) | "jauh mengungguli Pure GOA acak" tampil seperti fakta | Tambah label "Hasil simulasi di web ini, bukan data paper" dan tunjukkan angka dari simulator yang sedang berjalan. |
| A7 | Kartu II (ketukan c2-random) | "Tebakan acak selalu kalah" terlalu mutlak | Ubah menjadi "sering kalah". |
| A8 | Kotak "Kapan memilih Pola B vs C" | Rekomendasi "Ideal untuk penjadwalan diskrit" dan kompleksitas "O(M\*K)" belum bersumber | Label "pertimbangan didaktik" untuk rekomendasi; verifikasi atau hapus klaim kompleksitas. |

**Aturan baru (berlaku seluruh web):** setiap klaim angka atau peringkat harus punya salah satu dari tiga lencana: **\[Paper\]** (disertai nomor tabel/gambar), **\[Simulasi\]** (dihasilkan simulator di halaman), atau **\[Usulan\]** (desain kita). Tanpa lencana, klaim tidak boleh tampil.

### 13.3 Revisi Tata Letak dan Visual (Prioritas 2–4)

| ID | Masalah (hasil audit) | Revisi yang diminta | Kriteria selesai |
| --- | --- | --- | --- |
| L1 | Tidak ada legenda bentuk permanen | Strip legenda tetap di tepi atas panel visual: Kotak hijau = MCT, Lingkaran biru = GOA, Corong merah = ALO, Berlian merah = Elite, Panah = aliran. Satu komponen dipakai di semua kartu. | Legenda terlihat di setiap kartu tanpa perlu menggulir. |
| L2 | Beban visual berlapis (meja 3D, HUD, Butler, kartu, panel) | **Mode Fokus** otomatis pada ketukan penjelasan: redupkan latar 3D dan elemen non-fokus hingga opasitas ≤ 25%, sorot satu objek. Latar 3D hanya hidup saat intro, saat "Intip Meja", dan di Lab. | Pada ketukan penjelasan hanya satu objek utama yang tampak tajam. |
| L3 | Terlalu banyak tombol HUD (Intro, Intip, Meja 3D/2D, Meja 9 Kartu, Balik Semua, Buka Semua) | Sisakan 3 tombol utama: **Kartu ▾ (daftar 9 kartu), Mode Presentasi, Bantuan**. Sisanya pindah ke menu "Lainnya". | Maksimal 3 tombol terlihat di HUD. |
| L4 | Teks terlalu kecil (8,8–12 px; banyak text-\[10px\]/\[11px\]) | Skala tipografi baru: isi 16 px, caption ketukan 20 px, judul ketukan 28 px, label sekunder minimal 13 px, **tidak ada teks di bawah 12 px**. Mode Presentasi: isi 22 px, caption 28 px. | Pemeriksaan otomatis: tidak ada font-size < 12px di CSS dan kelas Tailwind. |
| L5 | Warna merah ganda arti (ALO dan gaya tolak) | Gaya tolak memakai warna terpisah (mis. oranye) + pola garis putus; gaya tarik tetap biru. Legenda memuat keduanya. | Tidak ada satu warna yang mewakili dua konsep. |
| L6 | Warna menjadi satu-satunya pembeda | Tambahkan pembeda non-warna: ikon/pola pada tiap suit (kotak penuh, lingkaran berisi titik, corong bergaris) dan label teks pendek di sebelah objek. | Diagram tetap terbaca dalam skala abu-abu. |
| L7 | Lompat dari analogi ke rumus dalam satu ketukan (Kartu V, VI) | Pola ketukan baru untuk setiap rumus: (1) analogi, (2) contoh angka kecil, (3) rumus + "artinya dalam bahasa biasa". Rumus lanjutan disembunyikan di tombol "Tampilkan rumus". | Tidak ada rumus pada ketukan pertama sebuah konsep. |
| L8 | Lab 3D menampilkan banyak parameter sekaligus (N, L, c\_max, c\_min, f, l, seed, jejak, vektor, perangkap) | Dua tingkat: **Dasar** (pilih fungsi, tombol Jalankan, Bandingkan Ketiganya) dan **Lanjutan** (semua parameter, terlipat secara default). | Layar awal Lab hanya memuat ≤ 5 kontrol. |
| L9 | Judul tab dimulai dengan nama branding | Ubah \<title> menjadi "Hybrid Metaheuristik: MCT-GOA dan Hybrid GOA-ALO | Card Wars SOKA". |
| L10 | Bergantung pada CDN (Tailwind play CDN, Three.js dari unpkg, Google Fonts) | Vendor-kan semua aset ke repo (Three.js, font) dan ganti Tailwind CDN dengan CSS hasil build. Web harus berjalan **tanpa internet**, karena jaringan kelas tidak dapat diandalkan. | Web berfungsi penuh saat koneksi dimatikan. |

### 13.4 Revisi Per Kartu (Ringkas)

| Kartu | Revisi materi | Revisi tata letak |
| --- | --- | --- |
| I Pengantar | Tambah satu kalimat tujuan belajar ("Setelah sesi ini kamu bisa membedakan Pola B dan C"). | Legenda permanen (L1); bentuk besar di tengah. |
| II Intuisi | Perbaiki A7; tambah definisi optimum lokal vs global dengan satu gambar lembah. | Mode Fokus pada tiap ketukan (L2). |
| III Taksonomi | Jelaskan istilah "heuristik" dan "metaheuristik" sebelum membandingkan Pola B dan C; tambah baris "contoh lain" untuk tiap pola. | Tabel perbandingan 3 baris saja, detail di tombol "Selengkapnya". |
| IV Pola B | Perbaiki A5, A6; tambah contoh hitung kecil (4 tugas, 2 VM; MCT menghasilkan makespan 3,5 detik, jadwal buruk 10 detik) sebelum simulator. Tampilkan lencana \[Usulan\] pada MCT-GOA dan \[Paper\] pada MCT-PSO (87/81/80/67 detik). | Animasi MCT satu langkah per klik; legenda L1. |
| V GOA dan ALO | Tambah ketukan contoh angka sebelum s(r) dan rasio I (L7). | Kurva s(r) dengan zona tolak/tarik berwarna terpisah (L5). |
| VI Pola C | Urutkan komponen: random walk → jebakan → gaya sosial → c dimodifikasi → w → tiga sampel → penggantian antlion. Satu ketukan per komponen utama. | Flowchart dengan bentuk standar PRD Bagian 5 (heksagon GOA + ALO bergabung). |
| VII Lab | Preset skenario "Rastrigin: bandingkan ketiganya" sebagai default; tambah teks "cara membaca grafik" satu kalimat. | Mode Dasar/Lanjutan (L8). |
| VIII Bukti | Terapkan A1–A4 dan A8; wajib tampilkan keterbatasan: SPS-L-SHADE-EIG lebih baik di CEC2015, hybrid lebih lambat (213 s vs ALO 67 s). | Setiap angka memuat lencana \[Paper\] + rujukan tabel. |
| IX Rangkuman | Tambah "Catatan kritis" (PRD Bagian M9) dan kuis akhir 8–10 soal. | Satu halaman cheat sheet Pola B dan C dengan diagram shapes. |

### 13.5 Mode Presentasi (Fitur Baru)

Tujuan: dosen dapat tampil di depan kelas tanpa mengubah apa pun.

- Tombol "Mode Presentasi" di HUD; tombol pintas **P**.
- Menyembunyikan HUD sekunder dan latar 3D; menampilkan hanya: caption besar, satu visual, legenda, dan penanda progres "Kartu 4/9 · Ketukan 2/4".
- Ukuran teks sesuai L4 (mode presentasi); kontras tinggi; tombol pintas tetap (Space/N maju, B mundur).
- **Tiga jalur durasi** yang dapat dipilih dari menu: **Kilat 15 menit** (Kartu I, II, IV, VI, VIII dengan ketukan inti), **Standar 30 menit** (semua kartu, ketukan inti), **Lengkap 45 menit** (semua ketukan + Lab).
- Catatan dosen (speaker notes) per ketukan, dapat dibuka dengan tombol **S**: satu kalimat apa yang harus dikatakan, satu pertanyaan untuk kelas, dan jawaban yang diharapkan.
- Cetak ke PDF: tata letak cetak ringkas (satu ketukan per halaman) sebagai cadangan bila proyektor bermasalah.

### 13.6 Rubrik Kelayakan Presentasi (Dosen Menilai Ulang)

Setelah revisi, dosen menilai ulang dengan rubrik di bawah. Web dinyatakan **layak dipresentasikan** bila skor keseluruhan ≥ 8,5 dan tidak ada aspek di bawah 8.

| # | Uji | Cara uji | Lulus bila |
| --- | --- | --- | --- |
| 1 | Uji 5 detik | Tampilkan satu ketukan 5 detik ke orang baru, lalu tutup | Ia bisa menyebut apa yang ditunjukkan (bentuk dan artinya) |
| 2 | Uji bangku belakang | Proyeksikan di layar kelas, duduk di baris paling belakang | Caption dan legenda terbaca tanpa menyipitkan mata |
| 3 | Uji pemula | 3 orang tanpa latar optimasi menjalani jalur Standar | Minimal 80% menjawab benar kuis akhir; ketiganya bisa menjelaskan beda Pola B dan C dengan kata sendiri |
| 4 | Uji tanpa internet | Matikan koneksi, muat ulang | Semua kartu, simulator, dan Lab berfungsi (L10) |
| 5 | Uji waktu | Jalankan jalur Kilat/Standar/Lengkap dengan penghitung waktu | Selesai dalam ± 10% dari 15/30/45 menit |
| 6 | Uji akurasi | Cocokkan semua angka dengan tabel/gambar paper | 0 klaim tanpa lencana; 0 angka salah (A1–A8 tuntas) |
| 7 | Uji perangkat | Buka di laptop, tablet, dan ponsel; juga tanpa WebGL | Navigasi dan keterbacaan tetap baik; fallback 2D aktif |
| 8 | Uji aksesibilitas | Navigasi hanya dengan keyboard; skala abu-abu; reduced-motion aktif | Semua fitur terjangkau; diagram tetap terbaca; animasi berhenti |

### 13.7 Urutan Pengerjaan Tambahan untuk Agent

1. Terapkan A1–A8 (akurasi) dan sistem lencana \[Paper\]/\[Simulasi\]/\[Usulan\]. Ini harus selesai lebih dulu.
2. Terapkan L1, L4, L5, L6 (legenda, tipografi, warna).
3. Terapkan L2, L3, L8 (Mode Fokus, HUD ramping, Lab dua tingkat).
4. Terapkan L7 dan revisi per kartu (13.4).
5. Bangun Mode Presentasi, catatan dosen, dan tiga jalur durasi (13.5).
6. Terapkan L9, L10 (judul, aset lokal tanpa CDN).
7. Jalankan 8 uji pada 13.6 dan laporkan hasilnya dalam satu tabel.

### 13.8 Di Luar Lingkup Tambahan

- Mengganti tema "Card Wars" atau karakter Sir Pip; identitas visual dipertahankan.
- Menambah algoritma baru di luar MCT, GOA, dan ALO.
- Mengklaim performa MCT-GOA sebagai hasil paper; statusnya tetap \[Usulan\] sampai ada eksperimen yang dijalankan dan dilaporkan.
