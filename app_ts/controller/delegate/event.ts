import { deleteBinding, bindLineId, findSignal, getData, getQrcode } from "../../models/serviceProcess";
import * as client from './client';
import { failPromise } from "../../lib/customPromise";
import { DatabaseState, BindState } from "../../lib/enumManager";
import { isMobilePhone } from "../../lib/tool";
import * as request from '../../lib/request';
import { QrcodeView } from "../../etl/view/qrcodeView";
import { ContrubtionView } from "../../etl/view/contributionView";
import { ContactView } from "../../etl/view/contactView";

const logFactory = require('../../lib/logFactory')('linebot:eventDelegate');
const richMenu = require('../../lib/richMenuScript');

function followEvent(event: any): void {
    logFactory.log('Event: added or unblocked');

    const message =
        '感謝您將本帳號加為好友！\n如果是初次使用請先輸入手機號碼以綁定line帳號綁定完成後即可使用本帳號提供的服務！';

    client.textMessage(event, message);
}

async function unfollowOrUnBoundEvent(event: any): Promise<any> {
    if (event.type === 'unfollow') logFactory.log('Event: unfollowed');
    else logFactory.log('Event: delete bind');
    try {
        deleteBinding(event);
        richMenu.bindRichmenuToUser('before', event.source.userId);
        const message = '已取消綁定';

        return client.textMessage(event, message);
    } catch (err) {
        logFactory.error(err);
        return failPromise(err);
    }
}

async function bindingEvent(event: any): Promise<any> {
    logFactory.log('Event: binding');

    try {
        let result = await bindLineId(event, event.message.text);
        let message: string;
        logFactory.log(result);
        switch (result) {
            case DatabaseState.USER_NOT_FOUND:
                message =
                    '您還不是會員哦！\n請問要使用 ' +
                    event.message.text +
                    ' 為帳號註冊成為會員嗎？';
                return client.registerTemplate(event, message);
            case BindState.PHONE_HAS_BOUND:
                message = '此手機已經綁定過摟！';
                return client.textMessage(event, message);
            case BindState.LINE_HAS_BOUND:
                message = '此 line 已經綁定過摟！';
                return client.textMessage(event, message);
            case BindState.SUCCESS:
                message = '綁定成功！';
                richMenu.bindRichmenuToUser('after', event.source.userId);
                return client.textMessage(event, message);
            case BindState.IS_NOT_PHONE:
                message = '請輸入要綁定的手機號碼！';
                return client.textMessage(event, message);
        }
    } catch (err) {
        logFactory.error(err);
        return failPromise(err);
    }
}

async function verificateEvent(event: any): Promise<any> {

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

async function getDataEvent(event: any, type): Promise<any> {
    logFactory.log('Event: get data');
    try {
        const result = await getData(event, type);
        return client.flexMessage(event, result.getView());
    } catch (err) {
        return logFactory.error(err);
    }
}

async function getQRCodeEvent(event: any): Promise<any> {

    logFactory.log('Event: get QRCode');
    try {
        var result = await getQrcode(event);
        if (result === DatabaseState.USER_NOT_FOUND) {
            let message = '請輸入手機號碼以綁定 line id';

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

    let view = new ContactView();

    return client.flexMessage(event, view.getView());
}

function getGoodtogo(event: any) {
    logFactory.log('Event: get GoodToGo');
    let message = {
        type: "imagemap",
        baseUrl: "https://imgur.com/FUvdzIa.png",
        altText: "合作店家",
        baseSize: {
            width: 520,
            height: 520
        },
        actions: [
            {
                type: "uri",
                linkUri: "https://goodtogo.tw/#3",
                area: {
                    x: 0,
                    y: 0,
                    width: 520,
                    height: 520
                }
            }
        ]
    }

    return client.customMessage(event, message);
}

async function getContributionEvent(event: any): Promise<any> {
    logFactory.log('Event: get contribution');

    let view = new ContrubtionView();
    return client.flexMessage(event, view.getView());
}

export {
    unfollowOrUnBoundEvent, bindingEvent, verificateEvent, getDataEvent, getQRCodeEvent
    , getContactWayEvent, followEvent, getContributionEvent, getGoodtogo
}