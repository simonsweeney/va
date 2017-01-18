var createContext = require('gl-context');
var modal = require('../lib/modal');

module.exports = function initGL ( ctx, next ) {
    
    var canvas = document.createElement('canvas');
    
    try {
        
        var gl = createContext( canvas, { preserveDrawingBuffer: true } );
        
        ctx.gl = gl;
        
    } catch( e ) {
        
        modal("Your browser doesn't support WebGL :(", {
            "Back to V&A": "href:https://www.vam.ac.uk/"
        });
        
    }
    
    if ( ctx.gl ) next();

    
}