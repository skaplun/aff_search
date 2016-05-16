//{'followingAffs.sites': {$elemMatch: {name: reqBody}}}

var User            = require('./app/models/user');
var urlParser = require('url');
var Promise = require('bluebird');

function follow(sites_array, user){
    
    return new Promise(function(resolve, reject){
        
        sites_array.forEach(function(siteObj){

            var k = Object.keys(siteObj)[0];
            
            var newK = urlParser.parse(k).hostname;
            
            newK = newK.replace(/\./g, '[dot]');
            
            var v = siteObj[k];
            
            delete siteObj[k];

            siteObj[newK] = v

            User.findOne(user, function (err, u) {

                if(u['followingAffs']['sites'].length === 0) {

                    u['followingAffs']['sites'].push(siteObj);

                        u.save(function (err) {
                            
                          if (!err){
                              
                              resolve('Success!');
                              
                          }else{
                            console.log(err)  
                            resolve("couldn't update mongo");

                          } 
                    });

                }else{

                    User.findOneAndUpdate(user, { $addToSet : { location : {$each : k} } }, { upsert : true }, function (err, u) {
                        
                        if(!err){
                            
                            resolve('success');
                            
                        }else{
                            
                            console.log(err)
                            
                            resolve("couldn't update mongo");
                            
                        }
                    })

                } 
            })

        })

    })
   
}

function follow_affs(req, res) {

    var sites_array = JSON.parse(Object.keys(req.body)[0]);
    var f = follow(sites_array, req.user, res).then(function(data) {
        res.json(data)
    })
    
}


module.exports = follow_affs
