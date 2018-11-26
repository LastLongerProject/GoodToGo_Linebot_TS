"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const client = __importStar(require("../controller/clientDelegate"));
const serviceProcess_1 = require("../models/serviceProcess");
const logFactory = require('./logFactory.js')('linebot:request');
var RegisterState;
(function (RegisterState) {
    RegisterState.SUCCESS = 'register success', RegisterState.IN_VERIFICATION = 'wait for verification', RegisterState.SERVER_ERROR = 'server error';
})(RegisterState = exports.RegisterState || (exports.RegisterState = {}));
function randomHexString(amount) {
    var text = '';
    var charSet = "0123456789ABCDEF";
    for (var i = 0; i < amount; i++) {
        text += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    return text;
}
function register(event, phone) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestObject = {
            uri: 'https://app.goodtogo.tw/test/users/signup',
            method: 'POST',
            json: true,
            headers: {
                'User-Agent': 'goodtogo_linebot',
                'reqID': randomHexString(10),
                'reqTime': Date.now()
            },
            body: {
                phone: phone,
                password: ""
            }
        };
        request_1.default(requestObject, (error, response, body) => {
            if (error)
                return logFactory.error(error);
            if (response.body.code === undefined) {
                logFactory.log(body);
                const message = "已寄簡訊認證到您的手機囉！\n請輸入收到的驗證碼～\n若想取消請輸入'否'\n(驗證將在 3 分鐘後過期)";
                return serviceProcess_1.addVerificationSignal(event, phone).then(res => {
                    client.textMessage(event, message);
                }).catch(err => {
                    client.textMessage(event, '伺服器出現錯誤\n請向好合器反應或稍後再試');
                    logFactory.error(err);
                });
            }
            logFactory.error('fail code is: ' + response.body.code);
            const message = "伺服器出現問題\n請稍後再試";
            return client.textMessage(event, message);
        });
    });
}
exports.register = register;
function verificate(event, phone) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestObject = {
            uri: 'https://app.goodtogo.tw/test/users/signup',
            method: 'POST',
            json: true,
            headers: {
                'User-Agent': 'goodtogo_linebot',
                'reqID': randomHexString(10),
                'reqTime': Date.now()
            },
            body: {
                phone: phone,
                password: "",
                verification_code: event.message.text
            }
        };
        request_1.default(requestObject, (error, response, body) => {
            if (error)
                return logFactory.error(error);
            if (response.body.code === undefined) {
                serviceProcess_1.deleteSignal(event);
                serviceProcess_1.bindLineId(event, phone);
                const message = "恭喜您成為好合器會員囉！";
                return client.textMessage(event, message);
            }
            logFactory.error('fail code is: ' + response.body.code);
            const message = "伺服器出現問題\n請稍後再試";
            return client.textMessage(event, message);
        });
    });
}
exports.verificate = verificate;
//# sourceMappingURL=request.js.map