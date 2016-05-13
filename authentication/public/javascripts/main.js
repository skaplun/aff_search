
$(document).ready(function(){
    
    $('#keySearch').submit(function(e){
        e.preventDefault();
        
        spinner(true)
        
        data = $(this).serializeArray()
        // displayCheckingAlert(data)
        
        
        $.post('/aff_search', data, searchResults)
     
    })
    
})

function searchResults (data){
        
  spinner(false)
//   $('.alert').remove();
  
  arrangeResults(data)
    
}


function spinner (on) {
    if(on){
        var opts = {
      lines: 13 // The number of lines to draw
    , length: 28 // The length of each line
    , width: 14 // The line thickness
    , radius: 42 // The radius of the inner circle
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

    var caption = document.createElement('caption')
    caption.innerHTML = '<h2><strong>Query </strong>: ' + result['query'] +  
                            ', <strong>TLD</strong>: ' + result['tld'] +
                            ', <strong>Brand</strong>: ' + result['brand'] + '</h2>';

    table.appendChild(caption);
    var tHead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    table.appendChild(tHead);
    tHead.appendChild(headerRow);

    ['position', 'entry page', 'pages with brand keyword'].forEach(function(text){
            var headerCell = document.createElement('th');
            var contentFrag = document.createTextNode(text);
            headerCell.appendChild(contentFrag);
            headerRow.appendChild(headerCell);
    })

    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    result.searchResults.forEach(function(sr, index){
        var bodyRow = document.createElement('tr');
        var trueResults = result.links[index].map(function(obj){
                    return Object.keys(obj)[0];
                }).join(', ')
                
        
        [( index + 1), sr, trueResults].forEach(function(cellText){
            var bodyCell = document.createElement('td');
            var contentFrag = document.createTextNode(cellText);
            bodyCell.appendChild(contentFrag);
            bodyRow.appendChild(bodyCell);
        }) 

        tbody.appendChild(bodyRow);
    })
}

 
var displayCheckingAlert = function(data){
    
    var alert = document.createElement('div')
    alert.classList.add('alert')
    alert.classList.add('alert-success')
    var dArr = data.split('&');
     $(alert).insertBefore('#resultsPanel');
     
    var initialContent = document.createTextNode("we are looking for ");
    alert.appendChild(initialContent);
    
    alert.textContnet = ''
    dArr.forEach(function(dCombo){
        
        var d = dCombo.split('=')
        
        if(d[0] === 'brand'){
             var contentFrag = document.createTextNode(d[0] + ':' + d[1]);
        }else{
             var contentFrag = document.createTextNode(d[0] + ':' + d[1] + ', ');
        }
        alert.appendChild(contentFrag);
        
    })
   
}
