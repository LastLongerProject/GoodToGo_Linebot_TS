let exec = require('child_process').exec;
let logFactory = require('./logFactory')('linebot:richmenuScript');

let bot = global.gConfig.bot;

let richmenuType = {
    beforeBinding: function (lineId) {
        return (
            'curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            bot.richmenu_before +
            ' \
        -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""'
        );
    },
    afterBinding: function (lineId) {
        return (
            'curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            bot.richmenu_after +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""'
        );
    },
};

module.exports = {
    bindRichmenuToUser: function (type, lineId) {
        if (type === 'before') {
            exec(richmenuType.beforeBinding(lineId), function (err, stdout, stderr) {
                if (err)
                    return logFactory.error('get bind rich menu api error:' + stderr);
            });
        } else if (type === 'after') {
            exec(richmenuType.afterBinding(lineId), function (err, stdout, stderr) {
                if (err)
                    return logFactory.error('get bind rich menu api error:' + stderr);
            });
        }
    },
};
