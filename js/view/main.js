var $ = require('jquery');
var BlobViewer = require('../blob/viewer');
var questions = require('../questions.json');
var parseAnswers = require('../blob/lib/parseAnswers');
var { DB_ROOT } = require('../config');
var parseQueryString = require('query-string').parse;
var tween = require('../lib/tween');

module.exports = function ( res ) {
    
    var [ gl, [cube, ] ] = res;
    
    var id = parseQueryString( location.search ).id;
    
    $.get( DB_ROOT + 'id/' + id, res => {
        
        var params = parseAnswers( questions, res.answers );
        
        params.marbleTexture = cube;
        params.camera = [ 0, 0, -4 ];
        params.subtract = 1.4;
        var blob = new BlobViewer( gl, 2/3, params );
        
        function onResize () {
            
            blob.setSize( window.innerWidth, window.innerHeight );
            
        }
        
        window.addEventListener('resize', onResize);
        
        onResize();
        blob.tick();
        
        document.body.appendChild( blob.canvas );
        
        tween( 1.4, 0, 2500, 'quadInOut', x => blob.setUniform( 'subtract', x ) );

        
    })
    
    // var [ gl, [cube, ] ] = res;
    
    // var params = {
    //     marbleTexture: cube,
    //     camera: [ 0, 0, -5 ]
    // }
    
    // var blob = new BlobViewer( gl, 2/3, params );
    
    
}