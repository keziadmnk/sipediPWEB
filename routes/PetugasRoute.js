const express = require('express');
const { findAllPeminjaman, findDetailPeminjaman } = require('../controllers/petugas/PeminjamanController');
const findAllPengembalian = require('../controllers/petugas/PengembalianController');
const findAllDenda = require('../controllers/petugas/DendaController');
const router = express.Router();

router.get('/peminjaman', findAllPeminjaman); 
router.get('/pengembalian', findAllPengembalian); 
router.get('/denda', findAllDenda); 
router.get('/detailpeminjaman/:id_peminjaman', findDetailPeminjaman)

router.get('/detailpeminjaman', function(req, res, next) {
  res.render('petugas/detailpeminjaman');  
});

module.exports = router;
