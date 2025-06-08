var express = require('express');
const findAllPeminjaman = require('../controllers/petugas/PeminjamanController');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/peminjaman', findAllPeminjaman); 


module.exports = router;
