"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_sdk_1 = require("@line/bot-sdk");
const logFactory = require('../../api/logFactory')('linebot:eventHandler');
const client = new bot_sdk_1.Client(global.gConfig.bot);
var registerWilling;
(function (registerWilling) {
    registerWilling.YES = "Wanna become member", registerWilling.NO = "Do not wanna become member";
})(registerWilling = exports.registerWilling || (exports.registerWilling = {}));
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
exports.textMessage = returnTextMessage;
function returnCustomObject(event, obj) {
    return client.replyMessage(event.replyToken, obj).catch((err) => {
        if (err) {
            logFactory.error(JSON.stringify(err.originalError.response.config.data));
            logFactory.error(JSON.stringify(err.originalError.response.data));
        }
    });
}
exports.customMessage = returnCustomObject;
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
exports.registerTemplate = registerTemplate;
function returnFlexMessage(event, flex) {
    return client.replyMessage(event.replyToken, flex).catch(err => {
        logFactory.error(JSON.stringify(err.originalError.response.config.data));
        logFactory.error(JSON.stringify(err.originalError.response.data));
    });
    ;
}
exports.flexMessage = returnFlexMessage;
//# sourceMappingURL=clientDelegate.js.map