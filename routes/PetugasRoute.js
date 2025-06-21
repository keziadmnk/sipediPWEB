const express = require('express');
const { findAllPeminjaman, findDetailPeminjaman, kembalikanBuku } = require('../controllers/petugas/PeminjamanController');
const {findAllPengembalian, findDetailPengembalian} = require('../controllers/petugas/PengembalianController');
const {findAllDenda, findDetailDenda, cetakDendaPdf} = require('../controllers/petugas/DendaController');
const { findStatusStatistik } = require('../controllers/petugas/DashboardController');
const { getStokBukuFisik, printStokBukuFisik } = require('../controllers/petugas/StokController');
const { authenticate } = require('../middlewares/authenticate');
const { Pengguna } = require('../models/PenggunaModel');
const router = express.Router();

router.get('/dashboard', findStatusStatistik);
router.get('/peminjaman', findAllPeminjaman); 
router.get('/pengembalian', findAllPengembalian); 
router.get('/denda', findAllDenda); 
router.get('/denda/cetak', cetakDendaPdf);
router.get('/detailpeminjaman/:id_peminjaman', findDetailPeminjaman)
router.get('/detailpengembalian/:id_peminjaman', findDetailPengembalian)
router.get('/detaildenda/:id_peminjaman', findDetailDenda)
router.post('/peminjaman/kembalikan/:id_peminjaman', kembalikanBuku);

// router.get('/profil', function(req, res, next) {
//   res.render('petugas/profil');  
// });

router.get('/stokbuku', authenticate, getStokBukuFisik);

router.get('/stokbuku/print', authenticate, printStokBukuFisik);

router.get('/profil', authenticate, async (req, res) => {
  try {
    const idLogin = req.user.userId;

    const petugas = await Pengguna.findOne({
      where: { id_pengguna: idLogin }
    });

    res.render('petugas/profil', { petugas });
  } catch (error) {
    console.error('Gagal menampilkan profil petugas:', error);
    res.status(500).render('error', {
      message: 'Gagal memuat profil petugas',
      error
    });
  }
});

module.exports = router;
