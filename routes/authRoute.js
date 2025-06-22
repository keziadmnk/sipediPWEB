const express = require('express');
const { login, logout } = require('../controllers/loginController');
const router = express.Router();

router.get('/', function(req, res, next) {

  if (req.cookies.token) {
    return res.redirect('/dashboard');
  }
  res.render('login/formlogin', { error: null });  
});

router.get('/auth', function(req, res, next) {
  res.render('login/formlogin', { error: null });  
});

router.post('/login', login);

router.get('/logout', logout);

module.exports = router;