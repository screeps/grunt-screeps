/*
 * grunt-screeps
 * https://github.com/screeps/grunt-screeps
 *
 * Copyright (c) 2015 Artem Chivchalov
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    http = require('http'),
    https = require('https'),
    util = require('util');

module.exports = function (grunt) {

    grunt.registerMultiTask('screeps', 'A Grunt plugin for commiting code to your Screeps account', function () {

        var options = this.options({});

        var server = options.server || {};

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
                var basename = path.basename(filepath),
                    ext = path.extname(basename),
                    name = basename.replace(ext,'');

                if(ext === '.js') {
                    modules[name] = grunt.file.read(filepath, {encoding: 'utf8'});
                }
                else {
                    modules[name] = {binary: grunt.file.read(filepath, {encoding: null}).toString('base64')};
                }
            });

            let customPath;
            if(options.ptr) {
                customPath = '/ptr/api/user/code';
            }
            if(options.season) {
                customPath = '/season/api/user/code';
            }
            let customHeaders = {
                'Content-Type': 'application/json; charset=utf-8'
            };
            let customAuth;
            if(options.token) {
                customHeaders['X-Token'] = options.token;
            }
            else {
                customAuth = options.email + ':' + options.password;
            }

            var proto = server.http ? http : https,
                req = proto.request({
                hostname: server.host || 'screeps.com',
                port: server.port || (server.http ? 80 : 443),
                path: customPath || '/api/user/code',
                method: 'POST',
                auth: customAuth,
                headers: customHeaders
            }, function(res) {
                res.setEncoding('utf8');

                var data = '';

                if(res.statusCode < 200 || res.statusCode >= 300) {
                  grunt.fail.fatal('Screeps server returned error code ' + res.statusCode);
                }

                res.on('data', function(chunk) {
                    data += chunk;
                });

                res.on('end', function() {
                    var serverText = server && server.host || 'Screeps';
                    try {
                      var parsed = JSON.parse(data);
                      serverText = server && server.host || 'Screeps';
                      if(parsed.ok) {
                          var msg = 'Committed to ' + serverText + ' account "' + options.email + '"';
                          if(options.branch) {
                              msg += ' branch "' + options.branch+'"';
                          }
                          if(options.ptr) {
                              msg += ' [PTR]';
                          }
                          if(options.season) {
                              msg += ' [SEASON]';
                          }
                          msg += '.';
                          grunt.log.writeln(msg);
                      }
                      else {
                          grunt.log.error('Error while committing to ' + serverText + ': '+util.inspect(parsed));
                      }
                    } catch (e) {
                      grunt.log.error('Error while processing ' + serverText + ' json: '+e.message);
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
