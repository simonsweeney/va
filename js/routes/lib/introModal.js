var Promise = require('promise');
var modal = require('./modal');
var config = require('../../config');

module.exports = function () {
    
    if ( window.innerWidth < 768 ) {
        
        return modal([
            config.INTRO_TEXT
        ], {
            "Next": 1
        }).then( () => {
            return modal([
                config.INSTRUCTIONS,
                // config.WARNING
            ], {
                "Start" : 1
            })
        });
        
    } else {
        
        return modal([
            config.INTRO_TEXT,
            config.INSTRUCTIONS,
            // config.WARNING
        ], {
            "Start": 2/3,
        });

        
    }
    
    
}