import * as express from 'express';
import request from 'axios';
import jwt from "jwt-simple";
const router = express.Router();


router.post('/', (req, res) => {

    let payload = {
        jti: 'manager',
        iat: Date.now(),
        exp: Date.now() + 86400000 * 3,
    };

    let auth = jwt.encode(payload, global.gConfig.serverKey.secretKey);

    request({
        method: 'get',
        url: global.gConfig.apiBaseUrl + '/manage/userDetail?id=' + req.body.para,
        headers: {
            'Authorization': auth,
            'Apikey': global.gConfig.serverKey.apiKey
        }
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
});

export { router as serviceEvent }