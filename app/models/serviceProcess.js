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
const customPromise_1 = require("../lib/customPromise");
const tool_1 = require("../lib/tool");
const container_1 = require("../etl/models/container");
const recordView_1 = require("../etl/view/recordView");
const inusedView_1 = require("../etl/view/inusedView");
const flexMessage_1 = require("../etl/models/flexMessage");
const logFactory = require('../api/logFactory.js')('linebot:serviceProcess');
const User = require('./db/userDB');
const Trade = require('./db/tradeDB');
const PlaceID = require('./db/placeIdDB');
const ContainerType = require('./db/containerTypeDB');
var containerTypeDict;
var storeDict;
var GetDataMethod;
(function (GetDataMethod) {
    function spliceArrAndPush(returnList, inUsed, returned) {
        for (var i = 0; i < returnList.length; i++) {
            for (var j = inUsed.length - 1; j >= 0; j--) {
                var returnCycle = typeof returnList[i].container.cycleCtr === 'undefined' ? 0 : returnList[i].container.cycleCtr;
                if (inUsed[j].containerCode === returnList[i].container.id && inUsed[j].cycle === returnCycle) {
                    inUsed[j].returned = true;
                    inUsed[j].returnTime = returnList[i].tradeTime;
                    inUsed[j].cycle = undefined;
                    inUsed[j].returnStore = storeDict[returnList[i].newUser.storeID].name;
                    returned.push(inUsed[j]);
                    inUsed.splice(j, 1);
                    break;
                }
            }
        }
        returned.sort(function (a, b) {
            return b.time - a.time;
        });
    }
    GetDataMethod.spliceArrAndPush = spliceArrAndPush;
    function exportClientFlexMessage(recordCollection, event, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let MAX_DISPLAY_AMOUNT = 5;
            let view;
            let monthArray = Array();
            let index;
            let totalAmount = recordCollection['data'].length.toString();
            if (type === "get more record from database" /* GET_MORE_RECORD */) {
                view = new recordView_1.RecordView(totalAmount);
                index = yield redisClient_1.getAsync(event.source.userId + '_recordIndex');
                index = index === null ? 0 : Number(index);
            }
            else if (type === "record" /* RECORD */) {
                view = new recordView_1.RecordView(totalAmount);
                index = yield redisClient_1.setAsync(event.source.userId + '_recordIndex', "0");
                index = 0;
            }
            else if (type === "in used" /* IN_USED */) {
                view = new inusedView_1.InusedView(totalAmount);
                index = yield redisClient_1.setAsync(event.source.userId + '_inusedIndex', "0");
                index = 0;
            }
            else {
                view = new inusedView_1.InusedView(totalAmount);
                index = yield redisClient_1.getAsync(event.source.userId + '_inusedIndex');
                index = index === null ? 0 : Number(index);
            }
            let tempIndex = 0;
            for (let i = index; i < (recordCollection.data.length > index + MAX_DISPLAY_AMOUNT ? index + MAX_DISPLAY_AMOUNT : recordCollection.data.length); i++) {
                if (monthArray.indexOf(tool_1.getYearAndMonthString(recordCollection.data[i].time)) === -1) {
                    monthArray.push(tool_1.getYearAndMonthString(recordCollection.data[i].time));
                    if (tool_1.isToday(recordCollection.data[i].time)) {
                        if (i !== index)
                            view.pushSeparator(flexMessage_1.FlexMessage.Margin.xs);
                        view.pushTimeBar('今天');
                    }
                    else {
                        view.pushTimeBar(tool_1.getYearAndMonthString(recordCollection.data[i].time));
                    }
                }
                tempIndex += 1;
                let type = recordCollection.data[i].type;
                let containerType = type === 0 ? container_1.container.glass_12oz.toString : type === 7 ? container_1.container.bowl.toString : type === 2
                    ? container_1.container.plate.toString : type === 4 ? container_1.container.icecream.toString : container_1.container.glass_16oz.toString;
                view.pushSeparator(i === index ? flexMessage_1.FlexMessage.Margin.md : flexMessage_1.FlexMessage.Margin.lg);
                view instanceof inusedView_1.InusedView ?
                    view.pushBodyContent(containerType, recordCollection.data[i].container, tool_1.getTimeString(recordCollection.data[i].time), recordCollection.data[i].store) :
                    view.pushBodyContent(containerType, recordCollection.data[i].container, tool_1.getBorrowTimeInterval(recordCollection.data[i].time, recordCollection.data[i].returnTime), recordCollection.data[i].store + '｜使用\n' + recordCollection.data[i].returnStore + "｜歸還");
            }
            let nextStartIndex = index + 6;
            let nextEndIndex = index + tempIndex + 5 > totalAmount ? totalAmount : index + tempIndex + 5;
            if (view.getView().contents.body.contents.length === 0) {
                view.pushBodyContent(container_1.container.nothing.toString, container_1.container.nothing.toString, '期待您的使用！', "好盒器基地");
                view.deleteGetmoreButton();
            }
            else if (nextStartIndex >= totalAmount) {
                view.deleteGetmoreButton();
            }
            else {
                let indexLabel = "(第" + String(nextStartIndex) + "-" + String(nextEndIndex) + "筆)";
                view.addIndexToFooterButtonLabel(indexLabel);
            }
            if (type === "record" /* RECORD */ || type === "get more record from database" /* GET_MORE_RECORD */) {
                redisClient_1.setAsync(event.source.userId + '_recordIndex', index + tempIndex);
            }
            else {
                redisClient_1.setAsync(event.source.userId + '_inusedIndex', index + tempIndex);
            }
            return customPromise_1.successPromise(view);
        });
    }
    GetDataMethod.exportClientFlexMessage = exportClientFlexMessage;
})(GetDataMethod || (GetDataMethod = {}));
ContainerType.find({}, {}, {
    sort: {
        typeCode: 1,
    },
})
    .then(docs => {
    containerTypeDict = docs;
})
    .catch(err => logFactory.error(err));
