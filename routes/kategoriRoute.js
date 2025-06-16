const express = require('express');
const { tambahKategori } = require('../controllers/admin/KategoriController');
const router = express.Router();

router.get('/tambahkategori', function(req, res, next) {
  res.render('admin/tambahkategori');
});

router.post('/tambahkategori', tambahKategori);

module.exports = router;