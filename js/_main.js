require('./lib/fit');
var $ = require('jquery');

var Promise = require('promise');
var tween = require('./lib/tween');
var scale = require('./lib/scale');
var loadTextureCube = require('./lib/loadTextureCube');
var createContext = require('gl-context');

loadTextureCube( createContext(), '/assets/marble' )
    .then( cube => {
        console.log(cube);
    })

var BlobSlider = require('./blob/slider');

var slider = new BlobSlider( gl, 2/3, { subtract: 1.4, colorOffset: .5 } );

var $body = $('body');
var $question = $('.question')
var $answers = $('.answer');
var $leftAnswer = $answers.eq(0);
var $rightAnswer = $answers.eq(1);
var $buttons = $('.buttons');
var $buttonSkip = $buttons.children().eq(1);
var $buttonConfirm = $buttons.children().eq(2);

var PREFIXED_TRANSFORM = require('detectcss').prefixed('transform');
if ( !('ontouchstart' in window) ) document.body.classList.add('no-touch');

function onResize() {
    
    $answers.fit();
    slider.setSize( window.innerWidth, window.innerHeight );
    
}

window.addEventListener('resize', onResize);

onResize();
slider.tick();

var questions = require('./questions.json');
var answers = questions.map( () => 0 );

var currQuestion = 0;

function onFirstTouch () {
    
    $buttons.addClass('has-dragged');
    slider.canvas.removeEventListener('mousedown', onFirstTouch);
    slider.canvas.removeEventListener('touchstart', onFirstTouch);
    
}

slider.canvas.addEventListener('mousedown', onFirstTouch)
slider.canvas.addEventListener('touchstart', onFirstTouch)

function ask () {
    
    var q = questions[ currQuestion ];
    
    $question.text( q.question );
    $leftAnswer.text( q.left.answer );
    $rightAnswer.text( q.right.answer );
    $answers.fit();
    
    slider.enable();
    
    if ( currQuestion === 1 ) $buttons.removeClass( 'no-skip' );
    
    $body.addClass('show-questions');
    
    transformAll( 'none' );
    
    tween( currQuestion === 0 ? 2500 : 1500, opacityAll )
    
    if ( currQuestion === 0 ) {
        
        tween( 1.4, 0, 2500, 'quadInOut', x => slider.setUniform( 'subtract', x ) );
        
    }
    
    awaitButton()
        .then(applyAnswer)
        .then(() => {
            
            currQuestion++;
            
            if ( currQuestion <= questions.length - 1 ) {
            
                ask();
            
            } else {
                
                //finish
                
            }
            
        });
    
}

function opacityAll ( x ) {
    
    $question[0].style.opacity = x;
    $buttons[0].style.opacity = x;
    $leftAnswer[0].style.opacity = x;
    $rightAnswer[0].style.opacity = x;
    
}

function transformAll( value ) {
    
    $question[0].style[ PREFIXED_TRANSFORM ] = value;
    $buttons[0].style[ PREFIXED_TRANSFORM ] = value;
    
    if ( value === 'none' ) {
        
        value = 'translate(-50%, -50%)';
        
    } else {
        
        value += ' translate(-50%, -50%)';
        
    }
    
    $leftAnswer[0].style[PREFIXED_TRANSFORM] = value;
    $rightAnswer[0].style[PREFIXED_TRANSFORM] = value;
    
}

function awaitButton () {
    
    return new Promise( resolve => {
        
        var onConfirm = () => {
            unbind();
            resolve( true );
        }
        
        var onSkip = () => {
            unbind();
            resolve( false );
        }
        
        var unbind = () => {
            $buttonConfirm[0].removeEventListener('click', onConfirm);
            $buttonSkip[0].removeEventListener('click', onSkip);
        }
        
        $buttonConfirm[0].addEventListener('click', onConfirm);
        $buttonSkip[0].addEventListener('click', onSkip);
        
    })
    
}

function getUniformTween ( question, answer ) {
    
    var uniform, from, to;
    
    if ( question.left.uniform === question.right.uniform ) {
        
        uniform = question.left.uniform;
        from = .5;
        to = scale( answer, -1, 1, question.left.max, question.right.max );
        
    } else {
        
        from = 0;
        
        if ( answer < 0 ) {
            
            answer = Math.abs( answer );
            
            uniform = question.left.uniform;
            to = scale( answer, 0, 1, question.left.min, question.left.max );
            
        } else {
            
            uniform = question.right.uniform;
            to = scale( answer, 0, 1, question.right.min, question.right.max );
            
        }
        
    }
    
    return { uniform, from, to };
    
}

function applyAnswer ( confirm ) {
    
    slider.disable();
    
    if ( confirm ) {
        
        var question = questions[ currQuestion ];
        var answer = slider.value;
        
        answers[ currQuestion ] = answer;
        
        var questionOffset = -slider.valueToScreen( slider.value );
        
        var { uniform: uniformName, from: uniformFrom, to: uniformTo } = getUniformTween( question, answer );
        
        var sliderFrom = slider.value;
        
        return tween( uniformFrom, uniformTo, 2000, 'quadInOut', ( value, progress ) => {
            
            slider.setUniform( uniformName, value );
            
            slider.set( scale( progress, 0, 1, sliderFrom, 0 ) );
            
            opacityAll( 1 - progress );
            transformAll( `translate3d(${ progress * questionOffset }px, 0, 0)` );
            
        })
        
    } else {
        
        answers[ currQuestion ] = null;
        
        return tween( slider.value, 0, 1000, 'quadInOut', ( value, progress ) => {
            
            slider.set( value );
            
            opacityAll( 1 - progress);
            
        });
        
    }
    
}

ask();