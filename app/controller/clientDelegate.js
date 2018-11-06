"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_sdk_1 = require("@line/bot-sdk");
const logFactory = require('../api/logFactory')('linebot:eventHandler');
const client = new bot_sdk_1.Client(global.gConfig.bot);
function returnTextMessage(event, message) {
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
function returnQrcode(event, phone) {
    var baseUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=";
    function getQrcodeImage(phone) {
        return baseUrl + phone;
    }
    return client.replyMessage(event.replyToken, {
        type: 'image',
        originalContentUrl: baseUrl + phone,
        previewImageUrl: baseUrl + phone
    }).catch((err) => {
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
                    type: "message",
                    label: "是",
                    text: "是"
                },
                {
                    type: "message",
                    label: "否",
                    text: "否"
                }
            ]
        }
    }).catch(err => {
        logFactory.error(JSON.stringify(err.originalError.response.config.data));
        logFactory.error(JSON.stringify(err.originalError.response.data));
    });
}
module.exports = {
    textMessage: returnTextMessage,
    getQrcode: returnQrcode,
    registerTemplate: registerTemplate
};
//# sourceMappingURL=clientDelegate.js.map