import { container } from '../etl/models/container';
import { RecordView } from '../etl/view/recordView';
import { InusedView } from '../etl/view/inusedView';
import { FlexMessage } from '../etl/models/flexMessage';
import { ContainerStateView } from '../etl/view/containerView';
import { successPromise, failPromise } from '../lib/customPromise';
import { redisClient, getAsync, setAsync } from './db/redisClient';
import { BindState, DatabaseState, DeleteBindState, DataType, AddVerificationSignalState } from '../lib/enumManager';
import { isMobilePhone, intReLength, getYearAndMonthString, isToday, getTimeString, getBorrowTimeInterval } from '../lib/tool';
import { bindRichmenuToUser } from '../lib/richMenuScript';
const User = require('./db/userDB');
const Trade = require('./db/tradeDB');
const PlaceID = require('./db/placeIdDB');
const ContainerType = require('./db/containerTypeDB');
const richMenu = require('../lib/richMenuScript');
const logFactory = require('../lib/logFactory.js')('linebot:serviceProcess');

var containerTypeDict: Object;
var storeDict: Object;

namespace GetDataMethod {
    export function filterReturnedFromInused(returnList: Array<any>, inUsed: Array<any>, returned: Array<any>): void {
        returnList.forEach((element, index) => {
            for (var j = inUsed.length - 1; j >= 0; j--) {
                var returnCycle = typeof returnList[index].container.cycleCtr === 'undefined' ? 0 : returnList[index].container.cycleCtr;

                if (inUsed[j].containerCode === returnList[index].container.id && inUsed[j].cycle === returnCycle) {
                    inUsed[j].returned = true;
                    inUsed[j].returnTime = returnList[index].tradeTime;
                    inUsed[j].cycle = undefined;
                    inUsed[j].returnStore = storeDict[returnList[index].newUser.storeID].name
                    returned.push(inUsed[j]);
                    inUsed.splice(j, 1);
                    break;
                }
            }
        })

        returned.sort(function (a, b) {
            return b.time - a.time;
        });
    }

    async function flexViewInit(type: DataType, totalAmount: string, userId: string): Promise<any> {
        let index: any;
        let view: ContainerStateView;

        if (type === DataType.GET_MORE_RECORD) {
            view = new RecordView(totalAmount);
            index = await getAsync(userId + '_recordIndex');
            index = index === null ? 0 : Number(index);
        } else if (type === DataType.RECORD) {
            view = new RecordView(totalAmount);
            index = await setAsync(userId + '_recordIndex', "0");
            index = 0;
        } else if (type === DataType.IN_USED) {
            view = new InusedView(totalAmount);
            index = await setAsync(userId + '_inusedIndex', "0");
            index = 0;
        } else {
            view = new InusedView(totalAmount);
            index = await getAsync(userId + '_inusedIndex');
            index = index === null ? 0 : Number(index);
        }

        return successPromise({ view, index })
    }

    function typeMatching(type: string): string {
        for (var prop in container) {
            if (type === container[prop]['type']) {
                return container[prop].toString;
            }
        }
        return container.nothing.toString;
    }

    function setupTimecellView(result: any, recordCollection: any, index: number, monthArray: Array<any>): void {
        if (monthArray.indexOf(getYearAndMonthString(recordCollection.data[index].time)) === -1) {
            monthArray.push(getYearAndMonthString(recordCollection.data[index].time));
            if (isToday(recordCollection.data[index].time)) {
                if (index !== result.index) result.view.pushSeparator(FlexMessage.Margin.xs);
                result.view.pushTimeBar('今天');
            } else {
                result.view.pushTimeBar(
                    getYearAndMonthString(recordCollection.data[index].time)
                );
            }
        }
    }

    function setupView(result: any, recordCollection: any, index: number, monthArray: Array<any>): void {
        setupTimecellView(result, recordCollection, index, monthArray);

        let type = recordCollection.data[index].type;
        let containerType = typeMatching(type);

        result.view.pushSeparator(index === result.index ? FlexMessage.Margin.md : FlexMessage.Margin.lg);
        result.view instanceof InusedView ?
            result.view.pushBodyContent(containerType, recordCollection.data[index].container, getTimeString(recordCollection.data[index].time),
                recordCollection.data[index].store) :
            result.view.pushBodyContent(containerType, recordCollection.data[index].container, getBorrowTimeInterval(recordCollection.data[index].time,
                recordCollection.data[index].returnTime), recordCollection.data[index].store + '｜使用\n' + recordCollection.data[index].returnStore + "｜歸還");
    }

    function setRedisInfo(type: DataType, userId: string, index: number, tempIndex: number) {
        if (type === DataType.RECORD || type === DataType.GET_MORE_RECORD) {
            setAsync(userId + '_recordIndex', String(index + tempIndex));
        } else {
            setAsync(userId + '_inusedIndex', String(index + tempIndex));
        }
    }

