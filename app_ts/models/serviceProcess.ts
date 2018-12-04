import { redisClient, getAsync, setAsync } from './db/redisClient';
import { successPromise, failPromise } from '../api/customPromise';
import { isMobilePhone } from '../api/tool';
import { container } from '../etl/models/container';
import { RecordView } from '../etl/view/recordView';
<<<<<<< HEAD

import { InusedView } from '../etl/view/inusedView';
import { View } from '../etl/view/view';
import { BindState, DatabaseState, DeleteBindState } from '../api/enumManager';
=======
import { Double } from 'bson';
import * as path from 'path';
import { InusedView } from '../etl/view/inusedView';
import { View } from '../etl/view/view';
>>>>>>> 9696156bb7067a0d7150f26aadce546778c0be33

const logFactory = require('../api/logFactory.js')('linebot:serviceProcess');

const User = require('./db/userDB');
const Trade = require('./db/tradeDB');
const PlaceID = require('./db/placeIdDB');
const ContainerType = require('./db/containerTypeDB');
const TemporaryInfo = require('./db/temporaryInfoDB');
const RichMenu = require('./db/richMenuDB');

var containerTypeDict: Object;
var storeDict: Object;

<<<<<<< HEAD
=======
export namespace BindState {
    export const SUCCESS = 'Successfully bound with line',
        HAS_BOUND = 'This phone has bound with line',
        LINE_HAS_BOUND = 'Line has bound with another phone',
        IS_NOT_MOBILEPHONE = 'The input is not mobile phone';
}

export namespace DeleteBindState {
    export const LINE_HAS_NOT_BOUND = 'Line has not bound with a phone num',
        SUCCESS = 'Unbind successfully';
}

export namespace DatabaseState {
    export const USER_NOT_FOUND = 'Does not find user in db';
}

export namespace QrcodeState {
    export const SUCCESS = 'Get qrcode successfully';
}

export namespace GetContributeState {
    export const SUCCESS = 'Get contribute successfully';
}

export namespace FindTemporaryInfoState {
    export const HAS_SIGNALED = 'ready for user to register member',
        HAS_NOT_SIGNALED = 'does not have signal for verification';
}

export namespace AddVerificationSignalState {
    export const SUCCESS = 'store signal successfully';
}

>>>>>>> 9696156bb7067a0d7150f26aadce546778c0be33
export var DataType = Object.freeze({
    Record: 0,
    Inused: 1,
    GetMoreRecord: 2,
    GetMoreInused: 3,
});

export var RewardType = Object.freeze({
    Lottery: 4,
    Redeem: 5,
});

namespace GetDataMethod {
    export function spliceArrAndPush(
        returnList: Array<any>,
        inUsed: Array<any>,
        returned: Array<any>
    ): void {
        for (var i = 0; i < returnList.length; i++) {
            for (var j = inUsed.length - 1; j >= 0; j--) {
                var returnCycle =
                    typeof returnList[i].container.cycleCtr === 'undefined'
                        ? 0
                        : returnList[i].container.cycleCtr;
                if (
                    inUsed[j].containerCode === returnList[i].container.id &&
                    inUsed[j].cycle === returnCycle
                ) {
                    inUsed[j].returned = true;
                    inUsed[j].returnTime = returnList[i].tradeTime;
                    inUsed[j].cycle = undefined;
                    returned.push(inUsed[j]);
                    inUsed.splice(j, 1);
                    break;
                }
            }
        }
    }

