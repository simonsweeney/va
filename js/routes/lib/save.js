var $ = require('jquery');
var Promise = require('promise');
var { DB_ROOT } = require('../../config');

function save ( data ) {
    
    var req = {
        age: data.age,
        location: data.location
    };
    
    for ( var i = 0; i < 20; i++ ) {
        
        req[ 'answer_' + i ] = data.answers[ i ] || 0;
        
    }
    
    console.log(req);
    
    return new Promise( (resolve, reject) => {
        
        $.ajax({
            url: DB_ROOT + '/save',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify( req ),
            success: resolve,
            error: reject
        });
        
    })
    
}

window.save = () => {
    
    save({
        age: 1,
        location: "United Kingdom",
        answers: Array(10).fill(0).map(Math.random)
    })
    
}

module.exports = save;