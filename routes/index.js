var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database: 'myapp'
});

/* GET home page. */
router.get('/', function(req, res, next) {

  connection.query('SELECT * from users WHERE approve=0', function(err, rows, fields) {
if(rows.length != 0) {
  res.render('index', {
    items: rows
  });
  } else {
  data["Data"] = "No data Found..";
  res.send(data)
};
});
});


module.exports = router;
