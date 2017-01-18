var $ = require('jquery');
var { DB_ROOT } = require('../../config');

module.exports = function ( ctx, next ) {
    
    $.get( DB_ROOT + ctx.path, res => {
        
        ctx.data = res;
        
        next();
        
    })
    
}