const express = require('express');
var router = express.Router();
const { tambahKategori, findAllKategori, showTambahBuku } = require('../controllers/admin/KategoriController');
const { authenticate } = require('../middlewares/authenticate');
const findAllBuku = require('../controllers/admin/BukuController');


router.get('/dashboard', authenticate, (req, res) => {
  res.render('admin/dashboard'); 
});

router.get('/tambahkategori', function(req, res, next) {
  res.render('admin/tambahkategori');
});

router.get('/detailbuku', function(req, res, next) {
  res.render('admin/detailbuku');
});


router.post('/tambahkategori', tambahKategori);

router.get('/kategori', findAllKategori);

router.get('/databuku', findAllBuku);

router.get('/tambahbuku', showTambahBuku);

module.exports = router;


