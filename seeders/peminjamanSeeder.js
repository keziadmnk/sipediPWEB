const { Peminjaman } = require('../models/PeminjamanModel');

const peminjamanData = [
    {
        id_pengguna: '2311521001',
        nomor_isbn: '978-623-8483-60-0',
        tanggal_peminjaman: new Date('2025-01-15'),
        tanggal_wajib_pengembalian: new Date('2025-01-18'), 
        tanggal_pengembalian: new Date('2025-01-17'), 
        status_peminjaman: 'Dikembalikan',
        denda: 0.00
    },
    {
        id_pengguna: '2311521002',
        nomor_isbn: '978-623-02-0145-5',
        tanggal_peminjaman: new Date('2025-01-20'),
        tanggal_wajib_pengembalian: new Date('2025-01-23'), 
        tanggal_pengembalian: new Date('2025-01-22'), 
        status_peminjaman: 'Dikembalikan',
        denda: 0.00
    },
    {
        id_pengguna: '2311521002',
        nomor_isbn: '978-623-012-677-2',
        tanggal_peminjaman: new Date('2025-06-18'),
        tanggal_wajib_pengembalian: new Date('2025-06-21'), 
        tanggal_pengembalian: null,
        status_peminjaman: 'Dipinjam',
        denda: 0.00
    },
    {
        id_pengguna: '2311521001',
        nomor_isbn: '978-623-220-036-4',
        tanggal_peminjaman: new Date('2025-06-16'),
        tanggal_wajib_pengembalian: new Date('2025-06-19'), 
        tanggal_pengembalian: null,
        status_peminjaman: 'Dipinjam',
        denda: 0.00
    },
    
    {
        id_pengguna: '2311521003',
        nomor_isbn: '978-623-218-529-6',
        tanggal_peminjaman: new Date('2025-01-10'),
        tanggal_wajib_pengembalian: new Date('2025-01-13'), 
        tanggal_pengembalian: new Date('2025-01-16'), 
        status_peminjaman: 'Terlambat',
        denda: 15000.00 
    },
    {
        id_pengguna: '2311521003',
        nomor_isbn: '979-420-531-1',
        tanggal_peminjaman: new Date('2025-01-05'),
        tanggal_wajib_pengembalian: new Date('2025-01-08'), 
        tanggal_pengembalian: new Date('2025-01-12'), 
        status_peminjaman: 'Terlambat',
        denda: 20000.00 
    },
    {
        id_pengguna: '2311521001',
        nomor_isbn: '978-623-231-325-5',
        tanggal_peminjaman: new Date('2025-01-12'),
        tanggal_wajib_pengembalian: new Date('2025-01-15'), 
        tanggal_pengembalian: new Date('2025-01-18'), 
        status_peminjaman: 'Terlambat',
        denda: 15000.00 
    },
    {
        id_pengguna: '2311521003',
        nomor_isbn: '978-623-329-861-2',
        tanggal_peminjaman: new Date('2025-01-15'),
        tanggal_wajib_pengembalian: new Date('2025-01-18'), 
        tanggal_pengembalian: new Date('2025-01-20'), 
        status_peminjaman: 'Terlambat',
        denda: 10000.00 
    },
    {
        id_pengguna: '2311521001',
        nomor_isbn: '978-623-218-976-8',
        tanggal_peminjaman: new Date('2025-01-20'),
        tanggal_wajib_pengembalian: new Date('2025-01-23'), 
        tanggal_pengembalian: new Date('2025-01-25'), 
        status_peminjaman: 'Terlambat',
        denda: 10000.00 
    }
];

async function seedPeminjaman() {
    try {
        await Peminjaman.destroy({ where: {} });
        
        for (const peminjaman of peminjamanData) {
            await Peminjaman.create(peminjaman);
        }
        console.log('Data peminjaman berhasil di-seed!');
    } catch (error) {
        console.error('Error seeding peminjaman:', error);
        throw error;
    }
}

module.exports = seedPeminjaman; 