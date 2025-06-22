const { Buku } = require('../models/BukuModel');
const { BukuJenis } = require('../models/BukuJenisModel');
const sequelize = require('../config/db');

const bukuData = [
    {
        nomor_isbn: '978-623-500-418-1',
        judul_buku: 'Komunikasi Pertanian',
        pengarang: 'Ramainim Saragih',
        penerbit: 'Widina Media Utama',
        tahun_terbit: 2024,
        deskripsi: 'Buku ini membahas teori dan praktik komunikasi dalam penyuluhan pertanian, seperti proses komunikasi dengan petani, upaya difusi inovasi, serta strategi komunikasi lisan dan non-lisan.',
        jumlah_halaman: 200,
        jumlah_stok: 0,
        lokasi_penyimpanan: 'Digital',
        upload_pdf: 'PDF_1.pdf',
        upload_sampul: 'buku_1.jpg',
        id_kategori: 13 // Pertanian dan Peternakan
    },
    {
        nomor_isbn: '6020651622',
        judul_buku: 'Negara dan Politik Kesejahteraan',
        pengarang: 'A. Muhaimin Iskandar',
        penerbit: 'PT. Gramedia Pustaka Utama',
        tahun_terbit: 2021,
        deskripsi: 'Buku ini membahas konsep negara kesejahteraan sebagai pijakan dalam pembangunan nasional.',
        jumlah_halaman: 321,
        jumlah_stok: 3,
        lokasi_penyimpanan: 'Minangkabau Corner Lt. 3',
        upload_pdf: null,
        upload_sampul: 'buku_2.jpg',
        id_kategori: 9 // Ilmu Sosial dan Politik
    },
    {
        nomor_isbn: '978-623-218-529-6',
        judul_buku: 'Filsafat Keadilan: Biological Justice',
        pengarang: 'Dr. Drs. H. Amran Suadi, S.H., M.Hum., M.M.',
        penerbit: 'Prenada Media Group / Kencana',
        tahun_terbit: 2020,
        deskripsi: 'Studi tentang keadilan biologis dan aplikasinya dalam keputusan pengadilan',
        jumlah_halaman: 225,
        jumlah_stok: 3,
        lokasi_penyimpanan: 'Minangkabau Corner Lt. 3',
        upload_pdf: 'PDF_1.pdf',
        upload_sampul: 'buku_3.jpg',
        id_kategori: 11 // Agama dan Filsafat
    },
    {
        nomor_isbn: '978-623-329-861-2',
        judul_buku: 'Advokasi Pelayanan Kesehatan',
        pengarang: 'Desri Suryani, Yandrizal',
        penerbit: 'Deepublish',
        tahun_terbit: 2022,
        deskripsi: 'Panduan praktis advokasi dalam pelayanan kesehatan',
        jumlah_halaman: 108,
        jumlah_stok: 6,
        lokasi_penyimpanan: 'Ruang Lokal Konten – Skripsi',
        upload_pdf: null,
        upload_sampul: 'buku_4.png',
        id_kategori: 8 // Kesehatan dan Kedokteran
    },
    {
        nomor_isbn: '978-623-8483-60-0',
        judul_buku: 'Buku Ajar Jaringan Komputer',
        pengarang: 'Alfry Aristo Jansen Sinlae dkk.',
        penerbit: 'PT. Sonpedia Publishing Indonesia',
        tahun_terbit: 2024,
        deskripsi: 'Referensi komprehensif untuk pembelajaran jaringan komputer',
        jumlah_halaman: 195,
        jumlah_stok: 8,
        lokasi_penyimpanan: 'Ruang Referensi – Sayap Kiri Lantai 2',
        upload_pdf: 'PDF_1.pdf',
        upload_sampul: 'buku_5.jpg',
        id_kategori: 2 // Ilmu Komputer
    },
    {
        nomor_isbn: '978-623-220-036-4',
        judul_buku: 'Agama untuk Peradaban',
        pengarang: 'Komaruddin Hidayat',
        penerbit: 'Alvabet',
        tahun_terbit: 2019,
        deskripsi: 'Mengulas peran agama sebagai fondasi peradaban dan nilai sosial-politik hari ini',
        jumlah_halaman: 366,
        jumlah_stok: 0,
        lokasi_penyimpanan: 'Digital',
        upload_pdf: 'PDF_1.pdf',
        upload_sampul: 'buku_6.jpg',
        id_kategori: 11 // Agama dan Filsafat
    },
    {
        nomor_isbn: '978-623-02-0145-5',
        judul_buku: 'Apa Itu Sastra: Jenis-Jenis Karya Sastra dan Bagaimanakah Cara Menulis dan Mengapresiasi Sastra',
        pengarang: 'Juni Ahyar',
        penerbit: 'Deepublish (Grup Budi Utama)',
        tahun_terbit: 2019,
        deskripsi: 'Buku ini menjelaskan teori sastra, teknik menulis, dan apresiasi sastra untuk umum & akademik.',
        jumlah_halaman: 260,
        jumlah_stok: 1,
        lokasi_penyimpanan: 'Ruang Referensi – Sayap Kiri Lantai 2',
        upload_pdf: 'PDF_1.pdf',
        upload_sampul: 'buku_7.jpg',
        id_kategori: 10 // Bahasa dan Sastra
    },
    {
        nomor_isbn: '979-420-531-1',
        judul_buku: 'Arsitektur Klasik Eropa',
        pengarang: 'Yulianto Sumalyo',
        penerbit: 'Gadjah Mada University Press',
        tahun_terbit: 2003,
        deskripsi: 'Pembahasan mendalam sejarah dan gaya arsitektur klasik Eropa',
        jumlah_halaman: 561,
        jumlah_stok: 3,
        lokasi_penyimpanan: 'Ruang Referensi – Sayap Kiri Lantai 2',
        upload_pdf: null,
        upload_sampul: 'buku_8.jpg',
        id_kategori: 12 // Arsitektur dan Desain
    },
    {
        nomor_isbn: '978-623-012-677-2',
        judul_buku: 'Dasar Pemrograman Julia',
        pengarang: 'Abdul Kadir',
        penerbit: 'Andi Publisher',
        tahun_terbit: 2022,
        deskripsi: 'Pengantar lengkap pemrograman Julia: struktur kontrol, larik, tipe data, meta-pemrograman, dan penanganan file. Cocok untuk pemula dan pembelajar mandiri.',
        jumlah_halaman: 464,
        jumlah_stok: 7,
        lokasi_penyimpanan: 'Ruang Sirkulasi 2 – Sayap Kanan Lantai 1',
        upload_pdf: null,
        upload_sampul: 'buku_9.jpg',
        id_kategori: 2 // Ilmu Komputer
    },
    {
        nomor_isbn: '979-7691-004',
        judul_buku: 'Filsafat Agama',
        pengarang: 'Amsal Bakhtiar',
        penerbit: 'RajaGrafindo',
        tahun_terbit: 2007,
        deskripsi: 'Membahas persoalan klasik dan kontemporer agama dari sudut filsafat, menyelami kepercayaan dan kritik atheisme/agnostik.',
        jumlah_halaman: 286,
        jumlah_stok: 4,
        lokasi_penyimpanan: 'American Corner – Sayap Kanan Lt.2',
        upload_pdf: null,
        upload_sampul: 'buku_12.jpeg',
        id_kategori: 11 // Agama dan Filsafat
    },
    {
        nomor_isbn: '978-602-723-826-7',
        judul_buku: 'Sosiologi Hukum',
        pengarang: 'Prof. Suriansyah Murhaini',
        penerbit: 'Gramedia',
        tahun_terbit: 2020,
        deskripsi: 'Kajian mendalam hubungan hukum dan masyarakat, aliran, perubahan sosial, dan postmodernisme hukum.',
        jumlah_halaman: 248,
        jumlah_stok: 5,
        lokasi_penyimpanan: 'Ruang Sirkulasi Utama – Sayap Kiri Lantai 1',
        upload_pdf: null,
        upload_sampul: 'buku-18.jpeg',
        id_kategori: 7 // Hukum
    },
    {
        nomor_isbn: '978-623-231-325-5',
        judul_buku: 'Filsafat Nilai & Aplikasinya',
        pengarang: 'Asmoro Achmadi',
        penerbit: 'RajaGrafindo',
        tahun_terbit: 2020,
        deskripsi: 'Membahas konsep nilai seperti kebajikan dan penerapannya dalam budaya dan sumber daya manusia.',
        jumlah_halaman: 170,
        jumlah_stok: 0,
        lokasi_penyimpanan: 'Digital',
        upload_pdf: 'PDF_1.pdf',
        upload_sampul: 'buku-17.jpg',
        id_kategori: 11 // Agama dan Filsafat
    },
    {
        nomor_isbn: '978-602-445-850-8',
        judul_buku: 'Informatika Kelas 3 SD/MI',
        pengarang: 'Subroto Rahardjo',
        penerbit: 'Yudhistira',
        tahun_terbit: 2020,
        deskripsi: 'Buku kurikulum informatika SD, mengenalkan komputasi dan teknologi informasi dasar kepada siswa.',
        jumlah_halaman: 106,
        jumlah_stok: 10,
        lokasi_penyimpanan: 'Rak American Corner – Sayap Kanan Lt.2M-13',
        upload_pdf: null,
        upload_sampul: 'buku_14.jpg',
        id_kategori: 5 // Pendidikan
    },
    {
        nomor_isbn: '978-623-218-976-8',
        judul_buku: 'Sosiologi Hukum',
        pengarang: 'Aris Prio Agus Santoso',
        penerbit: 'Prenada Media',
        tahun_terbit: 2022,
        deskripsi: 'Buku kontemporer membahas praktik dan teori hubungan hukum dan masyarakat.',
        jumlah_halaman: 296,
        jumlah_stok: 0,
        lokasi_penyimpanan: 'Digital',
        upload_pdf: 'PDF_1.pdf',
        upload_sampul: 'buku_13.jpeg',
        id_kategori: 7 // Hukum
    },
    {
        nomor_isbn: '978-979-769-479-1',
        judul_buku: 'Filsafat Umum: Pendekatan Tematik',
        pengarang: 'Tim Penulis',
        penerbit: 'RajaGrafindo',
        tahun_terbit: 2012,
        deskripsi: 'Kumpulan tema filsafat: agama, moral, sains, politik, budaya, dan pendidikan dengan pendekatan tematik.',
        jumlah_halaman: 426,
        jumlah_stok: 3,
        lokasi_penyimpanan: 'Rak American Corner – Sayap Kanan Lt.2M-13',
        upload_pdf: null,
        upload_sampul: 'buku_16.jpg',
        id_kategori: 11 // Agama dan Filsafat
    }
];

