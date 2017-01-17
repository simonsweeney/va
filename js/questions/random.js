var questions = require('./questions.json');
var scale = require('../lib/scale');

module.exports = function () {
    
    var params = {};
    
    questions.forEach( q => {
        
        var uniform, min, max;
        
        if ( q.left.uniform === q.right.uniform ) {
            
            uniform = q.left.uniform;
            min = q.left.max;
            max = q.right.max;
            
        } else if ( Math.random() > .5 ) {
            
            uniform = q.left.uniform;
            min = q.left.min;
            max = q.left.max;
            
        } else {
            
            uniform = q.right.uniform;
            min = q.right.min;
            max = q.right.max;
            
        }
        
        params[ uniform ] = scale( Math.random(), 0, 1, min, max );
        
    })
    
    return params;
    
}