module.exports = ( ctx, next ) => {
    
    setTimeout( () => {
        
        document.body.classList.add('loaded');
        
        next();
        
    }, 0 );
    
}