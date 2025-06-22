// Load relations first
require('../models/relation');

const seedKategori = require('./kategoriSeeder');
const seedJenis = require('./jenisSeeder');
const seedRole = require('./roleSeeder');
const seedPengguna = require('./penggunaSeeder');
const seedBuku = require('./bukuSeeder');
const seedPeminjaman = require('./peminjamanSeeder');
const seedUlasan = require('./ulasanSeeder');
const sequelize = require('../config/db');

async function runAllSeeders() {
    console.log('Memulai proses seeding database...\n');
    
    try {
        // Sync database terlebih dahulu
        console.log('Sinkronisasi database...');
        await sequelize.sync({ force: false });
        console.log('Database berhasil di-sinkronisasi\n');
        
        // Jalankan seeders secara berurutan
        console.log('1️Seeding kategori...');
        await seedKategori();
        
        console.log('\n2️Seeding jenis buku...');
        await seedJenis();
        
        console.log('\n3️Seeding role...');
        await seedRole();
        
        console.log('\n4️Seeding pengguna...');
        await seedPengguna();
        
        console.log('\n5️Seeding buku...');
        await seedBuku();
        
        console.log('\n6️Seeding peminjaman...');
        await seedPeminjaman();
        
        console.log('\n7Seeding ulasan...');
        await seedUlasan();
        
        console.log('\nSemua data berhasil di-seed!');
        console.log('Database SIPEDI siap digunakan!');
        
    } catch (error) {
        console.error('\nError saat menjalankan seeders:', error);
        console.error('Stack trace:', error.stack);
    } finally {
        // Tutup koneksi database
        await sequelize.close();
    }
}

// Jalankan jika file ini dijalankan langsung
if (require.main === module) {
    runAllSeeders();
}

module.exports = runAllSeeders; 