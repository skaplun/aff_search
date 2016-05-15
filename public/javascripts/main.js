
$(document).ready(function(){
    
    $('#keySearch').submit(function(e){
        e.preventDefault();
        
        spinner(true)
        
        data = $(this).serializeArray()
        displayCheckingAlert(data)
        
         $.post('/aff_search', data, searchResults)
     
    })
    
})

function searchResults (data){
        
  spinner(false)
  $('.alert').remove();
  
  arrangeResults(data)
    
}


function spinner (on) {
    if(on){
        var opts = {
      lines: 13 // The number of lines to draw
    , length: 22 // The length of each line
    , width: 14 // The line thickness
    , radius: 32 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
    }
        var target = document.getElementById('spinner')
        var spinner = new Spinner(opts).spin(target);
    }else{
        $('.spinner').remove();
        
    }
    
}

var arrangeResults = function(result){
    var table = document.getElementById('results')
    
    if(typeof(result) === 'string'){
        var contentFrag = document.createTextNode(result);
    
        table.appendChild(contentFrag)
        return;
    }
    

    var caption = document.createElement('caption')
    caption.innerHTML = '<h2><strong>Query </strong>: ' + result['query'] +  
                            ', <strong>TLD</strong>: ' + result['tld'] +
                            ', <strong>Brand</strong>: ' + result['brand'] + '</h2>';

    table.appendChild(caption);
    var tHead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    table.appendChild(tHead);
    tHead.appendChild(headerRow);

    ['Action', 'position', 'entry page', 'pages with brand keyword'].forEach(function(text){
            var headerCell = document.createElement('th');
            var contentFrag = document.createTextNode(text);
            headerCell.appendChild(contentFrag);
            headerRow.appendChild(headerCell);

    })

    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    result.searchResults.forEach(function(sr, index){
        var bodyRow = document.createElement('tr');
        var pagesWithBrand = result.links[index]
        var trueResults;
        
        if(Array.isArray(pagesWithBrand)){
             trueResults  = pagesWithBrand.map(function(obj){
                    return Object.keys(obj)[0];
                }).join(', ')
        }else{
            if(trueResults === undefined){
                trueResults = 'no results'
            }else{
                trueResults = pagesWithBrand;
            
            }
            
        }      
         
        
       
        ['checkBox', ( index + 1), sr, trueResults].forEach(function(cellText){
            var bodyCell = document.createElement('td');
            var contentFrag ;
            
            if(cellText === 'checkBox'){
                contentFrag = document.createElement('input');
                contentFrag.type = 'checkbox';
            }else{
                contentFrag = document.createTextNode(cellText);
                
            }
            
            bodyCell.appendChild(contentFrag);
            bodyRow.appendChild(bodyCell);
                
        }) 

        tbody.appendChild(bodyRow);
    })
    $('#results').DataTable()
    
}

 
var displayCheckingAlert = function(data){
    var alert = document.createElement('div')
    alert.classList.add('alert')
    alert.classList.add('alert-success')
    
    var content = 'we are looking for '
    
    data.forEach(function(dataObj){
        content += '<strong>' + dataObj.name + '</strong>: ' + dataObj.value + ', ';
        
    })
    
     alert.innerHTML = content;
    
     $(alert).insertBefore('#resultsPanel');
    
   
}
