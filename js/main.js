//require('es6-shim');

var $ = require('jquery');
var page = require('page');

var detectTouch = require('./routes/common/detectTouch');
var initGL = require('./routes/common/initGL');
var simultaneously = require('./routes/common/simultaneously');
var api = require('./routes/common/api');
var loadAssets = require('./routes/common/loadAssets');
var loadImage = require('./routes/common/loadImage');
var loadTextureCube = require('./routes/common/loadTextureCube');
var done = require('./routes/common/done');

var load = loadAssets({
    title: loadImage('assets/title.jpg'),
    envMap: loadTextureCube('assets/marble')
})

var loadWithAPI = simultaneously( load, api );

var home = require('./routes/home/home');
var questions = require('./routes/questions/questions');
var single = require('./routes/single/single');
var list = require('./routes/list/list');
var sandbox = require('./routes/sandbox/sandbox');

// page.base('/collecting_europe_240117');

page( '*', detectTouch, initGL );

page( '/', loadWithAPI, home, done );

page( '/all', loadWithAPI, home, done );

page( '/questions', load, questions, done );

page( '/archive', loadWithAPI, list, done );

page( '/sandbox', load, sandbox, done );

page( /^\/(\d+)/, loadWithAPI, single, done );

page( '*', () => $('.loading').text('404') );

page({
    click: false,
    popstate: false
});