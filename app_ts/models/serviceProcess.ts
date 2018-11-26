import { redisClient, getAsync, setAsync } from './db/redisClient';
import {successPromise, failPromise} from '../api/customPromise';
import { isMobilePhone } from '../api/api';
import { container } from '../etl/models/container';
import { recordView } from '../etl/view/recordView';

const logFactory = require('../api/logFactory.js')('linebot:serviceProcess');

const User = require('./db/userDB');
const Trade = require('./db/tradeDB');
const PlaceID = require('./db/placeIdDB');
const ContainerType = require('./db/containerTypeDB');
const TemporaryInfo = require('./db/temporaryInfoDB');
const RichMenu = require('./db/richMenuDB');

var containerTypeDict: Object;
var storeDict: Object;

export namespace BindState {   
    export const
        SUCCESS = 'Successfully bound with line',
        HAS_BOUND = 'This phone has bound with line',
        LINE_HAS_BOUND = 'Line has bound with another phone',
        IS_NOT_MOBILEPHONE = "The input is not mobile phone"
}

export namespace DeleteBindState {
    export const
        LINE_HAS_NOT_BOUND = 'Line has not bound with a phone num',
        SUCCESS = 'Unbind successfully'
}

export namespace DatabaseState {
    export const 
        USER_NOT_FOUND = 'Does not find user in db';
}

export namespace QrcodeState {
    export const 
        SUCCESS = 'Get qrcode successfully'
}

export namespace GetContributeState {
    export const 
        SUCCESS = 'Get contribute successfully'
}

export namespace FindTemporaryInfoState {
    export const
        HAS_SIGNALED = 'ready for user to register member',
        HAS_NOT_SIGNALED = 'does not have signal for verification'
}

export namespace AddVerificationSignalState {
    export const
        SUCCESS = 'store signal successfully'
}

namespace GetRecordMethod {
    export function spliceArrAndPush(list: Array<any>, splicedArr: Array<any>, pushedArr: Array<any>): void {
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

    export function exportClientFlexMessage(recordCollection, monthArray): any {
        let view = recordView();
        for (var i = 0; i < (recordCollection.data.length > 5 ? 5 : recordCollection.data.length); i++) {
            if (monthArray.indexOf(getYearAndMonthString(recordCollection.data[i].time)) === -1) {
                monthArray.push(getYearAndMonthString(recordCollection.data[i].time));
                if (isToday(recordCollection.data[i].time)) {
                    view.pushTimeBar("今天");
                } else {
                    view.pushTimeBar(getYearAndMonthString(recordCollection.data[i].time));
                }
            }
  
            // dbUser.user.recordIndex += 1;
            let type = recordCollection.data[i].type;
            let containerType = type === 0 ? container.glass_12oz.toString : type === 7 ? container.bowl.toString :
                type === 2 ? container.plate.toString : type === 4 ? container.icecream.toString : container.glass_16oz.toString;
            view.pushBodyContent(containerType, getTimeString(recordCollection.data[i].time) + "\n" + recordCollection.data[i].store);
        }
        if (view.getView().body.contents.length === 0) {
            view.pushBodyContent(container.nothing.toString, "期待您的使用！")
        }

        return view;
    }
}
 
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

async function bindLineId(event: any, phone: string): Promise<any> { 
    if(!isMobilePhone(phone)) return successPromise(BindState.IS_NOT_MOBILEPHONE);
    var dbUser = await User.findOne({'user.phone': phone}).exec();

    if (!dbUser) {
        return successPromise(DatabaseState.USER_NOT_FOUND);
    } else {
        let doc = await User.findOne({ 'user.lineId': event.source.userId }).exec();
        if (!doc) {
            if (typeof dbUser.user.lineId !== 'undefined') {
                return successPromise(BindState.HAS_BOUND);
            } 
            else {
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
        const dbUser = await User.findOne( {'user.lineId': event.source.userId} ).exec();

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

        if(!dbUser) {
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
        var dbUser = await User.findOne({ 'user.lineId': event.source.userId }).exec();

        if(!dbUser) {
            logFactory.log(DatabaseState.USER_NOT_FOUND);
            return successPromise(DatabaseState.USER_NOT_FOUND);
        } else {
            var amount = await 
                Trade.count({
                    'tradeType.action': 'Rent',
                    'newUser.phone': dbUser.user.phone
                }).exec();

            return successPromise(amount);
        }
    } catch (err) {
        logFactory.error(err);
        return failPromise(err);
    }
}


async function addVerificationSignal(event: any, phone: string): Promise<any>{
    try {
        const result = await setAsync(event.source.userId, phone, 'EX', 180);
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
            return successPromise(FindTemporaryInfoState.HAS_NOT_SIGNALED);   
        }
        logFactory.log('result from findTemporaryInfo: ' + result);

        return successPromise(result);
    } catch (err) {
        failPromise(err);
    }
    
}

function deleteSignal(event: any) {
    redisClient.del(event.source.userId);
}

async function getRecord(event: any): Promise<any> {
    try {
        let dbUser = await User.findOne({ 'user.lineId': event.source.userId }).exec();
        if (!dbUser) return successPromise(DatabaseState.USER_NOT_FOUND);

        var returned = [];
        var inUsed: Array<any> = [];
        var recordCollection = {};

        const rentList = await Trade.find({
            'tradeType.action': 'Rent',
            'newUser.phone': dbUser.user.phone
        }).exec();
        rentList.sort(function (a,b) {
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
        const returnList = await Trade.find({
            'tradeType.action': 'Return',
            "oriUser.phone": dbUser.user.phone
        }).exec();

        returnList.sort(function(a, b) { return b.tradeTime - a.tradeTime; });
        recordCollection['usingAmount'] -= returnList.length;
        GetRecordMethod.spliceArrAndPush(returnList, inUsed, returned);
        recordCollection['data'] = inUsed;

        for (var i = 0; i < returned.length; i++) {
            recordCollection['data'].push(returned[i]);
        }

        let monthArray = [];
 
        dbUser.user.recordIndex = 0;
        let view = GetRecordMethod.exportClientFlexMessage(recordCollection, monthArray);
        return successPromise(view); 
    } catch(err) {
        logFactory.error(err);
        return failPromise(err);
    }
}
  
export {bindLineId, deleteBinding, getQrcode, getContribution, addVerificationSignal, findSignal, deleteSignal, getRecord};

function getTimeString(DateObject: Date): string {
    var tmpHour = DateObject.getHours() + 8;
    var dayFormatted = intReLength(dayFormatter(DateObject), 2);
    var monthFormatted = intReLength((DateObject.getMonth() + 1), 2);
    var hoursFormatted = intReLength((tmpHour >= 24) ? tmpHour - 24 : tmpHour, 2);
    var minutesFormatted = intReLength(DateObject.getMinutes(), 2);
    return DateObject.getFullYear() + "/" + monthFormatted + "/" + dayFormatted + " " + hoursFormatted + ":" + minutesFormatted;
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
            str = "0" + str;
        }
    }
    return str;
}

function getYearAndMonthString(DateObject: Date): string {
    return DateObject.getFullYear().toString() + "年" + DateObject.getMonth().toString() + "月"
}

function isToday(d: Date): boolean {
    let today = new Date();
    if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDay() === today.getDay()) {
        return true;
    }
    return false;
}
 

