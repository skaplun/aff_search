var google = require('./google_new')
var Promise = require('bluebird')
var request = require('request')
var cheerio = require('cheerio')
var uniq = require('lodash/uniq');
var urlParser = require('url');

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
                var tempObj = {}
                tempObj[url] = getAllLinks(response.body, url) 
                resolve(tempObj)
          }
        })

    })
}



function isBrandOnPage(html){
    var re = new RegExp(currentBrand, 'g');
    var count = (html.match(re, /g/) || []).length;
    return count ? true : false;
    
}

function getAllLinks(html, url){
    $ = cheerio.load(html);
    var links = []
    $('a').each(function(key, link){
        var la = link.attribs
        if(la && la.href){
            if(la.href.substr(0, 4) !== 'http'){
                var checkSlashes = url.split('/')
                if(checkSlashes.length >= 1){
                    la.href = checkSlashes[0] + la.href
                }else{
                    la.href = url + la.href
                }
                  
            }
            
        }
        if(typeof(la.href) === 'string' ){
            if(urlParser.parse(la.href).host === urlParser.parse(url).host){
                links.push(la.href)
            }
            
        }
  
    })
    return uniq(links);
}

function searchPage2(urlObject) {
    var urlArr = urlObject[Object.keys(urlObject)[0]];
    var urls = [];
    
    function s(url){
            return new Promise(function(resolve, reject){
                return request(url, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                      var tempObj = {}
                    tempObj[url] = isBrandOnPage(response.body, 'aladdin') 
                    resolve(tempObj)
                    
                  }else{
                      resolve('s request failed')
                  }
            })
            
        })
    }
    
    return Promise.map(urlArr, s);
    
        
}


// data = ['http://www.top10casinosites.net/', 'https://www.casino.org/australia/']




function aff_search(query, tld, brand){
    currentBrand = brand;
    return new Promise(function(resolve, reject){
         return getResultsFromGoogle(query, tld).then(function(data){
            Promise.map(data, searchPage).then(function(results){
                 //results is an array of objects - values of each obj is array
                return Promise.map(results, searchPage2).then(function(r) {
                   var d = r.map(function(arr){
                       return arr.filter(function(obj){
                           var k= Object.keys(obj)[0]
                           if(obj[k] === true){
                               return obj
                           } 
                       })
                   })
                   resolve(d);
           
        })
            })

        })
    
    })
   
}


module.exports = aff_search

// aff_search('best casino', 'com.au', 'aladdin').then(function(data){ console.log(data) })