const { Peminjaman } = require('../../models/PeminjamanModel');
const { Buku } = require('../../models/BukuModel');
const { Pengguna } = require('../../models/PenggunaModel');

// Menampilkan form peminjaman dengan data buku yang dipilih
const showFormPeminjaman = async (req, res) => {
    try {
        const { nomor_isbn } = req.query;
        
        console.log('Request user:', req.user); // Debug log
        console.log('ISBN:', nomor_isbn); // Debug log
        
        if (!nomor_isbn) {
            return res.status(400).send('ISBN buku tidak ditemukan');
        }

        // Ambil data buku berdasarkan ISBN
        const buku = await Buku.findOne({
            where: { nomor_isbn: nomor_isbn }
        });

        if (!buku) {
            return res.status(404).send('Buku tidak ditemukan');
        }

        // Cek apakah user data tersedia
        if (!req.user) {
            return res.status(401).send('User tidak terautentikasi');
        }

        // Cek berbagai kemungkinan nama field untuk id pengguna
        const userId = req.user.id_pengguna || req.user.id || req.user.userId || req.user.username;
        
        console.log('User ID:', userId); // Debug log
        
        if (!userId) {
            return res.status(400).send('ID pengguna tidak ditemukan dalam session');
        }

        // Ambil data pengguna yang sedang login
        const pengguna = await Pengguna.findOne({
            where: { id_pengguna: userId }
        });

        if (!pengguna) {
            return res.status(404).send('Data pengguna tidak ditemukan di database');
        }

        // Render form peminjaman dengan data buku dan pengguna
        res.render('mahasiswa/formpeminjaman', {
            buku: buku,
            pengguna: pengguna,
            user: req.user
        });

    } catch (error) {
        console.error('Error showing form peminjaman:', error);
        console.error('Full error:', error);
        res.status(500).send('Terjadi kesalahan sistem: ' + error.message);
    }
};

// Memproses peminjaman buku
const prosesPeminjaman = async (req, res) => {
    try {
        const { nomor_isbn, tanggal_peminjaman } = req.body;
        
        // Cek berbagai kemungkinan nama field untuk id pengguna
        const id_pengguna = req.user.id_pengguna || req.user.id || req.user.userId || req.user.username;
        
        console.log('Process peminjaman - User ID:', id_pengguna); // Debug log
        console.log('Process peminjaman - Request body:', req.body); // Debug log

        // Validasi input
        if (!nomor_isbn || !tanggal_peminjaman) {
            return res.status(400).json({
                success: false,
                message: 'Data tidak lengkap'
            });
        }

        if (!id_pengguna) {
            return res.status(401).json({
                success: false,
                message: 'User tidak terautentikasi'
            });
        }

        // Validasi tanggal peminjaman tidak boleh sebelum hari ini
        const today = new Date();
        const pinjamDate = new Date(tanggal_peminjaman);
        
        // Reset time untuk perbandingan tanggal saja
        today.setHours(0, 0, 0, 0);
        pinjamDate.setHours(0, 0, 0, 0);

        if (pinjamDate < today) {
            return res.status(400).json({
                success: false,
                message: 'Tanggal peminjaman tidak boleh sebelum hari ini'
            });
        }

        // Cek apakah buku masih tersedia
        const buku = await Buku.findOne({
            where: { nomor_isbn: nomor_isbn }
        });

        if (!buku) {
            return res.status(404).json({
                success: false,
                message: 'Buku tidak ditemukan'
            });
        }

        if (buku.jumlah_stok <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Stok buku habis'
            });
        }

        // Cek apakah mahasiswa sudah meminjam buku yang sama dan belum dikembalikan
        const existingPeminjaman = await Peminjaman.findOne({
            where: {
                id_pengguna: id_pengguna,
                nomor_isbn: nomor_isbn,
                status_peminjaman: 'Dipinjam'
            }
        });

        if (existingPeminjaman) {
            return res.status(400).json({
                success: false,
                message: 'Anda sudah meminjam buku ini dan belum mengembalikannya'
            });
        }

        // Hitung tanggal wajib pengembalian (3 hari setelah tanggal peminjaman)
        const tanggalWajibPengembalian = new Date(pinjamDate);
        tanggalWajibPengembalian.setDate(tanggalWajibPengembalian.getDate() + 3);

        // Buat record peminjaman baru
        const peminjaman = await Peminjaman.create({
            id_pengguna: id_pengguna,
            nomor_isbn: nomor_isbn,
            tanggal_peminjaman: pinjamDate,
            tanggal_wajib_pengembalian: tanggalWajibPengembalian,
            status_peminjaman: 'Dipinjam',
            denda: null
        });

        // Kurangi stok buku
        await Buku.update(
            { jumlah_stok: buku.jumlah_stok - 1 },
            { where: { nomor_isbn: nomor_isbn } }
        );

        res.json({
            success: true,
            message: 'Peminjaman berhasil diproses',
            data: {
                id_peminjaman: peminjaman.id_peminjaman,
                tanggal_wajib_pengembalian: tanggalWajibPengembalian.toISOString().split('T')[0]
            }
        });

    } catch (error) {
        console.error('Error processing peminjaman:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan sistem: ' + error.message
        });
    }
};

module.exports = {
    showFormPeminjaman,
    prosesPeminjaman
};