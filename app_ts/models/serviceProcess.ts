import { redisClient, getAsync, setAsync } from './db/redisClient';
import { successPromise, failPromise } from '../api/customPromise';
import { isMobilePhone, intReLength, getYearAndMonthString, isToday, getTimeString } from '../api/tool';
import { container } from '../etl/models/container';
import { RecordView } from '../etl/view/recordView';
import { InusedView } from '../etl/view/inusedView';
import { View } from '../etl/view/view';
import { BindState, DatabaseState, DeleteBindState, DataType, AddVerificationSignalState } from '../api/enumManager';


const logFactory = require('../api/logFactory.js')('linebot:serviceProcess');

const User = require('./db/userDB');
const Trade = require('./db/tradeDB');
const PlaceID = require('./db/placeIdDB');
const ContainerType = require('./db/containerTypeDB');

var containerTypeDict: Object;
var storeDict: Object;

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

        if (type === DataType.GET_MORE_RECORD) {
            view = new RecordView();
            index = await getAsync(event.source.userId + '_recordIndex');
            index = index === null ? 0 : Number(index);
        } else if (type === DataType.RECORD) {
            view = new RecordView();
            index = await setAsync(event.source.userId + '_recordIndex', "0");
            index = 0;
        } else if (type === DataType.IN_USED) {
            view = new InusedView();
            index = await setAsync(event.source.userId + '_inusedIndex', "0");
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

        if (type === DataType.RECORD || type === DataType.GET_MORE_RECORD) {
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
        return successPromise(BindState.IS_NOT_PHONE);
    var dbUser = await User.findOne({ 'user.phone': phone }).exec();

    if (!dbUser) {
        return successPromise(DatabaseState.USER_NOT_FOUND);
    } else {
        let doc = await User.findOne({ 'user.lineId': event.source.userId }).exec();
        if (!doc) {
            if (typeof dbUser.user.lineId !== 'undefined') {
                return successPromise(BindState.PHONE_HAS_BOUND);
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

async function addVerificationSignal(event: any, phone: string): Promise<any> {
    try {
        //@ts-ignore
        const result = await setAsync(event.source.userId, phone, 'EX', 180);
        if (result)
            return successPromise(AddVerificationSignalState.SUCCESS);
    } catch (err) {
        return failPromise(err);
    }
}

async function findSignal(event: any): Promise<any> {
    try {
        const result = await getAsync(event.source.userId);
        logFactory.log(result);
        if (!result) {
            return successPromise(DatabaseState.HAS_NOT_SIGNALED);
        }
        logFactory.log('result from findTemporaryInfo: ' + result);
        return successPromise(result);
    } catch (err) {
        failPromise(err);
    }
}


async function getData(event: any, type): Promise<any> {
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
        if (type === DataType.RECORD || type === DataType.GET_MORE_RECORD) {
            recordCollection['data'] = [];
            for (var i = 0; i < returned.length; i++) {
                recordCollection['data'].push(returned[i]);
                console.log(returned[i])
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
    getData,
    findSignal,
    addVerificationSignal
};

