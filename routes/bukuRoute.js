var express = require('express');
const router = express.Router();

const bukuController = require('../controllers/mahasiswa/BukuController');
const { authenticate } = require('../middlewares/authenticate'); // Pastikan authenticate diimpor

// Router ini dipasang dengan authenticate di app.js, tapi bisa juga ditambahkan per rute
// router.get('/:id/ulasan', authenticate, bukuController.getDaftarUlasan);

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

//router.get('/detailbuku/:nomor_isbn', bukuController.getDetailBuku); // Ini mungkin duplikat, pastikan hanya 1 rute untuk detail buku

module.exports = router;