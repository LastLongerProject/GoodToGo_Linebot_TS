import {
    Client,
    middleware,
    JSONParseError,
    SignatureValidationFailed,
    TemplateMessage,
    WebhookEvent
} from '@line/bot-sdk';
import { text } from 'body-parser';

const logFactory = require('../api/logFactory')('linebot:eventHandler');
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

module.exports = {
    textMessage: returnTextMessage
}