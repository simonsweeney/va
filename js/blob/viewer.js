var createContext = require('gl-context');
var BlobRenderer = require('./renderer');
var FPSTracker = require('./lib/fpsTracker');
var normalizeEvent = require("./lib/normalizeEvent");
var hasTouch = require('./lib/hasTouch');

var DPR = window.devicePixelRatio || 1;

module.exports = class BlobViewer extends BlobRenderer {
    
    constructor ( gl, initalParams = { colorOffset: .5 } ) {
        
        super( gl, initalParams );
        
        this.canvas = gl.canvas;
        
        this.renderScale = 1;
        
        this.frameTimer = new FPSTracker( 45, .5 / DPR, quality => {
            this.renderScale = quality;
            this.setSize();
        });

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
    
    setSize () {
        
        var w = window.innerWidth * this.renderScale * DPR;
        var h = window.innerHeight * this.renderScale * DPR;
        
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
            
            this.frameTimer.push( dT );
            
            this.render( now, dT );
            
            then = now;
            
            requestAnimationFrame( ticker );
            
        }
        
        ticker();
        
    }
    
}