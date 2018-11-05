import * as line from "@line/bot-sdk";
import { EventMessage } from "@line/bot-sdk";
import { text } from 'body-parser';
import {bindLineId, deleteBinding, BindState, getQrcode, DeleteBindState, DatabaseState, getContribution} from '../models/serviceProcess';
import { loadavg } from "os";

const logFactory = require('../api/logFactory')('linebot:eventHandler');
const client = require('./clientDelegate');

function isMobilePhone(phone: string): boolean {
    var reg: RegExp = /^[09]{2}[0-9]{8}$/;
    var res: boolean = reg.test(phone);

    if (res) return true;
    else return false;
}

function isVerificationCode(code: string): boolean {
    var reg: RegExp = /[0-9]{6}/;
    var res: boolean = reg.test(code);

    if (res) return true;
    else return false;
}

function recordPostback(event: any): void {
    logFactory.log('Event: postback');

}

function followEvent(event: any): void {
    logFactory.log('Event: added or unblocked');

    const message = '感謝您將本帳號加為好友！\n如果是初次使用請先輸入手機號碼以綁定line帳號\綁定完成後即可使用本帳號提供的服務！'
    client.textMessage(event, message);
}

async function unfollowOrUnBoundEvent(event: any): Promise<any> {
    if (event.type === 'unfollow') logFactory.log('Event: unfollowed');
    else logFactory.log('Event: delete bind');

    try {
        var result = await deleteBinding(event);
        logFactory.log(result);
        client.textMessage(event, result);
    } catch (err) {
        logFactory.error(err);
    }
}

async function getContributionEvent(event: any): Promise<any> {
    logFactory.log('Event: get contribution');
    try {
        let message: string;
        var result = await getContribution(event);
        switch (result) {
            case DatabaseState.USER_NOT_FOUND:
                message = '請輸入手機號碼以綁定 line id'
                return client.textMessage(event, message);
            default:
                return client.textMessage(event, '您的功德數為：' + result); 
        }
    } catch (err) {
        logFactory.error(err);
    }
}

function getRecordEvent(event: any): void {
    logFactory.log('Event: get record');
}

async function getQRCodeEvent(event: any): Promise<any> { 
    logFactory.log('Event: get QRCode');
    try {
        var result = await getQrcode(event);
        if (result === DatabaseState.USER_NOT_FOUND) {
            let message = '請輸入手機號碼以綁定 line id'
            return client.textMessage(event, message);
        }
        return client.getQrcode(event, result);
    } catch (err) {
        logFactory.error(err);
    }
}

function getContactWayEvent(event: any): void {
    logFactory.log('Event: get contact way');
 
    const message = "好盒器工作室: (06)200-2341\n" +
    "FB: https://www.facebook.com/good.to.go.tw"
    client.textMessage(event, message);
}

async function bindingEvent(event: any): Promise<any> {
    logFactory.log('Event: binding'); 
    try {
        let result = await bindLineId(event);
        let message: string;
        logFactory.log(result);
        switch(result) {
            case DatabaseState.USER_NOT_FOUND:
                message = "您還不是會員哦！\n請問要註冊成為會員嗎？"
                client.registerTemplate(event, message);
                break;
            case BindState.HAS_BOUND:
                message = "此手機已經綁定過摟！"
                client.textMessage(event, message);
                break;
            case BindState.LINE_HAS_BOUND:
                message = "此 line 已經綁定過摟！"
                client.textMessage(event, message);
                break;
            case BindState.SUCCESS:
                message = "綁定成功！"
                client.textMessage(event, message);
                break;
        }
        
    } catch (err) {
        logFactory.error(err);  
    } 
} 

function registerEvent(event: any): void {
    logFactory.log('Event: register');
}


function yesNoEvent (event: any): void {
    logFactory.log('Event: yes no');

}



 
module.exports = {
    bot: function(event: any) : any {
        if ((event.type !== 'message' || event.message.type !== 'text') && event.type !== 'follow' && event.type !== 'unfollow' &&
            event.type !== 'postback') {
            logFactory.error('Event Type: Wrong Type');

            return Promise.resolve(null);
        }
        if (event.type === 'postback') {
            // recordPostback(event);
        }
        if (event.type === 'follow') {
            followEvent(event);
        } else if (event.type === 'unfollow' || event.message.text === '取消') {
            unfollowOrUnBoundEvent(event);
        } else if (event.message.text === "功德") {
            getContributionEvent(event);
        } else if (event.message.text === "使用") {
            getRecordEvent(event);
        } else if (event.message.text === "QRcode") {
            getQRCodeEvent(event);
        } else if (event.message.text === "聯絡客服") {
            getContactWayEvent(event);
            
        } else if (event.message.text === "綁定") {
            bindingEvent(event);
            // client.textMessage(event, "請輸入手機號碼");
        } else if (event.message.text === "註冊") {
            registerEvent(event);
        } else if (event.message.text === "是" || event.message.text === "否") {
            yesNoEvent(event);
        } else if (isMobilePhone(event.message.text)) {
            bindingEvent(event);
        } else if (isVerificationCode(event.message.text)) {
            // request.registerVerification(event);
        } else {
            logFactory.log("Event: not our business");
            // client.textMessage(event, "如果有需要任何服務請點選下列表單哦!");
        }
    }
}
