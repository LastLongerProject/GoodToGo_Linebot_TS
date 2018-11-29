const logFactory = require('debug');

export function log(namespace) {
    const log = logFactory(namespace);
    const error = logFactory(namespace);
    log.log = function (...args: Array<any>) {
        console.log(...args[Symbol.iterator]);
    };

    return {
        log,
        error,
    };
};