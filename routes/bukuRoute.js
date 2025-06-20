var express = require('express');
const router = express.Router();

const bukuController = require('../controllers/mahasiswa/BukuController');
const { authenticate } = require('../middlewares/authenticate'); // Pastikan authenticate diimpor

// Ini adalah rute yang akan dituju oleh tombol "Kembali" dari halaman ulasan
router.get('/:nomor_isbn', bukuController.getDetailBuku);

router.get('/:id/ulasan', bukuController.getDaftarUlasan); // Sudah dilindungi di app.js

// Route untuk form tulis ulasan. Akan redirect ke edit jika sudah ada ulasan.
router.get('/:id/ulasan/tulis', bukuController.getFormUlasan); // Sudah dilindungi di app.js

// Route untuk mengirim ulasan baru (atau mengupdate jika sudah ada via createUlasan)
router.post('/:id/ulasan', bukuController.createUlasan); // Sudah dilindungi di app.js

// Rute BARU untuk menampilkan form edit ulasan
router.get('/:nomor_isbn/ulasan/:id_ulasan/edit', bukuController.getEditUlasanForm); // Sudah dilindungi di app.js

// Rute BARU untuk memproses update ulasan
router.post('/:nomor_isbn/ulasan/:id_ulasan/edit', bukuController.updateUlasan); // Sudah dilindungi di app.js

// Rute BARU untuk menghapus ulasan (menggunakan POST untuk kemudahan form HTML)
router.post('/:nomor_isbn/ulasan/:id_ulasan/delete', bukuController.deleteUlasan);

module.exports = router;