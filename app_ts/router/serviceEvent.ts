import * as express from 'express';
import { getUserDetail } from '../lib/tool';
import { switchRichmenu } from '../lib/richMenuScript';
const router = express.Router();
const logFactory = require('../lib/logFactory')('linebot:webhook/serviceEvent');

router.post('/', (req, res, next) => {
    res.status(200);

    getUserDetail(req.body.para)
        .then(result => switchRichmenu(result.usingAmount + result.lostAmount, result.lineToken))
        .catch(err => logFactory.error("err"));
});

export { router as serviceEvent }

