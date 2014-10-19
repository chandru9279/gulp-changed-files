gulp-changed-files
==================

Compares files from stream, with files from target folder. Passes through only changed files. Compares by sha1 digest

```node 
gulp.task('move', function() {
    return gulp.src('./source', {read: false})
        .pipe(changed({
            baseDir:'./source',
            targetDir:'./target'
        }))
        .pipe(gulp.dest('./target'));
});
```

It works as follows :

* For each incoming vinyl file, it finds the file to compare against, by string replacing `baseDir` to `targetDir` on the vinyl `file.path`
* If the target file exists compares by hash, and passes the vinyl file downstream if it is "different" from targetFile.
