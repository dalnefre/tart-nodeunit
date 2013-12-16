/*

test.js - test example of non-trivial tart-revocable implementation

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

var adapter = require('../../index.js');
var revocable = require('./implementation.js');

var test = module.exports = {};

test['proxy() should return a revocable proxy and a revoke capability'] = function (test) {
    test.expect(3);
    var testing = adapter.testing(test);

    var secret, proxy, revoke;

    var failBeh = function failBeh(message) {
        test.equal(false, "should not receive message");
    };

    var secretBeh = function secretBeh(message) {
        test.equal(message, 'hello');
        this.behavior = failBeh; // should not receive any more messages
        var ackCustomer = this.sponsor(ackCustomerBeh);
        revoke(ackCustomer);
    };

    var ackCustomerBeh = function ackCustomerBeh(message) {
        test.ok(true); // revoke was acked
        proxy('hello again'); // should never reach `secret`
    };

    secret = testing.sponsor(secretBeh);

    var capabilities = revocable.proxy(secret);
    proxy = testing.sponsor(capabilities.proxyBeh);
    revoke = testing.sponsor(capabilities.revokeBeh);

    proxy('hello');

	var ignoreExceptions = function fail(exception) {};
    test.ok(testing.dispatch({ fail: ignoreExceptions }));
    test.done();
};