var express = require('express');
const { authenticate } = require('../middlewares/authenticate'); // Middleware untuk autentikasi
var router = express.Router();

// Route untuk dashboard mahasiswa
router.get('/dashboard', authenticate, (req, res) => {
  res.render('mahasiswa/dashboard'); 
});

// Route untuk halaman profil mahasiswa
router.get('/profil', authenticate, function(req, res, next) {
  res.render('mahasiswa/profil'); // Pastikan ada file EJS untuk profil mahasiswa
});

module.exports = router;
