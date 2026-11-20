/* =========================================================================
   DKVEARLESS — DATA FOTO, CERITA, NAMA SISWA, VIDEO, DAN MUSIK
   -------------------------------------------------------------------------
   Ini file utama untuk mengisi konten. Setelah mengedit, simpan lalu
   refresh browser. Semua media harus lokal, jangan memakai URL internet.
   ========================================================================= */

window.DKV3_MEDIA = {
  album: {
    name: "DKVEARLESS",
    class: "DKV 3",
    school: "SMK Negeri 7 Surakarta",
    years: "2022—2025",
    tagline: "Tiga tahun, banyak cerita."
  },

  video: {
    src: "assets/videos/kenangan.mp4",
    poster: "assets/images/video-poster.jpg",
    title: "Video Kenangan",
    caption: "Video singkat buat kangen mendadak. Ganti dengan video kelas yang sebenarnya."
  },

  music: {
    src: "assets/music/backsound.mp3",
    title: "Musik kenangan DKVEARLESS"
  },

  /* KATEGORI GALERI
     "Semua" wajib ada. Tambahkan kategori lain di sini dan gunakan nama
     yang sama persis pada setiap foto. */
  categories: [
    "Semua",
    "Foto Bersama",
    "Kegiatan Sekolah",
    "Praktik DKV",
    "Momen Random",
    "Jalan-Jalan",
    "Kenangan Terakhir"
  ],

  /* FOTO
     - file     : path foto di assets/images/
     - alt      : deskripsi foto untuk pembaca layar
     - caption  : caption opsional, boleh ""
     - category : harus sama persis dengan salah satu kategori
     - year     : tahun atau tanggal opsional
     - frame    : label bingkai opsional */
  photos: [
    {
      file: "assets/images/photo-01.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 01",
      caption: "Hari-hari yang dulu terasa biasa.",
      category: "Kegiatan Sekolah",
      year: "2022",
      frame: "BINGKAI 01"
    },
    {
      file: "assets/images/photo-02.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 02",
      caption: "Di antara tugas dan tawa.",
      category: "Praktik DKV",
      year: "2023",
      frame: "BINGKAI 02"
    },
    {
      file: "assets/images/photo-03.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 03",
      caption: "Tidak semua momen perlu direncanakan.",
      category: "Foto Bersama",
      year: "2023",
      frame: "BINGKAI 03"
    },
    {
      file: "assets/images/photo-04.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 04",
      caption: "Kelas, sore, dan cerita yang belum selesai.",
      category: "Kegiatan Sekolah",
      year: "2022",
      frame: "BINGKAI 04"
    },
    {
      file: "assets/images/photo-05.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 05",
      caption: "Potret yang menyimpan suara ruang kelas.",
      category: "Momen Random",
      year: "2024",
      frame: "BINGKAI 05"
    },
    {
      file: "assets/images/photo-06.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 06",
      caption: "Sedikit kacau, banyak tawa.",
      category: "Momen Random",
      year: "2024",
      frame: "BINGKAI 06"
    },
    {
      file: "assets/images/photo-07.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 07",
      caption: "Sisa hari yang ingin diingat.",
      category: "Jalan-Jalan",
      year: "2023",
      frame: "BINGKAI 07"
    },
    {
      file: "assets/images/photo-08.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 08",
      caption: "Di balik layar sebuah kenangan.",
      category: "Praktik DKV",
      year: "2024",
      frame: "BINGKAI 08"
    },
    {
      file: "assets/images/photo-09.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 09",
      caption: "Tempat pulang setelah jam terakhir.",
      category: "Foto Bersama",
      year: "2025",
      frame: "BINGKAI 09"
    },
    {
      file: "assets/images/photo-10.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 10",
      caption: "Hal-hal kecil yang ternyata besar.",
      category: "Momen Random",
      year: "2023",
      frame: "BINGKAI 10"
    },
    {
      file: "assets/images/photo-11.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 11",
      caption: "Sebelum semua berubah.",
      category: "Kenangan Terakhir",
      year: "2025",
      frame: "BINGKAI 11"
    },
    {
      file: "assets/images/photo-12.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 12",
      caption: "Tahun terakhir, tetap ramai.",
      category: "Kenangan Terakhir",
      year: "2025",
      frame: "BINGKAI 12"
    },
    {
      file: "assets/images/photo-13.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 13",
      caption: "Perjalanan pulang yang tak buru-buru.",
      category: "Jalan-Jalan",
      year: "2024",
      frame: "BINGKAI 13"
    },
    {
      file: "assets/images/photo-14.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 14",
      caption: "Waktu yang tidak meminta untuk diulang.",
      category: "Kegiatan Sekolah",
      year: "2024",
      frame: "BINGKAI 14"
    },
    {
      file: "assets/images/photo-15.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 15",
      caption: "Kami, versi yang paling jujur.",
      category: "Foto Bersama",
      year: "2025",
      frame: "BINGKAI 15"
    },
    {
      file: "assets/images/photo-16.jpg",
      alt: "Contoh foto arsip DKV 3 nomor 16",
      caption: "Satu bingkai terakhir.",
      category: "Kenangan Terakhir",
      year: "2025",
      frame: "BINGKAI 16"
    }
  ],

  /* CERITA KITA 2022—2025
     Teks di bawah adalah kerangka. Ganti dengan cerita yang benar-benar
     terjadi. Jangan mengarang kejadian. */
  timeline: [
    {
      year: "2022",
      chapter: "Bab 01",
      title: "Awal Cerita",
      text: "Saat pertama kali bertemu. Masih belum terlalu mengenal satu sama lain.",
      photo: "assets/images/photo-04.jpg",
      alt: "Contoh foto untuk cerita 2022",
      caption: "Ganti dengan foto dan cerita asli tahun 2022."
    },
    {
      year: "2023",
      chapter: "Bab 02",
      title: "Mulai Terbiasa",
      text: "Mulai mengenal karakter teman, kegiatan kelas, tugas, dan pengalaman bersama.",
      photo: "assets/images/photo-07.jpg",
      alt: "Contoh foto untuk cerita 2023",
      caption: "Ganti dengan foto dan cerita asli tahun 2023."
    },
    {
      year: "2024",
      chapter: "Bab 03",
      title: "Semakin Banyak Cerita",
      text: "Momen yang mulai terasa berharga. Ada tawa, kesibukan, dan kejadian yang sulit dilupakan.",
      photo: "assets/images/photo-13.jpg",
      alt: "Contoh foto untuk cerita 2024",
      caption: "Ganti dengan foto dan cerita asli tahun 2024."
    },
    {
      year: "2025",
      chapter: "Bab 04",
      title: "Waktunya Berpisah",
      text: "Tahun terakhir. Kelulusan, perpisahan, dan berakhirnya perjalanan bersama di sekolah.",
      photo: "assets/images/photo-11.jpg",
      alt: "Contoh foto untuk cerita 2025",
      caption: "Ganti dengan foto dan cerita asli tahun 2025."
    }
  ],

  /* DAFTAR SISWA
     Ganti 34 nama contoh di bawah dengan nama asli teman sekelas.
     Tambah atau kurangi entri sesuai jumlah siswa. Jangan mengarang nama. */
  students: [
    "Arvandra Eka Pratama",
    "Athallah Zaidan Prakosa",
    "Atiya Salma Putri",
    "Audrie Grabrielle Lovina Angeline",
    "Aurielta Fairuz Az-Dzikra",
    "Azhar Muhammad Hanief",
    "Aziz Ilham Ramadhan",
    "Azzahro Lutfifah Setyawan",
    "Clara Armelita Ramadhani",
    "Cristian Setiawan",
    "Elsya Agustin Setiono",
    "Fibi Indah Cahyani",
    "Fillian Raditya Utama",
    "Gerhana Mychel Farel",
    "Hofun Rhisandi",
    "Iza Az-Zahra",
    "Julia Izzati Nurisma",
    "Khoirin Vanissa",
    "Luluk Pulung Apriyani",
    "Muhammad Rizal Nova Hakim",
    "Muhammad Syahdan Afrizal",
    "Mutiara Bilqis Rahmadani",
    "Noval Ardana Wijaya",
    "Nurul Scania Panorama Karlow",
    "Rifa'i Asfari",
    "Riskita Ramadhan Ainal Faizin",
    "Rosa Ismaya Raini",
    "Silvia Ayu Roihanah",
    "Tiwi Septyani",
    "Vika 'Abidah Astriyant Saputri",
    "Vista Jayanti Wulandari",
    "Wulan Annggraini",
    "Yumna Nur Faridah",
    "Zaki Zein"
  ],

  /* PENGHARGAAN DKV 3
     Kategori di bawah sengaja dibiarkan lucu. Jangan mengarang nama.
     Nama dan foto diisi langsung dari website lewat tombol "Isi sendiri",
     lalu tersimpan di browser perangkat itu. Bisa juga diisi manual:
     name  : nama penerima (boleh "")
     photo : path foto, misalnya "assets/images/penghargaan-01.jpg" */
  awards: [
    {
      title: "Paling Sering Terlambat",
      note: "Datang paling awal cuma pas ada pengumuman pulang cepat.",
      name: "",
      photo: ""
    },
    {
      title: "Raja Tidur di Kelas",
      note: "Kepala tegak, mata terpejam, tangan masih memegang pensil.",
      name: "",
      photo: ""
    },
    {
      title: "Paling Sering Meminjam Barang",
      note: "Pulpen, penghapus, charger. Semua ada, kecuali barangnya sendiri.",
      name: "",
      photo: ""
    },
    {
      title: "Paling Banyak Tingkah",
      note: "Kalau kelas tiba-tiba sepi, biasanya dia sedang jadi sumber suara.",
      name: "",
      photo: ""
    },
    {
      title: "Paling Rajin Menghilang",
      note: "Tiba-tiba nggak ada di kelas, muncul lagi pas bel pulang.",
      name: "",
      photo: ""
    }
  ]
};
