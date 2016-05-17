var google = require('./google_new');
var Promise = require('bluebird');
var request = require('request');
var cheerio = require('cheerio');
var uniq = require('lodash/uniq');
var urlParser = require('url');

var nextCounter = 0;

google.resultsPerPage = 10;

var userGlobalVarials = {

}

function getResultsFromGoogle(query, tld) {
    
    return new Promise(function(resolve, reject) {
        
        google(query, 0, function (err, res) {
            
            if (err || res === null){
                return resolve('overusedGoogle'); 
            } 
            
            var links = [];
            
            for (var i = 0; i < res.links.length; ++i) {
                links.push(res.links[i].href)
            }
            
            if (nextCounter < 4) {
                nextCounter += 1
                if (res.next) res.next()
            }
            
            resolve(links)
            
        }, tld);
        
    });
    
}


function searchPage(url) {
    
    return new Promise(function(resolve, reject){
        
        return request(url, function (error, response, body) {
            
          if (!error && response.statusCode == 200) {
              

                var tempObj = {};
                
                tempObj[url] = getAllLinks(response.body, url); 
                
                resolve(tempObj);
          }else{
              
            resolve('couldnt load page')
          }
            
        });

    });
}

function filterElements($, brandToken){
    
    var f = $('*').filter(function(key, elem){
         if(elem.type === 'tag'){
            if(elem.name === 'img'){
                if(elem.attribs.src && elem.attribs.src.indexOf(brandToken) > 0) {
                    return true;
                }
            }
            
            if(elem.name === 'a'){
                if(elem.attribs.href && elem.attribs.href.indexOf(brandToken) > 0) {
                    return true;
                }
            }
            
            if(elem.children){
               return elem.children.some(function(childObject){
                     if(childObject.data && childObject.data.indexOf(brandToken) > 0) {
                            return true;
                        }
                    
                })
                
              }
        
         }
        
     })
     return f.length > 0 ? true : false;
     
} 


function isBrandOnPage(html){
    //split brand text into array
    var cb = userGlobalVarials.brand.split(',');

     $ = cheerio.load(html);
    return cb.some(function(brandToken){
        return filterElements($, brandToken)
        
    })
  
}



function getAllLinks(html, url){
    $ = cheerio.load(html);
    var links = [];
    
    $('a').each(function(key, link) {
        
        var la = link.attribs;
        
        if(la && la.href){
            
            if(la.href.substr(0, 4) !== 'http'){
                
                var checkSlashes = url.split('/');
                
                if(checkSlashes.length >= 1){
                    
                    la.href = checkSlashes[0] + la.href;
                    
                }else{
                    
                    la.href = url + la.href;
                }
                  
            }
            
        }
        if(typeof(la.href) === 'string' ){
            if(urlParser.parse(la.href).host === urlParser.parse(url).host){
                links.push(la.href)
            }
            
        }
  
    })
    var u = uniq(links)
    return u;
}

function searchPage2(urlObject) {
    var urlArr = urlObject[Object.keys(urlObject)[0]];
    // if(urlArr.length === 0) return Promise.resolve(null)

    console.log(urlObject)   
    function s(url){
            return new Promise(function(resolve, reject){
                return request(url, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                    var tempObj = {}
                    tempObj[url] = isBrandOnPage(response.body) 
                    resolve(tempObj)
                    
                  }else{
                      resolve('s request failed')
                  }
            })
            
        })
    }
    
    return Promise.map(urlArr, s);
    
        
}

function removePagesWithoutBrand(r){
    
     return r.map(function(arr){
      if(arr === null) return null;
      
       return arr.filter(function(obj){
           
           var k= Object.keys(obj)[0];
           
           if(obj[k] === true){
               
               return k;
           } 
       });
   });
    
}

function openPages(urlArray){
     return Promise.map(urlArray, searchPage).then(function(urls){ 
                 //results is an array of objects - values of each obj is array
                    return Promise.map(urls, searchPage2)
     })
}

function aff_search(query, tld, brand) {
    userGlobalVarials.brand = brand
    return new Promise(function(resolve, reject){
        
         return getResultsFromGoogle(query, tld).then(function(searchResults){
             if(searchResults === 'overusedGoogle' ){
                 resolve('overused google tld');
             }else{
                return openPages(searchResults).then(function(r) 
                        
                        resolve({
                            query: query,
                            tld : tld,
                            brand : brand,
                            searchResults : searchResults,
                            links : removePagesWithoutBrand(r)

                        });

                    });
                });
            }
        
         });
    
    });
   
};



module.exports = aff_search
