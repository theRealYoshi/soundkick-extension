'use strict';

var gulp = require('gulp');
var zip = require('gulp-zip');

var files = ['./public/*'];
var xpiName = 'test.xpi';

gulp.task('default', function () {
  gulp.src(files)
	.pipe(zip(xpiName))
	.pipe(gulp.dest('.'));
  console.log(files, xpiName);
});
