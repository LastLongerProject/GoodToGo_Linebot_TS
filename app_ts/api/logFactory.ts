var factory = require('debug');

module.exports= function log(namespace) {
    const log = factory(namespace);
    const error = factory(namespace);
    log.log = function (...args: Array<any>) {
        console.log(...args[Symbol.iterator]());
    };

    return {
        log,
        error,
    };
};