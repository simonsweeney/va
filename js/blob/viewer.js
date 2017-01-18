var createContext = require('gl-context');
var BlobRenderer = require('./renderer');
var normalizeEvent = require("./lib/normalizeEvent");
var hasTouch = require('./lib/hasTouch');
var parseAnswers = require('./lib/parseAnswers');

var BLOB_Z = 6;

module.exports = class BlobViewer extends BlobRenderer {
    
    constructor ( gl, renderScale = 1, initalParams = { colorOffset: .5 } ) {
        
        if ( Array.isArray( initalParams ) ) {
            
            initalParams = parseAnswers( initalParams );
            
        }
        
        super( gl, initalParams );
        
        this.canvas = gl.canvas;
        
        this.renderScale = renderScale;
        
        if ( !hasTouch() ) {
            
            var boundOnMouseMove =  normalizeEvent( this.onMouseMove.bind(this) );
            this.canvas.addEventListener( 'mousemove', boundOnMouseMove );
            
        }
        
        document.body.appendChild( this.canvas );
        
    }
    
    onMouseMove ( point ) {
        
        point.y = window.innerHeight - point.y;
        
        point = this.windowToLocal( point );
        
        this.setUniform( 'mouse', [ point.x, point.y ] );
        
    }
    
    setSize ( w, h ) {
        
        var w = window.innerWidth * this.renderScale;
        var h = window.innerHeight * this.renderScale;
        
        super.setSize( w, h );
        
    }
    
    render ( now, dT ) {
        
        this.setUniform( 'time', now / 1000 );
        
        super.render();
        
    }
    
    tick () {
        
        var start = Date.now();
        
        var then = 0;
        
        var ticker = () => {
            
            var now = Date.now() - start;
            var dT = now - then;
            
            this.render( now, dT );
            
            then = now;
            
            requestAnimationFrame( ticker );
            
        }
        
        ticker();
        
    }
    
}