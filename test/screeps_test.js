'use strict';

var grunt = require('grunt'),
    nock = require('nock'),
        happy = nock('https://screeps.com')
        .post(
            '/api/user/code',
            {"branch": "default", "modules":{ "hello":"console.log(\"Hello world!\");", "main":"require(\"hello\");", "native": {"binary": "TmF0aXZlIGNvbnRlbnQ=" } } }
        )
        .reply(200, '{"ok":1}');


exports.screeps = {
    test: function (test) {
        test.expect(1);
        test.ok(happy.isDone());
        test.done();
    }
};
