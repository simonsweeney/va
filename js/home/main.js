var BlobViewer = require('../blob/viewer');
var randomParams = require('../sandbox/random');
var tween = require('../lib/tween');

module.exports = function ( res ) {
    
    var [ gl, [cube, title] ] = res;
    
    var params = randomParams();
    params.marbleTexture = cube;
    params.backgroundTexture = title;
    params.camera = [0, 0, -5];
    params.subtract = 2;
    
    var blob = new BlobViewer( gl, 2/3, params );
    
    function onResize () {
        
        blob.setSize( window.innerWidth, window.innerHeight );
        
    }
    
    window.addEventListener('resize', onResize);
    
    onResize();
    blob.tick();
    
    tween( 1.4, 0, 2500, 'quadInOut', x => blob.setUniform( 'subtract', x ) );
    
    document.body.appendChild( blob.canvas );
    
}