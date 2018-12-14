import { Client } from '@line/bot-sdk';
import { RegisterState } from '../../lib/enumManager';
const logFactory = require('../../lib/logFactory')('linebot:eventHandler');
const client = new Client(global.gConfig.bot);

function returnTextMessage(event: any, message: string): Promise<any> {
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: message
    }).catch((err) => {
        if (err) {
            logFactory.error(JSON.stringify(err.originalError.response.config.data));
            logFactory.error(JSON.stringify(err.originalError.response.data));
        }
    });
}

function returnCustomObject(event, obj) {
    return client.replyMessage(event.replyToken, obj).catch((err) => {
        if (err) {
            logFactory.error(JSON.stringify(err.originalError.response.config.data));
            logFactory.error(JSON.stringify(err.originalError.response.data));
        }
    });
}

function registerTemplate(event, message) {
    return client.replyMessage(event.replyToken, {
        type: "template",
        altText: "註冊會員",
        template: {
            type: "confirm",
            text: message,
            actions: [{
                type: "postback",
                label: "是",
                data: event.message.text
            },
            {
                type: "postback",
                label: "否",
                data: RegisterState.NO
            }
            ]
        }
    }).catch(err => {
        logFactory.error(JSON.stringify(err.originalError.response.config.data));
        logFactory.error(JSON.stringify(err.originalError.response.data));
    });
}

function returnFlexMessage(event, flex) {
    return client.replyMessage(event.replyToken, flex).catch(err => {
        logFactory.error(JSON.stringify(err.originalError.response.config.data));
        logFactory.error(JSON.stringify(err.originalError.response.data));
    });;
}

export {
    returnTextMessage as textMessage,
    registerTemplate as registerTemplate,
    returnFlexMessage as flexMessage,
    returnCustomObject as customMessage
}