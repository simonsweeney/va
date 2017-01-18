var Promise = require('promise');

function loadAsset ( ctx, key, loader ) {
    
    return loader().then( res => ctx[ key ] = res );
    
}

module.exports = function loadAssets( assets ) {
    
    return function( ctx, next ) {
        
        var promises = [];
        
        for ( var key in assets ) {
            
            promises.push( loadAsset( ctx, key, assets[ key ] ) );
            
        }
        
        return Promise.all( promises ).then( next );
        
    }
    
}