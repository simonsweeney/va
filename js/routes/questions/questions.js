var Promise = require('promise');
var questions = require('../../questions.json');
var introModal = require('../lib/introModal')
var BlobSlider = require('../../blob/slider');
var $ = require('jquery');
var scale = require('../../lib/scale');
var tween = require('../../lib/tween');
var PREFIXED_TRANSFORM = require('detectcss').prefixed('transform');
var template = require('../lib/template')( require('./questions.html') );
var askAgeAndLocation = require('./age-location');
var save = require('../lib/save');
var { BEFORE_SUBMIT } = require('../../config');

var BASE_SIZE = 200;
var TARGET_WIDTH = .3;

module.exports = function( ctx, next ) {
    
    template();
    
    var gl = ctx.gl;
    var envMap = ctx.envMap;
    
    var slider = new BlobSlider( gl, {
        subtract: 1.4,
        colorOffset: .5,
        marbleTexture: envMap,
        camera: [0, 0, 6]
    });
    
    document.body.appendChild( slider.canvas );
    
    introModal()
        .then(() => askQuestions( slider ) )
        .then( askAgeAndLocation )
        .then( save )
        .then( id => {
            
            window.location.href = id;
            
        })
    
    next();
    
}

function fitText( $elements ) {
    
    var targetWidth = TARGET_WIDTH * window.innerWidth;
    
    $elements.css( 'fontSize', BASE_SIZE );
    
    var leftWidth = $elements.eq(0).width();
    var rightWidth = $elements.eq(1).width();
    
    var scale = targetWidth / Math.max( leftWidth, rightWidth );
    
    $elements.css( 'fontSize', BASE_SIZE * scale );

}

