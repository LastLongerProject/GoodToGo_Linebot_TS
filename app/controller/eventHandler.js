"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("../lib/tool");
const postbackEventHandler_1 = require("./postback/postbackEventHandler");
const event_1 = require("./delegate/event");
const logFactory = require('../lib/logFactory')('linebot:eventHandler');
function postbackAction(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let postbackData = event.postback.data;
        postbackEventHandler_1.postbackHandler(event, postbackData);
    });
}
module.exports = {
    bot: function (event) {
        if ((event.type !== 'message' || event.message.type !== 'text') &&
            event.type !== 'follow' && event.type !== 'unfollow' && event.type !== 'postback') {
            logFactory.error('Event Type: Wrong Type');
            return Promise.resolve(null);
        }
        else if (event.type === 'postback') {
            postbackAction(event);
        }
        else if (event.type === 'follow') {
            event_1.followEvent(event);
        }
        else if (event.type === 'unfollow' || event.message.text === '解除綁定') {
            event_1.unfollowOrUnBoundEvent(event);
        }
        else if (event.message.text === '我的環境影響力') {
            event_1.getContributionEvent(event);
        }
        else if (event.message.text === '使用中容器') {
            event_1.getDataEvent(event, "in used" /* IN_USED */);
        }
        else if (event.message.text === '我的會員卡') {
            event_1.getQRCodeEvent(event);
        }
        else if (event.message.text === '聯絡好盒器') {
            event_1.getContactWayEvent(event);
        }
        else if (event.message.text === '綁定手機') {
            event_1.bindingEvent(event);
        }
        else if (event.message.text === '哪裡有好盒器') {
            event_1.getGoodtogo(event);
        }
        else if (tool_1.isMobilePhone(event.message.text)) {
            event_1.bindingEvent(event);
        }
        else if (tool_1.isVerificationCode(event.message.text)) {
            event_1.verificateEvent(event);
        }
        else {
            event_1.notOurEvent(event);
        }
    },
};
//# sourceMappingURL=eventHandler.js.map