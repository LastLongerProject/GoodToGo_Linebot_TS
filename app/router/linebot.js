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
const bot_sdk_1 = require("@line/bot-sdk");
const router = express.Router();
exports.lineWebhook = router;
const eventHandler = require('../controller/eventHandler');
const logFactory = require('../lib/logFactory')('linebot:app');
router.post('/linebot', bot_sdk_1.middleware(global.gConfig.bot), (req, res) => {
    Promise
        .all(req.body.events.map(eventHandler.bot))
        .then(result => res.json(result))
        .catch(err => logFactory.error(err));
});
//# sourceMappingURL=linebot.js.map