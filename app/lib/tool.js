"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const customPromise_1 = require("./customPromise");
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
    var dayFormatted = intReLength(dayFormatter(DateObject), 2);
    var monthFormatted = intReLength(DateObject.getMonth() + 1, 2);
    return (DateObject.getFullYear() +
        '/' +
        monthFormatted +
        '/' +
        dayFormatted);
}
exports.getTimeString = getTimeString;
function getBorrowTimeInterval(startDate, returnDate) {
    var dayFormatted_start = intReLength(dayFormatter(startDate), 2);
    var monthFormatted_start = intReLength(startDate.getMonth() + 1, 2);
    var dayFormatted_return = intReLength(dayFormatter(returnDate), 2);
    var monthFormatted_return = intReLength(returnDate.getMonth() + 1, 2);
    return (monthFormatted_start + '/' + dayFormatted_start + ' - ' + monthFormatted_return + '/' + dayFormatted_return);
}
exports.getBorrowTimeInterval = getBorrowTimeInterval;
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
function getUserDetail(phone) {
    return __awaiter(this, void 0, void 0, function* () {
        let payload = {
            jti: 'manager',
            iat: Date.now(),
            exp: Date.now() + 86400000 * 3,
        };
        let auth = jwt_simple_1.default.encode(payload, global.gConfig.serverKey.secretKey);
        let result = yield axios_1.default({
            method: 'get',
            url: global.gConfig.apiBaseUrl + '/manage/userDetail?id=' + phone,
            headers: {
                'Authorization': auth,
                'Apikey': global.gConfig.serverKey.apiKey
            }
        }).then(response => {
            let usingAmount = response.data.usingAmount;
            let lostAmount = response.data.lostAmount;
            let lineToken = response.data.userLineToken;
            let contribution = response.data.contribution;
            let totalUsageAmount = response.data.totalUsageAmount;
            return customPromise_1.successPromise({
                usingAmount,
                lostAmount,
                lineToken,
                contribution,
                totalUsageAmount
            });
        }).catch(err => {
            customPromise_1.failPromise(err);
        });
        return result;
    });
}
exports.getUserDetail = getUserDetail;
//# sourceMappingURL=tool.js.map