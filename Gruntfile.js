/*
 * grunt-screeps
 * https://github.com/screeps/grunt-screeps
 *
 * Copyright (c) 2015 Artem Chivchalov
 * Licensed under the MIT license.
 */

'use strict';

require('./test/screeps_test');
require('./test/screeps_empty_test');

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Configuration to be run (and then tested).
        screeps: {
            options: {
                email: 'EMAIL',
                password: 'PASSWORD',
                branch: 'default'
            },
            test: {
                src: ['test/fixtures/happy/*']
            }
        },

        // Unit tests.
        nodeunit: {
            tests: [],
            testHappy: ['test/screeps_test.js'],
            testEmpty: ['test/screeps_empty_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test-happy', ['screeps', 'nodeunit:testHappy']);
    grunt.registerTask('test-empty', ['screeps', 'nodeunit:testEmpty']);

    grunt.registerTask('switch-to-empty-tests', function () {
        grunt.config.set('screeps.test.src', ['test/fixtures/empty/*']);
    });

    // By default, lint and run all tests.
    grunt.registerTask('default', [
        'jshint',
        'test-happy',
        'switch-to-empty-tests',
        'test-empty'
    ]);

};
