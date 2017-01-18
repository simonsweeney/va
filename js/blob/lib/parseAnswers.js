var scale = require('../lib/scale');

module.exports = function( questions, answers ) {
    
    var params = {};
    
    questions.forEach( (question, i) => {
        
        var answer = answers[ i ];
        
        var uniform, oldMin, oldMax, newMin, newMax;
        
        if ( answer === 0 || answer === null ) {
            
            return;
            
        } else if ( question.left.uniform === question.right.uniform ) {
            
            uniform = question.left.uniform;
            oldMin = -1;
            oldMax = 1;
            newMin = question.left.max;
            newMax = question.right.max;
            
        } else if ( answer >= 0 ) {
            
            uniform = question.left.uniform;
            oldMin = 0;
            oldMax = 1;
            newMin = question.left.min;
            newMax = question.left.max;
            
        } else {
        
            uniform = question.right.uniform;
            oldMin = 0;
            oldMax = 1;
            newMin = question.right.min;
            newMax = question.right.max;
            
        }
        
        params[ uniform ] = scale( answer, oldMin, oldMax, newMin, newMax );
        
    });
    
    return params;

    
}