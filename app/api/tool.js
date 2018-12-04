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
    var charSet = '0123456789ABCDEF';
    for (var i = 0; i < amount; i++) {
        text += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    return text;
}
exports.randomHexString = randomHexString;
function isVerificationCode(code) {
    var reg = /[0-9]{6}/;
    var res = reg.test(code);
    if (res)
        return true;
    else
        return false;
}
exports.isVerificationCode = isVerificationCode;
function getTimeString(DateObject) {
    var tmpHour = DateObject.getHours() + 8;
    var dayFormatted = intReLength(dayFormatter(DateObject), 2);
    var monthFormatted = intReLength(DateObject.getMonth() + 1, 2);
    var hoursFormatted = intReLength(tmpHour >= 24 ? tmpHour - 24 : tmpHour, 2);
    var minutesFormatted = intReLength(DateObject.getMinutes(), 2);
    return (DateObject.getFullYear() +
        '/' +
        monthFormatted +
        '/' +
        dayFormatted +
        ' ' +
        hoursFormatted +
        ':' +
        minutesFormatted);
}
exports.getTimeString = getTimeString;
function dayFormatter(dateToFormat) {
    if (dateToFormat.getHours() >= 16)
        dateToFormat.setDate(dateToFormat.getDate() + 1);
    return dateToFormat.getDate();
}
exports.dayFormatter = dayFormatter;
function intReLength(data, length) {
    var str = data.toString();
    if (length - str.length) {
        for (let j = 0; j <= length - str.length; j++) {
            str = '0' + str;
        }
    }
    return str;
}
exports.intReLength = intReLength;
function getYearAndMonthString(DateObject) {
    return (DateObject.getFullYear().toString() +
        '年' +
        (DateObject.getMonth() + 1).toString() +
        '月');
}
exports.getYearAndMonthString = getYearAndMonthString;
function isToday(d) {
    let today = new Date();
    if (d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDay() === today.getDay()) {
        return true;
    }
    return false;
}
exports.isToday = isToday;
//# sourceMappingURL=tool.js.map