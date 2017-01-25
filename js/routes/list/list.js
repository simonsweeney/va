var $ = require('jquery');
var BlobViewer = require('../../blob/viewer');
var questions = require('../../questions.json');
var answersToParams = require('../../blob/lib/answersToParams');
var template = require('../lib/template')( require('./list.html') );
var listItem = require('./listItem')
var { DB_ROOT } = require('../../config');

module.exports = function ( ctx, next ) {
    
    template();
    
    var params = {
        marbleTexture: ctx.envMap,
        camera: [ 0, 0, 4 ]
    }
    
    var blob = new BlobViewer( ctx.gl, params );
    
    blob.defines.renderShadow = 0;
    
    var hasTouch = !$('body').hasClass('no-touch');
    
    function onResize () {
        
        var size = $items.length ? $items[0].width() : 0;
        
        blob.setSize( size, size );
        
    }
    
    var $items = ctx.data.map( response => {
        
        var $el = $( listItem( response ) );
        
        var params = answersToParams( questions, response );
        
        $el.mouseenter( () => {
            
            blob.setUniform( 'time', 0 );
            
            blob.setUniforms( params );
            
            $el.append( blob.canvas );
            
        })
        
        return $el;
        
    })
    
    $('.grid').append( $items );
    
    onResize();
    blob.tick();
    
    next();
    
}