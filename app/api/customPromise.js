"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function successPromise(param) {
    return new Promise((resolve, reject) => {
        resolve(param);
    });
}
exports.successPromise = successPromise;
function failPromise(param) {
    return new Promise((resolve, reject) => {
        reject(param);
    });
}
exports.failPromise = failPromise;
//# sourceMappingURL=customPromise.js.map