PlaceID.find({}, {}, {
    sort: {
        ID: 1,
    },
})
    .then(docs => {
    storeDict = docs;
})
    .catch(err => logFactory.error(err));
function bindLineId(event, phone) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool_1.isMobilePhone(phone))
            return customPromise_1.successPromise("The input is not phone number" /* IS_NOT_PHONE */);
        var dbUser = yield User.findOne({ 'user.phone': phone }).exec();
        if (!dbUser) {
            return customPromise_1.successPromise("Does not find user in database" /* USER_NOT_FOUND */);
        }
        else {
            let doc = yield User.findOne({ 'user.lineId': event.source.userId }).exec();
            if (!doc) {
                if (typeof dbUser.user.lineId !== 'undefined') {
                    return customPromise_1.successPromise("The phone has already bound with another line account" /* PHONE_HAS_BOUND */);
                }
                else {
                    dbUser.user.lineId = event.source.userId;
                    try {
                        var saveRes = yield dbUser.save();
                        if (saveRes)
                            return customPromise_1.successPromise("Successfullt bound with line" /* SUCCESS */);
                    }
                    catch (err) {
                        logFactory.error(err);
                        return customPromise_1.failPromise(err);
                    }
                }
            }
            else {
                return customPromise_1.successPromise("Line has bound with another phone" /* LINE_HAS_BOUND */);
            }
        }
    });
}
exports.bindLineId = bindLineId;
function deleteBinding(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbUser = yield User.findOne({
                'user.lineId': event.source.userId,
            }).exec();
            if (!dbUser) {
                logFactory.log("Line has not bound with any phone number" /* LINE_HAS_NOT_BOUND */);
                return customPromise_1.successPromise("Line has not bound with any phone number" /* LINE_HAS_NOT_BOUND */);
            }
            else {
                logFactory.log("Unbind successfully" /* SUCCESS */);
                dbUser.user.lineId = undefined;
                dbUser.save(err => {
                    if (err)
                        return logFactory.error(err);
                });
                return customPromise_1.successPromise("Unbind successfully" /* SUCCESS */);
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
            var dbUser = yield User.findOne({
                'user.lineId': event.source.userId,
            }).exec();
            if (!dbUser) {
                logFactory.log("Does not find user in database" /* USER_NOT_FOUND */);
                return customPromise_1.successPromise("Does not find user in database" /* USER_NOT_FOUND */);
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
            var dbUser = yield User.findOne({
                'user.lineId': event.source.userId,
            }).exec();
            if (!dbUser) {
                logFactory.log("Does not find user in database" /* USER_NOT_FOUND */);
                return customPromise_1.successPromise("Does not find user in database" /* USER_NOT_FOUND */);
            }
            else {
                var amount = yield Trade.count({
                    'tradeType.action': 'Rent',
                    'newUser.phone': dbUser.user.phone,
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
function deleteSignal(event) {
    redisClient_1.redisClient.del(event.source.userId);
}
exports.deleteSignal = deleteSignal;
function addVerificationSignal(event, phone) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //@ts-ignore
            const result = yield redisClient_1.setAsync(event.source.userId, phone, 'EX', 180);
            if (result)
                return customPromise_1.successPromise("Successfully add verification signal" /* SUCCESS */);
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
                return customPromise_1.successPromise("The user has not been signaled in redis" /* HAS_NOT_SIGNALED */);
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
function getData(event, type) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let dbUser = yield User.findOne({
                'user.lineId': event.source.userId,
            }).exec();
            if (!dbUser)
                return customPromise_1.successPromise("Does not find user in database" /* USER_NOT_FOUND */);
            var returned = [];
            var inUsed = [];
            var recordCollection = {};
            const rentList = yield Trade.find({
                'tradeType.action': 'Rent',
                'newUser.phone': dbUser.user.phone,
            }).exec();
            rentList.sort(function (a, b) {
                return b.tradeTime - a.tradeTime;
            });
            for (let i = 0; i < rentList.length; i++) {
                let record = {
                    container: '#' + tool_1.intReLength(rentList[i].container.id, 3),
                    containerCode: rentList[i].container.id,
                    time: rentList[i].tradeTime,
                    type: rentList[i].container.typeCode,
                    store: storeDict[rentList[i].oriUser.storeID].name,
                    cycle: rentList[i].container.cycleCtr === undefined
                        ? 0
                        : rentList[i].container.cycleCtr,
                    return: false,
                };
                inUsed.push(record);
            }
            const returnList = yield Trade.find({
                'tradeType.action': 'Return',
                'oriUser.phone': dbUser.user.phone,
            }).exec();
            returnList.sort(function (a, b) {
                return b.tradeTime - a.tradeTime;
            });
            recordCollection['usingAmount'] -= returnList.length;
            GetDataMethod.spliceArrAndPush(returnList, inUsed, returned);
            if (type === "record" /* RECORD */ || type === "get more record from database" /* GET_MORE_RECORD */) {
                recordCollection['data'] = [];
                for (var i = 0; i < returned.length; i++) {
                    recordCollection['data'].push(returned[i]);
                }
            }
            else {
                recordCollection['data'] = inUsed;
            }
            let view = yield GetDataMethod.exportClientFlexMessage(recordCollection, event, type);
            return customPromise_1.successPromise(view);
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
        }
    });
}
exports.getData = getData;
//# sourceMappingURL=serviceProcess.js.map