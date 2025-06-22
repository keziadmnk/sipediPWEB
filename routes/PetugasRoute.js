var express = require('express');
const { findAllPeminjaman, findDetailPeminjaman, kembalikanBuku } = require('../controllers/petugas/PeminjamanController');
const { findAllPengembalian, findDetailPengembalian } = require('../controllers/petugas/PengembalianController');
const { findAllDenda, findDetailDenda, cetakDendaPdf } = require('../controllers/petugas/DendaController');
const { findStatusStatistik } = require('../controllers/petugas/DashboardController');
const { getStokBukuFisik, printStokBukuFisik } = require('../controllers/petugas/StokController');
const { authenticate } = require('../middlewares/authenticate');
const { showProfilPetugas, showEditBiodataPetugas, updateFotoPetugas, updateBiodataPetugas } = require('../controllers/petugas/ProfilController');
const { uploadSingle } = require('../middlewares/upload');

var router = express.Router();

router.get('/dashboard', authenticate, findStatusStatistik);
router.get('/peminjaman', authenticate, findAllPeminjaman); 
router.get('/pengembalian', authenticate, findAllPengembalian); 
router.get('/denda', authenticate, findAllDenda); 
router.get('/denda/cetak', authenticate, cetakDendaPdf);
router.get('/detailpeminjaman/:id_peminjaman', authenticate, findDetailPeminjaman);
router.get('/detailpengembalian/:id_peminjaman', authenticate, findDetailPengembalian);
router.get('/detaildenda/:id_peminjaman', authenticate, findDetailDenda);
router.post('/peminjaman/kembalikan/:id_peminjaman', authenticate, kembalikanBuku);


router.get('/stokbuku', authenticate, getStokBukuFisik);

router.get('/stokbuku/print', authenticate, printStokBukuFisik);

router.get('/profil', authenticate, showProfilPetugas);
router.get('/editbiodata', authenticate, showEditBiodataPetugas);
router.post('/profil/upload', authenticate, uploadSingle('foto'), updateFotoPetugas);
router.post('/profil/update-biodata', authenticate, updateBiodataPetugas);

module.exports = router;
