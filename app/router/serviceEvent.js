"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const router = express.Router();
exports.serviceEvent = router;
const logFactory = require('../lib/logFactory')('linebot:webhook/serviceEvent');
router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let result = yield tool_1.getUserDetail(req.body.para);
    if (result === "Get user detail success" /* SUCCESS */)
        return res.status(200);
    logFactory.error(result);
    res.status(404).json({
        message: 'Get userDetail failed from linebot'
    });
}));
//# sourceMappingURL=serviceEvent.js.map