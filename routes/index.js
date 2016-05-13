var express = require('express');
var aff_search = require('./../aff_search')


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index'); 
    
}).post('/', function(req, res){
        var r = req.body;

        if(!r.keyword || !r.tld || !r.brand || r.keyword.length === 0 || r.tld.length === 0|| r.brand.length === 0){
          res.json('please fill out all fields')  
        }else{
            aff_search(r.keyword, r.tld, r.brand).then(function(d){
                console.log(d)
                res.json(d) 
            })
        }
        
   
});





module.exports = router;