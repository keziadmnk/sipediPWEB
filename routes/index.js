var express = require('express');
const findAllPeminjaman = require('../controllers/petugas/PeminjamanController');
const findAllPengembalian = require('../controllers/petugas/PengembalianController');
const findAllDenda = require('../controllers/petugas/DendaController');
const findAllBuku = require('../controllers/admin/BukuController');
var router = express.Router();




router.get('/databuku', findAllBuku);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/peminjaman', findAllPeminjaman); 
router.get('/pengembalian', findAllPengembalian); 
router.get('/denda', findAllDenda); 

router.get('/detailpeminjaman', function(req, res, next) {
  res.render('petugas/detailpeminjaman');  
});



// Route untuk menampilkan Data Buku


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
