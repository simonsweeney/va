var element = document.createElement( 'div' );
element.classList.add('sliders');
document.body.appendChild(element);

var shuffle = document.createElement('button');
shuffle.innerText = 'Shuffle';
shuffle.classList.add('shuffle');
document.body.appendChild(shuffle);

shuffle.addEventListener('click', () => {
    
    var sliders = element.childNodes;
    
    for ( var i = 0; i < sliders.length; i++ ) {
        
        //sliders[i].value = Math.random() > .5 ? -1 : 1;
        
        sliders[i].value = Math.random() * 2 - 1;
        
        var event = new Event('input');
        
        sliders[i].dispatchEvent( event );
        
    }
    
})

function uniformSetter( blob, obj ) {
    
    var uniform;
    
    for ( var key in obj ) uniform = key;
    
    var value = obj[key];
    
    if ( !Array.isArray(value) ) value = [0, value];
    
    var min = value[0];
    var max = value[1];
    
    var last = Math.random();
    
    return function ( x ) {
        
        if ( x === last ) return;
        
        var value = min + ( max - min ) * x;
        
        console.log( uniform, value );
        
        blob.setUniform( uniform, value );
        
    }
    
}

function createSlider( onChange ){
    var slider = document.createElement('input');
    slider.setAttribute('type', 'range');
    slider.setAttribute('min', -1);
    slider.setAttribute('max', 1);
    slider.setAttribute('step', .0001);
    slider.addEventListener('input', () => onChange( slider.value ) );
    onChange(0);
    element.appendChild(slider);
    return slider;
}

function slider1 ( blob, uniform ) {
    
    var setter = uniformSetter( blob, uniform );
    
    createSlider( v => setter( v * .5 + .5 ) );
    
}

function slider2 ( blob, left, right ) {
    
    var leftSetter = uniformSetter( blob, left );
    var rightSetter = uniformSetter( blob, right );
    
    createSlider( v => {
        
        if ( v < 0 ) {
            
            rightSetter( 0 );
            leftSetter( -v );
            
        } else {
            
            leftSetter( 0 );
            rightSetter( v );
            
        }
        
    })
    
}

module.exports = function ( blob, left, right ) {
    
    if ( right ) {
        
        slider2( blob, left, right );
        
    } else {
        
        slider1( blob, left );
        
    }
    
}