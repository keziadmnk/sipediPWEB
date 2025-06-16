var express = require('express');
const findAllPeminjaman = require('../controllers/petugas/PeminjamanController');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/peminjaman', findAllPeminjaman); 

// Route untuk menampilkan Data Buku
router.get('/databuku', function(req, res, next) {
  res.render('admin/databuku');  // Render file databuju.ejs
});

// Route untuk menampilkan Tambah Buku
router.get('/tambahbuku', function(req, res, next) {
  res.render('admin/tambahbuku');  // Render file databuju.ejs
});

// Route untuk menampilkan Koleksi Buku
router.get('/koleksibuku', function(req, res, next) {
  res.render('mahasiswa/koleksibuku');  // Render file databuju.ejs
});

// Route untuk menampilkan Detail Buku
router.get('/detailbuku', function(req, res, next) {
  res.render('mahasiswa/detailbuku');  // Render file databuju.ejs
});

// Route untuk menampilkan Detail Buku
router.get('/profil', function(req, res, next) {
  res.render('mahasiswa/profil');  // Render file databuju.ejs
});

module.exports = router;
