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

var servers = {
    persistent: { name: 'Screeps', host: 'screeps.com', path: '/api/user/code' },
    ptr: { name: 'PTR', host: 'screeps.com', path: '/ptr/api/user/code' },
    season: { name: 'Season', host: 'screeps.com', path: '/season/api/user/code' }
};

module.exports = function (grunt) {

    grunt.registerMultiTask('screeps', 'A Grunt plugin for commiting code to your Screeps account', function () {

        var options = this.options({});

        var server = options.server || (options.ptr ? 'ptr' : 'persistent');
        if(servers[server]) {
            server = servers[server];
        }

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

            var requestOptions = {
                hostname: server.host || 'screeps.com',
                port: server.port || (server.http ? 80 : 443),
                path: server.path || '/api/user/code',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            };
            if(options.token) {
                requestOptions.headers['X-Token'] = options.token;
            } else {
                requestOptions.auth = options.email + ':' + options.password;
            }
            var proto = server.http ? http : https,
                req = proto.request(requestOptions, function(res) {
                res.setEncoding('utf8');

                var data = '';

                if(res.statusCode < 200 || res.statusCode >= 300) {
                  grunt.fail.fatal('Screeps server returned error code ' + res.statusCode);
                }

                res.on('data', function(chunk) {
                    data += chunk;
                });

                res.on('end', function() {
                    var serverText = server && (server.name || server.host) || 'Screeps';
                    try {
                      var parsed = JSON.parse(data);
                      if(parsed.ok) {
                          var msg = 'Committed to ' + serverText + ' account "' + options.email + '"';
                          if(options.branch) {
                              msg += ' branch "' + options.branch+'"';
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
