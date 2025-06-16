// routes/bukuRoute.js

const express = require('express');
const router = express.Router();

// Impor controller MAHASISWA, bukan admin
const bukuController = require('../controllers/mahasiswa/BukuController');

// Definisikan rute-rute buku untuk mahasiswa di sini
// Catatan: Path di sini relatif terhadap '/buku' yang akan kita set di app.js

// Route untuk menampilkan detail buku: GET /buku/:id
// router.get('/:id', bukuController.getDetailBuku); // Anda bisa aktifkan ini nanti

// Route untuk ulasan: GET /buku/:id/ulasan
router.get('/:id/ulasan', bukuController.getDaftarUlasan);

// Route untuk form tulis ulasan: GET /buku/:id/ulasan/tulis
router.get('/:id/ulasan/tulis', bukuController.getFormUlasan);

// Route untuk mengirim ulasan: POST /buku/:id/ulasan
router.post('/:id/ulasan', bukuController.createUlasan);

module.exports = router;