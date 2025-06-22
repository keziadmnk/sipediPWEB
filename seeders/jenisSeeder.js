const { Jenis } = require('../models/JenisModel');

const jenisData = [
    { nama_jenis: 'E-Book' },
    { nama_jenis: 'Buku Fisik' }
];

async function seedJenis() {
    try {
        // Hapus data yang ada (opsional)
        await Jenis.destroy({ where: {} });
        
        // Insert data jenis satu per satu
        for (const jenis of jenisData) {
            await Jenis.create(jenis);
        }
        
        console.log('Jenis buku berhasil di-seed!');
    } catch (error) {
        console.error('Error seeding jenis:', error);
        throw error;
    }
}

module.exports = seedJenis; 