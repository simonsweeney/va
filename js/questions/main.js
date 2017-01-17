var introModal = require('./introModal');
var ask = require('./ask');
var loadTextureCube = require('../lib/loadTextureCube');

module.exports = function( res ){

    var [ gl, assets ] = res;

    return introModal()
        .then( quality => {
            
            document.body.classList.add('loaded');
            
            ask( gl, quality, assets );
            
        });
    
}