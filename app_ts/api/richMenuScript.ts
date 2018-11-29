let exec = require('child_process').exec;
let logFactory = require('./logFactory')('linebot:richmenuScript');
let formal = 'gxS3/xEi58GEq7dF+m1Fw47WRw+Jmwm+lXfd9Z/dBJVET3mmfJu5mdF6mPYpH4D6frASHurqDUEsWkg6SXaJSuvf3BmoBIV0yMVfyZior38v7zlyV4Gnqqp0lIaoB545Q0l2Bx28bX1M0CaXNNZDfwdB04t89/1O/w1cDnyilFU='
let test = 'JC9QgwQrHMW8IIbzeK06QxpYmnHCmNfGnzzimgcpI/ASLYEKx0REduc60G1VFIvu/z/JjaDGU8xGollYFtpm+c9yfTwA29AwVzLs7Rf8V4dkjPKyIvHXdpU9ILEn/MabXzJ/9EtBtYu78tBhsBxqPgdB04t89/1O/w1cDnyilFU='

let cmdStr_beforeBinding = 'curl -v -X POST https://api.line.me/v2/bot/user/U82fbd0be20051fb3ad8d85d0974352fc/richmenu/richmenu-56fe6a2850a8e1f0b03439c468cf8dfc \
-H "Authorization: Bearer "' + formal;

let cmdStr_afterBinding = 'curl -v -X POST https://api.line.me/v2/bot/user/U82fbd0be20051fb3ad8d85d0974352fc/richmenu/richmenu-460f6302b2b4bb03012a7875f572db1d \
-H "Authorization: Bearer "' + formal;

let bot = global.gConfig.bot;

let richmenuType = {
    beforeBinding: function(lineId) {
        return 'curl -v -X POST https://api.line.me/v2/bot/user/' + lineId + '/richmenu/' + bot.richmenu_before + ' \
        -H "Authorization: Bearer "' + bot.channelAccessToken + ' -d ""'
    },
    afterBinding: function(lineId) {
        return 'curl -v -X POST https://api.line.me/v2/bot/user/' + lineId + '/richmenu/' + bot.richmenu_after + ' \
    -H "Authorization: Bearer "' + bot.channelAccessToken + ' -d ""'
    }
}

module.exports = {
    bindRichmenuToUser: function(type, lineId) {
        console.log(lineId)
        if (type === "before") {
            exec(richmenuType.beforeBinding(lineId), function(err, stdout, stderr) {
                if (err) return logFactory.error('get bind rich menu api error:' + stderr);
                console.log(stdout);

            });
        } else if (type === "after") {
            exec(richmenuType.afterBinding(lineId), function(err, stdout, stderr) {
                if (err) return logFactory.error('get bind rich menu api error:' + stderr);
                console.log(stdout);

            });
        }
    }
}