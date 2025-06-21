const sequelize = require('./config/db');
require('./models/relation'); 


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mahasiswaRouter = require('./routes/mahasiswaRoute');
var adminRoute = require("./routes/adminRoute")
var petugasRouter = require('./routes/PetugasRoute')
var authRouter = require('./routes/authRoute');
var bukuRouter = require('./routes/bukuRoute');

const { authenticate, authorize } = require('./middlewares/authenticate');
const session = require('express-session');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log("Database & tables have been synced.");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// Konfigurasi session
app.use(session({
  secret: 'your-secret-key', // Ganti dengan secret key yang aman
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set true jika menggunakan HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 jam
  }
}));

app.use('/', authRouter);
app.use('/admin', authorize(['admin']), adminRoute);
app.use('/petugas', authorize(['petugas', 'admin']), petugasRouter);
app.use('/mahasiswa', mahasiswaRouter);
app.use('/buku', authenticate,bukuRouter);

app.get('/dashboard', authenticate, (req, res) => {
  const role = req.user.role.toLowerCase();
  switch (role) {
    case 'admin':
      return res.redirect('/admin/dashboard');
    case 'petugas':
      return res.redirect('/petugas/dashboard');
    case 'mahasiswa':
      return res.redirect('/mahasiswa/dashboard');
    default:
      return res.render('dashboard/default', { user: req.user });
  }
});

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
