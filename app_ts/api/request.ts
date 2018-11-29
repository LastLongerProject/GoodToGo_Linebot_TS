import request from 'request';
import { successPromise, failPromise } from './customPromise';
import * as client from '../controller/clientDelegate';
import {
    addVerificationSignal,
    deleteSignal,
    bindLineId,
} from '../models/serviceProcess';
import { randomHexString } from './tool';

const logFactory = require('./logFactory.js')('linebot:request');

export namespace RegisterState {
    export const SUCCESS = 'register success',
        IN_VERIFICATION = 'wait for verification',
        SERVER_ERROR = 'server error';
}

async function register(event: any, phone: string): Promise<any> {
    const requestObject = {
        uri: 'https://app.goodtogo.tw/test/users/signup',
        method: 'POST',
        json: true,
        headers: {
            'User-Agent': 'goodtogo_linebot',
            reqID: randomHexString(10),
            reqTime: Date.now(),
        },
        body: {
            phone: phone,
            password: '',
        },
    };

    request(requestObject, (error, response, body) => {
        if (error) return logFactory.error(error);
        if (response.body.code === undefined) {
            logFactory.log(body);
            const message =
                "已寄簡訊認證到您的手機囉！\n請輸入收到的驗證碼～\n若想取消請輸入'否'\n(驗證將在 3 分鐘後過期)";
            return addVerificationSignal(event, phone)
                .then(res => {
                    client.textMessage(event, message);
                })
                .catch(err => {
                    client.textMessage(event, '伺服器出現錯誤\n請向好合器反應或稍後再試');
                    logFactory.error(err);
                });
        }

        logFactory.error('fail code is: ' + response.body.code);
        const message = '伺服器出現問題\n請稍後再試';
        return client.textMessage(event, message);
    });
}

async function verificate(event: any, phone): Promise<any> {
    const requestObject = {
        uri: 'https://app.goodtogo.tw/test/users/signup',
        method: 'POST',
        json: true,
        headers: {
            'User-Agent': 'goodtogo_linebot',
            reqID: randomHexString(10),
            reqTime: Date.now(),
        },
        body: {
            phone: phone,
            password: '',
            verification_code: event.message.text,
        },
    };

    request(requestObject, (error, response, body) => {
        if (error) return logFactory.error(error);
        if (response.body.code === undefined) {
            deleteSignal(event);
            bindLineId(event, phone);
            const message = '恭喜您成為好合器會員囉！';
            return client.textMessage(event, message);
        }

        logFactory.error('fail code is: ' + response.body.code);
        const message = '伺服器出現問題\n請稍後再試';
        return client.textMessage(event, message);
    });
}

function request_module(resquestObject, callback) {
    request(resquestObject, callback);
}

export { register, verificate };
