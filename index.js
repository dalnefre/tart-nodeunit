/*

index.js - "tart-nodeunit": nodeunit adapter for tart

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

var tart = require('tart-tracing');

/*
  * `test`: _Object_ nodeunit test object.
  * Return: _Object_ The testing control object.
    * `sponsor`: _Function_ `function (behavior) {}` A capability to create
        new actors.
    * `dispatch`: _Function_ `function ([count]) {}` Function to call to
        dispatch events.  Returns `true` when there are no more events.
    * `tracing`: _Object_ Tracing control object.
*/
module.exports.testing = function testing(test) {
    var tracing = tart.tracing();
/*
    var tracing = tart.tracing({
        enqueue: function enqueue(eventQueue, events) {
            Array.prototype.push.apply(eventQueue, events);
        },
        dequeue: function dequeue(eventQueue) {
            return eventQueue.shift();
        }
    });
*/

    var dispatch = function dispatch(count) {
        while ((count === undefined) || (--count >= 0)) {
            var effect = tracing.dispatch();
//            console.log(effect);
            if (effect === false) {
                return true;
            }
        }
        return false;
    }

    return {
        sponsor: tracing.sponsor,
        dispatch: dispatch,
        tracing: tracing
    };
    return exports;
};