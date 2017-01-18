var page = require('page');

var detectTouch = require('./routes/common/detectTouch');
var initGL = require('./routes/common/initGL');
var simulaneously = require('./routes/common/simultaneously');
var api = require('./routes/common/api');
var loadAssets = require('./routes/common/loadAssets');
var loadImage = require('./routes/common/loadImage');
var loadTextureCube = require('./routes/common/loadTextureCube');
var done = require('./routes/common/done');

var load = loadAssets({
    title: loadImage('assets/title.jpg'),
    envMap: loadTextureCube('assets/marble')
})

var home = require('./routes/home');
var questions = require('./routes/questions');
var single = require('./routes/single');
var sandbox = require('./routes/sandbox');

page( '*', detectTouch, initGL );

page( '/', load, home, done );

page( '/questions', load, questions, done );

page( '/sandbox', load, sandbox, done );

page( /^\/(\d+)/, simulaneously( load, api ), single, done );

page({
    click: false,
    popstate: false
})

// init().then( res => {
    
//     var $body = $('body');
    
//     if( $body.hasClass('home') ) {
        
//         return home( res );
        
//     } else if( $body.hasClass('questions') ) {
        
//         return questions( res );
        
//     } else if ( $body.hasClass('view') ) {
        
//         return view( res );
        
//     } else if ( $body.hasClass('sandbox') ) {
        
//         return sandbox( res );
        
//     }
    
// });
