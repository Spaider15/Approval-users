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
  database: 'myapp'
});

//  set DEBUG=myapp:* & npm start
var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/users', function(req,res){
  var data = {
    "Data":""
  };

  connection.query('SELECT * from users', function(err, rows, fields) {
     if(rows.length != 0) {
       data["Data"] = rows;
       res.render('users', {
       items: rows
    });
    } else {
      data["Data"] = "No data Found..";
      res.send(data)
   };
   });
   });

app.post('/users',function(req,res){
    req.body.forEach((body,n)=>{
      var id = 0;
      var approve = false;
      var name = body.name;
      var surname = body.surname;
      var birthday = body.birthday;
      console.log(body);
      console.log(name,surname,birthday);
      var data = {
          "error":1,
          "Users":""
        };
     if(!!name && !!surname && !!birthday){
        connection.query("INSERT INTO users VALUES(?,?,?,?,?)",[id,name,surname,birthday,approve],function(err){
            if(!!err){
                data["Users"] = err;
            }
           if(n == req.body.length-1) {
             data["error"] = 0;
             data["Users"] = "Users Added Successfully";
             res.json(data);
           }
          });
     }else{
        data["Users"] = "Please provide all required data (i.e : Name, surname, birthday)";
       res.json(data);
     };
   });
});

app.delete('/users',function(req,res){
    var id = req.body.id;
    var data = {
        "error":1,
        "Users":""
    };
    if(!!id){
        connection.query("DELETE FROM users WHERE id=?",[id],function(err, rows, fields){
            if(!!err){
                data["Users"] = err;
            }else{
                data["error"] = 0;
                data["Users"] = "User deleted Successfully";
            }
            res.json(data);
        });
    }else{
        data["Users"] = "Please provide user ID";
        res.json(data);
    }
});

app.put('/users',function(req,res){
    var id = req.body.id;
    var data = {
        "error":1,
        "Users":""
    };
    if(!!id){
        connection.query("UPDATE users SET approve=1 WHERE id=?",[id],function(err, rows, fields){
            if(!!err){
                data["Users"] = err;
            }else{
                data["error"] = 0;
                data["Users"] = "User approved";
            }
            res.json(data);
        });
    }else{
        data["Users"] = "Please provide user ID";
        res.json(data);
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
