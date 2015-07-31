/*
 * grunt-screeps
 * https://github.com/screeps/grunt-screeps
 *
 * Copyright (c) 2015 Artem Chivchalov
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    https = require('https'),
    util = require('util');

module.exports = function (grunt) {

    grunt.registerMultiTask('screeps', 'A Grunt plugin for commiting code to your Screeps account', function () {

        var options = this.options({});

        var modules = {};

        var done = this.async();

        this.files.forEach(function (f) {

            f.src.filter(function (filepath) {

                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                var name = path.basename(filepath).replace(/\.js$/,'');
                modules[name] = grunt.file.read(filepath);
            });


            var req = https.request({
                hostname: 'screeps.com',
                port: 443,
                path: '/api/user/code',
                method: 'POST',
                auth: options.email + ':' + options.password,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }, function(res) {
                res.setEncoding('utf8');

                var data = '';

                res.on('data', function(chunk) {
                    data += chunk;
                });

                res.on('end', function() {
                    data = JSON.parse(data);
                    if(data.ok) {
                        var msg = 'Commited to Screeps account "' + options.email + '"';
                        if(options.branch) {
                            msg += ' branch "' + options.branch+'"';
                        }
                        msg += '.';
                        grunt.log.writeln(msg);
                    }
                    else {
                        grunt.log.error('Error while commiting to Screeps: '+util.inspect(data));
                    }
                    done();
                });
            });

            var postData = {modules: modules};
            if(options.branch) {
                postData.branch = options.branch;
            }
            req.write(JSON.stringify(postData));
            req.end();
        });
    });

};
