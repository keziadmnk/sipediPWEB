var express = require('express');
const findAllBuku = require('../controllers/admin/BukuController');
var router = express.Router();


router.get('/databuku', findAllBuku);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

// Route untuk menampilkan Kategori Buku
router.get('/kategoribuku', function(req, res, next) {
  res.render('admin/kategoribuku');  // Render file databuju.ejs
});

module.exports = router;
