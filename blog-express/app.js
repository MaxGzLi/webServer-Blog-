var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const blogRounter = require('./routes/blog')
const userRounter = require('./routes/user')
var app = express();

// //view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');




const ENV = process.env.NODE_ENV
console.log(ENV)
if (ENV !== 'production'){
  app.use(logger('dev'))
}else{
  const logFileName = path.join(__dirname,'logs','access.log')
  const writeStream = fs.createWriteStream(logFileName,{
    flags:'a'
  })
  app.use(logger('combined',{
    stream: writeStream
  }))
}
// app.use(logger('dev',{
//   stream: process.stdout
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret:'WJiol_123112',
  cookie:{
    path:'/',
    httpOnly:true,
    maxAge: 24 * 60 *60 *1000
},
store: sessionStore
}))

app.use('/api/blog', blogRounter)
app.use('/api/user',userRounter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
