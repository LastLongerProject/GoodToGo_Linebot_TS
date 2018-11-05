"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const config = require('./config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);
// export const bot = finalConfig.bot;
//# sourceMappingURL=configSetting.js.map