const { Kategori } = require('../models/KategoriModel');

const kategoriData = [
    { nama_kategori: 'Karya Ilmiah' },
    { nama_kategori: 'Ilmu Komputer' },
    { nama_kategori: 'Ekonomi dan Bisnis' },
    { nama_kategori: 'Teknik' },
    { nama_kategori: 'Pendidikan' },
    { nama_kategori: 'Sains dan Matematika' },
    { nama_kategori: 'Hukum' },
    { nama_kategori: 'Kesehatan dan Kedokteran' },
    { nama_kategori: 'Ilmu Sosial dan Politik' },
    { nama_kategori: 'Bahasa dan Sastra' },
    { nama_kategori: 'Agama dan Filsafat' },
    { nama_kategori: 'Arsitektur dan Desain' },
    { nama_kategori: 'Pertanian dan Peternakan' },
    { nama_kategori: 'Referensi Umum' },
    { nama_kategori: 'Majalah dan Jurnal' }
];

async function seedKategori() {
    try {
        await Kategori.destroy({ where: {} });
        
        for (const kategori of kategoriData) {
            await Kategori.create(kategori);
        }
        
        console.log('Kategori berhasil di-seed!');
    } catch (error) {
        console.error('Error seeding kategori:', error);
        throw error;
    }
}

module.exports = seedKategori; 