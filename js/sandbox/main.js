var BlobViewer = require('../blob/viewer')
var scale = require('../lib/scale');

var sliderContainer = document.createElement('div');
sliderContainer.classList.add('sliders');

function createInput( onChange ){
    var slider = document.createElement('input');
    slider.setAttribute('type', 'range');
    slider.setAttribute('min', -1);
    slider.setAttribute('max', 1);
    slider.setAttribute('step', .0001);
    slider.addEventListener('input', () => onChange( slider.value ) );
    onChange(0);
    return slider;
}

function uniformSetter1 ( blob, question ) {
    
    var uniform = question.left.uniform;
    var min = question.left.max;
    var max = question.right.max;
    
    return function ( value ) {
        
        blob.setUniform( uniform, scale( value, -1, 1, min, max ) );
        
    }
    
}

function uniformSetter2 ( blob, question ) {
    
    var { uniform: leftUniform, min: leftMin, max: leftMax } = question.left;
    var { uniform: rightUniform, min: rightMin, max: rightMax } = question.right;
    
    
    
}

function uniformSetter ( blob, question ) {
    
    if ( question.left.uniform === question.right.uniform ) {
        
        return uniformSetter1( blob, question );
        
    } else {
        
        return uniformSetter2( blob, question );
        
    }
    
}

function createSlider ( question ) {
    
    
    
}

module.exports = function ( res ) {
    
    var [ gl, [cube, ] ] = res;
    
    var params = {
        marbleTexture: cube,
        camera: [ 0, 0, -6 ]
    }
    
    var blob = new BlobViewer( gl, 2/3, params );
    
    function onResize () {
        
        blob.setSize( window.innerWidth, window.innerHeight );
        
    }
    
    window.addEventListener('resize', onResize);
    
    onResize();
    blob.tick();
    
    document.body.appendChild( blob.canvas );
    
}