    export async function exportClientFlexMessage(
        recordCollection,
        event,
        type
    ): Promise<any> {
        let MAX_DISPLAY_AMOUNT = 5;

        let view: View;

        var monthArray = Array<any>();
        var index: any;

        if (type === DataType.GetMoreRecord) {
            view = new RecordView();
            index = await getAsync(event.source.userId + '_recordIndex');
            index = index === null ? 0 : Number(index);
        } else if (type === DataType.Record) {
            view = new RecordView();
            index = await setAsync(event.source.userId + '_recordIndex', 0);
            index = 0;
        } else if (type === DataType.Inused) {
            view = new InusedView();
            index = await setAsync(event.source.userId + '_inusedIndex', 0);
            index = 0;
        } else {
            view = new InusedView();
            index = await getAsync(event.source.userId + '_inusedIndex');
            index = index === null ? 0 : Number(index);
        }

        let tempIndex = 0;

        for (
            let i = index;
            i <
            (recordCollection.data.length > index + MAX_DISPLAY_AMOUNT
                ? index + MAX_DISPLAY_AMOUNT
                : recordCollection.data.length);
            i++
        ) {
            if (
                monthArray.indexOf(
                    getYearAndMonthString(recordCollection.data[i].time)
                ) === -1
            ) {
                monthArray.push(getYearAndMonthString(recordCollection.data[i].time));
                if (isToday(recordCollection.data[i].time)) {
                    if (i !== index) view.pushSeparator();
                    view.pushTimeBar('今天');
                } else {
                    if (i !== index) view.pushSeparator();
                    view.pushTimeBar(
                        getYearAndMonthString(recordCollection.data[i].time)
                    );
                }
            }

            tempIndex += 1;
            let type = recordCollection.data[i].type;
            let containerType =
                type === 0
                    ? container.glass_12oz.toString
                    : type === 7
                        ? container.bowl.toString
                        : type === 2
                            ? container.plate.toString
                            : type === 4
                                ? container.icecream.toString
                                : container.glass_16oz.toString;
            view.pushBodyContent(
                containerType,
                getTimeString(recordCollection.data[i].time) +
                '\n' +
                recordCollection.data[i].store
            );
        }
        if (view.getView().contents.body.contents.length === 0) {
            view.pushBodyContent(container.nothing.toString, '期待您的使用！');
        }

        if (type === DataType.Record || type === DataType.GetMoreRecord) {
            setAsync(event.source.userId + '_recordIndex', index + tempIndex);
        } else {
            setAsync(event.source.userId + '_inusedIndex', index + tempIndex);
        }
        return successPromise(view);
    }
}

ContainerType.find(
    {},
    {},
    {
        sort: {
            typeCode: 1,
        },
    }
)
    .then(docs => {
        containerTypeDict = docs;
    })
    .catch(err => logFactory.error(err));

PlaceID.find(
    {},
    {},
    {
        sort: {
            ID: 1,
        },
    }
)
    .then(docs => {
        storeDict = docs;
    })
    .catch(err => logFactory.error(err));

async function bindLineId(event: any, phone: string): Promise<any> {
    if (!isMobilePhone(phone))
<<<<<<< HEAD
        return successPromise(BindState.IS_NOT_PHONE);
=======
        return successPromise(BindState.IS_NOT_MOBILEPHONE);
>>>>>>> 9696156bb7067a0d7150f26aadce546778c0be33
    var dbUser = await User.findOne({ 'user.phone': phone }).exec();

    if (!dbUser) {
        return successPromise(DatabaseState.USER_NOT_FOUND);
    } else {
        let doc = await User.findOne({ 'user.lineId': event.source.userId }).exec();
        if (!doc) {
            if (typeof dbUser.user.lineId !== 'undefined') {
<<<<<<< HEAD
                return successPromise(BindState.PHONE_HAS_BOUND);
=======
                return successPromise(BindState.HAS_BOUND);
>>>>>>> 9696156bb7067a0d7150f26aadce546778c0be33
            } else {
                dbUser.user.lineId = event.source.userId;
                try {
                    var saveRes = await dbUser.save();
                    if (saveRes) return successPromise(BindState.SUCCESS);
                } catch (err) {
                    logFactory.error(err);
                    return failPromise(err);
                }
            }
        } else {
            return successPromise(BindState.LINE_HAS_BOUND);
        }
    }
}

async function deleteBinding(event: any): Promise<any> {
    try {
        const dbUser = await User.findOne({
            'user.lineId': event.source.userId,
        }).exec();

        if (!dbUser) {
            logFactory.log(DeleteBindState.LINE_HAS_NOT_BOUND);
            return successPromise(DeleteBindState.LINE_HAS_NOT_BOUND);
        } else {
            logFactory.log(DeleteBindState.SUCCESS);
            dbUser.user.lineId = undefined;
            dbUser.save(err => {
                if (err) return logFactory.error(err);
            });

            return successPromise(DeleteBindState.SUCCESS);
        }
    } catch (err) {
        logFactory.error(err);
        return failPromise(err);
    }
}

