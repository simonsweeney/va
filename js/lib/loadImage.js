var Promise = require('promise');

module.exports = function loadImage( url ) {
    
    if( Array.isArray( url ) ) {
        
        return Promise.all( url.map( loadImage ) );
        
    }
    
    var img = new Image();
    
    return new Promise(resolve => {
        
        img.onload = () => resolve( img );
        
        img.src = url;
        
    })
    
}