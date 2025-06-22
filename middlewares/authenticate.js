const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/auth');
  }

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      res.clearCookie('token');
      return res.redirect('/auth');
    }

    req.user = decoded;
    next();
  });
};

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/auth');
    }

    jwt.verify(token, 'secretkey', (err, decoded) => {
      if (err) {
        res.clearCookie('token');
        return res.redirect('/auth');
      }

      req.user = decoded;

      if (!allowedRoles.includes(decoded.role.toLowerCase())) {
        return res.status(403).render('error', { 
          message: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.',
          error: { status: 403 }
        });
      }

      next();
    });
  };
};

module.exports = { authenticate, authorize };