"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
const redisClient = redis_1.default.createClient(global.gConfig.redis);
exports.redisClient = redisClient;
const getAsync = util_1.promisify(redisClient.get).bind(redisClient);
exports.getAsync = getAsync;
const setAsync = util_1.promisify(redisClient.set).bind(redisClient);
exports.setAsync = setAsync;
//# sourceMappingURL=redisClient.js.map