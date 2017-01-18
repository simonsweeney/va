var BlobViewer = require('../blob/viewer')
var scale = require('../lib/scale');
var questions = require('../questions.json');

var sliderContainer = document.createElement('div');
sliderContainer.classList.add('sliders');
document.body.appendChild(sliderContainer);

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
    
    return function ( value ) {
        
        if ( value < 0 ) {
            
            blob.setUniform( rightUniform, 'default' );
            blob.setUniform( leftUniform, scale( value, 0, -1, leftMin, leftMax ) );
            
        } else {
            
            blob.setUniform( leftUniform, 'default' );
            blob.setUniform( rightUniform, scale( value, 0, 1, rightMin, rightMax ) );
            
        }
        
    }
    
}

function uniformSetter ( blob, question ) {
    
    if ( question.left.uniform === question.right.uniform ) {
        
        return uniformSetter1( blob, question );
        
    } else {
        
        return uniformSetter2( blob, question );
        
    }
    
}

function createInput( onChange ){
    var slider = document.createElement('input');
    slider.setAttribute('type', 'range');
    slider.setAttribute('min', -1);
    slider.setAttribute('max', 1);
    slider.setAttribute('step', .0001);
    slider.addEventListener('input', () => onChange( slider.value ) );
    return slider;
}

function createLabel( question ) {
    
    var p = document.createElement('p');
    p.innerHTML = `${question.question}<br>${question.left.answer} ↔ ${question.right.answer}`;
    return p;
    
}

function addSlider ( blob, question ) {
    
    var setter = uniformSetter( blob, question )
    var label = createLabel( question );
    var input = createInput( setter );
    sliderContainer.appendChild( label );
    sliderContainer.appendChild( input );
    
}

module.exports = function ( res ) {
    
    var [ gl, [cube, ] ] = res;
    
    var params = {
        marbleTexture: cube,
        camera: [ 0, 0, -5 ]
    }
    
    var blob = new BlobViewer( gl, 2/3, params );
    
    questions.forEach( q => addSlider( blob, q ) );
    
    function onResize () {
        
        blob.setSize( window.innerWidth, window.innerHeight );
        
    }
    
    window.addEventListener('resize', onResize);
    
    onResize();
    blob.tick();
    
    document.body.appendChild( blob.canvas );
    
}