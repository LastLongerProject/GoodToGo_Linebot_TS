import {
    Client
} from '@line/bot-sdk';

const logFactory = require('../api/logFactory')('linebot:eventHandler');
const client = new Client(global.gConfig.bot);

export namespace registerWilling {
    export const
        YES = "Wanna become member",
        NO = "Do not wanna become member";
}

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
                data: registerWilling.NO
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