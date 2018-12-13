import express = require('express');
import {
    JSONParseError,
    SignatureValidationFailed
} from '@line/bot-sdk';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as fs from 'fs';
import rfs from 'rotating-file-stream';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

// set config
import _ = require('lodash');

const config = require('./config/config.json');

const defaultConfig: Object = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);
global.gConfig = finalConfig;

import { redisClient } from './models/db/redisClient';
import { lineWebhook } from './router/linebot';

const logFactory = require('./lib/logFactory')('linebot:app');
const app: express.Application = express();
const logDirectory = path.join(__dirname, 'log');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

/*
 *  init database
 */

redisClient.select(5, (err, res) => {
    if (err) return logFactory.error(err);
    logFactory.log(res);
});

redisClient.on('connect', function () {
    logFactory.log('Redis client connected');
});

redisClient.on('error', function (err) {
    logFactory.error('Something went wrong ' + err);
});

mongoose.connect(global.gConfig.mongodbUrl, { useNewUrlParser: true })
    .then(res => logFactory.log("connect db successfully"))
    .catch(err => logFactory.error(err));

mongoose.set('useCreateIndex', true);


/*
 *  router
 */
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));

app.use('/webhook', lineWebhook);

/**
 *  error handler
 */
// catch @line-sdk error
app.use((err, req, res, next) => {
    if (err instanceof SignatureValidationFailed) {
        res.status(401).send(err.signature);
        return;
    } else if (err instanceof JSONParseError) {
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
