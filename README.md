# tart-nodeunit

Adapter for `nodeunit` testing ([tart](https://github.com/organix/tartjs) module)

## Contributors

[@dalnefre](https://github.com/dalnefre), [@tristanls](https://github.com/tristanls)

## Overview

Adapter for `nodeunit` testing ([tart](https://github.com/organix/tartjs) module)

  * [Usage](#usage)
  * [Tests](#tests)
  * [Documentation](#documentation)
  * [Sources](#sources)

## Usage

To run the below example run:

    npm run test

```javascript
"use strict";

var adapter = require('../index.js');

var test = module.exports = {};

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

    if (testing.dispatch()) {
        test.done();
    }
};
```

## Tests

    npm test

## Documentation

`tart-nodeunit` is an adaptor for running `nodeunit` tests.

**Public API**

  * [tart.testing(test)](#tarttestingtest)
  * [testing.sponsor(behavior)](#testingsponsorbehavior)
  * [testing.dispatch(\[count\])](#testingdispatchcount)

### tart.testing(test)

  * `test`: _Object_ nodeunit test object.
  * Return: _Object_ The testing control object.
    * `sponsor`: _Function_ `function (behavior) {}` A capability to create
        new actors.
    * `dispatch`: _Function_ `function ([count]) {}` Function to call to
        dispatch events.  Returns `true` when there are no more events.
    * `tracing`: _Object_ Tracing control object.

Returns the testing control object.

### testing.sponsor(behavior)

  * `behavior`: _Function_ `function (message) {}` Actor behavior to invoke every time an actor receives a message.
  * Return: _Function_ `function (message) {}` Actor reference in form of a capability that can be invoked to send the actor a message.

Creates a new (traceable) actor and returns the actor reference in form of a capability to send that actor a message.

```javascript
var adapter = require('../index.js');
var test = module.exports = {};
test["sponsor creates an actor"] = function (test) {
    test.expect(1);
    var testing = adapter.testing(test);

    var actor = testing.sponsor(function (message) {  // create
        test.ok(message);
    });
    actor(true);  // send

    testing.dispatch();
    test.done();
};
```

### testing.dispatch(\[count\])

  * `count`: _Number_ _(Default: undefined)_ Maximum number of events to dispatch,
    or unlimited if `undefined`.
  * Return: _Boolean_. `true` if event queue is exhausted, otherwise `false`.

Dispatch events.
If `count` is specified, dispatch at most `count` events.
When the event queue is exhausted, return `true`.
Otherwise return `false`.

```javascript
var adapter = require('../index.js');
var test = module.exports = {};
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
```

## Sources

  * [Tiny Actor Run-Time (JavaScript)](https://github.com/organix/tartjs)
