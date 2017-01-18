var BlobViewer = require('../blob/viewer');
var randomParams = require('../lib/randomParams');
var tween = require('../lib/tween');
var template = require('./lib/template')( require('./home.html') );

module.exports = function ( ctx, next ) {
    
    template();
    
    var gl = ctx.gl;
    var cube = ctx.envMap;
    var title = ctx.title;
    
    var params = randomParams();
    params.marbleTexture = cube;
    params.backgroundTexture = title;
    params.camera = [0, 0, -5];
    params.subtract = 2;
    
    var blob = new BlobViewer( gl, params );
    
    function onResize () {
        
        blob.setSize( window.innerWidth, window.innerHeight );
        
    }
    
    window.addEventListener('resize', onResize);
    
    onResize();
    blob.tick();
    
    tween( 1.4, 0, 2500, 'quadInOut', x => blob.setUniform( 'subtract', x ) );
    
    document.body.appendChild( blob.canvas );
    
    next();
    
}