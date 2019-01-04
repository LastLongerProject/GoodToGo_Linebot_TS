import * as express from 'express';
import { getUserDetail } from '../lib/tool';
import { RichmenuType } from "../lib/enumManager";
import { switchRichmenu } from '../lib/richMenuScript';
const router = express.Router();
const richMenu = require('../lib/richMenuScript');
const logFactory = require('../lib/logFactory')('linebot:webhook/serviceEvent');

router.post('/', async (req, res) => {
    let result = await getUserDetail(req.body.para);
    if (result) {
        return switchRichmenu(result.usingAmount + result.lostAmount, result.lineToken);
    }

    logFactory.error(result);
});



export { router as serviceEvent }

