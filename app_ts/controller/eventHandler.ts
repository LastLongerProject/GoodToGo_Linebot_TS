import * as line from "@line/bot-sdk";
import { EventMessage } from "@line/bot-sdk";
import { text } from 'body-parser';
import { loadavg } from "os";

import {
    bindLineId, 
    deleteBinding, 
    BindState, 
    getQrcode, 
    DeleteBindState, 
    DatabaseState, 
    getContribution, 
    addVerificationSignal, 
    findSignal,
    FindTemporaryInfoState,
    getRecord,
    DataType} from '../models/serviceProcess';

import * as client from './clientDelegate';
import * as request from "../api/request";
import { failPromise } from "../api/customPromise";
import { isMobilePhone } from '../api/tool';
import { ContrubtionView } from "../etl/view/contributionView";
import { RewardType } from '../models/serviceProcess';
import { FlexMessage } from "../etl/models/flexMessage";
import { QrcodeView } from '../etl/view/qrcodeView';

const logFactory = require('../api/logFactory')('linebot:eventHandler');
const richMenu = require('../api/richMenuScript');
 

function isVerificationCode(code: string): boolean {
    var reg: RegExp = /[0-9]{6}/;
    var res: boolean = reg.test(code);

    if (res) return true;
    else return false;
}

async function postbackAction(event: any): Promise<any> {
    let postbackData = event.postback.data;
    if (isMobilePhone(postbackData)) {
        logFactory.log(postbackData);
        return request.register(event, postbackData);
    } else if (postbackData === client.registerWilling.NO) {
        let message = "期待您成為好合器會員！"
        return client.textMessage(event, message);
    } else if (Number(postbackData) === DataType.GetMoreInused || Number(postbackData) === DataType.Inused || Number(postbackData) === DataType.Record || Number(postbackData) === DataType.GetMoreRecord ) {
        return getDataEvent(event, Number(postbackData));
    } else if (Number(postbackData) === RewardType.Lottery || Number(postbackData) === RewardType.Redeem) {
        return getRewardImage(event, Number(postbackData));
    }
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
        deleteBinding(event);
        richMenu.bindRichmenuToUser("before", event.source.userId);
        const message = '已取消綁定'
        return client.textMessage(event, message);
    } catch (err) {
        logFactory.error(err);
        return failPromise(err);
    }
}

async function getContributionEvent(event: any): Promise<any> {
    logFactory.log('Event: get contribution');
    // try {
    //     let message: string;
    //     var result = await getContribution(event);
    //     switch (result) {
    //         case DatabaseState.USER_NOT_FOUND:
    //             message = '請輸入手機號碼以綁定 line id'
    //             return client.textMessage(event, message);
    //         default:
    //             return client.textMessage(event, '您的功德數為：' + result); 
    //     }
    // } catch (err) {
    //     logFactory.error(err);
    //     return failPromise(err);
    // }
    let view = new ContrubtionView();
    return client.flexMessage(event, view.getView());
}

async function getDataEvent(event: any, type): Promise<any> {
    logFactory.log('Event: get data');
    try {
        const result = await getRecord(event, type);
        client.flexMessage(event, result.getView());
    } catch (err) {
        logFactory.error(err);
    }
}

function getRewardImage(event, type) {
    let lotteryImage = "https://i.imgur.com/MwljlRm.jpg";
    let redeemImgae = "https://imgur.com/l2xiXxb.jpg";
    let url = type === RewardType.Lottery ? lotteryImage : redeemImgae;
    let image = {
        type: FlexMessage.ComponetType.image,
        originalContentUrl: url,
        previewImageUrl: url
    }

    return client.customMessage(event, image);    
}

async function getQRCodeEvent(event: any): Promise<any> { 
    logFactory.log('Event: get QRCode');
    try {
        var result = await getQrcode(event);
        if (result === DatabaseState.USER_NOT_FOUND) {
            let message = '請輸入手機號碼以綁定 line id'
            return client.textMessage(event, message);
        } else {
            let view = new QrcodeView(result);
            return client.flexMessage(event, view.getView());
        }
    } catch (err) {
        logFactory.error(err);
        return failPromise(err);
    }
}

function getContactWayEvent(event: any): Promise<any> {
    logFactory.log('Event: get contact way');
 
    const message = "好盒器工作室: (06)200-2341\n" +
    "FB: https://www.facebook.com/good.to.go.tw"
    return client.textMessage(event, message);
}

async function bindingEvent(event: any): Promise<any> {
    logFactory.log('Event: binding'); 
    try {
        let result = await bindLineId(event, event.message.text);
        let message: string;
        logFactory.log(result);
        switch(result) {
            case DatabaseState.USER_NOT_FOUND:
                message = "您還不是會員哦！\n請問要使用 " + event.message.text + " 為帳號註冊成為會員嗎？";
                return client.registerTemplate(event, message);
            case BindState.HAS_BOUND:
                message = "此手機已經綁定過摟！";
                return client.textMessage(event, message);
            case BindState.LINE_HAS_BOUND:
                message = "此 line 已經綁定過摟！";
                return client.textMessage(event, message);
            case BindState.SUCCESS:
                message = "綁定成功！";
                richMenu.bindRichmenuToUser("after", event.source.userId);
                return client.textMessage(event, message);
            case BindState.IS_NOT_MOBILEPHONE:
                message = "請輸入要綁定的手機號碼！";
                return client.textMessage(event, message); 
        }
    } catch (err) {
        logFactory.error(err);  
        return failPromise(err);
    } 
} 

function registerEvent(event: any): void {
    logFactory.log('Event: register');
}


async function verificateEvent (event: any): Promise<any> {
    try {
        const result = await findSignal(event);
        if (isMobilePhone(result)) {
            request.verificate(event, result);
        }
    } catch (err) {
        logFactory.error(err);
        return failPromise(err);
    }
}



 
module.exports = {
    bot: function(event: any) : any {
        if ((event.type !== 'message' || event.message.type !== 'text') && event.type !== 'follow' && event.type !== 'unfollow' &&
            event.type !== 'postback') {
            logFactory.error('Event Type: Wrong Type');

            return Promise.resolve(null);
        }
        if (event.type === 'postback') {
            postbackAction(event);
        }
        if (event.type === 'follow') {
            followEvent(event);
        } else if (event.type === 'unfollow' || event.message.text === '解除綁定') {
            unfollowOrUnBoundEvent(event);
        } else if (event.message.text === "我的好杯幣") {
            getContributionEvent(event);
        } else if (event.message.text === "使用中容器") {
            getDataEvent(event, DataType.Inused);
        } else if (event.message.text === "我的會員卡") {
            getQRCodeEvent(event);
        } else if (event.message.text === "聯絡好盒器") {
            getContactWayEvent(event);
            
        } else if (event.message.text === "綁定手機") {
            bindingEvent(event);
            // client.textMessage(event, "請輸入手機號碼");
        } else if (event.message.text === "註冊") {
            registerEvent(event);
        } else if (isMobilePhone(event.message.text)) {
            bindingEvent(event);
        } else if (isVerificationCode(event.message.text)) {
            verificateEvent(event);
        } else {
            logFactory.log("Event: not our business");
            // client.textMessage(event, "如果有需要任何服務請點選下列表單哦!");
        }
    }
}
