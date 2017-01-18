module.exports = function ( ...fns ) {
    
    var total = fns.length;
    var done = 0;
    
    return function ( ctx, next ) {
        
        function onComplete () {
            
            done++;
            if ( done === total ) next();
            
        }
        
        fns.forEach( fn => fn( ctx, onComplete ) );
        
    }
    
}