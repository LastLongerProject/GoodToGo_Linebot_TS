import { RichmenuType } from "./enumManager";
const exec = require('child_process').exec;
const logFactory = require('./logFactory')('linebot:richmenuScript');
const richmenuId = require('../models/richmenuID.json');
const bot = global.gConfig.bot;
const env = process.env.NODE_ENV;
let richmenu = richmenuId[String(env)];

let richmenuType = {
    beforeBinding: function (lineId) {
        return (
            'curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richmenu_before +
            ' \
        -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""'
        );
    },
    _0: function (lineId) {
        return (
            'curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_0 +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""'
        );
    },
    _1: function (lineId) {
        return (
            'curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_1 +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""'
        );
    },
    _2: function (lineId) {
        return (
            'curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_2 +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""'
        );
    },
    _3: function (lineId) {
        return (
            'curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_3 +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""'
        );
    },
    _4: function (lineId) {
        return (
            'curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_4 +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""'
        );
    },
    _5: function (lineId) {
        return (
            'curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_5 +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""'
        );
    },
    more: function (lineId) {
        return (
            'curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_more +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""'
        );
    },
    after: function (lineId) {
        return (
            'curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richmenu_after +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""'
        );
    }
};

function bindRichmenuToUser(type, lineId) {
    if (type === RichmenuType.BEFORE) {
        exec(richmenuType.beforeBinding(lineId), function (err, stdout, stderr) {
            if (err)
                return logFactory.error('get bind rich menu api error:' + stderr);
        });
    } else if (type === RichmenuType._0) {
        exec(richmenuType._0(lineId), function (err, stdout, stderr) {
            if (err)
                return logFactory.error('get bind rich menu api error:' + stderr);
        });
    } else if (type === RichmenuType._1) {
        exec(richmenuType._1(lineId), function (err, stdout, stderr) {
            if (err)
                return logFactory.error('get bind rich menu api error:' + stderr);
        });
    } else if (type === RichmenuType._2) {
        exec(richmenuType._2(lineId), function (err, stdout, stderr) {
            if (err)
                return logFactory.error('get bind rich menu api error:' + stderr);
        });
    } else if (type === RichmenuType._3) {
        exec(richmenuType._3(lineId), function (err, stdout, stderr) {
            if (err)
                return logFactory.error('get bind rich menu api error:' + stderr);
        });
    } else if (type === RichmenuType._4) {
        exec(richmenuType._4(lineId), function (err, stdout, stderr) {
            if (err)
                return logFactory.error('get bind rich menu api error:' + stderr);
        });
    } else if (type === RichmenuType._5) {
        exec(richmenuType._5(lineId), function (err, stdout, stderr) {
            if (err)
                return logFactory.error('get bind rich menu api error:' + stderr);
        });
    } else if (type === RichmenuType.MORE) {
        exec(richmenuType.more(lineId), function (err, stdout, stderr) {
            if (err)
                return logFactory.error('get bind rich menu api error:' + stderr);
        });
    } else if (type === 'after') {
        exec(richmenuType.after(lineId), function (err, stdout, stderr) {
            if (err)
                return logFactory.error('get bind rich menu api error:' + stderr);
        });
    }
}

function switchRichmenu(amount, lineToken): void {
    if (amount === 0)
        bindRichmenuToUser(RichmenuType._0, lineToken);
    else if (amount === 1)
        bindRichmenuToUser(RichmenuType._1, lineToken);
    else if (amount === 2)
        bindRichmenuToUser(RichmenuType._2, lineToken);
    else if (amount === 3)
        bindRichmenuToUser(RichmenuType._3, lineToken);
    else if (amount === 4)
        bindRichmenuToUser(RichmenuType._4, lineToken);
    else if (amount === 5)
        bindRichmenuToUser(RichmenuType._5, lineToken);
    else if (amount > 5)
        bindRichmenuToUser(RichmenuType.MORE, lineToken);
    else
        bindRichmenuToUser(RichmenuType.BEFORE, lineToken);
}

export { switchRichmenu, bindRichmenuToUser }
