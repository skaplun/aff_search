
$(document).ready(function(){
    
    $('#keySearch').submit(function(e){
        e.preventDefault();
        
        data = JSON.stringify($(this).serialize())
        console.log(data)
        
        $.post('/', data, getResponse)
     
    })


    function getResponse (data){
        var d = Object.keys(data)
        d.forEach(function(k){
            $('#results').append('<p>' + k + ': ' + data[k] + '</p>')
        })
        
    }
})