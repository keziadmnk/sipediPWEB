var express = require('express');
const { authenticate } = require('../middlewares/authenticate'); // Middleware untuk autentikasi
const { showKatalogBuku } = require('../controllers/admin/KategoriController');
var router = express.Router();

// Route untuk dashboard mahasiswa
router.get('/dashboard', authenticate, (req, res) => {
  res.render('mahasiswa/dashboard'); 
});

router.get('/akun', authenticate, (req, res) => {
  res.render('mahasiswa/akun'); 
});

// Route untuk halaman profil mahasiswa
router.get('/profil', authenticate, function(req, res, next) {
  res.render('mahasiswa/profil'); // Pastikan ada file EJS untuk profil mahasiswa
});

router.get('/koleksibuku', authenticate, showKatalogBuku);


router.get('/formpeminjaman', authenticate, function(req, res, next) {
  res.render('mahasiswa/formpeminjaman'); // Pastikan ada file EJS untuk profil mahasiswa
});

module.exports = router;
