//以下五個模組都用require去輸入進來了
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');//require匯入
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//表示:express 靜態:static
//只要是靜態檔但都放在此路徑下(靜態檔案:html.js....等等都是
//__dirname(取得跟目錄), 'public'(資料夾)用path和join組合成一個完整路徑
app.use(express.static(path.join(__dirname, 'public')));

//htpp:localhost:3000/
app.use('/', indexRouter);//比對路徑
//htpp:localhost:3000/users
app.use('/users', usersRouter);//比對位置,執行物件

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
