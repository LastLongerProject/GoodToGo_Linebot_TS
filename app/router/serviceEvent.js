"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const tool_1 = require("../lib/tool");
const richMenuScript_1 = require("../lib/richMenuScript");
const router = express.Router();
exports.serviceEvent = router;
const logFactory = require('../lib/logFactory')('linebot:webhook/serviceEvent');
router.post('/', (req, res, next) => {
    res.status(200);
    tool_1.getUserDetail(req.body.para)
        .then(result => richMenuScript_1.switchRichmenu(result.usingAmount + result.lostAmount, result.lineToken))
        .catch(err => logFactory.error("err"));
});
function getip(req) {
    return req.headers["x-real-ip"] ||
        req.ip ||
        req._remoteAddress ||
        (req.connection && req.connection.remoteAddress) ||
        undefined;
}
//# sourceMappingURL=serviceEvent.js.map