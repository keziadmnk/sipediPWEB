var express = require('express');
const { authenticate } = require('../middlewares/authenticate'); // Middleware untuk autentikasi
const { showKatalogBuku} = require('../controllers/admin/KategoriController');
const { showFormPeminjaman, prosesPeminjaman, showBuktiPeminjaman, downloadBuktiPeminjaman } = require('../controllers/mahasiswa/PeminjamanController');
const { showRiwayatPeminjaman, getDetailPeminjaman } = require('../controllers/mahasiswa/RiwayatController');
const { detailBuku, cariBuku } = require('../controllers/mahasiswa/tampilBukuController');
const { findAkun, updateFoto } = require('../controllers/mahasiswa/AkunController');
const { uploadSingle } = require('../middlewares/upload');
const { showDashboardMahasiswa } = require('../controllers/mahasiswa/DashboardController');
var router = express.Router();

// router.get('/dashboard', authenticate, (req, res) => {
//   res.render('mahasiswa/dashboard'); 
// });

router.get('/dashboard', authenticate, showDashboardMahasiswa);

router.get('/akun', authenticate, findAkun);
router.post('/akun/upload', authenticate, uploadSingle('foto'), updateFoto);


router.get('/profil', authenticate, function(req, res, next) {
  res.render('mahasiswa/profil'); 
});

// router.get('/riwayatpeminjaman', function(req, res, next) {
//   res.render('mahasiswa/riwayatpeminjaman'); 
// });

// Route untuk bukti peminjaman
router.get('/buktipeminjaman', authenticate, showBuktiPeminjaman);

// Route untuk download bukti peminjaman
router.get('/download-bukti-peminjaman/:id_peminjaman', authenticate, downloadBuktiPeminjaman);

router.get('/koleksibuku', authenticate, cariBuku);


router.get('/formpeminjaman', authenticate, showFormPeminjaman);

router.post('/formpeminjaman', authenticate, prosesPeminjaman);

router.get('/detailbuku', authenticate, function(req, res, next) {
  res.render('mahasiswa/detailbuku'); // Pastikan ada file EJS untuk profil mahasiswa
});

router.get('/detailbuku/:nomor_isbn', detailBuku);


router.get('/riwayatpeminjaman', authenticate, showRiwayatPeminjaman);
router.get('/detail-peminjaman/:id_peminjaman', authenticate, getDetailPeminjaman);
module.exports = router;
