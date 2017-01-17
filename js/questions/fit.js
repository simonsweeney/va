var $ = require('jquery');

var BASE_SIZE = 200;
var TARGET_WIDTH = .3;

$.fn.fit = function(){
  
  var targetWidth = TARGET_WIDTH * window.innerWidth;
  
  this.css( 'fontSize', BASE_SIZE );
  
  var leftWidth = this.eq(0).width();
  var rightWidth = this.eq(1).width();
  
  var scale = targetWidth / Math.max( leftWidth, rightWidth );
  
  this.css( 'fontSize', BASE_SIZE * scale );
    
    // var $dstLeft = this.eq(0);
    // var $dstRight = this.eq(1);

    // var $srcLeft = $dstLeft.children();
    // var $srcRight = $dstRight.children();

    // var base_size = parseInt($srcLeft.css("fontSize"));
    
    
    // var getScale = function($dst, $src) {
    //   var dstWidth = $dst.width();
    //   var srcWidth = $src.width();
    //   var scale = $dst.width() / $src.width();
    //   return scale;
    // }

    // var leftScale = getScale($dstLeft, $srcLeft);
    // var rightScale = getScale($dstRight, $srcRight);
    // var scale = Math.min(leftScale,rightScale);
    
    // $srcLeft.css("fontSize", base_size * scale + "px"); 
    // $srcRight.css("fontSize", base_size * scale + "px"); 
      
}