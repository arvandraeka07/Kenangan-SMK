==============================================================
  DKVEARLESS
  DKV 3 · SMK Negeri 7 Surakarta · 2022—2025
  Tiga tahun, banyak cerita.
==============================================================

Album kenangan digital dengan suasana hangat, sedikit humor, dan foto
sebagai pusat perhatian. Foto, video, musik, font, dan ikon disimpan
di dalam folder proyek. Buku pesan memakai Supabase supaya pesan bisa
dibaca semua pengunjung; bagian lain tetap berjalan tanpa internet.

Seluruh tulisan di website menggunakan bahasa Indonesia.


--------------------------------------------------------------
1. CARA MEMBUKA
--------------------------------------------------------------
1. Buka aplikasi File Manager di HP.
2. Masuk ke folder Documents/DKV3-MEMORIES/.
3. Ketuk index.html.
4. Pilih Chrome, Firefox, atau browser favoritmu.

Alamat lengkapnya biasanya:

  file:///storage/emulated/0/Documents/DKV3-MEMORIES/index.html

Jangan memindahkan satu file atau folder saja. Semua alamat saling
terhubung. Jika seluruh folder dipindah, struktur di dalamnya harus
tetap sama.

Beberapa browser membatasi media pada file lokal. Jika video atau
musik tidak muncul saat dibuka lewat file://, jalankan server lokal
sederhana dari folder ini:

  python -m http.server 8000

Lalu buka http://localhost:8000 di browser. Langkah ini hanya untuk
pengujian. Album tetap bisa dibuka tanpa internet, tetapi buku pesan
publik memerlukan koneksi ke Supabase.


--------------------------------------------------------------
2. STRUKTUR FOLDER
--------------------------------------------------------------
DKV3-MEMORIES/
├── index.html
├── README.txt
├── css/
│   └── style.css
├── js/
│   ├── media-data.js     ← pusat data konten
│   ├── supabase-config.js ← URL dan anon key Supabase
│   └── script.js         ← seluruh interaksi website
└── assets/
    ├── fonts/
    │   ├── cormorant-garamond-*.woff2
    │   └── manrope-*.woff2
    ├── icons/
    │   ├── favicon.png
    │   └── apple-touch-icon.png
    ├── images/
    │   ├── photo-01.jpg ... photo-16.jpg
    │   └── video-poster.jpg
    ├── logo/
    │   ├── dkvearless-logo.png
    │   └── dkvearless-logo-source.jpg
    ├── music/
    │   └── backsound.mp3
    └── videos/
        └── kenangan.mp4

Catatan logo:
- dkvearless-logo.png adalah logo resmi dengan latar transparan.
- Jangan menggambar ulang, memotong, atau mengubah bentuk, warna,
  maupun tulisan pada logo. Gunakan file asli apa adanya.
- dkvearless-logo-source.jpg adalah salinan sumber untuk arsip.


--------------------------------------------------------------
3. MENGISI FOTO
--------------------------------------------------------------
Semua data foto berada di js/media-data.js, bagian "photos".

Langkah mengganti foto contoh:
1. Siapkan foto JPG/PNG/WebP. Lebar ideal 1200—1600 px.
2. Simpan di assets/images/ dengan nama sederhana, misalnya:
   kelas-2023-tugas.jpg
3. Buka js/media-data.js dengan editor teks (Acode, Notepad++, dll.).
4. Cari "photos: [" lalu ubah satu blok:

   {
     file: "assets/images/kelas-2023-tugas.jpg",
     alt: "DKV 3 mengerjakan tugas di kelas",
     caption: "Tugas menumpuk, tawa tetap jalan.",
     category: "Kegiatan Sekolah",
     year: "2023",
     frame: "BINGKAI 03"
   }

5. Simpan file, lalu refresh browser.

Keterangan field:
- file     : alamat foto dari index.html. Wajib.
- alt      : deskripsi foto untuk pembaca layar. Wajib dan spesifik.
- caption  : keterangan foto di galeri dan tampilan besar. Boleh "".
- category : harus sama persis dengan salah satu kategori.
- year     : tahun atau tanggal opsional.
- frame    : label nomor bingkai opsional.

Kategori yang tersedia:
- "Foto Bersama"
- "Kegiatan Sekolah"
- "Praktik DKV"
- "Momen Random"
- "Jalan-Jalan"
- "Kenangan Terakhir"

