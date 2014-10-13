/* jshint strict: true */

var changed = require('../');
var gulp = require('gulp');

gulp.task('clean', function() {
    return gulp.src('./target', {read: false})
        .pipe(clean());
});

gulp.task('move', function() {
    return gulp.src('./source', {read: false})
        .pipe(changed({
            baseDir:'./source',
            targetDir:'./target'
        }))
        .pipe(gulp.dest('./target'));
});