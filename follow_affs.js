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

function getFollowedAffs(req, res){
    
    return new Promise(function(resolve, reject){
        
        User.findOne(req.user, function (err, user) {
            
            if(!err){
                
                var resultArray = user['followingAffs']['sites']
                var r = resultArray.map(function(resultObj){
                    var k = Object.keys(resultObj)[0]
                    var v = resultObj[k]
                    var newK = k.replace(/\[dot]/g, '.');
                    resultObj[newK] = v
                    delete(resultObj[k])
                    return resultObj
                    
                })
                resolve(r)
            }else{
                resolve('could not get affiliates')
            }
        
        })
        
    })
    
}


function follow(req, res) {

    var sites_array = JSON.parse(Object.keys(req.body)[0]);
    var f = follow(sites_array, req.user, res).then(function(data) {
        res.json(data)
    })
    
}


module.exports = {
    follow : follow,
    getFollowed :  getFollowedAffs
}
