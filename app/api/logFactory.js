const logFactory = require('debug');

module.exports = function log(namespace) {
    const log = logFactory(namespace);
    const error = logFactory(namespace);
    log.log = function(...args) {
        console.log(...args);
    };

    return {
        log,
        error,
    };
};