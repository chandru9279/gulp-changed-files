var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var crypto = require('crypto');
var fs = require('fs');
var through = require('through2');
'use strict';

module.exports = function (file, opt) {
    if (!file) throw new PluginError('gulp-concat', 'Missing file option for gulp-concat');
    if (!opt) opt = {};

    function transform(file) {
        if (file.isNull()) return; // ignore
        if (file.isStream()) return this.emit('error', new PluginError('gulp-changed-files', 'Streaming not supported'));
        var digest = crypto.createHash('sha1').update(file.contents).digest('hex');
        console.log(digest);
    }

    function flush() {
    }

    return through(transform, flush);
};
