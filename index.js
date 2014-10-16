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
    
    function logSame(vinylFile, targetFile) {
        if(opt.debug)
            console.log('SAME         : ' + vinylFile + ' and ' + targetFile);
    }
    
    function logDiff(vinylFile, targetFile) {
        if(opt.debug)
            console.log('DIFFERENT : ' + vinylFile + ' and ' + targetFile);
    }

    function transform(file, enc, callback) {
        var vinylFile = file.path;
        var targetFile = path.normalize(file.path).replace(path.normalize(opt.baseDir), path.normalize(opt.targetDir));

        if (file.isNull()) return callback(); // ignore
        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-changed-files', 'Streaming not supported'));
            return callback();
        }
        if(!fs.existsSync(vinylFile)) {
            console.log('Source file does not exist ' + vinylFile);
            return callback();
        }
        if(!fs.existsSync(targetFile)) {
            this.push(file);
            return callback();
        }

        var sourceStat = fs.statSync(vinylFile);
        var targetStat = fs.statSync(targetFile);
        if (sourceStat["size"] == targetStat["size"]) {
            logSame(vinylFile, targetFile);
            return callback();
        }

        var vinylDigest = crypto.createHash('sha1').update(file.contents).digest('hex');
        var targetDigest = crypto.createHash('sha1').update(fs.readFileSync(targetFile)).digest('hex');
        if (vinylDigest === targetDigest) {
            logSame(vinylFile, targetFile);
        } else {
            logDiff(vinylFile, targetFile);
            this.push(file)
        }
        return callback();
    }

    return through.obj(transform);
};
