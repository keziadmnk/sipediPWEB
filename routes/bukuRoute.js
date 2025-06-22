var express = require('express');
const router = express.Router();

const bukuController = require('../controllers/mahasiswa/BukuController');
const { authenticate } = require('../middlewares/authenticate'); 

router.get('/:nomor_isbn', bukuController.getDetailBuku);

router.get('/:id/ulasan', bukuController.getDaftarUlasan); 

router.get('/:id/ulasan/tulis', bukuController.getFormUlasan); 

router.post('/:id/ulasan', bukuController.createUlasan); 

router.get('/:nomor_isbn/ulasan/:id_ulasan/edit', bukuController.getEditUlasanForm); 

router.post('/:nomor_isbn/ulasan/:id_ulasan/edit', bukuController.updateUlasan); 

router.post('/:nomor_isbn/ulasan/:id_ulasan/delete', bukuController.deleteUlasan);

module.exports = router;