module.exports = ( ctx, next ) => {
    
    if ( !('ontouchstart' in window) ) document.body.classList.add('no-touch');
    
    var path = ctx.path.split('/')[1];
    
    if ( !path ) {
    
        document.body.classList.add( 'home' );
    
    } else if ( !isNaN( path ) ) {
        
        document.body.classList.add( 'single' );
        
    } else {
        
        document.body.classList.add( path );
        
    }
    
    next();
    
}