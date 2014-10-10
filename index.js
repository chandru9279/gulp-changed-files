var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var crypto = require('crypto');
var fs = require('fs');
var through = require('through2');
'use strict';

module.exports = function (opt) {
    if (!opt) throw new PluginError('gulp-changed-files', 'Missing mandatory options for gulp-changed-files');
    if (!opt.targetDir) throw new PluginError('gulp-changed-files', 'Missing targetDir option for gulp-changed-files');
    if (!opt.baseDir) throw new PluginError('gulp-changed-files', 'Missing baseDir option for gulp-changed-files');

    function transform(file, enc, callback) {
        var vinylFile = file.path;
        var targetFile = file.path.replace(opt.baseDir, opt.targetDir);
        // TODO: Log when debug

        console.log(file.path)
        console.log(opt.baseDir)
        console.log(opt.targetDir)
        console.log(targetFile)
        if (file.isNull()) return; // ignore
        if (file.isStream()) return this.emit('error', new PluginError('gulp-changed-files', 'Streaming not supported'));

        // TODO: dont compare is file sizes differ

        var vinylDigest = crypto.createHash('sha1').update(file.contents).digest('hex');
        var targetDigest = crypto.createHash('sha1').update(fs.readFileSync(targetFile)).digest('hex');
        if (vinylDigest === targetDigest) {
            console.log('Not copying ' + vinylFile + ' to ' + targetFile)
        } else {
            console.log('Copying ' + vinylFile + ' to ' + targetFile)
            this.push(file)
        }
        return callback();
    }

    function flush() {
    }

    return through.obj(transform, flush);
};
