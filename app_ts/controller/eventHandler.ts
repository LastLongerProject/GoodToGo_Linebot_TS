import { isMobilePhone, isVerificationCode } from '../lib/tool';

import { DataType } from '../lib/enumManager';
import { postbackHandler } from './postback/postbackEventHandler';
import { followEvent, unfollowOrUnBoundEvent, getContributionEvent, getDataEvent, getQRCodeEvent, getContactWayEvent, bindingEvent, verificateEvent } from './delegate/event';

const logFactory = require('../lib/logFactory')('linebot:eventHandler');


async function postbackAction(event: any): Promise<any> {
    let postbackData = event.postback.data;
    postbackHandler(event, postbackData);
}

module.exports = {
    bot: function (event: any): any {
        if (
            (event.type !== 'message' || event.message.type !== 'text') &&
            event.type !== 'follow' &&
            event.type !== 'unfollow' &&
            event.type !== 'postback'
        ) {
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
        } else if (event.message.text === '我的環境影響力') {
            getContributionEvent(event);
        } else if (event.message.text === '使用中容器') {
            getDataEvent(event, DataType.IN_USED);
        } else if (event.message.text === '我的會員卡') {
            getQRCodeEvent(event);
        } else if (event.message.text === '聯絡好盒器') {
            getContactWayEvent(event);
        } else if (event.message.text === '綁定手機') {
            bindingEvent(event);
            // client.textMessage(event, "請輸入手機號碼");
        } else if (isMobilePhone(event.message.text)) {
            bindingEvent(event);
        } else if (isVerificationCode(event.message.text)) {
            verificateEvent(event);
        } else {
            logFactory.log('Event: not our business');
            // client.textMessage(event, "如果有需要任何服務請點選下列表單哦!");
        }
    },
};

