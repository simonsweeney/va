var createContext = require('gl-context');
var loadTextureCube = require('../lib/loadTextureCube');
var loadImage = require('../lib/loadImage');
var modal = require('./modal');
var $ = require('jquery');

function DOMReady(){
    
    return new Promise( r => $(r) );
    
}

function initContext () {
    
    if ( !('ontouchstart' in window) ) document.body.classList.add('no-touch');
    
    var canvas = document.createElement('canvas');
    
    try {
        
        var gl = createContext( canvas, { preserveDrawingBuffer: true } );
        
        return Promise.all([
            loadTextureCube( 'assets/marble' ),
            loadImage( 'assets/title.jpg')
        ])
        .then( assets => {
            document.body.classList.add('loaded');
            return Promise.resolve( [ gl, assets ] );
        });
        
    } catch( e ) {
        
        modal("Your browser doesn't support WebGL :(", {
            "Back to V&A": "href:https://www.vam.ac.uk/"
        });
        
        return Promise.reject();
        
    }

    
}

module.exports = function () {
    
    return DOMReady().then(initContext);
    
}