var $ = require('jquery');

module.exports = function template( str ) {
    
    return function() {
        
        $('body').append( $( str ) );
        
    }
    
}