"Semua" adalah filter bawaan. Jangan menghapusnya dari array
"categories". Jika menambah kategori baru, tambahkan juga namanya
di "categories" dan gunakan nama itu pada foto.

Jumlah foto tidak harus 16. Kartu galeri mengikuti isi array.
Namun teks "16 bingkai" di beranda, "Bingkai 01—16" di pembuka, dan
beberapa teks lain perlu disesuaikan manual jika jumlahnya berubah.

Tips ukuran:
- Format aman: JPG, PNG, atau WebP.
- Usahakan tiap foto di bawah 500 KB agar ringan.
- Foto boleh lanskap atau potret. Galeri memotong otomatis,
  sedangkan tampilan besar menampilkan gambar penuh.
- Gunakan foto asli kelas. Jangan memakai foto stok atau ilustrasi
  generik sebagai isi akhir.
- Jangan memakai URL internet. Semua media harus lokal.


--------------------------------------------------------------
4. MENGISI CERITA KITA
--------------------------------------------------------------
Cerita berada di js/media-data.js, bagian "timeline".

Setiap bab memiliki field:
- year    : tahun, misalnya "2022".
- chapter : label kecil, misalnya "Bab 01".
- title   : judul bab.
- text    : cerita singkat yang benar-benar terjadi.
- photo   : foto pendamping di assets/images/.
- alt     : deskripsi foto.
- caption : keterangan foto.

Teks bawaan adalah kerangka:

2022 — Awal Cerita
2023 — Mulai Terbiasa
2024 — Semakin Banyak Cerita
2025 — Waktunya Berpisah

Ganti dengan cerita asli kelas. Jangan mengarang kejadian atau nama.
Urutan cerita boleh berisi lebih atau kurang dari empat bab selama
urutannya masuk akal.


--------------------------------------------------------------
5. TEBAK MOMEN
--------------------------------------------------------------
Bagian "Tebak Momen" bekerja otomatis dari data foto.

Pertanyaan diambil dari:
- year     → "Foto ini dari tahun berapa?"
- category → "Ini masuk kegiatan apa?"

Jawaban, keterangan foto, dan kategori baru muncul setelah pengunjung
memilih. Skor dihitung selama halaman masih terbuka.

Agar fitur ini bekerja dengan baik:
- Isi "year" pada setiap foto.
- Gunakan "category" yang sama persis dengan daftar kategori.
- Minimal ada beberapa foto dengan tahun dan kategori berbeda.
- Jangan menampilkan tahun pada keterangan foto jika ingin tebakan tetap
  menantang.


--------------------------------------------------------------
6. MENGISI NAMA SISWA
--------------------------------------------------------------
Daftar siswa berada di js/media-data.js, bagian "students".

Bentuknya array berisi nama, saat ini ada 34 nama contoh:

  students: [
    "Nama Siswa 01",
    "Nama Siswa 02",
    "Nama Siswa 03",
    ...
    "Nama Siswa 34"
  ]

Ganti setiap nama contoh dengan nama asli teman sekelas. Jangan
mengarang nama. Tambah atau kurangi entri sesuai jumlah siswa.
Jumlah pada bagian "Nama Siswa" mengikuti isi array secara otomatis.

Jika jumlah siswa berubah, sesuaikan juga kalimat "Tiga puluh empat
nama" di index.html agar tetap sesuai.

--------------------------------------------------------------
6B. BUKU PESAN PUBLIK (SUPABASE)
--------------------------------------------------------------
Buku pesan menyimpan pesan di Supabase, bukan di browser. Semua
pengunjung bisa membaca pesan yang sudah dikirim. Tidak ada surat
tertutup di versi ini.

Langkah menyiapkan:
1. Buat project gratis di https://supabase.com.
2. Buka SQL Editor, tempel SQL di bawah, lalu jalankan.
3. Buka Project Settings > API. Salin Project URL dan anon public key.
4. Isi keduanya di js/supabase-config.js:
     window.DKV_SUPABASE = {
       url: "https://PROJECT.supabase.co",
       anonKey: "ANON_PUBLIC_KEY",
       table: "messages"
     };
5. Simpan, lalu unggah seluruh folder ke GitHub Pages.

SQL tabel dan aturan akses:

  create table if not exists public.messages (
    id bigint generated by default as identity primary key,
    name text not null check (char_length(name) between 1 and 40),
    message text not null check (char_length(message) between 1 and 240),
    created_at timestamptz not null default now()
  );

  alter table public.messages enable row level security;

  create policy "messages are readable by everyone"
  on public.messages for select
  using (true);

  create policy "anyone can leave a message"
  on public.messages for insert
  with check (true);

  grant select, insert on public.messages to anon;
  grant usage, select on sequence public.messages_id_seq to anon;

