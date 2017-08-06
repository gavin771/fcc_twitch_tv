var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var install = require("gulp-install");
var del = require('del');

gulp.task('clean', function () {
  return del([
    'dist', '.publish'
  ]);
});

gulp.task('copy', function () {
  gulp
    .src('./src/**/*')
    .pipe(gulp.dest('./dist/src'))
  gulp
    .src('index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['copy'], function () {
  gulp.src(['./bower.json', './package.json'])
    .pipe(gulp.dest('./dist/'))
    .pipe(install());
});

gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});