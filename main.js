
var aff_search = require('./aff_search')
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


app.set('views', path.join(__dirname, 'views'), { maxAge: oneDay });
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));


app.use(compression());


// Create our Express router
var router = express.Router();

// Initial dummy route for testing
router.get('/', function(req, res) {
    res.render('home', { scripts: ['public/client.js']});
});

router.get('/response', function(req, res) {
    if(global.data){
        res.send(global.data)
        
    }else{
        res.send('not yet')
        
    }
});

global = {};

router.post('/', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        data = util.inspect({
            fields: fields
        })
        console.log(data)
        aff_search(data.keyword, data.tld, data.brand).then(function(d){
            global.data = d
        
        })
        res.render('home');
       
    });
});

// Register all our routes
app.use(router);

// Start the server
app.listen(3000);
// process.env.PORT, process.env.IP
