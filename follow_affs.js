//{'followingAffs.sites': {$elemMatch: {name: reqBody}}}

var User            = require('./app/models/user');
var urlParser = require('url');


function follow(sites_array, user, res){
    
    sites_array.forEach(function(siteObj){
        
        var k = Object.keys(siteObj)[0];
        var newK = urlParser.parse(k).hostname
        newK = newK.replace(/\./g, '[dot]');
        var v = siteObj[k];
        delete siteObj[k];
        
        siteObj[newK] = v
        
        User.findOne(user, function (err, u) {
            
            if(u['followingAffs']['sites'].length === 0) {
                
                u['followingAffs']['sites'].push(siteObj);
        
                    u['followingAffs']['sites'].save(function (err) {
                      if (!err){
                          console.log(u['followingAffs']['sites'])
                          res.json('Success!');
                      } 
                });
                
            }else{
                
                User.findOneAndUpdate(user, { $addToSet : { location : {$each : k} } }, { upsert : true }, function (err, u) {
                    if(!err){
                        console.log(u['followingAffs']['sites'])
                        res.json('success');
                    }else{
                        console.log(err)
                    }
                })
             
            } 
        })
             

    
    })
   
}

function follow_affs(req, res) {

    var sites_array = JSON.parse(Object.keys(req.body)[0]);
    var f = follow(sites_array, req.user, res);
    
}


module.exports = follow_affs
