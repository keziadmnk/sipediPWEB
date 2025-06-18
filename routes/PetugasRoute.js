const express = require('express');
const { findAllPeminjaman, findDetailPeminjaman } = require('../controllers/petugas/PeminjamanController');
const {findAllPengembalian, findDetailPengembalian} = require('../controllers/petugas/PengembalianController');
const {findAllDenda, findDetailDenda} = require('../controllers/petugas/DendaController');
const { findStatusStatistik } = require('../controllers/petugas/DashboardController');
const router = express.Router();

router.get('/dashboard', findStatusStatistik);
router.get('/peminjaman', findAllPeminjaman); 
router.get('/pengembalian', findAllPengembalian); 
router.get('/denda', findAllDenda); 
router.get('/detailpeminjaman/:id_peminjaman', findDetailPeminjaman)
router.get('/detailpengembalian/:id_peminjaman', findDetailPengembalian)
router.get('/detaildenda/:id_peminjaman', findDetailDenda)

router.get('/profil', function(req, res, next) {
  res.render('petugas/profil');  
});


module.exports = router;
