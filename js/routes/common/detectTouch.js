module.exports = ( ctx, next ) => {
    
    if ( !('ontouchstart' in window) ) document.body.classList.add('no-touch');
    
    var path = ctx.path.split('/');
    
    if ( path[1] ) {
        
        document.body.classList.add( path[1] );
        
    } else {
        
        document.body.classList.add( 'home' );
        
    }
    
    next();
    
}