import * as express from 'express';
import { getUserDetail } from '../lib/tool';
import { switchRichmenu } from '../lib/richMenuScript';
const router = express.Router();
const logFactory = require('../lib/logFactory')('linebot:webhook/serviceEvent');

router.post('/', async (req, res) => {
    try {
        console.log(res.status(200));
        let result = await getUserDetail(req.body.para);
        res.status(200);
        if (result) {
            return switchRichmenu(result.usingAmount + result.lostAmount, result.lineToken);
        }
    } catch (err) {
        logFactory.error(err);
        res.status(404);
    }
});



export { router as serviceEvent }

