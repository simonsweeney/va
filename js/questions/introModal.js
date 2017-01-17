var Promise = require('promise');
var modal = require('../ui/modal');
var config = require('../config');

module.exports = function () {
    
    if ( window.innerWidth < 768 ) {
        
        return modal([
            config.INTRO_TEXT
        ], {
            "Next": 1
        }).then( () => {
            return modal([
                config.INSTRUCTIONS,
                config.WARNING
            ], {
                // "Start" : 1
                "High quality": window.innerWidth <= 1024 ? 1 : 2/3,
                "Low quality": window.innerWidth <= 1024 ? 2/3 : 1/2,
                "Back to V&A": 'href=https://www.vam.ac.uk/'
            })
        });
        
    } else {
        
        return modal([
            config.INTRO_TEXT,
            config.INSTRUCTIONS,
            config.WARNING
        ], {
            // "Start": 2/3,
            "High quality": window.innerWidth <= 1024 ? 1 : 2/3,
            "Low quality": window.innerWidth <= 1024 ? 2/3 : 1/2,
            "Back to V&A": 'href=https://www.vam.ac.uk/'
        });

        
    }
    
    
}