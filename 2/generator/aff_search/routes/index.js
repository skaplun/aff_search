var express = require('express');
var aff_search = require('./../aff_search')


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});

router.get('/response', function(req, res) {
    if(router.global){
        res.send(global.data)
        
    }else{
        res.send('not yet')
        
    }
});

router.global = {};

router.post('/', function(req, res) {
    var r = req.body
    
    aff_search(r.keyword, r.tld, r.brand).then(function(d){
        console.log(d)
        router.global = d
        
    })
    
});

module.exports = router;
