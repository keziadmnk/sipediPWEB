const { Ulasan } = require('../models/UlasanModel');

const ulasanData = [
    {
        nomor_isbn: '978-623-8483-60-0',
        id_pengguna: '2311521001',
        isi_ulasan: 'Buku yang sangat informatif untuk pembelajaran jaringan komputer. Penjelasannya mudah dipahami dan contoh-contohnya relevan.',
        rating: 5
    },
    {
        nomor_isbn: '978-623-012-677-2',
        id_pengguna: '2311521002',
        isi_ulasan: 'Pengantar yang bagus untuk pemrograman Julia. Cocok untuk pemula yang ingin belajar bahasa pemrograman baru.',
        rating: 4
    },
    {
        nomor_isbn: '978-623-218-529-6',
        id_pengguna: '2311521003',
        isi_ulasan: 'Pembahasan tentang keadilan biologis sangat menarik dan memberikan perspektif baru dalam hukum.',
        rating: 4
    },
    {
        nomor_isbn: '978-623-220-036-4',
        id_pengguna: '2311521001',
        isi_ulasan: 'Buku yang mendalam tentang peran agama dalam peradaban. Penulis memberikan analisis yang komprehensif.',
        rating: 5
    },
    {
        nomor_isbn: '978-623-02-0145-5',
        id_pengguna: '2311521002',
        isi_ulasan: 'Panduan yang baik untuk memahami sastra. Penjelasan tentang jenis-jenis karya sastra sangat membantu.',
        rating: 4
    },
    {
        nomor_isbn: '978-623-8483-60-0',
        id_pengguna: '2311521003',
        isi_ulasan: 'Materi jaringan komputer disajikan dengan baik. Praktikum yang disertakan sangat membantu pemahaman.',
        rating: 4
    },
    {
        nomor_isbn: '978-623-329-861-2',
        id_pengguna: '2311521001',
        isi_ulasan: 'Buku yang penting untuk memahami advokasi dalam pelayanan kesehatan. Sangat relevan untuk mahasiswa kesehatan.',
        rating: 5
    },
    {
        nomor_isbn: '979-420-531-1',
        id_pengguna: '2311521002',
        isi_ulasan: 'Referensi yang sangat baik untuk mempelajari arsitektur klasik Eropa. Gambar dan ilustrasinya sangat membantu.',
        rating: 5
    }
];

async function seedUlasan() {
    try {
        await Ulasan.destroy({ where: {} });
        
        for (const ulasan of ulasanData) {
            await Ulasan.create(ulasan);
        }
        
        console.log('Ulasan berhasil di-seed!');
    } catch (error) {
        console.error('Error seeding ulasan:', error);
        throw error;
    }
}

module.exports = seedUlasan; 