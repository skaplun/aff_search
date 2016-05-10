var google = require('./google_new')
var Promise = require('bluebird')
var request = require('request')

google.resultsPerPage = 10
var nextCounter = 0

function getResultsFromGoogle(query, tld){
    
    return new Promise(function(resolve, reject){
        
        google(query, 0, function (err, res){
            if (err) reject(err);
            var links = [];
            for (var i = 0; i < res.links.length; ++i) {
                links.push(res.links[i].href)
            }
            
            if (nextCounter < 4) {
                nextCounter += 1
                if (res.next) res.next()
            }
            
            resolve(links)
        }, tld)
    })
}

function searchPage(url) {
    return new Promise(function(resolve, reject){
        return request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var re = new RegExp(currentBrand, 'g');
            var count = (response.body.match(re, /g/) || []).length;
                var tempObj = {}
                tempObj[url] = count ? true : false;
                resolve(tempObj)
          }
        })

    })
}


function aff_search(query, tld, brand){
    currentBrand = brand;
    return new Promise(function(resolve, reject){
         return getResultsFromGoogle(query, tld).then(function(data){
            Promise.map(data, searchPage).then(function(results){
                 resolve(arguments)
            })

        })
    
    })
   
}


module.exports = aff_search

// aff_search('best casino', 'com.au', 'aladdin').then(function(data){ console.log(data) })