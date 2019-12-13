var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
	

// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});


//mysql configuration
//var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST || 'mysql.database-check.svc.cluster.local';
//var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST || 'mysql.gamification.svc.cluster.local';
var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST || 'custom-mysql.gamification.svc.cluster.local';

var mysqlPort = process.env.OPENSHIFT_MYSQL_DB_PORT || 3306;
//var mysqlUser = 'ccuser'; //mysql username
var mysqlUser = 'xxuser'; //mysql username
var mysqlPass = 'welcome1'; //mysql password
//var mysqlDb = 'productdb'; //mysql database name

var mysqlDb = 'sampledb';

//connection strings
var mysqlString = 'mysql://' + mysqlUser + ':' + mysqlPass + '@' + mysqlHost + ':' + mysqlPort + '/' + mysqlDb;


//connect to mysql
var mysqlClient = mysql.createConnection(mysqlString);
mysqlClient.connect(function (err) {
    if (err) console.log(err);
});

//MySQL is running!
app.get('/mysql', function (req, res) {
    mysqlClient.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
        if (err) {
            res.send('NOT OK' + JSON.stringify(err));
        } else {
            res.send('OK: ' + rows[0].solution);
        }
    });
});

//show all products, search products based on description
app.get('/api/products',(req, res) => {
let sql = "SELECT * FROM XXIBM_PRODUCT_SKU";  

if(req.query.desc != undefined)
{
	sql = "SELECT * FROM XXIBM_PRODUCT_SKU WHERE DESCRIPTION LIKE '"+ req.query.desc + "%'";
}
console.log(sql);

  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show single product
app.get('/api/products/:id',(req, res) => {
  let sql = "SELECT * FROM XXIBM_PRODUCT_SKU WHERE ITEM_NUMBER="+req.params.id;
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


// set port
app.listen(port, ip);

module.exports = app;
