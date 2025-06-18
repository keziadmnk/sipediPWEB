var express = require('express');
const { authenticate } = require('../middlewares/authenticate'); // Middleware untuk autentikasi
const { showKatalogBuku } = require('../controllers/admin/KategoriController');
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

router.get('/koleksibuku', authenticate, showKatalogBuku);


router.get('/formpeminjaman', authenticate, function(req, res, next) {
  res.render('mahasiswa/formpeminjaman'); 
});

module.exports = router;
