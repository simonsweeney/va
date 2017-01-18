var Promise = require('promise');
var map = require('lodash/map')

module.exports = function( text, buttons ){
    
    return new Promise( resolve => {
        
        var element = document.createElement('div');
        element.classList.add('modal');
        
        var inner = document.createElement('div');
        inner.classList.add('modal__inner');
        element.appendChild( inner );
        
        if ( !Array.isArray( text ) ) text = [ text ];
        
        text.forEach( t => {
            
            var p = document.createElement('p');
            p.innerHTML = t;
            inner.appendChild(p);
            
        });
        
        map( buttons, ( res, label ) => {
            
            var a = document.createElement('a');
            a.innerHTML = label;
    
            if ( typeof res === 'string' && res.indexOf('href=') > -1 ) {
                
                a.href = res.split("=").slice(1).join();
                
            } else {
                
                a.addEventListener( 'click', () => {
                    
                    element.classList.remove( 'visible' );
                    
                    setTimeout( () => element.parentNode.removeChild( element ), 500 );
                    
                    resolve( res );
                    
                });
                
            }
            
            inner.appendChild( a );
    
        });
        
        document.body.appendChild( element );
        
        setTimeout( () => element.classList.add('visible'), 10 );
        
    });
    
}