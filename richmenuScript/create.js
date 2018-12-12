const exec = require('child_process').exec;
const fs = require('fs');

const argv = process.argv.slice(2);
const channelAccessToken = argv[0];
var richmenu = {
    "size": {
        "width": 2500,
        "height": 1686
    },
    "selected": true,
    "name": "own more than five container",
    "chatBarText": "好盒器選單",
    "areas": [{
            "bounds": {
                "x": 0,
                "y": 0,
                "width": 832,
                "height": 842
            },
            "action": {
                "type": "postback",
                "text": "使用中容器",
                "data": "使用中容器"

            }
        },
        {
            "bounds": {
                "x": 0,
                "y": 844,
                "width": 832,
                "height": 842
            },
            "action": {
                "type": "postback",
                "text": "我的環境影響力",
                "data": "我的環境影響力"
            }
        },
        {
            "bounds": {
                "x": 834,
                "y": 0,
                "width": 832,
                "height": 842
            },
            "action": {
                "type": "postback",
                "text": "我的會員卡",
                "data": "我的會員卡"

            }
        },
        {
            "bounds": {
                "x": 834,
                "y": 844,
                "width": 832,
                "height": 842
            },
            "action": {
                "type": "postback",
                "text": "解除綁定",
                "data": "解除綁定"

            }
        },
        {
            "bounds": {
                "x": 1668,
                "y": 0,
                "width": 832,
                "height": 842
            },
            "action": {
                "type": "uri",
                "label": "好盒器合作店家",
                "uri": "https://goodtogo.tw/#3"
            }
        },
        {
            "bounds": {
                "x": 1668,
                "y": 844,
                "width": 832,
                "height": 842
            },
            "action": {
                "type": "postback",
                "text": "聯絡好盒器",
                "data": "聯絡好盒器"
            }
        }
    ]
}

var cmd = 'curl -v POST "https://api.line.me/v2/bot/richmenu" \
-H "Authorization: Bearer ' + channelAccessToken + '" \
-H "Content-Type: application/json" \
-d ' + "'" + JSON.stringify(richmenu) + "'";

exec(cmd, function(err, stdout, stderr) {
    if (err)
        return console.log('get bind rich menu api error:' + stderr);
    console.log(stdout);
    fs.appendFile("richmenu.json", stdout, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
});