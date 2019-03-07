var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users'); // Depreciated

// 유저 라우터 관리
var adminRouter = require('./routes/admin');
var studentRouter = require('./routes/student');
var mentorRouter = require('./routes/mentor');

// 세션 처리
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 세션 등록
app.use(session({
	secret: 'dnjfdydlfwhgdkchlrhfhwhgdk',
	resave: false,
	saveUninitialized: true,
	store: new MySQLStore({
		host : 'localhost',
		user : 'root',
		port : 3306,
		password : '359214hsj*ABC',
		database : 'kimkiwon_v9'
	})
}));

app.use('/', indexRouter);
//app.use('/users', usersRouter); // Depreciated
app.use('/admin', adminRouter);
app.use('/student', studentRouter);
app.use('/mentor', mentorRouter);

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
