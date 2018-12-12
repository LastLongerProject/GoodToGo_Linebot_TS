let exec = require('child_process').exec;

var argv = process.argv.slice(2);
var richmenuId = argv[0];
var channelAccessToken = argv[1];
var name = argv[2];

var cmd = 'curl -v -X GET "https://api.line.me/v2/bot/richmenu/' + richmenuId + '/content" \
-H "Authorization: Bearer ' + channelAccessToken + '" \
-o ' + name
console.log(argv);

exec(cmd, function(err, stdout, stderr) {
    if (err)
        return console.log('get bind rich menu api error:' + stderr);
    console.log(stdout);
});