var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('lodash');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database: 'users'
});

//  set DEBUG=myapp:* & npm start
var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/users', function(req,res){
  connection.query('SELECT * from users', function(err, rows, fields) {
     if(rows === undefined) {
           res.send("No data Found, err: " + err)
     } else {
      res.render('users', {
      items: rows
                });
            };
        });
      });

app.post('/users',function(req,res){
      var body = req.body;
      var id = 0;
      var approve = false;
      var name = body.name;
      var surname = body.surname;
      var birthday = body.birthday;
     if(!!name && !!surname && !!birthday){
        connection.query("INSERT INTO users VALUES(?,?,?,?,?)",[id,name,surname,birthday,approve],function(err){
            if(err){
                res.json(err);
            } else {
             res.json("Users Added Successfully");
           }
          });
     }else{
       res.json("Please provide all required data (i.e : Name, surname, birthday)");
     };
});

app.delete('/users',function(req,res){
    var id = req.body.id;

    if(id){
        connection.query("DELETE FROM users WHERE id=?",[id],function(err, rows, fields){
            if(err){
                res.json(err);
            }else{
              res.json("User deleted Successfully");
            }
        });
    }else{
        res.json("Please provide user ID");
    }
});

app.put('/users',function(req,res){
    var id = req.body.id;
    if(id){
        connection.query("UPDATE users SET approve=1 WHERE id=?",[id],function(err, rows, fields){
            if(err){
                res.json(err);
            }else{
                  res.json("User approved");
            }
        });
    }else{
      res.json("Please provide user ID");
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
