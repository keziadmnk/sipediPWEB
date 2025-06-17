const sequelize = require('./config/db');
require('./models/relation'); 


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var kategoriRouter = require("./routes/kategoriRoute")
var petugasRouter = require('./routes/PetugasRoute')
var authRouter = require('./routes/authRoute');
const { authenticate, authorize } = require('./middlewares/authenticate');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// sequelize.sync({ alter: true }) 
//   .then(() => {
//     console.log("Database & tables have been synced.");
//   })
//   .catch((error) => {
//     console.error("Error syncing database:", error);
//   });

app.use('/', authRouter);
app.use('/admin', authorize(['admin']), kategoriRouter);
app.use('/petugas', authorize(['petugas', 'admin']), petugasRouter);


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
