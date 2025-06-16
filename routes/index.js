var express = require('express');
const findAllPeminjaman = require('../controllers/petugas/PeminjamanController');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/peminjaman', findAllPeminjaman); 


module.exports = router;
