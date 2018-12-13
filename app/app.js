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
const express = require("express");
const bot_sdk_1 = require("@line/bot-sdk");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const rotating_file_stream_1 = __importDefault(require("rotating-file-stream"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
// set config
const _ = require("lodash");
const config = require('./config/config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);
global.gConfig = finalConfig;
const redisClient_1 = require("./models/db/redisClient");
const linebot_1 = require("./router/linebot");
const logFactory = require('./lib/logFactory')('linebot:app');
const app = express();
const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rotating_file_stream_1.default('access.log', {
    interval: '1d',
    path: logDirectory
});
/*
 *  init database
 */
redisClient_1.redisClient.select(5, (err, res) => {
    if (err)
        return logFactory.error(err);
    logFactory.log(res);
});
redisClient_1.redisClient.on('connect', function () {
    logFactory.log('Redis client connected');
});
redisClient_1.redisClient.on('error', function (err) {
    logFactory.error('Something went wrong ' + err);
});
mongoose_1.default.connect(global.gConfig.mongodbUrl, { useNewUrlParser: true })
    .then(res => logFactory.log("connect db successfully"))
    .catch(err => logFactory.error(err));
mongoose_1.default.set('useCreateIndex', true);
/*
 *  router
 */
app.use(helmet_1.default());
app.use(morgan_1.default('combined', { stream: accessLogStream }));
app.use('/webhook', linebot_1.lineWebhook);
/**
 *  error handler
 */
// catch @line-sdk error
app.use((err, req, res, next) => {
    if (err instanceof bot_sdk_1.SignatureValidationFailed) {
        res.status(401).send(err.signature);
        return;
    }
    else if (err instanceof bot_sdk_1.JSONParseError) {
        res.status(400).send(err.raw);
        return;
    }
    next(err);
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    logFactory.error(err);
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
//# sourceMappingURL=app.js.map