import * as express from 'express';
import { GetUserDetail } from '../lib/enumManager';
import { getUserDetail } from '../lib/tool';
const router = express.Router();
const logFactory = require('../lib/logFactory')('linebot:webhook/serviceEvent');

router.post('/', async (req, res) => {
    let result = await getUserDetail(req.body.para);
    if (result === GetUserDetail.SUCCESS)
        return res.status(200);
    logFactory.error(result);
    res.status(404).json({
        message: 'Get userDetail failed from linebot'
    });

});

export { router as serviceEvent }