// Data untuk relasi buku-jenis (semua buku memiliki kedua jenis: E-Book dan Buku Fisik)
const bukuJenisData = [
    // E-Book (id_jenis: 1)
    { nomor_isbn: '978-623-500-418-1', id_jenis: 1 },
    { nomor_isbn: '978-623-218-529-6', id_jenis: 1 },
    { nomor_isbn: '978-623-220-036-4', id_jenis: 1 },
    { nomor_isbn: '978-623-02-0145-5', id_jenis: 1 },
    { nomor_isbn: '978-623-231-325-5', id_jenis: 1 },
    { nomor_isbn: '978-623-218-976-8', id_jenis: 1 },
    { nomor_isbn: '978-979-769-479-1', id_jenis: 1 },
    
    // Buku Fisik (id_jenis: 2)
    { nomor_isbn: '6020651622', id_jenis: 2 },
    { nomor_isbn: '978-623-218-529-6', id_jenis: 2 },
    { nomor_isbn: '978-623-329-861-2', id_jenis: 2 },
    { nomor_isbn: '978-623-8483-60-0', id_jenis: 2 },
    { nomor_isbn: '978-623-02-0145-5', id_jenis: 2 },
    { nomor_isbn: '979-420-531-1', id_jenis: 2 },
    { nomor_isbn: '978-623-012-677-2', id_jenis: 2 },
    { nomor_isbn: '979-7691-004', id_jenis: 2 },
    { nomor_isbn: '978-602-723-826-7', id_jenis: 2 },
    { nomor_isbn: '978-602-445-850-8', id_jenis: 2 },
    { nomor_isbn: '978-979-769-479-1', id_jenis: 2 }
];

async function seedBuku() {
    try {
        await sequelize.sync();
        
        // Hapus data yang ada (opsional)
        await BukuJenis.destroy({ where: {} });
        await Buku.destroy({ where: {} });
        
        // Insert data buku satu per satu
        for (const buku of bukuData) {
            await Buku.create(buku);
        }
        
        // Insert data relasi buku-jenis satu per satu
        for (const bukuJenis of bukuJenisData) {
            await BukuJenis.create(bukuJenis);
        }
        
        console.log('Buku berhasil di-seed!');
    } catch (error) {
        console.error('Error seeding buku:', error);
        throw error;
    }
}

module.exports = seedBuku; 