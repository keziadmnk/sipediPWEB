const express = require('express');
const { findAllPeminjaman, findDetailPeminjaman } = require('../controllers/petugas/PeminjamanController');
const findAllPengembalian = require('../controllers/petugas/PengembalianController');
const findAllDenda = require('../controllers/petugas/DendaController');
const { findStatusStatistik } = require('../controllers/petugas/DashboardController');
const router = express.Router();

router.get('/dashboard', findStatusStatistik);
router.get('/peminjaman', findAllPeminjaman); 
router.get('/pengembalian', findAllPengembalian); 
router.get('/denda', findAllDenda); 
router.get('/detailpeminjaman/:id_peminjaman', findDetailPeminjaman)

router.get('/profil', function(req, res, next) {
  res.render('petugas/profil');  
});


router.get('/detailpeminjaman', function(req, res, next) {
  res.render('petugas/detailpeminjaman');  
});

module.exports = router;
