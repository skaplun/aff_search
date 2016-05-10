var express = require('express');
var aff_search = require('./../aff_search')


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    
    res.render('index'); 
    
    
}).post('/', function(req, res){
        var r = req.body
        aff_search(r.keyword, r.tld, r.brand).then(function(d){
            console.log(d)
            res.json(d) 
        })
        
        
   
})


router.get('/response', function(req, res) {
    if(userObject.urlCache){
        if(Object.keys(userObject.urlCache).length >= 1){
            res.json(userObject.urlCache);
        }else{
            res.json('not yet');
        }
    }
}).post('/response', function(req, res) {
    console.log(2)
})
router.global = {};



module.exports = router;



 