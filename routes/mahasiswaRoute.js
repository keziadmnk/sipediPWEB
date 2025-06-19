var express = require('express');
const { authenticate } = require('../middlewares/authenticate'); // Middleware untuk autentikasi
const { showKatalogBuku} = require('../controllers/admin/KategoriController');
const { detailBuku } = require('../controllers/mahasiswa/tampilBukuController');
const { showFormPeminjaman, prosesPeminjaman } = require('../controllers/mahasiswa/PeminjamanController');
const { showRiwayatPeminjaman, getDetailPeminjaman } = require('../controllers/mahasiswa/RiwayatController');
var router = express.Router();

router.get('/dashboard', authenticate, (req, res) => {
  res.render('mahasiswa/dashboard'); 
});

router.get('/akun', authenticate, (req, res) => {
  res.render('mahasiswa/akun'); 
});


router.get('/profil', authenticate, function(req, res, next) {
  res.render('mahasiswa/profil'); 
});

router.get('/riwayatpeminjaman', function(req, res, next) {
  res.render('mahasiswa/riwayatpeminjaman'); 
});

router.get('/koleksibuku', authenticate, showKatalogBuku);


router.get('/formpeminjaman', authenticate, showFormPeminjaman);

router.post('/formpeminjaman', authenticate, prosesPeminjaman);

router.get('/detailbuku', authenticate, function(req, res, next) {
  res.render('mahasiswa/detailbuku'); // Pastikan ada file EJS untuk profil mahasiswa
});

router.get('/detailbuku/:nomor_isbn', detailBuku);

// router.get('/riwayat-peminjaman', showRiwayatPeminjaman);
// router.get('/detail-peminjaman/:id_peminjaman', getDetailPeminjaman);
module.exports = router;
