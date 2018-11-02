"use strict";
const logFactory = require('../api/logFactory');
module.exports = {
    bot: function (event) {
        console.log(typeof (event));
        console.log(event.message.text);
        if ((event.type !== 'message' || event.message.type !== 'text') && event.type !== 'follow' && event.type !== 'unfollow' &&
            event.type !== 'postback') {
            logFactory.error('Event Type: Wrong Type');
            return Promise.resolve(null);
        }
        if (event.type === 'postback') {
            // recordPostback(event);
        }
        if (event.type === 'follow') {
            // followEvent(event);
        }
        else if (event.type === 'unfollow' || event.message.text === '取消') {
            // blockedOrUnboundEvnetHandler(event);
        }
        if (event.message.text === "功德") {
            // getContribution(event);
        }
        // else if (isMobilePhone(event.message.text)) {
        //     // bindLineId(event);
        // } else if (isVerificationCode(event.message.text)) {
        //     // request.registerVerification(event);
        // } 
        else if (event.message.text === "是" || event.message.text === "否") {
            // yesNoEventHandler(event);
        }
        else if (event.message.text === "使用") {
            // getRecord(event);
        }
        else if (event.message.text === "QRcode") {
            // getQrcode(event);
        }
        else if (event.message.text === "聯絡客服") {
            logFactory.log("Message: customer service infomation");
            // client.textMessage(event, "好盒器工作室: (06)200-2341\n" +
            //     "FB: https://www.facebook.com/good.to.go.tw");
        }
        else if (event.message.text === "綁定") {
            logFactory.log("Message: customer service infomation");
            // client.textMessage(event, "請輸入手機號碼");
        }
        else if (event.message.text === "註冊") {
            // client.textMessage(event, "請輸入手機號碼");
        }
        else {
            logFactory.log("Message: not our business");
            // client.textMessage(event, "如果有需要任何服務請點選下列表單哦!");
        }
    }
};
//# sourceMappingURL=eventHandler.js.map