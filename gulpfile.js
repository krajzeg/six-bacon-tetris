var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('build-js', function() {
    browserify({
	    entries: 'src/tetris.js',
	    debug: true
    })
    .on('error', logErrors)
    .transform(babelify)
    .on('error', logErrors)
    .bundle()
    .on('error', logErrors)
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task("watch", ['build-js'], function(){
    gulp.watch('src/**/*.js', ['build-js'])
});

gulp.task('default', ['watch']);

function logErrors(e) {
	console.error("Build error:", e.message);
}