var express = require('express');
const findAllBuku = require('../controllers/admin/BukuController');
const { authenticate } = require('../middlewares/authenticate');
var router = express.Router();




router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/tambahbuku', function(req, res, next) {
  res.render('admin/tambahbuku');  
});

router.get('/koleksibuku', function(req, res, next) {
  res.render('mahasiswa/koleksibuku');  
});

router.get('/mahasiswa/dashboard', authenticate, (req, res) => {
  res.render('mahasiswa/dashboard');
});

router.get('/detailbuku', function(req, res, next) {
  res.render('mahasiswa/detailbuku'); 
});

router.get('/profil', function(req, res, next) {
  res.render('mahasiswa/profil'); 
});

router.get('/kategoribuku', function(req, res, next) {
  res.render('admin/kategoribuku');  
});

module.exports = router;
