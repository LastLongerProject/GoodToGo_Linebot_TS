let exec = require('child_process').exec;

const argv = process.argv.slice(2);
const richmenuId = argv[0];
const channelAccessToken = argv[1];
const imagePath = argv[2];

var cmd = 'curl -v -X POST https://api.line.me/v2/bot/richmenu/' + richmenuId + '/content \
-H "Authorization: Bearer ' + channelAccessToken + '" \
-H "Content-Type: image/jpeg" \
-T ' + imagePath

exec(cmd, function(err, stdout, stderr) {
    if (err)
        return console.log('get bind rich menu api error:' + stderr);
    console.log(stdout);
});