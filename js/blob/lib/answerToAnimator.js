var answerToParams = require('./answerToParams');
var scale = require('./scale');

function scaler1D ( from, to, setter, uniform ) {
    
    return function ( x ) {
        
        var value = scale( x, 0, 1, from, to );
        
        setter( uniform, value );
        
    }
    
}

module.exports = function ( question, paramsFrom, answerTo, setter ) {
    
    if ( question.left.uniform === question.right.uniform ) {
        
        var min = question.left.max;
        var max = question.right.max;
        
        var uniform = question.left.uniform;
        
        var paramFrom = paramsFrom[ uniform ];
        var paramTo = scale( answerTo, -1, 1, min, max );
        
        return scaler1D( paramFrom, paramTo, setter, uniform );
        
    }
    
    var fromLeft = paramsFrom[ question.left.uniform ] > 0;
    var toLeft = answerTo < 0;
    
    if ( fromLeft === toLeft ) {
        
        var side = fromLeft ? question.left : question.right;
        
        var { uniform, min, max } = side;
        
        var paramFrom = paramsFrom[ side.uniform ];
        var paramTo = scale( Math.abs( answerTo ), 0, 1, min, max );
        
        return scaler1D( paramFrom, paramTo, setter, uniform );
        
    } else {
        
        var fromSide = fromLeft ? question.left : question.right;
        var toSide = answerTo < 0 ? question.left : question.right;
        
        var fromUniform = fromSide.uniform;
        var toUniform = toSide.uniform;
        
        var paramFrom = paramsFrom[ fromUniform ];
        var paramTo = scale( Math.abs( answerTo ), 0, 1, toSide.min, toSide.max );
        
        var range = paramFrom + paramTo;
        var threshold = paramFrom / range;
        
        return function ( x ) {
            
            if ( x < threshold ) {
                
                setter( toUniform, 0 );
                setter( fromUniform, scale( x, 0, threshold, paramFrom, 0 ) );
                
            } else {
                
                setter( fromUniform, 0 );
                setter( toUniform, scale( x, threshold, 1, 0, paramTo ) );
                
            }
            
        }
        
    }
    
}