import {
    Client,
    middleware,
    JSONParseError,
    SignatureValidationFailed,
    TemplateMessage,
    WebhookEvent
} from '@line/bot-sdk';
import { text } from 'body-parser';
import { QrcodeView } from '../etl/view/qrcodeView';
import { FlexMessage } from '../etl/models/flexMessage';

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


function returnQrcode(event, phone: string) {
    var baseUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="
    let view = new QrcodeView();
    let insertDash = phone.substring(0,4) + "-" + phone.substring(4,7) + "-" + phone.substring(7);
    
    let qrcode = {
        type: 'image',
        url: baseUrl + phone,
        margin: FlexMessage.Margin.xxl,
        size: FlexMessage.Margin.xl
    }

    let phoneObj = {
        type: FlexMessage.ComponetType.text,
        text: insertDash,
        size: FlexMessage.Size.md,
        align: FlexMessage.Align.center
    }

    view.pushBodyContent(phoneObj);
    view.pushBodyContent(qrcode);
    view.pushSpacer();
    let flex = view.getView();
    return returnFlexMessage(event, flex);
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
 
export  {
    returnTextMessage as textMessage,
    returnQrcode as getQrcode,
    registerTemplate as registerTemplate,
    returnFlexMessage as flexMessage
}