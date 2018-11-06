import * as mongoose from 'mongoose';
import { resolve } from 'path';
import { rejects } from 'assert';

const logFactory = require('../api/logFactory.js')('linebot:serviceProcess');

const User = require('./db/userDB');
const Trade = require('./db/tradeDB');
const PlaceID = require('./db/placeIdDB');
const ContainerType = require('./db/containerTypeDB');
const TemporaryInfo = require('./db/temporaryInfoDB');
const RichMenu = require('./db/richMenuDB');
const client = require('../controller/clientDelegate');

var containerTypeDict: Object;
var storeDict: Object;

export namespace BindState {   
    export const
        SUCCESS = 'Successfully bound with line',
        HAS_BOUND = 'This phone has bound with line',
        LINE_HAS_BOUND = 'Line has bound with another phone'
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

export namespace getContribute {
    export const 
        SUCCESS = 'Get contribute successfully'
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

async function bindLineId(event) {
    var dbUser = await User.findOne({'user.phone': event.message.text}).exec();

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

async function deleteBinding(event) {
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
    }
}

async function getQrcode(event) {
    try {
        var dbUser = await User.findOne({ 'user.lineId': event.source.userId });

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

async function getContribution(event) {
    try {
        var dbUser = await User.findOne({ 'user.lineId': event.source.userId }).exec();

        if(!dbUser) {
            logFactory.log(DatabaseState.USER_NOT_FOUND);
            return successPromise(DatabaseState.USER_NOT_FOUND);
        } else {
            try {
                var amount = await 
                Trade.count({
                    'tradeType.action': 'Rent',
                    'newUser.phone': dbUser.user.phone
                }).exec();

                return successPromise(amount);
            } catch (err) {
                return failPromise(err);
            }   
        }
    } catch (err) {
        logFactory.error(err);
        return failPromise(err);
    }
}

export {bindLineId, deleteBinding, getQrcode, getContribution};

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


