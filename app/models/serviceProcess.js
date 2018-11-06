"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logFactory = require('../api/logFactory.js')('linebot:serviceProcess');
const User = require('./db/userDB');
const Trade = require('./db/tradeDB');
const PlaceID = require('./db/placeIdDB');
const ContainerType = require('./db/containerTypeDB');
const TemporaryInfo = require('./db/temporaryInfoDB');
const RichMenu = require('./db/richMenuDB');
const client = require('../controller/clientDelegate');
var containerTypeDict;
var storeDict;
var BindState;
(function (BindState) {
    BindState.SUCCESS = 'Successfully bound with line', BindState.HAS_BOUND = 'This phone has bound with line', BindState.LINE_HAS_BOUND = 'Line has bound with another phone';
})(BindState = exports.BindState || (exports.BindState = {}));
var DeleteBindState;
(function (DeleteBindState) {
    DeleteBindState.LINE_HAS_NOT_BOUND = 'Line has not bound with a phone num', DeleteBindState.SUCCESS = 'Unbind successfully';
})(DeleteBindState = exports.DeleteBindState || (exports.DeleteBindState = {}));
var DatabaseState;
(function (DatabaseState) {
    DatabaseState.USER_NOT_FOUND = 'Does not find user in db';
})(DatabaseState = exports.DatabaseState || (exports.DatabaseState = {}));
var QrcodeState;
(function (QrcodeState) {
    QrcodeState.SUCCESS = 'Get qrcode successfully';
})(QrcodeState = exports.QrcodeState || (exports.QrcodeState = {}));
var getContribute;
(function (getContribute) {
    getContribute.SUCCESS = 'Get contribute successfully';
})(getContribute = exports.getContribute || (exports.getContribute = {}));
ContainerType.find({}, {}, {
    sort: {
        typeCode: 1
    }
}).then(docs => {
    containerTypeDict = docs;
}).catch(err => logFactory.error(err));
PlaceID.find({}, {}, {
    sort: {
        ID: 1
    }
}).then((err, docs) => {
    storeDict = docs;
}).catch(err => logFactory.error(err));
function successPromise(param) {
    return new Promise((resolve, reject) => {
        resolve(param);
    });
}
function failPromise(param) {
    return new Promise((resolve, reject) => {
        reject(param);
    });
}
function bindLineId(event) {
    return __awaiter(this, void 0, void 0, function* () {
        var dbUser = yield User.findOne({ 'user.phone': event.message.text }).exec();
        if (!dbUser) {
            return successPromise(DatabaseState.USER_NOT_FOUND);
        }
        else {
            let doc = yield User.findOne({ 'user.lineId': event.source.userId }).exec();
            if (!doc) {
                if (typeof dbUser.user.lineId !== 'undefined') {
                    return successPromise(BindState.HAS_BOUND);
                }
                else {
                    dbUser.user.lineId = event.source.userId;
                    try {
                        var saveRes = yield dbUser.save();
                        if (saveRes)
                            return successPromise(BindState.SUCCESS);
                    }
                    catch (err) {
                        logFactory.error(err);
                        return failPromise(err);
                    }
                }
            }
            else {
                return successPromise(BindState.LINE_HAS_BOUND);
            }
        }
    });
}
exports.bindLineId = bindLineId;
function deleteBinding(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbUser = yield User.findOne({ 'user.lineId': event.source.userId }).exec();
            if (!dbUser) {
                logFactory.log(DeleteBindState.LINE_HAS_NOT_BOUND);
                return successPromise(DeleteBindState.LINE_HAS_NOT_BOUND);
            }
            else {
                logFactory.log(DeleteBindState.SUCCESS);
                dbUser.user.lineId = undefined;
                dbUser.save(err => {
                    if (err)
                        return logFactory.error(err);
                });
                return successPromise(DeleteBindState.SUCCESS);
            }
        }
        catch (err) {
            logFactory.error(err);
        }
    });
}
exports.deleteBinding = deleteBinding;
function getQrcode(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var dbUser = yield User.findOne({ 'user.lineId': event.source.userId });
            if (!dbUser) {
                logFactory.log(DatabaseState.USER_NOT_FOUND);
                return successPromise(DatabaseState.USER_NOT_FOUND);
            }
            else {
                return successPromise(dbUser.user.phone);
            }
        }
        catch (err) {
            logFactory.error(err);
            return failPromise(err);
        }
    });
}
exports.getQrcode = getQrcode;
function getContribution(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var dbUser = yield User.findOne({ 'user.lineId': event.source.userId }).exec();
            if (!dbUser) {
                logFactory.log(DatabaseState.USER_NOT_FOUND);
                return successPromise(DatabaseState.USER_NOT_FOUND);
            }
            else {
                try {
                    var amount = yield Trade.count({
                        'tradeType.action': 'Rent',
                        'newUser.phone': dbUser.user.phone
                    }).exec();
                    return successPromise(amount);
                }
                catch (err) {
                    return failPromise(err);
                }
            }
        }
        catch (err) {
            logFactory.error(err);
            return failPromise(err);
        }
    });
}
exports.getContribution = getContribution;
function getTimeString(DateObject) {
    var tmpHour = DateObject.getHours() + 8;
    var dayFormatted = intReLength(dayFormatter(DateObject), 2);
    var monthFormatted = intReLength((DateObject.getMonth() + 1), 2);
    var hoursFormatted = intReLength((tmpHour >= 24) ? tmpHour - 24 : tmpHour, 2);
    var minutesFormatted = intReLength(DateObject.getMinutes(), 2);
    return DateObject.getFullYear() + "/" + monthFormatted + "/" + dayFormatted + " " + hoursFormatted + ":" + minutesFormatted;
}
function dayFormatter(dateToFormat) {
    if (dateToFormat.getHours() >= 16)
        dateToFormat.setDate(dateToFormat.getDate() + 1);
    return dateToFormat.getDate();
}
function intReLength(data, length) {
    var str = data.toString();
    if (length - str.length) {
        for (let j = 0; j <= length - str.length; j++) {
            str = "0" + str;
        }
    }
    return str;
}
function getYearAndMonthString(DateObject) {
    return DateObject.getFullYear().toString() + "年" + DateObject.getMonth().toString() + "月";
}
function isToday(d) {
    let today = new Date();
    if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDay() === today.getDay()) {
        return true;
    }
    return false;
}
//# sourceMappingURL=serviceProcess.js.map