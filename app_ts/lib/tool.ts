import axois from 'axios';
import jwt from "jwt-simple";
import { failPromise, successPromise } from "./customPromise";

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
        let lostAmount = response.data.lostAmount;
        let lineToken = response.data.userLineToken;
        let contribution = response.data.contribution
        return successPromise({
            usingAmount,
            lostAmount,
            lineToken,
            contribution
        });
    }).catch(err => {
        failPromise(err);
    });
    return result;
}


export { isMobilePhone, randomHexString, isVerificationCode, getTimeString, dayFormatter, intReLength, getYearAndMonthString, isToday, getBorrowTimeInterval, getUserDetail };
