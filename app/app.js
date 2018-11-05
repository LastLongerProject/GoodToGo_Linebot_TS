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
// import * as mongoose from 'mongoose';
const bodyParser = __importStar(require("body-parser"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const rotating_file_stream_1 = __importDefault(require("rotating-file-stream"));
// set config
const _ = require("lodash");
const config = require('./config/config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);
global.gConfig = finalConfig;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const eventHandler = require('./controller/eventHandler');
const logFactory = require('./api/logFactory')('linebot:app');
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
mongoose.connect(finalConfig.database, { useNewUrlParser: true })
    .then(res => logFactory.log("connect db successfully"))
    .catch(err => logFactory.error(err));
/*
 *  router
 */
app.post('/webhook', bot_sdk_1.middleware(global.gConfig.bot), (req, res) => {
    Promise
        .all(req.body.events.map(eventHandler.bot))
        .then(result => res.json(result))
        .catch(err => logFactory.error(err));
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/**
 *  error handler
 */
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    Object.defineProperty(err, 'status', {
        value: 404
    });
    next(err);
});
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
module.exports = app;
//# sourceMappingURL=app.js.map