function askQuestions( slider ) {
    
    return new Promise( resolve => {
        
        var answers = questions.map( () => 0 );
        var currQuestion = 0;
        var currButtons = 0;
        
        var $body = $('body');
        var $question = $('.question')
        var $answers = $('.answer');
        var $leftAnswer = $answers.eq(0);
        var $rightAnswer = $answers.eq(1);
        var $buttons = $('.buttons');
        var $buttonSkip = $('.button_skip')
        var $buttonConfirm = $('.button_confirm');
        
        $buttons.eq(0).removeClass('buttons_hidden');
        $buttons.eq(1).removeClass('buttons_hidden');
        $buttons.eq(1).fadeOut(0);
        $buttons.eq(2).fadeOut(0);
        
        function onFirstTouch () {
            
            $buttons.eq(0).fadeOut();
            $buttons.eq(1).fadeIn();
            currButtons = 2;
            
            enableIndicator();
            
            slider.canvas.removeEventListener('mousedown', onFirstTouch);
            slider.canvas.removeEventListener('touchstart', onFirstTouch);
            
        }
        
        slider.canvas.addEventListener('mousedown', onFirstTouch)
        slider.canvas.addEventListener('touchstart', onFirstTouch)
        
        function onResize() {
            
            fitText( $answers );
            slider.setSize( window.innerWidth, window.innerHeight );
            
        }
        
        window.addEventListener('resize', onResize);
        
        onResize();
        slider.tick();
        
        function enableIndicator () {
            
            slider.onChange = positionIndicator;
            
            slider.canvas.addEventListener('mousedown', indicatorDown);
            slider.canvas.addEventListener('touchstart', indicatorDown);

            slider.canvas.addEventListener('mouseup', indicatorUp);
            slider.canvas.addEventListener('touchend', indicatorUp);
            
        }
        
        function disableIndicator () {
            
            slider.onChange = false;
            
            slider.canvas.removeEventListener('mousedown', indicatorDown);
            slider.canvas.removeEventListener('touchstart', indicatorDown);

            slider.canvas.removeEventListener('mouseup', indicatorUp);
            slider.canvas.removeEventListener('touchend', indicatorUp);
            
        }
        
        function indicatorDown() {
            
            $buttons.eq(1).fadeIn();
            $buttons.eq(currButtons).fadeOut();
            
        }
        
        function indicatorUp () {
            
            $buttons.eq(currButtons).fadeIn();
            $buttons.eq(1).fadeOut();
            
        }
        
        var indicatorText = $buttons.eq(1).children()[0];
        
        function positionIndicator () {
            
            var x = slider.valueToScreen( slider.value );
            
            indicatorText.innerText = Math.round( Math.abs( slider.value ) * 100 ) + '%';
            
            transformButtons( 1, 'translate3d(' + x + 'px, 0, 0)' );
            
        }
        
        function ask () {
            
            var q = questions[ currQuestion ];
            
            $question.text( q.question );
            $leftAnswer.text( q.left.answer );
            $rightAnswer.text( q.right.answer );
            
            fitText( $answers );
            
            slider.enableSlider();
            
            if( currQuestion === 0 ) {
                
                $body.addClass('show-questions');
                tween( 1.4, 0, 2500, 'quadInOut', x => slider.setUniform( 'subtract', x ) );
                
            } else if ( currQuestion === 1 ) {
                
                //$buttons.eq(1).css({opacity: 0, display: 'none'}).addClass('buttons_hidden')
                $buttons.eq(2).css({opacity: 0, display: 'none'}).addClass('buttons_hidden')
                $buttons.eq(3).css('opacity', 0).removeClass('buttons_hidden');
                currButtons = 3;
                
            }
            
            transformAll( '' );
            
            tween( currQuestion === 0 ? 2500 : 1500, opacityAll )
            
            awaitButton()
                .then(applyAnswer)
                .then(() => {
                    
                    currQuestion++;
                    
                    if ( currQuestion <= questions.length - 1 ) {
                    
                        ask();
                    
                    } else {
                        
                        transformAll( '' );
                        
                        $question.html( BEFORE_SUBMIT );
                        
                        tween( 1500, x => {
                            $buttons[0].style.opacity = x;
                            $question[0].style.opacity = x;
                        });
                        
                        disableIndicator();
                        slider.disableSlider();
                        slider.enableCameraControls();
                        
                        resolve( answers );
                        
                    }
                    
                });
            
        }
        
        function opacityAll ( x ) {
            
            $question[0].style.opacity = x;
            $buttons.eq(currButtons)[0].style.opacity = x;
            $leftAnswer[0].style.opacity = x;
            $rightAnswer[0].style.opacity = x;
            
        }
        
        function transformButtons ( index, value = '' ) {
            
            $buttons[ index ].style[ PREFIXED_TRANSFORM ] = value + ' translate(-50%, 0)';
            
        }
        
        function transformAll( value = '' ) {
            
            $question[0].style[ PREFIXED_TRANSFORM ] = value + ' translate(-50%, 0)';
            transformButtons( currButtons, value );
            $leftAnswer[0].style[PREFIXED_TRANSFORM] = value + ' translate(-50%, -50%)';
            $rightAnswer[0].style[PREFIXED_TRANSFORM] = value + ' translate(-50%, -50%)';
            
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
                    $buttonConfirm.off('click', onConfirm);
                    $buttonSkip.off('click', onSkip);
                }
                
                $buttonConfirm.on('click', onConfirm);
                $buttonSkip.on('click', onSkip);
                
            })
            
        }
        
        function getUniformTween ( question, answer ) {
            
            var uniform, from, to;
            
            if ( question.left.uniform === question.right.uniform ) {
                
                uniform = question.left.uniform;
                to = scale( answer, -1, 1, question.left.max, question.right.max );
                
            } else {
                
                if ( answer < 0 ) {
                    
                    answer = Math.abs( answer );
                    
                    uniform = question.left.uniform;
                    to = scale( answer, 0, 1, question.left.min, question.left.max );
                    
                } else {
                    
                    uniform = question.right.uniform;
                    to = scale( answer, 0, 1, question.right.min, question.right.max );
                    
                }
                
            }
            
            from = slider.uniformKeys[ uniform ].value;
            
            return { uniform, from, to };
            
        }
        
        function applyAnswer ( confirm ) {
            
            slider.disableSlider();
            
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
        
    })
    
}