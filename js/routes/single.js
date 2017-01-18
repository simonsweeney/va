var BlobViewer = require('../blob/viewer');
var questions = require('../questions.json');
var parseAnswers = require('../blob/lib/parseAnswers');
var { DB_ROOT } = require('../config');
var tween = require('../lib/tween');
var template = require('./lib/template')( require('./single.html') );

module.exports = function ( ctx, next ) {
    
    template();
    
    var params = parseAnswers( questions, ctx.data.answers );
    
    params.marbleTexture = ctx.envMap;
    params.camera = [ 0, 0, -4 ];
    params.subtract = 1.4;
    var blob = new BlobViewer( ctx.gl, params );
    
    function onResize () {
        
        blob.setSize( window.innerWidth, window.innerHeight );
        
    }
    
    window.addEventListener('resize', onResize);
    
    onResize();
    blob.tick();
    
    document.body.appendChild( blob.canvas );
    
    tween( 1.4, 0, 2500, 'quadInOut', x => blob.setUniform( 'subtract', x ) );
    
    next();
    
    // var [ gl, [cube, ] ] = res;
    
    // var params = {
    //     marbleTexture: cube,
    //     camera: [ 0, 0, -5 ]
    // }
    
    // var blob = new BlobViewer( gl, 2/3, params );
    
    
}