    export async function exportClientFlexMessage(recordCollection, event, type): Promise<any> {
        let MAX_DISPLAY_AMOUNT = 5;
        let monthArray = Array<any>();
        let totalAmount = recordCollection['data'].length.toString();
        let result = await flexViewInit(type, totalAmount, event.source.userId);
        let tempIndex = 0;

        for (let i = result.index; i < (recordCollection.data.length > result.index + MAX_DISPLAY_AMOUNT ? result.index + MAX_DISPLAY_AMOUNT : recordCollection.data.length); i++) {
            tempIndex += 1;
            setupView(result, recordCollection, i, monthArray);
        }

        let nextStartIndex = result.index + 6;
        let nextEndIndex = result.index + tempIndex + 5 > totalAmount ? totalAmount : result.index + tempIndex + 5;

        if (result.view.getView().contents.body.contents.length === 0) {
            result.view.pushBodyContent(container.nothing.toString, container.nothing.toString, '期待您的使用！', "好盒器基地");
            result.view.deleteGetmoreButton();
        } else if (nextStartIndex > totalAmount) {
            result.view.deleteGetmoreButton();
        }
        else {
            let indexLabel = "(第" + String(nextStartIndex) + "-" + String(nextEndIndex) + "筆)";
            result.view.addIndexToFooterButtonLabel(indexLabel);
        }

        setRedisInfo(type, event.source.userId, result.index, tempIndex);
        return successPromise(result.view);
    }
}

ContainerType.find({}, {}, {
    sort: {
        typeCode: 1,
    }
})
    .then(docs => {
        containerTypeDict = docs;
    })
    .catch(err => logFactory.error(err));

PlaceID.find({}, {}, {
    sort: {
        ID: 1,
    }
})
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
                var saveRes = await dbUser.save();
                if (saveRes) {
                    bindRichmenuToUser('after', event.source.userId);
                    return successPromise(BindState.SUCCESS);
                }
            }
        } else {
            return successPromise(BindState.LINE_HAS_BOUND);
        }
    }
}

async function deleteBinding(event: any): Promise<any> {
    try {
        const dbUser = await User.findOne({ 'user.lineId': event.source.userId }).exec();

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
        var dbUser = await User.findOne({ 'user.lineId': event.source.userId }).exec();

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
        var dbUser = await User.findOne({ 'user.lineId': event.source.userId, }).exec();

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
        if (result) return successPromise(AddVerificationSignalState.SUCCESS);
    } catch (err) {
        return failPromise(err);
    }
}

async function findSignal(event: any): Promise<any> {
    try {
        const result = await getAsync(event.source.userId);
        if (!result) return successPromise(DatabaseState.HAS_NOT_SIGNALED);
        return successPromise(result);
    } catch (err) {
        failPromise(err);
    }
}


async function getData(event: any, type): Promise<any> {
    try {
        let recordCollection = {};
        let result = await getDataList(event);
        recordCollection['usingAmount'] -= result.returnList.length;
        GetDataMethod.filterReturnedFromInused(result.returnList, result.inUsed, result.returned);
        if (type === DataType.RECORD || type === DataType.GET_MORE_RECORD) {
            recordCollection['data'] = [];
            result.returned.forEach(element => {
                recordCollection['data'].push(element);
            });
        } else {
            recordCollection['data'] = result.inUsed;
        }

        let view = await GetDataMethod.exportClientFlexMessage(recordCollection, event, type);
        return successPromise(view);
    } catch (err) {
        logFactory.error(err);
        return failPromise(err);
    }
}

async function getDataList(event): Promise<any> {
    let dbUser = await User.findOne({
        'user.lineId': event.source.userId,
    }).exec();
    if (!dbUser) return successPromise(DatabaseState.USER_NOT_FOUND);

    var returned = [];
    var inUsed: Array<any> = [];
    const rentList = await Trade.find({
        'tradeType.action': 'Rent',
        'newUser.phone': dbUser.user.phone
    }).exec();
    const returnList = await Trade.find({
        'tradeType.action': 'Return',
        'oriUser.phone': dbUser.user.phone,
    }).exec();

    rentList.sort(function (a, b) {
        return b.tradeTime - a.tradeTime;
    });
    returnList.sort(function (a, b) {
        return b.tradeTime - a.tradeTime;
    });

    rentList.forEach(element => {
        let record = {
            container: '#' + intReLength(element.container.id, 3),
            containerCode: element.container.id,
            time: element.tradeTime,
            type: element.container.typeCode,
            store: storeDict[element.oriUser.storeID].name,
            cycle: element.container.cycleCtr === undefined ? 0 : element.container.cycleCtr,
            return: false,
        };

        inUsed.push(record);
    });

    GetDataMethod.filterReturnedFromInused(returnList, inUsed, returned);

    return successPromise({
        returnList,
        inUsed,
        returned
    });
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

