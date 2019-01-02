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
const router = express.Router();
exports.webhook = router;
const eventHandler = require('../controller/eventHandler');
const logFactory = require('../lib/logFactory')('linebot:app');
router.post('/linebot', (req, res) => {
    Promise
        .all(req.body.events.map(eventHandler.bot))
        .then(result => res.json(result))
        .catch(err => logFactory.error(err));
});
router.post('/serviceEvent', (req, res) => {
    console.log(req.body);
});
//# sourceMappingURL=webhook.js.map