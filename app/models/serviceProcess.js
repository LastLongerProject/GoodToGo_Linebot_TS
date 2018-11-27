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
const redisClient_1 = require("./db/redisClient");
const customPromise_1 = require("../api/customPromise");
const api_1 = require("../api/api");
const container_1 = require("../etl/models/container");
const recordView_1 = require("../etl/view/recordView");
const logFactory = require('../api/logFactory.js')('linebot:serviceProcess');
const User = require('./db/userDB');
const Trade = require('./db/tradeDB');
const PlaceID = require('./db/placeIdDB');
const ContainerType = require('./db/containerTypeDB');
const TemporaryInfo = require('./db/temporaryInfoDB');
const RichMenu = require('./db/richMenuDB');
var containerTypeDict;
var storeDict;
var BindState;
(function (BindState) {
    BindState.SUCCESS = 'Successfully bound with line', BindState.HAS_BOUND = 'This phone has bound with line', BindState.LINE_HAS_BOUND = 'Line has bound with another phone', BindState.IS_NOT_MOBILEPHONE = "The input is not mobile phone";
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
var GetContributeState;
(function (GetContributeState) {
    GetContributeState.SUCCESS = 'Get contribute successfully';
})(GetContributeState = exports.GetContributeState || (exports.GetContributeState = {}));
var FindTemporaryInfoState;
(function (FindTemporaryInfoState) {
    FindTemporaryInfoState.HAS_SIGNALED = 'ready for user to register member', FindTemporaryInfoState.HAS_NOT_SIGNALED = 'does not have signal for verification';
})(FindTemporaryInfoState = exports.FindTemporaryInfoState || (exports.FindTemporaryInfoState = {}));
var AddVerificationSignalState;
(function (AddVerificationSignalState) {
    AddVerificationSignalState.SUCCESS = 'store signal successfully';
})(AddVerificationSignalState = exports.AddVerificationSignalState || (exports.AddVerificationSignalState = {}));
var GetRecordState;
(function (GetRecordState) {
    GetRecordState.GET_MORE = "getMoreRecord";
})(GetRecordState = exports.GetRecordState || (exports.GetRecordState = {}));
var GetRecordMethod;
(function (GetRecordMethod) {
    function spliceArrAndPush(list, splicedArr, pushedArr) {
        for (var i = 0; i < list.length; i++) {
            for (var j = splicedArr.length - 1; j >= 0; j--) {
                var returnCycle = (typeof list[i].container.cycleCtr === 'undefined') ? 0 : list[i].container.cycleCtr;
                if ((splicedArr[j].containerCode === list[i].container.id) && (splicedArr[j].cycle === returnCycle)) {
                    splicedArr[j].returned = true;
                    splicedArr[j].returnTime = list[i].tradeTime;
                    splicedArr[j].cycle = undefined;
                    pushedArr.push(splicedArr[j]);
                    splicedArr.splice(j, 1);
                    break;
                }
            }
        }
    }
    GetRecordMethod.spliceArrAndPush = spliceArrAndPush;
    function exportClientFlexMessage(recordCollection, monthArray, event, getMore) {
        return __awaiter(this, void 0, void 0, function* () {
            let MAX_DISPLAY_AMOUNT = 5;
            let view = recordView_1.recordView();
            var recordIndex;
            if (getMore) {
                recordIndex = yield redisClient_1.getAsync(event.source.userId + '_recordIndex');
                recordIndex = recordIndex === null ? 0 : Number(recordIndex);
            }
            else {
                recordIndex = yield redisClient_1.setAsync(event.source.userId + '_recordIndex', 0);
                recordIndex = 0;
            }
            let index = 0;
            for (let i = recordIndex; i < (recordCollection.data.length > recordIndex + MAX_DISPLAY_AMOUNT ? recordIndex + MAX_DISPLAY_AMOUNT : recordCollection.data.length); i++) {
                if (monthArray.indexOf(getYearAndMonthString(recordCollection.data[i].time)) === -1) {
                    monthArray.push(getYearAndMonthString(recordCollection.data[i].time));
                    if (isToday(recordCollection.data[i].time)) {
                        if (i !== 0)
                            view.pushSeparator();
                        view.pushTimeBar("今天");
                    }
                    else {
                        if (i !== 0)
                            view.pushSeparator();
                        view.pushTimeBar(getYearAndMonthString(recordCollection.data[i].time));
                    }
                }
                index += 1;
                let type = recordCollection.data[i].type;
                let containerType = type === 0 ? container_1.container.glass_12oz.toString : type === 7 ? container_1.container.bowl.toString :
                    type === 2 ? container_1.container.plate.toString : type === 4 ? container_1.container.icecream.toString : container_1.container.glass_16oz.toString;
                view.pushBodyContent(containerType, getTimeString(recordCollection.data[i].time) + "\n" + recordCollection.data[i].store);
            }
            if (view.getView().contents.body.contents.length === 0) {
                view.pushBodyContent(container_1.container.nothing.toString, "期待您的使用！");
            }
            redisClient_1.setAsync(event.source.userId + '_recordIndex', recordIndex + index);
            return customPromise_1.successPromise(view);
        });
    }
    GetRecordMethod.exportClientFlexMessage = exportClientFlexMessage;
})(GetRecordMethod || (GetRecordMethod = {}));
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
}).then(docs => {
    storeDict = docs;
}).catch(err => logFactory.error(err));
function bindLineId(event, phone) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!api_1.isMobilePhone(phone))
            return customPromise_1.successPromise(BindState.IS_NOT_MOBILEPHONE);
        var dbUser = yield User.findOne({ 'user.phone': phone }).exec();
        if (!dbUser) {
            return customPromise_1.successPromise(DatabaseState.USER_NOT_FOUND);
        }
        else {
            let doc = yield User.findOne({ 'user.lineId': event.source.userId }).exec();
            if (!doc) {
                if (typeof dbUser.user.lineId !== 'undefined') {
                    return customPromise_1.successPromise(BindState.HAS_BOUND);
                }
                else {
                    dbUser.user.lineId = event.source.userId;
                    try {
                        var saveRes = yield dbUser.save();
                        if (saveRes)
                            return customPromise_1.successPromise(BindState.SUCCESS);
                    }
                    catch (err) {
                        logFactory.error(err);
                        return customPromise_1.failPromise(err);
                    }
                }
            }
            else {
                return customPromise_1.successPromise(BindState.LINE_HAS_BOUND);
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
                return customPromise_1.successPromise(DeleteBindState.LINE_HAS_NOT_BOUND);
            }
            else {
                logFactory.log(DeleteBindState.SUCCESS);
                dbUser.user.lineId = undefined;
                dbUser.save(err => {
                    if (err)
                        return logFactory.error(err);
                });
                return customPromise_1.successPromise(DeleteBindState.SUCCESS);
            }
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
        }
    });
}
exports.deleteBinding = deleteBinding;
function getQrcode(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var dbUser = yield User.findOne({ 'user.lineId': event.source.userId }).exec();
            if (!dbUser) {
                logFactory.log(DatabaseState.USER_NOT_FOUND);
                return customPromise_1.successPromise(DatabaseState.USER_NOT_FOUND);
            }
            else {
                return customPromise_1.successPromise(dbUser.user.phone);
            }
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
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
                return customPromise_1.successPromise(DatabaseState.USER_NOT_FOUND);
            }
            else {
                var amount = yield Trade.count({
                    'tradeType.action': 'Rent',
                    'newUser.phone': dbUser.user.phone
                }).exec();
                return customPromise_1.successPromise(amount);
            }
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
        }
    });
}
exports.getContribution = getContribution;
function addVerificationSignal(event, phone) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield redisClient_1.setAsync(event.source.userId, phone, 'EX', 180);
            return customPromise_1.successPromise(AddVerificationSignalState.SUCCESS);
        }
        catch (err) {
            return customPromise_1.failPromise(err);
        }
    });
}
exports.addVerificationSignal = addVerificationSignal;
function findSignal(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield redisClient_1.getAsync(event.source.userId);
            logFactory.log(result);
            if (!result) {
                return customPromise_1.successPromise(FindTemporaryInfoState.HAS_NOT_SIGNALED);
            }
            logFactory.log('result from findTemporaryInfo: ' + result);
            return customPromise_1.successPromise(result);
        }
        catch (err) {
            customPromise_1.failPromise(err);
        }
    });
}
exports.findSignal = findSignal;
function deleteSignal(event) {
    redisClient_1.redisClient.del(event.source.userId);
}
exports.deleteSignal = deleteSignal;
function getRecord(event, getMore) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let dbUser = yield User.findOne({ 'user.lineId': event.source.userId }).exec();
            if (!dbUser)
                return customPromise_1.successPromise(DatabaseState.USER_NOT_FOUND);
            var returned = [];
            var inUsed = [];
            var recordCollection = {};
            const rentList = yield Trade.find({
                'tradeType.action': 'Rent',
                'newUser.phone': dbUser.user.phone
            }).exec();
            rentList.sort(function (a, b) {
                return b.tradeTime - a.tradeTime;
            });
            for (let i = 0; i < rentList.length; i++) {
                let record = {
                    container: '#' + intReLength(rentList[i].container.id, 3),
                    containerCode: rentList[i].container.id,
                    time: rentList[i].tradeTime,
                    type: rentList[i].container.typeCode,
                    store: storeDict[rentList[i].oriUser.storeID].name,
                    cycle: (rentList[i].container.cycleCtr === undefined) ? 0 : rentList[i].container.cycleCtr,
                    return: false
                };
                inUsed.push(record);
            }
            const returnList = yield Trade.find({
                'tradeType.action': 'Return',
                "oriUser.phone": dbUser.user.phone
            }).exec();
            returnList.sort(function (a, b) { return b.tradeTime - a.tradeTime; });
            recordCollection['usingAmount'] -= returnList.length;
            GetRecordMethod.spliceArrAndPush(returnList, inUsed, returned);
            recordCollection['data'] = inUsed;
            for (var i = 0; i < returned.length; i++) {
                recordCollection['data'].push(returned[i]);
            }
            let monthArray = [];
            let view = yield GetRecordMethod.exportClientFlexMessage(recordCollection, monthArray, event, getMore);
            return customPromise_1.successPromise(view);
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
        }
    });
}
exports.getRecord = getRecord;
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
    console.log(DateObject.getMonth());
    return DateObject.getFullYear().toString() + "年" + (DateObject.getMonth() + 1).toString() + "月";
}
function isToday(d) {
    let today = new Date();
    if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDay() === today.getDay()) {
        return true;
    }
    return false;
}
//# sourceMappingURL=serviceProcess.js.map