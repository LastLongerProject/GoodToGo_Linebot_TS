import axois from 'axios';
import jwt from "jwt-simple";
import { failPromise, successPromise } from "./customPromise";
import { RichmenuType, GetUserDetail } from "./enumManager";
const richMenu = require('./richMenuScript');

function isMobilePhone(phone: string): boolean {
    var reg: RegExp = /^[09]{2}[0-9]{8}$/;
    var res: boolean = reg.test(phone);

    if (res) return true;
    else return false;
}

function randomHexString(amount: number): string {
    var text = '';
    var charSet = '0123456789ABCDEF';

    for (var i = 0; i < amount; i++) {
        text += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    return text;
}

function isVerificationCode(code: string): boolean {
    var reg: RegExp = /[0-9]{6}/;
    var res: boolean = reg.test(code);

    if (res) return true;
    else return false;
}

function getTimeString(DateObject: Date): string {
    var dayFormatted = intReLength(dayFormatter(DateObject), 2);
    var monthFormatted = intReLength(DateObject.getMonth() + 1, 2);
    return (
        DateObject.getFullYear() +
        '/' +
        monthFormatted +
        '/' +
        dayFormatted
    );
}

function getBorrowTimeInterval(startDate: Date, returnDate: Date) {
    var dayFormatted_start = intReLength(dayFormatter(startDate), 2);
    var monthFormatted_start = intReLength(startDate.getMonth() + 1, 2);
    var dayFormatted_return = intReLength(dayFormatter(returnDate), 2);
    var monthFormatted_return = intReLength(returnDate.getMonth() + 1, 2);

    return (monthFormatted_start + '/' + dayFormatted_start + ' - ' + monthFormatted_return + '/' + dayFormatted_return);
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
async function getUserDetail(phone): Promise<any> {
    let payload = {
        jti: 'manager',
        iat: Date.now(),
        exp: Date.now() + 86400000 * 3,
    };

    let auth = jwt.encode(payload, global.gConfig.serverKey.secretKey);

    let result = await axois({
        method: 'get',
        url: global.gConfig.apiBaseUrl + '/manage/userDetail?id=' + phone,
        headers: {
            'Authorization': auth,
            'Apikey': global.gConfig.serverKey.apiKey
        }
    }).then(response => {
        let usingAmount = response.data.usingAmount;
        let lineToken = response.data.userLineToken;
        switchRichmenu(usingAmount, lineToken);
        return successPromise(GetUserDetail.SUCCESS);
    }).catch(err => {
        return failPromise(err);
    });
    return result;
}

function switchRichmenu(amount, lineToken): void {
    if (amount === 0)
        richMenu.bindRichmenuToUser(RichmenuType._0, lineToken);
    else if (amount === 1)
        richMenu.bindRichmenuToUser(RichmenuType._1, lineToken);
    else if (amount === 2)
        richMenu.bindRichmenuToUser(RichmenuType._2, lineToken);
    else if (amount === 3)
        richMenu.bindRichmenuToUser(RichmenuType._3, lineToken);
    else if (amount === 4)
        richMenu.bindRichmenuToUser(RichmenuType._4, lineToken);
    else if (amount === 5)
        richMenu.bindRichmenuToUser(RichmenuType._5, lineToken);
    else
        richMenu.bindRichmenuToUser(RichmenuType.MORE, lineToken);
}
export { isMobilePhone, randomHexString, isVerificationCode, getTimeString, dayFormatter, intReLength, getYearAndMonthString, isToday, getBorrowTimeInterval, getUserDetail };
