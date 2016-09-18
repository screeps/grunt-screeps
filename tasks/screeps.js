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
            if (!f.src.length) {
                grunt.log.error('No files found. Stopping.');
                done();
                return;
            }

            f.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                var name = path.basename(filepath).replace(/\.js$/,'');

                var path_array = filepath.split('/');
                if(path_array.length > 2){
                  var new_path = '';
                  for(var n = 1; n < path_array.length; n++){
                    if(path_array[n] != 'main'){
                      new_path += (new_path.length ? '.' : '') + path_array[n];
                    }
                  }
                  name = new_path.replace(/\.js$/,'');
                }
                
                modules[name] = grunt.file.read(filepath);
            });

            var req = https.request({
                hostname: 'screeps.com',
                port: 443,
                path: options.ptr ? '/ptr/api/user/code' : '/api/user/code',
                method: 'POST',
                auth: options.email + ':' + options.password,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }, function(res) {
                res.setEncoding('utf8');

                var data = '';

                if(res.statusCode < 200 || res.statusCode >= 300) {
                  grunt.fail.fatal('Screeps server returned error code ' + res.statusCode)
                }

                res.on('data', function(chunk) {
                    data += chunk;
                });

                res.on('end', function() {
                    try {
                      var parsed = JSON.parse(data);
                      if(parsed.ok) {
                          var msg = 'Committed to Screeps account "' + options.email + '"';
                          if(options.branch) {
                              msg += ' branch "' + options.branch+'"';
                          }
                          if(options.ptr) {
                              msg += ' [PTR]';
                          }
                          msg += '.';
                          grunt.log.writeln(msg);
                      }
                      else {
                          grunt.log.error('Error while commiting to Screeps: '+util.inspect(parsed));
                      }
                    } catch (e) {
                      grunt.log.error('Error while processing json: '+e.message);
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
