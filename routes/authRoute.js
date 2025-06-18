const express = require('express');
const { login, logout } = require('../controllers/loginController');
const router = express.Router();

// Halaman login
router.get('/', function(req, res, next) {
  // Cek apakah user sudah login
  if (req.cookies.token) {
    return res.redirect('/dashboard');
  }
  res.render('login/formlogin', { error: null });  
});

router.get('/auth', function(req, res, next) {
  res.render('login/formlogin', { error: null });  
});

// Proses login
router.post('/login', login);

// Logout
router.get('/logout', logout);

module.exports = router;