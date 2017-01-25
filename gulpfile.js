var gulp = require('gulp');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
    gulp.src('sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
			browsers: ['>1%']
		}))
        .pipe(gulp.dest('.'))
})

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var stringify = require('stringify');
var streamify = require('gulp-streamify');

watchify.args.entries = ['./js/main.js'];
watchify.args.debug = true;

var b = watchify( browserify( watchify.args ) );

b.on('update', bundle);
b.on('log', gutil.log);

b.transform(stringify, {
	appliesTo: { includeExtensions: ['.html', '.svg', '.c'] }
})

b.transform('glslify');
b.transform( 'babelify', { presets: ['es2015'] } )

gulp.task( 'js', bundle );

function bundle () {
	
	return b.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error:'))
		.pipe( source('./bundle.js') )
		.pipe( buffer() )
		.pipe( streamify( uglify() ) )
	    .pipe(gulp.dest('./'));
		
}

// gulp.task('browserify', function(){
	
// 	return browserify({
// 	        entries: './js/main.js',
// 	        debug: true
// 	    })
// 	    .transform('glslify')
//     	.transform(stringify, {
//             appliesTo: { includeExtensions: ['.html', '.xml', '.txt'] }
//         })
//         //.transform('babelify', { presets: ['es2015'] })
// 	    .bundle()
// 	    .pipe( source('./bundle.js') )
// 	    .pipe( buffer() )
// 	    //.pipe( uglify() )
// 	    .on( 'error', gutil.log )
// 	    .pipe( gulp.dest('./') );
	
// })

gulp.task('default', ['sass', 'js'], function() {
	//gulp.watch(['./js/**/*', '!**/node_modules/**'], ['browserify']);
	gulp.watch('./sass/**/*', ['sass']);
});
