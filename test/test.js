/*

test.js - test script

The MIT License (MIT)

Copyright (c) 2013 Dale Schumacher, Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/
"use strict";

var adapter = require('../index.js');

var test = module.exports = {};

test["dispatch delivers all messages and calls test.done()"] = function (test) {
    test.expect(2);
    var testing = adapter.testing(test);

    var first = function first(message) {
        test.equal(message, 'first');
        this.self('second');
        this.behavior = second;
    };
    var second = function second(message) {
        test.equal(message, 'second');
        this.behavior = boom;
    };
    var boom = function boom(message) {
        throw new Error('Should not be called!');
    };

    var actor = testing.sponsor(first);
    actor('first');
    
    testing.dispatch();
};

test["sponsor creates an actor"] = function (test) {
    test.expect(1);
    var testing = adapter.testing(test);

    var actor = testing.sponsor(function (message) {  // create
        test.ok(message);
    });
    actor(true);  // send

    var done = testing.dispatch();
    if (done !== true) {
        test.done();
    }
};

test["dispatch delivers limited number of events"] = function (test) {
    test.expect(4);
    var testing = adapter.testing(test);

    var actor = testing.sponsor(function (message) {  // create
        test.ok(message);
        this.self(message + 1);  // send
    });
    actor(1);  // send

    var done = testing.dispatch(3);
    test.strictEqual(done, false);
    test.done();
};

test["example from tart-tracing exercises all actor primitives"] = function (test) {
    test.expect(3);
    var testing = adapter.testing(test);

    var oneTimeBeh = function oneTimeBeh(message) {
        test.equal(message, 'bar');
        var child = this.sponsor(createdBeh); // create
        child('foo'); // send
        this.behavior = becomeBeh; // become
    };
    var createdBeh = function createdBeh(message) {
        test.equal(message, 'foo');
    };
    var becomeBeh = function becomeBeh(message) {
        test.equal(message, 'baz');
    };

    var actor = testing.sponsor(oneTimeBeh);  // create
    actor('bar');  // send
    actor('baz');  // send

    testing.dispatch();
};
