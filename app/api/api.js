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
//# sourceMappingURL=api.js.map