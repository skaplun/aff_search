
var google = require('./aff_Search')
// Load required packages
var express = require('express');
var compression = require('compression');
var formidable = require("formidable");
var util = require('util');
var path = require('path');

// Create our Express application
var app = express();

// Add static middleware
var oneDay = 86400000;
app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneDay }));
app.use(compression());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
router.get('/', function(req, res) {
    res.render('home');
});

router.post('/', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        data = util.inspect({
            fields: fields
        })
        google('best casinos online', 'com.au', 'aladdins').then(function(data){
            res.locals.data = data
            res.render('home2');
        
        })
       
    });
});

// Register all our routes
app.use(router);

// Start the server
app.listen(3000);





;