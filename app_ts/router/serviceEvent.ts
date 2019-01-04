import * as express from 'express';
import { getUserDetail } from '../lib/tool';
import { switchRichmenu } from '../lib/richMenuScript';
const router = express.Router();
const logFactory = require('../lib/logFactory')('linebot:webhook/serviceEvent');

router.post('/', async (req, res) => {
    res.status(200);

    try {
        let result = await getUserDetail(req.body.para);
        if (result) {
            return switchRichmenu(result.usingAmount + result.lostAmount, result.lineToken);
        }
    } catch (err) {
        logFactory.error(err);
        res.status(404);
    }
});


function getip(req) {
    return req.headers["x-real-ip"] ||
        req.ip ||
        req._remoteAddress ||
        (req.connection && req.connection.remoteAddress) ||
        undefined
}
export { router as serviceEvent }

