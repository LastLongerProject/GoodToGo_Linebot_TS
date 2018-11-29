"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isMobilePhone(phone) {
    var reg = /^[09]{2}[0-9]{8}$/;
    var res = reg.test(phone);
    if (res)
        return true;
    else
        return false;
}
exports.isMobilePhone = isMobilePhone;
function randomHexString(amount) {
    var text = '';
    var charSet = "0123456789ABCDEF";
    for (var i = 0; i < amount; i++) {
        text += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    return text;
}
exports.randomHexString = randomHexString;
//# sourceMappingURL=tool.js.map