"use strict";
var factory = require('debug');
module.exports = function log(namespace) {
    const log = factory(namespace);
    const error = factory(namespace);
    log.log = function (...args) {
        console.log(...args[Symbol.iterator]());
    };
    return {
        log,
        error,
    };
};
//# sourceMappingURL=logFactory.js.map