async function getQrcode(event: any): Promise<any> {
    try {
        var dbUser = await User.findOne({
            'user.lineId': event.source.userId,
        }).exec();

        if (!dbUser) {
            logFactory.log(DatabaseState.USER_NOT_FOUND);
            return successPromise(DatabaseState.USER_NOT_FOUND);
        } else {
            return successPromise(dbUser.user.phone);
        }
    } catch (err) {
        logFactory.error(err);
        return failPromise(err);
    }
}

async function getContribution(event: any): Promise<any> {
    try {
        var dbUser = await User.findOne({
            'user.lineId': event.source.userId,
        }).exec();

        if (!dbUser) {
            logFactory.log(DatabaseState.USER_NOT_FOUND);
            return successPromise(DatabaseState.USER_NOT_FOUND);
        } else {
            var amount = await Trade.count({
                'tradeType.action': 'Rent',
                'newUser.phone': dbUser.user.phone,
            }).exec();

            return successPromise(amount);
        }
    } catch (err) {
        logFactory.error(err);
        return failPromise(err);
    }
}

function deleteSignal(event: any) {
    redisClient.del(event.source.userId);
}

async function getRecord(event: any, type): Promise<any> {
    try {
        let dbUser = await User.findOne({
            'user.lineId': event.source.userId,
        }).exec();
        if (!dbUser) return successPromise(DatabaseState.USER_NOT_FOUND);

        var returned = [];
        var inUsed: Array<any> = [];
        var recordCollection = {};

        const rentList = await Trade.find({
            'tradeType.action': 'Rent',
            'newUser.phone': dbUser.user.phone,
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
                cycle:
                    rentList[i].container.cycleCtr === undefined
                        ? 0
                        : rentList[i].container.cycleCtr,
                return: false,
            };

            inUsed.push(record);
        }
        const returnList = await Trade.find({
            'tradeType.action': 'Return',
            'oriUser.phone': dbUser.user.phone,
        }).exec();

        returnList.sort(function (a, b) {
            return b.tradeTime - a.tradeTime;
        });
        recordCollection['usingAmount'] -= returnList.length;
        GetDataMethod.spliceArrAndPush(returnList, inUsed, returned);
        if (type === DataType.Record || type === DataType.GetMoreRecord) {
            recordCollection['data'] = [];
            for (var i = 0; i < returned.length; i++) {
                recordCollection['data'].push(returned[i]);
            }
        } else {
            recordCollection['data'] = inUsed;
        }

        let view = await GetDataMethod.exportClientFlexMessage(
            recordCollection,
            event,
            type
        );
        return successPromise(view);
    } catch (err) {
        logFactory.error(err);
        return failPromise(err);
    }
}

export {
    bindLineId,
    deleteBinding,
    getQrcode,
    getContribution,
    deleteSignal,
    getRecord,
};

function getTimeString(DateObject: Date): string {
    var tmpHour = DateObject.getHours() + 8;
    var dayFormatted = intReLength(dayFormatter(DateObject), 2);
    var monthFormatted = intReLength(DateObject.getMonth() + 1, 2);
    var hoursFormatted = intReLength(tmpHour >= 24 ? tmpHour - 24 : tmpHour, 2);
    var minutesFormatted = intReLength(DateObject.getMinutes(), 2);
    return (
        DateObject.getFullYear() +
        '/' +
        monthFormatted +
        '/' +
        dayFormatted +
        ' ' +
        hoursFormatted +
        ':' +
        minutesFormatted
    );
}

function dayFormatter(dateToFormat: Date): number {
    if (dateToFormat.getHours() >= 16)
        dateToFormat.setDate(dateToFormat.getDate() + 1);
    return dateToFormat.getDate();
}

function intReLength(data, length: number): string {
    var str = data.toString();
    if (length - str.length) {
        for (let j = 0; j <= length - str.length; j++) {
            str = '0' + str;
        }
    }
    return str;
}

function getYearAndMonthString(DateObject: Date): string {
    return (
        DateObject.getFullYear().toString() +
        '年' +
        (DateObject.getMonth() + 1).toString() +
        '月'
    );
}

function isToday(d: Date): boolean {
    let today = new Date();
    if (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDay() === today.getDay()
    ) {
        return true;
    }
    return false;
}