Catatan keamanan:
- anon public key memang boleh terlihat di browser. Jangan pernah
  memakai service_role key di file website.
- RLS wajib aktif. Tanpa RLS, tabel bisa diakses lebih luas.
- Website tidak menyediakan tombol hapus. Hapus spam lewat Table Editor
  di dashboard Supabase.
- Jika konfigurasi kosong, formulir buku pesan otomatis dinonaktifkan.

--------------------------------------------------------------
7. MENGGANTI VIDEO
--------------------------------------------------------------
Hanya ada satu video utama.

Cara termudah:
1. Siapkan video MP4 dengan codec H.264 + audio AAC.
2. Timpa assets/videos/kenangan.mp4 dengan file baru bernama sama.
3. Refresh browser.

Jika nama file berubah:
1. Letakkan video di assets/videos/.
2. Buka js/media-data.js, bagian "video".
3. Ubah "src" dan, bila perlu, "poster" serta "caption".
4. Poster sebaiknya JPG lanskap 16:9, misalnya 1280x720.

Pemutar video menyediakan tombol putar, jeda, posisi video,
pengaturan volume, tombol bisu, dan layar penuh.

Video bawaan adalah foto contoh 29 detik dari ilustrasi. Ganti
dengan video kelas asli. Hindari video berukuran sangat besar;
kompres ke sekitar 720p agar ringan di HP.


--------------------------------------------------------------
8. MENGGANTI MUSIK
--------------------------------------------------------------
1. Timpa assets/music/backsound.mp3 dengan lagu pilihanmu, atau
2. ubah "music.src" di js/media-data.js.

Musik dicoba diputar otomatis saat website dibuka. Jika browser
memblokirnya, muncul tombol "Ketuk untuk Masuk dan Putar Kenangan".
Setelah musik dimulai, musik tetap berjalan selama pengunjung
menjelajahi website. Jika pengunjung pernah menekan tombol musik
untuk mematikan, pilihan itu diingat dan musik tidak diputar lagi.
Musik berhenti saat video diputar dan lanjut setelah video selesai.

Pastikan kamu memiliki hak untuk memakai lagu tersebut.


--------------------------------------------------------------
9. FITUR WEBSITE
--------------------------------------------------------------
- Layar pembuka seperti membuka album, dengan logo resmi.
- Loading screen singkat dan transisi masuk.
- Beranda dengan dua foto utama dan catatan kelas.
- Navigasi: Beranda, Galeri Foto, Cerita Kita, Video Kenangan,
  Buku Pesan.
- Cerita Kita 2022—2025 yang diisi dari media-data.js.
- Galeri foto dengan empat gaya tampilan:
  Majalah, Kolase, Polaroid, dan Film.
- Filter kategori, pencarian keterangan/kategori/tahun, dan reset.
- Tombol Acak untuk membuka kenangan secara acak.
- Tampilan besar dengan tombol sebelumnya/berikutnya, geser di HP,
  panah keyboard, Esc, dan putar otomatis.
- Tebak Momen dengan pertanyaan tahun atau kategori.
- Satu video dengan kontrol putar, jeda, posisi, volume, bisu,
  dan layar penuh.
- Daftar 34 nama siswa dengan nomor urut otomatis.
- Buku Pesan publik lewat Supabase, dengan tombol muat ulang.
- Galeri Kejadian di Luar Nalar dengan 120 foto random.
- Rekaman yang Tertinggal dengan 6 video: 3 landscape dan 3 portrait.
- Tab pesan yang bisa dioperasikan dengan keyboard.
- Panduan media di dalam website.
- Musik kenangan yang mulai saat album dibuka, dengan tombol putar
  dan jeda.
- Tombol kembali ke atas dan indikator posisi halaman.
- Bagian penutup dengan foto, logo, dan pesan terima kasih.
- Responsif untuk HP, tablet, dan desktop.
- Tampilan HP: tombol lebih mudah disentuh, input tidak memicu zoom
  otomatis, filter bisa digeser dengan petunjuk pudar di tepi, lightbox
  gelap penuh agar tidak tembus pandang, dan layar pembuka menyesuaikan
  layar pendek serta poni (safe area).
