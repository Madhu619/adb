var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');


gulp.task('js', function(){
  gulp.src('./js/*.js')
  .pipe(concat('index.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./js/'));
});

gulp.task('less', function(){
  gulp.src('../less/*.less')
  .pipe(concat('index.css'))
  .pipe(minify())
  .pipe(gulp.dest('../less/'));
});

gulp.task('default',['js','less'],function(){
});