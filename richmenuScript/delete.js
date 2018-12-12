let exec = require('child_process').exec;

var argv = process.argv.slice(2);
var richmenuId = argv[0];
var channelAccessToken = argv[1];

var cmd = 'curl -v -X DELETE https://api.line.me/v2/bot/richmenu/' + richmenuId + ' \
-H "Authorization: Bearer ' + channelAccessToken + '"'
console.log(cmd);
exec(cmd, function(err, stdout, stderr) {
    if (err)
        return console.log('get bind rich menu api error:' + stderr);
    console.log(stdout);
});