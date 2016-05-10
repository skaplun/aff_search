
$(document).ready(function(){
    
    $('#keySearch').submit(function(e){
        e.preventDefault();
        
        data = $(this).serialize()
        console.log(data)
        
        $.post('/', data, getResponse)
     
    })


    function getResponse (data){
        var d = Object.keys(data)
        console.log(data)
        d.forEach(function(k) {
            var resultKeys = Object.keys(data[k])
            resultKeys.forEach(function(key) {
                $('#results').append('<p>' + key + ': ' + data[k][key] + '</p>')
            })
            
        })
        
    }
})