- Di HP, tombol "Acak" mengambang disembunyikan supaya tidak menutupi
  teks; tombol Acak tetap ada di bagian Galeri Foto.
- Album berjalan di perangkat; hanya buku pesan yang memakai layanan
  Supabase.

Kejutan tersembunyi:
- Klik logo DKVEARLESS di header sebanyak 5 kali.
- Ketik "dkv3" saat album sudah terbuka.
- Ketik "rindu" saat album sudah terbuka.
Jangan mengetik saat fokus berada di kolom input atau textarea.


--------------------------------------------------------------
10. DATA TERSIMPAN
--------------------------------------------------------------
Buku pesan disimpan di tabel Supabase dan bisa dibaca semua
pengunjung. Surat, pilihan tampilan, dan preferensi musik disimpan
di localStorage perangkat yang dipakai.

Kunci penyimpanan lokal:
- dkvearless.layout
- dkvearless.music

Artinya:
- Pilihan tampilan dan preferensi musik disimpan di browser/perangkat itu.
- Mode penyamaran biasanya membuang data saat tab ditutup.
- Jika localStorage diblokir, website memakai penyimpanan sementara
  selama halaman masih terbuka.
- Pesan publik tetap tersimpan di Supabase meskipun data browser
  dihapus.

Pesan publik dihapus lewat Table Editor Supabase.


--------------------------------------------------------------
11. PANDUAN DI DALAM WEBSITE
--------------------------------------------------------------
Tombol "Panduan" di navigasi dan footer membuka petunjuk singkat
tentang folder, foto, cerita, nama siswa, buku pesan publik, Tebak
Momen, video, dan musik. Panduan ini berguna saat album dibagikan ke
teman tanpa menyertakan README.


--------------------------------------------------------------
12. MASALAH UMUM
--------------------------------------------------------------
Foto tidak muncul:
- Periksa nama file dan huruf besar/kecilnya.
- Pastikan alamat diawali "assets/images/".
- Buka file langsung untuk memastikan tidak rusak.

Video tidak bisa diputar:
- Pastikan file MP4 H.264 dan alamatnya benar.
- Coba buka lewat server lokal seperti pada bagian 1.
- Kompres ulang video jika ukurannya terlalu besar.

Musik tidak berbunyi:
- Pastikan pengunjung sudah menekan "Buka Kenangan".
- Periksa apakah file backsound.mp3 ada.
- Jika tombol musik pernah dimatikan, tekan lagi untuk menyalakan.
- Beberapa browser memblokir audio sampai ada interaksi pengguna.

Volume video tidak berubah:
- Pastikan slider volume tidak berada di posisi paling kiri.
- Tekan tombol speaker untuk menyalakan suara kembali.

Pesan tidak muncul atau gagal terkirim:
- Pastikan ada koneksi internet.
- Periksa url dan anon key di js/supabase-config.js.
- Pastikan tabel messages dan RLS policy sudah dibuat.
- Buka Console browser untuk melihat pesan error.
- Jika konfigurasi kosong, formulir memang dinonaktifkan.

Tampilan berantakan:
- Refresh halaman.
- Pastikan folder css/ dan assets/ tidak dipindah.
- Gunakan browser modern (Chrome, Firefox, Edge, atau Safari terbaru).


--------------------------------------------------------------
13. CATATAN MEDIA & LISENSI
--------------------------------------------------------------
Foto photo-01.jpg sampai photo-16.jpg, poster, dan video bawaan
adalah ilustrasi foto contoh yang dibuat untuk templat ini. Ganti
dengan foto dan video asli kelas agar album terasa personal.

Font yang digunakan (tersimpan lokal):
- Cormorant Garamond — SIL Open Font License
- Manrope — SIL Open Font License

Ikon antarmuka dibuat sebagai SVG inline di index.html.
Logo DKVEARLESS disediakan oleh pemilik proyek; jangan diubah bentuk
maupun tulisannya.

Sebelum membagikan album:
- Ganti seluruh foto contoh dengan foto asli.
- Isi cerita dan nama siswa dengan data yang benar.
- Pastikan foto, video, dan musik boleh digunakan.
- Siapkan Supabase dan isi js/supabase-config.js.
- Uji kirim pesan dari dua browser berbeda.
- Cadangkan salinan folder ini.


--------------------------------------------------------------
Selamat merawat kenangan. Jangan lupa sesekali membuka album ini,
ketawa lagi, lalu sadar kalau kelas ini dulu memang seberisik itu.
--------------------------------------------------------------
