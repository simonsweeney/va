var BlobViewer = require("./viewer");
var normalizeEvent = require("./lib/normalizeEvent");

module.exports = class BlobSlider extends BlobViewer {
    
    constructor ( gl, renderScale, params ) {
        
        super( gl, renderScale, params );
        
        this.value = 0;
        this.dragging = false;
        this.dragX = 0;
        this.prevDragXs = [];
        this.velocity = 0;
        this.max = 1;
        this.interactive = false;

        this.bound = {
            onDown: normalizeEvent( this.onDown.bind(this) ),
            onMove: normalizeEvent( this.onMove.bind(this) ),
            onUp: normalizeEvent( this.onUp.bind(this) )
        }
        
    }
    
    enable () {
        
        this.bind('down');
        
    }
    
    disable () {
        
        if ( this.dragging ) {
            
            this.unbind('move');
            this.unbind('up');
            this.dragging = false;
            
        } else {
            
            this.unbind('down');
            
        }
        
        this.velocity = 0;
        
    }
    
    pushPrev ( x ) {
        
        this.prevDragXs.push( { x, time: Date.now() } );
        
    }
    
    onDown ( point ) {
        
        this.dragging = true;
        this.prevDragXs = [];
        this.pushPrev( point.x );
        this.velocity = 0;
        
        this.canvas.classList.add('dragging');
        
        this.unbind('down');
        this.bind('move');
        this.bind('up');
        
    }
    
    onMove ( point ) {
        
        var delta = point.x - this.prevDragXs[ this.prevDragXs.length - 1 ].x;
        
        var valueDelta = this.screenToBlobDepth( { x: delta, y: 0 } ).x / this.max;
        
        this.set( Math.min( Math.max( this.value + valueDelta, -1 ), 1 ) );
        
        this.doCamera();
        
        this.pushPrev( point.x );
        
    }
    
    onUp ( point ) {
        
        this.pushPrev( point.x );
        
        this.dragging = false;
        
        this.canvas.classList.remove('dragging');
        
        if ( this.prevDragXs.length >= 2 ) {
            
            var tooOld = Date.now() - 100;
            
            var prevs;
            
            for ( var i = this.prevDragXs.length - 1; i >= 0; i-- ) {
                
                var obj = this.prevDragXs[ i ];
                
                if ( obj.time <= tooOld && i < this.prevDragXs.length - 2 ) {
                    
                    prevs = this.prevDragXs.slice( i + 1 );
                    break;
                    
                }
                
            }
            
            if ( !prevs ) prevs = this.prevDragXs;
    
            var newestPoint = prevs[ prevs.length - 1 ];
            var oldestPoint = prevs[ 0 ];
            
            var dx = this.screenToValue( newestPoint.x - oldestPoint.x );
            var dt = newestPoint.time - oldestPoint.time;
            
            if ( dt !== 0 ) this.velocity = dx / dt;
        
        }
        
        this.unbind('move');
        this.unbind('up');
        this.bind('down');
        
    }
    
    render ( now, dT ) {
        
        this.velocity *= .98;
        
        var v = this.value + this.velocity * dT;
        v = Math.max( Math.min( v, 1 ), -1 );
        
        this.set( v );
        this.doCamera();
        
        super.render( now, dT );
        
    }
    
    bind ( event ) {
        
        switch ( event ) {
            
            case 'down':
                this.canvas.addEventListener('mousedown', this.bound.onDown);
                this.canvas.addEventListener('touchstart', this.bound.onDown);
                break;
                
            case 'move':
                this.canvas.addEventListener( 'mousemove', this.bound.onMove );
                this.canvas.addEventListener( 'touchmove', this.bound.onMove );
                break;

            case 'up':
                this.canvas.addEventListener( 'mouseup', this.bound.onUp );
                this.canvas.addEventListener( 'mouseleave', this.bound.onUp );
                this.canvas.addEventListener( 'touchend', this.bound.onUp );
                break;
                
        }
        
    }
    
    unbind ( event ) {
        
        switch ( event ) {
            
            case 'down':
                this.canvas.removeEventListener('mousedown', this.bound.onDown);
                this.canvas.removeEventListener('touchstart', this.bound.onDown);
                break;
                
            case 'move':
                this.canvas.removeEventListener( 'mousemove', this.bound.onMove );
                this.canvas.removeEventListener( 'touchmove', this.bound.onMove );
                break;

            case 'up':
                this.canvas.removeEventListener( 'mouseup', this.bound.onUp );
                this.canvas.removeEventListener( 'mouseleave', this.bound.onUp );
                this.canvas.removeEventListener( 'touchend', this.bound.onUp );
                break;
                
        }
        
    }
    
    setSize ( w, h ) {
        
        super.setSize( w, h );
        
        var maxPx = window.innerWidth * .3;
        
        this.max = this.screenToBlobDepth( { x: maxPx, y: 0 } ).x;
        
        this.doCamera();
        
    }
    
    set ( value ) {
        
        this.value = value;
        
    }
    
    windowToValue ( x ) {
        
        return this.windowToBlobDepth( { x, y: 0 } ).x / this.max;
        
    }
    
    screenToValue ( x ) {
        
        return this.screenToBlobDepth( { x, y: 0 } ).x / this.max;
        
    }
    
    valueToScreen ( v ) {
        
        v *= this.max;
        
        v /= 6 / ( Math.PI / 2 );
        
        v /= this.getScale();
        
        return v;
        
    }
    
    doCamera () {
        
        var x = this.value * -this.max;
        
        this.setUniform( 'camera', [ x, 0, -6 ] )
        
    }
    
}