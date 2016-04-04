var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database: 'users'
});

/* GET home page. */
router.get('/', function(req, res, next) {

  connection.query('SELECT * from users', function(err, rows, fields) {
       if(rows === undefined) {
         res.send("No data Found, err: " + err)
     } else {
      res.render('index', {
      items: rows
                });
            };
        });
});


module.exports = router;
