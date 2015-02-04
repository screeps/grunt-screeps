'use strict';

var grunt = require('grunt'),
    nock = require('nock'),
    api = nock('https://screeps.com')
        .post('/api/user/code', {"modules":{"hello":"console.log(\"Hello world!\");","main":"require(\"hello\");"}})
        .reply(200, '{"ok":1}');


exports.screeps = {
    setUp: function (done) {
        done();
    },
    test: function (test) {
        test.expect(1);
        api.done();
        test.done();
    }
};
