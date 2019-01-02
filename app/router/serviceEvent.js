"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const axios_1 = __importDefault(require("axios"));
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const router = express.Router();
exports.serviceEvent = router;
router.post('/', (req, res) => {
    let payload = {
        jti: 'manager',
        iat: Date.now(),
        exp: Date.now() + 86400000 * 3,
    };
    let auth = jwt_simple_1.default.encode(payload, global.gConfig.serverKey.secretKey);
    axios_1.default({
        method: 'get',
        url: global.gConfig.apiBaseUrl + '/manage/userDetail?id=' + req.body.para,
        headers: {
            'Authorization': auth,
            'Apikey': global.gConfig.serverKey.apiKey
        }
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
});
//# sourceMappingURL=serviceEvent.js.map