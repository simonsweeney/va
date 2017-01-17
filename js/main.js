var $ = require('jquery');
var init = require('./ui/init');

var home = require('./home/main');
var questions = require('./questions/main');
var sandbox = require('./sandbox/main');

init().then( res => {
    
    var $body = $('body');
    
    if( $body.hasClass('home') ) {
        
        return home( res );
        
    } else if( $body.hasClass('questions') ) {
        
        return questions( res );
        
    } else if ( $body.hasClass('sandbox') ) {
        
        return sandbox( res );
        
    }
    
});
