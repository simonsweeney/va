var clamp = require('./clamp');

module.exports = class FPSTracker {
    
    constructor ( target, min, setter ) {
        
        this.target = target;
        this.min = min;
        this.setter = setter;
        
        this.quality = 1;
        this.size = 20;
        this.head = 0;
        this.buffer = [];
        
    }
    
    push ( value ) {
        
        if ( this.head >= this.size ) {
            
            var avg = 1000 / this.getAverage();
            
            this.quality *= 1 + ( avg - this.target ) / this.target;
            
            this.quality = clamp( this.quality, this.min, 1 );
            
            this.setter( this.quality );
            
            console.log( this.quality, avg );
            
            this.head -= this.size;
            
        }
        
        this.buffer[ this.head ] = value;
        
        this.head++;
        
    }
    
    getAverage () {
        
        if ( !this.buffer.length ) return 0;
        
        var sum = 0;
        
        for ( var i = 0; i < this.buffer.length; i++ ) {
            
            sum += this.buffer[ i ];
            
        }
        
        return sum / this.buffer.length;
        
    }
    
    clear () {
        
        this.buffer = [];
        this.head = 0;
        
    }
    
}