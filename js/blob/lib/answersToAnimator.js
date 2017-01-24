var answerToAnimator = require('./answerToAnimator');

module.exports = function ( questions, fromParams, toAnswers, setter ) {
    
    var fns = questions.map( (question, i) => {
        
        return answerToAnimator( question, fromParams, toAnswers[ i ], setter );
        
    })
    
    return function ( x ) {
        
        fns.forEach( fn => fn( x ) );
        
    }
    
}