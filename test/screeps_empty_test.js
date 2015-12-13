'use strict';

var grunt = require('grunt'),
    nock = require('nock'),
        empty = nock('https://screeps.com')
        .post('/api/user/code', {"branch": "default", "modules":{}})
        .reply(200, '{"ok":1}');

exports.screeps = {
    testEmpty: function (test) {
        test.expect(1);
        // Expect the mock to be pending, because we don't want to post an empty set of modules.
        test.equal(empty.pendingMocks().length, 1);
        test.done();
    }
};
